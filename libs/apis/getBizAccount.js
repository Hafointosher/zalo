(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getBizAccountFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getBizAccountFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.profile[0] + "/api/social/friend/get-bizacc",
  );
  return async function (requestParams) {
    var encryptedParams = api.encodeAES(JSON.stringify({ fid: requestParams }));
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
