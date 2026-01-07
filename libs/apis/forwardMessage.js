(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.forwardMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.forwardMessageFactory = (0, utils_js_1.apiFactory)()((e, l, d) => {
  let p = {
    [index_js_1.ThreadType.User]: d.makeURL(
      e.zpwServiceMap.file[0] + "/api/message/mforward",
    ),
    [index_js_1.ThreadType.Group]: d.makeURL(
      e.zpwServiceMap.file[0] + "/api/group/mforward",
    ),
  };
  return async function (r, e, s = index_js_1.ThreadType.User) {
    if (!r.message)
      throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
    if (!e || 0 === e.length)
      throw new ZaloApiError_js_1.ZaloApiError("Missing thread IDs");
    let t = Date.now().toString();
    var i = {
        message: r.message,
        reference: r.reference
          ? JSON.stringify({ type: 3, data: JSON.stringify(r.reference) })
          : void 0,
      },
      o = r.reference
        ? {
            fw: {
              pmsg: { st: 1, ts: r.reference.ts, id: r.reference.id },
              rmsg: { st: 1, ts: r.reference.ts, id: r.reference.id },
              fwLvl: r.reference.fwLvl,
            },
          }
        : null;
    let a;
    a =
      s === index_js_1.ThreadType.User
        ? {
            toIds: e.map((e) => ({
              clientId: t,
              toUid: e,
              ttl: null != (e = r.ttl) ? e : 0,
            })),
            imei: l.imei,
            ttl: null != (n = r.ttl) ? n : 0,
            msgType: "1",
            totalIds: e.length,
            msgInfo: JSON.stringify(i),
            decorLog: JSON.stringify(o),
          }
        : {
            grids: e.map((e) => ({
              clientId: t,
              grid: e,
              ttl: null != (e = r.ttl) ? e : 0,
            })),
            ttl: null != (n = r.ttl) ? n : 0,
            msgType: "1",
            totalIds: e.length,
            msgInfo: JSON.stringify(i),
            decorLog: JSON.stringify(o),
          };
    var n = d.encodeAES(JSON.stringify(a));
    if (n)
      return (
        (e = await d.request(p[s], {
          method: "POST",
          body: new URLSearchParams({ params: n }),
        })),
        d.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
