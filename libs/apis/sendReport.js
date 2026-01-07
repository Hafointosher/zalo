(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendReportFactory = exports.ReportReason = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
var ReportReason;
(((e) => {
  ((e[(e.Sensitive = 1)] = "Sensitive"),
    (e[(e.Annoy = 2)] = "Annoy"),
    (e[(e.Fraud = 3)] = "Fraud"),
    (e[(e.Other = 0)] = "Other"));
})(ReportReason || (exports.ReportReason = ReportReason = {})),
  (exports.sendReportFactory = (0, utils_js_1.apiFactory)()((e, s, t) => {
    let a = {
      [index_js_1.ThreadType.User]: t.makeURL(
        e.zpwServiceMap.profile[0] + "/api/report/abuse-v2",
      ),
      [index_js_1.ThreadType.Group]: t.makeURL(
        e.zpwServiceMap.profile[0] + "/api/social/profile/reportabuse",
      ),
    };
    return async function (e, r, o = index_js_1.ThreadType.User) {
      var r =
          o == index_js_1.ThreadType.User
            ? {
                idTo: r,
                objId: "person.profile",
                reason: e.reason.toString(),
                content: e.reason == ReportReason.Other ? e.content : void 0,
              }
            : {
                uidTo: r,
                type: 14,
                reason: e.reason,
                content: e.reason == ReportReason.Other ? e.content : "",
                imei: s.imei,
              },
        e =
          ((0, utils_js_1.removeUndefinedKeys)(r),
          t.encodeAES(JSON.stringify(r)));
      if (e)
        return (
          (r = await t.request(a[o], {
            method: "POST",
            body: new URLSearchParams({ params: e }),
          })),
          t.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
