(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendDeliveredEventFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  context_js_1 = require("../context.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendDeliveredEventFactory = (0, utils_js_1.apiFactory)()((e, a, o) => {
  let t = {
    [index_js_1.ThreadType.User]: o.makeURL(
      e.zpwServiceMap.chat[0] + "/api/message/deliveredv2",
    ),
    [index_js_1.ThreadType.Group]: o.makeURL(
      e.zpwServiceMap.group[0] + "/api/group/deliveredv2",
    ),
  };
  return async function (e, r, s = index_js_1.ThreadType.User) {
    if (!r)
      throw new ZaloApiError_js_1.ZaloApiError(
        "messages are missing or not in a valid array format.",
      );
    if (
      0 === (r = Array.isArray(r) ? r : [r]).length ||
      r.length > context_js_1.MAX_MESSAGES_PER_SEND
    )
      throw new ZaloApiError_js_1.ZaloApiError(
        "messages must contain between 1 and 50 messages.",
      );
    let i = r[0].idTo;
    if (s === index_js_1.ThreadType.Group && !r.every((e) => e.idTo === i))
      throw new ZaloApiError_js_1.ZaloApiError(
        "All messages must have the same idTo for Group thread",
      );
    var e = {
        seen: e ? 1 : 0,
        data: r.map((e) => ({
          cmi: e.cliMsgId,
          gmi: e.msgId,
          si: e.uidFrom,
          di: e.idTo === a.uid ? "0" : e.idTo,
          mt: e.msgType,
          st: e.st || 0 === e.st ? 0 : -1,
          at: e.at || 0 === e.at ? 0 : -1,
          cmd: e.cmd || 0 === e.cmd ? 0 : -1,
          ts: parseInt("" + e.ts) || 0 === parseInt("" + e.ts) ? 0 : -1,
        })),
        ...(s === index_js_1.ThreadType.User ? {} : { grid: i }),
      },
      r = {
        msgInfos: JSON.stringify(e),
        ...(s === index_js_1.ThreadType.User ? {} : { imei: a.imei }),
      },
      e = o.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await o.request(t[s], {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
