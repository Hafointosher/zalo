(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.editReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.editReminderFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.group_board[0] + "/api/board/oneone/update",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.group_board[0] + "/api/board/topic/updatev2",
    ),
  };
  return async function (reminder, groupId, threadType = index_js_1.ThreadType.User) {
    var temp,
      requestParams =
        threadType === index_js_1.ThreadType.User
          ? {
              objectData: JSON.stringify({
                toUid: groupId,
                type: 0,
                color: -16777216,
                emoji: null != (temp = reminder.emoji) ? temp : "",
                startTime: null != (temp = reminder.startTime) ? temp : Date.now(),
                duration: -1,
                params: { title: reminder.title },
                needPin: !1,
                reminderId: reminder.topicId,
                repeat: null != (temp = reminder.repeat) ? temp : 0,
              }),
            }
          : {
              grid: groupId,
              type: 0,
              color: -16777216,
              emoji: null != (temp = reminder.emoji) ? temp : "",
              startTime: null != (temp = reminder.startTime) ? temp : Date.now(),
              duration: -1,
              params: JSON.stringify({ title: reminder.title }),
              topicId: reminder.topicId,
              repeat: null != (temp = reminder.repeat) ? temp : 0,
              imei: appContext.imei,
              pinAct: 2,
            },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint[threadType], {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
