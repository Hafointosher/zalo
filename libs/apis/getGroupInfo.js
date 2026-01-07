(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupInfoFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/getmg-v2");
  return async function (groupIds) {
    Array.isArray(groupIds) || (groupIds = [groupIds]);
    var requestParams = {
        gridVerMap: JSON.stringify(groupIds.reduce((map, groupId) => ((map[groupId] = 0), map), {})),
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
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
