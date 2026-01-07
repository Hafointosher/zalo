(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupInviteBoxListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupInviteBoxListFactory = (0, utils_js_1.apiFactory)()(
  (r, e, o) => {
    let a = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/inv-box/list");
    return async function (r) {
      var r = {
          mpage: null != (e = null == r ? void 0 : r.mpage) ? e : 1,
          page: null != (e = null == r ? void 0 : r.page) ? e : 0,
          invPerPage: null != (e = null == r ? void 0 : r.invPerPage) ? e : 12,
          mcount: null != (e = null == r ? void 0 : r.mcount) ? e : 10,
          lastGroupId: null,
          avatar_size: 120,
          member_avatar_size: 120,
        },
        e = o.encodeAES(JSON.stringify(r));
      if (e)
        return (
          (r = await o.request(o.makeURL(a, { params: e }), { method: "GET" })),
          o.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
