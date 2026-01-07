(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.GroupSeenMessage = exports.UserSeenMessage = void 0));
let Enum_js_1 = require("./Enum.js");
class UserSeenMessage {
  constructor(e) {
    ((this.type = Enum_js_1.ThreadType.User),
      (this.data = e),
      (this.threadId = e.idTo),
      (this.isSelf = !1));
  }
}
exports.UserSeenMessage = UserSeenMessage;
class GroupSeenMessage {
  constructor(e, s) {
    ((this.type = Enum_js_1.ThreadType.Group),
      (this.data = s),
      (this.threadId = s.groupId),
      (this.isSelf = s.seenUids.includes(e)));
  }
}
exports.GroupSeenMessage = GroupSeenMessage;
