(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendStickerFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendStickerFactory = (0, utils_js_1.apiFactory)()((r, s, t) => {
  let a = {
    [index_js_1.ThreadType.User]: t.makeURL(
      r.zpwServiceMap.chat[0] + "/api/message/sticker",
      { nretry: "0" },
    ),
    [index_js_1.ThreadType.Group]: t.makeURL(
      r.zpwServiceMap.group[0] + "/api/group/sticker",
      { nretry: "0" },
    ),
  };
  return async function (r, e, i = index_js_1.ThreadType.User) {
    if (!r) throw new ZaloApiError_js_1.ZaloApiError("Missing sticker");
    if (!e) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
    if (!r.id) throw new ZaloApiError_js_1.ZaloApiError("Missing sticker id");
    if (!r.cateId)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sticker cateId");
    if (!r.type)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sticker type");
    var o = i === index_js_1.ThreadType.Group,
      r = {
        stickerId: r.id,
        cateId: r.cateId,
        type: r.type,
        clientId: Date.now(),
        imei: s.imei,
        zsource: 101,
        toid: o ? void 0 : e,
        grid: o ? e : void 0,
      },
      o =
        ((0, utils_js_1.removeUndefinedKeys)(r),
        t.encodeAES(JSON.stringify(r)));
    if (o)
      return (
        (e = await t.request(a[i], {
          method: "POST",
          body: new URLSearchParams({ params: o }),
        })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
