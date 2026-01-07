(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addQuickMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addQuickMessageFactory = (0, utils_js_1.apiFactory)()((o, s, l) => {
  let d = l.makeURL(
    o.zpwServiceMap.quick_message[0] + "/api/quickmessage/create",
  );
  return async function (e) {
    var r = e.media ? 1 : 0,
      i = {
        keyword: e.keyword,
        message: { title: e.title, params: "" },
        type: r,
        imei: s.imei,
      };
    if (1 == r) {
      if (!e.media)
        throw new ZaloApiError_js_1.ZaloApiError("Media is required");
      var r = await o.uploadProductPhoto({ file: e.media }),
        e = r.photoId,
        a = r.thumbUrl,
        t = r.normalUrl,
        r = r.hdUrl;
      i.media = {
        items: [
          {
            type: 0,
            photoId: e,
            title: "",
            width: "",
            height: "",
            previewThumb: a,
            rawUrl: t || r,
            thumbUrl: a,
            normalUrl: t || r,
            hdUrl: r || t,
          },
        ],
      };
    }
    e = l.encodeAES(JSON.stringify(i));
    if (e)
      return (
        (a = await l.request(l.makeURL(d, { params: e }), { method: "GET" })),
        l.resolve(a)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
