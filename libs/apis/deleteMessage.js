(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.deleteMessageFactory = (0, utils_js_1.apiFactory)()((e, i, d) => {
  let t = {
    [index_js_1.ThreadType.User]: d.makeURL(
      e.zpwServiceMap.chat[0] + "/api/message/delete",
    ),
    [index_js_1.ThreadType.Group]: d.makeURL(
      e.zpwServiceMap.group[0] + "/api/group/deletemsg",
    ),
  };
  return async function (e, r = !1) {
    var { threadId: e, type: o = index_js_1.ThreadType.User, data: s } = e,
      a = o === index_js_1.ThreadType.Group;
    if (i.uid == s.uidFrom && !1 === r)
      throw new ZaloApiError_js_1.ZaloApiError(
        "To delete your message for everyone, use undo api instead",
      );
    if (!a && !1 === r)
      throw new ZaloApiError_js_1.ZaloApiError(
        "Can't delete message for everyone in a private chat",
      );
    ((s = {
      [a ? "grid" : "toid"]: e,
      cliMsgId: Date.now(),
      msgs: [
        {
          cliMsgId: s.cliMsgId,
          globalMsgId: s.msgId,
          ownerId: s.uidFrom,
          destId: e,
        },
      ],
      onlyMe: r ? 1 : 0,
    }),
      a || (s.imei = i.imei),
      (e = d.encodeAES(JSON.stringify(s))));
    if (e)
      return (
        (r = await d.request(t[o], {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        d.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
