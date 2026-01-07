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
  (exports.setMuteFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
      serviceUrls.zpwServiceMap.profile[0] + "/api/social/profile/setmute",
    );
    return async function (options = {}, threadId, threadType = index_js_1.ThreadType.User) {
      var { duration: muteDuration = MuteDuration.FOREVER, action: muteAction = MuteAction.MUTE } =
        options;
      let calculatedDuration;
      var requestParams = {
          toid: threadId,
          duration: (calculatedDuration =
            muteAction === MuteAction.UNMUTE || muteDuration === MuteDuration.FOREVER
              ? -1
              : muteDuration === MuteDuration.UNTIL_8AM
                ? ((now = new Date()),
                  (target = new Date(now)).setHours(8, 0, 0, 0),
                  8 <= now.getHours() && target.setDate(target.getDate() + 1),
                  Math.floor((target.getTime() - now.getTime()) / 1e3))
                : muteDuration),
          action: muteAction,
          startTime: Math.floor(Date.now() / 1e3),
          muteType: threadType === index_js_1.ThreadType.User ? 1 : 2,
          imei: appContext.imei,
        },
        now, target,
        encryptedParams = api.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams)
        return (
          (response = await api.request(endpoint, {
            method: "POST",
            body: new URLSearchParams({ params: encryptedParams }),
          })),
          api.resolve(response)
        );
      var response;
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
