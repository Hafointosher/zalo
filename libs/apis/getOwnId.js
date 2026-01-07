(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getOwnIdFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.getOwnIdFactory = (0, utils_js_1.apiFactory)()((e, t) => () => t.uid);
