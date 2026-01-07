var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, r, n) {
          void 0 === n && (n = r);
          var o = Object.getOwnPropertyDescriptor(t, r);
          ((o &&
            ("get" in o ? t.__esModule : !o.writable && !o.configurable)) ||
            (o = {
              enumerable: !0,
              get: function () {
                return t[r];
              },
            }),
            Object.defineProperty(e, n, o));
        }
      : function (e, t, r, n) {
          e[(n = void 0 === n ? r : n)] = t[r];
        }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, t) {
          Object.defineProperty(e, "default", { enumerable: !0, value: t });
        }
      : function (e, t) {
          e.default = t;
        }),
  __importStar =
    (this && this.__importStar) ||
    (() => {
      var o = function (e) {
        return (o =
          Object.getOwnPropertyNames ||
          function (e) {
            var t,
              r = [];
            for (t in e)
              Object.prototype.hasOwnProperty.call(e, t) && (r[r.length] = t);
            return r;
          })(e);
      };
      return function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var r = o(e), n = 0; n < r.length; n++)
            "default" !== r[n] && __createBinding(t, e, r[n]);
        return (__setModuleDefault(t, e), t);
      };
    })(),
  __importDefault =
    (this && this.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.logger = exports.ParamsEncryptor = exports.isBun = void 0),
  (exports.hasOwn = hasOwn),
  (exports.getSignKey = getSignKey),
  (exports.makeURL = makeURL),
  (exports.decryptResp = decryptResp),
  (exports.decodeBase64ToBuffer = decodeBase64ToBuffer),
  (exports.decodeUnit8Array = decodeUnit8Array),
  (exports.encodeAES = encodeAES),
  (exports.decodeAES = decodeAES),
  (exports.getDefaultHeaders = getDefaultHeaders),
  (exports.request = request),
  (exports.getImageMetaData = getImageMetaData),
  (exports.getFileSize = getFileSize),
  (exports.getGifMetaData = getGifMetaData),
  (exports.decodeEventData = decodeEventData),
  (exports.getMd5LargeFileObject = getMd5LargeFileObject),
  (exports.getClientMessageType = getClientMessageType),
  (exports.strPadLeft = strPadLeft),
  (exports.formatTime = formatTime),
  (exports.getFullTimeFromMillisecond = getFullTimeFromMillisecond),
  (exports.getFileExtension = getFileExtension),
  (exports.getFileName = getFileName),
  (exports.removeUndefinedKeys = removeUndefinedKeys),
  (exports.getGroupEventType = getGroupEventType),
  (exports.getFriendEventType = getFriendEventType),
  (exports.handleZaloResponse = handleZaloResponse),
  (exports.resolveResponse = resolveResponse),
  (exports.apiFactory = apiFactory),
  (exports.generateZaloUUID = generateZaloUUID),
  (exports.encryptPin = encryptPin),
  (exports.validatePin = validatePin),
  (exports.hexToNegativeColor = hexToNegativeColor),
  (exports.negativeColorToHex = negativeColorToHex));
let crypto_js_1 = __importDefault(require("crypto-js")),
  node_crypto_1 = __importDefault(require("node:crypto")),
  node_fs_1 = __importDefault(require("node:fs")),
  node_path_1 = __importDefault(require("node:path")),
  pako_1 = __importDefault(require("pako")),
  spark_md5_1 = __importDefault(require("spark-md5")),
  toughCookie = __importStar(require("tough-cookie")),
  json_bigint_1 = __importDefault(require("json-bigint")),
  context_js_1 = require("./context.js"),
  index_js_1 = require("./Errors/index.js"),
  FriendEvent_js_1 = require("./models/FriendEvent.js"),
  GroupEvent_js_1 = require("./models/GroupEvent.js"),
  sharp_1 = __importDefault(require("sharp"));
