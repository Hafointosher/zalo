(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateSettingsFactory = exports.UpdateSettingsType = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
var UpdateSettingsType;
(((type) => {
  ((type.ViewBirthday = "view_birthday"),
    (type.ShowOnlineStatus = "show_online_status"),
    (type.DisplaySeenStatus = "display_seen_status"),
    (type.ReceiveMessage = "receive_message"),
    (type.AcceptCall = "accept_stranger_call"),
    (type.AddFriendViaPhone = "add_friend_via_phone"),
    (type.AddFriendViaQR = "add_friend_via_qr"),
    (type.AddFriendViaGroup = "add_friend_via_group"),
    (type.AddFriendViaContact = "add_friend_via_contact"),
    (type.DisplayOnRecommendFriend = "display_on_recommend_friend"),
    (type.ArchivedChat = "archivedChatStatus"),
    (type.QuickMessage = "quickMessageStatus"));
})(
  UpdateSettingsType || (exports.UpdateSettingsType = UpdateSettingsType = {}),
),
  (exports.updateSettingsFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
    let endpoint = api.makeURL("https://wpa.chat.zalo.me/api/setting/update");
    return async function (settingKey, settingValue) {
      encryptedParams = api.encodeAES(JSON.stringify({ [settingKey]: settingValue }));
      if (encryptedParams)
        return (
          (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
          api.resolve(response)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
