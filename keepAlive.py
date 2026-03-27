import ctypes
import sys
import threading
from pathlib import Path

import psutil
import win32api
import win32con
import win32event
import win32gui
import win32process
import winerror
from PyQt6.QtCore import QObject, QSettings, Qt, pyqtSignal
from PyQt6.QtGui import QFont, QIcon, QPixmap
from PyQt6.QtWidgets import (
    QApplication,
    QCheckBox,
    QDialog,
    QDialogButtonBox,
    QFrame,
    QGridLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

MUTEX_NAME = "KeepAionAlive_Mutex"
APP_ID = "stani01.keepalive"
DEFAULTS = {
    "key": "c",
    "iterations": "0",
    "delay": "2",
    "auto_target": True,
}


def set_windows_app_id() -> None:
    try:
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(APP_ID)
    except Exception:
        pass


def send_keyboard_signals(hwnd: int, key: str) -> None:
    if key == "TAB":
        virtual_key = win32con.VK_TAB
    elif key == "SPACE":
        virtual_key = win32con.VK_SPACE
    else:
        virtual_key = ord(key)

    win32api.PostMessage(hwnd, win32con.WM_KEYDOWN, virtual_key, 0)
    win32api.PostMessage(hwnd, win32con.WM_KEYUP, virtual_key, 0)


def find_all_processes():
    entries = []
    for proc in psutil.process_iter(attrs=["pid", "name"]):
        name = proc.info.get("name")
        pid = proc.info.get("pid")
        if not name:
            continue
        entries.append({"name": name, "pid": pid, "is_aion": name.lower() == "aion.bin"})
    return sorted(entries, key=lambda item: item["name"].lower())


def get_window_handles_for_pids(target_pids):
    """
    Return HWNDs to receive key messages for the given PIDs.
    Includes the top-level window (for games/fullscreen apps) and all visible
    child windows so keys reach inner controls like Notepad's Edit control.
    """
    target_pids_set = set(target_pids)
    hwnds = []

    def enum_top(hwnd, _):
        if not win32gui.IsWindowVisible(hwnd):
            return True
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        if pid not in target_pids_set:
            return True
        hwnds.append(hwnd)
        def enum_child(child, _):
            if win32gui.IsWindowVisible(child):
                hwnds.append(child)
            return True
        try:
            win32gui.EnumChildWindows(hwnd, enum_child, None)
        except Exception:
            pass
        return True

    win32gui.EnumWindows(enum_top, None)
    return hwnds


class KeepAliveWorker(QObject):
    log = pyqtSignal(str)
    finished = pyqtSignal()

    def __init__(self, target_pids_provider, iterations: int, delay_seconds: float, key: str):
        super().__init__()
        self.target_pids_provider = target_pids_provider
        self.iterations = iterations
        self.delay_seconds = delay_seconds
        self.key = key
        self.stop_event = threading.Event()

    def stop(self):
        self.stop_event.set()

    def run(self):
        self.log.emit("Running. Press Stop to end.")

        completed = 0
        while not self.stop_event.is_set():
            if self.iterations != 0 and completed >= self.iterations:
                break

            target_pids = self.target_pids_provider()
            if not target_pids:
                self.log.emit(
                    "No target process found. "
                    "In auto-target mode, start aion.bin first. "
                    "Or uncheck auto-target and select a process manually."
                )
                break

            hwnds = get_window_handles_for_pids(target_pids)
            if not hwnds:
                self.log.emit("No matching windows found for selected processes.")
                break

            for hwnd in hwnds:
                if self.stop_event.is_set():
                    break
                send_keyboard_signals(hwnd, self.key)

            completed += 1
            if self.delay_seconds > 0:
                self.stop_event.wait(self.delay_seconds)

        self.log.emit("Stopped.")
        self.finished.emit()


class SettingsDialog(QDialog):
    def __init__(self, current_defaults: dict, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Default Settings")
        self.setModal(True)
        self.setMinimumWidth(420)
        self.setObjectName("SettingsDialog")
        self.setStyleSheet(
            """
            QDialog#SettingsDialog {
                background-color: #131722;
                color: #e6eaf2;
            }
            QLabel {
                color: #c8d4ec;
                font-weight: 500;
            }
            QLineEdit {
                background-color: #0f131d;
                color: #ecf1fa;
                border: 1px solid #2f3b54;
                border-radius: 9px;
                padding: 8px;
            }
            QLineEdit:focus {
                border: 1px solid #4d79ff;
            }
            QPushButton {
                background-color: #253049;
                color: #ecf1fa;
                border: 1px solid #3b4e72;
                border-radius: 9px;
                padding: 8px 14px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #304063;
            }
            QCheckBox {
                spacing: 10px;
                color: #d6deee;
                font-weight: 500;
            }
            QCheckBox::indicator {
                width: 15px;
                height: 15px;
                border: 2px solid #3d4e70;
                border-radius: 4px;
                background: #0e131d;
            }
            QCheckBox::indicator:checked {
                background-color: #2a5bd4;
                border: 2px solid #4d79ff;
            }
            """
        )

        root = QVBoxLayout(self)

        form = QGridLayout()
        form.setHorizontalSpacing(12)
        form.setVerticalSpacing(10)

        self.key_input = QLineEdit(str(current_defaults.get("key", "c")))
        self.iterations_input = QLineEdit(str(current_defaults.get("iterations", "0")))
        self.delay_input = QLineEdit(str(current_defaults.get("delay", "2")))
        self.auto_target_input = QCheckBox("Auto-target all aion.bin on launch")
        self.auto_target_input.setChecked(bool(current_defaults.get("auto_target", True)))

        form.addWidget(QLabel("Default key"), 0, 0)
        form.addWidget(self.key_input, 0, 1)
        form.addWidget(QLabel("Default iterations"), 1, 0)
        form.addWidget(self.iterations_input, 1, 1)
        form.addWidget(QLabel("Default delay (seconds)"), 2, 0)
        form.addWidget(self.delay_input, 2, 1)
        form.addWidget(self.auto_target_input, 3, 0, 1, 2)

        buttons = QDialogButtonBox(QDialogButtonBox.StandardButton.Save | QDialogButtonBox.StandardButton.Cancel)
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)

        root.addLayout(form)
        root.addWidget(buttons)

    def to_defaults(self) -> dict:
        return {
            "key": self.key_input.text().strip(),
            "iterations": self.iterations_input.text().strip(),
            "delay": self.delay_input.text().strip(),
            "auto_target": self.auto_target_input.isChecked(),
        }


class KeepAliveWindow(QMainWindow):
    def __init__(self, icon_path: Path):
        super().__init__()
        self.icon_path = icon_path
        self.worker = None
        self.worker_thread = None
        self.process_entries = []
        self.defaults = self._load_defaults()

        self.setWindowTitle("Keep Alive")
        self.setMinimumSize(860, 620)

        if icon_path.exists():
            self.setWindowIcon(QIcon(str(icon_path)))

        self._build_ui()
        self._apply_theme()
        self.refresh_process_list()

    def _build_ui(self):
        root = QWidget()
        outer = QVBoxLayout(root)
        outer.setContentsMargins(20, 20, 20, 20)
        outer.setSpacing(16)

        # --- Header ---
        header = QFrame()
        header.setObjectName("HeaderCard")
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(18, 14, 18, 14)

        self.logo_label = QLabel()
        self.logo_label.setObjectName("LogoBadge")
        self.logo_label.setFixedSize(56, 56)
        self.logo_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        if self.icon_path.exists():
            pix = QPixmap(str(self.icon_path))
            if not pix.isNull():
                self.logo_label.setPixmap(
                    pix.scaled(44, 44, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
                )
        header_layout.addWidget(self.logo_label)

        title = QLabel("Keep Alive")
        title.setObjectName("Title")
        subtitle = QLabel("Stay Alive · Stay In-Game")
        subtitle.setObjectName("Subtitle")
        title_col = QVBoxLayout()
        title_col.setSpacing(2)
        title_col.addWidget(title)
        title_col.addWidget(subtitle)
        header_layout.addLayout(title_col)
        header_layout.addStretch(1)

        self.status_chip = QLabel("Idle")
        self.status_chip.setObjectName("StatusChipIdle")
        header_layout.addWidget(self.status_chip)

        # --- Settings ---
        settings_card = QFrame()
        settings_card.setObjectName("Card")
        settings_layout = QGridLayout(settings_card)
        settings_layout.setContentsMargins(16, 16, 16, 16)
        settings_layout.setHorizontalSpacing(12)
        settings_layout.setVerticalSpacing(10)

        self.key_input = QLineEdit(str(self.defaults.get("key", "c")))
        self.iterations_input = QLineEdit(str(self.defaults.get("iterations", "0")))
        self.delay_input = QLineEdit(str(self.defaults.get("delay", "2")))

        settings_layout.addWidget(QLabel("Key"), 0, 0)
        settings_layout.addWidget(self.key_input, 0, 1)
        settings_layout.addWidget(QLabel("Iterations (0 = infinite)"), 0, 2)
        settings_layout.addWidget(self.iterations_input, 0, 3)
        settings_layout.addWidget(QLabel("Delay (seconds)"), 0, 4)
        settings_layout.addWidget(self.delay_input, 0, 5)

        # --- Process list ---
        process_card = QFrame()
        process_card.setObjectName("Card")
        process_layout = QVBoxLayout(process_card)
        process_layout.setContentsMargins(16, 16, 16, 16)
        process_layout.setSpacing(10)

        mode_row = QHBoxLayout()
        self.auto_all = QCheckBox("Auto-target all aion.bin processes")
        self.auto_all.setChecked(bool(self.defaults.get("auto_target", True)))
        self.auto_all.toggled.connect(self.on_auto_toggle)
        mode_row.addWidget(self.auto_all)
        mode_row.addStretch(1)

        self.filter_input = QLineEdit()
        self.filter_input.setPlaceholderText("Filter process name...")

        self.filter_btn = QPushButton("Filter")
        self.filter_btn.clicked.connect(self.filter_process_list)
        self.refresh_btn = QPushButton("Refresh")
        self.refresh_btn.clicked.connect(self.refresh_process_list)
        self.select_all_btn = QPushButton("Select all aion.bin")
        self.select_all_btn.clicked.connect(self.select_all_aion)
        self.clear_sel_btn = QPushButton("Clear selection")
        self.clear_sel_btn.clicked.connect(self.clear_selection)

        row2 = QHBoxLayout()
        row2.addWidget(self.filter_input, 1)
        row2.addWidget(self.filter_btn)
        row2.addWidget(self.refresh_btn)
        row2.addWidget(self.select_all_btn)
        row2.addWidget(self.clear_sel_btn)

        self.process_list = QListWidget()
        self.process_list.setSelectionMode(QListWidget.SelectionMode.MultiSelection)

        process_layout.addLayout(mode_row)
        process_layout.addLayout(row2)
        process_layout.addWidget(self.process_list)

        # --- Controls ---
        control_card = QFrame()
        control_card.setObjectName("Card")
        control_layout = QHBoxLayout(control_card)
        control_layout.setContentsMargins(16, 16, 16, 16)

        self.run_btn = QPushButton("Run")
        self.run_btn.setObjectName("RunButton")
        self.run_btn.clicked.connect(self.run_script)

        self.stop_btn = QPushButton("Stop")
        self.stop_btn.clicked.connect(self.stop_script)
        self.stop_btn.setEnabled(False)

        self.settings_btn = QPushButton("Settings")
        self.settings_btn.setObjectName("SettingsButton")
        self.settings_btn.clicked.connect(self.open_settings)

        control_layout.addWidget(self.run_btn)
        control_layout.addWidget(self.stop_btn)
        control_layout.addStretch(1)
        control_layout.addWidget(self.settings_btn)

        # --- Log ---
        log_card = QFrame()
        log_card.setObjectName("Card")
        log_layout = QVBoxLayout(log_card)
        log_layout.setContentsMargins(16, 16, 16, 16)
        log_layout.setSpacing(8)
        log_layout.addWidget(QLabel("Messages"))
        self.log_box = QTextEdit()
        self.log_box.setReadOnly(True)
        self.log_box.setPlaceholderText("Activity logs will appear here...")
        log_layout.addWidget(self.log_box)

        outer.addWidget(header)
        outer.addWidget(settings_card)
        outer.addWidget(process_card, 1)
        outer.addWidget(control_card)
        outer.addWidget(log_card, 1)

        self.setCentralWidget(root)

    def _apply_theme(self):
        self.setFont(QFont("Segoe UI", 10))

        # Write a tiny checkmark SVG so Qt's image: url() can reference it
        check_svg_path = Path(__file__).resolve().parent / "_check_indicator.svg"
        check_svg_path.write_text(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
            '<polyline points="3,8.5 6.5,12 13,4" stroke="white" stroke-width="2.2" '
            'fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        )
        check_url = str(check_svg_path).replace("\\", "/")

        self.setStyleSheet(
            f"""
            QMainWindow {{
                background-color: #0f1115;
                color: #e6eaf2;
            }}
            QFrame#HeaderCard {{
                background-color: #131722;
                border: 1px solid #262d3f;
                border-radius: 12px;
            }}
            QFrame#Card {{
                background-color: #171c27;
                border: 1px solid #262d3f;
                border-radius: 12px;
            }}
            QLabel#Title {{
                font-size: 24px;
                font-weight: 700;
                color: #f1f5ff;
            }}
            QLabel#LogoBadge {{
                background-color: #0f131d;
                border: 1px solid #2f3b54;
                border-radius: 28px;
            }}
            QLabel#Subtitle {{
                color: #8f9db6;
                font-size: 12px;
            }}
            QLabel#StatusChipIdle {{
                background-color: #22293a;
                color: #a9b9d7;
                border: 1px solid #33405a;
                border-radius: 11px;
                padding: 4px 10px;
                font-weight: 600;
            }}
            QLabel#StatusChipRunning {{
                background-color: #133520;
                color: #92f2b0;
                border: 1px solid #1f6440;
                border-radius: 11px;
                padding: 4px 10px;
                font-weight: 600;
            }}
            QLineEdit, QListWidget, QTextEdit {{
                background-color: #0f131d;
                color: #ecf1fa;
                border: 1px solid #2f3b54;
                border-radius: 9px;
                padding: 8px;
                selection-background-color: #274fbe;
                selection-color: #ffffff;
            }}
            QLineEdit:focus, QListWidget:focus, QTextEdit:focus {{
                border: 1px solid #4d79ff;
            }}
            QPushButton {{
                background-color: #253049;
                color: #ecf1fa;
                border: 1px solid #3b4e72;
                border-radius: 9px;
                padding: 8px 14px;
                font-weight: 600;
            }}
            QPushButton:hover {{
                background-color: #304063;
            }}
            QPushButton:pressed {{
                background-color: #1e2a42;
            }}
            QPushButton#RunButton {{
                background-color: #1f4bb8;
                border: 1px solid #2f63df;
                color: #f7faff;
            }}
            QPushButton#RunButton:hover {{
                background-color: #2a5bd4;
            }}
            QPushButton#SettingsButton {{
                background-color: #18405a;
                border: 1px solid #27678f;
                color: #eaf7ff;
            }}
            QPushButton#SettingsButton:hover {{
                background-color: #1d5273;
            }}
            QPushButton:disabled {{
                background-color: #1a202d;
                color: #67768f;
                border: 1px solid #2a3447;
            }}
            QCheckBox {{
                spacing: 10px;
                color: #d6deee;
                font-weight: 500;
            }}
            QCheckBox::indicator {{
                width: 15px;
                height: 15px;
                border: 2px solid #3d4e70;
                border-radius: 4px;
                background: #0e131d;
            }}
            QCheckBox::indicator:hover {{
                border: 2px solid #6b87c4;
                background: #141a2a;
            }}
            QCheckBox::indicator:checked {{
                background-color: #2a5bd4;
                border: 2px solid #4d79ff;
                image: url({check_url});
            }}
            QLabel {{
                color: #c8d4ec;
            }}
            """
        )

    def _load_defaults(self) -> dict:
        defaults = dict(DEFAULTS)
        settings = QSettings("stani01", "KeepAlive")
        try:
            defaults["key"] = str(settings.value("defaults/key", defaults["key"]))
            defaults["iterations"] = str(settings.value("defaults/iterations", defaults["iterations"]))
            defaults["delay"] = str(settings.value("defaults/delay", defaults["delay"]))
            defaults["auto_target"] = bool(
                settings.value("defaults/auto_target", defaults["auto_target"], type=bool)
            )
        except Exception:
            pass
        return defaults

    def _save_defaults(self, defaults: dict) -> bool:
        key = str(defaults.get("key", "")).strip().upper()
        if key not in {"TAB", "SPACE"} and (len(key) != 1 or not key.isalpha()):
            QMessageBox.warning(self, "Validation", "Default key must be a single letter, TAB, or SPACE.")
            return False

        iterations_raw = str(defaults.get("iterations", "")).strip()
        if not iterations_raw.isdigit():
            QMessageBox.warning(self, "Validation", "Default iterations must be an integer.")
            return False

        delay_raw = str(defaults.get("delay", "")).strip()
        try:
            delay = float(delay_raw)
        except ValueError:
            QMessageBox.warning(self, "Validation", "Default delay must be a valid number.")
            return False
        if delay < 0:
            QMessageBox.warning(self, "Validation", "Default delay cannot be negative.")
            return False

        self.defaults = {
            "key": key,
            "iterations": iterations_raw,
            "delay": delay_raw,
            "auto_target": bool(defaults.get("auto_target", True)),
        }

        try:
            settings = QSettings("stani01", "KeepAlive")
            settings.setValue("defaults/key", self.defaults["key"])
            settings.setValue("defaults/iterations", self.defaults["iterations"])
            settings.setValue("defaults/delay", self.defaults["delay"])
            settings.setValue("defaults/auto_target", self.defaults["auto_target"])
            settings.sync()
        except Exception as exc:
            QMessageBox.warning(self, "Save failed", f"Could not save settings: {exc}")
            return False
        return True

    def open_settings(self):
        dialog = SettingsDialog(self.defaults, self)
        if dialog.exec() != QDialog.DialogCode.Accepted:
            return

        new_defaults = dialog.to_defaults()
        if not self._save_defaults(new_defaults):
            return

        self.key_input.setText(self.defaults["key"])
        self.iterations_input.setText(self.defaults["iterations"])
        self.delay_input.setText(self.defaults["delay"])
        self.auto_all.setChecked(self.defaults["auto_target"])
        self.append_log("Default settings updated.")

    def append_log(self, message: str):
        self.log_box.append(message)

    def set_running_state(self, running: bool):
        if running:
            self.run_btn.setEnabled(False)
            self.stop_btn.setEnabled(True)
            self.status_chip.setText("Running")
            self.status_chip.setObjectName("StatusChipRunning")
        else:
            self.run_btn.setEnabled(True)
            self.stop_btn.setEnabled(False)
            self.status_chip.setText("Idle")
            self.status_chip.setObjectName("StatusChipIdle")

        # Force Qt style re-evaluation after objectName change
        self.status_chip.style().unpolish(self.status_chip)
        self.status_chip.style().polish(self.status_chip)

    def refresh_process_list(self):
        self.process_entries = find_all_processes()
        self.process_list.clear()

        aion_count = 0
        for entry in self.process_entries:
            text = f"{entry['name']} (PID: {entry['pid']})"
            item = QListWidgetItem(text)
            item.setData(Qt.ItemDataRole.UserRole, entry["pid"])
            if entry["is_aion"]:
                aion_count += 1
            self.process_list.addItem(item)

        if self.auto_all.isChecked():
            self.select_all_aion()
            self._set_manual_controls_enabled(False)

        self.append_log("Process list refreshed and sorted by name.")
        if aion_count:
            self.append_log(f"{aion_count} aion.bin process(es) found and ready.")
        else:
            self.append_log("No aion.bin process found.")

    def filter_process_list(self):
        filter_text = self.filter_input.text().strip().lower()
        if not filter_text:
            QMessageBox.warning(self, "Validation", "Please enter a process name to filter.")
            return

        self.process_list.clear()
        filtered = [e for e in self.process_entries if filter_text in e["name"].lower()]
        for entry in filtered:
            text = f"{entry['name']} (PID: {entry['pid']})"
            item = QListWidgetItem(text)
            item.setData(Qt.ItemDataRole.UserRole, entry["pid"])
            self.process_list.addItem(item)

        if filtered:
            self.append_log(f"Filtered processes containing '{filter_text}'.")
        else:
            self.append_log(f"No processes found containing '{filter_text}'.")

    def select_all_aion(self):
        self.process_list.clearSelection()
        for i in range(self.process_list.count()):
            item = self.process_list.item(i)
            if "aion.bin" in item.text().lower():
                item.setSelected(True)

    def clear_selection(self):
        self.process_list.clearSelection()

    def _set_manual_controls_enabled(self, enabled: bool):
        for widget in (self.filter_input, self.filter_btn, self.refresh_btn,
                        self.select_all_btn, self.clear_sel_btn, self.process_list):
            widget.setEnabled(enabled)

    def on_auto_toggle(self, checked: bool):
        self._set_manual_controls_enabled(not checked)
        if checked:
            self.select_all_aion()

    def get_target_pids(self):
        if self.auto_all.isChecked():
            return [
                proc.info["pid"]
                for proc in psutil.process_iter(attrs=["pid", "name"])
                if proc.info.get("name") and proc.info["name"].lower() == "aion.bin"
            ]
        return [item.data(Qt.ItemDataRole.UserRole) for item in self.process_list.selectedItems()]

    def parse_inputs(self):
        key = self.key_input.text().strip().upper()
        if key not in {"TAB", "SPACE"} and (len(key) != 1 or not key.isalpha()):
            raise ValueError("Key must be a single letter, TAB, or SPACE.")

        iterations_raw = self.iterations_input.text().strip()
        if not iterations_raw.isdigit():
            raise ValueError("Number of iterations must be an integer.")
        iterations = int(iterations_raw)

        delay_raw = self.delay_input.text().strip()
        try:
            delay = float(delay_raw)
        except ValueError as exc:
            raise ValueError("Delay must be a valid number.") from exc

        if delay < 0:
            raise ValueError("Delay cannot be negative.")

        return key, iterations, delay

    def run_script(self):
        try:
            key, iterations, delay = self.parse_inputs()
        except ValueError as err:
            QMessageBox.warning(self, "Validation", str(err))
            return

        target_pids = self.get_target_pids()
        if not target_pids:
            if self.auto_all.isChecked():
                QMessageBox.warning(
                    self, "No Target",
                    "No aion.bin process is running.\n"
                    "Start Aion, or uncheck auto-target and select a process manually "
                    "(e.g. Notepad for testing).",
                )
            else:
                QMessageBox.warning(
                    self, "No Target",
                    "No process selected. Select one or more from the list.",
                )
            return

        self.worker = KeepAliveWorker(
            target_pids_provider=self.get_target_pids,
            iterations=iterations,
            delay_seconds=delay,
            key=key,
        )
        self.worker.log.connect(self.append_log)
        self.worker.finished.connect(self.on_worker_finished)

        self.worker_thread = threading.Thread(target=self.worker.run, daemon=True)
        self.worker_thread.start()
        self.set_running_state(True)

    def stop_script(self):
        if self.worker is not None:
            self.worker.stop()
            self.append_log("Stop requested.")

    def on_worker_finished(self):
        self.set_running_state(False)
        self.worker = None
        self.worker_thread = None


def ensure_single_instance_or_exit():
    mutex = win32event.CreateMutex(None, False, MUTEX_NAME)
    if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
        app = QApplication.instance() or QApplication(sys.argv)
        QMessageBox.critical(None, "Already running", "The app is already running.")
        sys.exit(0)
    return mutex


def resolve_icon_path() -> Path:
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
    return base / "keepAlive.png"


def main():
    set_windows_app_id()
    mutex = ensure_single_instance_or_exit()

    app = QApplication(sys.argv)
    icon_path = resolve_icon_path()
    if icon_path.exists():
        app.setWindowIcon(QIcon(str(icon_path)))

    window = KeepAliveWindow(icon_path=icon_path)
    window.show()

    exit_code = app.exec()

    # Keep mutex alive for full app lifetime.
    _ = mutex
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
