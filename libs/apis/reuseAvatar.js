(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.reuseAvatarFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.reuseAvatarFactory = (0, utils_js_1.apiFactory)()((r, e, a) => {
  let o = a.makeURL(r.zpwServiceMap.profile[0] + "/api/social/reuse-avatar");
  return async function (r) {
    var r = { photoId: r, isPostSocial: 0, imei: e.imei },
      r = a.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await a.request(a.makeURL(o, { params: r }), { method: "GET" })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
