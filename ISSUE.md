# n8n-nodes-zalo-user-v3 Deobfuscation Project

## 📋 Overview

This project aims to reverse-engineer and deobfuscate the `n8n-nodes-zalo-user-v3` npm package - a custom n8n community node for automating Zalo (Vietnamese messaging app) via browser simulation.

**Original Package:** [n8n-nodes-zalo-user-v3](https://www.npmjs.com/package/n8n-nodes-zalo-user-v3)  
**Version:** 0.0.67  
**License:** MIT  
**GitHub:** https://github.com/Hafointosher/zalo

## 🎯 Project Goals

### Primary Goal: Chrome/Edge Extension
Build a comprehensive Zalo automation extension with:
- Credential extraction (IMEI, Cookies, User-Agent)
- Message management & automation
- Contact/Group management
- Webhook integration for n8n/external services

### Secondary Goal: n8n Node Rebuild
- Clean, documented TypeScript codebase
- Open-source alternative to obfuscated package

## 📁 Project Structure

```
n8n-zalo-deobfuscated/
├── libs/                    # 170 files (deobfuscated + renamed)
│   ├── apis/               # 131 API functions
│   ├── Errors/             # Error classes
│   ├── models/             # Data models
│   ├── zalo.js             # Main Zalo class
│   ├── context.js          # Session context
│   └── utils.js            # Utilities
├── credentials/             # 3 files (deobfuscated)
├── nodes/
│   ├── ZaloUser/           # 6 files (deobfuscated)
│   ├── ZaloBot/            # 4 files (deobfuscated)
│   └── ZaloOA/             # 2 files (deobfuscated)
├── EXTENSION_PLAN.md       # Chrome Extension design plan
├── ISSUE.md                # This file
└── README.md               # Project overview
```

## ✅ Implementation Progress

### Phase 1: Deobfuscation ✅ COMPLETED
- [x] Setup deobfuscation tools (synchrony, prettier)
- [x] Deobfuscated all 193 files
- [x] Pushed to GitHub: https://github.com/Hafointosher/zalo

### Phase 2: Variable Renaming 🔄 IN PROGRESS (~40%)

**Completed files:**
- [x] `libs/apis/login.js`
- [x] `libs/apis/getUserInfo.js`
- [x] `libs/apis/sendMessage.js` ⭐ (complex, 460+ lines)
- [x] `libs/apis/listen.js` ⭐ (WebSocket listener)
- [x] `libs/apis/getAllFriends.js`
- [x] `libs/apis/getAllGroups.js`
- [x] `libs/apis/getGroupInfo.js`
- [x] `libs/apis/uploadAttachment.js`
- [x] `libs/apis/addReaction.js`
- [x] `libs/apis/createGroup.js`
- [x] `libs/apis/deleteMessage.js`
- [x] `libs/apis/sendFriendRequest.js`
- [x] `libs/apis/findUser.js`
- [x] `libs/apis/forwardMessage.js`
- [x] `libs/apis/sendSticker.js`
- [x] `libs/apis/changeGroupName.js`
- [x] `libs/apis/addUserToGroup.js`
- [x] `libs/apis/removeUserFromGroup.js`
- [x] `libs/apis/leaveGroup.js`
- [x] `libs/apis/blockUser.js`
- [x] `libs/apis/unblockUser.js`
- [x] `libs/apis/acceptFriendRequest.js`
- [x] `libs/apis/rejectFriendRequest.js`
- [x] `libs/apis/removeFriend.js`
- [x] `libs/apis/sendLink.js`
- [x] `libs/apis/sendVoice.js`
- [x] `libs/apis/sendVideo.js`
- [x] `libs/apis/getGroupMembersInfo.js`
- [x] `libs/apis/changeGroupAvatar.js`
- [x] `libs/apis/createPoll.js`
- [x] `libs/apis/setMute.js`
- [x] `libs/apis/setPinnedConversations.js`
- [x] `libs/apis/updateGroupSettings.js`

**Naming conventions used:**
| Original | Renamed |
|----------|---------|
| `e, r, t` (factory params) | `serviceUrls, appContext, api` |
| `i, o, a` (URLs) | `endpoint, apiUrl` |
| Request objects | `requestParams` |
| Encrypted data | `encryptedParams` |
| API responses | `response` |

### Phase 3: Chrome Extension 📋 PLANNED

See [EXTENSION_PLAN.md](./EXTENSION_PLAN.md) for detailed design.

**Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                  Chrome/Edge Extension                   │
├─────────────┬─────────────┬─────────────┬───────────────┤
│   Popup UI  │  Dashboard  │   Service   │    Content    │
│   (Quick    │   (Full     │   Worker    │    Script     │
│   Actions)  │    UI)      │ (Background)│  (Injector)   │
└─────────────┴─────────────┴─────────────┴───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    Zalo Web APIs                         │
│  • REST APIs (chat, group, friend)                       │
│  • WebSocket (real-time messages)                        │
│  • localStorage (IMEI, session)                          │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  • Webhook endpoints                                     │
│  • n8n automation workflows                              │
└─────────────────────────────────────────────────────────┘
```

**Timeline:**
| Week | Phase | Tasks |
|------|-------|-------|
| 1-2 | Foundation | Manifest V3, credential extraction, popup UI |
| 3-4 | Core API | Port zca-js to browser, WebSocket listener |
| 5-6 | Dashboard | Full UI, message feed, export features |
| 7-8 | Automation | Webhooks, auto-reply, scheduling |
| 9-10 | Polish | Testing, i18n, documentation, publish |

### Phase 4: TypeScript Conversion ⏳ PENDING
- [ ] Convert deobfuscated JS to TypeScript
- [ ] Add proper type definitions
- [ ] Create compilable source

### Phase 5: Documentation ⏳ PENDING
- [ ] Document each API function
- [ ] Create usage examples
- [ ] Write developer guide

## 🔑 Key API Functions (131 total)

### Messaging
| Function | Description |
|----------|-------------|
| `sendMessage` | Send text, attachments, mentions, quotes |
| `sendSticker` | Send stickers |
| `sendVoice` | Send voice messages |
| `sendVideo` | Send video files |
| `sendLink` | Send link previews |
| `forwardMessage` | Forward messages |
| `deleteMessage` | Delete messages |
| `addReaction` | React to messages |

### Friends
| Function | Description |
|----------|-------------|
| `getAllFriends` | Get friends list |
| `getUserInfo` | Get user profile |
| `findUser` | Search by phone number |
| `sendFriendRequest` | Send friend request |
| `acceptFriendRequest` | Accept friend request |
| `removeFriend` | Unfriend user |
| `blockUser` / `unblockUser` | Block/unblock |

### Groups
| Function | Description |
|----------|-------------|
| `getAllGroups` | Get groups list |
| `getGroupInfo` | Get group details |
| `createGroup` | Create new group |
| `addUserToGroup` | Add members |
| `removeUserFromGroup` | Remove members |
| `changeGroupName` | Rename group |
| `changeGroupAvatar` | Update avatar |
| `createPoll` | Create poll |
| `updateGroupSettings` | Change settings |

### Real-time
| Function | Description |
|----------|-------------|
| `listen` | WebSocket message listener |
| `sendTypingEvent` | Typing indicator |
| `sendSeenEvent` | Mark as seen |

## 🔗 Related Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **zca-js** | https://github.com/RFS-ADRENO/zca-js | Official Zalo API library (TypeScript) |
| **zca-js Docs** | https://tdung.gitbook.io/zca-js | API documentation |
| **ZaloDataExtractor** | https://github.com/JustKemForFun/ZaloDataExtractor | Reference Chrome extension |
| **This Project** | https://github.com/Hafointosher/zalo | Deobfuscated source |

## ⚠️ Warnings & Disclaimers

1. **Zalo ToS** - Using unofficial APIs may violate Zalo's Terms of Service
2. **Account Risk** - May result in account restrictions or bans
3. **Single Session** - Zalo only allows one active browser session per account
4. **Unofficial API** - No official support, may break with Zalo updates
5. **Educational Purpose** - This project is for learning and research only

## 📝 Changelog

### 2026-01-07
- ✅ Deobfuscated all 193 files using synchrony
- ✅ Pushed to GitHub (https://github.com/Hafointosher/zalo)
- ✅ Renamed variables in 30+ key API files
- ✅ Created Chrome Extension design plan
- 🔄 Variable renaming in progress (~40%)

### Next Actions
1. Continue renaming remaining API files
2. Create extension boilerplate (Manifest V3)
3. Port zca-js crypto/utils to browser
4. Build popup UI with credential extraction

---

*Last updated: January 7, 2026*
*Maintainer: Hafointosher*
