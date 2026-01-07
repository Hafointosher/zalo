(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.unblockUserFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.unblockUserFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.friend[0] + "/api/friend/unblock");
  return async function (userId) {
    var requestParams = { fid: userId, imei: appContext.imei },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
