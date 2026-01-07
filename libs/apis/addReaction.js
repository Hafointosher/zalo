(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addReactionFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.addReactionFactory = (0, utils_js_1.apiFactory)()((e, _, c) => {
  let r = {
    [index_js_1.ThreadType.User]: c.makeURL(
      e.zpwServiceMap.reaction[0] + "/api/message/reaction",
    ),
    [index_js_1.ThreadType.Group]: c.makeURL(
      e.zpwServiceMap.reaction[0] + "/api/group/reaction",
    ),
  };
  return async function (e, a) {
    var s = r[a.type];
    let i, n;
    if ("object" == typeof e) ((i = e.rType), (n = e.source));
    else
      switch (e) {
        case index_js_1.Reactions.HAHA:
          ((i = 0), (n = 6));
          break;
        case index_js_1.Reactions.LIKE:
          ((i = 3), (n = 6));
          break;
        case index_js_1.Reactions.HEART:
          ((i = 5), (n = 6));
          break;
        case index_js_1.Reactions.WOW:
          ((i = 32), (n = 6));
          break;
        case index_js_1.Reactions.CRY:
          ((i = 2), (n = 6));
          break;
        case index_js_1.Reactions.ANGRY:
          ((i = 20), (n = 6));
          break;
        case index_js_1.Reactions.KISS:
          ((i = 8), (n = 6));
          break;
        case index_js_1.Reactions.TEARS_OF_JOY:
          ((i = 7), (n = 6));
          break;
        case index_js_1.Reactions.SHIT:
          ((i = 66), (n = 6));
          break;
        case index_js_1.Reactions.ROSE:
          ((i = 120), (n = 6));
          break;
        case index_js_1.Reactions.BROKEN_HEART:
          ((i = 65), (n = 6));
          break;
        case index_js_1.Reactions.DISLIKE:
          ((i = 4), (n = 6));
          break;
        case index_js_1.Reactions.LOVE:
          ((i = 29), (n = 6));
          break;
        case index_js_1.Reactions.CONFUSED:
          ((i = 51), (n = 6));
          break;
        case index_js_1.Reactions.WINK:
          ((i = 45), (n = 6));
          break;
        case index_js_1.Reactions.FADE:
          ((i = 121), (n = 6));
          break;
        case index_js_1.Reactions.SUN:
          ((i = 67), (n = 6));
          break;
        case index_js_1.Reactions.BIRTHDAY:
          ((i = 126), (n = 6));
          break;
        case index_js_1.Reactions.BOMB:
          ((i = 127), (n = 6));
          break;
        case index_js_1.Reactions.OK:
          ((i = 68), (n = 6));
          break;
        case index_js_1.Reactions.PEACE:
          ((i = 69), (n = 6));
          break;
        case index_js_1.Reactions.THANKS:
          ((i = 70), (n = 6));
          break;
        case index_js_1.Reactions.PUNCH:
          ((i = 71), (n = 6));
          break;
        case index_js_1.Reactions.SHARE:
          ((i = 72), (n = 6));
          break;
        case index_js_1.Reactions.PRAY:
          ((i = 73), (n = 6));
          break;
        case index_js_1.Reactions.NO:
          ((i = 131), (n = 6));
          break;
        case index_js_1.Reactions.BAD:
          ((i = 132), (n = 6));
          break;
        case index_js_1.Reactions.LOVE_YOU:
          ((i = 133), (n = 6));
          break;
        case index_js_1.Reactions.SAD:
          ((i = 1), (n = 6));
          break;
        case index_js_1.Reactions.VERY_SAD:
          ((i = 16), (n = 6));
          break;
        case index_js_1.Reactions.COOL:
          ((i = 21), (n = 6));
          break;
        case index_js_1.Reactions.NERD:
          ((i = 22), (n = 6));
          break;
        case index_js_1.Reactions.BIG_SMILE:
          ((i = 23), (n = 6));
          break;
        case index_js_1.Reactions.SUNGLASSES:
          ((i = 26), (n = 6));
          break;
        case index_js_1.Reactions.NEUTRAL:
          ((i = 30), (n = 6));
          break;
        case index_js_1.Reactions.SAD_FACE:
          ((i = 35), (n = 6));
          break;
        case index_js_1.Reactions.BYE:
          ((i = 36), (n = 6));
          break;
        case index_js_1.Reactions.SLEEPY:
          ((i = 38), (n = 6));
          break;
        case index_js_1.Reactions.WIPE:
          ((i = 39), (n = 6));
          break;
        case index_js_1.Reactions.DIG:
          ((i = 42), (n = 6));
          break;
        case index_js_1.Reactions.ANGUISH:
          ((i = 44), (n = 6));
          break;
        case index_js_1.Reactions.HANDCLAP:
          ((i = 46), (n = 6));
          break;
        case index_js_1.Reactions.ANGRY_FACE:
          ((i = 47), (n = 6));
          break;
        case index_js_1.Reactions.F_CHAIR:
          ((i = 48), (n = 6));
          break;
        case index_js_1.Reactions.L_CHAIR:
          ((i = 49), (n = 6));
          break;
        case index_js_1.Reactions.R_CHAIR:
          ((i = 50), (n = 6));
          break;
        case index_js_1.Reactions.SILENT:
          ((i = 52), (n = 6));
          break;
        case index_js_1.Reactions.SURPRISE:
          ((i = 53), (n = 6));
          break;
        case index_js_1.Reactions.EMBARRASSED:
          ((i = 54), (n = 6));
          break;
        case index_js_1.Reactions.AFRAID:
          ((i = 60), (n = 6));
          break;
        case index_js_1.Reactions.SAD2:
          ((i = 61), (n = 6));
          break;
        case index_js_1.Reactions.BIG_LAUGH:
          ((i = 62), (n = 6));
          break;
        case index_js_1.Reactions.RICH:
          ((i = 63), (n = 6));
          break;
        case index_js_1.Reactions.BEER:
          ((i = 99), (n = 6));
          break;
        default:
          ((i = -1), (n = 6));
      }
    e = "object" == typeof e ? e.icon : e;
    if (null == i || null == n || null == e)
      throw new ZaloApiError_js_1.ZaloApiError("Invalid reaction");
    var e = {
        react_list: [
          {
            message: JSON.stringify({
              rMsg: [
                {
                  gMsgID: parseInt(a.data.msgId),
                  cMsgID: parseInt(a.data.cliMsgId),
                  msgType: 1,
                },
              ],
              rIcon: e,
              rType: i,
              source: n,
            }),
            clientId: Date.now(),
          },
        ],
      },
      a =
        (a.type == index_js_1.ThreadType.User
          ? (e.toid = a.threadId)
          : ((e.grid = a.threadId), (e.imei = _.imei)),
        c.encodeAES(JSON.stringify(e)));
    if (a)
      return (
        (e = await c.request(s, {
          method: "POST",
          body: new URLSearchParams({ params: a }),
        })),
        c.resolve(e, (e) =>
          "string" == typeof e.data.msgIds
            ? { msgIds: JSON.parse(e.data.msgIds) }
            : e.data,
        )
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
