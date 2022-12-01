

const setPrism = () => {
	let t0 = document.createElement('style');
	t0.innerHTML = `${prismCss}`
	document.head.appendChild(t0);
	getPrism()
}
const setUI = (redGPUContext) => {
	const t0 = document.createElement('div')
	t0.innerHTML = `
<div style="font-size: 11px;padding : 4px;background: rgba(0,0,0,0.5);margin-top:6px;">
    This is the RedGPU 2.0 Preview page.
    <div>You can check the source at <a href="https://github.com/redcamel/RedGPU/tree/preview2.0">RedGPU Preview
        branch.</a></div>
    <div>Demo play is provided via <a href="https://redcamel.github.io/Rnd_Doc/host/index.html">this URL</a></div>
</div>	
	`
	document.querySelector('.subTitle')?.appendChild(t0)
}
const setExampleHelper = (redGPUContext, source) => {
	setPrism()
	setUI(redGPUContext)
	source = source.trim()
	source = source.replace(/^\(\)\s*=>\s*{/, '')
	source = source.replace(/}/, '')
	source = source.replace(/}$/, '')
	const rootBox = document.createElement('div')
	const sourceViewBt = document.createElement('button')
	document.body.appendChild(rootBox);
	document.body.appendChild(sourceViewBt);
	rootBox.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10001;display:none;color:#fff;font-size:12px;overflow-y:auto;padding:10px;';
	rootBox.className = 'sourceView'
	sourceViewBt.style.cssText = 'position:fixed;right:10px;bottom:10px;background:#222;color:#fff;z-index:10002;border:0;outline:none;cursor:pointer;padding:8px;font-size:11px;border-radius:5px';
	sourceViewBt.innerHTML = 'SOURCE VIEW';

	sourceViewBt.addEventListener('click', function () {
		if (rootBox.style.display == 'block') {
			rootBox.style.display = 'none';
			sourceViewBt.innerHTML = 'SOURCE VIEW';
		} else {
			sourceViewBt.innerHTML = 'CLOSE';
			rootBox.style.display = 'block';

			rootBox.innerHTML = '<code class="language-javascript">' + Prism.highlight(source, Prism.languages.javascript) + '</code>'
		}
	});

}

export default setExampleHelper

