import json
import keyboard
import os
import sys
import threading
import time
import tkinter as tk
import win32api
import win32con
import win32gui
from PIL import Image, ImageTk
from pynput.keyboard import Listener

import cv2
import numpy as np
import mss

class AionKeySpam:
    def __init__(self):
        # Load the configuration file
        self.config_path = os.path.join(os.path.abspath("."), "config.json")
        self.load_config()

        # Set up hotkey listener
        self.hotkey_listener()

        # "global" variables
        self.hwnds = []
        self.running_flag = False
        self.currently_pressed_key = None
        self.start_spamming = False
        self.minimized = False

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
                "x_coord": 0,
                "y_coord": 1410,
                "window_position": "+0+0"
            }
        # Load configurable variables from the configuration file
        self.keys_to_spam = self.config["keys_to_spam"]
        self.minimize_keybind = self.config["minimize_keybind"]
        self.toggle_keybind = self.config["toggle_start_stop_keybind"]
        self.image_detection = self.config["image_detection"]
        self.x_coord = self.config["x_coord"]
        self.y_coord = self.config["y_coord"]
        self.window_position = self.config["window_position"]

    def save_config(self):
        self.config["window_position"] = self.window.geometry()
        with open(self.config_path, 'w') as file:
            json.dump(self.config, file, indent=4)

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
        self.close_icon = self.load_image("close.png")
        self.toggle_on_icon = self.load_image("on.png")
        self.toggle_off_icon = self.load_image("off.png")

        # Add a button to move the window
        # Add a button with the icon to move the window
        move_button = tk.Button(self.window, image=self.move_icon, bg=self.dark_stuff, relief=tk.FLAT)
        move_button.pack(side='left', padx=0, pady=0)
        move_button.bind("<Button-1>", self.start_move)
        move_button.bind("<B1-Motion>", self.do_move)

        # Create a button and associate it with the close_app function
        close_button = tk.Button(self.window, image=self.close_icon, bg=self.dark_stuff, command=self.close_app, relief=tk.FLAT)
        close_button.pack(side='right', padx=0, pady=0)

        # Create a button and associate it with the turning on/off function
        self.toggle_button = tk.Button(self.window, image=self.toggle_off_icon, bg=self.dark_stuff, command=self.toggle_start_stop, relief=tk.FLAT)
        self.toggle_button.pack(padx=0, pady=5)

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
        self.window.overrideredirect(False)
        if self.minimized:
            self.window.deiconify()
            self.window.wm_attributes("-topmost", 1)
        else:
            self.window.wm_attributes("-topmost", 0)
            self.window.iconify()
        self.window.overrideredirect(True)
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
            #print("key : %s \n virtual_key: %s" % (key, virtual_key))
            if self.running_flag and key.char in self.keys_to_spam:
                self.currently_pressed_key = key.char
                self.start_spamming = True
                #print(f"Key pressed: {key.char}")
        except AttributeError:
            pass

    def on_release(self, key):
        try:
            if self.running_flag and key.char in self.keys_to_spam:
                self.currently_pressed_key = None
                self.start_spamming = False
                #print(f"Key released: {key.char}")
        except AttributeError:
            pass

    def start_script(self):
        # Look for AION window to be opened
        self.hwnds = self.find_aion_windows()
        if not self.hwnds:
            return
        self.running_flag = True
        self.toggle_button.config(image=self.toggle_on_icon)
        #print("Script started...")

        # Start the listener for keyboard events
        self.listener = Listener(on_press=self.on_press, on_release=self.on_release)
        self.listener.start()

    def stop_script(self):
        self.running_flag = False
        self.currently_pressed_key = None
        self.toggle_button.config(image=self.toggle_off_icon)
        #print("Script stopped...")
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
            if focused_hwnd in self.hwnds:
                self.send_keyboard_signals(focused_hwnd, self.currently_pressed_key)
        # Call start_spam again after a short delay
        self.window.after(10, self.start_spam)

    def send_keyboard_signals(self, hwnd, key):
        virtual_key = self.keys_to_spam.get(key)
        #print("key : %s \n virtual_key: %s" % (key, virtual_key))
        if not self.image_detection or (self.image_detection and not self.detect_chat_window(hwnd)):
            win32api.PostMessage(hwnd, win32con.WM_KEYDOWN, virtual_key, 0)
            win32api.PostMessage(hwnd, win32con.WM_KEYUP, virtual_key, 0)
    
    def detect_chat_window(self, hwnd):
        # Define the region to capture (x, y, width, height)
        region = (self.x_coord, self.y_coord, 35, 30)

        # Capture a screenshot of the game window
        screenshot = self.get_screenshot(hwnd, region)

        # Load template images
        base_path = sys._MEIPASS if getattr(sys, 'frozen', False) else os.path.abspath(".")
        image_path = os.path.join(base_path, "chat_box_template.png")
        chat_box_template = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

        # Perform template matching
        chat_box_result = cv2.matchTemplate(screenshot, chat_box_template, cv2.TM_CCOEFF_NORMED)

        # Set a threshold for template matching results
        threshold = 0.8

        # Check if the chat box is found
        chat_box_found = np.max(chat_box_result) >= threshold

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
