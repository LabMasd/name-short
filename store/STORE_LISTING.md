# Chrome Web Store — submission package (name.short)

Everything needed to publish the extension at https://chrome.google.com/webstore/devconsole

## Upload
- **Package:** `name-short-extension-v1.0.0.zip` (in this folder) — this is the file you upload under *Package → Upload new package*.
- A one-time **$5 developer registration** is required if this is your first item.

---

## Store listing fields

**Item name**
```
name.short
```

**Summary** (short description, ≤132 chars)
```
Turn long names into short, folder-safe slugs — kebab/snake/camel, smart filler-drop, date stamps. 100% local, no tracking.
```

**Category:** Productivity

**Language:** English

**Detailed description**
```
name.short turns long, messy names into short, folder-safe slugs — right in your browser.

Stop typing "Client_Brand_Identity_Working_Files_FINAL_v2" by hand. Paste it, get "client-brand-identity".

▸ FIVE STRATEGIES
• smart — drops filler words (final, working, files, the, of…)
• initials · truncate words · drop vowels · full slug

▸ SIX CASES
kebab-case · snake_case · camelCase · PascalCase · lowercase · UPPERCASE

▸ MORE
• Max-length cap (off · 6 · 12 · 18 · 24 · 36 · 48)
• Optional YYYYMMDD date prefix/suffix
• ASCII-only mode (strips accents & emoji)
• Right-click any selected text → "Shorten → copy slug"
• Remembers your settings

▸ PRIVATE BY DESIGN
Everything runs locally. No accounts, no analytics, no servers, no data leaves your browser — ever.

Free, made by masd.cc. Also available as a web app and a macOS menu-bar app:
https://labmasd.github.io/name-short/
```

**Privacy policy URL** (required — host is live on GitHub Pages)
```
https://labmasd.github.io/name-short/privacy.html
```

**Homepage / support URL**
```
https://github.com/LabMasd/name-short
```

---

## Privacy practices tab (Developer Dashboard answers)

**Single purpose**
```
Convert long names into short, filesystem-safe slugs (folder/file names), with a one-click right-click action to shorten selected text.
```

**Permission justifications**
| Permission | Justification |
|---|---|
| `storage` | Saves the user's chosen options (case, strategy, max length, date, ascii) locally so the popup remembers them between sessions. |
| `contextMenus` | Adds the right-click "Shorten … → copy slug" menu item. |
| `activeTab` + `scripting` | Only when the user clicks the right-click menu, a tiny script writes the resulting slug to the clipboard on the current tab. No page content is read, stored, or transmitted. |
| `notifications` | Shows a brief "Copied: …" confirmation after the right-click action. |

**Data usage disclosures:** check **"I do not sell or transfer user data to third parties"**, and declare **no data collected** (none of the categories apply — all processing is local).

**Remote code:** No, the extension does not use remote code.

---

## Assets (in ./assets and ./screenshots)
| Asset | Size | Required |
|---|---|---|
| Store icon | 128×128 | ✓ (also bundled in the zip) |
| Screenshots | 1280×800 | ✓ at least 1 (we provide 3) |
| Small promo tile | 440×280 | optional (we provide one) |
| Marquee promo | 1400×560 | optional (we provide one) |

---

## Pre-submit checklist
- [ ] Upload `name-short-extension-v1.0.0.zip`
- [ ] Paste summary + detailed description
- [ ] Category = Productivity, Language = English
- [ ] Add 1–3 screenshots from `./screenshots`
- [ ] (Optional) add promo tiles from `./assets`
- [ ] Privacy policy URL = the GitHub Pages link above
- [ ] Fill single purpose + permission justifications
- [ ] Data disclosures: no data collected, no sale/transfer
- [ ] Submit for review (first review usually a few business days)

> Note on review friction: `scripting` + `activeTab` get extra scrutiny. They are used **only** for the right-click clipboard copy. If a reviewer pushes back, the right-click feature can be reimplemented with the `offscreen` API to drop both permissions — ask and I'll refactor.
