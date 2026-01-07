/**
 * Zalo Tools Extension - Popup Script
 */

// DOM Elements
const connectionStatus = document.getElementById('connectionStatus');
const uidRow = document.getElementById('uidRow');
const uidValue = document.getElementById('uidValue');
const extractBtn = document.getElementById('extractBtn');
const copyCredsBtn = document.getElementById('copyCredsBtn');
const getFriendsBtn = document.getElementById('getFriendsBtn');
const getGroupsBtn = document.getElementById('getGroupsBtn');
const toggleNotifyBtn = document.getElementById('toggleNotifyBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const settingsBtn = document.getElementById('settingsBtn');
const toast = document.getElementById('toast');

// State
let credentials = null;

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load stored credentials
  const stored = await chrome.storage.local.get(['zaloCredentials']);
  if (stored.zaloCredentials) {
    credentials = stored.zaloCredentials;
    updateUI(true);
  }
  
  // Check if on Zalo tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('chat.zalo.me')) {
    extractBtn.disabled = true;
    showToast('Open chat.zalo.me first', 'error');
  }
}

// Update UI based on connection state
function updateUI(connected) {
  if (connected && credentials) {
    connectionStatus.textContent = 'Connected';
    connectionStatus.classList.remove('disconnected');
    connectionStatus.classList.add('connected');
    
    uidRow.style.display = 'flex';
    uidValue.textContent = credentials.uid || '-';
    
    copyCredsBtn.disabled = false;
    getFriendsBtn.disabled = false;
    getGroupsBtn.disabled = false;
    toggleNotifyBtn.disabled = false;
  } else {
    connectionStatus.textContent = 'Disconnected';
    connectionStatus.classList.remove('connected');
    connectionStatus.classList.add('disconnected');
    
    uidRow.style.display = 'none';
    
    copyCredsBtn.disabled = true;
    getFriendsBtn.disabled = true;
    getGroupsBtn.disabled = true;
    toggleNotifyBtn.disabled = true;
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Extract credentials
extractBtn.addEventListener('click', async () => {
  extractBtn.disabled = true;
  extractBtn.querySelector('.btn-text').textContent = 'Extracting...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.url?.includes('chat.zalo.me')) {
      showToast('Please open chat.zalo.me', 'error');
      return;
    }
    
    // Send message to content script to extract credentials
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: 'extractCredentials' 
    });
    
    if (response?.success) {
      credentials = response.data;
      await chrome.storage.local.set({ zaloCredentials: credentials });
      updateUI(true);
      showToast('Credentials extracted!', 'success');
    } else {
      showToast(response?.error || 'Extraction failed', 'error');
    }
  } catch (error) {
    console.error('Extract error:', error);
    showToast('Error: ' + error.message, 'error');
  } finally {
    extractBtn.disabled = false;
    extractBtn.querySelector('.btn-text').textContent = 'Extract Credentials';
  }
});

// Copy credentials to clipboard
copyCredsBtn.addEventListener('click', async () => {
  if (!credentials) return;
  
  const text = JSON.stringify(credentials, null, 2);
  
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  } catch (error) {
    showToast('Copy failed', 'error');
  }
});

// Get friends
getFriendsBtn.addEventListener('click', async () => {
  showToast('Getting friends...', 'info');
  
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'getFriends' 
    });
    
    if (response?.success) {
      showToast(`Found ${response.data.length} friends`, 'success');
    } else {
      showToast(response?.error || 'Failed', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
});

// Get groups
getGroupsBtn.addEventListener('click', async () => {
  showToast('Getting groups...', 'info');
  
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'getGroups' 
    });
    
    if (response?.success) {
      showToast(`Found ${response.data.length} groups`, 'success');
    } else {
      showToast(response?.error || 'Failed', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
});

// Toggle notifications
toggleNotifyBtn.addEventListener('click', async () => {
  const { notificationsEnabled } = await chrome.storage.local.get(['notificationsEnabled']);
  const newState = !notificationsEnabled;
  
  await chrome.storage.local.set({ notificationsEnabled: newState });
  
  showToast(`Notifications ${newState ? 'enabled' : 'disabled'}`, 'success');
  toggleNotifyBtn.querySelector('.btn-icon').textContent = newState ? '🔔' : '🔕';
});

// Open dashboard
dashboardBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('pages/dashboard.html') });
});

// Settings
settingsBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('pages/settings.html') });
});
