(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateActiveStatusFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateActiveStatusFactory = (0, utils_js_1.apiFactory)()((e, i, t) => {
  let a = t.makeURL(e.zpwServiceMap.profile[0] + "/api/social/profile/ping"),
    o = t.makeURL(e.zpwServiceMap.profile[0] + "/api/social/profile/deactive");
  return async function (e) {
    var r = { status: e ? 1 : 0, imei: i.imei },
      r = t.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (e = e ? a : o),
        (e = await t.request(t.makeURL(e, { params: r }), { method: "GET" })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
