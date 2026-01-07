(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupLinkInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupLinkInfoFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/link/ginfo");
  return async function (options) {
    var requestParams = {
        link: options.link,
        avatar_size: 120,
        member_avatar_size: 120,
        mpage: null != (memberPage = options.memberPage) ? memberPage : 1,
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
