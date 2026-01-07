(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getSentFriendRequestFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getSentFriendRequestFactory = (0, utils_js_1.apiFactory)()(
  (e, r, t) => {
    let i = t.makeURL(e.zpwServiceMap.friend[0] + "/api/friend/requested/list");
    return async function () {
      var e = { imei: r.imei },
        e = t.encodeAES(JSON.stringify(e));
      if (e)
        return (
          (e = await t.request(t.makeURL(i, { params: e }), { method: "GET" })),
          t.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
