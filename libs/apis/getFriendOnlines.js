(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getFriendOnlinesFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getFriendOnlinesFactory = (0, utils_js_1.apiFactory)()((r, e, t) => {
  let s = t.makeURL(r.zpwServiceMap.profile[0] + "/api/social/friend/onlines");
  return async function () {
    var r = { imei: e.imei },
      r = t.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await t.request(t.makeURL(s, { params: r }), { method: "GET" })),
        t.resolve(r, (r) => {
          var e,
            r = r.data;
          if (Array.isArray(r.onlines))
            for (var t of r.onlines)
              "string" == typeof t.status &&
                (e = JSON.parse(t.status)) &&
                "string" == typeof e.status &&
                (t.status = e.status);
          return r;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
