(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateLabelsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateLabelsFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.label[0] + "/api/convlabel/update");
  return async function (options) {
    var requestParams = {
        labelData: JSON.stringify(options.labelData),
        version: options.version,
        imei: appContext.imei,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        (result = await api.resolve(response)),
        {
          labelData: JSON.parse(result.labelData),
          version: result.version,
          lastUpdateTime: result.lastUpdateTime,
        }
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
