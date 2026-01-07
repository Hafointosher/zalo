(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.GroupTyping = exports.UserTyping = void 0));
let Enum_js_1 = require("./Enum.js");
class UserTyping {
  constructor(s) {
    ((this.type = Enum_js_1.ThreadType.User),
      (this.data = s),
      (this.threadId = s.uid),
      (this.isSelf = !1));
  }
}
exports.UserTyping = UserTyping;
class GroupTyping {
  constructor(s) {
    ((this.type = Enum_js_1.ThreadType.Group),
      (this.data = s),
      (this.threadId = s.gid),
      (this.isSelf = !1));
  }
}
exports.GroupTyping = GroupTyping;
