var FriendEventType;
function initializeFriendEvent(e, E, n) {
  return n == FriendEventType.ADD ||
    n == FriendEventType.REMOVE ||
    n == FriendEventType.BLOCK ||
    n == FriendEventType.UNBLOCK ||
    n == FriendEventType.BLOCK_CALL ||
    n == FriendEventType.UNBLOCK_CALL
    ? {
        type: n,
        data: E,
        threadId: E,
        isSelf: ![FriendEventType.ADD, FriendEventType.REMOVE].includes(n),
      }
    : n == FriendEventType.REJECT_REQUEST ||
        n == FriendEventType.UNDO_REQUEST ||
        n == FriendEventType.REQUEST
      ? { type: n, data: E, threadId: E.toUid, isSelf: E.fromUid == e }
      : n == FriendEventType.SEEN_FRIEND_REQUEST
        ? { type: n, data: E, threadId: e, isSelf: !0 }
        : n == FriendEventType.PIN_CREATE || n == FriendEventType.PIN_UNPIN
          ? {
              type: n,
              data: E,
              threadId: E.conversationId,
              isSelf: E.actorId == e,
            }
          : {
              type: FriendEventType.UNKNOWN,
              data: JSON.stringify(E),
              threadId: "",
              isSelf: !1,
            };
}
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.FriendEventType = void 0),
  (exports.initializeFriendEvent = initializeFriendEvent),
  ((e) => {
    ((e[(e.ADD = 0)] = "ADD"),
      (e[(e.REMOVE = 1)] = "REMOVE"),
      (e[(e.REQUEST = 2)] = "REQUEST"),
      (e[(e.UNDO_REQUEST = 3)] = "UNDO_REQUEST"),
      (e[(e.REJECT_REQUEST = 4)] = "REJECT_REQUEST"),
      (e[(e.SEEN_FRIEND_REQUEST = 5)] = "SEEN_FRIEND_REQUEST"),
      (e[(e.BLOCK = 6)] = "BLOCK"),
      (e[(e.UNBLOCK = 7)] = "UNBLOCK"),
      (e[(e.BLOCK_CALL = 8)] = "BLOCK_CALL"),
      (e[(e.UNBLOCK_CALL = 9)] = "UNBLOCK_CALL"),
      (e[(e.PIN_UNPIN = 10)] = "PIN_UNPIN"),
      (e[(e.PIN_CREATE = 11)] = "PIN_CREATE"),
      (e[(e.UNKNOWN = 12)] = "UNKNOWN"));
  })(FriendEventType || (exports.FriendEventType = FriendEventType = {})));
