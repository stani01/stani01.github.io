import win32api
import win32con
import win32gui
import time
import tkinter as tk
from tkinter import messagebox
import threading

# Global flag to control script execution
continue_script = True

def send_keyboard_signals(hwnd, key):
    # Get the virtual key code for the specified key
    virtual_key = ord(key)

    # Post the WM_KEYDOWN and WM_KEYUP messages to simulate pressing the specified key
    win32api.PostMessage(hwnd, win32con.WM_KEYDOWN, virtual_key, 0)
    win32api.PostMessage(hwnd, win32con.WM_KEYUP, virtual_key, 0)

def run_script(num_iterations, delay_between_iterations, key):
    global continue_script

    # Find the window with the title "AION" within a maximum timeout of 10 seconds
    timeout = time.time() + 10  # Maximum timeout of 10 seconds
    hwnd = None
    windows = []

    while hwnd is None and time.time() < timeout:
        windows.clear()

        def win_enum_handler(hwnd, windows):
            if win32gui.IsWindowVisible(hwnd):
                windows.append((hwnd, win32gui.GetWindowText(hwnd)))

        win32gui.EnumWindows(win_enum_handler, windows)

        if any("AION" in title or "AION Client (64bit)" in title or "AION Client" in title for _, title in windows):
            hwnd = next(hwnd for hwnd, title in windows if "AION" in title or "AION Client (64bit)" in title or "AION Client" in title)
            break


    if hwnd is None:
        # Clear the current contents of the message window
        message_window.delete(1.0, tk.END)
        message_window.insert(tk.END, "Window with title 'AION' not found. Exiting.\n")
        return

    # Send keyboard signals periodically
    try:
        if num_iterations == 0:
            # Clear the current contents of the message window
            message_window.delete(1.0, tk.END)
            message_window.insert(tk.END, "Script running...\nPress 'Stop' to stop the script.\n")
            while continue_script:
                send_keyboard_signals(hwnd, key)
                time.sleep(delay_between_iterations)
        else:
            for _ in range(num_iterations):
                if not continue_script:
                    break
                send_keyboard_signals(hwnd, key)
                time.sleep(delay_between_iterations)

        # Clear the current contents of the message window
        message_window.delete(1.0, tk.END)
        message_window.insert(tk.END, "Script stopped successfully!\n")
    except KeyboardInterrupt:
        # Clear the current contents of the message window
        message_window.delete(1.0, tk.END)
        message_window.insert(tk.END, "\nScript execution canceled.\n")

def run_script_from_input():
    global continue_script
    continue_script = True
    num_iterations = iteration_entry.get()
    delay_between_iterations = delay_entry.get()
    key = key_entry.get().upper()  # Convert key to uppercase

    if not num_iterations.isdigit():
        messagebox.showerror("Error", "Number of iterations must be an integer.")
        return

    try:
        float(delay_between_iterations)
    except ValueError:
        messagebox.showerror("Error", "Delay between iterations must be an integer.")
        return

    if len(key) != 1 or not key.isalpha():
        messagebox.showerror("Error", "Key to be pressed must be a single letter.")
        return

    threading.Thread(target=run_script, args=(int(num_iterations), float(delay_between_iterations), key), daemon=True).start()


def stop_script():
    global continue_script
    continue_script = False

# Create the Tkinter application window
root = tk.Tk()
root.title("Keep Aion Alive")

# Create input fields for number of iterations, delay between iterations, and custom key
key_label = tk.Label(root, text="Key to be pressed:")
key_label.grid(row=0, column=0)
key_entry = tk.Entry(root)
key_entry.insert(0, "c")
key_entry.grid(row=0, column=1)

iteration_label = tk.Label(root, text="Number of iterations (0 for infinite):")
iteration_label.grid(row=1, column=0)
iteration_entry = tk.Entry(root)
iteration_entry.insert(0, "0")
iteration_entry.grid(row=1, column=1)

delay_label = tk.Label(root, text="Delay between iterations (in seconds):")
delay_label.grid(row=2, column=0)
delay_entry = tk.Entry(root)
delay_entry.insert(0, "0.5")
delay_entry.grid(row=2, column=1)

# Create buttons to run or stop the script
run_button = tk.Button(root, text="Run", command=run_script_from_input)
run_button.grid(row=3, column=0, pady=5)  # Add vertical padding

stop_button = tk.Button(root, text="Stop", command=stop_script)
stop_button.grid(row=3, column=1, pady=5)  # Add vertical padding

# Create a message window to display output
message_window = tk.Text(root, height=3, width=40)
message_window.grid(row=4, columnspan=2, pady=5)  # Add vertical padding

# Run the Tkinter event loop
root.mainloop()
