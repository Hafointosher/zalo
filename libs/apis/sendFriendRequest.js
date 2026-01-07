(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendFriendRequestFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.sendFriendRequestFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let url = api.makeURL(serviceUrls.zpwServiceMap.friend[0] + "/api/friend/sendreq");
  return async function (message, userId) {
    var params = {
        toid: userId,
        msg: message,
        reqsrc: 30,
        imei: appContext.imei,
        language: appContext.language,
        srcParams: JSON.stringify({ uidTo: userId }),
      },
      encryptedParams = api.encodeAES(JSON.stringify(params));
    if (encryptedParams)
      return (
        (response = await api.request(url, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
