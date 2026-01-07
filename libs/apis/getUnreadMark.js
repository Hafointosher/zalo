(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getUnreadMarkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getUnreadMarkFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.conversation[0] + "/api/conv/getUnreadMark",
  );
  return async function () {
    var encryptedParams = api.encodeAES(JSON.stringify({}));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response, (result) => {
          data = result.data;
          return "string" == typeof data.data
            ? { data: JSON.parse(data.data), status: data.status }
            : data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
