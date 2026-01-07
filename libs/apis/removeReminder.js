(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.removeReminderFactory = (0, utils_js_1.apiFactory)()((e, i, a) => {
  let s = {
    [index_js_1.ThreadType.User]: a.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/oneone/remove",
    ),
    [index_js_1.ThreadType.Group]: a.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/topic/remove",
    ),
  };
  return async function (e, r, o = index_js_1.ThreadType.User) {
    var r =
        o === index_js_1.ThreadType.User
          ? { uid: r, reminderId: e }
          : { grid: r, topicId: e, imei: i.imei },
      e = a.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await a.request(s[o], {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
