(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.LoginQRCallbackEventType = void 0),
  (exports.loginQR = loginQR));
let tough_cookie_1 = require("tough-cookie"),
  promises_1 = require("node:fs/promises"),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js"),
  ZaloApiLoginQRAborted_js_1 = require("../Errors/ZaloApiLoginQRAborted.js"),
  ZaloApiLoginQRDeclined_js_1 = require("../Errors/ZaloApiLoginQRDeclined.js");
var LoginQRCallbackEventType;
async function loadLoginPage(e) {
  e = (
    await (
      await (0, utils_js_1.request)(
        e,
        "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language":
              "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "cache-control": "max-age=0",
            priority: "u=0, i",
            "sec-ch-ua":
              '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            Referer: "https://chat.zalo.me/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          method: "GET",
        },
      )
    ).text()
  ).match(/https:\/\/stc-zlogin\.zdn\.vn\/main-([\d.]+)\.js/);
  return null == e ? void 0 : e[1];
}
async function getLoginInfo(e, o) {
  var t = new URLSearchParams();
  return (
    t.append("continue", "https://zalo.me/pc"),
    t.append("v", o),
    (0, utils_js_1.request)(e, "https://id.zalo.me/account/logininfo", {
      headers: {
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/x-www-form-urlencoded",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer:
          "https://id.zalo.me/account?continue=https%3A%2F%2Fzalo.me%2Fpc",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: t,
      method: "POST",
    })
      .then((e) => e.json())
      .catch((0, utils_js_1.logger)(e).error)
  );
}
async function verifyClient(e, o) {
  var t = new URLSearchParams();
  return (
    t.append("type", "device"),
    t.append("continue", "https://zalo.me/pc"),
    t.append("v", o),
    (0, utils_js_1.request)(e, "https://id.zalo.me/account/verify-client", {
      headers: {
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/x-www-form-urlencoded",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer:
          "https://id.zalo.me/account?continue=https%3A%2F%2Fzalo.me%2Fpc",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: t,
      method: "POST",
    })
      .then((e) => e.json())
      .catch((0, utils_js_1.logger)(e).error)
  );
}
async function generate(e, o) {
  var t = new URLSearchParams();
  return (
    t.append("continue", "https://zalo.me/pc"),
    t.append("v", o),
    (0, utils_js_1.request)(
      e,
      "https://id.zalo.me/account/authen/qr/generate",
      {
        headers: {
          accept: "*/*",
          "accept-language":
            "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
          "content-type": "application/x-www-form-urlencoded",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer:
            "https://id.zalo.me/account?continue=https%3A%2F%2Fzalo.me%2Fpc",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: t,
        method: "POST",
      },
    )
      .then((e) => e.json())
      .catch((0, utils_js_1.logger)(e).error)
  );
}
async function saveQRCodeToFile(e, o) {
  await (0, promises_1.writeFile)(e, o, "base64");
}
async function waitingScan(o, t, r, a) {
  var e = new URLSearchParams();
  return (
    e.append("code", r),
    e.append("continue", "https://chat.zalo.me/"),
    e.append("v", t),
    (0, utils_js_1.request)(
      o,
      "https://id.zalo.me/account/authen/qr/waiting-scan",
      {
        headers: {
          accept: "*/*",
          "accept-language":
            "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
          "content-type": "application/x-www-form-urlencoded",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer:
            "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: e,
        method: "POST",
        signal: a,
      },
    )
      .then((e) => e.json())
      .then((e) => (8 == e.error_code ? waitingScan(o, t, r, a) : e))
      .catch((e) => {
        a.aborted || (0, utils_js_1.logger)(o).error(e);
      })
  );
}
async function waitingConfirm(o, t, r, a) {
  var e = new URLSearchParams();
  return (
    e.append("code", r),
    e.append("gToken", ""),
    e.append("gAction", "CONFIRM_QR"),
    e.append("continue", "https://chat.zalo.me/"),
    e.append("v", t),
    (0, utils_js_1.logger)(o).info("Please confirm on your phone"),
    (0, utils_js_1.request)(
      o,
      "https://id.zalo.me/account/authen/qr/waiting-confirm",
      {
        headers: {
          accept: "*/*",
          "accept-language":
            "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
          "content-type": "application/x-www-form-urlencoded",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer:
            "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: e,
        method: "POST",
        signal: a,
      },
    )
      .then((e) => e.json())
      .then((e) => (8 == e.error_code ? waitingConfirm(o, t, r, a) : e))
      .catch((e) => {
        a.aborted || (0, utils_js_1.logger)(o).error(e);
      })
  );
}
async function checkSession(e) {
  return (0, utils_js_1.request)(
    e,
    "https://id.zalo.me/account/checksession?continue=https%3A%2F%2Fchat.zalo.me%2Findex.html",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language":
          "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        priority: "u=0, i",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "upgrade-insecure-requests": "1",
        Referer:
          "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      redirect: "manual",
      method: "GET",
    },
  ).catch((0, utils_js_1.logger)(e).error);
}
async function getUserInfo(e) {
  return (0, utils_js_1.request)(e, "https://jr.chat.zalo.me/jr/userinfo", {
    headers: {
      accept: "*/*",
      "accept-language":
        "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://chat.zalo.me/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    method: "GET",
  })
    .then((e) => e.json())
    .catch((0, utils_js_1.logger)(e).error);
}
async function loginQR(m, f, _) {
  return (
    (m.cookie = new tough_cookie_1.CookieJar()),
    (m.userAgent = f.userAgent),
    new Promise(async (e, o) => {
      let r,
        a = new AbortController(),
        i = null;
      function n() {
        (a.abort(), i && (clearTimeout(i), (i = null)));
      }
      try {
        function c() {
          return (n(), e(loginQR(m, f, _)));
        }
        function s() {
          return (
            n(),
            o(new ZaloApiLoginQRAborted_js_1.ZaloApiLoginQRAborted())
          );
        }
        m.options.logging && console.log();
        var l = await loadLoginPage(m);
        if (!l)
          throw new ZaloApiError_js_1.ZaloApiError(
            "Cannot get API login version",
          );
        ((0, utils_js_1.logger)(m).info("Got login version:", l),
          await getLoginInfo(m, l),
          await verifyClient(m, l));
        var p,
          d = await generate(m, l);
        if (!d || !d.data)
          throw new ZaloApiError_js_1.ZaloApiError(
            `Unable to generate QRCode
Response: ` + JSON.stringify(d, null, 2),
          );
        let t = d.data;
        (_
          ? _({
              type: LoginQRCallbackEventType.QRCodeGenerated,
              data: {
                ...d.data,
                image: d.data.image.replace(/^data:image\/png;base64,/, ""),
              },
              actions: {
                async saveToFile(e) {
                  var o;
                  (await saveQRCodeToFile(
                    (e =
                      void 0 === e
                        ? null != (o = f.qrPath)
                          ? o
                          : "qr.png"
                        : e),
                    t.image.replace(/^data:image\/png;base64,/, ""),
                  ),
                    (0, utils_js_1.logger)(m).info(
                      "Scan the QR code at",
                      `'${e}'`,
                      "to proceed with login",
                    ));
                },
                retry: c,
                abort: s,
              },
            })
          : (await saveQRCodeToFile(
              (p = null != (r = f.qrPath) ? r : "qr.png"),
              t.image.replace(/^data:image\/png;base64,/, ""),
            ),
            (0, utils_js_1.logger)(m).info(
              "Scan the QR code at",
              `'${p}'`,
              "to proceed with login",
            )),
          (i = setTimeout(() => {
            (n(),
              (0, utils_js_1.logger)(m).info("QR expired!"),
              _
                ? _({
                    type: LoginQRCallbackEventType.QRCodeExpired,
                    data: null,
                    actions: { retry: c, abort: s },
                  })
                : c());
          }, 1e5)));
        var h = await waitingScan(m, l, d.data.code, a.signal);
        if (!h || !h.data)
          throw new ZaloApiError_js_1.ZaloApiError("Cannot get scan result");
        _ &&
          _({
            type: LoginQRCallbackEventType.QRCodeScanned,
            data: h.data,
            actions: { retry: c, abort: s },
          });
        var g = await waitingConfirm(m, l, d.data.code, a.signal);
        if (!g)
          throw new ZaloApiError_js_1.ZaloApiError("Cannot get confirm result");
        if ((clearTimeout(i), -13 == g.error_code)) {
          if (_)
            return void _({
              type: LoginQRCallbackEventType.QRCodeDeclined,
              data: { code: t.code },
              actions: { retry: c, abort: s },
            });
          throw (
            (0, utils_js_1.logger)(m).error("QRCode login declined"),
            new ZaloApiLoginQRDeclined_js_1.ZaloApiLoginQRDeclined()
          );
        }
        if (0 != g.error_code)
          throw new ZaloApiError_js_1.ZaloApiError(
            `An error has occurred.
Response: ` + JSON.stringify(g, null, 2),
          );
        if (!(await checkSession(m)))
          throw new ZaloApiError_js_1.ZaloApiError(
            "Cannot get session, login failed",
          );
        (0, utils_js_1.logger)(m).info(
          "Successfully logged into the account",
          h.data.display_name,
        );
        var u = await getUserInfo(m);
        if (!u || !u.data)
          throw new ZaloApiError_js_1.ZaloApiError("Can't get account info");
        if (!u.data.logged)
          throw new ZaloApiError_js_1.ZaloApiError("Can't login");
        e({ cookies: m.cookie.toJSON().cookies, userInfo: u.data.info });
      } catch (e) {
        (n(), o(e));
      }
    })
  );
}
((e) => {
  ((e[(e.QRCodeGenerated = 0)] = "QRCodeGenerated"),
    (e[(e.QRCodeExpired = 1)] = "QRCodeExpired"),
    (e[(e.QRCodeScanned = 2)] = "QRCodeScanned"),
    (e[(e.QRCodeDeclined = 3)] = "QRCodeDeclined"),
    (e[(e.GotLoginInfo = 4)] = "GotLoginInfo"));
})(
  LoginQRCallbackEventType ||
    (exports.LoginQRCallbackEventType = LoginQRCallbackEventType = {}),
);
