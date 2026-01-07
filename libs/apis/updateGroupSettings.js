(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateGroupSettingsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateGroupSettingsFactory = (0, utils_js_1.apiFactory)()((e, o, t) => {
  let i = t.makeURL(e.zpwServiceMap.group[0] + "/api/group/setting/update");
  return async function (e, r) {
    var e = {
        blockName: e.blockName ? 1 : 0,
        signAdminMsg: e.signAdminMsg ? 1 : 0,
        setTopicOnly: e.setTopicOnly ? 1 : 0,
        enableMsgHistory: e.enableMsgHistory ? 1 : 0,
        joinAppr: e.joinAppr ? 1 : 0,
        lockCreatePost: e.lockCreatePost ? 1 : 0,
        lockCreatePoll: e.lockCreatePoll ? 1 : 0,
        lockSendMsg: e.lockSendMsg ? 1 : 0,
        lockViewMember: e.lockViewMember ? 1 : 0,
        bannFeature: 0,
        dirtyMedia: 0,
        banDuration: 0,
        blocked_members: [],
        grid: r,
        imei: o.imei,
      },
      r = t.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await t.request(t.makeURL(i, { params: r }), { method: "GET" })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
