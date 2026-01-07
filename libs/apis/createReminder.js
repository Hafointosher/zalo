(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.createReminderFactory = (0, utils_js_1.apiFactory)()((e, a, o) => {
  let s = {
    [index_js_1.ThreadType.User]: o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/oneone/create",
    ),
    [index_js_1.ThreadType.Group]: o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/topic/createv2",
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    var t,
      r =
        i === index_js_1.ThreadType.User
          ? {
              objectData: JSON.stringify({
                toUid: r,
                type: 0,
                color: -16245706,
                emoji: null != (t = e.emoji) ? t : "⏰",
                startTime: null != (t = e.startTime) ? t : Date.now(),
                duration: -1,
                params: { title: e.title },
                needPin: !1,
                repeat:
                  null != (t = e.repeat)
                    ? t
                    : index_js_1.ReminderRepeatMode.None,
                creatorUid: a.uid,
                src: 1,
              }),
              imei: a.imei,
            }
          : {
              grid: r,
              type: 0,
              color: -16245706,
              emoji: null != (t = e.emoji) ? t : "⏰",
              startTime: null != (r = e.startTime) ? r : Date.now(),
              duration: -1,
              params: JSON.stringify({ title: e.title }),
              repeat:
                null != (t = e.repeat) ? t : index_js_1.ReminderRepeatMode.None,
              src: 1,
              imei: a.imei,
              pinAct: 0,
            },
      e = o.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (t = await o.request(s[i], {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        o.resolve(t)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