function hasOwn(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function getSignKey(e, t) {
  var r,
    n = [];
  for (r in t) hasOwn(t, r) && n.push(r);
  n.sort();
  let o = "zsecure" + e;
  for (let e = 0; e < n.length; e++) o += t[n[e]];
  return crypto_js_1.default.MD5(o).toString();
}
function makeURL(e, t, r = {}, n = !0) {
  var o,
    a = new URL(t);
  for (o in r) hasOwn(r, o) && a.searchParams.append(o, r[o].toString());
  return (
    n &&
      (a.searchParams.has("zpw_ver") ||
        a.searchParams.set("zpw_ver", e.API_VERSION.toString()),
      a.searchParams.has("zpw_type") ||
        a.searchParams.set("zpw_type", e.API_TYPE.toString())),
    a.toString()
  );
}
exports.isBun = "undefined" != typeof Bun;
class ParamsEncryptor {
  constructor({ type: e, imei: t, firstLaunchTime: r }) {
    ((this.zcid = null),
      (this.enc_ver = "v2"),
      (this.zcid = null),
      (this.encryptKey = null),
      this.createZcid(e, t, r),
      (this.zcid_ext = ParamsEncryptor.randomString()),
      this.createEncryptKey());
  }
  getEncryptKey() {
    if (this.encryptKey) return this.encryptKey;
    throw new index_js_1.ZaloApiError(
      "getEncryptKey: didn't create encryptKey yet",
    );
  }
  createZcid(e, t, r) {
    if (!e || !t || !r)
      throw new index_js_1.ZaloApiError("createZcid: missing params");
    ((e = e + `,${t},` + r),
      (t = ParamsEncryptor.encodeAES(
        "3FC4F0D2AB50057BCE0D90D9187A22B1",
        e,
        "hex",
        !0,
      )));
    this.zcid = t;
  }
  createEncryptKey(e = 0) {
    var t = (e, t) => {
      var e = ParamsEncryptor.processStr(e).even,
        { even: t, odd: r } = ParamsEncryptor.processStr(t);
      return (
        !!(e && t && r) &&
        ((e =
          e.slice(0, 8).join("") +
          t.slice(0, 12).join("") +
          r.reverse().slice(0, 12).join("")),
        (this.encryptKey = e),
        !0)
      );
    };
    if (!this.zcid || !this.zcid_ext)
      throw new index_js_1.ZaloApiError(
        "createEncryptKey: zcid or zcid_ext is null",
      );
    try {
      if (
        t(
          crypto_js_1.default.MD5(this.zcid_ext).toString().toUpperCase(),
          this.zcid,
        ) ||
        !(e < 3)
      )
        return !1;
      this.createEncryptKey(e + 1);
    } catch {
      e < 3 && this.createEncryptKey(e + 1);
    }
    return !0;
  }
  getParams() {
    return this.zcid
      ? { zcid: this.zcid, zcid_ext: this.zcid_ext, enc_ver: this.enc_ver }
      : null;
  }
  static processStr(e) {
    var t;
    return e && "string" == typeof e
      ? (([e, t] = [...e].reduce((e, t, r) => (e[r % 2].push(t), e), [[], []])),
        { even: e, odd: t })
      : { even: null, odd: null };
  }
  static randomString(e, t) {
    var r = e || 6,
      e = t && e && e < t ? t : 12;
    let n = Math.floor(Math.random() * (e - r + 1)) + r;
    if (12 < n) {
      let e = "";
      for (; 0 < n; )
        ((e += Math.random()
          .toString(16)
          .substr(2, 12 < n ? 12 : n)),
          (n -= 12));
      return e;
    }
    return Math.random().toString(16).substr(2, n);
  }
  static encodeAES(e, t, r, n, o = 0) {
    if (!t) return null;
    try {
      var a =
          "hex" == r
            ? crypto_js_1.default.enc.Hex
            : crypto_js_1.default.enc.Base64,
        i = crypto_js_1.default.enc.Utf8.parse(e),
        s = { words: [0, 0, 0, 0], sigBytes: 16 },
        p = crypto_js_1.default.AES.encrypt(t, i, {
          iv: s,
          mode: crypto_js_1.default.mode.CBC,
          padding: crypto_js_1.default.pad.Pkcs7,
        }).ciphertext.toString(a);
      return n ? p.toUpperCase() : p;
    } catch {
      return o < 3 ? ParamsEncryptor.encodeAES(e, t, r, n, o + 1) : null;
    }
  }
}
function decryptResp(e, t) {
  let r = null;
  try {
    return ((r = decodeRespAES(e, t)), JSON.parse(r));
  } catch {
    return r;
  }
}
function decodeRespAES(e, t) {
  t = decodeURIComponent(t);
  e = crypto_js_1.default.enc.Utf8.parse(e);
  return crypto_js_1.default.AES.decrypt(
    { ciphertext: crypto_js_1.default.enc.Base64.parse(t) },
    e,
    {
      iv: { words: [0, 0, 0, 0], sigBytes: 16 },
      mode: crypto_js_1.default.mode.CBC,
      padding: crypto_js_1.default.pad.Pkcs7,
    },
  ).toString(crypto_js_1.default.enc.Utf8);
}
function decodeBase64ToBuffer(e) {
  return Buffer.from(e, "base64");
}
function decodeUnit8Array(e) {
  try {
    return new TextDecoder().decode(e);
  } catch {
    return null;
  }
}
function encodeAES(e, t, r = 0) {
  try {
    var n = crypto_js_1.default.enc.Base64.parse(e);
    return crypto_js_1.default.AES.encrypt(t, n, {
      iv: crypto_js_1.default.enc.Hex.parse("00000000000000000000000000000000"),
      mode: crypto_js_1.default.mode.CBC,
      padding: crypto_js_1.default.pad.Pkcs7,
    }).ciphertext.toString(crypto_js_1.default.enc.Base64);
  } catch {
    return r < 3 ? encodeAES(e, t, r + 1) : null;
  }
}
function decodeAES(e, t, r = 0) {
  try {
    t = decodeURIComponent(t);
    var n = crypto_js_1.default.enc.Base64.parse(e);
    return crypto_js_1.default.AES.decrypt(
      { ciphertext: crypto_js_1.default.enc.Base64.parse(t) },
      n,
      {
        iv: crypto_js_1.default.enc.Hex.parse(
          "00000000000000000000000000000000",
        ),
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
      },
    ).toString(crypto_js_1.default.enc.Utf8);
  } catch {
    return r < 3 ? decodeAES(e, t, r + 1) : null;
  }
}
async function getDefaultHeaders(e, t = "https://chat.zalo.me") {
  if (!e.cookie) throw new index_js_1.ZaloApiError("Cookie is not available");
  if (e.userAgent)
    return {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      Cookie: await e.cookie.getCookieString(t),
      Origin: "https://chat.zalo.me",
      Referer: "https://chat.zalo.me/",
      "User-Agent": e.userAgent,
    };
  throw new index_js_1.ZaloApiError("User agent is not available");
}
async function request(t, e, r, n = !1) {
  t.cookie || (t.cookie = new toughCookie.CookieJar());
  var o,
    a = new URL(e).origin,
    i = await getDefaultHeaders(t, a),
    i =
      (n ||
        (r
          ? (r.headers = Object.assign(i, r.headers || {}))
          : (r = { headers: i })),
      {
        ...(null != r ? r : {}),
        ...(exports.isBun
          ? {
              proxy:
                null == (i = null == (i = t.options.agent) ? void 0 : i.proxy)
                  ? void 0
                  : i.href,
            }
          : { agent: t.options.agent }),
      }),
    e = await t.options.polyfill(e, i),
    i = e.headers.get("set-cookie");
  if (i && !n)
    for (o of i.split(", ")) {
      var s = toughCookie.Cookie.parse(o);
      try {
        s &&
          (await t.cookie.setCookie(
            s,
            "zalo.me" != s.domain ? "https://" + s.domain : a,
          ));
      } catch (e) {
        (0, exports.logger)(t).error(e);
      }
    }
  i = e.headers.get("location");
  return i
    ? (((r = { ...r }).method = "GET"),
      n ||
        ((r.headers = new Headers(r.headers)),
        r.headers.set("Referer", "https://id.zalo.me/")),
      request(t, i, r))
    : e;
}
async function getImageMetaData(e, t) {
  var r = await node_fs_1.default.promises.readFile(t),
    r = await (0, sharp_1.default)(r).metadata();
  return {
    fileName: t.split("/").pop(),
    totalSize: r.size,
    width: r.width,
    height: r.height,
  };
}
async function getFileSize(e) {
  return node_fs_1.default.promises.stat(e).then((e) => e.size);
}
async function getGifMetaData(e, t) {
  if (!e.options.imageMetadataGetter)
    throw new index_js_1.ZaloApiMissingImageMetadataGetter();
  e = await e.options.imageMetadataGetter(t);
  if (e)
    return {
      fileName: node_path_1.default.basename(t),
      totalSize: e.size,
      width: e.width,
      height: e.height,
    };
  throw new index_js_1.ZaloApiError("Failed to get gif metadata");
}
async function decodeEventData(e, t) {
  if ("string" != typeof e.data)
    throw new index_js_1.ZaloApiError(
      "Invalid data, expected string but got " + typeof e.data,
    );
  if ("number" != typeof e.encrypt)
    throw new index_js_1.ZaloApiError(
      "Invalid encrypt type, expected number but got " + typeof e.encrypt,
    );
  if (e.encrypt < 0 || 3 < e.encrypt)
    throw new index_js_1.ZaloApiError(
      "Invalid encrypt type, expected 0-3 but got " + e.encrypt,
    );
  var r = e.data,
    e = e.encrypt;
  if (0 === e) return JSON.parse(r);
  r = decodeBase64ToBuffer(1 === e ? r : decodeURIComponent(r));
  let n = r;
  if (1 !== e) {
    if (!(t && 48 <= r.length))
      throw new index_js_1.ZaloApiError(
        "Invalid data length or missing cipher key",
      );
    var o = {
        name: "AES-GCM",
        iv: r.subarray(0, 16),
        tagLength: 128,
        additionalData: r.subarray(16, 32),
      },
      r = r.subarray(32),
      t = await node_crypto_1.default.subtle.importKey(
        "raw",
        decodeBase64ToBuffer(t),
        o,
        !1,
        ["decrypt"],
      );
    n = await node_crypto_1.default.subtle.decrypt(o, t, r);
  }
  o = decodeUnit8Array(3 === e ? new Uint8Array(n) : pako_1.default.inflate(n));
  return o ? json_bigint_1.default.parse(o) : void 0;
}
async function getMd5LargeFileObject(e, p) {
  let d =
    "string" == typeof e
      ? await node_fs_1.default.promises.readFile(e)
      : e.data;
  return new Promise((n) => {
    let o = 0,
      a = 2097152,
      i = Math.ceil(p / a),
      s = new spark_md5_1.default.ArrayBuffer();
    !(function e() {
      var t = o * a,
        r = t + a >= p ? p : t + a;
      (s.append(new Uint8Array(d.subarray(t, r)).buffer),
        ++o < i ? e() : n({ currentChunk: o, data: s.end() }));
    })();
  });
}
exports.ParamsEncryptor = ParamsEncryptor;
let logger = (r) => ({
  verbose: (...e) => {
    r.options.logging && console.log("[35m🚀 VERBOSE[0m", ...e);
  },
  info: (...e) => {
    r.options.logging && console.log("[34mINFO[0m", ...e);
  },
  warn: (...e) => {
    r.options.logging && console.log("[33mWARN[0m", ...e);
  },
  error: (...e) => {
    r.options.logging && console.log("[31mERROR[0m", ...e);
  },
  success: (...e) => {
    r.options.logging && console.log("[32mSUCCESS[0m", ...e);
  },
  timestamp: (...e) => {
    var t = new Date().toISOString();
    r.options.logging && console.log(`[90m[${t}][0m`, ...e);
  },
});
function getClientMessageType(e) {
  return "webchat" === e
    ? 1
    : "chat.voice" === e
      ? 31
      : "chat.photo" === e
        ? 32
        : "chat.sticker" === e
          ? 36
          : "chat.doodle" === e
            ? 37
            : "chat.recommended" === e || "chat.link" === e
              ? 38
              : "chat.video.msg" === e
                ? 44
                : "share.file" === e
                  ? 46
                  : "chat.gif" === e
                    ? 49
                    : "chat.location.new" === e
                      ? 43
                      : 1;
}
function strPadLeft(e, t, r) {
  var n = (e = "" + e).length;
  return n === r ? e : r < n ? e.slice(-r) : t.repeat(r - n) + e;
}
function formatTime(e, t = Date.now()) {
  var t = new Date(t),
    r = new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(t);
  return e.includes("%H") || e.includes("%d")
    ? e
        .replace("%H", t.getHours().toString().padStart(2, "0"))
        .replace("%M", t.getMinutes().toString().padStart(2, "0"))
        .replace("%S", t.getSeconds().toString().padStart(2, "0"))
        .replace("%d", t.getDate().toString().padStart(2, "0"))
        .replace("%m", (t.getMonth() + 1).toString().padStart(2, "0"))
        .replace("%Y", t.getFullYear().toString())
    : r;
}
function getFullTimeFromMillisecond(e) {
  e = new Date(e);
  return (
    strPadLeft(e.getHours(), "0", 2) +
    ":" +
    strPadLeft(e.getMinutes(), "0", 2) +
    " " +
    strPadLeft(e.getDate(), "0", 2) +
    "/" +
    strPadLeft(e.getMonth() + 1, "0", 2) +
    "/" +
    e.getFullYear()
  );
}
function getFileExtension(e) {
  return node_path_1.default.extname(e).slice(1);
}
function getFileName(e) {
  return node_path_1.default.basename(e);
}
function removeUndefinedKeys(e) {
  for (var t in e) void 0 === e[t] && delete e[t];
  return e;
}
function getGroupEventType(e) {
  return "join_request" == e
    ? GroupEvent_js_1.GroupEventType.JOIN_REQUEST
    : "join" == e
      ? GroupEvent_js_1.GroupEventType.JOIN
      : "leave" == e
        ? GroupEvent_js_1.GroupEventType.LEAVE
        : "remove_member" == e
          ? GroupEvent_js_1.GroupEventType.REMOVE_MEMBER
          : "block_member" == e
            ? GroupEvent_js_1.GroupEventType.BLOCK_MEMBER
            : "update_setting" == e
              ? GroupEvent_js_1.GroupEventType.UPDATE_SETTING
              : "update_avatar" == e
                ? GroupEvent_js_1.GroupEventType.UPDATE_AVATAR
                : "update" == e
                  ? GroupEvent_js_1.GroupEventType.UPDATE
                  : "new_link" == e
                    ? GroupEvent_js_1.GroupEventType.NEW_LINK
                    : "add_admin" == e
                      ? GroupEvent_js_1.GroupEventType.ADD_ADMIN
                      : "remove_admin" == e
                        ? GroupEvent_js_1.GroupEventType.REMOVE_ADMIN
                        : "new_pin_topic" == e
                          ? GroupEvent_js_1.GroupEventType.NEW_PIN_TOPIC
                          : "update_pin_topic" == e
                            ? GroupEvent_js_1.GroupEventType.UPDATE_PIN_TOPIC
                            : "update_topic" == e
                              ? GroupEvent_js_1.GroupEventType.UPDATE_TOPIC
                              : "update_board" == e
                                ? GroupEvent_js_1.GroupEventType.UPDATE_BOARD
                                : "remove_board" == e
                                  ? GroupEvent_js_1.GroupEventType.REMOVE_BOARD
                                  : "reorder_pin_topic" == e
                                    ? GroupEvent_js_1.GroupEventType
                                        .REORDER_PIN_TOPIC
                                    : "unpin_topic" == e
                                      ? GroupEvent_js_1.GroupEventType
                                          .UNPIN_TOPIC
                                      : "remove_topic" == e
                                        ? GroupEvent_js_1.GroupEventType
                                            .REMOVE_TOPIC
                                        : "accept_remind" == e
                                          ? GroupEvent_js_1.GroupEventType
                                              .ACCEPT_REMIND
                                          : "reject_remind" == e
                                            ? GroupEvent_js_1.GroupEventType
                                                .REJECT_REMIND
                                            : "remind_topic" == e
                                              ? GroupEvent_js_1.GroupEventType
                                                  .REMIND_TOPIC
                                              : GroupEvent_js_1.GroupEventType
                                                  .UNKNOWN;
}
function getFriendEventType(e) {
  return "add" == e
    ? FriendEvent_js_1.FriendEventType.ADD
    : "remove" == e
      ? FriendEvent_js_1.FriendEventType.REMOVE
      : "block" == e
        ? FriendEvent_js_1.FriendEventType.BLOCK
        : "unblock" == e
          ? FriendEvent_js_1.FriendEventType.UNBLOCK
          : "block_call" == e
            ? FriendEvent_js_1.FriendEventType.BLOCK_CALL
            : "unblock_call" == e
              ? FriendEvent_js_1.FriendEventType.UNBLOCK_CALL
              : "req_v2" == e
                ? FriendEvent_js_1.FriendEventType.REQUEST
                : "reject" == e
                  ? FriendEvent_js_1.FriendEventType.REJECT_REQUEST
                  : "undo_req" == e
                    ? FriendEvent_js_1.FriendEventType.UNDO_REQUEST
                    : "seen_fr_req" == e
                      ? FriendEvent_js_1.FriendEventType.SEEN_FRIEND_REQUEST
                      : "pin_unpin" == e
                        ? FriendEvent_js_1.FriendEventType.PIN_UNPIN
                        : "pin_create" == e
                          ? FriendEvent_js_1.FriendEventType.PIN_CREATE
                          : FriendEvent_js_1.FriendEventType.UNKNOWN;
}
async function handleZaloResponse(t, e, r = !0) {
  var n = { data: null, error: null };
  if (e.ok)
    try {
      var o = await e.json();
      if (0 != o.error_code)
        return (
          (n.error = { message: o.error_message, code: o.error_code }),
          n
        );
      var a = r ? JSON.parse(decodeAES(t.secretKey, o.data)) : o;
      if (0 != a.error_code)
        return (
          (n.error = { message: a.error_message, code: a.error_code }),
          n
        );
      n.data = a.data;
    } catch (e) {
      ((0, exports.logger)(t).error("Failed to parse response data:", e),
        (n.error = { message: "Failed to parse response data" }));
    }
  else n.error = { message: "Request failed with status code " + e.status };
  return n;
}
async function resolveResponse(e, t, r, n) {
  e = await handleZaloResponse(e, t, n);
  if (e.error) throw new index_js_1.ZaloApiError(e.error.message, e.error.code);
  return r ? r(e) : e.data;
}
function apiFactory() {
  return (r) => (n, e) => {
    var t;
    if ((0, context_js_1.isContextSession)(n))
      return (
        (t = {
          makeURL(e, t, r) {
            return makeURL(n, e, t, r);
          },
          encodeAES(e, t) {
            return encodeAES(n.secretKey, e, t);
          },
          request(e, t, r) {
            return request(n, e, t, r);
          },
          logger: (0, exports.logger)(n),
          resolve: (e, t, r) => resolveResponse(n, e, t, r),
        }),
        r(e, n, t)
      );
    throw new index_js_1.ZaloApiError(
      "Invalid context " + JSON.stringify(n, null, 2),
    );
  };
}
function generateZaloUUID(e) {
  return (
    node_crypto_1.default.randomUUID() +
    "-" +
    crypto_js_1.default.MD5(e).toString()
  );
}
function encryptPin(e) {
  return node_crypto_1.default.createHash("md5").update(e).digest("hex");
}
function validatePin(e, t) {
  return node_crypto_1.default.createHash("md5").update(t).digest("hex") === e;
}
function hexToNegativeColor(e) {
  let t = (e = e.startsWith("#") ? e : "#" + e).slice(1);
  6 === t.length && (t = "FF" + t);
  e = parseInt(t, 16);
  return 2147483647 < e ? e - 4294967296 : e;
}
function negativeColorToHex(e) {
  return "#" + (e + 4294967296).toString(16).slice(-6).padStart(6, "0");
}
exports.logger = logger;
