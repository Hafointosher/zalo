(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addUserToGroupFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addUserToGroupFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/invite/v2");
  return async function (memberIds, groupId) {
    var requestParams = {
        grid: groupId,
        members: (memberIds = Array.isArray(memberIds) ? memberIds : [memberIds]),
        memberTypes: memberIds.map(() => -1),
        imei: appContext.imei,
        clientLang: appContext.language,
      },
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
