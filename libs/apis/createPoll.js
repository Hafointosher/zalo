(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createPollFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createPollFactory = (0, utils_js_1.apiFactory)()((e, r, i) => {
  let t = i.makeURL(e.zpwServiceMap.group[0] + "/api/poll/create");
  return async function (e, o) {
    var o = {
        group_id: o,
        question: e.question,
        options: e.options,
        expired_time: null != (o = e.expiredTime) ? o : 0,
        pinAct: !1,
        allow_multi_choices: !!e.allowMultiChoices,
        allow_add_new_option: !!e.allowAddNewOption,
        is_hide_vote_preview: !!e.hideVotePreview,
        is_anonymous: !!e.isAnonymous,
        poll_type: 0,
        src: 1,
        imei: r.imei,
      },
      e = i.encodeAES(JSON.stringify(o));
    if (e)
      return (
        (o = await i.request(t, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        i.resolve(o)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
