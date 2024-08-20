import json
import keyboard
import os
import sys
import threading
import time
import tkinter as tk
from tkinter import simpledialog, messagebox
import win32api
import win32con
import win32gui
from PIL import Image, ImageTk
from pynput.keyboard import Listener, KeyCode
import win32process
import psutil

import cv2
import numpy as np
import mss

# Define a set of valid keyboard keys
VALID_KEYS = {
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10',
    'f11', 'f12', 'enter', 'space', 'shift', 'ctrl', 'alt', 'tab',
    'backspace', 'capslock', 'esc', 'insert', 'delete', 'home', 'end',
    'pageup', 'pagedown', 'left', 'right', 'up', 'down', 'printscreen',
    'numlock', 'scrolllock', 'pause', 'menu', 'super', 'cmd'
}

class AionKeySpam:
    def __init__(self):
        # Load the configuration file
        self.config_path = os.path.join(os.path.abspath("."), "config.json")

        # temp, delete with new version
        if os.path.exists(self.config_path):
            with open(self.config_path, "r") as config_file:
                config = json.load(config_file)
        
            spam_delay = "spam_delay"
            spam_value = 10
            if spam_delay not in config:
                # Step 3: Add the new key-value pair to the configuration
                config["spam_delay"] = spam_value

                # update config with new option
                with open(self.config_path, "w") as config_file:
                    json.dump(config, config_file, indent=4)

        self.load_config()

        # Set up hotkey listener
        self.hotkey_listener()

        # "global" variables
        self.hwnds = []
        self.running_flag = False
        self.currently_pressed_key = None
        self.start_spamming = False
        self.minimized = False
        self.config_window = None
        self.config_window_flag = False

        self.setup_ui()

        # Add a thread for the spam function
        self.spam_thread = threading.Thread(target=self.start_spam, daemon=True)
        self.spam_thread.start()

        # Start a thread to continuously check the hotkey state
        self.check_hotkey_state_thread = threading.Thread(target=self.check_hotkey_state, daemon=True)
        self.check_hotkey_state_thread.start()

        # Initialize variables for debouncing
        self.last_toggle_time = time.time()
        self.debounce_interval = 0.2  # Adjust the debounce interval as needed

    def load_config(self):
        if os.path.exists(self.config_path):
            with open(self.config_path, "r") as config_file:
                self.config = json.load(config_file)
        else:
            # Set default configuration values if config file doesn't exist
            self.config = {
                "keys_to_spam": {
                    "1": 49,
                    "2": 50,
                    "3": 51,
                    "4": 52,
                    "5": 53,
                    "q": 81,
                    "e": 69,
                    "r": 82,
                    "f": 70,
                    "z": 90        
                },
                "minimize_keybind": "alt+[",
                "toggle_start_stop_keybind": "pause",
                "image_detection": True,
                "window_position": "150x40+0+0",
                "spam_delay": "10"
            }
        # Load configurable variables from the configuration file
        self.keys_to_spam = self.config["keys_to_spam"]
        self.minimize_keybind = self.config["minimize_keybind"]
        self.toggle_keybind = self.config["toggle_start_stop_keybind"]
        self.image_detection = self.config["image_detection"]
        self.window_position = self.config["window_position"]
        self.spam_delay = self.config["spam_delay"]
        self.new_width = 145  # New desired width
        # Split the window_position string into its components
        width_height, left_top = self.window_position.split("+", 1)
        width, height = width_height.split("x")
        # Update the width component
        width = str(self.new_width)
        # Reconstruct the window_position string
        self.window_position = f"{width}x{height}+{left_top}"


    def save_config(self):
        self.config["window_position"] = self.window.geometry()
        self.config["keys_to_spam"] = self.keys_to_spam
        with open(self.config_path, 'w') as file:
            json.dump(self.config, file, indent=4)
        
        self.load_config()

    def hotkey_listener(self):
        # Register hotkey for minimize/restore window
        keyboard.add_hotkey(self.minimize_keybind, self.minimize_restore_window)

    def setup_ui(self):
        # Initialize the tkinter window
        self.window = tk.Tk()
        self.window.title("Aion KeySpam")

        # Set the start position of the window
        self.window.geometry(self.window_position)

        # Set the window to be transparent
        self.window.wm_attributes('-alpha', 0.5)  # 0.0 is fully transparent, 1.0 is fully opaque

        # Remove the window decorations (title bar, borders, etc.) and set it always on top
        self.window.overrideredirect(True)
        self.window.wm_attributes("-topmost", 1)
        
        # Change the background color to grey
        self.dark_stuff = '#2b2c2f'
        self.window.configure(bg=self.dark_stuff)
        
        # Construct the full path to the PNG file and load icons
        self.move_icon = self.load_image("move.png")
        self.settings_icon = self.load_image("settings.png")
        self.close_icon = self.load_image("close.png")
        self.toggle_on_icon = self.load_image("on.png")
        self.toggle_off_icon = self.load_image("off.png")

        # Create a button to move the window
        self.move_button = tk.Button(self.window, image=self.move_icon, bg=self.dark_stuff, relief=tk.FLAT)
        self.move_button.pack(side='left', padx=0, pady=5)
        self.move_button.bind("<Button-1>", self.start_move)
        self.move_button.bind("<B1-Motion>", self.do_move)

        # Create a button and associate it with the turning on/off function
        self.toggle_button = tk.Button(self.window, image=self.toggle_off_icon, bg=self.dark_stuff, command=self.toggle_start_stop, relief=tk.FLAT)
        self.toggle_button.pack(side='left', padx=5, pady=5)

        # Create a button and associate it with the close_app function
        settings_button = tk.Button(self.window, image=self.settings_icon, bg=self.dark_stuff, command=self.open_config_window, relief=tk.FLAT)
        settings_button.pack(side='left', padx=5, pady=5)

        # Create a button and associate it with the close_app function
        close_button = tk.Button(self.window, image=self.close_icon, bg=self.dark_stuff, command=self.close_app, relief=tk.FLAT)
        close_button.pack(side='left', padx=5, pady=5)

    def on_config_window_close(self):
        self.config_window_flag = False
        self.config_window.destroy()
        self.config_window = None

    def open_config_window(self):
        # Create a new window for configuration
        if self.config_window:
            return
        self.config_window = tk.Toplevel(self.window)
        self.config_window.title("Keybind Configuration")
        self.config_window.protocol("WM_DELETE_WINDOW", self.on_config_window_close)
        self.config_window_flag = True

        frame_minimize = tk.Frame(self.config_window)
        frame_minimize.pack(anchor="w", pady=5, padx=10)

        frame_toggle_start_stop_keybind = tk.Frame(self.config_window)
        frame_toggle_start_stop_keybind.pack(anchor="w", pady=5, padx=10)

        frame_spam_delay = tk.Frame(self.config_window)
        frame_spam_delay.pack(anchor="w", pady=5, padx=10)

        frame_image_detection = tk.Frame(self.config_window)
        frame_image_detection.pack(anchor="w", pady=5, padx=10)

        frame_keys_to_spam = tk.Frame(self.config_window)
        frame_keys_to_spam.pack(anchor="w", pady=5, padx=10)     

        # Create a minimize_keybind label
        label_minimize = tk.Label(frame_minimize, text="minimize/restore keybind:")
        label_minimize.pack(side="left")
        
        # Create a toggle_start_stop_keybind label
        label_start_stop = tk.Label(frame_toggle_start_stop_keybind, text="Toggle start/stop keybind:")
        label_start_stop.pack(side="left")

        # Create a spam_delay label
        label_minimize = tk.Label(frame_spam_delay, text="spam delay (ms):")
        label_minimize.pack(side="left")

        # Create a StringVar to hold the text
        minimize_keybind_var = tk.StringVar()
        toggle_start_stop_var = tk.StringVar()
        spam_delay_var = tk.StringVar()

        # Example initialization of the variable (you can set it to any initial value)
        minimize_keybind_var.set(self.minimize_keybind)
        toggle_start_stop_var.set(self.toggle_keybind)
        spam_delay_var.set(self.spam_delay)

        # Create an entry widget for minimize
        entry_minimize = tk.Entry(frame_minimize, textvariable=minimize_keybind_var)
        entry_minimize.pack(side="left")
        entry_minimize.bind("<Return>", lambda event: self.update_minimize(minimize_keybind_var))

        #Create a button to update the minimize setting
        tk.Button(frame_minimize, text="Update", command=lambda: self.update_minimize(entry_minimize)).pack(side="left")
        
        # Create an entry widget for start/stop
        entry_start_stop = tk.Entry(frame_toggle_start_stop_keybind, textvariable=toggle_start_stop_var)
        entry_start_stop.pack(side="left")
        entry_start_stop.bind("<Return>", lambda event: self.update_start_stop(toggle_start_stop_var))

        #Create a button to update the start/stop setting
        tk.Button(frame_toggle_start_stop_keybind, text="Update", command=lambda: self.update_start_stop(toggle_start_stop_var)).pack(side="left")

        # Create an entry widget for spam_delay
        entry_spam_delay = tk.Entry(frame_spam_delay, textvariable=spam_delay_var)
        entry_spam_delay.pack(side="left")
        entry_spam_delay.bind("<Return>", lambda event: self.update_spam_delay(spam_delay_var))

        #Create a button to update the spam delay setting
        tk.Button(frame_spam_delay, text="Update", command=lambda: self.update_spam_delay(entry_spam_delay)).pack(side="left")

        # Create an image detection checkbox
        tk.Label(frame_image_detection, text="Enable image Detection:").pack(side="left")
        image_detection_var = tk.BooleanVar(value=self.image_detection)
        tk.Checkbutton(frame_image_detection, variable=image_detection_var).pack(side="left")

        # Create a button to update the image detection setting
        tk.Button(frame_image_detection, text="Update", command=lambda: self.update_image_detection(image_detection_var)).pack(side="left")

        # Create a new key label
        label_new_key = tk.Label(frame_keys_to_spam, text="Enter a new key:")
        label_new_key.pack(side="left")

        # Function to add new key when Enter key is pressed
        def add_config_entry(event=None):
            new_key = entry_new_key.get()
            ascii_code = ord(new_key)
            # Check if ascii_code is a numeric digit
            if ascii_code >= ord('0') and ascii_code <= ord('9'):
                # Use numeric value directly for virtual key codes of '0' to '9'
                virtual_key_code = ord('0') + (ascii_code - ord('0'))
            else:
                # For other characters, use MapVirtualKey with correct mapping type
                virtual_key_code = win32api.VkKeyScanEx(new_key, 0) & 0xFF

            if new_key and len(new_key) == 1 and new_key not in self.keys_to_spam:
                self.keys_to_spam[new_key] = virtual_key_code
                self.update_keys_listbox()
                self.save_config()
                entry_new_key.delete(0, tk.END)
            else:
                messagebox.showerror("Error", "Invalid or duplicate key.")

        # Create an entry widget to capture the new key
        entry_new_key = tk.Entry(frame_keys_to_spam)
        entry_new_key.pack(side="left")
        entry_new_key.bind("<Return>", add_config_entry)

        button_add_key = tk.Button(frame_keys_to_spam, text="Add New Key", command=add_config_entry)
        button_add_key.pack(side="left")

        # Listbox to display keys
        label_keys_list = tk.Label(self.config_window, text="Current Keys to Spam:")
        label_keys_list.pack(anchor="w", pady=5, padx=10)
        self.keys_listbox = tk.Listbox(self.config_window, width=20, height=len(self.keys_to_spam))
        self.keys_listbox.pack(anchor="w", pady=5, padx=10)
        self.update_keys_listbox()

        button_remove_key = tk.Button(self.config_window, text="Remove Selected Key", command=self.remove_selected_key)
        button_remove_key.pack(anchor="w", pady=5, padx=10)

    def update_keys_listbox(self):
        self.keys_listbox.delete(0, tk.END)
        for key in self.keys_to_spam:
            self.keys_listbox.insert(tk.END, key)
        self.keys_listbox.config(height=len(self.keys_to_spam))

    def remove_selected_key(self):
        selected_key_index = self.keys_listbox.curselection()
        if selected_key_index:
            selected_key = self.keys_listbox.get(selected_key_index)
            del self.keys_to_spam[selected_key]
            self.update_keys_listbox()
            self.save_config()

    def update_minimize(self, var):
        self.minimize_keybind = var.get()
        self.config["minimize_keybind"] = self.minimize_keybind
        self.save_config()

    def update_start_stop(self, var):
        if var.get() in VALID_KEYS:
            self.toggle_keybind = var.get()
            self.config["toggle_start_stop_keybind"] = self.toggle_keybind
            self.save_config()
        else:
            messagebox.showerror("Error", "Invalid or duplicate key.")
    
    def update_spam_delay(self, var):
        self.spam_delay = var.get()
        self.config["spam_delay"] = self.spam_delay
        self.save_config()

    def update_image_detection(self, var):
        self.image_detection = var.get()
        self.config["image_detection"] = self.image_detection
        self.save_config()

    def check_hotkey_state(self):
        while True:
            # Check if the hotkey is pressed and debounce it
            if keyboard.is_pressed(self.toggle_keybind):
                current_time = time.time()
                if current_time - self.last_toggle_time > self.debounce_interval:
                    self.toggle_start_stop()
                    self.last_toggle_time = current_time
            time.sleep(0.05)  # Adjust the sleep duration as needed

    def load_image(self, image_name):
        base_path = sys._MEIPASS if getattr(sys, 'frozen', False) else os.path.abspath(".")
        image_path = os.path.join(base_path, image_name)
        image = Image.open(image_path)
        resized_image = image.resize((25, 25), Image.LANCZOS)
        return ImageTk.PhotoImage(resized_image)
    
    def start_move(self, event):
        global x, y
        x = event.x
        y = event.y

    def do_move(self, event):
        global x, y
        deltax = event.x - x
        deltay = event.y - y
        self.window.geometry(f"+{self.window.winfo_x() + deltax}+{self.window.winfo_y() + deltay}")
    
    def close_app(self):
        self.save_config()
        # Destroy the window
        self.window.destroy()

    def minimize_restore_window(self):
        if self.minimized:
            self.window.deiconify()
            self.window.overrideredirect(True)
        else:
            self.window.overrideredirect(False)
            self.window.withdraw()

            self.window.overrideredirect(True)
        time.sleep(0.05)
        self.minimized = not self.minimized

    def find_aion_windows(self):
        windows = []
        def win_enum_handler(hwnd, windows):
            if win32gui.IsWindowVisible(hwnd):
                windows.append((hwnd, win32gui.GetWindowText(hwnd)))
        win32gui.EnumWindows(win_enum_handler, windows)
        return [hwnd for hwnd, title in windows if "AION" in title]

    def on_press(self, key):
        try:
            if self.running_flag and key.char in self.keys_to_spam:
                self.currently_pressed_key = key.char
                self.start_spamming = True
        except AttributeError:
            pass

    def on_release(self, key):
        try:
            if self.running_flag and key.char in self.keys_to_spam:
                self.currently_pressed_key = None
                self.start_spamming = False
        except AttributeError:
            pass

    def start_script(self):
        # Look for AION window to be opened
        self.hwnds = self.find_aion_windows()
        if not self.hwnds:
            return
        self.running_flag = True
        self.toggle_button.config(image=self.toggle_on_icon)

        # Start the listener for keyboard events
        self.listener = Listener(on_press=self.on_press, on_release=self.on_release)
        self.listener.start()

    def stop_script(self):
        self.running_flag = False
        self.currently_pressed_key = None
        self.toggle_button.config(image=self.toggle_off_icon)
        # Stop the listener
        self.listener.stop()

    def toggle_start_stop(self):
        if self.running_flag:
            self.stop_script()
        else:
            self.start_script()

    def start_spam(self):
        # If spam is started then start spamming
        if self.running_flag and self.start_spamming and self.currently_pressed_key is not None:
            focused_hwnd = win32gui.GetForegroundWindow()
            thread_id, pid = win32process.GetWindowThreadProcessId(focused_hwnd)
            process = psutil.Process(pid)
            process_name = process.name()
            if process_name == "aion.bin" or process_name == "Aion.bin":
                self.send_keyboard_signals(focused_hwnd, self.currently_pressed_key)
        # Call start_spam again after a short delay
        self.window.after(self.spam_delay, self.start_spam)

    def send_keyboard_signals(self, hwnd, key):
        virtual_key = self.keys_to_spam.get(key)
        if not self.image_detection or (self.image_detection and not self.detect_chat_window(hwnd)):
            win32api.PostMessage(hwnd, win32con.WM_KEYDOWN, virtual_key, 0)
            win32api.PostMessage(hwnd, win32con.WM_KEYUP, virtual_key, 0)

    def multi_scale_template_matching(self, screenshot, template, scales, threshold=0.8):
        best_value = -np.inf

        for scale in scales:
            resized_template = cv2.resize(template, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
            if resized_template.shape[0] <= screenshot.shape[0] and resized_template.shape[1] <= screenshot.shape[1]:
                result = cv2.matchTemplate(screenshot, resized_template, cv2.TM_CCOEFF_NORMED)
                _, max_val, _, _ = cv2.minMaxLoc(result)
                
                if max_val > best_value:
                    best_value = max_val

        return best_value

    def detect_chat_window(self, hwnd):
        window_title = win32gui.GetWindowText(hwnd)
        thread_id, pid = win32process.GetWindowThreadProcessId(hwnd)
        process = psutil.Process(pid)
        process_name = process.name()
        
        base_path = sys._MEIPASS if getattr(sys, 'frozen', False) else os.path.abspath(".")
        image_path2 = os.path.join(base_path, "chat_box_template_classic2.png")
        if "AION Game" in window_title and (process_name=="aion.bin" or process_name == "Aion.bin"):
            image_path = os.path.join(base_path, "chat_box_template_classic.png")
        elif process_name=="aion.bin":
            image_path = os.path.join(base_path, "chat_box_template.png")
        else:
            return True

        region = (0, 0, 55, 2160)
        screenshot = self.get_screenshot(hwnd, region)
        chat_box_template = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        chat_box_template2 = cv2.imread(image_path2, cv2.IMREAD_GRAYSCALE)

        scales = [0.5, 0.75, 1.0, 1.25, 1.5]
        match_value = self.multi_scale_template_matching(screenshot, chat_box_template, scales, threshold=0.9)
        if match_value < 0.9:
            match_value = self.multi_scale_template_matching(screenshot, chat_box_template2, scales, threshold=0.9)

        chat_box_found = match_value >= 0.9
        return chat_box_found

    def get_screenshot(self, hwnd, region=None):
        with mss.mss() as sct:
            rect = win32gui.GetWindowRect(hwnd)
            x, y, x1, y1 = rect
            width = x1 - x
            height = y1 - y

            if region:
                x, y, width, height = region

            monitor = {"top": y, "left": x, "width": width, "height": height}
            screenshot = sct.grab(monitor)
            img = np.array(screenshot)
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
            return gray_img

    def run(self):
        # Start the Tkinter event loop on the main thread
        self.window.mainloop()
    
if __name__ == "__main__":
    app = AionKeySpam()
    app.run()
