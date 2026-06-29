# name.short — macOS menu-bar app

A native menu-bar version of [name.short](https://labmasd.github.io/name-short/). Lives in the menu bar (no Dock icon), drops a popover with the full tool, and copies slugs to the **real macOS clipboard** so you can paste folder names anywhere.

## Build & run
```bash
./build.sh
open build/name.short.app
```
Requires the Xcode command-line tools (Swift). The app is **ad-hoc signed** — on first launch you may need to right-click → Open (unsigned/un-notarized).

## How it works
- **`src/main.swift`** — `NSStatusItem` + `NSPopover` hosting a `WKWebView`. Runs as `.accessory` (menu-bar only, `LSUIElement`). A `WKScriptMessageHandler` bridges JS → Swift for clipboard (`NSPasteboard`) and quit.
- **`src/web.html`** — the same UI as the web/extension build (sage design, sliding date pill, anticipation). Settings persist in `localStorage`; `Copy` calls `webkit.messageHandlers.copy` instead of the browser clipboard API.
- **`build.sh`** — compiles with `swiftc`, assembles the `.app` bundle, makes an `.icns` from the shared 128px icon, writes `Info.plist`, ad-hoc signs.

## Notes
- Menu-bar glyph is a template-rendered `n.` (adapts to light/dark menu bar).
- `build/` is git-ignored — build locally.

Built by [masd.cc](https://masd.cc) · [@masd.lab on Instagram](https://www.instagram.com/masd.lab)
