(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addGroupBlockedMemberFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addGroupBlockedMemberFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/blockedmems/add");
    return async function (memberId, groupId) {
      Array.isArray(memberId) || (memberId = [memberId]);
      let requestParams = { grid: groupId, members: memberId };
      let encryptedParams = api.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams) {
        let response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" });
        return api.resolve(response);
      }
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
