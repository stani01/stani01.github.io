import os
import sys
import time
import threading

import psutil
import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
from tkinter import font

import win32api
import win32con
import win32event
import win32gui
import win32process
import winerror

# Global flag to control script execution
continue_script = True

# Prevent multiple instances
mutex_name = "KeepAionAlive_Mutex"
mutex = win32event.CreateMutex(None, False, mutex_name)

# Check if another instance is already running
if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
    messagebox.showerror("Error", "The app is already running!")
    sys.exit()

def send_keyboard_signals(hwnd, key):
    if key == 'TAB':
        virtual_key = win32con.VK_TAB
    elif key == 'SPACE':
        virtual_key = win32con.VK_SPACE
    else:
        virtual_key = ord(key)
    
    win32api.PostMessage(hwnd, win32con.WM_KEYDOWN, virtual_key, 0)
    win32api.PostMessage(hwnd, win32con.WM_KEYUP, virtual_key, 0)

def refresh_process_list():
    """Refresh the list of available processes and sort them by name."""
    global process_list
    process_list = sorted(
        [f"{proc.info['name']} (PID: {proc.info['pid']})" for proc in psutil.process_iter(attrs=['pid', 'name']) if proc.info['name']],
        key=lambda x: x.split(" (PID: ")[0].lower()  # Sort by process name (case-insensitive)
    )

    # Refresh listbox with available processes
    process_listbox.delete(0, tk.END)
    for proc_entry in process_list:
        process_listbox.insert(tk.END, proc_entry)

    # Auto select aion.bin processes in listbox when required
    aion_indices = [i for i, proc in enumerate(process_list) if "aion.bin" in proc.lower()]
    if auto_all_var.get():
        process_listbox.config(state='disabled')
        for idx in aion_indices:
            process_listbox.selection_set(idx)
    else:
        process_listbox.config(state='normal')

    # Update the message window
    message_window.configure(state="normal")
    message_window.delete(1.0, tk.END)
    message_window.insert(tk.END, "Process list refreshed and sorted by name.\n")
    if aion_indices:
        message_window.insert(tk.END, f"{len(aion_indices)} 'aion.bin' process(es) found and ready.\n")
    else:
        message_window.insert(tk.END, "No 'aion.bin' process found.\n")

    message_window.configure(state="disabled")

# Filter processes by name
def filter_process_list():
    """Filter the process list by the name entered in the filter textbox."""
    filter_text = filter_entry.get().strip().lower()
    if not filter_text:
        messagebox.showerror("Error", "Please enter a process name to filter.")
        return

    global process_list
    process_list = sorted(
        [f"{proc.info['name']} (PID: {proc.info['pid']})" for proc in psutil.process_iter(attrs=['pid', 'name']) if filter_text in proc.info['name'].lower()],
        key=lambda x: x.split(" (PID: ")[0].lower()  # Sort by process name (case-insensitive)
    )
    process_listbox.delete(0, tk.END)
    for proc_entry in process_list:
        process_listbox.insert(tk.END, proc_entry)

    message_window.configure(state="normal")
    message_window.delete(1.0, tk.END)
    if process_list:
        message_window.insert(tk.END, f"Filtered processes containing '{filter_text}' and sorted by name.\n")
    else:
        message_window.insert(tk.END, f"No processes found containing '{filter_text}'.\n")
    message_window.configure(state="disabled")

# Thread-safe function to update the message window
def update_message_window(message):
    def update():
        message_window.configure(state="normal")
        message_window.delete(1.0, tk.END)
        message_window.insert(tk.END, message)
        message_window.configure(state="disabled")
    root.after(0, update)

# Updated run_script function with thread safety
def get_target_pids():
    """Return PIDs based on current selection mode."""
    if auto_all_var.get():
        return [
            proc.info['pid']
            for proc in psutil.process_iter(attrs=['pid', 'name'])
            if proc.info['name'] and proc.info['name'].lower() == 'aion.bin'
        ]

    selected_items = [process_listbox.get(i) for i in process_listbox.curselection()]
    pids = []
    for item in selected_items:
        try:
            pids.append(int(item.split('PID: ')[1].strip(')')))
        except Exception:
            pass
    return pids


