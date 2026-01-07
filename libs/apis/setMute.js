(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.setMuteFactory =
    exports.MuteAction =
    exports.MuteDuration =
      void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
var MuteDuration, MuteAction;
(((e) => {
  ((e[(e.ONE_HOUR = 3600)] = "ONE_HOUR"),
    (e[(e.FOUR_HOURS = 14400)] = "FOUR_HOURS"),
    (e[(e.FOREVER = -1)] = "FOREVER"),
    (e.UNTIL_8AM = "until8AM"));
})(MuteDuration || (exports.MuteDuration = MuteDuration = {})),
  ((e) => {
    ((e[(e.MUTE = 1)] = "MUTE"), (e[(e.UNMUTE = 3)] = "UNMUTE"));
  })(MuteAction || (exports.MuteAction = MuteAction = {})),
  (exports.setMuteFactory = (0, utils_js_1.apiFactory)()((e, u, s) => {
    let n = s.makeURL(
      e.zpwServiceMap.profile[0] + "/api/social/profile/setmute",
    );
    return async function (e = {}, t, r = index_js_1.ThreadType.User) {
      var { duration: e = MuteDuration.FOREVER, action: o = MuteAction.MUTE } =
        e;
      let i;
      var a = {
          toid: t,
          duration: (i =
            o === MuteAction.UNMUTE || e === MuteDuration.FOREVER
              ? -1
              : e === MuteDuration.UNTIL_8AM
                ? ((t = new Date()),
                  (a = new Date(t)).setHours(8, 0, 0, 0),
                  8 <= t.getHours() && a.setDate(a.getDate() + 1),
                  Math.floor((a.getTime() - t.getTime()) / 1e3))
                : e),
          action: o,
          startTime: Math.floor(Date.now() / 1e3),
          muteType: r === index_js_1.ThreadType.User ? 1 : 2,
          imei: u.imei,
        },
        t = s.encodeAES(JSON.stringify(a));
      if (t)
        return (
          (e = await s.request(n, {
            method: "POST",
            body: new URLSearchParams({ params: t }),
          })),
          s.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