const prismCss = `


/* http://prismjs.com/download.html?themes=prism-okaidia&languages=markup+css+clike+javascript&plugins=line-highlight+line-numbers+show-invisibles+autolinker+wpd+file-highlight+show-language+highlight-keywords */
/**
 * okaidia theme for JavaScript, CSS and HTML
 * Loosely based on Monokai textmate theme by http://www.monokai.nl/
 * @author ocodia
 */

code[class*="language-"],
pre[class*="language-"]{ color:#f8f8f2; text-shadow:0 1px rgba(0, 0, 0, 0.3); font-family:monospace, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono'; direction:ltr; text-align:left; white-space:pre; word-spacing:normal; word-break:normal; line-height:1.5; -moz-tab-size:4; -o-tab-size:4; tab-size:4; -webkit-hyphens:none; -moz-hyphens:none; -ms-hyphens:none; hyphens:none }
/* Code blocks */
pre[class*="language-"]{ padding:1em; margin:.5em 9px 0px 29px; overflow:auto; border-top-left-radius:8px; border-bottom-right-radius:8px }
:not(pre) > code[class*="language-"],
pre[class*="language-"]{ }
/* Inline code */
:not(pre) > code[class*="language-"]{ padding:.1em; border-radius:.3em }
.token.comment, .token.prolog, .token.doctype, .token.cdata{ color:slategray }
.token.punctuation{ color:#a9b7c6 }
.namespace{ opacity:.7 }
.token.property, .token.tag, .token.constant, .token.symbol, .token.deleted{ color:#f92672 }
.token.boolean, .token.number{ color:#6897bb }
.token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted{ color:#6a8759 }
.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string, .token.variable{ color:#a9b7c6 }
.token.atrule, .token.attr-value, .token.function{ color:#ffc66d }
.token.keyword{ color:#cc7832 }
.token.regex, .token.important{ color:#fd971f }
.token.important, .token.bold{ font-weight:bold }
.token.italic{ font-style:italic }
.token.entity{ cursor:help }
pre[data-line]{ position:relative; padding:1em 0 1em 3em }
.line-highlight{ position:absolute; left:0; right:0; padding:inherit 0; margin-top:1em; /* Same as .prism’s padding-top */
    background:hsla(24, 20%, 50%, .08); background:-moz-linear-gradient(left, hsla(24, 20%, 50%, .1) 70%, hsla(24, 20%, 50%, 0)); background:-webkit-linear-gradient(left, hsla(24, 20%, 50%, .1) 70%, hsla(24, 20%, 50%, 0)); background:-o-linear-gradient(left, hsla(24, 20%, 50%, .1) 70%, hsla(24, 20%, 50%, 0)); background:linear-gradient(left, hsla(24, 20%, 50%, .1) 70%, hsla(24, 20%, 50%, 0)); pointer-events:none; line-height:inherit; white-space:pre }
.line-highlight:before, .line-highlight[data-end]:after{ content:attr(data-start); position:absolute; top:.4em; left:.6em; min-width:1em; padding:0 .5em; background-color:hsla(24, 20%, 50%, .4); color:hsl(24, 20%, 95%); font:bold 65%/1.5 sans-serif; text-align:center; vertical-align:.3em; border-radius:999px; text-shadow:none; box-shadow:0 1px white;
}
.line-highlight[data-end]:after{ content:attr(data-end); top:auto; bottom:.4em;
}
pre.line-numbers{ position:relative; padding-left:3.8em; counter-reset:linenumber }
pre.line-numbers > code{ position:relative }
.line-numbers .line-numbers-rows{ position:absolute; pointer-events:none; top:0; font-size:100%; left:-3.8em; width:3em; /* works for line-numbers below 1000 lines */
    letter-spacing:-1px; border-right:1px solid #999; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;
}
.line-numbers-rows > span{ pointer-events:none; display:block; counter-increment:linenumber;
}
.line-numbers-rows > span:before{ content:counter(linenumber); color:#999; display:block; padding-right:0.8em; text-align:right;
}
.token.tab:not(:empty):before, .token.cr:before, .token.lf:before{ color:hsl(24, 20%, 85%) }
.token.tab:not(:empty):before{ content:'\\21E5' }
.token.cr:before{ content:'\\240D' }
.token.crlf:before{ content:'\\240D\\240A' }
.token.lf:before{ content:'\\240A' }
.token a{ color:inherit }
code[class*="language-"] a[href],
pre[class*="language-"] a[href]{ cursor:help; text-decoration:none }
code[class*="language-"] a[href]:hover,
pre[class*="language-"] a[href]:hover{ cursor:help; text-decoration:underline }
pre[class*='language-']{ position:relative }
pre[class*='language-'][data-language]::before{ content:attr(data-language); color:black; background-color:#CFCFCF; display:inline-block; position:absolute; top:0; right:0; font-size:0.9em; border-radius:0 0 0 5px; padding:0 0.5em; text-shadow:none }
`

