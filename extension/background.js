importScripts('core.js');

// Right-click selected text → shorten with last-used settings → copy
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'name-short',
    title: 'Shorten "%s" → copy slug',
    contexts: ['selection']
  });
});

// Ensure a single offscreen document exists to perform the clipboard write
let creating;
async function ensureOffscreen() {
  const url = chrome.runtime.getURL('offscreen.html');
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [url]
  });
  if (contexts.length) return;
  if (creating) { await creating; return; }
  creating = chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['CLIPBOARD'],
    justification: 'Copy the shortened slug to the clipboard.'
  });
  await creating;
  creating = null;
}

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== 'name-short' || !info.selectionText) return;
  const { opts } = await chrome.storage.local.get('opts');
  const slug = NameShort.shorten(info.selectionText, opts);

  await ensureOffscreen();
  await chrome.runtime.sendMessage({ target: 'offscreen', type: 'copy', data: slug });

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'name.short',
    message: 'Copied: ' + slug
  });
});
