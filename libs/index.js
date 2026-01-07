var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, r, n) {
          void 0 === n && (n = r);
          var s = Object.getOwnPropertyDescriptor(t, r);
          ((s &&
            ("get" in s ? t.__esModule : !s.writable && !s.configurable)) ||
            (s = {
              enumerable: !0,
              get: function () {
                return t[r];
              },
            }),
            Object.defineProperty(e, n, s));
        }
      : function (e, t, r, n) {
          e[(n = void 0 === n ? r : n)] = t[r];
        }),
  __exportStar =
    (this && this.__exportStar) ||
    function (e, t) {
      for (var r in e)
        "default" === r ||
          Object.prototype.hasOwnProperty.call(t, r) ||
          __createBinding(t, e, r);
    },
  listen_js_1 =
    (Object.defineProperty(exports, "__esModule", { value: !0 }),
    (exports.UpdateSettingsType =
      exports.UpdateLangAvailableLanguages =
      exports.ChatTTL =
      exports.MuteDuration =
      exports.MuteAction =
      exports.ReportReason =
      exports.Urgency =
      exports.TextStyle =
      exports.ReviewPendingMemberRequestStatus =
      exports.LoginQRCallbackEventType =
      exports.CloseReason =
        void 0),
    __exportStar(require("./Errors/index.js"), exports),
    __exportStar(require("./models/index.js"), exports),
    __exportStar(require("./zalo.js"), exports),
    require("./apis/listen.js")),
  loginQR_js_1 =
    (Object.defineProperty(exports, "CloseReason", {
      enumerable: !0,
      get: function () {
        return listen_js_1.CloseReason;
      },
    }),
    require("./apis/loginQR.js")),
  reviewPendingMemberRequest_js_1 =
    (Object.defineProperty(exports, "LoginQRCallbackEventType", {
      enumerable: !0,
      get: function () {
        return loginQR_js_1.LoginQRCallbackEventType;
      },
    }),
    require("./apis/reviewPendingMemberRequest.js")),
  sendMessage_js_1 =
    (Object.defineProperty(exports, "ReviewPendingMemberRequestStatus", {
      enumerable: !0,
      get: function () {
        return reviewPendingMemberRequest_js_1.ReviewPendingMemberRequestStatus;
      },
    }),
    require("./apis/sendMessage.js")),
  sendReport_js_1 =
    (Object.defineProperty(exports, "TextStyle", {
      enumerable: !0,
      get: function () {
        return sendMessage_js_1.TextStyle;
      },
    }),
    Object.defineProperty(exports, "Urgency", {
      enumerable: !0,
      get: function () {
        return sendMessage_js_1.Urgency;
      },
    }),
    require("./apis/sendReport.js")),
  setMute_js_1 =
    (Object.defineProperty(exports, "ReportReason", {
      enumerable: !0,
      get: function () {
        return sendReport_js_1.ReportReason;
      },
    }),
    require("./apis/setMute.js")),
  updateAutoDeleteChat_js_1 =
    (Object.defineProperty(exports, "MuteAction", {
      enumerable: !0,
      get: function () {
        return setMute_js_1.MuteAction;
      },
    }),
    Object.defineProperty(exports, "MuteDuration", {
      enumerable: !0,
      get: function () {
        return setMute_js_1.MuteDuration;
      },
    }),
    require("./apis/updateAutoDeleteChat.js")),
  updateLang_js_1 =
    (Object.defineProperty(exports, "ChatTTL", {
      enumerable: !0,
      get: function () {
        return updateAutoDeleteChat_js_1.ChatTTL;
      },
    }),
    require("./apis/updateLang.js")),
  updateSettings_js_1 =
    (Object.defineProperty(exports, "UpdateLangAvailableLanguages", {
      enumerable: !0,
      get: function () {
        return updateLang_js_1.UpdateLangAvailableLanguages;
      },
    }),
    require("./apis/updateSettings.js"));
Object.defineProperty(exports, "UpdateSettingsType", {
  enumerable: !0,
  get: function () {
    return updateSettings_js_1.UpdateSettingsType;
  },
});
