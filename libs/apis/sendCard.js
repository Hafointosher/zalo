(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendCardFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendCardFactory = (0, utils_js_1.apiFactory)()((t, d, n) => {
  let p = {
    [index_js_1.ThreadType.User]: n.makeURL(
      t.zpwServiceMap.file[0] + "/api/message/forward",
    ),
    [index_js_1.ThreadType.Group]: n.makeURL(
      t.zpwServiceMap.file[0] + "/api/group/forward",
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    var s = (await t.getQR(e.userId))[e.userId],
      o = Date.now().toString(),
      a = {
        ttl: null != (a = e.ttl) ? a : 0,
        msgType: 6,
        clientId: o,
        msgInfo: { contactUid: e.userId, qrCodeUrl: s },
      },
      o =
        (e.phoneNumber && (a.msgInfo.phone = e.phoneNumber),
        i == index_js_1.ThreadType.Group
          ? ((a.visibility = 0), (a.grid = r))
          : ((a.toId = r), (a.imei = d.imei)),
        JSON.stringify(a.msgInfo)),
      s = ((a.msgInfo = o), n.encodeAES(JSON.stringify(a)));
    if (s)
      return (
        (e = await n.request(p[i], {
          method: "POST",
          body: new URLSearchParams({ params: s }),
        })),
        n.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
