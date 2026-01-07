(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupInviteBoxInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupInviteBoxInfoFactory = (0, utils_js_1.apiFactory)()(
  (r, e, o) => {
    let t = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/inv-box/inv-info");
    return async function (r) {
      var r = {
          grId: r.groupId,
          mcount: null != (e = r.mcount) ? e : 10,
          mpage: null != (e = r.mpage) ? e : 1,
        },
        e = o.encodeAES(JSON.stringify(r));
      if (e)
        return (
          (r = await o.request(o.makeURL(t, { params: e }), { method: "GET" })),
          o.resolve(r, (r) => {
            var e,
              r = r.data,
              o = r.groupInfo.topic;
            return (
              "string" == typeof o.params &&
                ("string" == typeof (e = JSON.parse(o.params)).extra &&
                  (e.extra = JSON.parse(e.extra)),
                (o.params = e)),
              r
            );
          })
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
