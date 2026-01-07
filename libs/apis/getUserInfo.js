(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getUserInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getUserInfoFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let apiUrl = api.makeURL(
    serviceUrls.zpwServiceMap.profile[0] + "/api/social/friend/getprofiles/v2",
  );
  return async function (userIds) {
    if (!userIds) throw new ZaloApiError_js_1.ZaloApiError("Missing user id");
    let normalizedUserIds = (Array.isArray(userIds) ? userIds : [userIds]).map((id) =>
      1 < id.split("_").length ? id : id + "_0",
    );
    let requestParams = {
        phonebook_version: appContext.extraVer.phonebook,
        friend_pversion_map: normalizedUserIds,
        avatar_size: 120,
        language: appContext.language,
        show_online_status: 1,
        imei: appContext.imei,
      };
    let encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams) {
      let response = await api.request(apiUrl, {
        method: "POST",
        body: new URLSearchParams({ params: encryptedParams }),
      });
      return api.resolve(response);
    }
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
