(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getStickersDetailFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getStickersDetailFactory = (0, utils_js_1.apiFactory)()((r, i, s) => {
  let t = s.makeURL(
    r.zpwServiceMap.sticker + "/api/message/sticker/sticker_detail",
  );
  return async function (r) {
    if (!r) throw new ZaloApiError_js_1.ZaloApiError("Missing sticker id");
    if (0 == (r = Array.isArray(r) ? r : [r]).length)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sticker id");
    let e = [];
    r = r.map((r) =>
      (async (r) => {
        if (((r = { sid: r }), (r = s.encodeAES(JSON.stringify(r)))))
          return (
            (r = await s.request(s.makeURL(t, { params: r }))),
            (0, utils_js_1.resolveResponse)(i, r)
          );
        throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
      })(r),
    );
    return (
      (await Promise.allSettled(r)).forEach((r) => {
        "fulfilled" === r.status && e.push(r.value);
      }),
      e
    );
  };
});
