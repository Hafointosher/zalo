# n8n-nodes-zalo-user-v3 Deobfuscation Project

## 📋 Overview

This project aims to reverse-engineer and deobfuscate the `n8n-nodes-zalo-user-v3` npm package - a custom n8n community node for automating Zalo (Vietnamese messaging app) via browser simulation.

**Original Package:** [n8n-nodes-zalo-user-v3](https://www.npmjs.com/package/n8n-nodes-zalo-user-v3)  
**Version:** 0.0.67  
**License:** MIT

## 🎯 Goals

1. Understand the internal workings of the Zalo automation node
2. Deobfuscate and document the codebase
3. Potentially create an open-source alternative or contribute improvements

## 📁 Project Structure

### Original Structure (Obfuscated)
```
n8n-nodes-zalo-user-v3/dist/
├── credentials/
│   ├── ZaloBotApi.credentials.js (24KB - obfuscated)
│   ├── ZaloOACredentialsApi.credentials.js (22KB - obfuscated)
│   └── ZaloUserCredentialsApi.credentials.js (30KB - obfuscated)
└── nodes/
    ├── ZaloBot/
    │   ├── ZaloBot.node.js (100KB - obfuscated)
    │   ├── ZaloBotTrigger.node.js (30KB - obfuscated)
    │   ├── GenericFunctions.js (29KB - obfuscated)
    │   └── IEvent.js (20KB - obfuscated)
    ├── ZaloOA/
    │   ├── ZaloOA.node.js (241KB - obfuscated)
    │   └── ZaloOATrigger.node.js (45KB - obfuscated)
    └── ZaloUser/
        ├── libs/ (170 files - minified only, readable)
        │   ├── apis/ (130+ API functions)
        │   ├── Errors/
        │   ├── models/
        │   ├── zalo.js
        │   ├── context.js
        │   └── utils.js
        ├── ZaloUser.node.js (58KB - obfuscated)
        ├── ZaloUserInteract.node.js (142KB - obfuscated)
        ├── ZaloUserLogin.node.js (26KB - obfuscated)
        ├── ZaloManager.node.js (52KB - obfuscated)
        ├── ZaloApi.js (45KB - obfuscated)
        ├── utils.js (51KB - obfuscated)
        └── error.js (21KB - obfuscated)
```

## ✅ Implementation Progress

### Phase 1: Setup Tools ✅ COMPLETED
- [x] Created working directory: `n8n-zalo-deobfuscated`
- [x] Installed `prettier` for code formatting
- [x] Installed `js-beautify` for beautification
- [x] Installed `synchrony` for deobfuscation

### Phase 2: Deobfuscate libs/ ✅ COMPLETED
- [x] Copied 170 files from `libs/` directory
- [x] Formatted with Prettier
- [x] Files are now fully readable (were only minified, not obfuscated)

**Key discoveries in libs/:**
- `zalo.js` - Main Zalo class with `login()`, `loginCookie()`, `loginQR()` methods
- `apis/` - 130+ API functions (sendMessage, getAllFriends, createGroup, etc.)
- Uses `tough-cookie` for cookie management
- AES encryption for API requests

### Phase 3: Deobfuscate Obfuscated Files ✅ COMPLETED
- [x] credentials/*.js (3 files)
- [x] ZaloUser.node.js
- [x] ZaloUserInteract.node.js (largest - 142KB)
- [x] ZaloUserLogin.node.js
- [x] ZaloManager.node.js
- [x] ZaloBot/*.js (4 files)
- [x] ZaloOA/*.js (2 files)

**Deobfuscation method used:**
```bash
npx synchrony "input.js" -o "output.js" --rename
```

**Synchrony transformations applied:**
1. StringDecoder - Decoded string arrays
2. ControlFlow - Removed control flow flattening
3. DeadCode - Removed dead code
4. Rename - Renamed variables to readable names
5. Simplify - Simplified expressions

### Phase 4: Restructure Code ⏳ PENDING
- [ ] Manual review and rename variables to meaningful names
- [ ] Document function purposes
- [ ] Create clean module structure

### Phase 5: TypeScript Conversion ⏳ PENDING
- [ ] Convert deobfuscated JS to TypeScript
- [ ] Add proper type definitions
- [ ] Create compilable source

## 📊 Obfuscation Analysis

The package uses `javascript-obfuscator` with these techniques:
- **String Array Encoding** - Strings stored in encoded arrays
- **String Array Rotation** - Arrays shuffled at runtime
- **Control Flow Flattening** - Switch-case state machines
- **Dead Code Injection** - Fake code paths
- **Variable Renaming** - Names like `a12_0x5e07`, `a13_0x225c`
- **RC4 String Decryption** - Runtime string decoding

## 🔑 Key Features Discovered

| Category | Features |
|----------|----------|
| **Message** | Send text, stickers, voice, attachments, mentions, quotes |
| **Friend** | Send/accept friend requests, find by phone |
| **Group** | Create/manage groups, add/remove members, polls, reminders |
| **Get** | Retrieve friends list, groups, user/group info |
| **Tool** | Text-to-Speech (TTS) |

### Authentication Methods
- Cookie-based login
- QR code login
- Proxy support (Premium)

### API Endpoints (130+)
- sendMessage, sendSticker, sendVoice
- getAllFriends, getAllGroups
- createGroup, disperseGroup
- addUserToGroup, removeUserFromGroup
- createPoll, votePoll, lockPoll
- sendFriendRequest, acceptFriendRequest
- And many more...

## ⚠️ Warnings

1. **Zalo ToS Violation** - Using this may violate Zalo's policies
2. **Account Risk** - May result in account restrictions/bans
3. **Single Session** - Zalo only allows one active browser session
4. **Unofficial API** - No official support, may break anytime

## 📂 Output Location

Deobfuscated files: `C:\Users\Hafointosher\Desktop\n8n-zalo-deobfuscated`

```
n8n-zalo-deobfuscated/
├── libs/                    # 170 files (readable)
├── credentials/             # 3 files (deobfuscated)
├── nodes/
│   ├── ZaloUser/           # 6 files (deobfuscated)
│   ├── ZaloBot/            # 4 files (deobfuscated)
│   └── ZaloOA/             # 2 files (deobfuscated)
├── deobfuscate.js          # Deobfuscation script
├── deobfuscate-all.bat     # Batch script
└── package.json
```

## 🔧 Tools Used

- **synchrony** - JavaScript deobfuscator for javascript-obfuscator output
- **prettier** - Code formatter
- **js-beautify** - JavaScript beautifier

## 📝 Next Steps

1. Manual variable renaming based on context
2. Document each API function
3. Create TypeScript definitions
4. Build a clean, documented version
5. Consider creating an open-source alternative

## 📚 References

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Original Package README](https://www.npmjs.com/package/n8n-nodes-zalo-user-v3)
- [zca-js](https://www.npmjs.com/package/zca-js) - Related Zalo API library
