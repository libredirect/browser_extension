/*
  Retrieved February 19, 2020, from https://s.ytimg.com/yts/jsbin/www-widgetapi-vflYl14TA/www-widgetapi.js
*/

(function () {/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
  var k; function aa() { var a = l, b = 0; return function () { return b < a.length ? { done: !1, value: a[b++] } : { done: !0 } } }
  var ba = "function" == typeof Object.create ? Object.create : function (a) {
    function b() { }
    b.prototype = a; return new b
  }, p;
  if ("function" == typeof Object.setPrototypeOf) p = Object.setPrototypeOf; else { var q; a: { var ca = { K: !0 }, da = {}; try { da.__proto__ = ca; q = da.K; break a } catch (a) { } q = !1 } p = q ? function (a, b) { a.__proto__ = b; if (a.__proto__ !== b) throw new TypeError(a + " is not extensible"); return a } : null } var ea = p;
  function fa(a, b) { a.prototype = ba(b.prototype); a.prototype.constructor = a; if (ea) ea(a, b); else for (var c in b) if ("prototype" != c) if (Object.defineProperties) { var d = Object.getOwnPropertyDescriptor(b, c); d && Object.defineProperty(a, c, d) } else a[c] = b[c]; a.J = b.prototype }
  var ha = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) { a != Array.prototype && a != Object.prototype && (a[b] = c.value) };
  function ia(a) { a = ["object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, a]; for (var b = 0; b < a.length; ++b) { var c = a[b]; if (c && c.Math == Math) return c } return globalThis }
  var ja = ia(this); function ka(a, b) { if (b) { for (var c = ja, d = a.split("."), e = 0; e < d.length - 1; e++) { var f = d[e]; f in c || (c[f] = {}); c = c[f] } d = d[d.length - 1]; e = c[d]; f = b(e); f != e && null != f && ha(c, d, { configurable: !0, writable: !0, value: f }) } }
  var la = "function" == typeof Object.assign ? Object.assign : function (a, b) { for (var c = 1; c < arguments.length; c++) { var d = arguments[c]; if (d) for (var e in d) Object.prototype.hasOwnProperty.call(d, e) && (a[e] = d[e]) } return a };
  ka("Object.assign", function (a) { return a || la });
  var r = this || self; function v(a) { a = a.split("."); for (var b = r, c = 0; c < a.length; c++)if (b = b[a[c]], null == b) return null; return b }
  function ma() { }
  function w(a) {
    var b = typeof a; if ("object" == b) if (a) { if (a instanceof Array) return "array"; if (a instanceof Object) return b; var c = Object.prototype.toString.call(a); if ("[object Window]" == c) return "object"; if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array"; if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function" } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object"; return b
  }
  function x(a) { var b = typeof a; return "object" == b && null != a || "function" == b }
  function na(a) { return Object.prototype.hasOwnProperty.call(a, y) && a[y] || (a[y] = ++oa) }
  var y = "closure_uid_" + (1E9 * Math.random() >>> 0), oa = 0; function pa(a, b, c) { return a.call.apply(a.bind, arguments) }
  function qa(a, b, c) { if (!a) throw Error(); if (2 < arguments.length) { var d = Array.prototype.slice.call(arguments, 2); return function () { var e = Array.prototype.slice.call(arguments); Array.prototype.unshift.apply(e, d); return a.apply(b, e) } } return function () { return a.apply(b, arguments) } }
  function z(a, b, c) { Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? z = pa : z = qa; return z.apply(null, arguments) }
  var ra = Date.now || function () { return +new Date };
  function A(a, b) { var c = a.split("."), d = r; c[0] in d || "undefined" == typeof d.execScript || d.execScript("var " + c[0]); for (var e; c.length && (e = c.shift());)c.length || void 0 === b ? d[e] && d[e] !== Object.prototype[e] ? d = d[e] : d = d[e] = {} : d[e] = b }
  function sa(a, b) {
    function c() { }
    c.prototype = b.prototype; a.J = b.prototype; a.prototype = new c; a.prototype.constructor = a
  }
  ; var ta = Array.prototype.indexOf ? function (a, b) { return Array.prototype.indexOf.call(a, b, void 0) } : function (a, b) {
    if ("string" === typeof a) return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
    for (var c = 0; c < a.length; c++)if (c in a && a[c] === b) return c; return -1
  }, B = Array.prototype.forEach ? function (a, b, c) { Array.prototype.forEach.call(a, b, c) } : function (a, b, c) { for (var d = a.length, e = "string" === typeof a ? a.split("") : a, f = 0; f < d; f++)f in e && b.call(c, e[f], f, a) }, ua = Array.prototype.reduce ? function (a, b, c) { return Array.prototype.reduce.call(a, b, c) } : function (a, b, c) {
    var d = c;
    B(a, function (e, f) { d = b.call(void 0, d, e, f, a) });
    return d
  };
  function va(a, b) { a: { var c = a.length; for (var d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++)if (e in d && b.call(void 0, d[e], e, a)) { c = e; break a } c = -1 } return 0 > c ? null : "string" === typeof a ? a.charAt(c) : a[c] }
  function wa(a) { return Array.prototype.concat.apply([], arguments) }
  function xa(a) { var b = a.length; if (0 < b) { for (var c = Array(b), d = 0; d < b; d++)c[d] = a[d]; return c } return [] }
  ; function ya(a) { var b = !1, c; return function () { b || (c = a(), b = !0); return c } }
  ; var za = /&/g, Aa = /</g, Ba = />/g, Ca = /"/g, Da = /'/g, Ea = /\x00/g, Fa = /[\x00&<>"']/; var E; a: { var Ga = r.navigator; if (Ga) { var Ha = Ga.userAgent; if (Ha) { E = Ha; break a } } E = "" }; function Ia(a, b) { for (var c in a) b.call(void 0, a[c], c, a) }
  function Ja(a) { var b = F, c; for (c in b) if (a.call(void 0, b[c], c, b)) return c }
  ; function G(a, b) { this.b = a === Ka && b || ""; this.a = La }
  var La = {}, Ka = {}, H = new G(Ka, ""); function I(a, b) { this.b = a === Ma && b || ""; this.a = Na }
  var Na = {}, Ma = {}; function Oa() { this.a = ""; this.b = Pa }
  var Pa = {}; function Qa(a) { var b = new Oa; b.a = a; return b }
  Qa("<!DOCTYPE html>"); var J = Qa(""); Qa("<br>"); function Ra(a) { var b = new I(Ma, H instanceof G && H.constructor === G && H.a === La ? H.b : "type_error:Const"); a.src = (b instanceof I && b.constructor === I && b.a === Na ? b.b : "type_error:TrustedResourceUrl").toString() }
  ; var K = window; function L(a, b) { this.width = a; this.height = b }
  L.prototype.aspectRatio = function () { return this.width / this.height };
  L.prototype.ceil = function () { this.width = Math.ceil(this.width); this.height = Math.ceil(this.height); return this };
  L.prototype.floor = function () { this.width = Math.floor(this.width); this.height = Math.floor(this.height); return this };
  L.prototype.round = function () { this.width = Math.round(this.width); this.height = Math.round(this.height); return this }; function Sa(a, b) { var c, d; var e = document; e = b || e; if (e.querySelectorAll && e.querySelector && a) return e.querySelectorAll(a ? "." + a : ""); if (a && e.getElementsByClassName) { var f = e.getElementsByClassName(a); return f } f = e.getElementsByTagName("*"); if (a) { var g = {}; for (c = d = 0; e = f[c]; c++) { var h = e.className, m; if (m = "function" == typeof h.split) m = 0 <= ta(h.split(/\s+/), a); m && (g[d++] = e) } g.length = d; return g } return f }
  function M(a) { var b = document; a = String(a); "application/xhtml+xml" === b.contentType && (a = a.toLowerCase()); return b.createElement(a) }
  function Ta(a, b) { for (var c = 0; a;) { if (b(a)) return a; a = a.parentNode; c++ } return null }
  ; var Ua = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/\\#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/; function Va(a) { var b = a.match(Ua); a = b[1]; var c = b[2], d = b[3]; b = b[4]; var e = ""; a && (e += a + ":"); d && (e += "//", c && (e += c + "@"), e += d, b && (e += ":" + b)); return e }
  function Wa(a, b, c) { if ("array" == w(b)) for (var d = 0; d < b.length; d++)Wa(a, String(b[d]), c); else null != b && c.push(a + ("" === b ? "" : "=" + encodeURIComponent(String(b)))) }
  function Xa(a) { var b = [], c; for (c in a) Wa(c, a[c], b); return b.join("&") }
  var Ya = /#|$/; function Za(a) { var b = $a; if (b) for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && a.call(void 0, b[c], c, b) }
  function ab() {
    var a = []; Za(function (b) { a.push(b) });
    return a
  }
  var $a = { M: "allow-forms", N: "allow-modals", O: "allow-orientation-lock", P: "allow-pointer-lock", R: "allow-popups", S: "allow-popups-to-escape-sandbox", T: "allow-presentation", U: "allow-same-origin", V: "allow-scripts", W: "allow-top-navigation", X: "allow-top-navigation-by-user-activation" }, bb = ya(function () { return ab() });
  function cb() {
    var a = M("IFRAME"), b = {}; B(bb(), function (c) { a.sandbox && a.sandbox.supports && a.sandbox.supports(c) && (b[c] = !0) });
    return b
  }
  ; var db = (new Date).getTime(); function eb() { this.b = []; this.a = -1 }
  eb.prototype.set = function (a, b) { b = void 0 === b ? !0 : b; 0 <= a && 52 > a && 0 === a % 1 && this.b[a] != b && (this.b[a] = b, this.a = -1) };
  eb.prototype.get = function (a) { return !!this.b[a] };
  function fb(a) {
    -1 == a.a && (a.a = ua(a.b, function (b, c, d) { return c ? b + Math.pow(2, d) : b }, 0));
    return a.a
  }
  ; function gb(a, b) { this.f = a; this.g = b; this.b = 0; this.a = null }
  gb.prototype.get = function () { if (0 < this.b) { this.b--; var a = this.a; this.a = a.next; a.next = null } else a = this.f(); return a }; function hb(a) { r.setTimeout(function () { throw a; }, 0) }
  var ib;
  function jb() {
    var a = r.MessageChannel; "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && -1 == E.indexOf("Presto") && (a = function () {
      var e = M("IFRAME"); e.style.display = "none"; Ra(e); document.documentElement.appendChild(e); var f = e.contentWindow; e = f.document; e.open(); e.write(J instanceof Oa && J.constructor === Oa && J.b === Pa ? J.a : "type_error:SafeHtml"); e.close(); var g = "callImmediate" + Math.random(), h = "file:" == f.location.protocol ? "*" : f.location.protocol + "//" + f.location.host; e =
        z(function (m) { if (("*" == h || m.origin == h) && m.data == g) this.port1.onmessage() }, this);
      f.addEventListener("message", e, !1); this.port1 = {}; this.port2 = { postMessage: function () { f.postMessage(g, h) } }
    });
    if ("undefined" !== typeof a && -1 == E.indexOf("Trident") && -1 == E.indexOf("MSIE")) {
      var b = new a, c = {}, d = c; b.port1.onmessage = function () { if (void 0 !== c.next) { c = c.next; var e = c.C; c.C = null; e() } };
      return function (e) { d.next = { C: e }; d = d.next; b.port2.postMessage(0) }
    } return "undefined" !== typeof document && "onreadystatechange" in M("SCRIPT") ? function (e) {
      var f = M("SCRIPT");
      f.onreadystatechange = function () { f.onreadystatechange = null; f.parentNode.removeChild(f); f = null; e(); e = null };
      document.documentElement.appendChild(f)
    } : function (e) { r.setTimeout(e, 0) }
  }
  ; function kb() { this.b = this.a = null }
  var mb = new gb(function () { return new lb }, function (a) { a.reset() });
  kb.prototype.add = function (a, b) { var c = mb.get(); c.set(a, b); this.b ? this.b.next = c : this.a = c; this.b = c };
  kb.prototype.remove = function () { var a = null; this.a && (a = this.a, this.a = this.a.next, this.a || (this.b = null), a.next = null); return a };
  function lb() { this.next = this.b = this.a = null }
  lb.prototype.set = function (a, b) { this.a = a; this.b = b; this.next = null };
  lb.prototype.reset = function () { this.next = this.b = this.a = null }; function nb(a) { N || ob(); pb || (N(), pb = !0); qb.add(a, void 0) }
  var N; function ob() {
    if (r.Promise && r.Promise.resolve) { var a = r.Promise.resolve(void 0); N = function () { a.then(rb) } } else N = function () {
      var b = rb, c;
      !(c = "function" != w(r.setImmediate)) && (c = r.Window && r.Window.prototype) && (c = -1 == E.indexOf("Edge") && r.Window.prototype.setImmediate == r.setImmediate); c ? (ib || (ib = jb()), ib(b)) : r.setImmediate(b)
    }
  }
  var pb = !1, qb = new kb; function rb() { for (var a; a = qb.remove();) { try { a.a.call(a.b) } catch (c) { hb(c) } var b = mb; b.g(a); 100 > b.b && (b.b++ , a.next = b.a, b.a = a) } pb = !1 }
  ; function O() { this.f = this.f; this.g = this.g }
  O.prototype.f = !1; O.prototype.dispose = function () { this.f || (this.f = !0, this.w()) };
  O.prototype.w = function () { if (this.g) for (; this.g.length;)this.g.shift()() }; var sb = r.JSON.stringify; function P(a) { O.call(this); this.m = 1; this.h = []; this.i = 0; this.a = []; this.b = {}; this.o = !!a }
  sa(P, O); k = P.prototype; k.subscribe = function (a, b, c) { var d = this.b[a]; d || (d = this.b[a] = []); var e = this.m; this.a[e] = a; this.a[e + 1] = b; this.a[e + 2] = c; this.m = e + 3; d.push(e); return e };
  function tb(a, b, c) { var d = Q; if (a = d.b[a]) { var e = d.a; (a = va(a, function (f) { return e[f + 1] == b && e[f + 2] == c })) && d.B(a) } }
  k.B = function (a) { var b = this.a[a]; if (b) { var c = this.b[b]; if (0 != this.i) this.h.push(a), this.a[a + 1] = ma; else { if (c) { var d = ta(c, a); 0 <= d && Array.prototype.splice.call(c, d, 1) } delete this.a[a]; delete this.a[a + 1]; delete this.a[a + 2] } } return !!b };
  k.G = function (a, b) { var c = this.b[a]; if (c) { for (var d = Array(arguments.length - 1), e = 1, f = arguments.length; e < f; e++)d[e - 1] = arguments[e]; if (this.o) for (e = 0; e < c.length; e++) { var g = c[e]; ub(this.a[g + 1], this.a[g + 2], d) } else { this.i++; try { for (e = 0, f = c.length; e < f; e++)g = c[e], this.a[g + 1].apply(this.a[g + 2], d) } finally { if (this.i-- , 0 < this.h.length && 0 == this.i) for (; c = this.h.pop();)this.B(c) } } return 0 != e } return !1 };
  function ub(a, b, c) { nb(function () { a.apply(b, c) }) }
  k.clear = function (a) { if (a) { var b = this.b[a]; b && (B(b, this.B, this), delete this.b[a]) } else this.a.length = 0, this.b = {} };
  k.w = function () { P.J.w.call(this); this.clear(); this.h.length = 0 }; var R = window.yt && window.yt.config_ || window.ytcfg && window.ytcfg.data_ || {}; A("yt.config_", R); function vb(a) { var b = arguments; 1 < b.length ? R[b[0]] = b[1] : 1 === b.length && Object.assign(R, b[0]) }
  function wb() { var a = []; return "ERRORS" in R ? R.ERRORS : a }
  ; var xb = []; function yb(a) { xb.forEach(function (b) { return b(a) }) }
  function zb(a) { return a && window.yterr ? function () { try { return a.apply(this, arguments) } catch (d) { var b = d, c = v("yt.logging.errors.log"); c ? c(b, "ERROR", void 0, void 0, void 0) : (c = wb(), c.push([b, "ERROR", void 0, void 0, void 0]), vb("ERRORS", c)); yb(d) } } : a }
  ; var Ab = 0; A("ytDomDomGetNextId", v("ytDomDomGetNextId") || function () { return ++Ab }); var Bb = { stopImmediatePropagation: 1, stopPropagation: 1, preventMouseEvent: 1, preventManipulation: 1, preventDefault: 1, layerX: 1, layerY: 1, screenX: 1, screenY: 1, scale: 1, rotation: 1, webkitMovementX: 1, webkitMovementY: 1 };
  function S(a) {
    this.type = ""; this.state = this.source = this.data = this.currentTarget = this.relatedTarget = this.target = null; this.charCode = this.keyCode = 0; this.metaKey = this.shiftKey = this.ctrlKey = this.altKey = !1; this.clientY = this.clientX = 0; this.changedTouches = this.touches = null; try {
      if (a = a || window.event) {
        this.event = a; for (var b in a) b in Bb || (this[b] = a[b]); var c = a.target || a.srcElement; c && 3 == c.nodeType && (c = c.parentNode); this.target = c; var d = a.relatedTarget; if (d) try { d = d.nodeName ? d : null } catch (e) { d = null } else "mouseover" ==
          this.type ? d = a.fromElement : "mouseout" == this.type && (d = a.toElement); this.relatedTarget = d; this.clientX = void 0 != a.clientX ? a.clientX : a.pageX; this.clientY = void 0 != a.clientY ? a.clientY : a.pageY; this.keyCode = a.keyCode ? a.keyCode : a.which; this.charCode = a.charCode || ("keypress" == this.type ? this.keyCode : 0); this.altKey = a.altKey; this.ctrlKey = a.ctrlKey; this.shiftKey = a.shiftKey; this.metaKey = a.metaKey
      }
    } catch (e) { }
  }
  S.prototype.preventDefault = function () { this.event && (this.event.returnValue = !1, this.event.preventDefault && this.event.preventDefault()) };
  S.prototype.stopPropagation = function () { this.event && (this.event.cancelBubble = !0, this.event.stopPropagation && this.event.stopPropagation()) };
  S.prototype.stopImmediatePropagation = function () { this.event && (this.event.cancelBubble = !0, this.event.stopImmediatePropagation && this.event.stopImmediatePropagation()) }; var F = v("ytEventsEventsListeners") || {}; A("ytEventsEventsListeners", F); var Cb = v("ytEventsEventsCounter") || { count: 0 }; A("ytEventsEventsCounter", Cb);
  function Db(a, b, c, d) {
    d = void 0 === d ? {} : d; a.addEventListener && ("mouseenter" != b || "onmouseenter" in document ? "mouseleave" != b || "onmouseenter" in document ? "mousewheel" == b && "MozBoxSizing" in document.documentElement.style && (b = "MozMousePixelScroll") : b = "mouseout" : b = "mouseover"); return Ja(function (e) {
      var f = "boolean" === typeof e[4] && e[4] == !!d, g; if (g = x(e[4]) && x(d)) a: { g = e[4]; for (var h in g) if (!(h in d) || g[h] !== d[h]) { g = !1; break a } for (var m in d) if (!(m in g)) { g = !1; break a } g = !0 } return !!e.length && e[0] == a && e[1] == b && e[2] ==
        c && (f || g)
    })
  }
  function Eb(a) { a && ("string" == typeof a && (a = [a]), B(a, function (b) { if (b in F) { var c = F[b], d = c[0], e = c[1], f = c[3]; c = c[4]; d.removeEventListener ? Fb() || "boolean" === typeof c ? d.removeEventListener(e, f, c) : d.removeEventListener(e, f, !!c.capture) : d.detachEvent && d.detachEvent("on" + e, f); delete F[b] } })) }
  var Fb = ya(function () {
    var a = !1; try {
      var b = Object.defineProperty({}, "capture", { get: function () { a = !0 } });
      window.addEventListener("test", null, b)
    } catch (c) { } return a
  });
  function Gb(a, b, c) {
    var d = void 0 === d ? {} : d; if (a && (a.addEventListener || a.attachEvent)) {
      var e = Db(a, b, c, d); if (!e) {
        e = ++Cb.count + ""; var f = !("mouseenter" != b && "mouseleave" != b || !a.addEventListener || "onmouseenter" in document); var g = f ? function (h) { h = new S(h); if (!Ta(h.relatedTarget, function (m) { return m == a })) return h.currentTarget = a, h.type = b, c.call(a, h) } : function (h) {
          h = new S(h);
          h.currentTarget = a; return c.call(a, h)
        };
        g = zb(g); a.addEventListener ? ("mouseenter" == b && f ? b = "mouseover" : "mouseleave" == b && f ? b = "mouseout" : "mousewheel" == b && "MozBoxSizing" in document.documentElement.style && (b = "MozMousePixelScroll"), Fb() || "boolean" === typeof d ? a.addEventListener(b, g, d) : a.addEventListener(b, g, !!d.capture)) : a.attachEvent("on" + b, g); F[e] = [a, b, c, g, d]
      }
    }
  }
  ; function Hb(a) { "function" == w(a) && (a = zb(a)); return window.setInterval(a, 250) }
  ; function Ib(a) {
    var b = []; Ia(a, function (c, d) { var e = encodeURIComponent(String(d)), f; "array" == w(c) ? f = c : f = [c]; B(f, function (g) { "" == g ? b.push(e) : b.push(e + "=" + encodeURIComponent(String(g))) }) });
    return b.join("&")
  }
  ; var Jb = {}; function Kb(a) { return Jb[a] || (Jb[a] = String(a).replace(/\-([a-z])/g, function (b, c) { return c.toUpperCase() })) }
  ; var T = {}, l = [], Q = new P, Lb = {}; function Mb() { var a = "undefined" != typeof Symbol && Symbol.iterator && l[Symbol.iterator]; var b; a ? b = a.call(l) : b = { next: aa() }; a = b; for (b = a.next(); !b.done; b = a.next())b = b.value, b() }
  function Nb(a, b) { b || (b = document); var c = xa(b.getElementsByTagName("yt:" + a)), d = "yt-" + a, e = b || document; d = xa(e.querySelectorAll && e.querySelector ? e.querySelectorAll("." + d) : Sa(d, b)); return wa(c, d) }
  function U(a, b) { var c; "yt:" == a.tagName.toLowerCase().substr(0, 3) ? c = a.getAttribute(b) : c = a ? a.dataset ? a.dataset[Kb(b)] : a.getAttribute("data-" + b) : null; return c }
  function Ob(a, b) { Q.G.apply(Q, arguments) }
  ; function Pb(a) { this.b = a || {}; this.f = this.a = !1; a = document.getElementById("www-widgetapi-script"); if (this.a = !!("https:" == document.location.protocol || a && 0 == a.src.indexOf("https:"))) { a = [this.b, window.YTConfig || {}]; for (var b = 0; b < a.length; b++)a[b].host && (a[b].host = a[b].host.replace("http://", "https://")) } }
  function V(a, b) { for (var c = [a.b, window.YTConfig || {}], d = 0; d < c.length; d++) { var e = c[d][b]; if (void 0 != e) return e } return null }
  function Qb(a, b, c) { W || (W = {}, Gb(window, "message", z(a.g, a))); W[c] = b }
  Pb.prototype.g = function (a) { if (a.origin == V(this, "host") || a.origin == V(this, "host").replace(/^http:/, "https:")) { try { var b = JSON.parse(a.data) } catch (c) { return } this.f = !0; this.a || 0 != a.origin.indexOf("https:") || (this.a = !0); if (a = W[b.id]) a.o = !0, a.o && (B(a.m, a.A, a), a.m.length = 0), a.H(b) } };
  var W = null; function Rb() {
    var a = Sb, b = {}; b.dt = db; b.flash = "0"; a: { try { var c = a.a.top.location.href } catch (f) { a = 2; break a } a = c ? c === a.b.location.href ? 0 : 1 : 2 } b = (b.frm = a, b); b.u_tz = -(new Date).getTimezoneOffset(); var d = void 0 === d ? K : d; try { var e = d.history.length } catch (f) { e = 0 } b.u_his = e; b.u_java = !!K.navigator && "unknown" !== typeof K.navigator.javaEnabled && !!K.navigator.javaEnabled && K.navigator.javaEnabled(); K.screen && (b.u_h = K.screen.height, b.u_w = K.screen.width, b.u_ah = K.screen.availHeight, b.u_aw = K.screen.availWidth, b.u_cd = K.screen.colorDepth);
    K.navigator && K.navigator.plugins && (b.u_nplug = K.navigator.plugins.length); K.navigator && K.navigator.mimeTypes && (b.u_nmime = K.navigator.mimeTypes.length); return b
  }
  function Tb() {
    var a = Sb; var b = a.a; try { var c = b.screenX; var d = b.screenY } catch (t) { } try { var e = b.outerWidth; var f = b.outerHeight } catch (t) { } try { var g = b.innerWidth; var h = b.innerHeight } catch (t) { } b = [b.screenLeft, b.screenTop, c, d, b.screen ? b.screen.availWidth : void 0, b.screen ? b.screen.availTop : void 0, e, f, g, h]; c = a.a.top; try { var m = (c || window).document, n = "CSS1Compat" == m.compatMode ? m.documentElement : m.body; var u = (new L(n.clientWidth, n.clientHeight)).round() } catch (t) { u = new L(-12245933, -12245933) } m = u; u = {}; n = new eb; r.SVGElement &&
      r.document.createElementNS && n.set(0); c = cb(); c["allow-top-navigation-by-user-activation"] && n.set(1); c["allow-popups-to-escape-sandbox"] && n.set(2); r.crypto && r.crypto.subtle && n.set(3); r.TextDecoder && r.TextEncoder && n.set(4); n = fb(n); u.bc = n; u.bih = m.height; u.biw = m.width; u.brdim = b.join(); a = a.b; return u.vis = { visible: 1, hidden: 2, prerender: 3, preview: 4, unloaded: 5 }[a.visibilityState || a.webkitVisibilityState || a.mozVisibilityState || ""] || 0, u.wgl = !!K.WebGLRenderingContext, u
  }
  var Sb = new function () { var a = window.document; this.a = window; this.b = a };
  A("yt.ads_.signals_.getAdSignalsString", function (a) { a = void 0 === a ? v("yt.ads.biscotti.lastId_") || "" : a; var b = Object.assign(Rb(), Tb()); b.ca_type = "image"; a && (b.bid = a); return Ib(b) }); ra(); function X(a, b, c) {
    this.i = this.a = this.b = null; this.h = na(this); this.f = 0; this.o = !1; this.m = []; this.g = null; this.D = c; this.I = {}; c = document; if (a = "string" === typeof a ? c.getElementById(a) : a) if (c = "iframe" == a.tagName.toLowerCase(), b.host || (b.host = c ? Va(a.src) : "https://www.youtube.com"), this.b = new Pb(b), c || (b = Ub(this, a), this.i = a, (c = a.parentNode) && c.replaceChild(b, a), a = b), this.a = a, this.a.id || (this.a.id = "widget" + na(this.a)), T[this.a.id] = this, window.postMessage) {
      this.g = new P; Vb(this); b = V(this.b, "events"); for (var d in b) b.hasOwnProperty(d) &&
        this.addEventListener(d, b[d]); for (var e in Lb) Wb(this, e)
    }
  }
  k = X.prototype; k.setSize = function (a, b) { this.a.width = a; this.a.height = b; return this };
  k.L = function () { return this.a };
  k.H = function (a) { this.s(a.event, a) };
  k.addEventListener = function (a, b) {
    var c = b; "string" == typeof b && (c = function () { window[b].apply(window, arguments) });
    if (!c) return this; this.g.subscribe(a, c); Xb(this, a); return this
  };
  function Wb(a, b) { var c = b.split("."); if (2 == c.length) { var d = c[1]; a.D == c[0] && Xb(a, d) } }
  k.destroy = function () { this.a.id && (T[this.a.id] = null); var a = this.g; a && "function" == typeof a.dispose && a.dispose(); if (this.i) { a = this.a; var b = a.parentNode; b && b.replaceChild(this.i, a) } else (a = this.a) && a.parentNode && a.parentNode.removeChild(a); W && (W[this.h] = null); this.b = null; a = this.a; for (var c in F) F[c][0] == a && Eb(c); this.i = this.a = null };
  k.u = function () { return {} };
  function Yb(a, b, c) { c = c || []; c = Array.prototype.slice.call(c); b = { event: "command", func: b, args: c }; a.o ? a.A(b) : a.m.push(b) }
  k.s = function (a, b) { if (!this.g.f) { var c = { target: this, data: b }; this.g.G(a, c); Ob(this.D + "." + a, c) } };
  function Ub(a, b) {
    for (var c = document.createElement("iframe"), d = b.attributes, e = 0, f = d.length; e < f; e++) { var g = d[e].value; null != g && "" != g && "null" != g && c.setAttribute(d[e].name, g) } c.setAttribute("frameBorder", 0); c.setAttribute("allowfullscreen", 1); c.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"); c.setAttribute("title", "YouTube " + V(a.b, "title")); (d = V(a.b, "width")) && c.setAttribute("width", d); (d = V(a.b, "height")) && c.setAttribute("height", d); var h = a.u(); h.enablejsapi =
      window.postMessage ? 1 : 0; window.location.host && (h.origin = window.location.protocol + "//" + window.location.host); h.widgetid = a.h; window.location.href && B(["debugjs", "debugcss"], function (m) {
        var n = window.location.href; var u = n.search(Ya); b: { var t = 0; for (var C = m.length; 0 <= (t = n.indexOf(m, t)) && t < u;) { var D = n.charCodeAt(t - 1); if (38 == D || 63 == D) if (D = n.charCodeAt(t + C), !D || 61 == D || 38 == D || 35 == D) break b; t += C + 1 } t = -1 } if (0 > t) n = null; else {
          C = n.indexOf("&", t); if (0 > C || C > u) C = u; t += m.length + 1; n = decodeURIComponent(n.substr(t, C - t).replace(/\+/g,
            " "))
        } null !== n && (h[m] = n)
      });
    c.src = V(a.b, "host") + a.v() + "?" + Xa(h); return c
  }
  k.F = function () { this.a && this.a.contentWindow ? this.A({ event: "listening" }) : window.clearInterval(this.f) };
  function Vb(a) { Qb(a.b, a, a.h); a.f = Hb(z(a.F, a)); Gb(a.a, "load", z(function () { window.clearInterval(this.f); this.f = Hb(z(this.F, this)) }, a)) }
  function Xb(a, b) { a.I[b] || (a.I[b] = !0, Yb(a, "addEventListener", [b])) }
  k.A = function (a) {
    a.id = this.h; a.channel = "widget"; a = sb(a); var b = this.b; var c = Va(this.a.src || ""); b = 0 == c.indexOf("https:") ? [c] : b.a ? [c.replace("http:", "https:")] : b.f ? [c] : [c, c.replace("http:", "https:")]; if (this.a.contentWindow) for (c = 0; c < b.length; c++)try { this.a.contentWindow.postMessage(a, b[c]) } catch (f) {
      if (f.name && "SyntaxError" == f.name) {
        if (!(f.message && 0 < f.message.indexOf("target origin ''"))) {
          var d = f, e = v("yt.logging.errors.log"); e ? e(d, "WARNING", void 0, void 0, !1, void 0) : (e = wb(), e.push([d, "WARNING", void 0,
            void 0, !1, void 0]), vb("ERRORS", e))
        }
      } else throw f;
    } else console && console.warn && console.warn("The YouTube player is not attached to the DOM. API calls should be made after the onReady event. See more: https://developers.google.com/youtube/iframe_api_reference#Events")
  }; function Zb(a) { return (0 == a.search("cue") || 0 == a.search("load")) && "loadModule" != a }
  function $b(a) { return 0 == a.search("get") || 0 == a.search("is") }
  ; function Y(a, b) { if (!a) throw Error("YouTube player element ID required."); var c = { title: "video player", videoId: "", width: 640, height: 360 }; if (b) for (var d in b) c[d] = b[d]; X.call(this, a, c, "player"); this.j = {}; this.l = {} }
  fa(Y, X); k = Y.prototype; k.v = function () { return "/embed/" + V(this.b, "videoId") };
  k.u = function () { var a = V(this.b, "playerVars"); if (a) { var b = {}, c; for (c in a) b[c] = a[c]; a = b } else a = {}; window != window.top && document.referrer && (a.widget_referrer = document.referrer.substring(0, 256)); if (c = V(this.b, "embedConfig")) { if (x(c)) try { c = JSON.stringify(c) } catch (d) { console.error("Invalid embed config JSON", d) } a.embed_config = c } return a };
  k.H = function (a) { var b = a.event; a = a.info; switch (b) { case "apiInfoDelivery": if (x(a)) for (var c in a) this.j[c] = a[c]; break; case "infoDelivery": ac(this, a); break; case "initialDelivery": window.clearInterval(this.f); this.l = {}; this.j = {}; bc(this, a.apiInterface); ac(this, a); break; default: this.s(b, a) } };
  function ac(a, b) { if (x(b)) for (var c in b) a.l[c] = b[c] }
  function bc(a, b) {
    B(b, function (c) {
      this[c] || ("getCurrentTime" == c ? this[c] = function () { var d = this.l.currentTime; if (1 == this.l.playerState) { var e = (ra() / 1E3 - this.l.currentTimeLastUpdated_) * this.l.playbackRate; 0 < e && (d += Math.min(e, 1)) } return d } : Zb(c) ? this[c] = function () {
        this.l = {};
        this.j = {}; Yb(this, c, arguments); return this
      } : $b(c) ? this[c] = function () {
        var d = 0;
        0 == c.search("get") ? d = 3 : 0 == c.search("is") && (d = 2); return this.l[c.charAt(d).toLowerCase() + c.substr(d + 1)]
      } : this[c] = function () {
        Yb(this, c, arguments);
        return this
      })
    }, a)
  }
  k.getVideoEmbedCode = function () {
    var a = parseInt(V(this.b, "width"), 10); var b = parseInt(V(this.b, "height"), 10), c = V(this.b, "host") + this.v(); Fa.test(c) && (-1 != c.indexOf("&") && (c = c.replace(za, "&amp;")), -1 != c.indexOf("<") && (c = c.replace(Aa, "&lt;")), -1 != c.indexOf(">") && (c = c.replace(Ba, "&gt;")), -1 != c.indexOf('"') && (c = c.replace(Ca, "&quot;")), -1 != c.indexOf("'") && (c = c.replace(Da, "&#39;")), -1 != c.indexOf("\x00") && (c = c.replace(Ea, "&#0;"))); a = '<iframe width="' + a + '" height="' + b + '" src="' + c + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    return a
  };
  k.getOptions = function (a) { return this.j.namespaces ? a ? this.j[a].options || [] : this.j.namespaces || [] : [] };
  k.getOption = function (a, b) { if (this.j.namespaces && a && b) return this.j[a][b] };
  function cc(a) { if ("iframe" != a.tagName.toLowerCase()) { var b = U(a, "videoid"); b && (b = { videoId: b, width: U(a, "width"), height: U(a, "height") }, new Y(a, b)) } }
  ; function Z(a, b) { var c = { title: "Thumbnail", videoId: "", width: 120, height: 68 }; if (b) for (var d in b) c[d] = b[d]; X.call(this, a, c, "thumbnail") }
  fa(Z, X); Z.prototype.v = function () { return "/embed/" + V(this.b, "videoId") };
  Z.prototype.u = function () { return { player: 0, thumb_width: V(this.b, "thumbWidth"), thumb_height: V(this.b, "thumbHeight"), thumb_align: V(this.b, "thumbAlign") } };
  Z.prototype.s = function (a, b) { X.prototype.s.call(this, a, b ? b.info : void 0) };
  function dc(a) { if ("iframe" != a.tagName.toLowerCase()) { var b = U(a, "videoid"); if (b) { b = { videoId: b, events: {}, width: U(a, "width"), height: U(a, "height"), thumbWidth: U(a, "thumb-width"), thumbHeight: U(a, "thumb-height"), thumbAlign: U(a, "thumb-align") }; var c = U(a, "onclick"); c && (b.events.onClick = c); new Z(a, b) } } }
  ; A("YT.PlayerState.UNSTARTED", -1); A("YT.PlayerState.ENDED", 0); A("YT.PlayerState.PLAYING", 1); A("YT.PlayerState.PAUSED", 2); A("YT.PlayerState.BUFFERING", 3); A("YT.PlayerState.CUED", 5); A("YT.get", function (a) { return T[a] });
  A("YT.scan", Mb); A("YT.subscribe", function (a, b, c) { Q.subscribe(a, b, c); Lb[a] = !0; for (var d in T) Wb(T[d], a) });
  A("YT.unsubscribe", function (a, b, c) { tb(a, b, c) });
  A("YT.Player", Y); A("YT.Thumbnail", Z); X.prototype.destroy = X.prototype.destroy; X.prototype.setSize = X.prototype.setSize; X.prototype.getIframe = X.prototype.L; X.prototype.addEventListener = X.prototype.addEventListener; Y.prototype.getVideoEmbedCode = Y.prototype.getVideoEmbedCode; Y.prototype.getOptions = Y.prototype.getOptions; Y.prototype.getOption = Y.prototype.getOption; l.push(function (a) { a = Nb("player", a); B(a, cc) });
  l.push(function () { var a = Nb("thumbnail"); B(a, dc) });
  "undefined" != typeof YTConfig && YTConfig.parsetags && "onload" != YTConfig.parsetags || Mb(); var ec = v("onYTReady"); ec && ec(); var fc = v("onYouTubeIframeAPIReady"); fc && fc(); var gc = v("onYouTubePlayerAPIReady"); gc && gc();
}).call(this);