var CloseReason,
  __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
(Object.defineProperty(exports, "__esModule", { value: true }),
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

((reason) => {
  reason[(reason.ManualClosure = 1000)] = "ManualClosure";
  reason[(reason.AbnormalClosure = 1006)] = "AbnormalClosure";
  reason[(reason.DuplicateConnection = 3000)] = "DuplicateConnection";
  reason[(reason.KickConnection = 3003)] = "KickConnection";
})(CloseReason || (exports.CloseReason = CloseReason = {}));

class Listener extends events_1.default {
  constructor(context, wsUrls) {
    super();
    this.ctx = context;
    this.urls = wsUrls;
    this.id = 0;

    if (!context.cookie) {
      throw new ZaloApiError_js_1.ZaloApiError("Cookie is not available");
    }
    if (!context.userAgent) {
      throw new ZaloApiError_js_1.ZaloApiError("User agent is not available");
    }

    this.wsURL = (0, utils_js_1.makeURL)(this.ctx, this.urls[0], { t: Date.now() });
    this.retryCount = {};
    this.rotateCount = 0;

    for (const code in context.settings.features.socket.retries) {
      const { times, max } = context.settings.features.socket.retries[code];
      this.retryCount[code] = {
        count: 0,
        max: max || 0,
        times: "number" == typeof times ? [times] : times,
      };
    }

    this.cookie = context.cookie.getCookieStringSync("https://chat.zalo.me");
    this.userAgent = context.userAgent;
    this.selfListen = context.options.selfListen;
    this.ws = null;
    this.onConnectedCallback = () => {};
    this.onClosedCallback = () => {};
    this.onErrorCallback = () => {};
    this.onMessageCallback = () => {};
  }

  onConnected(callback) {
    this.onConnectedCallback = callback;
  }

  onClosed(callback) {
    this.onClosedCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  canRetry(closeCode) {
    if (!this.ctx.settings.features.socket.close_and_retry_codes.includes(closeCode)) {
      return false;
    }
    if (this.retryCount[closeCode.toString()].count >= this.retryCount[closeCode.toString()].max) {
      return false;
    }

    this.retryCount[closeCode.toString()].count++;
    const { count, max, times } = this.retryCount[closeCode.toString()];
    const retryDelay = count - 1 < times.length ? times[count - 1] : times[times.length - 1];

    (0, utils_js_1.logger)(this.ctx).verbose(
      `Retry for code ${closeCode} in ${retryDelay}ms (${count}/${max})`,
    );

    return retryDelay;
  }

  shouldRotate(closeCode) {
    if (!this.ctx.settings.features.socket.rotate_error_codes.includes(closeCode)) {
      return false;
    }
    if (this.rotateCount >= this.urls.length - 1) {
      return false;
    }
    return true;
  }

  rotateEndpoint() {
    this.rotateCount++;
    this.wsURL = (0, utils_js_1.makeURL)(this.ctx, this.urls[this.rotateCount], { t: Date.now() });
    (0, utils_js_1.logger)(this.ctx).verbose("Rotating endpoint to " + this.wsURL);
  }

  start({ retryOnClose = false } = {}) {
    if (this.ws) {
      throw new ZaloApiError_js_1.ZaloApiError("Already started");
    }

    const websocket = new ws_1.default(this.wsURL, {
      headers: {
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        connection: "Upgrade",
        host: new URL(this.wsURL).host,
        origin: "https://chat.zalo.me",
        prgama: "no-cache",
        "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
        "sec-websocket-version": "13",
        upgrade: "websocket",
        "user-agent": this.userAgent,
        cookie: this.cookie,
      },
      agent: this.ctx.options.agent,
    });

    this.ws = websocket;

    websocket.onopen = () => {
      this.onConnectedCallback();
      this.emit("connected");
    };

    websocket.onclose = (event) => {
      this.reset();
      this.emit("disconnected", event.code, event.reason);

      const retryDelay = retryOnClose && this.canRetry(event.code);
      if (retryDelay && retryOnClose) {
        if (this.shouldRotate(event.code)) {
          this.rotateEndpoint();
        }
        setTimeout(() => {
          this.start({ retryOnClose: true });
        }, retryDelay);
      } else {
        this.onClosedCallback(event.code, event.reason);
        this.emit("closed", event.code, event.reason);
      }
    };

    websocket.onerror = (error) => {
      this.onErrorCallback(error);
      this.emit("error", error);
    };

    websocket.onmessage = async (event) => {
      let data = event.data;
      if (!(data instanceof Buffer)) return;

      const [version, cmd, subCmd] = getHeader(data.subarray(0, 4));

      try {
        const payload = data.subarray(4);
        const jsonString = new TextDecoder("utf-8").decode(payload);
        if (jsonString.length === 0) return;

        const parsedData = JSON.parse(jsonString);

        // Handle cipher key exchange
        if (version === 1 && cmd === 1 && subCmd === 1 && (0, utils_js_1.hasOwn)(parsedData, "key")) {
          this.cipherKey = parsedData.key;
          this.emit("cipher_key", parsedData.key);

          if (this.pingInterval) clearInterval(this.pingInterval);

          const sendPing = () => {
            const pingData = {
              version: 1,
              cmd: 2,
              subCmd: 1,
              data: { eventId: Date.now() },
            };
            this.sendWs(pingData, false);
          };

          this.pingInterval = setInterval(() => {
            sendPing();
          }, this.ctx.settings.features.socket.ping_interval);
        }

        // Handle user messages (cmd 501)
        if (version === 1 && cmd === 501 && subCmd === 0) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const messages = decodedData.data.msgs;

          for (const msgData of messages) {
            if ("object" == typeof msgData.content && (0, utils_js_1.hasOwn)(msgData.content, "deleteMsg")) {
              const undoEvent = new index_js_1.Undo(this.ctx.uid, msgData, false);
              if (!undoEvent.isSelf || this.selfListen) {
                this.emit("undo", undoEvent);
              }
            } else {
              const userMessage = new index_js_1.UserMessage(this.ctx.uid, msgData);
              if (!userMessage.isSelf || this.selfListen) {
                this.onMessageCallback(userMessage);
                this.emit("message", userMessage);
              }
            }
          }
        }

        // Handle group messages (cmd 521)
        if (version === 1 && cmd === 521 && subCmd === 0) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const groupMessages = decodedData.data.groupMsgs;

          for (const msgData of groupMessages) {
            if ("object" == typeof msgData.content && (0, utils_js_1.hasOwn)(msgData.content, "deleteMsg")) {
              const undoEvent = new index_js_1.Undo(this.ctx.uid, msgData, true);
              if (!undoEvent.isSelf || this.selfListen) {
                this.emit("undo", undoEvent);
              }
            } else {
              const groupMessage = new index_js_1.GroupMessage(this.ctx.uid, msgData);
              if (!groupMessage.isSelf || this.selfListen) {
                this.onMessageCallback(groupMessage);
                this.emit("message", groupMessage);
              }
            }
          }
        }

        // Handle control events (cmd 601)
        if (version === 1 && cmd === 601 && subCmd === 0) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const controls = decodedData.data.controls;

          for (const control of controls) {
            if (control.content.act_type === "file_done") {
              const uploadResult = {
                fileUrl: control.content.data.url,
                fileId: control.content.fileId,
              };
              const callback = this.ctx.uploadCallbacks.get(String(control.content.fileId));
              if (callback) callback(uploadResult);
              this.ctx.uploadCallbacks.delete(String(control.content.fileId));
              this.emit("upload_attachment", uploadResult);
            } else if (control.content.act_type === "group") {
              if (control.content.act === "join_reject") continue;

              const eventData = "string" == typeof control.content.data
                ? JSON.parse(control.content.data)
                : control.content.data;

              const groupEvent = (0, GroupEvent_js_1.initializeGroupEvent)(
                this.ctx.uid,
                eventData,
                (0, utils_js_1.getGroupEventType)(control.content.act),
                control.content.act,
              );

              if (!groupEvent.isSelf || this.selfListen) {
                this.emit("group_event", groupEvent);
              }
            } else if (control.content.act_type === "fr" && control.content.act !== "req") {
              let friendData = "string" == typeof control.content.data
                ? JSON.parse(control.content.data)
                : control.content.data;

              if ("object" == typeof friendData && "topic" in friendData &&
                  "object" == typeof friendData.topic && "params" in friendData.topic) {
                friendData.topic.params = JSON.parse("" + friendData.topic.params);
              }

              const friendEvent = (0, FriendEvent_js_1.initializeFriendEvent)(
                this.ctx.uid,
                "number" == typeof friendData ? control.content.data : friendData,
                (0, utils_js_1.getFriendEventType)(control.content.act),
              );

              if (!friendEvent.isSelf || this.selfListen) {
                this.emit("friend_event", friendEvent);
              }
            }
          }
        }

        // Handle reactions (cmd 612)
        if (cmd === 612) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const { reacts: userReacts, reactGroups: groupReacts } = decodedData.data;

          for (const reactData of userReacts) {
            reactData.content = JSON.parse(reactData.content);
            const reaction = new index_js_1.Reaction(this.ctx.uid, reactData, false);
            if (!reaction.isSelf || this.selfListen) {
              this.emit("reaction", reaction);
            }
          }

          for (const reactData of groupReacts) {
            reactData.content = JSON.parse(reactData.content);
            const reaction = new index_js_1.Reaction(this.ctx.uid, reactData, true);
            if (!reaction.isSelf || this.selfListen) {
              this.emit("reaction", reaction);
            }
          }
        }

        // Handle old reactions (cmd 610, 611)
        if (cmd === 610 || cmd === 611) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const isGroup = cmd === 611;
          const reactions = decodedData.data[isGroup ? "reactGroups" : "reacts"].map(
            (reactData) => new index_js_1.Reaction(this.ctx.uid, reactData, isGroup),
          );
          this.emit("old_reactions", reactions, isGroup);
        }

        // Handle old user messages (cmd 510)
        if (cmd === 510 && subCmd === 1) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const oldMessages = decodedData.data.msgs.map(
            (msgData) => new index_js_1.UserMessage(this.ctx.uid, msgData),
          );
          this.emit("old_messages", oldMessages, index_js_1.ThreadType.User);
        }

        // Handle old group messages (cmd 511)
        if (cmd === 511 && subCmd === 1) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const oldMessages = decodedData.data.groupMsgs.map(
            (msgData) => new index_js_1.GroupMessage(this.ctx.uid, msgData),
          );
          this.emit("old_messages", oldMessages, index_js_1.ThreadType.Group);
        }

        // Handle typing events (cmd 602)
        if (cmd === 602 && subCmd === 0) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const actions = decodedData.data.actions;

          for (const action of actions) {
            const actionData = JSON.parse(`{${action.data}}`);
            if (action.act_type === "typing") {
              if (action.act === "typing") {
                const typingEvent = new index_js_1.UserTyping(actionData);
                this.emit("typing", typingEvent);
              } else if (action.act === "gtyping") {
                const typingEvent = new index_js_1.GroupTyping(actionData);
                this.emit("typing", typingEvent);
              }
            }
          }
        }

        // Handle delivered/seen messages (cmd 502)
        if (cmd === 502 && subCmd === 0) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const { delivereds, seens } = decodedData.data;

          if (Array.isArray(delivereds) && delivereds.length > 0) {
            const deliveredMessages = delivereds.map(
              (msgData) => new DeliveredMessage_js_1.UserDeliveredMessage(msgData),
            );
            this.emit("delivered_messages", deliveredMessages);
          }

          if (Array.isArray(seens) && seens.length > 0) {
            const seenMessages = seens.map(
              (msgData) => new SeenMessage_js_1.UserSeenMessage(msgData),
            );
            this.emit("seen_messages", seenMessages);
          }
        }

        // Handle group delivered/seen messages (cmd 522)
        if (cmd === 522 && subCmd === 0) {
          const decodedData = await (0, utils_js_1.decodeEventData)(parsedData, this.cipherKey);
          const { delivereds: groupDelivereds, groupSeens } = decodedData.data;

          if (Array.isArray(groupDelivereds) && groupDelivereds.length > 0) {
            let deliveredMessages = groupDelivereds.map(
              (msgData) => new DeliveredMessage_js_1.GroupDeliveredMessage(this.ctx.uid, msgData),
            );
            if (!this.selfListen) {
              deliveredMessages = deliveredMessages.filter((msg) => !msg.isSelf);
            }
            this.emit("delivered_messages", deliveredMessages);
          }

          if (Array.isArray(groupSeens) && groupSeens.length > 0) {
            let seenMessages = groupSeens.map(
              (msgData) => new SeenMessage_js_1.GroupSeenMessage(this.ctx.uid, msgData),
            );
            if (!this.selfListen) {
              seenMessages = seenMessages.filter((msg) => !msg.isSelf);
            }
            this.emit("seen_messages", seenMessages);
          }
        }

        // Handle duplicate connection (cmd 3000)
        if (version === 1 && cmd === 3000 && subCmd === 0) {
          (0, utils_js_1.logger)(this.ctx).error();
          (0, utils_js_1.logger)(this.ctx).error("Another connection is opened, closing this one");
          (0, utils_js_1.logger)(this.ctx).error();

          if (websocket.readyState !== ws_1.default.CLOSED) {
            websocket.close(CloseReason.DuplicateConnection);
          }
        }
      } catch (error) {
        this.onErrorCallback(error);
        this.emit("error", error);
      }
    };
  }

  stop() {
    if (this.ws) {
      this.ws.close(CloseReason.ManualClosure);
      this.reset();
    }
  }

  sendWs(wsData, includeReqId = true) {
    if (!this.ws) return;

    if (includeReqId) {
      wsData.data.req_id = "req_" + this.id++;
    }

    const encodedData = new TextEncoder().encode(JSON.stringify(wsData.data));
    const bufferLength = encodedData.length;
    const buffer = new DataView(Buffer.alloc(4 + bufferLength).buffer);

    buffer.setUint8(0, wsData.version);
    buffer.setInt32(1, wsData.cmd, true);
    buffer.setInt8(3, wsData.subCmd);

    encodedData.forEach((byte, index) => {
      buffer.setUint8(4 + index, byte);
    });

    this.ws.send(buffer);
  }

  requestOldMessages(threadType, lastId = null) {
    const wsData = {
      version: 1,
      cmd: threadType === index_js_1.ThreadType.User ? 510 : 511,
      subCmd: 1,
      data: { first: true, lastId: lastId, preIds: [] },
    };
    this.sendWs(wsData);
  }

  requestOldReactions(threadType, lastId = null) {
    const wsData = {
      version: 1,
      cmd: threadType === index_js_1.ThreadType.User ? 610 : 611,
      subCmd: 1,
      data: { first: true, lastId: lastId, preIds: [] },
    };
    this.sendWs(wsData);
  }

  reset() {
    this.ws = null;
    this.cipherKey = undefined;
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }
}

function getHeader(buffer) {
  if (buffer.byteLength < 4) {
    throw new ZaloApiError_js_1.ZaloApiError("Invalid header");
  }
  return [buffer[0], buffer.readUInt16LE(1), buffer[3]];
}

exports.Listener = Listener;
