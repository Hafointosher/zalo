(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeGroupNameFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeGroupNameFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let apiUrl = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/updateinfo");
  return async function (newName, groupId) {
    var requestData = {
        grid: groupId,
        gname: (newName = 0 == newName.length ? Date.now().toString() : newName),
        imei: appContext.imei,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestData));
    if (encryptedParams)
      return (
        (response = await api.request(apiUrl, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
