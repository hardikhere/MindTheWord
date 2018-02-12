! function(e) {
    function r(e, r, o) {
        return 4 === arguments.length ? t.apply(this, arguments) : void n(e, {
            declarative: !0,
            deps: r,
            declare: o
        })
    }

    function t(e, r, t, o) {
        n(e, {
            declarative: !1,
            deps: r,
            executingRequire: t,
            execute: o
        })
    }

    function n(e, r) {
        r.name = e, e in v || (v[e] = r), r.normalizedDeps = r.deps
    }

    function o(e, r) {
        if (r[e.groupIndex] = r[e.groupIndex] || [], -1 == g.call(r[e.groupIndex], e)) {
            r[e.groupIndex].push(e);
            for (var t = 0, n = e.normalizedDeps.length; n > t; t++) {
                var a = e.normalizedDeps[t],
                    u = v[a];
                if (u && !u.evaluated) {
                    var d = e.groupIndex + (u.declarative != e.declarative);
                    if (void 0 === u.groupIndex || u.groupIndex < d) {
                        if (void 0 !== u.groupIndex && (r[u.groupIndex].splice(g.call(r[u.groupIndex], u), 1), 0 == r[u.groupIndex].length)) throw new TypeError("Mixed dependency cycle detected");
                        u.groupIndex = d
                    }
                    o(u, r)
                }
            }
        }
    }

    function a(e) {
        var r = v[e];
        r.groupIndex = 0;
        var t = [];
        o(r, t);
        for (var n = !!r.declarative == t.length % 2, a = t.length - 1; a >= 0; a--) {
            for (var u = t[a], i = 0; i < u.length; i++) {
                var s = u[i];
                n ? d(s) : l(s)
            }
            n = !n
        }
    }

    function u(e) {
        return y[e] || (y[e] = {
            name: e,
            dependencies: [],
            exports: {},
            importers: []
        })
    }

    function d(r) {
        if (!r.module) {
            var t = r.module = u(r.name),
                n = r.module.exports,
                o = r.declare.call(e, function(e, r) {
                    if (t.locked = !0, "object" == typeof e)
                        for (var o in e) n[o] = e[o];
                    else n[e] = r;
                    for (var a = 0, u = t.importers.length; u > a; a++) {
                        var d = t.importers[a];
                        if (!d.locked)
                            for (var i = 0; i < d.dependencies.length; ++i) d.dependencies[i] === t && d.setters[i](n)
                    }
                    return t.locked = !1, r
                }, {
                    id: r.name
                });
            t.setters = o.setters, t.execute = o.execute;
            for (var a = 0, i = r.normalizedDeps.length; i > a; a++) {
                var l, s = r.normalizedDeps[a],
                    c = v[s],
                    f = y[s];
                f ? l = f.exports : c && !c.declarative ? l = c.esModule : c ? (d(c), f = c.module, l = f.exports) : l = p(s), f && f.importers ? (f.importers.push(t), t.dependencies.push(f)) : t.dependencies.push(null), t.setters[a] && t.setters[a](l)
            }
        }
    }

    function i(e) {
        var r, t = v[e];
        if (t) t.declarative ? f(e, []) : t.evaluated || l(t), r = t.module.exports;
        else if (!(r = p(e))) throw new Error("Unable to load dependency " + e + ".");
        return (!t || t.declarative) && r && r.__useDefault ? r.default : r
    }

    function l(r) {
        if (!r.module) {
            var t = {},
                n = r.module = {
                    exports: t,
                    id: r.name
                };
            if (!r.executingRequire)
                for (var o = 0, a = r.normalizedDeps.length; a > o; o++) {
                    var u = r.normalizedDeps[o],
                        d = v[u];
                    d && l(d)
                }
            r.evaluated = !0;
            var c = r.execute.call(e, function(e) {
                for (var t = 0, n = r.deps.length; n > t; t++)
                    if (r.deps[t] == e) return i(r.normalizedDeps[t]);
                throw new TypeError("Module " + e + " not declared as a dependency.")
            }, t, n);
            void 0 !== c && (n.exports = c), t = n.exports, t && t.__esModule ? r.esModule = t : r.esModule = s(t)
        }
    }

    function s(r) {
        var t = {};
        if (("object" == typeof r || "function" == typeof r) && r !== e)
            if (m)
                for (var n in r) "default" !== n && c(t, r, n);
            else {
                var o = r && r.hasOwnProperty;
                for (var n in r) "default" === n || o && !r.hasOwnProperty(n) || (t[n] = r[n])
            }
        return t.default = r, x(t, "__useDefault", {
            value: !0
        }), t
    }

    function c(e, r, t) {
        try {
            var n;
            (n = Object.getOwnPropertyDescriptor(r, t)) && x(e, t, n)
        } catch (o) {
            return e[t] = r[t], !1
        }
    }

    function f(r, t) {
        var n = v[r];
        if (n && !n.evaluated && n.declarative) {
            t.push(r);
            for (var o = 0, a = n.normalizedDeps.length; a > o; o++) {
                var u = n.normalizedDeps[o]; - 1 == g.call(t, u) && (v[u] ? f(u, t) : p(u))
            }
            n.evaluated || (n.evaluated = !0, n.module.execute.call(e))
        }
    }

    function p(e) {
        if (I[e]) return I[e];
        if ("@node/" == e.substr(0, 6)) return I[e] = s(D(e.substr(6)));
        var r = v[e];
        if (!r) throw "Module " + e + " not present.";
        return a(e), f(e, []), v[e] = void 0, r.declarative && x(r.module.exports, "__esModule", {
            value: !0
        }), I[e] = r.declarative ? r.module.exports : r.esModule
    }
    var v = {},
        g = Array.prototype.indexOf || function(e) {
            for (var r = 0, t = this.length; t > r; r++)
                if (this[r] === e) return r;
            return -1
        },
        m = !0;
    try {
        Object.getOwnPropertyDescriptor({
            a: 0
        }, "a")
    } catch (h) {
        m = !1
    }
    var x;
    ! function() {
        try {
            Object.defineProperty({}, "a", {}) && (x = Object.defineProperty)
        } catch (e) {
            x = function(e, r, t) {
                try {
                    e[r] = t.value || t.get.call(e)
                } catch (n) {}
            }
        }
    }();
    var y = {},
        D = "undefined" != typeof System && System._nodeRequire || "undefined" != typeof require && void 0 !== require.resolve && "undefined" != typeof process && process.platform && require,
        I = {
            "@empty": {}
        };
    return function(e, n, o, a) {
        return function(u) {
            u(function(u) {
                for (var d = {
                        _nodeRequire: D,
                        register: r,
                        registerDynamic: t,
                        get: p,
                        set: function(e, r) {
                            I[e] = r
                        },
                        newModule: function(e) {
                            return e
                        }
                    }, i = 0; i < n.length; i++) ! function(e, r) {
                    r && r.__esModule ? I[e] = r : I[e] = s(r)
                }(n[i], arguments[i]);
                a(d);
                var l = p(e[0]);
                if (e.length > 1)
                    for (var i = 1; i < e.length; i++) p(e[i]);
                return o ? l.default : l
            })
        }
    }
}("undefined" != typeof self ? self : global)(["1"], [], !1, function($__System) {
    this.require, this.exports, this.module;
    $__System.registerDynamic("2", ["3"], !0, function($__require, exports, module) {
        var defined = (this || self, $__require("3"));
        module.exports = function(it) {
            return Object(defined(it))
        }
    }), $__System.registerDynamic("4", ["5", "6", "7"], !0, function($__require, exports, module) {
        var $export = (this || self, $__require("5")),
            core = $__require("6"),
            fails = $__require("7");
        module.exports = function(KEY, exec) {
            var fn = (core.Object || {})[KEY] || Object[KEY],
                exp = {};
            exp[KEY] = exec(fn), $export($export.S + $export.F * fails(function() {
                fn(1)
            }), "Object", exp)
        }
    }), $__System.registerDynamic("8", ["2", "4"], !0, function($__require, exports, module) {
        var toObject = (this || self, $__require("2"));
        $__require("4")("keys", function($keys) {
            return function(it) {
                return $keys(toObject(it))
            }
        })
    }), $__System.registerDynamic("9", ["8", "6"], !0, function($__require, exports, module) {
        this || self;
        $__require("8"), module.exports = $__require("6").Object.keys
    }), $__System.registerDynamic("a", ["9"], !0, function($__require, exports, module) {
        this || self;
        module.exports = {
            default: $__require("9"),
            __esModule: !0
        }
    }), $__System.register("b", ["d", "e", "f", "c"], function(_export) {
        var _createClass, _classCallCheck, _Promise, http, YandexTranslate;
        return {
            setters: [function(_d) {
                _createClass = _d.default
            }, function(_e) {
                _classCallCheck = _e.default
            }, function(_f) {
                _Promise = _f.default
            }, function(_c) {
                http = _c.http
            }],
            execute: function() {
                "use strict";
                YandexTranslate = function() {
                    function YandexTranslate(key, srcLang, targetLang) {
                        _classCallCheck(this, YandexTranslate), this.key = key, this.srcLang = srcLang, this.targetLang = targetLang, this.url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + this.key
                    }
                    return _createClass(YandexTranslate, [{
                        key: "getTranslations",
                        value: function(words) {
                            var _this = this;
                            return new _Promise(function(resolve, reject) {
                                var promises = [];
                                words = _this.toList(words), promises = _this.getPromises(words), _Promise.all(promises).then(function(responses) {
                                    var translations = _this.combineTranslations(responses),
                                        tMap = _this.mapTranslations(translations, words);
                                    resolve(tMap)
                                }).catch(function(e) {
                                    reject(e)
                                })
                            })
                        }
                    }, {
                        key: "toList",
                        value: function(words) {
                            var wordList = [];
                            for (var word in words) wordList.push(word);
                            return wordList
                        }
                    }, {
                        key: "getPromises",
                        value: function(words) {
                            var i = 0,
                                promises = [],
                                url = "",
                                limitedWords = [];
                            for (this.url += "&lang=" + this.srcLang + "-" + this.targetLang; i < words.length;) {
                                url = this.url, limitedWords = words.slice(i, i + 500);
                                for (var j in limitedWords){

                                	try{
                                		var buff = encodeURI(limitedWords[j]);
                                		url += "&text=" + limitedWords[j];

                                	}catch(e){
                                		;
                                	}

                                }
                                url = encodeURI(url), promises.push(http(url).get()), i += 500
                            }
                            return promises
                        }
                    }, {
                        key: "combineTranslations",
                        value: function(responses) {
                            var translations = [];
                            for (var i in responses) translations = translations.concat(JSON.parse(responses[i]).text);
                            return translations
                        }
                    }, {
                        key: "mapTranslations",
                        value: function(translations, words) {
                            var tMap = {};
                            for (var i in words) tMap[words[i]] = translations[i];
                            return tMap
                        }
                    }, {
                        key: "translateSentence",
                        value: function(text) {
                            var _this2 = this;
                            return new _Promise(function(resolve, reject) {
                                _this2.url += "&lang=" + _this2.srcLang + "-" + _this2.targetLang, _this2.url += "&text=" + text, http(_this2.url).get().then(function(data) {
                                    resolve(JSON.parse(data).text[0])
                                }).catch(function(e) {
                                    reject(e)
                                })
                            })
                        }
                    }]), YandexTranslate
                }(), _export("YandexTranslate", YandexTranslate)
            }
        }
    }), $__System.register("10", ["d", "e", "f", "c"], function(_export) {
        var _createClass, _classCallCheck, _Promise, http, BingTranslate;
        return {
            setters: [function(_d) {
                _createClass = _d.default
            }, function(_e) {
                _classCallCheck = _e.default
            }, function(_f) {
                _Promise = _f.default
            }, function(_c) {
                http = _c.http
            }],
            execute: function() {
                "use strict";
                BingTranslate = function() {
                    function BingTranslate(key, srcLang, targetLang) {
                        _classCallCheck(this, BingTranslate), this.srcLang = srcLang, this.targetLang = targetLang, this.url = "https://api.microsofttranslator.com/V2/Http.svc/TranslateArray", this.authUrl = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13", this.authData = {
                            grant_type: "client_credentials",
                            scope: "http://api.microsofttranslator.com",
                            client_id: key.clientId,
                            client_secret: key.clientSecret
                        }
                    }
                    return _createClass(BingTranslate, [{
                        key: "getTranslations",
                        value: function(words) {
                            var _this = this;
                            return new _Promise(function(resolve, reject) {
                                var payload = _this.formPayload(words),
                                    headers = {
                                        "content-type": "application/x-www-form-urlencoded"
                                    };
                                http(_this.authUrl).post(_this.authData, headers).then(function(data) {
                                    headers = {
                                        Authorization: "Bearer " + JSON.parse(data).access_token,
                                        "content-type": "application/xml"
                                    }, http(_this.url).post(payload, headers).then(function(res) {
                                        var translations = _this.filterTranslations(res),
                                            tMap = _this.mapTranslations(translations, words);
                                        resolve(tMap)
                                    }).catch(function(e) {
                                        reject(e)
                                    })
                                }).catch(function(e) {
                                    reject(e)
                                })
                            })
                        }
                    }, {
                        key: "formPayload",
                        value: function(words) {
                            var payload = "<TranslateArrayRequest><AppId></AppId><From>" + this.srcLang + "</From><Texts>";
                            for (var word in words) payload += '<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + word + "</string>";
                            return payload += "</Texts><To>" + this.targetLang + "</To></TranslateArrayRequest>", {
                                payload: payload,
                                xml: !0
                            }
                        }
                    }, {
                        key: "filterTranslations",
                        value: function(res, words) {
                            var xmlDoc = this.parseXML(res),
                                elements = xmlDoc.getElementsByTagName("TranslatedText"),
                                translations = [];
                            for (var i in elements) translations.push(elements[i].innerHTML);
                            return translations
                        }
                    }, {
                        key: "parseXML",
                        value: function(xmlStr) {
                            return (new window.DOMParser).parseFromString(xmlStr, "text/xml")
                        }
                    }, {
                        key: "mapTranslations",
                        value: function(translations, words) {
                            var tMap = {},
                                i = 0,
                                translatedWords = translations;
                            for (var word in words) tMap[word] = translatedWords[i], i++;
                            return tMap
                        }
                    }, {
                        key: "translateSentence",
                        value: function(text) {
                            var _this2 = this;
                            return new _Promise(function(resolve, reject) {
                                _this2.url = "http://api.microsofttranslator.com/V2/Http.svc/Translate", _this2.url += "?appId", _this2.url += "&from=" + _this2.srcLang, _this2.url += "&to=" + _this2.targetLang, _this2.url += "&text=" + text;
                                var headers = {
                                    "content-type": "application/x-www-form-urlencoded"
                                };
                                http(_this2.authUrl).post(_this2.authData, headers).then(function(data) {
                                    headers = {
                                        Authorization: "Bearer " + JSON.parse(data).access_token
                                    }, http(_this2.url).get({}, headers).then(function(res) {
                                        var xml = _this2.parseXML(res),
                                            sentence = xml.getElementsByTagName("string")[0].innerHTML;
                                        resolve(sentence)
                                    }).catch(function(e) {
                                        reject(e)
                                    })
                                })
                            })
                        }
                    }]), BingTranslate
                }(), _export("BingTranslate", BingTranslate)
            }
        }
    }), $__System.registerDynamic("11", ["12"], !0, function($__require, exports, module) {
        var $ = (this || self, $__require("12"));
        module.exports = function(it, key, desc) {
            return $.setDesc(it, key, desc)
        }
    }), $__System.registerDynamic("13", ["11"], !0, function($__require, exports, module) {
        this || self;
        module.exports = {
            default: $__require("11"),
            __esModule: !0
        }
    }), $__System.registerDynamic("d", ["13"], !0, function($__require, exports, module) {
        "use strict";
        var _Object$defineProperty = (this || self, $__require("13").default);
        exports.default = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), _Object$defineProperty(target, descriptor.key, descriptor)
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
            }
        }(), exports.__esModule = !0
    }), $__System.registerDynamic("e", [], !0, function($__require, exports, module) {
        "use strict";
        this || self;
        exports.default = function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
        }, exports.__esModule = !0
    }), $__System.registerDynamic("14", [], !0, function($__require, exports, module) {
        "format cjs";
        this || self
    }), $__System.registerDynamic("15", ["16", "3"], !0, function($__require, exports, module) {
        var toInteger = (this || self, $__require("16")),
            defined = $__require("3");
        module.exports = function(TO_STRING) {
            return function(that, pos) {
                var a, b, s = String(defined(that)),
                    i = toInteger(pos),
                    l = s.length;
                return i < 0 || i >= l ? TO_STRING ? "" : void 0 : (a = s.charCodeAt(i), a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : b - 56320 + (a - 55296 << 10) + 65536)
            }
        }
    }), $__System.registerDynamic("17", ["15", "18"], !0, function($__require, exports, module) {
        "use strict";
        var $at = (this || self, $__require("15")(!0));
        $__require("18")(String, "String", function(iterated) {
            this._t = String(iterated), this._i = 0
        }, function() {
            var point, O = this._t,
                index = this._i;
            return index >= O.length ? {
                value: void 0,
                done: !0
            } : (point = $at(O, index), this._i += point.length, {
                value: point,
                done: !1
            })
        })
    }), $__System.registerDynamic("19", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function() {}
    }), $__System.registerDynamic("1a", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(done, value) {
            return {
                value: value,
                done: !!done
            }
        }
    }), $__System.registerDynamic("1b", ["1c"], !0, function($__require, exports, module) {
        var cof = (this || self, $__require("1c"));
        module.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
            return "String" == cof(it) ? it.split("") : Object(it)
        }
    }), $__System.registerDynamic("3", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(it) {
            if (void 0 == it) throw TypeError("Can't call method on  " + it);
            return it
        }
    }), $__System.registerDynamic("1d", ["1b", "3"], !0, function($__require, exports, module) {
        var IObject = (this || self, $__require("1b")),
            defined = $__require("3");
        module.exports = function(it) {
            return IObject(defined(it))
        }
    }), $__System.registerDynamic("1e", ["12", "1f", "20", "21", "22"], !0, function($__require, exports, module) {
        "use strict";
        var $ = (this || self, $__require("12")),
            descriptor = $__require("1f"),
            setToStringTag = $__require("20"),
            IteratorPrototype = {};
        $__require("21")(IteratorPrototype, $__require("22")("iterator"), function() {
            return this
        }), module.exports = function(Constructor, NAME, next) {
            Constructor.prototype = $.create(IteratorPrototype, {
                next: descriptor(1, next)
            }), setToStringTag(Constructor, NAME + " Iterator")
        }
    }), $__System.registerDynamic("18", ["23", "5", "24", "21", "25", "26", "1e", "20", "12", "22"], !0, function($__require, exports, module) {
        "use strict";
        var LIBRARY = (this || self, $__require("23")),
            $export = $__require("5"),
            redefine = $__require("24"),
            hide = $__require("21"),
            has = $__require("25"),
            Iterators = $__require("26"),
            $iterCreate = $__require("1e"),
            setToStringTag = $__require("20"),
            getProto = $__require("12").getProto,
            ITERATOR = $__require("22")("iterator"),
            BUGGY = !([].keys && "next" in [].keys()),
            returnThis = function() {
                return this
            };
        module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
            $iterCreate(Constructor, NAME, next);
            var methods, key, getMethod = function(kind) {
                    if (!BUGGY && kind in proto) return proto[kind];
                    switch (kind) {
                        case "keys":
                        case "values":
                            return function() {
                                return new Constructor(this, kind)
                            }
                    }
                    return function() {
                        return new Constructor(this, kind)
                    }
                },
                TAG = NAME + " Iterator",
                DEF_VALUES = "values" == DEFAULT,
                VALUES_BUG = !1,
                proto = Base.prototype,
                $native = proto[ITERATOR] || proto["@@iterator"] || DEFAULT && proto[DEFAULT],
                $default = $native || getMethod(DEFAULT);
            if ($native) {
                var IteratorPrototype = getProto($default.call(new Base));
                setToStringTag(IteratorPrototype, TAG, !0), !LIBRARY && has(proto, "@@iterator") && hide(IteratorPrototype, ITERATOR, returnThis), DEF_VALUES && "values" !== $native.name && (VALUES_BUG = !0, $default = function() {
                    return $native.call(this)
                })
            }
            if (LIBRARY && !FORCED || !BUGGY && !VALUES_BUG && proto[ITERATOR] || hide(proto, ITERATOR, $default), Iterators[NAME] = $default, Iterators[TAG] = returnThis, DEFAULT)
                if (methods = {
                        values: DEF_VALUES ? $default : getMethod("values"),
                        keys: IS_SET ? $default : getMethod("keys"),
                        entries: DEF_VALUES ? getMethod("entries") : $default
                    }, FORCED)
                    for (key in methods) key in proto || redefine(proto, key, methods[key]);
                else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
            return methods
        }
    }), $__System.registerDynamic("27", ["19", "1a", "26", "1d", "18"], !0, function($__require, exports, module) {
        "use strict";
        var addToUnscopables = (this || self, $__require("19")),
            step = $__require("1a"),
            Iterators = $__require("26"),
            toIObject = $__require("1d");
        module.exports = $__require("18")(Array, "Array", function(iterated, kind) {
            this._t = toIObject(iterated), this._i = 0, this._k = kind
        }, function() {
            var O = this._t,
                kind = this._k,
                index = this._i++;
            return !O || index >= O.length ? (this._t = void 0, step(1)) : "keys" == kind ? step(0, index) : "values" == kind ? step(0, O[index]) : step(0, [index, O[index]])
        }, "values"), Iterators.Arguments = Iterators.Array, addToUnscopables("keys"), addToUnscopables("values"), addToUnscopables("entries")
    }), $__System.registerDynamic("28", ["27", "26"], !0, function($__require, exports, module) {
        this || self;
        $__require("27");
        var Iterators = $__require("26");
        Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array
    }), $__System.registerDynamic("23", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = !0
    }), $__System.registerDynamic("5", ["29", "6", "2a"], !0, function($__require, exports, module) {
        var global = this || self,
            global = $__require("29"),
            core = $__require("6"),
            ctx = $__require("2a"),
            $export = function(type, name, source) {
                var key, own, out, IS_FORCED = type & $export.F,
                    IS_GLOBAL = type & $export.G,
                    IS_STATIC = type & $export.S,
                    IS_PROTO = type & $export.P,
                    IS_BIND = type & $export.B,
                    IS_WRAP = type & $export.W,
                    exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
                    target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {}).prototype;
                IS_GLOBAL && (source = name);
                for (key in source)(own = !IS_FORCED && target && key in target) && key in exports || (out = own ? target[key] : source[key], exports[key] = IS_GLOBAL && "function" != typeof target[key] ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function(C) {
                    var F = function(param) {
                        return this instanceof C ? new C(param) : C(param)
                    };
                    return F.prototype = C.prototype, F
                }(out) : IS_PROTO && "function" == typeof out ? ctx(Function.call, out) : out, IS_PROTO && ((exports.prototype || (exports.prototype = {}))[key] = out))
            };
        $export.F = 1, $export.G = 2, $export.S = 4, $export.P = 8, $export.B = 16, $export.W = 32, module.exports = $export
    }), $__System.registerDynamic("2b", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(it, Constructor, name) {
            if (!(it instanceof Constructor)) throw TypeError(name + ": use the 'new' operator!");
            return it
        }
    }), $__System.registerDynamic("2c", ["2d"], !0, function($__require, exports, module) {
        var anObject = (this || self, $__require("2d"));
        module.exports = function(iterator, fn, value, entries) {
            try {
                return entries ? fn(anObject(value)[0], value[1]) : fn(value)
            } catch (e) {
                var ret = iterator.return;
                throw void 0 !== ret && anObject(ret.call(iterator)), e
            }
        }
    }), $__System.registerDynamic("2e", ["26", "22"], !0, function($__require, exports, module) {
        var Iterators = (this || self, $__require("26")),
            ITERATOR = $__require("22")("iterator"),
            ArrayProto = Array.prototype;
        module.exports = function(it) {
            return void 0 !== it && (Iterators.Array === it || ArrayProto[ITERATOR] === it)
        }
    }), $__System.registerDynamic("16", [], !0, function($__require, exports, module) {
        var ceil = (this || self, Math.ceil),
            floor = Math.floor;
        module.exports = function(it) {
            return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it)
        }
    }), $__System.registerDynamic("2f", ["16"], !0, function($__require, exports, module) {
        var toInteger = (this || self, $__require("16")),
            min = Math.min;
        module.exports = function(it) {
            return it > 0 ? min(toInteger(it), 9007199254740991) : 0
        }
    }), $__System.registerDynamic("30", ["1c", "22"], !0, function($__require, exports, module) {
        var cof = (this || self, $__require("1c")),
            TAG = $__require("22")("toStringTag"),
            ARG = "Arguments" == cof(function() {
                return arguments
            }());
        module.exports = function(it) {
            var O, T, B;
            return void 0 === it ? "Undefined" : null === it ? "Null" : "string" == typeof(T = (O = Object(it))[TAG]) ? T : ARG ? cof(O) : "Object" == (B = cof(O)) && "function" == typeof O.callee ? "Arguments" : B
        }
    }), $__System.registerDynamic("26", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = {}
    }), $__System.registerDynamic("31", ["30", "22", "26", "6"], !0, function($__require, exports, module) {
        var classof = (this || self, $__require("30")),
            ITERATOR = $__require("22")("iterator"),
            Iterators = $__require("26");
        module.exports = $__require("6").getIteratorMethod = function(it) {
            if (void 0 != it) return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)]
        }
    }), $__System.registerDynamic("32", ["2a", "2c", "2e", "2d", "2f", "31"], !0, function($__require, exports, module) {
        var ctx = (this || self, $__require("2a")),
            call = $__require("2c"),
            isArrayIter = $__require("2e"),
            anObject = $__require("2d"),
            toLength = $__require("2f"),
            getIterFn = $__require("31");
        module.exports = function(iterable, entries, fn, that) {
            var length, step, iterator, iterFn = getIterFn(iterable),
                f = ctx(fn, that, entries ? 2 : 1),
                index = 0;
            if ("function" != typeof iterFn) throw TypeError(iterable + " is not iterable!");
            if (isArrayIter(iterFn))
                for (length = toLength(iterable.length); length > index; index++) entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
            else
                for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) call(iterator, f, step.value, entries)
        }
    }), $__System.registerDynamic("33", ["12", "34", "2d", "2a"], !0, function($__require, exports, module) {
        var getDesc = (this || self, $__require("12").getDesc),
            isObject = $__require("34"),
            anObject = $__require("2d"),
            check = function(O, proto) {
                if (anObject(O), !isObject(proto) && null !== proto) throw TypeError(proto + ": can't set as prototype!")
            };
        module.exports = {
            set: Object.setPrototypeOf || ("__proto__" in {} ? function(test, buggy, set) {
                try {
                    set = $__require("2a")(Function.call, getDesc(Object.prototype, "__proto__").set, 2), set(test, []), buggy = !(test instanceof Array)
                } catch (e) {
                    buggy = !0
                }
                return function(O, proto) {
                    return check(O, proto), buggy ? O.__proto__ = proto : set(O, proto), O
                }
            }({}, !1) : void 0),
            check: check
        }
    }), $__System.registerDynamic("35", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = Object.is || function(x, y) {
            return x === y ? 0 !== x || 1 / x == 1 / y : x != x && y != y
        }
    }), $__System.registerDynamic("2d", ["34"], !0, function($__require, exports, module) {
        var isObject = (this || self, $__require("34"));
        module.exports = function(it) {
            if (!isObject(it)) throw TypeError(it + " is not an object!");
            return it
        }
    }), $__System.registerDynamic("36", ["2d", "37", "22"], !0, function($__require, exports, module) {
        var anObject = (this || self, $__require("2d")),
            aFunction = $__require("37"),
            SPECIES = $__require("22")("species");
        module.exports = function(O, D) {
            var S, C = anObject(O).constructor;
            return void 0 === C || void 0 == (S = anObject(C)[SPECIES]) ? D : aFunction(S)
        }
    }), $__System.registerDynamic("37", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(it) {
            if ("function" != typeof it) throw TypeError(it + " is not a function!");
            return it
        }
    }), $__System.registerDynamic("2a", ["37"], !0, function($__require, exports, module) {
        var aFunction = (this || self, $__require("37"));
        module.exports = function(fn, that, length) {
            if (aFunction(fn), void 0 === that) return fn;
            switch (length) {
                case 1:
                    return function(a) {
                        return fn.call(that, a)
                    };
                case 2:
                    return function(a, b) {
                        return fn.call(that, a, b)
                    };
                case 3:
                    return function(a, b, c) {
                        return fn.call(that, a, b, c)
                    }
            }
            return function() {
                return fn.apply(that, arguments)
            }
        }
    }), $__System.registerDynamic("38", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(fn, args, that) {
            var un = void 0 === that;
            switch (args.length) {
                case 0:
                    return un ? fn() : fn.call(that);
                case 1:
                    return un ? fn(args[0]) : fn.call(that, args[0]);
                case 2:
                    return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                case 3:
                    return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                case 4:
                    return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3])
            }
            return fn.apply(that, args)
        }
    }), $__System.registerDynamic("39", ["29"], !0, function($__require, exports, module) {
        this || self;
        module.exports = $__require("29").document && document.documentElement
    }), $__System.registerDynamic("34", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(it) {
            return "object" == typeof it ? null !== it : "function" == typeof it
        }
    }), $__System.registerDynamic("3a", ["34", "29"], !0, function($__require, exports, module) {
        var isObject = (this || self, $__require("34")),
            document = $__require("29").document,
            is = isObject(document) && isObject(document.createElement);
        module.exports = function(it) {
            return is ? document.createElement(it) : {}
        }
    }), $__System.registerDynamic("3b", ["2a", "38", "39", "3a", "29", "1c", "3c"], !0, function($__require, exports, module) {
        this || self;
        ! function(process) {
            var defer, channel, port, ctx = $__require("2a"),
                invoke = $__require("38"),
                html = $__require("39"),
                cel = $__require("3a"),
                global = $__require("29"),
                process = global.process,
                setTask = global.setImmediate,
                clearTask = global.clearImmediate,
                MessageChannel = global.MessageChannel,
                counter = 0,
                queue = {},
                run = function() {
                    var id = +this;
                    if (queue.hasOwnProperty(id)) {
                        var fn = queue[id];
                        delete queue[id], fn()
                    }
                },
                listner = function(event) {
                    run.call(event.data)
                };
            setTask && clearTask || (setTask = function(fn) {
                for (var args = [], i = 1; arguments.length > i;) args.push(arguments[i++]);
                return queue[++counter] = function() {
                    invoke("function" == typeof fn ? fn : Function(fn), args)
                }, defer(counter), counter
            }, clearTask = function(id) {
                delete queue[id]
            }, "process" == $__require("1c")(process) ? defer = function(id) {
                process.nextTick(ctx(run, id, 1))
            } : MessageChannel ? (channel = new MessageChannel, port = channel.port2, channel.port1.onmessage = listner, defer = ctx(port.postMessage, port, 1)) : global.addEventListener && "function" == typeof postMessage && !global.importScripts ? (defer = function(id) {
                global.postMessage(id + "", "*")
            }, global.addEventListener("message", listner, !1)) : defer = "onreadystatechange" in cel("script") ? function(id) {
                html.appendChild(cel("script")).onreadystatechange = function() {
                    html.removeChild(this), run.call(id)
                }
            } : function(id) {
                setTimeout(ctx(run, id, 1), 0)
            }), module.exports = {
                set: setTask,
                clear: clearTask
            }
        }($__require("3c"))
    }), $__System.registerDynamic("1c", [], !0, function($__require, exports, module) {
        var toString = (this || self, {}.toString);
        module.exports = function(it) {
            return toString.call(it).slice(8, -1)
        }
    }), $__System.registerDynamic("3d", ["29", "3b", "1c", "3c"], !0, function($__require, exports, module) {
        this || self;
        ! function(process) {
            var head, last, notify, global = $__require("29"),
                macrotask = $__require("3b").set,
                Observer = global.MutationObserver || global.WebKitMutationObserver,
                process = global.process,
                Promise = global.Promise,
                isNode = "process" == $__require("1c")(process),
                flush = function() {
                    var parent, domain, fn;
                    for (isNode && (parent = process.domain) && (process.domain = null, parent.exit()); head;) domain = head.domain, fn = head.fn, domain && domain.enter(), fn(), domain && domain.exit(), head = head.next;
                    last = void 0, parent && parent.enter()
                };
            if (isNode) notify = function() {
                process.nextTick(flush)
            };
            else if (Observer) {
                var toggle = 1,
                    node = document.createTextNode("");
                new Observer(flush).observe(node, {
                    characterData: !0
                }), notify = function() {
                    node.data = toggle = -toggle
                }
            } else notify = Promise && Promise.resolve ? function() {
                Promise.resolve().then(flush)
            } : function() {
                macrotask.call(global, flush)
            };
            module.exports = function(fn) {
                var task = {
                    fn: fn,
                    next: void 0,
                    domain: isNode && process.domain
                };
                last && (last.next = task), head || (head = task, notify()), last = task
            }
        }($__require("3c"))
    }), $__System.registerDynamic("1f", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(bitmap, value) {
            return {
                enumerable: !(1 & bitmap),
                configurable: !(2 & bitmap),
                writable: !(4 & bitmap),
                value: value
            }
        }
    }), $__System.registerDynamic("21", ["12", "1f", "3e"], !0, function($__require, exports, module) {
        var $ = (this || self, $__require("12")),
            createDesc = $__require("1f");
        module.exports = $__require("3e") ? function(object, key, value) {
            return $.setDesc(object, key, createDesc(1, value))
        } : function(object, key, value) {
            return object[key] = value, object
        }
    }), $__System.registerDynamic("24", ["21"], !0, function($__require, exports, module) {
        this || self;
        module.exports = $__require("21")
    }), $__System.registerDynamic("3f", ["24"], !0, function($__require, exports, module) {
        var redefine = (this || self, $__require("24"));
        module.exports = function(target, src) {
            for (var key in src) redefine(target, key, src[key]);
            return target
        }
    }), $__System.registerDynamic("25", [], !0, function($__require, exports, module) {
        var hasOwnProperty = (this || self, {}.hasOwnProperty);
        module.exports = function(it, key) {
            return hasOwnProperty.call(it, key)
        }
    }), $__System.registerDynamic("20", ["12", "25", "22"], !0, function($__require, exports, module) {
        var def = (this || self, $__require("12").setDesc),
            has = $__require("25"),
            TAG = $__require("22")("toStringTag");
        module.exports = function(it, tag, stat) {
            it && !has(it = stat ? it : it.prototype, TAG) && def(it, TAG, {
                configurable: !0,
                value: tag
            })
        }
    }), $__System.registerDynamic("12", [], !0, function($__require, exports, module) {
        var $Object = (this || self, Object);
        module.exports = {
            create: $Object.create,
            getProto: $Object.getPrototypeOf,
            isEnum: {}.propertyIsEnumerable,
            getDesc: $Object.getOwnPropertyDescriptor,
            setDesc: $Object.defineProperty,
            setDescs: $Object.defineProperties,
            getKeys: $Object.keys,
            getNames: $Object.getOwnPropertyNames,
            getSymbols: $Object.getOwnPropertySymbols,
            each: [].forEach
        }
    }), $__System.registerDynamic("7", [], !0, function($__require, exports, module) {
        this || self;
        module.exports = function(exec) {
            try {
                return !!exec()
            } catch (e) {
                return !0
            }
        }
    }), $__System.registerDynamic("3e", ["7"], !0, function($__require, exports, module) {
        this || self;
        module.exports = !$__require("7")(function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            }).a
        })
    }), $__System.registerDynamic("40", ["6", "12", "3e", "22"], !0, function($__require, exports, module) {
        "use strict";
        var core = (this || self, $__require("6")),
            $ = $__require("12"),
            DESCRIPTORS = $__require("3e"),
            SPECIES = $__require("22")("species");
        module.exports = function(KEY) {
            var C = core[KEY];
            DESCRIPTORS && C && !C[SPECIES] && $.setDesc(C, SPECIES, {
                configurable: !0,
                get: function() {
                    return this
                }
            })
        }
    }), $__System.registerDynamic("41", ["29"], !0, function($__require, exports, module) {
        var global = this || self,
            global = $__require("29"),
            store = global["__core-js_shared__"] || (global["__core-js_shared__"] = {});
        module.exports = function(key) {
            return store[key] || (store[key] = {})
        }
    }), $__System.registerDynamic("42", [], !0, function($__require, exports, module) {
        var id = (this || self, 0),
            px = Math.random();
        module.exports = function(key) {
            return "Symbol(".concat(void 0 === key ? "" : key, ")_", (++id + px).toString(36))
        }
    }), $__System.registerDynamic("29", [], !0, function($__require, exports, module) {
        var global = this || self,
            global = module.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = global)
    }), $__System.registerDynamic("22", ["41", "42", "29"], !0, function($__require, exports, module) {
        var store = (this || self, $__require("41")("wks")),
            uid = $__require("42"),
            Symbol = $__require("29").Symbol;
        module.exports = function(name) {
            return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)("Symbol." + name))
        }
    }), $__System.registerDynamic("43", ["22"], !0, function($__require, exports, module) {
        var ITERATOR = (this || self, $__require("22")("iterator")),
            SAFE_CLOSING = !1;
        try {
            var riter = [7][ITERATOR]();
            riter.return = function() {
                SAFE_CLOSING = !0
            }, Array.from(riter, function() {
                throw 2
            })
        } catch (e) {}
        module.exports = function(exec, skipClosing) {
            if (!skipClosing && !SAFE_CLOSING) return !1;
            var safe = !1;
            try {
                var arr = [7],
                    iter = arr[ITERATOR]();
                iter.next = function() {
                    safe = !0
                }, arr[ITERATOR] = function() {
                    return iter
                }, exec(arr)
            } catch (e) {}
            return safe
        }
    }), $__System.registerDynamic("44", [], !0, function($__require, exports, module) {
        function cleanUpNextTick() {
            draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue())
        }

        function drainQueue() {
            if (!draining) {
                var timeout = setTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len;) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len;) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length
                }
                currentQueue = null, draining = !1, clearTimeout(timeout)
            }
        }

        function Item(fun, array) {
            this.fun = fun, this.array = array
        }

        function noop() {}
        var currentQueue, process = (this || self, module.exports = {}),
            queue = [],
            draining = !1,
            queueIndex = -1;
        process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
                queue.push(new Item(fun, args)), 1 !== queue.length || draining || setTimeout(drainQueue, 0)
            }, Item.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop,
            process.removeAllListeners = noop, process.emit = noop, process.binding = function(name) {
                throw new Error("process.binding is not supported")
            }, process.cwd = function() {
                return "/"
            }, process.chdir = function(dir) {
                throw new Error("process.chdir is not supported")
            }, process.umask = function() {
                return 0
            }
    }), $__System.registerDynamic("45", ["44"], !0, function($__require, exports, module) {
        this || self;
        module.exports = $__require("44")
    }), $__System.registerDynamic("46", ["45"], !0, function($__require, exports, module) {
        this || self;
        module.exports = $__System._nodeRequire ? process : $__require("45")
    }), $__System.registerDynamic("3c", ["46"], !0, function($__require, exports, module) {
        this || self;
        module.exports = $__require("46")
    }), $__System.registerDynamic("47", ["12", "23", "29", "2a", "30", "5", "34", "2d", "37", "2b", "32", "33", "35", "22", "36", "3d", "3e", "3f", "20", "40", "6", "43", "3c"], !0, function($__require, exports, module) {
        this || self;
        ! function(process) {
            "use strict";
            var Wrapper, $ = $__require("12"),
                LIBRARY = $__require("23"),
                global = $__require("29"),
                ctx = $__require("2a"),
                classof = $__require("30"),
                $export = $__require("5"),
                isObject = $__require("34"),
                anObject = $__require("2d"),
                aFunction = $__require("37"),
                strictNew = $__require("2b"),
                forOf = $__require("32"),
                setProto = $__require("33").set,
                same = $__require("35"),
                SPECIES = $__require("22")("species"),
                speciesConstructor = $__require("36"),
                asap = $__require("3d"),
                process = global.process,
                isNode = "process" == classof(process),
                P = global.Promise,
                testResolve = function(sub) {
                    var test = new P(function() {});
                    return sub && (test.constructor = Object), P.resolve(test) === test
                },
                USE_NATIVE = function() {
                    function P2(x) {
                        var self = new P(x);
                        return setProto(self, P2.prototype), self
                    }
                    var works = !1;
                    try {
                        if (works = P && P.resolve && testResolve(), setProto(P2, P), P2.prototype = $.create(P.prototype, {
                                constructor: {
                                    value: P2
                                }
                            }), P2.resolve(5).then(function() {}) instanceof P2 || (works = !1), works && $__require("3e")) {
                            var thenableThenGotten = !1;
                            P.resolve($.setDesc({}, "then", {
                                get: function() {
                                    thenableThenGotten = !0
                                }
                            })), works = thenableThenGotten
                        }
                    } catch (e) {
                        works = !1
                    }
                    return works
                }(),
                sameConstructor = function(a, b) {
                    return !(!LIBRARY || a !== P || b !== Wrapper) || same(a, b)
                },
                getConstructor = function(C) {
                    var S = anObject(C)[SPECIES];
                    return void 0 != S ? S : C
                },
                isThenable = function(it) {
                    var then;
                    return !(!isObject(it) || "function" != typeof(then = it.then)) && then
                },
                PromiseCapability = function(C) {
                    var resolve, reject;
                    this.promise = new C(function($$resolve, $$reject) {
                        if (void 0 !== resolve || void 0 !== reject) throw TypeError("Bad Promise constructor");
                        resolve = $$resolve, reject = $$reject
                    }), this.resolve = aFunction(resolve), this.reject = aFunction(reject)
                },
                perform = function(exec) {
                    try {
                        exec()
                    } catch (e) {
                        return {
                            error: e
                        }
                    }
                },
                notify = function(record, isReject) {
                    if (!record.n) {
                        record.n = !0;
                        var chain = record.c;
                        asap(function() {
                            for (var value = record.v, ok = 1 == record.s, i = 0; chain.length > i;) ! function(reaction) {
                                var result, then, handler = ok ? reaction.ok : reaction.fail,
                                    resolve = reaction.resolve,
                                    reject = reaction.reject;
                                try {
                                    handler ? (ok || (record.h = !0), result = !0 === handler ? value : handler(value), result === reaction.promise ? reject(TypeError("Promise-chain cycle")) : (then = isThenable(result)) ? then.call(result, resolve, reject) : resolve(result)) : reject(value)
                                } catch (e) {
                                    reject(e)
                                }
                            }(chain[i++]);
                            chain.length = 0, record.n = !1, isReject && setTimeout(function() {
                                var handler, console, promise = record.p;
                                isUnhandled(promise) && (isNode ? process.emit("unhandledRejection", value, promise) : (handler = global.onunhandledrejection) ? handler({
                                    promise: promise,
                                    reason: value
                                }) : (console = global.console) && console.error && console.error("Unhandled promise rejection", value)), record.a = void 0
                            }, 1)
                        })
                    }
                },
                isUnhandled = function(promise) {
                    var reaction, record = promise._d,
                        chain = record.a || record.c,
                        i = 0;
                    if (record.h) return !1;
                    for (; chain.length > i;)
                        if (reaction = chain[i++], reaction.fail || !isUnhandled(reaction.promise)) return !1;
                    return !0
                },
                $reject = function(value) {
                    var record = this;
                    record.d || (record.d = !0, record = record.r || record, record.v = value, record.s = 2, record.a = record.c.slice(), notify(record, !0))
                },
                $resolve = function(value) {
                    var then, record = this;
                    if (!record.d) {
                        record.d = !0, record = record.r || record;
                        try {
                            if (record.p === value) throw TypeError("Promise can't be resolved itself");
                            (then = isThenable(value)) ? asap(function() {
                                var wrapper = {
                                    r: record,
                                    d: !1
                                };
                                try {
                                    then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1))
                                } catch (e) {
                                    $reject.call(wrapper, e)
                                }
                            }): (record.v = value, record.s = 1, notify(record, !1))
                        } catch (e) {
                            $reject.call({
                                r: record,
                                d: !1
                            }, e)
                        }
                    }
                };
            USE_NATIVE || (P = function(executor) {
                aFunction(executor);
                var record = this._d = {
                    p: strictNew(this, P, "Promise"),
                    c: [],
                    a: void 0,
                    s: 0,
                    d: !1,
                    v: void 0,
                    h: !1,
                    n: !1
                };
                try {
                    executor(ctx($resolve, record, 1), ctx($reject, record, 1))
                } catch (err) {
                    $reject.call(record, err)
                }
            }, $__require("3f")(P.prototype, {
                then: function(onFulfilled, onRejected) {
                    var reaction = new PromiseCapability(speciesConstructor(this, P)),
                        promise = reaction.promise,
                        record = this._d;
                    return reaction.ok = "function" != typeof onFulfilled || onFulfilled, reaction.fail = "function" == typeof onRejected && onRejected, record.c.push(reaction), record.a && record.a.push(reaction), record.s && notify(record, !1), promise
                },
                catch: function(onRejected) {
                    return this.then(void 0, onRejected)
                }
            })), $export($export.G + $export.W + $export.F * !USE_NATIVE, {
                Promise: P
            }), $__require("20")(P, "Promise"), $__require("40")("Promise"), Wrapper = $__require("6").Promise, $export($export.S + $export.F * !USE_NATIVE, "Promise", {
                reject: function(r) {
                    var capability = new PromiseCapability(this);
                    return (0, capability.reject)(r), capability.promise
                }
            }), $export($export.S + $export.F * (!USE_NATIVE || testResolve(!0)), "Promise", {
                resolve: function(x) {
                    if (x instanceof P && sameConstructor(x.constructor, this)) return x;
                    var capability = new PromiseCapability(this);
                    return (0, capability.resolve)(x), capability.promise
                }
            }), $export($export.S + $export.F * !(USE_NATIVE && $__require("43")(function(iter) {
                P.all(iter).catch(function() {})
            })), "Promise", {
                all: function(iterable) {
                    var C = getConstructor(this),
                        capability = new PromiseCapability(C),
                        resolve = capability.resolve,
                        reject = capability.reject,
                        values = [],
                        abrupt = perform(function() {
                            forOf(iterable, !1, values.push, values);
                            var remaining = values.length,
                                results = Array(remaining);
                            remaining ? $.each.call(values, function(promise, index) {
                                var alreadyCalled = !1;
                                C.resolve(promise).then(function(value) {
                                    alreadyCalled || (alreadyCalled = !0, results[index] = value, --remaining || resolve(results))
                                }, reject)
                            }) : resolve(results)
                        });
                    return abrupt && reject(abrupt.error), capability.promise
                },
                race: function(iterable) {
                    var C = getConstructor(this),
                        capability = new PromiseCapability(C),
                        reject = capability.reject,
                        abrupt = perform(function() {
                            forOf(iterable, !1, function(promise) {
                                C.resolve(promise).then(capability.resolve, reject)
                            })
                        });
                    return abrupt && reject(abrupt.error), capability.promise
                }
            })
        }($__require("3c"))
    }), $__System.registerDynamic("6", [], !0, function($__require, exports, module) {
        var core = (this || self, module.exports = {
            version: "1.2.6"
        });
        "number" == typeof __e && (__e = core)
    }), $__System.registerDynamic("48", ["14", "17", "28", "47", "6"], !0, function($__require, exports, module) {
        this || self;
        $__require("14"), $__require("17"), $__require("28"), $__require("47"), module.exports = $__require("6").Promise
    }), $__System.registerDynamic("f", ["48"], !0, function($__require, exports, module) {
        this || self;
        module.exports = {
            default: $__require("48"),
            __esModule: !0
        }
    }), $__System.register("c", ["f"], function(_export) {
        function http(url) {
            var core = {
                ajax: function(method, url, args, headers) {
                    return new _Promise(function(resolve, reject) {
                        var client = new XMLHttpRequest,
                            uri = "";
                        if (args && args.xml) uri = args.payload;
                        else if (args && ("POST" === method || "PUT" === method)) {
                            var argcount = 0;
                            for (var key in args) args.hasOwnProperty(key) && (argcount++ && (uri += "&"), uri += encodeURIComponent(key) + "=" + encodeURIComponent(args[key]))
                        }
                        if (client.open(method, url), headers)
                            for (var i in headers) client.setRequestHeader(i, headers[i]);
                        client.send(uri), client.onload = function() {
                            this.status >= 200 && this.status < 300 ? resolve(this.response) : reject(this.statusText)
                        }, client.onerror = function() {
                            reject(this.statusText)
                        }
                    })
                }
            };
            return {
                get: function(args, headers) {
                    return core.ajax("GET", url, args, headers)
                },
                post: function(args, headers) {
                    return core.ajax("POST", url, args, headers)
                },
                put: function(args, headers) {
                    return core.ajax("PUT", url, args, headers)
                },
                delete: function(args, headers) {
                    return core.ajax("DELETE", url, args, headers)
                }
            }
        }
        var _Promise;
        return {
            setters: [function(_f) {
                _Promise = _f.default
            }],
            execute: function() {
                "use strict";
                _export("http", http)
            }
        }
    }), $__System.register("49", ["d", "e", "f", "c"], function(_export) {
        var _createClass, _classCallCheck, _Promise, http, GoogleTranslate;
        return {
            setters: [function(_d) {
                _createClass = _d.default
            }, function(_e) {
                _classCallCheck = _e.default
            }, function(_f) {
                _Promise = _f.default
            }, function(_c) {
                http = _c.http
            }],
            execute: function() {
                "use strict";
                GoogleTranslate = function() {
                    function GoogleTranslate(key, srcLang, targetLang) {
                        _classCallCheck(this, GoogleTranslate), this.key = key, this.srcLang = srcLang, this.targetLang = targetLang, this.url = "https://www.googleapis.com/language/translate/v2?key=" + this.key
                    }
                    return _createClass(GoogleTranslate, [{
                        key: "getTranslations",
                        value: function(words) {
                            var _this = this;
                            return new _Promise(function(resolve, reject) {
                                var promises = [];
                                _this.url += "&source=" + _this.srcLang + "&target=" + _this.targetLang, words = _this.toList(words), promises = _this.getPromises(words), _Promise.all(promises).then(function(responses) {
                                    var translations = _this.combineTranslations(responses),
                                        tMap = _this.mapTranslations(translations, words);
                                    resolve(tMap)
                                }).catch(function(e) {
                                    reject(e)
                                })
                            })
                        }
                    }, {
                        key: "toList",
                        value: function(words) {
                            var wordList = [];
                            for (var word in words) wordList.push(word);
                            return wordList
                        }
                    }, {
                        key: "getPromises",
                        value: function(words) {
                            for (var i = 0, promises = [], url = "", limitedWords = []; i < words.length;) {
                                url = this.url, limitedWords = words.slice(i, i + 128);
                                for (var j in limitedWords) url += "&q=" + limitedWords[j];
                                url = encodeURI(url), promises.push(http(url).get()), i += 128
                            }
                            return promises
                        }
                    }, {
                        key: "combineTranslations",
                        value: function(responses) {
                            var translations = [];
                            for (var i in responses) translations = translations.concat(JSON.parse(responses[i]).data.translations);
                            return translations
                        }
                    }, {
                        key: "mapTranslations",
                        value: function(translations, words) {
                            var tMap = {},
                                i = 0,
                                translatedWords = translations;
                            for (var word in words) tMap[words[word]] = translatedWords[i].translatedText, i++;
                            return console.log(tMap), tMap
                        }
                    }, {
                        key: "translateSentence",
                        value: function(text) {
                            var _this2 = this;
                            return new _Promise(function(resolve, reject) {
                                _this2.url += "&source=" + _this2.srcLang + "&target=" + _this2.targetLang, _this2.url += "&q=" + text, http(_this2.url).get().then(function(data) {
                                    resolve(JSON.parse(data).data.translations[0].translatedText)
                                }).catch(function(e) {
                                    reject(e)
                                })
                            })
                        }
                    }]), GoogleTranslate
                }(), _export("GoogleTranslate", GoogleTranslate)
            }
        }
    }), $__System.register("4a", [], function(_export) {
        "use strict";

        function getCurrentMonth() {
            return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][(new Date).getMonth()]
        }

        function getCurrentDay() {
            return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][(new Date).getDay() - 1]
        }
        return _export("getCurrentMonth", getCurrentMonth), _export("getCurrentDay", getCurrentDay), {
            setters: [],
            execute: function() {}
        }
    }), $__System.registerDynamic("4b", ["@empty"], !0, function($__require, exports, module) {
        "format cjs";
        var global = this || self;
        ! function(Buffer, process) {
            (function() {
                function addMapEntry(map, pair) {
                    return map.set(pair[0], pair[1]), map
                }

                function addSetEntry(set, value) {
                    return set.add(value), set
                }

                function apply(func, thisArg, args) {
                    switch (args.length) {
                        case 0:
                            return func.call(thisArg);
                        case 1:
                            return func.call(thisArg, args[0]);
                        case 2:
                            return func.call(thisArg, args[0], args[1]);
                        case 3:
                            return func.call(thisArg, args[0], args[1], args[2])
                    }
                    return func.apply(thisArg, args)
                }

                function arrayAggregator(array, setter, iteratee, accumulator) {
                    for (var index = -1, length = array ? array.length : 0; ++index < length;) {
                        var value = array[index];
                        setter(accumulator, value, iteratee(value), array)
                    }
                    return accumulator
                }

                function arrayEach(array, iteratee) {
                    for (var index = -1, length = array ? array.length : 0; ++index < length && !1 !== iteratee(array[index], index, array););
                    return array
                }

                function arrayEachRight(array, iteratee) {
                    for (var length = array ? array.length : 0; length-- && !1 !== iteratee(array[length], length, array););
                    return array
                }

                function arrayEvery(array, predicate) {
                    for (var index = -1, length = array ? array.length : 0; ++index < length;)
                        if (!predicate(array[index], index, array)) return !1;
                    return !0
                }

                function arrayFilter(array, predicate) {
                    for (var index = -1, length = array ? array.length : 0, resIndex = 0, result = []; ++index < length;) {
                        var value = array[index];
                        predicate(value, index, array) && (result[resIndex++] = value)
                    }
                    return result
                }

                function arrayIncludes(array, value) {
                    return !!(array ? array.length : 0) && baseIndexOf(array, value, 0) > -1
                }

                function arrayIncludesWith(array, value, comparator) {
                    for (var index = -1, length = array ? array.length : 0; ++index < length;)
                        if (comparator(value, array[index])) return !0;
                    return !1
                }

                function arrayMap(array, iteratee) {
                    for (var index = -1, length = array ? array.length : 0, result = Array(length); ++index < length;) result[index] = iteratee(array[index], index, array);
                    return result
                }

                function arrayPush(array, values) {
                    for (var index = -1, length = values.length, offset = array.length; ++index < length;) array[offset + index] = values[index];
                    return array
                }

                function arrayReduce(array, iteratee, accumulator, initAccum) {
                    var index = -1,
                        length = array ? array.length : 0;
                    for (initAccum && length && (accumulator = array[++index]); ++index < length;) accumulator = iteratee(accumulator, array[index], index, array);
                    return accumulator
                }

                function arrayReduceRight(array, iteratee, accumulator, initAccum) {
                    var length = array ? array.length : 0;
                    for (initAccum && length && (accumulator = array[--length]); length--;) accumulator = iteratee(accumulator, array[length], length, array);
                    return accumulator
                }

                function arraySome(array, predicate) {
                    for (var index = -1, length = array ? array.length : 0; ++index < length;)
                        if (predicate(array[index], index, array)) return !0;
                    return !1
                }

                function baseFindKey(collection, predicate, eachFunc) {
                    var result;
                    return eachFunc(collection, function(value, key, collection) {
                        if (predicate(value, key, collection)) return result = key, !1
                    }), result
                }

                function baseFindIndex(array, predicate, fromIndex, fromRight) {
                    for (var length = array.length, index = fromIndex + (fromRight ? 1 : -1); fromRight ? index-- : ++index < length;)
                        if (predicate(array[index], index, array)) return index;
                    return -1
                }

                function baseIndexOf(array, value, fromIndex) {
                    if (value !== value) return baseFindIndex(array, baseIsNaN, fromIndex);
                    for (var index = fromIndex - 1, length = array.length; ++index < length;)
                        if (array[index] === value) return index;
                    return -1
                }

                function baseIndexOfWith(array, value, fromIndex, comparator) {
                    for (var index = fromIndex - 1, length = array.length; ++index < length;)
                        if (comparator(array[index], value)) return index;
                    return -1
                }

                function baseIsNaN(value) {
                    return value !== value
                }

                function baseMean(array, iteratee) {
                    var length = array ? array.length : 0;
                    return length ? baseSum(array, iteratee) / length : NAN
                }

                function baseProperty(key) {
                    return function(object) {
                        return null == object ? undefined : object[key]
                    }
                }

                function basePropertyOf(object) {
                    return function(key) {
                        return null == object ? undefined : object[key]
                    }
                }

                function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
                    return eachFunc(collection, function(value, index, collection) {
                        accumulator = initAccum ? (initAccum = !1, value) : iteratee(accumulator, value, index, collection)
                    }), accumulator
                }

                function baseSortBy(array, comparer) {
                    var length = array.length;
                    for (array.sort(comparer); length--;) array[length] = array[length].value;
                    return array
                }

                function baseSum(array, iteratee) {
                    for (var result, index = -1, length = array.length; ++index < length;) {
                        var current = iteratee(array[index]);
                        current !== undefined && (result = result === undefined ? current : result + current)
                    }
                    return result
                }

                function baseTimes(n, iteratee) {
                    for (var index = -1, result = Array(n); ++index < n;) result[index] = iteratee(index);
                    return result
                }

                function baseToPairs(object, props) {
                    return arrayMap(props, function(key) {
                        return [key, object[key]]
                    })
                }

                function baseUnary(func) {
                    return function(value) {
                        return func(value)
                    }
                }

                function baseValues(object, props) {
                    return arrayMap(props, function(key) {
                        return object[key]
                    })
                }

                function cacheHas(cache, key) {
                    return cache.has(key)
                }

                function charsStartIndex(strSymbols, chrSymbols) {
                    for (var index = -1, length = strSymbols.length; ++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1;);
                    return index
                }

                function charsEndIndex(strSymbols, chrSymbols) {
                    for (var index = strSymbols.length; index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1;);
                    return index
                }

                function countHolders(array, placeholder) {
                    for (var length = array.length, result = 0; length--;) array[length] === placeholder && result++;
                    return result
                }

                function escapeStringChar(chr) {
                    return "\\" + stringEscapes[chr]
                }

                function getValue(object, key) {
                    return null == object ? undefined : object[key]
                }

                function isHostObject(value) {
                    var result = !1;
                    if (null != value && "function" != typeof value.toString) try {
                        result = !!(value + "")
                    } catch (e) {}
                    return result
                }

                function iteratorToArray(iterator) {
                    for (var data, result = []; !(data = iterator.next()).done;) result.push(data.value);
                    return result
                }

                function mapToArray(map) {
                    var index = -1,
                        result = Array(map.size);
                    return map.forEach(function(value, key) {
                        result[++index] = [key, value]
                    }), result
                }

                function overArg(func, transform) {
                    return function(arg) {
                        return func(transform(arg))
                    }
                }

                function replaceHolders(array, placeholder) {
                    for (var index = -1, length = array.length, resIndex = 0, result = []; ++index < length;) {
                        var value = array[index];
                        value !== placeholder && value !== PLACEHOLDER || (array[index] = PLACEHOLDER, result[resIndex++] = index)
                    }
                    return result
                }

                function setToArray(set) {
                    var index = -1,
                        result = Array(set.size);
                    return set.forEach(function(value) {
                        result[++index] = value
                    }), result
                }

                function setToPairs(set) {
                    var index = -1,
                        result = Array(set.size);
                    return set.forEach(function(value) {
                        result[++index] = [value, value]
                    }), result
                }

                function stringSize(string) {
                    if (!string || !reHasComplexSymbol.test(string)) return string.length;
                    for (var result = reComplexSymbol.lastIndex = 0; reComplexSymbol.test(string);) result++;
                    return result
                }

                function stringToArray(string) {
                    return string.match(reComplexSymbol)
                }

                function runInContext(context) {
                    function lodash(value) {
                        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                            if (value instanceof LodashWrapper) return value;
                            if (hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value)
                        }
                        return new LodashWrapper(value)
                    }

                    function baseLodash() {}

                    function LodashWrapper(value, chainAll) {
                        this.__wrapped__ = value, this.__actions__ = [], this.__chain__ = !!chainAll, this.__index__ = 0, this.__values__ = undefined
                    }

                    function LazyWrapper(value) {
                        this.__wrapped__ = value, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = MAX_ARRAY_LENGTH, this.__views__ = []
                    }

                    function lazyClone() {
                        var result = new LazyWrapper(this.__wrapped__);
                        return result.__actions__ = copyArray(this.__actions__), result.__dir__ = this.__dir__, result.__filtered__ = this.__filtered__, result.__iteratees__ = copyArray(this.__iteratees__), result.__takeCount__ = this.__takeCount__, result.__views__ = copyArray(this.__views__), result
                    }

                    function lazyReverse() {
                        if (this.__filtered__) {
                            var result = new LazyWrapper(this);
                            result.__dir__ = -1, result.__filtered__ = !0
                        } else result = this.clone(), result.__dir__ *= -1;
                        return result
                    }

                    function lazyValue() {
                        var array = this.__wrapped__.value(),
                            dir = this.__dir__,
                            isArr = isArray(array),
                            isRight = dir < 0,
                            arrLength = isArr ? array.length : 0,
                            view = getView(0, arrLength, this.__views__),
                            start = view.start,
                            end = view.end,
                            length = end - start,
                            index = isRight ? end : start - 1,
                            iteratees = this.__iteratees__,
                            iterLength = iteratees.length,
                            resIndex = 0,
                            takeCount = nativeMin(length, this.__takeCount__);
                        if (!isArr || arrLength < LARGE_ARRAY_SIZE || arrLength == length && takeCount == length) return baseWrapperValue(array, this.__actions__);
                        var result = [];
                        outer: for (; length-- && resIndex < takeCount;) {
                            index += dir;
                            for (var iterIndex = -1, value = array[index]; ++iterIndex < iterLength;) {
                                var data = iteratees[iterIndex],
                                    iteratee = data.iteratee,
                                    type = data.type,
                                    computed = iteratee(value);
                                if (type == LAZY_MAP_FLAG) value = computed;
                                else if (!computed) {
                                    if (type == LAZY_FILTER_FLAG) continue outer;
                                    break outer
                                }
                            }
                            result[resIndex++] = value
                        }
                        return result
                    }

                    function Hash(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;
                        for (this.clear(); ++index < length;) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1])
                        }
                    }

                    function hashClear() {
                        this.__data__ = nativeCreate ? nativeCreate(null) : {}
                    }

                    function hashDelete(key) {
                        return this.has(key) && delete this.__data__[key]
                    }

                    function hashGet(key) {
                        var data = this.__data__;
                        if (nativeCreate) {
                            var result = data[key];
                            return result === HASH_UNDEFINED ? undefined : result
                        }
                        return hasOwnProperty.call(data, key) ? data[key] : undefined
                    }

                    function hashHas(key) {
                        var data = this.__data__;
                        return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key)
                    }

                    function hashSet(key, value) {
                        return this.__data__[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value, this
                    }

                    function ListCache(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;
                        for (this.clear(); ++index < length;) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1])
                        }
                    }

                    function listCacheClear() {
                        this.__data__ = []
                    }

                    function listCacheDelete(key) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);
                        return !(index < 0) && (index == data.length - 1 ? data.pop() : splice.call(data, index, 1), !0)
                    }

                    function listCacheGet(key) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);
                        return index < 0 ? undefined : data[index][1]
                    }

                    function listCacheHas(key) {
                        return assocIndexOf(this.__data__, key) > -1
                    }

                    function listCacheSet(key, value) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);
                        return index < 0 ? data.push([key, value]) : data[index][1] = value, this
                    }

                    function MapCache(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;
                        for (this.clear(); ++index < length;) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1])
                        }
                    }

                    function mapCacheClear() {
                        this.__data__ = {
                            hash: new Hash,
                            map: new(Map || ListCache),
                            string: new Hash
                        }
                    }

                    function mapCacheDelete(key) {
                        return getMapData(this, key).delete(key)
                    }

                    function mapCacheGet(key) {
                        return getMapData(this, key).get(key)
                    }

                    function mapCacheHas(key) {
                        return getMapData(this, key).has(key)
                    }

                    function mapCacheSet(key, value) {
                        return getMapData(this, key).set(key, value), this
                    }

                    function SetCache(values) {
                        var index = -1,
                            length = values ? values.length : 0;
                        for (this.__data__ = new MapCache; ++index < length;) this.add(values[index])
                    }

                    function setCacheAdd(value) {
                        return this.__data__.set(value, HASH_UNDEFINED), this
                    }

                    function setCacheHas(value) {
                        return this.__data__.has(value)
                    }

                    function Stack(entries) {
                        this.__data__ = new ListCache(entries)
                    }

                    function stackClear() {
                        this.__data__ = new ListCache
                    }

                    function stackDelete(key) {
                        return this.__data__.delete(key)
                    }

                    function stackGet(key) {
                        return this.__data__.get(key)
                    }

                    function stackHas(key) {
                        return this.__data__.has(key)
                    }

                    function stackSet(key, value) {
                        var cache = this.__data__;
                        if (cache instanceof ListCache) {
                            var pairs = cache.__data__;
                            if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) return pairs.push([key, value]), this;
                            cache = this.__data__ = new MapCache(pairs)
                        }
                        return cache.set(key, value), this
                    }

                    function assignInDefaults(objValue, srcValue, key, object) {
                        return objValue === undefined || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key) ? srcValue : objValue
                    }

                    function assignMergeValue(object, key, value) {
                        (value === undefined || eq(object[key], value)) && ("number" != typeof key || value !== undefined || key in object) || (object[key] = value)
                    }

                    function assignValue(object, key, value) {
                        var objValue = object[key];
                        hasOwnProperty.call(object, key) && eq(objValue, value) && (value !== undefined || key in object) || (object[key] = value)
                    }

                    function assocIndexOf(array, key) {
                        for (var length = array.length; length--;)
                            if (eq(array[length][0], key)) return length;
                        return -1
                    }

                    function baseAggregator(collection, setter, iteratee, accumulator) {
                        return baseEach(collection, function(value, key, collection) {
                            setter(accumulator, value, iteratee(value), collection)
                        }), accumulator
                    }

                    function baseAssign(object, source) {
                        return object && copyObject(source, keys(source), object)
                    }

                    function baseAt(object, paths) {
                        for (var index = -1, isNil = null == object, length = paths.length, result = Array(length); ++index < length;) result[index] = isNil ? undefined : get(object, paths[index]);
                        return result
                    }

                    function baseClamp(number, lower, upper) {
                        return number === number && (upper !== undefined && (number = number <= upper ? number : upper), lower !== undefined && (number = number >= lower ? number : lower)), number
                    }

                    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
                        var result;
                        if (customizer && (result = object ? customizer(value, key, object, stack) : customizer(value)), result !== undefined) return result;
                        if (!isObject(value)) return value;
                        var isArr = isArray(value);
                        if (isArr) {
                            if (result = initCloneArray(value), !isDeep) return copyArray(value, result)
                        } else {
                            var tag = getTag(value),
                                isFunc = tag == funcTag || tag == genTag;
                            if (isBuffer(value)) return cloneBuffer(value, isDeep);
                            if (tag == objectTag || tag == argsTag || isFunc && !object) {
                                if (isHostObject(value)) return object ? value : {};
                                if (result = initCloneObject(isFunc ? {} : value), !isDeep) return copySymbols(value, baseAssign(result, value))
                            } else {
                                if (!cloneableTags[tag]) return object ? value : {};
                                result = initCloneByTag(value, tag, baseClone, isDeep)
                            }
                        }
                        stack || (stack = new Stack);
                        var stacked = stack.get(value);
                        if (stacked) return stacked;
                        if (stack.set(value, result), !isArr) var props = isFull ? getAllKeys(value) : keys(value);
                        return arrayEach(props || value, function(subValue, key) {
                            props && (key = subValue, subValue = value[key]), assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack))
                        }), isFull || stack.delete(value), result
                    }

                    function baseConforms(source) {
                        var props = keys(source);
                        return function(object) {
                            return baseConformsTo(object, source, props)
                        }
                    }

                    function baseConformsTo(object, source, props) {
                        var length = props.length;
                        if (null == object) return !length;
                        for (var index = length; index--;) {
                            var key = props[index],
                                predicate = source[key],
                                value = object[key];
                            if (value === undefined && !(key in Object(object)) || !predicate(value)) return !1
                        }
                        return !0
                    }

                    function baseCreate(proto) {
                        return isObject(proto) ? objectCreate(proto) : {}
                    }

                    function baseDelay(func, wait, args) {
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return setTimeout(function() {
                            func.apply(undefined, args)
                        }, wait)
                    }

                    function baseDifference(array, values, iteratee, comparator) {
                        var index = -1,
                            includes = arrayIncludes,
                            isCommon = !0,
                            length = array.length,
                            result = [],
                            valuesLength = values.length;
                        if (!length) return result;
                        iteratee && (values = arrayMap(values, baseUnary(iteratee))), comparator ? (includes = arrayIncludesWith, isCommon = !1) : values.length >= LARGE_ARRAY_SIZE && (includes = cacheHas, isCommon = !1, values = new SetCache(values));
                        outer: for (; ++index < length;) {
                            var value = array[index],
                                computed = iteratee ? iteratee(value) : value;
                            if (value = comparator || 0 !== value ? value : 0, isCommon && computed === computed) {
                                for (var valuesIndex = valuesLength; valuesIndex--;)
                                    if (values[valuesIndex] === computed) continue outer;
                                result.push(value)
                            } else includes(values, computed, comparator) || result.push(value)
                        }
                        return result
                    }

                    function baseEvery(collection, predicate) {
                        var result = !0;
                        return baseEach(collection, function(value, index, collection) {
                            return result = !!predicate(value, index, collection)
                        }), result
                    }

                    function baseExtremum(array, iteratee, comparator) {
                        for (var index = -1, length = array.length; ++index < length;) {
                            var value = array[index],
                                current = iteratee(value);
                            if (null != current && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current,
                                result = value
                        }
                        return result
                    }

                    function baseFill(array, value, start, end) {
                        var length = array.length;
                        for (start = toInteger(start), start < 0 && (start = -start > length ? 0 : length + start), end = end === undefined || end > length ? length : toInteger(end), end < 0 && (end += length), end = start > end ? 0 : toLength(end); start < end;) array[start++] = value;
                        return array
                    }

                    function baseFilter(collection, predicate) {
                        var result = [];
                        return baseEach(collection, function(value, index, collection) {
                            predicate(value, index, collection) && result.push(value)
                        }), result
                    }

                    function baseFlatten(array, depth, predicate, isStrict, result) {
                        var index = -1,
                            length = array.length;
                        for (predicate || (predicate = isFlattenable), result || (result = []); ++index < length;) {
                            var value = array[index];
                            depth > 0 && predicate(value) ? depth > 1 ? baseFlatten(value, depth - 1, predicate, isStrict, result) : arrayPush(result, value) : isStrict || (result[result.length] = value)
                        }
                        return result
                    }

                    function baseForOwn(object, iteratee) {
                        return object && baseFor(object, iteratee, keys)
                    }

                    function baseForOwnRight(object, iteratee) {
                        return object && baseForRight(object, iteratee, keys)
                    }

                    function baseFunctions(object, props) {
                        return arrayFilter(props, function(key) {
                            return isFunction(object[key])
                        })
                    }

                    function baseGet(object, path) {
                        path = isKey(path, object) ? [path] : castPath(path);
                        for (var index = 0, length = path.length; null != object && index < length;) object = object[toKey(path[index++])];
                        return index && index == length ? object : undefined
                    }

                    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
                        var result = keysFunc(object);
                        return isArray(object) ? result : arrayPush(result, symbolsFunc(object))
                    }

                    function baseGetTag(value) {
                        return objectToString.call(value)
                    }

                    function baseGt(value, other) {
                        return value > other
                    }

                    function baseHas(object, key) {
                        return null != object && (hasOwnProperty.call(object, key) || "object" == typeof object && key in object && null === getPrototype(object))
                    }

                    function baseHasIn(object, key) {
                        return null != object && key in Object(object)
                    }

                    function baseInRange(number, start, end) {
                        return number >= nativeMin(start, end) && number < nativeMax(start, end)
                    }

                    function baseIntersection(arrays, iteratee, comparator) {
                        for (var includes = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = 1 / 0, result = []; othIndex--;) {
                            var array = arrays[othIndex];
                            othIndex && iteratee && (array = arrayMap(array, baseUnary(iteratee))), maxLength = nativeMin(array.length, maxLength), caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined
                        }
                        array = arrays[0];
                        var index = -1,
                            seen = caches[0];
                        outer: for (; ++index < length && result.length < maxLength;) {
                            var value = array[index],
                                computed = iteratee ? iteratee(value) : value;
                            if (value = comparator || 0 !== value ? value : 0, !(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
                                for (othIndex = othLength; --othIndex;) {
                                    var cache = caches[othIndex];
                                    if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) continue outer
                                }
                                seen && seen.push(computed), result.push(value)
                            }
                        }
                        return result
                    }

                    function baseInverter(object, setter, iteratee, accumulator) {
                        return baseForOwn(object, function(value, key, object) {
                            setter(accumulator, iteratee(value), key, object)
                        }), accumulator
                    }

                    function baseInvoke(object, path, args) {
                        isKey(path, object) || (path = castPath(path), object = parent(object, path), path = last(path));
                        var func = null == object ? object : object[toKey(path)];
                        return null == func ? undefined : apply(func, object, args)
                    }

                    function baseIsArrayBuffer(value) {
                        return isObjectLike(value) && objectToString.call(value) == arrayBufferTag
                    }

                    function baseIsDate(value) {
                        return isObjectLike(value) && objectToString.call(value) == dateTag
                    }

                    function baseIsEqual(value, other, customizer, bitmask, stack) {
                        return value === other || (null == value || null == other || !isObject(value) && !isObjectLike(other) ? value !== value && other !== other : baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack))
                    }

                    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
                        var objIsArr = isArray(object),
                            othIsArr = isArray(other),
                            objTag = arrayTag,
                            othTag = arrayTag;
                        objIsArr || (objTag = getTag(object), objTag = objTag == argsTag ? objectTag : objTag), othIsArr || (othTag = getTag(other), othTag = othTag == argsTag ? objectTag : othTag);
                        var objIsObj = objTag == objectTag && !isHostObject(object),
                            othIsObj = othTag == objectTag && !isHostObject(other),
                            isSameTag = objTag == othTag;
                        if (isSameTag && !objIsObj) return stack || (stack = new Stack), objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
                        if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
                            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"),
                                othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
                            if (objIsWrapped || othIsWrapped) {
                                var objUnwrapped = objIsWrapped ? object.value() : object,
                                    othUnwrapped = othIsWrapped ? other.value() : other;
                                return stack || (stack = new Stack), equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack)
                            }
                        }
                        return !!isSameTag && (stack || (stack = new Stack), equalObjects(object, other, equalFunc, customizer, bitmask, stack))
                    }

                    function baseIsMap(value) {
                        return isObjectLike(value) && getTag(value) == mapTag
                    }

                    function baseIsMatch(object, source, matchData, customizer) {
                        var index = matchData.length,
                            length = index,
                            noCustomizer = !customizer;
                        if (null == object) return !length;
                        for (object = Object(object); index--;) {
                            var data = matchData[index];
                            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return !1
                        }
                        for (; ++index < length;) {
                            data = matchData[index];
                            var key = data[0],
                                objValue = object[key],
                                srcValue = data[1];
                            if (noCustomizer && data[2]) {
                                if (objValue === undefined && !(key in object)) return !1
                            } else {
                                var stack = new Stack;
                                if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
                                if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) return !1
                            }
                        }
                        return !0
                    }

                    function baseIsNative(value) {
                        return !(!isObject(value) || isMasked(value)) && (isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor).test(toSource(value))
                    }

                    function baseIsRegExp(value) {
                        return isObject(value) && objectToString.call(value) == regexpTag
                    }

                    function baseIsSet(value) {
                        return isObjectLike(value) && getTag(value) == setTag
                    }

                    function baseIsTypedArray(value) {
                        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)]
                    }

                    function baseIteratee(value) {
                        return "function" == typeof value ? value : null == value ? identity : "object" == typeof value ? isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value) : property(value)
                    }

                    function baseKeysIn(object) {
                        object = null == object ? object : Object(object);
                        var result = [];
                        for (var key in object) result.push(key);
                        return result
                    }

                    function baseLt(value, other) {
                        return value < other
                    }

                    function baseMap(collection, iteratee) {
                        var index = -1,
                            result = isArrayLike(collection) ? Array(collection.length) : [];
                        return baseEach(collection, function(value, key, collection) {
                            result[++index] = iteratee(value, key, collection)
                        }), result
                    }

                    function baseMatches(source) {
                        var matchData = getMatchData(source);
                        return 1 == matchData.length && matchData[0][2] ? matchesStrictComparable(matchData[0][0], matchData[0][1]) : function(object) {
                            return object === source || baseIsMatch(object, source, matchData)
                        }
                    }

                    function baseMatchesProperty(path, srcValue) {
                        return isKey(path) && isStrictComparable(srcValue) ? matchesStrictComparable(toKey(path), srcValue) : function(object) {
                            var objValue = get(object, path);
                            return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG)
                        }
                    }

                    function baseMerge(object, source, srcIndex, customizer, stack) {
                        if (object !== source) {
                            if (!isArray(source) && !isTypedArray(source)) var props = keysIn(source);
                            arrayEach(props || source, function(srcValue, key) {
                                if (props && (key = srcValue, srcValue = source[key]), isObject(srcValue)) stack || (stack = new Stack), baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
                                else {
                                    var newValue = customizer ? customizer(object[key], srcValue, key + "", object, source, stack) : undefined;
                                    newValue === undefined && (newValue = srcValue), assignMergeValue(object, key, newValue)
                                }
                            })
                        }
                    }

                    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
                        var objValue = object[key],
                            srcValue = source[key],
                            stacked = stack.get(srcValue);
                        if (stacked) return void assignMergeValue(object, key, stacked);
                        var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined,
                            isCommon = newValue === undefined;
                        isCommon && (newValue = srcValue, isArray(srcValue) || isTypedArray(srcValue) ? isArray(objValue) ? newValue = objValue : isArrayLikeObject(objValue) ? newValue = copyArray(objValue) : (isCommon = !1, newValue = baseClone(srcValue, !0)) : isPlainObject(srcValue) || isArguments(srcValue) ? isArguments(objValue) ? newValue = toPlainObject(objValue) : !isObject(objValue) || srcIndex && isFunction(objValue) ? (isCommon = !1, newValue = baseClone(srcValue, !0)) : newValue = objValue : isCommon = !1), isCommon && (stack.set(srcValue, newValue), mergeFunc(newValue, srcValue, srcIndex, customizer, stack), stack.delete(srcValue)), assignMergeValue(object, key, newValue)
                    }

                    function baseNth(array, n) {
                        var length = array.length;
                        if (length) return n += n < 0 ? length : 0, isIndex(n, length) ? array[n] : undefined
                    }

                    function baseOrderBy(collection, iteratees, orders) {
                        var index = -1;
                        return iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee())), baseSortBy(baseMap(collection, function(value, key, collection) {
                            return {
                                criteria: arrayMap(iteratees, function(iteratee) {
                                    return iteratee(value)
                                }),
                                index: ++index,
                                value: value
                            }
                        }), function(object, other) {
                            return compareMultiple(object, other, orders)
                        })
                    }

                    function basePick(object, props) {
                        return object = Object(object), basePickBy(object, props, function(value, key) {
                            return key in object
                        })
                    }

                    function basePickBy(object, props, predicate) {
                        for (var index = -1, length = props.length, result = {}; ++index < length;) {
                            var key = props[index],
                                value = object[key];
                            predicate(value, key) && (result[key] = value)
                        }
                        return result
                    }

                    function basePropertyDeep(path) {
                        return function(object) {
                            return baseGet(object, path)
                        }
                    }

                    function basePullAll(array, values, iteratee, comparator) {
                        var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
                            index = -1,
                            length = values.length,
                            seen = array;
                        for (array === values && (values = copyArray(values)), iteratee && (seen = arrayMap(array, baseUnary(iteratee))); ++index < length;)
                            for (var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
                                (fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1;) seen !== array && splice.call(seen, fromIndex, 1), splice.call(array, fromIndex, 1);
                        return array
                    }

                    function basePullAt(array, indexes) {
                        for (var length = array ? indexes.length : 0, lastIndex = length - 1; length--;) {
                            var index = indexes[length];
                            if (length == lastIndex || index !== previous) {
                                var previous = index;
                                if (isIndex(index)) splice.call(array, index, 1);
                                else if (isKey(index, array)) delete array[toKey(index)];
                                else {
                                    var path = castPath(index),
                                        object = parent(array, path);
                                    null != object && delete object[toKey(last(path))]
                                }
                            }
                        }
                        return array
                    }

                    function baseRandom(lower, upper) {
                        return lower + nativeFloor(nativeRandom() * (upper - lower + 1))
                    }

                    function baseRange(start, end, step, fromRight) {
                        for (var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length); length--;) result[fromRight ? length : ++index] = start, start += step;
                        return result
                    }

                    function baseRepeat(string, n) {
                        var result = "";
                        if (!string || n < 1 || n > MAX_SAFE_INTEGER) return result;
                        do {
                            n % 2 && (result += string), (n = nativeFloor(n / 2)) && (string += string)
                        } while (n);
                        return result
                    }

                    function baseRest(func, start) {
                        return start = nativeMax(start === undefined ? func.length - 1 : start, 0),
                            function() {
                                for (var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length); ++index < length;) array[index] = args[start + index];
                                index = -1;
                                for (var otherArgs = Array(start + 1); ++index < start;) otherArgs[index] = args[index];
                                return otherArgs[start] = array, apply(func, this, otherArgs)
                            }
                    }

                    function baseSet(object, path, value, customizer) {
                        path = isKey(path, object) ? [path] : castPath(path);
                        for (var index = -1, length = path.length, lastIndex = length - 1, nested = object; null != nested && ++index < length;) {
                            var key = toKey(path[index]);
                            if (isObject(nested)) {
                                var newValue = value;
                                if (index != lastIndex) {
                                    var objValue = nested[key];
                                    newValue = customizer ? customizer(objValue, key, nested) : undefined, newValue === undefined && (newValue = null == objValue ? isIndex(path[index + 1]) ? [] : {} : objValue)
                                }
                                assignValue(nested, key, newValue)
                            }
                            nested = nested[key]
                        }
                        return object
                    }

                    function baseSlice(array, start, end) {
                        var index = -1,
                            length = array.length;
                        start < 0 && (start = -start > length ? 0 : length + start), end = end > length ? length : end, end < 0 && (end += length), length = start > end ? 0 : end - start >>> 0, start >>>= 0;
                        for (var result = Array(length); ++index < length;) result[index] = array[index + start];
                        return result
                    }

                    function baseSome(collection, predicate) {
                        var result;
                        return baseEach(collection, function(value, index, collection) {
                            return !(result = predicate(value, index, collection))
                        }), !!result
                    }

                    function baseSortedIndex(array, value, retHighest) {
                        var low = 0,
                            high = array ? array.length : low;
                        if ("number" == typeof value && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
                            for (; low < high;) {
                                var mid = low + high >>> 1,
                                    computed = array[mid];
                                null !== computed && !isSymbol(computed) && (retHighest ? computed <= value : computed < value) ? low = mid + 1 : high = mid
                            }
                            return high
                        }
                        return baseSortedIndexBy(array, value, identity, retHighest)
                    }

                    function baseSortedIndexBy(array, value, iteratee, retHighest) {
                        value = iteratee(value);
                        for (var low = 0, high = array ? array.length : 0, valIsNaN = value !== value, valIsNull = null === value, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined; low < high;) {
                            var mid = nativeFloor((low + high) / 2),
                                computed = iteratee(array[mid]),
                                othIsDefined = computed !== undefined,
                                othIsNull = null === computed,
                                othIsReflexive = computed === computed,
                                othIsSymbol = isSymbol(computed);
                            if (valIsNaN) var setLow = retHighest || othIsReflexive;
                            else setLow = valIsUndefined ? othIsReflexive && (retHighest || othIsDefined) : valIsNull ? othIsReflexive && othIsDefined && (retHighest || !othIsNull) : valIsSymbol ? othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol) : !othIsNull && !othIsSymbol && (retHighest ? computed <= value : computed < value);
                            setLow ? low = mid + 1 : high = mid
                        }
                        return nativeMin(high, MAX_ARRAY_INDEX)
                    }

                    function baseSortedUniq(array, iteratee) {
                        for (var index = -1, length = array.length, resIndex = 0, result = []; ++index < length;) {
                            var value = array[index],
                                computed = iteratee ? iteratee(value) : value;
                            if (!index || !eq(computed, seen)) {
                                var seen = computed;
                                result[resIndex++] = 0 === value ? 0 : value
                            }
                        }
                        return result
                    }

                    function baseToNumber(value) {
                        return "number" == typeof value ? value : isSymbol(value) ? NAN : +value
                    }

                    function baseToString(value) {
                        if ("string" == typeof value) return value;
                        if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
                        var result = value + "";
                        return "0" == result && 1 / value == -INFINITY ? "-0" : result
                    }

                    function baseUniq(array, iteratee, comparator) {
                        var index = -1,
                            includes = arrayIncludes,
                            length = array.length,
                            isCommon = !0,
                            result = [],
                            seen = result;
                        if (comparator) isCommon = !1, includes = arrayIncludesWith;
                        else if (length >= LARGE_ARRAY_SIZE) {
                            var set = iteratee ? null : createSet(array);
                            if (set) return setToArray(set);
                            isCommon = !1, includes = cacheHas, seen = new SetCache
                        } else seen = iteratee ? [] : result;
                        outer: for (; ++index < length;) {
                            var value = array[index],
                                computed = iteratee ? iteratee(value) : value;
                            if (value = comparator || 0 !== value ? value : 0, isCommon && computed === computed) {
                                for (var seenIndex = seen.length; seenIndex--;)
                                    if (seen[seenIndex] === computed) continue outer;
                                iteratee && seen.push(computed), result.push(value)
                            } else includes(seen, computed, comparator) || (seen !== result && seen.push(computed), result.push(value))
                        }
                        return result
                    }

                    function baseUnset(object, path) {
                        path = isKey(path, object) ? [path] : castPath(path), object = parent(object, path);
                        var key = toKey(last(path));
                        return !(null != object && baseHas(object, key)) || delete object[key]
                    }

                    function baseUpdate(object, path, updater, customizer) {
                        return baseSet(object, path, updater(baseGet(object, path)), customizer)
                    }

                    function baseWhile(array, predicate, isDrop, fromRight) {
                        for (var length = array.length, index = fromRight ? length : -1;
                            (fromRight ? index-- : ++index < length) && predicate(array[index], index, array););
                        return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index)
                    }

                    function baseWrapperValue(value, actions) {
                        var result = value;
                        return result instanceof LazyWrapper && (result = result.value()), arrayReduce(actions, function(result, action) {
                            return action.func.apply(action.thisArg, arrayPush([result], action.args))
                        }, result)
                    }

                    function baseXor(arrays, iteratee, comparator) {
                        for (var index = -1, length = arrays.length; ++index < length;) var result = result ? arrayPush(baseDifference(result, arrays[index], iteratee, comparator), baseDifference(arrays[index], result, iteratee, comparator)) : arrays[index];
                        return result && result.length ? baseUniq(result, iteratee, comparator) : []
                    }

                    function baseZipObject(props, values, assignFunc) {
                        for (var index = -1, length = props.length, valsLength = values.length, result = {}; ++index < length;) {
                            var value = index < valsLength ? values[index] : undefined;
                            assignFunc(result, props[index], value)
                        }
                        return result
                    }

                    function castArrayLikeObject(value) {
                        return isArrayLikeObject(value) ? value : []
                    }

                    function castFunction(value) {
                        return "function" == typeof value ? value : identity
                    }

                    function castPath(value) {
                        return isArray(value) ? value : stringToPath(value)
                    }

                    function castSlice(array, start, end) {
                        var length = array.length;
                        return end = end === undefined ? length : end, !start && end >= length ? array : baseSlice(array, start, end)
                    }

                    function cloneBuffer(buffer, isDeep) {
                        if (isDeep) return buffer.slice();
                        var result = new buffer.constructor(buffer.length);
                        return buffer.copy(result), result
                    }

                    function cloneArrayBuffer(arrayBuffer) {
                        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
                        return new Uint8Array(result).set(new Uint8Array(arrayBuffer)), result
                    }

                    function cloneDataView(dataView, isDeep) {
                        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
                        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength)
                    }

                    function cloneMap(map, isDeep, cloneFunc) {
                        return arrayReduce(isDeep ? cloneFunc(mapToArray(map), !0) : mapToArray(map), addMapEntry, new map.constructor)
                    }

                    function cloneRegExp(regexp) {
                        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
                        return result.lastIndex = regexp.lastIndex, result
                    }

                    function cloneSet(set, isDeep, cloneFunc) {
                        return arrayReduce(isDeep ? cloneFunc(setToArray(set), !0) : setToArray(set), addSetEntry, new set.constructor)
                    }

                    function cloneSymbol(symbol) {
                        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {}
                    }

                    function cloneTypedArray(typedArray, isDeep) {
                        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length)
                    }

                    function compareAscending(value, other) {
                        if (value !== other) {
                            var valIsDefined = value !== undefined,
                                valIsNull = null === value,
                                valIsReflexive = value === value,
                                valIsSymbol = isSymbol(value),
                                othIsDefined = other !== undefined,
                                othIsNull = null === other,
                                othIsReflexive = other === other,
                                othIsSymbol = isSymbol(other);
                            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) return 1;
                            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) return -1
                        }
                        return 0
                    }

                    function compareMultiple(object, other, orders) {
                        for (var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length; ++index < length;) {
                            var result = compareAscending(objCriteria[index], othCriteria[index]);
                            if (result) {
                                if (index >= ordersLength) return result;
                                return result * ("desc" == orders[index] ? -1 : 1)
                            }
                        }
                        return object.index - other.index
                    }

                    function composeArgs(args, partials, holders, isCurried) {
                        for (var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried; ++leftIndex < leftLength;) result[leftIndex] = partials[leftIndex];
                        for (; ++argsIndex < holdersLength;)(isUncurried || argsIndex < argsLength) && (result[holders[argsIndex]] = args[argsIndex]);
                        for (; rangeLength--;) result[leftIndex++] = args[argsIndex++];
                        return result
                    }

                    function composeArgsRight(args, partials, holders, isCurried) {
                        for (var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried; ++argsIndex < rangeLength;) result[argsIndex] = args[argsIndex];
                        for (var offset = argsIndex; ++rightIndex < rightLength;) result[offset + rightIndex] = partials[rightIndex];
                        for (; ++holdersIndex < holdersLength;)(isUncurried || argsIndex < argsLength) && (result[offset + holders[holdersIndex]] = args[argsIndex++]);
                        return result
                    }

                    function copyArray(source, array) {
                        var index = -1,
                            length = source.length;
                        for (array || (array = Array(length)); ++index < length;) array[index] = source[index];
                        return array
                    }

                    function copyObject(source, props, object, customizer) {
                        object || (object = {});
                        for (var index = -1, length = props.length; ++index < length;) {
                            var key = props[index],
                                newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
                            assignValue(object, key, newValue === undefined ? source[key] : newValue)
                        }
                        return object
                    }

                    function copySymbols(source, object) {
                        return copyObject(source, getSymbols(source), object)
                    }

                    function createAggregator(setter, initializer) {
                        return function(collection, iteratee) {
                            var func = isArray(collection) ? arrayAggregator : baseAggregator,
                                accumulator = initializer ? initializer() : {};
                            return func(collection, setter, getIteratee(iteratee, 2), accumulator)
                        }
                    }

                    function createAssigner(assigner) {
                        return baseRest(function(object, sources) {
                            var index = -1,
                                length = sources.length,
                                customizer = length > 1 ? sources[length - 1] : undefined,
                                guard = length > 2 ? sources[2] : undefined;
                            for (customizer = assigner.length > 3 && "function" == typeof customizer ? (length--, customizer) : undefined, guard && isIterateeCall(sources[0], sources[1], guard) && (customizer = length < 3 ? undefined : customizer, length = 1), object = Object(object); ++index < length;) {
                                var source = sources[index];
                                source && assigner(object, source, index, customizer)
                            }
                            return object
                        })
                    }

                    function createBaseEach(eachFunc, fromRight) {
                        return function(collection, iteratee) {
                            if (null == collection) return collection;
                            if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
                            for (var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
                                (fromRight ? index-- : ++index < length) && !1 !== iteratee(iterable[index], index, iterable););
                            return collection
                        }
                    }

                    function createBaseFor(fromRight) {
                        return function(object, iteratee, keysFunc) {
                            for (var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--;) {
                                var key = props[fromRight ? length : ++index];
                                if (!1 === iteratee(iterable[key], key, iterable)) break
                            }
                            return object
                        }
                    }

                    function createBind(func, bitmask, thisArg) {
                        function wrapper() {
                            return (this && this !== root && this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, arguments)
                        }
                        var isBind = bitmask & BIND_FLAG,
                            Ctor = createCtor(func);
                        return wrapper
                    }

                    function createCaseFirst(methodName) {
                        return function(string) {
                            string = toString(string);
                            var strSymbols = reHasComplexSymbol.test(string) ? stringToArray(string) : undefined,
                                chr = strSymbols ? strSymbols[0] : string.charAt(0),
                                trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
                            return chr[methodName]() + trailing
                        }
                    }

                    function createCompounder(callback) {
                        return function(string) {
                            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "")
                        }
                    }

                    function createCtor(Ctor) {
                        return function() {
                            var args = arguments;
                            switch (args.length) {
                                case 0:
                                    return new Ctor;
                                case 1:
                                    return new Ctor(args[0]);
                                case 2:
                                    return new Ctor(args[0], args[1]);
                                case 3:
                                    return new Ctor(args[0], args[1], args[2]);
                                case 4:
                                    return new Ctor(args[0], args[1], args[2], args[3]);
                                case 5:
                                    return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                                case 6:
                                    return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                                case 7:
                                    return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6])
                            }
                            var thisBinding = baseCreate(Ctor.prototype),
                                result = Ctor.apply(thisBinding, args);
                            return isObject(result) ? result : thisBinding
                        }
                    }

                    function createCurry(func, bitmask, arity) {
                        function wrapper() {
                            for (var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper); index--;) args[index] = arguments[index];
                            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
                            return (length -= holders.length) < arity ? createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined, args, holders, undefined, undefined, arity - length) : apply(this && this !== root && this instanceof wrapper ? Ctor : func, this, args)
                        }
                        var Ctor = createCtor(func);
                        return wrapper
                    }

                    function createFind(findIndexFunc) {
                        return function(collection, predicate, fromIndex) {
                            var iterable = Object(collection);
                            if (!isArrayLike(collection)) {
                                var iteratee = getIteratee(predicate, 3);
                                collection = keys(collection), predicate = function(key) {
                                    return iteratee(iterable[key], key, iterable)
                                }
                            }
                            var index = findIndexFunc(collection, predicate, fromIndex);
                            return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined
                        }
                    }

                    function createFlow(fromRight) {
                        return baseRest(function(funcs) {
                            funcs = baseFlatten(funcs, 1);
                            var length = funcs.length,
                                index = length,
                                prereq = LodashWrapper.prototype.thru;
                            for (fromRight && funcs.reverse(); index--;) {
                                var func = funcs[index];
                                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                                if (prereq && !wrapper && "wrapper" == getFuncName(func)) var wrapper = new LodashWrapper([], !0)
                            }
                            for (index = wrapper ? index : length; ++index < length;) {
                                func = funcs[index];
                                var funcName = getFuncName(func),
                                    data = "wrapper" == funcName ? getData(func) : undefined;
                                wrapper = data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && 1 == data[9] ? wrapper[getFuncName(data[0])].apply(wrapper, data[3]) : 1 == func.length && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func)
                            }
                            return function() {
                                var args = arguments,
                                    value = args[0];
                                if (wrapper && 1 == args.length && isArray(value) && value.length >= LARGE_ARRAY_SIZE) return wrapper.plant(value).value();
                                for (var index = 0, result = length ? funcs[index].apply(this, args) : value; ++index < length;) result = funcs[index].call(this, result);
                                return result
                            }
                        })
                    }

                    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
                        function wrapper() {
                            for (var length = arguments.length, args = Array(length), index = length; index--;) args[index] = arguments[index];
                            if (isCurried) var placeholder = getHolder(wrapper),
                                holdersCount = countHolders(args, placeholder);
                            if (partials && (args = composeArgs(args, partials, holders, isCurried)), partialsRight && (args = composeArgsRight(args, partialsRight, holdersRight, isCurried)), length -= holdersCount, isCurried && length < arity) {
                                var newHolders = replaceHolders(args, placeholder);
                                return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length)
                            }
                            var thisBinding = isBind ? thisArg : this,
                                fn = isBindKey ? thisBinding[func] : func;
                            return length = args.length, argPos ? args = reorder(args, argPos) : isFlip && length > 1 && args.reverse(), isAry && ary < length && (args.length = ary), this && this !== root && this instanceof wrapper && (fn = Ctor || createCtor(fn)), fn.apply(thisBinding, args)
                        }
                        var isAry = bitmask & ARY_FLAG,
                            isBind = bitmask & BIND_FLAG,
                            isBindKey = bitmask & BIND_KEY_FLAG,
                            isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
                            isFlip = bitmask & FLIP_FLAG,
                            Ctor = isBindKey ? undefined : createCtor(func);
                        return wrapper
                    }

                    function createInverter(setter, toIteratee) {
                        return function(object, iteratee) {
                            return baseInverter(object, setter, toIteratee(iteratee), {})
                        }
                    }

                    function createMathOperation(operator, defaultValue) {
                        return function(value, other) {
                            var result;
                            if (value === undefined && other === undefined) return defaultValue;
                            if (value !== undefined && (result = value), other !== undefined) {
                                if (result === undefined) return other;
                                "string" == typeof value || "string" == typeof other ? (value = baseToString(value), other = baseToString(other)) : (value = baseToNumber(value), other = baseToNumber(other)), result = operator(value, other)
                            }
                            return result
                        }
                    }

                    function createOver(arrayFunc) {
                        return baseRest(function(iteratees) {
                            return iteratees = 1 == iteratees.length && isArray(iteratees[0]) ? arrayMap(iteratees[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(iteratees, 1), baseUnary(getIteratee())), baseRest(function(args) {
                                var thisArg = this;
                                return arrayFunc(iteratees, function(iteratee) {
                                    return apply(iteratee, thisArg, args)
                                })
                            })
                        })
                    }

                    function createPadding(length, chars) {
                        chars = chars === undefined ? " " : baseToString(chars);
                        var charsLength = chars.length;
                        if (charsLength < 2) return charsLength ? baseRepeat(chars, length) : chars;
                        var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
                        return reHasComplexSymbol.test(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length)
                    }

                    function createPartial(func, bitmask, thisArg, partials) {
                        function wrapper() {
                            for (var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func; ++leftIndex < leftLength;) args[leftIndex] = partials[leftIndex];
                            for (; argsLength--;) args[leftIndex++] = arguments[++argsIndex];
                            return apply(fn, isBind ? thisArg : this, args)
                        }
                        var isBind = bitmask & BIND_FLAG,
                            Ctor = createCtor(func);
                        return wrapper
                    }

                    function createRange(fromRight) {
                        return function(start, end, step) {
                            return step && "number" != typeof step && isIterateeCall(start, end, step) && (end = step = undefined), start = toNumber(start), start = start === start ? start : 0, end === undefined ? (end = start, start = 0) : end = toNumber(end) || 0, step = step === undefined ? start < end ? 1 : -1 : toNumber(step) || 0, baseRange(start, end, step, fromRight)
                        }
                    }

                    function createRelationalOperation(operator) {
                        return function(value, other) {
                            return "string" == typeof value && "string" == typeof other || (value = toNumber(value), other = toNumber(other)), operator(value, other)
                        }
                    }

                    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
                        var isCurry = bitmask & CURRY_FLAG,
                            newHolders = isCurry ? holders : undefined,
                            newHoldersRight = isCurry ? undefined : holders,
                            newPartials = isCurry ? partials : undefined,
                            newPartialsRight = isCurry ? undefined : partials;
                        bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG, (bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG)) & CURRY_BOUND_FLAG || (bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG));
                        var newData = [func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity],
                            result = wrapFunc.apply(undefined, newData);
                        return isLaziable(func) && setData(result, newData), result.placeholder = placeholder, setWrapToString(result, func, bitmask)
                    }

                    function createRound(methodName) {
                        var func = Math[methodName];
                        return function(number, precision) {
                            if (number = toNumber(number), precision = nativeMin(toInteger(precision), 292)) {
                                var pair = (toString(number) + "e").split("e");
                                return pair = (toString(func(pair[0] + "e" + (+pair[1] + precision))) + "e").split("e"), +(pair[0] + "e" + (+pair[1] - precision))
                            }
                            return func(number)
                        }
                    }

                    function createToPairs(keysFunc) {
                        return function(object) {
                            var tag = getTag(object);
                            return tag == mapTag ? mapToArray(object) : tag == setTag ? setToPairs(object) : baseToPairs(object, keysFunc(object))
                        }
                    }

                    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
                        var isBindKey = bitmask & BIND_KEY_FLAG;
                        if (!isBindKey && "function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        var length = partials ? partials.length : 0;
                        if (length || (bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG), partials = holders = undefined), ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0), arity = arity === undefined ? arity : toInteger(arity), length -= holders ? holders.length : 0, bitmask & PARTIAL_RIGHT_FLAG) {
                            var partialsRight = partials,
                                holdersRight = holders;
                            partials = holders = undefined
                        }
                        var data = isBindKey ? undefined : getData(func),
                            newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
                        if (data && mergeData(newData, data), func = newData[0], bitmask = newData[1], thisArg = newData[2], partials = newData[3], holders = newData[4], arity = newData[9] = null == newData[9] ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0), !arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG) && (bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG)), bitmask && bitmask != BIND_FLAG) result = bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG ? createCurry(func, bitmask, arity) : bitmask != PARTIAL_FLAG && bitmask != (BIND_FLAG | PARTIAL_FLAG) || holders.length ? createHybrid.apply(undefined, newData) : createPartial(func, bitmask, thisArg, partials);
                        else var result = createBind(func, bitmask, thisArg);
                        return setWrapToString((data ? baseSetData : setData)(result, newData), func, bitmask)
                    }

                    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
                        var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
                            arrLength = array.length,
                            othLength = other.length;
                        if (arrLength != othLength && !(isPartial && othLength > arrLength)) return !1;
                        var stacked = stack.get(array);
                        if (stacked && stack.get(other)) return stacked == other;
                        var index = -1,
                            result = !0,
                            seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache : undefined;
                        for (stack.set(array, other), stack.set(other, array); ++index < arrLength;) {
                            var arrValue = array[index],
                                othValue = other[index];
                            if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
                            if (compared !== undefined) {
                                if (compared) continue;
                                result = !1;
                                break
                            }
                            if (seen) {
                                if (!arraySome(other, function(othValue, othIndex) {
                                        if (!seen.has(othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) return seen.add(othIndex)
                                    })) {
                                    result = !1;
                                    break
                                }
                            } else if (arrValue !== othValue && !equalFunc(arrValue, othValue, customizer, bitmask, stack)) {
                                result = !1;
                                break
                            }
                        }
                        return stack.delete(array), result
                    }

                    function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
                        switch (tag) {
                            case dataViewTag:
                                if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return !1;
                                object = object.buffer, other = other.buffer;
                            case arrayBufferTag:
                                return !(object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other)));
                            case boolTag:
                            case dateTag:
                            case numberTag:
                                return eq(+object, +other);
                            case errorTag:
                                return object.name == other.name && object.message == other.message;
                            case regexpTag:
                            case stringTag:
                                return object == other + "";
                            case mapTag:
                                var convert = mapToArray;
                            case setTag:
                                var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
                                if (convert || (convert = setToArray), object.size != other.size && !isPartial) return !1;
                                var stacked = stack.get(object);
                                if (stacked) return stacked == other;
                                bitmask |= UNORDERED_COMPARE_FLAG, stack.set(object, other);
                                var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
                                return stack.delete(object), result;
                            case symbolTag:
                                if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other)
                        }
                        return !1
                    }

                    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
                        var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
                            objProps = keys(object),
                            objLength = objProps.length;
                        if (objLength != keys(other).length && !isPartial) return !1;
                        for (var index = objLength; index--;) {
                            var key = objProps[index];
                            if (!(isPartial ? key in other : baseHas(other, key))) return !1
                        }
                        var stacked = stack.get(object);
                        if (stacked && stack.get(other)) return stacked == other;
                        var result = !0;
                        stack.set(object, other), stack.set(other, object);
                        for (var skipCtor = isPartial; ++index < objLength;) {
                            key = objProps[index];
                            var objValue = object[key],
                                othValue = other[key];
                            if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
                            if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
                                result = !1;
                                break
                            }
                            skipCtor || (skipCtor = "constructor" == key)
                        }
                        if (result && !skipCtor) {
                            var objCtor = object.constructor,
                                othCtor = other.constructor;
                            objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor) && (result = !1)
                        }
                        return stack.delete(object), result
                    }

                    function getAllKeys(object) {
                        return baseGetAllKeys(object, keys, getSymbols)
                    }

                    function getAllKeysIn(object) {
                        return baseGetAllKeys(object, keysIn, getSymbolsIn)
                    }

                    function getFuncName(func) {
                        for (var result = func.name + "", array = realNames[result], length = hasOwnProperty.call(realNames, result) ? array.length : 0; length--;) {
                            var data = array[length],
                                otherFunc = data.func;
                            if (null == otherFunc || otherFunc == func) return data.name
                        }
                        return result
                    }

                    function getHolder(func) {
                        return (hasOwnProperty.call(lodash, "placeholder") ? lodash : func).placeholder
                    }

                    function getIteratee() {
                        var result = lodash.iteratee || iteratee;
                        return result = result === iteratee ? baseIteratee : result, arguments.length ? result(arguments[0], arguments[1]) : result
                    }

                    function getMapData(map, key) {
                        var data = map.__data__;
                        return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map
                    }

                    function getMatchData(object) {
                        for (var result = keys(object), length = result.length; length--;) {
                            var key = result[length],
                                value = object[key];
                            result[length] = [key, value, isStrictComparable(value)]
                        }
                        return result
                    }

                    function getNative(object, key) {
                        var value = getValue(object, key);
                        return baseIsNative(value) ? value : undefined
                    }

                    function getView(start, end, transforms) {
                        for (var index = -1, length = transforms.length; ++index < length;) {
                            var data = transforms[index],
                                size = data.size;
                            switch (data.type) {
                                case "drop":
                                    start += size;
                                    break;
                                case "dropRight":
                                    end -= size;
                                    break;
                                case "take":
                                    end = nativeMin(end, start + size);
                                    break;
                                case "takeRight":
                                    start = nativeMax(start, end - size)
                            }
                        }
                        return {
                            start: start,
                            end: end
                        }
                    }

                    function getWrapDetails(source) {
                        var match = source.match(reWrapDetails);
                        return match ? match[1].split(reSplitDetails) : []
                    }

                    function hasPath(object, path, hasFunc) {
                        path = isKey(path, object) ? [path] : castPath(path);
                        for (var result, index = -1, length = path.length; ++index < length;) {
                            var key = toKey(path[index]);
                            if (!(result = null != object && hasFunc(object, key))) break;
                            object = object[key]
                        }
                        if (result) return result;
                        var length = object ? object.length : 0;
                        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isString(object) || isArguments(object))
                    }

                    function initCloneArray(array) {
                        var length = array.length,
                            result = array.constructor(length);
                        return length && "string" == typeof array[0] && hasOwnProperty.call(array, "index") && (result.index = array.index, result.input = array.input), result
                    }

                    function initCloneObject(object) {
                        return "function" != typeof object.constructor || isPrototype(object) ? {} : baseCreate(getPrototype(object))
                    }

                    function initCloneByTag(object, tag, cloneFunc, isDeep) {
                        var Ctor = object.constructor;
                        switch (tag) {
                            case arrayBufferTag:
                                return cloneArrayBuffer(object);
                            case boolTag:
                            case dateTag:
                                return new Ctor(+object);
                            case dataViewTag:
                                return cloneDataView(object, isDeep);
                            case float32Tag:
                            case float64Tag:
                            case int8Tag:
                            case int16Tag:
                            case int32Tag:
                            case uint8Tag:
                            case uint8ClampedTag:
                            case uint16Tag:
                            case uint32Tag:
                                return cloneTypedArray(object, isDeep);
                            case mapTag:
                                return cloneMap(object, isDeep, cloneFunc);
                            case numberTag:
                            case stringTag:
                                return new Ctor(object);
                            case regexpTag:
                                return cloneRegExp(object);
                            case setTag:
                                return cloneSet(object, isDeep, cloneFunc);
                            case symbolTag:
                                return cloneSymbol(object)
                        }
                    }

                    function indexKeys(object) {
                        var length = object ? object.length : undefined;
                        return isLength(length) && (isArray(object) || isString(object) || isArguments(object)) ? baseTimes(length, String) : null
                    }

                    function insertWrapDetails(source, details) {
                        var length = details.length,
                            lastIndex = length - 1;
                        return details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex], details = details.join(length > 2 ? ", " : " "), source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n")
                    }

                    function isFlattenable(value) {
                        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol])
                    }

                    function isIndex(value, length) {
                        return !!(length = null == length ? MAX_SAFE_INTEGER : length) && ("number" == typeof value || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length
                    }

                    function isIterateeCall(value, index, object) {
                        if (!isObject(object)) return !1;
                        var type = typeof index;
                        return !!("number" == type ? isArrayLike(object) && isIndex(index, object.length) : "string" == type && index in object) && eq(object[index], value)
                    }

                    function isKey(value, object) {
                        if (isArray(value)) return !1;
                        var type = typeof value;
                        return !("number" != type && "symbol" != type && "boolean" != type && null != value && !isSymbol(value)) || (reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object))
                    }

                    function isKeyable(value) {
                        var type = typeof value;
                        return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== value : null === value
                    }

                    function isLaziable(func) {
                        var funcName = getFuncName(func),
                            other = lodash[funcName];
                        if ("function" != typeof other || !(funcName in LazyWrapper.prototype)) return !1;
                        if (func === other) return !0;
                        var data = getData(other);
                        return !!data && func === data[0]
                    }

                    function isMasked(func) {
                        return !!maskSrcKey && maskSrcKey in func
                    }

                    function isPrototype(value) {
                        var Ctor = value && value.constructor;
                        return value === ("function" == typeof Ctor && Ctor.prototype || objectProto)
                    }

                    function isStrictComparable(value) {
                        return value === value && !isObject(value)
                    }

                    function matchesStrictComparable(key, srcValue) {
                        return function(object) {
                            return null != object && (object[key] === srcValue && (srcValue !== undefined || key in Object(object)))
                        }
                    }

                    function mergeData(data, source) {
                        var bitmask = data[1],
                            srcBitmask = source[1],
                            newBitmask = bitmask | srcBitmask,
                            isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG),
                            isCombo = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && source[7].length <= source[8] && bitmask == CURRY_FLAG;
                        if (!isCommon && !isCombo) return data;
                        srcBitmask & BIND_FLAG && (data[2] = source[2], newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG);
                        var value = source[3];
                        if (value) {
                            var partials = data[3];
                            data[3] = partials ? composeArgs(partials, value, source[4]) : value, data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4]
                        }
                        return value = source[5], value && (partials = data[5], data[5] = partials ? composeArgsRight(partials, value, source[6]) : value, data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6]), value = source[7], value && (data[7] = value), srcBitmask & ARY_FLAG && (data[8] = null == data[8] ? source[8] : nativeMin(data[8], source[8])), null == data[9] && (data[9] = source[9]), data[0] = source[0], data[1] = newBitmask, data
                    }

                    function mergeDefaults(objValue, srcValue, key, object, source, stack) {
                        return isObject(objValue) && isObject(srcValue) && (stack.set(srcValue, objValue), baseMerge(objValue, srcValue, undefined, mergeDefaults, stack), stack.delete(srcValue)), objValue
                    }

                    function parent(object, path) {
                        return 1 == path.length ? object : baseGet(object, baseSlice(path, 0, -1))
                    }

                    function reorder(array, indexes) {
                        for (var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array); length--;) {
                            var index = indexes[length];
                            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined
                        }
                        return array
                    }

                    function toKey(value) {
                        if ("string" == typeof value || isSymbol(value)) return value;
                        var result = value + "";
                        return "0" == result && 1 / value == -INFINITY ? "-0" : result
                    }

                    function toSource(func) {
                        if (null != func) {
                            try {
                                return funcToString.call(func)
                            } catch (e) {}
                            try {
                                return func + ""
                            } catch (e) {}
                        }
                        return ""
                    }

                    function updateWrapDetails(details, bitmask) {
                        return arrayEach(wrapFlags, function(pair) {
                            var value = "_." + pair[0];
                            bitmask & pair[1] && !arrayIncludes(details, value) && details.push(value)
                        }), details.sort()
                    }

                    function wrapperClone(wrapper) {
                        if (wrapper instanceof LazyWrapper) return wrapper.clone();
                        var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
                        return result.__actions__ = copyArray(wrapper.__actions__), result.__index__ = wrapper.__index__, result.__values__ = wrapper.__values__, result
                    }

                    function chunk(array, size, guard) {
                        size = (guard ? isIterateeCall(array, size, guard) : size === undefined) ? 1 : nativeMax(toInteger(size), 0);
                        var length = array ? array.length : 0;
                        if (!length || size < 1) return [];
                        for (var index = 0, resIndex = 0, result = Array(nativeCeil(length / size)); index < length;) result[resIndex++] = baseSlice(array, index, index += size);
                        return result
                    }

                    function compact(array) {
                        for (var index = -1, length = array ? array.length : 0, resIndex = 0, result = []; ++index < length;) {
                            var value = array[index];
                            value && (result[resIndex++] = value)
                        }
                        return result
                    }

                    function concat() {
                        for (var length = arguments.length, args = Array(length ? length - 1 : 0), array = arguments[0], index = length; index--;) args[index - 1] = arguments[index];
                        return length ? arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1)) : []
                    }

                    function drop(array, n, guard) {
                        var length = array ? array.length : 0;
                        return length ? (n = guard || n === undefined ? 1 : toInteger(n), baseSlice(array, n < 0 ? 0 : n, length)) : []
                    }

                    function dropRight(array, n, guard) {
                        var length = array ? array.length : 0;
                        return length ? (n = guard || n === undefined ? 1 : toInteger(n), n = length - n, baseSlice(array, 0, n < 0 ? 0 : n)) : []
                    }

                    function dropRightWhile(array, predicate) {
                        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), !0, !0) : []
                    }

                    function dropWhile(array, predicate) {
                        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), !0) : []
                    }

                    function fill(array, value, start, end) {
                        var length = array ? array.length : 0;
                        return length ? (start && "number" != typeof start && isIterateeCall(array, value, start) && (start = 0, end = length), baseFill(array, value, start, end)) : []
                    }

                    function findIndex(array, predicate, fromIndex) {
                        var length = array ? array.length : 0;
                        if (!length) return -1;
                        var index = null == fromIndex ? 0 : toInteger(fromIndex);
                        return index < 0 && (index = nativeMax(length + index, 0)), baseFindIndex(array, getIteratee(predicate, 3), index)
                    }

                    function findLastIndex(array, predicate, fromIndex) {
                        var length = array ? array.length : 0;
                        if (!length) return -1;
                        var index = length - 1;
                        return fromIndex !== undefined && (index = toInteger(fromIndex), index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)), baseFindIndex(array, getIteratee(predicate, 3), index, !0)
                    }

                    function flatten(array) {
                        return (array ? array.length : 0) ? baseFlatten(array, 1) : []
                    }

                    function flattenDeep(array) {
                        return (array ? array.length : 0) ? baseFlatten(array, INFINITY) : []
                    }

                    function flattenDepth(array, depth) {
                        return (array ? array.length : 0) ? (depth = depth === undefined ? 1 : toInteger(depth), baseFlatten(array, depth)) : []
                    }

                    function fromPairs(pairs) {
                        for (var index = -1, length = pairs ? pairs.length : 0, result = {}; ++index < length;) {
                            var pair = pairs[index];
                            result[pair[0]] = pair[1]
                        }
                        return result
                    }

                    function head(array) {
                        return array && array.length ? array[0] : undefined
                    }

                    function indexOf(array, value, fromIndex) {
                        var length = array ? array.length : 0;
                        if (!length) return -1;
                        var index = null == fromIndex ? 0 : toInteger(fromIndex);
                        return index < 0 && (index = nativeMax(length + index, 0)), baseIndexOf(array, value, index)
                    }

                    function initial(array) {
                        return dropRight(array, 1)
                    }

                    function join(array, separator) {
                        return array ? nativeJoin.call(array, separator) : ""
                    }

                    function last(array) {
                        var length = array ? array.length : 0;
                        return length ? array[length - 1] : undefined
                    }

                    function lastIndexOf(array, value, fromIndex) {
                        var length = array ? array.length : 0;
                        if (!length) return -1;
                        var index = length;
                        if (fromIndex !== undefined && (index = toInteger(fromIndex), index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1), value !== value) return baseFindIndex(array, baseIsNaN, index - 1, !0);
                        for (; index--;)
                            if (array[index] === value) return index;
                        return -1
                    }

                    function nth(array, n) {
                        return array && array.length ? baseNth(array, toInteger(n)) : undefined
                    }

                    function pullAll(array, values) {
                        return array && array.length && values && values.length ? basePullAll(array, values) : array
                    }

                    function pullAllBy(array, values, iteratee) {
                        return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array
                    }

                    function pullAllWith(array, values, comparator) {
                        return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array
                    }

                    function remove(array, predicate) {
                        var result = [];
                        if (!array || !array.length) return result;
                        var index = -1,
                            indexes = [],
                            length = array.length;
                        for (predicate = getIteratee(predicate, 3); ++index < length;) {
                            var value = array[index];
                            predicate(value, index, array) && (result.push(value), indexes.push(index))
                        }
                        return basePullAt(array, indexes), result
                    }

                    function reverse(array) {
                        return array ? nativeReverse.call(array) : array
                    }

                    function slice(array, start, end) {
                        var length = array ? array.length : 0;
                        return length ? (end && "number" != typeof end && isIterateeCall(array, start, end) ? (start = 0, end = length) : (start = null == start ? 0 : toInteger(start), end = end === undefined ? length : toInteger(end)), baseSlice(array, start, end)) : []
                    }

                    function sortedIndex(array, value) {
                        return baseSortedIndex(array, value)
                    }

                    function sortedIndexBy(array, value, iteratee) {
                        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2))
                    }

                    function sortedIndexOf(array, value) {
                        var length = array ? array.length : 0;
                        if (length) {
                            var index = baseSortedIndex(array, value);
                            if (index < length && eq(array[index], value)) return index
                        }
                        return -1
                    }

                    function sortedLastIndex(array, value) {
                        return baseSortedIndex(array, value, !0)
                    }

                    function sortedLastIndexBy(array, value, iteratee) {
                        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), !0)
                    }

                    function sortedLastIndexOf(array, value) {
                        if (array ? array.length : 0) {
                            var index = baseSortedIndex(array, value, !0) - 1;
                            if (eq(array[index], value)) return index
                        }
                        return -1
                    }

                    function sortedUniq(array) {
                        return array && array.length ? baseSortedUniq(array) : []
                    }

                    function sortedUniqBy(array, iteratee) {
                        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : []
                    }

                    function tail(array) {
                        return drop(array, 1)
                    }

                    function take(array, n, guard) {
                        return array && array.length ? (n = guard || n === undefined ? 1 : toInteger(n), baseSlice(array, 0, n < 0 ? 0 : n)) : []
                    }

                    function takeRight(array, n, guard) {
                        var length = array ? array.length : 0;
                        return length ? (n = guard || n === undefined ? 1 : toInteger(n), n = length - n, baseSlice(array, n < 0 ? 0 : n, length)) : []
                    }

                    function takeRightWhile(array, predicate) {
                        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), !1, !0) : []
                    }

                    function takeWhile(array, predicate) {
                        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : []
                    }

                    function uniq(array) {
                        return array && array.length ? baseUniq(array) : []
                    }

                    function uniqBy(array, iteratee) {
                        return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : []
                    }

                    function uniqWith(array, comparator) {
                        return array && array.length ? baseUniq(array, undefined, comparator) : []
                    }

                    function unzip(array) {
                        if (!array || !array.length) return [];
                        var length = 0;
                        return array = arrayFilter(array, function(group) {
                            if (isArrayLikeObject(group)) return length = nativeMax(group.length, length), !0
                        }), baseTimes(length, function(index) {
                            return arrayMap(array, baseProperty(index))
                        })
                    }

                    function unzipWith(array, iteratee) {
                        if (!array || !array.length) return [];
                        var result = unzip(array);
                        return null == iteratee ? result : arrayMap(result, function(group) {
                            return apply(iteratee, undefined, group)
                        })
                    }

                    function zipObject(props, values) {
                        return baseZipObject(props || [], values || [], assignValue)
                    }

                    function zipObjectDeep(props, values) {
                        return baseZipObject(props || [], values || [], baseSet)
                    }

                    function chain(value) {
                        var result = lodash(value);
                        return result.__chain__ = !0, result
                    }

                    function tap(value, interceptor) {
                        return interceptor(value), value
                    }

                    function thru(value, interceptor) {
                        return interceptor(value)
                    }

                    function wrapperChain() {
                        return chain(this)
                    }

                    function wrapperCommit() {
                        return new LodashWrapper(this.value(), this.__chain__)
                    }

                    function wrapperNext() {
                        this.__values__ === undefined && (this.__values__ = toArray(this.value()));
                        var done = this.__index__ >= this.__values__.length;
                        return {
                            done: done,
                            value: done ? undefined : this.__values__[this.__index__++]
                        }
                    }

                    function wrapperToIterator() {
                        return this
                    }

                    function wrapperPlant(value) {
                        for (var result, parent = this; parent instanceof baseLodash;) {
                            var clone = wrapperClone(parent);
                            clone.__index__ = 0, clone.__values__ = undefined, result ? previous.__wrapped__ = clone : result = clone;
                            var previous = clone;
                            parent = parent.__wrapped__
                        }
                        return previous.__wrapped__ = value, result
                    }

                    function wrapperReverse() {
                        var value = this.__wrapped__;
                        if (value instanceof LazyWrapper) {
                            var wrapped = value;
                            return this.__actions__.length && (wrapped = new LazyWrapper(this)), wrapped = wrapped.reverse(), wrapped.__actions__.push({
                                func: thru,
                                args: [reverse],
                                thisArg: undefined
                            }), new LodashWrapper(wrapped, this.__chain__)
                        }
                        return this.thru(reverse)
                    }

                    function wrapperValue() {
                        return baseWrapperValue(this.__wrapped__, this.__actions__)
                    }

                    function every(collection, predicate, guard) {
                        var func = isArray(collection) ? arrayEvery : baseEvery;
                        return guard && isIterateeCall(collection, predicate, guard) && (predicate = undefined), func(collection, getIteratee(predicate, 3))
                    }

                    function filter(collection, predicate) {
                        return (isArray(collection) ? arrayFilter : baseFilter)(collection, getIteratee(predicate, 3))
                    }

                    function flatMap(collection, iteratee) {
                        return baseFlatten(map(collection, iteratee), 1)
                    }

                    function flatMapDeep(collection, iteratee) {
                        return baseFlatten(map(collection, iteratee), INFINITY)
                    }

                    function flatMapDepth(collection, iteratee, depth) {
                        return depth = depth === undefined ? 1 : toInteger(depth), baseFlatten(map(collection, iteratee), depth)
                    }

                    function forEach(collection, iteratee) {
                        return (isArray(collection) ? arrayEach : baseEach)(collection, getIteratee(iteratee, 3))
                    }

                    function forEachRight(collection, iteratee) {
                        return (isArray(collection) ? arrayEachRight : baseEachRight)(collection, getIteratee(iteratee, 3))
                    }

                    function includes(collection, value, fromIndex, guard) {
                        collection = isArrayLike(collection) ? collection : values(collection), fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
                        var length = collection.length;
                        return fromIndex < 0 && (fromIndex = nativeMax(length + fromIndex, 0)), isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1
                    }

                    function map(collection, iteratee) {
                        return (isArray(collection) ? arrayMap : baseMap)(collection, getIteratee(iteratee, 3))
                    }

                    function orderBy(collection, iteratees, orders, guard) {
                        return null == collection ? [] : (isArray(iteratees) || (iteratees = null == iteratees ? [] : [iteratees]), orders = guard ? undefined : orders, isArray(orders) || (orders = null == orders ? [] : [orders]), baseOrderBy(collection, iteratees, orders))
                    }

                    function reduce(collection, iteratee, accumulator) {
                        var func = isArray(collection) ? arrayReduce : baseReduce,
                            initAccum = arguments.length < 3;
                        return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach)
                    }

                    function reduceRight(collection, iteratee, accumulator) {
                        var func = isArray(collection) ? arrayReduceRight : baseReduce,
                            initAccum = arguments.length < 3;
                        return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight)
                    }

                    function reject(collection, predicate) {
                        return (isArray(collection) ? arrayFilter : baseFilter)(collection, negate(getIteratee(predicate, 3)))
                    }

                    function sample(collection) {
                        var array = isArrayLike(collection) ? collection : values(collection),
                            length = array.length;
                        return length > 0 ? array[baseRandom(0, length - 1)] : undefined
                    }

                    function sampleSize(collection, n, guard) {
                        var index = -1,
                            result = toArray(collection),
                            length = result.length,
                            lastIndex = length - 1;
                        for (n = (guard ? isIterateeCall(collection, n, guard) : n === undefined) ? 1 : baseClamp(toInteger(n), 0, length); ++index < n;) {
                            var rand = baseRandom(index, lastIndex),
                                value = result[rand];
                            result[rand] = result[index], result[index] = value
                        }
                        return result.length = n, result
                    }

                    function shuffle(collection) {
                        return sampleSize(collection, MAX_ARRAY_LENGTH)
                    }

                    function size(collection) {
                        if (null == collection) return 0;
                        if (isArrayLike(collection)) {
                            var result = collection.length;
                            return result && isString(collection) ? stringSize(collection) : result
                        }
                        if (isObjectLike(collection)) {
                            var tag = getTag(collection);
                            if (tag == mapTag || tag == setTag) return collection.size
                        }
                        return keys(collection).length
                    }

                    function some(collection, predicate, guard) {
                        var func = isArray(collection) ? arraySome : baseSome;
                        return guard && isIterateeCall(collection, predicate, guard) && (predicate = undefined), func(collection, getIteratee(predicate, 3))
                    }

                    function now() {
                        return Date.now()
                    }

                    function after(n, func) {
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return n = toInteger(n),
                            function() {
                                if (--n < 1) return func.apply(this, arguments)
                            }
                    }

                    function ary(func, n, guard) {
                        return n = guard ? undefined : n, n = func && null == n ? func.length : n, createWrap(func, ARY_FLAG, undefined, undefined, undefined, undefined, n)
                    }

                    function before(n, func) {
                        var result;
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return n = toInteger(n),
                            function() {
                                return --n > 0 && (result = func.apply(this, arguments)), n <= 1 && (func = undefined), result
                            }
                    }

                    function curry(func, arity, guard) {
                        arity = guard ? undefined : arity;
                        var result = createWrap(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
                        return result.placeholder = curry.placeholder, result
                    }

                    function curryRight(func, arity, guard) {
                        arity = guard ? undefined : arity;
                        var result = createWrap(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
                        return result.placeholder = curryRight.placeholder, result
                    }

                    function debounce(func, wait, options) {
                        function invokeFunc(time) {
                            var args = lastArgs,
                                thisArg = lastThis;
                            return lastArgs = lastThis = undefined, lastInvokeTime = time, result = func.apply(thisArg, args)
                        }

                        function leadingEdge(time) {
                            return lastInvokeTime = time, timerId = setTimeout(timerExpired, wait), leading ? invokeFunc(time) : result
                        }

                        function remainingWait(time) {
                            var timeSinceLastCall = time - lastCallTime,
                                timeSinceLastInvoke = time - lastInvokeTime,
                                result = wait - timeSinceLastCall;
                            return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result
                        }

                        function shouldInvoke(time) {
                            var timeSinceLastCall = time - lastCallTime,
                                timeSinceLastInvoke = time - lastInvokeTime;
                            return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait
                        }

                        function timerExpired() {
                            var time = now();
                            if (shouldInvoke(time)) return trailingEdge(time);
                            timerId = setTimeout(timerExpired, remainingWait(time))
                        }

                        function trailingEdge(time) {
                            return timerId = undefined, trailing && lastArgs ? invokeFunc(time) : (lastArgs = lastThis = undefined, result)
                        }

                        function cancel() {
                            timerId !== undefined && clearTimeout(timerId), lastInvokeTime = 0, lastArgs = lastCallTime = lastThis = timerId = undefined
                        }

                        function flush() {
                            return timerId === undefined ? result : trailingEdge(now())
                        }

                        function debounced() {
                            var time = now(),
                                isInvoking = shouldInvoke(time);
                            if (lastArgs = arguments, lastThis = this, lastCallTime = time, isInvoking) {
                                if (timerId === undefined) return leadingEdge(lastCallTime);
                                if (maxing) return timerId = setTimeout(timerExpired, wait), invokeFunc(lastCallTime)
                            }
                            return timerId === undefined && (timerId = setTimeout(timerExpired, wait)), result
                        }
                        var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0,
                            leading = !1,
                            maxing = !1,
                            trailing = !0;
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return wait = toNumber(wait) || 0, isObject(options) && (leading = !!options.leading, maxing = "maxWait" in options, maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait, trailing = "trailing" in options ? !!options.trailing : trailing), debounced.cancel = cancel, debounced.flush = flush, debounced
                    }

                    function flip(func) {
                        return createWrap(func, FLIP_FLAG)
                    }

                    function memoize(func, resolver) {
                        if ("function" != typeof func || resolver && "function" != typeof resolver) throw new TypeError(FUNC_ERROR_TEXT);
                        var memoized = function() {
                            var args = arguments,
                                key = resolver ? resolver.apply(this, args) : args[0],
                                cache = memoized.cache;
                            if (cache.has(key)) return cache.get(key);
                            var result = func.apply(this, args);
                            return memoized.cache = cache.set(key, result), result
                        };
                        return memoized.cache = new(memoize.Cache || MapCache), memoized
                    }

                    function negate(predicate) {
                        if ("function" != typeof predicate) throw new TypeError(FUNC_ERROR_TEXT);
                        return function() {
                            var args = arguments;
                            switch (args.length) {
                                case 0:
                                    return !predicate.call(this);
                                case 1:
                                    return !predicate.call(this, args[0]);
                                case 2:
                                    return !predicate.call(this, args[0], args[1]);
                                case 3:
                                    return !predicate.call(this, args[0], args[1], args[2])
                            }
                            return !predicate.apply(this, args)
                        }
                    }

                    function once(func) {
                        return before(2, func)
                    }

                    function rest(func, start) {
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return start = start === undefined ? start : toInteger(start), baseRest(func, start)
                    }

                    function spread(func, start) {
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return start = start === undefined ? 0 : nativeMax(toInteger(start), 0), baseRest(function(args) {
                            var array = args[start],
                                otherArgs = castSlice(args, 0, start);
                            return array && arrayPush(otherArgs, array), apply(func, this, otherArgs)
                        })
                    }

                    function throttle(func, wait, options) {
                        var leading = !0,
                            trailing = !0;
                        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                        return isObject(options) && (leading = "leading" in options ? !!options.leading : leading, trailing = "trailing" in options ? !!options.trailing : trailing), debounce(func, wait, {
                            leading: leading,
                            maxWait: wait,
                            trailing: trailing
                        })
                    }

                    function unary(func) {
                        return ary(func, 1)
                    }

                    function wrap(value, wrapper) {
                        return wrapper = null == wrapper ? identity : wrapper, partial(wrapper, value)
                    }

                    function castArray() {
                        if (!arguments.length) return [];
                        var value = arguments[0];
                        return isArray(value) ? value : [value]
                    }

                    function clone(value) {
                        return baseClone(value, !1, !0)
                    }

                    function cloneWith(value, customizer) {
                        return baseClone(value, !1, !0, customizer)
                    }

                    function cloneDeep(value) {
                        return baseClone(value, !0, !0)
                    }

                    function cloneDeepWith(value, customizer) {
                        return baseClone(value, !0, !0, customizer)
                    }

                    function conformsTo(object, source) {
                        return null == source || baseConformsTo(object, source, keys(source))
                    }

                    function eq(value, other) {
                        return value === other || value !== value && other !== other
                    }

                    function isArguments(value) {
                        return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag)
                    }

                    function isArrayLike(value) {
                        return null != value && isLength(getLength(value)) && !isFunction(value)
                    }

                    function isArrayLikeObject(value) {
                        return isObjectLike(value) && isArrayLike(value)
                    }

                    function isBoolean(value) {
                        return !0 === value || !1 === value || isObjectLike(value) && objectToString.call(value) == boolTag
                    }

                    function isElement(value) {
                        return !!value && 1 === value.nodeType && isObjectLike(value) && !isPlainObject(value)
                    }

                    function isEmpty(value) {
                        if (isArrayLike(value) && (isArray(value) || isString(value) || isFunction(value.splice) || isArguments(value) || isBuffer(value))) return !value.length;
                        if (isObjectLike(value)) {
                            var tag = getTag(value);
                            if (tag == mapTag || tag == setTag) return !value.size
                        }
                        for (var key in value)
                            if (hasOwnProperty.call(value, key)) return !1;
                        return !(nonEnumShadows && keys(value).length)
                    }

                    function isEqual(value, other) {
                        return baseIsEqual(value, other)
                    }

                    function isEqualWith(value, other, customizer) {
                        customizer = "function" == typeof customizer ? customizer : undefined;
                        var result = customizer ? customizer(value, other) : undefined;
                        return result === undefined ? baseIsEqual(value, other, customizer) : !!result
                    }

                    function isError(value) {
                        return !!isObjectLike(value) && (objectToString.call(value) == errorTag || "string" == typeof value.message && "string" == typeof value.name)
                    }

                    function isFinite(value) {
                        return "number" == typeof value && nativeIsFinite(value)
                    }

                    function isFunction(value) {
                        var tag = isObject(value) ? objectToString.call(value) : "";
                        return tag == funcTag || tag == genTag
                    }

                    function isInteger(value) {
                        return "number" == typeof value && value == toInteger(value)
                    }

                    function isLength(value) {
                        return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
                    }

                    function isObject(value) {
                        var type = typeof value;
                        return !!value && ("object" == type || "function" == type)
                    }

                    function isObjectLike(value) {
                        return !!value && "object" == typeof value
                    }

                    function isMatch(object, source) {
                        return object === source || baseIsMatch(object, source, getMatchData(source))
                    }

                    function isMatchWith(object, source, customizer) {
                        return customizer = "function" == typeof customizer ? customizer : undefined, baseIsMatch(object, source, getMatchData(source), customizer)
                    }

                    function isNaN(value) {
                        return isNumber(value) && value != +value
                    }

                    function isNative(value) {
                        if (isMaskable(value)) throw new Error("This method is not supported with core-js. Try https://github.com/es-shims.");
                        return baseIsNative(value)
                    }

                    function isNull(value) {
                        return null === value
                    }

                    function isNil(value) {
                        return null == value
                    }

                    function isNumber(value) {
                        return "number" == typeof value || isObjectLike(value) && objectToString.call(value) == numberTag
                    }

                    function isPlainObject(value) {
                        if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) return !1;
                        var proto = getPrototype(value);
                        if (null === proto) return !0;
                        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
                        return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString
                    }

                    function isSafeInteger(value) {
                        return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER
                    }

                    function isString(value) {
                        return "string" == typeof value || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag
                    }

                    function isSymbol(value) {
                        return "symbol" == typeof value || isObjectLike(value) && objectToString.call(value) == symbolTag
                    }

                    function isUndefined(value) {
                        return value === undefined
                    }

                    function isWeakMap(value) {
                        return isObjectLike(value) && getTag(value) == weakMapTag
                    }

                    function isWeakSet(value) {
                        return isObjectLike(value) && objectToString.call(value) == weakSetTag
                    }

                    function toArray(value) {
                        if (!value) return [];
                        if (isArrayLike(value)) return isString(value) ? stringToArray(value) : copyArray(value);
                        if (iteratorSymbol && value[iteratorSymbol]) return iteratorToArray(value[iteratorSymbol]());
                        var tag = getTag(value);
                        return (tag == mapTag ? mapToArray : tag == setTag ? setToArray : values)(value)
                    }

                    function toFinite(value) {
                        if (!value) return 0 === value ? value : 0;
                        if ((value = toNumber(value)) === INFINITY || value === -INFINITY) {
                            return (value < 0 ? -1 : 1) * MAX_INTEGER
                        }
                        return value === value ? value : 0
                    }

                    function toInteger(value) {
                        var result = toFinite(value),
                            remainder = result % 1;
                        return result === result ? remainder ? result - remainder : result : 0
                    }

                    function toLength(value) {
                        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0
                    }

                    function toNumber(value) {
                        if ("number" == typeof value) return value;
                        if (isSymbol(value)) return NAN;
                        if (isObject(value)) {
                            var other = isFunction(value.valueOf) ? value.valueOf() : value;
                            value = isObject(other) ? other + "" : other
                        }
                        if ("string" != typeof value) return 0 === value ? value : +value;
                        value = value.replace(reTrim, "");
                        var isBinary = reIsBinary.test(value);
                        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value
                    }

                    function toPlainObject(value) {
                        return copyObject(value, keysIn(value))
                    }

                    function toSafeInteger(value) {
                        return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
                    }

                    function toString(value) {
                        return null == value ? "" : baseToString(value)
                    }

                    function create(prototype, properties) {
                        var result = baseCreate(prototype);
                        return properties ? baseAssign(result, properties) : result
                    }

                    function findKey(object, predicate) {
                        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn)
                    }

                    function findLastKey(object, predicate) {
                        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight)
                    }

                    function forIn(object, iteratee) {
                        return null == object ? object : baseFor(object, getIteratee(iteratee, 3), keysIn)
                    }

                    function forInRight(object, iteratee) {
                        return null == object ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn)
                    }

                    function forOwn(object, iteratee) {
                        return object && baseForOwn(object, getIteratee(iteratee, 3))
                    }

                    function forOwnRight(object, iteratee) {
                        return object && baseForOwnRight(object, getIteratee(iteratee, 3))
                    }

                    function functions(object) {
                        return null == object ? [] : baseFunctions(object, keys(object))
                    }

                    function functionsIn(object) {
                        return null == object ? [] : baseFunctions(object, keysIn(object))
                    }

                    function get(object, path, defaultValue) {
                        var result = null == object ? undefined : baseGet(object, path);
                        return result === undefined ? defaultValue : result
                    }

                    function has(object, path) {
                        return null != object && hasPath(object, path, baseHas)
                    }

                    function hasIn(object, path) {
                        return null != object && hasPath(object, path, baseHasIn)
                    }

                    function keys(object) {
                        var isProto = isPrototype(object);
                        if (!isProto && !isArrayLike(object)) return baseKeys(object);
                        var indexes = indexKeys(object),
                            skipIndexes = !!indexes,
                            result = indexes || [],
                            length = result.length;
                        for (var key in object) !baseHas(object, key) || skipIndexes && ("length" == key || isIndex(key, length)) || isProto && "constructor" == key || result.push(key);
                        return result
                    }

                    function keysIn(object) {
                        for (var index = -1, isProto = isPrototype(object), props = baseKeysIn(object), propsLength = props.length, indexes = indexKeys(object), skipIndexes = !!indexes, result = indexes || [], length = result.length; ++index < propsLength;) {
                            var key = props[index];
                            skipIndexes && ("length" == key || isIndex(key, length)) || "constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key)
                        }
                        return result
                    }

                    function mapKeys(object, iteratee) {
                        var result = {};
                        return iteratee = getIteratee(iteratee, 3), baseForOwn(object, function(value, key, object) {
                            result[iteratee(value, key, object)] = value
                        }), result
                    }

                    function mapValues(object, iteratee) {
                        var result = {};
                        return iteratee = getIteratee(iteratee, 3), baseForOwn(object, function(value, key, object) {
                            result[key] = iteratee(value, key, object)
                        }), result
                    }

                    function omitBy(object, predicate) {
                        return pickBy(object, negate(getIteratee(predicate)))
                    }

                    function pickBy(object, predicate) {
                        return null == object ? {} : basePickBy(object, getAllKeysIn(object), getIteratee(predicate))
                    }

                    function result(object, path, defaultValue) {
                        path = isKey(path, object) ? [path] : castPath(path);
                        var index = -1,
                            length = path.length;
                        for (length || (object = undefined, length = 1); ++index < length;) {
                            var value = null == object ? undefined : object[toKey(path[index])];
                            value === undefined && (index = length, value = defaultValue), object = isFunction(value) ? value.call(object) : value
                        }
                        return object
                    }

                    function set(object, path, value) {
                        return null == object ? object : baseSet(object, path, value)
                    }

                    function setWith(object, path, value, customizer) {
                        return customizer = "function" == typeof customizer ? customizer : undefined, null == object ? object : baseSet(object, path, value, customizer)
                    }

                    function transform(object, iteratee, accumulator) {
                        var isArr = isArray(object) || isTypedArray(object);
                        if (iteratee = getIteratee(iteratee, 4), null == accumulator)
                            if (isArr || isObject(object)) {
                                var Ctor = object.constructor;
                                accumulator = isArr ? isArray(object) ? new Ctor : [] : isFunction(Ctor) ? baseCreate(getPrototype(object)) : {}
                            } else accumulator = {};
                        return (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
                            return iteratee(accumulator, value, index, object)
                        }), accumulator
                    }

                    function unset(object, path) {
                        return null == object || baseUnset(object, path)
                    }

                    function update(object, path, updater) {
                        return null == object ? object : baseUpdate(object, path, castFunction(updater))
                    }

                    function updateWith(object, path, updater, customizer) {
                        return customizer = "function" == typeof customizer ? customizer : undefined, null == object ? object : baseUpdate(object, path, castFunction(updater), customizer)
                    }

                    function values(object) {
                        return object ? baseValues(object, keys(object)) : []
                    }

                    function valuesIn(object) {
                        return null == object ? [] : baseValues(object, keysIn(object))
                    }

                    function clamp(number, lower, upper) {
                        return upper === undefined && (upper = lower, lower = undefined), upper !== undefined && (upper = toNumber(upper), upper = upper === upper ? upper : 0), lower !== undefined && (lower = toNumber(lower), lower = lower === lower ? lower : 0), baseClamp(toNumber(number), lower, upper)
                    }

                    function inRange(number, start, end) {
                        return start = toNumber(start) || 0, end === undefined ? (end = start, start = 0) : end = toNumber(end) || 0, number = toNumber(number), baseInRange(number, start, end)
                    }

                    function random(lower, upper, floating) {
                        if (floating && "boolean" != typeof floating && isIterateeCall(lower, upper, floating) && (upper = floating = undefined), floating === undefined && ("boolean" == typeof upper ? (floating = upper, upper = undefined) : "boolean" == typeof lower && (floating = lower,
                                lower = undefined)), lower === undefined && upper === undefined ? (lower = 0, upper = 1) : (lower = toNumber(lower) || 0, upper === undefined ? (upper = lower, lower = 0) : upper = toNumber(upper) || 0), lower > upper) {
                            var temp = lower;
                            lower = upper, upper = temp
                        }
                        if (floating || lower % 1 || upper % 1) {
                            var rand = nativeRandom();
                            return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper)
                        }
                        return baseRandom(lower, upper)
                    }

                    function capitalize(string) {
                        return upperFirst(toString(string).toLowerCase())
                    }

                    function deburr(string) {
                        return (string = toString(string)) && string.replace(reLatin1, deburrLetter).replace(reComboMark, "")
                    }

                    function endsWith(string, target, position) {
                        string = toString(string), target = baseToString(target);
                        var length = string.length;
                        position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
                        var end = position;
                        return (position -= target.length) >= 0 && string.slice(position, end) == target
                    }

                    function escape(string) {
                        return string = toString(string), string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string
                    }

                    function escapeRegExp(string) {
                        return string = toString(string), string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string
                    }

                    function pad(string, length, chars) {
                        string = toString(string), length = toInteger(length);
                        var strLength = length ? stringSize(string) : 0;
                        if (!length || strLength >= length) return string;
                        var mid = (length - strLength) / 2;
                        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars)
                    }

                    function padEnd(string, length, chars) {
                        string = toString(string), length = toInteger(length);
                        var strLength = length ? stringSize(string) : 0;
                        return length && strLength < length ? string + createPadding(length - strLength, chars) : string
                    }

                    function padStart(string, length, chars) {
                        string = toString(string), length = toInteger(length);
                        var strLength = length ? stringSize(string) : 0;
                        return length && strLength < length ? createPadding(length - strLength, chars) + string : string
                    }

                    function parseInt(string, radix, guard) {
                        return guard || null == radix ? radix = 0 : radix && (radix = +radix), string = toString(string).replace(reTrim, ""), nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10))
                    }

                    function repeat(string, n, guard) {
                        return n = (guard ? isIterateeCall(string, n, guard) : n === undefined) ? 1 : toInteger(n), baseRepeat(toString(string), n)
                    }

                    function replace() {
                        var args = arguments,
                            string = toString(args[0]);
                        return args.length < 3 ? string : nativeReplace.call(string, args[1], args[2])
                    }

                    function split(string, separator, limit) {
                        return limit && "number" != typeof limit && isIterateeCall(string, separator, limit) && (separator = limit = undefined), (limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0) ? (string = toString(string), string && ("string" == typeof separator || null != separator && !isRegExp(separator)) && "" == (separator = baseToString(separator)) && reHasComplexSymbol.test(string) ? castSlice(stringToArray(string), 0, limit) : nativeSplit.call(string, separator, limit)) : []
                    }

                    function startsWith(string, target, position) {
                        return string = toString(string), position = baseClamp(toInteger(position), 0, string.length), target = baseToString(target), string.slice(position, position + target.length) == target
                    }

                    function template(string, options, guard) {
                        var settings = lodash.templateSettings;
                        guard && isIterateeCall(string, options, guard) && (options = undefined), string = toString(string), options = assignInWith({}, options, settings, assignInDefaults);
                        var isEscaping, isEvaluating, imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
                            importsKeys = keys(imports),
                            importsValues = baseValues(imports, importsKeys),
                            index = 0,
                            interpolate = options.interpolate || reNoMatch,
                            source = "__p += '",
                            reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g"),
                            sourceURL = "//# sourceURL=" + ("sourceURL" in options ? options.sourceURL : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
                        string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                            return interpolateValue || (interpolateValue = esTemplateValue), source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar), escapeValue && (isEscaping = !0, source += "' +\n__e(" + escapeValue + ") +\n'"), evaluateValue && (isEvaluating = !0, source += "';\n" + evaluateValue + ";\n__p += '"), interpolateValue && (source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'"), index = offset + match.length, match
                        }), source += "';\n";
                        var variable = options.variable;
                        variable || (source = "with (obj) {\n" + source + "\n}\n"), source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;"), source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
                        var result = attempt(function() {
                            return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues)
                        });
                        if (result.source = source, isError(result)) throw result;
                        return result
                    }

                    function toLower(value) {
                        return toString(value).toLowerCase()
                    }

                    function toUpper(value) {
                        return toString(value).toUpperCase()
                    }

                    function trim(string, chars, guard) {
                        if ((string = toString(string)) && (guard || chars === undefined)) return string.replace(reTrim, "");
                        if (!string || !(chars = baseToString(chars))) return string;
                        var strSymbols = stringToArray(string),
                            chrSymbols = stringToArray(chars);
                        return castSlice(strSymbols, charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join("")
                    }

                    function trimEnd(string, chars, guard) {
                        if ((string = toString(string)) && (guard || chars === undefined)) return string.replace(reTrimEnd, "");
                        if (!string || !(chars = baseToString(chars))) return string;
                        var strSymbols = stringToArray(string);
                        return castSlice(strSymbols, 0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join("")
                    }

                    function trimStart(string, chars, guard) {
                        if ((string = toString(string)) && (guard || chars === undefined)) return string.replace(reTrimStart, "");
                        if (!string || !(chars = baseToString(chars))) return string;
                        var strSymbols = stringToArray(string);
                        return castSlice(strSymbols, charsStartIndex(strSymbols, stringToArray(chars))).join("")
                    }

                    function truncate(string, options) {
                        var length = DEFAULT_TRUNC_LENGTH,
                            omission = DEFAULT_TRUNC_OMISSION;
                        if (isObject(options)) {
                            var separator = "separator" in options ? options.separator : separator;
                            length = "length" in options ? toInteger(options.length) : length, omission = "omission" in options ? baseToString(options.omission) : omission
                        }
                        string = toString(string);
                        var strLength = string.length;
                        if (reHasComplexSymbol.test(string)) {
                            var strSymbols = stringToArray(string);
                            strLength = strSymbols.length
                        }
                        if (length >= strLength) return string;
                        var end = length - stringSize(omission);
                        if (end < 1) return omission;
                        var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
                        if (separator === undefined) return result + omission;
                        if (strSymbols && (end += result.length - end), isRegExp(separator)) {
                            if (string.slice(end).search(separator)) {
                                var match, substring = result;
                                for (separator.global || (separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g")), separator.lastIndex = 0; match = separator.exec(substring);) var newEnd = match.index;
                                result = result.slice(0, newEnd === undefined ? end : newEnd)
                            }
                        } else if (string.indexOf(baseToString(separator), end) != end) {
                            var index = result.lastIndexOf(separator);
                            index > -1 && (result = result.slice(0, index))
                        }
                        return result + omission
                    }

                    function unescape(string) {
                        return string = toString(string), string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string
                    }

                    function words(string, pattern, guard) {
                        return string = toString(string), pattern = guard ? undefined : pattern, pattern === undefined && (pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord), string.match(pattern) || []
                    }

                    function cond(pairs) {
                        var length = pairs ? pairs.length : 0,
                            toIteratee = getIteratee();
                        return pairs = length ? arrayMap(pairs, function(pair) {
                            if ("function" != typeof pair[1]) throw new TypeError(FUNC_ERROR_TEXT);
                            return [toIteratee(pair[0]), pair[1]]
                        }) : [], baseRest(function(args) {
                            for (var index = -1; ++index < length;) {
                                var pair = pairs[index];
                                if (apply(pair[0], this, args)) return apply(pair[1], this, args)
                            }
                        })
                    }

                    function conforms(source) {
                        return baseConforms(baseClone(source, !0))
                    }

                    function constant(value) {
                        return function() {
                            return value
                        }
                    }

                    function defaultTo(value, defaultValue) {
                        return null == value || value !== value ? defaultValue : value
                    }

                    function identity(value) {
                        return value
                    }

                    function iteratee(func) {
                        return baseIteratee("function" == typeof func ? func : baseClone(func, !0))
                    }

                    function matches(source) {
                        return baseMatches(baseClone(source, !0))
                    }

                    function matchesProperty(path, srcValue) {
                        return baseMatchesProperty(path, baseClone(srcValue, !0))
                    }

                    function mixin(object, source, options) {
                        var props = keys(source),
                            methodNames = baseFunctions(source, props);
                        null != options || isObject(source) && (methodNames.length || !props.length) || (options = source, source = object, object = this, methodNames = baseFunctions(source, keys(source)));
                        var chain = !(isObject(options) && "chain" in options && !options.chain),
                            isFunc = isFunction(object);
                        return arrayEach(methodNames, function(methodName) {
                            var func = source[methodName];
                            object[methodName] = func, isFunc && (object.prototype[methodName] = function() {
                                var chainAll = this.__chain__;
                                if (chain || chainAll) {
                                    var result = object(this.__wrapped__);
                                    return (result.__actions__ = copyArray(this.__actions__)).push({
                                        func: func,
                                        args: arguments,
                                        thisArg: object
                                    }), result.__chain__ = chainAll, result
                                }
                                return func.apply(object, arrayPush([this.value()], arguments))
                            })
                        }), object
                    }

                    function noConflict() {
                        return root._ === this && (root._ = oldDash), this
                    }

                    function noop() {}

                    function nthArg(n) {
                        return n = toInteger(n), baseRest(function(args) {
                            return baseNth(args, n)
                        })
                    }

                    function property(path) {
                        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path)
                    }

                    function propertyOf(object) {
                        return function(path) {
                            return null == object ? undefined : baseGet(object, path)
                        }
                    }

                    function stubArray() {
                        return []
                    }

                    function stubFalse() {
                        return !1
                    }

                    function stubObject() {
                        return {}
                    }

                    function stubString() {
                        return ""
                    }

                    function stubTrue() {
                        return !0
                    }

                    function times(n, iteratee) {
                        if ((n = toInteger(n)) < 1 || n > MAX_SAFE_INTEGER) return [];
                        var index = MAX_ARRAY_LENGTH,
                            length = nativeMin(n, MAX_ARRAY_LENGTH);
                        iteratee = getIteratee(iteratee), n -= MAX_ARRAY_LENGTH;
                        for (var result = baseTimes(length, iteratee); ++index < n;) iteratee(index);
                        return result
                    }

                    function toPath(value) {
                        return isArray(value) ? arrayMap(value, toKey) : isSymbol(value) ? [value] : copyArray(stringToPath(value))
                    }

                    function uniqueId(prefix) {
                        var id = ++idCounter;
                        return toString(prefix) + id
                    }

                    function max(array) {
                        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined
                    }

                    function maxBy(array, iteratee) {
                        return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined
                    }

                    function mean(array) {
                        return baseMean(array, identity)
                    }

                    function meanBy(array, iteratee) {
                        return baseMean(array, getIteratee(iteratee, 2))
                    }

                    function min(array) {
                        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined
                    }

                    function minBy(array, iteratee) {
                        return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined
                    }

                    function sum(array) {
                        return array && array.length ? baseSum(array, identity) : 0
                    }

                    function sumBy(array, iteratee) {
                        return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0
                    }
                    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;
                    var Array = context.Array,
                        Date = context.Date,
                        Error = context.Error,
                        Math = context.Math,
                        RegExp = context.RegExp,
                        TypeError = context.TypeError,
                        arrayProto = context.Array.prototype,
                        objectProto = context.Object.prototype,
                        stringProto = context.String.prototype,
                        coreJsData = context["__core-js_shared__"],
                        maskSrcKey = function() {
                            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
                            return uid ? "Symbol(src)_1." + uid : ""
                        }(),
                        funcToString = context.Function.prototype.toString,
                        hasOwnProperty = objectProto.hasOwnProperty,
                        idCounter = 0,
                        objectCtorString = funcToString.call(Object),
                        objectToString = objectProto.toString,
                        oldDash = root._,
                        reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                        Buffer = moduleExports ? context.Buffer : undefined,
                        Reflect = context.Reflect,
                        Symbol = context.Symbol,
                        Uint8Array = context.Uint8Array,
                        enumerate = Reflect ? Reflect.enumerate : undefined,
                        iteratorSymbol = Symbol ? Symbol.iterator : undefined,
                        objectCreate = context.Object.create,
                        propertyIsEnumerable = objectProto.propertyIsEnumerable,
                        splice = arrayProto.splice,
                        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
                        clearTimeout = function(id) {
                            return context.clearTimeout.call(root, id)
                        },
                        setTimeout = function(func, wait) {
                            return context.setTimeout.call(root, func, wait)
                        },
                        nativeCeil = Math.ceil,
                        nativeFloor = Math.floor,
                        nativeGetPrototype = Object.getPrototypeOf,
                        nativeGetSymbols = Object.getOwnPropertySymbols,
                        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
                        nativeIsFinite = context.isFinite,
                        nativeJoin = arrayProto.join,
                        nativeKeys = Object.keys,
                        nativeMax = Math.max,
                        nativeMin = Math.min,
                        nativeParseInt = context.parseInt,
                        nativeRandom = Math.random,
                        nativeReplace = stringProto.replace,
                        nativeReverse = arrayProto.reverse,
                        nativeSplit = stringProto.split,
                        DataView = getNative(context, "DataView"),
                        Map = getNative(context, "Map"),
                        Promise = getNative(context, "Promise"),
                        Set = getNative(context, "Set"),
                        WeakMap = getNative(context, "WeakMap"),
                        nativeCreate = getNative(context.Object, "create"),
                        defineProperty = function() {
                            var func = getNative(context.Object, "defineProperty"),
                                name = getNative.name;
                            return name && name.length > 2 ? func : undefined
                        }(),
                        metaMap = WeakMap && new WeakMap,
                        nonEnumShadows = !propertyIsEnumerable.call({
                            valueOf: 1
                        }, "valueOf"),
                        realNames = {},
                        dataViewCtorString = toSource(DataView),
                        mapCtorString = toSource(Map),
                        promiseCtorString = toSource(Promise),
                        setCtorString = toSource(Set),
                        weakMapCtorString = toSource(WeakMap),
                        symbolProto = Symbol ? Symbol.prototype : undefined,
                        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
                        symbolToString = symbolProto ? symbolProto.toString : undefined;
                    lodash.templateSettings = {
                        escape: reEscape,
                        evaluate: reEvaluate,
                        interpolate: reInterpolate,
                        variable: "",
                        imports: {
                            _: lodash
                        }
                    }, lodash.prototype = baseLodash.prototype, lodash.prototype.constructor = lodash, LodashWrapper.prototype = baseCreate(baseLodash.prototype), LodashWrapper.prototype.constructor = LodashWrapper, LazyWrapper.prototype = baseCreate(baseLodash.prototype), LazyWrapper.prototype.constructor = LazyWrapper, Hash.prototype.clear = hashClear, Hash.prototype.delete = hashDelete, Hash.prototype.get = hashGet, Hash.prototype.has = hashHas, Hash.prototype.set = hashSet, ListCache.prototype.clear = listCacheClear, ListCache.prototype.delete = listCacheDelete, ListCache.prototype.get = listCacheGet, ListCache.prototype.has = listCacheHas, ListCache.prototype.set = listCacheSet, MapCache.prototype.clear = mapCacheClear, MapCache.prototype.delete = mapCacheDelete, MapCache.prototype.get = mapCacheGet, MapCache.prototype.has = mapCacheHas, MapCache.prototype.set = mapCacheSet, SetCache.prototype.add = SetCache.prototype.push = setCacheAdd, SetCache.prototype.has = setCacheHas, Stack.prototype.clear = stackClear, Stack.prototype.delete = stackDelete, Stack.prototype.get = stackGet, Stack.prototype.has = stackHas, Stack.prototype.set = stackSet;
                    var baseEach = createBaseEach(baseForOwn),
                        baseEachRight = createBaseEach(baseForOwnRight, !0),
                        baseFor = createBaseFor(),
                        baseForRight = createBaseFor(!0),
                        baseKeys = overArg(nativeKeys, Object);
                    enumerate && !propertyIsEnumerable.call({
                        valueOf: 1
                    }, "valueOf") && (baseKeysIn = function(object) {
                        return iteratorToArray(enumerate(object))
                    });
                    var baseSetData = metaMap ? function(func, data) {
                            return metaMap.set(func, data), func
                        } : identity,
                        createSet = Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY ? function(values) {
                            return new Set(values)
                        } : noop,
                        getData = metaMap ? function(func) {
                            return metaMap.get(func)
                        } : noop,
                        getLength = baseProperty("length"),
                        getPrototype = overArg(nativeGetPrototype, Object),
                        getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray,
                        getSymbolsIn = nativeGetSymbols ? function(object) {
                            for (var result = []; object;) arrayPush(result, getSymbols(object)), object = getPrototype(object);
                            return result
                        } : getSymbols,
                        getTag = baseGetTag;
                    (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set) != setTag || WeakMap && getTag(new WeakMap) != weakMapTag) && (getTag = function(value) {
                        var result = objectToString.call(value),
                            Ctor = result == objectTag ? value.constructor : undefined,
                            ctorString = Ctor ? toSource(Ctor) : undefined;
                        if (ctorString) switch (ctorString) {
                            case dataViewCtorString:
                                return dataViewTag;
                            case mapCtorString:
                                return mapTag;
                            case promiseCtorString:
                                return promiseTag;
                            case setCtorString:
                                return setTag;
                            case weakMapCtorString:
                                return weakMapTag
                        }
                        return result
                    });
                    var isMaskable = coreJsData ? isFunction : stubFalse,
                        setData = function() {
                            var count = 0,
                                lastCalled = 0;
                            return function(key, value) {
                                var stamp = now(),
                                    remaining = HOT_SPAN - (stamp - lastCalled);
                                if (lastCalled = stamp, remaining > 0) {
                                    if (++count >= HOT_COUNT) return key
                                } else count = 0;
                                return baseSetData(key, value)
                            }
                        }(),
                        setWrapToString = defineProperty ? function(wrapper, reference, bitmask) {
                            var source = reference + "";
                            return defineProperty(wrapper, "toString", {
                                configurable: !0,
                                enumerable: !1,
                                value: constant(insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)))
                            })
                        } : identity,
                        stringToPath = memoize(function(string) {
                            var result = [];
                            return toString(string).replace(rePropName, function(match, number, quote, string) {
                                result.push(quote ? string.replace(reEscapeChar, "$1") : number || match)
                            }), result
                        }),
                        difference = baseRest(function(array, values) {
                            return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, !0)) : []
                        }),
                        differenceBy = baseRest(function(array, values) {
                            var iteratee = last(values);
                            return isArrayLikeObject(iteratee) && (iteratee = undefined), isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, !0), getIteratee(iteratee, 2)) : []
                        }),
                        differenceWith = baseRest(function(array, values) {
                            var comparator = last(values);
                            return isArrayLikeObject(comparator) && (comparator = undefined), isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, !0), undefined, comparator) : []
                        }),
                        intersection = baseRest(function(arrays) {
                            var mapped = arrayMap(arrays, castArrayLikeObject);
                            return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : []
                        }),
                        intersectionBy = baseRest(function(arrays) {
                            var iteratee = last(arrays),
                                mapped = arrayMap(arrays, castArrayLikeObject);
                            return iteratee === last(mapped) ? iteratee = undefined : mapped.pop(), mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : []
                        }),
                        intersectionWith = baseRest(function(arrays) {
                            var comparator = last(arrays),
                                mapped = arrayMap(arrays, castArrayLikeObject);
                            return comparator === last(mapped) ? comparator = undefined : mapped.pop(), mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : []
                        }),
                        pull = baseRest(pullAll),
                        pullAt = baseRest(function(array, indexes) {
                            indexes = baseFlatten(indexes, 1);
                            var length = array ? array.length : 0,
                                result = baseAt(array, indexes);
                            return basePullAt(array, arrayMap(indexes, function(index) {
                                return isIndex(index, length) ? +index : index
                            }).sort(compareAscending)), result
                        }),
                        union = baseRest(function(arrays) {
                            return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, !0))
                        }),
                        unionBy = baseRest(function(arrays) {
                            var iteratee = last(arrays);
                            return isArrayLikeObject(iteratee) && (iteratee = undefined), baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, !0), getIteratee(iteratee, 2))
                        }),
                        unionWith = baseRest(function(arrays) {
                            var comparator = last(arrays);
                            return isArrayLikeObject(comparator) && (comparator = undefined), baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, !0), undefined, comparator)
                        }),
                        without = baseRest(function(array, values) {
                            return isArrayLikeObject(array) ? baseDifference(array, values) : []
                        }),
                        xor = baseRest(function(arrays) {
                            return baseXor(arrayFilter(arrays, isArrayLikeObject))
                        }),
                        xorBy = baseRest(function(arrays) {
                            var iteratee = last(arrays);
                            return isArrayLikeObject(iteratee) && (iteratee = undefined), baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2))
                        }),
                        xorWith = baseRest(function(arrays) {
                            var comparator = last(arrays);
                            return isArrayLikeObject(comparator) && (comparator = undefined), baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator)
                        }),
                        zip = baseRest(unzip),
                        zipWith = baseRest(function(arrays) {
                            var length = arrays.length,
                                iteratee = length > 1 ? arrays[length - 1] : undefined;
                            return iteratee = "function" == typeof iteratee ? (arrays.pop(), iteratee) : undefined, unzipWith(arrays, iteratee)
                        }),
                        wrapperAt = baseRest(function(paths) {
                            paths = baseFlatten(paths, 1);
                            var length = paths.length,
                                start = length ? paths[0] : 0,
                                value = this.__wrapped__,
                                interceptor = function(object) {
                                    return baseAt(object, paths)
                                };
                            return !(length > 1 || this.__actions__.length) && value instanceof LazyWrapper && isIndex(start) ? (value = value.slice(start, +start + (length ? 1 : 0)), value.__actions__.push({
                                func: thru,
                                args: [interceptor],
                                thisArg: undefined
                            }), new LodashWrapper(value, this.__chain__).thru(function(array) {
                                return length && !array.length && array.push(undefined), array
                            })) : this.thru(interceptor)
                        }),
                        countBy = createAggregator(function(result, value, key) {
                            hasOwnProperty.call(result, key) ? ++result[key] : result[key] = 1
                        }),
                        find = createFind(findIndex),
                        findLast = createFind(findLastIndex),
                        groupBy = createAggregator(function(result, value, key) {
                            hasOwnProperty.call(result, key) ? result[key].push(value) : result[key] = [value]
                        }),
                        invokeMap = baseRest(function(collection, path, args) {
                            var index = -1,
                                isFunc = "function" == typeof path,
                                isProp = isKey(path),
                                result = isArrayLike(collection) ? Array(collection.length) : [];
                            return baseEach(collection, function(value) {
                                var func = isFunc ? path : isProp && null != value ? value[path] : undefined;
                                result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args)
                            }), result
                        }),
                        keyBy = createAggregator(function(result, value, key) {
                            result[key] = value
                        }),
                        partition = createAggregator(function(result, value, key) {
                            result[key ? 0 : 1].push(value)
                        }, function() {
                            return [
                                [],
                                []
                            ]
                        }),
                        sortBy = baseRest(function(collection, iteratees) {
                            if (null == collection) return [];
                            var length = iteratees.length;
                            return length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1]) ? iteratees = [] : length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2]) && (iteratees = [iteratees[0]]), baseOrderBy(collection, baseFlatten(iteratees, 1), [])
                        }),
                        bind = baseRest(function(func, thisArg, partials) {
                            var bitmask = BIND_FLAG;
                            if (partials.length) {
                                var holders = replaceHolders(partials, getHolder(bind));
                                bitmask |= PARTIAL_FLAG
                            }
                            return createWrap(func, bitmask, thisArg, partials, holders)
                        }),
                        bindKey = baseRest(function(object, key, partials) {
                            var bitmask = BIND_FLAG | BIND_KEY_FLAG;
                            if (partials.length) {
                                var holders = replaceHolders(partials, getHolder(bindKey));
                                bitmask |= PARTIAL_FLAG
                            }
                            return createWrap(key, bitmask, object, partials, holders)
                        }),
                        defer = baseRest(function(func, args) {
                            return baseDelay(func, 1, args)
                        }),
                        delay = baseRest(function(func, wait, args) {
                            return baseDelay(func, toNumber(wait) || 0, args)
                        });
                    memoize.Cache = MapCache;
                    var overArgs = baseRest(function(func, transforms) {
                            transforms = 1 == transforms.length && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
                            var funcsLength = transforms.length;
                            return baseRest(function(args) {
                                for (var index = -1, length = nativeMin(args.length, funcsLength); ++index < length;) args[index] = transforms[index].call(this, args[index]);
                                return apply(func, this, args)
                            })
                        }),
                        partial = baseRest(function(func, partials) {
                            var holders = replaceHolders(partials, getHolder(partial));
                            return createWrap(func, PARTIAL_FLAG, undefined, partials, holders)
                        }),
                        partialRight = baseRest(function(func, partials) {
                            var holders = replaceHolders(partials, getHolder(partialRight));
                            return createWrap(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders)
                        }),
                        rearg = baseRest(function(func, indexes) {
                            return createWrap(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes, 1))
                        }),
                        gt = createRelationalOperation(baseGt),
                        gte = createRelationalOperation(function(value, other) {
                            return value >= other
                        }),
                        isArray = Array.isArray,
                        isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer,
                        isBuffer = nativeIsBuffer || stubFalse,
                        isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate,
                        isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap,
                        isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp,
                        isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet,
                        isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray,
                        lt = createRelationalOperation(baseLt),
                        lte = createRelationalOperation(function(value, other) {
                            return value <= other
                        }),
                        assign = createAssigner(function(object, source) {
                            if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) return void copyObject(source, keys(source), object);
                            for (var key in source) hasOwnProperty.call(source, key) && assignValue(object, key, source[key])
                        }),
                        assignIn = createAssigner(function(object, source) {
                            if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) return void copyObject(source, keysIn(source), object);
                            for (var key in source) assignValue(object, key, source[key])
                        }),
                        assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
                            copyObject(source, keysIn(source), object, customizer)
                        }),
                        assignWith = createAssigner(function(object, source, srcIndex, customizer) {
                            copyObject(source, keys(source), object, customizer)
                        }),
                        at = baseRest(function(object, paths) {
                            return baseAt(object, baseFlatten(paths, 1))
                        }),
                        defaults = baseRest(function(args) {
                            return args.push(undefined, assignInDefaults), apply(assignInWith, undefined, args)
                        }),
                        defaultsDeep = baseRest(function(args) {
                            return args.push(undefined, mergeDefaults), apply(mergeWith, undefined, args)
                        }),
                        invert = createInverter(function(result, value, key) {
                            result[value] = key
                        }, constant(identity)),
                        invertBy = createInverter(function(result, value, key) {
                            hasOwnProperty.call(result, value) ? result[value].push(key) : result[value] = [key]
                        }, getIteratee),
                        invoke = baseRest(baseInvoke),
                        merge = createAssigner(function(object, source, srcIndex) {
                            baseMerge(object, source, srcIndex)
                        }),
                        mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
                            baseMerge(object, source, srcIndex, customizer)
                        }),
                        omit = baseRest(function(object, props) {
                            return null == object ? {} : (props = arrayMap(baseFlatten(props, 1), toKey), basePick(object, baseDifference(getAllKeysIn(object), props)))
                        }),
                        pick = baseRest(function(object, props) {
                            return null == object ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey))
                        }),
                        toPairs = createToPairs(keys),
                        toPairsIn = createToPairs(keysIn),
                        camelCase = createCompounder(function(result, word, index) {
                            return word = word.toLowerCase(), result + (index ? capitalize(word) : word)
                        }),
                        kebabCase = createCompounder(function(result, word, index) {
                            return result + (index ? "-" : "") + word.toLowerCase()
                        }),
                        lowerCase = createCompounder(function(result, word, index) {
                            return result + (index ? " " : "") + word.toLowerCase()
                        }),
                        lowerFirst = createCaseFirst("toLowerCase"),
                        snakeCase = createCompounder(function(result, word, index) {
                            return result + (index ? "_" : "") + word.toLowerCase()
                        }),
                        startCase = createCompounder(function(result, word, index) {
                            return result + (index ? " " : "") + upperFirst(word)
                        }),
                        upperCase = createCompounder(function(result, word, index) {
                            return result + (index ? " " : "") + word.toUpperCase()
                        }),
                        upperFirst = createCaseFirst("toUpperCase"),
                        attempt = baseRest(function(func, args) {
                            try {
                                return apply(func, undefined, args)
                            } catch (e) {
                                return isError(e) ? e : new Error(e)
                            }
                        }),
                        bindAll = baseRest(function(object, methodNames) {
                            return arrayEach(baseFlatten(methodNames, 1), function(key) {
                                key = toKey(key), object[key] = bind(object[key], object)
                            }), object
                        }),
                        flow = createFlow(),
                        flowRight = createFlow(!0),
                        method = baseRest(function(path, args) {
                            return function(object) {
                                return baseInvoke(object, path, args)
                            }
                        }),
                        methodOf = baseRest(function(object, args) {
                            return function(path) {
                                return baseInvoke(object, path, args)
                            }
                        }),
                        over = createOver(arrayMap),
                        overEvery = createOver(arrayEvery),
                        overSome = createOver(arraySome),
                        range = createRange(),
                        rangeRight = createRange(!0),
                        add = createMathOperation(function(augend, addend) {
                            return augend + addend
                        }, 0),
                        ceil = createRound("ceil"),
                        divide = createMathOperation(function(dividend, divisor) {
                            return dividend / divisor
                        }, 1),
                        floor = createRound("floor"),
                        multiply = createMathOperation(function(multiplier, multiplicand) {
                            return multiplier * multiplicand
                        }, 1),
                        round = createRound("round"),
                        subtract = createMathOperation(function(minuend, subtrahend) {
                            return minuend - subtrahend
                        }, 0);
                    return lodash.after = after, lodash.ary = ary, lodash.assign = assign, lodash.assignIn = assignIn, lodash.assignInWith = assignInWith, lodash.assignWith = assignWith, lodash.at = at, lodash.before = before, lodash.bind = bind, lodash.bindAll = bindAll, lodash.bindKey = bindKey, lodash.castArray = castArray, lodash.chain = chain, lodash.chunk = chunk, lodash.compact = compact, lodash.concat = concat, lodash.cond = cond, lodash.conforms = conforms, lodash.constant = constant, lodash.countBy = countBy, lodash.create = create, lodash.curry = curry, lodash.curryRight = curryRight, lodash.debounce = debounce, lodash.defaults = defaults, lodash.defaultsDeep = defaultsDeep, lodash.defer = defer, lodash.delay = delay, lodash.difference = difference, lodash.differenceBy = differenceBy, lodash.differenceWith = differenceWith, lodash.drop = drop, lodash.dropRight = dropRight, lodash.dropRightWhile = dropRightWhile, lodash.dropWhile = dropWhile, lodash.fill = fill, lodash.filter = filter, lodash.flatMap = flatMap, lodash.flatMapDeep = flatMapDeep, lodash.flatMapDepth = flatMapDepth, lodash.flatten = flatten, lodash.flattenDeep = flattenDeep, lodash.flattenDepth = flattenDepth, lodash.flip = flip, lodash.flow = flow, lodash.flowRight = flowRight, lodash.fromPairs = fromPairs, lodash.functions = functions, lodash.functionsIn = functionsIn, lodash.groupBy = groupBy, lodash.initial = initial, lodash.intersection = intersection, lodash.intersectionBy = intersectionBy, lodash.intersectionWith = intersectionWith, lodash.invert = invert, lodash.invertBy = invertBy, lodash.invokeMap = invokeMap, lodash.iteratee = iteratee, lodash.keyBy = keyBy, lodash.keys = keys, lodash.keysIn = keysIn, lodash.map = map, lodash.mapKeys = mapKeys, lodash.mapValues = mapValues, lodash.matches = matches, lodash.matchesProperty = matchesProperty, lodash.memoize = memoize, lodash.merge = merge, lodash.mergeWith = mergeWith, lodash.method = method, lodash.methodOf = methodOf, lodash.mixin = mixin, lodash.negate = negate, lodash.nthArg = nthArg, lodash.omit = omit, lodash.omitBy = omitBy, lodash.once = once, lodash.orderBy = orderBy, lodash.over = over, lodash.overArgs = overArgs, lodash.overEvery = overEvery, lodash.overSome = overSome, lodash.partial = partial, lodash.partialRight = partialRight, lodash.partition = partition, lodash.pick = pick, lodash.pickBy = pickBy, lodash.property = property, lodash.propertyOf = propertyOf, lodash.pull = pull, lodash.pullAll = pullAll, lodash.pullAllBy = pullAllBy, lodash.pullAllWith = pullAllWith, lodash.pullAt = pullAt, lodash.range = range, lodash.rangeRight = rangeRight, lodash.rearg = rearg, lodash.reject = reject, lodash.remove = remove, lodash.rest = rest, lodash.reverse = reverse, lodash.sampleSize = sampleSize, lodash.set = set, lodash.setWith = setWith, lodash.shuffle = shuffle, lodash.slice = slice, lodash.sortBy = sortBy, lodash.sortedUniq = sortedUniq, lodash.sortedUniqBy = sortedUniqBy, lodash.split = split, lodash.spread = spread, lodash.tail = tail, lodash.take = take, lodash.takeRight = takeRight, lodash.takeRightWhile = takeRightWhile, lodash.takeWhile = takeWhile, lodash.tap = tap, lodash.throttle = throttle, lodash.thru = thru, lodash.toArray = toArray, lodash.toPairs = toPairs, lodash.toPairsIn = toPairsIn, lodash.toPath = toPath, lodash.toPlainObject = toPlainObject, lodash.transform = transform, lodash.unary = unary, lodash.union = union, lodash.unionBy = unionBy, lodash.unionWith = unionWith, lodash.uniq = uniq, lodash.uniqBy = uniqBy, lodash.uniqWith = uniqWith, lodash.unset = unset, lodash.unzip = unzip, lodash.unzipWith = unzipWith, lodash.update = update, lodash.updateWith = updateWith, lodash.values = values, lodash.valuesIn = valuesIn, lodash.without = without, lodash.words = words, lodash.wrap = wrap, lodash.xor = xor, lodash.xorBy = xorBy, lodash.xorWith = xorWith, lodash.zip = zip, lodash.zipObject = zipObject, lodash.zipObjectDeep = zipObjectDeep, lodash.zipWith = zipWith, lodash.entries = toPairs, lodash.entriesIn = toPairsIn, lodash.extend = assignIn, lodash.extendWith = assignInWith, mixin(lodash, lodash), lodash.add = add, lodash.attempt = attempt, lodash.camelCase = camelCase, lodash.capitalize = capitalize, lodash.ceil = ceil, lodash.clamp = clamp, lodash.clone = clone, lodash.cloneDeep = cloneDeep, lodash.cloneDeepWith = cloneDeepWith, lodash.cloneWith = cloneWith, lodash.conformsTo = conformsTo, lodash.deburr = deburr, lodash.defaultTo = defaultTo, lodash.divide = divide, lodash.endsWith = endsWith, lodash.eq = eq, lodash.escape = escape, lodash.escapeRegExp = escapeRegExp, lodash.every = every, lodash.find = find, lodash.findIndex = findIndex, lodash.findKey = findKey, lodash.findLast = findLast, lodash.findLastIndex = findLastIndex, lodash.findLastKey = findLastKey, lodash.floor = floor, lodash.forEach = forEach,
                        lodash.forEachRight = forEachRight, lodash.forIn = forIn, lodash.forInRight = forInRight, lodash.forOwn = forOwn, lodash.forOwnRight = forOwnRight, lodash.get = get, lodash.gt = gt, lodash.gte = gte, lodash.has = has, lodash.hasIn = hasIn, lodash.head = head, lodash.identity = identity, lodash.includes = includes, lodash.indexOf = indexOf, lodash.inRange = inRange, lodash.invoke = invoke, lodash.isArguments = isArguments, lodash.isArray = isArray, lodash.isArrayBuffer = isArrayBuffer, lodash.isArrayLike = isArrayLike, lodash.isArrayLikeObject = isArrayLikeObject, lodash.isBoolean = isBoolean, lodash.isBuffer = isBuffer, lodash.isDate = isDate, lodash.isElement = isElement, lodash.isEmpty = isEmpty, lodash.isEqual = isEqual, lodash.isEqualWith = isEqualWith, lodash.isError = isError, lodash.isFinite = isFinite, lodash.isFunction = isFunction, lodash.isInteger = isInteger, lodash.isLength = isLength, lodash.isMap = isMap, lodash.isMatch = isMatch, lodash.isMatchWith = isMatchWith, lodash.isNaN = isNaN, lodash.isNative = isNative, lodash.isNil = isNil, lodash.isNull = isNull, lodash.isNumber = isNumber, lodash.isObject = isObject, lodash.isObjectLike = isObjectLike, lodash.isPlainObject = isPlainObject, lodash.isRegExp = isRegExp, lodash.isSafeInteger = isSafeInteger, lodash.isSet = isSet, lodash.isString = isString, lodash.isSymbol = isSymbol, lodash.isTypedArray = isTypedArray, lodash.isUndefined = isUndefined, lodash.isWeakMap = isWeakMap, lodash.isWeakSet = isWeakSet, lodash.join = join, lodash.kebabCase = kebabCase, lodash.last = last, lodash.lastIndexOf = lastIndexOf, lodash.lowerCase = lowerCase, lodash.lowerFirst = lowerFirst, lodash.lt = lt, lodash.lte = lte, lodash.max = max, lodash.maxBy = maxBy, lodash.mean = mean, lodash.meanBy = meanBy, lodash.min = min, lodash.minBy = minBy, lodash.stubArray = stubArray, lodash.stubFalse = stubFalse, lodash.stubObject = stubObject, lodash.stubString = stubString, lodash.stubTrue = stubTrue, lodash.multiply = multiply, lodash.nth = nth, lodash.noConflict = noConflict, lodash.noop = noop, lodash.now = now, lodash.pad = pad, lodash.padEnd = padEnd, lodash.padStart = padStart, lodash.parseInt = parseInt, lodash.random = random, lodash.reduce = reduce, lodash.reduceRight = reduceRight, lodash.repeat = repeat, lodash.replace = replace, lodash.result = result, lodash.round = round, lodash.runInContext = runInContext, lodash.sample = sample, lodash.size = size, lodash.snakeCase = snakeCase, lodash.some = some, lodash.sortedIndex = sortedIndex, lodash.sortedIndexBy = sortedIndexBy, lodash.sortedIndexOf = sortedIndexOf, lodash.sortedLastIndex = sortedLastIndex, lodash.sortedLastIndexBy = sortedLastIndexBy, lodash.sortedLastIndexOf = sortedLastIndexOf, lodash.startCase = startCase, lodash.startsWith = startsWith, lodash.subtract = subtract, lodash.sum = sum, lodash.sumBy = sumBy, lodash.template = template, lodash.times = times, lodash.toFinite = toFinite, lodash.toInteger = toInteger, lodash.toLength = toLength, lodash.toLower = toLower, lodash.toNumber = toNumber, lodash.toSafeInteger = toSafeInteger, lodash.toString = toString, lodash.toUpper = toUpper, lodash.trim = trim, lodash.trimEnd = trimEnd, lodash.trimStart = trimStart, lodash.truncate = truncate, lodash.unescape = unescape, lodash.uniqueId = uniqueId, lodash.upperCase = upperCase, lodash.upperFirst = upperFirst, lodash.each = forEach, lodash.eachRight = forEachRight, lodash.first = head, mixin(lodash, function() {
                            var source = {};
                            return baseForOwn(lodash, function(func, methodName) {
                                hasOwnProperty.call(lodash.prototype, methodName) || (source[methodName] = func)
                            }), source
                        }(), {
                            chain: !1
                        }), lodash.VERSION = VERSION, arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
                            lodash[methodName].placeholder = lodash
                        }), arrayEach(["drop", "take"], function(methodName, index) {
                            LazyWrapper.prototype[methodName] = function(n) {
                                var filtered = this.__filtered__;
                                if (filtered && !index) return new LazyWrapper(this);
                                n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
                                var result = this.clone();
                                return filtered ? result.__takeCount__ = nativeMin(n, result.__takeCount__) : result.__views__.push({
                                    size: nativeMin(n, MAX_ARRAY_LENGTH),
                                    type: methodName + (result.__dir__ < 0 ? "Right" : "")
                                }), result
                            }, LazyWrapper.prototype[methodName + "Right"] = function(n) {
                                return this.reverse()[methodName](n).reverse()
                            }
                        }), arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
                            var type = index + 1,
                                isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
                            LazyWrapper.prototype[methodName] = function(iteratee) {
                                var result = this.clone();
                                return result.__iteratees__.push({
                                    iteratee: getIteratee(iteratee, 3),
                                    type: type
                                }), result.__filtered__ = result.__filtered__ || isFilter, result
                            }
                        }), arrayEach(["head", "last"], function(methodName, index) {
                            var takeName = "take" + (index ? "Right" : "");
                            LazyWrapper.prototype[methodName] = function() {
                                return this[takeName](1).value()[0]
                            }
                        }), arrayEach(["initial", "tail"], function(methodName, index) {
                            var dropName = "drop" + (index ? "" : "Right");
                            LazyWrapper.prototype[methodName] = function() {
                                return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1)
                            }
                        }), LazyWrapper.prototype.compact = function() {
                            return this.filter(identity)
                        }, LazyWrapper.prototype.find = function(predicate) {
                            return this.filter(predicate).head()
                        }, LazyWrapper.prototype.findLast = function(predicate) {
                            return this.reverse().find(predicate)
                        }, LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
                            return "function" == typeof path ? new LazyWrapper(this) : this.map(function(value) {
                                return baseInvoke(value, path, args)
                            })
                        }), LazyWrapper.prototype.reject = function(predicate) {
                            return this.filter(negate(getIteratee(predicate)))
                        }, LazyWrapper.prototype.slice = function(start, end) {
                            start = toInteger(start);
                            var result = this;
                            return result.__filtered__ && (start > 0 || end < 0) ? new LazyWrapper(result) : (start < 0 ? result = result.takeRight(-start) : start && (result = result.drop(start)), end !== undefined && (end = toInteger(end), result = end < 0 ? result.dropRight(-end) : result.take(end - start)), result)
                        }, LazyWrapper.prototype.takeRightWhile = function(predicate) {
                            return this.reverse().takeWhile(predicate).reverse()
                        }, LazyWrapper.prototype.toArray = function() {
                            return this.take(MAX_ARRAY_LENGTH)
                        }, baseForOwn(LazyWrapper.prototype, function(func, methodName) {
                            var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
                                isTaker = /^(?:head|last)$/.test(methodName),
                                lodashFunc = lodash[isTaker ? "take" + ("last" == methodName ? "Right" : "") : methodName],
                                retUnwrapped = isTaker || /^find/.test(methodName);
                            lodashFunc && (lodash.prototype[methodName] = function() {
                                var value = this.__wrapped__,
                                    args = isTaker ? [1] : arguments,
                                    isLazy = value instanceof LazyWrapper,
                                    iteratee = args[0],
                                    useLazy = isLazy || isArray(value),
                                    interceptor = function(value) {
                                        var result = lodashFunc.apply(lodash, arrayPush([value], args));
                                        return isTaker && chainAll ? result[0] : result
                                    };
                                useLazy && checkIteratee && "function" == typeof iteratee && 1 != iteratee.length && (isLazy = useLazy = !1);
                                var chainAll = this.__chain__,
                                    isHybrid = !!this.__actions__.length,
                                    isUnwrapped = retUnwrapped && !chainAll,
                                    onlyLazy = isLazy && !isHybrid;
                                if (!retUnwrapped && useLazy) {
                                    value = onlyLazy ? value : new LazyWrapper(this);
                                    var result = func.apply(value, args);
                                    return result.__actions__.push({
                                        func: thru,
                                        args: [interceptor],
                                        thisArg: undefined
                                    }), new LodashWrapper(result, chainAll)
                                }
                                return isUnwrapped && onlyLazy ? func.apply(this, args) : (result = this.thru(interceptor), isUnwrapped ? isTaker ? result.value()[0] : result.value() : result)
                            })
                        }), arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
                            var func = arrayProto[methodName],
                                chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru",
                                retUnwrapped = /^(?:pop|shift)$/.test(methodName);
                            lodash.prototype[methodName] = function() {
                                var args = arguments;
                                if (retUnwrapped && !this.__chain__) {
                                    var value = this.value();
                                    return func.apply(isArray(value) ? value : [], args)
                                }
                                return this[chainName](function(value) {
                                    return func.apply(isArray(value) ? value : [], args)
                                })
                            }
                        }), baseForOwn(LazyWrapper.prototype, function(func, methodName) {
                            var lodashFunc = lodash[methodName];
                            if (lodashFunc) {
                                var key = lodashFunc.name + "";
                                (realNames[key] || (realNames[key] = [])).push({
                                    name: methodName,
                                    func: lodashFunc
                                })
                            }
                        }), realNames[createHybrid(undefined, BIND_KEY_FLAG).name] = [{
                            name: "wrapper",
                            func: undefined
                        }], LazyWrapper.prototype.clone = lazyClone, LazyWrapper.prototype.reverse = lazyReverse, LazyWrapper.prototype.value = lazyValue, lodash.prototype.at = wrapperAt, lodash.prototype.chain = wrapperChain, lodash.prototype.commit = wrapperCommit, lodash.prototype.next = wrapperNext, lodash.prototype.plant = wrapperPlant, lodash.prototype.reverse = wrapperReverse, lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue, lodash.prototype.first = lodash.prototype.head, iteratorSymbol && (lodash.prototype[iteratorSymbol] = wrapperToIterator), lodash
                }
                var undefined, VERSION = "4.14.0",
                    LARGE_ARRAY_SIZE = 200,
                    FUNC_ERROR_TEXT = "Expected a function",
                    HASH_UNDEFINED = "__lodash_hash_undefined__",
                    PLACEHOLDER = "__lodash_placeholder__",
                    BIND_FLAG = 1,
                    BIND_KEY_FLAG = 2,
                    CURRY_BOUND_FLAG = 4,
                    CURRY_FLAG = 8,
                    CURRY_RIGHT_FLAG = 16,
                    PARTIAL_FLAG = 32,
                    PARTIAL_RIGHT_FLAG = 64,
                    ARY_FLAG = 128,
                    REARG_FLAG = 256,
                    FLIP_FLAG = 512,
                    UNORDERED_COMPARE_FLAG = 1,
                    PARTIAL_COMPARE_FLAG = 2,
                    DEFAULT_TRUNC_LENGTH = 30,
                    DEFAULT_TRUNC_OMISSION = "...",
                    HOT_COUNT = 150,
                    HOT_SPAN = 16,
                    LAZY_FILTER_FLAG = 1,
                    LAZY_MAP_FLAG = 2,
                    LAZY_WHILE_FLAG = 3,
                    INFINITY = 1 / 0,
                    MAX_SAFE_INTEGER = 9007199254740991,
                    MAX_INTEGER = 1.7976931348623157e308,
                    NAN = NaN,
                    MAX_ARRAY_LENGTH = 4294967295,
                    MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
                    HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1,
                    wrapFlags = [
                        ["ary", ARY_FLAG],
                        ["bind", BIND_FLAG],
                        ["bindKey", BIND_KEY_FLAG],
                        ["curry", CURRY_FLAG],
                        ["curryRight", CURRY_RIGHT_FLAG],
                        ["flip", FLIP_FLAG],
                        ["partial", PARTIAL_FLAG],
                        ["partialRight", PARTIAL_RIGHT_FLAG],
                        ["rearg", REARG_FLAG]
                    ],
                    argsTag = "[object Arguments]",
                    arrayTag = "[object Array]",
                    boolTag = "[object Boolean]",
                    dateTag = "[object Date]",
                    errorTag = "[object Error]",
                    funcTag = "[object Function]",
                    genTag = "[object GeneratorFunction]",
                    mapTag = "[object Map]",
                    numberTag = "[object Number]",
                    objectTag = "[object Object]",
                    promiseTag = "[object Promise]",
                    regexpTag = "[object RegExp]",
                    setTag = "[object Set]",
                    stringTag = "[object String]",
                    symbolTag = "[object Symbol]",
                    weakMapTag = "[object WeakMap]",
                    weakSetTag = "[object WeakSet]",
                    arrayBufferTag = "[object ArrayBuffer]",
                    dataViewTag = "[object DataView]",
                    float32Tag = "[object Float32Array]",
                    float64Tag = "[object Float64Array]",
                    int8Tag = "[object Int8Array]",
                    int16Tag = "[object Int16Array]",
                    int32Tag = "[object Int32Array]",
                    uint8Tag = "[object Uint8Array]",
                    uint8ClampedTag = "[object Uint8ClampedArray]",
                    uint16Tag = "[object Uint16Array]",
                    uint32Tag = "[object Uint32Array]",
                    reEmptyStringLeading = /\b__p \+= '';/g,
                    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
                    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                    reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
                    reUnescapedHtml = /[&<>"'`]/g,
                    reHasEscapedHtml = RegExp(reEscapedHtml.source),
                    reHasUnescapedHtml = RegExp(reUnescapedHtml.source),
                    reEscape = /<%-([\s\S]+?)%>/g,
                    reEvaluate = /<%([\s\S]+?)%>/g,
                    reInterpolate = /<%=([\s\S]+?)%>/g,
                    reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                    reIsPlainProp = /^\w*$/,
                    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g,
                    reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
                    reHasRegExpChar = RegExp(reRegExpChar.source),
                    reTrim = /^\s+|\s+$/g,
                    reTrimStart = /^\s+/,
                    reTrimEnd = /\s+$/,
                    reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
                    reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
                    reSplitDetails = /,? & /,
                    reBasicWord = /[a-zA-Z0-9]+/g,
                    reEscapeChar = /\\(\\)?/g,
                    reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                    reFlags = /\w*$/,
                    reHasHexPrefix = /^0x/i,
                    reIsBadHex = /^[-+]0x[0-9a-f]+$/i,
                    reIsBinary = /^0b[01]+$/i,
                    reIsHostCtor = /^\[object .+?Constructor\]$/,
                    reIsOctal = /^0o[0-7]+$/i,
                    reIsUint = /^(?:0|[1-9]\d*)$/,
                    reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
                    reNoMatch = /($^)/,
                    reUnescapedString = /['\n\r\u2028\u2029\\]/g,
                    rsBreakRange = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
                    rsBreak = "[" + rsBreakRange + "]",
                    rsCombo = "[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]",
                    rsLower = "[a-z\\xdf-\\xf6\\xf8-\\xff]",
                    rsMisc = "[^\\ud800-\\udfff" + rsBreakRange + "\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",
                    rsFitz = "\\ud83c[\\udffb-\\udfff]",
                    rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
                    rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
                    rsUpper = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
                    rsLowerMisc = "(?:" + rsLower + "|" + rsMisc + ")",
                    reOptMod = "(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?",
                    rsOptJoin = "(?:\\u200d(?:" + ["[^\\ud800-\\udfff]", rsRegional, rsSurrPair].join("|") + ")[\\ufe0e\\ufe0f]?" + reOptMod + ")*",
                    rsSeq = "[\\ufe0e\\ufe0f]?" + reOptMod + rsOptJoin,
                    rsEmoji = "(?:" + ["[\\u2700-\\u27bf]", rsRegional, rsSurrPair].join("|") + ")" + rsSeq,
                    rsSymbol = "(?:" + ["[^\\ud800-\\udfff]" + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, "[\\ud800-\\udfff]"].join("|") + ")",
                    reApos = RegExp("['’]", "g"),
                    reComboMark = RegExp(rsCombo, "g"),
                    reComplexSymbol = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g"),
                    reComplexWord = RegExp([rsUpper + "?" + rsLower + "+(?:['’](?:d|ll|m|re|s|t|ve))?(?=" + [rsBreak, rsUpper, "$"].join("|") + ")", "(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=" + [rsBreak, rsUpper + rsLowerMisc, "$"].join("|") + ")", rsUpper + "?" + rsLowerMisc + "+(?:['’](?:d|ll|m|re|s|t|ve))?", rsUpper + "+(?:['’](?:D|LL|M|RE|S|T|VE))?", "\\d+", rsEmoji].join("|"), "g"),
                    reHasComplexSymbol = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),
                    reHasComplexWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
                    contextProps = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "Reflect", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"],
                    templateCounter = -1,
                    typedArrayTags = {};
                typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0, typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = !1;
                var cloneableTags = {};
                cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = !0, cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = !1;
                var deburredLetters = {
                        "À": "A",
                        "Á": "A",
                        "Â": "A",
                        "Ã": "A",
                        "Ä": "A",
                        "Å": "A",
                        "à": "a",
                        "á": "a",
                        "â": "a",
                        "ã": "a",
                        "ä": "a",
                        "å": "a",
                        "Ç": "C",
                        "ç": "c",
                        "Ð": "D",
                        "ð": "d",
                        "È": "E",
                        "É": "E",
                        "Ê": "E",
                        "Ë": "E",
                        "è": "e",
                        "é": "e",
                        "ê": "e",
                        "ë": "e",
                        "Ì": "I",
                        "Í": "I",
                        "Î": "I",
                        "Ï": "I",
                        "ì": "i",
                        "í": "i",
                        "î": "i",
                        "ï": "i",
                        "Ñ": "N",
                        "ñ": "n",
                        "Ò": "O",
                        "Ó": "O",
                        "Ô": "O",
                        "Õ": "O",
                        "Ö": "O",
                        "Ø": "O",
                        "ò": "o",
                        "ó": "o",
                        "ô": "o",
                        "õ": "o",
                        "ö": "o",
                        "ø": "o",
                        "Ù": "U",
                        "Ú": "U",
                        "Û": "U",
                        "Ü": "U",
                        "ù": "u",
                        "ú": "u",
                        "û": "u",
                        "ü": "u",
                        "Ý": "Y",
                        "ý": "y",
                        "ÿ": "y",
                        "Æ": "Ae",
                        "æ": "ae",
                        "Þ": "Th",
                        "þ": "th",
                        "ß": "ss"
                    },
                    htmlEscapes = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;",
                        "`": "&#96;"
                    },
                    htmlUnescapes = {
                        "&amp;": "&",
                        "&lt;": "<",
                        "&gt;": ">",
                        "&quot;": '"',
                        "&#39;": "'",
                        "&#96;": "`"
                    },
                    stringEscapes = {
                        "\\": "\\",
                        "'": "'",
                        "\n": "n",
                        "\r": "r",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                    freeParseFloat = parseFloat,
                    freeParseInt = parseInt,
                    freeGlobal = "object" == typeof global && global && global.Object === Object && global,
                    freeSelf = "object" == typeof self && self && self.Object === Object && self,
                    root = freeGlobal || freeSelf || Function("return this")(),
                    freeExports = freeGlobal && "object" == typeof exports && exports,
                    freeModule = freeExports && "object" == typeof module && module,
                    moduleExports = freeModule && freeModule.exports === freeExports,
                    freeProcess = moduleExports && freeGlobal.process,
                    nodeUtil = function() {
                        try {
                            return freeProcess && freeProcess.binding("util")
                        } catch (e) {}
                    }(),
                    nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
                    nodeIsDate = nodeUtil && nodeUtil.isDate,
                    nodeIsMap = nodeUtil && nodeUtil.isMap,
                    nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
                    nodeIsSet = nodeUtil && nodeUtil.isSet,
                    nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray,
                    deburrLetter = basePropertyOf(deburredLetters),
                    escapeHtmlChar = basePropertyOf(htmlEscapes),
                    unescapeHtmlChar = basePropertyOf(htmlUnescapes),
                    _ = runInContext();
                "function" == typeof undefined && "object" == typeof define.amd && define.amd ? (root._ = _, define(function() {
                    return _
                })) : freeModule ? ((freeModule.exports = _)._ = _, freeExports._ = _) : root._ = _
            }).call(this)
        }($__require("@empty").Buffer, $__require("@empty"))
    }), $__System.registerDynamic("4c", ["4b"], !0, function($__require, exports, module) {
        this || self;
        module.exports = $__require("4b")
    }), $__System.register("1", ["10", "49", "d", "e", "a", "b", "4a", "4c"], function(_export) {
        function notify(message, url) {
            var extensionID = window.localStorage.getItem("extensionID"),
                baseUrl = "chrome-extension://" + extensionID,
                notification = new Notification("Mind The Word", {
                    icon: baseUrl + "/assets/img/48.png",
                    body: message
                });
            notification.onclick = function() {
                window.open(url), this.close()
            }, setTimeout(function() {
                notification.close()
            }, 1e4)
        }

        function generateInteval() {
            return 1e3 * (Math.pow(2, attempts) - 1)
        }

        function testConnection(url) {
            var xhr = new XMLHttpRequest;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) return "" == xhr.statusText ? (time = generateInteval(attempts), attempts++, reset = !0, void connection("fail", url, time)) : void connection("success", url)
            }, xhr.open("GET", url), xhr.send()
        }

        function connection(status) {
            var url = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1],
                time = arguments.length <= 2 || void 0 === arguments[2] ? "" : arguments[2],
                tempTime = parseInt(time / 1e3),
                mtwReconnectTime = document.getElementById("mtw-reconnect-time"),
                mtwConnectionHead = document.getElementById("mtw-connection-head"),
                mtwReconnect = document.getElementById("mtw-reconnect-now");
            if ("success" == status) mtwConnectionHead && mtwConnectionHead.parentNode.removeChild(mtwConnectionHead);
            else if (mtwConnectionHead) clearInterval(timer), "fail" == status ? timer = setInterval(function() {
                if (0 == tempTime) return mtwReconnectTime.innerHTML = "Connecting", mtwReconnect.style.display = "none", testConnection(url), void clearInterval(timer);
                mtwReconnectTime.innerHTML = "Could not connect to Translator Service Reconnecting in " + tempTime + "s  &nbsp;....&nbsp;", mtwReconnect.style.display = "inline", tempTime--
            }, 1e3) : (mtwReconnectTime.innerHTML = "Connection Successful", mtwReconnect.style.display = "none", mtwConnectionHead.style.background = "green", setTimeout(function() {
                mtwConnectionHead.parentNode.removeChild(mtwConnectionHead)
            }, 500));
            else {
                mtwConnectionHead = document.createElement("div");
                mtwConnectionHead.setAttribute("id", "mtw-connection-head"), mtwConnectionHead.setAttribute("style", "position: fixed; top:0;width: 100%; display: flex; justify-content: center; align-items: center; background: red; padding: 0.5em 0; color: white !important; font-size: 0.9em; z-index: 1000;"), mtwConnectionHead.innerHTML = '<div><strong>MTW:</strong>  <span id="mtw-reconnect-time">Could not connect to Translator Service Reconnecting in ' + tempTime + 's  &nbsp;....&nbsp;</span><span id="mtw-reconnect-now"  style="cursor:pointer;"><strong>Reconnect Now</strong></span> </div> <span id="mtw-connection-cross" style="position: absolute; right: 1em; font-size: 1.2em;cursor:pointer;">✕</span> </div>', "fail" == status && document.querySelector("body").appendChild(mtwConnectionHead), mtwReconnectTime = document.getElementById("mtw-reconnect-time"), mtwReconnect = document.getElementById("mtw-reconnect-now"), mtwConnectCross = document.getElementById("mtw-connection-cross");
                try {
                    mtwReconnect.addEventListener("click", function() {
                        attempts = 1, mtwReconnectTime.innerHTML = "Connecting", mtwReconnect.style.display = "none", testConnection(url)
                    }), mtwConnectCross.addEventListener("click", function() {
                        attempts = 1, mtwConnectionHead.parentNode.removeChild(mtwConnectionHead)
                    })
                } catch (e) {
                    console.log(e)
                }
                testConnection(url)
            }
        }
        var BingTranslate, GoogleTranslate, _createClass, _classCallCheck, _Object$keys, YandexTranslate, getCurrentMonth, getCurrentDay, _, ContentScript, MTWTranslator, attempts, time, timer;
        return {
            setters: [function(_2) {
                BingTranslate = _2.BingTranslate
            }, function(_3) {
                GoogleTranslate = _3.GoogleTranslate
            }, function(_d) {
                _createClass = _d.default
            }, function(_e) {
                _classCallCheck = _e.default
            }, function(_a) {
                _Object$keys = _a.default
            }, function(_b) {
                YandexTranslate = _b.YandexTranslate
            }, function(_a2) {
                getCurrentMonth = _a2.getCurrentMonth, getCurrentDay = _a2.getCurrentDay
            }, function(_c) {
                _ = _c.default
            }],
            execute: function() {
                "use strict";
                ContentScript = function() {
                    function ContentScript() {
                        _classCallCheck(this, ContentScript), this.srcLang = "", this.targetLang = "", this.ngramMin = 1, this.ngramMax = 1, this.tMap = {}, this.filteredTMap = {}, this.selectedRegion = {}, this.wordToggles = 0
                    }
                    return _createClass(ContentScript, [{
                        key: "translate",
                        value: function() {
                            var _this = this;
                            chrome.storage.local.get(null, function(res) {
                                if (window.localStorage.setItem("extensionID", res.extensionID), !0 === res.activation) {
                                    _this.ngramMin = res.ngramMin, _this.ngramMax = res.ngramMax, _this.srcLang = res.sourceLanguage, _this.targetLanguage = res.targetLanguage, _this.userDefinedTranslations = JSON.parse(res.userDefinedTranslations), _this.translationProbability = res.translationProbability, _this.userBlacklistedWords = res.userBlacklistedWords, _this.translator = res.translatorService, _this.yandexTranslatorApiKey = res.yandexTranslatorApiKey, _this.bingTranslatorApiKey = res.bingTranslatorApiKey, _this.googleTranslatorApiKey = res.googleTranslatorApiKey, _this.translated = !0, _this.difficultyBuckets = res.difficultyBuckets, _this.learntWords = res.learntWords, _this.userDefinedOnly = res.userDefinedOnly, _this.stats = res.stats, _this.wordToggles = res.wordToggles, _this.autoBlacklist = res.autoBlacklist, _this.oneWordTranslation = res.oneWordTranslation;
                                    if (new RegExp(res.blacklist).test(document.URL) && "()" !== res.blacklist) console.log("[MTW] Blacklisted website");
                                    else if (!0 === res.doNotTranslate) console.log("[MTW] Do Not Translate selected.");
                                    else if ("" !== _this.srcLang && "" !== _this.targetLanguage || !1 !== _this.userDefinedOnly) {
                                        _this.injectCSS(res.translatedWordStyle);
                                        var filteredWords, countedWords = _this.getAllWords(_this.ngramMin, _this.ngramMax);
                                        if (!0 === _this.userDefinedOnly) {
                                            filteredWords = _this.filterToUserDefined(countedWords, _this.translationProbability, _this.userDefinedTranslations, _this.userBlacklistedWords);
                                            var tMap = {};
                                            for (var word in filteredWords) tMap[word] = _this.userDefinedTranslations[word];
                                            _this.processTranslations(tMap, _this.userDefinedTranslations)
                                        } else {
                                            filteredWords = _this.filter(countedWords, _this.translationProbability, _this.userDefinedTranslations, _this.userBlacklistedWords);
                                            var translator = _this.getTranslator();
                                            testConnection(translator.url), translator.getTranslations(filteredWords).then(function(tMap) {
                                                _this.processTranslations(tMap, _this.userDefinedTranslations)
                                            }).catch(function(e) {
                                                console.error("[MTW]", e)
                                            })
                                        }
                                    } else console.log("[MTW] No active pattern. Please select a pattern in the options page.")
                                } else console.log("[MTW] Switched off")
                            })
                        }
                    }, {
                        key: "getTranslator",
                        value: function() {
                            var translatorObject = {};
                            switch (this.translator) {
                                case "Yandex":
                                    translatorObject = new YandexTranslate(this.yandexTranslatorApiKey, this.srcLang, this.targetLanguage);
                                    break;
                                case "Bing":
                                    translatorObject = new BingTranslate(this.bingTranslatorApiKey, this.srcLang, this.targetLanguage);
                                    break;
                                case "Google":
                                    translatorObject = new GoogleTranslate(this.googleTranslatorApiKey, this.srcLang, this.targetLanguage);
                                    break;
                                default:
                                    console.error("No such translator supported")
                            }
                            return translatorObject
                        }
                    }, {
                        key: "injectCSS",
                        value: function(cssStyle) {
                            try {
                                var style = document.createElement("link");
                                style.rel = "stylesheet", style.type = "text/css", style.href = chrome.extension.getURL("/assets/css/MTWStyles.css"), document.getElementsByTagName("head")[0].appendChild(style);
                                var mtwStyle = document.createElement("style");
                                document.head.appendChild(mtwStyle), mtwStyle.sheet.insertRule("span.mtwTranslatedWord {" + cssStyle + "}", 0)
                            } catch (e) {
                                console.debug(e)
                            }
                        }
                    }, {
                        key: "getAllWords",
                        value: function(ngramMin, ngramMax) {
                            var countedWords = {},
                                paragraphs = document.querySelectorAll("p,div,a");
                            console.log("Getting words from all " + paragraphs.length + " paragraphs");
                            for (var i = 0; i < paragraphs.length; i++) {
                                var words = paragraphs[i].innerText;
                                words = this.clkTest(words) ? words.replace(/\d|\s|[()]/g, "").split("").filter(function(v) {
                                    return "" != v
                                }) : words.split(/\s|,|[.()]|\d/g);
                                for (var j = 0; j < words.length; j++)
                                    for (var b = ngramMin; b <= ngramMax; b++) {
                                        var word = words.slice(j, j + b).join(" ");
                                        word in countedWords || (countedWords[word] = 0), countedWords[word] += 1
                                    }
                            }
                            return countedWords
                        }
                    }, {
                        key: "filterToUserDefined",
                        value: function(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
                            var a = (new RegExp(userBlacklistedWords), this.toList(userDefinedTranslations, function(word, count) {
                                    return 1
                                })),
                                b = this.toList(countedWords, function(word, count) {
                                    return 1
                                }),
                                countedWordsList = this.intersect(a, b);
                            return this.toMap(countedWordsList)
                        }
                    }, {
                        key: "filter",
                        value: function(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
                            var _this2 = this,
                                blackListReg = new RegExp(userBlacklistedWords),
                                punctuationReg = new RegExp(/[\.,\/#\!\$%\^&\*;:{}=\\\_`~()\?@\d\+\-]/g),
                                countedWordsList = this.shuffle(this.toList(countedWords, function(word, count) {
                                    return _this2.clkTest(word) ? !(!word || "" === word || /\d/.test(word) || blackListReg.test(word.toLowerCase()) || punctuationReg.test(word.toLowerCase())) : "" !== word && !/\d/.test(word) && !blackListReg.test(word.toLowerCase()) && !punctuationReg.test(word.toLowerCase())
                                })),
                                targetLength = Math.floor(_Object$keys(countedWordsList).length * translationProbability / 100);
                            return this.toMap(countedWordsList.slice(0, targetLength - 1))
                        }
                    }, {
                        key: "containsIllegalCharacters",
                        value: function(s) {
                            return /[0-9{}.,;:]/.test(s)
                        }
                    }, {
                        key: "processTranslations",
                        value: function(translationMap, userDefinedTMap) {
                            var _this3 = this,
                                filteredTMap = {};
                            for (var w in translationMap) w === translationMap[w] || "" === translationMap[w] || userDefinedTMap[w] || this.containsIllegalCharacters(translationMap[w]) || (filteredTMap[w] = translationMap[w]);
                            for (w in userDefinedTMap) w !== userDefinedTMap[w] && (filteredTMap[w] = userDefinedTMap[w]);
                            this.learntWords.length > 2 && function() {
                                var learntWordsReg = new RegExp(_this3.learntWords);
                                _Object$keys(filteredTMap).forEach(function(key) {
                                    learntWordsReg.test(filteredTMap[key].toLowerCase()) && delete filteredTMap[key]
                                })
                            }(), this.filteredTMap = filteredTMap, chrome.storage.local.set({
                                translatedWordsForQuiz: JSON.stringify(this.filteredTMap)
                            });
                            var numberOfTranslatedWords = _Object$keys(filteredTMap).length,
                                numberOfTranslatedCharacters = 0;
                            _Object$keys(filteredTMap).forEach(function(e, i) {
                                numberOfTranslatedCharacters += e.length
                            }), this.stats.totalWordsTranslated += numberOfTranslatedWords;
                            var currentMonth = getCurrentMonth(),
                                currentDay = getCurrentDay();
                            if (currentMonth in this.stats.translatorWiseWordCount[0] || (this.stats.translatorWiseWordCount[0] = {}, this.stats.translatorWiseWordCount[0][currentMonth] = {
                                    Yandex: [0, 0, 0],
                                    Google: [0, 0, 0],
                                    Bing: [0, 0, 0]
                                }), currentDay in this.stats.translatorWiseWordCount[1] || (this.stats.translatorWiseWordCount[1] = {}, this.stats.translatorWiseWordCount[1][currentDay] = {
                                    Yandex: [0, 0, 0],
                                    Google: [0, 0, 0],
                                    Bing: [0, 0, 0]
                                }), this.userDefinedOnly || (this.stats.translatorWiseWordCount[0][currentMonth][this.translator][0] += numberOfTranslatedWords, this.stats.translatorWiseWordCount[0][currentMonth][this.translator][1] += numberOfTranslatedCharacters, this.stats.translatorWiseWordCount[0][currentMonth][this.translator][2] += numberOfTranslatedCharacters, this.stats.translatorWiseWordCount[1][currentDay][this.translator][0] += numberOfTranslatedWords, this.stats.translatorWiseWordCount[1][currentDay][this.translator][1] += numberOfTranslatedCharacters, this.stats.translatorWiseWordCount[1][currentDay][this.translator][2] += numberOfTranslatedCharacters, chrome.storage.local.set({
                                    stats: this.stats
                                })), chrome.storage.local.get(["savedPatterns"], function(result) {
                                    for (var savedPatterns = JSON.parse(result.savedPatterns), i = 0; i < savedPatterns.length; i++)
                                        if (savedPatterns[i][3]) {
                                            savedPatterns[i][5] += numberOfTranslatedWords, chrome.storage.local.set({
                                                savedPatterns: JSON.stringify(savedPatterns)
                                            });
                                            break
                                        }
                                }), 0 !== _Object$keys(filteredTMap).length) {
                                var paragraphs = document.querySelectorAll("p,div,a");
                                if (this.oneWordTranslation)
                                    for (var i = 0; i < paragraphs.length; i++) this.translateOneWord(paragraphs[i], filteredTMap, this.invertMap(filteredTMap));
                                else
                                    for (var i = 0; i < paragraphs.length; i++) this.deepHTMLReplacement(paragraphs[i], filteredTMap, this.invertMap(filteredTMap))
                            }
                            for (var translatedWords = document.querySelectorAll(".mtwTranslatedWord, .mtwTranslatedWorde, .mtwTranslatedWordn, .mtwTranslatedWordh"), _i = 0; _i < translatedWords.length; _i++) translatedWords[_i].addEventListener("click", function() {
                                _this3.toggleElement(event, _this3.wordToggles, _this3.autoBlacklist)
                            }, !1)
                        }
                    }, {
                        key: "translateOneWord",
                        value: function(paragraph, filteredTMap, iMap) {
                            for (var i in paragraph.childNodes)
                                if (3 === paragraph.childNodes[i].nodeType && !/^\s*$/.test(paragraph.childNodes[i].textContent)) {
                                    var sentences = paragraph.childNodes[i].textContent.split(".");
                                    for (var j in sentences) {
                                        var words = sentences[j].split(" ");
                                        words = _.shuffle(words);
                                        for (var k in words)
                                            if (filteredTMap[words[k]]) {
                                                var x = sentences[j].replace(words[k], iMap[filteredTMap[words[k]]]);
                                                sentences[j] = x;
                                                break
                                            }
                                    }
                                    var newNode = document.createElement("span");
                                    newNode.innerHTML = sentences.join("."), paragraph.replaceChild(newNode, paragraph.childNodes[i])
                                }
                        }
                    }, {
                        key: "toggleElement",
                        value: function(event, wordToggles, autoBlacklist) {
                            var target = event.target,
                                word = target.innerHTML,
                                original = target.dataset.original,
                                newword = word === target.dataset.translated ? target.dataset.original : target.dataset.translated;
                            autoBlacklist && chrome.storage.local.get("toggleFrequency", function(data) {
                                if (data = JSON.parse(data.toggleFrequency), original in data) data[original] > wordToggles ? (chrome.storage.local.get("userBlacklistedWords", function(result) {
                                    var blacklistedWords = result.userBlacklistedWords.slice(1, -1).split("|"); - 1 === blacklistedWords.indexOf(original) && (blacklistedWords.push(original), chrome.storage.local.set({
                                        userBlacklistedWords: "(" + blacklistedWords.join("|") + ")"
                                    }))
                                }), delete data.original) : data[original] += 1;
                                else if (_Object$keys(data).length >= 100) {
                                    var min = 1 / 0,
                                        lowest = "";
                                    for (var _word in data) data[_word] < min && (min = data[_word], lowest = _word);
                                    delete data[lowest], data[original] = 1
                                } else data[original] = 1;
                                chrome.storage.local.set({
                                    toggleFrequency: JSON.stringify(data)
                                })
                            }), target.innerHTML = newword
                        }
                    }, {
                        key: "deepHTMLReplacement",
                        value: function(node, tMap, iTMap) {
                            var badTags = ["TEXTAREA", "INPUT", "SCRIPT", "CODE", "SPAN"];
                            if (node.nodeType === Node.TEXT_NODE) {
                                var newNodeValue;
                                if ((newNodeValue = "zh" == this.targetLanguage ? this.replaceAll(node.nodeValue, tMap) : this.clkTest(node.nodeValue) ? this.replaceAllClk(node.nodeValue, tMap) : this.replaceAll(node.nodeValue, tMap)) !== node.nodeValue) {
                                    node.nodeValue = newNodeValue;
                                    var parent = node.parentNode;
                                    "zh" == this.targetLanguage ? parent.innerHTML = this.replaceAll(parent.innerHTML, iTMap) : this.clkTest(node.nodeValue) ? parent.innerHTML = this.replaceAllClk(parent.innerHTML, iTMap) : parent.innerHTML = this.replaceAll(parent.innerHTML, iTMap)
                                }
                            } else if (node.nodeType === Node.ELEMENT_NODE && badTags.indexOf(node.tagName) <= -1 && "mtwTranslatedWord" != node.className)
                                for (var innerNodes = node.childNodes, index = 0; index < innerNodes.length; index++) this.deepHTMLReplacement(innerNodes[index], tMap, iTMap)
                        }
                    }, {
                        key: "replaceAll",
                        value: function(text, translationMap) {
                            var _this4 = this;
                            if (text.includes('class="mtwTranslatedWord"') || text.includes("<span") || text.includes("<a")) return text;
                            var rExp = "";
                            _Object$keys(translationMap).sort(function(w1, w2) {
                                return w2.length - w1.length
                            }).forEach(function(sourceWord) {
                                rExp += "(\\s" + _this4.escapeRegExp(sourceWord) + "\\s)|"
                            }), rExp = rExp.substring(0, rExp.length - 1);
                            var regExp = new RegExp(rExp, "gm"),
                                newText = text.replace(regExp, function(m) {
                                    return null !== translationMap[m.substring(1, m.length - 1)] ? " " + translationMap[m.substring(1, m.length - 1)] + " " : " " + m + " "
                                });
                            return /^\s*$/.test(newText) ? text : newText
                        }
                    }, {
                        key: "replaceAllClk",
                        value: function(text, translationMap) {
                            var _this5 = this;
                            if (text.includes('class="mtwTranslatedWord"') || text.includes("<span") || text.includes("<a")) return text;
                            var rExp = "";
                            _Object$keys(translationMap).sort(function(w1, w2) {
                                return w2.length - w1.length
                            }).forEach(function(sourceWord) {
                                rExp += "(" + _this5.escapeRegExp(sourceWord) + ")|"
                            }), rExp = rExp.substring(0, rExp.length - 1);
                            var regExp = new RegExp(rExp, "gm"),
                                newText = text.replace(regExp, function(m) {
                                    return null !== translationMap[m] ? " " + translationMap[m] + " " : " " + m + " "
                                });
                            return /^\s*$/.test(newText) ? text : newText
                        }
                    }, {
                        key: "invertMap",
                        value: function(map) {
                            var parsedDifficultyBuckets = JSON.parse(this.difficultyBuckets),
                                iMap = {};
                            for (var e in map) {
                                if (iMap[map[e]] = '<span data-sl="' + this.srcLang + '" data-tl="' + this.targetLanguage + '" data-query="' + e + '" data-original="' + e + '" data-translated="' + map[e], map[e] in parsedDifficultyBuckets) {
                                    var wordDifficultyLevel = parsedDifficultyBuckets[map[e]];
                                    iMap[map[e]] = iMap[map[e]] + '" class="mtwTranslatedWord' + wordDifficultyLevel + '"'
                                } else iMap[map[e]] = iMap[map[e]] + '" class="mtwTranslatedWord"';
                                iMap[map[e]] = iMap[map[e]] + ">" + map[e] + "</span>"
                            }
                            return iMap
                        }
                    }, {
                        key: "toggleAllElements",
                        value: function() {
                            this.translated = !this.translated;
                            for (var words = document.querySelectorAll(".mtwTranslatedWord, .mtwTranslatedWorde, .mtwTranslatedWordn, .mtwTranslatedWordh"), i = 0; i < words.length; i++) {
                                var word = words[i];
                                isNaN(word.innerText) && (word.innerText = this.translated ? word.dataset.translated : word.dataset.original)
                            }
                        }
                    }, {
                        key: "escapeRegExp",
                        value: function(str) {
                            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                        }
                    }, {
                        key: "toList",
                        value: function(map, filter) {
                            var list = [];
                            for (var item in map) filter(item, map[item]) && list.push(item);
                            return list
                        }
                    }, {
                        key: "shuffle",
                        value: function(o) {
                            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                            return o
                        }
                    }, {
                        key: "toMap",
                        value: function(list) {
                            for (var map = {}, i = 0; i < list.length; i++) map[list[i]] = 1;
                            return map
                        }
                    }, {
                        key: "intersect",
                        value: function() {
                            var i, shortest, nShortest, n, len, nOthers, ret = [],
                                obj = {};
                            for (nOthers = arguments.length - 1, nShortest = arguments[0].length, shortest = 0, i = 0; i <= nOthers; i++)(n = arguments[i].length) < nShortest && (shortest = i, nShortest = n);
                            for (i = 0; i <= nOthers; i++) {
                                n = i === shortest ? 0 : i || shortest, len = arguments[n].length;
                                for (var j = 0; j < len; j++) {
                                    var elem = arguments[n][j];
                                    obj[elem] === i - 1 ? i === nOthers ? (ret.push(elem), obj[elem] = 0) : obj[elem] = i : 0 === i && (obj[elem] = 0)
                                }
                            }
                            return ret
                        }
                    }, {
                        key: "sendError",
                        value: function(message) {
                            "" == message && (message = "Could not connect to " + this.translator + " Service .\nIt may be temporarily unavailable  or you may be experiencing  internet connection problems ");
                            var date = new Date,
                                data = {
                                    message: message,
                                    date: date.toLocaleDateString(),
                                    time: date.toLocaleTimeString(),
                                    url: window.location.href
                                };
                            chrome.runtime.sendMessage(data, function(response) {
                                "granted" !== Notification.permission && Notification.requestPermission(function(permission) {
                                    "granted" === permission && notify(message, "/views/options.html")
                                }), notify(message, "/views/options.html")
                            })
                        }
                    }, {
                        key: "clkTest",
                        value: function(str) {
                            var clk_main = new RegExp("[一-鿿]"),
                                clk_extension = new RegExp("[㐀-䶿]"),
                                clk_strokes = new RegExp("[㇀-㇯]"),
                                clk_symbols_punctuation = new RegExp("[　-〿]");
                            return clk_main.test(str) || clk_extension.test(str) || clk_strokes.test(str) || clk_symbols_punctuation.test(str)
                        }
                    }]), ContentScript
                }(), _export("ContentScript", ContentScript), MTWTranslator = new ContentScript, MTWTranslator.translate(), chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    "toggleAllElements" === request.type ? MTWTranslator.toggleAllElements() : "getTranslatedWords" === request.type ? ("storeSelection" === request.action && (MTWTranslator.selectedRegion = window.getSelection().getRangeAt(0)), sendResponse({
                        translatedWords: MTWTranslator.filteredTMap
                    })) : (request.type = "showTranslatedSentence") && function() {
                        var handler = function handler(e) {
                                this.removeEventListener("click", handler), anchor.parentNode.removeChild(anchor)
                            },
                            anchor = document.createElement("span"),
                            dummy = document.createElement("span");
                        dummy.innerText = request.data, dummy.classList.add("popover"), dummy.classList.add("noselect"), anchor.appendChild(dummy), anchor.classList.add("anchor"), MTWTranslator.selectedRegion.insertNode(anchor), window.addEventListener("click", handler)
                    }()
                }), attempts = 1
            }
        }
    })
})(function(factory) {
    factory()
});