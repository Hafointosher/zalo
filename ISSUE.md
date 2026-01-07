# n8n-nodes-zalo-user-v3 Deobfuscation Project

## 📋 Overview

This project reverse-engineers and deobfuscates the `n8n-nodes-zalo-user-v3` package (n8n custom node for Zalo automation). We have recovered readable source code and are rebuilding it as an open and maintainable solution.

**Original Package:** [n8n-nodes-zalo-user-v3](https://www.npmjs.com/package/n8n-nodes-zalo-user-v3)  
**Version:** 0.0.67  
**License:** MIT  
**GitHub:** https://github.com/Hafointosher/zalo

## 🎯 Project Goals

### 1. Chrome/Edge Extension (Primary)
- Extract credentials (IMEI, Cookies, User-Agent)
- Manage messages (send, reply, schedule, auto-reply)
- Handle contacts & groups
- Webhook integration (n8n / custom)

### 2. n8n Node Rebuild (Secondary)
- Clean, TypeScript-based codebase
- Rich documentation & examples
- Open-source alternative to obfuscated version

## 🗂️ Repository Structure

```
n8n-zalo-deobfuscated/
├── libs/
│   ├── apis/                 # 131 API functions (deobfuscated, renaming in progress)
│   ├── Errors/
│   ├── models/
│   ├── zalo.js               # Main Zalo class
│   ├── context.js            # Session context
│   └── utils.js              # Utilities
├── credentials/              # Credential definitions
├── nodes/                    # n8n node files
├── EXTENSION_PLAN.md         # Chrome Extension design
├── CONTEXT.md                # Session state & next steps
├── ISSUE.md                  # Progress log (this file)
└── README.md                 # Repo overview
```

## ✅ Implementation Progress

### Phase 1: Deobfuscation ✅ Completed
- Extracted all files from npm package
- Ran `synchrony` with rename/decrypt passes
- Formatted code with Prettier / js-beautify
- Maintained original structure for clarity

### Phase 2: Variable Renaming 🔄 50% Done (Quota-limited)
**Core files completed:**
- ~~sendMessage.js~~ ✅
- ~~listen.js (WebSocket)~~ ✅
- ~~uploadAttachment.js~~ ✅
- ~~login.js / loginQR.js~~ ✅
- ~~All friend/group management APIs~~ ✅ (see list below)

**Recent rename batch (Jan 7, 2026 – before quota limit):**
- addGroupBlockedMember.js
- addGroupDeputy.js
- addPollOptions.js
- addQuickMessage.js
- addUnreadMark.js
- blockViewFeed.js
- changeAccountAvatar.js
- changeFriendAlias.js
- changeGroupOwner.js
- createAutoReply.js
- createCatalog.js
- createNote.js
- createProductCatalog.js
- createReminder.js
- deleteAutoReply.js
- deleteAvatar.js
- deleteCatalog.js
- deleteChat.js
- deleteGroupInviteBox.js
- deleteProductCatalog.js
- disableGroupLink.js
- disperseGroup.js
- editNote.js
- editReminder.js
- enableGroupLink.js
- fetchAccountInfo.js
- getAliasList.js
- getArchivedChatList.js
- getAutoDeleteChat.js
- getAutoReplyList.js
- getAvatarList.js
- getBizAccount.js
- getCookie.js

**Next rename targets (quota pending):**
- `getCatalogList.js`
- `getContext.js`
- `getFriendBoardList.js`
- All remaining `get*.js`
- `update*.js` files
- `libs/utils.js`, `libs/zalo.js`
- `nodes/ZaloUser/*.js`

### Phase 3: Chrome Extension 📋 Planned
See `EXTENSION_PLAN.md` for detailed architecture, timeline, and UI flows.

Key features planned:
- Credential extraction popup (from Zalo Web)
- WebSocket listener via content script
- Dashboard for messages/logs
- Automation rules + webhook forwarding
- Integrations with n8n workflows

### Phase 4: TypeScript Conversion ⏳ Pending
- Convert JS files to TS (use zca-js as reference)
- Add type declarations for API models
- Build consistent module exports

### Phase 5: Documentation ⏳ Pending
- API reference per function
- Code examples (Node.js, browser, n8n)
- Extension usage guide

## 🔑 API Coverage Snapshot
| Category | Examples |
|----------|----------|
| Messaging | sendMessage, sendSticker, sendVoice, forwardMessage |
| Friends   | getAllFriends, findUser, sendFriendRequest |
| Groups    | createGroup, addUserToGroup, createPoll |
| Automation| addQuickMessage, createReminder, setMute |
| Real-time | listen (WebSocket), sendTypingEvent |

## 🔗 References
- [zca-js](https://github.com/RFS-ADRENO/zca-js) – Official TypeScript source
- [zca-js docs](https://tdung.gitbook.io/zca-js) – API documentation
- [ZaloDataExtractor](https://github.com/JustKemForFun/ZaloDataExtractor) – Chrome extension base

## ⚠️ Notes
1. Using unofficial APIs may violate Zalo ToS
2. Accounts can be locked/banned if abused
3. Only one web listener per account (avoid overlap)
4. Project is for research/educational purposes

## 📝 Changelog
### 2026-01-07
- Deobfuscated & pushed full repo to GitHub
- Created extension design plan
- Renamed 60+ API files to meaningful names
- Hit model quota after `getBizAccount.js` rename
- Saved context in `CONTEXT.md` for next session

### Next Actions (after quota refresh)
1. Continue Phase 2 renaming (restart at `getCatalogList.js`)
2. Start extension boilerplate (Manifest V3 + popup)
3. Port zca-js crypto/utils for browser environment
4. Build credential extraction workflow in popup

---
_Last updated: 2026-01-07 (pre-quota pause)_
