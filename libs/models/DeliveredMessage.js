(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.GroupDeliveredMessage = exports.UserDeliveredMessage = void 0));
let Enum_js_1 = require("./Enum.js");
class UserDeliveredMessage {
  constructor(e) {
    ((this.type = Enum_js_1.ThreadType.User),
      (this.data = e),
      (this.threadId = e.deliveredUids[0]),
      (this.isSelf = !1));
  }
}
exports.UserDeliveredMessage = UserDeliveredMessage;
class GroupDeliveredMessage {
  constructor(e, s) {
    ((this.type = Enum_js_1.ThreadType.Group),
      (this.data = s),
      (this.threadId = s.groupId),
      (this.isSelf = s.deliveredUids.includes(e)));
  }
}
exports.GroupDeliveredMessage = GroupDeliveredMessage;
