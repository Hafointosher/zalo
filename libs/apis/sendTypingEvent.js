(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendTypingEventFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendTypingEventFactory = (0, utils_js_1.apiFactory)()((e, s, a) => {
  let o = {
    [index_js_1.ThreadType.User]: a.makeURL(
      e.zpwServiceMap.chat[0] + "/api/message/typing",
    ),
    [index_js_1.ThreadType.Group]: a.makeURL(
      e.zpwServiceMap.group[0] + "/api/group/typing",
    ),
  };
  return async function (
    e,
    r = index_js_1.ThreadType.User,
    i = index_js_1.DestType.User,
  ) {
    if (!e) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
    var e = {
        [r === index_js_1.ThreadType.User ? "toid" : "grid"]: e,
        ...(r === index_js_1.ThreadType.User ? { destType: i } : {}),
        imei: s.imei,
      },
      i = a.encodeAES(JSON.stringify(e));
    if (i)
      return (
        (e = await a.request(o[r], {
          method: "POST",
          body: new URLSearchParams({ params: i }),
        })),
        a.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
