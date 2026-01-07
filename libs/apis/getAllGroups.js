(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAllGroupsFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.getAllGroupsFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group_poll[0] + "/api/group/getlg/v4");
  return async function () {
    var response = await api.request(endpoint, { method: "GET" });
    return api.resolve(response);
  };
});
