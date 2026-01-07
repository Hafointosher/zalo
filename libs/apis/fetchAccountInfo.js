(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.fetchAccountInfoFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.fetchAccountInfoFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.profile[0] + "/api/social/profile/me-v2");
  return async function () {
    var response = await api.request(endpoint, { method: "GET" });
    return api.resolve(response);
  };
});
