/**
 * Zalo Tools Extension - Content Script Injector
 * Runs at document_start to intercept API calls
 */

console.log('[Zalo Tools] Content script loaded');

// Inject page script to access page context
function injectPageScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content-scripts/page-script.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

// Wait for DOM ready then inject
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectPageScript);
} else {
  injectPageScript();
}

// Listen for messages from page script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== 'zalo-tools-page') return;
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'CREDENTIALS':
      console.log('[Zalo Tools] Credentials received from page');
      chrome.runtime.sendMessage({
        action: 'credentialsExtracted',
        data: data
      });
      break;
      
    case 'WS_MESSAGE':
      chrome.runtime.sendMessage({
        action: 'wsMessage',
        data: data
      });
      break;
      
    case 'API_RESPONSE':
      console.log('[Zalo Tools] API response:', data.url);
      break;
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractCredentials') {
    // Request credentials from page script
    window.postMessage({
      source: 'zalo-tools-content',
      type: 'EXTRACT_CREDENTIALS'
    }, '*');
    
    // Wait for response
    const handler = (event) => {
      if (event.source !== window) return;
      if (!event.data || event.data.source !== 'zalo-tools-page') return;
      if (event.data.type !== 'CREDENTIALS') return;
      
      window.removeEventListener('message', handler);
      sendResponse({ success: true, data: event.data.data });
    };
    
    window.addEventListener('message', handler);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener('message', handler);
      sendResponse({ success: false, error: 'Timeout' });
    }, 5000);
    
    return true; // Keep channel open
  }
});

console.log('[Zalo Tools] Content script ready');
