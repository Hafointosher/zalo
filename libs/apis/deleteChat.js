(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteChatFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.deleteChatFactory = (0, utils_js_1.apiFactory)()((e, a, t) => {
  let s = {
    [index_js_1.ThreadType.User]: t.makeURL(
      e.zpwServiceMap.chat[0] + "/api/message/deleteconver",
      { nretry: 0 },
    ),
    [index_js_1.ThreadType.Group]: t.makeURL(
      e.zpwServiceMap.group[0] + "/api/group/deleteconver",
      { nretry: 0 },
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    var o = Date.now().toString(),
      r =
        i === index_js_1.ThreadType.User
          ? { toid: r, cliMsgId: o, conver: e, onlyMe: 1, imei: a.imei }
          : { grid: r, cliMsgId: o, conver: e, onlyMe: 1, imei: a.imei },
      o = t.encodeAES(JSON.stringify(r));
    if (o)
      return (
        (e = await t.request(s[i], {
          method: "POST",
          body: new URLSearchParams({ params: o }),
        })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
