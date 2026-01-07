# Session Context - Zalo Extension Project

## 🕒 Last Update: 2026-01-07 (Quota reached)

### ✅ Completed Today
- Finished variable renaming for 30+ API files (list in ISSUE.md)
- Targeted `add*/delete*/create*/edit*` APIs
- Updated ISSUE.md with progress snapshot
- Logged next tasks due to quota exhaustion

### ❗ Current Blocker
> **Model quota exceeded (429)** while renaming `getCatalogList.js`. Resume once quota resets (~4h from last attempt).

### 🔄 Resume Checklist (after quota refresh)
1. Continue renaming starting from:
   - `getCatalogList.js`
   - `getContext.js`
   - `getFriendBoardList.js`
   - Remaining `get*.js`, `update*.js`
   - `libs/utils.js`, `libs/zalo.js`
   - `nodes/ZaloUser/*.js`

2. After renaming ~80% of APIs, move to extension boilerplate:
   - Fork structure from `ZaloDataExtractor`
   - Create Manifest V3 for "Zalo Tools"
   - Setup popup UI skeleton

3. Port zca-js core modules to browser environment (use `zca-js` repo)

### 📦 Key Files to Inspect Next
- `libs/apis/getCatalogList.js`
- `libs/apis/getContext.js`
- `libs/apis/getFriendBoardList.js`
- `libs/utils.js`
- `libs/zalo.js`

### 🔁 Commands (when resuming)
```bash
cd C:\Users\Hafointosher\Desktop\n8n-zalo-deobfuscated
# Check git status before modifications
git status
# Use Run Task or rename manually per file
```

### 🧠 Naming Rules Reminder
```javascript
serviceUrls → appContext → api    // factory parameters
encryptedParams, requestParams
threadId, threadType, isGroupThread
userId, groupId, message, response
```

### 🔗 References
- `ISSUE.md` – latest progress summary
- `EXTENSION_PLAN.md` – extension architecture
- `zca-js` – clean TypeScript source

---
*Update this file at the end of each session to capture context when switching threads or waiting for quota.*
