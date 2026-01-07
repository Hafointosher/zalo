var TextStyle,
  Urgency,
  __importDefault =
    (this && this.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendMessageFactory = exports.Urgency = exports.TextStyle = void 0));
let form_data_1 = __importDefault(require("form-data")),
  promises_1 = __importDefault(require("node:fs/promises")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js"),
  attachmentUrlType = {
    image: "photo_original/send?",
    gif: "gif?",
    video: "asyncfile/msg?",
    others: "asyncfile/msg?",
  };
function prepareQMSGAttach(e) {
  return "string" == typeof e.content
    ? e.propertyExt
    : "chat.todo" == e.msgType
      ? {
          properties: {
            color: 0,
            size: 0,
            type: 0,
            subType: 0,
            ext: '{"shouldParseLinkOrContact":0}',
          },
        }
      : {
          ...e.content,
          thumbUrl: e.content.thumb,
          oriUrl: e.content.href,
          normalUrl: e.content.href,
        };
}
function prepareQMSG(e) {
  return "chat.todo" == e.msgType &&
    "object" == typeof e.content &&
    "string" == typeof e.content.params
    ? JSON.parse(e.content.params).item.content
    : "";
}
(((e) => {
  ((e.Bold = "b"),
    (e.Italic = "i"),
    (e.Underline = "u"),
    (e.StrikeThrough = "s"),
    (e.Red = "c_db342e"),
    (e.Orange = "c_f27806"),
    (e.Yellow = "c_f7b503"),
    (e.Green = "c_15a85f"),
    (e.Small = "f_13"),
    (e.Big = "f_18"),
    (e.UnorderedList = "lst_1"),
    (e.OrderedList = "lst_2"),
    (e.Indent = "ind_$"));
})(TextStyle || (exports.TextStyle = TextStyle = {})),
  ((e) => {
    ((e[(e.Default = 0)] = "Default"),
      (e[(e.Important = 1)] = "Important"),
      (e[(e.Urgent = 2)] = "Urgent"));
  })(Urgency || (exports.Urgency = Urgency = {})),
  (exports.sendMessageFactory = (0, utils_js_1.apiFactory)()((I, Z, F) => {
    let q = {
        message: {
          [index_js_1.ThreadType.User]: F.makeURL(
            I.zpwServiceMap.chat[0] + "/api/message",
            { nretry: 0 },
          ),
          [index_js_1.ThreadType.Group]: F.makeURL(
            I.zpwServiceMap.group[0] + "/api/group",
            { nretry: 0 },
          ),
        },
        attachment: {
          [index_js_1.ThreadType.User]:
            I.zpwServiceMap.file[0] + "/api/message/",
          [index_js_1.ThreadType.Group]:
            I.zpwServiceMap.file[0] + "/api/group/",
        },
      },
      M = Z.settings.features.sharefile;
    async function g(e) {
      var r = [];
      for (let t of (e = Array.isArray(e) ? e : [e]))
        r.push(
          (async () => {
            var e = await F.request(t.url, {
              method: "POST",
              body: t.body,
              headers: t.headers,
            });
            return (0, utils_js_1.resolveResponse)(Z, e);
          })(),
        );
      return Promise.all(r);
    }
    function z(e, t, r) {
      let i = 0;
      e =
        Array.isArray(r) && e == index_js_1.ThreadType.Group
          ? r
              .filter((e) => 0 <= e.pos && e.uid && 0 < e.len)
              .map(
                (e) => (
                  (i += e.len),
                  {
                    pos: e.pos,
                    uid: e.uid,
                    len: e.len,
                    type: "-1" == e.uid ? 1 : 0,
                  }
                ),
              )
          : [];
      if (i > t.length)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Invalid mentions: total mention characters exceed message length",
        );
      return { mentionsFinal: e, msgFinal: t };
    }
    function O(e, t) {
      (t != Urgency.Important && t != Urgency.Urgent) ||
        Object.assign(e, { metaData: { urgency: t } });
    }
    async function f(
      { msg: e, styles: t, urgency: r, mentions: i, quote: a, ttl: n },
      o,
      s,
    ) {
      if (!e || 0 == e.length)
        throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
      var l = s == index_js_1.ThreadType.Group,
        { mentionsFinal: i, msgFinal: p } = z(s, e, i);
      if (((e = p), a)) {
        if ("string" != typeof a.content && "webchat" == a.msgType)
          throw new ZaloApiError_js_1.ZaloApiError(
            "This kind of `webchat` quote type is not available",
          );
        if ("group.poll" == a.msgType)
          throw new ZaloApiError_js_1.ZaloApiError(
            "The `group.poll` quote type is not available",
          );
      }
      var p = 0 < i.length && l,
        e = a
          ? {
              toid: l ? void 0 : o,
              grid: l ? o : void 0,
              message: e,
              clientId: Date.now(),
              mentionInfo: p ? JSON.stringify(i) : void 0,
              qmsgOwner: a.uidFrom,
              qmsgId: a.msgId,
              qmsgCliId: a.cliMsgId,
              qmsgType: (0, utils_js_1.getClientMessageType)(a.msgType),
              qmsgTs: a.ts,
              qmsg: "string" == typeof a.content ? a.content : prepareQMSG(a),
              imei: l ? void 0 : Z.imei,
              visibility: l ? 0 : void 0,
              qmsgAttach: l ? JSON.stringify(prepareQMSGAttach(a)) : void 0,
              qmsgTTL: a.ttl,
              ttl: null != n ? n : 0,
            }
          : {
              message: e,
              clientId: Date.now(),
              mentionInfo: p ? JSON.stringify(i) : void 0,
              imei: l ? void 0 : Z.imei,
              ttl: null != n ? n : 0,
              visibility: l ? 0 : void 0,
              toid: l ? void 0 : o,
              grid: l ? o : void 0,
            },
        n =
          ((p = e),
          (i = t) &&
            Object.assign(p, {
              textProperties: JSON.stringify({
                styles: i.map((e) => {
                  var t = {
                    ...e,
                    indentSize: void 0,
                    st:
                      e.st == TextStyle.Indent
                        ? TextStyle.Indent.replace(
                            /\$/g,
                            `${null != (t = e.indentSize) ? t : 1}0`,
                          )
                        : e.st,
                  };
                  return ((0, utils_js_1.removeUndefinedKeys)(t), t);
                }),
                ver: 0,
              }),
            }),
          O(e, r),
          (0, utils_js_1.removeUndefinedKeys)(e),
          F.encodeAES(JSON.stringify(e)));
      if (n)
        return (
          ((o = new URL(q.message[s])).pathname = a
            ? o.pathname + "/quote"
            : o.pathname +
              "/" +
              (l ? (e.mentionInfo ? "mention" : "sendmsg") : "sms")),
          { url: o.toString(), body: new URLSearchParams({ params: n }) }
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
    }
    async function u(
      { msg: t, attachments: e, mentions: r, quote: i, ttl: a, urgency: n },
      o,
      s,
    ) {
      if (!e) throw new ZaloApiError_js_1.ZaloApiError("Missing attachments");
      if (0 == (e = Array.isArray(e) ? e : [e]).length)
        throw new ZaloApiError_js_1.ZaloApiError("Missing attachments");
      var l = e[0];
      let p = "string" == typeof l;
      var l = (0, utils_js_1.getFileExtension)(p ? l : l.filename),
        d = 1 == e.length,
        m = s == index_js_1.ThreadType.Group,
        g = d && ["jpg", "jpeg", "png", "webp"].includes(l),
        d = e.filter(
          (e) =>
            "gif" ==
            (0, utils_js_1.getFileExtension)(
              "string" == typeof e ? e : e.filename,
            ),
        ),
        f =
          0 ==
          (e = e.filter(
            (e) =>
              "gif" !=
              (0, utils_js_1.getFileExtension)(
                "string" == typeof e ? e : e.filename,
              ),
          )).length
            ? []
            : await I.uploadAttachment(e, o, s),
        u = [];
      let c = f.length - 1;
      var h,
        y,
        _ = Date.now(),
        { mentionsFinal: w, msgFinal: l } = z(s, t, r),
        v = ((t = l), 0 < w.length && m && 1 == e.length),
        j = 1 < e.length;
      let S = Date.now();
      for (h of f) {
        let e;
        switch (h.fileType) {
          case "image":
            e = {
              fileType: h.fileType,
              params: {
                photoId: h.photoId,
                clientId: (S++).toString(),
                desc: t,
                width: h.width,
                height: h.height,
                toid: m ? void 0 : String(o),
                grid: m ? String(o) : void 0,
                rawUrl: h.normalUrl,
                hdUrl: h.hdUrl,
                thumbUrl: h.thumbUrl,
                oriUrl: m ? h.normalUrl : void 0,
                normalUrl: m ? void 0 : h.normalUrl,
                hdSize: String(h.totalSize),
                zsource: -1,
                ttl: null != a ? a : 0,
                jcp: '{"convertible":"jxl"}',
                groupLayoutId: j ? _ : void 0,
                isGroupLayout: j ? 1 : void 0,
                idInGroup: j ? c-- : void 0,
                totalItemInGroup: j ? f.length : void 0,
                mentionInfo: v && g && !i ? JSON.stringify(w) : void 0,
              },
              body: new URLSearchParams(),
            };
            break;
          case "video":
          case "others":
            e = {
              fileType: h.fileType,
              params: {
                fileId: h.fileId,
                checksum: h.checksum,
                checksumSha: "",
                extention: (0, utils_js_1.getFileExtension)(h.fileName),
                totalSize: h.totalSize,
                fileName: h.fileName,
                clientId: h.clientFileId,
                fType: 1,
                fileCount: 0,
                fdata: "{}",
                toid: m ? void 0 : String(o),
                grid: m ? String(o) : void 0,
                fileUrl: h.fileUrl,
                zsource: -1,
                ttl: null != a ? a : 0,
              },
              body: new URLSearchParams(),
            };
        }
        (O(e.params, n), (0, utils_js_1.removeUndefinedKeys)(e.params));
        var T = F.encodeAES(JSON.stringify(e.params));
        if (!T)
          throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
        (e.body.append("params", T), u.push(e));
      }
      for (y of d) {
        let e = "string" == typeof y;
        var A = e
          ? await (0, utils_js_1.getGifMetaData)(Z, y)
          : { ...y.metadata, fileName: y.filename };
        if (A.totalSize > 1024 * M.max_size_share_file_v3 * 1024)
          throw new ZaloApiError_js_1.ZaloApiError(
            `File ${e ? (0, utils_js_1.getFileName)(y) : y.filename} size exceed maximum size of ${M.max_size_share_file_v3}MB`,
          );
        var U = await (async (e, t) => {
            var r = new form_data_1.default(),
              e =
                "string" == typeof e
                  ? await promises_1.default.readFile(e)
                  : e.data,
              e =
                (r.append("fileContent", e, {
                  filename: "blob",
                  contentType: "image/png",
                }),
                { clientId: Date.now(), imei: Z.imei });
            if ((e = F.encodeAES(JSON.stringify(e))))
              return (
                (t = await F.request(F.makeURL(t + "upthumb?", { params: e }), {
                  method: "POST",
                  headers: r.getHeaders(),
                  body: r.getBuffer(),
                })),
                (0, utils_js_1.resolveResponse)(Z, t)
              );
            throw new ZaloApiError_js_1.ZaloApiError(
              "Failed to encrypt message",
            );
          })(y, q.attachment[index_js_1.ThreadType.User]),
          x = new form_data_1.default(),
          U =
            (x.append(
              "chunkContent",
              e ? await promises_1.default.readFile(y) : y.data,
              {
                filename: e ? (0, utils_js_1.getFileName)(y) : y.filename,
                contentType: "application/octet-stream",
              },
            ),
            {
              clientId: Date.now().toString(),
              fileName: A.fileName,
              totalSize: A.totalSize,
              width: A.width,
              height: A.height,
              msg: t,
              type: 1,
              ttl: null != a ? a : 0,
              visibility: m ? 0 : void 0,
              toid: m ? void 0 : o,
              grid: m ? o : void 0,
              thumb: U.url,
              checksum: (
                await (0, utils_js_1.getMd5LargeFileObject)(y, A.totalSize)
              ).data,
              totalChunk: 1,
              chunkId: 1,
            }),
          A =
            (O(U, n),
            (0, utils_js_1.removeUndefinedKeys)(U),
            F.encodeAES(JSON.stringify(U)));
        if (!A)
          throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
        u.push({
          query: { params: A, type: "1" },
          body: x.getBuffer(),
          headers: x.getHeaders(),
          fileType: "gif",
        });
      }
      var E,
        b = [];
      for (E of u)
        b.push({
          url: F.makeURL(
            q.attachment[s] + attachmentUrlType[E.fileType],
            Object.assign({ nretry: "0" }, E.query || {}),
          ),
          body: E.body,
          headers: "gif" == E.fileType ? E.headers : {},
        });
      return b;
    }
    return async function (e, t, r = index_js_1.ThreadType.User) {
      if (!e)
        throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
      if (!t) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
      let {
        msg: i,
        attachments: a,
        mentions: n,
      } = (e = "string" == typeof e ? { msg: e } : e);
      var o,
        { quote: s, ttl: l, styles: p, urgency: d } = e;
      if (
        (a && !Array.isArray(a) && (a = [a]), !(i || (a && (a, 0 != a.length))))
      )
        throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
      if (a && a.length > M.max_file)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Exceed maximum file of " + M.max_file,
        );
      let m = { message: null, attachment: [] };
      return (
        a &&
          0 < a.length &&
          ((o = (0, utils_js_1.getFileExtension)(
            "string" == typeof a[0] ? a[0] : a[0].filename,
          )),
          ((!(1 == a.length && ["jpg", "jpeg", "png", "webp"].includes(o)) &&
            0 < i.length) ||
            (0 < i.length && s)) &&
            (await f(e, t, r).then(async (e) => {
              m.message = (await g(e))[0];
            }),
            (i = ""),
            (n = void 0)),
          (o = await u(
            {
              msg: i,
              mentions: n,
              attachments: a,
              quote: s,
              ttl: l,
              styles: p,
              urgency: d,
            },
            t,
            r,
          )),
          (m.attachment = await g(o)),
          (i = "")),
        0 < i.length && ((s = await f(e, t, r)), (m.message = (await g(s))[0])),
        m
      );
    };
  })));
