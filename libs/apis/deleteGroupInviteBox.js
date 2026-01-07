(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteGroupInviteBoxFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteGroupInviteBoxFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, api, appContext) => {
    let endpoint = appContext.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/inv-box/mdel-inv");
    return async function (inviteBoxId, block = !1) {
      var inviteBoxId = Array.isArray(inviteBoxId) ? inviteBoxId : [inviteBoxId],
        requestParams = {
          invitations: JSON.stringify(inviteBoxId.map((inviteBoxId) => ({ grid: inviteBoxId }))),
          block: block ? 1 : 0,
        },
        encryptedParams = appContext.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams)
        return (
          (response = await appContext.request(appContext.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
          appContext.resolve(response)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
