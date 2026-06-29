importScripts('core.js');

// Right-click selected text → shorten with last-used settings → copy
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'name-short',
    title: 'Shorten "%s" → copy slug',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'name-short' || !info.selectionText) return;
  const { opts } = await chrome.storage.local.get('opts');
  const slug = NameShort.shorten(info.selectionText, opts);

  // copy via the page (clipboard API needs a document context)
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => navigator.clipboard.writeText(text),
      args: [slug]
    });
  } catch (e) {
    // fallback: stash it so the popup can grab it
    await chrome.storage.local.set({ lastSlug: slug });
  }

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'name.short',
    message: 'Copied: ' + slug
  });
});
