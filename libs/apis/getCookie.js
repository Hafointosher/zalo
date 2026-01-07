(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getCookieFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.getCookieFactory = (0, utils_js_1.apiFactory)()(
  (e, o) =>
    function () {
      return o.cookie;
    },
);
