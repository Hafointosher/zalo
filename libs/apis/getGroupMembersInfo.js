(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupMembersInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupMembersInfoFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let s = o.makeURL(r.zpwServiceMap.profile[0] + "/api/social/group/members");
  return async function (r) {
    var r = {
        friend_pversion_map: (r = Array.isArray(r) ? r : [r]).map((r) =>
          r.endsWith("_0") ? r : r + "_0",
        ),
      },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return ((r = await o.request(o.makeURL(s, { params: r }))), o.resolve(r));
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
