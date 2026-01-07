(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getFriendOnlinesFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getFriendOnlinesFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/friend/onlines");
  return async function () {
    var requestParams = { imei: appContext.imei },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response, (result) => {
          var parsedStatus,
            data = result.data;
          if (Array.isArray(data.onlines))
            for (var friend of data.onlines)
              "string" == typeof friend.status &&
                (parsedStatus = JSON.parse(friend.status)) &&
                "string" == typeof parsedStatus.status &&
                (friend.status = parsedStatus.status);
          return data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
