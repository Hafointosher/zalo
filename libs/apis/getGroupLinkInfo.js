(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupLinkInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupLinkInfoFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let a = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/link/ginfo");
  return async function (r) {
    var r = {
        link: r.link,
        avatar_size: 120,
        member_avatar_size: 120,
        mpage: null != (r = r.memberPage) ? r : 1,
      },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await o.request(o.makeURL(a, { params: r }), { method: "GET" })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
