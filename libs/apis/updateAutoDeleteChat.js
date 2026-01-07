(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateAutoDeleteChatFactory = exports.ChatTTL = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
var ChatTTL;
(((e) => {
  ((e[(e.NO_DELETE = 0)] = "NO_DELETE"),
    (e[(e.ONE_DAY = 864e5)] = "ONE_DAY"),
    (e[(e.SEVEN_DAYS = 6048e5)] = "SEVEN_DAYS"),
    (e[(e.FOURTEEN_DAYS = 12096e5)] = "FOURTEEN_DAYS"));
})(ChatTTL || (exports.ChatTTL = ChatTTL = {})),
  (exports.updateAutoDeleteChatFactory = (0, utils_js_1.apiFactory)()(
    (e, a, o) => {
      let s = o.makeURL(
        e.zpwServiceMap.conversation[0] + "/api/conv/autodelete/updateConvers",
      );
      return async function (e, r, t = index_js_1.ThreadType.User) {
        ((r = {
          threadId: r,
          isGroup: t === index_js_1.ThreadType.Group ? 1 : 0,
          ttl: e,
          clientLang: a.language,
        }),
          (t = o.encodeAES(JSON.stringify(r))));
        if (t)
          return (
            (e = await o.request(s, {
              method: "POST",
              body: new URLSearchParams({ params: t }),
            })),
            o.resolve(e)
          );
        throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
      };
    },
  )));
