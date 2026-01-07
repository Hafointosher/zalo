# n8n-nodes-zalo-user (Deobfuscated)

Zalo automation node for n8n - deobfuscated from `n8n-nodes-zalo-user-v3`.

## Status

- ✅ Deobfuscated using [synchrony](https://github.com/nicedayzhu/synchrony)
- 🔄 Variable renaming in progress
- ⏳ TypeScript conversion pending
- ⏳ API documentation pending

## Structure

```
libs/
├── apis/          # 131 API functions (sendMessage, login, etc.)
├── Errors/        # Custom error classes
├── models/        # Data models
├── utils.js       # Utility functions
└── zalo.js        # Main Zalo client

nodes/
└── ZaloUser/      # n8n node definitions

credentials/       # n8n credential definitions
```

## API Functions

Key APIs in `libs/apis/`:
- `login.js` - Authentication
- `sendMessage.js` - Send text/attachments
- `getAllFriends.js` - Get friend list
- `getAllGroups.js` - Get group list
- `getGroupInfo.js` - Get group details
- `uploadAttachment.js` - Upload files
- And 125+ more...

## Original Source

Deobfuscated from: `n8n-nodes-zalo-user-v3`

## License

For educational/research purposes.
