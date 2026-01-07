(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeUnreadMarkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.removeUnreadMarkFactory = (0, utils_js_1.apiFactory)()((r, e, s) => {
  let o = s.makeURL(
    r.zpwServiceMap.conversation[0] + "/api/conv/removeUnreadMark",
  );
  return async function (r, e = index_js_1.ThreadType.User) {
    var a = Date.now(),
      e = e === index_js_1.ThreadType.Group,
      r = {
        param: JSON.stringify({
          [e ? "convsGroup" : "convsUser"]: [r],
          [e ? "convsUser" : "convsGroup"]: [],
          [e ? "convsGroupData" : "convsUserData"]: [{ id: r, ts: a }],
          [e ? "convsUserData" : "convsGroupData"]: [],
        }),
      },
      a = s.encodeAES(JSON.stringify(r));
    if (a)
      return (
        (e = await s.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: a }),
        })),
        s.resolve(e, (r) => {
          var e = r.data;
          return "string" == typeof e.data
            ? { data: JSON.parse(e.data), status: e.status }
            : r.data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
