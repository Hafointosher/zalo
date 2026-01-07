Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFriendsFactory = void 0;

const ZaloApiError_js_1 = require("../Errors/ZaloApiError.js");
const utils_js_1 = require("../utils.js");

exports.getAllFriendsFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  const endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.profile[0] + "/api/social/friend/getfriends"
  );

  return async function getAllFriends(count = 20000, page = 1) {
    const requestParams = {
      incInvalid: 1,
      page: page,
      count: count,
      avatar_size: 120,
      actiontime: 0,
      imei: appContext.imei,
    };

    const encryptedParams = api.encodeAES(JSON.stringify(requestParams));

    if (!encryptedParams) {
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
    }

    const apiUrl = api.makeURL(endpoint, { params: encryptedParams });
    const response = await api.request(apiUrl, { method: "GET" });

    return api.resolve(response);
  };
});
