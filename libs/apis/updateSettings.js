(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateSettingsFactory = exports.UpdateSettingsType = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
var UpdateSettingsType;
(((e) => {
  ((e.ViewBirthday = "view_birthday"),
    (e.ShowOnlineStatus = "show_online_status"),
    (e.DisplaySeenStatus = "display_seen_status"),
    (e.ReceiveMessage = "receive_message"),
    (e.AcceptCall = "accept_stranger_call"),
    (e.AddFriendViaPhone = "add_friend_via_phone"),
    (e.AddFriendViaQR = "add_friend_via_qr"),
    (e.AddFriendViaGroup = "add_friend_via_group"),
    (e.AddFriendViaContact = "add_friend_via_contact"),
    (e.DisplayOnRecommendFriend = "display_on_recommend_friend"),
    (e.ArchivedChat = "archivedChatStatus"),
    (e.QuickMessage = "quickMessageStatus"));
})(
  UpdateSettingsType || (exports.UpdateSettingsType = UpdateSettingsType = {}),
),
  (exports.updateSettingsFactory = (0, utils_js_1.apiFactory)()((e, t, a) => {
    let r = a.makeURL("https://wpa.chat.zalo.me/api/setting/update");
    return async function (e, t) {
      e = a.encodeAES(JSON.stringify({ [e]: t }));
      if (e)
        return (
          (t = await a.request(a.makeURL(r, { params: e }), { method: "GET" })),
          a.resolve(t)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
