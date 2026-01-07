(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendVoiceFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendVoiceFactory = (0, utils_js_1.apiFactory)()((e, n, p) => {
  let d = {
    [index_js_1.ThreadType.User]: p.makeURL(
      e.zpwServiceMap.file[0] + "/api/message/forward",
    ),
    [index_js_1.ThreadType.Group]: p.makeURL(
      e.zpwServiceMap.file[0] + "/api/group/forward",
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    let o,
      t,
      s = null;
    var a = Date.now().toString();
    try {
      var l = await p.request(e.voiceUrl, { method: "HEAD" }, !0);
      l.ok && (s = parseInt(l.headers.get("content-length") || "0"));
    } catch (e) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Unable to get voice content: " +
          (e instanceof Error ? e.message : String(e)),
      );
    }
    l =
      i === index_js_1.ThreadType.User
        ? {
            toId: r,
            ttl: null != (o = e.ttl) ? o : 0,
            zsource: -1,
            msgType: 3,
            clientId: a,
            msgInfo: JSON.stringify({
              voiceUrl: e.voiceUrl,
              m4aUrl: e.voiceUrl,
              fileSize: null != s ? s : 0,
            }),
            imei: n.imei,
          }
        : {
            grid: r,
            visibility: 0,
            ttl: null != (t = e.ttl) ? t : 0,
            zsource: -1,
            msgType: 3,
            clientId: a,
            msgInfo: JSON.stringify({
              voiceUrl: e.voiceUrl,
              m4aUrl: e.voiceUrl,
              fileSize: null != s ? s : 0,
            }),
            imei: n.imei,
          };
    if (i !== index_js_1.ThreadType.User && i !== index_js_1.ThreadType.Group)
      throw new ZaloApiError_js_1.ZaloApiError("Thread type is invalid");
    r = p.encodeAES(JSON.stringify(l));
    if (r)
      return (
        (a = await p.request(d[i], {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        p.resolve(a)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
