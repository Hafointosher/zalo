(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addPollOptionsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addPollOptionsFactory = (0, utils_js_1.apiFactory)()((o, r, e) => {
  let t = e.makeURL(o.zpwServiceMap.group[0] + "/api/poll/option/add");
  return async function (o) {
    var o = {
        poll_id: o.pollId,
        new_options: JSON.stringify(o.options),
        voted_option_ids: o.votedOptionIds,
      },
      o = e.encodeAES(JSON.stringify(o));
    if (o)
      return (
        (o = await e.request(e.makeURL(t, { params: o }), { method: "GET" })),
        e.resolve(o)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
