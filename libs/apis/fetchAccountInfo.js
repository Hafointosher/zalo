(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.fetchAccountInfoFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.fetchAccountInfoFactory = (0, utils_js_1.apiFactory)()((e, t, r) => {
  let o = r.makeURL(e.zpwServiceMap.profile[0] + "/api/social/profile/me-v2");
  return async function () {
    var e = await r.request(o, { method: "GET" });
    return r.resolve(e);
  };
});
