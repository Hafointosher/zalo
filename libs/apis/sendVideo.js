(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendVideoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendVideoFactory = (0, utils_js_1.apiFactory)()((e, c, m) => {
  let w = {
    [index_js_1.ThreadType.User]: m.makeURL(
      e.zpwServiceMap.file[0] + "/api/message/forward",
    ),
    [index_js_1.ThreadType.Group]: m.makeURL(
      e.zpwServiceMap.file[0] + "/api/group/forward",
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    let t,
      o,
      s,
      l,
      n,
      a,
      d,
      p,
      u,
      h,
      _ = 0;
    var y = Date.now();
    try {
      var g = await m.request(e.videoUrl, { method: "HEAD" }, !0);
      g.ok && (_ = parseInt(g.headers.get("content-length") || "0"));
    } catch (e) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Unable to get video content: " +
          (e instanceof Error ? e.message : String(e)),
      );
    }
    g =
      i === index_js_1.ThreadType.User
        ? {
            toId: r,
            clientId: String(y),
            ttl: null != (t = e.ttl) ? t : 0,
            zsource: 704,
            msgType: 5,
            msgInfo: JSON.stringify({
              videoUrl: e.videoUrl,
              thumbUrl: e.thumbnailUrl,
              duration: null != (o = e.duration) ? o : 0,
              width: null != (s = e.width) ? s : 1280,
              height: null != (l = e.height) ? l : 720,
              fileSize: _,
              properties: {
                color: -1,
                size: -1,
                type: 1003,
                subType: 0,
                ext: { sSrcType: -1, sSrcStr: "", msg_warning_type: 0 },
              },
              title: null != (n = e.msg) ? n : "",
            }),
            imei: c.imei,
          }
        : {
            grid: r,
            visibility: 0,
            clientId: String(y),
            ttl: null != (a = e.ttl) ? a : 0,
            zsource: 704,
            msgType: 5,
            msgInfo: JSON.stringify({
              videoUrl: e.videoUrl,
              thumbUrl: e.thumbnailUrl,
              duration: null != (d = e.duration) ? d : 0,
              width: null != (p = e.width) ? p : 1280,
              height: null != (u = e.height) ? u : 720,
              fileSize: _,
              properties: {
                color: -1,
                size: -1,
                type: 1003,
                subType: 0,
                ext: { sSrcType: -1, sSrcStr: "", msg_warning_type: 0 },
              },
              title: null != (h = e.msg) ? h : "",
            }),
            imei: c.imei,
          };
    if (i !== index_js_1.ThreadType.User && i !== index_js_1.ThreadType.Group)
      throw new ZaloApiError_js_1.ZaloApiError("Thread type is invalid");
    r = m.encodeAES(JSON.stringify(g));
    if (r)
      return (
        (y = await m.request(w[i], {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        m.resolve(y)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
