(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupMembersInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupMembersInfoFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/group/members");
  return async function (memberIds) {
    var requestParams = {
        friend_pversion_map: (memberIds = Array.isArray(memberIds) ? memberIds : [memberIds]).map((id) =>
          id.endsWith("_0") ? id : id + "_0",
        ),
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return ((response = await api.request(api.makeURL(endpoint, { params: encryptedParams }))), api.resolve(response));
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
