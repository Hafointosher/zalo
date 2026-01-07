(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.Undo = void 0));
class Undo {
  constructor(o, d, i) {
    ((this.data = d),
      (this.threadId = i || "0" == d.uidFrom ? d.idTo : d.uidFrom),
      (this.isSelf = "0" == d.uidFrom),
      (this.isGroup = i),
      "0" == d.idTo && (d.idTo = o),
      "0" == d.uidFrom && (d.uidFrom = o));
  }
}
exports.Undo = Undo;
