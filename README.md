# name.short

Turn long names into short, **folder-safe slugs**. Smart filler-drop, kebab/snake/camel, date stamps, ascii-safe. Runs entirely in your browser — nothing leaves the page.

**▶ Live:** https://labmasd.github.io/name-short/

## Strategies
- **smart** — drops filler words (`final`, `working`, `files`, `the`, …)
- **initials** · **truncate words** · **drop vowels** · **full slug**

## Cases
kebab-case · snake_case · camelCase · PascalCase · lowercase · UPPERCASE
Plus a max-length cap and optional `YYYYMMDD` date prefix/suffix.

## Versions
- **Web app** — `index.html` (this is what GitHub Pages serves)
- **Chrome extension** — [`extension/`](extension/) — popup + right-click "shorten selection → copy"
- **macOS menu-bar app** — [`mac-app/`](mac-app/) — native Swift menu-bar popover, copies to system clipboard

Built by [masd.cc](https://masd.cc).
