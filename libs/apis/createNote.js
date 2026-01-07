(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createNoteFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createNoteFactory = (0, utils_js_1.apiFactory)()((r, a, t) => {
  let i = t.makeURL(
    r.zpwServiceMap.group_board[0] + "/api/board/topic/createv2",
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
        repeat: 0,
        src: 1,
        imei: a.imei,
        pinAct: r.pinAct ? 1 : 0,
      },
      r = t.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await t.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        t.resolve(
          e,
          (r) => (
            "string" == typeof r.data.params &&
              (r.data.params = JSON.parse(r.data.params)),
            r.data
          ),
        )
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
