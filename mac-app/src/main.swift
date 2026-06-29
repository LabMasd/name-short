import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate, WKScriptMessageHandler {
    var statusItem: NSStatusItem!
    let popover = NSPopover()
    var webView: WKWebView!

    func applicationDidFinishLaunching(_ note: Notification) {
        // --- status bar item ---
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let btn = statusItem.button {
            btn.image = menuBarIcon()
            btn.image?.isTemplate = true
            btn.action = #selector(toggle(_:))
            btn.target = self
        }

        // --- webview with JS bridge ---
        let cfg = WKWebViewConfiguration()
        let ucc = WKUserContentController()
        ucc.add(self, name: "copy")
        ucc.add(self, name: "quit")
        cfg.userContentController = ucc

        webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 380, height: 470), configuration: cfg)
        webView.setValue(false, forKey: "drawsBackground") // transparent until page paints

        if let html = Bundle.main.url(forResource: "web", withExtension: "html") {
            webView.loadFileURL(html, allowingReadAccessTo: html.deletingLastPathComponent())
        }

        let vc = NSViewController()
        vc.view = webView

        popover.contentViewController = vc
        popover.contentSize = NSSize(width: 380, height: 470)
        popover.behavior = .transient
        popover.animates = true
    }

    @objc func toggle(_ sender: Any?) {
        guard let btn = statusItem.button else { return }
        if popover.isShown {
            popover.performClose(sender)
        } else {
            popover.show(relativeTo: btn.bounds, of: btn, preferredEdge: .minY)
            popover.contentViewController?.view.window?.makeKey()
        }
    }

    // JS -> Swift
    func userContentController(_ ucc: WKUserContentController, didReceive msg: WKScriptMessage) {
        switch msg.name {
        case "copy":
            if let text = msg.body as? String {
                let pb = NSPasteboard.general
                pb.clearContents()
                pb.setString(text, forType: .string)
            }
        case "quit":
            NSApp.terminate(nil)
        default: break
        }
    }

    // small "n." menu-bar glyph drawn as a template image
    func menuBarIcon() -> NSImage {
        let size = NSSize(width: 18, height: 18)
        let img = NSImage(size: size)
        img.lockFocus()
        let style = NSMutableParagraphStyle(); style.alignment = .center
        let attrs: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 13, weight: .semibold),
            .foregroundColor: NSColor.black,
            .paragraphStyle: style
        ]
        let s = "n." as NSString
        let r = s.boundingRect(with: size, options: [], attributes: attrs)
        s.draw(at: NSPoint(x: (size.width - r.width)/2, y: (size.height - r.height)/2), withAttributes: attrs)
        img.unlockFocus()
        img.isTemplate = true
        return img
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory) // menu-bar only, no Dock icon
let delegate = AppDelegate()
app.delegate = delegate
app.run()
