(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.reviewPendingMemberRequestFactory =
    exports.ReviewPendingMemberRequestStatus =
      void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
var ReviewPendingMemberRequestStatus;
(((e) => {
  ((e[(e.SUCCESS = 0)] = "SUCCESS"),
    (e[(e.NOT_IN_PENDING_LIST = 170)] = "NOT_IN_PENDING_LIST"),
    (e[(e.ALREADY_IN_GROUP = 178)] = "ALREADY_IN_GROUP"),
    (e[(e.INSUFFICIENT_PERMISSION = 166)] = "INSUFFICIENT_PERMISSION"));
})(
  ReviewPendingMemberRequestStatus ||
    (exports.ReviewPendingMemberRequestStatus =
      ReviewPendingMemberRequestStatus =
        {}),
),
  (exports.reviewPendingMemberRequestFactory = (0, utils_js_1.apiFactory)()(
    (e, r, s) => {
      let t = s.makeURL(
        e.zpwServiceMap.group[0] + "/api/group/pending-mems/review",
      );
      return async function (e, r) {
        Array.isArray(e.members) || (e.members = [e.members]);
        var r = { grid: r, members: e.members, isApprove: e.isApprove ? 1 : 0 },
          e = s.encodeAES(JSON.stringify(r));
        if (e)
          return (
            (r = await s.request(s.makeURL(t, { params: e }), {
              method: "GET",
            })),
            s.resolve(r)
          );
        throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
      };
    },
  )));
