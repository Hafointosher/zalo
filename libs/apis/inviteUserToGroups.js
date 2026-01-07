(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.inviteUserToGroupsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.inviteUserToGroupsFactory = (0, utils_js_1.apiFactory)()((r, i, o) => {
  let t = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/invite/multi");
  return async function (r, e) {
    var e = {
        grids: Array.isArray(e) ? e : [e],
        member: r,
        memberType: -1,
        srcInteraction: 2,
        clientLang: i.language,
      },
      r = o.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await o.request(o.makeURL(t, { params: r }), { method: "GET" })),
        o.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
