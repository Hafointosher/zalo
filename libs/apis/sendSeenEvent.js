(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendSeenEventFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  context_js_1 = require("../context.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendSeenEventFactory = (0, utils_js_1.apiFactory)()((e, t, a) => {
  let o = {
    [index_js_1.ThreadType.User]: a.makeURL(
      e.zpwServiceMap.chat[0] + "/api/message/seenv2",
      { nretry: 0 },
    ),
    [index_js_1.ThreadType.Group]: a.makeURL(
      e.zpwServiceMap.group[0] + "/api/group/seenv2",
      { nretry: 0 },
    ),
  };
  return async function (e, r = index_js_1.ThreadType.User) {
    if (!e)
      throw new ZaloApiError_js_1.ZaloApiError(
        "messages are missing or not in a valid array format.",
      );
    if (
      0 === (e = Array.isArray(e) ? e : [e]).length ||
      e.length > context_js_1.MAX_MESSAGES_PER_SEND
    )
      throw new ZaloApiError_js_1.ZaloApiError(
        "messages must contain between 1 and 50 messages.",
      );
    let s = r === index_js_1.ThreadType.Group,
      i = s ? e[0].idTo : e[0].uidFrom;
    ((e = {
      data: e.map((e) => {
        if ((s ? e.idTo : e.uidFrom) !== i)
          throw new ZaloApiError_js_1.ZaloApiError(
            "All messages must belong to the same thread.",
          );
        return {
          cmi: e.cliMsgId,
          gmi: e.msgId,
          si: e.uidFrom,
          di: e.idTo === t.uid ? "0" : e.idTo,
          mt: e.msgType,
          st: e.st || 0 === e.st ? 0 : -1,
          at: e.at || 0 === e.at ? 0 : -1,
          cmd: e.cmd || 0 === e.cmd ? 0 : -1,
          ts: parseInt("" + e.ts) || 0 === parseInt("" + e.ts) ? 0 : -1,
        };
      }),
      [s ? "grid" : "senderId"]: i,
    }),
      (e = { msgInfos: JSON.stringify(e), ...(s ? { imei: t.imei } : {}) }),
      (e = a.encodeAES(JSON.stringify(e))));
    if (e)
      return (
        (r = await a.request(o[r], {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
