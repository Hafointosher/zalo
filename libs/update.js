(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.checkUpdate = checkUpdate));
let semver_1 = require("semver"),
  utils_js_1 = require("./utils.js"),
  VERSION = "2.0.4",
  NPM_REGISTRY = "https://registry.npmjs.org/zca-js";
async function checkUpdate(e) {
  var s;
  e.options.checkUpdate &&
    ((s = {
      ...(utils_js_1.isBun
        ? {
            proxy:
              null == (s = null == (s = e.options.agent) ? void 0 : s.proxy)
                ? void 0
                : s.href,
          }
        : { agent: e.options.agent }),
    }),
    (s = await e.options.polyfill(NPM_REGISTRY, s).catch(() => null))) &&
    s.ok &&
    (s = await s.json().catch(() => null)) &&
    ((s = s["dist-tags"].latest),
    -1 === (0, semver_1.compare)(VERSION, s)
      ? (0, utils_js_1.logger)(e).info(
          "A new version of zca-js is available: " + s,
        )
      : (0, utils_js_1.logger)(e).info("zca-js is up to date"));
}
