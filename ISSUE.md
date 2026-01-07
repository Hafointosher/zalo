# Zalo Deobfuscation Project – Progress & Plan

## Overview
Reverse-engineer `n8n-nodes-zalo-user-v3` to rebuild Zalo automation with full transparency, and port features into a Chrome/Edge extension plus clean TypeScript source.

Repo: https://github.com/Hafointosher/zalo  
Issue: https://github.com/Hafointosher/zalo/issues/1

## Current Status (2026-01-07)
- ✅ Deobfuscated all credentials & node files via synchrony.
- ✅ Formatted libs (170 files) and pushed codebase to GitHub.
- ✅ Created extension design plan (MV3 architecture, timeline, features).
- 🔄 Variable renaming: ~50% of `libs/apis/*.js` completed; paused due to quota limit.
- ⏳ Next tasks: finish rename → convert to TypeScript → implement extension boilerplate.

## Detailed Phases
| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Analyze original dist folder, document obfuscation levels | ✅ |
| 1 | Setup tools (prettier, js-beautify, synchrony) | ✅ |
| 2 | Format libs (minified only) | ✅ |
| 3 | Deobfuscate credentials and nodes (synchrony + rename) | ✅ |
| 4 | Plan documentation (ISSUE, CONTEXT, EXTENSION_PLAN) | ✅ |
| 5 | Push repo & issue to GitHub | ✅ |
| 6 | Rename vars in libs/apis (`serviceUrls`, `appContext`, ...) | 🔄 (paused at quota) |
| 7 | Build extension boilerplate (Manifest V3, popup) | ⏳ |
| 8 | Convert to TypeScript, add typings, docs | ⏳ |

## Files Renamed So Far (~50%)
- Core messaging/auth: `sendMessage.js`, `listen.js`, `login.js`, `uploadAttachment.js`.
- Friend & group operations: `addUserToGroup.js`, `removeUserFromGroup.js`, `createGroup.js`, etc.
- Media & automation: `sendVoice.js`, `createPoll.js`, `setMute.js`, ...
- Recent batch (upon hitting quota): `getAliasList.js`, `getBizAccount.js`, `fetchAccountInfo.js`, `createAutoReply.js`, etc. (see repo history).

## Quota Pause Notes
- Renaming halted at `libs/apis/getCatalogList.js` due to 429 model quota.
- Extension work and local scripting can continue without quota.

## Next Actions
1. After quota reset: continue renaming remaining APIs, then `libs/utils.js`, `libs/zalo.js`, `nodes/ZaloUser/*`.
2. Start extension boilerplate: Manifest V3, popup UI skeleton, credential extraction.
3. Port zca-js modules to browser (crypto, request, listener).
4. Convert to TypeScript and document APIs.

## Key Files
- `libs/apis/*`: Zalo REST API wrappers.
- `libs/utils.js`, `libs/zalo.js`: encryption, request factory, login handling.
- `nodes/ZaloUser/*.node.js`: n8n node definitions.
- `EXTENSION_PLAN.md`: Chrome/Edge extension spec.
- `CONTEXT.md`: current state and next steps.

## Tools Used
- synchrony CLI (`npx synchrony input.js -o output.js --rename`)
- prettier/js-beautify for formatting
- GitHub CLI for repo and issue management

## Risks & Notes
- Extension must respect Zalo session limits (one active web session).
- Unofficial API: subject to change / ban risk.
- When renaming, ensure consistent naming pattern across files for maintainability.

---
_Last update: 2026-01-07 (quota pause)_
