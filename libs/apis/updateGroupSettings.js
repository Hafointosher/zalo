(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateGroupSettingsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateGroupSettingsFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/setting/update");
  return async function (settings, groupId) {
    var requestParams = {
        blockName: settings.blockName ? 1 : 0,
        signAdminMsg: settings.signAdminMsg ? 1 : 0,
        setTopicOnly: settings.setTopicOnly ? 1 : 0,
        enableMsgHistory: settings.enableMsgHistory ? 1 : 0,
        joinAppr: settings.joinAppr ? 1 : 0,
        lockCreatePost: settings.lockCreatePost ? 1 : 0,
        lockCreatePoll: settings.lockCreatePoll ? 1 : 0,
        lockSendMsg: settings.lockSendMsg ? 1 : 0,
        lockViewMember: settings.lockViewMember ? 1 : 0,
        bannFeature: 0,
        dirtyMedia: 0,
        banDuration: 0,
        blocked_members: [],
        grid: groupId,
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
});
