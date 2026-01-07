(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getReminderResponsesFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getReminderResponsesFactory = (0, utils_js_1.apiFactory)()(
  (e, r, o) => {
    let s = o.makeURL(
      e.zpwServiceMap.group_board[0] + "/api/board/topic/listResponseEvent",
    );
    return async function (e) {
      var e = o.encodeAES(JSON.stringify({ eventId: e }));
      if (e)
        return (
          (e = await o.request(o.makeURL(s, { params: e }), { method: "GET" })),
          o.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
