(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeGroupBlockedMemberFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.removeGroupBlockedMemberFactory = (0, utils_js_1.apiFactory)()(
  (r, e, o) => {
    let a = o.makeURL(
      r.zpwServiceMap.group[0] + "/api/group/blockedmems/remove",
    );
    return async function (r, e) {
      Array.isArray(r) || (r = [r]);
      e = o.encodeAES(JSON.stringify({ grid: e, members: r }));
      if (e)
        return (
          (r = await o.request(o.makeURL(a, { params: e }), { method: "GET" })),
          o.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
