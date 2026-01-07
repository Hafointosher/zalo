/**
 * Zalo Tools Extension - Page Script
 * Runs in page context to access Zalo's internal state
 */

(function() {
  'use strict';
  
  console.log('[Zalo Tools] Page script injected');
  
  // Store intercepted data
  let loginData = null;
  let serverInfo = null;
  
  // Intercept fetch to capture API responses
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    try {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      
      // Clone response to read body
      const clone = response.clone();
      
      // Capture login info
      if (url.includes('/api/login/getLoginInfo')) {
        const data = await clone.json();
        if (data.error_code === 0) {
          loginData = data.data;
          console.log('[Zalo Tools] Captured login info');
          notifyCredentials();
        }
      }
      
      // Capture server info
      if (url.includes('/api/login/getServerInfo')) {
        const data = await clone.json();
        if (data.error_code === 0) {
          serverInfo = data.data;
          console.log('[Zalo Tools] Captured server info');
          notifyCredentials();
        }
      }
      
      // Notify extension of API responses
      window.postMessage({
        source: 'zalo-tools-page',
        type: 'API_RESPONSE',
        data: { url, status: response.status }
      }, '*');
      
    } catch (e) {
      // Ignore parse errors
    }
    
    return response;
  };
  
  // Intercept WebSocket
  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    console.log('[Zalo Tools] WebSocket created:', url);
    
    const ws = protocols 
      ? new OriginalWebSocket(url, protocols)
      : new OriginalWebSocket(url);
    
    ws.addEventListener('message', (event) => {
      try {
        // Forward message to extension
        window.postMessage({
          source: 'zalo-tools-page',
          type: 'WS_MESSAGE',
          data: {
            url: url,
            data: event.data
          }
        }, '*');
      } catch (e) {
        // Ignore
      }
    });
    
    return ws;
  };
  window.WebSocket.prototype = OriginalWebSocket.prototype;
  
  // Function to extract credentials
  function extractCredentials() {
    const credentials = {
      imei: null,
      cookies: null,
      userAgent: navigator.userAgent,
      secretKey: null,
      uid: null,
      serviceMap: null,
      extraVer: null,
      timestamp: Date.now()
    };
    
    // Try to get IMEI from localStorage
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes('imei') || key.includes('IMEI')) {
          credentials.imei = localStorage.getItem(key);
          break;
        }
      }
      
      // Alternative: check for zkid
      if (!credentials.imei) {
        credentials.imei = localStorage.getItem('zkid');
      }
    } catch (e) {
      console.error('[Zalo Tools] Error reading localStorage:', e);
    }
    
    // Get cookies
    credentials.cookies = document.cookie;
    
    // Use captured login data if available
    if (loginData) {
      credentials.secretKey = loginData.zpw_enk;
      credentials.uid = loginData.uid;
      credentials.serviceMap = loginData.zpw_service_map_v3;
    }
    
    // Use captured server info
    if (serverInfo) {
      credentials.extraVer = serverInfo.extra_ver;
    }
    
    return credentials;
  }
  
  // Notify extension of credentials
  function notifyCredentials() {
    if (loginData && serverInfo) {
      const credentials = extractCredentials();
      window.postMessage({
        source: 'zalo-tools-page',
        type: 'CREDENTIALS',
        data: credentials
      }, '*');
    }
  }
  
  // Listen for extract request from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || event.data.source !== 'zalo-tools-content') return;
    
    if (event.data.type === 'EXTRACT_CREDENTIALS') {
      const credentials = extractCredentials();
      window.postMessage({
        source: 'zalo-tools-page',
        type: 'CREDENTIALS',
        data: credentials
      }, '*');
    }
  });
  
  // Check if already logged in (page reload)
  setTimeout(() => {
    // Try to find existing credentials in page
    const credentials = extractCredentials();
    if (credentials.uid || credentials.imei) {
      console.log('[Zalo Tools] Found existing credentials');
      window.postMessage({
        source: 'zalo-tools-page',
        type: 'CREDENTIALS',
        data: credentials
      }, '*');
    }
  }, 2000);
  
  console.log('[Zalo Tools] Page script ready');
})();
