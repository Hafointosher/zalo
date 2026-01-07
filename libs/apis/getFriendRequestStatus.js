(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getFriendRequestStatusFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getFriendRequestStatusFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(serviceUrls.zpwServiceMap.friend[0] + "/api/friend/reqstatus");
    return async function (friendId) {
      var requestParams = { fid: friendId, imei: appContext.imei },
        encryptedParams = api.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams)
        return (
          (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
          api.resolve(response)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
