(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.editReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.editReminderFactory = (0, utils_js_1.apiFactory)()((e, a, o) => {
  let p = {
    [index_js_1.ThreadType.User]: o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/oneone/update",
    ),
    [index_js_1.ThreadType.Group]: o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/topic/updatev2",
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
                color: -16777216,
                emoji: null != (t = e.emoji) ? t : "",
                startTime: null != (t = e.startTime) ? t : Date.now(),
                duration: -1,
                params: { title: e.title },
                needPin: !1,
                reminderId: e.topicId,
                repeat: null != (t = e.repeat) ? t : 0,
              }),
            }
          : {
              grid: r,
              type: 0,
              color: -16777216,
              emoji: null != (t = e.emoji) ? t : "",
              startTime: null != (r = e.startTime) ? r : Date.now(),
              duration: -1,
              params: JSON.stringify({ title: e.title }),
              topicId: e.topicId,
              repeat: null != (t = e.repeat) ? t : 0,
              imei: a.imei,
              pinAct: 2,
            },
      e = o.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (t = await o.request(p[i], {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        o.resolve(t)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
