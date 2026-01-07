(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeUserFromGroupFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.removeUserFromGroupFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/kickout");
  return async function (memberIds, groupId) {
    var requestParams = {
        grid: groupId,
        members: (memberIds = Array.isArray(memberIds) ? memberIds : [memberIds]),
        imei: appContext.imei,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams) {
      let response = await api.request(endpoint, {
        method: "POST",
        body: new URLSearchParams({ params: encryptedParams }),
      });
      return api.resolve(response);
    }
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
