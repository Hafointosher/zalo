(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteAvatarFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteAvatarFactory = (0, utils_js_1.apiFactory)()((r, e, a) => {
  let t = a.makeURL(r.zpwServiceMap.profile[0] + "/api/social/del-avatars");
  return async function (r) {
    var r = (Array.isArray(r) ? r : [r]).map((r) => ({ photoId: r })),
      r = { delPhotos: JSON.stringify(r), imei: e.imei },
      r = a.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await a.request(a.makeURL(t, { params: r }), { method: "GET" })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
