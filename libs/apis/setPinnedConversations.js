(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.setPinnedConversationsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.setPinnedConversationsFactory = (0, utils_js_1.apiFactory)()(
  (e, r, s) => {
    let i = s.makeURL(
      e.zpwServiceMap.conversation[0] + "/api/pinconvers/updatev2",
    );
    return async function (e, r, o = index_js_1.ThreadType.User) {
      "string" == typeof r && (r = [r]);
      ((e = {
        actionType: e ? 1 : 2,
        conversations:
          o == index_js_1.ThreadType.Group
            ? r.map((e) => "g" + e)
            : r.map((e) => "u" + e),
      }),
        (o = s.encodeAES(JSON.stringify(e))));
      if (o)
        return (
          (r = await s.request(i, {
            method: "POST",
            body: new URLSearchParams({ params: o }),
          })),
          s.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
