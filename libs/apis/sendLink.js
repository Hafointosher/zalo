(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendLinkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendLinkFactory = (0, utils_js_1.apiFactory)()((t, s, n) => {
  let d = {
    [index_js_1.ThreadType.User]: n.makeURL(
      t.zpwServiceMap.chat[0] + "/api/message/link",
      { nretry: 0 },
    ),
    [index_js_1.ThreadType.Group]: n.makeURL(
      t.zpwServiceMap.group[0] + "/api/group/sendlink",
      { nretry: 0 },
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    var a = await t.parseLink(e.link),
      e = {
        msg:
          e.msg && e.msg.trim()
            ? e.msg.includes(e.link)
              ? e.msg
              : e.msg + " " + e.link
            : e.link,
        href: a.data.href,
        src: a.data.src,
        title: a.data.title,
        desc: a.data.desc,
        thumb: a.data.thumb,
        type: 2,
        media: JSON.stringify(a.data.media),
        ttl: null != (a = e.ttl) ? a : 0,
        clientId: Date.now(),
      },
      a =
        (i == index_js_1.ThreadType.Group
          ? ((e.grid = r), (e.imei = s.imei))
          : ((e.toId = r), (e.mentionInfo = "")),
        n.encodeAES(JSON.stringify(e)));
    if (a)
      return (
        (r = await n.request(d[i], {
          method: "POST",
          body: new URLSearchParams({ params: a }),
        })),
        n.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
