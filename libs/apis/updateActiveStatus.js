(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateActiveStatusFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateActiveStatusFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let activeEndpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/profile/ping"),
    deactiveEndpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/profile/deactive");
  return async function (isActive) {
    var requestParams = { status: isActive ? 1 : 0, imei: appContext.imei },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (endpoint = isActive ? activeEndpoint : deactiveEndpoint),
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
