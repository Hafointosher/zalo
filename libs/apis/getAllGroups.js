(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAllGroupsFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.getAllGroupsFactory = (0, utils_js_1.apiFactory)()((e, r, t) => {
  let o = t.makeURL(e.zpwServiceMap.group_poll[0] + "/api/group/getlg/v4");
  return async function () {
    var e = await t.request(o, { method: "GET" });
    return t.resolve(e);
  };
});
