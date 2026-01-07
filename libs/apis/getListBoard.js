(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getListBoardFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.getListBoardFactory = (0, utils_js_1.apiFactory)()((r, a, t) => {
  let o = t.makeURL(r.zpwServiceMap.group_board[0] + "/api/board/list");
  return async function (r, e) {
    var r = {
        group_id: e,
        board_type: 0,
        page: null != (e = r.page) ? e : 1,
        count: null != (e = r.count) ? e : 20,
        last_id: 0,
        last_type: 0,
        imei: a.imei,
      },
      e = t.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await t.request(t.makeURL(o, { params: e }), { method: "GET" })),
        t.resolve(r, (r) => {
          r = r.data;
          return (
            r.items.forEach((r) => {
              r.boardType != index_js_1.BoardType.Poll &&
                "string" == typeof (r = r.data).params &&
                (r.params = JSON.parse(r.params));
            }),
            r
          );
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