def run_script(num_iterations, delay_between_iterations, key):
    def rebuild_hwnds():
        """Rebuild the hwnds list based on all aion.bin processes."""
        nonlocal hwnds
        hwnds = []
        processes = get_target_pids()

        def win_enum_handler(hwnd, _):
            _, pid = win32process.GetWindowThreadProcessId(hwnd)
            if pid in processes:
                hwnds.append(hwnd)

        win32gui.EnumWindows(win_enum_handler, None)

    # Initialize hwnds
    hwnds = []
    rebuild_hwnds()

    if not hwnds:
        update_message_window("No matching windows found for the selected processes.")
        return

    try:
        update_message_window("Script running... Press 'Stop' to stop.\n")

        if num_iterations == 0:
            while continue_script:
                # Dynamically update the list of processes based on checkbox states
                rebuild_hwnds()

                for hwnd in hwnds:
                    send_keyboard_signals(hwnd, key)
                time.sleep(delay_between_iterations)
        else:
            for _ in range(num_iterations):
                if not continue_script:
                    break

                # Dynamically update the list of processes based on checkbox states
                rebuild_hwnds()

                for hwnd in hwnds:
                    send_keyboard_signals(hwnd, key)
                time.sleep(delay_between_iterations)

        update_message_window("Script stopped successfully!\n")
    except KeyboardInterrupt:
        update_message_window("\nScript execution canceled.\n")

def run_script_from_input():
    global continue_script
    continue_script = True

    num_iterations = iteration_entry.get()
    delay_between_iterations = delay_entry.get()
    key = key_entry.get().upper()

    if not num_iterations.isdigit():
        messagebox.showerror("Error", "Number of iterations must be an integer.")
        return
    try:
        float(delay_between_iterations)
    except ValueError:
        messagebox.showerror("Error", "Delay must be a valid number.")
        return
    if key not in {'TAB', 'SPACE'} and (len(key) != 1 or not key.isalpha()):
        messagebox.showerror("Error", "Key must be a single letter, TAB, or SPACE.")
        return

    # Check if there is at least one aion.bin process
    if not get_target_pids():
        messagebox.showerror("Error", "No 'aion.bin' process is currently running.")
        return

    threading.Thread(target=run_script, args=(int(num_iterations), float(delay_between_iterations), key), daemon=True).start()

def stop_script():
    global continue_script
    continue_script = False

# Initialize the process list
process_list = []

# Apply a modern theme
root = tk.Tk()
root.withdraw()  # Hide the root window

style = ttk.Style()
style.theme_use("clam")  # Use the 'clam' theme

# Define dark theme colors
dark_bg = "#1e1e1e"  # Dark background
dark_fg = "#d4d4d4"  # Light foreground (text color)
accent_color = "#5a5a5a"  # Accent color (for buttons and highlights)
button_hover = "#5a5a5a"  # Neutral grey for hover effects

# Create a Toplevel window
main_window = tk.Toplevel(root)  # Attach the Toplevel to the root
main_window.title("Keep Alive")
main_window.configure(bg=dark_bg)
main_window.overrideredirect(True)  # Removes the default title bar

def close_window():
    main_window.destroy()
    sys.exit()

# Add minimize and close buttons
def minimize_window():
    hwnd = win32gui.GetForegroundWindow()  # Get the handle of the current window
    win32gui.ShowWindow(hwnd, win32con.SW_MINIMIZE)  # Minimize the window
    main_window.overrideredirect(False)  # Removes the default title bar

main_window.protocol("WM_DELETE_WINDOW", close_window)  # Handle close button

# Create a custom title bar
title_bar = tk.Frame(main_window, bg=dark_bg, relief="raised", bd=0, height=30)
title_bar.grid(row=0, column=0, columnspan=3, sticky="ew")

# Add column weight to push buttons to the right
title_bar.columnconfigure(0, weight=1)

# Add a title label
title_label = tk.Label(title_bar, text="Keep Alive", bg=dark_bg, fg=dark_fg, font=("Segoe UI", 10, "bold"))
title_label.grid(row=0, column=0, padx=10, sticky="w")

minimize_button = tk.Button(
    title_bar, text="_", bg=dark_bg, fg=dark_fg, font=("Segoe UI", 10, "bold"),
    relief="flat", command=minimize_window, width=3,
    activebackground=accent_color, activeforeground=dark_fg
)
minimize_button.grid(row=0, column=1, padx=5, sticky="e")

close_button = tk.Button(
    title_bar, text="X", bg=dark_bg, fg=dark_fg, font=("Segoe UI", 10, "bold"),
    relief="flat", command=close_window, width=3,
    activebackground=accent_color, activeforeground=dark_fg
)
close_button.grid(row=0, column=2, padx=5, sticky="e")

