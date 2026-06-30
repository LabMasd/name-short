// Offscreen document: writes the shortened slug to the clipboard.
// Uses a textarea + execCommand('copy') — the reliable method in an offscreen context.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== 'offscreen' || msg.type !== 'copy') return;
  const ta = document.getElementById('text');
  ta.value = msg.data;
  ta.focus();
  ta.select();
  document.execCommand('copy');
});
