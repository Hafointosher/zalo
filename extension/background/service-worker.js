/**
 * Zalo Tools Extension - Background Service Worker
 */

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Received message:', message.action);
  
  switch (message.action) {
    case 'credentialsExtracted':
      handleCredentialsExtracted(message.data, sender);
      break;
      
    case 'getFriends':
      handleGetFriends().then(sendResponse);
      return true; // Keep channel open for async
      
    case 'getGroups':
      handleGetGroups().then(sendResponse);
      return true;
      
    case 'wsMessage':
      handleWebSocketMessage(message.data, sender);
      break;
      
    default:
      console.log('[Background] Unknown action:', message.action);
  }
});

// Handle extracted credentials
async function handleCredentialsExtracted(credentials, sender) {
  console.log('[Background] Credentials received from tab:', sender.tab?.id);
  
  // Store credentials
  await chrome.storage.local.set({ zaloCredentials: credentials });
  
  // Show notification
  if (credentials.uid) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icons/icon-128.png',
      title: 'Zalo Tools',
      message: `Connected as UID: ${credentials.uid}`
    });
  }
}

// Handle get friends request
async function handleGetFriends() {
  try {
    const { zaloCredentials } = await chrome.storage.local.get(['zaloCredentials']);
    
    if (!zaloCredentials?.secretKey) {
      return { success: false, error: 'No credentials' };
    }
    
    // TODO: Implement API call using credentials
    // For now, return placeholder
    return { 
      success: true, 
      data: [],
      message: 'API not implemented yet'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Handle get groups request
async function handleGetGroups() {
  try {
    const { zaloCredentials } = await chrome.storage.local.get(['zaloCredentials']);
    
    if (!zaloCredentials?.secretKey) {
      return { success: false, error: 'No credentials' };
    }
    
    // TODO: Implement API call
    return { 
      success: true, 
      data: [],
      message: 'API not implemented yet'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Handle WebSocket message from content script
async function handleWebSocketMessage(data, sender) {
  try {
    // Parse and log message
    console.log('[Background] WS Message:', data);
    
    // Check if notifications enabled
    const { notificationsEnabled } = await chrome.storage.local.get(['notificationsEnabled']);
    
    if (notificationsEnabled && data.type === 'message') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icons/icon-128.png',
        title: data.senderName || 'New Message',
        message: data.content || 'New message received'
      });
    }
  } catch (error) {
    console.error('[Background] WS Message error:', error);
  }
}

// Listen for tab updates to detect Zalo login
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chat.zalo.me')) {
    console.log('[Background] Zalo tab loaded:', tabId);
  }
});

// Install/update handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Initialize default settings
    chrome.storage.local.set({
      notificationsEnabled: true,
      autoExtract: true
    });
  }
});

console.log('[Background] Service worker started');
