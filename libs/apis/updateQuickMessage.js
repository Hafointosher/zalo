(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateQuickMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateQuickMessageFactory = (0, utils_js_1.apiFactory)()((o, e, s) => {
  let l = s.makeURL(
    o.zpwServiceMap.quick_message[0] + "/api/quickmessage/update",
  );
  return async function (e, r) {
    var a = e.media ? 1 : 0,
      r = {
        itemId: r,
        keyword: e.keyword,
        message: { title: e.title, params: "" },
        type: a,
      };
    if (1 == a) {
      if (!e.media)
        throw new ZaloApiError_js_1.ZaloApiError("Media is required");
      var a = await o.uploadProductPhoto({ file: e.media }),
        e = a.photoId,
        t = a.thumbUrl,
        i = a.normalUrl,
        a = a.hdUrl;
      r.media = {
        items: [
          {
            type: 0,
            photoId: e,
            title: "",
            width: "",
            height: "",
            previewThumb: t,
            rawUrl: i || a,
            thumbUrl: t,
            normalUrl: i || a,
            hdUrl: a || i,
          },
        ],
      };
    }
    e = s.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (t = await s.request(s.makeURL(l, { params: e }), { method: "GET" })),
        s.resolve(t)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
