# Zalo Tools Chrome/Edge Extension - Design Plan

## 📊 Phân tích nguồn

### 1. zca-js (https://github.com/RFS-ADRENO/zca-js)
- **Loại**: Thư viện Node.js (TypeScript)
- **Tính năng**: 131+ API functions cho Zalo
- **Auth**: QR Login hoặc Cookie-based
- **Hạn chế**: Chạy trên server (Node.js), không phải browser

### 2. ZaloDataExtractor (https://github.com/JustKemForFun/ZaloDataExtractor)
- **Loại**: Chrome Extension (Manifest V3)
- **Tính năng**: Extract IMEI, Cookies, User-Agent từ Zalo Web
- **Mục đích**: Hỗ trợ zca-js lấy credentials

### 3. n8n-nodes-zalo (Deobfuscated)
- **Loại**: n8n custom node
- **Code**: JavaScript (deobfuscated từ obfuscated source)
- **Tính năng**: Tương tự zca-js

---

## 🎯 Mục tiêu Extension

Tạo Chrome/Edge Extension **all-in-one** với các tính năng:

1. **Extract Credentials** (như ZaloDataExtractor)
2. **Automation Tools** trong browser
3. **Message Management**
4. **Contact/Group Management**
5. **Webhook Integration**

---

## 🏗️ Kiến trúc Extension

```
zalo-tools-extension/
├── manifest.json              # Manifest V3
├── popup/
│   ├── popup.html             # Main popup UI
│   ├── popup.css              # Styles
│   └── popup.js               # Popup logic
├── background/
│   └── service-worker.js      # Background service worker
├── content-scripts/
│   ├── zalo-injector.js       # Inject vào Zalo Web
│   └── api-interceptor.js     # Intercept API calls
├── lib/
│   ├── zalo-api.js            # Zalo API wrapper (browser-compatible)
│   ├── crypto.js              # AES encryption/decryption
│   ├── utils.js               # Utilities
│   └── websocket-listener.js  # WebSocket message listener
├── pages/
│   ├── dashboard.html         # Full dashboard page
│   ├── settings.html          # Settings page
│   └── logs.html              # Activity logs
├── assets/
│   └── icons/                 # Extension icons
└── _locales/                  # i18n (vi, en)
```

---

## 📋 Tính năng chi tiết

### Phase 1: Core Features (MVP)

#### 1.1 Credential Extraction
```javascript
// Tự động extract khi mở Zalo Web
- IMEI (từ localStorage hoặc API request)
- Cookies (session cookies)
- User-Agent
- Secret Key (zpw_enk)
- UID (user ID)
```

#### 1.2 Auto-login Detection
```javascript
// Detect login state
- Monitor /api/login/getServerInfo
- Extract zpw_service_map_v3 (service URLs)
- Store credentials securely (chrome.storage.local)
```

#### 1.3 Message Listener
```javascript
// WebSocket listener in content script
- Intercept WebSocket messages
- Parse message events
- Show notifications
- Log to dashboard
```

### Phase 2: Automation Features

#### 2.1 Quick Actions (Popup)
```
┌─────────────────────────────────────┐
│ 🔵 Zalo Tools                    ⚙️ │
├─────────────────────────────────────┤
│ Status: ✅ Connected                │
│ UID: 123456789                      │
├─────────────────────────────────────┤
│ 📋 Copy Credentials                 │
│ 📨 Send Message                     │
│ 👥 Get All Friends                  │
│ 👥 Get All Groups                   │
│ 🔔 Toggle Notifications             │
├─────────────────────────────────────┤
│ [Open Dashboard]                    │
└─────────────────────────────────────┘
```

#### 2.2 Message Actions
- Quick reply templates
- Auto-reply rules
- Message scheduling (via Alarm API)
- Bulk messaging

#### 2.3 Contact Management
- Export friends list (CSV/JSON)
- Export groups list
- Bulk friend requests
- Contact search

### Phase 3: Advanced Features

#### 3.1 Webhook Integration
```javascript
// Forward events to external services
{
  webhookUrl: "https://your-server.com/webhook",
  events: ["message", "reaction", "friend_request"],
  filter: {
    threadType: "group", // or "user"
    keywords: ["urgent", "help"]
  }
}
```

#### 3.2 Dashboard Page
- Real-time message feed
- Statistics (messages/day, active chats)
- Credential management
- Webhook configuration
- Activity logs

#### 3.3 Automation Rules
```javascript
// Rule-based automation
{
  name: "Auto-reply when busy",
  trigger: { type: "message", contains: "?" },
  condition: { status: "busy" },
  action: { 
    type: "reply", 
    message: "Tôi đang bận, sẽ trả lời sau!" 
  }
}
```

---

## 🔧 Technical Implementation

### Manifest V3 Configuration

