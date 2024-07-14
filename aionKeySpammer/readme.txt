This app will allow you to spam keys in aion just like ahk simple spam scripts or synapse but using opencv to detect opened chat window and automatically stops the spam when chat is opened ;) The only downside with current implementation is that ctrl combo keybinds are not supported :(

Run these commands to create the exe that will contain all the necesarry packages, enjoy.

pip install -r requirements.txt

pyinstaller --onefile --windowed --add-data "move.png;." --add-data "close.png;." --add-data "on.png;." --add-data "off.png;." --add-data "chat_box_template.png;." --add-data "chat_box_template_classic.png;." --add-data "chat_box_template_classic2.png;." --add-data "settings.png;." aionKeySpammer.py
