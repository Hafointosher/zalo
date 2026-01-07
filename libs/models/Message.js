(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.GroupMessage = exports.UserMessage = void 0));
let Enum_js_1 = require("./Enum.js");
class UserMessage {
  constructor(e, s) {
    ((this.type = Enum_js_1.ThreadType.User),
      (this.data = s),
      (this.threadId = "0" == s.uidFrom ? s.idTo : s.uidFrom),
      (this.isSelf = "0" == s.uidFrom),
      "0" == s.idTo && (s.idTo = e),
      "0" == s.uidFrom && (s.uidFrom = e),
      s.quote && (s.quote.ownerId = String(s.quote.ownerId)));
  }
}
exports.UserMessage = UserMessage;
class GroupMessage {
  constructor(e, s) {
    ((this.type = Enum_js_1.ThreadType.Group),
      (this.data = s),
      (this.threadId = s.idTo),
      (this.isSelf = "0" == s.uidFrom),
      "0" == s.uidFrom && (s.uidFrom = e),
      s.quote && (s.quote.ownerId = String(s.quote.ownerId)));
  }
}
exports.GroupMessage = GroupMessage;