# Ensure the app appears in the taskbar
root.iconbitmap("E:\\AionTools\\keyspam\\heartbeat.png")  # Replace "heartbeat.ico" with the path to your app's icon
main_window.wm_attributes("-toolwindow", False)  # Ensure it behaves like a normal window

# Enable dragging for the custom title bar
def start_drag(event):
    main_window.x = event.x
    main_window.y = event.y

def drag_window(event):
    x = main_window.winfo_pointerx() - main_window.x
    y = main_window.winfo_pointery() - main_window.y
    main_window.geometry(f"+{x}+{y}")

title_bar.bind("<Button-1>", start_drag)
title_bar.bind("<B1-Motion>", drag_window)

# Set global styles
main_window.configure(bg=dark_bg)
style.configure("TLabel", background=dark_bg, foreground=dark_fg)
style.configure("TButton", background=dark_bg, foreground=dark_fg, borderwidth=1, relief="solid", padding=6)
style.configure("TEntry", fieldbackground=dark_bg, foreground=dark_fg, insertcolor=dark_fg, bordercolor=dark_fg)
style.configure("TCheckbutton", background=dark_bg, foreground=dark_fg)
style.configure("TCombobox", fieldbackground=dark_bg, foreground=dark_fg, background=dark_bg, borderwidth=0)
style.configure("TLabelframe", background=dark_bg, foreground=dark_fg, borderwidth=1, relief="solid")
style.configure("TLabelframe.Label", background=dark_bg, foreground=dark_fg)
style.configure("TFrame", background=dark_bg)
style.configure("TText", background=dark_bg, foreground=dark_fg, borderwidth=1, relief="solid")

# Add hover effects for Checkbuttons
style.map(
    "TCheckbutton",
    background=[("active", button_hover), ("pressed", button_hover)],
    foreground=[("active", dark_fg), ("pressed", dark_fg)],
)
# Configure the TCombobox style for dark mode
style.configure(
    "TCombobox",
    fieldbackground=dark_bg,  # Background of the text entry area
    foreground=dark_fg,       # Text color
    background=dark_bg,       # Background of the dropdown menu
    bordercolor=dark_fg,      # Border color
    arrowcolor=dark_fg        # Arrow color (set to gray)
)

# Map hover and active states for the dropdown menu
style.map(
    "TCombobox",
    fieldbackground=[("readonly", dark_bg), ("!disabled", dark_bg), ("active", dark_bg)],
    background=[("active", dark_bg), ("!disabled", dark_bg)],
    foreground=[("readonly", dark_fg), ("!disabled", dark_fg)],
    arrowcolor=[("active", dark_fg), ("!disabled", dark_fg)],
    bordercolor=[("focus", accent_color), ("!disabled", dark_fg)]
)

style.configure(
    "TButton",
    background="#3e3e3e",       # Fundalul butonului
    foreground=dark_fg,       # Culoarea textului
    borderwidth=2,            # Grosimea conturului
    relief="solid",           # Stilul conturului (solid)
    padding=6                 # Spațierea interioară
)

# Add hover and click effects for buttons
style.map(
    "TButton",
    background=[
        ("active", button_hover),  # Background when hovered
        ("pressed", "#3e3e3e")     # Darker background when clicked
    ],
    foreground=[
        ("active", dark_bg),       # Text color when hovered
        ("pressed", dark_fg)       # Text color when clicked
    ],
    relief=[
        ("pressed", "sunken"),     # Sunken effect when clicked
        ("!pressed", "flat")       # Flat effect when not clicked
    ]
)


# Key input
key_frame = ttk.LabelFrame(main_window, text="Key Settings", padding=(10, 10))
key_frame.grid(row=1, column=0, columnspan=3, padx=10, pady=10, sticky="ew")

ttk.Label(key_frame, text="Key to be pressed:").grid(row=0, column=0, sticky="w", padx=5, pady=5)
key_entry = ttk.Entry(key_frame, width=30)
key_entry.insert(0, "c")
key_entry.grid(row=0, column=1, sticky="w", padx=5, pady=5)

ttk.Label(key_frame, text="Number of iterations (0 for infinite):").grid(row=1, column=0, sticky="w", padx=5, pady=5)
iteration_entry = ttk.Entry(key_frame, width=30)
iteration_entry.insert(0, "0")
iteration_entry.grid(row=1, column=1, sticky="w", padx=5, pady=5)

