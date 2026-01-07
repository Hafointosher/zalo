# Zalo Deobfuscation Project – Progress & Plan

## Overview
Reverse-engineer `n8n-nodes-zalo-user-v3` to rebuild Zalo automation with full transparency, and port features into a Chrome/Edge extension plus clean TypeScript source.

Repo: https://github.com/Hafointosher/zalo  
Issue: https://github.com/Hafointosher/zalo/issues/1

## Current Status (2026-01-07 - Session 2)
- ✅ Deobfuscated all credentials & node files via synchrony.
- ✅ Formatted libs (170 files) and pushed codebase to GitHub.
- ✅ Created extension design plan (MV3 architecture, timeline, features).
- ✅ **Variable renaming: ~95% of `libs/apis/*.js` completed** with semantic names.
- ✅ **`libs/zalo.js` renamed** with readable variable names.
- ✅ **`nodes/ZaloUser/*.js` re-deobfuscated from minified source** - string arrays decoded!
- ⚠️ RC4 encryption layer still present in node files (obfuscator.io 2nd layer)
- ⏳ Next: Manual rename using zca-js reference OR dynamic deobfuscation

## Detailed Phases
| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Analyze original dist folder, document obfuscation levels | ✅ |
| 1 | Setup tools (prettier, js-beautify, synchrony) | ✅ |
| 2 | Format libs (minified only) | ✅ |
| 3 | Deobfuscate credentials and nodes (synchrony + rename) | ✅ |
| 4 | Plan documentation (ISSUE, CONTEXT, EXTENSION_PLAN) | ✅ |
| 5 | Push repo & issue to GitHub | ✅ |
| 6 | Rename vars in libs/apis (`serviceUrls`, `appContext`, ...) | ✅ |
| 6.5 | Rename vars in libs/zalo.js | ✅ |
| 7 | Deobfuscate + rename nodes/ZaloUser/*.js | ⚠️ Partial (strings decoded, RC4 layer present) |
| 8 | Build extension boilerplate (Manifest V3, popup) | ⏳ |
| 9 | Convert to TypeScript, add typings, docs | ⏳ |

## Files Renamed (libs/apis - 40+ files)
- All `get*` files: `getFriendOnlines`, `getFriendRecommendations`, `getGroupInfo`, `getSettings`, etc.
- All `update*` files: `updateSettings`, `updateProfile`, `updateLabels`, etc.
- Naming convention: `serviceUrls`, `appContext`, `api`, `endpoint`, `requestParams`, `encryptedParams`, `response`

## Next Actions
1. **Option A (Recommended):** Manual rename nodes using ZCA-JS-REFERENCE.md
2. **Option B:** Dynamic deobfuscation with runtime string capture
3. **Option C:** Skip nodes, use zca-js directly for extension
4. Start extension boilerplate: Manifest V3, popup UI skeleton
5. Port zca-js modules to browser (crypto, request, listener)
6. Convert to TypeScript and document APIs

## Key Files
- `libs/apis/*`: Zalo REST API wrappers (✅ renamed)
- `libs/utils.js`, `libs/zalo.js`: encryption, request factory, login handling (✅ renamed)
- `nodes/ZaloUser/*.node.js`: n8n node definitions (⚠️ strings decoded, RC4 layer present)
- `EXTENSION_PLAN.md`: Chrome/Edge extension spec
- `context.md`: current state and next steps
- `ZCA-JS-REFERENCE.md`: **NEW** - zca-js API structure for reference

## Tools Used
- synchrony CLI (`npx synchrony input.js -o output.js --rename`)
- prettier/js-beautify for formatting
- GitHub CLI for repo and issue management

## Risks & Notes
- Extension must respect Zalo session limits (one active web session).
- Unofficial API: subject to change / ban risk.
- When renaming, ensure consistent naming pattern across files for maintainability.

---
_Last update: 2026-01-07 (Session 2 - deobfuscated nodes from minified source)_
