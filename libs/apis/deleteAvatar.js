(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteAvatarFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteAvatarFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/del-avatars");
  return async function (avatarId) {
    var requestParams = (Array.isArray(avatarId) ? avatarId : [avatarId]).map((avatarId) => ({ photoId: avatarId }));
    requestParams = { delPhotos: JSON.stringify(requestParams), imei: appContext.imei };
    var encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