```json
{
  "manifest_version": 3,
  "name": "Zalo Tools",
  "version": "1.0.0",
  "description": "Zalo automation and management tools",
  
  "permissions": [
    "tabs",
    "cookies",
    "storage",
    "activeTab",
    "webRequest",
    "notifications",
    "alarms",
    "clipboardWrite"
  ],
  
  "host_permissions": [
    "https://chat.zalo.me/*",
    "https://*.zalo.me/*"
  ],
  
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  
  "content_scripts": [
    {
      "matches": ["https://chat.zalo.me/*"],
      "js": ["content-scripts/zalo-injector.js"],
      "run_at": "document_start"
    }
  ],
  
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "assets/icons/icon-16.png",
      "48": "assets/icons/icon-48.png",
      "128": "assets/icons/icon-128.png"
    }
  },
  
  "web_accessible_resources": [
    {
      "resources": ["lib/*"],
      "matches": ["https://chat.zalo.me/*"]
    }
  ]
}
```

### Browser-Compatible Zalo API

```javascript
// lib/zalo-api.js - Browser version of zca-js
class ZaloAPI {
  constructor(credentials) {
    this.imei = credentials.imei;
    this.cookies = credentials.cookies;
    this.secretKey = credentials.secretKey;
    this.uid = credentials.uid;
    this.serviceMap = credentials.serviceMap;
  }

  // API methods (adapted for browser fetch)
  async sendMessage(content, threadId, threadType) { }
  async getAllFriends() { }
  async getAllGroups() { }
  async getUserInfo(userId) { }
  async getGroupInfo(groupId) { }
  // ... 131+ methods
}
```

### Content Script - API Interceptor

```javascript
// content-scripts/api-interceptor.js
(function() {
  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    // Clone and analyze response
    const url = args[0];
    if (url.includes('/api/login/getLoginInfo')) {
      const data = await response.clone().json();
      // Extract credentials
      chrome.runtime.sendMessage({
        type: 'LOGIN_DATA',
        data: data
      });
    }
    
    return response;
  };

  // Intercept WebSocket
  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);
    
    ws.addEventListener('message', (event) => {
      chrome.runtime.sendMessage({
        type: 'WS_MESSAGE',
        data: event.data
      });
    });
    
    return ws;
  };
})();
```

---

## 📅 Development Timeline

### Week 1-2: Foundation
- [ ] Setup project structure
- [ ] Implement credential extraction (like ZaloDataExtractor)
- [ ] Basic popup UI
- [ ] Chrome storage integration

### Week 3-4: Core API
- [ ] Port zca-js utils to browser (crypto, request)
- [ ] Implement key APIs (sendMessage, getFriends, getGroups)
- [ ] WebSocket listener for real-time messages
- [ ] Notification system

### Week 5-6: Dashboard
- [ ] Dashboard page with React/Vue or vanilla JS
- [ ] Real-time message feed
- [ ] Credential management UI
- [ ] Export functionality

### Week 7-8: Automation
- [ ] Webhook integration
- [ ] Auto-reply rules
- [ ] Message scheduling
- [ ] Bulk actions

### Week 9-10: Polish
- [ ] Error handling
- [ ] Internationalization (vi/en)
- [ ] Documentation
- [ ] Testing on Chrome & Edge
- [ ] Publish to Chrome Web Store

---

## ⚠️ Challenges & Solutions

### 1. CORS Issues
**Problem**: Browser blocks cross-origin requests
**Solution**: 
- Use content scripts to make requests from Zalo domain
- Or proxy through background service worker

### 2. WebSocket Access
**Problem**: Can't directly access Zalo's WebSocket
**Solution**: 
- Inject content script to intercept WebSocket
- Forward messages to extension

### 3. Encryption
**Problem**: zca-js uses Node.js crypto
**Solution**: 
- Use Web Crypto API
- Or include crypto-js (browser-compatible)

### 4. Session Management
**Problem**: Cookies expire, need refresh
**Solution**: 
- Monitor session status
- Auto-refresh using stored credentials
- Alert user when re-login needed

---

## 🔗 Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| zca-js | https://github.com/RFS-ADRENO/zca-js | Reference API implementation |
| ZaloDataExtractor | https://github.com/JustKemForFun/ZaloDataExtractor | Reference extension |
| Chrome Extensions | https://developer.chrome.com/docs/extensions/mv3/ | Official docs |
| Manifest V3 | https://developer.chrome.com/docs/extensions/mv3/intro/ | Migration guide |

---

## 🚀 Next Steps

1. **Create extension boilerplate** with Manifest V3
2. **Port credential extraction** from ZaloDataExtractor
3. **Adapt zca-js crypto/utils** for browser
4. **Build popup UI** with core actions
5. **Implement message listener**
6. **Add webhook support**

---

*Plan created: January 2026*
*Author: Hafointosher*
