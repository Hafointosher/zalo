(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateProfileFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateProfileFactory = (0, utils_js_1.apiFactory)()((e, i, o) => {
  let a = o.makeURL(e.zpwServiceMap.profile[0] + "/api/social/profile/update");
  return async function (e) {
    var e = {
        profile: JSON.stringify({
          name: e.profile.name,
          dob: e.profile.dob,
          gender: e.profile.gender,
        }),
        biz: JSON.stringify({
          desc: null == (r = e.biz) ? void 0 : r.description,
          cate: null == (r = e.biz) ? void 0 : r.cate,
          addr: null == (r = e.biz) ? void 0 : r.address,
          website: null == (r = e.biz) ? void 0 : r.website,
          email: null == (r = e.biz) ? void 0 : r.email,
        }),
        language: i.language,
      },
      r = o.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await o.request(a, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
