(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateProfileFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateProfileFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/profile/update");
  return async function (options) {
    var requestParams = {
        profile: JSON.stringify({
          name: options.profile.name,
          dob: options.profile.dob,
          gender: options.profile.gender,
        }),
        biz: JSON.stringify({
          desc: null == (biz = options.biz) ? void 0 : biz.description,
          cate: null == (biz = options.biz) ? void 0 : biz.cate,
          addr: null == (biz = options.biz) ? void 0 : biz.address,
          website: null == (biz = options.biz) ? void 0 : biz.website,
          email: null == (biz = options.biz) ? void 0 : biz.email,
        }),
        language: appContext.language,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
