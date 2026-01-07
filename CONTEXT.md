# Session Context - Zalo Extension Project

## 🎯 Current State (2026-01-07)

### What We're Building
1. **Chrome/Edge Extension** for Zalo automation (PRIMARY)
2. **n8n Node rebuild** (SECONDARY)

### Key Resources
- **zca-js**: https://github.com/RFS-ADRENO/zca-js (TypeScript source - USE THIS)
- **ZaloDataExtractor**: https://github.com/JustKemForFun/ZaloDataExtractor (Extension template)
- **Deobfuscated code**: This repo (backup reference only)

### Variable Naming Convention
When renaming obfuscated variables, use:
```javascript
// Factory pattern: apiFactory()((param1, param2, param3) => { ... })
param1 → serviceUrls     // contains zpwServiceMap
param2 → appContext      // contains imei, settings, language
param3 → api             // contains makeURL, encodeAES, request, resolve

// Common variables
URL variable      → endpoint, apiUrl
Request object    → requestParams
Encrypted data    → encryptedParams
API response      → response
Thread ID         → threadId
Thread type       → threadType
Is group check    → isGroupThread
User ID           → userId
Group ID          → groupId
Message           → message, messageData
```

### Files Already Renamed (~40%)
See ISSUE.md for full list. Key files done:
- sendMessage.js, listen.js (complex)
- login.js, getUserInfo.js
- All friend/group management APIs

### Files Still Need Renaming (~60%)
- Most `get*.js` files
- `update*.js` files  
- `libs/utils.js`, `libs/zalo.js`
- `nodes/ZaloUser/*.js`

## 📋 Next Steps (Priority Order)

1. **Create Extension Boilerplate**
   - Clone ZaloDataExtractor as base
   - Update manifest.json for Zalo Tools
   - Setup project structure per EXTENSION_PLAN.md

2. **Port zca-js to Browser**
   - Copy crypto functions (use crypto-js)
   - Adapt fetch wrapper for browser
   - Test encryption/decryption

3. **Build Popup UI**
   - Credential extraction (IMEI, cookies)
   - Quick actions (copy, export)
   - Connection status

4. **WebSocket Listener**
   - Intercept Zalo WebSocket in content script
   - Forward messages to extension
   - Real-time notifications

## 🔧 Commands to Resume

```bash
# Navigate to project
cd C:\Users\Hafointosher\Desktop\n8n-zalo-deobfuscated

# Check git status
git status

# Continue renaming (example)
# Read file → understand → rewrite with meaningful names
```

## 📁 Project Locations

| Path | Description |
|------|-------------|
| `C:\Users\Hafointosher\Desktop\n8n-zalo-deobfuscated` | Deobfuscated source |
| `libs/apis/*.js` | 131 API functions |
| `EXTENSION_PLAN.md` | Detailed extension design |
| `ISSUE.md` | Project overview & progress |

## 💡 Key Insights

1. **Don't use deobfuscated code directly** - zca-js already has clean TypeScript
2. **Extension approach**: Content script intercepts → Service worker processes → Popup/Dashboard displays
3. **CORS workaround**: Make API calls from content script (same origin as Zalo)
4. **Encryption**: crypto-js works in browser, same as zca-js uses

---
*This file helps preserve context between sessions. Update before ending each session.*
