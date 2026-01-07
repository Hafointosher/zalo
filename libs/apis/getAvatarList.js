(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAvatarListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getAvatarListFactory = (0, utils_js_1.apiFactory)()((r, a, t) => {
  let i = t.makeURL(r.zpwServiceMap.profile[0] + "/api/social/avatar-list");
  return async function (r = 50, e = 1) {
    var e = { page: e, albumId: "0", count: r, imei: a.imei },
      r = t.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await t.request(t.makeURL(i, { params: r }), { method: "GET" })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
