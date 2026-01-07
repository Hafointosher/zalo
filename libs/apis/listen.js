var CloseReason,
  __importDefault =
    (this && this.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Listener = exports.CloseReason = void 0));
let events_1 = __importDefault(require("events")),
  ws_1 = __importDefault(require("ws")),
  FriendEvent_js_1 = require("../models/FriendEvent.js"),
  GroupEvent_js_1 = require("../models/GroupEvent.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js"),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  SeenMessage_js_1 = require("../models/SeenMessage.js"),
  DeliveredMessage_js_1 = require("../models/DeliveredMessage.js");
((e) => {
  ((e[(e.ManualClosure = 1e3)] = "ManualClosure"),
    (e[(e.AbnormalClosure = 1006)] = "AbnormalClosure"),
    (e[(e.DuplicateConnection = 3e3)] = "DuplicateConnection"),
    (e[(e.KickConnection = 3003)] = "KickConnection"));
})(CloseReason || (exports.CloseReason = CloseReason = {}));
class Listener extends events_1.default {
  constructor(e, t) {
    if ((super(), (this.ctx = e), (this.urls = t), (this.id = 0), !e.cookie))
      throw new ZaloApiError_js_1.ZaloApiError("Cookie is not available");
    if (!e.userAgent)
      throw new ZaloApiError_js_1.ZaloApiError("User agent is not available");
    for (var s in ((this.wsURL = (0, utils_js_1.makeURL)(
      this.ctx,
      this.urls[0],
      { t: Date.now() },
    )),
    (this.retryCount = {}),
    (this.rotateCount = 0),
    e.settings.features.socket.retries)) {
      var { times: i, max: n } = e.settings.features.socket.retries[s];
      this.retryCount[s] = {
        count: 0,
        max: n || 0,
        times: "number" == typeof i ? [i] : i,
      };
    }
    ((this.cookie = e.cookie.getCookieStringSync("https://chat.zalo.me")),
      (this.userAgent = e.userAgent),
      (this.selfListen = e.options.selfListen),
      (this.ws = null),
      (this.onConnectedCallback = () => {}),
      (this.onClosedCallback = () => {}),
      (this.onErrorCallback = () => {}),
      (this.onMessageCallback = () => {}));
  }
  onConnected(e) {
    this.onConnectedCallback = e;
  }
  onClosed(e) {
    this.onClosedCallback = e;
  }
  onError(e) {
    this.onErrorCallback = e;
  }
  onMessage(e) {
    this.onMessageCallback = e;
  }
  canRetry(e) {
    if (!this.ctx.settings.features.socket.close_and_retry_codes.includes(e))
      return !1;
    if (
      this.retryCount[e.toString()].count >= this.retryCount[e.toString()].max
    )
      return !1;
    this.retryCount[e.toString()].count++;
    var { count: t, max: s, times: i } = this.retryCount[e.toString()],
      i = t - 1 < i.length ? i[t - 1] : i[i.length - 1];
    return (
      (0, utils_js_1.logger)(this.ctx).verbose(
        `Retry for code ${e} in ${i}ms (${t}/${s})`,
      ),
      i
    );
  }
  shouldRotate(e) {
    return !(
      !this.ctx.settings.features.socket.rotate_error_codes.includes(e) ||
      this.rotateCount >= this.urls.length - 1
    );
  }
  rotateEndpoint() {
    (this.rotateCount++,
      (this.wsURL = (0, utils_js_1.makeURL)(
        this.ctx,
        this.urls[this.rotateCount],
        { t: Date.now() },
      )),
      (0, utils_js_1.logger)(this.ctx).verbose(
        "Rotating endpoint to " + this.wsURL,
      ));
  }
  start({ retryOnClose: s = !1 } = {}) {
    if (this.ws) throw new ZaloApiError_js_1.ZaloApiError("Already started");
    let N = new ws_1.default(this.wsURL, {
      headers: {
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        connection: "Upgrade",
        host: new URL(this.wsURL).host,
        origin: "https://chat.zalo.me",
        prgama: "no-cache",
        "sec-websocket-extensions":
          "permessage-deflate; client_max_window_bits",
        "sec-websocket-version": "13",
        upgrade: "websocket",
        "user-agent": this.userAgent,
        cookie: this.cookie,
      },
      agent: this.ctx.options.agent,
    });
    (((this.ws = N).onopen = () => {
      (this.onConnectedCallback(), this.emit("connected"));
    }),
      (N.onclose = (e) => {
        (this.reset(), this.emit("disconnected", e.code, e.reason));
        var t = s && this.canRetry(e.code);
        t && s
          ? (this.shouldRotate(e.code) && this.rotateEndpoint(),
            setTimeout(() => {
              this.start({ retryOnClose: !0 });
            }, t))
          : (this.onClosedCallback(e.code, e.reason),
            this.emit("closed", e.code, e.reason));
      }),
      (N.onerror = (e) => {
        (this.onErrorCallback(e), this.emit("error", e));
      }),
      (N.onmessage = async (e) => {
        let t = e.data;
        if (t instanceof Buffer) {
          var [e, s, i] = getHeader(t.subarray(0, 4));
          try {
            var n = t.subarray(4),
              r = new TextDecoder("utf-8").decode(n);
            if (0 != r.length) {
              var a,
                o,
                l,
                c,
                d,
                h,
                u = JSON.parse(r);
              if (
                1 == e &&
                1 == s &&
                1 == i &&
                (0, utils_js_1.hasOwn)(u, "key")
              ) {
                ((this.cipherKey = u.key),
                  this.emit("cipher_key", u.key),
                  this.pingInterval && clearInterval(this.pingInterval));
                let e = () => {
                  var e = {
                    version: 1,
                    cmd: 2,
                    subCmd: 1,
                    data: { eventId: Date.now() },
                  };
                  this.sendWs(e, !1);
                };
                this.pingInterval = setInterval(() => {
                  e();
                }, this.ctx.settings.features.socket.ping_interval);
              }
              if (1 == e && 501 == s && 0 == i) {
                var _,
                  p,
                  g,
                  f = (await (0, utils_js_1.decodeEventData)(u, this.cipherKey))
                    .data.msgs;
                for (_ of f)
                  "object" == typeof _.content &&
                  (0, utils_js_1.hasOwn)(_.content, "deleteMsg")
                    ? ((p = new index_js_1.Undo(this.ctx.uid, _, !1)).isSelf &&
                        !this.selfListen) ||
                      this.emit("undo", p)
                    : ((g = new index_js_1.UserMessage(this.ctx.uid, _))
                        .isSelf &&
                        !this.selfListen) ||
                      (this.onMessageCallback(g), this.emit("message", g));
              }
              if (1 == e && 521 == s && 0 == i) {
                var m,
                  v,
                  y,
                  j = (await (0, utils_js_1.decodeEventData)(u, this.cipherKey))
                    .data.groupMsgs;
                for (m of j)
                  "object" == typeof m.content &&
                  (0, utils_js_1.hasOwn)(m.content, "deleteMsg")
                    ? ((v = new index_js_1.Undo(this.ctx.uid, m, !0)).isSelf &&
                        !this.selfListen) ||
                      this.emit("undo", v)
                    : ((y = new index_js_1.GroupMessage(this.ctx.uid, m))
                        .isSelf &&
                        !this.selfListen) ||
                      (this.onMessageCallback(y), this.emit("message", y));
              }
              if (1 == e && 601 == s && 0 == i) {
                var w,
                  C,
                  x,
                  b,
                  E,
                  q = (await (0, utils_js_1.decodeEventData)(u, this.cipherKey))
                    .data.controls;
                for (w of q)
                  if ("file_done" == w.content.act_type) {
                    let e = {
                      fileUrl: w.content.data.url,
                      fileId: w.content.fileId,
                    };
                    var k = this.ctx.uploadCallbacks.get(
                      String(w.content.fileId),
                    );
                    (k && k(e),
                      this.ctx.uploadCallbacks.delete(String(w.content.fileId)),
                      this.emit("upload_attachment", e));
                  } else
                    "group" == w.content.act_type
                      ? "join_reject" != w.content.act &&
                        ((C =
                          "string" == typeof w.content.data
                            ? JSON.parse(w.content.data)
                            : w.content.data),
                        !(x = (0, GroupEvent_js_1.initializeGroupEvent)(
                          this.ctx.uid,
                          C,
                          (0, utils_js_1.getGroupEventType)(w.content.act),
                          w.content.act,
                        )).isSelf || this.selfListen) &&
                        this.emit("group_event", x)
                      : "fr" == w.content.act_type &&
                        "req" != w.content.act &&
                        ("object" ==
                          typeof (b =
                            "string" == typeof w.content.data
                              ? JSON.parse(w.content.data)
                              : w.content.data) &&
                          "topic" in b &&
                          "object" == typeof b.topic &&
                          "params" in b.topic &&
                          (b.topic.params = JSON.parse("" + b.topic.params)),
                        !(E = (0, FriendEvent_js_1.initializeFriendEvent)(
                          this.ctx.uid,
                          "number" == typeof b ? w.content.data : b,
                          (0, utils_js_1.getFriendEventType)(w.content.act),
                        )).isSelf || this.selfListen) &&
                        this.emit("friend_event", E);
              }
              if (612 == s) {
                var S,
                  M,
                  { reacts: T, reactGroups: K } = (
                    await (0, utils_js_1.decodeEventData)(u, this.cipherKey)
                  ).data;
                for (S of T) {
                  S.content = JSON.parse(S.content);
                  var D = new index_js_1.Reaction(this.ctx.uid, S, !1);
                  (D.isSelf && !this.selfListen) || this.emit("reaction", D);
                }
                for (M of K) {
                  M.content = JSON.parse(M.content);
                  var L = new index_js_1.Reaction(this.ctx.uid, M, !0);
                  (L.isSelf && !this.selfListen) || this.emit("reaction", L);
                }
              }
              if (610 == s || 611 == s) {
                var G = (
                  await (0, utils_js_1.decodeEventData)(u, this.cipherKey)
                ).data;
                let t = 611 == s;
                var Z = G[t ? "reactGroups" : "reacts"].map(
                  (e) => new index_js_1.Reaction(this.ctx.uid, e, t),
                );
                this.emit("old_reactions", Z, t);
              }
              if (
                (510 == s &&
                  1 == i &&
                  ((a = (
                    await (0, utils_js_1.decodeEventData)(u, this.cipherKey)
                  ).data.msgs.map(
                    (e) => new index_js_1.UserMessage(this.ctx.uid, e),
                  )),
                  this.emit("old_messages", a, index_js_1.ThreadType.User)),
                511 == s &&
                  1 == i &&
                  ((o = (
                    await (0, utils_js_1.decodeEventData)(u, this.cipherKey)
                  ).data.groupMsgs.map(
                    (e) => new index_js_1.GroupMessage(this.ctx.uid, e),
                  )),
                  this.emit("old_messages", o, index_js_1.ThreadType.Group)),
                602 == s && 0 == i)
              ) {
                var A,
                  R,
                  U,
                  J = (await (0, utils_js_1.decodeEventData)(u, this.cipherKey))
                    .data.actions;
                for (A of J) {
                  let e = JSON.parse(`{${A.data}}`);
                  "typing" == A.act_type &&
                    ("typing" == A.act
                      ? ((R = new index_js_1.UserTyping(e)),
                        this.emit("typing", R))
                      : "gtyping" == A.act &&
                        ((U = new index_js_1.GroupTyping(e)),
                        this.emit("typing", U)));
                }
              }
              if (
                (502 == s &&
                  0 == i &&
                  (({ delivereds: l, seens: c } = (
                    await (0, utils_js_1.decodeEventData)(u, this.cipherKey)
                  ).data),
                  Array.isArray(l) &&
                    0 < l.length &&
                    ((d = l.map(
                      (e) => new DeliveredMessage_js_1.UserDeliveredMessage(e),
                    )),
                    this.emit("delivered_messages", d)),
                  Array.isArray(c)) &&
                  0 < c.length &&
                  ((h = c.map((e) => new SeenMessage_js_1.UserSeenMessage(e))),
                  this.emit("seen_messages", h)),
                522 == s && 0 == i)
              ) {
                var { delivereds: I, groupSeens: O } = (
                  await (0, utils_js_1.decodeEventData)(u, this.cipherKey)
                ).data;
                if (Array.isArray(I) && 0 < I.length) {
                  let e = I.map(
                    (e) =>
                      new DeliveredMessage_js_1.GroupDeliveredMessage(
                        this.ctx.uid,
                        e,
                      ),
                  );
                  (this.selfListen || (e = e.filter((e) => !e.isSelf)),
                    this.emit("delivered_messages", e));
                }
                if (Array.isArray(O) && 0 < O.length) {
                  let e = O.map(
                    (e) =>
                      new SeenMessage_js_1.GroupSeenMessage(this.ctx.uid, e),
                  );
                  (this.selfListen || (e = e.filter((e) => !e.isSelf)),
                    this.emit("seen_messages", e));
                }
              }
              1 == e &&
                3e3 == s &&
                0 == i &&
                ((0, utils_js_1.logger)(this.ctx).error(),
                (0, utils_js_1.logger)(this.ctx).error(
                  "Another connection is opened, closing this one",
                ),
                (0, utils_js_1.logger)(this.ctx).error(),
                N.readyState !== ws_1.default.CLOSED) &&
                N.close(CloseReason.DuplicateConnection);
            }
          } catch (e) {
            (this.onErrorCallback(e), this.emit("error", e));
          }
        }
      }));
  }
  stop() {
    this.ws && (this.ws.close(CloseReason.ManualClosure), this.reset());
  }
  sendWs(e, t = !0) {
    if (this.ws) {
      t && (e.data.req_id = "req_" + this.id++);
      var t = new TextEncoder().encode(JSON.stringify(e.data)),
        i = t.length;
      let s = new DataView(Buffer.alloc(4 + i).buffer);
      (s.setUint8(0, e.version),
        s.setInt32(1, e.cmd, !0),
        s.setInt8(3, e.subCmd),
        t.forEach((e, t) => {
          s.setUint8(4 + t, e);
        }),
        this.ws.send(s));
    }
  }
  requestOldMessages(e, t = null) {
    e = {
      version: 1,
      cmd: e === index_js_1.ThreadType.User ? 510 : 511,
      subCmd: 1,
      data: { first: !0, lastId: t, preIds: [] },
    };
    this.sendWs(e);
  }
  requestOldReactions(e, t = null) {
    e = {
      version: 1,
      cmd: e === index_js_1.ThreadType.User ? 610 : 611,
      subCmd: 1,
      data: { first: !0, lastId: t, preIds: [] },
    };
    this.sendWs(e);
  }
  reset() {
    ((this.ws = null),
      (this.cipherKey = void 0),
      this.pingInterval && clearInterval(this.pingInterval));
  }
}
function getHeader(e) {
  if (e.byteLength < 4)
    throw new ZaloApiError_js_1.ZaloApiError("Invalid header");
  return [e[0], e.readUInt16LE(1), e[3]];
}
exports.Listener = Listener;
