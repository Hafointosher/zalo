(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getStickersFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getStickersFactory = (0, utils_js_1.apiFactory)()((r, t, i) => {
  let s = i.makeURL(r.zpwServiceMap.sticker + "/api/message/sticker");
  return async function (r) {
    if (!r) throw new ZaloApiError_js_1.ZaloApiError("Missing keyword");
    var e,
      r = { keyword: r, gif: 1, guggy: 0, imei: t.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        ((e = new URL(s)).pathname = e.pathname + "/suggest/stickers"),
        (e = await i.request(i.makeURL(e.toString(), { params: r }))),
        i.resolve(e, (r) => {
          r = r.data;
          let e = [];
          return (
            r.sugg_sticker &&
              r.sugg_sticker.forEach((r) => e.push(r.sticker_id)),
            e
          );
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
