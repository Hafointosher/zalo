(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupBlockedMemberFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupBlockedMemberFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/blockedmems/list");
    return async function (options, groupId) {
      var requestParams = {
          grid: groupId,
          page: null != (page = options.page) ? page : 1,
          count: null != (count = options.count) ? count : 50,
          imei: appContext.imei,
        },
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
