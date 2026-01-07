var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, i, o, t) {
          void 0 === t && (t = o);
          var r = Object.getOwnPropertyDescriptor(i, o);
          ((r &&
            ("get" in r ? i.__esModule : !r.writable && !r.configurable)) ||
            (r = {
              enumerable: !0,
              get: function () {
                return i[o];
              },
            }),
            Object.defineProperty(e, t, r));
        }
      : function (e, i, o, t) {
          e[(t = void 0 === t ? o : t)] = i[o];
        }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, i) {
          Object.defineProperty(e, "default", { enumerable: !0, value: i });
        }
      : function (e, i) {
          e.default = i;
        }),
  __importStar =
    (this && this.__importStar) ||
    (() => {
      var r = function (e) {
        return (r =
          Object.getOwnPropertyNames ||
          function (e) {
            var i,
              o = [];
            for (i in e)
              Object.prototype.hasOwnProperty.call(e, i) && (o[o.length] = i);
            return o;
          })(e);
      };
      return function (e) {
        if (e && e.__esModule) return e;
        var i = {};
        if (null != e)
          for (var o = r(e), t = 0; t < o.length; t++)
            "default" !== o[t] && __createBinding(i, e, o[t]);
        return (__setModuleDefault(i, e), i);
      };
    })();
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.API = exports.Zalo = void 0));
let loginQR_js_1 = require("./apis/loginQR.js"),
  login_js_1 = require("./apis/login.js"),
  context_js_1 = require("./context.js"),
  utils_js_1 = require("./utils.js"),
  toughCookie = __importStar(require("tough-cookie")),
  ZaloApiError_js_1 = require("./Errors/ZaloApiError.js"),
  update_js_1 = require("./update.js"),
  apis_js_1 = require("./apis.js");
function randomUserAgentPC() {
  var e = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.166 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) Gecko/20100101 Firefox/136.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.3124.85",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.3124.85",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.3124.85",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 OPR/119.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 OPR/119.0.0.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 OPR/119.0.0.0",
  ];
  return e[Math.floor(Math.random() * e.length)];
}
Object.defineProperty(exports, "API", {
  enumerable: !0,
  get: function () {
    return apis_js_1.API;
  },
});
class Zalo {
  constructor(e = {}) {
    ((this.options = e), (this.enableEncryptParam = !0));
  }
  parseCookies(e) {
    let i,
      o = Array.isArray(e) ? e : e.cookies;
    o.forEach((e, i) => {
      "string" == typeof e.domain &&
        e.domain.startsWith(".") &&
        (o[i].domain = e.domain.slice(1));
    });
    var t,
      r = new toughCookie.CookieJar();
    for (t of o)
      try {
        r.setCookieSync(
          null !=
            (i = toughCookie.Cookie.fromJSON({ ...t, key: t.key || t.name }))
            ? i
            : "",
          "https://chat.zalo.me",
        );
      } catch (e) {
        (0, utils_js_1.logger)({
          options: { logging: this.options.logging },
        }).error("Failed to set cookie:", e);
      }
    return r;
  }
  validateParams(e) {
    if (!e.imei || !e.cookie || !e.userAgent)
      throw new ZaloApiError_js_1.ZaloApiError("Missing required params");
  }
  async login(e) {
    var i = (0, context_js_1.createContext)(
      this.options.apiType,
      this.options.apiVersion,
    );
    return (Object.assign(i.options, this.options), this.loginCookie(i, e));
  }
  async loginCookie(e, i) {
    (await (0, update_js_1.checkUpdate)(e),
      this.validateParams(i),
      (e.imei = i.imei),
      (e.cookie = this.parseCookies(i.cookie)),
      (e.userAgent = i.userAgent),
      (e.language = i.language || "vi"));
    var i = await (0, login_js_1.login)(e, this.enableEncryptParam),
      o = await (0, login_js_1.getServerInfo)(e, this.enableEncryptParam),
      t = null == i ? void 0 : i.data;
    if (!i || !t || !o)
      throw new ZaloApiError_js_1.ZaloApiError("Đăng nhập thất bại");
    if (
      ((e.secretKey = t.zpw_enk),
      (e.uid = t.uid),
      (e.settings = o.setttings || o.settings),
      (e.extraVer = o.extra_ver),
      (e.loginInfo = t),
      (0, context_js_1.isContextSession)(e))
    )
      return (
        (0, utils_js_1.logger)(e).info("Logged in as", t.uid),
        new apis_js_1.API(e, t.zpw_service_map_v3, t.zpw_ws)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Khởi tạo ngữ cảnh thất bại.");
  }
  async loginQR(e, i) {
    ((e = e || {}).userAgent || (e.userAgent = randomUserAgentPC()),
      e.language || (e.language = "vi"));
    var o,
      t = (0, context_js_1.createContext)(
        this.options.apiType,
        this.options.apiVersion,
      ),
      r =
        (Object.assign(t.options, this.options),
        await (0, loginQR_js_1.loginQR)(t, e, i));
    if (r)
      return (
        (o = (0, utils_js_1.generateZaloUUID)(e.userAgent)),
        i &&
          i({
            type: loginQR_js_1.LoginQRCallbackEventType.GotLoginInfo,
            data: { cookie: r.cookies, imei: o, userAgent: e.userAgent },
            actions: null,
          }),
        this.loginCookie(t, {
          cookie: r.cookies,
          imei: o,
          userAgent: e.userAgent,
          language: e.language,
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Unable to login with QRCode");
  }
}
exports.Zalo = Zalo;
