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
  var userAgents = [
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
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}
Object.defineProperty(exports, "API", {
  enumerable: !0,
  get: function () {
    return apis_js_1.API;
  },
});
class Zalo {
  constructor(options = {}) {
    ((this.options = options), (this.enableEncryptParam = !0));
  }
  parseCookies(cookieData) {
    let parsedCookie,
      cookies = Array.isArray(cookieData) ? cookieData : cookieData.cookies;
    cookies.forEach((cookie, index) => {
      "string" == typeof cookie.domain &&
        cookie.domain.startsWith(".") &&
        (cookies[index].domain = cookie.domain.slice(1));
    });
    var cookie,
      cookieJar = new toughCookie.CookieJar();
    for (cookie of cookies)
      try {
        cookieJar.setCookieSync(
          null !=
            (parsedCookie = toughCookie.Cookie.fromJSON({ ...cookie, key: cookie.key || cookie.name }))
            ? parsedCookie
            : "",
          "https://chat.zalo.me",
        );
      } catch (error) {
        (0, utils_js_1.logger)({
          options: { logging: this.options.logging },
        }).error("Failed to set cookie:", error);
      }
    return cookieJar;
  }
  validateParams(params) {
    if (!params.imei || !params.cookie || !params.userAgent)
      throw new ZaloApiError_js_1.ZaloApiError("Missing required params");
  }
  async login(credentials) {
    var context = (0, context_js_1.createContext)(
      this.options.apiType,
      this.options.apiVersion,
    );
    return (Object.assign(context.options, this.options), this.loginCookie(context, credentials));
  }
  async loginCookie(context, credentials) {
    (await (0, update_js_1.checkUpdate)(context),
      this.validateParams(credentials),
      (context.imei = credentials.imei),
      (context.cookie = this.parseCookies(credentials.cookie)),
      (context.userAgent = credentials.userAgent),
      (context.language = credentials.language || "vi"));
    var loginResult = await (0, login_js_1.login)(context, this.enableEncryptParam),
      serverInfo = await (0, login_js_1.getServerInfo)(context, this.enableEncryptParam),
      loginData = null == loginResult ? void 0 : loginResult.data;
    if (!loginResult || !loginData || !serverInfo)
      throw new ZaloApiError_js_1.ZaloApiError("Đăng nhập thất bại");
    if (
      ((context.secretKey = loginData.zpw_enk),
      (context.uid = loginData.uid),
      (context.settings = serverInfo.setttings || serverInfo.settings),
      (context.extraVer = serverInfo.extra_ver),
      (context.loginInfo = loginData),
      (0, context_js_1.isContextSession)(context))
    )
      return (
        (0, utils_js_1.logger)(context).info("Logged in as", loginData.uid),
        new apis_js_1.API(context, loginData.zpw_service_map_v3, loginData.zpw_ws)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Khởi tạo ngữ cảnh thất bại.");
  }
  async loginQR(qrOptions, callback) {
    ((qrOptions = qrOptions || {}).userAgent || (qrOptions.userAgent = randomUserAgentPC()),
      qrOptions.language || (qrOptions.language = "vi"));
    var imei,
      context = (0, context_js_1.createContext)(
        this.options.apiType,
        this.options.apiVersion,
      ),
      qrResult =
        (Object.assign(context.options, this.options),
        await (0, loginQR_js_1.loginQR)(context, qrOptions, callback));
    if (qrResult)
      return (
        (imei = (0, utils_js_1.generateZaloUUID)(qrOptions.userAgent)),
        callback &&
          callback({
            type: loginQR_js_1.LoginQRCallbackEventType.GotLoginInfo,
            data: { cookie: qrResult.cookies, imei: imei, userAgent: qrOptions.userAgent },
            actions: null,
          }),
        this.loginCookie(context, {
          cookie: qrResult.cookies,
          imei: imei,
          userAgent: qrOptions.userAgent,
          language: qrOptions.language,
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Unable to login with QRCode");
  }
}
exports.Zalo = Zalo;
