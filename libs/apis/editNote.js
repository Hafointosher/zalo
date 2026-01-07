(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.editNoteFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.editNoteFactory = (0, utils_js_1.apiFactory)()((r, t, a) => {
  let i = a.makeURL(
    r.zpwServiceMap.group_board[0] + "/api/board/topic/updatev2",
  );
  return async function (r, e) {
    var e = {
        grid: e,
        type: 0,
        color: -16777216,
        emoji: "",
        startTime: -1,
        duration: -1,
        params: JSON.stringify({ title: r.title }),
        topicId: r.topicId,
        repeat: 0,
        imei: t.imei,
        pinAct: r.pinAct ? 1 : 2,
      },
      r = a.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await a.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        a.resolve(e, (r) => {
          r = r.data;
          return (
            "string" == typeof r.params && (r.params = JSON.parse(r.params)),
            r
          );
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
