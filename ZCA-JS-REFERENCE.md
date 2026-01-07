# ZCA-JS API Reference for Deobfuscation

## Main Classes

### `Zalo` class (src/zalo.ts)
Constructor options:
```typescript
{
  apiType?: number,
  apiVersion?: number,
  polyfill?: fetch implementation,
  agent?: HTTP agent/proxy,
  imageMetadataGetter?: function
}
```

### Login Methods
- `login(credentials)` → cookie/imei/userAgent login
- `loginQR(options?, callback?)` → QR code login

### Credentials structure
```typescript
{
  imei: string,
  cookie: Cookie[],
  userAgent: string,
  language?: string
}
```

### Context (`ctx`) after login
```typescript
ctx.secretKey = loginInfo.zpw_enk  // AES encryption key
ctx.uid = loginInfo.uid
ctx.settings = serverInfo.settings
ctx.extraVer = serverInfo.extra_ver
ctx.loginInfo = loginInfo
```

---

## Post-Login API (`API` class in src/apis.ts)

Constructor:
```typescript
new API(ctx: ContextSession, zpwServiceMap: ZPWServiceMap, wsUrls: string[])
```

Key properties:
- `this.listener` - WebSocket listener for real-time updates
- `this.sendMessage` - Message sending function
- `api.zpwServiceMap` - Service routing URLs

---

## Message Sending (src/apis/sendMessage.ts)

### Service URLs from zpwServiceMap
```typescript
zpwServiceMap.chat[0]  // User messages
zpwServiceMap.group[0] // Group messages  
zpwServiceMap.file[0]  // File uploads
```

### API Endpoints
- User messages: `${chat}/api/message/sms`
- Group messages: `${group}/api/group/sendmsg`
- Mentions: `${group}/api/group/mention`
- Quotes: `*/quote`

### Attachment endpoints
- Images: `photo_original/send?`
- Video/files: `asyncfile/msg?`
- GIFs: `gif?`

### Encryption
All message payloads encrypted with:
```typescript
utils.encodeAES(JSON.stringify(params), ctx.secretKey)
```
- AES-CBC with zero IV
- Key is base64-decoded `zpw_enk` from login

---

## Login API (src/apis/login.ts)

### Endpoints
- `https://wpa.chat.zalo.me/api/login/getLoginInfo`
- `https://wpa.chat.zalo.me/api/login/getServerInfo`

### Key response fields
- `zpw_enk` → session encryption key
- `zpw_service_map_v3` → service routing map
- `zpw_ws` → WebSocket URLs
- `uid` → user ID

---

## Utility Functions (src/utils.ts)

### HTTP Request wrapper
```typescript
request(ctx, url, options)
```
- Injects headers (Cookie, User-Agent)
- Updates cookie jar from set-cookie
- Follows redirects

### Encryption functions
- `encodeAES(data, key)` - AES-CBC encryption
- `ParamsEncryptor` - Login param encryption

### UUID generation
```typescript
generateZaloUUID(userAgent) → imei
```

---

## Obfuscation Pattern Mapping

### Common obfuscated patterns → actual names
| Obfuscated Pattern | Actual Name |
|-------------------|-------------|
| `selfListen: true, checkUpdate: false` | Zalo constructor config |
| `zpw_enk` | ctx.secretKey |
| `zpw_service_map_v3` | service routing map |
| `zpw_ws` | WebSocket URLs |
| `/api/message/sms` | send user message |
| `/api/group/sendmsg` | send group message |
| `encodeAES` | message encryption |
| `getLoginInfo` | login API |
| `getServerInfo` | server info API |

---

## Repository
**Active source:** https://github.com/RFS-ADRENO/zca-js