ttk.Label(key_frame, text="Delay between iterations (seconds):").grid(row=2, column=0, sticky="w", padx=5, pady=5)
delay_entry = ttk.Entry(key_frame, width=30)
delay_entry.insert(0, "2")
delay_entry.grid(row=2, column=1, sticky="w", padx=5, pady=5)

# Process selection
process_frame = ttk.LabelFrame(main_window, text="Aion Process Selector", padding=(10, 10))
process_frame.grid(row=2, column=0, columnspan=3, padx=10, pady=10, sticky="ew")

auto_all_var = tk.BooleanVar(value=True)

ttk.Checkbutton(process_frame, text="Auto-target all aion.bin processes", variable=auto_all_var, style="TCheckbutton").grid(row=0, column=0, columnspan=2, sticky="w", padx=5, pady=5)

ttk.Label(process_frame, text="Available processes:").grid(row=1, column=0, sticky="w", padx=5, pady=5)
process_listbox = tk.Listbox(process_frame, selectmode=tk.MULTIPLE, width=70, height=6, bg=dark_bg, fg=dark_fg, selectbackground="#5a5a5a", selectforeground=dark_fg, highlightthickness=1, borderwidth=1)
process_listbox.grid(row=2, column=0, columnspan=3, sticky="ew", padx=5, pady=5)

def select_all_aion():
    process_listbox.selection_clear(0, tk.END)
    for i, item in enumerate(process_list):
        if 'aion.bin' in item.lower():
            process_listbox.selection_set(i)

ttk.Button(process_frame, text="Select all aion.bin", command=select_all_aion).grid(row=3, column=0, sticky="w", padx=5, pady=5)

ttk.Button(process_frame, text="Clear selection", command=lambda: process_listbox.selection_clear(0, tk.END)).grid(row=3, column=1, sticky="w", padx=5, pady=5)

def toggle_auto_all(*args):
    if auto_all_var.get():
        process_listbox.config(state='disabled')
    else:
        process_listbox.config(state='normal')

# Enable this to allow listbox selection when not in auto mode
auto_all_var.trace_add('write', toggle_auto_all)

# Filter and refresh
filter_frame = ttk.LabelFrame(main_window, text="Filter and Refresh", padding=(10, 10)) 
filter_frame.grid(row=3, column=0, columnspan=3, padx=10, pady=10, sticky="ew")

ttk.Label(filter_frame, text="Filter processes by name:").grid(row=0, column=0, sticky="w", padx=5, pady=5)
filter_entry = ttk.Entry(filter_frame, width=30)
filter_entry.grid(row=0, column=1, sticky="w", padx=5, pady=5)
ttk.Button(filter_frame, text="Filter", command=filter_process_list).grid(row=0, column=2, sticky="w", padx=5, pady=5)

ttk.Button(filter_frame, text="Refresh Processes", command=refresh_process_list).grid(row=1, column=0)


# Run and Stop buttons
control_frame = ttk.Frame(main_window, padding=(10, 10))
control_frame.configure(style="TLabelframe")  # Apply dark background style
control_frame.grid(row=4, column=0, columnspan=3, padx=10, pady=10, sticky="ew")

ttk.Button(control_frame, text="Run", command=run_script_from_input).grid(row=0, column=0, padx=5, pady=5, sticky="ew")
ttk.Button(control_frame, text="Stop", command=stop_script).grid(row=0, column=1, padx=5, pady=5, sticky="ew")

# Configure the grid to center the buttons
control_frame.columnconfigure(0, weight=1)
control_frame.columnconfigure(1, weight=1)

# Message window
message_frame = ttk.LabelFrame(main_window, text="Messages", padding=(10, 10)) 
message_frame.grid(row=5, column=0, columnspan=3, padx=10, pady=10, sticky="ew")

message_window = tk.Text(message_frame, height=5, width=60, wrap="word", bg=dark_bg, fg=dark_fg, insertbackground=dark_fg)
message_window.grid(row=0, column=0, sticky="ew", padx=5, pady=5)
message_window.configure(state="disabled")

# Populate the process list on startup
refresh_process_list()

def monitor_window_state():
    hwnd = win32gui.FindWindow(None, "Keep Alive")
    if hwnd:
        if win32gui.IsIconic(hwnd):  # Check if the window is minimized
            main_window.overrideredirect(False)  # Disable custom title bar when minimized
        else:
            main_window.overrideredirect(True)  # Re-enable custom title bar when restored
    main_window.after(10, monitor_window_state)  # Schedule the next check

# Start monitoring window state and enter the main loop
monitor_window_state()

main_window.mainloop()
