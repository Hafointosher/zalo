(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.createReminderFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.group_board[0] + "/api/board/oneone/create",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.group_board[0] + "/api/board/topic/createv2",
    ),
  };
  return async function (reminder, groupId, threadType = index_js_1.ThreadType.User) {
    var requestParams =
        threadType === index_js_1.ThreadType.User
          ? {
              objectData: JSON.stringify({
                toUid: groupId,
                type: 0,
                color: -16245706,
                emoji: reminder.emoji ?? "⏰",
                startTime: reminder.startTime ?? Date.now(),
                duration: -1,
                params: { title: reminder.title },
                needPin: !1,
                repeat: reminder.repeat ?? index_js_1.ReminderRepeatMode.None,
                creatorUid: appContext.uid,
                src: 1,
              }),
              imei: appContext.imei,
            }
          : {
              grid: groupId,
              type: 0,
              color: -16245706,
              emoji: reminder.emoji ?? "⏰",
              startTime: reminder.startTime ?? Date.now(),
              duration: -1,
              params: JSON.stringify({ title: reminder.title }),
              repeat: reminder.repeat ?? index_js_1.ReminderRepeatMode.None,
              src: 1,
              imei: appContext.imei,
              pinAct: 0,
            },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams) {
      var response = await api.request(endpoint[threadType], {
        method: "POST",
        body: new URLSearchParams({ params: encryptedParams }),
      });
      return api.resolve(response);
    }
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
