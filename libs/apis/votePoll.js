(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.votePollFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.votePollFactory = (0, utils_js_1.apiFactory)()((r, o, i) => {
  let t = i.makeURL(r.zpwServiceMap.group[0] + "/api/poll/vote");
  return async function (r, e) {
    var r = {
        poll_id: r,
        option_ids: (e = Array.isArray(e) ? e : [e]),
        imei: o.imei,
      },
      e = i.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await i.request(i.makeURL(t, { params: e }), { method: "GET" })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
