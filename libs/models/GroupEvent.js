var GroupEventType;
function initializeGroupEvent(t, e, p, E) {
  var r = "group_id" in e ? e.group_id : e.groupId;
  return p == GroupEventType.JOIN_REQUEST
    ? { type: p, act: E, data: e, threadId: r, isSelf: !1 }
    : p == GroupEventType.NEW_PIN_TOPIC ||
        p == GroupEventType.UNPIN_TOPIC ||
        p == GroupEventType.UPDATE_PIN_TOPIC ||
        p == GroupEventType.REORDER_PIN_TOPIC
      ? { type: p, act: E, data: e, threadId: r, isSelf: e.actorId == t }
      : p == GroupEventType.UPDATE_BOARD || p == GroupEventType.REMOVE_BOARD
        ? { type: p, act: E, data: e, threadId: r, isSelf: e.sourceId == t }
        : p == GroupEventType.ACCEPT_REMIND || p == GroupEventType.REJECT_REMIND
          ? {
              type: p,
              act: E,
              data: e,
              threadId: r,
              isSelf: e.updateMembers.some((e) => e == t),
            }
          : p == GroupEventType.REMIND_TOPIC
            ? {
                type: p,
                act: E,
                data: e,
                threadId: r,
                isSelf: e.creatorId == t,
              }
            : {
                type: p,
                act: E,
                data: (p = e),
                threadId: r,
                isSelf:
                  (null == (E = p.updateMembers)
                    ? void 0
                    : E.some((e) => e.id == t)) || p.sourceId == t,
              };
}
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.GroupEventType = void 0),
  (exports.initializeGroupEvent = initializeGroupEvent),
  ((e) => {
    ((e.JOIN_REQUEST = "join_request"),
      (e.JOIN = "join"),
      (e.LEAVE = "leave"),
      (e.REMOVE_MEMBER = "remove_member"),
      (e.BLOCK_MEMBER = "block_member"),
      (e.UPDATE_SETTING = "update_setting"),
      (e.UPDATE = "update"),
      (e.NEW_LINK = "new_link"),
      (e.ADD_ADMIN = "add_admin"),
      (e.REMOVE_ADMIN = "remove_admin"),
      (e.NEW_PIN_TOPIC = "new_pin_topic"),
      (e.UPDATE_PIN_TOPIC = "update_pin_topic"),
      (e.REORDER_PIN_TOPIC = "reorder_pin_topic"),
      (e.UPDATE_BOARD = "update_board"),
      (e.REMOVE_BOARD = "remove_board"),
      (e.UPDATE_TOPIC = "update_topic"),
      (e.UNPIN_TOPIC = "unpin_topic"),
      (e.REMOVE_TOPIC = "remove_topic"),
      (e.ACCEPT_REMIND = "accept_remind"),
      (e.REJECT_REMIND = "reject_remind"),
      (e.REMIND_TOPIC = "remind_topic"),
      (e.UPDATE_AVATAR = "update_avatar"),
      (e.UNKNOWN = "unknown"));
  })(GroupEventType || (exports.GroupEventType = GroupEventType = {})));
