import tkinter as tk
from tkinter import messagebox, filedialog
import os
import winreg

def find_files(filename, parent_folder):
    drives = ["{}:".format(chr(drive)) for drive in range(65, 91) if os.path.exists("{}:".format(chr(drive)))]
    found_files = []
    for drive in drives:
        for root, dirs, files in os.walk(drive):
            if parent_folder in dirs:
                parent_folder_path = os.path.join(root, parent_folder)
                for file in os.listdir(parent_folder_path):
                    if file == filename:
                        file_path = os.path.join(parent_folder_path, file)
                        file_path = os.path.normpath(file_path)
                        found_files.append(file_path)
    return found_files

def set_registry_value(key_path, value_name, value_data):
    try:
        # Open the specified registry key with write access
        reg_key = winreg.CreateKey(winreg.HKEY_USERS, key_path)

        # Set the string value
        winreg.SetValueEx(reg_key, value_name, 0, winreg.REG_SZ, value_data)

        # Close the registry key
        winreg.CloseKey(reg_key)

        output(f"Registry value '{value_name}' set successfully.")
    except Exception as e:
        output(f"Error setting registry value: {e}")

def find_and_set():
    filename = "aion.bin"
    parent_folder = "bin64"
    file_paths = find_files(filename, parent_folder)
    if file_paths:
        output("File found at the following locations:")
        for path in file_paths:
            path_with_backslash = path.replace(":", ":\\")
            output(path_with_backslash)
            key_path = r".DEFAULT\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
            value_name = path_with_backslash
            value_data = "~ Win7RTM"
            set_registry_value(key_path, value_name, value_data)
    else:
        output("File not found.")

# Function to write to the Text widget
def output(message):
    output_text.insert(tk.END, message + "\n")
    output_text.see(tk.END)  # Scroll to the end

def button_click():
    # Clear the current contents of the Text widget
    output_text.delete(1.0, tk.END)
    
    # Check if the "Browse Path" tickbox is checked
    if browse_var.get():
        # Open a file dialog to select the file path
        file_path = filedialog.askopenfilename(
                title="Look for aion.bin",
                filetypes=[("Aion Binaries", "*.bin")]
            )
        if file_path:
            # If a file path is selected, update the file path entry
            file_path = os.path.normpath(file_path)
            file_path_entry.config(state=tk.NORMAL)
            file_path_entry.delete(0, tk.END)
            file_path_entry.insert(tk.END, file_path)
            file_path_entry.config(state=tk.DISABLED)
        key_path = ".DEFAULT\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
        value_data = "~ Win8RTM Win7RTM"
        set_registry_value(key_path, file_path, value_data)
    else:
        # Display a warning message
        confirm = messagebox.askokcancel("Warning", "The app will get stuck for a while, but this happens because it's searching on the whole system for aion.bin.\nDo you want to continue?")
        if confirm:
            # Perform the file search and registry value setting
            find_and_set()

def update_button_text():
    if browse_var.get():
        button.config(text="Select Aion Binary file")
    else:
        button.config(text="Solve my Aion client issues")

# Create Tkinter window
window = tk.Tk()
window.title("Aion client launch fixer")

# Create a Text widget to display output
output_text = tk.Text(window, height=10, width=40)
output_text.pack(padx=10, pady=10)

# Create an entry widget to display selected file path
file_path_entry = tk.Entry(window, width=40)
file_path_entry.pack(pady=5)
file_path_entry.config(state=tk.DISABLED)

# Create a tickbox to enable browsing for file path
browse_var = tk.BooleanVar()
browse_check = tk.Checkbutton(window, text="I know the aion.bin file path", variable=browse_var, command=update_button_text)
browse_check.pack()

# Create a button to trigger the action
button = tk.Button(window, text="Solve my aion client issues", command=button_click)
button.pack(pady=10)

# Run the Tkinter event loop
window.mainloop()
