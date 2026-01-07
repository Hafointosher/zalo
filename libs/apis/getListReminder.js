(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getListReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.getListReminderFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoints = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.group_board[0] + "/api/board/oneone/list",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.group_board[0] + "/api/board/listReminder",
    ),
  };
  return async function (options, threadId, threadType = index_js_1.ThreadType.User) {
    var requestParams = {
        objectData: JSON.stringify(
          threadType === index_js_1.ThreadType.User
            ? {
                uid: threadId,
                board_type: 1,
                page: null != (page = options.page) ? page : 1,
                count: null != (count = options.count) ? count : 20,
                last_id: 0,
                last_type: 0,
              }
            : {
                group_id: threadId,
                board_type: 1,
                page: null != (page = options.page) ? page : 1,
                count: null != (count = options.count) ? count : 20,
                last_id: 0,
                last_type: 0,
              },
        ),
        ...(threadType === index_js_1.ThreadType.Group && { imei: appContext.imei }),
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoints[threadType], { params: encryptedParams }), {
          method: "GET",
        })),
        api.resolve(response, (result) => JSON.parse(result.data))
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
