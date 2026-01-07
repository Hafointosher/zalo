(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getReminderFactory = (0, utils_js_1.apiFactory)()((r, e, i) => {
  let o = i.makeURL(
    r.zpwServiceMap.group_board[0] + "/api/board/topic/getReminder",
  );
  return async function (r) {
    var r = { eventId: r, imei: e.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await i.request(i.makeURL(o, { params: r }), { method: "GET" })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
