#!/bin/bash
set -e
cd "$(dirname "$0")"

APP="name.short.app"
BUILD="build"
CONTENTS="$BUILD/$APP/Contents"

echo "› cleaning"
rm -rf "$BUILD"
mkdir -p "$CONTENTS/MacOS" "$CONTENTS/Resources"

echo "› compiling Swift"
swiftc -O src/main.swift -o "$CONTENTS/MacOS/name.short" \
  -framework Cocoa -framework WebKit

echo "› bundling resources"
cp src/web.html "$CONTENTS/Resources/web.html"

# app icon (.icns) from the 128px PNG used by the extension
ICON_SRC="../extension/icons/icon-128.png"
if [ -f "$ICON_SRC" ]; then
  ICONSET="$BUILD/icon.iconset"
  mkdir -p "$ICONSET"
  for s in 16 32 64 128 256 512; do
    sips -z $s $s "$ICON_SRC" --out "$ICONSET/icon_${s}x${s}.png" >/dev/null 2>&1 || true
  done
  cp "$ICONSET/icon_512x512.png" "$ICONSET/icon_256x256@2x.png" 2>/dev/null || true
  iconutil -c icns "$ICONSET" -o "$CONTENTS/Resources/AppIcon.icns" 2>/dev/null || true
fi

echo "› writing Info.plist"
cat > "$CONTENTS/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>name.short</string>
  <key>CFBundleDisplayName</key><string>name.short</string>
  <key>CFBundleIdentifier</key><string>cc.masd.nameshort</string>
  <key>CFBundleVersion</key><string>1.0.0</string>
  <key>CFBundleShortVersionString</key><string>1.0.0</string>
  <key>CFBundleExecutable</key><string>name.short</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>LSUIElement</key><true/>
  <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
PLIST

echo "› ad-hoc code signing"
codesign --force --deep --sign - "$BUILD/$APP" 2>/dev/null || echo "  (codesign skipped)"

echo "✓ built $BUILD/$APP"
