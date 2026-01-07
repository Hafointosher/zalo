(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.findUserFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.findUserFactory = (0, utils_js_1.apiFactory)()((r, a, o) => {
  let i = o.makeURL(r.zpwServiceMap.friend[0] + "/api/friend/profile/get");
  return async function (r) {
    if (!r) throw new ZaloApiError_js_1.ZaloApiError("Missing phoneNumber");
    var e,
      r = {
        phone: (r =
          r.startsWith("0") && "vi" == a.language ? "84" + r.slice(1) : r),
        avatar_size: 240,
        language: a.language,
        imei: a.imei,
        reqSrc: 40,
      },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (e = new URL(i)).searchParams.append("params", r),
        (e = await o.request(o.makeURL(e.toString(), { params: r }))),
        o.resolve(e, (r) => {
          if (r.error && 216 != r.error.code)
            throw new ZaloApiError_js_1.ZaloApiError(
              r.error.message,
              r.error.code,
            );
          return r.data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
