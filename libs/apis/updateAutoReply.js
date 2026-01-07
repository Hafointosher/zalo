(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateAutoReplyFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateAutoReplyFactory = (0, utils_js_1.apiFactory)()((e, a, t) => {
  let o = t.makeURL(e.zpwServiceMap.auto_reply[0] + "/api/autoreply/update");
  return async function (e) {
    var r = Array.isArray(e.uids) ? e.uids : [e.uids],
      r = 2 === e.scope || 3 === e.scope ? r : [],
      e = {
        cliLang: a.language,
        id: e.id,
        enable: e.isEnable,
        content: e.content,
        startTime: e.startTime,
        endTime: e.endTime,
        recurrence: ["RRULE:FREQ=DAILY;"],
        scope: e.scope,
        uids: r,
      },
      r = t.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await t.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
