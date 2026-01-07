(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addUnreadMarkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.addUnreadMarkFactory = (0, utils_js_1.apiFactory)()((r, t, o) => {
  let i = o.makeURL(
    r.zpwServiceMap.conversation[0] + "/api/conv/addUnreadMark",
  );
  return async function (r, e = index_js_1.ThreadType.User) {
    var a = Date.now(),
      s = a.toString(),
      e = e === index_js_1.ThreadType.Group,
      r = {
        param: JSON.stringify({
          [e ? "convsGroup" : "convsUser"]: [
            { id: r, cliMsgId: s, fromUid: "0", ts: a },
          ],
          [e ? "convsUser" : "convsGroup"]: [],
          imei: t.imei,
        }),
      },
      s = o.encodeAES(JSON.stringify(r));
    if (s)
      return (
        (a = await o.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: s }),
        })),
        o.resolve(a, (r) => {
          var e = r.data;
          return "string" == typeof e.data
            ? { data: JSON.parse(e.data), status: e.status }
            : r.data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