const getPrism = () => {
	var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
		Prism = function () {
			var e = /\blang(?:uage)?-(\w+)\b/i, t = 0, n = _self.Prism = {
				util: {
					encode: function (e) {return e instanceof a ? new a(e.type, n.util.encode(e.content), e.alias) : "Array" === n.util.type(e) ? e.map(n.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")},
					type: function (e) {return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},
					objId: function (e) {return e.__id || Object.defineProperty(e, "__id", {value: ++t}), e.__id},
					clone: function (e) {
						var t = n.util.type(e);
						switch (t) {
							case"Object":
								var a = {};
								for (var r in e) e.hasOwnProperty(r) && (a[r] = n.util.clone(e[r]));
								return a;
							case"Array":
								return e.map && e.map(function (e) {return n.util.clone(e)})
						}
						return e
					}
				},
				languages: {
					extend: function (e, t) {
						var a = n.util.clone(n.languages[e]);
						for (var r in t) a[r] = t[r];
						return a
					}, insertBefore: function (e, t, a, r) {
						r = r || n.languages;
						var i = r[e];
						if (2 == arguments.length) {
							a = arguments[1];
							for (var l in a) a.hasOwnProperty(l) && (i[l] = a[l]);
							return i
						}
						var o = {};
						for (var s in i) if (i.hasOwnProperty(s)) {
							if (s == t) for (var l in a) a.hasOwnProperty(l) && (o[l] = a[l]);
							o[s] = i[s]
						}
						return n.languages.DFS(n.languages, function (t, n) {n === r[e] && t != e && (this[t] = o)}), r[e] = o
					}, DFS: function (e, t, a, r) {
						r = r || {};
						for (var i in e) e.hasOwnProperty(i) && (t.call(e, i, e[i], a || i), "Object" !== n.util.type(e[i]) || r[n.util.objId(e[i])] ? "Array" !== n.util.type(e[i]) || r[n.util.objId(e[i])] || (r[n.util.objId(e[i])] = !0, n.languages.DFS(e[i], t, i, r)) : (r[n.util.objId(e[i])] = !0, n.languages.DFS(e[i], t, null, r)))
					}
				},
				plugins: {},
				highlightAll: function (e, t) {for (var a, r = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), i = 0; a = r[i++];) n.highlightElement(a, e === !0, t)},
				highlightElement: function (t, a, r) {
					for (var i, l, o = t; o && !e.test(o.className);) o = o.parentNode;
					o && (i = (o.className.match(e) || [, ""])[1], l = n.languages[i]), t.className = t.className.replace(e, "").replace(/\s+/g, " ") + " language-" + i, o = t.parentNode, /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, "").replace(/\s+/g, " ") + " language-" + i);
					var s = t.textContent, u = {element: t, language: i, grammar: l, code: s};
					if (!s || !l) return n.hooks.run("complete", u), void 0;
					if (n.hooks.run("before-highlight", u), a && _self.Worker) {
						var c = new Worker(n.filename);
						c.onmessage = function (e) {u.highlightedCode = e.data, n.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, r && r.call(u.element), n.hooks.run("after-highlight", u), n.hooks.run("complete", u)}, c.postMessage(JSON.stringify({
							language: u.language,
							code: u.code,
							immediateClose: !0
						}))
					} else u.highlightedCode = n.highlight(u.code, u.grammar, u.language), n.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, r && r.call(t), n.hooks.run("after-highlight", u), n.hooks.run("complete", u)
				},
				highlight: function (e, t, r) {
					var i = n.tokenize(e, t);
					return a.stringify(n.util.encode(i), r)
				},
				tokenize: function (e, t) {
					var a = n.Token, r = [e], i = t.rest;
					if (i) {
						for (var l in i) t[l] = i[l];
						delete t.rest
					}
					e:for (var l in t) if (t.hasOwnProperty(l) && t[l]) {
						var o = t[l];
						o = "Array" === n.util.type(o) ? o : [o];
						for (var s = 0; s < o.length; ++s) {
							var u = o[s], c = u.inside, g = !!u.lookbehind, f = 0, h = u.alias;
							u = u.pattern || u;
							for (var p = 0; p < r.length; p++) {
								var d = r[p];
								if (r.length > e.length) break e;
								if (!(d instanceof a)) {
									u.lastIndex = 0;
									var m = u.exec(d);
									if (m) {
										g && (f = m[1].length);
										var y = m.index - 1 + f, m = m[0].slice(f), v = m.length, b = y + v, k = d.slice(0, y + 1),
											w = d.slice(b + 1), _ = [p, 1];
										k && _.push(k);
										var P = new a(l, c ? n.tokenize(m, c) : m, h);
										_.push(P), w && _.push(w), Array.prototype.splice.apply(r, _)
									}
								}
							}
						}
					}
					return r
				},
				hooks: {
					all: {}, add: function (e, t) {
						var a = n.hooks.all;
						a[e] = a[e] || [], a[e].push(t)
					}, run: function (e, t) {
						var a = n.hooks.all[e];
						if (a && a.length) for (var r, i = 0; r = a[i++];) r(t)
					}
				}
			}, a = n.Token = function (e, t, n) {this.type = e, this.content = t, this.alias = n};
			if (a.stringify = function (e, t, r) {
				if ("string" == typeof e) return e;
				if ("Array" === n.util.type(e)) return e.map(function (n) {return a.stringify(n, t, e)}).join("");
				var i = {
					type: e.type,
					content: a.stringify(e.content, t, r),
					tag: "span",
					classes: ["token", e.type],
					attributes: {},
					language: t,
					parent: r
				};
				if ("comment" == i.type && (i.attributes.spellcheck = "true"), e.alias) {
					var l = "Array" === n.util.type(e.alias) ? e.alias : [e.alias];
					Array.prototype.push.apply(i.classes, l)
				}
				n.hooks.run("wrap", i);
				var o = "";
				for (var s in i.attributes) o += (o ? " " : "") + s + '="' + (i.attributes[s] || "") + '"';
				return "<" + i.tag + ' class="' + i.classes.join(" ") + '" ' + o + ">" + i.content + "</" + i.tag + ">"
			}, !_self.document) return _self.addEventListener ? (_self.addEventListener("message", function (e) {
				var t = JSON.parse(e.data), a = t.language, r = t.code, i = t.immediateClose;
				_self.postMessage(n.highlight(r, n.languages[a], a)), i && _self.close()
			}, !1), _self.Prism) : _self.Prism;
			var r = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
			return r && (n.filename = r.src, document.addEventListener && !r.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", n.highlightAll)), _self.Prism
		}();
	"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
	Prism.languages.markup = {
		comment: /<!--[\w\W]*?-->/,
		prolog: /<\?[\w\W]+?\?>/,
		doctype: /<!DOCTYPE[\w\W]+?>/,
		cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
		tag: {
			pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
			inside: {
				tag: {pattern: /^<\/?[^\s>\/]+/i, inside: {punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/}},
				"attr-value": {pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i, inside: {punctuation: /[=>"']/}},
				punctuation: /\/?>/,
				"attr-name": {pattern: /[^\s>\/]+/, inside: {namespace: /^[^\s>\/:]+:/}}
			}
		},
		entity: /&#?[\da-z]{1,8};/i
	}, Prism.hooks.add("wrap", function (a) {"entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))}), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup;
	Prism.languages.css = {
		comment: /\/\*[\w\W]*?\*\//,
		atrule: {pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i, inside: {rule: /@[\w-]+/}},
		url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
		selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
		string: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		property: /(\b|\B)[\w-]+(?=\s*:)/i,
		important: /\B!important\b/i,
		"function": /[-a-z0-9]+(?=\()/i,
		punctuation: /[(){};:]/
	}, Prism.languages.css.atrule.inside.rest = Prism.util.clone(Prism.languages.css), Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
		style: {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: !0,
			inside: Prism.languages.css,
			alias: "language-css"
		}
	}), Prism.languages.insertBefore("inside", "attr-value", {
		"style-attr": {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				"attr-name": {pattern: /^\s*style/i, inside: Prism.languages.markup.tag.inside},
				punctuation: /^\s*=\s*['"]|['"]\s*$/,
				"attr-value": {pattern: /.+/i, inside: Prism.languages.css}
			},
			alias: "language-css"
		}
	}, Prism.languages.markup.tag));
	Prism.languages.clike = {
		comment: [{pattern: /(^|[^\\])\/\*[\w\W]*?\*\//, lookbehind: !0}, {
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: !0
		}],
		string: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		"class-name": {
			pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
			lookbehind: !0,
			inside: {punctuation: /(\.|\\)/}
		},
		keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		"boolean": /\b(true|false)\b/,
		"function": /[a-z0-9_]+(?=\()/i,
		number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
		operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
		punctuation: /[{}[\];(),.:]/
	};
	Prism.languages.javascript = Prism.languages.extend("clike", {
		keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
		number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
		"function": /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
	}), Prism.languages.insertBefore("javascript", "keyword", {
		regex: {
			pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: !0
		}
	}), Prism.languages.insertBefore("javascript", "class-name", {
		"template-string": {
			pattern: /`(?:\\`|\\?[^`])*`/,
			inside: {
				interpolation: {
					pattern: /\$\{[^}]+\}/,
					inside: {
						"interpolation-punctuation": {pattern: /^\$\{|\}$/, alias: "punctuation"},
						rest: Prism.languages.javascript
					}
				}, string: /[\s\S]+/
			}
		}
	}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
		script: {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: !0,
			inside: Prism.languages.javascript,
			alias: "language-javascript"
		}
	}), Prism.languages.js = Prism.languages.javascript;
	Prism.languages.json = {
		property: /".*?"(?=\s*:)/gi,
		string: /"(?!:)(\\?[^"])*?"(?!:)/g,
		number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
		punctuation: /[{}[\]);,]/g,
		operator: /:/g,
		"boolean": /\b(true|false)\b/gi,
		"null": /\bnull\b/gi
	}, Prism.languages.jsonp = Prism.languages.json;
	!function () {
		function e(e, t) {return Array.prototype.slice.call((t || document).querySelectorAll(e))}

		function t(e, t) {return t = " " + t + " ", (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t) > -1}

		function n(e, n, i) {
			for (var o, a = n.replace(/\s+/g, "").split(","), l = +e.getAttribute("data-line-offset") || 0, d = r() ? parseInt : parseFloat, c = d(getComputedStyle(e).lineHeight), s = 0; o = a[s++];) {
				o = o.split("-");
				var u = +o[0], m = +o[1] || u, h = document.createElement("div");
				h.textContent = Array(m - u + 2).join(" \n"), h.className = (i || "") + " line-highlight", t(e, "line-numbers") || (h.setAttribute("data-start", u), m > u && h.setAttribute("data-end", m)), h.style.top = (u - l - 1) * c + "px", t(e, "line-numbers") ? e.appendChild(h) : (e.querySelector("code") || e).appendChild(h)
			}
		}

		function i() {
			var t = location.hash.slice(1);
			e(".temporary.line-highlight").forEach(function (e) {e.parentNode.removeChild(e)});
			var i = (t.match(/\.([\d,-]+)$/) || [, ""])[1];
			if (i && !document.getElementById(t)) {
				var r = t.slice(0, t.lastIndexOf(".")), o = document.getElementById(r);
				o && (o.hasAttribute("data-line") || o.setAttribute("data-line", ""), n(o, i, "temporary "), document.querySelector(".temporary.line-highlight").scrollIntoView())
			}
		}

		if ("undefined" != typeof self && self.Prism && self.document && document.querySelector) {
			var r = function () {
				var e;
				return function () {
					if ("undefined" == typeof e) {
						var t = document.createElement("div");
						t.style.fontSize = "13px", t.style.lineHeight = "1.5", t.style.padding = 0, t.style.border = 0, t.innerHTML = "&nbsp;<br />&nbsp;", document.body.appendChild(t), e = 38 === t.offsetHeight, document.body.removeChild(t)
					}
					return e
				}
			}(), o = 0;
			Prism.hooks.add("complete", function (t) {
				var r = t.element.parentNode, a = r && r.getAttribute("data-line");
				r && a && /pre/i.test(r.nodeName) && (clearTimeout(o), e(".line-highlight", r).forEach(function (e) {e.parentNode.removeChild(e)}), n(r, a), o = setTimeout(i, 1))
			}), window.addEventListener && window.addEventListener("hashchange", i)
		}
	}();
	!function () {
		"undefined" != typeof self && self.Prism && self.document && Prism.hooks.add("complete", function (e) {
			if (e.code) {
				var t = e.element.parentNode, s = /\s*\bline-numbers\b\s*/;
				if (t && /pre/i.test(t.nodeName) && (s.test(t.className) || s.test(e.element.className)) && !e.element.querySelector(".line-numbers-rows")) {
					s.test(e.element.className) && (e.element.className = e.element.className.replace(s, "")), s.test(t.className) || (t.className += " line-numbers");
					var n, a = e.code.match(/\n(?!$)/g), l = a ? a.length + 1 : 1, m = new Array(l + 1);
					m = m.join("<span></span>"), n = document.createElement("span"), n.className = "line-numbers-rows", n.innerHTML = m, t.hasAttribute("data-start") && (t.style.counterReset = "linenumber " + (parseInt(t.getAttribute("data-start"), 10) - 1)), e.element.appendChild(n)
				}
			}
		})
	}();
	!function () {
		"undefined" != typeof self && self.Prism && self.document && document.querySelector && (self.Prism.fileHighlight = function () {
			var e = {
				js: "javascript",
				html: "markup",
				svg: "markup",
				xml: "markup",
				py: "python",
				rb: "ruby",
				ps1: "powershell",
				psm1: "powershell"
			};
			Array.prototype.forEach && Array.prototype.slice.call(document.querySelectorAll("pre[data-src]")).forEach(function (t) {
				for (var r, a = t.getAttribute("data-src"), n = t, s = /\blang(?:uage)?-(?!\*)(\w+)\b/i; n && !s.test(n.className);) n = n.parentNode;
				if (n && (r = (t.className.match(s) || [, ""])[1]), !r) {
					var o = (a.match(/\.(\w+)$/) || [, ""])[1];
					r = e[o] || o
				}
				var l = document.createElement("code");
				l.className = "language-" + r, t.textContent = "", l.textContent = "Loading…", t.appendChild(l);
				var i = new XMLHttpRequest;
				i.open("GET", a, !0), i.onreadystatechange = function () {4 == i.readyState && (i.status < 400 && i.responseText ? (l.textContent = i.responseText, Prism.highlightElement(l)) : l.textContent = i.status >= 400 ? "✖ Error " + i.status + " while fetching file: " + i.statusText : "✖ Error: File does not exist or is empty")}, i.send(null)
			})
		}, document.addEventListener("DOMContentLoaded", self.Prism.fileHighlight))
	}();
	!function () {
		function t(t) {"function" != typeof t || e(t) || r.push(t)}

		function e(t) {return "function" == typeof t ? r.filter(function (e) {return e.valueOf() === t.valueOf()})[0] : "string" == typeof t && t.length > 0 ? r.filter(function (e) {return e.name === t})[0] : null}

		function n(t) {
			if ("string" == typeof t && (t = e(t)), "function" == typeof t) {
				var n = r.indexOf(t);
				n >= 0 && r.splice(n, 1)
			}
		}

		function a() {
			Array.prototype.slice.call(document.querySelectorAll("pre[data-jsonp]")).forEach(function (t) {
				t.textContent = "";
				var e = document.createElement("code");
				e.textContent = i, t.appendChild(e);
				var n = t.getAttribute("data-adapter"), a = null;
				if (n) {
					if ("function" != typeof window[n]) return e.textContent = "JSONP adapter function '" + n + "' doesn't exist", void 0;
					a = window[n]
				}
				var u = "prismjsonp" + o++, f = document.createElement("a"), l = f.href = t.getAttribute("data-jsonp");
				f.href += (f.search ? "&" : "?") + (t.getAttribute("data-callback") || "callback") + "=" + u;
				var s = setTimeout(function () {e.textContent === i && (e.textContent = "Timeout loading '" + l + "'")}, 5e3),
					d = document.createElement("script");
				d.src = f.href, window[u] = function (n) {
					document.head.removeChild(d), clearTimeout(s), delete window[u];
					var o = "";
					if (a) o = a(n, t); else for (var i in r) if (o = r[i](n, t), null !== o) break;
					null === o ? e.textContent = "Cannot parse response (perhaps you need an adapter function?)" : (e.textContent = o, Prism.highlightElement(e))
				}, document.head.appendChild(d)
			})
		}

		if (self.Prism && self.document && document.querySelectorAll && [].filter) {
			var r = [];
			Prism.plugins.jsonphighlight = {
				registerAdapter: t,
				removeAdapter: n,
				highlight: a
			}, t(function (t) {
				if (t && t.meta && t.data) {
					if (t.meta.status && t.meta.status >= 400) return "Error: " + (t.data.message || t.meta.status);
					if ("string" == typeof t.data.content) return "function" == typeof atob ? atob(t.data.content.replace(/\s/g, "")) : "Your browser cannot decode base64"
				}
				return null
			}), t(function (t, e) {
				if (t && t.meta && t.data && t.data.files) {
					if (t.meta.status && t.meta.status >= 400) return "Error: " + (t.data.message || t.meta.status);
					var n = e.getAttribute("data-filename");
					if (null == n) for (var a in t.data.files) if (t.data.files.hasOwnProperty(a)) {
						n = a;
						break
					}
					return void 0 !== t.data.files[n] ? t.data.files[n].content : "Error: unknown or missing gist file " + n
				}
				return null
			}), t(function (t) {return t && t.node && "string" == typeof t.data ? t.data : null});
			var o = 0, i = "Loading…";
			a()
		}
	}();
	!function () {"undefined" != typeof self && !self.Prism || "undefined" != typeof global && !global.Prism || Prism.hooks.add("wrap", function (e) {"keyword" === e.type && e.classes.push("keyword-" + e.content)})}();
	!function () {
		"undefined" != typeof self && self.Prism && self.document && Prism.hooks.add("complete", function (e) {
			if (e.code) {
				var t = e.element.parentNode, a = /\s*\bcommand-line\b\s*/;
				if (t && /pre/i.test(t.nodeName) && (a.test(t.className) || a.test(e.element.className)) && !e.element.querySelector(".command-line-prompt")) {
					a.test(e.element.className) && (e.element.className = e.element.className.replace(a, "")), a.test(t.className) || (t.className += " command-line");
					var n = new Array(1 + e.code.split("\n").length), s = t.getAttribute("data-prompt") || "";
					if ("" !== s) n = n.join('<span data-prompt="' + s + '"></span>'); else {
						var r = t.getAttribute("data-user") || "user", l = t.getAttribute("data-host") || "localhost";
						n = n.join('<span data-user="' + r + '" data-host="' + l + '"></span>')
					}
					var m = document.createElement("span");
					m.className = "command-line-prompt", m.innerHTML = n;
					var o = t.getAttribute("data-output") || "";
					o = o.split(",");
					for (var i = 0; i < o.length; i++) {
						var d = o[i].split("-"), p = parseInt(d[0]), c = p;
						if (2 === d.length && (c = parseInt(d[1])), !isNaN(p) && !isNaN(c)) for (var u = p; c >= u && u <= m.children.length; u++) {
							var N = m.children[u - 1];
							N.removeAttribute("data-user"), N.removeAttribute("data-host"), N.removeAttribute("data-prompt")
						}
					}
					e.element.innerHTML = m.outerHTML + e.element.innerHTML
				}
			}
		})
	}();
}
