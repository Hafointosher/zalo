(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getUnreadMarkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getUnreadMarkFactory = (0, utils_js_1.apiFactory)()((r, e, a) => {
  let t = a.makeURL(
    r.zpwServiceMap.conversation[0] + "/api/conv/getUnreadMark",
  );
  return async function () {
    var r = a.encodeAES(JSON.stringify({}));
    if (r)
      return (
        (r = await a.request(a.makeURL(t, { params: r }), { method: "GET" })),
        a.resolve(r, (r) => {
          r = r.data;
          return "string" == typeof r.data
            ? { data: JSON.parse(r.data), status: r.status }
            : r;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
