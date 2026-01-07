(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getListReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.getListReminderFactory = (0, utils_js_1.apiFactory)()((e, t, o) => {
  let s = {
    [index_js_1.ThreadType.User]: o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/oneone/list",
    ),
    [index_js_1.ThreadType.Group]: o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/listReminder",
    ),
  };
  return async function (e, r, a = index_js_1.ThreadType.User) {
    var i = {
        objectData: JSON.stringify(
          a === index_js_1.ThreadType.User
            ? {
                uid: r,
                board_type: 1,
                page: null != (i = e.page) ? i : 1,
                count: null != (i = e.count) ? i : 20,
                last_id: 0,
                last_type: 0,
              }
            : {
                group_id: r,
                board_type: 1,
                page: null != (i = e.page) ? i : 1,
                count: null != (r = e.count) ? r : 20,
                last_id: 0,
                last_type: 0,
              },
        ),
        ...(a === index_js_1.ThreadType.Group && { imei: t.imei }),
      },
      e = o.encodeAES(JSON.stringify(i));
    if (e)
      return (
        (r = await o.request(o.makeURL(s[a], { params: e }), {
          method: "GET",
        })),
        o.resolve(r, (e) => JSON.parse(e.data))
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
