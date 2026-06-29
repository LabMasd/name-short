# name.short — Chrome extension

A popup version of [name.short](https://labmasd.github.io/name-short/): turn long names into short, folder-safe slugs. Everything runs locally — nothing leaves your browser.

## Features
- **Popup tool** — same shortening engine: smart filler-drop, kebab/snake/camel/Pascal, max-length cap, date stamps, ascii-safe.
- **Right-click → "Shorten … → copy slug"** — select any text on a page, shorten it with your last-used settings, copied straight to the clipboard.
- **Remembers your settings** between sessions via `chrome.storage`.

## Install (unpacked, for now)
1. Open `chrome://extensions`
2. Toggle **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select this `extension/` folder
5. Pin the **n.s** icon from the puzzle-piece menu

## Files
| File | Role |
|------|------|
| `manifest.json` | MV3 manifest |
| `core.js` | shared shortening logic (popup + worker) |
| `popup.html` / `popup.js` | the popup UI |
| `background.js` | context-menu service worker |
| `icons/` | 16 / 48 / 128 px icons |

Built by [masd.cc](https://masd.cc) · [@masd.lab on Instagram](https://www.instagram.com/masd.lab)
