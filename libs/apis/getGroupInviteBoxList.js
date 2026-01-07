(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupInviteBoxListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupInviteBoxListFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/inv-box/list");
    return async function (options) {
      var requestParams = {
          mpage: null != (mpage = null == options ? void 0 : options.mpage) ? mpage : 1,
          page: null != (page = null == options ? void 0 : options.page) ? page : 0,
          invPerPage: null != (invPerPage = null == options ? void 0 : options.invPerPage) ? invPerPage : 12,
          mcount: null != (mcount = null == options ? void 0 : options.mcount) ? mcount : 10,
          lastGroupId: null,
          avatar_size: 120,
          member_avatar_size: 120,
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
