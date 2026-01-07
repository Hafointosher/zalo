(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getListBoardFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.getListBoardFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group_board[0] + "/api/board/list");
  return async function (options, groupId) {
    var requestParams = {
        group_id: groupId,
        board_type: 0,
        page: null != (page = options.page) ? page : 1,
        count: null != (count = options.count) ? count : 20,
        last_id: 0,
        last_type: 0,
        imei: appContext.imei,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response, (result) => {
          data = result.data;
          return (
            data.items.forEach((item) => {
              item.boardType != index_js_1.BoardType.Poll &&
                "string" == typeof (itemData = item.data).params &&
                (itemData.params = JSON.parse(itemData.params));
            }),
            data
          );
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
