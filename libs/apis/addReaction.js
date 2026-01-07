(Object.defineProperty(exports, "__esModule", { value: true }),
  (exports.addReactionFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");

exports.addReactionFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  const endpoints = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.reaction[0] + "/api/message/reaction",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.reaction[0] + "/api/group/reaction",
    ),
  };

  return async function addReaction(reaction, message) {
    const endpoint = endpoints[message.type];
    let reactionType, reactionSource;

    if ("object" == typeof reaction) {
      reactionType = reaction.rType;
      reactionSource = reaction.source;
    } else {
      switch (reaction) {
        case index_js_1.Reactions.HAHA:
          reactionType = 0; reactionSource = 6; break;
        case index_js_1.Reactions.LIKE:
          reactionType = 3; reactionSource = 6; break;
        case index_js_1.Reactions.HEART:
          reactionType = 5; reactionSource = 6; break;
        case index_js_1.Reactions.WOW:
          reactionType = 32; reactionSource = 6; break;
        case index_js_1.Reactions.CRY:
          reactionType = 2; reactionSource = 6; break;
        case index_js_1.Reactions.ANGRY:
          reactionType = 20; reactionSource = 6; break;
        case index_js_1.Reactions.KISS:
          reactionType = 8; reactionSource = 6; break;
        case index_js_1.Reactions.TEARS_OF_JOY:
          reactionType = 7; reactionSource = 6; break;
        case index_js_1.Reactions.SHIT:
          reactionType = 66; reactionSource = 6; break;
        case index_js_1.Reactions.ROSE:
          reactionType = 120; reactionSource = 6; break;
        case index_js_1.Reactions.BROKEN_HEART:
          reactionType = 65; reactionSource = 6; break;
        case index_js_1.Reactions.DISLIKE:
          reactionType = 4; reactionSource = 6; break;
        case index_js_1.Reactions.LOVE:
          reactionType = 29; reactionSource = 6; break;
        case index_js_1.Reactions.CONFUSED:
          reactionType = 51; reactionSource = 6; break;
        case index_js_1.Reactions.WINK:
          reactionType = 45; reactionSource = 6; break;
        case index_js_1.Reactions.FADE:
          reactionType = 121; reactionSource = 6; break;
        case index_js_1.Reactions.SUN:
          reactionType = 67; reactionSource = 6; break;
        case index_js_1.Reactions.BIRTHDAY:
          reactionType = 126; reactionSource = 6; break;
        case index_js_1.Reactions.BOMB:
          reactionType = 127; reactionSource = 6; break;
        case index_js_1.Reactions.OK:
          reactionType = 68; reactionSource = 6; break;
        case index_js_1.Reactions.PEACE:
          reactionType = 69; reactionSource = 6; break;
        case index_js_1.Reactions.THANKS:
          reactionType = 70; reactionSource = 6; break;
        case index_js_1.Reactions.PUNCH:
          reactionType = 71; reactionSource = 6; break;
        case index_js_1.Reactions.SHARE:
          reactionType = 72; reactionSource = 6; break;
        case index_js_1.Reactions.PRAY:
          reactionType = 73; reactionSource = 6; break;
        case index_js_1.Reactions.NO:
          reactionType = 131; reactionSource = 6; break;
        case index_js_1.Reactions.BAD:
          reactionType = 132; reactionSource = 6; break;
        case index_js_1.Reactions.LOVE_YOU:
          reactionType = 133; reactionSource = 6; break;
        case index_js_1.Reactions.SAD:
          reactionType = 1; reactionSource = 6; break;
        case index_js_1.Reactions.VERY_SAD:
          reactionType = 16; reactionSource = 6; break;
        case index_js_1.Reactions.COOL:
          reactionType = 21; reactionSource = 6; break;
        case index_js_1.Reactions.NERD:
          reactionType = 22; reactionSource = 6; break;
        case index_js_1.Reactions.BIG_SMILE:
          reactionType = 23; reactionSource = 6; break;
        case index_js_1.Reactions.SUNGLASSES:
          reactionType = 26; reactionSource = 6; break;
        case index_js_1.Reactions.NEUTRAL:
          reactionType = 30; reactionSource = 6; break;
        case index_js_1.Reactions.SAD_FACE:
          reactionType = 35; reactionSource = 6; break;
        case index_js_1.Reactions.BYE:
          reactionType = 36; reactionSource = 6; break;
        case index_js_1.Reactions.SLEEPY:
          reactionType = 38; reactionSource = 6; break;
        case index_js_1.Reactions.WIPE:
          reactionType = 39; reactionSource = 6; break;
        case index_js_1.Reactions.DIG:
          reactionType = 42; reactionSource = 6; break;
        case index_js_1.Reactions.ANGUISH:
          reactionType = 44; reactionSource = 6; break;
        case index_js_1.Reactions.HANDCLAP:
          reactionType = 46; reactionSource = 6; break;
        case index_js_1.Reactions.ANGRY_FACE:
          reactionType = 47; reactionSource = 6; break;
        case index_js_1.Reactions.F_CHAIR:
          reactionType = 48; reactionSource = 6; break;
        case index_js_1.Reactions.L_CHAIR:
          reactionType = 49; reactionSource = 6; break;
        case index_js_1.Reactions.R_CHAIR:
          reactionType = 50; reactionSource = 6; break;
        case index_js_1.Reactions.SILENT:
          reactionType = 52; reactionSource = 6; break;
        case index_js_1.Reactions.SURPRISE:
          reactionType = 53; reactionSource = 6; break;
        case index_js_1.Reactions.EMBARRASSED:
          reactionType = 54; reactionSource = 6; break;
        case index_js_1.Reactions.AFRAID:
          reactionType = 60; reactionSource = 6; break;
        case index_js_1.Reactions.SAD2:
          reactionType = 61; reactionSource = 6; break;
        case index_js_1.Reactions.BIG_LAUGH:
          reactionType = 62; reactionSource = 6; break;
        case index_js_1.Reactions.RICH:
          reactionType = 63; reactionSource = 6; break;
        case index_js_1.Reactions.BEER:
          reactionType = 99; reactionSource = 6; break;
        default:
          reactionType = -1; reactionSource = 6;
      }
    }

    const reactionIcon = "object" == typeof reaction ? reaction.icon : reaction;

    if (null == reactionType || null == reactionSource || null == reactionIcon) {
      throw new ZaloApiError_js_1.ZaloApiError("Invalid reaction");
    }

    const requestParams = {
      react_list: [
        {
          message: JSON.stringify({
            rMsg: [
              {
                gMsgID: parseInt(message.data.msgId),
                cMsgID: parseInt(message.data.cliMsgId),
                msgType: 1,
              },
            ],
            rIcon: reactionIcon,
            rType: reactionType,
            source: reactionSource,
          }),
          clientId: Date.now(),
        },
      ],
    };

    if (message.type == index_js_1.ThreadType.User) {
      requestParams.toid = message.threadId;
    } else {
      requestParams.grid = message.threadId;
      requestParams.imei = appContext.imei;
    }

    const encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (!encryptedParams) {
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
    }

    const response = await api.request(endpoint, {
      method: "POST",
      body: new URLSearchParams({ params: encryptedParams }),
    });

    return api.resolve(response, (result) =>
      "string" == typeof result.data.msgIds
        ? { msgIds: JSON.parse(result.data.msgIds) }
        : result.data,
    );
  };
});
