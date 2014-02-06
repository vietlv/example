/*
 * GIS Cloud JavaScript API
 *
 * web: http://www.giscloud.com/
 * dev: http://dev.giscloud.com/
 *
 * copyright GIS Cloud ltd. 2013.
 *
 *
 * Included in this lib are also:
 *     json2 - http://json.org
 *     jQuery - http://jquery.com
 *     jQuery UI - http://jquery.com
 *     jQuery Address - http://www.asual.com/jquery/address/
 *     jstree - http://jstree.com
 *     easyXDM - http://easyxdm.net
 */

giscloud_config = {
    restHost : function () {  return "https://api.giscloud.com"; },
    apiHost : function () {
        if (document.location.protocol === "https:")
            return "https://api.giscloud.com";
        else
            return "http://api.giscloud.com";
    },
    apiHostname : function () {  return "api.giscloud.com"; },
    authHost : function () {  return "https://www.giscloud.com"; },
    liveSite : function () {  return "http://api.giscloud.com/"; },
    appSite : function () {  return "http://www.giscloud.com/"; },
    tileSite : function () { return "http://www.giscloud.com/"; },
    leafletScript : function () { return "leaflet.js"; },
    nch : "1227842b99fb03947e9e14492d58faf24832585f"
};
/*
 * jQuery Address Plugin v1.4
 * http://www.asual.com/jquery/address/
 *
 * Copyright (c) 2009-2010 Rostislav Hristov
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2011-05-04 14:22:12 +0300 (Wed, 04 May 2011)
 */
(function ($) {

    $.address = (function () {

        var _trigger = function(name) {
                $($.address).trigger(
                    $.extend($.Event(name),
                        (function() {
                            var parameters = {},
                                parameterNames = $.address.parameterNames();
                            for (var i = 0, l = parameterNames.length; i < l; i++) {
                                parameters[parameterNames[i]] = $.address.parameter(parameterNames[i]);
                            }
                            return {
                                value: $.address.value(),
                                path: $.address.path(),
                                pathNames: $.address.pathNames(),
                                parameterNames: parameterNames,
                                parameters: parameters,
                                queryString: $.address.queryString()
                            };
                        }).call($.address)
                    )
                );
            },
            _bind = function(value, data, fn) {
                $().bind.apply($($.address), Array.prototype.slice.call(arguments));
                return $.address;
            },
            _supportsState = function() {
                return (_h.pushState && _opts.state !== UNDEFINED);
            },
            _hrefState = function() {
                return ('/' + _l.pathname.replace(new RegExp(_opts.state), '') +
                    _l.search + (_hrefHash() ? '#' + _hrefHash() : '')).replace(_re, '/');
            },
            _hrefHash = function() {
                var index = _l.href.indexOf('#');
                return index != -1 ? _crawl(_l.href.substr(index + 1), FALSE) : '';
            },
            _href = function() {
                return _supportsState() ? _hrefState() : _hrefHash();
            },
            _window = function() {
                // giscloud hack:
                return window;
                // the original (below) would fail in Opera, plus we don't need to know the address of the parent window.
                //try {
                //    return top.document !== UNDEFINED ? top : window;
                //} catch (e) {
                //    return window;
                //}
            },
            _js = function() {
                return 'javascript';
            },
            _strict = function(value) {
                value = value.toString();
                return (_opts.strict && value.substr(0, 1) != '/' ? '/' : '') + value;
            },
            _crawl = function(value, direction) {
                if (_opts.crawlable && direction) {
                    return (value !== '' ? '!' : '') + value;
                }
                return value.replace(/^\!/, '');
            },
            _cssint = function(el, value) {
                return parseInt(el.css(value), 10);
            },
            _search = function(el) {
                var url, s;
                for (var i = 0, l = el.childNodes.length; i < l; i++) {
                    try {
                        if ('src' in el.childNodes[i] && el.childNodes[i].src) {
                            url = String(el.childNodes[i].src);
                        }
                    } catch (e) {
                        // IE Invalid pointer problem with base64 encoded images
                    }
                    s = _search(el.childNodes[i]);
                    if (s) {
                        url = s;
                    }
                }
                return url;
            },
            _listen = function() {
                if (!_silent) {
                    var hash = _href(),
                        diff = _value != hash;
                    if (diff) {
                        if (_msie && _version < 7) {
                            _l.reload();
                        } else {
                            if (_msie && _version < 8 && _opts.history) {
                                _st(_html, 50);
                            }
                            _value = hash;
                            _update(FALSE);
                        }
                    }
                }
            },
            _update = function(internal) {
                _trigger(CHANGE);
                _trigger(internal ? INTERNAL_CHANGE : EXTERNAL_CHANGE);
                _st(_track, 10);
            },
            _track = function() {
                if (_opts.tracker !== 'null' && _opts.tracker !== null) {
                    var fn = $.isFunction(_opts.tracker) ? _opts.tracker : _t[_opts.tracker],
                        value = (_l.pathname + _l.search +
                                ($.address && !_supportsState() ? $.address.value() : ''))
                                .replace(/\/\//, '/').replace(/^\/$/, '');
                    if ($.isFunction(fn)) {
                        fn(value);
                    } else if ($.isFunction(_t.urchinTracker)) {
                        _t.urchinTracker(value);
                    } else if (_t.pageTracker !== UNDEFINED && $.isFunction(_t.pageTracker._trackPageview)) {
                        _t.pageTracker._trackPageview(value);
                    } else if (_t._gaq !== UNDEFINED && $.isFunction(_t._gaq.push)) {
                        _t._gaq.push(['_trackPageview', decodeURI(value)]);
                    }
                }
            },
            _html = function() {
                var src = _js() + ':' + FALSE + ';document.open();document.writeln(\'<html><head><title>' +
                    _d.title.replace('\'', '\\\'') + '</title><script>var ' + ID + ' = "' + encodeURIComponent(_href()) +
                    (_d.domain != _l.hostname ? '";document.domain="' + _d.domain : '') +
                    '";</' + 'script></head></html>\');document.close();';
                if (_version < 7) {
                    _frame.src = src;
                } else {
                    _frame.contentWindow.location.replace(src);
                }
            },
            _options = function() {
                if (_url && _qi != -1) {
                    var param, params = _url.substr(_qi + 1).split('&');
                    for (i = 0; i < params.length; i++) {
                        param = params[i].split('=');
                        if (/^(autoUpdate|crawlable|history|strict|wrap)$/.test(param[0])) {
                            _opts[param[0]] = (isNaN(param[1]) ? /^(true|yes)$/i.test(param[1]) : (parseInt(param[1], 10) !== 0));
                        }
                        if (/^(state|tracker)$/.test(param[0])) {
                            _opts[param[0]] = param[1];
                        }
                    }
                    _url = null;
                }
                _value = _href();
            },
            _load = function() {
                if (!_loaded) {
                    _loaded = TRUE;
                    _options();
                    var complete = function() {
                            _enable.call(this);
                            _unescape.call(this);
                        },
                        body = $('body').ajaxComplete(complete);
                    complete();
                    if (_opts.wrap) {
                        var wrap = $('body > *')
                            .wrapAll('<div style="padding:' +
                                (_cssint(body, 'marginTop') + _cssint(body, 'paddingTop')) + 'px ' +
                                (_cssint(body, 'marginRight') + _cssint(body, 'paddingRight')) + 'px ' +
                                (_cssint(body, 'marginBottom') + _cssint(body, 'paddingBottom')) + 'px ' +
                                (_cssint(body, 'marginLeft') + _cssint(body, 'paddingLeft')) + 'px;" />')
                            .parent()
                            .wrap('<div id="' + ID + '" style="height:100%;overflow:auto;position:relative;' +
                                (_webkit && !window.statusbar.visible ? 'resize:both;' : '') + '" />');
                        $('html, body')
                            .css({
                                height: '100%',
                                margin: 0,
                                padding: 0,
                                overflow: 'hidden'
                            });
                        if (_webkit) {
                            $('<style type="text/css" />')
                                .appendTo('head')
                                .text('#' + ID + '::-webkit-resizer { background-color: #fff; }');
                        }
                    }
                    if (_msie && _version < 8) {
                        var frameset = _d.getElementsByTagName('frameset')[0];
                        _frame = _d.createElement((frameset ? '' : 'i') + 'frame');
                        if (frameset) {
                            frameset.insertAdjacentElement('beforeEnd', _frame);
                            frameset[frameset.cols ? 'cols' : 'rows'] += ',0';
                            _frame.noResize = TRUE;
                            _frame.frameBorder = _frame.frameSpacing = 0;
                        } else {
                            _frame.style.display = 'none';
                            _frame.style.width = _frame.style.height = 0;
                            _frame.tabIndex = -1;
                            _d.body.insertAdjacentElement('afterBegin', _frame);
                        }
                        _st(function() {
                            $(_frame).bind('load', function() {
                                var win = _frame.contentWindow;
                                _value = win[ID] !== UNDEFINED ? win[ID] : '';
                                if (_value != _href()) {
                                    _update(FALSE);
                                    _l.hash = _crawl(_value, TRUE);
                                }
                            });
                            if (_frame.contentWindow[ID] === UNDEFINED) {
                                _html();
                            }
                        }, 50);
                    }

                    _st(function() {
                        _trigger('init');
                        _update(FALSE);
                    }, 1);

                    if (!_supportsState()) {
                        if ((_msie && _version > 7) || (!_msie && ('on' + HASH_CHANGE) in _t)) {
                            if (_t.addEventListener) {
                                _t.addEventListener(HASH_CHANGE, _listen, FALSE);
                            } else if (_t.attachEvent) {
                                _t.attachEvent('on' + HASH_CHANGE, _listen);
                            }
                        } else {
                            _si(_listen, 50);
                        }
                    }
                }
            },
            _enable = function() {
                var el,
                    elements = $('a'),
                    length = elements.size(),
                    delay = 1,
                    index = -1,
                    fn = function() {
                        if (++index != length) {
                            el = $(elements.get(index));
                            if (el.is('[rel*="address:"]')) {
                                el.address();
                            }
                            _st(fn, delay);
                        }
                    };
                _st(fn, delay);
            },
            _popstate = function() {
                if (_value != _href()) {
                    _value = _href();
                    _update(FALSE);
                }
            },
            _unload = function() {
                if (_t.removeEventListener) {
                    _t.removeEventListener(HASH_CHANGE, _listen, FALSE);
                } else if (_t.detachEvent) {
                    _t.detachEvent('on' + HASH_CHANGE, _listen);
                }
            },
            _unescape = function() {
                if (_opts.crawlable) {
                    var base = _l.pathname.replace(/\/$/, ''),
                        fragment = '_escaped_fragment_';
                    if ($('body').html().indexOf(fragment) != -1) {
                        $('a[href]:not([href^=http]), a[href*="' + document.domain + '"]').each(function() {
                            var href = $(this).attr('href').replace(/^http:/, '').replace(new RegExp(base + '/?$'), '');
                            if (href === '' || href.indexOf(fragment) != -1) {
                                $(this).attr('href', '#' + href.replace(new RegExp('/(.*)\\?' + fragment + '=(.*)$'), '!$2'));
                            }
                        });
                    }
                }
            },
            UNDEFINED,
            ID = 'jQueryAddress',
            STRING = 'string',
            HASH_CHANGE = 'hashchange',
            INIT = 'init',
            CHANGE = 'change',
            INTERNAL_CHANGE = 'internalChange',
            EXTERNAL_CHANGE = 'externalChange',
            TRUE = true,
            FALSE = false,
            _opts = {
                autoUpdate: TRUE,
                crawlable: FALSE,
                history: TRUE,
                strict: TRUE,
                wrap: FALSE
            },
            _browser = $.browser,
            _version = parseFloat($.browser.version),
            _mozilla = _browser.mozilla,
            _msie = _browser.msie,
            _opera = _browser.opera,
            _webkit = _browser.webkit || _browser.safari,
            _supported = FALSE,
            _t = _window(),
            _d = _t.document,
            _h = _t.history,
            _l = _t.location,
            _si = setInterval,
            _st = setTimeout,
            _re = /\/{2,9}/g,
            _agent = navigator.userAgent,
            _frame,
            _form,
            _url = _search(document),
            _qi = _url ? _url.indexOf('?') : -1,
            _title = _d.title,
            _silent = FALSE,
            _loaded = FALSE,
            _justset = TRUE,
            _juststart = TRUE,
            _updating = FALSE,
            _listeners = {},
            _value = _href();

        if (_msie) {
            _version = parseFloat(_agent.substr(_agent.indexOf('MSIE') + 4));
            if (_d.documentMode && _d.documentMode != _version) {
                _version = _d.documentMode != 8 ? 7 : 8;
            }
            var pc = _d.onpropertychange;
            _d.onpropertychange = function() {
                if (pc) {
                    pc.call(_d);
                }
                if (_d.title != _title && _d.title.indexOf('#' + _href()) != -1) {
                    _d.title = _title;
                }
            };
        }

        _supported =
            (_mozilla && _version >= 1) ||
            (_msie && _version >= 6) ||
            (_opera && _version >= 9.5) ||
            (_webkit && _version >= 523);

        if (_supported) {
            if (_opera) {
                history.navigationMode = 'compatible';
            }
            if (document.readyState == 'complete') {
                var interval = setInterval(function() {
                    if ($.address) {
                        _load();
                        clearInterval(interval);
                    }
                }, 50);
            } else {
                _options();
                $(_load);
            }
            $(window).bind('popstate', _popstate).bind('unload', _unload);
        } else if (!_supported && _hrefHash() !== '') {
            _l.replace(_l.href.substr(0, _l.href.indexOf('#')));
        } else {
            _track();
        }

        return {
            bind: function(type, data, fn) {
                return _bind(type, data, fn);
            },
            init: function(fn) {
                return _bind(INIT, fn);
            },
            change: function(fn) {
                return _bind(CHANGE, fn);
            },
            internalChange: function(fn) {
                return _bind(INTERNAL_CHANGE, fn);
            },
            externalChange: function(fn) {
                return _bind(EXTERNAL_CHANGE, fn);
            },
            baseURL: function() {
                var url = _l.href;
                if (url.indexOf('#') != -1) {
                    url = url.substr(0, url.indexOf('#'));
                }
                if (/\/$/.test(url)) {
                    url = url.substr(0, url.length - 1);
                }
                return url;
            },
            autoUpdate: function(value) {
                if (value !== UNDEFINED) {
                    _opts.autoUpdate = value;
                    return this;
                }
                return _opts.autoUpdate;
            },
            crawlable: function(value) {
                if (value !== UNDEFINED) {
                    _opts.crawlable = value;
                    return this;
                }
                return _opts.crawlable;
            },
            history: function(value) {
                if (value !== UNDEFINED) {
                    _opts.history = value;
                    return this;
                }
                return _opts.history;
            },
            state: function(value) {
                if (value !== UNDEFINED) {
                    _opts.state = value;
                    var hrefState = _hrefState();
                    if (_opts.state !== UNDEFINED) {
                        if (_h.pushState) {
                            if (hrefState.substr(0, 3) == '/#/') {
                                _l.replace(_opts.state.replace(/^\/$/, '') + hrefState.substr(2));
                            }
                        } else if (hrefState != '/' && hrefState.replace(/^\/#/, '') != _hrefHash()) {
                            _st(function() {
                                _l.replace(_opts.state.replace(/^\/$/, '') + '/#' + hrefState);
                            }, 1);
                        }
                    }
                    return this;
                }
                return _opts.state;
            },
            strict: function(value) {
                if (value !== UNDEFINED) {
                    _opts.strict = value;
                    return this;
                }
                return _opts.strict;
            },
            tracker: function(value) {
                if (value !== UNDEFINED) {
                    _opts.tracker = value;
                    return this;
                }
                return _opts.tracker;
            },
            wrap: function(value) {
                if (value !== UNDEFINED) {
                    _opts.wrap = value;
                    return this;
                }
                return _opts.wrap;
            },
            update: function() {
                _updating = TRUE;
                this.value(_value);
                _updating = FALSE;
                return this;
            },
            title: function(value) {
                if (value !== UNDEFINED) {
                    _st(function() {
                        _title = _d.title = value;
                        if (_juststart && _frame && _frame.contentWindow && _frame.contentWindow.document) {
                            _frame.contentWindow.document.title = value;
                            _juststart = FALSE;
                        }
                        if (!_justset && _mozilla) {
                            _l.replace(_l.href.indexOf('#') != -1 ? _l.href : _l.href + '#');
                        }
                        _justset = FALSE;
                    }, 50);
                    return this;
                }
                return _d.title;
            },
            value: function(value) {
                if (value !== UNDEFINED) {
                    value = _strict(value);
                    if (value == '/') {
                        value = '';
                    }
                    if (_value == value && !_updating) {
                        return;
                    }
                    _justset = TRUE;
                    _value = value;
                    if (_opts.autoUpdate || _updating) {
                        _update(TRUE);
                        if (_supportsState()) {
                            _h[_opts.history ? 'pushState' : 'replaceState']({}, '',
                                    _opts.state.replace(/\/$/, '') + (_value === '' ? '/' : _value));
                        } else {
                            _silent = TRUE;
                            if (_webkit) {
                                if (_opts.history) {
                                    _l.hash = '#' + _crawl(_value, TRUE);
                                } else {
                                    _l.replace('#' + _crawl(_value, TRUE));
                                }
                            } else if (_value != _href()) {
                                if (_opts.history) {
                                    _l.hash = '#' + _crawl(_value, TRUE);
                                } else {
                                    _l.replace('#' + _crawl(_value, TRUE));
                                }
                            }
                            if ((_msie && _version < 8) && _opts.history) {
                                _st(_html, 50);
                            }
                            if (_webkit) {
                                _st(function(){ _silent = FALSE; }, 1);
                            } else {
                                _silent = FALSE;
                            }
                        }
                    }
                    return this;
                }
                if (!_supported) {
                    return null;
                }
                return _strict(_value);
            },
            path: function(value) {
                if (value !== UNDEFINED) {
                    var qs = this.queryString(),
                        hash = this.hash();
                    this.value(value + (qs ? '?' + qs : '') + (hash ? '#' + hash : ''));
                    return this;
                }
                return _strict(_value).split('#')[0].split('?')[0];
            },
            pathNames: function() {
                var path = this.path(),
                    names = path.replace(_re, '/').split('/');
                if (path.substr(0, 1) == '/' || path.length === 0) {
                    names.splice(0, 1);
                }
                if (path.substr(path.length - 1, 1) == '/') {
                    names.splice(names.length - 1, 1);
                }
                return names;
            },
            queryString: function(value) {
                if (value !== UNDEFINED) {
                    var hash = this.hash();
                    this.value(this.path() + (value ? '?' + value : '') + (hash ? '#' + hash : ''));
                    return this;
                }
                var arr = _value.split('?');
                return arr.slice(1, arr.length).join('?').split('#')[0];
            },
            parameter: function(name, value, append) {
                var i, params;
                if (value !== UNDEFINED) {
                    var names = this.parameterNames();
                    params = [];
                    value = value ? value.toString() : '';
                    for (i = 0; i < names.length; i++) {
                        var n = names[i],
                            v = this.parameter(n);
                        if (typeof v == STRING) {
                            v = [v];
                        }
                        if (n == name) {
                            v = (value === null || value === '') ? [] :
                                (append ? v.concat([value]) : [value]);
                        }
                        for (var j = 0; j < v.length; j++) {
                            params.push(n + '=' + v[j]);
                        }
                    }
                    if ($.inArray(name, names) == -1 && value !== null && value !== '') {
                        params.push(name + '=' + value);
                    }
                    this.queryString(params.join('&'));
                    return this;
                }
                value = this.queryString();
                if (value) {
                    var r = [];
                    params = value.split('&');
                    for (i = 0; i < params.length; i++) {
                        var p = params[i].split('=');
                        if (p[0] == name) {
                            r.push(p.slice(1).join('='));
                        }
                    }
                    if (r.length !== 0) {
                        return r.length != 1 ? r : r[0];
                    }
                }
            },
            parameterNames: function() {
                var qs = this.queryString(),
                    names = [];
                if (qs && qs.indexOf('=') != -1) {
                    var params = qs.split('&');
                    for (var i = 0; i < params.length; i++) {
                        var name = params[i].split('=')[0];
                        if ($.inArray(name, names) == -1) {
                            names.push(name);
                        }
                    }
                }
                return names;
            },
            hash: function(value) {
                if (value !== UNDEFINED) {
                    this.value(_value.split('#')[0] + (value ? '#' + value : ''));
                    return this;
                }
                var arr = _value.split('#');
                return arr.slice(1, arr.length).join('#');
            }
        };
    })();

    $.fn.address = function(fn) {
        if (!$(this).attr('address')) {
            var f = function(e) {
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    return true;
                }
                if ($(this).is('a')) {
                    var value = fn ? fn.call(this) :
                        /address:/.test($(this).attr('rel')) ? $(this).attr('rel').split('address:')[1].split(' ')[0] :
                        $.address.state() !== undefined && $.address.state() != '/' ?
                                $(this).attr('href').replace(new RegExp('^(.*' + $.address.state() + '|\\.)'), '') :
                                $(this).attr('href').replace(/^(#\!?|\.)/, '');
                    $.address.value(value);
                    e.preventDefault();
                }
            };
            $(this).click(f).live('click', f).live('submit', function(e) {
                if ($(this).is('form')) {
                    var action = $(this).attr('action'),
                        value = fn ? fn.call(this) : (action.indexOf('?') != -1 ? action.replace(/&$/, '') : action + '?') +
                            $(this).serialize();
                    $.address.value(value);
                    e.preventDefault();
                }
            }).attr('address', true);
        }
        return this;
    };

})(jQuery);

/**
 * easyXDM
 * http://easyxdm.net/
 * Copyright(c) 2009, Ã˜yvind Sean Kinsey, oyvind@kinsey.no.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(I,c,l,F,g,C){var b=this;var j=Math.floor(Math.random()*100)*100;var m=Function.prototype;var L=/^(http.?:\/\/([^\/\s]+))/;var M=/[\-\w]+\/\.\.\//;var A=/([^:])\/\//g;var D="";var k={};var H=I.easyXDM;var P="easyXDM_";var z;function x(S,U){var T=typeof S[U];return T=="function"||(!!(T=="object"&&S[U]))||T=="unknown"}function q(S,T){return !!(typeof(S[T])=="object"&&S[T])}function n(S){return Object.prototype.toString.call(S)==="[object Array]"}var r,t;if(x(I,"addEventListener")){r=function(U,S,T){U.addEventListener(S,T,false)};t=function(U,S,T){U.removeEventListener(S,T,false)}}else{if(x(I,"attachEvent")){r=function(S,U,T){S.attachEvent("on"+U,T)};t=function(S,U,T){S.detachEvent("on"+U,T)}}else{throw new Error("Browser not supported")}}var R=false,E=[],G;if("readyState" in c){G=c.readyState;R=G=="complete"||(~navigator.userAgent.indexOf("AppleWebKit/")&&(G=="loaded"||G=="interactive"))}else{R=!!c.body}function o(){o=m;R=true;for(var S=0;S<E.length;S++){E[S]()}E.length=0}if(!R){if(x(I,"addEventListener")){r(c,"DOMContentLoaded",o)}else{r(c,"readystatechange",function(){if(c.readyState=="complete"){o()}});if(c.documentElement.doScroll&&I===top){(function e(){if(R){return}try{c.documentElement.doScroll("left")}catch(S){F(e,1);return}o()}())}}r(I,"load",o)}function B(T,S){if(R){T.call(S);return}E.push(function(){T.call(S)})}function i(){var U=parent;if(D!==""){for(var S=0,T=D.split(".");S<T.length;S++){U=U[T[S]]}}return U.easyXDM}function d(S){I.easyXDM=H;D=S;if(D){P="easyXDM_"+D.replace(".","_")+"_"}return k}function u(S){return S.match(L)[2]}function f(S){return S.match(L)[1]}function w(S){S=S.replace(A,"$1/");if(!S.match(/^(http||https):\/\//)){var T=(S.substring(0,1)==="/")?"":l.pathname;if(T.substring(T.length-1)!=="/"){T=T.substring(0,T.lastIndexOf("/")+1)}S=l.protocol+"//"+l.host+T+S}while(M.test(S)){S=S.replace(M,"")}return S}function K(S,V){var X="",U=S.indexOf("#");if(U!==-1){X=S.substring(U);S=S.substring(0,U)}var W=[];for(var T in V){if(V.hasOwnProperty(T)){W.push(T+"="+C(V[T]))}}return S+((S.indexOf("?")===-1)?"?":"&")+W.join("&")+X}var N=(function(){var U={},V,T=l.search.substring(1).split("&"),S=T.length;while(S--){V=T[S].split("=");U[V[0]]=g(V[1])}return U}());function p(S){return typeof S==="undefined"}function J(){var T={};var U={a:[1,2,3]},S='{"a":[1,2,3]}';if(JSON&&typeof JSON.stringify==="function"&&JSON.stringify(U).replace((/\s/g),"")===S){return JSON}if(Object.toJSON){if(Object.toJSON(U).replace((/\s/g),"")===S){T.stringify=Object.toJSON}}if(typeof String.prototype.evalJSON==="function"){U=S.evalJSON();if(U.a&&U.a.length===3&&U.a[2]===3){T.parse=function(V){return V.evalJSON()}}}if(T.stringify&&T.parse){J=function(){return T};return T}return null}function O(S,T,U){var W;for(var V in T){if(T.hasOwnProperty(V)){if(V in S){W=T[V];if(typeof W==="object"){O(S[V],W,U)}else{if(!U){S[V]=T[V]}}}else{S[V]=T[V]}}}return S}function a(){var S=c.createElement("iframe");S.name=P+"TEST";O(S.style,{position:"absolute",left:"-2000px",top:"0px"});c.body.appendChild(S);z=!(S.contentWindow===I.frames[S.name]);c.body.removeChild(S)}function v(S){if(p(z)){a()}var T;if(z){T=c.createElement('<iframe name="'+S.props.name+'"/>')}else{T=c.createElement("IFRAME");T.name=S.props.name}T.id=T.name=S.props.name;delete S.props.name;if(S.onLoad){r(T,"load",S.onLoad)}if(typeof S.container=="string"){S.container=c.getElementById(S.container)}if(!S.container){T.style.position="absolute";T.style.left="-2000px";T.style.top="0px";S.container=c.body}T.border=T.frameBorder=0;S.container.insertBefore(T,S.container.firstChild);O(T,S.props);return T}function Q(V,U){if(typeof V=="string"){V=[V]}var T,S=V.length;while(S--){T=V[S];T=new RegExp(T.substr(0,1)=="^"?T:("^"+T.replace(/(\*)/g,".$1").replace(/\?/g,".")+"$"));if(T.test(U)){return true}}return false}function h(U){var Z=U.protocol,T;U.isHost=U.isHost||p(N.xdm_p);if(!U.props){U.props={}}if(!U.isHost){U.channel=N.xdm_c;U.secret=N.xdm_s;U.remote=N.xdm_e;Z=N.xdm_p;if(U.acl&&!Q(U.acl,U.remote)){throw new Error("Access denied for "+U.remote)}}else{U.remote=w(U.remote);U.channel=U.channel||"default"+j++;U.secret=Math.random().toString(16).substring(2);if(p(Z)){if(f(l.href)==f(U.remote)){Z="4"}else{if(x(I,"postMessage")||x(c,"postMessage")){Z="1"}else{if(x(I,"ActiveXObject")&&x(I,"execScript")){Z="3"}else{if(navigator.product==="Gecko"&&"frameElement" in I&&navigator.userAgent.indexOf("WebKit")==-1){Z="5"}else{if(U.remoteHelper){U.remoteHelper=w(U.remoteHelper);Z="2"}else{Z="0"}}}}}}}switch(Z){case"0":O(U,{interval:100,delay:2000,useResize:true,useParent:false,usePolling:false},true);if(U.isHost){if(!U.local){var X=l.protocol+"//"+l.host,S=c.body.getElementsByTagName("img"),Y;var V=S.length;while(V--){Y=S[V];if(Y.src.substring(0,X.length)===X){U.local=Y.src;break}}if(!U.local){U.local=I}}var W={xdm_c:U.channel,xdm_p:0};if(U.local===I){U.usePolling=true;U.useParent=true;U.local=l.protocol+"//"+l.host+l.pathname+l.search;W.xdm_e=U.local;W.xdm_pa=1}else{W.xdm_e=w(U.local)}if(U.container){U.useResize=false;W.xdm_po=1}U.remote=K(U.remote,W)}else{O(U,{channel:N.xdm_c,remote:N.xdm_e,useParent:!p(N.xdm_pa),usePolling:!p(N.xdm_po),useResize:U.useParent?false:U.useResize})}T=[new k.stack.HashTransport(U),new k.stack.ReliableBehavior({}),new k.stack.QueueBehavior({encode:true,maxLength:4000-U.remote.length}),new k.stack.VerifyBehavior({initiate:U.isHost})];break;case"1":T=[new k.stack.PostMessageTransport(U)];break;case"2":T=[new k.stack.NameTransport(U),new k.stack.QueueBehavior(),new k.stack.VerifyBehavior({initiate:U.isHost})];break;case"3":T=[new k.stack.NixTransport(U)];break;case"4":T=[new k.stack.SameOriginTransport(U)];break;case"5":T=[new k.stack.FrameElementTransport(U)];break}T.push(new k.stack.QueueBehavior({lazy:U.lazy,remove:true}));return T}function y(V){var W,U={incoming:function(Y,X){this.up.incoming(Y,X)},outgoing:function(X,Y){this.down.outgoing(X,Y)},callback:function(X){this.up.callback(X)},init:function(){this.down.init()},destroy:function(){this.down.destroy()}};for(var T=0,S=V.length;T<S;T++){W=V[T];O(W,U,true);if(T!==0){W.down=V[T-1]}if(T!==S-1){W.up=V[T+1]}}return W}function s(S){S.up.down=S.down;S.down.up=S.up;S.up=S.down=null}O(k,{version:"2.4.10.103",query:N,stack:{},apply:O,getJSONObject:J,whenReady:B,noConflict:d});k.DomHelper={on:r,un:t,requiresJSON:function(S){if(!q(I,"JSON")){c.write('<script type="text/javascript" src="'+S+'"><\/script>')}}};(function(){var S={};k.Fn={set:function(T,U){S[T]=U},get:function(U,T){var V=S[U];if(T){delete S[U]}return V}}}());k.Socket=function(T){var S=y(h(T).concat([{incoming:function(W,V){T.onMessage(W,V)},callback:function(V){if(T.onReady){T.onReady(V)}}}])),U=f(T.remote);this.origin=f(T.remote);this.destroy=function(){S.destroy()};this.postMessage=function(V){S.outgoing(V,U)};S.init()};k.Rpc=function(U,T){if(T.local){for(var W in T.local){if(T.local.hasOwnProperty(W)){var V=T.local[W];if(typeof V==="function"){T.local[W]={method:V}}}}}var S=y(h(U).concat([new k.stack.RpcBehavior(this,T),{callback:function(X){if(U.onReady){U.onReady(X)}}}]));this.origin=f(U.remote);this.destroy=function(){S.destroy()};S.init()};k.stack.SameOriginTransport=function(T){var U,W,V,S;return(U={outgoing:function(Y,Z,X){V(Y);if(X){X()}},destroy:function(){if(W){W.parentNode.removeChild(W);W=null}},onDOMReady:function(){S=f(T.remote);if(T.isHost){O(T.props,{src:K(T.remote,{xdm_e:l.protocol+"//"+l.host+l.pathname,xdm_c:T.channel,xdm_p:4}),name:P+T.channel+"_provider"});W=v(T);k.Fn.set(T.channel,function(X){V=X;F(function(){U.up.callback(true)},0);return function(Y){U.up.incoming(Y,S)}})}else{V=i().Fn.get(T.channel,true)(function(X){U.up.incoming(X,S)});F(function(){U.up.callback(true)},0)}},init:function(){B(U.onDOMReady,U)}})};k.stack.PostMessageTransport=function(V){var X,Y,T,U;function S(Z){if(Z.origin){return Z.origin}if(Z.uri){return f(Z.uri)}if(Z.domain){return l.protocol+"//"+Z.domain}throw"Unable to retrieve the origin of the event"}function W(aa){var Z=S(aa);if(Z==U&&aa.data.substring(0,V.channel.length+1)==V.channel+" "){X.up.incoming(aa.data.substring(V.channel.length+1),Z)}}return(X={outgoing:function(aa,ab,Z){T.postMessage(V.channel+" "+aa,ab||U);if(Z){Z()}},destroy:function(){t(I,"message",W);if(Y){T=null;Y.parentNode.removeChild(Y);Y=null}},onDOMReady:function(){U=f(V.remote);if(V.isHost){r(I,"message",function Z(aa){if(aa.data==V.channel+"-ready"){T=("postMessage" in Y.contentWindow)?Y.contentWindow:Y.contentWindow.document;t(I,"message",Z);r(I,"message",W);F(function(){X.up.callback(true)},0)}});O(V.props,{src:K(V.remote,{xdm_e:l.protocol+"//"+l.host,xdm_c:V.channel,xdm_p:1}),name:P+V.channel+"_provider"});Y=v(V)}else{r(I,"message",W);T=("postMessage" in I.parent)?I.parent:I.parent.document;T.postMessage(V.channel+"-ready",U);F(function(){X.up.callback(true)},0)}},init:function(){B(X.onDOMReady,X)}})};k.stack.FrameElementTransport=function(T){var U,W,V,S;return(U={outgoing:function(Y,Z,X){V.call(this,Y);if(X){X()}},destroy:function(){if(W){W.parentNode.removeChild(W);W=null}},onDOMReady:function(){S=f(T.remote);if(T.isHost){O(T.props,{src:K(T.remote,{xdm_e:l.protocol+"//"+l.host+l.pathname+l.search,xdm_c:T.channel,xdm_p:5}),name:P+T.channel+"_provider"});W=v(T);W.fn=function(X){delete W.fn;V=X;F(function(){U.up.callback(true)},0);return function(Y){U.up.incoming(Y,S)}}}else{I.parent.location=N.xdm_e+"#";V=I.frameElement.fn(function(X){U.up.incoming(X,S)});U.up.callback(true)}},init:function(){B(U.onDOMReady,U)}})};k.stack.NixTransport=function(T){var V,X,W,S,U;return(V={outgoing:function(Z,aa,Y){W(Z);if(Y){Y()}},destroy:function(){U=null;if(X){X.parentNode.removeChild(X);X=null}},onDOMReady:function(){S=f(T.remote);if(T.isHost){try{if(!x(I,"getNixProxy")){I.execScript("Class NixProxy\n    Private m_parent, m_child, m_Auth\n\n    Public Sub SetParent(obj, auth)\n        If isEmpty(m_Auth) Then m_Auth = auth\n        SET m_parent = obj\n    End Sub\n    Public Sub SetChild(obj)\n        SET m_child = obj\n        m_parent.ready()\n    End Sub\n\n    Public Sub SendToParent(data, auth)\n        If m_Auth = auth Then m_parent.send(CStr(data))\n    End Sub\n    Public Sub SendToChild(data, auth)\n        If m_Auth = auth Then m_child.send(CStr(data))\n    End Sub\nEnd Class\nFunction getNixProxy()\n    Set GetNixProxy = New NixProxy\nEnd Function\n","vbscript")}U=getNixProxy();U.SetParent({send:function(aa){V.up.incoming(aa,S)},ready:function(){F(function(){V.up.callback(true)},0)}},T.secret);W=function(aa){U.SendToChild(aa,T.secret)}}catch(Z){throw new Error("Could not set up VBScript NixProxy:"+Z.message)}O(T.props,{src:K(T.remote,{xdm_e:l.protocol+"//"+l.host+l.pathname+l.search,xdm_c:T.channel,xdm_s:T.secret,xdm_p:3}),name:P+T.channel+"_provider"});X=v(T);X.contentWindow.opener=U}else{I.parent.location=N.xdm_e+"#";try{U=I.opener}catch(Y){throw new Error("Cannot access window.opener")}U.SetChild({send:function(aa){b.setTimeout(function(){V.up.incoming(aa,S)},0)}});W=function(aa){U.SendToParent(aa,T.secret)};F(function(){V.up.callback(true)},0)}},init:function(){B(V.onDOMReady,V)}})};k.stack.NameTransport=function(W){var X;var Z,ad,V,ab,ac,T,S;function aa(ag){var af=W.remoteHelper+(Z?"#_3":"#_2")+W.channel;ad.contentWindow.sendMessage(ag,af)}function Y(){if(Z){if(++ab===2||!Z){X.up.callback(true)}}else{aa("ready");X.up.callback(true)}}function ae(af){X.up.incoming(af,T)}function U(){if(ac){F(function(){ac(true)},0)}}return(X={outgoing:function(ag,ah,af){ac=af;aa(ag)},destroy:function(){ad.parentNode.removeChild(ad);ad=null;if(Z){V.parentNode.removeChild(V);V=null}},onDOMReady:function(){Z=W.isHost;ab=0;T=f(W.remote);W.local=w(W.local);if(Z){k.Fn.set(W.channel,function(ag){if(Z&&ag==="ready"){k.Fn.set(W.channel,ae);Y()}});S=K(W.remote,{xdm_e:W.local,xdm_c:W.channel,xdm_p:2});O(W.props,{src:S+"#"+W.channel,name:P+W.channel+"_provider"});V=v(W)}else{W.remoteHelper=W.remote;k.Fn.set(W.channel,ae)}ad=v({props:{src:W.local+"#_4"+W.channel},onLoad:function af(){t(ad,"load",af);k.Fn.set(W.channel+"_load",U);(function ag(){if(typeof ad.contentWindow.sendMessage=="function"){Y()}else{F(ag,50)}}())}})},init:function(){B(X.onDOMReady,X)}})};k.stack.HashTransport=function(U){var X;var ac=this,aa,V,S,Y,ah,W,ag;var ab,T;function af(aj){if(!ag){return}var ai=U.remote+"#"+(ah++)+"_"+aj;((aa||!ab)?ag.contentWindow:ag).location=ai}function Z(ai){Y=ai;X.up.incoming(Y.substring(Y.indexOf("_")+1),T)}function ae(){if(!W){return}var ai=W.location.href,ak="",aj=ai.indexOf("#");if(aj!=-1){ak=ai.substring(aj)}if(ak&&ak!=Y){Z(ak)}}function ad(){V=setInterval(ae,S)}return(X={outgoing:function(ai,aj){af(ai)},destroy:function(){I.clearInterval(V);if(aa||!ab){ag.parentNode.removeChild(ag)}ag=null},onDOMReady:function(){aa=U.isHost;S=U.interval;Y="#"+U.channel;ah=0;ab=U.useParent;T=f(U.remote);if(aa){U.props={src:U.remote,name:P+U.channel+"_provider"};if(ab){U.onLoad=function(){W=I;ad();X.up.callback(true)}}else{var ak=0,ai=U.delay/50;(function aj(){if(++ak>ai){throw new Error("Unable to reference listenerwindow")}try{W=ag.contentWindow.frames[P+U.channel+"_consumer"]}catch(al){}if(W){ad();X.up.callback(true)}else{F(aj,50)}}())}ag=v(U)}else{W=I;ad();if(ab){ag=parent;X.up.callback(true)}else{O(U,{props:{src:U.remote+"#"+U.channel+new Date(),name:P+U.channel+"_consumer"},onLoad:function(){X.up.callback(true)}});ag=v(U)}}},init:function(){B(X.onDOMReady,X)}})};k.stack.ReliableBehavior=function(T){var V,X;var W=0,S=0,U="";return(V={incoming:function(aa,Y){var Z=aa.indexOf("_"),ab=aa.substring(0,Z).split(",");aa=aa.substring(Z+1);if(ab[0]==W){U="";if(X){X(true)}}if(aa.length>0){V.down.outgoing(ab[1]+","+W+"_"+U,Y);if(S!=ab[1]){S=ab[1];V.up.incoming(aa,Y)}}},outgoing:function(aa,Y,Z){U=aa;X=Z;V.down.outgoing(S+","+(++W)+"_"+aa,Y)}})};k.stack.QueueBehavior=function(U){var X,Y=[],ab=true,V="",aa,S=0,T=false,W=false;function Z(){if(U.remove&&Y.length===0){s(X);return}if(ab||Y.length===0||aa){return}ab=true;var ac=Y.shift();X.down.outgoing(ac.data,ac.origin,function(ad){ab=false;if(ac.callback){F(function(){ac.callback(ad)},0)}Z()})}return(X={init:function(){if(p(U)){U={}}if(U.maxLength){S=U.maxLength;W=true}if(U.lazy){T=true}else{X.down.init()}},callback:function(ad){ab=false;var ac=X.up;Z();ac.callback(ad)},incoming:function(af,ad){if(W){var ae=af.indexOf("_"),ac=parseInt(af.substring(0,ae),10);V+=af.substring(ae+1);if(ac===0){if(U.encode){V=g(V)}X.up.incoming(V,ad);V=""}}else{X.up.incoming(af,ad)}},outgoing:function(ag,ad,af){if(U.encode){ag=C(ag)}var ac=[],ae;if(W){while(ag.length!==0){ae=ag.substring(0,S);ag=ag.substring(ae.length);ac.push(ae)}while((ae=ac.shift())){Y.push({data:ac.length+"_"+ae,origin:ad,callback:ac.length===0?af:null})}}else{Y.push({data:ag,origin:ad,callback:af})}if(T){X.down.init()}else{Z()}},destroy:function(){aa=true;X.down.destroy()}})};k.stack.VerifyBehavior=function(W){var X,V,T,U=false;function S(){V=Math.random().toString(16).substring(2);X.down.outgoing(V)}return(X={incoming:function(aa,Y){var Z=aa.indexOf("_");if(Z===-1){if(aa===V){X.up.callback(true)}else{if(!T){T=aa;if(!W.initiate){S()}X.down.outgoing(aa)}}}else{if(aa.substring(0,Z)===T){X.up.incoming(aa.substring(Z+1),Y)}}},outgoing:function(aa,Y,Z){X.down.outgoing(V+"_"+aa,Y,Z)},callback:function(Y){if(W.initiate){S()}}})};k.stack.RpcBehavior=function(Y,T){var V,aa=T.serializer||J();var Z=0,X={};function S(ab){ab.jsonrpc="2.0";V.down.outgoing(aa.stringify(ab))}function W(ab,ad){var ac=Array.prototype.slice;return function(){var ae=arguments.length,ag,af={method:ad};if(ae>0&&typeof arguments[ae-1]==="function"){if(ae>1&&typeof arguments[ae-2]==="function"){ag={success:arguments[ae-2],error:arguments[ae-1]};af.params=ac.call(arguments,0,ae-2)}else{ag={success:arguments[ae-1]};af.params=ac.call(arguments,0,ae-1)}X[""+(++Z)]=ag;af.id=Z}else{af.params=ac.call(arguments,0)}if(ab.namedParams&&af.params.length===1){af.params=af.params[0]}S(af)}}function U(ai,ah,ad,ag){if(!ad){if(ah){S({id:ah,error:{code:-32601,message:"Procedure not found."}})}return}var af,ac;if(ah){af=function(aj){af=m;S({id:ah,result:aj})};ac=function(aj,ak){ac=m;var al={id:ah,error:{code:-32099,message:aj}};if(ak){al.error.data=ak}S(al)}}else{af=ac=m}if(!n(ag)){ag=[ag]}try{var ab=ad.method.apply(ad.scope,ag.concat([af,ac]));if(!p(ab)){af(ab)}}catch(ae){ac(ae.message)}}return(V={incoming:function(ac,ab){var ad=aa.parse(ac);if(ad.method){if(T.handle){T.handle(ad,S)}else{U(ad.method,ad.id,T.local[ad.method],ad.params)}}else{var ae=X[ad.id];if(ad.error){if(ae.error){ae.error(ad.error)}}else{if(ae.success){ae.success(ad.result)}}delete X[ad.id]}},init:function(){if(T.remote){for(var ab in T.remote){if(T.remote.hasOwnProperty(ab)){Y[ab]=W(T.remote[ab],ab)}}}V.down.init()},destroy:function(){for(var ab in T.remote){if(T.remote.hasOwnProperty(ab)&&Y.hasOwnProperty(ab)){delete Y[ab]}}V.down.destroy()}})};b.easyXDM=k})(window,document,location,window.setTimeout,decodeURIComponent,encodeURIComponent);
/*
 * jsTree 1.0-rc3
 * http://jstree.com/
 *
 * Copyright (c) 2010 Ivan Bozhanov (vakata.com)
 *
 * Licensed same as jquery - under the terms of either the MIT License or the GPL Version 2 License
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Date: 2011-02-08 23:17:14 +0000 (Tue, 08 Feb 2011) $
 * $Revision: 236 $
 *
 *
 * -- MODIFIED FOR GISCLOUD LAYER LIST --
 *
 */

/*jslint browser: true, onevar: true, undef: true, bitwise: true, strict: true */
/*global window : false, clearInterval: false, clearTimeout: false, document: false, setInterval: false, setTimeout: false, jQuery: false, navigator: false, XSLTProcessor: false, DOMParser: false, XMLSerializer: false*/



// top wrapper to prevent multiple inclusion (is this OK?)
(function () { if(jQuery && jQuery.jstree) { return; }
    var is_ie6 = false, is_ie7 = false, is_ff2 = false;

/*
 * jsTree core
 */
(function ($) {
    // Common functions not related to jsTree
    // decided to move them to a `vakata` "namespace"
    $.vakata = {};
    // CSS related functions
    $.vakata.css = {
        get_css : function(rule_name, delete_flag, sheet) {
            rule_name = rule_name.toLowerCase();
            var css_rules = sheet.cssRules || sheet.rules,
                j = 0;
            do {
                if(css_rules.length && j > css_rules.length + 5) { return false; }
                if(css_rules[j].selectorText && css_rules[j].selectorText.toLowerCase() == rule_name) {
                    if(delete_flag === true) {
                        if(sheet.removeRule) { sheet.removeRule(j); }
                        if(sheet.deleteRule) { sheet.deleteRule(j); }
                        return true;
                    }
                    else { return css_rules[j]; }
                }
            }
            while (css_rules[++j]);
            return false;
        },
        add_css : function(rule_name, sheet) {
            if($.jstree.css.get_css(rule_name, false, sheet)) { return false; }
            if(sheet.insertRule) { sheet.insertRule(rule_name + ' { }', 0); } else { sheet.addRule(rule_name, null, 0); }
            return $.vakata.css.get_css(rule_name);
        },
        remove_css : function(rule_name, sheet) {
            return $.vakata.css.get_css(rule_name, true, sheet);
        },
        add_sheet : function(opts) {
            var tmp = false, is_new = true;
            if(opts.str) {
                if(opts.title) { tmp = $("style[id='" + opts.title + "-stylesheet']")[0]; }
                if(tmp) { is_new = false; }
                else {
                    tmp = document.createElement("style");
                    tmp.setAttribute('type',"text/css");
                    if(opts.title) { tmp.setAttribute("id", opts.title + "-stylesheet"); }
                }
                if(tmp.styleSheet) {
                    if(is_new) {
                        document.getElementsByTagName("head")[0].appendChild(tmp);
                        tmp.styleSheet.cssText = opts.str;
                    }
                    else {
                        tmp.styleSheet.cssText = tmp.styleSheet.cssText + " " + opts.str;
                    }
                }
                else {
                    tmp.appendChild(document.createTextNode(opts.str));
                    document.getElementsByTagName("head")[0].appendChild(tmp);
                }
                return tmp.sheet || tmp.styleSheet;
            }
            if(opts.url) {
                if(document.createStyleSheet) {
                    try { tmp = document.createStyleSheet(opts.url); } catch (e) { }
                }
                else {
                    tmp         = document.createElement('link');
                    tmp.rel     = 'stylesheet';
                    tmp.type    = 'text/css';
                    tmp.media   = "all";
                    tmp.href    = opts.url;
                    document.getElementsByTagName("head")[0].appendChild(tmp);
                    return tmp.styleSheet;
                }
            }
        }
    };

    // private variables
    var instances = [],         // instance array (used by $.jstree.reference/create/focused)
        focused_instance = -1,  // the index in the instance array of the currently focused instance
        plugins = {},           // list of included plugins
        prepared_move = {};     // for the move_node function

    // jQuery plugin wrapper (thanks to jquery UI widget function)
    $.fn.jstree = function (settings) {
        var isMethodCall = (typeof settings == 'string'), // is this a method call like $().jstree("open_node")
            args = Array.prototype.slice.call(arguments, 1),
            returnValue = this;

        // if a method call execute the method on all selected instances
        if(isMethodCall) {
            if(settings.substring(0, 1) == '_') { return returnValue; }
            this.each(function() {
                var instance = instances[$.data(this, "jstree-instance-id")],
                    methodValue = (instance && $.isFunction(instance[settings])) ? instance[settings].apply(instance, args) : instance;
                    if(typeof methodValue !== "undefined" && (settings.indexOf("is_") === 0 || (methodValue !== true && methodValue !== false))) { returnValue = methodValue; return false; }
            });
        }
        else {
            this.each(function() {
                // extend settings and allow for multiple hashes and $.data
                var instance_id = $.data(this, "jstree-instance-id"),
                    a = [],
                    b = settings ? $.extend({}, true, settings) : {},
                    c = $(this),
                    s = false,
                    t = [];
                a = a.concat(args);
                if(c.data("jstree")) { a.push(c.data("jstree")); }
                b = a.length ? $.extend.apply(null, [true, b].concat(a)) : b;

                // if an instance already exists, destroy it first
                if(typeof instance_id !== "undefined" && instances[instance_id]) { instances[instance_id].destroy(); }
                // push a new empty object to the instances array
                instance_id = parseInt(instances.push({}),10) - 1;
                // store the jstree instance id to the container element
                $.data(this, "jstree-instance-id", instance_id);
                // clean up all plugins
                b.plugins = $.isArray(b.plugins) ? b.plugins : $.jstree.defaults.plugins.slice();
                b.plugins.unshift("core");
                // only unique plugins
                b.plugins = b.plugins.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");

                // extend defaults with passed data
                s = $.extend(true, {}, $.jstree.defaults, b);
                s.plugins = b.plugins;
                $.each(plugins, function (i, val) {
                    if($.inArray(i, s.plugins) === -1) { s[i] = null; delete s[i]; }
                    else { t.push(i); }
                });
                s.plugins = t;

                // push the new object to the instances array (at the same time set the default classes to the container) and init
                instances[instance_id] = new $.jstree._instance(instance_id, $(this).addClass("jstree jstree-" + instance_id), s);
                // init all activated plugins for this instance
                $.each(instances[instance_id]._get_settings().plugins, function (i, val) { instances[instance_id].data[val] = {}; });
                $.each(instances[instance_id]._get_settings().plugins, function (i, val) { if(plugins[val]) { plugins[val].__init.apply(instances[instance_id]); } });
                // initialize the instance
                setTimeout(function() { instances[instance_id].init(); }, 0);
            });
        }
        // return the jquery selection (or if it was a method call that returned a value - the returned value)
        return returnValue;
    };
    // object to store exposed functions and objects
    $.jstree = {
        defaults : {
            plugins : []
        },
        _focused : function () { return instances[focused_instance] || null; },
        _reference : function (needle) {
            // get by instance id
            if(instances[needle]) { return instances[needle]; }
            // get by DOM (if still no luck - return null
            var o = $(needle);
            if(!o.length && typeof needle === "string") { o = $("#" + needle); }
            if(!o.length) { return null; }
            return instances[o.closest(".jstree").data("jstree-instance-id")] || null;
        },
        _instance : function (index, container, settings) {
            // for plugins to store data in
            this.data = { core : {} };
            this.get_settings   = function () { return $.extend(true, {}, settings); };
            this._get_settings  = function () { return settings; };
            this.get_index      = function () { return index; };
            this.get_container  = function () { return container; };
            this.get_container_ul = function () { return container.children("ul:eq(0)"); };
            this._set_settings  = function (s) {
                settings = $.extend(true, {}, settings, s);
            };
        },
        _fn : { },
        plugin : function (pname, pdata) {
            pdata = $.extend({}, {
                __init      : $.noop,
                __destroy   : $.noop,
                _fn         : {},
                defaults    : false
            }, pdata);
            plugins[pname] = pdata;

            $.jstree.defaults[pname] = pdata.defaults;
            $.each(pdata._fn, function (i, val) {
                val.plugin      = pname;
                val.old         = $.jstree._fn[i];
                $.jstree._fn[i] = function () {
                    var rslt,
                        func = val,
                        args = Array.prototype.slice.call(arguments),
                        evnt = new $.Event("before.jstree"),
                        rlbk = false;

                    if(this.data.core.locked === true && i !== "unlock" && i !== "is_locked") { return; }

                    // Check if function belongs to the included plugins of this instance
                    do {
                        if(func && func.plugin && $.inArray(func.plugin, this._get_settings().plugins) !== -1) { break; }
                        func = func.old;
                    } while(func);
                    if(!func) { return; }

                    // context and function to trigger events, then finally call the function
                    if(i.indexOf("_") === 0) {
                        rslt = func.apply(this, args);
                    }
                    else {
                        rslt = this.get_container().triggerHandler(evnt, { "func" : i, "inst" : this, "args" : args, "plugin" : func.plugin });
                        if(rslt === false) { return; }
                        if(typeof rslt !== "undefined") { args = rslt; }

                        rslt = func.apply(
                            $.extend({}, this, {
                                __callback : function (data) {
                                    this.get_container().triggerHandler( i + '.jstree', { "inst" : this, "args" : args, "rslt" : data, "rlbk" : rlbk });
                                },
                                __rollback : function () {
                                    rlbk = this.get_rollback();
                                    return rlbk;
                                },
                                __call_old : function (replace_arguments) {
                                    return func.old.apply(this, (replace_arguments ? Array.prototype.slice.call(arguments, 1) : args ) );
                                }
                            }), args);
                    }

                    // return the result
                    return rslt;
                };
                $.jstree._fn[i].old = val.old;
                $.jstree._fn[i].plugin = pname;
            });
        },
        rollback : function (rb) {
            if(rb) {
                if(!$.isArray(rb)) { rb = [ rb ]; }
                $.each(rb, function (i, val) {
                    instances[val.i].set_rollback(val.h, val.d);
                });
            }
        }
    };
    // set the prototype for all instances
    $.jstree._fn = $.jstree._instance.prototype = {};

    // load the css when DOM is ready
    $(function() {
        // code is copied from jQuery ($.browser is deprecated + there is a bug in IE)
        var u = navigator.userAgent.toLowerCase(),
            v = (u.match( /.+?(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
            css_string = '' +
                '.jstree ul, .jstree li { display:block; margin:0 0 0 0; padding:0 0 0 0; list-style-type:none; } ' +
                '.jstree li { display:block; min-height:18px; line-height:18px; white-space:nowrap; margin-left:18px; min-width:18px; } ' +
                '.jstree-rtl li { margin-left:0; margin-right:18px; } ' +
                '.jstree > ul > li { margin-left:0px; } ' +
                '.jstree-rtl > ul > li { margin-right:0px; } ' +
                '.jstree ins { display:inline-block; text-decoration:none; width:18px; height:18px; margin:0 0 0 0; padding:0; } ' +
                '.jstree a { display:auto; line-height:16px; height:16px; color:#333; white-space:nowrap; text-decoration:none; padding:1px 2px; margin:0; font-size: 0.7em; font-family: sans-serif; } ' +
                '.jstree a:focus { outline: none; } ' +
                '.jstree a > ins { height:16px; width:16px; } ' +
                '.jstree a > .jstree-icon { margin-right:3px; } ' +
                '.jstree-rtl a > .jstree-icon { margin-left:3px; margin-right:0; } ' +
                'li.jstree-open > ul { display:block; } ' +
                'li.jstree-closed > ul { display:none; } ';
        // Correct IE 6 (does not support the > CSS selector)
        if(/msie/.test(u) && parseInt(v, 10) == 6) {
            is_ie6 = true;

            // fix image flicker and lack of caching
            try {
                document.execCommand("BackgroundImageCache", false, true);
            } catch (err) { }

            css_string += '' +
                '.jstree li { height:18px; margin-left:0; margin-right:0; } ' +
                '.jstree li li { margin-left:18px; } ' +
                '.jstree-rtl li li { margin-left:0px; margin-right:18px; } ' +
                'li.jstree-open ul { display:block; } ' +
                'li.jstree-closed ul { display:none !important; } ' +
                '.jstree li a { display:inline; border-width:0 !important; padding:0px 2px !important; } ' +
                '.jstree li a ins { height:16px; width:16px; margin-right:3px; } ' +
                '.jstree-rtl li a ins { margin-right:0px; margin-left:3px; } ';
        }
        // Correct IE 7 (shifts anchor nodes onhover)
        if(/msie/.test(u) && parseInt(v, 10) == 7) {
            is_ie7 = true;
            css_string += '.jstree li a { border-width:0 !important; padding:0px 2px !important; } ';
        }
        // correct ff2 lack of display:inline-block
        if(!/compatible/.test(u) && /mozilla/.test(u) && parseFloat(v, 10) < 1.9) {
            is_ff2 = true;
            css_string += '' +
                '.jstree ins { display:-moz-inline-box; } ' +
                '.jstree li { line-height:12px; } ' + // WHY??
                '.jstree a { display:-moz-inline-box; } ' +
                '.jstree .jstree-no-icons .jstree-checkbox { display:-moz-inline-stack !important; } ';
                /* this shouldn't be here as it is theme specific */
        }
        // the default stylesheet
        $.vakata.css.add_sheet({ str : css_string, title : "jstree" });
    });

    // core functions (open, close, create, update, delete)
    $.jstree.plugin("core", {
        __init : function () {
            this.data.core.locked = false;
            this.data.core.to_open = this.get_settings().core.initially_open;
            this.data.core.to_load = this.get_settings().core.initially_load;
        },
        defaults : {
            html_titles : false,
            animation   : 500,
            initially_open : [],
            initially_load : [],
            open_parents : true,
            notify_plugins : true,
            rtl         : false,
            load_open   : false,
            strings     : {
                loading     : "Loading ...",
                new_node    : "New node",
                multiple_selection : "Multiple selection"
            }
        },
        _fn : {
            init    : function () {
                this.set_focus();
                if(this._get_settings().core.rtl) {
                    this.get_container().addClass("jstree-rtl").css("direction", "rtl");
                }
                this.get_container().html("<ul><li class='jstree-last jstree-leaf'><ins>&#160;</ins><a class='jstree-loading' href='#'><ins class='jstree-icon'>&#160;</ins>" + this._get_string("loading") + "</a></li></ul>");
                this.data.core.li_height = this.get_container_ul().find("li.jstree-closed, li.jstree-leaf").eq(0).height() || 18;

                this.get_container()
                    .delegate("li > ins", "click.jstree", $.proxy(function (event) {
                            var trgt = $(event.target);
                            if(trgt.is("ins") && event.pageY - trgt.offset().top < this.data.core.li_height) { this.toggle_node(trgt); }
                        }, this))
                    .bind("mousedown.jstree", $.proxy(function () {
                            this.set_focus(); // This used to be setTimeout(set_focus,0) - why?
                        }, this))
                    .bind("dblclick.jstree", function (event) {
                        var sel;
                        if(document.selection && document.selection.empty) { document.selection.empty(); }
                        else {
                            if(window.getSelection) {
                                sel = window.getSelection();
                                try {
                                    sel.removeAllRanges();
                                    sel.collapse();
                                } catch (err) { }
                            }
                        }
                    });
                if(this._get_settings().core.notify_plugins) {
                    this.get_container()
                        .bind("load_node.jstree", $.proxy(function (e, data) {
                                var o = this._get_node(data.rslt.obj),
                                    t = this;
                                if(o === -1) { o = this.get_container_ul(); }
                                if(!o.length) { return; }
                                o.find("li").each(function () {
                                    var th = $(this);
                                    if(th.data("jstree")) {
                                        $.each(th.data("jstree"), function (plugin, values) {
                                            if(t.data[plugin] && $.isFunction(t["_" + plugin + "_notify"])) {
                                                t["_" + plugin + "_notify"].call(t, th, values);
                                            }
                                        });
                                    }
                                });
                            }, this));
                }
                if(this._get_settings().core.load_open) {
                    this.get_container()
                        .bind("load_node.jstree", $.proxy(function (e, data) {
                                var o = this._get_node(data.rslt.obj),
                                    t = this;
                                if(o === -1) { o = this.get_container_ul(); }
                                if(!o.length) { return; }
                                o.find("li.jstree-open:not(:has(ul))").each(function () {
                                    t.load_node(this, $.noop, $.noop);
                                });
                            }, this));
                }
                this.__callback();
                this.load_node(-1, function () { this.loaded(); this.reload_nodes(); });
            },
            destroy : function () {
                var i,
                    n = this.get_index(),
                    s = this._get_settings(),
                    _this = this;

                $.each(s.plugins, function (i, val) {
                    try { plugins[val].__destroy.apply(_this); } catch(err) { }
                });
                this.__callback();
                // set focus to another instance if this one is focused
                if(this.is_focused()) {
                    for(i in instances) {
                        if(instances.hasOwnProperty(i) && i != n) {
                            instances[i].set_focus();
                            break;
                        }
                    }
                }
                // if no other instance found
                if(n === focused_instance) { focused_instance = -1; }
                // remove all traces of jstree in the DOM (only the ones set using jstree*) and cleans all events
                this.get_container()
                    .unbind(".jstree")
                    .undelegate(".jstree")
                    .removeData("jstree-instance-id")
                    .find("[class^='jstree']")
                        .andSelf()
                        .attr("class", function () { return this.className.replace(/jstree[^ ]*|$/ig,''); });
                $(document)
                    .unbind(".jstree-" + n)
                    .undelegate(".jstree-" + n);
                // remove the actual data
                instances[n] = null;
                delete instances[n];
            },

            _core_notify : function (n, data) {
                if(data.opened) {
                    this.open_node(n, false, true);
                }
            },

            lock : function () {
                this.data.core.locked = true;
                this.get_container().children("ul").addClass("jstree-locked").css("opacity","0.7");
                this.__callback({});
            },
            unlock : function () {
                this.data.core.locked = false;
                this.get_container().children("ul").removeClass("jstree-locked").css("opacity","1");
                this.__callback({});
            },
            is_locked : function () { return this.data.core.locked; },
            save_opened : function () {
                var _this = this;
                this.data.core.to_open = [];
                this.get_container_ul().find("li.jstree-open").each(function () {
                    if(this.id) { _this.data.core.to_open.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); }
                });
                this.__callback(_this.data.core.to_open);
            },
            save_loaded : function () { },
            reload_nodes : function (is_callback) {
                var _this = this,
                    done = true,
                    current = [],
                    remaining = [];
                if(!is_callback) {
                    this.data.core.reopen = false;
                    this.data.core.refreshing = true;
                    this.data.core.to_open = $.map($.makeArray(this.data.core.to_open), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
                    this.data.core.to_load = $.map($.makeArray(this.data.core.to_load), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
                    if(this.data.core.to_open.length) {
                        this.data.core.to_load = this.data.core.to_load.concat(this.data.core.to_open);
                    }
                }
                if(this.data.core.to_load.length) {
                    $.each(this.data.core.to_load, function (i, val) {
                        if(val == "#") { return true; }
                        if($(val).length) { current.push(val); }
                        else { remaining.push(val); }
                    });
                    if(current.length) {
                        this.data.core.to_load = remaining;
                        $.each(current, function (i, val) {
                            if(!_this._is_loaded(val)) {
                                _this.load_node(val, function () { _this.reload_nodes(true); }, function () { _this.reload_nodes(true); });
                                done = false;
                            }
                        });
                    }
                }
                if(this.data.core.to_open.length) {
                    $.each(this.data.core.to_open, function (i, val) {
                        _this.open_node(val, false, true);
                    });
                }
                if(done) {
                    // TODO: find a more elegant approach to syncronizing returning requests
                    if(this.data.core.reopen) { clearTimeout(this.data.core.reopen); }
                    this.data.core.reopen = setTimeout(function () { _this.__callback({}, _this); }, 50);
                    this.data.core.refreshing = false;
                    this.reopen();
                }
            },
            reopen : function () {
                var _this = this;
                if(this.data.core.to_open.length) {
                    $.each(this.data.core.to_open, function (i, val) {
                        _this.open_node(val, false, true);
                    });
                }
                this.__callback({});
            },
            refresh : function (obj) {
                var _this = this;
                this.save_opened();
                if(!obj) { obj = -1; }
                obj = this._get_node(obj);
                if(!obj) { obj = -1; }
                if(obj !== -1) { obj.children("UL").remove(); }
                else { this.get_container_ul().empty(); }
                this.load_node(obj, function () { _this.__callback({ "obj" : obj}); _this.reload_nodes(); });
            },
            // Dummy function to fire after the first load (so that there is a jstree.loaded event)
            loaded  : function () {
                this.__callback();
            },
            // deal with focus
            set_focus   : function () {
                if(this.is_focused()) { return; }
                var f = $.jstree._focused();
                if(f) { f.unset_focus(); }

                this.get_container().addClass("jstree-focused");
                focused_instance = this.get_index();
                this.__callback();
            },
            is_focused  : function () {
                return focused_instance == this.get_index();
            },
            unset_focus : function () {
                if(this.is_focused()) {
                    this.get_container().removeClass("jstree-focused");
                    focused_instance = -1;
                }
                this.__callback();
            },

            // traverse
            _get_node       : function (obj) {
                var $obj = $(obj, this.get_container());
                if($obj.is(".jstree") || obj == -1) { return -1; }
                $obj = $obj.closest("li", this.get_container());
                return $obj.length ? $obj : false;
            },
            _get_next       : function (obj, strict) {
                obj = this._get_node(obj);
                if(obj === -1) { return this.get_container().find("> ul > li:first-child"); }
                if(!obj.length) { return false; }
                if(strict) { return (obj.nextAll("li").size() > 0) ? obj.nextAll("li:eq(0)") : false; }

                if(obj.hasClass("jstree-open")) { return obj.find("li:eq(0)"); }
                else if(obj.nextAll("li").size() > 0) { return obj.nextAll("li:eq(0)"); }
                else { return obj.parentsUntil(".jstree","li").next("li").eq(0); }
            },
            _get_prev       : function (obj, strict) {
                obj = this._get_node(obj);
                if(obj === -1) { return this.get_container().find("> ul > li:last-child"); }
                if(!obj.length) { return false; }
                if(strict) { return (obj.prevAll("li").length > 0) ? obj.prevAll("li:eq(0)") : false; }

                if(obj.prev("li").length) {
                    obj = obj.prev("li").eq(0);
                    while(obj.hasClass("jstree-open")) { obj = obj.children("ul:eq(0)").children("li:last"); }
                    return obj;
                }
                else { var o = obj.parentsUntil(".jstree","li:eq(0)"); return o.length ? o : false; }
            },
            _get_parent     : function (obj) {
                obj = this._get_node(obj);
                if(obj == -1 || !obj.length) { return false; }
                var o = obj.parentsUntil(".jstree", "li:eq(0)");
                return o.length ? o : -1;
            },
            _get_children   : function (obj) {
                obj = this._get_node(obj);
                if(obj === -1) { return this.get_container().children("ul:eq(0)").children("li"); }
                if(!obj.length) { return false; }
                return obj.children("ul:eq(0)").children("li");
            },
            get_path        : function (obj, id_mode) {
                var p = [],
                    _this = this;
                obj = this._get_node(obj);
                if(obj === -1 || !obj || !obj.length) { return false; }
                obj.parentsUntil(".jstree", "li").each(function () {
                    p.push( id_mode ? this.id : _this.get_text(this) );
                });
                p.reverse();
                p.push( id_mode ? obj.attr("id") : this.get_text(obj) );
                return p;
            },

            // string functions
            _get_string : function (key) {
                return this._get_settings().core.strings[key] || key;
            },

            is_open     : function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-open"); },
            is_closed   : function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-closed"); },
            is_leaf     : function (obj) { obj = this._get_node(obj); return obj && obj !== -1 && obj.hasClass("jstree-leaf"); },
            correct_state   : function (obj) {
                obj = this._get_node(obj);
                if(!obj || obj === -1) { return false; }
                obj.removeClass("jstree-closed jstree-open").addClass("jstree-leaf").children("ul").remove();
                this.__callback({ "obj" : obj });
            },
            // open/close
            open_node   : function (obj, callback, skip_animation) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                if(!obj.hasClass("jstree-closed")) { if(callback) { callback.call(); } return false; }
                var s = skip_animation || is_ie6 ? 0 : this._get_settings().core.animation,
                    t = this;
                if(!this._is_loaded(obj)) {
                    obj.children("a").addClass("jstree-loading");
                    this.load_node(obj, function () { t.open_node(obj, callback, skip_animation); }, callback);
                }
                else {
                    if(this._get_settings().core.open_parents) {
                        obj.parentsUntil(".jstree",".jstree-closed").each(function () {
                            t.open_node(this, false, true);
                        });
                    }
                    if(s) { obj.children("ul").css("display","none"); }
                    obj.removeClass("jstree-closed").addClass("jstree-open").children("a").removeClass("jstree-loading");
                    if(s) { obj.children("ul").stop(true, true).slideDown(s, function () { this.style.display = ""; t.after_open(obj); }); }
                    else { t.after_open(obj); }
                    this.__callback({ "obj" : obj });
                    if(callback) { callback.call(); }
                }
            },
            after_open  : function (obj) { this.__callback({ "obj" : obj }); },
            close_node  : function (obj, skip_animation) {
                obj = this._get_node(obj);
                var s = skip_animation || is_ie6 ? 0 : this._get_settings().core.animation,
                    t = this;
                if(!obj.length || !obj.hasClass("jstree-open")) { return false; }
                if(s) { obj.children("ul").attr("style","display:block !important"); }
                obj.removeClass("jstree-open").addClass("jstree-closed");
                if(s) { obj.children("ul").stop(true, true).slideUp(s, function () { this.style.display = ""; t.after_close(obj); }); }
                else { t.after_close(obj); }
                this.__callback({ "obj" : obj });
            },
            after_close : function (obj) { this.__callback({ "obj" : obj }); },
            toggle_node : function (obj) {
                obj = this._get_node(obj);
                if(obj.hasClass("jstree-closed")) { return this.open_node(obj); }
                if(obj.hasClass("jstree-open")) { return this.close_node(obj); }
            },
            open_all    : function (obj, do_animation, original_obj) {
                obj = obj ? this._get_node(obj) : -1;
                if(!obj || obj === -1) { obj = this.get_container_ul(); }
                if(original_obj) {
                    obj = obj.find("li.jstree-closed");
                }
                else {
                    original_obj = obj;
                    if(obj.is(".jstree-closed")) { obj = obj.find("li.jstree-closed").andSelf(); }
                    else { obj = obj.find("li.jstree-closed"); }
                }
                var _this = this;
                obj.each(function () {
                    var __this = this;
                    if(!_this._is_loaded(this)) { _this.open_node(this, function() { _this.open_all(__this, do_animation, original_obj); }, !do_animation); }
                    else { _this.open_node(this, false, !do_animation); }
                });
                // so that callback is fired AFTER all nodes are open
                if(original_obj.find('li.jstree-closed').length === 0) { this.__callback({ "obj" : original_obj }); }
            },
            close_all   : function (obj, do_animation) {
                var _this = this;
                obj = obj ? this._get_node(obj) : this.get_container();
                if(!obj || obj === -1) { obj = this.get_container_ul(); }
                obj.find("li.jstree-open").andSelf().each(function () { _this.close_node(this, !do_animation); });
                this.__callback({ "obj" : obj });
            },
            clean_node  : function (obj) {
                obj = obj && obj != -1 ? $(obj) : this.get_container_ul();
                obj = obj.is("li") ? obj.find("li").andSelf() : obj.find("li");
                obj.removeClass("jstree-last")
                    .filter("li:last-child").addClass("jstree-last").end()
                    .filter(":has(li)")
                        .not(".jstree-open").removeClass("jstree-leaf").addClass("jstree-closed");
                obj.not(".jstree-open, .jstree-closed").addClass("jstree-leaf").children("ul").remove();
                this.__callback({ "obj" : obj });
            },
            // rollback
            get_rollback : function () {
                this.__callback();
                return { i : this.get_index(), h : this.get_container().children("ul").clone(true), d : this.data };
            },
            set_rollback : function (html, data) {
                this.get_container().empty().append(html);
                this.data = data;
                this.__callback();
            },
            // Dummy functions to be overwritten by any datastore plugin included
            load_node   : function (obj, s_call, e_call) { this.__callback({ "obj" : obj }); },
            _is_loaded  : function (obj) { return true; },

            // Basic operations: create
            create_node : function (obj, position, js, callback, is_loaded) {
                obj = this._get_node(obj);
                position = typeof position === "undefined" ? "last" : position;
                var d = $("<li />"),
                    s = this._get_settings().core,
                    tmp;

                if(obj !== -1 && !obj.length) { return false; }
                if(!is_loaded && !this._is_loaded(obj)) { this.load_node(obj, function () { this.create_node(obj, position, js, callback, true); }); return false; }

                this.__rollback();

                if(typeof js === "string") { js = { "data" : js }; }
                if(!js) { js = {}; }
                if(js.attr) { d.attr(js.attr); }
                if(js.metadata) { d.data(js.metadata); }
                if(js.state) { d.addClass("jstree-" + js.state); }
                if(!js.data) { js.data = this._get_string("new_node"); }
                if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
                $.each(js.data, function (i, m) {
                    tmp = $("<a />");
                    if($.isFunction(m)) { m = m.call(this, js); }
                    if(typeof m == "string") { tmp.attr('href','#')[ s.html_titles ? "html" : "text" ](m); }
                    else {
                        if(!m.attr) { m.attr = {}; }
                        if(!m.attr.href) { m.attr.href = '#'; }
                        tmp.attr(m.attr)[ s.html_titles ? "html" : "text" ](m.title);
                        if(m.language) { tmp.addClass(m.language); }
                    }
                    tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
                    if(m.icon) {
                        if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
                        else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
                    }
                    d.append(tmp);
                });
                d.prepend("<ins class='jstree-icon'>&#160;</ins>");
                if(obj === -1) {
                    obj = this.get_container();
                    if(position === "before") { position = "first"; }
                    if(position === "after") { position = "last"; }
                }
                switch(position) {
                    case "before": obj.before(d); tmp = this._get_parent(obj); break;
                    case "after" : obj.after(d);  tmp = this._get_parent(obj); break;
                    case "inside":
                    case "first" :
                        if(!obj.children("ul").length) { obj.append("<ul />"); }
                        obj.children("ul").prepend(d);
                        tmp = obj;
                        break;
                    case "last":
                        if(!obj.children("ul").length) { obj.append("<ul />"); }
                        obj.children("ul").append(d);
                        tmp = obj;
                        break;
                    default:
                        if(!obj.children("ul").length) { obj.append("<ul />"); }
                        if(!position) { position = 0; }
                        tmp = obj.children("ul").children("li").eq(position);
                        if(tmp.length) { tmp.before(d); }
                        else { obj.children("ul").append(d); }
                        tmp = obj;
                        break;
                }
                if(tmp === -1 || tmp.get(0) === this.get_container().get(0)) { tmp = -1; }
                this.clean_node(tmp);
                this.__callback({ "obj" : d, "parent" : tmp });
                if(callback) { callback.call(this, d); }
                return d;
            },
            // Basic operations: rename (deal with text)
            get_text    : function (obj) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                var s = this._get_settings().core.html_titles;
                obj = obj.children("a:eq(0)");
                if(s) {
                    obj = obj.clone();
                    obj.children("INS").remove();
                    return obj.html();
                }
                else {
                    obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
                    return obj.nodeValue;
                }
            },
            set_text    : function (obj, val) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                obj = obj.children("a:eq(0)");
                if(this._get_settings().core.html_titles) {
                    var tmp = obj.children("INS").clone();
                    obj.html(val).prepend(tmp);
                    this.__callback({ "obj" : obj, "name" : val });
                    return true;
                }
                else {
                    obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
                    this.__callback({ "obj" : obj, "name" : val });
                    return (obj.nodeValue = val);
                }
            },
            rename_node : function (obj, val) {
                obj = this._get_node(obj);
                this.__rollback();
                if(obj && obj.length && this.set_text.apply(this, Array.prototype.slice.call(arguments))) { this.__callback({ "obj" : obj, "name" : val }); }
            },
            // Basic operations: deleting nodes
            delete_node : function (obj) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                this.__rollback();
                var p = this._get_parent(obj), prev = $([]), t = this;
                obj.each(function () {
                    prev = prev.add(t._get_prev(this));
                });
                obj = obj.detach();
                if(p !== -1 && p.find("> ul > li").length === 0) {
                    p.removeClass("jstree-open jstree-closed").addClass("jstree-leaf");
                }
                this.clean_node(p);
                this.__callback({ "obj" : obj, "prev" : prev, "parent" : p });
                return obj;
            },
            prepare_move : function (o, r, pos, cb, is_cb) {
                var p = {};

                p.ot = $.jstree._reference(o) || this;
                p.o = p.ot._get_node(o);
                p.r = r === - 1 ? -1 : this._get_node(r);
                p.p = (typeof pos === "undefined" || pos === false) ? "last" : pos; // TODO: move to a setting
                if(!is_cb && prepared_move.o && prepared_move.o[0] === p.o[0] && prepared_move.r[0] === p.r[0] && prepared_move.p === p.p) {
                    this.__callback(prepared_move);
                    if(cb) { cb.call(this, prepared_move); }
                    return;
                }
                p.ot = $.jstree._reference(p.o) || this;
                p.rt = $.jstree._reference(p.r) || this; // r === -1 ? p.ot : $.jstree._reference(p.r) || this
                if(p.r === -1 || !p.r) {
                    p.cr = -1;
                    switch(p.p) {
                        case "first":
                        case "before":
                        case "inside":
                            p.cp = 0;
                            break;
                        case "after":
                        case "last":
                            p.cp = p.rt.get_container().find(" > ul > li").length;
                            break;
                        default:
                            p.cp = p.p;
                            break;
                    }
                }
                else {
                    if(!/^(before|after)$/.test(p.p) && !this._is_loaded(p.r)) {
                        return this.load_node(p.r, function () { this.prepare_move(o, r, pos, cb, true); });
                    }
                    switch(p.p) {
                        case "before":
                            p.cp = p.r.index();
                            p.cr = p.rt._get_parent(p.r);
                            break;
                        case "after":
                            p.cp = p.r.index() + 1;
                            p.cr = p.rt._get_parent(p.r);
                            break;
                        case "inside":
                        case "first":
                            p.cp = 0;
                            p.cr = p.r;
                            break;
                        case "last":
                            p.cp = p.r.find(" > ul > li").length;
                            p.cr = p.r;
                            break;
                        default:
                            p.cp = p.p;
                            p.cr = p.r;
                            break;
                    }
                }
                p.np = p.cr == -1 ? p.rt.get_container() : p.cr;
                p.op = p.ot._get_parent(p.o);
                p.cop = p.o.index();
                if(p.op === -1) { p.op = p.ot ? p.ot.get_container() : this.get_container(); }
                if(!/^(before|after)$/.test(p.p) && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp++; }
                //if(p.p === "before" && p.op && p.np && p.op[0] === p.np[0] && p.o.index() < p.cp) { p.cp--; }
                p.or = p.np.find(" > ul > li:nth-child(" + (p.cp + 1) + ")");
                prepared_move = p;
                this.__callback(prepared_move);
                if(cb) { cb.call(this, prepared_move); }
            },
            check_move : function () {
                var obj = prepared_move, ret = true, r = obj.r === -1 ? this.get_container() : obj.r;
                if(!obj || !obj.o || obj.or[0] === obj.o[0]) { return false; }
                if(obj.op && obj.np && obj.op[0] === obj.np[0] && obj.cp - 1 === obj.o.index()) { return false; }
                obj.o.each(function () {
                    if(r.parentsUntil(".jstree", "li").andSelf().index(this) !== -1) { ret = false; return false; }
                });
                return ret;
            },
            move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
                if(!is_prepared) {
                    return this.prepare_move(obj, ref, position, function (p) {
                        this.move_node(p, false, false, is_copy, true, skip_check);
                    });
                }
                if(is_copy) {
                    prepared_move.cy = true;
                }
                if(!skip_check && !this.check_move()) { return false; }

                this.__rollback();
                var o = false;
                if(is_copy) {
                    o = obj.o.clone(true);
                    o.find("*[id]").andSelf().each(function () {
                        if(this.id) { this.id = "copy_" + this.id; }
                    });
                }
                else { o = obj.o; }

                if(obj.or.length) { obj.or.before(o); }
                else {
                    if(!obj.np.children("ul").length) { $("<ul />").appendTo(obj.np); }
                    obj.np.children("ul:eq(0)").append(o);
                }

                try {
                    obj.ot.clean_node(obj.op);
                    obj.rt.clean_node(obj.np);
                    if(!obj.op.find("> ul > li").length) {
                        obj.op.removeClass("jstree-open jstree-closed").addClass("jstree-leaf").children("ul").remove();
                    }
                } catch (e) { }

                if(is_copy) {
                    prepared_move.cy = true;
                    prepared_move.oc = o;
                }
                this.__callback(prepared_move);
                return prepared_move;
            },
            _get_move : function () { return prepared_move; }
        }
    });
})(jQuery);
//*/

/*
 * jsTree ui plugin
 * This plugins handles selecting/deselecting/hovering/dehovering nodes
 */
(function ($) {
    var scrollbar_width, e1, e2;
    $(function() {
        if (/msie/.test(navigator.userAgent.toLowerCase())) {
            e1 = $('<textarea cols="10" rows="2"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
            e2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>').css({ position: 'absolute', top: -1000, left: 0 }).appendTo('body');
            scrollbar_width = e1.width() - e2.width();
            e1.add(e2).remove();
        }
        else {
            e1 = $('<div />').css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: 0 })
                    .prependTo('body').append('<div />').find('div').css({ width: '100%', height: 200 });
            scrollbar_width = 100 - e1.width();
            e1.parent().remove();
        }
    });
    $.jstree.plugin("ui", {
        __init : function () {
            this.data.ui.selected = $();
            this.data.ui.last_selected = false;
            this.data.ui.hovered = null;
            this.data.ui.to_select = this.get_settings().ui.initially_select;

            this.get_container()
                .delegate("a", "click.jstree", $.proxy(function (event) {
                        event.preventDefault();
                        event.currentTarget.blur();
                        if(!$(event.currentTarget).hasClass("jstree-loading")) {
                            this.select_node(event.currentTarget, true, event);
                        }
                    }, this))
                .delegate("a", "mouseenter.jstree", $.proxy(function (event) {
                        if(!$(event.currentTarget).hasClass("jstree-loading")) {
                            this.hover_node(event.target);
                        }
                    }, this))
                .delegate("a", "mouseleave.jstree", $.proxy(function (event) {
                        if(!$(event.currentTarget).hasClass("jstree-loading")) {
                            this.dehover_node(event.target);
                        }
                    }, this))
                .bind("reopen.jstree", $.proxy(function () {
                        this.reselect();
                    }, this))
                .bind("get_rollback.jstree", $.proxy(function () {
                        this.dehover_node();
                        this.save_selected();
                    }, this))
                .bind("set_rollback.jstree", $.proxy(function () {
                        this.reselect();
                    }, this))
                .bind("close_node.jstree", $.proxy(function (event, data) {
                        var s = this._get_settings().ui,
                            obj = this._get_node(data.rslt.obj),
                            clk = (obj && obj.length) ? obj.children("ul").find("a.jstree-clicked") : $(),
                            _this = this;
                        if(s.selected_parent_close === false || !clk.length) { return; }
                        clk.each(function () {
                            _this.deselect_node(this);
                            if(s.selected_parent_close === "select_parent") { _this.select_node(obj); }
                        });
                    }, this))
                .bind("delete_node.jstree", $.proxy(function (event, data) {
                        var s = this._get_settings().ui.select_prev_on_delete,
                            obj = this._get_node(data.rslt.obj),
                            clk = (obj && obj.length) ? obj.find("a.jstree-clicked") : [],
                            _this = this;
                        clk.each(function () { _this.deselect_node(this); });
                        if(s && clk.length) {
                            data.rslt.prev.each(function () {
                                if(this.parentNode) { _this.select_node(this); return false; /* if return false is removed all prev nodes will be selected */}
                            });
                        }
                    }, this))
                .bind("move_node.jstree", $.proxy(function (event, data) {
                        if(data.rslt.cy) {
                            data.rslt.oc.find("a.jstree-clicked").removeClass("jstree-clicked");
                        }
                    }, this));
        },
        defaults : {
            select_limit : -1, // 0, 1, 2 ... or -1 for unlimited
            select_multiple_modifier : "ctrl", // on, or ctrl, shift, alt
            select_range_modifier : "shift",
            selected_parent_close : "select_parent", // false, "deselect", "select_parent"
            selected_parent_open : true,
            select_prev_on_delete : true,
            disable_selecting_children : false,
            initially_select : []
        },
        _fn : {
            _get_node : function (obj, allow_multiple) {
                if(typeof obj === "undefined" || obj === null) { return allow_multiple ? this.data.ui.selected : this.data.ui.last_selected; }
                var $obj = $(obj, this.get_container());
                if($obj.is(".jstree") || obj == -1) { return -1; }
                $obj = $obj.closest("li", this.get_container());
                return $obj.length ? $obj : false;
            },
            _ui_notify : function (n, data) {
                if(data.selected) {
                    this.select_node(n, false);
                }
            },
            save_selected : function () {
                var _this = this;
                this.data.ui.to_select = [];
                this.data.ui.selected.each(function () { if(this.id) { _this.data.ui.to_select.push("#" + this.id.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:")); } });
                this.__callback(this.data.ui.to_select);
            },
            reselect : function () {
                var _this = this,
                    s = this.data.ui.to_select;
                s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
                // this.deselect_all(); WHY deselect, breaks plugin state notifier?
                $.each(s, function (i, val) { if(val && val !== "#") { _this.select_node(val); } });
                this.data.ui.selected = this.data.ui.selected.filter(function () { return this.parentNode; });
                this.__callback();
            },
            refresh : function (obj) {
                this.save_selected();
                return this.__call_old();
            },
            hover_node : function (obj) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                //if(this.data.ui.hovered && obj.get(0) === this.data.ui.hovered.get(0)) { return; }
                if(!obj.hasClass("jstree-hovered")) { this.dehover_node(); }
                this.data.ui.hovered = obj.children("a").addClass("jstree-hovered").parent();
                this._fix_scroll(obj);
                this.__callback({ "obj" : obj });
            },
            dehover_node : function () {
                var obj = this.data.ui.hovered, p;
                if(!obj || !obj.length) { return false; }
                p = obj.children("a").removeClass("jstree-hovered").parent();
                if(this.data.ui.hovered[0] === p[0]) { this.data.ui.hovered = null; }
                this.__callback({ "obj" : obj });
            },
            select_node : function (obj, check, e) {
                obj = this._get_node(obj);
                if(obj == -1 || !obj || !obj.length) { return false; }
                var s = this._get_settings().ui,
                    is_multiple = (s.select_multiple_modifier == "on" || (s.select_multiple_modifier !== false && e && e[s.select_multiple_modifier + "Key"])),
                    is_range = (s.select_range_modifier !== false && e && e[s.select_range_modifier + "Key"] && this.data.ui.last_selected && this.data.ui.last_selected[0] !== obj[0] && this.data.ui.last_selected.parent()[0] === obj.parent()[0]),
                    is_selected = this.is_selected(obj),
                    proceed = true,
                    t = this;
                if(check) {
                    if(s.disable_selecting_children && is_multiple &&
                        (
                            (obj.parentsUntil(".jstree","li").children("a.jstree-clicked").length) ||
                            (obj.children("ul").find("a.jstree-clicked:eq(0)").length)
                        )
                    ) {
                        return false;
                    }
                    proceed = false;
                    switch(!0) {
                        case (is_range):
                            this.data.ui.last_selected.addClass("jstree-last-selected");
                            obj = obj[ obj.index() < this.data.ui.last_selected.index() ? "nextUntil" : "prevUntil" ](".jstree-last-selected").andSelf();
                            if(s.select_limit == -1 || obj.length < s.select_limit) {
                                this.data.ui.last_selected.removeClass("jstree-last-selected");
                                this.data.ui.selected.each(function () {
                                    if(this !== t.data.ui.last_selected[0]) { t.deselect_node(this); }
                                });
                                is_selected = false;
                                proceed = true;
                            }
                            else {
                                proceed = false;
                            }
                            break;
                        case (is_selected && !is_multiple):
                            this.deselect_all();
                            is_selected = false;
                            proceed = true;
                            break;
                        case (!is_selected && !is_multiple):
                            if(s.select_limit == -1 || s.select_limit > 0) {
                                this.deselect_all();
                                proceed = true;
                            }
                            break;
                        case (is_selected && is_multiple):
                            this.deselect_node(obj);
                            break;
                        case (!is_selected && is_multiple):
                            if(s.select_limit == -1 || this.data.ui.selected.length + 1 <= s.select_limit) {
                                proceed = true;
                            }
                            break;
                    }
                }
                if(proceed && !is_selected) {
                    if(!is_range) { this.data.ui.last_selected = obj; }
                    obj.children("a").addClass("jstree-clicked");
                    if(s.selected_parent_open) {
                        obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
                    }
                    this.data.ui.selected = this.data.ui.selected.add(obj);
                    this._fix_scroll(obj.eq(0));
                    this.__callback({ "obj" : obj, "e" : e });
                }
            },
            _fix_scroll : function (obj) {
                var c = this.get_container()[0], t;
                if(c.scrollHeight > c.offsetHeight) {
                    obj = this._get_node(obj);
                    if(!obj || obj === -1 || !obj.length || !obj.is(":visible")) { return; }
                    t = obj.offset().top - this.get_container().offset().top;
                    if(t < 0) {
                        c.scrollTop = c.scrollTop + t - 1;
                    }
                    if(t + this.data.core.li_height + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0) > c.offsetHeight) {
                        c.scrollTop = c.scrollTop + (t - c.offsetHeight + this.data.core.li_height + 1 + (c.scrollWidth > c.offsetWidth ? scrollbar_width : 0));
                    }
                }
            },
            deselect_node : function (obj) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                if(this.is_selected(obj)) {
                    obj.children("a").removeClass("jstree-clicked");
                    this.data.ui.selected = this.data.ui.selected.not(obj);
                    if(this.data.ui.last_selected.get(0) === obj.get(0)) { this.data.ui.last_selected = this.data.ui.selected.eq(0); }
                    this.__callback({ "obj" : obj });
                }
            },
            toggle_select : function (obj) {
                obj = this._get_node(obj);
                if(!obj.length) { return false; }
                if(this.is_selected(obj)) { this.deselect_node(obj); }
                else { this.select_node(obj); }
            },
            is_selected : function (obj) { return this.data.ui.selected.index(this._get_node(obj)) >= 0; },
            get_selected : function (context) {
                return context ? $(context).find("a.jstree-clicked").parent() : this.data.ui.selected;
            },
            deselect_all : function (context) {
                var ret = context ? $(context).find("a.jstree-clicked").parent() : this.get_container().find("a.jstree-clicked").parent();
                ret.children("a.jstree-clicked").removeClass("jstree-clicked");
                this.data.ui.selected = $([]);
                this.data.ui.last_selected = false;
                this.__callback({ "obj" : ret });
            }
        }
    });
    // include the selection plugin by default
    $.jstree.defaults.plugins.push("ui");
})(jQuery);
//*/

/*
 * jsTree CRRM plugin
 * Handles creating/renaming/removing/moving nodes by user interaction.
 */
(function ($) {
    $.jstree.plugin("crrm", {
        __init : function () {
            this.get_container()
                .bind("move_node.jstree", $.proxy(function (e, data) {
                    if(this._get_settings().crrm.move.open_onmove) {
                        var t = this;
                        data.rslt.np.parentsUntil(".jstree").andSelf().filter(".jstree-closed").each(function () {
                            t.open_node(this, false, true);
                        });
                    }
                }, this));
        },
        defaults : {
            input_width_limit : 200,
            move : {
                always_copy         : false, // false, true or "multitree"
                open_onmove         : true,
                default_position    : "last",
                check_move          : function (m) { return true; }
            }
        },
        _fn : {
            _show_input : function (obj, callback) {
                obj = this._get_node(obj);
                var rtl = this._get_settings().core.rtl,
                    w = this._get_settings().crrm.input_width_limit,
                    w1 = obj.children("ins").width(),
                    w2 = obj.find("> a:visible > ins").width() * obj.find("> a:visible > ins").length,
                    t = this.get_text(obj),
                    h1 = $("<div />", { css : { "position" : "absolute", "top" : "-200px", "left" : (rtl ? "0px" : "-1000px"), "visibility" : "hidden" } }).appendTo("body"),
                    h2 = obj.css("position","relative").append(
                    $("<input />", {
                        "value" : t,
                        "class" : "jstree-rename-input",
                        // "size" : t.length,
                        "css" : {
                            "padding" : "0",
                            "border" : "1px solid silver",
                            "position" : "absolute",
                            "left"  : (rtl ? "auto" : (w1 + w2 + 4) + "px"),
                            "right" : (rtl ? (w1 + w2 + 4) + "px" : "auto"),
                            "top" : "0px",
                            "height" : (this.data.core.li_height - 2) + "px",
                            "lineHeight" : (this.data.core.li_height - 2) + "px",
                            "width" : "150px" // will be set a bit further down
                        },
                        "blur" : $.proxy(function () {
                            var i = obj.children(".jstree-rename-input"),
                                v = i.val();
                            if(v === "") { v = t; }
                            h1.remove();
                            i.remove(); // rollback purposes
                            this.set_text(obj,t); // rollback purposes
                            this.rename_node(obj, v);
                            callback.call(this, obj, v, t);
                            obj.css("position","");
                        }, this),
                        "keyup" : function (event) {
                            var key = event.keyCode || event.which;
                            if(key == 27) { this.value = t; this.blur(); return; }
                            else if(key == 13) { this.blur(); return; }
                            else {
                                h2.width(Math.min(h1.text("pW" + this.value).width(),w));
                            }
                        },
                        "keypress" : function(event) {
                            var key = event.keyCode || event.which;
                            if(key == 13) { return false; }
                        }
                    })
                ).children(".jstree-rename-input");
                this.set_text(obj, "");
                h1.css({
                        fontFamily      : h2.css('fontFamily')      || '',
                        fontSize        : h2.css('fontSize')        || '',
                        fontWeight      : h2.css('fontWeight')      || '',
                        fontStyle       : h2.css('fontStyle')       || '',
                        fontStretch     : h2.css('fontStretch')     || '',
                        fontVariant     : h2.css('fontVariant')     || '',
                        letterSpacing   : h2.css('letterSpacing')   || '',
                        wordSpacing     : h2.css('wordSpacing')     || ''
                });
                h2.width(Math.min(h1.text("pW" + h2[0].value).width(),w))[0].select();
            },
            rename : function (obj) {
                obj = this._get_node(obj);
                this.__rollback();
                var f = this.__callback;
                this._show_input(obj, function (obj, new_name, old_name) {
                    f.call(this, { "obj" : obj, "new_name" : new_name, "old_name" : old_name });
                });
            },
            create : function (obj, position, js, callback, skip_rename) {
                var t, _this = this;
                obj = this._get_node(obj);
                if(!obj) { obj = -1; }
                this.__rollback();
                t = this.create_node(obj, position, js, function (t) {
                    var p = this._get_parent(t),
                        pos = $(t).index();
                    if(callback) { callback.call(this, t); }
                    if(p.length && p.hasClass("jstree-closed")) { this.open_node(p, false, true); }
                    if(!skip_rename) {
                        this._show_input(t, function (obj, new_name, old_name) {
                            _this.__callback({ "obj" : obj, "name" : new_name, "parent" : p, "position" : pos });
                        });
                    }
                    else { _this.__callback({ "obj" : t, "name" : this.get_text(t), "parent" : p, "position" : pos }); }
                });
                return t;
            },
            remove : function (obj) {
                obj = this._get_node(obj, true);
                var p = this._get_parent(obj), prev = this._get_prev(obj);
                this.__rollback();
                obj = this.delete_node(obj);
                if(obj !== false) { this.__callback({ "obj" : obj, "prev" : prev, "parent" : p }); }
            },
            check_move : function () {
                if(!this.__call_old()) { return false; }
                var s = this._get_settings().crrm.move;
                if(!s.check_move.call(this, this._get_move())) { return false; }
                return true;
            },
            move_node : function (obj, ref, position, is_copy, is_prepared, skip_check) {
                var s = this._get_settings().crrm.move;
                if(!is_prepared) {
                    if(typeof position === "undefined") { position = s.default_position; }
                    if(position === "inside" && !s.default_position.match(/^(before|after)$/)) { position = s.default_position; }
                    return this.__call_old(true, obj, ref, position, is_copy, false, skip_check);
                }
                // if the move is already prepared
                if(s.always_copy === true || (s.always_copy === "multitree" && obj.rt.get_index() !== obj.ot.get_index() )) {
                    is_copy = true;
                }
                this.__call_old(true, obj, ref, position, is_copy, true, skip_check);
            },

            cut : function (obj) {
                obj = this._get_node(obj, true);
                if(!obj || !obj.length) { return false; }
                this.data.crrm.cp_nodes = false;
                this.data.crrm.ct_nodes = obj;
                this.__callback({ "obj" : obj });
            },
            copy : function (obj) {
                obj = this._get_node(obj, true);
                if(!obj || !obj.length) { return false; }
                this.data.crrm.ct_nodes = false;
                this.data.crrm.cp_nodes = obj;
                this.__callback({ "obj" : obj });
            },
            paste : function (obj) {
                obj = this._get_node(obj);
                if(!obj || !obj.length) { return false; }
                var nodes = this.data.crrm.ct_nodes ? this.data.crrm.ct_nodes : this.data.crrm.cp_nodes;
                if(!this.data.crrm.ct_nodes && !this.data.crrm.cp_nodes) { return false; }
                if(this.data.crrm.ct_nodes) { this.move_node(this.data.crrm.ct_nodes, obj); this.data.crrm.ct_nodes = false; }
                if(this.data.crrm.cp_nodes) { this.move_node(this.data.crrm.cp_nodes, obj, false, true); }
                this.__callback({ "obj" : obj, "nodes" : nodes });
            }
        }
    });
    // include the crr plugin by default
    // $.jstree.defaults.plugins.push("crrm");
})(jQuery);
//*/

/*
 * jsTree themes plugin
 * Handles loading and setting themes, as well as detecting path to themes, etc.
 */
(function ($) {
    var themes_loaded = [];
    // this variable stores the path to the themes folder - if left as false - it will be autodetected
    $.jstree._themes = false;
    $.jstree.plugin("themes", {
        __init : function () {
            this.get_container()
                .bind("init.jstree", $.proxy(function () {
                        var s = this._get_settings().themes;
                        this.data.themes.dots = s.dots;
                        this.data.themes.icons = s.icons;
                        this.set_theme(s.theme, s.url);
                    }, this))
                .bind("loaded.jstree", $.proxy(function () {
                        // bound here too, as simple HTML tree's won't honor dots & icons otherwise
                        if(!this.data.themes.dots) { this.hide_dots(); }
                        else { this.show_dots(); }
                        if(!this.data.themes.icons) { this.hide_icons(); }
                        else { this.show_icons(); }
                    }, this));
        },
        defaults : {
            theme : "default",
            url : false,
            dots : true,
            icons : true
        },
        _fn : {
            set_theme : function (theme_name, theme_url) {
                if(!theme_name) { return false; }
                if(!theme_url) { theme_url = $.jstree._themes + theme_name + '/style.css'; }
                if($.inArray(theme_url, themes_loaded) == -1) {
                    $.vakata.css.add_sheet({ "url" : theme_url });
                    themes_loaded.push(theme_url);
                }
                if(this.data.themes.theme != theme_name) {
                    this.get_container().removeClass('jstree-' + this.data.themes.theme);
                    this.data.themes.theme = theme_name;
                }
                this.get_container().addClass('jstree-' + theme_name);
                if(!this.data.themes.dots) { this.hide_dots(); }
                else { this.show_dots(); }
                if(!this.data.themes.icons) { this.hide_icons(); }
                else { this.show_icons(); }
                this.__callback();
            },
            get_theme   : function () { return this.data.themes.theme; },

            show_dots   : function () { this.data.themes.dots = true; this.get_container().children("ul").removeClass("jstree-no-dots"); },
            hide_dots   : function () { this.data.themes.dots = false; this.get_container().children("ul").addClass("jstree-no-dots"); },
            toggle_dots : function () { if(this.data.themes.dots) { this.hide_dots(); } else { this.show_dots(); } },

            show_icons  : function () { this.data.themes.icons = true; this.get_container().children("ul").removeClass("jstree-no-icons"); },
            hide_icons  : function () { this.data.themes.icons = false; this.get_container().children("ul").addClass("jstree-no-icons"); },
            toggle_icons: function () { if(this.data.themes.icons) { this.hide_icons(); } else { this.show_icons(); } }
        }
    });
    // autodetect themes path
    $(function () {
        if($.jstree._themes === false) {
            $("script").each(function () {
                if(this.src.toString().match(/jquery\.jstree[^\/]*?\.js(\?.*)?$/)) {
                    $.jstree._themes = this.src.toString().replace(/jquery\.jstree[^\/]*?\.js(\?.*)?$/, "") + 'themes/';
                    return false;
                }
            });
        }
        if($.jstree._themes === false) { $.jstree._themes = "themes/"; }
    });
    // include the themes plugin by default
    $.jstree.defaults.plugins.push("themes");
})(jQuery);
//*/

/*
 * jsTree hotkeys plugin
 * Enables keyboard navigation for all tree instances
 * Depends on the jstree ui & jquery hotkeys plugins
 */
(function ($) {
    var bound = [];
    function exec(i, event) {
        var f = $.jstree._focused(), tmp;
        if(f && f.data && f.data.hotkeys && f.data.hotkeys.enabled) {
            tmp = f._get_settings().hotkeys[i];
            if(tmp) { return tmp.call(f, event); }
        }
    }
    $.jstree.plugin("hotkeys", {
        __init : function () {
            if(typeof $.hotkeys === "undefined") { throw "jsTree hotkeys: jQuery hotkeys plugin not included."; }
            if(!this.data.ui) { throw "jsTree hotkeys: jsTree UI plugin not included."; }
            $.each(this._get_settings().hotkeys, function (i, v) {
                if(v !== false && $.inArray(i, bound) == -1) {
                    $(document).bind("keydown", i, function (event) { return exec(i, event); });
                    bound.push(i);
                }
            });
            this.get_container()
                .bind("lock.jstree", $.proxy(function () {
                        if(this.data.hotkeys.enabled) { this.data.hotkeys.enabled = false; this.data.hotkeys.revert = true; }
                    }, this))
                .bind("unlock.jstree", $.proxy(function () {
                        if(this.data.hotkeys.revert) { this.data.hotkeys.enabled = true; }
                    }, this));
            this.enable_hotkeys();
        },
        defaults : {
            "up" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
                this.hover_node(this._get_prev(o));
                return false;
            },
            "ctrl+up" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
                this.hover_node(this._get_prev(o));
                return false;
            },
            "shift+up" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
                this.hover_node(this._get_prev(o));
                return false;
            },
            "down" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
                this.hover_node(this._get_next(o));
                return false;
            },
            "ctrl+down" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
                this.hover_node(this._get_next(o));
                return false;
            },
            "shift+down" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected || -1;
                this.hover_node(this._get_next(o));
                return false;
            },
            "left" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected;
                if(o) {
                    if(o.hasClass("jstree-open")) { this.close_node(o); }
                    else { this.hover_node(this._get_prev(o)); }
                }
                return false;
            },
            "ctrl+left" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected;
                if(o) {
                    if(o.hasClass("jstree-open")) { this.close_node(o); }
                    else { this.hover_node(this._get_prev(o)); }
                }
                return false;
            },
            "shift+left" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected;
                if(o) {
                    if(o.hasClass("jstree-open")) { this.close_node(o); }
                    else { this.hover_node(this._get_prev(o)); }
                }
                return false;
            },
            "right" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected;
                if(o && o.length) {
                    if(o.hasClass("jstree-closed")) { this.open_node(o); }
                    else { this.hover_node(this._get_next(o)); }
                }
                return false;
            },
            "ctrl+right" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected;
                if(o && o.length) {
                    if(o.hasClass("jstree-closed")) { this.open_node(o); }
                    else { this.hover_node(this._get_next(o)); }
                }
                return false;
            },
            "shift+right" : function () {
                var o = this.data.ui.hovered || this.data.ui.last_selected;
                if(o && o.length) {
                    if(o.hasClass("jstree-closed")) { this.open_node(o); }
                    else { this.hover_node(this._get_next(o)); }
                }
                return false;
            },
            "space" : function () {
                if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").click(); }
                return false;
            },
            "ctrl+space" : function (event) {
                event.type = "click";
                if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); }
                return false;
            },
            "shift+space" : function (event) {
                event.type = "click";
                if(this.data.ui.hovered) { this.data.ui.hovered.children("a:eq(0)").trigger(event); }
                return false;
            },
            "f2" : function () { this.rename(this.data.ui.hovered || this.data.ui.last_selected); },
            "del" : function () { this.remove(this.data.ui.hovered || this._get_node(null)); }
        },
        _fn : {
            enable_hotkeys : function () {
                this.data.hotkeys.enabled = true;
            },
            disable_hotkeys : function () {
                this.data.hotkeys.enabled = false;
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree JSON plugin
 * The JSON data store. Datastores are build by overriding the `load_node` and `_is_loaded` functions.
 */
(function ($) {
    $.jstree.plugin("json_data", {
        __init : function() {
            var s = this._get_settings().json_data;
            if(s.progressive_unload) {
                this.get_container().bind("after_close.jstree", function (e, data) {
                    data.rslt.obj.children("ul").remove();
                });
            }
        },
        defaults : {
            // `data` can be a function:
            //  * accepts two arguments - node being loaded and a callback to pass the result to
            //  * will be executed in the current tree's scope & ajax won't be supported
            data : false,
            ajax : false,
            correct_state : true,
            progressive_render : false,
            progressive_unload : false
        },
        _fn : {
            load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_json(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
            _is_loaded : function (obj) {
                var s = this._get_settings().json_data;
                obj = this._get_node(obj);
                return obj == -1 || !obj || (!s.ajax && !s.progressive_render && !$.isFunction(s.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").length > 0;
            },
            refresh : function (obj) {
                obj = this._get_node(obj);
                var s = this._get_settings().json_data;
                if(obj && obj !== -1 && s.progressive_unload && ($.isFunction(s.data) || !!s.ajax)) {
                    obj.removeData("jstree-children");
                }
                return this.__call_old();
            },
            load_node_json : function (obj, s_call, e_call) {
                var s = this.get_settings().json_data, d,
                    error_func = function () {},
                    success_func = function () {};
                obj = this._get_node(obj);

                if(obj && obj !== -1 && (s.progressive_render || s.progressive_unload) && !obj.is(".jstree-open, .jstree-leaf") && obj.children("ul").children("li").length === 0 && obj.data("jstree-children")) {
                    d = this._parse_json(obj.data("jstree-children"), obj);
                    if(d) {
                        obj.append(d);
                        if(!s.progressive_unload) { obj.removeData("jstree-children"); }
                    }
                    this.clean_node(obj);
                    if(s_call) { s_call.call(this); }
                    return;
                }

                if(obj && obj !== -1) {
                    if(obj.data("jstree-is-loading")) { return; }
                    else { obj.data("jstree-is-loading",true); }
                }
                switch(!0) {
                    case (!s.data && !s.ajax): throw "Neither data nor ajax settings supplied.";
                    // function option added here for easier model integration (also supporting async - see callback)
                    case ($.isFunction(s.data)):
                        s.data.call(this, obj, $.proxy(function (d) {
                            d = this._parse_json(d, obj);
                            if(!d) {
                                if(obj === -1 || !obj) {
                                    if(s.correct_state) { this.get_container().children("ul").empty(); }
                                }
                                else {
                                    obj.children("a.jstree-loading").removeClass("jstree-loading");
                                    obj.removeData("jstree-is-loading");
                                    if(s.correct_state) { this.correct_state(obj); }
                                }
                                if(e_call) { e_call.call(this); }
                            }
                            else {
                                if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
                                else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree-is-loading"); }
                                this.clean_node(obj);
                                if(s_call) { s_call.call(this); }
                            }
                        }, this));
                        break;
                    case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
                        if(!obj || obj == -1) {
                            d = this._parse_json(s.data, obj);
                            if(d) {
                                this.get_container().children("ul").empty().append(d.children());
                                this.clean_node();
                            }
                            else {
                                if(s.correct_state) { this.get_container().children("ul").empty(); }
                            }
                        }
                        if(s_call) { s_call.call(this); }
                        break;
                    case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
                        error_func = function (x, t, e) {
                            var ef = this.get_settings().json_data.ajax.error;
                            if(ef) { ef.call(this, x, t, e); }
                            if(obj != -1 && obj.length) {
                                obj.children("a.jstree-loading").removeClass("jstree-loading");
                                obj.removeData("jstree-is-loading");
                                if(t === "success" && s.correct_state) { this.correct_state(obj); }
                            }
                            else {
                                if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
                            }
                            if(e_call) { e_call.call(this); }
                        };
                        success_func = function (d, t, x) {
                            var sf = this.get_settings().json_data.ajax.success;
                            if(sf) { d = sf.call(this,d,t,x) || d; }
                            if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "") || (!$.isArray(d) && !$.isPlainObject(d))) {
                                return error_func.call(this, x, t, "");
                            }
                            d = this._parse_json(d, obj);
                            if(d) {
                                if(obj === -1 || !obj) { this.get_container().children("ul").empty().append(d.children()); }
                                else { obj.append(d).children("a.jstree-loading").removeClass("jstree-loading"); obj.removeData("jstree-is-loading"); }
                                this.clean_node(obj);
                                if(s_call) { s_call.call(this); }
                            }
                            else {
                                if(obj === -1 || !obj) {
                                    if(s.correct_state) {
                                        this.get_container().children("ul").empty();
                                        if(s_call) { s_call.call(this); }
                                    }
                                }
                                else {
                                    obj.children("a.jstree-loading").removeClass("jstree-loading");
                                    obj.removeData("jstree-is-loading");
                                    if(s.correct_state) {
                                        this.correct_state(obj);
                                        if(s_call) { s_call.call(this); }
                                    }
                                }
                            }
                        };
                        s.ajax.context = this;
                        s.ajax.error = error_func;
                        s.ajax.success = success_func;
                        if(!s.ajax.dataType) { s.ajax.dataType = "json"; }
                        if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
                        if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
                        $.ajax(s.ajax);
                        break;
                }
            },
            _parse_json : function (js, obj, is_callback) {
                var d = false,
                    p = this._get_settings(),
                    s = p.json_data,
                    t = p.core.html_titles,
                    tmp, i, j, ul1, ul2;

                if(!js) { return d; }
                if(s.progressive_unload && obj && obj !== -1) {
                    obj.data("jstree-children", d);
                }
                if($.isArray(js)) {
                    d = $();
                    if(!js.length) { return false; }
                    for(i = 0, j = js.length; i < j; i++) {
                        tmp = this._parse_json(js[i], obj, true);
                        if(tmp.length) { d = d.add(tmp); }
                    }
                }
                else {
                    if(typeof js == "string") { js = { data : js }; }
                    if(!js.data && js.data !== "") { return d; }
                    d = $("<li />");
                    if(js.attr) { d.attr(js.attr); }
                    if(js.metadata) { d.data(js.metadata); }
                    if(js.state) { d.addClass("jstree-" + js.state); }
                    if(!$.isArray(js.data)) { tmp = js.data; js.data = []; js.data.push(tmp); }
                    $.each(js.data, function (i, m) {
                        tmp = $("<a />");
                        if($.isFunction(m)) { m = m.call(this, js); }
                        if(typeof m == "string") { tmp.attr('href','#')[ t ? "html" : "text" ](m); }
                        else {
                            if(!m.attr) { m.attr = {}; }
                            if(!m.attr.href) { m.attr.href = '#'; }
                            tmp.attr(m.attr)[ t ? "html" : "text" ](m.title);
                            if(m.language) { tmp.addClass(m.language); }
                        }
                        tmp.prepend("<ins class='jstree-icon'>&#160;</ins>");
                        if(!m.icon && js.icon) { m.icon = js.icon; }
                        if(m.icon) {
                            if(m.icon.indexOf("/") === -1) { tmp.children("ins").addClass(m.icon); }
                            else { tmp.children("ins").css("background","url('" + m.icon + "') center center no-repeat"); }
                        }
                        d.append(tmp);
                    });
                    d.prepend("<ins class='jstree-icon'>&#160;</ins>");
                    if(js.children) {
                        if(s.progressive_render && js.state !== "open") {
                            d.addClass("jstree-closed").data("jstree-children", js.children);
                        }
                        else {
                            if(s.progressive_unload) { d.data("jstree-children", js.children); }
                            if($.isArray(js.children) && js.children.length) {
                                tmp = this._parse_json(js.children, obj, true);
                                if(tmp.length) {
                                    ul2 = $("<ul />");
                                    ul2.append(tmp);
                                    d.append(ul2);
                                }
                            }
                        }
                    }
                }
                if(!is_callback) {
                    ul1 = $("<ul />");
                    ul1.append(d);
                    d = ul1;
                }
                return d;
            },
            get_json : function (obj, li_attr, a_attr, is_callback) {
                var result = [],
                    s = this._get_settings(),
                    _this = this,
                    tmp1, tmp2, li, a, t, lang;
                obj = this._get_node(obj);
                if(!obj || obj === -1) { obj = this.get_container().find("> ul > li"); }
                li_attr = $.isArray(li_attr) ? li_attr : [ "id", "class" ];
                if(!is_callback && this.data.types) { li_attr.push(s.types.type_attr); }
                a_attr = $.isArray(a_attr) ? a_attr : [ ];

                obj.each(function () {
                    li = $(this);
                    tmp1 = { data : [] };
                    if(li_attr.length) { tmp1.attr = { }; }
                    $.each(li_attr, function (i, v) {
                        tmp2 = li.attr(v);
                        if(tmp2 && tmp2.length && tmp2.replace(/jstree[^ ]*/ig,'').length) {
                            tmp1.attr[v] = (" " + tmp2).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
                        }
                    });
                    if(li.hasClass("jstree-open")) { tmp1.state = "open"; }
                    if(li.hasClass("jstree-closed")) { tmp1.state = "closed"; }
                    if(li.data()) { tmp1.metadata = li.data(); }
                    a = li.children("a");
                    a.each(function () {
                        t = $(this);
                        if(
                            a_attr.length ||
                            $.inArray("languages", s.plugins) !== -1 ||
                            t.children("ins").get(0).style.backgroundImage.length ||
                            (t.children("ins").get(0).className && t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').length)
                        ) {
                            lang = false;
                            if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
                                $.each(s.languages, function (l, lv) {
                                    if(t.hasClass(lv)) {
                                        lang = lv;
                                        return false;
                                    }
                                });
                            }
                            tmp2 = { attr : { }, title : _this.get_text(t, lang) };
                            $.each(a_attr, function (k, z) {
                                tmp2.attr[z] = (" " + (t.attr(z) || "")).replace(/ jstree[^ ]*/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
                            });
                            if($.inArray("languages", s.plugins) !== -1 && $.isArray(s.languages) && s.languages.length) {
                                $.each(s.languages, function (k, z) {
                                    if(t.hasClass(z)) { tmp2.language = z; return true; }
                                });
                            }
                            if(t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/^\s+$/ig,"").length) {
                                tmp2.icon = t.children("ins").get(0).className.replace(/jstree[^ ]*|$/ig,'').replace(/\s+$/ig," ").replace(/^ /,"").replace(/ $/,"");
                            }
                            if(t.children("ins").get(0).style.backgroundImage.length) {
                                tmp2.icon = t.children("ins").get(0).style.backgroundImage.replace("url(","").replace(")","");
                            }
                        }
                        else {
                            tmp2 = _this.get_text(t);
                        }
                        if(a.length > 1) { tmp1.data.push(tmp2); }
                        else { tmp1.data = tmp2; }
                    });
                    li = li.find("> ul > li");
                    if(li.length) { tmp1.children = _this.get_json(li, li_attr, a_attr, true); }
                    result.push(tmp1);
                });
                return result;
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree languages plugin
 * Adds support for multiple language versions in one tree
 * This basically allows for many titles coexisting in one node, but only one of them being visible at any given time
 * This is useful for maintaining the same structure in many languages (hence the name of the plugin)
 */
(function ($) {
    $.jstree.plugin("languages", {
        __init : function () { this._load_css();  },
        defaults : [],
        _fn : {
            set_lang : function (i) {
                var langs = this._get_settings().languages,
                    st = false,
                    selector = ".jstree-" + this.get_index() + ' a';
                if(!$.isArray(langs) || langs.length === 0) { return false; }
                if($.inArray(i,langs) == -1) {
                    if(!!langs[i]) { i = langs[i]; }
                    else { return false; }
                }
                if(i == this.data.languages.current_language) { return true; }
                st = $.vakata.css.get_css(selector + "." + this.data.languages.current_language, false, this.data.languages.language_css);
                if(st !== false) { st.style.display = "none"; }
                st = $.vakata.css.get_css(selector + "." + i, false, this.data.languages.language_css);
                if(st !== false) { st.style.display = ""; }
                this.data.languages.current_language = i;
                this.__callback(i);
                return true;
            },
            get_lang : function () {
                return this.data.languages.current_language;
            },
            _get_string : function (key, lang) {
                var langs = this._get_settings().languages,
                    s = this._get_settings().core.strings;
                if($.isArray(langs) && langs.length) {
                    lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
                }
                if(s[lang] && s[lang][key]) { return s[lang][key]; }
                if(s[key]) { return s[key]; }
                return key;
            },
            get_text : function (obj, lang) {
                obj = this._get_node(obj) || this.data.ui.last_selected;
                if(!obj.size()) { return false; }
                var langs = this._get_settings().languages,
                    s = this._get_settings().core.html_titles;
                if($.isArray(langs) && langs.length) {
                    lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
                    obj = obj.children("a." + lang);
                }
                else { obj = obj.children("a:eq(0)"); }
                if(s) {
                    obj = obj.clone();
                    obj.children("INS").remove();
                    return obj.html();
                }
                else {
                    obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
                    return obj.nodeValue;
                }
            },
            set_text : function (obj, val, lang) {
                obj = this._get_node(obj) || this.data.ui.last_selected;
                if(!obj.size()) { return false; }
                var langs = this._get_settings().languages,
                    s = this._get_settings().core.html_titles,
                    tmp;
                if($.isArray(langs) && langs.length) {
                    lang = (lang && $.inArray(lang,langs) != -1) ? lang : this.data.languages.current_language;
                    obj = obj.children("a." + lang);
                }
                else { obj = obj.children("a:eq(0)"); }
                if(s) {
                    tmp = obj.children("INS").clone();
                    obj.html(val).prepend(tmp);
                    this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
                    return true;
                }
                else {
                    obj = obj.contents().filter(function() { return this.nodeType == 3; })[0];
                    this.__callback({ "obj" : obj, "name" : val, "lang" : lang });
                    return (obj.nodeValue = val);
                }
            },
            _load_css : function () {
                var langs = this._get_settings().languages,
                    str = "/* languages css */",
                    selector = ".jstree-" + this.get_index() + ' a',
                    ln;
                if($.isArray(langs) && langs.length) {
                    this.data.languages.current_language = langs[0];
                    for(ln = 0; ln < langs.length; ln++) {
                        str += selector + "." + langs[ln] + " {";
                        if(langs[ln] != this.data.languages.current_language) { str += " display:none; "; }
                        str += " } ";
                    }
                    this.data.languages.language_css = $.vakata.css.add_sheet({ 'str' : str, 'title' : "jstree-languages" });
                }
            },
            create_node : function (obj, position, js, callback) {
                var t = this.__call_old(true, obj, position, js, function (t) {
                    var langs = this._get_settings().languages,
                        a = t.children("a"),
                        ln;
                    if($.isArray(langs) && langs.length) {
                        for(ln = 0; ln < langs.length; ln++) {
                            if(!a.is("." + langs[ln])) {
                                t.append(a.eq(0).clone().removeClass(langs.join(" ")).addClass(langs[ln]));
                            }
                        }
                        a.not("." + langs.join(", .")).remove();
                    }
                    if(callback) { callback.call(this, t); }
                });
                return t;
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree cookies plugin
 * Stores the currently opened/selected nodes in a cookie and then restores them
 * Depends on the jquery.cookie plugin
 */
(function ($) {
    $.jstree.plugin("cookies", {
        __init : function () {
            if(typeof $.cookie === "undefined") { throw "jsTree cookie: jQuery cookie plugin not included."; }

            var s = this._get_settings().cookies,
                tmp;
            if(!!s.save_loaded) {
                tmp = $.cookie(s.save_loaded);
                if(tmp && tmp.length) { this.data.core.to_load = tmp.split(","); }
            }
            if(!!s.save_opened) {
                tmp = $.cookie(s.save_opened);
                if(tmp && tmp.length) { this.data.core.to_open = tmp.split(","); }
            }
            if(!!s.save_selected) {
                tmp = $.cookie(s.save_selected);
                if(tmp && tmp.length && this.data.ui) { this.data.ui.to_select = tmp.split(","); }
            }
            this.get_container()
                .one( ( this.data.ui ? "reselect" : "reopen" ) + ".jstree", $.proxy(function () {
                    this.get_container()
                        .bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree", $.proxy(function (e) {
                                if(this._get_settings().cookies.auto_save) { this.save_cookie((e.handleObj.namespace + e.handleObj.type).replace("jstree","")); }
                            }, this));
                }, this));
        },
        defaults : {
            save_loaded     : "jstree_load",
            save_opened     : "jstree_open",
            save_selected   : "jstree_select",
            auto_save       : true,
            cookie_options  : {}
        },
        _fn : {
            save_cookie : function (c) {
                if(this.data.core.refreshing) { return; }
                var s = this._get_settings().cookies;
                if(!c) { // if called manually and not by event
                    if(s.save_loaded) {
                        this.save_loaded();
                        $.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options);
                    }
                    if(s.save_opened) {
                        this.save_opened();
                        $.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options);
                    }
                    if(s.save_selected && this.data.ui) {
                        this.save_selected();
                        $.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options);
                    }
                    return;
                }
                switch(c) {
                    case "open_node":
                    case "close_node":
                        if(!!s.save_opened) {
                            this.save_opened();
                            $.cookie(s.save_opened, this.data.core.to_open.join(","), s.cookie_options);
                        }
                        if(!!s.save_loaded) {
                            this.save_loaded();
                            $.cookie(s.save_loaded, this.data.core.to_load.join(","), s.cookie_options);
                        }
                        break;
                    case "select_node":
                    case "deselect_node":
                        if(!!s.save_selected && this.data.ui) {
                            this.save_selected();
                            $.cookie(s.save_selected, this.data.ui.to_select.join(","), s.cookie_options);
                        }
                        break;
                }
            }
        }
    });
    // include cookies by default
    // $.jstree.defaults.plugins.push("cookies");
})(jQuery);
//*/

/*
 * jsTree sort plugin
 * Sorts items alphabetically (or using any other function)
 */
(function ($) {
    $.jstree.plugin("sort", {
        __init : function () {
            this.get_container()
                .bind("load_node.jstree", $.proxy(function (e, data) {
                        var obj = this._get_node(data.rslt.obj);
                        obj = obj === -1 ? this.get_container().children("ul") : obj.children("ul");
                        this.sort(obj);
                    }, this))
                .bind("rename_node.jstree create_node.jstree create.jstree", $.proxy(function (e, data) {
                        this.sort(data.rslt.obj.parent());
                    }, this))
                .bind("move_node.jstree", $.proxy(function (e, data) {
                        var m = data.rslt.np == -1 ? this.get_container() : data.rslt.np;
                        this.sort(m.children("ul"));
                    }, this));
        },
        defaults : function (a, b) { return this.get_text(a) > this.get_text(b) ? 1 : -1; },
        _fn : {
            sort : function (obj) {
                var s = this._get_settings().sort,
                    t = this;
                obj.append($.makeArray(obj.children("li")).sort($.proxy(s, t)));
                obj.find("> li > ul").each(function() { t.sort($(this)); });
                this.clean_node(obj);
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree DND plugin
 * Drag and drop plugin for moving/copying nodes
 */
(function ($) {
    var o = false,
        r = false,
        m = false,
        ml = false,
        sli = false,
        sti = false,
        dir1 = false,
        dir2 = false,
        last_pos = false;
    $.vakata.dnd = {
        is_down : false,
        is_drag : false,
        helper : false,
        scroll_spd : 10,
        init_x : 0,
        init_y : 0,
        threshold : 5,
        helper_left : 5,
        helper_top : 10,
        user_data : {},

        drag_start : function (e, data, html) {
            if($.vakata.dnd.is_drag) { $.vakata.drag_stop({}); }
            try {
                e.currentTarget.unselectable = "on";
                e.currentTarget.onselectstart = function() { return false; };
                if(e.currentTarget.style) { e.currentTarget.style.MozUserSelect = "none"; }
            } catch(err) { }
            $.vakata.dnd.init_x = e.pageX;
            $.vakata.dnd.init_y = e.pageY;
            $.vakata.dnd.user_data = data;
            $.vakata.dnd.is_down = true;
            $.vakata.dnd.helper = $("<div id='vakata-dragged' />").html(html); //.fadeTo(10,0.25);
            $(document).bind("mousemove", $.vakata.dnd.drag);
            $(document).bind("mouseup", $.vakata.dnd.drag_stop);
            return false;
        },
        drag : function (e) {
            if(!$.vakata.dnd.is_down) { return; }
            if(!$.vakata.dnd.is_drag) {
                if(Math.abs(e.pageX - $.vakata.dnd.init_x) > 5 || Math.abs(e.pageY - $.vakata.dnd.init_y) > 5) {
                    $.vakata.dnd.helper.appendTo("body");
                    $.vakata.dnd.is_drag = true;
                    $(document).triggerHandler("drag_start.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
                }
                else { return; }
            }

            // maybe use a scrolling parent element instead of document?
            if(e.type === "mousemove") { // thought of adding scroll in order to move the helper, but mouse poisition is n/a
                var d = $(document), t = d.scrollTop(), l = d.scrollLeft();
                if(e.pageY - t < 20) {
                    if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
                    if(!sti) { dir1 = "up"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() - $.vakata.dnd.scroll_spd); }, 150); }
                }
                else {
                    if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
                }
                if($(window).height() - (e.pageY - t) < 20) {
                    if(sti && dir1 === "up") { clearInterval(sti); sti = false; }
                    if(!sti) { dir1 = "down"; sti = setInterval(function () { $(document).scrollTop($(document).scrollTop() + $.vakata.dnd.scroll_spd); }, 150); }
                }
                else {
                    if(sti && dir1 === "down") { clearInterval(sti); sti = false; }
                }

                if(e.pageX - l < 20) {
                    if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
                    if(!sli) { dir2 = "left"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() - $.vakata.dnd.scroll_spd); }, 150); }
                }
                else {
                    if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
                }
                if($(window).width() - (e.pageX - l) < 20) {
                    if(sli && dir2 === "left") { clearInterval(sli); sli = false; }
                    if(!sli) { dir2 = "right"; sli = setInterval(function () { $(document).scrollLeft($(document).scrollLeft() + $.vakata.dnd.scroll_spd); }, 150); }
                }
                else {
                    if(sli && dir2 === "right") { clearInterval(sli); sli = false; }
                }
            }

            $.vakata.dnd.helper.css({ left : (e.pageX + $.vakata.dnd.helper_left) + "px", top : (e.pageY + $.vakata.dnd.helper_top) + "px" });
            $(document).triggerHandler("drag.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
        },
        drag_stop : function (e) {
            if(sli) { clearInterval(sli); }
            if(sti) { clearInterval(sti); }
            $(document).unbind("mousemove", $.vakata.dnd.drag);
            $(document).unbind("mouseup", $.vakata.dnd.drag_stop);
            $(document).triggerHandler("drag_stop.vakata", { "event" : e, "data" : $.vakata.dnd.user_data });
            $.vakata.dnd.helper.remove();
            $.vakata.dnd.init_x = 0;
            $.vakata.dnd.init_y = 0;
            $.vakata.dnd.user_data = {};
            $.vakata.dnd.is_down = false;
            $.vakata.dnd.is_drag = false;
        }
    };
    $(function() {
        var css_string = '#vakata-dragged { display:block; margin:0 0 0 0; padding:4px 4px 4px 24px; position:absolute; top:-2000px; line-height:16px; z-index:10000; } ';
        $.vakata.css.add_sheet({ str : css_string, title : "vakata" });
    });

    $.jstree.plugin("dnd", {
        __init : function () {
            this.data.dnd = {
                active : false,
                after : false,
                inside : false,
                before : false,
                off : false,
                prepared : false,
                w : 0,
                to1 : false,
                to2 : false,
                cof : false,
                cw : false,
                ch : false,
                i1 : false,
                i2 : false,
                mto : false
            };
            this.get_container()
                .bind("mouseenter.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            if(this.data.themes) {
                                m.attr("class", "jstree-" + this.data.themes.theme);
                                if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
                                $.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme);
                            }
                            //if($(e.currentTarget).find("> ul > li").length === 0) {
                            if(e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
                                var tr = $.jstree._reference(e.target), dc;
                                if(tr.data.dnd.foreign) {
                                    dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
                                    if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
                                        $.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
                                    }
                                }
                                else {
                                    tr.prepare_move(o, tr.get_container(), "last");
                                    if(tr.check_move()) {
                                        $.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
                                    }
                                }
                            }
                        }
                    }, this))
                .bind("mouseup.jstree", $.proxy(function (e) {
                        //if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && $(e.currentTarget).find("> ul > li").length === 0) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && e.currentTarget === e.target && $.vakata.dnd.user_data.obj && $($.vakata.dnd.user_data.obj).length && $($.vakata.dnd.user_data.obj).parents(".jstree:eq(0)")[0] !== e.target) { // node should not be from the same tree
                            var tr = $.jstree._reference(e.currentTarget), dc;
                            if(tr.data.dnd.foreign) {
                                dc = tr._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
                                if(dc === true || dc.inside === true || dc.before === true || dc.after === true) {
                                    tr._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : tr.get_container(), is_root : true });
                                }
                            }
                            else {
                                tr.move_node(o, tr.get_container(), "last", e[tr._get_settings().dnd.copy_modifier + "Key"]);
                            }
                        }
                    }, this))
                .bind("mouseleave.jstree", $.proxy(function (e) {
                        if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
                            return false;
                        }
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
                            if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
                            if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
                            if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
                            if($.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
                                $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
                            }
                        }
                    }, this))
                .bind("mousemove.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            var cnt = this.get_container()[0];

                            // Horizontal scroll
                            if(e.pageX + 24 > this.data.dnd.cof.left + this.data.dnd.cw) {
                                if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
                                this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft += $.vakata.dnd.scroll_spd; }, cnt), 100);
                            }
                            else if(e.pageX - 24 < this.data.dnd.cof.left) {
                                if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
                                this.data.dnd.i1 = setInterval($.proxy(function () { this.scrollLeft -= $.vakata.dnd.scroll_spd; }, cnt), 100);
                            }
                            else {
                                if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
                            }

                            // Vertical scroll
                            if(e.pageY + 24 > this.data.dnd.cof.top + this.data.dnd.ch) {
                                if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
                                this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop += $.vakata.dnd.scroll_spd; }, cnt), 100);
                            }
                            else if(e.pageY - 24 < this.data.dnd.cof.top) {
                                if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
                                this.data.dnd.i2 = setInterval($.proxy(function () { this.scrollTop -= $.vakata.dnd.scroll_spd; }, cnt), 100);
                            }
                            else {
                                if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
                            }

                        }
                    }, this))
                .bind("scroll.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && m && ml) {
                            m.hide();
                            ml.hide();
                        }
                    }, this))
                .delegate("a", "mousedown.jstree", $.proxy(function (e) {
                        if(e.which === 1) {
                            this.start_drag(e.currentTarget, e);
                            return false;
                        }
                    }, this))
                .delegate("a", "mouseenter.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            this.dnd_enter(e.currentTarget);
                        }
                    }, this))
                .delegate("a", "mousemove.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            if(!r || !r.length || r.children("a")[0] !== e.currentTarget) {
                                this.dnd_enter(e.currentTarget);
                            }
                            if(typeof this.data.dnd.off.top === "undefined") { this.data.dnd.off = $(e.target).offset(); }
                            this.data.dnd.w = (e.pageY - (this.data.dnd.off.top || 0)) % this.data.core.li_height;
                            if(this.data.dnd.w < 0) { this.data.dnd.w += this.data.core.li_height; }
                            this.dnd_show();
                        }
                    }, this))
                .delegate("a", "mouseleave.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            if(e.relatedTarget && e.relatedTarget.id && e.relatedTarget.id === "jstree-marker-line") {
                                return false;
                            }
                                if(m) { m.hide(); }
                                if(ml) { ml.hide(); }
                            /*
                            var ec = $(e.currentTarget).closest("li"),
                                er = $(e.relatedTarget).closest("li");
                            if(er[0] !== ec.prev()[0] && er[0] !== ec.next()[0]) {
                                if(m) { m.hide(); }
                                if(ml) { ml.hide(); }
                            }
                            */
                            this.data.dnd.mto = setTimeout(
                                (function (t) { return function () { t.dnd_leave(e); }; })(this),
                            0);
                        }
                    }, this))
                .delegate("a", "mouseup.jstree", $.proxy(function (e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree) {
                            this.dnd_finish(e);
                        }
                    }, this));

            $(document)
                .bind("drag_stop.vakata", $.proxy(function () {
                        if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
                        if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
                        if(this.data.dnd.i1) { clearInterval(this.data.dnd.i1); }
                        if(this.data.dnd.i2) { clearInterval(this.data.dnd.i2); }
                        this.data.dnd.after     = false;
                        this.data.dnd.before    = false;
                        this.data.dnd.inside    = false;
                        this.data.dnd.off       = false;
                        this.data.dnd.prepared  = false;
                        this.data.dnd.w         = false;
                        this.data.dnd.to1       = false;
                        this.data.dnd.to2       = false;
                        this.data.dnd.i1        = false;
                        this.data.dnd.i2        = false;
                        this.data.dnd.active    = false;
                        this.data.dnd.foreign   = false;
                        if(m) { m.css({ "top" : "-2000px" }); }
                        if(ml) { ml.css({ "top" : "-2000px" }); }
                    }, this))
                .bind("drag_start.vakata", $.proxy(function (e, data) {
                        if(data.data.jstree) {
                            var et = $(data.event.target);
                            if(et.closest(".jstree").hasClass("jstree-" + this.get_index())) {
                                this.dnd_enter(et);
                            }
                        }
                    }, this));
                /*
                .bind("keydown.jstree-" + this.get_index() + " keyup.jstree-" + this.get_index(), $.proxy(function(e) {
                        if($.vakata.dnd.is_drag && $.vakata.dnd.user_data.jstree && !this.data.dnd.foreign) {
                            var h = $.vakata.dnd.helper.children("ins");
                            if(e[this._get_settings().dnd.copy_modifier + "Key"] && h.hasClass("jstree-ok")) {
                                h.parent().html(h.parent().html().replace(/ \(Copy\)$/, "") + " (Copy)");
                            }
                            else {
                                h.parent().html(h.parent().html().replace(/ \(Copy\)$/, ""));
                            }
                        }
                    }, this)); */



            var s = this._get_settings().dnd;
            if(s.drag_target) {
                $(document)
                    .delegate(s.drag_target, "mousedown.jstree-" + this.get_index(), $.proxy(function (e) {
                        o = e.target;
                        $.vakata.dnd.drag_start(e, { jstree : true, obj : e.target }, "<ins class='jstree-icon'></ins>" + $(e.target).text() );
                        if(this.data.themes) {
                            if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
                            if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
                            $.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme);
                        }
                        $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
                        var cnt = this.get_container();
                        this.data.dnd.cof = cnt.offset();
                        this.data.dnd.cw = parseInt(cnt.width(),10);
                        this.data.dnd.ch = parseInt(cnt.height(),10);
                        this.data.dnd.foreign = true;
                        e.preventDefault();
                    }, this));
            }
            if(s.drop_target) {
                $(document)
                    .delegate(s.drop_target, "mouseenter.jstree-" + this.get_index(), $.proxy(function (e) {
                            if(this.data.dnd.active && this._get_settings().dnd.drop_check.call(this, { "o" : o, "r" : $(e.target), "e" : e })) {
                                $.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
                            }
                        }, this))
                    .delegate(s.drop_target, "mouseleave.jstree-" + this.get_index(), $.proxy(function (e) {
                            if(this.data.dnd.active) {
                                $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
                            }
                        }, this))
                    .delegate(s.drop_target, "mouseup.jstree-" + this.get_index(), $.proxy(function (e) {
                            if(this.data.dnd.active && $.vakata.dnd.helper.children("ins").hasClass("jstree-ok")) {
                                this._get_settings().dnd.drop_finish.call(this, { "o" : o, "r" : $(e.target), "e" : e });
                            }
                        }, this));
            }
        },
        defaults : {
            copy_modifier   : "ctrl",
            check_timeout   : 100,
            open_timeout    : 500,
            drop_target     : ".jstree-drop",
            drop_check      : function (data) { return true; },
            drop_finish     : $.noop,
            drag_target     : ".jstree-draggable",
            drag_finish     : $.noop,
            drag_check      : function (data) { return { after : false, before : false, inside : true }; }
        },
        _fn : {
            dnd_prepare : function () {
                if(!r || !r.length) { return; }
                this.data.dnd.off = r.offset();
                if(this._get_settings().core.rtl) {
                    this.data.dnd.off.right = this.data.dnd.off.left + r.width();
                }
                if(this.data.dnd.foreign) {
                    var a = this._get_settings().dnd.drag_check.call(this, { "o" : o, "r" : r });
                    this.data.dnd.after = a.after;
                    this.data.dnd.before = a.before;
                    this.data.dnd.inside = a.inside;
                    this.data.dnd.prepared = true;
                    return this.dnd_show();
                }
                this.prepare_move(o, r, "before");
                this.data.dnd.before = this.check_move();
                this.prepare_move(o, r, "after");
                this.data.dnd.after = this.check_move();
                if(this._is_loaded(r)) {
                    this.prepare_move(o, r, "inside");
                    this.data.dnd.inside = this.check_move();
                }
                else {
                    this.data.dnd.inside = false;
                }
                this.data.dnd.prepared = true;
                return this.dnd_show();
            },
            dnd_show : function () {
                if(!this.data.dnd.prepared) { return; }
                var o = ["before","inside","after"],
                    r = false,
                    rtl = this._get_settings().core.rtl,
                    pos;
                if(this.data.dnd.w < this.data.core.li_height/3) { o = ["before","inside","after"]; }
                else if(this.data.dnd.w <= this.data.core.li_height*2/3) {
                    o = this.data.dnd.w < this.data.core.li_height/2 ? ["inside","before","after"] : ["inside","after","before"];
                }
                else { o = ["after","inside","before"]; }
                $.each(o, $.proxy(function (i, val) {
                    if(this.data.dnd[val]) {
                        $.vakata.dnd.helper.children("ins").attr("class","jstree-ok");
                        r = val;
                        return false;
                    }
                }, this));
                if(r === false) { $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid"); }

                pos = rtl ? (this.data.dnd.off.right - 18) : (this.data.dnd.off.left + 10);
                switch(r) {
                    case "before":
                        m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top - 6) + "px" }).show();
                        if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top - 1) + "px" }).show(); }
                        break;
                    case "after":
                        m.css({ "left" : pos + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 6) + "px" }).show();
                        if(ml) { ml.css({ "left" : (pos + 8) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height - 1) + "px" }).show(); }
                        break;
                    case "inside":
                        m.css({ "left" : pos + ( rtl ? -4 : 4) + "px", "top" : (this.data.dnd.off.top + this.data.core.li_height/2 - 5) + "px" }).show();
                        if(ml) { ml.hide(); }
                        break;
                    default:
                        m.hide();
                        if(ml) { ml.hide(); }
                        break;
                }
                last_pos = r;
                return r;
            },
            dnd_open : function () {
                this.data.dnd.to2 = false;
                this.open_node(r, $.proxy(this.dnd_prepare,this), true);
            },
            dnd_finish : function (e) {
                if(this.data.dnd.foreign) {
                    if(this.data.dnd.after || this.data.dnd.before || this.data.dnd.inside) {
                        this._get_settings().dnd.drag_finish.call(this, { "o" : o, "r" : r, "p" : last_pos });
                    }
                }
                else {
                    this.dnd_prepare();
                    this.move_node(o, r, last_pos, e[this._get_settings().dnd.copy_modifier + "Key"]);
                }
                o = false;
                r = false;
                m.hide();
                if(ml) { ml.hide(); }
            },
            dnd_enter : function (obj) {
                if(this.data.dnd.mto) {
                    clearTimeout(this.data.dnd.mto);
                    this.data.dnd.mto = false;
                }
                var s = this._get_settings().dnd;
                this.data.dnd.prepared = false;
                r = this._get_node(obj);
                if(s.check_timeout) {
                    // do the calculations after a minimal timeout (users tend to drag quickly to the desired location)
                    if(this.data.dnd.to1) { clearTimeout(this.data.dnd.to1); }
                    this.data.dnd.to1 = setTimeout($.proxy(this.dnd_prepare, this), s.check_timeout);
                }
                else {
                    this.dnd_prepare();
                }
                if(s.open_timeout) {
                    if(this.data.dnd.to2) { clearTimeout(this.data.dnd.to2); }
                    if(r && r.length && r.hasClass("jstree-closed")) {
                        // if the node is closed - open it, then recalculate
                        this.data.dnd.to2 = setTimeout($.proxy(this.dnd_open, this), s.open_timeout);
                    }
                }
                else {
                    if(r && r.length && r.hasClass("jstree-closed")) {
                        this.dnd_open();
                    }
                }
            },
            dnd_leave : function (e) {
                this.data.dnd.after     = false;
                this.data.dnd.before    = false;
                this.data.dnd.inside    = false;
                $.vakata.dnd.helper.children("ins").attr("class","jstree-invalid");
                m.hide();
                if(ml) { ml.hide(); }
                if(r && r[0] === e.target.parentNode) {
                    if(this.data.dnd.to1) {
                        clearTimeout(this.data.dnd.to1);
                        this.data.dnd.to1 = false;
                    }
                    if(this.data.dnd.to2) {
                        clearTimeout(this.data.dnd.to2);
                        this.data.dnd.to2 = false;
                    }
                }
            },
            start_drag : function (obj, e) {
                o = this._get_node(obj);
                if(this.data.ui && this.is_selected(o)) { o = this._get_node(null, true); }
                var dt = o.length > 1 ? this._get_string("multiple_selection") : this.get_text(o),
                    cnt = this.get_container();
                if(!this._get_settings().core.html_titles) { dt = dt.replace(/</ig,"&lt;").replace(/>/ig,"&gt;"); }
                $.vakata.dnd.drag_start(e, { jstree : true, obj : o }, "<ins class='jstree-icon'></ins>" + dt );
                if(this.data.themes) {
                    if(m) { m.attr("class", "jstree-" + this.data.themes.theme); }
                    if(ml) { ml.attr("class", "jstree-" + this.data.themes.theme); }
                    $.vakata.dnd.helper.attr("class", "jstree-dnd-helper jstree-" + this.data.themes.theme);
                }
                this.data.dnd.cof = cnt.offset();
                this.data.dnd.cw = parseInt(cnt.width(),10);
                this.data.dnd.ch = parseInt(cnt.height(),10);
                this.data.dnd.active = true;
            }
        }
    });
    $(function() {
        var css_string = '' +
            '#vakata-dragged ins { display:block; text-decoration:none; width:16px; height:16px; margin:0 0 0 0; padding:0; position:absolute; top:4px; left:4px; ' +
            ' -moz-border-radius:4px; border-radius:4px; -webkit-border-radius:4px; ' +
            '} ' +
            '#vakata-dragged .jstree-ok { background:green; } ' +
            '#vakata-dragged .jstree-invalid { background:red; } ' +
            '#jstree-marker { padding:0; margin:0; font-size:12px; overflow:hidden; height:12px; width:8px; position:absolute; top:-30px; z-index:10001; background-repeat:no-repeat; display:none; background-color:transparent; text-shadow:1px 1px 1px white; color:black; line-height:10px; } ' +
            '#jstree-marker-line { padding:0; margin:0; line-height:0%; font-size:1px; overflow:hidden; height:1px; width:100px; position:absolute; top:-30px; z-index:10000; background-repeat:no-repeat; display:none; background-color:#456c43; ' +
            ' cursor:pointer; border:1px solid #eeeeee; border-left:0; -moz-box-shadow: 0px 0px 2px #666; -webkit-box-shadow: 0px 0px 2px #666; box-shadow: 0px 0px 2px #666; ' +
            ' -moz-border-radius:1px; border-radius:1px; -webkit-border-radius:1px; ' +
            '}' +
            '';
        $.vakata.css.add_sheet({ str : css_string, title : "jstree" });
        m = $("<div />").attr({ id : "jstree-marker" }).hide().html("&raquo;")
            .bind("mouseleave mouseenter", function (e) {
                m.hide();
                ml.hide();
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            })
            .appendTo("body");
        ml = $("<div />").attr({ id : "jstree-marker-line" }).hide()
            .bind("mouseup", function (e) {
                if(r && r.length) {
                    r.children("a").trigger(e);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
            })
            .bind("mouseleave", function (e) {
                var rt = $(e.relatedTarget);
                if(rt.is(".jstree") || rt.closest(".jstree").length === 0) {
                    if(r && r.length) {
                        r.children("a").trigger(e);
                        m.hide();
                        ml.hide();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }
                }
            })
            .appendTo("body");
        $(document).bind("drag_start.vakata", function (e, data) {
            if(data.data.jstree) { m.show(); if(ml) { ml.show(); } }
        });
        $(document).bind("drag_stop.vakata", function (e, data) {
            if(data.data.jstree) { m.hide(); if(ml) { ml.hide(); } }
        });
    });
})(jQuery);
//*/

/*
 * jsTree checkbox plugin
 * Inserts checkboxes in front of every node
 * Depends on the ui plugin
 * DOES NOT WORK NICELY WITH MULTITREE DRAG'N'DROP
 */
(function ($) {
    $.jstree.plugin("checkbox", {
        __init : function () {
            this.data.checkbox.noui = this._get_settings().checkbox.override_ui;
            if(this.data.ui && this.data.checkbox.noui) {
                this.select_node = this.deselect_node = this.deselect_all = $.noop;
                this.get_selected = this.get_checked;
            }

            this.get_container()
                .bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree", $.proxy(function (e, data) {
                        this._prepare_checkboxes(data.rslt.obj);
                    }, this))
                .bind("loaded.jstree", $.proxy(function (e) {
                        this._prepare_checkboxes();
                    }, this))
                .delegate( (this.data.ui && this.data.checkbox.noui ? "a" : "ins.jstree-checkbox") , "click.jstree", $.proxy(function (e) {
                        e.preventDefault();
                        if(this._get_node(e.target).hasClass("jstree-checked")) { this.uncheck_node(e.target); }
                        else { this.check_node(e.target); }
                        if(this.data.ui && this.data.checkbox.noui) {
                            this.save_selected();
                            if(this.data.cookies) { this.save_cookie("select_node"); }
                        }
                        else {
                            e.stopImmediatePropagation();
                            return false;
                        }
                    }, this));
        },
        defaults : {
            override_ui : false,
            two_state : false,
            real_checkboxes : false,
            checked_parent_open : true,
            real_checkboxes_names : function (n) { return [ ("check_" + (n[0].id || Math.ceil(Math.random() * 10000))) , 1]; }
        },
        __destroy : function () {
            this.get_container()
                .find("input.jstree-real-checkbox").removeClass("jstree-real-checkbox").end()
                .find("ins.jstree-checkbox").remove();
        },
        _fn : {
            _checkbox_notify : function (n, data) {
                if(data.checked) {
                    this.check_node(n, false);
                }
            },
            _prepare_checkboxes : function (obj) {
                obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
                if(obj === false) { return; } // added for removing root nodes
                var c, _this = this, t, ts = this._get_settings().checkbox.two_state, rc = this._get_settings().checkbox.real_checkboxes, rcn = this._get_settings().checkbox.real_checkboxes_names;
                obj.each(function () {
                    t = $(this);
                    c = t.is("li") && (t.hasClass("jstree-checked") || (rc && t.children(":checked").length)) ? "jstree-checked" : "jstree-unchecked";
                    t.find("li").andSelf().each(function () {
                        var $t = $(this), nm;
                        $t.children("a" + (_this.data.languages ? "" : ":eq(0)") ).filter("li[rel!='style'] > a").not(":has(.jstree-checkbox)").prepend("<ins class='jstree-checkbox'>&#160;</ins>").parent().not(".jstree-checked, .jstree-unchecked").addClass( ts ? "jstree-unchecked" : c );
                        if(rc) {
                            if(!$t.children(":checkbox").length) {
                                nm = rcn.call(_this, $t);
                                $t.prepend("<input type='checkbox' class='jstree-real-checkbox' id='" + nm[0] + "' name='" + nm[0] + "' value='" + nm[1] + "' />");
                            }
                            else {
                                $t.children(":checkbox").addClass("jstree-real-checkbox");
                            }
                            if(c === "jstree-checked") {
                                $t.children(":checkbox").attr("checked","checked");
                            }
                        }
                        if(c === "jstree-checked" && !ts) {
                            $t.find("li").addClass("jstree-checked");
                        }
                    });
                });
                if(!ts) {
                    if(obj.length === 1 && obj.is("li")) { this._repair_state(obj); }
                    if(obj.is("li")) { obj.each(function () { _this._repair_state(this); }); }
                    else { obj.find("> ul > li").each(function () { _this._repair_state(this); }); }
                    obj.find(".jstree-checked").parent().parent().each(function () { _this._repair_state(this); });
                }
            },
            change_state : function (obj, state) {
                obj = this._get_node(obj);
                var coll = false, rc = this._get_settings().checkbox.real_checkboxes;
                if(!obj || obj === -1) { return false; }
                state = (state === false || state === true) ? state : obj.hasClass("jstree-checked");
                if(this._get_settings().checkbox.two_state) {
                    if(state) {
                        obj.removeClass("jstree-checked").addClass("jstree-unchecked");
                        if(rc) { obj.children(":checkbox").removeAttr("checked"); }
                    }
                    else {
                        obj.removeClass("jstree-unchecked").addClass("jstree-checked");
                        if(rc) { obj.children(":checkbox").attr("checked","checked"); }
                    }
                }
                else {
                    if(state) {
                        coll = obj.find("li").andSelf();
                        if(!coll.filter(".jstree-checked, .jstree-undetermined").length) { return false; }
                        coll.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked");
                        if(rc) { coll.children(":checkbox").removeAttr("checked"); }
                    }
                    else {
                        coll = obj.find("li").andSelf();
                        if(!coll.filter(".jstree-unchecked, .jstree-undetermined").length) { return false; }
                        coll.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked");
                        if(rc) { coll.children(":checkbox").attr("checked","checked"); }
                        if(this.data.ui) { this.data.ui.last_selected = obj; }
                        this.data.checkbox.last_selected = obj;
                    }
                    obj.parentsUntil(".jstree", "li").each(function () {
                        var $this = $(this);
                        if(state) {
                            if($this.children("ul").children("li.jstree-checked, li.jstree-undetermined").length) {
                                $this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
                                if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").removeAttr("checked"); }
                                return false;
                            }
                            else {
                                $this.removeClass("jstree-checked jstree-undetermined").addClass("jstree-unchecked");
                                if(rc) { $this.children(":checkbox").removeAttr("checked"); }
                            }
                        }
                        else {
                            if($this.children("ul").children("li.jstree-unchecked, li.jstree-undetermined").length) {
                                $this.parentsUntil(".jstree", "li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
                                if(rc) { $this.parentsUntil(".jstree", "li").andSelf().children(":checkbox").removeAttr("checked"); }
                                return false;
                            }
                            else {
                                $this.removeClass("jstree-unchecked jstree-undetermined").addClass("jstree-checked");
                                if(rc) { $this.children(":checkbox").attr("checked","checked"); }
                            }
                        }
                    });
                }
                if(this.data.ui && this.data.checkbox.noui) { this.data.ui.selected = this.get_checked(); }
                this.__callback(obj);
                return true;
            },
            check_node : function (obj) {
                if(this.change_state(obj, false)) {
                    obj = this._get_node(obj);
                    if(this._get_settings().checkbox.checked_parent_open) {
                        var t = this;
                        obj.parents(".jstree-closed").each(function () { t.open_node(this, false, true); });
                    }
                    this.__callback({ "obj" : obj });
                }
            },
            uncheck_node : function (obj) {
                if(this.change_state(obj, true)) { this.__callback({ "obj" : this._get_node(obj) }); }
            },
            check_all : function () {
                var _this = this,
                    coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
                coll.each(function () {
                    _this.change_state(this, false);
                });
                this.__callback();
            },
            uncheck_all : function () {
                var _this = this,
                    coll = this._get_settings().checkbox.two_state ? this.get_container_ul().find("li") : this.get_container_ul().children("li");
                coll.each(function () {
                    _this.change_state(this, true);
                });
                this.__callback();
            },

            is_checked : function(obj) {
                obj = this._get_node(obj);
                return obj.length ? obj.is(".jstree-checked") : false;
            },
            get_checked : function (obj, get_all) {
                obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
                return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-checked") : obj.find("> ul > .jstree-checked, .jstree-undetermined > ul > .jstree-checked");
            },
            get_unchecked : function (obj, get_all) {
                obj = !obj || obj === -1 ? this.get_container() : this._get_node(obj);
                return get_all || this._get_settings().checkbox.two_state ? obj.find(".jstree-unchecked") : obj.find("> ul > .jstree-unchecked, .jstree-undetermined > ul > .jstree-unchecked");
            },

            show_checkboxes : function () { this.get_container().children("ul").removeClass("jstree-no-checkboxes"); },
            hide_checkboxes : function () { this.get_container().children("ul").addClass("jstree-no-checkboxes"); },

            _repair_state : function (obj) {
                obj = this._get_node(obj);
                if(!obj.length) { return; }
                var rc = this._get_settings().checkbox.real_checkboxes,
                    a = obj.find("> ul > .jstree-checked").length,
                    b = obj.find("> ul > .jstree-undetermined").length,
                    c = obj.find("> ul > li").length;
                if(c === 0) { if(obj.hasClass("jstree-undetermined")) { this.change_state(obj, false); } }
                else if(a === 0 && b === 0) { this.change_state(obj, true); }
                else if(a === c) { this.change_state(obj, false); }
                else {
                    obj.parentsUntil(".jstree","li").andSelf().removeClass("jstree-checked jstree-unchecked").addClass("jstree-undetermined");
                    if(rc) { obj.parentsUntil(".jstree", "li").andSelf().children(":checkbox").removeAttr("checked"); }
                }
            },
            reselect : function () {
                if(this.data.ui && this.data.checkbox.noui) {
                    var _this = this,
                        s = this.data.ui.to_select;
                    s = $.map($.makeArray(s), function (n) { return "#" + n.toString().replace(/^#/,"").replace(/\\\//g,"/").replace(/\//g,"\\\/").replace(/\\\./g,".").replace(/\./g,"\\.").replace(/\:/g,"\\:"); });
                    this.deselect_all();
                    $.each(s, function (i, val) { _this.check_node(val); });
                    this.__callback();
                }
                else {
                    this.__call_old();
                }
            },
            save_loaded : function () {
                var _this = this;
                this.data.core.to_load = [];
                this.get_container_ul().find("li.jstree-closed.jstree-undetermined").each(function () {
                    if(this.id) { _this.data.core.to_load.push("#" + this.id); }
                });
            }
        }
    });
    $(function() {
        var css_string = '.jstree .jstree-real-checkbox { display:none; } ';
        $.vakata.css.add_sheet({ str : css_string, title : "jstree" });
    });
})(jQuery);
//*/

/*
 * jsTree search plugin
 * Enables both sync and async search on the tree
 * DOES NOT WORK WITH JSON PROGRESSIVE RENDER
 */
(function ($) {
    $.expr[':'].jstree_contains = function(a,i,m){
        return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
    };
    $.expr[':'].jstree_title_contains = function(a,i,m) {
        return (a.getAttribute("title") || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
    };
    $.jstree.plugin("search", {
        __init : function () {
            this.data.search.str = "";
            this.data.search.result = $();
            if(this._get_settings().search.show_only_matches) {
                this.get_container()
                    .bind("search.jstree", function (e, data) {
                        $(this).children("ul").find("li").hide().removeClass("jstree-last");
                        data.rslt.nodes.parentsUntil(".jstree").andSelf().show()
                            .filter("ul").each(function () { $(this).children("li:visible").eq(-1).addClass("jstree-last"); });
                    })
                    .bind("clear_search.jstree", function () {
                        $(this).children("ul").find("li").css("display","").end().end().jstree("clean_node", -1);
                    });
            }
        },
        defaults : {
            ajax : false,
            search_method : "jstree_contains", // for case insensitive - jstree_contains
            show_only_matches : false
        },
        _fn : {
            search : function (str, skip_async) {
                if($.trim(str) === "") { this.clear_search(); return; }
                var s = this.get_settings().search,
                    t = this,
                    error_func = function () { },
                    success_func = function () { };
                this.data.search.str = str;

                if(!skip_async && s.ajax !== false && this.get_container_ul().find("li.jstree-closed:not(:has(ul)):eq(0)").length > 0) {
                    this.search.supress_callback = true;
                    error_func = function () { };
                    success_func = function (d, t, x) {
                        var sf = this.get_settings().search.ajax.success;
                        if(sf) { d = sf.call(this,d,t,x) || d; }
                        this.data.search.to_open = d;
                        this._search_open();
                    };
                    s.ajax.context = this;
                    s.ajax.error = error_func;
                    s.ajax.success = success_func;
                    if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, str); }
                    if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, str); }
                    if(!s.ajax.data) { s.ajax.data = { "search_string" : str }; }
                    if(!s.ajax.dataType || /^json/.exec(s.ajax.dataType)) { s.ajax.dataType = "json"; }
                    $.ajax(s.ajax);
                    return;
                }
                if(this.data.search.result.length) { this.clear_search(); }
                this.data.search.result = this.get_container().find("a" + (this.data.languages ? "." + this.get_lang() : "" ) + ":" + (s.search_method) + "(" + this.data.search.str + ")");
                this.data.search.result.addClass("jstree-search").parent().parents(".jstree-closed").each(function () {
                    t.open_node(this, false, true);
                });
                this.__callback({ nodes : this.data.search.result, str : str });
            },
            clear_search : function (str) {
                this.data.search.result.removeClass("jstree-search");
                this.__callback(this.data.search.result);
                this.data.search.result = $();
            },
            _search_open : function (is_callback) {
                var _this = this,
                    done = true,
                    current = [],
                    remaining = [];
                if(this.data.search.to_open.length) {
                    $.each(this.data.search.to_open, function (i, val) {
                        if(val == "#") { return true; }
                        if($(val).length && $(val).is(".jstree-closed")) { current.push(val); }
                        else { remaining.push(val); }
                    });
                    if(current.length) {
                        this.data.search.to_open = remaining;
                        $.each(current, function (i, val) {
                            _this.open_node(val, function () { _this._search_open(true); });
                        });
                        done = false;
                    }
                }
                if(done) { this.search(this.data.search.str, true); }
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree contextmenu plugin
 */
(function ($) {
    $.vakata.context = {
        hide_on_mouseleave : false,

        cnt     : $("<div id='vakata-contextmenu' />"),
        vis     : false,
        tgt     : false,
        par     : false,
        func    : false,
        data    : false,
        rtl     : false,
        show    : function (s, t, x, y, d, p, rtl) {
            $.vakata.context.rtl = !!rtl;
            var html = $.vakata.context.parse(s), h, w;
            if(!html) { return; }
            $.vakata.context.vis = true;
            $.vakata.context.tgt = t;
            $.vakata.context.par = p || t || null;
            $.vakata.context.data = d || null;
            $.vakata.context.cnt
                .html(html)
                .css({ "visibility" : "hidden", "display" : "block", "left" : 0, "top" : 0 });

            if($.vakata.context.hide_on_mouseleave) {
                $.vakata.context.cnt
                    .one("mouseleave", function(e) { $.vakata.context.hide(); });
            }

            h = $.vakata.context.cnt.height();
            w = $.vakata.context.cnt.width();
            if(x + w > $(document).width()) {
                x = $(document).width() - (w + 5);
                $.vakata.context.cnt.find("li > ul").addClass("right");
            }
            if(y + h > $(document).height()) {
                y = y - (h + t[0].offsetHeight);
                $.vakata.context.cnt.find("li > ul").addClass("bottom");
            }

            $.vakata.context.cnt
                .css({ "left" : x, "top" : y })
                .find("li:has(ul)")
                    .bind("mouseenter", function (e) {
                        var w = $(document).width(),
                            h = $(document).height(),
                            ul = $(this).children("ul").show();
                        if(w !== $(document).width()) { ul.toggleClass("right"); }
                        if(h !== $(document).height()) { ul.toggleClass("bottom"); }
                    })
                    .bind("mouseleave", function (e) {
                        $(this).children("ul").hide();
                    })
                    .end()
                .css({ "visibility" : "visible" })
                .show();
            $(document).triggerHandler("context_show.vakata");
        },
        hide    : function () {
            $.vakata.context.vis = false;
            $.vakata.context.cnt.attr("class","").css({ "visibility" : "hidden" });
            $(document).triggerHandler("context_hide.vakata");
        },
        parse   : function (s, is_callback) {
            if(!s) { return false; }
            var str = "",
                tmp = false,
                was_sep = true;
            if(!is_callback) { $.vakata.context.func = {}; }
            str += "<ul>";
            $.each(s, function (i, val) {
                if(!val) { return true; }
                $.vakata.context.func[i] = val.action;
                if(!was_sep && val.separator_before) {
                    str += "<li class='vakata-separator vakata-separator-before'></li>";
                }
                was_sep = false;
                str += "<li class='" + (val._class || "") + (val._disabled ? " jstree-contextmenu-disabled " : "") + "'><ins ";
                if(val.icon && val.icon.indexOf("/") === -1) { str += " class='" + val.icon + "' "; }
                if(val.icon && val.icon.indexOf("/") !== -1) { str += " style='background:url(" + val.icon + ") center center no-repeat;' "; }
                str += ">&#160;</ins><a href='#' rel='" + i + "'>";
                if(val.submenu) {
                    str += "<span style='float:" + ($.vakata.context.rtl ? "left" : "right") + ";'>&raquo;</span>";
                }
                str += val.label + "</a>";
                if(val.submenu) {
                    tmp = $.vakata.context.parse(val.submenu, true);
                    if(tmp) { str += tmp; }
                }
                str += "</li>";
                if(val.separator_after) {
                    str += "<li class='vakata-separator vakata-separator-after'></li>";
                    was_sep = true;
                }
            });
            str = str.replace(/<li class\='vakata-separator vakata-separator-after'\><\/li\>$/,"");
            str += "</ul>";
            $(document).triggerHandler("context_parse.vakata");
            return str.length > 10 ? str : false;
        },
        exec    : function (i) {
            if($.isFunction($.vakata.context.func[i])) {
                // if is string - eval and call it!
                $.vakata.context.func[i].call($.vakata.context.data, $.vakata.context.par);
                return true;
            }
            else { return false; }
        }
    };
    $(function () {
        var css_string = '' +
            '#vakata-contextmenu { display:block; visibility:hidden; left:0; top:-200px; position:absolute; margin:0; padding:0; min-width:180px; background:#ebebeb; border:1px solid silver; z-index:10000; *width:180px; } ' +
            '#vakata-contextmenu ul { min-width:180px; *width:180px; } ' +
            '#vakata-contextmenu ul, #vakata-contextmenu li { margin:0; padding:0; list-style-type:none; display:block; } ' +
            '#vakata-contextmenu li { line-height:20px; min-height:20px; position:relative; padding:0px; } ' +
            '#vakata-contextmenu li a { padding:1px 6px; line-height:17px; display:block; text-decoration:none; margin:1px 1px 0 1px; } ' +
            '#vakata-contextmenu li ins { float:left; width:16px; height:16px; text-decoration:none; margin-right:2px; } ' +
            '#vakata-contextmenu li a:hover, #vakata-contextmenu li.vakata-hover > a { background:gray; color:white; } ' +
            '#vakata-contextmenu li ul { display:none; position:absolute; top:-2px; left:100%; background:#ebebeb; border:1px solid gray; } ' +
            '#vakata-contextmenu .right { right:100%; left:auto; } ' +
            '#vakata-contextmenu .bottom { bottom:-1px; top:auto; } ' +
            '#vakata-contextmenu li.vakata-separator { min-height:0; height:1px; line-height:1px; font-size:1px; overflow:hidden; margin:0 2px; background:silver; /* border-top:1px solid #fefefe; */ padding:0; } ';
        $.vakata.css.add_sheet({ str : css_string, title : "vakata" });
        $.vakata.context.cnt
            .delegate("a","click", function (e) { e.preventDefault(); })
            .delegate("a","mouseup", function (e) {
                if(!$(this).parent().hasClass("jstree-contextmenu-disabled") && $.vakata.context.exec($(this).attr("rel"))) {
                    $.vakata.context.hide();
                }
                else { $(this).blur(); }
            })
            .delegate("a","mouseover", function () {
                $.vakata.context.cnt.find(".vakata-hover").removeClass("vakata-hover");
            })
            .appendTo("body");
        $(document).bind("mousedown", function (e) { if($.vakata.context.vis && !$.contains($.vakata.context.cnt[0], e.target)) { $.vakata.context.hide(); } });
        if(typeof $.hotkeys !== "undefined") {
            $(document)
                .bind("keydown", "up", function (e) {
                    if($.vakata.context.vis) {
                        var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").prevAll("li:not(.vakata-separator)").first();
                        if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").last(); }
                        o.addClass("vakata-hover");
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                })
                .bind("keydown", "down", function (e) {
                    if($.vakata.context.vis) {
                        var o = $.vakata.context.cnt.find("ul:visible").last().children(".vakata-hover").removeClass("vakata-hover").nextAll("li:not(.vakata-separator)").first();
                        if(!o.length) { o = $.vakata.context.cnt.find("ul:visible").last().children("li:not(.vakata-separator)").first(); }
                        o.addClass("vakata-hover");
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                })
                .bind("keydown", "right", function (e) {
                    if($.vakata.context.vis) {
                        $.vakata.context.cnt.find(".vakata-hover").children("ul").show().children("li:not(.vakata-separator)").removeClass("vakata-hover").first().addClass("vakata-hover");
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                })
                .bind("keydown", "left", function (e) {
                    if($.vakata.context.vis) {
                        $.vakata.context.cnt.find(".vakata-hover").children("ul").hide().children(".vakata-separator").removeClass("vakata-hover");
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                })
                .bind("keydown", "esc", function (e) {
                    $.vakata.context.hide();
                    e.preventDefault();
                })
                .bind("keydown", "space", function (e) {
                    $.vakata.context.cnt.find(".vakata-hover").last().children("a").click();
                    e.preventDefault();
                });
        }
    });

    $.jstree.plugin("contextmenu", {
        __init : function () {
            this.get_container()
                .delegate("a", "contextmenu.jstree", $.proxy(function (e) {
                        e.preventDefault();
                        if(!$(e.currentTarget).hasClass("jstree-loading")) {
                            this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
                        }
                    }, this))
                .delegate("a", "click.jstree", $.proxy(function (e) {
                        if(this.data.contextmenu) {
                            $.vakata.context.hide();
                        }
                    }, this))
                .bind("destroy.jstree", $.proxy(function () {
                        // TODO: move this to descruct method
                        if(this.data.contextmenu) {
                            $.vakata.context.hide();
                        }
                    }, this));
            $(document).bind("context_hide.vakata", $.proxy(function () { this.data.contextmenu = false; }, this));
        },
        defaults : {
            select_node : false, // requires UI plugin
            show_at_node : true,
            items : { // Could be a function that should return an object like this one
                "create" : {
                    "separator_before"  : false,
                    "separator_after"   : true,
                    "label"             : "Create",
                    "action"            : function (obj) { this.create(obj); }
                },
                "rename" : {
                    "separator_before"  : false,
                    "separator_after"   : false,
                    "label"             : "Rename",
                    "action"            : function (obj) { this.rename(obj); }
                },
                "remove" : {
                    "separator_before"  : false,
                    "icon"              : false,
                    "separator_after"   : false,
                    "label"             : "Delete",
                    "action"            : function (obj) { if(this.is_selected(obj)) { this.remove(); } else { this.remove(obj); } }
                },
                "ccp" : {
                    "separator_before"  : true,
                    "icon"              : false,
                    "separator_after"   : false,
                    "label"             : "Edit",
                    "action"            : false,
                    "submenu" : {
                        "cut" : {
                            "separator_before"  : false,
                            "separator_after"   : false,
                            "label"             : "Cut",
                            "action"            : function (obj) { this.cut(obj); }
                        },
                        "copy" : {
                            "separator_before"  : false,
                            "icon"              : false,
                            "separator_after"   : false,
                            "label"             : "Copy",
                            "action"            : function (obj) { this.copy(obj); }
                        },
                        "paste" : {
                            "separator_before"  : false,
                            "icon"              : false,
                            "separator_after"   : false,
                            "label"             : "Paste",
                            "action"            : function (obj) { this.paste(obj); }
                        }
                    }
                }
            }
        },
        _fn : {
            show_contextmenu : function (obj, x, y) {
                obj = this._get_node(obj);
                var s = this.get_settings().contextmenu,
                    a = obj.children("a:visible:eq(0)"),
                    o = false,
                    i = false;
                if(s.select_node && this.data.ui && !this.is_selected(obj)) {
                    this.deselect_all();
                    this.select_node(obj, true);
                }
                if(s.show_at_node || typeof x === "undefined" || typeof y === "undefined") {
                    o = a.offset();
                    x = o.left;
                    y = o.top + this.data.core.li_height;
                }
                i = obj.data("jstree") && obj.data("jstree").contextmenu ? obj.data("jstree").contextmenu : s.items;
                if($.isFunction(i)) { i = i.call(this, obj); }
                this.data.contextmenu = true;
                $.vakata.context.show(i, a, x, y, this, obj, this._get_settings().core.rtl);
                if(this.data.themes) { $.vakata.context.cnt.attr("class", "jstree-" + this.data.themes.theme + "-context"); }
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree types plugin
 * Adds support types of nodes
 * You can set an attribute on each li node, that represents its type.
 * According to the type setting the node may get custom icon/validation rules
 */
(function ($) {
    $.jstree.plugin("types", {
        __init : function () {
            var s = this._get_settings().types;
            this.data.types.attach_to = [];
            this.get_container()
                .bind("init.jstree", $.proxy(function () {
                        var types = s.types,
                            attr  = s.type_attr,
                            icons_css = "",
                            _this = this;

                        $.each(types, function (i, tp) {
                            $.each(tp, function (k, v) {
                                if(!/^(max_depth|max_children|icon|valid_children)$/.test(k)) { _this.data.types.attach_to.push(k); }
                            });
                            if(!tp.icon) { return true; }
                            if( tp.icon.image || tp.icon.position) {
                                if(i == "default")  { icons_css += '.jstree-' + _this.get_index() + ' a > .jstree-icon { '; }
                                else                { icons_css += '.jstree-' + _this.get_index() + ' li[' + attr + '="' + i + '"] > a > .jstree-icon { '; }
                                if(tp.icon.image)   { icons_css += ' background-image:url(' + tp.icon.image + '); '; }
                                if(tp.icon.position){ icons_css += ' background-position:' + tp.icon.position + '; '; }
                                else                { icons_css += ' background-position:0 0; '; }
                                icons_css += '} ';
                            }
                        });
                        if(icons_css !== "") { $.vakata.css.add_sheet({ 'str' : icons_css, title : "jstree-types" }); }
                    }, this))
                .bind("before.jstree", $.proxy(function (e, data) {
                        var s, t,
                            o = this._get_settings().types.use_data ? this._get_node(data.args[0]) : false,
                            d = o && o !== -1 && o.length ? o.data("jstree") : false;
                        if(d && d.types && d.types[data.func] === false) { e.stopImmediatePropagation(); return false; }
                        if($.inArray(data.func, this.data.types.attach_to) !== -1) {
                            if(!data.args[0] || (!data.args[0].tagName && !data.args[0].jquery)) { return; }
                            s = this._get_settings().types.types;
                            t = this._get_type(data.args[0]);
                            if(
                                (
                                    (s[t] && typeof s[t][data.func] !== "undefined") ||
                                    (s["default"] && typeof s["default"][data.func] !== "undefined")
                                ) && this._check(data.func, data.args[0]) === false
                            ) {
                                e.stopImmediatePropagation();
                                return false;
                            }
                        }
                    }, this));
            if(is_ie6) {
                this.get_container()
                    .bind("load_node.jstree set_type.jstree", $.proxy(function (e, data) {
                            var r = data && data.rslt && data.rslt.obj && data.rslt.obj !== -1 ? this._get_node(data.rslt.obj).parent() : this.get_container_ul(),
                                c = false,
                                s = this._get_settings().types;
                            $.each(s.types, function (i, tp) {
                                if(tp.icon && (tp.icon.image || tp.icon.position)) {
                                    c = i === "default" ? r.find("li > a > .jstree-icon") : r.find("li[" + s.type_attr + "='" + i + "'] > a > .jstree-icon");
                                    if(tp.icon.image) { c.css("backgroundImage","url(" + tp.icon.image + ")"); }
                                    c.css("backgroundPosition", tp.icon.position || "0 0");
                                }
                            });
                        }, this));
            }
        },
        defaults : {
            // defines maximum number of root nodes (-1 means unlimited, -2 means disable max_children checking)
            max_children        : -1,
            // defines the maximum depth of the tree (-1 means unlimited, -2 means disable max_depth checking)
            max_depth           : -1,
            // defines valid node types for the root nodes
            valid_children      : "all",

            // whether to use $.data
            use_data : false,
            // where is the type stores (the rel attribute of the LI element)
            type_attr : "rel",
            // a list of types
            types : {
                // the default type
                "default" : {
                    "max_children"  : -1,
                    "max_depth"     : -1,
                    "valid_children": "all"

                    // Bound functions - you can bind any other function here (using boolean or function)
                    //"select_node" : true
                }
            }
        },
        _fn : {
            _types_notify : function (n, data) {
                if(data.type && this._get_settings().types.use_data) {
                    this.set_type(data.type, n);
                }
            },
            _get_type : function (obj) {
                obj = this._get_node(obj);
                return (!obj || !obj.length) ? false : obj.attr(this._get_settings().types.type_attr) || "default";
            },
            set_type : function (str, obj) {
                obj = this._get_node(obj);
                var ret = (!obj.length || !str) ? false : obj.attr(this._get_settings().types.type_attr, str);
                if(ret) { this.__callback({ obj : obj, type : str}); }
                return ret;
            },
            _check : function (rule, obj, opts) {
                obj = this._get_node(obj);
                var v = false, t = this._get_type(obj), d = 0, _this = this, s = this._get_settings().types, data = false;
                if(obj === -1) {
                    if(!!s[rule]) { v = s[rule]; }
                    else { return; }
                }
                else {
                    if(t === false) { return; }
                    data = s.use_data ? obj.data("jstree") : false;
                    if(data && data.types && typeof data.types[rule] !== "undefined") { v = data.types[rule]; }
                    else if(!!s.types[t] && typeof s.types[t][rule] !== "undefined") { v = s.types[t][rule]; }
                    else if(!!s.types["default"] && typeof s.types["default"][rule] !== "undefined") { v = s.types["default"][rule]; }
                }
                if($.isFunction(v)) { v = v.call(this, obj); }
                if(rule === "max_depth" && obj !== -1 && opts !== false && s.max_depth !== -2 && v !== 0) {
                    // also include the node itself - otherwise if root node it is not checked
                    obj.children("a:eq(0)").parentsUntil(".jstree","li").each(function (i) {
                        // check if current depth already exceeds global tree depth
                        if(s.max_depth !== -1 && s.max_depth - (i + 1) <= 0) { v = 0; return false; }
                        d = (i === 0) ? v : _this._check(rule, this, false);
                        // check if current node max depth is already matched or exceeded
                        if(d !== -1 && d - (i + 1) <= 0) { v = 0; return false; }
                        // otherwise - set the max depth to the current value minus current depth
                        if(d >= 0 && (d - (i + 1) < v || v < 0) ) { v = d - (i + 1); }
                        // if the global tree depth exists and it minus the nodes calculated so far is less than `v` or `v` is unlimited
                        if(s.max_depth >= 0 && (s.max_depth - (i + 1) < v || v < 0) ) { v = s.max_depth - (i + 1); }
                    });
                }
                return v;
            },
            check_move : function () {
                if(!this.__call_old()) { return false; }
                var m  = this._get_move(),
                    s  = m.rt._get_settings().types,
                    mc = m.rt._check("max_children", m.cr),
                    md = m.rt._check("max_depth", m.cr),
                    vc = m.rt._check("valid_children", m.cr),
                    ch = 0, d = 1, t;

                if(vc === "none") { return false; }
                if($.isArray(vc) && m.ot && m.ot._get_type) {
                    m.o.each(function () {
                        if($.inArray(m.ot._get_type(this), vc) === -1) { d = false; return false; }
                    });
                    if(d === false) { return false; }
                }
                if(s.max_children !== -2 && mc !== -1) {
                    ch = m.cr === -1 ? this.get_container().find("> ul > li").not(m.o).length : m.cr.find("> ul > li").not(m.o).length;
                    if(ch + m.o.length > mc) { return false; }
                }
                if(s.max_depth !== -2 && md !== -1) {
                    d = 0;
                    if(md === 0) { return false; }
                    if(typeof m.o.d === "undefined") {
                        // TODO: deal with progressive rendering and async when checking max_depth (how to know the depth of the moved node)
                        t = m.o;
                        while(t.length > 0) {
                            t = t.find("> ul > li");
                            d ++;
                        }
                        m.o.d = d;
                    }
                    if(md - m.o.d < 0) { return false; }
                }
                return true;
            },
            create_node : function (obj, position, js, callback, is_loaded, skip_check) {
                if(!skip_check && (is_loaded || this._is_loaded(obj))) {
                    var p  = (typeof position == "string" && position.match(/^before|after$/i) && obj !== -1) ? this._get_parent(obj) : this._get_node(obj),
                        s  = this._get_settings().types,
                        mc = this._check("max_children", p),
                        md = this._check("max_depth", p),
                        vc = this._check("valid_children", p),
                        ch;
                    if(typeof js === "string") { js = { data : js }; }
                    if(!js) { js = {}; }
                    if(vc === "none") { return false; }
                    if($.isArray(vc)) {
                        if(!js.attr || !js.attr[s.type_attr]) {
                            if(!js.attr) { js.attr = {}; }
                            js.attr[s.type_attr] = vc[0];
                        }
                        else {
                            if($.inArray(js.attr[s.type_attr], vc) === -1) { return false; }
                        }
                    }
                    if(s.max_children !== -2 && mc !== -1) {
                        ch = p === -1 ? this.get_container().find("> ul > li").length : p.find("> ul > li").length;
                        if(ch + 1 > mc) { return false; }
                    }
                    if(s.max_depth !== -2 && md !== -1 && (md - 1) < 0) { return false; }
                }
                return this.__call_old(true, obj, position, js, callback, is_loaded, skip_check);
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree HTML plugin
 * The HTML data store. Datastores are build by replacing the `load_node` and `_is_loaded` functions.
 */
(function ($) {
    $.jstree.plugin("html_data", {
        __init : function () {
            // this used to use html() and clean the whitespace, but this way any attached data was lost
            this.data.html_data.original_container_html = this.get_container().find(" > ul > li").clone(true);
            // remove white space from LI node - otherwise nodes appear a bit to the right
            this.data.html_data.original_container_html.find("li").andSelf().contents().filter(function() { return this.nodeType == 3; }).remove();
        },
        defaults : {
            data : false,
            ajax : false,
            correct_state : true
        },
        _fn : {
            load_node : function (obj, s_call, e_call) { var _this = this; this.load_node_html(obj, function () { _this.__callback({ "obj" : _this._get_node(obj) }); s_call.call(this); }, e_call); },
            _is_loaded : function (obj) {
                obj = this._get_node(obj);
                return obj == -1 || !obj || (!this._get_settings().html_data.ajax && !$.isFunction(this._get_settings().html_data.data)) || obj.is(".jstree-open, .jstree-leaf") || obj.children("ul").children("li").size() > 0;
            },
            load_node_html : function (obj, s_call, e_call) {
                var d,
                    s = this.get_settings().html_data,
                    error_func = function () {},
                    success_func = function () {};
                obj = this._get_node(obj);
                if(obj && obj !== -1) {
                    if(obj.data("jstree-is-loading")) { return; }
                    else { obj.data("jstree-is-loading",true); }
                }
                switch(!0) {
                    case ($.isFunction(s.data)):
                        s.data.call(this, obj, $.proxy(function (d) {
                            if(d && d !== "" && d.toString && d.toString().replace(/^[\s\n]+$/,"") !== "") {
                                d = $(d);
                                if(!d.is("ul")) { d = $("<ul />").append(d); }
                                if(obj == -1 || !obj) { this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); }
                                else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d).children("ul").find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); obj.removeData("jstree-is-loading"); }
                                this.clean_node(obj);
                                if(s_call) { s_call.call(this); }
                            }
                            else {
                                if(obj && obj !== -1) {
                                    obj.children("a.jstree-loading").removeClass("jstree-loading");
                                    obj.removeData("jstree-is-loading");
                                    if(s.correct_state) {
                                        this.correct_state(obj);
                                        if(s_call) { s_call.call(this); }
                                    }
                                }
                                else {
                                    if(s.correct_state) {
                                        this.get_container().children("ul").empty();
                                        if(s_call) { s_call.call(this); }
                                    }
                                }
                            }
                        }, this));
                        break;
                    case (!s.data && !s.ajax):
                        if(!obj || obj == -1) {
                            this.get_container()
                                .children("ul").empty()
                                .append(this.data.html_data.original_container_html)
                                .find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end()
                                .filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon");
                            this.clean_node();
                        }
                        if(s_call) { s_call.call(this); }
                        break;
                    case (!!s.data && !s.ajax) || (!!s.data && !!s.ajax && (!obj || obj === -1)):
                        if(!obj || obj == -1) {
                            d = $(s.data);
                            if(!d.is("ul")) { d = $("<ul />").append(d); }
                            this.get_container()
                                .children("ul").empty().append(d.children())
                                .find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end()
                                .filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon");
                            this.clean_node();
                        }
                        if(s_call) { s_call.call(this); }
                        break;
                    case (!s.data && !!s.ajax) || (!!s.data && !!s.ajax && obj && obj !== -1):
                        obj = this._get_node(obj);
                        error_func = function (x, t, e) {
                            var ef = this.get_settings().html_data.ajax.error;
                            if(ef) { ef.call(this, x, t, e); }
                            if(obj != -1 && obj.length) {
                                obj.children("a.jstree-loading").removeClass("jstree-loading");
                                obj.removeData("jstree-is-loading");
                                if(t === "success" && s.correct_state) { this.correct_state(obj); }
                            }
                            else {
                                if(t === "success" && s.correct_state) { this.get_container().children("ul").empty(); }
                            }
                            if(e_call) { e_call.call(this); }
                        };
                        success_func = function (d, t, x) {
                            var sf = this.get_settings().html_data.ajax.success;
                            if(sf) { d = sf.call(this,d,t,x) || d; }
                            if(d === "" || (d && d.toString && d.toString().replace(/^[\s\n]+$/,"") === "")) {
                                return error_func.call(this, x, t, "");
                            }
                            if(d) {
                                d = $(d);
                                if(!d.is("ul")) { d = $("<ul />").append(d); }
                                if(obj == -1 || !obj) { this.get_container().children("ul").empty().append(d.children()).find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); }
                                else { obj.children("a.jstree-loading").removeClass("jstree-loading"); obj.append(d).children("ul").find("li, a").filter(function () { return !this.firstChild || !this.firstChild.tagName || this.firstChild.tagName !== "INS"; }).prepend("<ins class='jstree-icon'>&#160;</ins>").end().filter("a").children("ins:first-child").not(".jstree-icon").addClass("jstree-icon"); obj.removeData("jstree-is-loading"); }
                                this.clean_node(obj);
                                if(s_call) { s_call.call(this); }
                            }
                            else {
                                if(obj && obj !== -1) {
                                    obj.children("a.jstree-loading").removeClass("jstree-loading");
                                    obj.removeData("jstree-is-loading");
                                    if(s.correct_state) {
                                        this.correct_state(obj);
                                        if(s_call) { s_call.call(this); }
                                    }
                                }
                                else {
                                    if(s.correct_state) {
                                        this.get_container().children("ul").empty();
                                        if(s_call) { s_call.call(this); }
                                    }
                                }
                            }
                        };
                        s.ajax.context = this;
                        s.ajax.error = error_func;
                        s.ajax.success = success_func;
                        if(!s.ajax.dataType) { s.ajax.dataType = "html"; }
                        if($.isFunction(s.ajax.url)) { s.ajax.url = s.ajax.url.call(this, obj); }
                        if($.isFunction(s.ajax.data)) { s.ajax.data = s.ajax.data.call(this, obj); }
                        $.ajax(s.ajax);
                        break;
                }
            }
        }
    });
    // include the HTML data plugin by default
    $.jstree.defaults.plugins.push("html_data");
})(jQuery);
//*/

/*
 * jsTree themeroller plugin
 * Adds support for jQuery UI themes. Include this at the end of your plugins list, also make sure "themes" is not included.
 */
(function ($) {
    $.jstree.plugin("themeroller", {
        __init : function () {
            var s = this._get_settings().themeroller;
            this.get_container()
                .addClass("ui-widget-content")
                .addClass("jstree-themeroller")
                .delegate("a","mouseenter.jstree", function (e) {
                    if(!$(e.currentTarget).hasClass("jstree-loading")) {
                        $(this).addClass(s.item_h);
                    }
                })
                .delegate("a","mouseleave.jstree", function () {
                    $(this).removeClass(s.item_h);
                })
                .bind("init.jstree", $.proxy(function (e, data) {
                        data.inst.get_container().find("> ul > li > .jstree-loading > ins").addClass("ui-icon-refresh");
                        this._themeroller(data.inst.get_container().find("> ul > li"));
                    }, this))
                .bind("open_node.jstree create_node.jstree", $.proxy(function (e, data) {
                        this._themeroller(data.rslt.obj);
                    }, this))
                .bind("loaded.jstree refresh.jstree", $.proxy(function (e) {
                        this._themeroller();
                    }, this))
                .bind("close_node.jstree", $.proxy(function (e, data) {
                        this._themeroller(data.rslt.obj);
                    }, this))
                .bind("delete_node.jstree", $.proxy(function (e, data) {
                        this._themeroller(data.rslt.parent);
                    }, this))
                .bind("correct_state.jstree", $.proxy(function (e, data) {
                        data.rslt.obj
                            .children("ins.jstree-icon").removeClass(s.opened + " " + s.closed + " ui-icon").end()
                            .find("> a > ins.ui-icon")
                                .filter(function() {
                                    return this.className.toString()
                                        .replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
                                        .indexOf("ui-icon-") === -1;
                                }).removeClass(s.item_open + " " + s.item_clsd).addClass(s.item_leaf || "jstree-no-icon");
                    }, this))
                .bind("select_node.jstree", $.proxy(function (e, data) {
                        data.rslt.obj.children("a").addClass(s.item_a);
                    }, this))
                .bind("deselect_node.jstree deselect_all.jstree", $.proxy(function (e, data) {
                        this.get_container()
                            .find("a." + s.item_a).removeClass(s.item_a).end()
                            .find("a.jstree-clicked").addClass(s.item_a);
                    }, this))
                .bind("dehover_node.jstree", $.proxy(function (e, data) {
                        data.rslt.obj.children("a").removeClass(s.item_h);
                    }, this))
                .bind("hover_node.jstree", $.proxy(function (e, data) {
                        this.get_container()
                            .find("a." + s.item_h).not(data.rslt.obj).removeClass(s.item_h);
                        data.rslt.obj.children("a").addClass(s.item_h);
                    }, this))
                .bind("move_node.jstree", $.proxy(function (e, data) {
                        this._themeroller(data.rslt.o);
                        this._themeroller(data.rslt.op);
                    }, this));
        },
        __destroy : function () {
            var s = this._get_settings().themeroller,
                c = [ "ui-icon" ];
            $.each(s, function (i, v) {
                v = v.split(" ");
                if(v.length) { c = c.concat(v); }
            });
            this.get_container()
                .removeClass("ui-widget-content")
                .find("." + c.join(", .")).removeClass(c.join(" "));
        },
        _fn : {
            _themeroller : function (obj) {
                var s = this._get_settings().themeroller;
                obj = !obj || obj == -1 ? this.get_container_ul() : this._get_node(obj).parent();
                obj
                    .find("li.jstree-closed")
                        .children("ins.jstree-icon").removeClass(s.opened).addClass("ui-icon " + s.closed).end()
                        .children("a").addClass(s.item)
                            .children("ins.jstree-icon").addClass("ui-icon")
                                .filter(function() {
                                    return this.className.toString()
                                        .replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
                                        .indexOf("ui-icon-") === -1;
                                }).removeClass(s.item_leaf + " " + s.item_open).addClass(s.item_clsd || "jstree-no-icon")
                                .end()
                            .end()
                        .end()
                    .end()
                    .find("li.jstree-open")
                        .children("ins.jstree-icon").removeClass(s.closed).addClass("ui-icon " + s.opened).end()
                        .children("a").addClass(s.item)
                            .children("ins.jstree-icon").addClass("ui-icon")
                                .filter(function() {
                                    return this.className.toString()
                                        .replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
                                        .indexOf("ui-icon-") === -1;
                                }).removeClass(s.item_leaf + " " + s.item_clsd).addClass(s.item_open || "jstree-no-icon")
                                .end()
                            .end()
                        .end()
                    .end()
                    .find("li.jstree-leaf")
                        .children("ins.jstree-icon").removeClass(s.closed + " ui-icon " + s.opened).end()
                        .children("a").addClass(s.item)
                            .children("ins.jstree-icon").addClass("ui-icon")
                                .filter(function() {
                                    return this.className.toString()
                                        .replace(s.item_clsd,"").replace(s.item_open,"").replace(s.item_leaf,"")
                                        .indexOf("ui-icon-") === -1;
                                }).removeClass(s.item_clsd + " " + s.item_open).addClass(s.item_leaf || "jstree-no-icon");
            }
        },
        defaults : {
            "opened"    : "ui-icon-triangle-1-se",
            "closed"    : "ui-icon-triangle-1-e",
            "item"      : "ui-state-default",
            "item_h"    : "ui-state-hover",
            "item_a"    : "ui-state-active",
            "item_open" : "ui-icon-folder-open",
            "item_clsd" : "ui-icon-folder-collapsed",
            "item_leaf" : "ui-icon-document"
        }
    });
    $(function() {
        var css_string = '' +
            '.jstree-themeroller .ui-icon { overflow:visible; } ' +
            '.jstree-themeroller a { padding:0 2px; } ' +
            '.jstree-themeroller .jstree-no-icon { display:none; }';
        $.vakata.css.add_sheet({ str : css_string, title : "jstree" });
    });
})(jQuery);
//*/

/*
 * jsTree unique plugin
 * Forces different names amongst siblings (still a bit experimental)
 * NOTE: does not check language versions (it will not be possible to have nodes with the same title, even in different languages)
 */
(function ($) {
    $.jstree.plugin("unique", {
        __init : function () {
            this.get_container()
                .bind("before.jstree", $.proxy(function (e, data) {
                        var nms = [], res = true, p, t;
                        if(data.func == "move_node") {
                            // obj, ref, position, is_copy, is_prepared, skip_check
                            if(data.args[4] === true) {
                                if(data.args[0].o && data.args[0].o.length) {
                                    data.args[0].o.children("a").each(function () { nms.push($(this).text().replace(/^\s+/g,"")); });
                                    res = this._check_unique(nms, data.args[0].np.find("> ul > li").not(data.args[0].o), "move_node");
                                }
                            }
                        }
                        if(data.func == "create_node") {
                            // obj, position, js, callback, is_loaded
                            if(data.args[4] || this._is_loaded(data.args[0])) {
                                p = this._get_node(data.args[0]);
                                if(data.args[1] && (data.args[1] === "before" || data.args[1] === "after")) {
                                    p = this._get_parent(data.args[0]);
                                    if(!p || p === -1) { p = this.get_container(); }
                                }
                                if(typeof data.args[2] === "string") { nms.push(data.args[2]); }
                                else if(!data.args[2] || !data.args[2].data) { nms.push(this._get_string("new_node")); }
                                else { nms.push(data.args[2].data); }
                                res = this._check_unique(nms, p.find("> ul > li"), "create_node");
                            }
                        }
                        if(data.func == "rename_node") {
                            // obj, val
                            nms.push(data.args[1]);
                            t = this._get_node(data.args[0]);
                            p = this._get_parent(t);
                            if(!p || p === -1) { p = this.get_container(); }
                            res = this._check_unique(nms, p.find("> ul > li").not(t), "rename_node");
                        }
                        if(!res) {
                            e.stopPropagation();
                            return false;
                        }
                    }, this));
        },
        defaults : {
            error_callback : $.noop
        },
        _fn : {
            _check_unique : function (nms, p, func) {
                var cnms = [];
                p.children("a").each(function () { cnms.push($(this).text().replace(/^\s+/g,"")); });
                if(!cnms.length || !nms.length) { return true; }
                cnms = cnms.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");
                if((cnms.length + nms.length) != cnms.concat(nms).sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",").length) {
                    this._get_settings().unique.error_callback.call(null, nms, p, func);
                    return false;
                }
                return true;
            },
            check_move : function () {
                if(!this.__call_old()) { return false; }
                var p = this._get_move(), nms = [];
                if(p.o && p.o.length) {
                    p.o.children("a").each(function () { nms.push($(this).text().replace(/^\s+/g,"")); });
                    return this._check_unique(nms, p.np.find("> ul > li").not(p.o), "check_move");
                }
                return true;
            }
        }
    });
})(jQuery);
//*/

/*
 * jsTree wholerow plugin
 * Makes select and hover work on the entire width of the node
 * MAY BE HEAVY IN LARGE DOM
 */
(function ($) {
    $.jstree.plugin("wholerow", {
        __init : function () {
            if(!this.data.ui) { throw "jsTree wholerow: jsTree UI plugin not included."; }
            this.data.wholerow.html = false;
            this.data.wholerow.to = false;
            this.get_container()
                .bind("init.jstree", $.proxy(function (e, data) {
                        this._get_settings().core.animation = 0;
                    }, this))
                .bind("open_node.jstree create_node.jstree clean_node.jstree loaded.jstree", $.proxy(function (e, data) {
                        this._prepare_wholerow_span( data && data.rslt && data.rslt.obj ? data.rslt.obj : -1 );
                    }, this))
                .bind("search.jstree clear_search.jstree reopen.jstree after_open.jstree after_close.jstree create_node.jstree delete_node.jstree clean_node.jstree", $.proxy(function (e, data) {
                        if(this.data.to) { clearTimeout(this.data.to); }
                        this.data.to = setTimeout( (function (t, o) { return function() { t._prepare_wholerow_ul(o); }; })(this,  data && data.rslt && data.rslt.obj ? data.rslt.obj : -1), 0);
                    }, this))
                .bind("deselect_all.jstree", $.proxy(function (e, data) {
                        this.get_container().find(" > .jstree-wholerow .jstree-clicked").removeClass("jstree-clicked " + (this.data.themeroller ? this._get_settings().themeroller.item_a : "" ));
                    }, this))
                .bind("select_node.jstree deselect_node.jstree ", $.proxy(function (e, data) {
                        data.rslt.obj.each(function () {
                            var ref = data.inst.get_container().find(" > .jstree-wholerow li:visible:eq(" + ( parseInt((($(this).offset().top - data.inst.get_container().offset().top + data.inst.get_container()[0].scrollTop) / data.inst.data.core.li_height),10)) + ")");
                            // ref.children("a")[e.type === "select_node" ? "addClass" : "removeClass"]("jstree-clicked");
                            ref.children("a").attr("class",data.rslt.obj.children("a").attr("class"));
                        });
                    }, this))
                .bind("hover_node.jstree dehover_node.jstree", $.proxy(function (e, data) {
                        this.get_container().find(" > .jstree-wholerow .jstree-hovered").removeClass("jstree-hovered " + (this.data.themeroller ? this._get_settings().themeroller.item_h : "" ));
                        if(e.type === "hover_node") {
                            var ref = this.get_container().find(" > .jstree-wholerow li:visible:eq(" + ( parseInt(((data.rslt.obj.offset().top - this.get_container().offset().top + this.get_container()[0].scrollTop) / this.data.core.li_height),10)) + ")");
                            // ref.children("a").addClass("jstree-hovered");
                            ref.children("a").attr("class",data.rslt.obj.children(".jstree-hovered").attr("class"));
                        }
                    }, this))
                .delegate(".jstree-wholerow-span, ins.jstree-icon, li", "click.jstree", function (e) {
                        var n = $(e.currentTarget);
                        if(e.target.tagName === "A" || (e.target.tagName === "INS" && n.closest("li").is(".jstree-open, .jstree-closed"))) { return; }
                        n.closest("li").children("a:visible:eq(0)").click();
                        e.stopImmediatePropagation();
                    })
                .delegate("li", "mouseover.jstree", $.proxy(function (e) {
                        e.stopImmediatePropagation();
                        if($(e.currentTarget).children(".jstree-hovered, .jstree-clicked").length) { return false; }
                        this.hover_node(e.currentTarget);
                        return false;
                    }, this))
                .delegate("li", "mouseleave.jstree", $.proxy(function (e) {
                        if($(e.currentTarget).children("a").hasClass("jstree-hovered").length) { return; }
                        this.dehover_node(e.currentTarget);
                    }, this));
            if(is_ie7 || is_ie6) {
                $.vakata.css.add_sheet({ str : ".jstree-" + this.get_index() + " { position:relative; } ", title : "jstree" });
            }
        },
        defaults : {
        },
        __destroy : function () {
            this.get_container().children(".jstree-wholerow").remove();
            this.get_container().find(".jstree-wholerow-span").remove();
        },
        _fn : {
            _prepare_wholerow_span : function (obj) {
                obj = !obj || obj == -1 ? this.get_container().find("> ul > li") : this._get_node(obj);
                if(obj === false) { return; } // added for removing root nodes
                obj.each(function () {
                    $(this).find("li").andSelf().each(function () {
                        var $t = $(this);
                        if($t.children(".jstree-wholerow-span").length) { return true; }
                        $t.prepend("<span class='jstree-wholerow-span' style='width:" + ($t.parentsUntil(".jstree","li").length * 18) + "px;'>&#160;</span>");
                    });
                });
            },
            _prepare_wholerow_ul : function () {
                var o = this.get_container().children("ul").eq(0), h = o.html();
                o.addClass("jstree-wholerow-real");
                if(this.data.wholerow.last_html !== h) {
                    this.data.wholerow.last_html = h;
                    this.get_container().children(".jstree-wholerow").remove();
                    this.get_container().append(
                        o.clone().removeClass("jstree-wholerow-real")
                            .wrapAll("<div class='jstree-wholerow' />").parent()
                            .width(o.parent()[0].scrollWidth)
                            .css("top", (o.height() + ( is_ie7 ? 5 : 0)) * -1 )
                            .find("li[id]").each(function () { this.removeAttribute("id"); }).end()
                    );
                }
            }
        }
    });
    $(function() {
        var css_string = '' +
            '.jstree .jstree-wholerow-real { position:relative; z-index:1; } ' +
            '.jstree .jstree-wholerow-real li { cursor:pointer; } ' +
            '.jstree .jstree-wholerow-real a { border-left-color:transparent !important; border-right-color:transparent !important; } ' +
            '.jstree .jstree-wholerow { position:relative; z-index:0; height:0; } ' +
            '.jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { width:100%; } ' +
            '.jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li, .jstree .jstree-wholerow a { margin:0 !important; padding:0 !important; } ' +
            '.jstree .jstree-wholerow, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow li { background:transparent !important; }' +
            '.jstree .jstree-wholerow ins, .jstree .jstree-wholerow span, .jstree .jstree-wholerow input { display:none !important; }' +
            '.jstree .jstree-wholerow a, .jstree .jstree-wholerow a:hover { text-indent:-9999px; !important; width:100%; padding:0 !important; border-right-width:0px !important; border-left-width:0px !important; } ' +
            '.jstree .jstree-wholerow-span { position:absolute; left:0; margin:0px; padding:0; height:18px; border-width:0; padding:0; z-index:0; }';
        if(is_ff2) {
            css_string += '' +
                '.jstree .jstree-wholerow a { display:block; height:18px; margin:0; padding:0; border:0; } ' +
                '.jstree .jstree-wholerow-real a { border-color:transparent !important; } ';
        }
        if(is_ie7 || is_ie6) {
            css_string += '' +
                '.jstree .jstree-wholerow, .jstree .jstree-wholerow li, .jstree .jstree-wholerow ul, .jstree .jstree-wholerow a { margin:0; padding:0; line-height:18px; } ' +
                '.jstree .jstree-wholerow a { display:block; height:18px; line-height:18px; overflow:hidden; } ';
        }
        $.vakata.css.add_sheet({ str : css_string, title : "jstree" });
    });
})(jQuery);
//*/

/*
* jsTree model plugin
* This plugin gets jstree to use a class model to retrieve data, creating great dynamism
*/
(function ($) {
    var nodeInterface = ["getChildren","getChildrenCount","getAttr","getName","getProps"],
        validateInterface = function(obj, inter) {
            var valid = true;
            obj = obj || {};
            inter = [].concat(inter);
            $.each(inter, function (i, v) {
                if(!$.isFunction(obj[v])) { valid = false; return false; }
            });
            return valid;
        };
    $.jstree.plugin("model", {
        __init : function () {
            if(!this.data.json_data) { throw "jsTree model: jsTree json_data plugin not included."; }
            this._get_settings().json_data.data = function (n, b) {
                var obj = (n == -1) ? this._get_settings().model.object : n.data("jstree_model");
                if(!validateInterface(obj, nodeInterface)) { return b.call(null, false); }
                if(this._get_settings().model.async) {
                    obj.getChildren($.proxy(function (data) {
                        this.model_done(data, b);
                    }, this));
                }
                else {
                    this.model_done(obj.getChildren(), b);
                }
            };
        },
        defaults : {
            object : false,
            id_prefix : false,
            async : false
        },
        _fn : {
            model_done : function (data, callback) {
                var ret = [],
                    s = this._get_settings(),
                    _this = this;

                if(!$.isArray(data)) { data = [data]; }
                $.each(data, function (i, nd) {
                    var r = nd.getProps() || {};
                    r.attr = nd.getAttr() || {};
                    if(nd.getChildrenCount()) { r.state = "closed"; }
                    r.data = nd.getName();
                    if(!$.isArray(r.data)) { r.data = [r.data]; }
                    if(_this.data.types && $.isFunction(nd.getType)) {
                        r.attr[s.types.type_attr] = nd.getType();
                    }
                    if(r.attr.id && s.model.id_prefix) { r.attr.id = s.model.id_prefix + r.attr.id; }
                    if(!r.metadata) { r.metadata = { }; }
                    r.metadata.jstree_model = nd;
                    ret.push(r);
                });
                callback.call(null, ret);
            }
        }
    });
})(jQuery);
//*/

})();

// dummy console
(function (con) {
    var methods, dummy, func;
    methods = [
        "assert", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed",
        "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"];
    dummy = function () {};
    do {
        func = methods.pop();
        if (!con[func]) {
            con[func] = dummy;
        }
    } while (methods.length > 0);
    window.console = con;
} (window.console || {}));
(function ($, window, document, undefined) {

    var rdy = new $.Deferred(), giscloud, common, initEasyXdm, xdmready = new $.Deferred(), rpc, apiKey;

    // resolve rdy on DOM ready
    $(function () {
        try {
            if (giscloud.oauth2 && !giscloud.oauth2.thisIsOauthFrame()) {
                rdy.resolveWith(giscloud, [giscloud]);
            }
        } catch (err) {
            console.log(err);
        }
    });

    /*
     * Namespace: giscloud
     * This is the global namespace for the GIS Cloud javascript API.
     */
    giscloud = {

        /*
         * Method: exposeJQuery
         * Exposes an instance of jQuery used internally by GIS Cloud javascript API.
         *
         */
        exposeJQuery: function () {
            return $;
        },

        /*
         * Method: ready
         * The callback function passed to the ready method is executed once the DOM has finished loading.
         */
        ready: function (callback) {
            if (arguments.length === 0) {
                return rdy.promise();
            }
            if (typeof callback === "function") {
                rdy.done(callback);
            }
            return this;
        },

        /*
         * Method: includeCss
         * Dynamically loads a CSS stylesheet file and applies it to the page. Note that FF and Chrome don't support
         * the success callback invocation.
         */
        includeCss: function (src, callback) {
            var deferred = new $.Deferred(),
                h = window.document.getElementsByTagName("head")[0],
                css = document.createElement("link"),
                done = function () {
                    if (typeof callback === "function" && deferred.state() === "pending") {
                        callback();
                    }
                    deferred.resolve();
                };

            src += (src.indexOf("?") > -1 ? "&" : "?") + "_nch=" + giscloud_config.nch;

            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("href", src);

            css.onreadystatechange = function () {
                if (css.readyState === "complete" || css.readyState === "loaded") {
                    done();
                }
            };

            if (css.addEventListener) {
                css.addEventListener("load", function () {
                    done();
                }, false);
            }

            css.onload = function () {
                done();
            };

            h.appendChild(css);

            return deferred.promise();
        },

        /*
         * Method: includeJs
         * Dynamically loads and evaluates a javascript file.
         */
        includeJs: function (src, callback) {
            var deferred = new $.Deferred(),
                h = document.getElementsByTagName("head")[0],
                js = document.createElement("script"),
                done = function () {
                    if (typeof callback === "function" && deferred.state() === "pending") {
                        callback();
                    }
                    deferred.resolve();
                };

            src += (src.indexOf("?") > -1 ? "&" : "?") + "_nch=" + giscloud_config.nch;

            js.setAttribute("type", "text/javascript");
            js.setAttribute("src", src);


            js.onreadystatechange = function () {
                if (js.readyState === "complete" || js.readyState === "loaded") {
                    done();
                }
            };
            if (js.addEventListener) {
                js.addEventListener("load", function () {
                    done();
                }, false);
            }
            js.onload = function () {
                done();
            };

            h.appendChild(js);

            return deferred.promise();
        },

        formats: {
            IFRAME: "iframe",
            HTML: "iframe",
            PNG: "png",
            JPEG: "jpg",
            SHAPEFILE: "shp",
            GPX: "gpx",
            MIF: "mif",
            GML: "gml",
            exportFormats: {
                SHAPEFILE: "shp",
                GPX: "gpx",
                MIF: "mif",
                GML: "gml"
            },
            renderFormats: {
                IFRAME: "iframe",
                PNG: "png",
                JPEG: "jpg"
            }
        },

        apiKey: function (key) {
            if (typeof key == "string") {
                apiKey = key;
                return this;
            } else {
                return apiKey;
            }
        },

        logDeferredResults: function (action, params, context, saveTo) {
            var res,
                doneFunc = function () { console.log("DONE", arguments); },
                failFunc = function () { console.log("FAIL", arguments); },
                progressFunc = function () { console.log("PROGRESS", arguments); };

            try {
                // if the action is a deferred
                if ($.isFunction(action.done) && $.isFunction(action.fail)) {
                    // handle the two argument overload: logDeferredResults(deferred, saveTo)
                    if (params != null && context == null && saveTo == null) {
                        saveTo = params;
                        params = null;
                    }
                    res = action;
                } else {
                    if (context === undefined) {
                        context = window;
                    }
                    if (params == null) {
                        params = [];
                    }
                    else if (!$.isArray(params)) {
                        params = [params];
                    }

                    // try to exec action
                    res = action.apply(context, params);
                }

                if ($.isFunction(res.done) && $.isFunction(res.fail)) {
                    // hook up done, fail and progress logging functions
                    res.done(doneFunc);
                    res.fail(failFunc);
                    res.progress(progressFunc);
                    // optionally save result to a variable
                    if (saveTo) {
                        res.done(function (obj) {
                            if (typeof saveTo == "string") {
                                window[saveTo] = obj;
                            } else {
                                saveTo = obj;
                            }
                        });
                    }
                } else {
                    console.log("NOT DEFERRED", res);
                }
            } catch (exc) {
                console.log("ERROR", exc, action, params, context);
            }
        },

        common: function () {
            return common;
        }
    };

    initEasyXdm = function () {
        var init;
        if (xdmready.state() === "pending") {
            // init function
            init = function () {
                var url = common.restHost() + "/assets/api/1/gcremote.php?restUrl=" + common.restHost() + "/1/"; //common.rest.url();
                // create new RPC
                rpc = new easyXDM.Rpc({

                    // url of the remote end
                    remote: url,
                    // executed once the channel setup is complete
                    onReady: function () {
                        // xdm rpc is ready for use
                        xdmready.resolve(arguments);
                    }

                }, {

                    // remote method stubs
                    remote: {
                        ping: {},
                        execute: {},
                        getJSON: {},
                        rest: {},
                        restGet: {},
                        restPost: {},
                        restPut: {},
                        restDelete: {}
                    },

                    // local methods
                    local: {
                        restUrl: function() {
                                return common.rest.url();
                        },

                        pingback: function (origin, pingOrigin, time, pingTime) {
                            console.log(JSON.stringify({
                                pingOrigin: pingOrigin,
                                pingTime: pingTime,
                                pingbackOrigin: origin,
                                pingbackTime: time,
                                duration: time - pingTime
                            }));
                        }
                    }
                });
            };

            if (typeof JSON !== "undefined") {
                // json present, just run init
                init();
            } else {
                // load json lib if not native in the browser before init
                giscloud.includeJs(common.apiHost() + "/libs/json2/json2.min.js").done(init);
            }
        }

        // return deferred
        return xdmready.promise();
    };

    giscloud.pingRpc = function () {
        initEasyXdm().done(function () {
            rpc.ping(document.location, $.now());
        });
    };

    giscloud.remoteGetJSON = function (url, params) {
        var action, deferred;

        deferred = new $.Deferred();

        action = function () {
            rpc.getJSON(url, params, deferred.resolve, deferred.reject);
        };

        if (!!rpc) {
            action();
        } else {
            initEasyXdm().done(action);
        }
        return deferred.promise();
    };

    giscloud.sessid = function () {
        var cookie = document.cookie,
            m = cookie && cookie.match && cookie.match(/PHPSESSID=([^ ;]+)/);
        return m && m[1] || null;
    };

    giscloud.construct = function (cons, higher) {
        var proto = {};

        if (higher) {
            if ($.isArray(higher)) {
                $.each(higher, function (i, item) {
                    $.extend(proto, item);
                });
            } else {
                $.extend(proto, higher);
            }
        }
        proto.higher = proto;
        cons.prototype = proto;

        return cons;
    };

    common = {

        restHost : function () { return giscloud_config.restHost(); },
        apiHost : function () { return giscloud_config.apiHost(); },
        apiHostname : function () { return giscloud_config.apiHostname(); },
        authHost : function () { return giscloud_config.authHost(); },
        liveSite : function () { return giscloud_config.liveSite(); },
        appSite : function () { return giscloud_config.appSite(); },

        isMobileBrowser: /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
                        .test(navigator.userAgent) ||
                        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i
                        .test(navigator.userAgent.substr(0, 4)),

        clone: function (obj) {
            var F = function () { };
            $.extend(true, F.prototype, obj);
            return new F();
        },

        oid: function () {
            var mr = Math.random,
                mc = Math.ceil,
                r = ($.now().toString() + mc(mr() * 100000)).substr(3),
                c = mc(mr() * 15);
            return r.substr(c) + r.substr(0, c);
        },

        setError: function (that, src, msg) {
            if (that.errors === undefined) {
                that.errors = [];
            }

            that.errors.push({
                time: new Date(),
                src: src,
                msg: msg
            });
        },

        highlight: function (fn, fid, lid, clear) {
            fn.modifyObject(fid.toString(), {
                "color": 0xFFBF00,
                "alpha": 100,
                "from_color": 0xcccccc,
                "glow": {
                    "color": 0x00ff00,
                    "strength": 2,
                    "blurX": 10,
                    "blurY": 10
                }
            }, lid === null ? "" : ("layer" + lid + "||"), clear);
        },

        highlightMultiple: function (fn, fids, lid, clear) {
            fn.modifyObject(fids.join(), {
                "color": 0xFFBF00,
                "alpha": 100,
                "from_color": 0xcccccc,
                "glow": {
                    "color": 0x00ff00,
                    "strength": 2,
                    "blurX": 10,
                    "blurY": 10
                }
            }, lid === null ? "" : ("layer" + lid + "||"), clear);
        },

        getHighlightAndSelectColors: function (baseColorString) {
            var baseCol, hHighlight, hSelect, s, v;

            if (baseColorString && baseColorString.length) {
                // get base color hsv array from hex input
                baseCol = giscloud.Color.fromString(baseColorString);
                hsv = baseCol && baseCol.hsv(true);
                if (hsv && hsv.length) {
                    // get saturation - handle grays differently from colours
                    s = hsv[1];
                    v = hsv[2];
                    if (s < 15) {
                        // max saturation
                        s = 100;
                        // set the highlight hue to a predefined value
                        hHighlight = 180; // cyan
                        // shift hue around orange relative to value
                        hSelect = Math.ceil(v / 2 - 10);
                        // max value
                        v = 100;
                    } else {
                        // shift hue clockwise for highlight
                        hHighlight = hsv[0] + 120;
                        // shift hue counterclockwise for select
                        hSelect = hsv[0] - 120;
                        // raise the V component two thirds to full (100)
                        v += (100 - v) * 2 / 3;
                        v = Math.ceil(v);
                    }

                    // return two new colors as hex strings
                    return [
                        giscloud.Color.fromHsv(hHighlight, s, v).hex(),
                        giscloud.Color.fromHsv(hSelect, s, v).hex()
                    ];
                }
            }

            // return null if steps were not completed successfully
            return null;
        },

        deferreds: {},

        refs: {},

        toXml: function (root, data) {
            var xml = "", i, k, rootname;
            if (data === null || data === undefined || data === "") {
                return "<" + root + "/>";
            } else if (typeof data === "object") {
                 xml += "<" + root + ">";
                 if ($.isArray(data)) {
                    if (root[root.length - 1] === "s") {
                        rootname = root.substr(0, root.length - 1);
                    } else {
                        rootname = root;
                    }
                    for (i = 0, k = data.length; i < k; i++) {
                        xml += this.toXml(rootname, data[i]);
                    }
                 } else {
                     for (i in data) {
                         if (data.hasOwnProperty(i)) {
                            xml += this.toXml(i, data[i]);
                        }
                     }
                 }
                 xml += "</" + root + ">";
            } else {
                xml += "<" + root + ">" + data.toString() + "</" + root + ">";
            }
            return xml;
        },

        rest: (function () {
            var processParams = function (p) {
                var params = p || {};

                // sorting and pagination
                if (params.sort) {
                    if (typeof params.sort === "string" || params.sort.length === undefined) {
                        params.order_by = params.sort;
                    } else {
                        params.order_by = params.sort.join();
                    }
                    delete params.sort;
                }
                if (params.page || params.perPage) {
                    params.page = params.page || 1;
                    params.perpage = params.perPage || 10;
                    delete params.perPage;
                }

                // filtering
                if (params.field && params.field.length && params.value && params.value.length) {
                    params.where = params.field + "='" + params.value + "'";
                    delete params.field;
                    delete params.value;
                }

                return params;
            },

            isLocal = function (forceSecure) {
                var loc = document.location,
                    current = loc.protocol + "//" + loc.host;

                if (giscloud.forceLocal) {
                    return true;
                }

                if (forceSecure && loc.protocol !== "https:")
                {
                    return false;
                }

                // report local also if used on a GC app site
                return common.liveSite().indexOf(current) === 0 || common.restHost().indexOf(current) === 0;
            };

            this.url = function (path) {
                var loc = document.location,
                    current = loc.protocol + "//" + loc.host,
                    baseUrl = common.liveSite().indexOf(current) === 0 ? // if you're on the GC app site
                        common.liveSite() + "rest/1/" :
                        common.restHost() + "/1/";

                if (typeof path === "string") {
                    return baseUrl + path;
                } else {
                    return baseUrl;
                }
            };

            this.local = function (method, format, path, params, forceSecure) {
                var resp, url;

                url = this.url(path);
                resp = new $.Deferred();

                if (forceSecure && url.indexOf("https:") !== 0) {
                    url = url.replace("http:", "https:");
                    if (url.indexOf("?") > -1) {
                        url += "&api_sessid=" + giscloud.sessid();
                    }
                }

                if (method === "get" || method === "GET") {
                    $.ajax({
                        url: url,
                        type: "GET",
                        cache: false,
                        dataType: "json",
                        data: params
                    })
                    .done(function () {
                        var args = Array.prototype.slice.apply(arguments);
                        resp.resolve.apply(resp, args);
                    })
                    .fail(function () {
                        var args = Array.prototype.slice.apply(arguments);
                        resp.reject.apply(resp, args);
                    });
                } else {
                    if (format === "application/json" && $.isPlainObject(params)) {
                        params = JSON.stringify(params);
                    }
                    $.ajax({
                        url: url,
                        type: method,
                        cache: false,
                        dataType: "json",
                        accept : "application/json",
                        contentType: format || "application/x-www-form-urlencoded",
                        data: params
                    })
                    .success(function (data, status, jqxhr) {
                        resp.resolve(data, jqxhr.getResponseHeader("Location"));
                    })
                    .error(function (jqxhr, status, errThrown) {
                        var m, xmlCode, xmlMessage;
                        if (jqxhr.responseText) {
                            m = jqxhr.responseText.match(/<code>(.*)<\/code><msg>(.*)<\/msg>/i);
                            xmlCode = m && m[1];
                            xmlMessage = m && m[2];
                        }
                        resp.reject(jqxhr.status, status, errThrown, xmlCode, xmlMessage);
                    });
                }
                return resp.promise();
            };

            this.call = function (method, path, params, format, forceSecure) {
                var action, deferred, token, apiKey, sessid;

                params = processParams(params);

                // oauth token
                token = giscloud.oauth2.token();
                if (token) {
                    params.oauth_token = token;
                }

                // api key
                apiKey = giscloud.apiKey();
                if (apiKey) {
                    params.api_key = apiKey;
                }

                // check if local
                if (isLocal(forceSecure)) {
                    return this.local(method, format, path, params, forceSecure);
                }

                if (!apiKey && !token && forceSecure) {
                    sessid = giscloud.sessid();
                    if (sessid) {
                        path += (path.indexOf("?") === -1 ? "?" : "&") +
                                "api_sessid=" + sessid;
                    }
                }

                // create deferred for this call
                deferred = new $.Deferred();

                // define action
                action = function () {
                    rpc.rest(method, format, path, params, token, apiKey,
                        function (args) {
                            deferred.resolve.apply(deferred, args);
                        },
                        function(){
                            deferred.reject.apply(deferred, arguments && arguments[0] && arguments[0].message);
                        });
                };
                // set action to execute once the xdm rpc is ready
                if (!!rpc) {
                    action();
                } else {
                    initEasyXdm().done(action);
                }
                return deferred.promise();
            };

            this.get = function (path, params) {
                var action, deferred, token;

                params = processParams(params);

                // oauth token
                token = giscloud.oauth2.token();
                if (token) {
                    params.oauth_token = token;
                }

                // api key
                apiKey = giscloud.apiKey();
                if (apiKey) {
                    params.api_key = apiKey;
                }

                // check if local
                if (isLocal()) {
                    return this.local("GET", null, path, params);
                }

                deferred = new $.Deferred();

                action = function () {
                    rpc.restGet(path, params, deferred.resolve, deferred.reject);
                };

                if (!!rpc) {
                    action();
                } else {
                    initEasyXdm().done(action);
                }
                return deferred.promise();
            };

            return this;
        }.apply({}))
    };

    // jquery busy default settings
    if ($.fn.busy) {
        $().busy("defaults", { img: common.apiHost() + "/assets/api/1/images/busy.gif" });
    }

    window.giscloud = giscloud;

    // just for debugging
    window.out = function () { console.log(arguments); };

})(jQuery.noConflict(true), window, window.document);

/*global giscloud, L */
fnCanvas2 = function (fn) {
    "use strict";

    var $ = giscloud.exposeJQuery(),
        shapes = [],
        shapesCount = 0,
        eventAnchor = { handlers: [] },
        drawing;

     /*
     |    Util functions
    */

    function getNrFromId(markerId) {
        return typeof markerId == "string" &&
               parseInt(markerId.replace(/s(\d+)/, "$1"), 10);
    }

    function getIdFromNr(nr) {
        return "s" + nr;
    }

    function colorFromInt(col) {
        if (col != null) {
            return giscloud.Color.fromHex(col).hex();
        }
        return null;
    }

    function ReservedShape(id) {
        this.id = id;
        this.attributes = {};
        this.removed = false;
        this.clear = function () {
            this.removed = true;
        };

        this.wkt = function () {
            return drawing.currentShapeGeometry(true);
        };

        this.edit = function () {};
    }

    function reserveShapeSlot() {
        var index = shapes.length;
        shapes.push(new ReservedShape(getIdFromNr(index)));
        shapesCount++;
        return index;
    }

    function unreserveShapeSlot(shapeIndex) {
        var shape = shapes[shapeIndex], attr;
        if (shape instanceof ReservedShape) {
            shapes.splice(shapeIndex, 1);
            shapesCount--;
        }
        attr = shape.attributes;
        return attr;
    }

    function toLeafletCoords(geom) {
        var i, val;
                                 // type:
        val = geom.geometries || //   geometry collection
              geom.polygons ||   //   multipolygon
              geom.rings ||      //   polygon
              geom.lines ||      //   multiline
              geom.points ||     //   line or multipoint
              null;              //   point

        if (val === null) {
            val = fn.toLeafletCoords(geom.x, geom.y, geom.z);
            geom.x = val.lng;
            geom.y = val.lat;
        } else {
            for (i in val) {
                if (val.hasOwnProperty(i)) {
                    toLeafletCoords(val[i]);
                }
            }
        }
    }

    function extractLeafletPoints(geom) {
        var i, val, arr;
                                 // type:
        val = geom.geometries || //   geometry collection
              geom.polygons ||   //   multipolygon
              geom.rings ||      //   polygon
              geom.lines ||      //   multiline
              geom.points ||     //   line or multipoint
              null;              //   point

        if (val === null) {
            return fn.toLeafletCoords(geom.x, geom.y, geom.z);
        }

        arr = [];
        for (i in val) {
            if (val.hasOwnProperty(i)) {
                arr.push(extractLeafletPoints(val[i]));
            }
        }

        return arr;
    }

    function toLeafletGeometry(geom, opts) {
        var leafletStructure = extractLeafletPoints(geom);

        if (geom instanceof giscloud.geometry.Multipolygon) {
            return new L.MultiPolygon(leafletStructure, opts);
        } else if (geom instanceof giscloud.geometry.Polygon) {
            return new L.Polygon(leafletStructure, opts);
        } else if (geom instanceof giscloud.geometry.Multiline) {
            return new L.MultiPolyline(leafletStructure, opts);
        } else if (geom instanceof giscloud.geometry.Line) {
            return new L.Polyline(leafletStructure, opts);
        }  else {

            opts = opts || {};
            opts.icon = opts.icon || (new L.Handler.PolyEdit()).options.icon;
            opts.draggable = opts.draggable || false;

            if (geom instanceof giscloud.geometry.Multipoint) {
                return new L.FeatureGroup(
                    $.map(
                        leafletStructure,
                        function (p) {
                            return new L.Marker(p, opts);
                        }),
                    opts
                );
            }  else if (geom instanceof giscloud.geometry.Point) {
                return new L.Marker(leafletStructure, opts);
            } else {
                return null;
            }
        }
    }

    function fromLeafletGeometry(geom, forceZ) {
        var arr, pnt;
        if ($.isArray(geom)) {
            return $.map(geom, function (g) { return [fromLeafletGeometry(g, forceZ)]; });
        } else if (geom instanceof L.LatLng) {
            pnt = fn.fromLeafletCoords(geom);
            if (forceZ) {
                pnt.z = pnt.z || 0;
            }
            return pnt;
        } else if (geom instanceof L.Marker) {
            return fn.fromLeafletCoords(geom.getLatLng());
        } else if (geom instanceof L.Polygon) {
            arr = geom.getLatLngs();
            if ($.isArray(arr[0])) {
                return new giscloud.geometry.Polygon(
                    $.map(
                        arr,
                        function (latlngs) {
                            return new giscloud.geometry.Line(
                                $.map(latlngs, function (latlng) { return fromLeafletGeometry(latlng, forceZ); }));
                        }
                    )
                );
            }
            return new giscloud.geometry.Polygon([new giscloud.geometry.Line(
                $.map(arr, function (latlng) { return fromLeafletGeometry(latlng, forceZ); })
            )]);
        } else if (geom instanceof L.MultiPolygon) {
            return new giscloud.geometry.Multipolygon(
                $.map(geom._layers, function (l) { return fromLeafletGeometry(l, forceZ); })
            );
        } else if (geom instanceof L.Polyline) {
            return new giscloud.geometry.Line(
                $.map(geom.getLatLngs(), function (latlng) { return fromLeafletGeometry(latlng, forceZ); })
            );
        } else if (geom instanceof L.MultiPolyline) {
            return new giscloud.geometry.Multiline(
                $.map(geom._layers, function (l) { return fromLeafletGeometry(l, forceZ); })
            );
        } else if (geom instanceof L.FeatureGroup) {
            return new giscloud.geometry.GeometryCollection(
                $.map(geom._layers, fromLeafletGeometry)
            );
        } else {
            return null;
        }
    }

    function drawLine(shape, line) {
        var k = line && line.points && line.points.length;

        if (shape != null && k) {
            shape.points = $.map(line.points, function (point) {
                return fn.toLeafletCoords(point.x, point.y, point.z);
            });
            shape.draw();
        }
    }

    function getGeometry(type, points, wkt) {
        var geom, p;

        if (points.length) {
            switch (type) {
            case "point":
                p = fn.fromLeafletCoords(points[0]);
                geom = new giscloud.geometry.Point(p.x, p.y);
                break;
            case "line":
                p = $.map(points, function (latlng) {
                    var p = fn.fromLeafletCoords(latlng);
                    return new giscloud.geometry.Point(p.x, p.y);
                });
                geom = new giscloud.geometry.Line(p);
                break;
            case "polygon":
                p = $.map(points, function (latlng) {
                    var p = fn.fromLeafletCoords(latlng);
                    return new giscloud.geometry.Point(p.x, p.y);
                });
                geom = new giscloud.geometry.Polygon([new giscloud.geometry.Line(p)]);
                break;
            }
        }

        if (!geom) {
            return null;
        }

        return wkt ? geom.toOGC() : geom;
    }

     /*
     |   Shape constructors
    */

    function PointShape(id, opts) {
        this.id = id;
        this.color = colorFromInt(opts.color) || "#ff0088";
        this.alpha = (opts.alpha != null) ? opts.alpha : 1.0;
        this.width = (opts.width != null) ? opts.width : 10;
        this.cursor = null;
        this.marker = null;

        if (this.alpha > 1) {
            this.alpha = this.alpha / 100;
        }
    }

    PointShape.prototype = {
        draw: function () {
            this.marker = new L.Marker(
                this.cursor,
                {
                    // icon: L.Handler.PolyEdit.options.icon,  // uncomment this once Leaflet has been added to the normal loading procedure
                    icon: (new L.Handler.PolyEdit()).options.icon,
                    draggable: false
                }
            );
            this.marker.on("dragend", $.proxy(function () {
                this.cursor = this.marker.getLatLng();
            }, this));
            fn.exposeLeaflet().addLayer(this.marker);
        },

        clear: function () {
            fn.exposeLeaflet().removeLayer(this.marker);
            this.marker = null;
            this.cursor = null;
        },

        edit: function (turnOff) {
            if (turnOff === false) {
                this.marker.dragging.disable();
            } else {
                this.marker.dragging.enable();
            }
        },

        geom: function () {
            var latlng = this.cursor, geom;
            if (latlng) {
                geom = fromLeafletGeometry(latlng, this.hasZ);
                return geom;
            }
            return null;
        },

        wkt: function () {
            var latlng = this.cursor, geom;
            if (latlng) {
                geom = fromLeafletGeometry(latlng, this.hasZ);
                return geom ? geom.toOGC() : "";
            }
            return null;
        },

        redraw: function () {
            var cursor = this.cursor;
            this.clear();
            this.cursor = cursor;
            this.draw();
        }
    };

    function LineShape(id, opts) {
        this.id = id;
        this.color = colorFromInt(opts.color) || "#ff0088";
        this.alpha = (opts.alpha != null) ? opts.alpha : 1.0;
        this.width = (opts.width != null) ? opts.width : 1.0;
        this.cursor = null;
        this.lines = [];
        this.points = [];

        if (this.alpha > 1) {
            this.alpha = this.alpha / 100;
        }
    }

    LineShape.prototype = {
        currentLine: function () {
            return this.lines[this.lines.length - 1];
        },

        draw: function () {
            var line = new L.Polyline(
                this.points,
                {
                    color: this.color,
                    opacity: this.alpha,
                    width: this.width
                }
            );
            this.lines.push(line);
            fn.exposeLeaflet().addLayer(line);
        },

        addLine: function () {
            var line = new L.Polyline(
                [this.cursor],
                {
                    color: this.color,
                    opacity: this.alpha,
                    width: this.width
                }
            );
            this.lines.push(line);
            fn.exposeLeaflet().addLayer(line);
        },

        extendLine: function () {
            var line = this.currentLine();
            if (line) {
                line.addLatLng(this.cursor);
            }
        },

        edit: function (turnOff) {
            var line = this.currentLine();
            if (line) {
                if (turnOff === false) {
                    line.editing.disable();
                } else {
                    line.editing.enable();
                }
            }
        },

        geom: function () {
            var line = this.currentLine(), geom;
            if (line) {
                geom = fromLeafletGeometry(line, this.hasZ);
                return geom;
            }
            return null;
        },

        wkt: function () {
            var line = this.currentLine(), geom;
            if (line) {
                geom = fromLeafletGeometry(line, this.hasZ);
                return geom ? geom.toOGC() : "";
            }
            return null;
        },

        redraw: function () {
            var oldLine = this.currentLine(),
                newLine = new L.Polyline(
                    oldLine.getLatLngs(),
                    {
                        color: this.color,
                        opacity: this.alpha,
                        width: this.width
                    }
                );
            this.clear();
            this.lines.push(newLine);
            fn.exposeLeaflet().addLayer(newLine);
        },

        clear: function () {
            var i, l;
            for (i = 0, l = this.lines.length; i < l; i++) {
                fn.exposeLeaflet().removeLayer(this.lines[i]);
                this.lines[i] = null;
            }
            this.lines = [];
            this.cursor = null;
        }
    };

    function PolygonShape(id, opts) {
        this.id = id;
        this.color = colorFromInt(opts.color) || "#ff0088";
        this.alpha = (opts.alpha != null) ? opts.alpha : 1.0;
        this.width = (opts.width != null) ? opts.width : 1.0;
        this.ring = null;
        this.polygon = null;

        if (this.alpha > 1) {
            this.alpha = this.alpha / 100;
        }
    }

    PolygonShape.prototype = {
        draw: function () {
            this.polygon = new L.Polygon(
                this.ring,
                {
                    color: this.color,
                    opacity: this.alpha,
                    width: this.width
                }
            );
            fn.exposeLeaflet().addLayer(this.polygon);
        },

        clear: function () {
            fn.exposeLeaflet().removeLayer(this.polygon);
            this.polygon = null;
            this.ring = null;
        },

        edit: function (turnOff) {
            if (this.polygon) {
                if (turnOff === false) {
                    this.polygon.editing.disable();
                } else {
                    this.polygon.editing.enable();
                }
            }
        },

        geom: function () {
            var ring = this.ring, geom;
            if (ring) {
                // convert leaflet polygon to giscloud geometry
                geom = fromLeafletGeometry(this.polygon, this.hasZ);
                return geom;
            }
            return null;
        },

        wkt: function () {
            var ring = this.ring, geom;
            if (ring) {
                // convert leaflet polygon to giscloud geometry
                geom = fromLeafletGeometry(this.polygon, this.hasZ);
                return geom ? geom.toOGC() : "";
            }
            return null;
        },

        redraw: function () {
            var ring = this.ring;
            this.clear();
            this.ring = ring;
            this.draw();
        }

    };

    function MultiShape(id, opts) {
        this.id = id;
        this.color = colorFromInt(opts.color) || "#ff0088";
        this.alpha = (opts.alpha != null) ? opts.alpha : 1.0;
        this.width = (opts.width != null) ? opts.width : 1.0;
        this.shapes = null;
        this.featureGroup = null;
        this.type = "multi";

        if (this.alpha > 1) {
            this.alpha = this.alpha / 100;
        }
    }

    MultiShape.prototype = {
        draw: function () {
            this.featureGroup = new L.FeatureGroup(
                this.shapes,
                {
                    color: this.color,
                    opacity: this.alpha,
                    width: this.width
                }
            );
            fn.exposeLeaflet().addLayer(this.featureGroup);
        },

        clear: function () {
            fn.exposeLeaflet().removeLayer(this.featureGroup);
            this.shapes = null;
            this.featureGroup = null;
        },

        edit: function (turnOff) {
            var funcEdit;

            if (this.shapes) {
                if (turnOff === false) {
                    funcEdit = function (i, shape) {
                        if (shape.editing) {
                            shape.editing.disable();
                        } else if (shape.dragging) {
                            shape.dragging.disable();
                        } else if (shape._layers) {
                            $.each(shape._layers, funcEdit);
                        }
                    };
                } else {
                    funcEdit = function (i, shape) {
                        if (shape.editing) {
                            shape.editing.enable();
                        } else if (shape.dragging) {
                            shape.dragging.enable();
                        } else if (shape._layers) {
                            $.each(shape._layers, funcEdit);
                        }
                    };
                }
                $.each(this.shapes, funcEdit);
            }
        },

        redraw: function () {
            var shapes = this.shapes;
            this.clear();
            this.shapes = shapes;
            this.draw();
        },

        geom: function () {
            var geom = fromLeafletGeometry(this.shapes, this.hasZ);

            if (!geom) {
                return null;
            } else if (
                geom instanceof giscloud.geometry.Multipoint ||
                geom instanceof giscloud.geometry.Multiline ||
                geom instanceof giscloud.geometry.Multipolygon
            ) {
                return geom;
            } else if (
                geom.length === 1 &&
                geom[0] instanceof giscloud.geometry.Multipoint ||
                geom[0] instanceof giscloud.geometry.Multiline ||
                geom[0] instanceof giscloud.geometry.Multipolygon
            ) {
                return geom[0];
            }

            switch (this.type) {
                case "point":
                    return new giscloud.geometry.Multipoint(geom);
                case "line":
                    return new giscloud.geometry.Multiline(geom);
                case "polygon":
                    return new giscloud.geometry.Multipolygon(geom);
                default:
                    return new giscloud.geometry.GeometryCollection(geom);
            }
        },

        wkt: function () {
            var geom = fromLeafletGeometry(this.shapes, this.hasZ);

            if (!geom) {
                return null;
            } else if (
                geom instanceof giscloud.geometry.Multipoint ||
                geom instanceof giscloud.geometry.Multiline ||
                geom instanceof giscloud.geometry.Multipolygon
            ) {
                return geom.toOGC();
            } else if (
                geom.length === 1 &&
                geom[0] instanceof giscloud.geometry.Multipoint ||
                geom[0] instanceof giscloud.geometry.Multiline ||
                geom[0] instanceof giscloud.geometry.Multipolygon
            ) {
                return geom[0].toOGC();
            }

            switch (this.type) {
                case "point":
                    return new giscloud.geometry.Multipoint(geom).toOGC();
                case "line":
                    return new giscloud.geometry.Multiline(geom).toOGC();
                case "polygon":
                    return new giscloud.geometry.Multipolygon(geom).toOGC();
                default:
                    return new giscloud.geometry.GeometryCollection(geom).toOGC();
            }
        }

    };

     /*
     |   DRAWING static class
    */

    drawing = (function (viewer) {

        var currentShape, unfinishedShape, dfrd,
            //markerIcon = L.Handler.PolyEdit.options.icon,  // uncomment this once Leaflet has been added to the normal loading procedure
            markerIcon = (new L.Handler.PolyEdit()).options.icon,
            points = [], markers = [],
            currentlyDrawing = false;

        function placeMarker(latlng) {
            var marker = new L.Marker(latlng, { icon: markerIcon }); //L.Handler.PolyEdit.options.icon });
            viewer.addLayer(marker);
            markers.push(marker);
        }

        function finishShape() {
            // remove event handler
            if (currentlyDrawing === "line") {
                markers[markers.length - 1].off("click", finishShape);
            } else if (currentlyDrawing === "polygon") {
                markers[0].off("click", finishShape);
            }

            drawing.end();
        }

        function addPoint(evt) {
            var len = markers.length;

            // add a new point
            points.push(evt.latlng);

            // put a point marker on the map
            placeMarker(evt.latlng);

            // decide what to do next
            if (currentlyDrawing === "point") {
                drawing.end();
                return;
            } else if (currentlyDrawing === "line") {
                // the last marker is the one which accepts a click to end drawing
                if (len > 0) {
                    markers[len - 1].off("click", finishShape);
                }
                markers[len].on("click", finishShape);
                // minimum of two points to draw a line
                if (points.length >= 2) {
                    if (currentShape) {
                        viewer.removeLayer(currentShape);
                    }
                    currentShape = new L.Polyline(points);
                    viewer.addLayer(currentShape);
                }
                // remove old stretchy line
                if (unfinishedShape) {
                    viewer.removeLayer(unfinishedShape);
                    unfinishedShape = null;
                }
            } else if (currentlyDrawing === "polygon") {
                // if this is the first point, add a click handler
                if (len === 0) {
                    markers[0].on("click", finishShape);
                }
                // minimum of three points to draw a polygon
                if (points.length >= 3) {
                    if (currentShape) {
                        viewer.removeLayer(currentShape);
                    }
                    currentShape = new L.Polygon(points, { stroke: false });
                    viewer.addLayer(currentShape);
                }
                // remove old stretchy line
                if (unfinishedShape) {
                    unfinishedShape.setLatLngs(points.concat([evt.latlng]));
                }
            }
        }

        function stretchUnfinishedShape(evt) {
            var last = points.length - 1;

            if (last < 0 || currentlyDrawing === "point") {
                return;
            }

            if (currentlyDrawing === "line") {
                if (!unfinishedShape) {
                    unfinishedShape = new L.Polyline(
                        [ points[last], evt.latlng ],
                        {
                            color: "black",
                            weight: 2,
                            dashArray: "7, 9"
                        });
                    viewer.addLayer(unfinishedShape);
                } else {
                    unfinishedShape.spliceLatLngs(1, 1, evt.latlng);
                }
            } else if (currentlyDrawing === "polygon") {
                if (!unfinishedShape) {
                    unfinishedShape = new L.Polyline(
                        [ points[last], evt.latlng ],
                        {
                            color: "black",
                            weight: 2,
                            dashArray: "7, 9"
                        });
                    viewer.addLayer(unfinishedShape);
                } else {
                    unfinishedShape.spliceLatLngs(last + 1, 1, evt.latlng);
                }
            } else {
                return;
            }
        }

        function handleKeyboardCommands(evt) {
            if (evt.which === 27) { // ESC
                drawing.cancel();
            } else if (evt.which === 13) { // Enter
                drawing.end();
            } else {
                return true;
            }
            evt.preventDefault();
            evt.stopPropagation();
        }

        function clearJunk() {
            // remove drawn shape
            if (currentShape) {
                viewer.removeLayer(currentShape);
            }

            // remove unfinished shape
            if (unfinishedShape) {
                viewer.removeLayer(unfinishedShape);
                unfinishedShape = null;
            }

            // clear markers and points
            $.map(markers, function (marker) {
                viewer.removeLayer(marker);
                marker = null;
            });
            markers = [];
            points = [];

            // reset event listeners
            $(document).off("keyup", handleKeyboardCommands);
            viewer.off("click", addPoint);
        }

        return {

            currentShapeGeometry: function (wkt) {
                if (currentlyDrawing) {
                    return getGeometry(currentlyDrawing, points, wkt);
                }
                return null;
            },

            start: function (type) {
                // disable doubleclick zoom
                viewer.doubleClickZoom.disable();

                // set status
                currentlyDrawing = type;

                // set event listeners
                viewer.on("click", addPoint);
                viewer.on("mousemove", stretchUnfinishedShape);
                $(document).keyup(handleKeyboardCommands);

                // prepare the deferred
                dfrd = new $.Deferred();

                return dfrd.promise();
            },

            end: function (noEvent) {
                if (dfrd) {
                    dfrd.resolve(points, noEvent);
                    clearJunk();
                }
                return dfrd.promise();
            },

            cancel: function (noEvent) {
                if (dfrd) {
                    dfrd.reject(noEvent);
                    clearJunk();
                }
                return dfrd.promise();
            }

        };

    }(fn.exposeLeaflet()));


     /*
     |   API
    */

    this.fn = fn;
    this.viewer = fn.exposeLeaflet();

    this.add = function (type) {
        var shapeIndex = reserveShapeSlot(),
            id = getIdFromNr(shapeIndex);

        drawing.start(type)
        .done($.proxy(function (points, noEvent) {
            var wkt = getGeometry(type, points, true);
            if (wkt) {
                this.deserializeGeometryOpenGISSimple({ geom: wkt }, id);
                if (!noEvent) {
                    $(eventAnchor).triggerHandler("add.fnCanvas2", [{ id: id, geom: wkt, gtype: type }]);
                }
            } else {
                if (shapes[shapeIndex] instanceof ReservedShape) {
                    unreserveShapeSlot(shapeIndex);
                }
            }
        }, this))
        .fail(function (noEvent) {
            unreserveShapeSlot(shapeIndex);
            if (!noEvent) {
                $(eventAnchor).triggerHandler("add.fnCanvas2", [{ id: null, geom: null, gtype: type }]);
            }
        });

        return id;
    };

    this.endDraw = function (opts) {
        if (opts && opts.cancel) {
            drawing.cancel();
        } else if (opts && opts.noEvent) {
            drawing.end(true);
        } else {
            drawing.end();
        }
    };

    this.addEventListener = function (name, handler) {
        var wrappedHandler = function () {
            var extraParams = Array.prototype.slice.call(arguments, 1);
            return handler.apply(this, extraParams);
        };
        $(eventAnchor).on(name + ".fnCanvas2", wrappedHandler);
        eventAnchor.handlers.push({ original: handler, wrapped: wrappedHandler });
    };

    this.removeEventListener = function (name, handler) {
        var wrappedHandler, i;
        $.each(eventAnchor.handlers, function (index, item) {
            if (item.original === handler) {
                i = index;
                wrappedHandler = item.wrapped;
            }
        });

        if (i == null || eventAnchor.handlers[i] == null) {
            return;
        }

        $(eventAnchor).off(name + ".fnCanvas2", wrappedHandler);

        delete eventAnchor.handlers[i].wrapped;
        eventAnchor.handlers.splice(i, 1);
    };

    this.setAttributeGeometry = function (shapeId, attribute, value, doNotRedraw) {
        var shape = shapes[getNrFromId(shapeId)];
        if (shape) {
            if (shape instanceof ReservedShape) {
                shape.attributes[attribute] = value;
            } else {
                shape[attribute] = value;
                if(!doNotRedraw) {
                    shape.redraw();
                }
            }
        }
        return shapeId;
    };

    this.getAttributeGeometry = function (shapeId, attribute) {
        var shape = shapes[getNrFromId(shapeId)];
        if (!shape) {
            return null;
        }
        return shape[attribute];
    };

    this.getGeometry = function (shapeId) {
        var shape = shapes[getNrFromId(shapeId)];
        if (!shape) {
            return null;
        }
        return shape.geom();
    };

    this.newShape = function (options, id) {
        var shapeId, nr, reserved, attr;

        if (id != null) {
            // reserved shape slot
            nr = getNrFromId(id);
            reserved = shapes[nr];
            if (reserved instanceof ReservedShape) {
                attr = {};
                $.extend(attr, reserved.attributes, options);
                shapeId = id;
                shapes[nr] = new LineShape(id, attr);
                if (reserved.removed) {
                    this.remove(id);
                }
            } else {
                throw "Invalid ID for a reserved shape slot.";
            }
        } else {
            shapeId = getIdFromNr(shapesCount);
            shapes.push(new LineShape(id, options));
            shapesCount++;
        }

        return shapeId;
    };

    this.newLineShape = this.newShape;

    this.newPointShape = function (options, id) {
        var shapeId, nr, reserved, attr;

        if (id != null) {
            // reserved shape slot
            nr = getNrFromId(id);
            reserved = shapes[nr];
            if (reserved instanceof ReservedShape) {
                attr = {};
                $.extend(attr, reserved.attributes, options);
                shapeId = id;
                shapes[nr] = new PointShape(id, options);
                if (reserved.removed) {
                    this.remove(id);
                }
            } else {
                throw "Invalid ID for a reserved shape slot.";
            }
        } else {
            shapeId = getIdFromNr(shapesCount);
            shapes.push(new PointShape(id, options));
            shapesCount++;
        }

        return shapeId;
    };

    this.newPolygonShape = function (options, id) {
        var shapeId, nr, reserved, attr;

        if (id != null) {
            // reserved shape slot
            nr = getNrFromId(id);
            reserved = shapes[nr];
            if (reserved instanceof ReservedShape) {
                attr = {};
                $.extend(attr, reserved.attributes, options);
                shapeId = id;
                shapes[nr] = new PolygonShape(id, options);
                if (reserved.removed) {
                    this.remove(id);
                }
            } else {
                throw "Invalid ID for a reserved shape slot.";
            }
        } else {
            shapeId = getIdFromNr(shapesCount);
            shapes.push(new PolygonShape(id, options));
            shapesCount++;
        }

        return shapeId;
    };

    this.newMultiShape = function (options, id) {
        var shapeId, nr, reserved, attr;

        if (id != null) {
            // reserved shape slot
            nr = getNrFromId(id);
            reserved = shapes[nr];
            if (reserved instanceof ReservedShape) {
                attr = {};
                $.extend(attr, reserved.attributes, options);
                shapeId = id;
                shapes[nr] = new MultiShape(id, options);
                if (reserved.removed) {
                    this.remove(id);
                }
            } else {
                throw "Invalid ID for a reserved shape slot.";
            }
        } else {
            shapeId = getIdFromNr(shapesCount);
            shapes.push(new MultiShape(id, options));
            shapesCount++;
        }

        return shapeId;
    };

    this.moveTo = function (id, x, y, z) {
        var shape = shapes[getNrFromId(id)];
        if (shape) {
            z = (z != null) ? z : (shape.hasZ ? 0 : null);
            shape.cursor = this.fn.toLeafletCoords(x, y, z);
            shape.addLine();
            return id;
        }
    };

    this.lineTo = function(id, x, y, z) {
        var shape = shapes[getNrFromId(id)];
        if (shape) {
            z = (z != null) ? z : (shape.hasZ ? 0 : null);
            shape.cursor = this.fn.toLeafletCoords(x, y, z);
            shape.extendLine();
            return id;
        }
    };

    this.remove = function (id) {
        var nr = getNrFromId(id),
            shape = shapes[nr];
        if (shape) {
            shape.clear();
            shapes[nr] = null;
            return id;
        }
    };

    this.removeAll = function () {
        var i, k;
        for (i = 0, k = shapes.length; i < k; i++) {
            this.remove(getIdFromNr(i));
        }
    };

    this.clear = this.removeAll;

    this.editGeometry = function (shapeId) {
        var shape = shapes[getNrFromId(shapeId)];
        if (shape) {
            shape.edit();
            return shapeId;
        }
        return null;
    };

    this.editGeometryEnd = function (shapeId) {
        var shape = shapes[getNrFromId(shapeId)];
        if (shape) {
            shape.edit(false);
            return shapeId;
        }
        return null;
    };

    this.redrawGeometry = function (shapeId) {
        var shape = shapes[getNrFromId(shapeId)];
        if (shape) {
            shape.redraw();
        }
    };

    this.serializeGeometryOpenGIS = function (shapeId) {
        var shape = shapes[getNrFromId(shapeId)];

        if (shape) {
            return shape.wkt();
        }

        return null;
    };

    this.deserializeGeometryOpenGISSimple = function (shapedef, id) {
        var wkt = shapedef && shapedef.geom,
            geom = giscloud.geometry.fromOGC(wkt),
            shape, shapeId;

        if (geom instanceof giscloud.geometry.Point) {
            shapeId = this.newPointShape(shapedef, id);
            shape = shapes[getNrFromId(shapeId)];
            shape.cursor = this.fn.toLeafletCoords(geom.x, geom.y, geom.z);
            shape.hasZ = geom.hasZ();
            shape.draw();
        } else if (geom instanceof giscloud.geometry.Line) {
            shapeId = this.newLineShape(shapedef, id);
            shape = shapes[getNrFromId(shapeId)];
            shape.hasZ = geom.hasZ();
            drawLine(shape, geom);
        } else if (geom instanceof giscloud.geometry.Multiline) {
            shapeId = this.newMultiShape(shapedef, id);
            shape = shapes[getNrFromId(shapeId)];
            shape.shapes = [toLeafletGeometry(geom)];
            shape.type = "line";
            shape.hasZ = geom.hasZ();
            shape.draw();
        } else if (geom instanceof giscloud.geometry.Polygon) {
            shapeId = this.newPolygonShape(shapedef, id);
            shape = shapes[getNrFromId(shapeId)];
            shape.ring = $.map(geom.rings[0].points, function (point) {
                return fn.toLeafletCoords(point.x, point.y, point.z);
            });
            shape.hasZ = geom.hasZ();
            shape.draw();
        } else if (geom instanceof giscloud.geometry.Multipolygon) {
            shapeId = this.newMultiShape(shapedef, id);
            shape = shapes[getNrFromId(shapeId)];
            shape.shapes = [toLeafletGeometry(geom)];
            shape.type = "polygon";
            shape.hasZ = geom.hasZ();
            shape.draw();
        } else if (geom instanceof giscloud.geometry.GeometryCollection) {
            shapeId = this.newMultiShape(shapedef, id);
            shape = shapes[getNrFromId(shapeId)];
            shape.shapes = $.map(geom.geometries, toLeafletGeometry);
            shape.hasZ = geom.hasZ();
            shape.draw();
        } else {
            throw "Cannot deserialize from OGC, unknown giscloud geometry type.";
        }

        return shapeId;
    };

    this.deserializeGeometryOpenGIS = this.deserializeGeometryOpenGISSimple;

};

/*global fnMarker2, giscloud, L */

fnMarker2 = function (fn) {
    "use strict";

    var $ = giscloud.exposeJQuery(),
        icons = {},
        markersReady = {},
        markersData = {},
        events = [],
        markersCount = 0;

    this.fn = fn;
    this.viewer = fn.exposeLeaflet();
    this.markers = [];

    function icon(url, w, h) {

        var md5 = giscloud.md5(url);

        if (!icons[md5]) {
            icons[md5] = { loading: new $.Deferred(), Icon: null };

            if (w != null && h != null) {
                icons[md5].Icon = L.Icon.Label.extend({ options: {
                        iconUrl: url,
                        shadowUrl: null,
                        iconSize: new L.Point(w, h),
                        iconAnchor: new L.Point(w / 2, h / 2),
                        labelAnchor: new L.Point(Math.max(w, h) * 1.5 + 5, 0),
                        wrapperAnchor: new L.Point(w, h)
                    }
                });
                icons[md5].loading.resolve(icons[md5]);
            } else {
                $.loadImage(url).done(function (img) {
                    var w = img.width, h = img.height;

                    icons[md5].Icon = L.Icon.Label.extend({ options: {
                            iconUrl: url,
                            shadowUrl: null,
                            iconSize: new L.Point(w, h),
                            iconAnchor: new L.Point(w / 2, h / 2),
                            labelAnchor: new L.Point(Math.max(w, h) * 1.5 + 5, 0),
                            wrapperAnchor: new L.Point(w, h)
                        }
                    });

                    icons[md5].loading.resolve(icons[md5]);
                });
            }
        }

        return icons[md5];
    }


    function attachEvent(markerId, marker, event) {
        if (marker && $.isFunction(marker.on) &&
            event && event.name && $.isFunction(event.handler)) {

            if (event.name === "poi_click") {
                marker.on("click", $.proxy(function () {
                    event.handler.call(this, { id: markerId, data: markersData[markerId], type: "poi_click" });
                }));
            } else {
                marker.on(event.name, $.proxy(function () {
                    var params = [{ id: markerId, data: markersData[markerId], type: event.name }],
                        argsArray = Array.prototype.slice.call(arguments);
                    event.handler.apply(this, params.concat(argsArray));
                }));
            }
        }
    }

    function getNrFromId(markerId) {
        return typeof markerId == "string" &&
               parseInt(markerId.replace(/m(\d+)/, "$1"), 10);
    }

    function getHtmlContent(options) {
        var title = options.title,
            content = options.content,
            color = options.color,
            open = options.open,
            col = new giscloud.Color.fromHex(color),
            html = "";

        if (title != null) {
            html += "<p class=\"gc-info-popup-title\" style=\"background-color: " + color +
                    "; color: " + ((col.hsl()[2] > 85) ? "black" : "white") + ";\">" + title + "</p>";
        }
        if (open && content != null) {
            html += "<div class=\"gc-info-popup-content\">" + content + "</div>";
        }
        return html;
    }

    function toggle(id) {

    }

    this.add = function (x, y, color, title, content, icon, open) {
        var latlng, popup, html, id, i, k, event, that = this;

        if (x.x && x.y) {
            icon = x.icon;
            title = x.title;
            content = x.content;
            color = x.color;
            open = x.open;
            y = x.y;
            x = x.x;
        }

        open = !!open;

        if (color == null) {
            color = "#0097C6";
        } else {
            if (color instanceof giscloud.Color) {
                color = color.hex();
            } else {
                color = giscloud.Color.fromHex(color).hex();
            }
        }

        latlng = this.fn.toLeafletCoords(x, y);

        popup = new L.Popup({ className: "gc-info-popup",
                              minWidth: 180,
                              closeButton: true
                            });
        popup._fnMarker = {
            x: x, y: y, color: color, title: title,
            content: content, icon: icon, open: open
        };

        html = getHtmlContent(popup._fnMarker);

        popup.setLatLng(latlng);
        popup.setContent(html);

        id = "m" + markersCount;
        markersCount++;

        k = events.length;
        if (k) {
            for (i = 0; i < k; i++) {
                event = events[i];
                if (event) {
                    attachEvent.call(this, id, popup, event);
                }
            }
        }

        this.markers.push(popup);
        this.viewer.addLayer(popup);
        markersReady[id] = new $.Deferred();

        // adding an item into markersReady is only just for compatibility
        // with methods like move(). there is no real reason to wait for a popup
        // to be ready.
        // that's why we resolve this now.
        markersReady[id].resolve(popup);

        // stop mouse events on the close button
        $(popup._container).on("mouseup mousedown mousemove mouseover", ".leaflet-popup-close-button", function (evt) {
            evt.stopPropagation();
        });
        $(popup._wrapper)
        // prevent map hover effect when mouse over a popup
        .mousemove(function (evt) { evt.stopPropagation(); })
        // bind click event for the title
        .on("click", ".gc-info-popup-title", function () { that.toggle(id); })
        // bind click event for the edit link
        .on("click", ".gc-info-edit-link", function () {
            var parent = $(this).parent(),
                layerId = parent.find("[name=edit-layer-id]").val(),
                featureId = parent.find("[name=edit-feature-id]").val();
            popup.fire("gc-info-popup-edit-click", { layerId: layerId, featureId: featureId });
        });

        return id;
    };

    this.setTitle = function (markerId, title) {
        var nr = getNrFromId(markerId),
            popup = this.markers[nr],
            html;
        if (popup) {
            popup._fnMarker.title = title;
            html = getHtmlContent(popup._fnMarker);
            popup.setContent(html);
        }
        return this;
    };

    this.setContent = function (markerId, content) {
        var nr = getNrFromId(markerId),
            popup = this.markers[nr],
            html;
        if (popup) {
            popup._fnMarker.content = content;
            html = getHtmlContent(popup._fnMarker);
            popup.setContent(html);
        }
        return this;
    };

    this.toggle = function (markerId) {
        var nr = getNrFromId(markerId),
            popup = this.markers[nr],
            html;
        if (popup) {
            popup._fnMarker.open = !popup._fnMarker.open;
            html = getHtmlContent(popup._fnMarker);
            popup.setContent(html);
            $(this).triggerHandler("fnMarker.OpenClose", [ markerId, popup._fnMarker.open ]);
        }
        return this;
    };

    this.remove = function (markerId) {
        var nr = getNrFromId(markerId),
            marker = this.markers[nr];
        if (marker) {
            if (marker._popupCloseHandler) {
                $(this.viewer).off("popupClose.fnMarker", this._popupCloseHandler);
            }
            if (marker._popupOpenHandler) {
                $(this.viewer).off("popupOpen.fnMarker", this._popupOpenHandler);
            }
            this.viewer.removeLayer(marker);
            this.markers[nr] = null;
            delete markersReady[markerId];
        }
    };

    this.removeAll = function () {
        $.each(this.markers, $.proxy(function (i, marker) {
            if (marker instanceof L.Marker) {
                this.removePoi("m" + i);
            } else if (marker instanceof L.Popup) {
                this.remove("m" + i);
            }
        }, this));
    };

    this.closeAll = function () {
        // just remove popups
        $.each(this.markers, $.proxy(function (i, marker) {
            if (marker instanceof L.Popup) {
                this.remove("m" + i);
            }
        }, this));
    };

    this.clear = this.closeAll;

    this.loadPoi = function (x, y, url, data, clickable, iconWidth, iconHeight) {
        var dfrd, that, id, ico;

        that = this;
        dfrd = new $.Deferred();

        id = "m" + markersCount;

        markersReady[id] = new $.Deferred();
        markersData[id] = data;
        markersCount++;

        ico = icon(url, iconWidth, iconHeight);
        ico.loading.done(function(loadedIcon) {
            var latlng, marker, i, k, event;

            latlng = that.fn.toLeafletCoords(x, y);
            if (data.hoverText) {
                marker = new L.Marker(latlng, { icon: new loadedIcon.Icon(), title: data.hoverText });
            } else {
                marker = new L.Marker(latlng, { icon: new loadedIcon.Icon() });
            }

            if (data.popupContent) {
                marker.bindPopup(data.popupContent, { className: "gc-info-popup", autoPan: false });
                marker._popupCloseHandler = function (evt) {
                    if (evt.popup === marker._popup) {
                        $(that).triggerHandler("popupClose.fnMarker", [id]);
                    }
                };
                marker._popupOpenHandler = function (evt) {
                    if (evt.popup === marker._popup) {
                        $(that).triggerHandler("popupOpen.fnMarker", [id]);
                    }
                };

                that.viewer.on("popupclose", marker._popupCloseHandler);
                that.viewer.on("popupopen", marker._popupOpenHandler);
            }

            k = events.length;
            if (k) {
                for (i = 0; i < k; i++) {
                    event = events[i];
                    if (event) {
                        attachEvent.call(that, id, marker, event);
                    }
                }
            }

            that.markers.push(marker);
            that.viewer.addLayer(marker);

            if (data.popupContent && data.popupVisible) {
                marker.openPopup();
            }

            markersReady[id].resolve(marker);
        });

        return id;
    };

    this.removePoi = function (markerId) {
        var that, ready;

        ready = markersReady[markerId];
        if (!ready) {
            console.log("Ready missing: ", markerId, markersReady);
        }

//        if (ready) {
            that = this;
//            ready.done(function () {
                that.remove(markerId);
                delete markersData[markerId];
//            });
//        }
    };

    this.move = function (markerId, x, y, rot) {
        var that, ready;

        ready = markersReady[markerId];

        if (ready) {
            that = this;
            ready.done(function (marker) {
                var latlng;
                if (marker && marker.setLatLng) {
                    latlng = that.fn.toLeafletCoords(x, y);
                    marker.setLatLng(latlng);
                    if (marker.setRotation) {
                        marker.setRotation(rot);
                    }
                }
            });
        }
    };

    this.move2 = this.move;

    this.attachLabel = function (o) {
        var ready = markersReady[o.marker];

        if (ready) {
            ready.done(function (marker) {
                if (marker.setLabelText) {
                    marker.setLabelText(o.data);
                } else if (marker.options.icon && marker.options.icon.setLabelText) {
                    marker.options.icon.setLabelText(o.data);
                } else {
                    $(marker._icon).find(".leaflet-marker-iconlabel").html(o.data);
                }
            });
        }
    };

    this.addEventListener = function (name, handler) {
        var i, k, marker, event = { name: name, handler: handler };
        for (i = 0, k = this.markers.length; i < k; i++) {
            marker = this.markers[i];
            if (marker) {
                attachEvent.call(this, "m" + i, marker, event);
            }
        }
        events.push(event);
    };

};

fnTooltip2 = function (fn) {
    "use strict";

    var $ = giscloud.exposeJQuery(),
        showing = false,
        label = new L.DivIcon({ className: 'gc-map-tip' }),
        viewer = fn.exposeLeaflet(),
        marker = new L.Marker(new L.LatLng(0, 0), { icon: label, clickable: false });

    function setText(text) {
        if (marker && marker._icon) {
            marker._icon.innerHTML = text;
        }
    }

    function showTip(text) {
        if (!showing) {
            viewer.addLayer(marker);
            showing = true;
        }
        setText(text);
    }

    function moveTip(evt) {
        if (marker) {
            marker.setLatLng(evt.latlng);
        }
    }

    function hideTip() {
        viewer.removeLayer(marker);
        viewer.off("mousemove", moveTip);
        showing = false;
    }

    this.show = function (text) {
        viewer.on("mousemove", moveTip);
        showTip(text);
    };

    this.hide = function () {
        hideTip();
    };

};

fnAgent2  = function (fn) {

    this.setData = function(marker_id){

    };

    this.setZoom = function(level){

    };


};

(function (window, $, common, undefined) {

    var lv, initialized,L,bounds,unitFactor,unit,units,unit_label,sources_map, enabled_dragging,loaded;
    var tileLayerCount;

    tileLayerCount = 0;
    initialized = 0;
    loaded = false;
    enabled_dragging = 1;
    var giscloud_url = "http://api.giscloud.com/";
    if (common) giscloud_url = common.appSite();
    var giscloud_tile_url = giscloud_url;

    function init()
    {
        if (initialized) return;
        L = window.L || giscloud.exposeLeaflet();

        initialized = 1;

            fnLayer2 = L.TileLayer.extend({

    getId: function() {
        return this.id;
    },

    disable : function() {
        this.visible = false;
        this.setVisible(false);
    },

    enable : function() {
        this.visible = true;
        this.setVisible(true);
    },

    getAlpha : function() {
        return Math.round(this.options.opacity*100);
    },

    setAlpha : function(v) {
        if (flashnavigator.hasCanvas) {
            this.setOpacity(v/100.0);
        }
    },

    getCurrentLevel : function() {
        return lv.map._zoom;
    },

    setSelectable : function(v) {
        this._selectable = v;
        return 0;
    },

    getSelectable : function(v) {
        return this._selectable;
    },

    getBound : function(v) {
        return {xMin:this.source.xmin, xMax:this.source.xmax,
                yMin:this.source.ymin, yMax:this.source.ymax};
    },

    getData : function(i) {
        return this.source;
    },

    _loadTile : function(tile, tilePoint) {
        tile._layer = this;
        tile.onload = this._tileOnLoad;
        tile.onerror = this._tileOnError;
        this._processTile(tile, tilePoint, this._getZoomForUrl());
    },

    _processTile: function(tile, tilePoint) {
        tile.src = this.getTileUrl(tilePoint);
    },

    redraw: function() {
        if (this.gcmap)
            this.gcmap.redraw()
    },

    getRules: function() {
        return this.features;
    },

    setRule: function(index, rule) {
        this.features[index] = rule;
    },

    resetRules: function() {
        this.features = [];
        for (var i = 0; i < this.features_original.length; i++) {
            var c = {};
            for (var k in this.features_original[i]) {
                c[k] = this.features_original[i][k];
            }
            this.features[i] = c;
        }
    },

    setDynamicMode : function(p) {
        if (this.gcmap)
            this.gcmap.url = this.gcmap.url_prefix + "/dyn," + p +"/";
    },

    setStyleOverride : function(p) {
        if (this.gcmap)
            this.gcmap.overrideFunc = p;
    },

    reload : function() {
        if (this.gcmap)
            this.gcmap.reload();
    },

    setVisible: function (onoff) {
        if (this._container) {
            this._container.style.display = onoff ? 'block' : 'none';
        }
        this._updateLayerCount(onoff);
        this.options.visible = onoff;
        if (this.isTileLayer)
            this.viewer._layersForUpdateCount = 1;
        this._update();
        return this;
    },

    getVisible: function (onoff) {
        return this.options.visible;
    },

    _updateLayerCount: function(onoff) {
        if (this.options.visible != onoff && lv.map.options.zoomAnimation &&
            L.TileLayer && (this instanceof L.TileLayer)) {
            if (onoff)
                lv.map._tileLayersNum++;
            else
                lv.map._tileLayersNum--;
        }
    }
});

fnLayer2.prototype.options.visible = true;
fnLayer2.prototype._tileShouldBeLoadedOriginal = fnLayer2.prototype._tileShouldBeLoaded;
fnLayer2.prototype._tileShouldBeLoaded = function(tilePoint) {

    if (!this.options.visible || !this._tileShouldBeLoadedOriginal(tilePoint)) {
        return false;
    }
   // return true;
    var zoom = this._getZoomForUrl();
    var m = (1 << zoom);
    this.nxmin = (this.source.xmin-bounds.xmin)/bounds.max*m; this.tnxmin = Math.floor(this.nxmin);
    this.nxmax = (this.source.xmax-bounds.xmin)/bounds.max*m; this.tnxmax = Math.floor(this.nxmax);
    this.nymin = (bounds.ymax-this.source.ymax)/bounds.max*m; this.tnymin = Math.floor(this.nymin);
    this.nymax = (bounds.ymax-this.source.ymin)/bounds.max*m; this.tnymax = Math.floor(this.nymax);

    if (tilePoint.x >= this.tnxmin && tilePoint.x <= this.tnxmax &&
        tilePoint.y >= this.tnymin && tilePoint.y <= this.tnymax) {
        return true;
    }

    return false;
}

fnLayer2.prototype._updateOriginalTileLayer = fnLayer2.prototype._update;
fnLayer2.prototype._update = function() {
    this._updateOriginalTileLayer();
    if (this._tilesToLoad === 0) {
        this.fire('load');
    }
}

fnTileLayer = fnLayer2.extend({

    initialize: function(options) {
        this.visible = options.visible;
        this.id = options.id;
        this.source = options.source;
        this.gcmap = new giscloud.Html5Map(options, this);
        this.gcmap.setBounds(bounds);
        this.gcmap.selectablePoly(0);
        this.gcmap.feature_filter = null;
        var that = this;
        this.gcmap.getCanvases = function() {
            return that._tiles;
        }
        this.gcmap.getFeatureClass = function(i) {
            return that.features[i];
        }
        this.gcmap.getFeatures = function() {
            return that.features;
        }
        this.gcmap.getSelectable = function() {
            return that.getSelectable();
        }
        this.on("stoploadingtiles",function() {
            that.gcmap.resetLoader();
        });

        this.on("tileunload",function(e) {
            e.tile.data = null;
            e.tile.lista = null;
            e.tile.styles = null;
            e.tile.fields = null;
        });
        options.noWrap = true;
        L.Util.setOptions(this, options);
    },

    _createTileProto : function() {
        if (flashnavigator.hasCanvas)
            this._canvasProto = L.DomUtil.create('canvas','leaflet-tile leaflet-tile-loaded');
        else {
            this._canvasProto = L.DomUtil.create('div','leaflet-tile leaflet-tile-loaded');
        }
        var tileSize = this.options.tileSize;
        this._canvasProto.width = tileSize;
        this._canvasProto.height = tileSize;
    },

    _createTile : function() {
        return this._canvasProto.cloneNode(false);
    },

    _processTile : function(tile, tilePoint, zoom) {
        tile._layer = this;
        tile.ontileload = function() {
            this._layer._tileOnLoad.call(this);
            if (this._layer._oldContainer) {
                clipTilesBellow(this);
            }
        }
        if (this.visible) {
            this.gcmap.loadTile(tile,tilePoint, zoom);
        }
    },

    redraw : function() {
        this.gcmap.redraw();
    },

    setFeatureFilter : function(val) {
        this.gcmap.feature_filter = val;
    },

    getFeature : function(feature) {
        return this.gcmap.getFeature(feature);
    }
});

fnTileLayer.prototype._updateOriginalFnLayer = fnTileLayer.prototype._update;
fnTileLayer.prototype._update = function() {
    this._updateOriginalFnLayer();
    this.viewer._layersForUpdateCount --;
    if (this.viewer._layersForUpdateCount === 0) {
        giscloud.Html5SendRequests();
        this.viewer._layersForUpdateCount = 0;
    }
}

function clipTilesBellow(that) {

    var x = that._leaflet_pos.x;
    var y = that._leaflet_pos.y;
    var scale = lv.map._animateScale;

    if (!scale) return;

    var ox = Math.round(lv.map._animateOrigin.x);
    var oy = Math.round(lv.map._animateOrigin.y);

    var c = that._layer._oldContainer.childNodes;

    for (var i = 0, len = c.length; i < len; i++) {

        if (!c[i]._drawn) continue;

        var cx = (c[i]._leaflet_pos.x - ox - c[i]._offset)*scale + ox;
        var cy = (c[i]._leaflet_pos.y - oy - c[i]._offset)*scale + oy;

        var w = c[i].width * scale;

        var r1 = { xmin: x,
                   ymin: y,
                   xmax: x + that.width - that._offset*2,
                   ymax: y + that.height - that._offset*2 };

        var r2 = { xmin: cx,
                   ymin: cy,
                   xmax: cx + w,
                   ymax: cy + w };

        if (intersects(r1,r2)) {

            rect = { xmin : getmax(r1.xmin, r2.xmin),
                     ymin : getmax(r1.ymin, r2.ymin),
                     xmax : getmin(r1.xmax, r2.xmax),
                     ymax : getmin(r1.ymax, r2.ymax) };

            var p = { x: Math.floor((rect.xmin - cx)/scale),
                      y: Math.floor((rect.ymin - cy)/scale),
                      w: Math.ceil((rect.xmax-rect.xmin)/scale),
                      h: Math.ceil((rect.ymax-rect.ymin)/scale),
                      c:c[i] };

            var ctx = p.c.getContext('2d');
            ctx.clearRect(p.x, p.y, p.w, p.h);
        }
    }
}

function intersects(a,b)
{
    if (a.xmax <  b.xmin || a.xmin >  b.xmax ||
        a.ymax <  b.ymin || a.ymin >  b.ymax ) {
        return false;
    }
    return true;
}

function getmax(a,b) {
    if (a > b) return a;
    return b;
}

function getmin(a,b) {
    if (a < b) return a;
    return b;
}

fnRasterLayer = fnLayer2.extend({

    _processTile : function(tile, tilePoint, zoom) {
        var clip = false;
        var left,right,bottom,top;
        left = top = "0px";
        bottom = right = "256px";
        if (tilePoint.x == this.tnxmin) {
            left = Math.round((this.nxmin-this.tnxmin)*256)+"px";
            clip = true;
        }
        if (tilePoint.y == this.tnymin) {
            top = Math.round((this.nymin-this.tnymin)*256)+"px";
            clip = true;
        }
        if (tilePoint.x == this.tnxmax) {
            right = Math.round((this.nxmax-this.tnxmax)*256)+"px";
            clip = true;
        }
        if (tilePoint.y == this.tnymax) {
            bottom = Math.round((this.nymax-this.tnymax)*256)+"px";
            clip = true;
        }
        if (clip)
            tile.style.clip= "rect("+top+","+right+","+bottom+","+left+")";

        tile.src = this.getTileUrl(tilePoint, zoom);
    }
});

function tileXYToQuadKey( tileX,  tileY,  levelOfDetail) {
    var quadKey = "";
    for (var i = levelOfDetail; i > 0; i--)
    {
        var digit = '0';
        var m = 1 << (i - 1);
        if ((tileX & m) != 0) {
            digit++;
        }

        if ((tileY & m) != 0) {
            digit++;
            digit++;
        }
        quadKey += digit;
    }
    return quadKey;
}

fnQuadLayer = fnLayer2.extend({

    _processTile : function(tile, tilePoint, zoom) {

        var subdomains = this.options.subdomains,
        s = this.options.subdomains[(tilePoint.x + tilePoint.y) % subdomains.length];

        tile.src = this._url[(tilePoint.x+tilePoint.y)%this._url.length]
            .replace('{s}', s)
            .replace('{q}', tileXYToQuadKey(tilePoint.x, tilePoint.y, zoom));
    }

});

fnWmsLayer = fnLayer2.extend({

    _processTile : function(tile, tilePoint, zoom) {

        if (this.options.gctms) {
            tilePoint.y = this._getWrapTileNum() - tilePoint.y - 1;
        }

        var u = bounds.max/(1 << zoom);
        var x0 = bounds.xmin + u * tilePoint.x;
        var y0 = bounds.ymax - u * tilePoint.y;

        tile.src = this._url[(tilePoint.x+tilePoint.y)%this._url.length].
            replace("$x1",x0).
            replace("$y1",y0 - u).
            replace("$x2",x0 + u).
            replace("$y2",y0).
            replace("{z}", zoom).
            replace("{x}", tilePoint.x).
            replace("{y}", tilePoint.y).
            replace("$id", zoom).
            replace("$nx", tilePoint.x).
            replace("$ny", tilePoint.y);
    }

});

fnGoogleLayer = fnLayer2.extend({
    includes: L.Mixin.Events,

    initialize: function(options) {
        options.zoomAnimation = false;
        L.Util.setOptions(this, options);
        lv.map.copyrightControl.setPosition("topright");
        lv.map.attributionControl.setPosition("topright");
        this._googleMapsApiLoaded = new $.Deferred();
    },

    onAdd: function(map, insertAtTheBottom) {
        this._map = map;
        this._noScale = true;
        this._insertAtTheBottom = insertAtTheBottom;
        var that = this;
        this._initContainer();

        this._map.on({
            'viewreset': this._resetCallback,
            'moveend': this._update,
            'move': this._update
        }, this);

        if (!this.options.updateWhenIdle) {
            this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
            map.on('move', this._limitedUpdate, this);
        }

        if (!window.google) {
            if (!giscloud.fnGoogleLayerLoadCallback) {
                giscloud.fnGoogleLayers = [];
                giscloud.fnGoogleLayerLoadCallback = function() {
                    that._googleMapsApiLoaded.resolve();
                    that._map.invalidateSize();

                    for (var i = 0; i < giscloud.fnGoogleLayers.length; i++) {
                        giscloud.fnGoogleLayers[i]._initMapObject();
                    }

                    window.setTimeout(function () {
                        delete giscloud.fnGoogleLayerLoadCallback;
                        delete giscloud.fnGoogleLayers;
                        that._map.invalidateSize();
                    }, 1);
                }
                giscloud.includeJs(
                    (window.location.protocol == "https:" ? "https:" : "http:") +
                        "//maps.googleapis.com/maps/api/js?sensor=false&callback=giscloud.fnGoogleLayerLoadCallback");
            }
            giscloud.fnGoogleLayers.push(this);
        }
    },

    onRemove: function(map) {
        map._panes.tilePane.removeChild(this._container);
        map.off({
            'viewreset': this._resetCallback,
            'moveend': this._update,
            'move': this._update
        }, this);

        if (!this.options.updateWhenIdle) {
            map.off('move', this._limitedUpdate, this);
        }

        this._container = null;
        this._map = null;
    },

    _initContainer: function() {
        var tilePane = this._map._panes.tilePane;

        if (!this._container || tilePane.empty) {

            this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');

            this._updateZIndex();
            tilePane.appendChild(this._container);

            var size = this._map.getSize();
            this._container.style.width = size.x + "px";
            this._container.style.height = size.y + "px";

            if (this.options.opacity < 1) {
                this._updateOpacity();
            }
        }
        this.setVisible(this.options.visible);
    },

    setVisible: function (onoff) {
        if (this._container) {
            this._container.style.display = onoff ? 'block' : 'none';
            if (window.google && !this._container.initMap && onoff) {
                this._container.initMap = true;
                this._initMapObject();
            }
        }
        this._updateLayerCount(onoff);
        this.options.visible = onoff;
        if (!onoff) {
            if (this._google) {
                delete this._google;
                this._google = null;
                this._container.initMap = false;
            }
        }
        this._update();
        return this;
    },

    _initMapObject: function() {
        var _center = null;
        this._googleMapsApiLoaded.done($.proxy(function () {
            if (this._map) {
                var center = this._map.getCenter();
                _center = new google.maps.LatLng(center.lat, center.lng);
                this._lastzoom = this._map.getZoom();
            }

            var google_map_obj =
            {
                center: _center,
                zoom: this._lastzoom,
                mapTypeId: google.maps.MapTypeId[this.options.google_map_type],
                disableDefaultUI: true,
                keyboardShortcuts: false,
                draggable: false,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                streetViewControl: false
            };

            if (flashnavigator.hasCanvas)
                google_map_obj.backgroundColor = "rgba(0,0,0,0)";

            var map = new google.maps.Map(this._container, google_map_obj);

            this._google = map;
            var that = this;
            google.maps.event.addListenerOnce(map, 'idle', function(){
                that.fire('load');
            });
        }, this));
    },

    _reset: function(clearOldContainer) {
        this._initContainer();
    },

    _update: function() {
        if (!this._google || !this.options.visible) return;
        this._resize();
        var center = this._map.getCenter();
        var _center = new google.maps.LatLng(center.lat, center.lng);

        var p = { x:-this._map.getPanes().mapPane._leaflet_pos.x,
                  y: -this._map.getPanes().mapPane._leaflet_pos.y };
        L.DomUtil.setPosition(this._container, p);

        this._google.setCenter(_center);
        var zoom = this._map.getZoom();
        if (zoom != this._lastzoom) {
            this._google.setZoom(zoom);
            this._lastzoom = zoom;
        }
    },

    _resize: function() {
        var size = this._map.getSize();
        if (this._container.style.width == size.x && this._container.style.height == size.y)
            return;
        this._container.style.width = size.x + "px";
        this._container.style.height = size.y + "px";
        google.maps.event.trigger(this._google, "resize");
    },

    _addTile: function() {},
    _addTilesFromCenterOut: function() {}
});


        if (flashnavigator.ready)
            flashnavigator.ready();
    }

        fnViewer2 = function (containerId, mapId, options) {

    var layers,last_url, events, selectionEnabled;

    layers = [];
    layers_feature_filter = [];
    selectionEnabled = true;

    this.disableAnimation = function () {};
    this.setQuality = function () {};
    this.demodifyObjectsColor = function () {};
    this.modifyObject = function(a,b,c,d,e,f) {
        for (var id in lv.map._layers) {
            if (lv.map._layers[id].gcmap) {
                lv.map._layers[id].gcmap.modifyObject(a,b,c,d,e,f);
            }
        }
    };
    var that = this;
    lv.map.on("move",function() {
        that._layersForUpdateCount = tileLayerCount;
    });
    lv.map.on("moveend",function() {
        that._layersForUpdateCount = tileLayerCount;
    });
    lv.map.on("viewreset",function() {
        that._layersForUpdateCount = tileLayerCount;
    });
    lv.map.on("zoomanim",function() {
        giscloud.html5ResetLoaders();
    });



    this.disablePanWithMiddleButton = function () {};
    this.enablePanWithMiddleButton = function () {};
    this.enableSelection = function() {
        giscloud.Html5MapSetSelection(true);
        selectionEnabled = true;
    };
    this.disableSelection = function() {
        giscloud.Html5MapSetSelection(false);
        selectionEnabled = false;
    };

    this.fireSelectAreaEvent = function(rectStartPoint,layerPoint,e) {
        var m = (1 << lv.map._zoom)*256;
        var pb = lv.map.getPixelBounds();

        var w = Math.abs(layerPoint.x-rectStartPoint.x);
        var h = Math.abs(layerPoint.y-rectStartPoint.y);
        if (w > 10 && h > 10)
        {
            var x1 = bounds.xmin+bounds.max*(rectStartPoint.x + lv.map._mapPane._leaflet_pos.x+pb.min.x)/m;
            var y1 = bounds.ymax-bounds.max*(rectStartPoint.y + lv.map._mapPane._leaflet_pos.y+pb.min.y)/m;
            var x2 = bounds.xmin+bounds.max*(layerPoint.x + lv.map._mapPane._leaflet_pos.x+pb.min.x)/m;
            var y2 = bounds.ymax-bounds.max*(layerPoint.y + lv.map._mapPane._leaflet_pos.y+pb.min.y)/m;

            fireEvent("areaselection",{originalEvent: e, xMin:x1,yMin:y1,xMax:x2,yMax:y2});
        }
    }

    this.fireSelectAreaToolEvent = function(rectStartPoint,layerPoint,e) {
        var w = Math.abs(layerPoint.x-rectStartPoint.x);
        var h = Math.abs(layerPoint.y-rectStartPoint.y);
        if (w > 10 && h > 10)
        {
            var bounds = new L.LatLngBounds(
                lv.map.layerPointToLatLng(rectStartPoint),
                lv.map.layerPointToLatLng(layerPoint));

            lv.map.fitBounds(bounds);
        }
    }

    this.setTool = function(tool) {

        $("#flashcontent").removeClass("gc-edit-cursor");

        if (this._currentTool === 'MeasureTool') {
            if (lv.map.measure.enabled) {
                lv.map.measure.disable();
            }
        }

        if (this._currentTool == tool && tool !== 'MeasureTool') {
            return;
        }

        lv.map.boxZoom._onDone = null;
        lv.map.boxZoom.force(false);
        if (tool == 'SelectAreaTool' || tool == 'AreaSelection') {

            lv.map.dragging.disable();
            if (tool == 'AreaSelection')
                lv.map.boxZoom._onDone = this.fireSelectAreaEvent;
            else
                lv.map.boxZoom._onDone = this.fireSelectAreaToolEvent;
            lv.map.boxZoom.force(true);

            $("#flashcontent").addClass("gc-edit-cursor");
        } else {
            lv.map.dragging.enable();
        }

        if (tool == 'MeasureTool') {
            lv.map.measure.enable();
            $("#flashcontent").addClass("gc-edit-cursor");
        }
        var e = {tool:tool, previous_tool:this._currentTool};
        this._currentTool = tool;
        fireEvent("toolchange", e);
    };
    this.src = function() {};
    this.enableAnimation = function() {};
    this.convertScale = function(s) {
        return unitFactor/s;
    };

    this.unload = function() {
        this._reloadBound = null;

        while (l = layers.pop()) {
            if (l._updateLayerCount)
                l._updateLayerCount(true);
            lv.map.removeLayer(l);
        }

        tileLayerCount = 0;
        lv.map.setView(new L.LatLng(0, 0), 0, true);
    };

    this.reload = function(overrideLastUrl, callback) {
        this.reloadCallback = callback;
        if (layers.length > 0) {
            this._reloadBound = this.getViewBound();
        }
        this.load(overrideLastUrl || last_url, true);
    }

    this.setLayerFeatureFilter = function(layer, val) {
        layers_feature_filter[layer] = val;
        var lay = this.getLayerByName(layer);
        if (lay)
            lay.setFeatureFilter(val);
    }

    this.getLayerByName = function(n) {
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].id == n) return layers[i];
        }
        return 0;
    }

    this.getLayerById = this.getLayerByName;

    this.getLayerCount = function() {
        return layers.length;
    }

    this.getLayer = function(i) {
        return layers[i];
    }

    this.setLayersOrder = function(order) {
        sort_layers(order);
    }

    this.removeLayer = function(lay) {
        var l = layers[lay.refId];

        for (var i=lay.refId; i < layers.length-1; i++) {
            layers[i] = layers[i+1];
            layers[i].refId = i;
        }
        if (l.isTileLayer)
            tileLayerCount --;
        layers.length--;
        if (l._updateLayerCount)
            l._updateLayerCount(true);
        lv.map.removeLayer(l);

        fireEvent("layerRemoved", l);
    }

    this.getViewBound = function() {
        var b = lv.map.getPixelBounds();
        var mh = bounds.max/(Math.pow(2,lv.map._zoom)*256);

        var r = new Object();
        r.xMin = bounds.xmin + mh*b.min.x;
        r.yMin = bounds.ymax - mh*b.max.y;
        r.xMax = bounds.xmin + mh*b.max.x;
        r.yMax = bounds.ymax - mh*b.min.y;

        return r;
    }

    this.setViewBound = function(xmin, ymin, xmax, ymax, zoomoffset, force) {

        if (!layers[0]) return;

        xmin *= 1;
        xmax *= 1;
        ymin *= 1;
        ymax *= 1;
        if (!zoomoffset) zoomoffset = 1;

        if (isNaN(xmin) || isNaN(ymin) || isNaN(xmax) || isNaN(ymax)) {
            if (this._startBound &&
                !isNaN(this._startBound.xMin) && !isNaN(this._startBound.xMax) &&
                !isNaN(this._startBound.yMin) && !isNaN(this._startBound.yMax)) {
                xmin = this._startBound.xMin;
                ymin = this._startBound.yMin;
                xmax = this._startBound.xMax;
                ymax = this._startBound.yMax;
            } else {
                xmin = bounds.xmin;
                ymin = bounds.ymin;
                xmax = bounds.xmax;
                ymax = bounds.ymax;
            }
        }

        var epsilon = bounds.max*0.000000025;
        if (Math.abs(xmin-xmax) < epsilon) {
            var offset = bounds.max*0.000025;
            xmin -= offset;
            xmax += offset;
        }
        if (Math.abs(ymin-ymax) < epsilon) {
            var offset = bounds.max*0.000025;
            ymin -= offset;
            ymax += offset;
        }

        if (lv.map._loaded && !force) {

            var m = (1 << lv.map._zoom)*256;
            var pb = lv.map.getPixelBounds();

            var b = new L.LatLngBounds(
                this.toLeafletCoords(xmin,ymin),
                this.toLeafletCoords(xmax,ymax)
            );

            lv.map.fitBounds(b);

        } else {
            var m = (xmax-xmin > ymax-ymin) ? xmax-xmin : ymax-ymin;
            var s = lv.map.getSize();
            var size = lv.map.getSize(),
            zoom = lv.map.getMinZoom(),
            maxZoom = lv.map.getMaxZoom(),
            boundsSize,
            nePoint, swPoint;

            if (!maxZoom || maxZoom > layers_max_level)
                maxZoom = layers_max_level;

            do {
                zoom++;
                var mh = Math.pow(2,zoom)*256;
                nePoint = {x:xmax/bounds.max*mh, y:ymin/bounds.max*mh}
                swPoint = {x:xmin/bounds.max*mh, y:ymax/bounds.max*mh}
            boundsSize = new L.Point(nePoint.x - swPoint.x, swPoint.y - nePoint.y);
            } while ((boundsSize.x - size.x < 0.0001) &&
                     (boundsSize.y - size.y < 0.0001) && (zoom <= maxZoom));
            zoom -= zoomoffset;

            _setView((xmax+xmin)/2, (ymax+ymin)/2, zoom);
        }
    }

    this.setViewBoundAnim = this.setViewBound;

    this.setScale = function(z) {
        var b = this.getViewBound();
        this.setLocation((b.xMin+b.xMax)/2, (b.yMin+b.yMax)/2, z);
    };

    this.toLeafletCoords = function (x, y, z) {
        var m = (1 << lv.map._zoom) * 256,
            pb = lv.map.getPixelBounds(),
            x = (x - bounds.xmin) / bounds.max * m - lv.map._mapPane._leaflet_pos.x - pb.min.x,
            y = (bounds.ymax - y) / bounds.max * m - lv.map._mapPane._leaflet_pos.y - pb.min.y,
            lp = lv.map.layerPointToLatLng(new L.Point(x,y));

        if (z != null) {
            lp.z = z;
        }

        return lp;
    };

    this.fromLeafletCoords = function (latlng) {
        var p = lv.map.latLngToLayerPoint(latlng),
            m = (1 << lv.map._zoom) * 256,
            pb = lv.map.getPixelBounds(),
            x = bounds.xmin + (p.x + lv.map._mapPane._leaflet_pos.x + pb.min.x) / m * bounds.max,
            y = bounds.ymax - (p.y + lv.map._mapPane._leaflet_pos.y + pb.min.y) / m * bounds.max;
            if (latlng.z != null) {
                return new giscloud.geometry.Point(x, y, latlng.z);
            }
            return new giscloud.geometry.Point(x, y);

    };

    this.setLocation = function(x,y,z) {
        if (lv.map._loaded) {
            if (!(z >= 0)) z = lv.map._zoom;
            lv.map.setView(this.toLeafletCoords(x, y), z);
        } else {
            if (z) {
                z = Math.floor(Math.log(unitFactor/z*bounds.max/256)/Math.log(2));
            }
            else {
                z = lv.map._zoom;
            }
            _setView(x,y,z);
        }
    }

    // API
    this.exposeLeaflet = function() {
        return lv.map;
    }

    this.invalidateSize = function() {
        lv.map.invalidateSize();
    }
        function _setView(x,y,zoom) {

    var size = lv.map.getSize();

    lv.map._zoom = zoom;
    var mh = bounds.max/(Math.pow(2,zoom)*256);
    x = (x-bounds.xmin)/mh-size.x/2;
    y = (bounds.ymax-y)/mh-size.y/2;

    lv.map._initialTopLeftPoint = new L.Point(x,y);
    L.DomUtil.setPosition(lv.map._mapPane, new L.Point(0,0));
    lv.map._tileLayersToLoad = lv.map._tileLayersNum;
    if (lv.map._tileBg)
        lv.map._tileBg.innerHTML = "";
    lv.map.fire('viewreset', {hard: true});

    lv.map.fire('move');
    lv.map.fire('zoomend');
    lv.map.fire('moveend');

    if (!lv.map._loaded) {
        lv.map._loaded = true;
        lv.map.fire('load');
    }
}

function findFirst(c) {
    var len = c.length;
    for (var i=0; i < len; i++) {
        if (c[i].nodeType == 1) return c[i];
    }
    return null;
}

var icons_to_load = [];
var icons_load_counter = 0;

function prepareForMap(that) {
    icons_load_counter = icons_to_load.length;

    if (icons_load_counter == 0) {
        loadmap(that);
        return;
    }
    var i;
    while ( i = icons_to_load.pop() ) {
        i.img.onerror =
            i.img.onload = function() {
                this.feature.predominantColor = this.feature.fillcolor;//calculateImageColor(this.feature);
                this.feature.iready = true;
                icons_load_counter--;
                if (icons_load_counter == 0)
                    loadmap(that);
            }
        i.img.src = i.url;
    }
}

this.load = function(url, reload, callback) {
    var that = this;
    last_url = url;
    this._is_reload = reload;
    this.reloadCallback = callback;

    $.ajax({
        url: url + (url.indexOf("?") > -1 ? "&" : "?") +
             "t=" + (new Date()).getTime() + (reload ? "&reload=1" : ""),
        context: this,
        success: function(s) {
            var mid = "";
            var unit = "";
            var startBound = null;
            var root = findFirst(s.childNodes);
            var rootLen = root.childNodes.length;
            var maxzoom = 100;
            var a;

            if (root.attributes) {
                for (a = 0; a < root.attributes.length; a++)
                {
                    if (root.attributes[a].name == "id") {
                        mid = root.attributes[a].value;
                    } else if (root.attributes[a].name == "unit") {
                        unit = root.attributes[a].value;
                        unitFactor = units[unit];
                    } else if (root.attributes[a].name == "maxzoom") {
                        maxzoom = parseInt(root.attributes[a].value, 10);
                    }
                }
            }
            this._mid = mid;

            if (unit === "degree") {
                lv.map.measure.options.calculateDistance = function (lat1, lon1, lat2, lon2) {
                    var p1 = that.fromLeafletCoords(new L.LatLng(lat1, lon1)),
                        p2 = that.fromLeafletCoords(new L.LatLng(lat2, lon2));

                    return lv.map.measure._haversine(p1.y, p1.x, p2.y, p2.x);
                };
            } else {
                lv.map.measure.options.calculateDistance = function (lat1, lon1, lat2, lon2) {
                    var p1 = that.fromLeafletCoords(new L.LatLng(lat1, lon1)),
                        p2 = that.fromLeafletCoords(new L.LatLng(lat2, lon2));
                    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
                };
                if (unit === "meter") {
                    lv.map.measure.options.labelFunction = function (latlng, current, segments, totalMeters) {
                        var total = totalMeters / 1000;

                        if (total > 1000) {
                            return Math.round(total) + "km";
                        } else if (total > 100) {
                            return Math.round(total * 10) / 10 + "km";
                        } else if (total > 10) {
                            return Math.round(total * 100) / 100 + "km";
                        } else {
                            return Math.round(total * 1000) + "m";
                        }
                    };
                    lv.map.measure.options.tipLabelFunction = function () {
                        return this.options.labelFunction(null, null, null, this._current);
                    };
                } else {
                    lv.map.measure.options.labelFunction = function (latlng, current, segments, total) {
                        var val;

                        if (total > 1000) {
                            val = Math.round(total);
                        } else if (total > 100) {
                            return Math.round(total * 10) / 10;
                        } else if (total > 10) {
                            return Math.round(total * 100) / 100;
                        } else {
                            return Math.round(total * 1000) / 1000;
                        }

                        switch (unit) {
                        case "foot":
                        case "us survey foot":
                        case "foot_us":
                            return val + " ft";
                        case "mile":
                            return val + " mi";
                        case "inch":
                            return val + " in";
                        case "yard":
                            return val + " yd";
                        default:
                            return val + " " + unit;
                        }
                    };
                }
            }

            var sources_a = [];
            sources_map = [];

            var hasStartBound = false;
            var tile0 = null;
            lv.map.copyrightControl._attributions = {};
            lv.map.copyrightControl._update();

            this.copyright = "";
            this.backgroundcolor = null;
            for (var i=0; i < rootLen; i++)
            {
                if (root.childNodes[i].tagName == "copyright") {
                    this.copyright = root.childNodes[i].text || root.childNodes[i].childNodes[1].textContent;
                    lv.map.copyrightControl._attributions = {};
                    lv.map.copyrightControl.addAttribution("&copy; " + this.copyright);
                    resetCopyright = false;
                } else if (root.childNodes[i].tagName == "sources") {
                    parseSources(root.childNodes[i].childNodes, sources_map, sources_a);
                } else if (root.childNodes[i].tagName == "bound") {
                    var bound = root.childNodes[i].attributes;
                    startBound = {};
                    for (a = 0; a < bound.length; a++) {
                        if (bound[a].name == "xmin")
                            startBound.xMin = parseFloat(bound[a].value);
                        else if (bound[a].name == "ymin")
                            startBound.yMin = parseFloat(bound[a].value);
                        else if (bound[a].name == "xmax")
                            startBound.xMax = parseFloat(bound[a].value);
                        else if (bound[a].name == "ymax")
                            startBound.yMax = parseFloat(bound[a].value);
                    }
                    hasStartBound = true;
                } else if (root.childNodes[i].tagName == "tile0") {
                    tile0 = {};
                    var t0 = root.childNodes[i].attributes;
                    for (a = 0; a < t0.length; a++) {
                        if (t0[a].name == "originx")
                            tile0.originx = parseFloat(t0[a].value);
                        else if (t0[a].name == "originy")
                            tile0.originy = parseFloat(t0[a].value);
                        else if (t0[a].name == "resolution")
                            tile0.resolution = parseFloat(t0[a].value);
                    }
                } else if (root.childNodes[i].tagName == "projection") {
                    this.projection = root.childNodes[i].getAttribute("value");
                }
            }

            if (!hasStartBound)
                startBound = {};
            var b = {};
            var max_extent;

            if (tile0 && !isNaN(tile0.originx) && !isNaN(tile0.originy) && !isNaN(tile0.resolution)) {
                max_extent = tile0.resolution*256*(unitFactor/3779.527559055);
                b.xmin = tile0.originx;
                b.ymin = tile0.originy;
                b.xmax = tile0.originx + max_extent;
                b.ymax = tile0.originy + max_extent;
                b.max = max_extent;
            } else {
                if (Math.abs(unitFactor-420735083.313146) <0.00001)
                    max_extent = 180;
                else
                    max_extent = 20037508.3427892*(unitFactor/3779.527559055);

                b.xmin = -max_extent;
                b.ymin = -max_extent;
                b.xmax = max_extent;
                b.ymax = max_extent;

                for (var i=0; i < sources_a.length; i++)
                {
                    if (b.xmin == undefined || sources_a[i].xmin*1 < b.xmin)
                        b.xmin = sources_a[i].xmin*1;
                    if (b.ymin == undefined || sources_a[i].ymin*1 < b.ymin)
                        b.ymin = sources_a[i].ymin*1;
                    if (b.xmax == undefined || sources_a[i].xmax*1 > b.xmax)
                        b.xmax = sources_a[i].xmax*1;
                    if (b.ymax == undefined || sources_a[i].ymax*1 > b.ymax)
                        b.ymax = sources_a[i].ymax*1;
                }

                var m1 = b.xmax-b.xmin;
                var m2 = b.ymax-b.ymin;
                if (m2 > m1) m1 = m2;
                b.max = m1;
            }

            var hasNonBasemap = false;
            var basemaps = ["osm","bing", "bing_sat", "gmaps","gmaps_sat","gmaps_terr","mapquest-osm",
                            "mapquest-oarial", "cloudmade_gray", "maps_for_free_relief",
                            "cloudmade_night", "tilejson"];

            for (var i=0; i < sources_a.length; i++) {
                if ($.inArray(sources_a[i].src,basemaps) == -1) hasNonBasemap = true;
            }

            var num_levels = Math.floor(Math.log(unitFactor/(256/b.max)/maxzoom)/Math.log(2.0));

            if (!this._is_reload || !bounds || bounds.xmin != b.xmin || bounds.ymin != b.ymin
                || bounds.xmax != b.xmax || bounds.ymax != b.ymax)
                this._reloadBound = null;

            bounds = b;

            for (var i=0; i < rootLen; i++)
            {
                if (root.childNodes[i].tagName == "layers")
                {
                    parseLayers(root.childNodes[i].childNodes, sources_map, mid, layers, num_levels);
                }
            }

            renderLayers(mid, layers, num_levels);

            for (var i=0; i < layers.length; i++)
            {
                if (layers[i].has_icon && layers[i].features)
                {
                    for (var f = 0; f < layers[i].features.length; f++)
                    {
                        if (layers[i].features[f].icon)
                        {
                            layers[i].features[f].icon_image = new Image();
                            layers[i].features[f].icon_image.feature = layers[i].features[f];
                            icons_to_load.push({img:layers[i].features[f].icon_image, url:layers[i].features[f].icon});
                        }
                    }
                }
            }

            for (var i=0; i < sources_a.length; i++)
            {
                if (!sources_a[i].visible || ($.inArray(sources_a[i].src,basemaps) > -1 && hasNonBasemap)
                    || hasStartBound) continue;

                var xmin = parseFloat(sources_a[i].xmin);
                var ymin = parseFloat(sources_a[i].ymin);
                var xmax = parseFloat(sources_a[i].xmax);
                var ymax = parseFloat(sources_a[i].ymax);

                if (xmin == 0 && ymin == 0 && xmax == 0 && ymax == 0) continue;

                if (startBound.xMin == undefined || xmin < startBound.xMin)
                    startBound.xMin = xmin;
                if (startBound.yMin == undefined || ymin < startBound.yMin)
                    startBound.yMin = ymin;
                if (startBound.xMax == undefined || xmax > startBound.xMax)
                    startBound.xMax = xmax;
                if (startBound.yMax == undefined || ymax > startBound.yMax)
                    startBound.yMax = ymax;
            }
            this._startBound = startBound;
            prepareForMap(this);
        }
    });
};

function sort_layers(order) {
    var tmp = [];

    for (var i = 0; i < layers.length; i++) {
        var c = layers[ order[i] ]._container;
        if (c) {
            layers[ order[i] ].setZIndex(layers.length-i);
        }
        tmp[i] = layers[ order[i] ];
    }

    for (var i = 0; i < layers.length; i++) {
        layers[i] = tmp[ layers.length - i - 1 ]
        layers[i].refId = i;
    }
}

function loadmap(that) {

    var sort_array = [];
    var should_sort = false;

    if (!that._reloadBound) {
        var b = that._startBound;
        that.setViewBound(b.xMin,b.yMin,b.xMax,b.yMax);
    }

    that._layersForUpdateCount = 0;
    for (var i=0; i < layers.length; i++) {
        if (layers[i].should_add && layers[i].isTileLayer) {
            that._layersForUpdateCount ++
        }
    }
    for (var i=0; i < layers.length; i++) {

        sort_array.unshift(layers[i].refId);

        if (layers[i].should_add) {
            layers[i].should_add = false;
            layers[i].viewer = that;
            layers[i].addTo(lv.map);
            should_sort = true;

            layers[i].features_original = [];
            for (var j = 0; j < layers[i].features.length; j++) {
                var c = {};
                for (var k in layers[i].features[j]) {
                    c[k] = layers[i].features[j][k];
                }
                layers[i].features_original[j] = c;
            }

            if (lv.map.options.zoomAnimation && L.TileLayer && (layers[i] instanceof L.TileLayer)) {
                if (!layers[i].options.visible) {
                    // if not visible, reduce number of active tile layers in leaflet
                    lv.map._tileLayersNum--;
                }
            }
        }
    }

    if (lv.map._loaded && should_sort) {
        sort_layers(sort_array);
    }

    loaded = true;

    if (that._is_reload) {
        fireEvent("reload", {id:that._mid});
    } else {
        fireEvent("load", {id:that._mid});
    }

    if (that.reloadCallback) {
        that.reloadCallback();
        that.reloadCallback = null;
    }
}


function parseSources(sources, sources_map, sources_a)
{
    for (var l = sources.length-1; l >= 0; l--)
    {
        var source = sources[l];
        if (source.tagName == "source")
        {
            var id = "";
            var b = new Array();
            for (var a = 0; a < source.attributes.length; a++)
            {
                if (source.attributes[a].name == "id")
                    id = source.attributes[a].value;
                b[source.attributes[a].name] = source.attributes[a].value;
            }
            sources_map[id] = b;
            sources_map[id].tileservers = [];

            for (var k = source.childNodes.length-1; k >= 0; k--)
            {
                if (source.childNodes[k].tagName == "tileservers")
                {
                    var n = source.childNodes[k];
                    if (n.attributes) {
                        for (var a = 0; a < n.attributes.length; a++)
                        {
                            if (n.attributes[a].name == "maxzoom") {
                                sources_map[id].maxzoom = parseInt(n.attributes[a].value);
                            }
                            if (n.attributes[a].name == "minzoom") {
                                sources_map[id].minzoom = parseInt(n.attributes[a].value);
                            }
                            if (n.attributes[a].name == "attribution") {
                                sources_map[id].attribution = n.attributes[a].value;
                            }
                        }
                    }
                    for (var j = source.childNodes[k].childNodes.length-1; j >= 0; j--)
                    {
                        var n = source.childNodes[k].childNodes[j];
                        if (n.attributes) {
                            for (var a = 0; a < n.attributes.length; a++)
                            {
                                if (n.attributes[a].name == "value") {
                                    sources_map[id].tileservers.push(n.attributes[a].value);
                                }
                            }
                        }
                    }
                }
                if (source.childNodes[k].tagName == "tilepath")
                {
                    var n = source.childNodes[k];
                    if (n.attributes) {
                        for (var a = 0; a < n.attributes.length; a++)
                        {
                            if (n.attributes[a].name == "value") {
                                sources_map[id].tilepath = n.attributes[a].value;
                            }
                        }
                    }
                }
            }
            sources_a.push(sources_map[id]);
        }
    }
}
var layer_data;
var layers_max_level = 1;

function parseLayers(layersSource, sources_map, mid, layers, num_levels)
{
    layer_data = [];
    for (var l = layersSource.length-1; l >= 0; l--)
    {
        var layer = layersSource[l];
        if (layer.tagName == "layer")
        {
            var o = { id: "", alpha: 1, visible: true };
            if (layer.attributes) {
                for (var a=0; a < layer.attributes.length; a++) {
                    if (layer.attributes[a].name == "id")
                        o.id = layer.attributes[a].value;
                    else if (layer.attributes[a].name == "src")
                        o.src = layer.attributes[a].value;
                    else if (layer.attributes[a].name == "timestamp")
                        o.timestamp = layer.attributes[a].value;
                    else if (layer.attributes[a].name == "offset")
                        o.offset = layer.attributes[a].value;
                    else if (layer.attributes[a].name == "precision")
                        o.precision = layer.attributes[a].value*1.0;
                    else if (layer.attributes[a].name == "dynamic")
                        o.dynamic = layer.attributes[a].value*1.0;
                    else if (layer.attributes[a].name == "visible")
                        o.visible = layer.attributes[a].value == "true";
                    else if (layer.attributes[a].name == "alpha")
                        o.alpha = parseInt(layer.attributes[a].value)/100.0;
                    else if (layer.attributes[a].name == "type")
                        o.type = layer.attributes[a].value;
                    else if (layer.attributes[a].name == "format")
                        o.format = layer.attributes[a].value;
                    else if (layer.attributes[a].name == "map")
                        o.map = layer.attributes[a].value;
                }
            }

            o.features = [];
            for (var i= 0; i <  layer.childNodes.length; i++)
            {
                if (layer.childNodes[i].tagName == "features")
                {
                    parseFeatures(layer.childNodes[i].childNodes, o);
                }
            }
            o.xmin = sources_map[o.src].xmin;
            o.ymin = sources_map[o.src].ymin;
            o.xmax = sources_map[o.src].xmax;
            o.ymax = sources_map[o.src].ymax;

            layer_data.push(o);
        }
    }
}

function checkIfLayerExists(layerData,layer)
{
    if (layer.id != layerData.id)
        return 0;
    else
        layerData.refId = layer.refId;

    if (layer.timestamp != layerData.timestamp) return 0;
    if (layer.xmin != layerData.xmin) return 0;
    if (layer.xmax != layerData.xmax) return 0;
    if (layer.ymin != layerData.ymin) return 0;
    if (layer.ymax != layerData.ymax) return 0;
    if (layer.features.length != layerData.features.length) return 0;

    return 2;
}

function renderLayers(mid, layers, num_levels) {


    for (var l = 0; l < layer_data.length; l++) {
        layer_data[l].prev_layer = null;
    }

    var last_layers_length = layers.length;

    for (var c = 0; c < layers.length; c++) {
        var cur_layer = layers[c];

        var should_remove = true;

        for (var l = 0; l < layer_data.length; l++) {
            var o = layer_data[l];
            if (checkIfLayerExists(o,cur_layer.layer_info)) {
                should_remove = false;
                o.prev_layer = cur_layer;
            }
        }

        if (should_remove) {
            lv.map.removeLayer(cur_layer);
            if (cur_layer.isTileLayer)
                tileLayerCount--;
            last_layers_length --;
        }
    }

    layers.length = 0;
    add_index = 0;
    for (var l = 0; l < layer_data.length; l++) {
        var o = layer_data[l];

        if (o.prev_layer) {
            layers[l] = o.prev_layer;
            layers[l].add_index = add_index++;
            continue;
        }

        layers[l] = null;
    }

    var has_tms = false;

    for (var l = 0; l < layer_data.length; l++) {

        var o = layer_data[l];

        if (o.visible)
            sources_map[o.src].visible = true;

        // IE opacity hack
        if (!flashnavigator.hasCanvas) {
            o.alpha = 100;
        }

        var src = sources_map[o.src].src;
        if (src == "osm" || src == "croatianq" || src == "gmaps" ||
            src == "gmaps_sat" || src == "gmaps_terr" || src == "gmaps_hybrid" || src == "bing" || src == "bing_sat" || src == "grajs" || src == "maps_for_free_relief" ||
            src == "mapquest-osm" || src=="mapquest-oarial" || src=="cloudmade_gray" || src=="cloudmade_night" || src == "tilejson") {
            has_tms = true;
        }

        if (layers[l]) continue;

        if (o.type == "raster") {
            if (!o.format) o.format = "swf";
            var lay = new fnRasterLayer(giscloud_tile_url+"r/"+o.timestamp+"/"+mid+"/"+o.id+"/{z}/{x}/{y}."+o.format,
                                        {noWrap:true, visible:o.visible, opacity:o.alpha, maxZoom: num_levels});
            lay.id = o.id;
            lay.source = sources_map[o.src];
        }
        else if (src == "osm")
        {
            var lay = new fnLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha,
                                   attribution:
                                   o.visible ? "<a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap</a>" : ""});
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }

        else if (src == "cloudmade_gray")
        {
            var lay = new fnLayer("http://{s}.tile.cloudmade.com/{key}/22677/256/{z}/{x}/{y}.png",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha,
                                   attribution: (o.visible ? 'Map data &copy; 2011 OpenStreetMap contributors, ' +
                                                 'Imagery &copy; 2011 CloudMade' : ""),
                                   key: 'd962ac9332ae40b29b77f41aa3b67ca9'
                                  });
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }

        else if (src == "cloudmade_night")
        {
            var lay = new fnLayer("http://{s}.tile.cloudmade.com/{key}/65053/256/{z}/{x}/{y}.png",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha,
                                   attribution: (o.visible ? 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade' : ""),
                                   key: 'd962ac9332ae40b29b77f41aa3b67ca9'
                                  });
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }


        else if (src == "mapquest-osm")
        {
            var lay = new fnLayer("http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha, subdomains:'1234',
                                   attribution: o.visible ?
                                   "<a href='http://developer.mapquest.com/' target='_blank'>MapQuest</a>" : ""
                                   });
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }
        else if (src == "mapquest-oarial")
        {
            var lay = new fnLayer("http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha, subdomains:'1234',
                                   attribution:
                                   o.visible ? "<a href='http://developer.mapquest.com/' target='_blank'>MapQuest</a>" : ""
                                  });
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }
        else if (src == "croatianq")
        {
            var lay = new fnLayer("http://dhwov6czq254q.cloudfront.net/gettile.php?t=tilestache88/{z}/{x}/{y}.png",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha,
                                  attribution:
                                   o.visible ? " &copy; <a href='http://www.navteq.com' target='_blank'>NAVTEQ</a>" : ""}
                                 );
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }

        else if (src == "italia")
        {
            var lay = new fnLayer("http://webgis.regione.sardegna.it/tms/ortofoto2006_EPSG3003/{z}/{x}/{y}.jpg",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha, continuousWorld:true,
                                  attribution:
                                   o.visible ? " &copy; <a href='http://www.italia' target='_blank'>NAVTEQ</a>" : ""}
                                 );
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }


        else if (src == "grajs")
        {
            var lay = new fnLayer("http://dhwov6czq254q.cloudfront.net/gettile.php?t=tilestache17403/{z}/{x}/{y}.png",
                                  {maxZoom: 18, noWrap:true, visible:o.visible, opacity:o.alpha,
                                  attribution:
                                   o.visible ? " &copy; <a href='http://www.grajsmape.com' target='_blank'>Grajs Mape</a>" : ""}
                                 );
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 18)
                num_levels = 18;
        }
        else if (src == "maps_for_free_relief")
        {
            var lay = new fnLayer("http://maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg",
                                  {maxZoom: 11, noWrap:true, visible:o.visible, opacity:o.alpha,
                                  attribution:
                                   o.visible ? " <a href='http://www.maps-for-free.com/html/about.html' target='_blank'>Maps-For-Free Relief</a>" : ""}
                                 );
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 11)
                num_levels = 11;
        }

        else if (src == "gmaps")
        {
            lay = new fnGoogleLayer({maxZoom: 22, noWrap:true, visible:o.visible, opacity:o.alpha,
                                     google_map_type: 'ROADMAP'});
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 22)
                num_levels = 22;
        }
        else if (src == "gmaps_sat")
        {
            lay = new fnGoogleLayer({maxZoom: 20, noWrap:true, visible:o.visible, opacity:o.alpha,
                                     google_map_type: 'SATELLITE'});
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 20)
                num_levels = 20;
        }
        else if (src == "gmaps_terr")
        {
            lay = new fnGoogleLayer({maxZoom: 15, noWrap:true, visible:o.visible, opacity:o.alpha,
                                     google_map_type: 'TERRAIN'});
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 15)
                num_levels = 15;
        }

        else if (src == "gmaps_hybrid")
        {
            lay = new fnGoogleLayer({maxZoom: 20, noWrap:true, visible:o.visible, opacity:o.alpha,
                                     google_map_type: 'HYBRID'});
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 20)
                num_levels = 20;
        }

        else if (src == "bing")
        {
            var lay = new fnQuadLayer(
                (window.location.protocol == "https:" ? "https:" : "http:") +
                    "//ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=811&mkt=en-us&lbl=l1&stl=h&shading=hill&n=z",
                { minZoom: 1, maxZoom: 19, noWrap:true, visible:o.visible, subdomains: '0123', opacity:o.alpha,
                 attribution:
                 o.visible ? ("<a href='http://maps.bing.com/' target='_blank'>Bing Maps</a>"+
                              "&nbsp;Â© NAVTEQ, Â© Microsoft Corporation") : ""
                });
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 19)
                num_levels = 19;
        }
        else if (src == "bing_sat")
        {
            var lay = new fnQuadLayer(
                (window.location.protocol == "https:" ? "https:" : "http:")  +
                    "//ak.t{s}.tiles.virtualearth.net/tiles/a{q}?g=1457&n=z",
                { minZoom: 1, maxZoom: 19, noWrap:true, visible:o.visible, subdomains: '0123', opacity:o.alpha,
                 attribution:
                 o.visible ? ("<a href='http://maps.bing.com/' target='_blank'>Bing Maps Satellite</a>"+
                              "© Microsoft Corporation") : ""
                });
            lay.id = o.id;
            lay.source = sources_map[o.src];
            if (num_levels > 19)
                num_levels = 19;
        }
        else if (src == "wms" ||  (sources_map[o.src].tilepath || sources_map[o.src].tilepath == ""))
        {
            var lay = new fnWmsLayer(
                sources_map[o.src].tileservers[0] + sources_map[o.src].tilepath,
                {maxZoom: num_levels, noWrap:true, visible:o.visible, subdomains: '0123', opacity:o.alpha,
                 gctms:sources_map[o.src].src === "tms"});
            lay.id = o.id;
            lay.source = sources_map[o.src];
        }
        else if (src == "tilejson")
        {
            var source = sources_map[o.src];
            var lay = new fnLayer(source.tileservers,
                                  {maxZoom: source.maxzoom, noWrap:true, visible:o.visible, opacity:o.alpha,
                                   attribution: source.attribution});
            lay.id = o.id;
            lay.source = source;
            if (num_levels > source.maxzoom)
                num_levels = source.maxzoom;
        } else {
            var lay = new fnTileLayer(
                {"mid":o.map || mid,"id":o.id,"modified":o.timestamp,"lmap":lv.map,
                 maxZoom: num_levels,
                 offset: o.offset,
                 visible:o.visible,
                 precision:o.precision,
                 cluster:o.cluster,
                 dynamic:o.dynamic,
                 opacity:o.alpha,
                 source:sources_map[o.src]
                 });

            if (layers_feature_filter[o.id])
                lay.setFeatureFilter(layers_feature_filter[o.id]);
            lay.isTileLayer = true;
            tileLayerCount ++;
        }

        lay.features = o.features;
        lay.has_icon = o.has_icon;
        lay.layer_info = o;
        lay.should_add = true;

        layers[l] = lay;
    }

    if (has_tms) {
        lv.map.options.crs = L.CRS.EPSG3857;
    } else {
        lv.map.options.crs = L.CRS.EPSG4326;
    }

    for (var i = 0; i < layers.length; i++) {
        layers[i].refId = i;
        if (layers[i].options.maxZoom > num_levels)
            layers[i].options.maxZoom = num_levels;
    }

    layers_max_level = num_levels;
}

function parseFeatures(features, lay)
{
    lay.features = new Array();
    for (var f = 0; f < features.length; f++)
    {
        var feature = features[f];
        if (feature.tagName != "feature") continue;

        var fobj = {};
        if (feature.attributes) {
            for (var a=0; a < feature.attributes.length; a++)
            {
                if (feature.attributes[a].name == "icon")
                {
                    fobj.icon = feature.attributes[a].value;
                    lay.has_icon = true;
                    //lay.options.zoomAnimation = false;
                } else if (feature.attributes[a].name == "outline") {
                    fobj.outline = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "color") {
                    fobj.color = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "strokecolor") {
                    fobj.strokecolor = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "innerstrokecolor") {
                    fobj.innerstrokecolor = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "fillcolor") {
                    fobj.fillcolor = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "linewidth") {
                    fobj.linewidth = feature.attributes[a].value*1;
                } else if (feature.attributes[a].name == "innerlinewidth") {
                    fobj.innerlinewidth = feature.attributes[a].value*1;
                } else if (feature.attributes[a].name == "width") {
                    fobj.width = feature.attributes[a].value*1;
                } else if (feature.attributes[a].name == "anchor") {
                    fobj.anchor = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "dx") {
                    fobj.dx = feature.attributes[a].value*1;
                } else if (feature.attributes[a].name == "dy") {
                    fobj.dy = feature.attributes[a].value*1;
                } else if (feature.attributes[a].name == "type") {
                    fobj.type = feature.attributes[a].value;
                } else if (feature.attributes[a].name == "text" || feature.attributes[a].name == "label") {
                    //lay.options.zoomAnimation = false;
                } else if (feature.attributes[a].name == "clustering") {
                    fobj.clustering = parseInt(feature.attributes[a].value);
                }
            }
        }
        lay.features.unshift(fobj);
    }
}
events = [];
function fireEvent(e,obj) {

    if (!events[e]) return;

    for (var i = 0; i < events[e].length;i++) {
        events[e][i](obj);
    }
}

var dragging = 0;
lv.map.on("dragstart", function() {
    dragging = 1;
});
lv.map.on("dragend", function() {
    dragging = 0;
});

function calcMousePosition(e)
{
    var pb = lv.map.getPixelBounds();

    return { x: (pb.min.x + e.layerPoint.x + lv.map._mapPane._leaflet_pos.x)/256,
             y: (pb.min.y + e.layerPoint.y + lv.map._mapPane._leaflet_pos.y)/256 };
}

var last_mp;

function processMousePosition(e, force, offset) {
    if (!loaded || !lv.map._layers || lv.map._layers.length == 0) return 0;

    e.mp = calcMousePosition(e);
    last_mp = e.mp;

    var tx = Math.floor(e.mp.x);
    var ty = Math.floor(e.mp.y);

    e.offsetX = 256*(e.mp.x-tx);
    e.offsetY = 256*(e.mp.y-ty);

    e.showMousePointer = 0;
    lastHoveredObjects.length = 0;
    for (var k = 0; k < hoveredObjects.length; k++) {
        lastHoveredObjects.push(hoveredObjects[k]);
    }
    hoveredObjects.length = 0;

    for (var id = 0; id < layers.length; id ++) {
        if (layers[id]._tiles &&
            layers[id].options.visible &&
            layers[id]._tiles[tx+":"+ty] &&
            layers[id]._tiles[tx+":"+ty].obj) {

            e.currentTile = layers[id]._tiles[tx+":"+ty];

            var elems = layers[id]._tiles[tx+":"+ty].obj.onMouseMove(e, force, offset);
            if (elems)
            {
                elems[0]._offset = e.currentTile._offset;
                elems[0].coord = e.currentTile.coord;
                hoveredObjects.push(elems);
                e.showMousePointer = 1;
            }
        }
    }
    return 1;
}

function processObjectEvents(evt, evt_name, objects) {
    objects = objects || hoveredObjects;
    if (events[evt_name]) {
        var m = (1 << lv.map._zoom);
        for (var k = objects.length-1; k >= 0; k--) {
            for (var e = 0; e < objects[k].length; e++) {
                var obj = objects[k][e];
                var o = {id:obj.c ? obj.c.replace("_","||") : '', object: obj};
                if (last_mp) {
                    o.x = bounds.xmin+bounds.max*last_mp.x/m;
                    o.y = bounds.ymax-bounds.max*last_mp.y/m;
                    if (obj.coord) {
                        o.bounds = {
                            xmin: bounds.xmin + ((o.object.b.xmin - obj._offset)/256.0
                                                 + obj.coord.x)*bounds.max/m,
                            xmax: bounds.xmin + ((o.object.b.xmax - obj._offset)/256.0
                                                 + obj.coord.x)*bounds.max/m,
                            ymin: bounds.ymax - ((o.object.b.ymax - obj._offset)/256.0
                                                 + obj.coord.y)*bounds.max/m,
                            ymax: bounds.ymax - ((o.object.b.ymin - obj._offset)/256.0
                                                 + obj.coord.y)*bounds.max/m
                        };
                    }
                }
                if (evt.ctrlKey) {
                    o.key = 17;
                }
                fireEvent(evt_name, o);
                return;
            }
        }
    }
}

var target = $(lv.map._container);
var hoveredObjects = new Array();
var lastHoveredObjects = new Array();
var touchTimer;
var touchStartPosition;
var touchEvt;
var readyForClick;

function doTap() {
    if (!processMousePosition(touchEvt, true, 10)) return;
    processObjectEvents(touchEvt,"object_click");
}

$(lv.map._mapPane).on("touchstart", function(e){

    if (e.originalEvent.targetTouches.length != 1) return;

    touchEvt = e.originalEvent.targetTouches[0];
    touchStartPosition = {x:touchEvt.pageX,y:touchEvt.pageY};
    touchEvt.layerPoint = lv.map.mouseEventToLayerPoint(touchEvt);

    window.clearTimeout(touchTimer);
    touchTimer = window.setTimeout(doTap, 200);

    if (touchEvt.layerPoint) {
        touchEvt.mp = calcMousePosition(touchEvt);
        if (events["mousemove"]) {
            var m = (1 << lv.map._zoom);
            fireEvent("mousemove",{ x : bounds.xmin+bounds.max*touchEvt.mp.x/m,
                                    y : bounds.ymax-bounds.max*touchEvt.mp.y/m });
        }
    }
});

$(lv.map._mapPane).on("touchend", function(e) {
    window.clearTimeout(touchTimer);

    if (touchEvt)
        doTap();
});

$(lv.map._mapPane).on("touchmove", function(e) {
    var evt = e.originalEvent.targetTouches[0];
    var dx = Math.abs(evt.pageX - touchStartPosition.x);
    var dy = Math.abs(evt.pageY - touchStartPosition.y);

    if (dx > 2 || dy > 2) {
        touchEvt = null;
        window.clearTimeout(touchTimer);
    }
});

if (!common.isMobileBrowser) {

    var lastObjectOver = null;
    lv.map.on("mousemove",function(e) {
        if (!selectionEnabled || dragging || !processMousePosition(e)) return 0;

        if (e.showMousePointer) {
            lv.map._container.style.cursor = "pointer";
            processObjectEvents(e, "object_over");
            lastObjectOver = e;
        }
        else {
            if (!flashnavigator.hasCanvas && (that._currentTool == 'InfoTool' ||that._currentTool == 'SelectTool'))
                lv.map._container.style.cursor = "default";
            else
                lv.map._container.style.cursor = "";
            if (lastObjectOver) {
                processObjectEvents(lastObjectOver, "object_out", lastHoveredObjects);
                lastObjectOver = null;
            }
        }

        if (events["mousemove"]) {
            var m = (1 << lv.map._zoom);

            var evt = { x : bounds.xmin+bounds.max*e.mp.x/m,
                        y : bounds.ymax-bounds.max*e.mp.y/m };

            fireEvent("mousemove",evt);
        }
        readyForClick = false;
    });

    lv.map.on("dblclick",function(e) {
        processObjectEvents(e, "object_dblclick");
    });

    target.mouseup(function(e) {
        if (readyForClick) {
            processObjectEvents(e, "object_click");
        }
    });
}

lv.map.on("mousedown",function(e) {
    readyForClick = true;
    if (!processMousePosition(e)) return 0;

    if (events["mousedown"]) {
        var m = (1 << lv.map._zoom);

        var evt = { x : bounds.xmin+bounds.max*e.mp.x/m,
                    y : bounds.ymax-bounds.max*e.mp.y/m };

        fireEvent("mousedown",evt);
    }
});

this.addEventListener = function(evt,obj) {
    if (evt == "scalechange")
    {
        if (!events["scalechange"])
        {
            events["scalechange"] = new Array();
            lv.map.on("zoomend",function(e){
                var evt = new Object();
                if (bounds && bounds.max)
                    evt.zoom = Math.pow(2,lv.map._zoom)*256/bounds.max;
                fireEvent("scalechange",evt);
            });
        }
    }
    else
    {
        if (!events[evt])
            events[evt] = new Array();
    }
    events[evt].push(obj);
};

this.removeEventListener = function (evt, f) {
    var i, l, handlers = events[evt];
    if (handlers) {
        for (i = 0, l = handlers.length; i < l; i++) {
            if (handlers[i] === f) {
                // remove array item
                handlers.splice(i, 1);
                // reduce counter and total length vars beacuse of the removed element
                i--;
                l--;
            }
        };
    }
}




}


    fnPrinter2 = function (fn) {};
    fnBitmap2  = function (fn) {};
    fnSlider2  = function (fn) {};

    flashnavigator2 = {};
    flashnavigator2.html5 = true;
    flashnavigator2.include = function() {};
    flashnavigator2.setOptions = function(opts) {
        flashnavigator2.extraOptions = opts;
    }

    flashnavigator2.container = function(cont,b) {

        var leafletOptions = {
            maxZoom: 25,
            zoom: 0,
            latloncrs: true,
            center: new giscloud.LonLat(0,0),
            host: giscloud_tile_url,
            background: "#fff",
            attribution:{prefix: "Powered by <a href='http://www.giscloud.com/' target='_blank'>GIS Cloud</a>"}
        };

        if (flashnavigator2.extraOptions && flashnavigator2.extraOptions.lockZoom) {
            leafletOptions.lockZoom = true;
        }

        lv = new giscloud.Viewer.Leaflet(
            cont,
            null,
            leafletOptions
        );

        lv.onViewerLoad = b;

        lv.init.done(function() {
            init();
            lv.onViewerLoad.onLoad();
        });
    };

        units = new Array();
units_label = new Array();
var mtopx = 3779.527559055;

units["meter"] = mtopx; units_label["meter"] = "m";
units["kilometer"] = mtopx * 1000; units_label["kilometer"] = "km";
units["centimeter"] = mtopx * .01; units_label["centimeter"] = "cm";
units["degree"] = mtopx * 111319.49079327357264771338267056;  units_label["degree"] = "Â°";
units["foot"] = mtopx * .3048; units_label["foot"] = "ft";
units["foot_us"] = mtopx * .30480061; units_label["foot_us"] = "ft";
units["mile"] = mtopx * 1609.344; units_label["mile"] = "m";
units["inch"] = mtopx * .0254; units_label["mile"] = "\"";
units["yard"] = mtopx * .9144;
units["link_ben"] = mtopx * .201167651;
units["link_srs"] = mtopx * .201167651;
units["ind_yard"] = mtopx * .914398554;
units["srs_yard"] = mtopx * .914398415;
units["fathom"] = mtopx * 1.8288;

unitFactor = units["meter"];
unit = "meter";

function calculateImageColor(imgs) {
    try
    {
        var img = imgs.icon_image;
        var c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        ctx.drawImage(img,0,0);

        var imgd = ctx.getImageData(0, 0, c.width, c.height);
        var pix = imgd.data;

        var r = 0, g = 0, b = 0;
        var count = 0;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            if (pix[i+3] > 0) {
                r += pix[i  ]; // red
                g += pix[i+1]; // green
                b += pix[i+2]; // blue
                count ++;
            }
        }

        return giscloud.Color.rgbToHex(Math.floor(r/count),
                                       Math.floor(g/count),
                                       Math.floor(b/count));
    }
    catch (a)
    {
        return giscloud.Color.rgbToHex(255,
                                       255,
                                       255);
    }
}



        flashnavigator = flashnavigator2;
        flashnavigator.html5Compatible = true;
        flashnavigator.hasCanvas = !!document.createElement('canvas').getContext;
        if (!flashnavigator.hasCanvas) {
            giscloud.includeJs("/libs/raphael/raphael-min.js");
        }
        flashnavigator.ready = function()
        {
            fnLayer = fnLayer2;
            fnMarker = fnMarker2;
            fnAgent = fnAgent2;
            fnCanvas = fnCanvas2;
            fnPrinter = fnPrinter2;
            fnBitmap = fnBitmap2;
            fnTooltip = fnTooltip2;
            fnSlider = fnSlider2;
            fnKartehr = function() { this.liveSite = function(){}; };
        }
        fnViewer = fnViewer2;
        flashnavigator.html5Enabled = true;



}(window, giscloud.exposeJQuery(), giscloud.common()));


(function ($, common) {

    giscloud.rest = {
        get: $.proxy(common.rest.get, common.rest)
    };

}(giscloud.exposeJQuery(), giscloud.common()));
(function (window, $, common, undefined) {
    var m, token, authHost, onauthcallback, windowId, oauthUrl, authWin, rpc, signingIn,
        frameId, buttonContainer, cssLoaded = false, redirectUriError = false, check_for_oauth_iframe = false;


    // check if this is inside the oauth frame
    try {
        check_for_oauth_iframe = (window !== window.parent &&
                window.parent.giscloud && window.parent.giscloud.oauth2 &&
                window.name === window.parent.giscloud.oauth2.frameId());
    } catch(e) { }


    if (check_for_oauth_iframe) {

        //
        // inside oauth frame
        //
        if (document.location.search.indexOf("error=redirect_uri_mismatch") > -1) {

            // uri mismatch
            window.parent.giscloud.oauth2.uriMismatch(document.location);

        } else {

            // retrieve token
            m = document.location.href.match(/access_token=(\w+)/);
            token = m && m[1];
            window.parent.giscloud.oauth2.setToken(token, document.location);

        }

    } else if (document.location.search.indexOf("error=redirect_uri_mismatch") > -1) {

        // uri mismatch
        window.parent.giscloud.oauth2.uriMismatch(document.location);

    } else {

        //
        // not in the oauth frame - create the oauth object
        //

        authHost = common.authHost();

        giscloud.oauth2 = {

            token: function (tok) {
                if (tok) {
                    token = tok;
                    return this;
                } else {
                    return token;
                }
            },

            frameId: function () {
                return frameId;
            },

            authorize: function (appId, callback, onDone) {
                var iframe, rdirUrl, tt = common.oid();
                onauthcallback = callback;

                if (!cssLoaded) {
                    giscloud.includeCss(common.apiHost() + "/assets/api/1/auth.css");
                    cssLoaded = true;
                }

                if (token === undefined || token === null) {
                    windowId = "win_" + tt;
                    frameId = "frame_" + windowId;
                    rdirUrl = (window.location.protocol == "https:" ? "https:" : "http:") +
                        '//' + window.location.hostname + window.location.pathname;

                    oauthUrl = authHost +
                        "/oauth/authorize?client_id=" + appId +
                        "&redirect_uri=" + rdirUrl +
                        "?nch=" + Math.random() +
                        "&response_type=token&fr=" + frameId;

                    iframe = $('<iframe name="' + frameId + '" id="' + frameId +
                        '" style="position:absolute;visibility:hidden;width:1px;height:1px;"></iframe>');
                    if (onDone !== undefined) {
                        iframe.one("load", onDone);
                    }

                    $("body").append(iframe);
                    iframe.attr("src", oauthUrl + "&authorize=true");

                }
                return this;
            },

            signIn: function (options) {
                var winProps, url;

                options = options || {};

                // set remote url
                if (typeof options.template === "string") {
                    url = oauthUrl + "&template=" + options.template;
                } else {
                    url = oauthUrl;
                }

                // create remote iframe or open a popup
                if (typeof options.iframeContainer === "string" && $("#" + options.iframeContainer).length > 0) {
                    // set up deferred
                    signingIn = new $.Deferred();
                    signingIn.then(options.onSuccess, options.onCancel);

                    // set up xdm rpc which will open the iframe as well
                    if (rpc) {
                        rpc.destroy();
                    }
                    rpc = new easyXDM.Rpc({
                            remote: url,
                            container: $("#" + options.iframeContainer)[0],
                            props: options.frameProperties,
                            onReady: options.onReady,
                            channel: frameId
                        }, {
                            remote: {
                                invalidCredentials: {}
                            },
                            local: {
                                onCancel: function () {
                                    signingIn.reject();
                                },
                                onAuthStart: function () {
                                    // if the token is not set after the oauth frame is reloaded
                                    // it means the authorization has failed
                                    $("#" + frameId).one("load", function () {
                                        if (!token) {
                                            rpc.invalidCredentials();
                                        } else {
                                            signingIn.resolve();
                                        }
                                    });
                                }
                            }
                        });

                } else {
                    winProps = "status=1, toolbar=1,  width=450, height=400";
                    authWin = window.open(url, windowId, winProps);
                }
            },

            signOut: function(callback){
                var frame, dfrd;

                frame = $("#" + frameId);
                dfrd = new $.Deferred();
                if (typeof callback == "function") {
                    dfrd.done(callback);
                }
                token = null;

                frame.one("load", function () { dfrd.resolve(); });
                frame.attr("src", authHost + "/oauth/sign_out?redirect_uri=" + window.location.href);

                return dfrd.promise();
            },

            setToken: function(tok, frameLocation){
                token = tok;
                //this.initialized = true;
                if (authWin) {
                    authWin.close();
                    authWin = null;
                }
                if (typeof onauthcallback == "function") {
                    onauthcallback(token);
                }
                if (frameLocation) {
                    frameLocation.href = authHost + "/oauth/blank";
                }
                this.button(buttonContainer);
            },

            uriMismatch: function(frameLocation){
                redirectUriError = true;
                if (frameLocation) {
                    frameLocation.href = authHost + "/oauth/blank";
                }
                if (typeof onauthcallback == "function") {
                    onauthcallback();
                }
            },

            thisIsOauthFrame: function () {
                return check_for_oauth_iframe;
            },

            button: function(container, signInOptions){
                var b, c;

                buttonContainer = container;

                //if (!this.initialized) {
                //    return;
                //}

                b = $("<div/>", {
                    "class": "gc-auth-button"
                });

                if (redirectUriError) {
                    b.addClass("gc-redirect-uri-mismatch");
                    b.append("This is not a registered<br/>GIS Cloud app.");
                }
                else
                    if (token) {
                        b.addClass("gc-authorized");
                        b.append("You are signed in. <a href='#'>Sign out.</a>");
                        b.click(function(evt){
                            giscloud.oauth2.signOut();
                            evt.preventDefault();
                        });
                    }
                    else {
                        b.click(function(evt){
                            giscloud.oauth2.signIn(signInOptions);
                            evt.preventDefault();
                        });
                    }
                if (container) {
                    c = $("#" + container);
                    if (c.length) {
                        c.html("");
                        c.append(b);
                    }
                    return this;
                }
                else {
                    return b;
                }
            }
        };
    }
})(window, giscloud.exposeJQuery(), giscloud.common());

(function ()     {

    giscloud.LonLat = function (lon, lat) {
        if (lon instanceof giscloud.LonLat) {
            this.lon = lon.lon;
            this.lat = lon.lat;
        } else {
            this.lon = isNaN(lon) ? null : lon;
            this.lat = isNaN(lat) ? null : lat;
        }
    };

    giscloud.LonLat.prototype = {
        /*
         * Method: toArray
         * Returns an [lon, lat] array.
         */
        toArray: function () {
            return [this.lon, this.lat];
        },

        /* Method: toString
         * Returns a "lon, lat" string.
         */
        toString: function (rndDigits) {
            var m;
            if (rndDigits !== undefined) {
                m = Math.pow(10, rndDigits);
                return (Math.round(this.lon * m) / m) + ", " + (Math.round(this.lat * m) / m);
            } else {
                return this.lon + ", " + this.lat;
            }
        },

        clone: function () {
            return new giscloud.LonLat(this);
        },

        toBounds: function (buffer) {
            buffer = (isNaN(buffer) || buffer === null) ? 0 : buffer;
            return new giscloud.Bounds(
                this.lon - buffer,
                this.lat - buffer,
                this.lon + buffer,
                this.lat + buffer
            );
        },

        equals: function (lonlat) {
            return lonlat instanceof giscloud.LonLat && this.lon === lonlat.lon && this.lat === lonlat.lat;
        },

        valid: function () {
            return !(isNaN(this.lon) || isNaN(this.lat));
        }
    };

    giscloud.LonLat.parse = function (str) {
        var s;
        if (typeof str === "string") {
            s = str.split(",");
            if (s.length === 2) {
                return new giscloud.LonLat(
                    parseFloat(s[0]),
                    parseFloat(s[1])
                );
            }
        }
        return null;
    };

    giscloud.Bounds = function (left, bottom, right, top) {
        if (left instanceof giscloud.Bounds) {
            this.left = left.left;
            this.bottom = left.bottom;
            this.right = left.right;
            this.top = left.top;
        } else {
            this.left = (typeof left === "number") ? left : (parseFloat(left));
            this.bottom = (typeof bottom === "number") ? bottom : (parseFloat(bottom));
            this.right = (typeof right === "number") ? right : (parseFloat(right));
            this.top = (typeof top === "number") ? top : (parseFloat(top));
        }
    };

    giscloud.Bounds.prototype = {
        /*
         * Method: width
         * Returns the width of the bounds.
         */
        width: function (w, proportional) {
            var old, halfDelta, h;

            if (w == null) {
                if (isFinite(this.left) && isFinite(this.right)) {
                    return Math.abs(this.right - this.left);
                } else {
                    return null;
                }
            }

            if (isFinite(this.left) && isFinite(this.right)) {
                old = Math.abs(this.right - this.left);
                halfDelta = (w - old) / 2;

                this.left = this.left - halfDelta;
                this.right = this.right + halfDelta;

                if (proportional) {
                    h = this.height();
                    this.height(h * w / old);
                }
            }

            return this;
        },

        /*
         * Method: height
         * Returns the height of the bounds.
         */
        height: function (h, proportional) {
            var old, halfDelta, w;

            if (h == null) {
                if (isFinite(this.top) && isFinite(this.bottom)) {
                    return Math.abs(this.top - this.bottom);
                } else {
                    return null;
                }
            }

            if (isFinite(this.top) && isFinite(this.bottom)) {
                old = Math.abs(this.top - this.bottom);
                halfDelta = (h - old) / 2;

                this.bottom = this.bottom - halfDelta;
                this.top = this.top + halfDelta;

                if (proportional) {
                    w = this.width();
                    this.width(w * h / old);
                }
            }

            return this;
        },

        /*
         * Method: center
         * Get or sets a <LonLat> of the center of the bounds.
         */
        center: function (cen) {
            var w, h, curr, dh, dv;

            if (this.isPoint()) {
                if (cen == null) {
                    return new giscloud.LonLat(this.left, this.bottom);
                } else {
                    this.left = this.right = cen.lon;
                    this.top = this.bottom = cen.lat;
                    return this;
                }
            } else {
                w = this.width();
                h = this.height();
                curr = new giscloud.LonLat((this.left + w / 2.0), (this.bottom + h / 2.0));

                if (cen == null) {
                    return curr;
                } else {
                    dh = cen.lon - curr.lon;
                    dv = cen.lat - curr.lat;
                    this.left += dh;
                    this.right += dh;
                    this.top += dv;
                    this.bottom += dv;
                    return this;
                }
            }
        },

        isPoint: function() {
            return this.left === this.right && this.top === this.bottom;
        },

        valid: function () {
            return !(isNaN(this.left) || isNaN(this.bottom) || isNaN(this.right) || isNaN(this.top));
        },

        include: function (location, buffer) {
            buffer = (isNaN(buffer) || buffer === null) ? 0 : buffer;
            if (location instanceof giscloud.LonLat) {
                this.left = Math.min(location.lon - buffer, this.left);
                this.bottom = Math.min(location.lat - buffer, this.bottom);
                this.right = Math.max(location.lon + buffer, this.right);
                this.top = Math.max(location.lat + buffer, this.top);
            } else if (location instanceof giscloud.Bounds) {
                this.left = Math.min(location.left - buffer, this.left);
                this.bottom = Math.min(location.bottom - buffer, this.bottom);
                this.right = Math.max(location.right + buffer, this.right);
                this.top = Math.max(location.top + buffer, this.top);
            }
            return this;
        },

        clone: function () {
            return new giscloud.Bounds(this);
        },

        /*
         * Method: toArray
         * Returns an [left, bottom, right, top] array.
         */
        toArray: function () {
            return [this.left, this.bottom, this.right, this.top];
        },

        /*
         * Method: toString
         * Returns an "left, bottom, right, top" string.
         */
        toString: function (rndDigits) {
            var m;
            if (rndDigits !== undefined) {
                m = Math.pow(10, rndDigits);
                return (Math.round(this.left * m) / m) + ", " + (Math.round(this.bottom * m) / m) + (Math.round(this.right * m) / m) + ", " + (Math.round(this.top * m) / m);
            } else {
                return this.left + ", " + this.bottom + ", " + this.right + ", " + this.top;
            }
        }
    };

    giscloud.Bounds.parse = function (str) {
        var s;
        if (typeof str === "string") {
            s = str.split(",");
            if (s.length === 4) {
                return new giscloud.Bounds(
                    parseFloat(s[0]),
                    parseFloat(s[1]),
                    parseFloat(s[2]),
                    parseFloat(s[3])
                );
            }
        }
        return null;
    };

}());
(function () {
    var GiscloudGeometry;

    giscloud.geometry = {
        Point: function (x, y, z) {
            this.x = x;
            this.y = y;
            if (z != null) {
                 this.z = z;
             }
        },

        Multipoint: function (points) {
            this.points = points;
        },

        Line: function (points) {
            this.points = points;
        },

        Multiline: function (lines) {
            this.lines = lines;
        },

        Polygon: function (rings) {
            this.rings = rings;
        },

        Multipolygon: function (polygons) {
            this.polygons = polygons;
        },

        GeometryCollection: function (geometries) {
            this.geometries = geometries;
        },

        hasZ: function (geom) {
            var i, l;

            if (geom instanceof giscloud.geometry.Point && geom.x != null && geom.y != null) {

                return geom.z != null;

            } else if (geom instanceof giscloud.geometry.Multipoint && geom.points != null) {

                for (i = 0, l = geom.points.length; i < l; i++) {
                    if (geom.points[i].hasZ()) {
                        return true;
                    }
                }
                return false;

            } else if (geom instanceof giscloud.geometry.Line && geom.points != null) {

                for (i = 0, l = geom.points.length; i < l; i++) {
                    if (geom.points[i].hasZ()) {
                        return true;
                    }
                }
                return false;

            } else if (geom instanceof giscloud.geometry.Multiline && geom.lines != null) {

                for (i = 0, l = geom.lines.length; i < l; i++) {
                    if (geom.lines[i].hasZ()) {
                        return true;
                    }
                }
                return false;

            } else if (geom instanceof giscloud.geometry.Polygon && geom.rings != null) {

                for (i = 0, l = geom.rings.length; i < l; i++) {
                    if (geom.rings[i].hasZ()) {
                        return true;
                    }
                }
                return false;

            } else if (geom instanceof giscloud.geometry.Multipolygon && geom.polygons != null) {

                for (i = 0, l = geom.polygons.length; i < l; i++) {
                    if (geom.polygons[i].hasZ()) {
                        return true;
                    }
                }
                return false;

            } else if (geom instanceof giscloud.geometry.GeometryCollection && geom.geometries != null) {

                for (i = 0, l = geom.geometries.length; i < l; i++) {
                    if (geom.geometries[i].hasZ()) {
                        return true;
                    }
                }
                return false;

            } else {

                return null;

            }
        },

        toOGC: function (geom, ignoreZ) {
            var pnt, ln, poly, m1, m2, m3, i, j, k, l, m, n;

            pnt = function (point) {
                return (ignoreZ || point.z == null) ?
                    point.x + " " + point.y :
                    point.x + " " + point.y + " " + point.z;
            };

            ln = function (points) {
                return points.join();
            };

            poly = function (lines) {
                return lines.join();
            };

            try {

                if (geom instanceof giscloud.geometry.Point && geom.x != null && geom.y != null) {

                    return "POINT (" + pnt(geom) + ")";

                } else if (geom instanceof giscloud.geometry.Multipoint && geom.points != null) {

                    m1 = [];
                    for (i = 0, k = geom.points.length; i < k; i++) {
                        m1.push("(" + pnt(geom.points[i]) + ")");
                    }

                    return "MULTIPOINT (" + m1.join() + ")";

                } else if (geom instanceof giscloud.geometry.Line && geom.points != null) {

                    m1 = [];
                    for (i = 0, k = geom.points.length; i < k; i++) {
                        m1.push(pnt(geom.points[i]));
                    }

                    return "LINESTRING (" + ln(m1) + ")";

                } else if (geom instanceof giscloud.geometry.Multiline && geom.lines != null) {

                    m1 = [];
                    for (i = 0, k = geom.lines.length; i < k; i++) {
                        m2 = [];
                        for (j = 0, l = geom.lines[i].points.length; j < l; j++) {
                            m2.push(pnt(geom.lines[i].points[j]));
                        }
                        m1.push("(" + ln(m2) + ")");
                    }

                    return "MULTILINESTRING (" + ln(m1) + ")";

                } else if (geom instanceof giscloud.geometry.Polygon && geom.rings != null) {

                    m1 = [];
                    for (i = 0, k = geom.rings.length; i < k; i++) {
                        m2 = [];
                        for (j = 0, l = geom.rings[i].points.length; j < l; j++) {
                            m2.push(pnt(geom.rings[i].points[j]));
                        }
                        m2.push(pnt(geom.rings[i].points[0])); // duplicate first point
                        m1.push("(" + ln(m2) + ")");
                    }

                    return "POLYGON (" + poly(m1) + ")";

                } else if (geom instanceof giscloud.geometry.Multipolygon && geom.polygons != null) {

                    m1 = [];
                    for (i = 0, l = geom.polygons.length; i < l; i++) {
                        m2 = [];
                        for (j = 0, m = geom.polygons[i].rings.length; j < m; j++) {
                            m3 = [];
                            for (k = 0, n = geom.polygons[i].rings[j].points.length; k < n; k++) {
                                m3.push(pnt(geom.polygons[i].rings[j].points[k]));
                            }
                            m3.push(pnt(geom.polygons[i].rings[j].points[0]));
                            m2.push("(" + ln(m3) + ")");
                        }
                        m1.push("(" + poly(m2) + ")");
                    }

                    return "MULTIPOLYGON (" + m1.join() + ")";

                } else if (geom instanceof giscloud.geometry.GeometryCollection && geom.geometries != null) {

                    m1 = [];
                    for (i = 0, l = geom.geometries.length; i < l; i++) {
                        m1.push(geom.geometries[i].toOGC());
                    }

                    return "GEOMETRYCOLLECTION (" + m1.join() + ")";

                } else {

                    return null;

                }

            } catch (exc) {

                return null;

            }
        },

        fromOGC: function (wkt) {
            var i, l,
                rxTypeAndContent, m, type, content, arr, tree,
                geom, points, lines, polys,
                parseStructure, parseValue, getPoint, getLine, getPoly;

            rxTypeAndContent = /^([A-Z]+)\s?(\([A-Ze\d.,()\s\-]*\))$/;
            m = wkt && wkt.match && wkt.match(rxTypeAndContent);

            // get type
            type = m && m[1];

            // compress whitespace and commas
            content = m && m[2] && m[2].replace(/\s+/g, " ").replace(/, /g, ",");

            if (type == null || content == null) {
                return null;
            }

            // handle geometry collections
            if (type === "GEOMETRYCOLLECTION") {
                // separate geometries
                m = content.match(/([A-Z]+\s?\([\-\d.e,( )]*\))(?=\s?,|\s?\)\s?$)/g);

                if (m === null) {
                    return [];
                }

                arr = [];
                for (i = 0, l = m.length; i < l; i++) {
                    arr.push(giscloud.geometry.fromOGC(m[i]));
                }

                return new giscloud.geometry.GeometryCollection(arr);
            }

            // envelop point data in brackets
            content = content.replace(/([\d.e\-]+ [\d.e\-]+( [\d.e\-]+)?)/g, "[$1]");

            arr = [];
            i = 0;

            parseValue = function () {
                var ch, arr = [""], last = 0;

                while (true) {

                    // get next char
                    i++;
                    ch = content[i];

                    if (ch === "]") {
                        break;
                    } else if (ch === " ") {
                        arr.push("");
                        last++;
                        if (last > 2) {
                            throw "Error parsing wkt: invalid value";
                        }
                    } else {
                        arr[last] += ch;
                    }
                }
                return (arr.length === 3) ?
                    [parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2])] :
                    [parseFloat(arr[0]), parseFloat(arr[1])];
            };

            parseStructure = function () {
                var ch, arr = [];

                while (i < content.length) {

                    // get next char
                    i++;
                    ch = content[i];

                    switch (ch) {
                        case "(":
                            // start new collection
                            arr.push(parseStructure());
                            break;
                        case ",":
                            // just move on to the next collection item
                            break;
                        case ")":
                            // end collection
                            return arr;
                        case "[":
                            // start new value
                            arr.push(parseValue());
                            break;
                        default:
                            throw "Error parsing wkt: invalid structure";
                    }
                }

                return arr;
            };

            tree = m && parseStructure();

            if (tree.length < 1) {
                throw "Error parsing wkt: invalid geometry";
            }

            getPoint = function (arr) {
                if (arr.length !== 2 && arr.length !== 3) {
                    throw "Error parsing wkt: invalid geometry";
                }
                return new giscloud.geometry.Point(arr[0], arr[1], arr[2]);
            };

            getLine = function (arr, removeLastPoint) {
                var points, i, l;

                if (arr.length === 0) {
                    throw "Error parsing wkt: invalid geometry";
                }

                points = [];
                for (i = 0, l = arr.length - (removeLastPoint ? 1 : 0); i < l; i++) {
                    points.push(getPoint(arr[i]));
                }

                return new giscloud.geometry.Line(points);
            };

            getPoly = function (arr) {
                var rings, i, l;

                if (arr.length === 0) {
                    throw "Error parsing wkt: invalid geometry";
                }

                rings = [];
                for (i = 0, l = arr.length; i < l; i++) {
                    rings.push(getLine(arr[i], true));
                }

                return new giscloud.geometry.Polygon(rings);
            };

            switch (type) {
                case "POINT":
                    if (tree.length > 1) {
                        throw "Error parsing wkt: invalid point geometry";
                    }
                    return getPoint(tree[0]);
                case "MULTIPOINT":
                    points = [];
                    for (i = 0, l = tree.length; i < l; i++) {
                        if (tree[i].length === 2) {
                            points.push(getPoint(tree[i]));
                        } else if (tree[i].length === 1) {
                            points.push(getPoint(tree[i][0]));
                        } else {
                            throw "Error parsing wkt: invalid geometry";
                        }
                    }
                    return new giscloud.geometry.Multipoint(points);
                case "LINESTRING":
                    return getLine(tree);
                case "MULTILINESTRING":
                    lines = [];
                    for (i = 0, l = tree.length; i < l; i++) {
                        lines.push(getLine(tree[i]));
                    }
                    return new giscloud.geometry.Multiline(lines);
                case "POLYGON":
                    return getPoly(tree);
                case "MULTIPOLYGON":
                    polys = [];
                    for (i = 0, l = tree.length; i < l; i++) {
                        polys.push(getPoly(tree[i]));
                    }
                    return new giscloud.geometry.Multipolygon(polys);
                default:
                    throw "Error parsing wkt: unknown geometry type";
            }

            return geom;

        },

        fromGeoJSON: function (geojson) {
            if (typeof geojson == "string") {
                geojson = JSON.parse(geojson);
            }

            switch (geojson.type) {
                case "Point":
                    return new giscloud.geometry.Point(geojson.coordinates[0], geojson.coordinates[1]);

                case "LineString":
                    return new giscloud.geometry.Line(
                        $.map(geojson.coordinates, function (point) {
                            return new giscloud.geometry.Point(point[0], point[1]);
                        })
                    );

                case "Polygon":
                    return new giscloud.geometry.Polygon(
                        $.map(geojson.coordinates, function (ring) {
                            return new giscloud.geometry.Line(
                                $.map(ring, function (point) {
                                    return new giscloud.geometry.Point(point[0], point[1]);
                                })
                            );
                        })
                    );

                default:
                    return null;
            }
        }
    };

    GiscloudGeometry = function () {
        this.toOGC = function () {
            return giscloud.geometry.toOGC(this);
        };

        this.hasZ = function() {
            return giscloud.geometry.hasZ(this);
        };
    };

    giscloud.geometry.Point.prototype = new GiscloudGeometry();
    giscloud.geometry.Multipoint.prototype = new GiscloudGeometry();
    giscloud.geometry.Line.prototype = new GiscloudGeometry();
    giscloud.geometry.Multiline.prototype = new GiscloudGeometry();
    giscloud.geometry.Polygon.prototype = new GiscloudGeometry();
    giscloud.geometry.Multipolygon.prototype = new GiscloudGeometry();
    giscloud.geometry.GeometryCollection.prototype = new GiscloudGeometry();

})();

(function (window, $, common, undefined) {

    giscloud.Color = function (red, green, blue, alpha) {
        var r, g, b, a, h, sl, sv, l, v, ll, aa, bb, recalcHsl, recalcHsv, recalcRgb, recalcLab;
        if (red !== undefined && typeof red == "number") {
            if (red > 255) {
                r = 255;
            } else if (red < 0) {
                r = 0;
            } else {
                r = Math.round(red);
            }
            recalcHsl = true;
            recalcHsv = true;
            recalcLab = true;
        } else {
            recalcRgb = true;
        }
        if (green !== undefined && typeof green == "number") {
            if (green > 255) {
                g = 255;
            } else if (green < 0) {
                g = 0;
            } else {
                g = Math.round(green);
            }
            recalcHsl = true;
            recalcHsv = true;
            recalcLab = true;
        } else {
            recalcRgb = true;
        }
        if (blue !== undefined && typeof blue == "number") {
            if (blue > 255) {
                b = 255;
            } else if (blue < 0) {
                b = 0;
            } else {
                b = Math.round(blue);
            }
            recalcHsl = true;
            recalcHsv = true;
            recalcLab = true;
        } else {
            recalcRgb = true;
        }
        if (alpha !== undefined && typeof alpha == "number") {
            if (alpha > 100) {
                a = 100;
            } else if (alpha < 0) {
                a = 0;
            } else {
                a = Math.round(alpha);
            }
        } else {
            a = 0;
        }

        recalcHsl = true;
        recalcHsv = true;
        recalcLab = true;

        this.hex = function() {
            var h = arguments[0],
                reg = /^((#)|(0x))?([a-f0-9]{3}$)|([a-f0-9]{6}$)/i,
                rgb;
            if (h && typeof h == "string") {
                if (h.match(reg)) {
                    rgb = giscloud.Color.hexToRgb(h);
                    r = rgb[0];
                    g = rgb[1];
                    b = rgb[2];
                    recalcHsl = true;
                    recalcHsv = true;
                    recalcLab = true;
                    return this;
                } else {
                    return giscloud.Color.rgbToHex(this.rgb(), h);
                }
            } else {
                return giscloud.Color.rgbToHex(this.rgb(), h);
            }
        };

        this.rgb = function() {
            var i, c;
            if (arguments.length > 0) {
                for (i = 0; i < 3; i++) {
                    c = arguments[i];
                    if (c !== undefined && c !== null && typeof c == "number") {
                        if (c > 255) {
                            c = 255;
                        } else if (c < 0) {
                            c = 0;
                        } else {
                            c = Math.round(c);
                        }
                        switch (i) {
                        case 0:
                            r = c;
                            break;
                        case 1:
                            g = c;
                            break;
                        case 2:
                            b = c;
                            break;
                        }
                        recalcHsl = true;
                        recalcHsv = true;
                        recalcLab = true;
                    }
                }
                return this;
            } else {
                if (recalcRgb) {
                    if (!recalcHsl) {
                        c = giscloud.Color.hslToRgb(h, sl, l);
                    } else if (!recalcHsv) {
                        c = giscloud.Color.hsvToRgb(h, sv, v);
                    } else if (!recalcLab) {
                        c = giscloud.Color.labToRgb(ll, aa, bb);
                    }
                    r = c[0];
                    g = c[1];
                    b = c[2];
                    recalcRgb = false;
                }
                return [r, g, b];
            }
        };

        this.hsl = function (round) {
            var i, c;
            if (arguments.length === 3) {
                for (i = 0; i < 3; i++) {
                    c = arguments[i];
                    if (c !== undefined && c !== null && typeof c == "number") {
                        if (i === 0) {
                            if (c >= 360) {
                                c -= 360;
                            } else if (c < 0) {
                                c += 360;
                            } else {
                                c = Math.round(c);
                            }
                            h = c;
                        } else {
                            if (c > 100) {
                                c = 100;
                            } else if (c < 0) {
                                c = 0;
                            }
                            if (i === 1) {
                                sl = c;
                            } else {
                                l = c;
                            }
                        }
                        recalcRgb = true;
                        recalcHsv = true;
                        recalcLab = true;
                    }
                }
                recalcHsl = false;
                return this;
            } else {
                if (recalcHsl) {
                    if (!recalcRgb) {
                        c = giscloud.Color.rgbToHsl(r, g, b);
                    } else if (!recalcHsv) {
                        c = giscloud.Color.hsvToHsl(h, sv, v);
                    } else if (!recalcLab) {
                        c = giscloud.Color.labToHsl(ll, aa, bb);
                    }
                    h = c[0];
                    sl = c[1];
                    l = c[2];
                    recalcHsl = false;
                }
                if (round) {
                    return [Math.round(h), Math.round(sl), Math.round(l)];
                } else {
                    return [h, sl, l];
                }
            }
        };

        this.hsv = function (round) {
            var i, c;
            if (arguments.length === 3) {
                for (i = 0; i < 3; i++) {
                    c = arguments[i];
                    if (c !== undefined && c !== null && typeof c == "number") {
                        if (i === 0) {
                            if (c >= 360) {
                                c -= 360;
                            } else if (c < 0) {
                                c += 360;
                            } else {
                                c = Math.round(c);
                            }
                            h = c;
                        } else {
                            if (c > 100) {
                                c = 100;
                            } else if (c < 0) {
                                c = 0;
                            }
                            if (i === 1) {
                                sv = c;
                            } else {
                                v = c;
                            }
                        }
                        recalcRgb = true;
                        recalcHsl = true;
                        recalcLab = true;
                    }
                }
                recalcHsv = false;
                return this;
            } else {
                if (recalcHsv) {
                    if (!recalcRgb) {
                        c = giscloud.Color.rgbToHsv(r, g, b);
                    } else if (!recalcHsl) {
                        c = giscloud.Color.hslToHsv(h, sl, l);
                    } else if (!recalcLab) {
                        c = giscloud.Color.labToRgb(ll, aa, bb);
                    }
                    h = c[0];
                    sv = c[1];
                    v = c[2];
                    recalcHsv = false;
                }

                if (round) {
                    return [Math.round(h), Math.round(sv), Math.round(v)];
                } else {
                    return [h, sv, v];
                }
            }
        };

        this.lab = function (round) {
            var i, c;
            if (arguments.length === 3) {
                for (i = 0; i < 3; i++) {
                    c = arguments[i];
                    if (c !== undefined && c !== null && typeof c == "number") {
                        if (i === 0) {
                            ll = c;
                        } else if (i === 1) {
                            aa = c;
                        } else {
                            bb = c;
                        }
                        recalcRgb = true;
                        recalcHsl = true;
                        recalcHsv = true;
                    }
                }
                recalcLab = false;
                return this;
            } else {
                if (recalcLab) {
                    if (!recalcRgb) {
                        c = giscloud.Color.rgbToLab(r, g, b);
                    } else if (!recalcHsl) {
                        c = giscloud.Color.hslToLab(h, sl, l);
                    } else if (!recalcHsv) {
                        c.giscloud.Color.hsvToLab(h, sv, v);
                    }
                    ll = c[0];
                    aa = c[1];
                    bb = c[2];
                    recalcLab = false;
                }

                if (round) {
                    return [Math.round(ll), Math.round(aa), Math.round(bb)];
                } else {
                    return [ll, aa, bb];
                }
            }
        };

        this.alpha = function (alp) {
            if (alp !== undefined && typeof alp == "number") {
                if (alp > 100) {
                    a = 100;
                } else if (alp < 0) {
                    a = 0;
                } else {
                    a = Math.round(alp);
                }
            } else {
                return a;
            }
        };

        this.brighter = function (perc) {
            var hsl = this.hsl();
            perc = perc || 20;
            return giscloud.Color.fromHsl(hsl[0], hsl[1], hsl[2] + perc);
        };

        this.darker = function (perc) {
            var hsl = this.hsl();
            perc = perc || 20;
            return giscloud.Color.fromHsl(hsl[0], hsl[1], hsl[2] - perc);
        };

        this.clone = function() {
            var rgb = this.rgb();
            return new giscloud.Color(rgb[0], rgb[1], rgb[2], a);
        };

        this.equals = function(c) {
            var rgb;
            if (c instanceof giscloud.Color) {
                rgb = c.rgb();
                return r === rgb[0] && g === rgb[1] && b === rgb[2] && a === c.alpha();
            } else {
                return false;
            }
        };
    };

    giscloud.Color.fromRgb = function (r, g, b) {
        return new giscloud.Color(r, g, b);
    };

    giscloud.Color.fromHsl = function (h, s, l) {
        var col = new giscloud.Color();
        col.hsl(h, s, l);
        return col;
    };

    giscloud.Color.fromHsv = function (h, s, v) {
        var col = new giscloud.Color();
        col.hsv(h, s, v);
        return col;
    };

    giscloud.Color.fromLab = function (l, a, b) {
        var col = new giscloud.Color();
        col.lab(l, a, b);
        return col;
    };

    giscloud.Color.fromHex = function (hex) {
        var rgb = giscloud.Color.hexToRgb(hex);
        return rgb && new giscloud.Color(rgb[0], rgb[1], rgb[2]);
    };

    giscloud.Color.fromRgbString = function (rgbstr) {
        var rx = /^rgb\((\d+)[,\s]*(\d+)[,\s]*(\d+)\)$/i,
            m = rgbstr && rgbstr.match && rgbstr.match(rx);

        if (m && m.length === 4) {
            return new giscloud.Color(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
        } else {
            return null;
        }
    };

    giscloud.Color.fromString = function (str) {
        return giscloud.Color.fromRgbString(str) || giscloud.Color.fromHex(str);
    };

    giscloud.Color.hexToRgb = function (hex) {
        var r, g, b, m;
        if (typeof hex == "string") {
            m = hex.match(/^(?:#|0x)?(?:([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2}))$/i);
            if (m && m.length === 4) {
                r = parseInt(m[1], 16);
                g = parseInt(m[2], 16);
                b = parseInt(m[3], 16);
                return [r, g, b];
            } else {
                return null;
            }
        } else if (typeof hex == "number") {
            r = (hex & 0xff0000) >> 16;
            g = (hex & 0xff00) >> 8;
            b = (hex & 0xff);
            return (!isNaN(r + g + b) && [r, g, b]) || null;
        }
    };

    giscloud.Color.rgbToHex = function (r, g, b, prefix) {
        var rh, gh, bh;

        if (r.length && r.length === 3) {
            if (typeof g == "string") {
                prefix = g;
            }
            g = r[1];
            b = r[2];
            r = r[0];
        }

        rh = (r > 15) ? r.toString(16) : "0" + r.toString(16);
        gh = (g > 15) ? g.toString(16) : "0" + g.toString(16);
        bh = (b > 15) ? b.toString(16) : "0" + b.toString(16);

        if (prefix === undefined || prefix === null) {
            prefix = "#";
        }
        return prefix + rh + gh + bh;
    };

    giscloud.Color.rgbToHsl = function (red, green, blue) {
        var r, g, b, min, max, d, a, h, s, l;

        if (red.length && red.length === 3) {
            r = red[0] / 255;
            g = red[1] / 255;
            b = red[2] / 255;
        } else {
            r = red / 255;
            g = green / 255;
            b = blue / 255;
        }

        min = Math.min(r, g, b);
        max = Math.max(r, g, b);
        d = max - min;
        a = max + min;

        l = a / 2;

        if (d === 0) {
            h = 0;
            s = 0;
        } else {
            switch(max) {
            case r:
                h = (g - b) / d;
                break;
            case g:
                h = 2 + (b - r) / d;
                break;
            case b:
                h = 4 + (r - g) / d;
                break;
            }

            h = Math.min(Math.round(h * 60), 360);
            h = (h < 0) ? h + 360 : h;

            if (l <= 0.5) {
                s = d / a;
            } else {
                s = d / (2 - a);
            }
        }

        return [h, s * 100, l * 100];
    };

    giscloud.Color.hslToRgb = function (hue, saturation, lightness) {
        var r, g, b, t1, t2, col, h, s, l;

        if (hue.length && hue.length === 3) {
            h = hue[0] / 360;
            s = hue[1] / 100;
            l = hue[2] / 100;
        } else {
            h = hue / 360;
            s = saturation / 100;
            l = lightness / 100;
        }

        if (s === 0) {
            r = g = b = Math.round(l * 255);
            return [r, g, b];
        } else {
            t2 = (l < 0.5) ? l * (1 + s) : l + s - l * s;
            t1 = 2 * l - t2;

            col = function (t1, t2, t3) {
                var c;
                if (t3 < 0) {
                    t3 = t3 + 1.0;
                } else if (t3 > 1) {
                    t3 = t3 - 1.0;
                }
                if (6 * t3 < 1) {
                    c = t1 + (t2 - t1) * 6.0 * t3;
                } else if (2 * t3 < 1) {
                    c = t2;
                } else if (3 * t3 < 2) {
                    c = t1 + (t2 - t1) * (2.0 / 3.0 - t3) * 6.0;
                } else {
                    c = t1;
                }
                return c;
            };

            r = col(t1, t2, h + 1 / 3);
            g = col(t1, t2, h);
            b = col(t1, t2, h - 1 / 3);

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
    };

    giscloud.Color.rgbToHsv = function (red, green, blue) {
        var r, g, b, min, max, d, h, s, v;

        if (red.length && red.length === 3) {
            r = red[0];
            g = red[1];
            b = red[2];
        } else {
            r = red;
            g = green;
            b = blue;
        }

        min = Math.min(r, g, b);
        max = Math.max(r, g, b);
        d = max - min;

        if (max === 0) {
            s = 0;
        } else {
            s = d / max * 100;
        }

        if (d === 0) {
            h = 0;
        } else {
            switch (max) {
            case r:
                h = (g - b)/ d;
                break;
            case g:
                h = 2 + (b - r) / d;
                break;
            case b:
                h = 4 + (r - g)/ d;
                break;
            }

            h = Math.min(Math.round(h * 60), 360);
            h = (h < 0) ? h + 360 : h;
        }

        v = max / 255 * 100;

        return [h, s, v];
    };

    giscloud.Color.hsvToRgb = function (hue, saturation, value) {
        var f, p, q, t, u, h, s, v;

        if (hue.length && hue.length === 3) {
            h = hue[0];
            s = hue[1] / 100;
            v = hue[2] / 100;
        } else {
            h = hue;
            s = saturation / 100;
            v = value / 100;
        }
        u = Math.floor(h / 60) % 6;
        f = h/60 - Math.floor(h/60);
        p = Math.round(255 * v * (1 - s));
        q = Math.round(255 * v * (1 - (s * f)));
        t = Math.round(255 * v * (1 - (s * (1 - f))));
        v = Math.round(255 * v);

        switch(u) {
            case 0:
            return [v, t, p];
            case 1:
            return [q, v, p];
            case 2:
            return [p, v, t];
            case 3:
            return [p, q, v];
            case 4:
            return [t, p, v];
            case 5:
            return [v, p, q];
        }
    };

    giscloud.Color.hslToHsv = function (hue, saturation, lightness) {
        var h, s, l;

        if (hue.length && hue.length === 3) {
            h = hue[0];
            s = hue[1];
            l = hue[2];
        } else {
            h = hue;
            s = saturation;
            l = lightness;
        }

        return giscloud.Color.rgbToHsv(giscloud.Color.hslToRgb(h, s, l));
    };

    giscloud.Color.hsvToHsl = function (hue, saturation, value) {
        var h, s, v;

        if (hue.length && hue.length === 3) {
            h = hue[0];
            s = hue[1];
            v = hue[2];
        } else {
            h = hue;
            s = saturation;
            v = value;
        }

        return giscloud.Color.rgbToHsl(giscloud.Color.hsvToRgb(h, s, v));
    };

    giscloud.Color.hsvToLab = function (hue, saturation, value) {
        var h, s, v;

        if (hue.length && hue.length === 3) {
            h = hue[0];
            s = hue[1];
            v = hue[2];
        } else {
            h = hue;
            s = saturation;
            v = value;
        }

        return giscloud.Color.rgbToLab(giscloud.Color.hsvToRgb(h, s, v));
    };

    giscloud.Color.hslToLab = function (hue, saturation, lightness) {
        var h, s, l;

        if (hue.length && hue.length === 3) {
            h = hue[0];
            s = hue[1];
            l = hue[2];
        } else {
            h = hue;
            s = saturation;
            l = lightness;
        }

        return giscloud.Color.rgbToLab(giscloud.Color.hslToRgb(h, s, l));
    };

    giscloud.Color.rgbToXyz = function (red, green, blue) {
        var r, g, b, x, y, z;

        if (red.length && red.length === 3) {
            r = red[0] / 255;
            g = red[1] / 255;
            b = red[2] / 255;
        } else {
            r = red / 255;
            g = green / 255;
            b = blue / 255;
        }

        // source: http://www.easyrgb.com
        // constants: observer 2Â°, illuminant D65
        if (r > 0.04045) {
            r = Math.pow((r + 0.055) / 1.055, 2.4);
        } else {
            r = r / 12.92;
        }
        if (g > 0.04045) {
            g = Math.pow((g + 0.055) / 1.055, 2.4);
        } else {
            g = g / 12.92;
        }
        if (b > 0.04045) {
            b = Math.pow((b + 0.055) / 1.055, 2.4);
        } else {
            b = b / 12.92;
        }

        r = r * 100;
        g = g * 100;
        b = b * 100;


        x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        return [x, y, z];
    };

    giscloud.Color.xyzToRgb = function (x, y, z) {
        var r, g, b;

        if (x.length && x.length === 3) {
            y = x[1] / 100;
            z = x[2] / 100;
            x = x[0] / 100;
        } else {
            x = x / 100;
            y = y / 100;
            z = z / 100;
        }

        // source: http://www.easyrgb.com
        // constants: observer 2Â°, illuminant D65
        r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        b = x * 0.0557 + y * -0.2040 + z * 1.0570;

        if (r > 0.0031308) {
            r = 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
        } else {
            r = 12.92 * r;
        }
        if (g > 0.0031308) {
            g = 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
        } else {
            g = 12.92 * g;
        }
        if (b > 0.0031308) {
            b = 1.055 * Math.pow(b, 1 / 2.4) - 0.055;
        } else {
            b = 12.92 * b;
        }

        r = r * 255;
        g = g * 255;
        b = b * 255;

        return [r, g, b];
    };

    giscloud.Color.labToXyz = function (l, a, b){
        var x, y, z;

        if (l.length && l.length === 3) {
            a = l[1];
            b = l[2];
            l = l[0];
        }

        // source: http://www.easyrgb.com
        // constants: observer 2Â°, illuminant D65
        y = ( l + 16 ) / 116;
        x = a / 500 + y;
        z = y - b / 200;

        if (y * y * y > 0.008856) {
            y = y * y * y;
        } else {
            y = (y - 16 / 116) / 7.787;
        }
        if (x * x * x > 0.008856) {
            x = x * x * x;
        } else {
            x = (x - 16 / 116) / 7.787;
        }
        if (z * z * z > 0.008856) {
            z = z * z * z;
        } else {
            z = (z - 16 / 116) / 7.787;
            }

        x = 95.047 * x;
        y = 100.000 * y;
        z = 108.883 * z;

        return [x, y, z];
    };

    giscloud.Color.xyzToLab = function(x, y, z) {
        var l, a, b;

        if (x.length && x.length === 3) {
            y = x[1];
            z = x[2];
            x = x[0];
        }

        // source: http://www.easyrgb.com
        // constants: observer 2Â°, illuminant D65
        x = x / 95.047;
        y = y / 100.000;
        z = z / 108.883;

        if (x > 0.008856) {
            x = Math.pow(x, 1 / 3);
        } else {
            x = (7.787 * x) + (16 / 116);
        }
        if (y > 0.008856) {
            y = Math.pow(y, 1 / 3);
        } else {
            y = (7.787 * y) + (16 / 116);
        }
        if (z > 0.008856) {
            z = Math.pow(z, 1 / 3);
        } else {
            z = (7.787 * z) + (16 / 116);
        }

        l = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);

        return [l, a, b];
    };

    giscloud.Color.rgbToLab = function (r, g, b) {
        var xyz = giscloud.Color.rgbToXyz(r, g, b);
        return giscloud.Color.xyzToLab(xyz);
    };

    giscloud.Color.labToRgb = function (l, a, b) {
        var xyz = giscloud.Color.labToXyz(l, a, b);
        return giscloud.Color.xyzToRgb(xyz);
    };

    giscloud.Color.labToHsl = function (l, a, b) {
        var xyz = giscloud.Color.labToXyz(l, a, b);
        return giscloud.Color.rgbToHsl(giscloud.Color.xyzToRgb(xyz));
    };

    giscloud.Color.labToHsl = function (l, a, b) {
        var xyz = giscloud.Color.labToXyz(l, a, b);
        return giscloud.Color.rgbToHsv(giscloud.Color.xyzToRgb(xyz));
    };

    giscloud.Color.randomHue = function (saturation, value) {
        return giscloud.Color.fromHsv(Math.round(Math.random() * 360), saturation, value);
    };

    giscloud.Color.range = function (col1, col2, nr, mode) {
        var i, start, end, c, v, m, dir, arr = [];
        if (col1 instanceof giscloud.Color && col2 instanceof giscloud.Color && nr >= 2) {
            if (nr === 2) {
                return [col1.clone(), col2.clone()];
            } else {
                d = [];
                m = (mode || "hsl cw").match(/^((\w+)?\s)?(ccw$|cw$)/);
                if (m) {
                    mode = m[2] || "hsl";
                    dir = m[3];
                } else {
                    dir = "cw";
                }
                if (mode === "rgb") {
                    start = col1.rgb();
                    end = col2.rgb();
                    d = [
                       (end[0] - start[0]) / (nr - 1),
                       (end[1] - start[1]) / (nr - 1),
                       (end[2] - start[2]) / (nr - 1),
                       (end[3] - start[3]) / (nr - 1)
                   ];
                } else {
                    if (mode === "hsv") {
                        start = col1.hsv();
                        end = col2.hsv();
                    } else {
                        start = col1.hsl();
                        end = col2.hsl();
                    }
                    if (dir === "cw") {
                        d = [
                           (end[0] >= start[0]) ?
                                (end[0] - start[0]) / (nr - 1) :
                                (360 - start[0] + end[0]) / (nr - 1),
                           (end[1] - start[1]) / (nr - 1),
                           (end[2] - start[2]) / (nr - 1),
                           (end[3] - start[3]) / (nr - 1)
                       ];
                    } else {
                       d = [
                           (end[0] < start[0]) ?
                                (end[0] - start[0]) / (nr - 1) :
                                (end[0] - start[0] - 360) / (nr - 1),
                           (end[1] - start[1]) / (nr - 1),
                           (end[2] - start[2]) / (nr - 1),
                           (end[3] - start[3]) / (nr - 1)
                       ];
                    }
                }
                start.push(col1.alpha());
                end.push(col2.alpha());
                v = [start[0], start[1], start[2], start[3]];
                for (i = 0; i < nr; i++) {
                    if (mode === "rgb") {
                        arr.push(new giscloud.Color(v[0], v[1], v[2], v[3]));
                    } else if (mode === "hsv") {
                        c = new giscloud.Color.fromHsv(v[0], v[1], v[2]);
                        c.alpha(v[3]);
                        arr.push(c.clone());
                    } else {
                        c = new giscloud.Color.fromHsl(v[0], v[1], v[2]);
                        c.alpha(v[3]);
                        arr.push(c.clone());
                    }
                    v[0] += d[0];
                    v[1] += d[1];
                    v[2] += d[2];
                    v[3] += d[3];
                }
                return arr;
            }
        } else {
            return null;
        }

    };

    giscloud.Color.hexNrToString = function (nr, prefix) {
        if (typeof nr == "number") {
            return (prefix || "") + (0x1000000 | nr).toString(16).substr(1);
        } else {
            return null;
        }
    };

    giscloud.Color.hexStringToNr = function (str, prefix) {
        var regexp;
        if (typeof str == "string" && str) {
            prefix = prefix || "#";
            regexp = new RegExp("^(?:" + prefix + "|0x)?([a-f0-9]{3})([a-f0-9]{3})?$", "i");
            return parseInt(str.replace(regexp, "$1$2"), 16);
        } else {
            return NaN;
        }
    };

})(window, giscloud.exposeJQuery(), giscloud.common());
(function (window, $, common, undefined) {
    var getset, defaultColor = new giscloud.Color(255, 180, 0);

    giscloud.FlagMarker = function (position, title, content, color) {
        var tit = title || "",
            cont = content || "",
            col = (color && color instanceof giscloud.Color) ? color : defaultColor,
            pos = (position && position instanceof giscloud.LonLat) ? position : null,
            vis = true,
            refresh = function() {
                var oldId, sig = this.sig, ref;
                ref = common.markers && common.markers[sig];
                if (sig && ref) {
                    oldId = ref.id;
                    if (oldId !== undefined && oldId !== null) {
                        ref.m.remove(oldId);
                    }
                    if (vis && pos) {
                        ref.id = ref.m.add(pos.lon, pos.lat, col.hex("0x"), tit, cont, null, ref.open);
                    } else {
                        ref.id = null;
                    }
                }
            };

        this.title = function() {
            var id;
            if (arguments.length > 0) {
                tit = arguments[0];
                if (this.sig) {
                    id = common.markers[this.sig].id;
                    if (id) {
                        common.markers[this.sig].m.setTitle(id, tit);
                    }
                }
                return this;
            } else {
                return tit;
            }
        };

        this.content = function() {
            var id;
            if (arguments.length > 0) {
                cont = arguments[0];
                if (this.sig) {
                    id = common.markers[this.sig].id;
                    if (id) {
                        common.markers[this.sig].m.setContent(id, cont);
                    }
                }
                return this;
            } else {
                return cont;
            }
        };

        this.color = function() {
            var c = arguments[0];
            if (arguments.length > 0) {
                if (c && c instanceof giscloud.Color && !c.equals(col)) {
                    col = (c) ? c : defaultColor;
                    refresh.call(this);
                }
                return this;
            } else {
                return col;
            }
        };

        this.visible = function(onoff) {
            if (arguments.length > 0) {
                if (onoff !== vis) {
                    vis = !!onoff;
                    refresh.call(this);
                }
                return this;
            } else {
                return vis;
            }
        };

        this.position = function () {
            var p = arguments[0];
            if (arguments.length > 0) {
                if (p && !p.equals(pos)) {
                    pos = (p instanceof giscloud.LonLat) ? p : null;
                    refresh.call(this);
                }
                return this;
            } else {
                return pos;
            }
        };

    };


    giscloud.Marker = function (location, options) {
        var state;

        options = options || {};

        // internal marker state
        state = {
            location: location || null,
            title: options.title == null ? null : options.title,
            content: options.content == null ? null : options.content,
            visible: options.visible === false ? false : true, // this looks funny but what it does is it allows
                                                               // false *only* when the option he been explicitly
                                                               // set to boolean false. if undefined, the value
                                                               // should be true.
            icon: options.icon || null,
            popup: options.popup === true ? true : false,
            color: options.color || defaultColor.clone(),
            marker: this // hold a reference to the marker itself
        };

        // set public property get/set methods
        this.title = getset.call(this, state, "title");
        this.content = getset.call(this, state, "content");
        this.location = getset.call(this, state, "location");
        this.visible = getset.call(this, state, "visible");
        this.popup = getset.call(this, state, "popup");
        this.icon = getset.call(this, state, "icon");

    };

    // uniform property getter/setter creator method
    //  * prop is the name of the property of the rootObj
    //  * validation is a function which returns boolean depending on the input value validity (optional)
    getset = function (rootObj, prop, validation) {
        var context = this;
        return function (value, silent) {
            var old;
            if (value === undefined) {
                return rootObj[prop];
            } else {
                if (validation && !validation(value)) {
                    throw { msg: "Invalid value for " + (prop || "???"), target: context };
                } else {
                    old = rootObj[prop];
                    rootObj[prop] = value;
                    if (!silent) {
                        $(context).triggerHandler(
                            "stateChanged",
                            [{ property: prop, oldValue: old, newValue: value, state: rootObj }]
                        );
                    }
                    return context;
                }
            }
        };
    };

})(window, giscloud.exposeJQuery(), giscloud.common());
(function ($, undefined) {

    // exit of this is executed inside an oauth frame
    if (!giscloud.oauth2 || giscloud.oauth2.thisIsOauthFrame()) {
        return;
    }

    var addr, init, registered, eventAnchor, $eventAnchor, oldval, newval;

    // init values
    addr = $.address;
    registered = {};
    oldval = {};
    newval = {};
    $eventAnchor = $({});
    init = new $.Deferred();

    // this happens on page load
    addr.init(function (evt) {

        // fill oldval with initial params
        $.extend(oldval, evt.parameters);

        // unescape the values
        for (p in oldval) {
            if (oldval.hasOwnProperty(p)) {
                oldval[p] = unescape(oldval[p]);
            }
        }

        init.resolve();
    });

    // this happens every time an external change in the address occurs
    addr.externalChange(function (evt) {
        var i, k, p, changed, added, removed,
            findAdded, findRemoved, syncChanges;

        // finds itmes which exist only in the new list
        findAdded = function (oldList, newList) {
            return $.map(newList, function (val, key) {
                if (oldList[key] === undefined) {
                    return key;
                } else {
                    return null;
                }
            });
        };

        // finds items which exist only in the old list
        findRemoved = function (oldList, newList) {
            return findAdded(newList, oldList); // ;)
        };

        // applies changes and returns changed fields
        syncChanges = function (oldList, newList) {
            return $.map(newList, function (val, key) {
                if (oldList[key] !== val) {
                    oldList[key] = val;
                    return key;
                } else {
                    return null;
                }
            });
        };

        // param state after the change
        newval = evt.parameters;

        // unescape the values
        for (p in newval) {
            if (newval.hasOwnProperty(p)) {
                newval[p] = unescape(newval[p]);
            }
        }

        // find added and removed params
        added = findAdded(oldval, newval);
        removed = findRemoved(oldval, newval);

        // sync additions and removals
        for (i = 0, k = added.length; i < k; i++) {
            oldval[added[i]] = unescape(newval[added[i]]);
        }
        for (i = 0, k = removed.length; i < k; i++) {
            delete oldval[removed[i]];
        }

        // find changes and sync
        changed = syncChanges(oldval, newval);

        // trigger change events
        for (i = 0, k = added.length; i < k; i++) {
            p = added[i];
            $eventAnchor.triggerHandler(p, [{
                type: "add",
                param: p,
                value: giscloud.address.param(p)
            }]);
        }
        for (i = 0, k = removed.length; i < k; i++) {
            p = removed[i];
            $eventAnchor.triggerHandler(p, [{
                type: "remove",
                param: p
            }]);
        }
        for (i = 0, k = changed.length; i < k; i++) {
            p = changed[i];
            $eventAnchor.triggerHandler(p, [{
                type: "change",
                param: p,
                value: giscloud.address.param(p)
            }]);
        }

    });


    // giscloud.address API
    giscloud.address =  {

        registerParam: function (options) {

            registered[options.name] = {
                name: options.name,
                query: options.query || options.name,
                serialize: options.serialize,
                deserialize: options.deserialize
            };

            if (options.onChange) {
                this.change(options.name, options.onChange);
            }

            this.param(options.name, addr.parameter(options.query));

            return this;
        },

        param: function (paramName, value) {
            var val, reg = registered[paramName];
            if (value === undefined) {
                val = oldval[paramName];
                if (val == null) {
                    return null;
                } else if (reg && reg.deserialize) {
                    return reg.deserialize(unescape(val));
                } else {
                    return unescape(val);
                }
            } else {
                if (reg && reg.serialize) {
                    val = reg.serialize(value)
                } else {
                    val = (typeof value === "string") ? value : value.toString();
                }
                oldval[paramName] = val;
                addr.parameter(paramName, val);
                return this;
            }
        },

        change: function (paramName, handler) {
            $eventAnchor.on(paramName, handler);
        },

        init: init.promise()
    };

}(giscloud.exposeJQuery()));
/*global giscloud:true */
(function ($, common) {
    "use strict";
    giscloud.addressmodels = {

        list: function (options) {
            var url = "addressmodels.json",
                def = new $.Deferred();

            common.rest.get(url, options).done(function (response) {
                if (response && response.data && response.data.length>0) {
                    var i=0;
                    for(i; i<response.data.length; i++)
                        response.data[i].definition = JSON.decode(response.data[i].definition);
                }
                def.resolve(response);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        },

        create: function (name, definition) {
            var url = "addressmodels.json",
                dfrd = new $.Deferred(),
                opts = {
                    name: name,
                    definition: (typeof definition === "string") ?
                        definition :
                        JSON.stringify(definition)
                };

            common.rest.call("post", url, opts, "application/json")
            .done(function (response, loc) {
                dfrd.resolve(loc && loc.match && loc.match(/addressmodels\/(\d+)/)[1]);
            })
            .fail(function () {
                dfrd.reject();
            });

            return dfrd;
        },

        update: function (addressmodelId, name, definition) {
            var url = "addressmodels/" + addressmodelId + ".json",
                dfrd = new $.Deferred(),
                opts = {
                    name: name,
                    definition: (typeof definition === "string") ?
                        definition :
                        JSON.stringify(definition)
                };

            common.rest.call("put", url, opts, "application/json")
            .then(dfrd.resolve, dfrd.reject);

            return dfrd.promise();
        },

        remove: function (id) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "addressmodels/" + id)
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        }

    };


}(giscloud.exposeJQuery(), window.giscloud.common()));

/*global giscloud */
(function ($) {
    "use strict";

    giscloud.Queue = function (arr) {
        var
            // link pointer
            i = 0,
            // copy the chain
            chain = arr.slice(),
            // create self object to make this constructor
            // callable without the new operator
            self = (this === giscloud) ? {} : this,
            // the main deferred object
            dfrd = new $.Deferred(),
            // an array to hold all the deferreds
            promises = [],
            // an array to hold results
            results = [],
            // the last result object
            lastResult = [],
            // last proggress message
            progressMessage = null,
            // the end of chain indicator
            end = {},
            // the end link function
            endLink = function () { return end; },
            // spped up access to the array slice function
            arraySlice = Array.prototype.slice;

        // the success function
        function finish() {
            // resolve the main deferred and pass the last result and results array
            dfrd.resolveWith(self, [lastResult, results]);
        }

        // the failure function
        function fail() {
            // reject the main deferred and pass the last result
            dfrd.rejectWith(self, [lastResult]);
        }

        function saveResult() {
            // save each link result to the results array
            results.push(arraySlice.apply(arguments));
            lastResult = results[results.length - 1];
        }

        function giveProgress() {
            // report progress and give last result
            dfrd.notifyWith(
                self,
                (progressMessage != null) ?
                    [progressMessage].concat(results[i - 1]) :
                    results[i - 1]
                );
        }

        // one step processing function
        function step() {
            var
                // get results from the previous operation
                params = $.isArray(chain[i].params) ? lastResult.concat(chain[i].params) : lastResult,
                // get current link function
                link = $.isFunction(chain[i]) ? chain[i] : chain[i].func,
                // get the context
                context = $.isFunction(chain[i]) ? self : chain[i].context,
                // get the progress message
                msg = $.isFunction(chain[i]) ? null : chain[i].msg,
                // execute link to get its promise
                promise = link.apply(context, params);

            if (promise === end) {
                // we're done
                finish();
            } else {
                // save the promise and give progress notification
                promises.push(promise);
                // move the pointer to the next link
                i++;
                // set progress message
                progressMessage = msg;
                // process promise
                promise
                .always(saveResult, giveProgress)
                .done(step)
                .fail(fail);
            }
        }

        // add end link
        chain.push(endLink);

        // start processing
        step();

        // add methods to return results and promises objects
        self.results = function () { return results; };
        self.promises = function () { return promises; };

        // add main deferred promise methods to the new Queue object
        //$.extend(self, dfrd.promise());

        return dfrd.promise(self);
    };

}(giscloud.exposeJQuery()));

(function (window, $, common, undefined) {

    /*
     * Object: maps
     * Provides access to the GIS Cloud collection of maps.
     */
    giscloud.maps = {

        /*
         * Method: list
         *
         *  Parameters:
         *      A callback function to be executed on succes.
         *      The function will be passed an Array of giscloud.Map objects as an argument.
         *
         *  Returns:
         *      A jQuery deferred object promise which can be used to attach more success or failure handler functions
         *      or to check the status of the request.
         */
        list: function (options, callback) {
            var url = "maps", def = new $.Deferred();

            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || (options && options.callback);
            }

            common.rest.get(url, options)
                .done(function () {
                    var response = arguments[0], maps = [];
                    try {
                        // prepare data
                        $.each(response.data, function () {
                            maps.push(new giscloud.Map(this));
                        });
                        // callback
                        if (typeof callback == "function") {
                            callback(maps);
                        }
                        // resolve the deferred
                        def.resolve(maps);
                    } catch (err) {
                        def.reject();
                    }
                })
                .fail(function () {
                    def.reject();
                });
            return def.promise();
        },

        /*
         * Method: byId
         *
         *  Parameters:
         *      id - Number, id of the map.
         *
         *      callback - A callback function to be executed upon succes.
         *      The function will be passed a giscloud.Map object as an argument.
         *
         *  Returns:
         *      A jQuery deferred object promise which can be used to attach more success or failure handler functions
         *      or to check the status of the request.
         */
        byId: function (id, callback, rawData) {
            var url = "maps/" + id, def = new $.Deferred();
            common.rest.get(url)
                .done(function () {
                    var data = arguments[0], map;
                    try {
                        // prepare data
                        map = rawData ? data : new giscloud.Map(data);
                        // callback
                        if (typeof callback == "function") {
                            callback(map);
                        }
                        // resolve the deferred
                        def.resolve(map);
                    } catch (err) {
                        def.reject();
                    }
                })
                .fail(function () {
                    def.reject();
                });
            return def.promise();
        },

    remove: function(id) {
        return common.rest.call("DELETE", "maps/" + id);
    },

    update: function(id,  data) {
        return common.rest.call("PUT", "maps/" + id, common.toXml("map", data), "text/xml");
    },

    create: function (data) {
        var dfrd = new $.Deferred();

        common.rest.call("post", "maps/", common.toXml("map", data), "text/xml")
        .fail(dfrd.reject)
        .done(function (data, location) {
            var m = location && location.match(/maps\/(\d+)/);
            if (m && m[1] != null) {
                dfrd.resolve(m[1]);
            } else {
                dfrd.reject();
            }
        });

        return dfrd.promise();
    },

    users: function (id) {
        var dfrd, getOwnerDfrd, getShareesDrfd,
            users = {
                owner: null,
                editors: [],
                viewers: []
            };

        getOwnerDfrd = common.rest.get("maps/" + id, { expand: "owner" })
            .done(function (map) {
                users.owner = { id: map.owner.id, username: map.owner.username };
            });

        getShareesDrfd = common.rest.get("maps/" + id + "/sharing")
            .done(function (sharing) {
                if (sharing && sharing.data && sharing.data.length) {
                    $.each(sharing.data, function (i, data) {
                        if (data.view === "t") {
                            users.viewers.push({ id: data.user_id, username: data.username });
                        }

                        if (data.edit === "t") {
                            users.editors.push({ id: data.user_id, username: data.username });
                        }
                    });
                }
            });

        dfrd = $.when(getOwnerDfrd, getShareesDrfd);

        return dfrd.pipe(function () { return users; }).promise();
    },

    reset: function (id, layerIds) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "map_cache/" + id + "/2/", layerIds ? { layers: layerIds.join() } : null)
                .done(function() {
                    dfrd.resolveWith(that);
                })
                .fail(function() {
                    dfrd.rejectWith(that, arguments);
                });
            return dfrd.promise();
    }
    };


})(window, window.giscloud.exposeJQuery(), window.giscloud.common());

(function (window, $, common, undefined) {

    /*
     * Object: layers
     * Provides access to the GIS Cloud collection of layers.
     */
    giscloud.layers = {

        /*
         * Method: list
         *
         *  Parameters:
         *      A callback function to be executed on succes.
         *      The function will be passed an Array of giscloud.Layer objects as an argument.
         *
         *  Returns:
         *      A jQuery deferred object promise which can be used to attach more success or failure handler functions
         *      or to check the status of the request.
         */
        list: function (options, callback) {
            var url = "layers",
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options).done(function () {
                var response = arguments[0], layers = [];
                try {
                    // prepare data
                    $.each(response.data, function () {
                        layers.push(new giscloud.Layer(this));
                    });
                    // callback
                    if (typeof callback == "function") {
                        callback(layers);
                    }
                    // resolve the deferred
                    def.resolve(layers);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        },

        byId: function (id, options, callback) {
            var url = "layers/" + id,
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options)
            .done(function () {
                var data = arguments[0], layer;
                try {
                    // prepare data
                    layer = new giscloud.Layer(data);
                    // callback
                    if (typeof callback == "function") {
                        callback(layer);
                    }
                    // resolve the deferred
                    def.resolve(layer);
                } catch (err) {
                    def.reject();
                }
            })
            .fail(function () {
                def.reject();
            });
            return def.promise();
        },


        byMapId: function (mapId, options, callback) {
            var url = "maps/" + mapId + "/layers",
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options).done(function () {
                var response = arguments[0], layers = [];
                try {
                    // prepare data
                    $.each(response.data, function () {
                        layers.push(new giscloud.Layer(this));
                    });
                    // callback
                    if (typeof callback == "function") {
                        callback(layers);
                    }
                    // resolve the deferred
                    def.resolve(layers);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        },

        remove: function(id) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "layers/" + id)
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        update: function(id,  data) {
            var dfrd = new $.Deferred(), that = this;

            if (id == null) {
                return this.create(data);
            }

            common.rest.call("PUT", "layers/" + id, JSON.stringify(data), "application/json")
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        create: function (data) {
            var dfrd = new $.Deferred(), that = this;

            // clean the data
            delete data.id;
            delete data.modified;
            delete data.created;
            delete data.accessed;

            common.rest.call("POST", "layers/", JSON.stringify(data), "application/json")
            .done(function(data, location) {
                var m = location && location.match(/layers\/(\d+)/);
                dfrd.resolveWith(that, [m && m[1]]);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        reset: function (mapId, ids) {
            var dfrd = new $.Deferred(), that = this;
            //common.rest.call("DELETE", "map_cache/" + mapId + "/2", { layers: ids.join() })
            common.rest.call("DELETE", "map_cache/" + mapId + "/2?layers=" + ids.join())
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        render: function (id, format, width, height) {
            var ret = common.rest.url() + "layers/" + id + "/render." + format + "?invalidate=true";
            if (width && height) {
                ret += "&width=" + width + "&height=" + height;
            }
            return ret;
        },

        "export": function (id, format, zip) {
            var ret = common.rest.url() + "layers/" + id + "/export." + format;
            if (zip) {
                ret += ".zip";
            }
            return ret;
        },

        attributeOps: {

            distinct: function (layerId, attribute, options) {
                var url = "layers/" + layerId + "/attributeops/distinct.json";

                options = options || {perpage:10, page:1};
                options.attribute = attribute;

                return common.rest.get(url, options)
                    .pipe(
                        function (response) { return response; },
                        function () { return null; }
                    ).promise();
            }

        }
    };


})(window, window.giscloud.exposeJQuery(), window.giscloud.common());
(function (window, $, common, undefined) {

    function escapeKeys(data) {
        var esc, key, retval = {};

        for (key in data) {
            if (data.hasOwnProperty(key)) {
                esc = key.replace(".", "\\.");
                retval[esc] = data[key];
            }
        }

        return retval;
    }

    /*
     * Class: features
     * Provides access to GIS Cloud features.
     */

    giscloud.features = {

        byLayer: function (layerId, options, callback) {
            var url = "layers/" + layerId + "/features",
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options).done(function (resp) {
                var response = resp, features = [];
                try {
                    // prepare data
                    $.each(response.data, function () {
                        this.layerId = layerId;
                        features.push(new giscloud.Feature(this));
                    });
                    // callback
                    if (typeof callback == "function") {
                        callback(features);
                    }
                    // resolve the deferred
                    def.resolve(features);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        },

        byId: function (layerId, featureId, options, callback) {
            var url = "layers/" + layerId + "/features/" + featureId, def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options)
                .done(function (resp) {
                    var data = resp, feature;
                    data.layerId = layerId;
                    try {
                        // prepare data
                        feature = new giscloud.Feature(data);
                        // callback
                        if (typeof callback == "function") {
                            callback(feature);
                        }
                        // resolve the deferred
                        def.resolve(feature);
                    } catch (err) {
                        def.reject();
                    }
                })
                .fail(function () {
                    def.reject();
                });
            return def.promise();
        },


        byBounds: function (layerId, bounds, options, callback) {
            var url = "layers/" + layerId + "/features",
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else {
                callback = callback || options.callback;
            }

            options.bounds = bounds.toString();

            common.rest.get(url, options)
                .done(function (resp) {
                    var response = resp, features = [];
                    try {
                        // prepare data
                        $.each(response.data, function () {
                            this.layerId = layerId;
                            features.push(new giscloud.Feature(this));
                        });
                        // callback
                        if (typeof callback == "function") {
                            callback(features);
                        }
                        // resolve the deferred
                        def.resolve(features);
                    } catch (err) {
                        def.reject();
                    }
                })
                .fail(function () {
                    def.reject();
                });
            return def.promise();
        },

        remove: function(layerId, id) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "layers/" + layerId + "/features/" + id)
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        update: function(layerId, id,  data, options) {
            var dfrd = new $.Deferred(), that = this, url;

            if (data && data.geometry) {
                if (data.geometry.toOGC) {
                    data.geometry = data.geometry.toOGC();
                }
            }

            if (id == null) {
                return this.create(layerId, data, options);
            }

            url = "layers/" + layerId + "/features/" + id;

            if (options) {
                url += "?" + $.map(options, function (val, key) {
                    return key + "=" + val;
                }).join("&");
            }

            common.rest.call("PUT", url, JSON.stringify(data), "application/json")
            .done(function() {
                dfrd.resolveWith(that, [id]);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        create: function (layerId, data, options) {
            var dfrd = new $.Deferred(),
                that = this,
                url = "layers/" + layerId + "/features/";

            if (options) {
                url += "?" + $.map(options, function (val, key) {
                    return key + "=" + val;
                }).join("&");
            }

            common.rest.call("post", url, JSON.stringify(data), "application/json")
            .done(function(data, location, jqXHR) {
                var loc =  location || jqXHR.getResponseHeader("Location"),
                    m = loc && loc.match(/features\/(\d+)/);
                dfrd.resolveWith(that, [m && m[1]]);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        email: function(options) {

            var url = "layers/" + options.layer_id + "/features/email", def = new $.Deferred(), that = this;

            if (!options || !options.layer_id || !options.feature_ids
                || (!options.usernames && !options.emails)) return def.reject();

            options.feature_ids = (jQuery.type(options.feature_ids) == "array") ? options.feature_ids.join() : options.feature_ids;
            options.usernames = (jQuery.type(options.usernames) == "array") ? options.usernames.join() : options.usernames;
            options.emails = (jQuery.type(options.emails) == "array") ? options.emails.join() : options.emails;

            common.rest.get(url, options)
                .done(function (resp) {
                    def.resolve();
                })
                .fail(function (e) {
                    var resp = $.parseJSON(e.responseText);
                    def.rejectWith(that, [e, resp]);
                });
            return def.promise();
        }

    };


}(window, window.giscloud.exposeJQuery(), window.giscloud.common()));

(function ($, common, undefined) {

    giscloud.search = {

        features: function (query, fields, location, options, callback) {
            var def;

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            options.query = query;
            options.fields = fields && fields.toString();

            if (location) {
                if (location instanceof giscloud.LonLat) {
                    options.x = location.lon;
                    options.y = location.lat;
                } else if (location.x != null && location.y != null) {
                    options.x = location.x;
                    options.y = location.y;
                }
            }

            def = new $.Deferred();

            common.rest.get("search", options).done(function (response) {
                var features = [];
                try {
                    // prepare data
                    $.each(response.data, function () {
                        features.push(new giscloud.Feature(this));
                    });
                    // resolve the deferred
                    def.resolve(features);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });

            if (callback) {
                def.done(callback);
            }

            return def.promise();
        }
    };

}(giscloud.exposeJQuery(), giscloud.common()));
(function (undefined) {

    var getter, gettersetter, resolveDate,
        readOnlyFields = ["id", "created", "username"],
        dateFields = ["created"],
        updateableFields = [
            "language", {field: "firstname", alias: "firstName"}, {field: "lastname", alias: "lastName"},
            "email", "info", "phone", "mobile", "company", {field: "web", alias: "website"}, "roles", "options"
        ];


    // user constructor
    giscloud.User = function (userdata) {
        var i, k, f;

        // create getter methods
        for (i = 0, k = readOnlyFields.length; i < k; i++) {
            f = readOnlyFields[i];
            this[f.alias || f] = getter(f.field || f, userdata);
        }

        // create getter/setter methods
        for (i = 0, k = updateableFields.length; i < k; i++) {
            f = updateableFields[i];
            this[f.alias || f] = gettersetter(f.field || f, userdata);
        }

        // resolve date values
        for (i = 0, k = dateFields.length; i < k; i++) {
            f = dateFields[i];
            userdata[f.field || f] = resolveDate(userdata[f.field || f]);
        }
    };

    giscloud.User.prototype = {
        update: function () {
            var i, k, f, data;

            data = {};

            for (i = 0, k = updateableFields.length; i < k; i++) {
                f = updateableFields[i];
                data[f.field || f] = this[f.alias || f]();
            }

            return giscloud.users.update(this.id(), data);
        },

        remove: function () {
            return giscloud.users.remove(this.id());
        }
    };


    // resolves the date returned from REST
    resolveDate = function (d) {
        var date = new Date(d);
        if (date && !isNaN(date.getTime())) {
            return date;
        } else {
            return d;
        }
    };

    // returns a function which  is a getter of a value 'which' from an object 'where'
    getter = function (which, where) {
        return function () {
            return where[which];
        };
    };

    // returns a function which  is a getter/setter for the value 'which' on an object 'where'
    gettersetter = function (which, where, returnValue) {
        return function (what) {
            if (what !== undefined) {
                where[which] = what;
                return returnValue;
            } else {
                return where[which];
            }
        };
    };

}());
(function (window, $, common, undefined) {

   giscloud.users = {

        list: function (options, callback) {
            var url = "users",
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else {
                callback = callback || options.callback;
            }

            options.expand = "roles, options";

            common.rest.get(url, options).done(function (response) {
                var i, k, users = [];
                try {
                    // prepare data
                    for (i = 0, k = response.data.length; i < k; i++) {

                        // handle user options
                        if (response.data[i].options && response.data[i].options.length) {
                            response.data[i]._options = {};
                            $.each(response.data[i].options, function (i, opt) {
                                response.data[i]._options[opt.name] = opt.value;
                            });
                            response.data[i].options = response.data[i]._options;
                            delete response.data[i]._options;
                        } else {
                            response.data[i].options = null;
                        }

                        users.push(new giscloud.User(response.data[i]));
                    }
                    // callback
                    if (typeof callback == "function") {
                        callback(users);
                    }
                    // resolve the deferred
                    def.resolve(users);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        },

        byId: function (id, options, callback) {
            var url = "users/" + id,
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else {
                callback = callback || options.callback;
            }

            options.expand = "roles,options";

            common.rest.get(url, options).done(function (response) {
                var user;
                try {
                    // handle user options
                    if (response.options && response.options.length) {
                        response._options = {};
                        $.each(response.options, function (i, opt) {
                            response._options[opt.name] = opt.value;
                        });
                        response.options = response._options;
                        delete response._options;
                    } else {
                        response.options = null;
                    }

                    // prepare data
                    user = new giscloud.User(response);
                    // callback
                    if (typeof callback == "function") {
                        callback(user);
                    }
                    // resolve the deferred
                    def.resolve(user);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        },

        current: function (options, callback) {
            var url = "users/current",
                def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else {
                callback = callback || options.callback;
            }

            options.expand = "roles,options";

            common.rest.get(url, options).done(function (response) {
                var user;
                try {
                    // handle user options
                    if (response.options && response.options.length) {
                        response._options = {};
                        $.each(response.options, function (i, opt) {
                            response._options[opt.name] = opt.value;
                        });
                        response.options = response._options;
                        delete response._options;
                    } else {
                        response.options = null;
                    }

                    // prepare data
                    user = new giscloud.User(response);
                    // callback
                    if (typeof callback == "function") {
                        callback(user);
                    }
                    // resolve the deferred
                    def.resolve(user);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        },

        remove: function(id) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "users/" + id)
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        update: function(id,  data) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("PUT", "users/" + id, JSON.stringify(data), "application/json")
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        },

        create: function (data) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("post", "users/", JSON.stringify(data), "application/json")
            .done(function(data, location) {
                var m = location && location.match(/users\/(\d+)/);
                dfrd.resolveWith(that, [m && m[1]]);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        }
    };


}(window, giscloud.exposeJQuery(), window.giscloud.common()));
(function ($, common) {
    "use strict";
    giscloud.keys = {

        add: function (description) {
            var url = "keys.json",
                dfrd = new $.Deferred(),
                opts = "";

            if (description != null && typeof description === "string") {
                opts = JSON.encode({ key_desc: description });
            }

            common.rest.call("post", url, opts, "application/json", true)
            .done(function (response, loc) {
                dfrd.resolve({
                    id: loc && loc.match && loc.match(/keys\/(\d+)/)[1],
                    key: response.value
                });
            })
            .fail(function () {
                dfrd.reject();
            });

            return dfrd;
        },

        remove: function (id) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "keys/" + id)
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        }

    };


}(giscloud.exposeJQuery(), window.giscloud.common()));
/*global giscloud:true */
(function ($, common) {
    "use strict";
    giscloud.forms = {

        create: function (name, definition) {
            var url = "forms.json",
                dfrd = new $.Deferred(),
                opts = {
                    name: name,
                    definition: (typeof definition === "string") ?
                        definition :
                        JSON.stringify(definition)
                };

            common.rest.call("post", url, opts, "application/json")
            .done(function (response, loc) {
                dfrd.resolve(loc && loc.match && loc.match(/forms\/(\d+)/)[1]);
            })
            .fail(function () {
                dfrd.reject();
            });

            return dfrd;
        },

        update: function (formId, name, definition) {
            var url = "forms/" + formId + ".json",
                dfrd = new $.Deferred(),
                opts = {
                    name: name,
                    definition: (typeof definition === "string") ?
                        definition :
                        JSON.stringify(definition)
                };

            common.rest.call("put", url, opts, "application/json")
            .then(dfrd.resolve, dfrd.reject);

            return dfrd.promise();
        },

        setLayerMappings: function (layerId, formId, mappings) {
            var url = "layers/" + layerId + "/forms/" + formId + ".json",
                dfrd = new $.Deferred(),
                opts = {};

            if (mappings != null) {
                opts.mappings = mappings;
            }

            common.rest.call("put", url, opts, "application/json")
            .done(function () {
                dfrd.resolve();
            })
            .fail(function () {
                dfrd.reject();
            });

            return dfrd;
        },

        remove: function (id) {
            var dfrd = new $.Deferred(), that = this;
            common.rest.call("DELETE", "forms/" + id)
            .done(function() {
                dfrd.resolveWith(that);
            })
            .fail(function() {
                dfrd.rejectWith(that, arguments);
            });
            return dfrd.promise();
        }

    };


}(giscloud.exposeJQuery(), window.giscloud.common()));

(function ($, common) {
    "use strict";

    giscloud.tables = {

        list: function (options) {
            var url = "tables",
                def = new $.Deferred();

            common.rest.get(url, options).done(function (response) {
                def.resolve(response);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        },

        byName: function (name) {
            var url = "tables/" + name,
                def = new $.Deferred();

            common.rest.get(url)
            .done(function (response) {
                def.resolve(response);
            })
            .fail(function () {
                def.reject();
            });
            return def.promise();
        },

        remove: function (name) {
            var dfrd = new $.Deferred();

            common.rest.call("DELETE", "tables/" + name)
            .done(function() {
                dfrd.resolve();
            })
            .fail(function() {
                dfrd.reject();
            });
            return dfrd.promise();
        },

        create: function (data) {
            var dfrd = new $.Deferred();

            if (!data) {
                return;
            }

            if (data.geometry === "line" || data.geometry === "LINE")
            {
                data.geometry = "LINESTRING";
            }

            common.rest.call("post", "tables", common.toXml("table", data), "text/xml")
            .done(function(data, location) {
                var m = location && location.match(/tables\/(\w+)/);
                dfrd.resolve([m && m[1]]);
            })
            .fail(function() {
                dfrd.reject(arguments);
            });
            return dfrd.promise();
        },

        join: function (source, target, viewName, on, idFields, fields, joinType) {
            var dfrd = new $.Deferred(),
                sourceTable = source.table || source,
                targetTable = target.table || target,
                sourceReadOnly = !!source.readOnly,
                targetReadOnly = !!target.readOnly,
                url = "tables/" + sourceTable + "/join.json",
                params = {
                    table: targetTable,
                    name: viewName,
                    on: on,
                    id_fields: idFields,
                    source_read_only: sourceReadOnly,
                    target_read_only: targetReadOnly
                };

                if (fields && $.isArray(fields.source) && $.isArray(fields.target)) {
                    params.fields = fields;
                }

                if (typeof joinType === "string") {
                    params.join_type = joinType;
                }

                common.rest.get(url, params, "application/json")
                .done(function(data, status, jqxhr) {
                    var location = jqxhr.getResponseHeader("Location"),
                        m = location && location.match(/tables\/(\w+)/);
                    dfrd.resolve([m && m[1]]);
                })
                .fail(function() {
                    dfrd.reject(arguments);
                });
                return dfrd.promise();
        }
    };


}(giscloud.exposeJQuery(), window.giscloud.common()));
(function ($, common) {
    "use strict";

    giscloud.bookmarks = {

        list: function (options) {
            var url = "bookmarks",
                def = new $.Deferred();

            common.rest.get(url, options).done(function (response) {
                def.resolve(response);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        },

        byMapId: function (mapId, options, callback) {
            var url = "maps/" + mapId + "/bookmarks",
                def = new $.Deferred();

            common.rest.get(url, options).done(function (response) {
                def.resolve(response);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        },

        remove: function (id) {
            var dfrd = new $.Deferred();

            common.rest.call("DELETE", "bookmarks/" + id)
            .done(function() {
                dfrd.resolve();
            })
            .fail(function() {
                dfrd.reject();
            });
            return dfrd.promise();
        },

        create: function (data) {
            var dfrd = new $.Deferred();

            if (!data) {
                return;
            }

            common.rest.call("post", "bookmarks", common.toXml("bookmark", data), "text/xml")
            .done(function(data, location) {
                var m = location && location.match(/bookmarks\/(\w+)/);
                dfrd.resolve([m && m[1]]);
            })
            .fail(function() {
                dfrd.reject(arguments);
            });
            return dfrd.promise();
        }
    };


}(giscloud.exposeJQuery(), window.giscloud.common()));
(function (window, $, common, undefined) {

    /*
     * Class: features
     * Provides access to GIS Cloud features.
     */

    giscloud.tasks = {

        list: function (options) {
            options = options || {};

            return common.rest.get("tasks", options)
                .pipe(
                    function (tasks) {
                        if (tasks && tasks.data) {
                            if (tasks.data.length === 0) {
                                return [];
                            }

                            return $.map(tasks.data, function (taskData) {
                                return new giscloud.Task(taskData);
                            });
                        }
                        return null;
                    },
                    function () {
                        return null;
                    }
                ).promise();
        },

        byType: function (type, options) {
            options = options || {};
            options["type"] = type;
            return this.list(options);
        },

        byId: function (taskId, options) {
            var url = "tasks/" + taskId;

            options = options || {};

            return common.rest.get(url, options)
                .pipe(
                    function (data) {
                        try {
                            return new giscloud.Task(data);
                        } catch (err) {
                            return null;
                        }
                    },
                    function () {
                        return null;
                    }
                ).promise();
        },

        remove: function(taskId) {
            return common.rest.call("DELETE", "tasks/" + taskId)
            .pipe(function() { return null; }, function() { return null; })
            .promise();
        },

        create: function (data, options) {
            var url = "tasks/";

            if (options) {
                url += "?" + $.map(options, function (val, key) {
                    return key + "=" + val;
                }).join("&");
            }

            if (data.id != null) {
                delete data.id;
            }

            return common.rest.call("post", url, JSON.stringify(data), "application/json")
                .pipe(
                    function(data, location, jqXHR) {
                        var loc =  location || jqXHR.getResponseHeader("Location"),
                            m = loc && loc.match(/tasks\/(\d+)/);

                        return m && m[1];
                    },
                    function() {
                        return null;
                    }
                ).promise();
        }
    };


}(window, window.giscloud.exposeJQuery(), window.giscloud.common()));

(function ($, common) {
    "use strict";

    // Javascript mapping of PHP permissions constant
    giscloud.permissions = {
        READ: 'READ',
        EDIT: 'EDIT',
        EDIT_WITH_SHARE: 'EDIT_WITH_SHARE'
    }

}(giscloud.exposeJQuery(), window.giscloud.common()));
(function ($, common) {
    "use strict";

    giscloud.datasources = {

        list: function (options) {
            var url = "datasources",
            def = new $.Deferred();

            common.rest.get(url, options).done(function (response) {
                def.resolve(response);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        },

        byId: function (id, options, callback) {
            var url = "datasources/" + id,
            def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options)
                .done(function () {
                    var data = arguments[0], datasource;
                    try {
                        // prepare data
                        datasource = new giscloud.datasources.Datasource(data);
                        // callback
                        if (typeof callback == "function") {
                            callback(datasource);
                        }
                        // resolve the deferred
                        def.resolve(datasource);
                    } catch (err) {
                        def.reject();
                    }
                })
                .fail(function () {
                    def.reject();
                });
            return def.promise();
        },

        update: function(id,  data) {
            var dfrd = new $.Deferred(), that = this;

            if (id == null) {
                return this.create(data);
            }

            common.rest.call("PUT", "datasources/" + id, JSON.stringify(data), "application/json")
                .done(function() {
                    dfrd.resolveWith(that);
                })
                .fail(function() {
                    dfrd.rejectWith(that, arguments);
                });
            return dfrd.promise();
        },

        remove: function (id) {
            var dfrd = new $.Deferred();

            common.rest.call("DELETE", "datasources/" + id)
                .done(function() {
                    dfrd.resolve();
                })
                .fail(function() {
                    dfrd.reject();
                });
            return dfrd.promise();
        },

        create: function (data) {
            var dfrd = new $.Deferred();

            if (!data) {
                return;
            }

            common.rest.call("post", "datasources", common.toXml("datasource", data), "text/xml")
                .done(function(data, location) {
                    var m = location && location.match(/datasources\/(\w+)/);
                    dfrd.resolve([m && m[1]]);
                })
                .fail(function() {
                    dfrd.reject(arguments);
                });
            return dfrd.promise();
        },

        share: function(resource_id, options) {
            var dfrd = new $.Deferred(), that = this;

            var data = options;

            common.rest.call("post", "resources/"+resource_id+"/permission", JSON.stringify(data), "application/json")
                .done(function() {
                    dfrd.resolveWith(that);
                })
                .fail(function() {
                    dfrd.rejectWith(that, arguments);
                });
            return dfrd.promise();
        },

        unshare: function(resource_id, id) {
            var dfrd = new $.Deferred(), that = this;

            common.rest.call("DELETE", "resources/"+resource_id+"/permission/" + id)
                .done(function() {
                    dfrd.resolve();
                })
                .fail(function() {
                    dfrd.reject();
                });
            return dfrd.promise();
        },


        // Columns

        columns: function (id_or_rel_path, options, callback) {
            var url, def = new $.Deferred();

            if ($.isNumeric(id_or_rel_path)) {
                url = "datasources/" + id_or_rel_path+"/columns";
            }else{
                url = "datasources/columns?source=" + id_or_rel_path;
            }

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = null;
            } else {
                callback = callback || options.callback;
            }

            common.rest.get(url, options)
                .done(function () {
                    var data = arguments[0];
                    try {
                        // callback
                        if (typeof callback == "function") {
                            callback(data);
                        }
                        // resolve the deferred
                        def.resolve(data);
                    } catch (err) {
                        def.reject();
                    }
                })
                .fail(function () {
                    def.reject();
                });
            return def.promise();
        },

        addColumn: function (id_or_rel_path, data) {
            var url, dfrd = new $.Deferred();

            if (!data) {
                return;
            }

            if ($.isNumeric(id_or_rel_path)) {
                url = "datasources/" + id_or_rel_path+"/columns";
            }else{
                url = "datasources/columns?source=" + id_or_rel_path;
            }

            common.rest.call("post", url, common.toXml("column", data), "text/xml")
                .done(function(data, location) {
                    var m = location && location.match(/datasources\/(\w+)/);
                    dfrd.resolve([m && m[1]]);
                })
                .fail(function() {
                    dfrd.reject(arguments);
                });
            return dfrd.promise();
        },

        dropColumn: function (id_or_rel_path, data) {
            var url, dfrd = new $.Deferred(), that = this;

            if (!data) {
                return;
            }

            if ($.isNumeric(id_or_rel_path)) {
                url = "datasources/" + id_or_rel_path+"/columns";
            }else{
                url = "datasources/columns?source=" + id_or_rel_path;
            }

            common.rest.call("DELETE", url, common.toXml("column", data), "text/xml")
                .done(function() {
                    dfrd.resolveWith(that);
                })
                .fail(function() {
                    dfrd.reject(arguments);
                });
            return dfrd.promise();
        },

        updateColumn: function (id_or_rel_path, data) {
            var url, dfrd = new $.Deferred(), that = this;

            if (!data) {
                return;
            }

            if ($.isNumeric(id_or_rel_path)) {
                url = "datasources/" + id_or_rel_path+"/columns";
            }else{
                url = "datasources/columns?source=" + id_or_rel_path;
            }

            common.rest.call("PUT", url, common.toXml("column", data), "text/xml")
                .done(function() {
                    dfrd.resolveWith(that);
                })
                .fail(function() {
                    dfrd.reject(arguments);
                });
            return dfrd.promise();
        }



    };


}(giscloud.exposeJQuery(), window.giscloud.common()));
(function (window, $, undefined) {

    /*
     * Class: Datasource
     * Map datasource data.
     */

    /*
     * Constructor: Datasource
     * This constructor takes one argument, an object containing raw datasource data.
     *
     * The easiest way to obtain datasource data is to use giscloud.datasources.byId() method.
     */

    var data;

    giscloud.datasources.Datasource = function (d) {

        // init properties
        // $.extend(this, {
        //     id: data.id,
        //     name: data.name || null,
        //     owner: data.owner,
        // });
        data = d;
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.owner = data.owner_id;
            this.type = data.type;
            this.epsg = data.epsg*1;
            this.proj4 = data.proj4;
            this.description = data.description;
            this.copyright = data.copyright;
            this.params = $.parseJSON(data.params);
            this.bounds = new giscloud.Bounds(data.x_min, data.y_min, data.x_max, data.y_max);
            //this.data = data.data || {};
        } else {
            data = {};
        }

        this.share = function (username, permission) {
            return giscloud.datasources.share(this.id, username, permission);
        };

        this.remove = function () {
            return giscloud.datasources.remove(this.id);
        };

        this.update = function (options) {
            return;
            // !!!!!! TODO Need to refactor !!!!
            var b;
            data.data = this.data;
            b = this.bounds;
            that = this;

            if (b) {
                data.__x_min = (b && b.left);
                data.__y_min = (b && b.bottom);
                data.__x_max = (b && b.right);
                data.__y_max = (b && b.top);
            }

            if (this.id != null) {
                return giscloud.datasources.update(this.id, data);
            } else {
                // this will do a REST CREATE!
                // pick up the new id afterwards and update the datasource object
                return giscloud.datasources.update(data.id, data).done(function (id) {that.id = id; });
            }
        };

        this.clone = function() {
            return giscloud.datasources.create(data.data);
        };

    };


})(window, window.giscloud.exposeJQuery());

/*global giscloud */
(function ($, common) {
    "use strict";

    var datasrc = null;

    giscloud.datasources.apollo = {

        browse: function (res, options) {
            var url;

            if (typeof res === "string") {

                if (datasrc != null) {
                    url = "datasources/" + datasrc + "/apollo/" + res;
                } else {
                    url = "apollo/" + res;
                }

            } else {

                if (res.datasource != null) {
                    url = "datasources/" + res.datasource + "/apollo/" + res.resource;
                } else if (datasrc != null) {
                    url = "datasources/" + datasrc + "/apollo/" + res.resource;
                } else {
                    url = "apollo/" + res.resource;
                }

            }

            return common.rest.get(url, options).promise();
        },

        thumbnailUrl: function (res) {
            var url;

            if (typeof res === "string") {

                if (datasrc != null) {
                    url = "datasources/" + datasrc + "/apollo/" + res;
                } else {
                    url = "apollo/" + res;
                }

            } else {

                if (res.datasource != null) {
                    url = "datasources/" + res.datasource + "/apollo/" + res.resource;
                } else if (datasrc != null) {
                    url = "datasources/" + datasrc + "/apollo/" + res.resource;
                } else {
                    url = "apollo/" + res.resource;
                }

            }

            return common.rest.url(url + "/thumbnail");
        },

        datasource: function (dsid) {
            if (dsid === undefined) {
                return datasrc;
            }

            datasrc = dsid;
            return this;
        },

        processes: {

            list: function (options) {
                var url = "datasources/" + datasrc + "/apollo/processes";
                return common.rest.get(url, options)
                    .pipe(
                        function (response) {
                            if (response && response.data) {
                                return $.map(response.data, function (data) {
                                    return new giscloud.datasources.apollo.ApolloProcess(data);
                                });
                            }
                            return null;
                        },
                        function () { return null; }
                    )
                    .promise();
            },

            getDescription: function (id, options) {
                var url = "datasources/" + datasrc + "/apollo/processes/" + id;
                return common.rest.get(url, options)
                    .pipe(function (response) { return response; }, function () { return null; })
                    .promise();
            },

            execute: function (id, data, options) {
                var url = "datasources/" + datasrc + "/apollo/processes/" + id + "/execute.json";

                return common.rest.call("post", url, JSON.stringify(data), "application/json", options)
                    .pipe(
                        function (data, location) {
                            var m = location && location.match(/tasks\/(\w+)/);
                            return m && m[1];
                        },
                        function () {
                            return null;
                        }
                    );
            }

        }
    };


}(giscloud.exposeJQuery(), giscloud.common()));
(function ($) {


    giscloud.datasources.apollo.ApolloProcess = function (data) {

        this.id = data.Identifier;
        this.title = data.Title;
        this["abstract"] = data.Abstract;
        this.description = null;

    };


    giscloud.datasources.apollo.ApolloProcess.prototype = {

        getDescription: function (options) {
            var that = this,
                dfrd = new $.Deferred();

            giscloud.datasources.apollo.processes.getDescription(this.id, options)
            .then(
                function (description) {
                    if (description) {
                        that.description = description;
                    } else {
                        that.description = null;
                    }

                    dfrd.resolveWith(that, that.description);
                },

                function () {
                    dfrd.rejectWith(that);
                }
            );

            return dfrd.promise();
        },

        execute: function (data, options) {
            return giscloud.datasources.apollo.processes.execute(this.id, data, options);
        },

        status: function () {

        }

    };

})(giscloud.exposeJQuery());

(function ($, common) {
    "use strict";

    giscloud.datasources.wms = {

        getCapabilities: function (wms, version) {
            var resp = new $.Deferred(), url, params;

            url = fno.liveSite+"modules_gc/layer/cwms.php";
            params = {task:"getcapabilities",
                      module:"wms",
                      wms: wms,
                      version: version ? version : '1.1'};

            $.ajax({
                url: url,
                type: "GET",
                cache: false,
                dataType: "json",
                data: params
            })
                .done(function () {
                    var args = Array.prototype.slice.apply(arguments);
                    resp.resolve.apply(resp, args);
                })
                .fail(function () {
                    var args = Array.prototype.slice.apply(arguments);
                    resp.reject.apply(resp, args);
                });

            return resp.promise();
        }
    };


}(giscloud.exposeJQuery(), window.giscloud.common()));
(function ($, common) {
    "use strict";

    giscloud.spatialrelationship = {

        within: function(layer1_id, feature1_id, layer2_id, feature2_id, options) {
            var url = "geometry/within",
                def = new $.Deferred();

            options = options || {};

            options.layer1_id = layer1_id;
            options.layer2_id = layer2_id;
            options.feature1_id = feature1_id;
            options.feature2_id = feature2_id;

            common.rest.get(url, options).done(function(response, r, status) {
                def.resolve(status.status==201);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        },

        intersects: function(layer1_id, feature1_id, layer2_id, feature2_id, options) {
            var url = "geometry/intersects",
                def = new $.Deferred();

            options = options || {};

            options.layer1_id = layer1_id;
            options.layer2_id = layer2_id;
            options.feature1_id = feature1_id;
            options.feature2_id = feature2_id;

            common.rest.get(url, options).done(function(response, r, status) {
                def.resolve(status.status==201);
            }).fail(function () {
                def.reject();
            });

            return def.promise();
        }


    };


}(giscloud.exposeJQuery(), window.giscloud.common()));
(function (window, $, undefined) {


    /*
     * Class: Layer
     * Map layer data
     */

    function fromJson(input) {
        if (input == null) {
            return null;
        }

        if (typeof input === "string") {
            try {
                return JSON.parse(input);
            } catch (err) {
                return null;
            }
        } else {
            return input;
        }
    }

    /*
     * Constructor: Layer
     * This constructor takes one argument, an object containing raw layer data.
     *
     * The easiest way to obtain feature data is to use giscloud.layers.byId() method.
     */
    giscloud.Layer = function (data) {

        // init properties
        $.extend(this, {
            id: data.id,
            name: data.name || null,
            owner: data.owner,
            source: fromJson(data.source),
            columns: data.columns || null,
            onscale: data.onscale || null,
            offscale: data.offscale || null,
            label: data.label || null,
            textfield: data.textfield || null,
            styles: fromJson(data.styles),
            alpha: data.alpha || null,
            encoding: data.encoding || null,
            margin: data.margin || null,
            created: (data.created && new Date(data.created * 1000)) || null,
            visible: data.visible || null,
            lock: data.lock || null,
            raster: data.raster || null,
            grp: data.grp || null,
            exportable: data.exportable || null,
            parent: data.parent || null,
            tooltip: data.tooltip || null,
            label_placement: fromJson(data.label_placement),
            mapId: data.map_id || null,
            type: data.type || null,
            order: data.order,
            useInfoWindow: (data.use_info_window != null) ? data.use_info_window : false,
            modified: (data.modified && new Date(data.modified * 1000)) || null,
            form: data.form || null,
            bounds: new giscloud.Bounds(
                    data.x_min,
                    data.y_min,
                    data.x_max,
                    data.y_max
                )
        });

        //
        // Priveleged methods
        //
        this.copyStylesFrom = function (layerId) {
            var dfrd, oldStyles, newStyles, that;

            that = this;
            dfrd = new $.Deferred();

            // save old styles
            oldStyles = this.styles;

            // copy styles
            giscloud.layers.byId(layerId)
                .done(function (layer) {
                    newStyles = layer.styles;
                    that.styles = newStyles;
                    dfrd.resolve({newStyles: newStyles, oldStyles: oldStyles});
                })
                .fail(function () {
                    dfrd.reject();
                });

            return dfrd.promise();
        };

        this.remove = function() {
            return giscloud.layers.remove(this.id);
        };

        this.update = function() {
            var b;

            // update properties
            data.name = this.name || null;
            data.source = (this.source && JSON.stringify(this.source)) || null;
            data.columns = this.columns || null;
            data.onscale = this.onscale || null;
            data.offscale = this.offscale || null;
            data.label = this.label || null;
            data.textfield = this.textfield || null;
            data.alpha = this.alpha || null;
            data.encoding = this.encoding || null;
            data.margin = this.margin || null;
            data.visible = this.visible || null;
            data.lock = this.lock || null;
            data.raster = this.raster || null;
            data.grp = this.grp || null;
            data.exportable = this.exportable || null;
            data.parent = this.parent || null;
            data.tooltip = this.tooltip || null;
            data.label_placement = (this.label_placement && JSON.stringify(this.label_placement)) || null;
            data.styles = (this.styles && JSON.stringify(this.styles)) || null;
            data.mapId = this.map_id || null;
            data.type = this.type || null;
            data.order = this.order || null;
            data.use_info_window = (this.useInfoWindow != null) ? this.useInfoWindow : null;

            b = this.bounds;

            if (b && b.valid()) {
                data.x_min = b.left;
                data.y_min = b.bottom;
                data.x_max = b.right;
                data.y_max = b.top;
            }

            return giscloud.layers.update(data.id, data);
        };

        this.clone = function() {
            var d = {};
            $.extend(d, data);
            delete d.id;
            return giscloud.layers.create(d);
        };

        this.reset = function () {
            return giscloud.layers.reset(this.mapId, [this.id]);
        };
    };

}(window, window.giscloud.exposeJQuery()));
(function (window, $, undefined) {


    /*
     * Class: Feature
     * Map feature data.
     */

    /*
     * Constructor: Feature
     * This constructor takes one argument, an object containing raw feature data.
     *
     * The easiest way to obtain feature data is to use giscloud.features.byId() method.
     */
    giscloud.Feature = function (d) {
        var data = d;
        if (data) {
            this.id = (data.__id !=  null) ? data.__id : data.id;
            this.owner = data.__owner;
            this.layerId = (data.__layerId != null) ? data.__layerId : (data.__layer_id || data.layerId);
            this.geometry = data.__geometry || data.geometry ||null;
            this.bounds = new giscloud.Bounds(data.__xmin, data.__ymin, data.__xmax, data.__ymax);
            this.data = data.data || {};
        } else {
            data = {};
        }

        this.remove = function () {
            return giscloud.features.remove(this.layerId, this.id);
        };

        this.update = function (options) {
            var b;
            data.layerId = this.layerId;
            data.data = this.data;
            data.geometry = this.geometry;
            b = this.bounds;
            that = this;

            delete data.__geometry;

            if (b) {
                data.__x_min = (b && b.left);
                data.__y_min = (b && b.bottom);
                data.__x_max = (b && b.right);
                data.__y_max = (b && b.top);
            }

            if (this.id != null) {
                return giscloud.features.update(data.layerId, this.id, data, options);
            } else {
                // this will do a REST CREATE!
                // pick up the new id afterwards and update the feature object
                return giscloud.features.update(data.layerId, null, data, options).done(function (id) {that.id = id; });
            }
        };

        this.clone = function() {
            return giscloud.features.create(this.layerId, { data: data.data, geometry: data.geometry });
        };

    };




})(window, window.giscloud.exposeJQuery());

(function (window, $, common, undefined) {
    /*
     * Class: ViewerLayer
     */

    giscloud.ViewerLayer = function (obj) {
        var b, d;
        if (obj && obj instanceof fnLayer) {

            // set id
            this.id = parseInt(obj.getId().replace(/layer(\d+)/, "$1"), 10);

            // set sourceId & source
            d = obj.getData();
            this.sourceId = d && d.srcId;
            this.source = d && d.src;

            // set bounds
            b = obj.getBound();
            this.bounds = b && new giscloud.Bounds(b.xMin, b.yMin, b.xMax, b.yMax);

            // set instance
            this.instance = obj;

        } else {
            throw "Invalid arguments.";
        }
    };

    //
    // Public methods
    //
    $.extend(giscloud.ViewerLayer.prototype, {

        /*
         * Method: visible
         */
        visible: function () {
            var show = arguments[0];
            if ($.type(show) == "boolean") {
                if (show) {
                    this.instance.enable();
                } else {
                    this.instance.disable();
                }
                return this;
            } else {
                return !this.instance.isEnabled();
            }
        },

        /*
         * Method: selectable
         */
        selectable: function () {
            var yesno = arguments[0];
            if ($.type(yesno) == "boolean") {
                this.instance.setSelectable(yesno);
                return this;
            } else {
                return this.instance.getSelectable();
            }
        },

        /*
         * Method: opacity
         */
        opacity: function () {
            var level = arguments[0];
            if ($.type(level) == "number") {
                this.instance.setAlpha(level);
                return this;
            } else {
                return this.instance.getAlpha();
            }
        }


    });

})(window, giscloud.exposeJQuery(), giscloud.common());

(function (window, $, common, undefined) {

    /*
     * Class: ViewerSelection
     * This represents a selection of features on the viewer map.
     */

    /*
     * Constructor:
     * Creates a <ViewerSelection> object.
     *
     *     Parameters:
     *     viewer - <Viewer> object
     *     A <Viewer> this selection is referring to.
     */
    giscloud.ViewerSelection = function (viewer) {
        var selection = {}, v = viewer, eventAnchor = {}, count = 0, oid = common.oid();

        if (viewer && viewer.constructor === giscloud.Viewer) {
            $.extend(this,  {

                /*
                 * Method: add
                 * Adds a feature to the selection.
                 * This triggers the <featureAdd> event.
                 *
                 *  Parameters:
                 *      featureId - Number
                 *      Id of the feature added to the selection.
                 *
                 *      layerId - Number
                 *      Id of the layer the to which the feature belongs.
                 *
                 *  Returns:
                 *  The <ViewerSelection> object.
                 */
                add: function (featureId, layerId, silent)  {
                    // add selection entry
                    if (selection[layerId] === undefined) {
                       selection[layerId] = [];
                    }
                    if ($.inArray(selection[layerId], featureId) === -1) {
                        selection[layerId].push(featureId);
                        count++;

                        // fire featureAdd event
                        if (!silent) {
                            $(eventAnchor).triggerHandler("featureAdd", [{
                                featureId: featureId,
                                layerId: layerId
                            }, this]);
                        }
                    }
                    return this;
                },

                /*
                 * Method: remove
                 * Removes a feature from the selection.
                 * This triggers the <featureRemove> event.
                 *
                 *  Parameters:
                 *      featureId - Number
                 *      Id of the feature removed from the selection.
                 *
                 *      layerId - Number
                 *      Id of the layer the to which the feature belongs.
                 *
                 *  Returns:
                 *  The <ViewerSelection> object.
                 */
                remove: function (featureId, layerId) {
                    var i, l = selection[layerId];
                    // remove selection entry
                    if (l !== undefined) {
                        i = $.inArray(featureId, l);
                        if (i > -1) {
                            l.splice(i, 1);
                            count--;
                            // fire featureRemove event
                            $(eventAnchor).triggerHandler("featureRemove", [{
                                featureId: featureId,
                                layerId: layerId
                            }, this]);
                        }
                    }
                    return this;
                },

                /*
                 * Method: toggle
                 * Toggles the feature selection. If the feature is not yet selected it is added to the selection,
                 * otherwise it is removed.
                 * This triggers the <featureAdd> or the <featureRemove> events respectively.
                 *
                 *  Parameters:
                 *      featureId - Number
                 *      Id of the feature removed from the selection.
                 *
                 *      layerId - Number
                 *      Id of the layer the to which the feature belongs.
                 *
                 *  Returns:
                 *  The <ViewerSelection> object.
                 */
                toggle: function (featureId, layerId) {
                    if (this.isSelected(featureId, layerId)) {
                        this.remove(featureId, layerId);
                    } else {
                        this.add(featureId, layerId);
                    }
                    return this;
                },

                /*
                 * Method: clear
                 * Clears the selection. If the layerId parameter is defined, only features belonging to that layer
                 * are cleared.
                 * This triggers the <selectionClear> event.
                 *
                 *  Parameters:
                 *      layerId - Number
                 *      Id of the layer.
                 *
                 *  Returns:
                 *  The <ViewerSelection> object.
                 */
                clear: function (layerId) {
                    if (layerId !== undefined && selection[layerId] !== undefined) {
                        count -= selection[layerId].length;
                        delete selection[layerId];
                    } else {
                        count = 0;
                        selection = {};
                    }
                    $(eventAnchor).triggerHandler("selectionClear", [this]);
                    return this;
                },

                /*
                 * Method: isSelected
                 * Determines whether or not a certain feature is selected.
                 *
                 *  Parameters:
                 *      Parameters:
                 *      featureId - Number
                 *      Id of the feature.
                 *
                 *      layerId - Number
                 *      Id of the layer the to which the feature belongs.
                 *
                 *  Returns:
                 *  True if the feature is selected, otherwise false
                 */
                isSelected: function (featureId, layerId) {
                    return selection[layerId] !== undefined && $.inArray(featureId, selection[layerId]) > -1;
                },

                /*
                 * Method: selected
                 * Gets or sets selection. Use get functionality for batch operations.
                 */
                selected: function (sel) {
                    var arr = [], add = this.add, silent = true;

                    // set selection
                    if ($.isArray(sel)) {
                        // clear existing selection
                        if (count > 0) {
                            this.clear();
                        }
                        // silently add features to selection
                        $.each(sel, function (i, item) {
                            add(item.featureId, item.layerId, silent);
                        });
                        // trigger the multipleFeaturesAdd only once
                        $(eventAnchor).triggerHandler(
                            "multipleFeaturesAdd", [
                                $.map(sel, function (itm) {
                                    return {
                                        featureId: itm.featureId,
                                        layerId: itm.layerId
                                    };
                                }),
                                this
                            ]
                        );

                        return this;
                    }

                    // get selection
                    $.each(selection, function (i) {
                        $.each(this, function () {
                            arr.push({
                                featureId: this,
                                layerId: i
                            });
                        });
                    });
                    return arr;
                },

                /*
                 * Method: count
                 * Returns the count of selected features
                 */
                count: function () {
                    return count;
                },

                bind: function (eventName, func) {
                    var that = this, f;
                    if (eventName && typeof eventName == "string" && typeof func == "function") {
                        // handler function
                        f = function () {
                            func.apply(that, Array.prototype.slice.call(arguments, 1));
                        };
                        // bind the handler function
                        $(eventAnchor).on(eventName, f);
                        // add unbind reference to the user function
                        if (!func.gcunbind) {
                            func.gcunbind = {};
                        }
                        func.gcunbind[oid + eventName] = f;
                    }
                    return this;
                },

                unbind: function (eventName, func) {
                    var f;
                    if (eventName && typeof eventName == "string" && typeof func == "function") {
                        // retrieve unbind data
                        f = func.gcunbind && func.gcunbind[oid + eventName];
                        if (f) {
                            $(eventAnchor).off(eventName, f);
                        }
                    }
                    return this;
                },

                //
                // events
                //

                /*
                 * Method: featureAdd
                 * Binds a handler for the featureAdd event.
                 *
                 *  Parameters:
                 *      func - Function
                 *      Handler function for the event. The handler will be passed the added feature and
                 *      the <ViewerSelection> objects as parameters.
                 *
                 *  Returns:
                 *      The selection object.
                 */
                featureAdd: function (func) {
                    return this.bind("featureAdd", func);
                },

                /*
                 * Method: featureRemove
                 * Binds a handler for the featureRemove event.
                 *
                 *  Parameters:
                 *      func - Function
                 *      Handler function for the event. The handler will be passed the removed feature and
                 *      the <ViewerSelection> objects as parameters.
                 *
                 *  Returns:
                 *      The selection object.
                 */
                featureRemove: function (func) {
                    return this.bind("featureRemove", func);
                },

                /*
                 * Method: selectionClear
                 * Binds a handler for the selectionClear event.
                 *
                 *  Parameters:
                 *      func - Function
                 *      Handler function for the event. The handler will be passed
                 *      the <ViewerSelection> object as a parameter.
                 *
                 *  Returns:
                 *      The selection object.
                 */
                selectionClear: function (func) {
                    return this.bind("selectionClear", func);
                }


            });
        } else {
            throw "Invalid constructor arguments.";
        }
    };

})(window, giscloud.exposeJQuery(), giscloud.common());


(function (window, $, common, fnViewer, undefined) {
    var rLayerFeatureIds = /^layer(\d+)\|\|(\d+)$/, initFlashnavigtor, pending,
        onFnViewerLayerRemoved, syncLayerData;

    /*
     * Class: Viewer
     */

    giscloud.Viewer = function () {
        var that = this,
            args = arguments,
            oid = common.oid(),
            eventAnchor = {},
            containerId, mapId, opts;

        //
        // Determine the constructor by analyzing the arguments
        //

        /*
         * Constructor: giscloud.Viewer(containerId: String, mapId: Number, opts: Object)
         */
        if (typeof args[0] === "string" /*&& isFinite(args[1])*/) {//typeof args[1] === "number") {
            this.containerId = containerId = args[0];
            this.mapId = mapId = args[1];
            opts = args[2] || {};

            this.initializing = new $.Deferred();
            this.loading = new $.Deferred();
            this.layersLoading = new $.Deferred();

            // init flashnavigator and add fnViewer creation to deferred's done queue
            initFlashnavigtor(containerId, opts)
                .done(function (evt) {
                    var i, fn = new fnViewer(evt);

                    // add plugins
                    fn.plugins = {};
                    fn.plugins.marker = new fnMarker(fn);
                    fn.plugins.kartehr = new fnKartehr(fn);
                    fn.plugins.canvas = new fnCanvas(fn);
                    fn.plugins.tooltip = new fnTooltip(fn);
                    fn.plugins.kartehr.liveSite("http://www.mapcow.org/");
                    if (opts.scalebar) {
                        fn.plugins.scalebar = new fnScalebar(fn);
                    }
                    if (opts.slider) {
                        fn.plugins.slider = new fnSlider(fn);
                    }

                    fn.enablePanWithMiddleButton();

                    // register viewer instance and resolve the initializing deferred
                    that.instance = fn;
                    that.initializing.resolveWith(that, []);

                    // we need to monitor layerr removal to keep this.layers array in sync
                    fn.addEventListener("layerRemoved", $.proxy(onFnViewerLayerRemoved, that));

                    // set the viewer ready event to fire after map has finished loading
                    fn.addEventListener("load", function () {
                        var  dfrd;

                        if ((giscloud && giscloud.layers && that.mapId != null) &&
                             !opts.dontWaitForLayers) {
                            // get layer data from rest, map.xml is not enough :(
                            dfrd = giscloud.layers.byMapId(that.mapId, { expand: "columns" });
                        } else {
                            // create a dummy deferred and resolve it immediately
                            dfrd = (new $.Deferred()).resolve(null);
                        }

                        dfrd.always(function (restLayerData) { // antoher anon function, sry marko
                            if (opts.dontWaitForLayers) {
                                if (giscloud && giscloud.layers && that.mapId != null) {
                                    giscloud.layers.byMapId(that.mapId, { expand: "columns" })
                                    .done(function (layerData) {
                                        syncLayerData(that, layerData);
                                        that.layersLoading.resolveWith(that, [layerData]);
                                    })
                                    .fail(that.layersLoading.reject);
                                }
                            }

                            // sync the layer list
                            syncLayerData(that, restLayerData);

                            if (restLayerData) {
                                that.layersLoading.resolveWith(that, [restLayerData]);
                            }

                            // create new graphic object
                            that.graphic = new giscloud.Graphic(that);

                            // create new selection object and bind event handlers
                            if (!that.selection) {
                                that.selection = new giscloud.ViewerSelection(that);
                                that.selection.featureAdd(function (obj) {
                                    // highlight the feature on the viewer
                                    common.highlight(that.instance, obj.featureId, obj.layerId, false);
                                    $(eventAnchor).triggerHandler("selectionChange", {
                                        action: "add",
                                        feature: obj
                                    });
                                });
                                that.selection.bind("multipleFeaturesAdd", function (arr) {
                                    var byLayerId = {}, i, l, lid;
                                    // separate features by layer id
                                    for (i = 0, l = arr.length; i < l; i++) {
                                        lid = arr[i].layerId;
                                        if (byLayerId[lid] === undefined) {
                                            byLayerId[lid] = [arr[i].featureId];
                                        } else {
                                            byLayerId[lid].push(arr[i].featureId);
                                        }
                                    }
                                    // call highlight once for each layer
                                    for (lid in byLayerId) {
                                        if (byLayerId.hasOwnProperty(lid)) {
                                            common.highlightMultiple(that.instance, byLayerId[lid], lid, false);
                                        }
                                    }
                                    $(eventAnchor).triggerHandler("selectionChange", {
                                        action: "add",
                                        feature: arr
                                    });
                                });

                                that.selection.featureRemove(function (obj, selection) {
                                    // highlight only selected features
                                    var fids = $.map(selection.selected(), function (sel) {
                                        return "layer" + sel.layerId + "||" + sel.featureId;
                                    }).join();
                                    common.highlight(that.instance, fids, null, true);
                                    $(eventAnchor).triggerHandler("selectionChange", {
                                        action: "remove",
                                        feature: obj
                                    });
                                });
                                that.selection.selectionClear(function () {
                                    that.instance.modifyObject(null, {}, null, true);
                                    $(eventAnchor).triggerHandler("selectionChange", {
                                        action: "clear"
                                    });
                                });
                            }

                            // init the proj4js projection
                            Proj4js.defs["GC_MAP_CURRENT"] = that.instance.projection;
                            that.projection = new Proj4js.Proj("GC_MAP_CURRENT");

                            // trigger the viewer ready event
                            $(eventAnchor).triggerHandler("ready", [that]);

                            // resolve the loading defferred
                            that.loading.resolveWith(that, []);
                        });

                    });

                    fn.addEventListener("reload", function () {
                        var  dfrd;

                        if ((giscloud && giscloud.layers && that.mapId != null) &&
                             !opts.dontWaitForLayers) {
                            // get layer data from rest, map.xml is not enough :(
                            dfrd = giscloud.layers.byMapId(that.mapId, { expand: "columns" });
                        } else {
                            // create a dummy deferred and resolve it immediately
                            dfrd = (new $.Deferred()).resolve(null);
                        }

                        dfrd.always(function (restLayerData) { // antoher anon function, sry marko
                            if (opts.dontWaitForLayers) {
                                if (giscloud && giscloud.layers && that.mapId != null) {
                                    giscloud.layers.byMapId(that.mapId, { expand: "columns" })
                                    .done(function (layerData) {
                                        syncLayerData(that, layerData);
                                        that.layersLoading.resolveWith(that, [layerData]);
                                    })
                                    .fail(that.layersLoading.reject);
                                }
                            }

                            // sync the layer list
                            syncLayerData(that, restLayerData);

                            if (restLayerData) {
                                that.layersLoading.resolveWith(that, [restLayerData]);
                            }

                            // init the proj4js projection
                            Proj4js.defs["GC_MAP_CURRENT"] = that.instance.projection;
                            that.projection = new Proj4js.Proj("GC_MAP_CURRENT");

                            // resolve the loading defferred
                            that.loading.resolveWith(that, []);
                        });
                    });

                    if (that.instance.setLayerFeatureFilter && flashnavigator.extraOptions) {
                        for (i in flashnavigator.extraOptions.data) {
                            that.instance.setLayerFeatureFilter("layer"+i,
                                                                flashnavigator.extraOptions.data[i]);
                        }
                    }

                    // load map
                    if (mapId)
                        that.loadMap(mapId);

                    $(eventAnchor).triggerHandler("init", [that]);
                });
        }

        //
        // Invalid constructor arguments
        //
        else {
            common.setError(this, "constructor", "Invalid constructor arguments");
        }

        /*
         * Property: activeLayer
         */
        this.activeLayer = null;

        this.markers = [];

        this.editing = null;

        //
        // Priveleged methods
        //
        $.extend(this, {

            /*
             * Method: bind
             * Binds an event handler to the viewer object.
             *
             *  Parameters:
             *      eventName - String, name of the event.
             *      func - Function, the handler function.
             *
             *  Returns:
             *  The viewer object.
             */
            bind: function (eventName, func) {
                var that = this, f;
                if (eventName && typeof eventName === "string" && typeof func === "function") {

                   switch (eventName) {

                        case "mouseDown":
                            f = function (evt) {
                                func.call(that, new giscloud.LonLat(evt.x, evt.y));
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("mousedown", f);
                            });
                            break;

                        case "mouseMove":
                            f = function (evt) {
                                func.call(that, new giscloud.LonLat(evt.x, evt.y));
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("mousemove", f);
                            });
                            break;

                        case "scaleChange":
                            f = function (evt) {
                                func.call(that, that.instance.convertScale(evt.zoom));
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("scalechange", f);
                            });
                            break;

                        case "featureClick":
                            f = function (evt) {
                                var m = evt.id.match(rLayerFeatureIds);
                                var evtobj = {
                                    layerId: parseInt(m[1], 10),
                                    featureId: parseInt(m[2], 10),
                                    key: evt.key,
                                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                                };
                                func.call(that, evtobj);
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("object_click", f);
                            });
                            break;

                        case "featureDoubleclick":
                            f = function (evt) {
                                var m = evt.id.match(rLayerFeatureIds);
                                func.call(that, {
                                    layerId: parseInt(m[1], 10),
                                    featureId: parseInt(m[2], 10),
                                    key: evt.key,
                                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                                });
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("object_dblclick", f);
                            });
                            break;

                        case "featureOver":
                            f = function (evt) {
                                var m = evt.id.match(rLayerFeatureIds);
                                func.call(that, {
                                    layerId: parseInt(m[1], 10),
                                    featureId: parseInt(m[2], 10),
                                    key: evt.key,
                                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                                });
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("object_over", f);
                            });
                            break;

                        case "featureOut":
                            f = function (evt) {
                                var m = evt.id.match(rLayerFeatureIds);
                                func.call(that, {
                                    layerId: parseInt(m[1], 10),
                                    featureId: parseInt(m[2], 10),
                                    key: evt.key,
                                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                                });
                            };
                            this.initializing.done(function () {
                                that.instance.addEventListener("object_out", f);
                            });
                            break;

                        default:
                            f = function () {
                                var args = Array.prototype.slice.call(arguments, 1);
                                func.apply(that, args);
                            };
                            $(eventAnchor).on(eventName, f);
                            break;
                    }

                    // add unbind reference to the user function
                    if (!func.gcunbind) {
                        func.gcunbind = {};
                    }
                    func.gcunbind[oid + eventName] = f;
                }

                return this;
            },

            /*
             * Method: unbind
             * Unbinds an event handler from the viewer object.
             *
             *  Parameters:
             *      eventName - String, name of the event.
             *      func - Function, the handler function.
             *
             *  Returns:
             *  The viewer object.
             */
            unbind: function (eventName, func) {
                var that = this, f;
                if (eventName && typeof eventName === "string" && typeof func === "function") {
                   // retrieve unbind data
                   f = func.gcunbind && func.gcunbind[oid + eventName];
                   if (f) {
                       switch (eventName) {

                           case "mouseDown":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("mousedown", f);
                               });
                               break;

                           case "mouseMove":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("mousemove", f);
                               });
                               break;

                           case "scaleChange":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("scalechange", f);
                               });
                               break;

                           case "featureClick":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("object_click", f);
                               });
                               break;

                           case "featureDoubleclick":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("object_dblclick", f);
                               });
                               break;

                           case "featureOver":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("object_over", f);
                               });
                               break;

                           case "featureOut":
                               this.initializing.done(function () {
                                   that.instance.removeEventListener("object_out", f);
                               });
                               break;

                           default:
                               $(eventAnchor).off(eventName, f);
                               break;
                       }
                   }
                }

                return this;
            }
        });
    };

    //
    // Public methods
    //
    $.extend(giscloud.Viewer.prototype, {

        /*
         * Method: loadMap
         * Loads a new map into the viewer.
         *
         *  Parameters:
         *
         *      mapId - Number
         *              Id of the map.
         *
         *      callback - Function
         *                 Function to be called after the map is loaded. The function will be
         *                 passed the viewer instance as a parameter.
         *
         *  Returns:
         *  The <Viewer> object.
         */
        loadMap: function (mapId, callback) {
            var xmlUrl, token, v = this.instance;

            if (!v) {
                common.setError(this, "loadMap", "No viewer instance.");
                return this;
            }

            if (!mapId) {
                common.setError(this, "loadMap", "Invalid map id.");
                return this;
            }

            // create xml url
            xmlUrl = common.liveSite() + "maps/map" + mapId + ".xml";
            // add token if available
            token = giscloud.oauth2.token();
            if (token) {
                xmlUrl += "?oauth_token=" + token;
            }

            // add loading deferreds
            if (this.loading.state() !== "pending") {
                this.loading = new $.Deferred();
            }
            if (this.layersLoading.state() !== "pending") {
                this.layersLoading = new $.Deferred();
            }

            // load!
            v.src(true);
            v.load(xmlUrl, false, callback);

            // set map id
            this.mapId = mapId;

            return this;
        },

        reloadMap: function () {
            var xmlUrl, token, v = this.instance;

            if (!v) {
                common.setError(this, "reloadMap", "No viewer instance.");
                return this;
            }

            if (!this.mapId) {
                common.setError(this, "reloadMap", "Invalid map id.");
                return this;
            }

            // create xml url
            xmlUrl = common.liveSite() + "maps/map" + this.mapId + ".xml";
            // add token if available
            token = giscloud.oauth2.token();
            if (token) {
                xmlUrl += "?oauth_token=" + token;
            }

            // add loading deferreds
            if (this.loading.state() !== "pending") {
                this.loading = new $.Deferred();
            }
            if (this.layersLoading.state() !== "pending") {
                this.layersLoading = new $.Deferred();
            }

            // reload! + override url
            v.reload(xmlUrl);


            return this;
        },

        /*
         * Method: ready
         * Registers an event handler function for the viewer ready event.
         */
        //ready: common.evtMethod("ready"),
        ready: function (func) {
            return this.bind("ready", func);
        },

        /*
         * Method: init
         * Registers an event handler function for the viewer init event.
         */
        //ready: common.evtMethod("init"),
        init: function (func) {
            return this.bind("init", func);
        },

        /*
         * Method: mouseDown
         * Registers an event handler function for the viewer mousedown event.
         */
        mouseDown: function (func) {
            return this.bind("mouseDown", func);
        },

        /*
         * Method: mousemove
         * Registers an event handler function for the viewer mousemove event.
         */
        mouseMove: function (func) {
            return this.bind("mouseMove", func);
        },

        /*
         * Method: scaleChange
         * Registers an event handler function for the viewer scaleChange event.
         */
        scaleChange: function (func) {
            return this.bind("scaleChange", func);
        },

        /*
         * Method: featureClick
         */
        featureClick: function (func) {
            return this.bind("featureClick", func);
        },

        /*
         * Method: featureDoubleclick
         */
        featureDoubleclick: function (func) {
            this.instance.addEventListener("object_dblclick", function (evt) {
                var m = evt.id.match(rLayerFeatureIds);
                func({
                    layerId: m[1],
                    featureId: m[2],
                    key: evt.key,
                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                });
            });
        },

        /*
         * Method: featureOver
         */
        featureOver: function (func) {
            this.instance.addEventListener("object_over", function (evt) {
                var m = evt.id.match(rLayerFeatureIds);
                func({
                    layerId: m[1],
                    featureId: m[2],
                    key: evt.key,
                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                });
            });
        },

        /*
         * Method: featureOut
         */
        featureOut: function (func) {
            this.instance.addEventListener("object_out", function (evt) {
                var m = evt.id.match(rLayerFeatureIds);
                func({
                    layerId: m[1],
                    featureId: m[2],
                    key: evt.key,
                    attributes: (evt.object ? evt.object.attributes : evt.attributes)
                });
            });
        },

        /*
         * Method: selectionChange
         */
        selectionChange: function (func) {
            return this.bind("selectionChange", func);
        },

        container: function (containerId) {
            if (containerId === undefined) {
                return $("#" + this.containerId)[0];
            } else {
                $("#" + containerId).append($("#" + this.containerId).detach());
                this.containerId = containerId;
                return this;
            }
        },

        /*
         * Method: width
         * Gets or sets the width of the viewer container element.
         *
         *  Returns:
         *  Width of the element in pixels or the viewer object.
         */
        width: function () {
            var el = $("#" + this.containerId);
            if (arguments[0]) {
                el.width(arguments[0]);
                return this;
            } else {
                return el.width();
            }
        },

        /*
         * Method: height
         * Gets or sets the width of the viewer container element.
         *
         *  Returns:
         *  Width of the element in pixels or the viewer object.
         */
        height: function () {
            var el = $("#" + this.containerId);
            if (arguments[0]) {
                el.height(arguments[0]);
                return this;
            } else {
                return el.height();
            }
        },

        /*
         * Method: bounds
         * Gets or sets bounds the viewer bounds.
         * After the bounds are set, a <boundsChange> event will fire.
         *
         *  Parameters:
         *      bounds - A <Bounds> object.
         *
         *  Returns:
         *      get - Viewer current <Bounds>.
         *      set - The viewer object.
         */
        bounds: function (bounds) {
            if (bounds !== undefined) {
                this.loading.done(function() {
                    this.instance.setViewBound(bounds.left, bounds.bottom, bounds.right, bounds.top, true);
                });
                return this;
            } else {
                var vb = this.instance.getViewBound();
                // HACK resolve asap - switched y max/min values
                //return new giscloud.Bounds(vb.xMin, vb.yMax, vb.xMax, vb.yMin);
                return new giscloud.Bounds(vb.xMin, vb.yMin, vb.xMax, vb.yMax);
            }
        },

        center: function (center, zoom) {
            if (center !== undefined) {
                if (!center || !(center instanceof giscloud.LonLat)) {
                    throw "Parameter 'center' should be a giscloud.LonLat instance.";
                } else {
                    this.loading.done(function() {
                        this.instance.setLocation(center.lon, center.lat, zoom);
                    });
                    return this;
                }
            } else {
                return this.bounds().center();
            }
        },

        /*
         * Method: scale
         * Gets or sets the current viewer scale.
         * After the scale is set, a <scaleChange> will fire.
         *
         *  Parameters:
         *      scale - Number
         *
         *  Returns:
         *      get - Number.
         *      set - the viewer object.
         */
        scale: function (scale) {
            if (scale !== undefined) {
                if (!isFinite(scale)) {
                    throw "Parameter 'scale' should be a finite number.";
                } else {
                    this.loading.done(function() {
                        this.instance.setScale(scale);
                    });
                    return this;
                }
            } else {
                return this.instance.getScale();
            }
        },

        /*
         * Method: showLayer
         * Shows a layer
         *
         *  Parameters:
         *      id - id of the layer
         *
         *  Returns:
         *  The <Viewer> object.
         */
        showLayer: function (id) {
            var i = $.data(this, "layerIndex")[id.toString()];
            this.layers[i] && this.layers[i].visible(true);
            this.showLayerLabels(id);
            return this;
        },

        /*
         * Method: hideLayer
         * Hides a layer
         *
         *  Parameters:
         *      id - id of the layer
         *
         *  Returns:
         *  The <Viewer> object.
         */
        hideLayer: function (id) {
            var i = $.data(this, "layerIndex")[id.toString()];
            this.layers[i] && this.layers[i].visible(false);
            this.hideLayerLabels(id);
            return this;
        },

        showLayerLabels: function (id) {
            var labelsId = "llayer" + id,
                fnlayer = this.instance.getLayerByName(labelsId);

            if (fnlayer) {
                fnlayer.enable();
            }
        },

        hideLayerLabels: function (id) {
            var labelsId = "llayer" + id,
                fnlayer = this.instance.getLayerByName(labelsId);

            if (fnlayer) {
                fnlayer.disable();
            }
        },

        /*
         * Method: layerById
         */
        layerById: function (layerId) {
            if (this.loading.state() === "resolved") {
                var l = $(this).data("layerIndex")[layerId];
                if (isFinite(l)) {
                    return this.layers[l];
                } else {
                    return null;
                }
            }
        },

        /*
         * Method: showTip
         *
         */
        showTip: function (text) {
            var that = this;
            this.initializing.done(function () {
                that.instance.plugins.tooltip.show(text);
            });

            return this;
        },

        /*
         * Method: hideTip
         *
         */
        hideTip: function () {
            var that = this;
            this.initializing.done(function () {
                that.instance.plugins.tooltip.hide();
            });

            return this;
        },

        addMarker: function (marker) {
            this.loading.done(function () {
                var m = this.instance.plugins.marker, sig, vis, pos, onMarkerStateChanged, addPoi, popupContent;

                addPoi = function (pos, ico, title, content, popup, fnMarker) {
                    var id;

                    title = title || "";
                    content = content ? popupContent(title, content) : "";

                    if (ico.url != null) {
                        return fnMarker.loadPoi(pos.lon, pos.lat, ico.url, { hoverText: title, popupContent: content, popupVisible: popup }, true, ico.width, ico.height);
                    }

                    id = fnMarker.loadPoi(pos.lon, pos.lat, ico, { hoverText: title, popupContent: content, popupVisible: popup }, true);

                    return id;
                };

                popupContent = function (title, content) {
                    return $("<div/>").append(
                            title ? $("<div/>", { "class": "gc-info-popup-title"}).html(title) : null,
                            content ? $("<div/>", { "class": "gc-info-popup-content"}).html(content) : null
                        ).html();
                };

                onMarkerStateChanged = function (jqevt, evt) {
                    var fnMarker = this.instance.plugins.marker,
                        state = evt.state,
                        marker = state.marker,
                        id = marker._id || null,
                        val = evt.newValue,
                        pos = marker.location();

                    if (evt.oldValue === val) {
                        return;
                    }

                    switch (evt.property) {
                        case "location":
                            if (val && val instanceof giscloud.LonLat && val.valid() && marker.visible()) {
                                if (id) {
                                    fnMarker.move(id, val.lon, val.lat);
                                } else {
                                    marker._id = addPoi(val, marker.icon(), marker.title(), marker.content(), marker.popup(), fnMarker);
                                }
                            } else {
                                id && fnMarker.removePoi(id);
                                marker._id = null;
                            }
                            break;

                        case "visible":
                            if (val && pos && pos instanceof giscloud.LonLat && pos.valid()) {
                                marker._id = addPoi(pos, marker.icon(), marker.title(), marker.content(), marker.popup(), fnMarker);
                            } else {
                                id && fnMarker.removePoi(id);
                                marker._id = null;
                            }
                            break;

                        case "popup":
                            if (id) {
                                fnMarker.removePoi(id);
                                marker._id = addPoi(pos, marker.icon(), marker.title(), marker.content(), val, fnMarker);
                            }
                            break;

                        case "title":
                            if (id) {
                                fnMarker.removePoi(id);
                                marker._id = addPoi(pos, marker.icon(), val, marker.content(), marker.popup(), fnMarker);
                            }
                            break;

                        case "content":
                            if (id) {
                                fnMarker.removePoi(id);
                                marker._id = addPoi(pos, marker.icon(), marker.title(), val, marker.popup(), fnMarker);
                            }
                            break;

                        case "icon":
                            if (id) {
                                fnMarker.removePoi(id);
                                marker._id = addPoi(pos, val, marker.title(), marker.content(), marker.popup(), fnMarker);
                            }
                            break;
                        default:
                    }
                };

                if (marker instanceof giscloud.Marker) {

                    pos = marker.location();
                    vis = marker.visible();
                    ico = marker.icon() || null;

                    this.markers.push(marker);

                    $(marker).on("stateChanged", $.proxy(onMarkerStateChanged, this));

                    marker._popupCloseHandler = function () {
                        marker.popup(false, true);
                    };
                    marker._popupOpenHandler = function () {
                        marker.popup(true, true);
                    };

                    $(m)
                    .on("popupClose.fnMarker", marker._popupCloseHandler)
                    .on("popupOpen.fnMarker", marker._popupOpenHandler);

                    if (vis && pos && pos instanceof giscloud.LonLat && pos.valid()) {
                        marker._id = addPoi(pos, ico, marker.title(), marker.content(), marker.popup(), m);
                    }

                } else if (marker instanceof giscloud.FlagMarker) {

                    // read marker's signature
                    sig = marker.sig;

                    if (sig && common.markers[sig].m) {
                        // marker already added
                        throw "This marker has already been added to a viewer.";
                    } else {

                        // create signature
                        marker.sig = "m" + common.oid();
                        sig = marker.sig;

                        // add a common reference
                        if (!common.markers) {
                            common.markers = {};
                        }
                        common.markers[sig] = {
                            m: m
                        };

                        vis = marker.visible();
                        pos = marker.position();

                        if (vis && pos) {
                            common.markers[sig].id = m.add(pos.lon, pos.lat, marker.color().hex("0x"), marker.title(), marker.content(), null, true);
                        } else {
                            common.markers[sig].id = null;
                        }

                        // add to markers list
                        this.markers.push(marker);

                        // save opened/closed state
                        common.markers[sig].open = true;
                        common.markers[sig].openCloseHandler = function (evt, id, open) {
                            if (common.markers[sig]) {
                                common.markers[sig].open = open;
                            }
                        };
                        $(m).on("fnMarker.OpenClose", common.markers[sig].openCloseHandler);
                    }
                } else {
                    throw "Not a giscloud marker.";
                }
            });

            return this;
        },

        removeMarker: function (marker) {
            this.loading.done(function () {
                var m = this.instance.plugins.marker, p;

                if (marker instanceof giscloud.Marker) {

                    if (marker._id) {
                        $(m)
                        .off("popupClose.fnMarker", marker._popupCloseHandler)
                        .off("popupOpen.fnMarker", marker._popupOpenHandler);

                        marker._popupCloseHandler = null;
                        marker._popupOpenHandler = null;

                        m.removePoi(marker._id);
                    }

                    p = $.inArray(marker, this.markers);
                    if (p > -1) {
                        this.markers.splice(p, 1);
                    }

                } else if (marker instanceof giscloud.FlagMarker) {

                    // check if this marker has already been added to this viewer
                    if (marker.sig && common.markers[marker.sig].m === m) {
                        // remove from map
                        common.markers[marker.sig].m.remove(common.markers[marker.sig].id);
                        // unbind open/close handler
                        $(m).off("fnMarker.OpenClose", common.markers[marker.sig].openCloseHandler);
                        delete common.markers[marker.sig].openCloseHandler;
                        // remove common reference
                        delete common.markers[marker.sig];
                        // remove from markers array
                        p = $.inArray(marker, this.markers);
                        if (p > -1) {
                            this.markers.splice(p, 1);
                        }
                        // remove signature
                        delete marker.sig;
                    } else {
                        throw "This is not a marker which belongs to this viewer.";
                    }
                } else {
                    throw "Not a giscloud marker.";
                }
            });

            return this;
        },

        /*
         * Method: fullExtent
         */
        fullExtent: function () {
            var that = this;
            this.loading.done(function () {
                that.instance.setViewBound();
            });
            return this;
        },

        /*
         * Method: measure
         */
        measure: function () {
            var that = this;
            this.loading.done(function () {
                that.select(false);
                that.instance.setTool("MeasureTool");
            });
            return this;
        },

        /*
         * Method: areaZoom
         *
         */
        areaZoom: function () {
            var that = this;
            this.loading.done(function () {
                that.select(false);
                that.instance.setTool("SelectAreaTool");
            });
            return this;
        },

        /*
         * Method: pan
         *
         */
        pan: function () {
            var that = this;
            this.loading.done(function () {
                that.select(false);
                that.instance.setTool("DragTool");
            });
            return this;
        },

        /*
         * Method: zoomToLayer
         *
         */
        zoomToLayer: function (layerId) {
            var that = this;
            this.loading.done(function () {
                var l = that.layerById(layerId);
                if (l) {
                    that.bounds(l.bounds);
                }
            });
            return this;
        },

        /*
         * Method: select
         */
        select: function (yesno) {
            var that = this, func;
            if (yesno) {
                // set tool to pan
                this.instance.setTool("DragTool");

                // enable viewer selection
                this.instance.enableSelection();

                func = $(this).data("selectFeatureClickCallback");
                if (!func) {
                    func = function (evt) {
                        var m = evt.id.match(rLayerFeatureIds),
                            fid = parseInt(m[2], 10),
                            lid = parseInt(m[1], 10),
                            ctrlDown = evt.key === 17,
                            sel = that.selection,
                            fn = that.instance,
                            highlight = function (fid, lid, clear) {
                                common.highlight(fn, fid, lid, clear);
                            };

                        if (ctrlDown) {
                            if (sel.isSelected(fid, lid)) {
                                // clear highlight completely
                                fn.demodifyObjectsColor();
                                // unselect feature
                                sel.remove(fid, lid);
                                // rehighlight still selected features
                                $.each(that.selection.selected().slice(0), function () {
                                    var f = this.featureId.toString(), l = this.layerId.toString();
                                    highlight(f, l, false);
                                });
                            } else {
                                // highlight feature
                                highlight(fid, lid, false);
                                sel.add(fid, lid);
                            }
                        } else {
                            if (sel.isSelected(fid, lid) && sel.count() === 1) {
                                // clear highlight completely
                                fn.demodifyObjectsColor();
                                // unselect feature
                                sel.remove(fid, lid);
                            } else {
                                // clear selection
                                sel.clear();
                                // highlight feature
                                highlight(fid, lid, true);
                                sel.add(fid, lid);
                            }
                        }
                    };
                    $(this).data("selectFeatureClickCallback", func);
                }

                // bind object_click event handler
                this.instance.addEventListener("object_click", func);

            } else {
                // disable viewer selection
                this.instance.disableSelection();

                // disable layers selection
                //for (; i < k; i++) {
                //    l[i].selectable(false);
                //}

                // unbind event handler
                this.instance.removeEventListener("object_click", $(this).data("selectFeatureClickCallback"));
            }
            return this;
        },

        /*
         * Method: selectFeature
         * Selects or unselects features.
         */
        selectFeature: function (layerId, featureId, yesno) {
            var sel = this.selection, alreadySelected = sel.isSelected(featureId, layerId),
                fid = parseInt(featureId, 10), lid = parseInt(layerId, 10), that = this;

            this.loading.done(function (){
                if (alreadySelected && !yesno) {
                    //
                    // unselect
                    //
                    // clear highlight completely
                    that.instance.demodifyObjectsColor();
                    // unselect feature
                    sel.remove(fid, lid);
                    // rehighlight still selected features
                    $.each(sel.selected().slice(0), function () {
                        var f = this.featureId.toString(), l = this.layerId.toString();
                        common.highlight(that.instance, f, l, false);
                    });
                } else if (!alreadySelected && yesno) {
                    // select
                    // highlight feature
                    common.highlight(that.instance, fid, lid, false);
                    sel.add(fid, lid);
                }
            });
            return this;
        },

        /*
         * Method: selectFeaturesByBounds
         * Selects features on a layer inside a <Bounds>
         */
        selectFeaturesByBounds: function (layerId, bounds, clear) {
            this.loading.done(function () {
                var that = this;
                if (clear) {
                    // clear highlight completely
                    this.instance.demodifyObjectsColor();
                    // clear selection
                    this.selection.clear();
                }
                // get features
                if (layerId !== null || layerId !== undefined) {
                    giscloud.features.byBounds(layerId, bounds).done(function (features) {
                        var i, k;
                        // select features
                        for (i = 0, k = features.length; i < k; i++) {
                            if (features[i].id !== undefined) {
                                that.selectFeature(layerId, features[i].id, true);
                            }
                        }
                    });
                }
            });
        },

        editFeature: function (layerId, featureId, options) {
            var that = this,
                oldEditing = this.editing,
                whenReady, editing;

            // decide on when to start the edit procedure
            if (pending(oldEditing)) {
                whenReady = $.proxy(oldEditing.fail, oldEditing);
                this.editCancel();
            } else {
                whenReady = $.proxy(this.loading.done, this.loading);
            }

            // set new editing deferred
            editing = new $.Deferred();

            // set option defaults
            options = options || {};

            // start the edit procedure when ready
            whenReady(function () {
                // check if the layer id is all right
                if (layerId == null || that.layerById(layerId) == null) {
                    editing.reject("Invalid layer id");
                    return;
                }

                // check feature id
                if (featureId == null) {
                    return;
                }

                // disable selection
                that.select(false);
                editing.always(function () {
                    that.select(true);
                });

                // get feature with geometry
                giscloud.features.byId(layerId, featureId, { geometry: "wkt" })
                // fail if this is an unknown feature
                .fail(function () {
                    editing.reject("Unknown feature");
                })
                // continue editing after feature
                .done(function (feature) {
                    var geom = giscloud.geometry.fromOGC(feature.geometry),
                        grFeature = geom && new giscloud.GraphicFeature(geom);

                    if (!grFeature) {
                        editing.reject("Invalid feature geometry"); // this should never happen
                        return;
                    }

                    // put the feature on the map
                    that.graphic.add(grFeature)
                    // and start editing
                    .edit(grFeature)
                    // reject editing if cancelled
                    .fail(function () {
                        editing.reject("Cancelled");
                    })
                    // when done, update feature geometry
                    .done(function (modifiedGrFeature) {
                        feature.geometry = modifiedGrFeature.toOGC();
                        feature.update({ use_map_srid: true })
                        .done(function () {
                            if (options.dontReset) {
                                // all done :)
                                editing.resolve();
                            } else {
                                giscloud.layers.reset(that.mapId, [layerId])
                                // now we're done
                                .always(function () { editing.resolve(); })
                                .done(function () { that.instance.reload(); });
                            }
                        })
                        .fail(function () {
                            // could not perform feature update
                            editing.reject("Error updating feature");
                        });
                    });

                    // remove graphic after edit
                    editing.always(function () {
                        that.graphic.remove(grFeature);
                    });
                });
            });

            // update viewer editing status
            this.editing = editing;

            return editing.promise();
        },

        editAccept: function () {
            if (pending(this.editing)) {
                this.graphic.editAccept();
            }
            return this;
        },

        editCancel: function () {
            if (pending(this.editing)) {
                this.graphic.editCancel();
            }
            return this;
        },

        filterFeatures: function (layerId, filter) {
            var viewer = this;
            this.loading.done(function () {
                var layerName, layerObject;

                if (layerId) {
                    layerName = "layer" + layerId,
                    viewer.instance.setLayerFeatureFilter(layerName, filter);
                    layerObject = viewer.instance.getLayerByName(layerName);
                    if (layerObject) {
                        layerObject.redraw();
                    }
                }
            });
        }

    });

    // checks if the state of a deferred is 'pending'
    pending = function (deferred) {
        return deferred && deferred.state() === "pending";
    };

    syncLayerData = function (viewer, restLayerData) {

        // create layer list and index
        var id, layer, restLayer, i, k, m, l,
            rLayerId = /^layer(\d+)$/,
            fn = viewer.instance;
            layerIndex = {};

        // reste the layers array
        viewer.layers = [];

        try {
            for (i = 0, k = fn.getLayerCount(); i < k; i++) {
                layer = fn.getLayer(i);
                id = layer.getId();
                m = id.match(rLayerId);
                if (m) {
                    id = m[1];
                    layerIndex[id] = i;
                    l = new giscloud.ViewerLayer(layer);
                    //l.selectable(layer.getSelectable());
                    viewer.layers.push(l);
                }
            }

            // set additional properties loaded from rest
            k = restLayerData && restLayerData.length;
            if (k) {
                for (i = 0; i < k; i++) {
                    restLayer = restLayerData[i];
                    layer = viewer.layers[layerIndex[restLayer.id]];
                    if (layer) {
                        layer.name = restLayer.name;
                        layer.type = restLayer.type;
                        layer.source = restLayer.source.src;
                        layer.sourceType = restLayer.source.type;
                        layer.columns = restLayer.columns;
                        layer.selectable(restLayer.lock == null || restLayer.lock !== "t");
                        layer.visible(restLayer.visible === "t");
                        layer.opacity(parseInt(restLayer.alpha, 10) || 100);
                    }
                }
            }
        } catch (exc) {
            console.log(exc);
        }
        $.data(viewer, "layerIndex", layerIndex);
    };

    onFnViewerLayerRemoved = function (removedLayer) {
        var id = removedLayer && removedLayer.id.match(/^layer(\d+)$/)[1],
            index = $.data(this, "layerIndex"),
            i = index[id], l;

        if (!isNaN(i)) {
            // remove layer froma the layers array
            this.layers.splice(i, 1);

            // rebuild index
            index = {};
            for (i = 0, l = this.layers.length; i < l; i++) {
                index[this.layers[i].id] = i;
            }

            // save index
            $.data(this, "layerIndex", index);
        }
    };

    // flash navigator init
    initFlashnavigtor = function (containerId, opts, onload) {
        var incl = "tooltip,marker,kartehr,canvas", dfrd = new $.Deferred();
        opts = opts || {};

        // include extra options
        if (opts.scalebar) {
            incl += ",scalebar";
        }
        if (opts.slider) {
            incl += ",slider";
        }
        flashnavigator.include(incl);
        flashnavigator.setOptions(opts);

        // create a flashnavigator deferred
        if (common.deferreds.flashnavigator === undefined) {
            common.deferreds.flashnavigator = {};
        }
        common.deferreds.flashnavigator[containerId] = dfrd;

        // set deferred done if onload callback exists
        dfrd.done(onload || null);

        // set container for this flashnavigator
        flashnavigator.container(containerId, {
            onLoad: function (evt) {
                // resolve deferred
                dfrd.resolve(evt);
            }
        });

        // return deferred object
        return dfrd;
    };

})(window, giscloud.exposeJQuery(), giscloud.common(), fnViewer);


(function (window, $, common, undefined) {

    var initialize, bindToAddress, createMarkerWithPopup, createPopup, markerStateChangeHandler, L, cssIncluded;

    // create leaflet loading deferred
    common.deferreds.leafletLoading = new $.Deferred();
    // and resolve it if Leaflet is already present
    if (window.L && window.L.Map) {
        L = window.L;
        common.deferreds.leafletLoading.resolve();
    }

    giscloud.exposeLeaflet = function()
    {
        return L;
    };
    /*
     / Constructor
    */
    giscloud.Viewer.Leaflet = function (containerId, mapId, options) {

        var that, state, eventAnchor, oid, layers, cssLoad;

        that = this;
        oid = common.oid();
        state = { options: options };
        eventAnchor = {};
        state.layers = [];

        // nothing happens before leaflet lib has been loaded, so load the script and resolve the deferred once done
        if (common.deferreds.leafletLoading.state() !== "resolved") {

            // include js
            giscloud.includeJs(
                common.liveSite() + "libs/leaflet-git/" + giscloud_config.leafletScript(),
                function () {
                    if (window.L) {
                        // add local reference
                        L = window.L;
                        // resolve
                        common.deferreds.leafletLoading.resolve();
                    } else {
                        // reject the deferred
                        common.deferreds.leafletLoading.reject();
                        common.deferreds.leafletLoading = new $.Deferred();
                    }
                }
            );

            // include css
            if (!cssIncluded) {
                if ($.browser.msie && parseFloat($.browser.version) <  9.0 &&
                    !("opacity" in document.createElement("div").style)) { // use feature detection rather than just
                                                                           // the browser version - this can be set
                                                                           // with X-UA-Compatible
                    cssLoad = $.when(
                        giscloud.includeCss(common.liveSite() + "libs/leaflet-git/leaflet.css"),
                        giscloud.includeCss(common.liveSite() + "libs/leaflet-git/leaflet.ie.css"),
                        giscloud.includeCss(common.liveSite() + "assets/api/1/css/gc-leaflet.css")
                    );
                } else {
                    cssLoad = $.when(
                        giscloud.includeCss(common.liveSite() + "libs/leaflet-git/leaflet.css"),
                        giscloud.includeCss(common.liveSite() + "assets/api/1/css/gc-leaflet.css")
                    );
                }
                cssLoad.done(function () { cssIncluded = true; });
            }

        }

        // init deferred
        this.init = new $.Deferred();

        // once init is done
        this.init.done(function() {
            var c, z;

            // expose leaflet map and layer
            that.map = state.map;
            that.layer = state.layer;
            that.instance = state.map;

            // read from address to set initial state
            if (options.address && options.address.read) {
                c = giscloud.address.param("center");
                z = giscloud.address.param("zoom");
            }

            // set address params
            if (c != null) {
                that.center(c);
            }
            if (z != null) {
                that.zoom(z);
            }

            // event bindings
            state.map.on("zoomend", function () {
                $(eventAnchor).triggerHandler("scaleChanged");
            });
        });

        // run init on loaded and resolve the init deferred
        common.deferreds.leafletLoading.done(function () {

            // create giscloud.address bindings
            bindToAddress(state, that, that.init.promise());

            // initialize the viewer
            initialize(state, options.host || common.appSite(), containerId, mapId, options);

            // resolve the init deferred
            that.init.resolveWith(that);

        });

        //
        // priveleged methods
        //

        // event binding method
        this.bind = function (eventName, handler) {
            var leafletEventName, f;

            if (typeof handler !== "function") {
                throw "Handler is not a function!";
            }

            switch (eventName) {
                case "click":
                    leafletEventName = "click";
                    break;
                case "mouseDown":
                    leafletEventName = "mousedown";
                    break;
                case "doubleClick":
                    leafletEventName = "dblclick";
                    break;
                case "mouseMove":
                    leafletEventName = "mousemove";
                    break;
                default:
                    // create a wrapper for the handler function to remove the jquery event param
                    f = function () {
                        handler.apply(that, Array.prototype.slice.call(arguments, 1));
                    };

                    // bind wrapped handler
                    $(eventAnchor).on(eventName, f);

                    // save wrapped handler
                    handler[eventName + oid] = f;

                    return this;
            }

            // create a wrapper for the handler function to have handler run in the context of this viewer
            f = function (evt) {
                handler.apply(that, [new giscloud.LonLat(evt.latlng.lng, evt.latlng.lat)]);
            };

            // bind wrapped handler to the leaflet event
            state.map.on(leafletEventName, f);

            // save wrapped handler
            handler[eventName + oid] = f;

            return this;
        };

        // event unbinding method
        this.unbind = function (eventName, handler) {
            var leafletEventName, f;

            if (typeof handler !== "function") {
                throw "Handler is not a function!";
            }

            // get the wrapped handler function to unbind
            f = handler[eventName + oid];

            if (!f) {
                return this;
            }

            switch (eventName) {
                case "click":
                    leafletEventName = "click";
                    break;
                case "mouseDown":
                    leafletEventName = "mousedown";
                    break;
                case "doubleClick":
                    leafletEventName = "dblclick";
                    break;
                case "mouseMove":
                    leafletEventName = "mousemove";
                    break;
                default:
                    // unbind
                    $(eventAnchor).off(eventName, f);

                    // remove wrapped handler reference
                    delete handler[eventName + oid];

                    return this;
            }

            // unbind wrapped handler
            state.map.off(leafletEventName, f);

            // remove wrapped handler reference
            delete handler[eventName + oid];

            return this;
        };

        // create event binding shortcut methods
        $.each(["click", "doubleClick", "mouseMove", "mouseDown"], function(i, item) {
            that[item] = function (handler) {
                that.bind(item, handler);
            };
        });

        // bounds get/set
        this.bounds = function (b) {
            if (b == null) {
                b = state.map.getBounds();
                return b && new giscloud.Bounds(
                    b._southWest.lng,
                    b._southWest.lat,
                    b._northEast.lng,
                    b._northEast.lat
                );
            } else {
                state.map.fitBounds(new L.LatLngBounds(
                    new L.LatLng(b.bottom, b.left),
                    new L.LatLng(b.top, b.right)
                ));
                return this;
            }
        };

        // center get/set
        this.center = function (c, resetMap) {
            if (c == null) {
                c = state.map.getCenter();
                return c && new giscloud.LonLat(c.lng, c.lat);
            } else {
                state.map.setView(new window.L.LatLng(c.lat, c.lon), state.map.getZoom(), resetMap);
                return this;
            }
        };

        // zoom level get/set
        this.zoom = function (z, resetMap) {
            if (z == null) {
                return state.map.getZoom();
            } else {
                //state.map.setZoom(z);
                state.map.setView(state.map.getCenter(), z, resetMap);
                return this;
            }
        };

        this.addMarker = function (marker, markerLayer, showNewMarkerLayer) {
            var sig, leafletMarker, layer;

            // set default marker layer if no other is specified
            markerLayer = markerLayer || "defaultMarkerLayer";

            // check if already added
            if ($(marker).data(oid + "_" + markerLayer) !== undefined) {
                throw { msg: "Marker already present on the " + markerLayer + ".", target: this, param: marker };
            }

            // create and save signature
            sig = "m" + common.oid();
            $(marker).data(oid + "_" + markerLayer, sig);

            // check if the marker layer exists; create new one if not
            if (state.markerLayers[markerLayer] === undefined) {
                layer = new L.FeatureGroup();
                state.markerLayers[markerLayer] = layer;
                if (showNewMarkerLayer !== false) {
                    state.map.addLayer(layer);
                }
            } else {
                layer = state.markerLayers[markerLayer];
            }

            // create marker
            leafletMarker = createMarkerWithPopup(marker.location(), marker.title(), marker.content(), marker.icon());

            // marker open popoup method
            marker.openPopup = function (initLoad) {
                if (leafletMarker._popup) {
                    leafletMarker.openPopup();
                } else if (marker.firstLoad) {
                    marker.firstLoad();
                } else {
                    throw "No popup, sorry.";
                }
            };

            // marker draggable method
            // TO DO: repair event handler binding/unbunding
            marker.draggable = function (ondrag) {
                if (ondrag === undefined) {
                    return leafletMarker.dragging.enabled();
                } else if (ondrag === false) {
                    leafletMarker.dragging.disable();
                    ondrag = $(leafletMarker).data("ondrag");
                    ondrag && leafletMarker.off("dragend", ondrag);
                } else {
                    leafletMarker.dragging.enable();
                    leafletMarker.on("dragend", ondrag);
                    $(leafletMarker).data("ondrag", ondrag);
                }
            };
            // update location after dragging
            leafletMarker.on("dragend", function () {
                marker.location(
                    new giscloud.LonLat(this._latlng.lng, this._latlng.lat),
                    true // silent, no event fired
                );
            })

            leafletMarker.on("click", (function (m) {
                return function () {
                    m.triggerHandler("click", [m[0]]);
                };
            }($(marker))));

            // add to index
            state.markers[sig] = leafletMarker;

            // show on map
            if (marker.visible()) {
                layer.addLayer(leafletMarker);
            }

            // bind state change handler
            $(marker).on("stateChanged", function (jqevt, stateChange) {
                    markerStateChangeHandler.call(marker, stateChange, leafletMarker, layer);
                });

            return this;
        };

        this.removeMarker = function (marker, markerLayer) {
            var sig;

            markerLayer = markerLayer || "defaultMarkerLayer";

            // get signature from marker
            sig = $(marker).data(oid + "_" + markerLayer);

            // check if the marker is present on the layer and remove
            if (sig && state.markers[sig]) {
                state.markerLayers[markerLayer].removeLayer(state.markers[sig]);
                delete state.markers[sig];
                $(marker).removeData(oid + "_" + markerLayer);
                delete marker.openPopup;
            }

            return this;
        };

        this.markerLayers = function () {
            return $.map(state.markerLayers, function (i, j) { return j; });
        };

        this.showMarkerLayer = function (markerLayer) {
            var layer;

            markerLayer = markerLayer || "defaultMarkerLayer";
            layer = state.markerLayers[markerLayer];
            layer && state.map.addLayer(layer);
        };

        this.hideMarkerLayer = function (markerLayer) {
            var layer;

            markerLayer = markerLayer || "defaultMarkerLayer";
            layer = state.markerLayers[markerLayer];
            layer && state.map.removeLayer(layer);
        };
    };

    /*
     / Initializes the leaflet map
    */
    initialize = function (state, site, cont, id, options) {
        var url, layer, layers, map, markerLayers, timestamp, opt;

        if (id) {
            // get timestamp
            if (options.timestamp) {
                if (options.timestamp === 'auto') {
                    // TODO: get map modified timestamp for this
                    timestamp = "map.modified"; // this doesn't do anything
                } else {
                    timestamp = options.timestamp;
                }
            } else {
                // random
                Math.round($.now() / 1000);
            }
            // build url
            url = site + "rt/" + timestamp + "/" + id + "/{z}/{x}/{y}.png";

            // create gc map leaflet layer
            layer = new L.TileLayer(url, {
                minZoom: 1,
                maxZoom: options.maxZoom || 20
            });
        }

        // create default marker layer
        markerLayers = { defaultMarkerLayer: new L.FeatureGroup() };

        // create leaflet map
        try {
            layers = [];
            layer && layers.push(layer);
            options.basemap && layers.push(new L.TileLayer(options.basemap.url, options.basemap.options));
            layers.push(markerLayers.defaultMarkerLayer);
            opt = { layers: layers, worldCopyJump: false };

            if (state.options.latloncrs) {
                opt.crs = L.CRS.EPSG4326;
            }

            if (state.options.lockZoom) {
                $.extend(opt, {
                    touchZoom: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    zoomControl: false
                });
            }

            // create the map object
            map = new L.Map(cont, opt);

            // set copyright display
            map.copyrightControl = new L.Control.Attribution();
            map.copyrightControl._onLayerAdd = $.noop;
            map.copyrightControl._onLayerRemove = $.noop;
            map.copyrightControl
            .setPrefix("")
            .setPosition("bottomleft")
            .addTo(map);

            // set attribution display
            map.attributionControl
            .setPrefix((options.attribution && options.attribution.prefix) || "")
            .addAttribution(options.attribution && options.attribution.text);

            // background color
            if (options.background) {
                if (options.background.hex) {
                    $(".leaflet-container").css("background-color", options.background.hex());
                } else {
                    $(".leaflet-container").css("background-color", options.background);
                }
            }

            options.center = options.center || (options.address && options.address.read && giscloud.address.param("center"));
            options.zoom = options.zoom || (options.address && options.address.read && giscloud.address.param("zoom"));

            if (options.center && options.zoom) {

                // center view
                map.setView(new L.LatLng(options.center.lat, options.center.lon), options.zoom, true);

            } else if (options.bounds) {

                // set view bounds
                map.fitBounds(
                    new L.LatLngBounds(
                        new L.LatLng(options.bounds.bottom, options.bounds.left), // southwest
                        new L.LatLng(options.bounds.top, options.bounds.right)    // northeast
                    )
                );

            }

            // save state
            state.map = map;
            state.layers = layers;
            state.markerLayers = markerLayers;
            state.markers = {};

        } catch (err) {

            throw {
                name: "Leaflet error on viewer init.",
                err: err
            };

        }
    };


    /*
     / Binds viewer to giscloud.address
    */
    bindToAddress = function (state, that, wait) {
        var eventBinding, options, addr = giscloud.address;

        options = (state.options && state.options.address) || { read: false, write: false };

        // register center param
        addr.registerParam({
            name: "center",
            query: "c",
            serialize: function (loc) {
                return loc.toString(5);
            },
            deserialize: function (str) {
                var coo;
                try {
                    coo = str.split(",");
                    return new giscloud.LonLat(parseFloat(coo[0]), parseFloat(coo[1]));
                } catch (err) {
                    return null;
                }
            }
        });

        // register zoom level param
        addr.registerParam({
            name: "zoom",
            query: "z",
            deserialize: function (str) {
                try {
                    return parseInt(str, 10);
                } catch (err) {
                    return null;
                }
            }
        });

        // this function handles all event binding needed; if needed it can be delayed
        eventBinding = function () {
            if (options.read) {
                // bind to center param address change
                addr.change("center", function (jqevt, evt) {
                    var v = evt.value;
                    if (v && v.valid()) {
                        that.center(v, true);
                    }
                });

                // bind to zoom param address change
                addr.change("zoom", function (jqevt, evt) {
                    that.zoom(evt.value, true);
                });
            }

            if (options.write) {
                // change address on center change
                state.map.on("moveend", function () {
                    addr.param("center", that.center());
                    addr.param("zoom", that.zoom());
                });
            }
        };

        // delay event binding
        if (wait && wait.done) {
            wait.done(eventBinding);
        } else {
            eventBinding();
        }
    };

     /*
     / creates a new leaflet marker with popup
    */
    createMarkerWithPopup = function (location, title, content, icon) {
        var marker, loc;

        loc = new L.LatLng(location.lat, location.lon);

        marker = new L.Marker(loc, icon && { icon: icon });
        createPopup(title, content && (content.value || content), marker);
        if (marker && content && content.action) {
            content.action(marker);
        }
        return marker;
    };

    /*
     / creates a new popup for a marker
    */
    createPopup = function (title, content, marker) {
        var html;
        if (title || content) {
            html = "<h1>" + (title || "") + "</h1><p>" + (content || "") + "</p>";
            marker.bindPopup(html, { maxWidth: 500, minWidth: 100 });
        }
        return marker;
    };

    /*
     / handles marker state change event
    */
    markerStateChangeHandler = function (stateChange, leafletMarker, layer) {
        var c;

        switch (stateChange.property) {

        // marker visibility
        case "visible":
            leafletMarker.setVisible(stateChange.newValue);
            break;

        // marker location
        case "location":
            leafletMarker.setLatLng(new L.LatLng(stateChange.newValue.lat, stateChange.newValue.lon));
            break;

        case "title":
        case "content":
            c = stateChange.state.content;
            createPopup(stateChange.state.title, c && (c.value || c), leafletMarker);
            if (c && c.action) {
                c.action(leafletMarker);
            }
            break;
        case "icon":
            leafletMarker.setIcon(stateChange.newValue);
            break;
        default:
            console.log(stateChange.property, "Not yet implemented.");
            break;
        }
    };

}(window, giscloud.exposeJQuery(), giscloud.common()));
(function (window, $, common, undefined) {

    var defaults = {};

    /*
     * Class: Graphic
     * Provides access to graphics in <Viewer>
     */

    giscloud.Graphic = function (viewer) {
        var that = this,
            index = {},
            eventAnchor = {},
            oid = common.oid(),
            currentlyDrawing = false,
            currentlyEditing = false,
            canvas, features, drawing, onDrawEnd,
            onMouseEvent, onFeatureGeometryChange, onFeatureStyleChange, onFeatureVisibilityChange;

        onMouseEvent = function (evt) {
            var feat, type;
            // handle mouse events only while not drawing on the canvas
            if (!currentlyDrawing) {
                // find the target feature
                $.each(index, function (i, item) {
                    if (item.gid === evt.name) {
                        feat = item.feat;
                        return null;
                    }
                });
                // event type
                if (evt.type === "click") {
                    type = "click";
                } else if (evt.type === "mouseover") {
                    type = "mouseOver";
                } else if (evt.type === "mouseout") {
                    type = "mouseOut";
                }
                // trigger the event
                if (type && feat) {
                    // trigger the Graphic object event
                    $(eventAnchor).triggerHandler(type, [feat]);
                    // trigger the GraphicFeature object event
                    $(feat).triggerHandler(type);
                }
            }
        };

        onFeatureGeometryChange = function (geom) {
            var ind = index[this.id], gid = ind && ind.gid, def, style, ogc;
            if (canvas && gid) {
                ogc = geom && geom.toOGC();
                if (ogc) {
                    // remove old geom
                    canvas.remove(gid);
                    ind.gid = null;

                    // set style so that the new style matches geometry type, keeps existing style and fill in with the default properties
                    if (geom instanceof giscloud.geometry.Point ||
                        geom instanceof giscloud.geometry.Multipoint) {
                        def = new giscloud.GraphicStyle("point");
                    } else if (geom instanceof giscloud.geometry.Line ||
                        geom instanceof giscloud.geometry.Multiline) {
                        def = new giscloud.GraphicStyle("line");
                    } else if (geom instanceof giscloud.geometry.Polygon ||
                        geom instanceof giscloud.geometry.Multipolygon) {
                        def = new giscloud.GraphicStyle("polygon");
                    } else {
                        def = new giscloud.GraphicStyle();
                    }
                    style = ind.feat.style();
                    style.fill = def.fill ? style.fill || def.fill : null;
                    style.size = def.size ? style.size || def.size : null;

                    // update feature style
                    ind.feat.style(style);

                    // deserialize and add to canvas
                    gid = canvas.deserializeGeometryOpenGIS({
                        geom: ogc,
                        color: style.color.hex("0x"),
                        fillcolor: style.fill && style.fill.hex("0x"),
                        alpha: (style.fill && (style.color.alpha() < style.fill.alpha())) ? style.fill.alpha() : style.color.alpha(),
                        width: style.size,
                        size: style.size
                    });

                    // make record of the new gid
                    ind.gid = gid;
                }
            }
        };

        onFeatureStyleChange = function (style) {
            var ind = index[this.id], gid = ind && ind.gid;
            if (canvas && gid) {
                canvas.setAttributeGeometry(gid, "color", style.color.hex("#"));
                if (style.fill) {
                    canvas.setAttributeGeometry(gid, "fillcolor", style.fill.hex("#"));
                }
                if (style.size) {
                    canvas.setAttributeGeometry(gid, "size", style.size);
                    canvas.setAttributeGeometry(gid, "width", style.size);
                }
            }
        };

        onFeatureVisibilityChange = function (vis) {
            var ind = index[this.id], gid = ind && ind.gid;
            if (canvas && gid) {
                canvas.setGeometryVisible(gid, vis.toString());
            }
        };

        viewer.initializing.done(function() {
            // get canvas object
            canvas = viewer.instance.plugins.canvas;

            // assign event handlers
            canvas.addEventListener('click', onMouseEvent);
            canvas.addEventListener('mouseover', onMouseEvent);
            canvas.addEventListener('mouseout', onMouseEvent);
        });

        /*
         * Property: features
         * An array of <GraphicFeatures>.
         */
        features = this.features = [];



        this.bind = function (eventName, handler) {
            var that = this,
                f = function () {
                    var args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(that, args);
                };

            // bind event handler
            $(eventAnchor).on(eventName, f);

            // add unbind reference to the user function
            if (!handler.gcunbind) {
                handler.gcunbind = {};
            }
            handler.gcunbind[oid + eventName] = f;

            return this;
        };

        this.unbind = function (eventName, func) {
            var that = this, f;

            // retrieve unbind data
            f = func.gcunbind && func.gcunbind[oid + eventName];

            // unbind
            $(eventAnchor).off(eventName, f);

            return this;
        };

        this.draw = function (type, success, cancel) {
            var gid, that = this;

            if (drawing && drawing.state() === "pending") {
                canvas.endDraw();
            }

            if (type === false) {
                return drawing.promise();
            } else {
                // define onDrawEnd
                onDrawEnd = function(evt) {
                    var feat;
                    if (evt && evt.geom) {
                        feat = new giscloud.GraphicFeature(giscloud.geometry.fromOGC(evt.geom));
                        if (feat) {
                            // add to feats array and indices
                            index[feat.id] = {
                                gid: gid,
                                feat: feat,
                                ind: that.features.length
                            };
                            // set style immediately because all the geoms are drawn with a preconfigured style
                            onFeatureStyleChange.call(feat, feat.style());
                            that.features.push(feat);
                            // bind handlers for geometry, style, visibility change
                            feat.bind("geometryChanged", onFeatureGeometryChange);
                            feat.bind("styleChanged", onFeatureStyleChange);
                            feat.bind("visibilityChanged", onFeatureVisibilityChange);
                            // resolve drawing
                            drawing.resolveWith(that, [feat]);
                        } else {
                            drawing.rejectWith(that, []);
                        }
                    } else {
                        drawing.rejectWith(that, []);
                    }
                    currentlyDrawing = false;
                };

                if (type === "point" || type === "line" || type === "polygon") {
                    drawing = new $.Deferred();
                    canvas.addEventListener("add", onDrawEnd);
                    drawing.always(
                        function() {
                            canvas.removeEventListener("add", onDrawEnd);
                        }
                    );
                    if (typeof success === "function") {
                        drawing.done(success);
                    }
                    if (typeof cancel === "function") {
                        drawing.fail(cancel);
                    }

                    gid = canvas.add(type);
                    currentlyDrawing = true;

                    return drawing.promise();
                } else {
                    throw "Invalid type. Use 'point', 'line' or 'polygon'.";
                }
            }
        };

        this.cancelDraw = function () {
            if (drawing && drawing.state() === "pending") {
                canvas.endDraw({ cancel: true });
                drawing.reject();
            }
            return this;
        };


        /*
         * Method: add
         * Adds a <GraphicFeature>.
         *
         * Parameters:
         * <GraphicFeature> object.
         */
        this.add = function (feat) {
            var that = this;
            viewer.initializing.done(function () {
                var gid, ogc, style;
                if (feat.constructor === giscloud.GraphicFeature) {
                    // get OGC string
                    ogc = feat.toOGC();
                    if (ogc) {
                        style = feat.style();
                        // deserialize and add to canvas
                        gid = canvas.deserializeGeometryOpenGIS({
                            geom: ogc,
                            color: style.color && style.color.hex("0x"),
                            fillcolor: style.fill && style.fill.hex("0x"),
                            alpha: (style.fill && (style.color.alpha() < style.fill.alpha())) ? style.fill.alpha() : style.color.alpha(),
                            width: style.size,
                            size: style.size
                        });

                        // add to feats array and indices
                        index[feat.id] = {
                            gid: gid,
                            feat: feat,
                            ind: that.features.length
                        };
                        that.features.push(feat);
                        // bind handlers for geometry and style change
                        feat.bind("geometryChanged", onFeatureGeometryChange);
                        feat.bind("styleChanged", onFeatureStyleChange);
                        feat.bind("visibilityChanged", onFeatureVisibilityChange);
                    }
                }
            });
            return this;
        };

        /*
         * Method: edit
         * Starts editing a <GraphicFeature>.
         *
         * Parameters:
         * <GraphicFeature> object or feature id.
         */
        this.edit = function (graphicFeature) {
            var oldGeom, feat = index[graphicFeature.id], that = this;

            if (!feat) {
                throw "Unknown graphic feature.";
            }

            if (currentlyEditing && currentlyEditing.state() === "pending") {
                throw "Edit is in progress. Cancel before starting new edit.";
            }

            // save old geometry
            oldGeom = canvas.getGeometry ?
                    canvas.getGeometry(feat.gid) :
                    giscloud.geometry.fromOGC(canvas.serializeGeometryOpenGIS(feat.gid));

            // create a new deferred
            currentlyEditing = (new $.Deferred())
            // set handlers
            .done(function () {
                var geom = canvas.getGeometry ?
                    canvas.getGeometry(feat.gid) :
                    giscloud.geometry.fromOGC(canvas.serializeGeometryOpenGIS(feat.gid));

                graphicFeature.geometry(geom);
            })
            .fail(function () {
                graphicFeature.geometry(oldGeom);
            });

            // start editing on canvas
            canvas.editGeometry(feat.gid);

            // set the editing deferred to always pass the edited graphic feature
            return currentlyEditing.pipe(
                function () { return graphicFeature; },
                function () { return graphicFeature; }
            );
        };

        this.editAccept = function () {
            if (!currentlyEditing || currentlyEditing.state() !== "pending") {
                throw "Nothing is being edited. Check the currentlyEditing property before calling this method.";
            }

            currentlyEditing.resolve();
            return this;
        };

        this.editCancel = function () {
            if (!currentlyEditing || currentlyEditing.state() !== "pending") {
                throw "Nothing is being edited. Check the currentlyEditing property before calling this method.";
            }

            currentlyEditing.reject();
            return this;
        };

        /*
         * Method: remove
         * Removes a <GraphicFeature>.
         *
         * Parameters:
         * <GraphicFeature> object or feature id.
         */
        this.remove = function (feat) {
            var that = this;
            viewer.initializing.done(function () {
                var ind;
                if (feat.constructor === giscloud.GraphicFeature) {
                    feat = feat.id;
                }

                // get index entry
                ind = index[feat];

                if (ind !== undefined) {
                    // remove from canvas
                    canvas.remove(ind.gid);

                    // remove from features list
                    that.features.splice(ind.ind, 1);

                    // unbind handlers for geometry and style change
                    ind.feat.unbind("geometryChanged", onFeatureGeometryChange);
                    ind.feat.unbind("styleChanged", onFeatureStyleChange);
                    ind.feat.unbind("visibilityChanged", onFeatureVisibilityChange);

                    // remove from index
                    delete index[feat];
                    ind = null;
                }
            });
            return this;
        };

        /*
         * Method: clear
         * Clears all features.
         *
         */
        this.clear = function () {
            if (canvas) {
                // end current drawing
                if (drawing && drawing.state() === "pending") {
                    canvas.endDraw();
                }

                // clear canvas
                canvas.clear();

                // unbind handlers
                $.each(this.features, function (i, item) {
                    item.unbind("geometryChanged", onFeatureGeometryChange);
                    item.unbind("styleChanged", onFeatureStyleChange);
                    item.unbind("visibilityChanged", onFeatureVisibilityChange);
                });

                // clear features list
                this.features = [];

                // clear index
                index = {};
            }
            return this;
        };
    };


    /*
     * Class: GraphicFeature
     * A graphic feature of a <Viewer>.
     */
    giscloud.GraphicFeature = function (geom, s) {
        var oid = common.oid(), geometry, style, vis = true;
        if (!s || s.constructor !== giscloud.GraphicStyle) {
            if (geom instanceof giscloud.geometry.Point ||
                geom instanceof giscloud.geometry.Multipoint) {
                style = new giscloud.GraphicStyle("point");
            } else if (geom instanceof giscloud.geometry.Line ||
                geom instanceof giscloud.geometry.Multiline) {
                style = new giscloud.GraphicStyle("line");
            } else if (geom instanceof giscloud.geometry.Polygon ||
                geom instanceof giscloud.geometry.Multipolygon) {
                style = new giscloud.GraphicStyle("polygon");
            } else {
                style = new giscloud.GraphicStyle();
            }
        } else {
            style = s;
        }

        geometry = geom;

        this.geometry = function (g) {
            if (g) {
                geometry = g;
                $(this).triggerHandler("geometryChanged", [geometry]);
                return this;
            } else {
                return geometry;
            }
        };

        this.style = function (s) {
            if (s) {
                style = s;
                $(this).triggerHandler("styleChanged", [style]);
                return this;
            } else {
                return style;
            }
        };

        this.visibility = function (v) {
            if (typeof v === "boolean") {
                vis = v;
                $(this).triggerHandler("visibilityChanged", [vis]);
                return this;
            } else {
                return vis;
            }
        };

        this.id = "graphic" + oid;

        this.bind = function (eventName, handler) {
            var that = this,
                f = function () {
                    var args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(that, args);
                };

            // bind event handler
            $(this).on(eventName, f);

            // add unbind reference to the user function
            if (!handler.gcunbind) {
                handler.gcunbind = {};
            }
            handler.gcunbind[oid + eventName] = f;

            return this;
        };

        this.unbind = function (eventName, func) {
            var f;

            // retrieve unbind data
            f = func.gcunbind && func.gcunbind[oid + eventName];

            // unbind
            $(this).off(eventName, f);

            return this;
        };

        this.toOGC = function () {
            if (geometry) {
                return geometry.toOGC();
            } else {
                return null;
            }
        };

    };

    /*
     * Class: GraphicStyle
     * Style for viewer <graphic> features.
     */
    giscloud.GraphicStyle = function () {
        var arg = arguments[0];
        if (typeof arg === "string") {
            switch (arg) {
                case "point":
                    $.extend(true, this, defaults.pointStyle);
                    break;
                case "line":
                    $.extend(true, this, defaults.lineStyle);
                    break;
                case "polygon":
                    $.extend(true, this, defaults.polygonStyle);
                    break;
                default:
                    break;
            }
        } else {
            this.color = (arg.color !== undefined && arg.color.constructor === giscloud.Color) ? arg.color : null;
            this.fill = (arg.fill !== undefined && arg.fill.constructor === giscloud.Color) ? arg.fill : null;
            this.size = (typeof arg.size === "number") ? arg.size : null;
        }
    };

    defaults = {
        pointStyle: new giscloud.GraphicStyle({
            color: new giscloud.Color(0, 0, 0, 100),
            fill: new giscloud.Color(255, 0, 0, 100),
            size: 10
        }),
        lineStyle: new giscloud.GraphicStyle({
            color: new giscloud.Color(0, 0, 0, 100),
            size: 1
        }),
        polygonStyle: new giscloud.GraphicStyle({
            color: new giscloud.Color(0, 0, 0, 100),
            fill: new giscloud.Color(255, 0, 0, 100)
        })
    };

})(window, giscloud.exposeJQuery(), giscloud.common());

(function (window, giscloud) {
    var $, md5, gravatar,
    rEmail = /[a-z0-9._%+\-]+@[a-z0-9.\-]+/i;

    if (giscloud) {
        $ = giscloud.exposeJQuery();
        md5 = giscloud.common().md5;
    } else {
        $ = window.jQuery;
        md5 = window.md5;
    }

    gravatar = {
        hash: function (email) {
            if (typeof email === "string") {
                return md5(email.toLowerCase())
            } else {
                return null;
            }
        },

        url: function (ident, size, https) {
            var hash, protocol;
            if (rEmail.test(ident)) {
                hash = this.hash(ident);
            } else {
                hash = ident;
            }

            if (typeof size !== "number") {
                size = 80;
            }

            if (https) {
                protocol = "https:";
            } else {
                protocol = (window.location.protocol == "https:" ? "https:" : "http:");
            }

            return protocol + "//www.gravatar.com/avatar/" + hash + "?r=g&s=" + size;
        },

        image: function (ident, size, container, https) {
            var el, img;

            img = $("<img/>", { src: this.url(ident, size, https) });

            if (container) {
                el = $("#" + container);
            }

            if (el && el.length === 1) {
                el.append(img);
            }

            return img;
        }
    };

    // publish
    if (giscloud) {
        giscloud.gravatar = gravatar;
    } else {
        window.gravatar = gravatar;
    }

}(window, typeof giscloud !== "undefined" ? giscloud : null));

(function (window, $, common, undefined) {
    /*
     * Class: Map
     */

    giscloud.Map = function () {
        var that = this,
            args = arguments,
            arglen = args.length,
            eventAnchor = {},
            oid = common.oid(),
            data, b;

        // init properties
        $.extend(this, {
            id: null,
            name: null,
            description: null,
            owner: null,
            active: null,
            copyright: null,
            proj4: null,
            units_proj4: null,
            units: null,
            maxzoom: null,
            share: null,
            mobileacess: null,
            bgcolor: null,
            wmsaccess: null,
            modified: null,
            accessed: null,
            created: null,
            visited: null,
            bounds: null
        });

        //
        // Determine the constructor by analyzing the arguments
        //

        /*
         * Constructor: giscloud.Map(mapId: Number, [getLayers: bool], [callback: Function])
         */
        if (typeof args[0] == "number") {
            this.id = args[0];
            this.refresh(args[2], args[1]);
        }

        /*
         * Constructor: giscloud.Map(mapData: Object, [getLayers: bool, callback])
         */
        else if (typeof args[0] == "object") {
            data = args[0];
            // set property values
            this.id = parseInt(data.id, 10);
            this.name = data.name;
            this.description = data.description;
            this.owner = data.owner;
            this.active = data.active;
            this.copyright = data.copyright;
            this.proj4 = data.proj4;
            this.units = data.units;
            this.units_proj4 = data.units_proj4;
            this.maxzoom = data.maxzoom;
            this.share = data.share;
            this.mobileacess = data.mobileacess;
            this.bgcolor = data.bgcolor;
            this.wmsaccess = data.wmsaccess;
            this.modified = new Date(data.modified * 1000);
            this.accessed = new Date(data.accessed * 1000);
            this.created = new Date(data.created * 1000);
            this.visited = isNaN(data.visited) ? null : parseInt(data.visited);

            // set bounds
            if (data.bounds) {
                b = data.bounds && $.parseJSON(data.bounds);
                if (b) {
                    this.bounds = new giscloud.Bounds(parseFloat(b.xmin), parseFloat(b.ymin), parseFloat(b.xmax), parseFloat(b.ymax));
                }
            }

            // load map layers
            if (args[1]) {
                this.refreshLayers(args[2]);
            }

            //
            // Priveleged methods
            //
            $.extend(true, this, {

                remove: function () {
                    return giscloud.maps.remove(this.id);
                },

                update: function () {
                    var b;
                    // update name
                    data.name = this.name;
                    // update bounds
                    if (this.bounds) {
                        b = {
                            xmin: this.bounds.left,
                            ymin: this.bounds.bottom,
                            xmax: this.bounds.right,
                            ymax: this.bounds.top
                        };
                    }
                    // we need json...
                    if (JSON === undefined) {
                        giscloud.includeJs((window.location.protocol == "https:" ? "https:" : "http:") +
                            "//giscloud.local/libs/json2/json2.min.js")
                        .done(function() {
                            data.bounds = JSON.stringify(b);
                            return giscloud.maps.update(data.id, data);
                        });
                    } else {
                        data.bounds = JSON.stringify(b);
                    }
                    // set update values
                    data.description = this.description;
                    data.active = this.active;
                    data.copyright = this.copyright;
                    data.proj4 = this.proj4;
                    data.units = this.units;
                    data.units_proj4 = this.units_proj4;
                    data.maxzoom = this.maxzoom;
                    data.share = this.share;
                    data.mobileacess = this.mobileacess;
                    data.bgcolor = this.bgcolor;
                    data.wmsaccess = this.wmsaccess;

                    return giscloud.maps.update(data.id, data);
                },

                clone: function () {
                    var d = {};
                    $.extend(d, data);
                    delete d.id;
                    return giscloud.maps.create(d);
                },

                users: function () {
                    var dfrd, getShareesDrfd,
                        users = {
                            owner: null,
                            editors: [],
                            viewers: []
                        };

                    if (typeof this.owner === "object") {
                        users.owner = { id: this.owner.id, username: this.owner.username };
                    } else {
                        users.owner = this.owner;
                    }

                    getShareesDrfd = common.rest.get("maps/" + this.id + "/sharing")
                        .done(function (sharing) {
                            if (sharing && sharing.data && sharing.data.length) {
                                $.each(sharing.data, function (i, data) {
                                    if (data.view === "t") {
                                        users.viewers.push({ id: data.user_id, username: data.username });
                                    }

                                    if (data.edit === "t") {
                                        users.editors.push({ id: data.user_id, username: data.username });
                                    }
                                });
                            }
                        });

                    dfrd = $.when(getShareesDrfd);

                    return dfrd.pipe(function () { return users; }).promise();
                }

            });

        }

        //
        // Invalid constructor arguments
        //
        else {
            common.setError(this, "constructor", "Invalid constructor arguments");
        }
    };

    //
    // Public methods
    //
    $.extend(giscloud.Map.prototype, {

        /*
         * Method: refresh
         * Refreshes map data from the server. Ready event fires upon completion. EDIT: no more ready event!
         *
         *  Parameters:
         *    callback - Function
         *    getLayers - Bool
         *
         *  Returns:
         *  Map object.
         */
        refresh: function (callback, getLayers) {
            var that = this, id = this.id,
                 cb = function (ev) {
                    // callback function call
                    if (typeof callback == "function") {
                       callback(ev);
                    }
                 };

            if (typeof id === undefined || id === null) {
                common.setError(this, "refresh", "Map id is not set.");
            } else {
                giscloud.maps.byId(id, function (data){

                    // set property values
                    that.name = data.name;
                    that.description = data.description;
                    that.owner = data.owner;
                    that.active = data.active;
                    that.copyright = data.copyright;
                    that.proj4 = data.proj4;
                    that.units = data.units;
                    that.units_proj4 = data.units_proj4;
                    that.maxzoom = data.maxzoom;
                    that.share = data.share;
                    that.mobileacess = data.mobileacess;
                    that.bgcolor = data.bgcolor;
                    that.wmsaccess = data.wmsaccess;
                    that.modified = new Date(data.modified);
                    that.accessed = new Date(data.accessed);
                    that.created = new Date(data.created);

                    // set bounds
                    if (data.bounds) {
                        b = data.bounds && $.parseJSON(data.bounds);
                        if (b) {
                            that.bounds = new giscloud.Bounds(parseFloat(b.xmin), parseFloat(b.ymin), parseFloat(b.xmax), parseFloat(b.ymax));
                        }
                    }

                    // load map layers
                    if (getLayers) {
                        that.refreshLayers(cb);
                    } else {
                        cb(that);
                    }
                }, true);
            }
            return this;
        },

        /*
         * Method: refreshLayers
         * Refreshes layers data from the server.
         *
         *  Parameters:
         *    callback - Function
         *
         *  Returns:
         *  Map object.
         */
        refreshLayers: function (callback) {
            var that = this, id = this.id;
            if (!isFinite(id)) {
                common.setError(this, "refreshLayers", "Map id is not set.");
            } else {
                // load map layers
                giscloud.layers.byMapId(id, function (layersdata) {

                    that.layers = layersdata;

                    // callback function call
                    if (typeof callback == "function") {
                        callback(that);
                    }
                });
            }
            return this;
        },

        reset: function (layers) {
            return giscloud.maps.reset(this.id, layers);
        },

        /*
         * Method: ready
         * Registers an event handler function for the map ready event, or triggers the event.
         */
        //ready: common.evtMethod("ready"),

        imageUrl: function (width, height) {
            if (typeof width !== "number" && typeof height !== "number") {
                width = 400;
                        height = 400;
            }
            return common.rest.url("maps/" + this.id + "/render.png?width=" + width + "&height=" + height
                                   + "&timestamp=" + this.modified);
        },

        iframeUrl: function (width, height) {
            var url, options, params, key, value;

            if (typeof width === "object") {
                options = width;
            }

            url = common.rest.url("maps/" + this.id + "/render.iframe");

            if (options) {

                params = [];

                for (key in options) {
                    if (options.hasOwnProperty(key)) {
                        value = (options[key] != null) ? options[key].toString() : "";
                        params.push(key + "=" + value);
                    }
                }

                url += params.length > 0 ? "?" + params.join("&") : "";

            } else if (typeof width === "number" && typeof height === "number") {

                url += "?width=" + width + "&height=" + height;

            }
            return url;
        }

    });

})(window, giscloud.exposeJQuery(), giscloud.common());

(function ($, common, undefined) {
    /*
     * Class: Map
     */

    giscloud.Task = function (data) {
        // init properties
        $.extend(this, {
            id: data && data.id || null,
            owner: data && data.owner_id || null,
            "type": data && data.task_type_id || null,
            params: data && data.params || null,
            alternateEmail: data && data.alternate_email || null,
            status: data && !isNaN(data.status) ? data.status : null,
            priority: data && !isNaN(data.priority) ? data.priority : null,
            appId: data && !isNaN(data.appId) ? data.gc_app_id : null,
            timeSpent: data && !isNaN(data.time_spent) ? data.time_spent : null,
            requested: data && !isNaN(data.timestamp_requested) && new Date(data.timestamp_requested) || null,
            processed: data && !isNaN(data.timestamp_processed) && new Date(data.timestamp_processed) || null,
            scheduled: data && !isNaN(data.timestamp_scheduled) && new Date(data.timestamp_scheduled) || null
        });
    };

    giscloud.Task.prototype = {

        create: function (params) {

            return giscloud.tasks.create({
                task_type_id: this.type,
                alternate_email: this.alternateEmail,
                gc_app_id: this.appId,
                priority: this.priority,
                params: params || this.params
            });

        },

        remove: function () {
            return giscloud.tasks.remove(this.id);
        }

    };

})(giscloud.exposeJQuery(), giscloud.common());


(function (window, $, common, undefined) {

    /*
     * Namespace: ui
     * GUI elements for giscloud <Viewer>
     */

    giscloud.ui = {

        /*
         * Class: Toolbar
         * A toolbar for the giscloud viewer. A toolbar has its collection of <Tools> and is reponsible for only
         * one tool being active at the same time.
         */

        /*
         * Constructor: Toolbar
         * Creates a new <Toolbar>.
         *
         * Parameters:
         *    options - Toolbar options.
         */
        Toolbar: function (options) {
            var that = this, i, k,
                viewer = options.viewer,
                oid = common.oid(),
                placeholders = {}, cont, lastActive = [], eventAnchor = {},

                renderTool = function (tool) {
                    var placeholderId = "gctoolbar" + "_" + oid + "_" + tool.name, placeholder;

                    placeholder = $("<div/>", {
                        id: placeholderId,
                        "class": options.type === "vertical" ?
                            "gc-toolbar-placeholder gc-toolbar-placeholder-vertical" :
                            "gc-toolbar-placeholder gc-toolbar-placeholder-horizontal"
                    });

                    placeholder.appendTo(cont);
                    tool.render(placeholderId);
                    placeholders[tool.name] = placeholderId;
                },

                toolActivated = function (tool) {
                    var last = lastActive.length > 0 ? lastActive[lastActive.length - 1] : null, d;

                    if (last) {
                        d = that.tools[last];
                        d.deactivate();
                    }

                    lastActive.push(tool.name);

                    if (lastActive.length > 99) {
                        lastActive.shift();
                    }

                    $(eventAnchor).triggerHandler("toolChange", [d, tool]);
                },

                toolDeactivated = function () {
                    var last = lastActive.length > 0 ? lastActive[lastActive.length - 1] : null;
                    if (last) {
                        that.tools[last].activate();
                    }
                };

            // include toolbar.css
            if (!common.toolbarCssIncluded) {
                giscloud.includeCss(common.apiHost() + "/assets/api/1/css/toolbar.css");
                common.toolbarCssIncluded = true;
            }

            /*
             * Property: viewer
             * This toolbar's <Viewer> object. All the tools of this toolbar work with this viewer.
             */
            this.viewer = viewer;

            /*
             * Property: tools
             * All the tools added to this toolbar.
             */
            this.tools = {};

            if (options.container) {
                cont = $("#" + options.container);
                cont.addClass("gc-toolbar");
                if (options.type === "vertical") {
                    cont.addClass("gc-toolbar-vertical");
                } else {
                    cont.addClass("gc-toolbar-horizontal");
                }
            }

            /*
             * Method: add
             * Adds <Tools> to the toolbar.
             *
             * Parameters:
             * Tools to be added to the toolbar. If the container is set for the toolbar,
             * these will be automatically rendered.
             *
             */
            this.add = function () {
                var i, k, tool, render = true;
                for (i = 0, k = arguments.length; i < k; i++) {
                    tool = arguments[i];
                    if (tool && tool instanceof giscloud.ui.Toolbar.Tool) {
                        if (!tool.toolbar || tool.toolbar !== this) {
                            tool.toolbar = this;
                        } else {
                            render = false;
                        }
                        this.tools[tool.name] = tool;

                        // register event handlers
                        tool.bind("activation",  toolActivated);
                        tool.bind("deactivation", toolDeactivated);

                        if (options.container && render) {
                            renderTool(tool);
                        }
                    }
                }
                return this;
            };

            // add default tools
            if (options.defaultTools) {
                for (i = 0, k = options.defaultTools.length; i < k; i++) {
                    this.add(giscloud.ui.defaultTools.tool(options.defaultTools[i]));
                }
                if ($.inArray("pan", options.defaultTools) > -1) {
                    this.tools.pan.activate();
                }
            }

            /*
             * Method: remove
             * Removes a <Tool> from the toolbar.
             *
             * Parameters:
             * Tool name.
             */
            this.remove = function (name) {
                var i = $.inArray(name, lastActive);

                if (i > -1 && i === lastActive.length - 1) {
                    // active tool is being removed
                    this.deactivateTool();
                } else if (i > -1) {
                    // remove tool from last active queue
                    lastActive.splice(i, 1);
                }

                delete this.tools[name];
                if (placeholders[name]) {
                    $("#" + placeholders[name]).remove();
                    delete placeholders[name];
                }
                return this;
            };

            /*
             * Method: bind
             * Binds an event handler to the toolbar object.
             *
             *  Parameters:
             *      eventName - String, name of the event.
             *      func - Function, the handler function.
             *
             *  Returns:
             *  The toolbar object.
             */
            this.bind = function (eventName, func) {
                var that = this, f;
                if (eventName && typeof eventName == "string" && typeof func == "function") {
                    f = function () {
                        var args = Array.prototype.slice.call(arguments, 1);
                        func.apply(that, args);
                    };
                    $(eventAnchor).on(eventName, f);
                    // add unbind reference to the user function
                    if (!func.gcunbind) {
                        func.gcunbind = {};
                    }
                    func.gcunbind[oid + eventName] = f;
                }
                return this;
            };

            /*
             * Method: unbind
             * Unbinds an event handler from the toolbar object.
             *
             *  Parameters:
             *      eventName - String, name of the event.
             *      func - Function, the handler function.
             *
             *  Returns:
             *  The toolbar object.
             */
            this.unbind = function (eventName, func) {
                var f;
                if (eventName && typeof eventName == "string" && typeof func == "function") {
                   // retrieve unbind data
                   f = func.gcunbind && func.gcunbind[oid + eventName];
                   if (f) {
                       $(eventAnchor).off(eventName, f);
                   }
                }
                return this;
            };

            /*
             * Method: toolChange
             * Binds a handler to the toolbar toolChange event.
             */
            this.toolChange = function (func) {
                return this.bind("toolChange", func);
            };
        }
    };

    /*
     * Tool
     * Giscloud's <Toolbar> tool.
     */

    /*
     * Constructor: Tool
     * Creates a new <Tool>.
     *
     * Parameters:
     *     name - String, name of the tool. Has to be unique inside a toolbar.
     *     options - Object containing tool options.
     *
     *                 instant - if true this tool will just run the activation function when activated, no event is
     *                           triggered.
     *
     *                 actions - functions which will handle tool actions.
     *                     activation - activation function.
     *                     deactivation - deactivation function.
     *
     *                 styles - style options.
     *                     caption - visible text for the tool or alt text if icons are used.
     *                     showCaption - if true, the caption will be visible.
     *                     cssClass - css class for the tool, .gc-tool is the default class.
     *                     active - css class for an active tool, .gc-tool-active is the default class.
     *                     hover - css class for the tool hover event, .gc-tool-hover is the default class.
     *                     icon - src for the icon image.
     *                     iconActive - src for the active icon image.
     *                     iconHover - src for the hover icon image.
     *
     *                 toolbar - If the tooolbar is set through options, after the tool is added to that toolbar it
     *                           will not be rendered, instead you should call the tool's <render> method yourself.
     *                           This way a tool can be placed anywhere on the page instead the toolbar strip.
     *
     *                 viewer - If you set the viewer through options, the tool can act independatly without being
     *                          added to a toolbar. If the tool is, however, added to a toolbar, the toolbars viewer
     *                          takes precedence over this setting.
     */
    giscloud.ui.Toolbar.Tool = function (name, options) {
        var activation, deactivation, active = false, toggle, cont, oid = common.oid(), eventAnchor = {};
        /*
         * Property: name
         * Name of the tool.
         */
        this.name = name;

        /*
         * Method: isToggle
         * Returns true if this is a toggle tool, false otherwise.
         *
         */
        this.isToggle = function () {
            return toggle;
        };

        /*
         * Method: isActive
         * Returns true if tool is active, false otherwise;
         */
        this.isActive = function () {
            return active;
        };

        /*
         * Property: toolbar
         * <Toolbar> to which this tool belongs.
         */
        this.toolbar = options.toolbar;

        /*
         * Property: viewer
         * Viewer this tool refers to. If the tool is on a toolbar, the toolbar's viewer is used.
         */
        this.viewer = options.viewer;

        activation = options.actions.activation;
        deactivation = options.actions.deactivation;

        toggle = options.toggle;

        /*
         * Method: activate
         * Activates the tool.
         */
        this.activate = function (silently) {
            var that = this, viewer = (this.toolbar && this.toolbar.viewer) || this.viewer,
                args = Array.prototype.slice.call(arguments, 0),
                id = "gctool_" + this.name + "_" + oid;

            if (!active && viewer) {
                viewer.initializing.done(function () {
                    if (options.instant) {
                        // attach the viewer object as the first argument
                        args.splice(0, 0, this);
                        activation.apply(this, args);
                    } else {
                        active = true;
                        $("#" + id).addClass(options.styles.active || "gc-tool-active");
                        if (!silently) {
                            $(eventAnchor).triggerHandler("activation", [that]);
                        }
                        if (activation) {
                            // attach the viewer object as the first argument
                            args.splice(0, 0, this);
                            activation.apply(that, args);
                        }
                    }
                });
            }
            return this;
        };

        /*
         * Method: deactivate
         * Deactivates the tool.
         */
        this.deactivate = function (silently) {
            var that = this, viewer = (this.toolbar && this.toolbar.viewer) || this.viewer,
                args = Array.prototype.slice.call(arguments, 0),
                id = "gctool_" + this.name + "_" + oid;
            if (active && viewer) {
                viewer.initializing.done(function () {
                    active = false;
                    $("#" + id).removeClass(options.styles.active || "gc-tool-active");
                    if (deactivation) {
                        // attach the viewer object as the first argument
                        args.splice(0, 0, this);
                        deactivation.apply(that, args);
                    }
                    if (!silently) {
                        $(eventAnchor).triggerHandler("deactivation", [that]);
                    }
                });
            }
            return this;
        };

        /*
         * Method: render
         * Renders the tool on the webpage.
         *
         * Parameters:
         *    container - String, id of a div element of the page in which the tool will be rendered.
         */
        this.render = function (container) {
            var that = this, s = options.styles || {},
                id = "gctool_" + this.name + "_" + oid,
                iconid, iconidHover, iconidActive, button, ico, icoHover, icoActive;

            // include toolbar.css
            if (!common.toolbarCssIncluded) {
                giscloud.includeCss(common.apiHost() + "/assets/api/1/css/toolbar.css");
                common.toolbarCssIncluded = true;
            }

            cont = $("#" + container);
            cont.html("");

            // icons
            if (s.icon) {

                iconid = "gctoolicon_" + this.name + "_" + oid;
                ico = $("<img/>", {
                    id: iconid,
                    src: s.icon,
                    alt: s.caption || ""
                });

                if (s.iconHover) {
                    iconidHover = "gctoolicon_hover_" + this.name + "_" + oid;
                    icoHover = $("<img/>", {
                        id: iconidHover,
                        src: s.iconHover,
                        alt: s.caption || "",
                        css: { "display": "none" }
                    });

                }

                if (s.iconActive) {
                    iconidActive = "gctoolicon_active_" + this.name + "_" + oid;
                    icoActive = $("<img/>", {
                        id: iconidActive,
                        src: s.iconActive,
                        alt: s.caption || "",
                        css: { "display": "none" }
                    });
                }
            }

            button = $("<div/>", {
                id: id,
                "class": s.cssClass || "gc-tool",
                title: s.caption || "",
                mouseover: function (evt) {
                    $(this).addClass(s.hover || "gc-tool-hover");
                    if (icoHover) {
                        icoHover.show();
                        icoActive.hide();
                        ico.hide();
                    }
                    evt.stopPropagation();
                    evt.preventDefault();
                },
                mouseout: function (evt) {
                    $(this).removeClass(s.hover || "gc-tool-hover");
                    if (icoHover) {
                        icoHover.hide();
                        if (active) {
                            icoActive.show();
                            ico.hide();
                        } else {
                            icoActive.hide();
                            ico.show();
                        }
                    }
                    evt.stopPropagation();
                    evt.preventDefault();
                },
                click: function (evt) {
                    if (options.instant) {
                        that.activate();
                    } else {
                        if (active && toggle) {
                            that.deactivate();
                        } else if (!active) {
                            that.activate();
                        }
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                }
            });

            if (iconid) {
                button.append(ico);
                if (iconidActive) {
                    button.append(icoActive);
                }
                if (iconidHover) {
                    button.append(icoHover);
                }
            } else if (s.caption && s.showCaption) {
                button.append(s.caption);
            } else {
                button.append("&nbsp;");
            }

            button.appendTo("#" + container);

            return this;
        };

        /*
         * Method: bind
         * Binds an event handler to the tool object.
         *
         *  Parameters:
         *      eventName - String, name of the event.
         *      func - Function, the handler function.
         *
         *  Returns:
         *  The tool object.
         */
        this.bind = function (eventName, func) {
            var that = this, f;
            if (eventName && typeof eventName == "string" && typeof func == "function") {
                f = function () {
                    var args = Array.prototype.slice.call(arguments, 1);
                    func.apply(that, args);
                };
                $(eventAnchor).on(eventName, f);
                // add unbind reference to the user function
                if (!func.gcunbind) {
                    func.gcunbind = {};
                }
                func.gcunbind[oid + eventName] = f;
            }
            return this;
        };

        /*
         * Method: unbind
         * Unbinds an event handler from the tool object.
         *
         *  Parameters:
         *      eventName - String, name of the event.
         *      func - Function, the handler function.
         *
         *  Returns:
         *  The tool object.
         */
        this.unbind = function (eventName, func) {
            var f;
            if (eventName && typeof eventName == "string" && typeof func == "function") {
               // retrieve unbind data
               f = func.gcunbind && func.gcunbind[oid + eventName];
               if (f) {
                   $(eventAnchor).off(eventName, f);
               }
            }
            return this;
        };

    };

    /*
     * Class: defaultTools
     * This provides some default tools readily available for use.
     */

    giscloud.ui.defaultTools = {

        pan: function () {
            return new giscloud.ui.Toolbar.Tool("pan", {
                styles: {
                    caption: "Pan",
                    showCaption: false,
                    cssClass: "gc-tool-pan",
                    active: "gc-tool-pan-active",
                    hover: "gc-tool-pan-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.pan();
                    }
                }
            });
        },

        zoom: function () {
            return new giscloud.ui.Toolbar.Tool("zoom", {
                styles: {
                    caption: "Zoom",
                    showCaption: false,
                    cssClass: "gc-tool-zoom",
                    active: "gc-tool-zoom-active",
                    hover: "gc-tool-zoom-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.areaZoom();
                    }
                }
            });
        },

        full: function () {
            return new giscloud.ui.Toolbar.Tool("full", {
                styles: {
                    caption: "Full",
                    showCaption: false,
                    cssClass: "gc-tool-full",
                    active: "gc-tool-full-active",
                    hover: "gc-tool-full-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.fullExtent();
                    }
                },
                instant: true
            });
        },

        measure: function () {
            return new giscloud.ui.Toolbar.Tool("measure", {
                styles: {
                    caption: "Measure",
                    showCaption: false,
                    cssClass: "gc-tool-measure",
                    active: "gc-tool-measure-active",
                    hover: "gc-tool-measure-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.measure();
                    }
                }
            });
        },

        select: function () {
            return new giscloud.ui.Toolbar.Tool("select", {
                styles: {
                    caption: "Select",
                    showCaption: false,
                    cssClass: "gc-tool-select",
                    active: "gc-tool-select-active",
                    hover: "gc-tool-select-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.select(true);
                    }
                }
            });
        },

        info: function () {
            return new giscloud.ui.Toolbar.Tool("info", {
                styles: {
                    caption: "Select",
                    showCaption: false,
                    cssClass: "gc-tool-info",
                    active: "gc-tool-info-active",
                    hover: "gc-tool-info-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.select(true);
                    }
                }
            });
        },

        areaSelect: function () {
            var ref = common.oid(), onSelect = function (evt) {
                var b = new giscloud.Bounds(
                    parseFloat(evt.xMin),
                    parseFloat(evt.yMin),
                    parseFloat(evt.xMax),
                    parseFloat(evt.yMax)),
                    viewer = common.refs[ref];
                common.refs[ref].selectFeaturesByBounds(viewer.activeLayer, b);
            };

            return new giscloud.ui.Toolbar.Tool("areaSelect", {
                styles: {
                    caption: "Select area",
                    showCaption: false,
                    cssClass: "gc-tool-areaselect",
                    active: "gc-tool-areaselect-active",
                    hover: "gc-tool-areaselect-hover"
                },
                actions: {
                    activation: function (viewer) {
                        viewer.loading.done(function () {
                            var fn = this.instance;
                            common.refs[ref] = this;
                            fn.addEventListener("areaselection", onSelect);
                            fn.setTool("AreaSelection");
                        });
                    },

                    deactivation: function (viewer) {
                        viewer.loading.done(function () {
                            this.instance.removeEventListener("areaselection", onSelect);
                            this.instance.setTool("DragTool");
                            delete common.refs[ref];
                        });
                    }
                }
            });
        },

        pickCoordinates: function () {
            var pickCoordinatesTool;

            function onMapClick(lonLat) {
                pickCoordinatesTool.coordinates = lonLat;
                pickCoordinatesTool.deactivate();
            }


            pickCoordinatesTool = new giscloud.ui.Toolbar.Tool(
                "pickCoordinates", {
                    styles: {
                        caption: "Coordinate picker",
                        showCaption: false,
                        cssClass: "coordinate-tool",
                        active: "coordinate-tool-active",
                        hover: "coordinate-tool-hover"
                    },

                    actions: {
                        activation: function (viewer) {
                            this.coordinates = null;

                            viewer.loading.done(function () {
                                $(viewer.container()).addClass("gc-cursor-crosshair");
                                viewer.bind("mouseDown", onMapClick);
                            });
                        },

                        deactivation: function (viewer) {
                            viewer.loading.done(function () {
                                viewer
                                .unbind("mouseDown", onMapClick);

                                $(viewer.container()).removeClass("gc-cursor-crosshair");
                            });
                        }
                    }
                }
            );

            return pickCoordinatesTool;
        },

        selectExtent: function () {
            var initState, map, viewer, fn, label, resizing,
                rectangle, recStartLat, recStartLng,
                extLabelN, extLabelE, extLabelS, extLabelW,
                handleN, handleE, handleW, handleS,

                handleStyleNormal = { color: "#0033ff", weight: 6, opacity: 1.0 },
                handleStyleHighlight = { color: "#33ff33", weight: 8 },

                init = function (tool) {
                    initState = {};
                    // get fn instance and leaflet map
                    viewer = tool.viewer;
                    fn = viewer.instance,
                    map = fn.exposeLeaflet();
                    // create label icon
                    label = new L.DivIcon({ className: "gc-select-extent-label" });
                    // get dragging state
                    initState.dragging = map.dragging.enabled();
                    // disable map dragging
                    map.dragging.disable();
                    // attach event listeners
                    map.on("mousedown", rectangleStart);
                    // change cursor
                    $(viewer.container()).addClass("gc-cursor-crosshair");
                },

                finalize = function () {
                    // remove rectangle and all other tool ui elements
                    removeRectangle();
                    // unbind possibly leftover handlers
                    map
                    .off("mousedown", rectangleStart)
                    .off("mousemove", rectangleGrow)
                    .off("mousedown", removeRectangle)
                    .off("mousemove", resizeN)
                    .off("mousemove", resizeE)
                    .off("mousemove", resizeW)
                    .off("mousemove", resizeS);
                    // change cursor back
                    $(viewer.container()).removeClass("gc-cursor-crosshair");
                },

                rectangleStart = function (evt) {
                    var latlng = evt.latlng,
                        bounds = new L.LatLngBounds(latlng, latlng);

                    // remember starting point
                    recStartLat = latlng.lat;
                    recStartLng = latlng.lng;
                    // remove start event handler
                    map.off("mousedown", rectangleStart);
                    map.off("mousedown", removeRectangle);
                    // add handlers to continue
                    map.on("mousemove", rectangleGrow);
                    $(document).on("mouseup", rectangleEnd);
                    // add the rectangle to the map
                    rectangle = new L.Rectangle(bounds).addTo(map);
                },

                rectangleGrow = function (evt) {
                    var bounds = calcNewBounds(evt.latlng);
                    // set new rectangle bounds
                    rectangle.setBounds(bounds);
                    // display rectangle extent labels
                    displayExtentLabels(bounds);
                },

                rectangleEnd = function () {
                    // remove existing event handlers
                    map.off("mousemove", rectangleGrow);
                    $(document).off("mouseup", rectangleEnd);
                    // add handlers to continue
                    map.on("mousedown", removeRectangle);
                    map.on("mousedown", rectangleStart);
                    // add resize handles
                    createResizeHandles();
                },

                displayExtentLabels = function (bounds) {
                    var center = bounds.getCenter(),
                        ne = bounds.getNorthEast(),
                        sw = bounds.getSouthWest(),
                        n = ne.lat,
                        e = ne.lng,
                        s = sw.lat,
                        w = sw.lng,
                        topright = fn.fromLeafletCoords(ne),
                        bottomleft = fn.fromLeafletCoords(sw),
                        t = topright.y,
                        r = topright.x,
                        b = bottomleft.y,
                        l = bottomleft.x,
                        labelNLatLng = new L.LatLng(n, center.lng),
                        labelELatLng = new L.LatLng(center.lat, e),
                        labelWLatLng = new L.LatLng(center.lat, w),
                        labelSLatLng = new L.LatLng(s, center.lng),
                        $labelN, $labelE, $labelW, $labelS;

                    if (extLabelN == null) {
                        // create labels
                        extLabelN = new L.Marker(labelNLatLng, { icon: label, html: t }).addTo(map);
                        extLabelE = new L.Marker(labelELatLng, { icon: label, html: r }).addTo(map);
                        extLabelW = new L.Marker(labelWLatLng, { icon: label, html: l }).addTo(map);
                        extLabelS = new L.Marker(labelSLatLng, { icon: label, html: b }).addTo(map);
                    } else {
                        // move labels and set text
                        extLabelN.setLatLng(labelNLatLng)._icon.innerHTML = t;
                        extLabelE.setLatLng(labelELatLng)._icon.innerHTML = r;
                        extLabelW.setLatLng(labelWLatLng)._icon.innerHTML = l;
                        extLabelS.setLatLng(labelSLatLng)._icon.innerHTML = b;
                    }

                    // adjust label positions
                    $labelN = $(extLabelN._icon);
                    $labelE = $(extLabelE._icon);
                    $labelW = $(extLabelW._icon);
                    $labelS = $(extLabelS._icon);
                    $labelN.css("margin-left", $labelN.outerWidth() / -2).css("margin-top", -25);
                    $labelE.css("margin-left", 5).css("margin-top", $labelE.outerHeight() / -2);
                    $labelW.css("margin-left", $labelW.outerWidth() * -1 - 5).css("margin-top", $labelW.outerHeight() / -2);
                    $labelS.css("margin-left", $labelS.outerWidth() / -2).css("margin-top", 5);
                },

                removeExtentLabels = function () {
                    if (extLabelN == null) {
                        return;
                    }

                    map.removeLayer(extLabelN);
                    map.removeLayer(extLabelE);
                    map.removeLayer(extLabelW);
                    map.removeLayer(extLabelS);
                    extLabelN = null;
                    extLabelE = null;
                    extLabelW = null;
                    extLabelS = null;
                },

                createResizeHandles = function () {
                    var bounds = rectangle.getBounds(),
                        ne = bounds.getNorthEast(),
                        sw = bounds.getSouthWest(),
                        nw = new L.LatLng(ne.lat, sw.lng),
                        se = new L.LatLng(sw.lat, ne.lng);

                    rectangle.setStyle({ stroke: false });

                    handleN = new L.Polyline([nw, ne], handleStyleNormal)
                        .addTo(map)
                        .on("mouseover", handleHighlight)
                        .on("mouseout", handleUnhighlight)
                        .on("mousedown", grabHandle);

                    handleE = new L.Polyline([se, ne], handleStyleNormal)
                        .addTo(map)
                        .on("mouseover", handleHighlight)
                        .on("mouseout", handleUnhighlight)
                        .on("mousedown", grabHandle);

                    handleW = new L.Polyline([sw, nw], handleStyleNormal)
                        .addTo(map)
                        .on("mouseover", handleHighlight)
                        .on("mouseout", handleUnhighlight)
                        .on("mousedown", grabHandle);

                    handleS = new L.Polyline([sw, se], handleStyleNormal)
                        .addTo(map)
                        .on("mouseover", handleHighlight)
                        .on("mouseout", handleUnhighlight)
                        .on("mousedown", grabHandle);
                },

                handleHighlight = function (evt) {
                    var handle = evt.target;

                    // don't highlight if already resizing
                    if (resizing) {
                        return;
                    }

                    // bring to front
                    map.removeLayer(handle).addLayer(handle);
                    // change style
                    evt.target.setStyle(handleStyleHighlight);
                },

                handleUnhighlight = function (evt) {
                    // revert style
                    evt.target.setStyle(handleStyleNormal);
                },

                grabHandle = function (evt) {
                    var handle = evt.target;

                    // jump out if already resizing
                    if (resizing) {
                        return;
                    }

                    // raise resizing flag;
                    resizing = handle;
                    // remove old event handlers
                    handle
                    .off("mouseover", handleHighlight)
                    .off("mouseout", handleUnhighlight);
                    // set new event handlers
                    $(document).on("mouseup", releaseHandle);
                    switch (handle) {
                        case handleN:
                            map.on("mousemove", resizeN);
                            break;
                        case handleE:
                            map.on("mousemove", resizeE);
                            break;
                        case handleW:
                            map.on("mousemove", resizeW);
                            break;
                        case handleS:
                            map.on("mousemove", resizeS);
                            break;
                    }
                },

                releaseHandle = function () {
                    // remove event handlers
                    $(document).off("mouseup", releaseHandle);
                    switch (resizing) {
                        case handleN:
                            map.off("mousemove", resizeN);
                            break;
                        case handleE:
                            map.off("mousemove", resizeE);
                            break;
                        case handleW:
                            map.off("mousemove", resizeW);
                            break;
                        case handleS:
                            map.off("mousemove", resizeS);
                            break;
                    }
                    // give the handle back its old event handlers
                    resizing
                    .on("mouseover", handleHighlight)
                    .on("mouseout", handleUnhighlight);
                    // drop resizing flag
                    resizing = null;
                },

                resizeN = function (evt) {
                    var bounds = rectangle.getBounds(),
                        thisBoundsCoordinates = bounds.getNorthEast(),
                        oppositeBoundsCoordinates = bounds.getSouthWest(),
                        oppositeContainerCoordinates = map.latLngToContainerPoint(oppositeBoundsCoordinates),
                        evtContainerCoordinate = evt.containerPoint.y,
                        oppositeContainerCoordinate = oppositeContainerCoordinates.y;

                    // check if to close to opposite side
                    if (evtContainerCoordinate > oppositeContainerCoordinate - handleStyleHighlight.weight ) {
                        return;
                    }

                    bounds = new L.LatLngBounds(
                        new L.LatLng(evt.latlng.lat, thisBoundsCoordinates.lng),
                        oppositeBoundsCoordinates
                    );

                    rectangle.setBounds(bounds);
                    displayExtentLabels(bounds);
                    refreshResizeHandles(bounds);
                },

                resizeE = function (evt) {
                    var bounds = rectangle.getBounds(),
                        thisBoundsCoordinates = bounds.getNorthEast(),
                        oppositeBoundsCoordinates = bounds.getSouthWest(),
                        oppositeContainerCoordinates = map.latLngToContainerPoint(oppositeBoundsCoordinates),
                        evtContainerCoordinate = evt.containerPoint.x,
                        oppositeContainerCoordinate = oppositeContainerCoordinates.x;

                    // check if to close to opposite side
                    if (evtContainerCoordinate < oppositeContainerCoordinate + handleStyleHighlight.weight ) {
                        return;
                    }

                    bounds = new L.LatLngBounds(
                        new L.LatLng(thisBoundsCoordinates.lat, evt.latlng.lng),
                        oppositeBoundsCoordinates
                    );

                    rectangle.setBounds(bounds);
                    displayExtentLabels(bounds);
                    refreshResizeHandles(bounds);
                },

                resizeW = function (evt) {
                    var bounds = rectangle.getBounds(),
                        thisBoundsCoordinates = bounds.getSouthWest(),
                        oppositeBoundsCoordinates = bounds.getNorthEast(),
                        oppositeContainerCoordinates = map.latLngToContainerPoint(oppositeBoundsCoordinates),
                        evtContainerCoordinate = evt.containerPoint.x,
                        oppositeContainerCoordinate = oppositeContainerCoordinates.x;

                    // check if to close to opposite side
                    if (evtContainerCoordinate > oppositeContainerCoordinate - handleStyleHighlight.weight ) {
                        return;
                    }

                    bounds = new L.LatLngBounds(
                        oppositeBoundsCoordinates,
                        new L.LatLng(thisBoundsCoordinates.lat, evt.latlng.lng)
                    );

                    rectangle.setBounds(bounds);
                    displayExtentLabels(bounds);
                    refreshResizeHandles(bounds);
                },

                resizeS = function (evt) {
                    var bounds = rectangle.getBounds(),
                        thisBoundsCoordinates = bounds.getSouthWest(),
                        oppositeBoundsCoordinates = bounds.getNorthEast(),
                        oppositeContainerCoordinates = map.latLngToContainerPoint(oppositeBoundsCoordinates),
                        evtContainerCoordinate = evt.containerPoint.y,
                        oppositeContainerCoordinate = oppositeContainerCoordinates.y;

                    // check if to close to opposite side
                    if (evtContainerCoordinate < oppositeContainerCoordinate + handleStyleHighlight.weight ) {
                        return;
                    }

                    bounds = new L.LatLngBounds(
                        oppositeBoundsCoordinates,
                        new L.LatLng(evt.latlng.lat, thisBoundsCoordinates.lng)
                    );

                    rectangle.setBounds(bounds);
                    displayExtentLabels(bounds);
                    refreshResizeHandles(bounds);
                },

                refreshResizeHandles = function (bounds) {
                    var ne = bounds.getNorthEast(),
                        sw = bounds.getSouthWest(),
                        nw = new L.LatLng(ne.lat, sw.lng),
                        se = new L.LatLng(sw.lat, ne.lng);

                    // set handle positions and lengths
                    handleN.setLatLngs([nw, ne]);
                    handleE.setLatLngs([se, ne]);
                    handleW.setLatLngs([sw, nw]);
                    handleS.setLatLngs([sw, se]);
                },

                removeResizeHandles = function () {
                    if (handleN == null) {
                        return;
                    }

                    map.removeLayer(handleN);
                    map.removeLayer(handleE);
                    map.removeLayer(handleW);
                    map.removeLayer(handleS);
                    handleN = null;
                    handleE = null;
                    handleW = null;
                    handleS = null;
                },

                removeRectangle = function () {
                    if (rectangle == null) {
                        return;
                    }

                    // remove labels and resize handles
                    removeExtentLabels();
                    removeResizeHandles();
                    // remove rectangle
                    map.removeLayer(rectangle);
                    recStartLat = null;
                    recStartLng = null;
                    rectangle = null;
                },

                calcNewBounds = function (latlng) {
                    var sw = new L.LatLng(
                            Math.min(recStartLat, latlng.lat),
                            Math.min(recStartLng, latlng.lng)
                        ),
                        ne = new L.LatLng(
                            Math.max(recStartLat, latlng.lat),
                            Math.max(recStartLng, latlng.lng)
                        );
                    return new L.LatLngBounds(sw, ne);
                },

                getExtent = function () {
                    var bounds = rectangle && rectangle.getBounds(),
                        ne, sw, topright, bottomleft, t, r, b, l;

                    if (bounds == null) {
                        return null;
                    }

                    ne = bounds.getNorthEast();
                    sw = bounds.getSouthWest();
                    topright = fn.fromLeafletCoords(ne);
                    bottomleft = fn.fromLeafletCoords(sw);
                    t = topright.y;
                    r = topright.x;
                    b = bottomleft.y;
                    l = bottomleft.x;

                    return new giscloud.Bounds(l, b, r, t);
                },

                restoreMapState = function () {
                    initState.dragging ? map.dragging.enable() : map.dragging.disable();
                };

            return new giscloud.ui.Toolbar.Tool("selectExtent", {
                extent: null,

                styles: {
                    caption: window.gclang && gclang["Select extent"] || "Select extent",
                    showCaption: false,
                    cssClass: "gc-tool-selectextent",
                    active: "gc-tool-selectextent-active",
                    hover: "gc-tool-selectextent-hover"
                },

                actions: {
                    activation: function (viewer) {
                        var that = this;
                        this.extent = null;
                        viewer.loading.done(function () {
                            init(that);
                        });
                    },

                    deactivation: function (viewer) {
                        var that = this;
                        viewer.loading.done(function () {
                            that.extent = getExtent();
                            finalize();
                            restoreMapState();
                        });
                    }
                }
            });
        },

        tool: function (name) {
            switch (name) {
                case "pan":
                    return this.pan();
                case "zoom":
                    return this.zoom();
                case "full":
                    return this.full();
                case "measure":
                    return this.measure();
                case "select":
                    return this.select();
                case "info":
                    return this.info();
                case "areaSelect":
                    return this.areaSelect();
                case "selectExtent":
                    return this.selectExtent();
                default:
                    return null;
            }
        }

    };

})(window, giscloud.exposeJQuery(), giscloud.common());


(function(window, $, common, undefined) {
    var buildTree, restToTree, icon, byLayerOrder, flatten, layerOrderFromDom,
        locks;
    /*
     * Class: LayerList
     * Layer list GUI element for the giscloud viewer. It provides an easy view and means of control over the layers of
     * the map loaded in the viewer.
     */

    giscloud.ui.LayerList = function(viewer, container) {
        var that = this, oid = common.oid(), eventAnchor = {},
            layerdata, layerdataIndex, tree, onCheck, onUncheck, onCheckAll, onUncheckAll, findChildLayers, onLock;

        // get layers data
        giscloud.layers.byMapId(viewer.mapId)
        .done(function (data) {
            // save data
            layerdata = data;
            layerdataIndex = {};
            $.each(layerdata, function (i, item) {
                layerdataIndex[item.id.toString()] = item;
            });

            // build tree list
            tree = buildTree(data, container, oid, viewer);

            // bind event handlers
            tree.on({
                "before.jstree": function () {
                    //console.debug(arguments);
                },
                "check_node.jstree": function (event, d) {
                    onCheck(d.rslt.obj[0].id);
                },
                "uncheck_node.jstree": function (event, d) {
                    onUncheck(d.rslt.obj[0].id);
                },
                "check_all.jstree": function (event, d) {
                    onCheckAll();
                },
                "uncheck_all.jstree": function (event, d) {
                    onUncheckAll();
                },
                "select_node.jstree": function (event, d) {
                    var sid = d.rslt.obj[0].id.split("_");
                    $(eventAnchor).triggerHandler("select", ["select", sid[1], sid[2], layerdataIndex[sid[2]]]);
                },
                "unselect_node.jstree": function (event, d) {
                    var sid = d.rslt.obj[0].id.split("_");
                    $(eventAnchor).triggerHandler("unselect", ["unselect", sid[1], sid[2], layerdataIndex[sid[2]]]);
                },
                "dblclick.jstree": function (event) {
                    var li = $(event.target).closest("li"), sid = li.attr("id").split("_");
                    $(eventAnchor).triggerHandler("dblclick", ["dblclick", sid[1], sid[2], layerdataIndex[sid[2]]]);
                }
            });

            $("#" + container).on("move_node.jstree", function () {
                var order = layerOrderFromDom(tree),
                    layerIndex = {};

                $.each(viewer.layers, function (i, item) {
                    layerIndex[item.id] = item.instance.refId;
                });
                viewer.instance.setLayersOrder($.map(order, function (item) {
                    return layerIndex[item.id];
                }));
            });

        });

        //
        // priveleged methods
        //
        this.bind = function (eventName, handler) {
            var that = this,
                f = function () {
                    var args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(that, args);
                };

            // bind event handler
            $(eventAnchor).on(eventName, f);

            // add unbind reference to the user function
            if (!handler.gcunbind) {
                handler.gcunbind = {};
            }
            handler.gcunbind[oid + eventName] = f;

            return this;
        };

        this.unbind = function (eventName, func) {
            var f;

            // retrieve unbind data
            f = func.gcunbind && func.gcunbind[oid + eventName];

            // unbind
            $(eventAnchor).off(eventName, f);

            return this;
        };

        this.select = function (arr) {
            if (arr) {
                if (!$.isArray(arr)) {
                    arr = [arr];
                }
                $.each(arr, function (i, item) {
                    var id;
                    if (!(item instanceof giscloud.Layer)) {
                        item = layerdataIndex[item];
                    }
                    id = oid + (item.type === "folder" ? "_folder_" : "_layer_") + item.id;
                    tree.jstree("select_node", "#" + id);
                });
            }
            return this;
        };

        this.unselect = function (arr) {
            if (arr) {
                if (!$.isArray(arr)) {
                    arr = [arr];
                }
                $.each(arr, function (i, item) {
                    var id;
                    if (!(item instanceof giscloud.Layer)) {
                        item = layerdataIndex[item];
                    }
                    id = oid + (item.type === "folder" ? "_folder_" : "_layer_") + item.id;
                    tree.jstree("deselect_node", "#" + id);
                });
            }
            return this;
        };

        this.selected = function () {
            return $.map(tree.jstree("get_selected"), function (li) {
                var sid = li.id.split("_");
                return layerdataIndex[sid[2]];
            });
        };

        this.check = function (arr) {
            if (arr) {
                if (!$.isArray(arr)) {
                    arr = [arr];
                }
                $.each(arr, function (i, item) {
                    var id;
                    if (!(item instanceof giscloud.Layer)) {
                        item = layerdataIndex[item];
                    }
                    id = oid + (item.type === "folder" ? "_folder_" : "_layer_") + item.id;
                    tree.jstree("check_node", "#" + id);
                });
            }
            return this;
        };

        this.uncheck = function (arr) {
            if (arr) {
                if (!$.isArray(arr)) {
                    arr = [arr];
                }
                $.each(arr, function (i, item) {
                    var id;
                    if (!(item instanceof giscloud.Layer)) {
                        item = layerdataIndex[item];
                    }
                    id = oid + (item.type === "folder" ? "_folder_" : "_layer_") + item.id;
                    tree.jstree("uncheck_node", "#" + id);
                });
            }
            return this;
        };

        this.checkAll = function () {
            tree.jstree("check_all");
            return this;
        };

        this.uncheckAll = function () {
            tree.jstree("uncheck_all");
            return this;
        };

        this.layers = function () {
            return layerdata;
        };

        this.width = function (w) {
            if (w === undefined) {
                return $("#" + container).width();
            }

            $("#" + container).width(w);
            return this;
        };

        this.height = function (h) {
            if (h === undefined) {
                return $("#" + container).height();
            }

            $("#" + container).height(h);
            return this;
        };

        this.layersOrder = function () {
            return layerOrderFromDom(tree);
        };

        //
        // private methods
        //
        onCheck = function (id) {
            var i, k, cl, sid = id.split("_"); // oid_type_id -> [oid, type, id]

            if (sid[1] === "layer") {
                viewer.showLayer(sid[2]);
            } else {
                cl = findChildLayers(id);
                if (cl) {
                    for (i = 0, k = cl.length; i < k; i++) {
                        viewer.showLayer(cl[i]);
                    }
                }
            }
        };

        onUncheck = function (id) {
            var i, k, cl, sid = id.split("_"); // oid_type_id -> [oid, type, id]

            if (sid[1] === "layer") {
                viewer.hideLayer(sid[2]);
            } else {
                cl = findChildLayers(id);
                if (cl) {
                    for (i = 0, k = cl.length; i < k; i++) {
                        viewer.hideLayer(cl[i]);
                    }
                }
            }
        };

        onCheckAll = function () {
            $.each(viewer.layers, function (i, item) {
                item.visible(true);
            });
        };

        onUncheckAll = function () {
            $.each(viewer.layers, function (i, item) {
                item.visible(false);
            });
        };

        findChildLayers = function (id) {
            var arr = [];
            $("#" + id).find("li[rel!='style']").each(function (i, item) {
                if (this.id.indexOf("folder") === -1) {
                    arr.push(this.id.split("_")[2]);
                }
            });

            // flatten array before returning
            return flatten(arr);
        };

        onLock = function (id, onoff) {
            var lay = viewer.layerById(id);
            if (lay) {
                lay.selectable(onoff);
            }
        };
    };

    // buildTree - grows the tree
    buildTree = function (data, container, oid, viewer) {
        var tree, treedata = restToTree(data, oid),
            treeConfig = {
                // plugins which will be activated
                plugins: ["themes", "json_data", "checkbox", "ui", "types", "dnd"],

                // types plugin config
                types : {
                    max_depth : -2,
                    max_children : -2,
                    valid_children : ["layer", "folder"],
                    types: {
                        layer: {
                            valid_children: ["style"]
                        },
                        folder: {
                            valid_children: ["layer", "folder"]
                        },
                        style: {
                            valid_children: [],
                            start_drag: false,
                            move_node: false,
                            hover_node: false,
                            dehover_node: false,
                            select_node: false
                        }
                    }
                },

                // data plugin config
                json_data: {
                    data: treedata
                },

                // themes plugin config
                themes: {
                    url: common.apiHost() + "/libs/jstree/rc3/themes/giscloud/style.css",
                    theme: "giscloud",
                    dots: false
                },

                // ui plugin config
                ui: {
                    selected_parent_close: false
                },

                // core config
                core: {
                    animation: 0
                }
            };

        window.ccc = common;

        // init the tree
        tree = $("#" + container).on(
            "loaded.jstree",
            // bind the method to create lock icons after load
            function (e) {
                locks($(e.target), viewer);
            }
        ).jstree(treeConfig);

        return tree;
    };

    // restToTree - transforms REST layer data to a jstree structure
    restToTree = function (data, oid) {
        var i, k, d, node, id, rec, parentFolderId,
            root = [], folders = {},
            treedata = [];

        if (!data) {
            return {};
        }

        // create the tree structure
        for (i = 0, k = data.length; i < k; i++) {
            d = data[i];
            node = null;

            if (d.type === "folder") {

                id = "folder" + d.id;

                // check if exists; update or create
                if (folders[id]) {
                    // update
                    folders[id].obj = d;
                    node = folders[id];
                } else {
                    // create
                    node = {
                        id: id,
                        obj: d,
                        nodes: []
                    };
                    // add to folders index
                    folders[id] = node;
                }
            } else {
                // create layer node
                id = "layer" + d.id;
                node = {
                    id: id,
                    obj: d
                };
            }

            // add node to folder if it has a parent, otherwise add to root
            if (d.parent === null) {
                // add to root
                root.push(node);
            } else {
                parentFolderId = "folder" + d.parent;

                // check parent folder and create an empty one if not present
                if (!folders[parentFolderId]) {
                    // create empty parent node; it will be updated later
                    folders[parentFolderId] = {
                        id: d.parent,
                        obj: null,
                        nodes: []
                    };
                }

                // add to parent folder
                folders[parentFolderId].nodes.push(node);
            }
        }

        // prepare the recursive function
        rec = function (n) {
            var sorted;

            // sort by layer order
            sorted = n.sort(byLayerOrder);

            // return transformed array
            return $.map(sorted, function (k) {
                var c;
                if (k.nodes) {
                    // folders
                    return {
                        data: {
                            title: k.obj.name,
                            icon: icon("folder")
                        },
                        children: rec(k.nodes),
                        attr: {
                            rel: "folder", // this sets the type of the node
                            id: oid + "_folder_" + k.obj.id,
                            "class": "jstree-undetermined"
                        }
                    };
                } else {
                    // layers
                    c = k.obj.styles;
                    if (c && c.length > 1) {
                        // layers with multiple styles
                        return {
                            data: {
                                title: k.obj.name,
                                icon: icon(null, "multi")
                            },
                            attr: {
                                rel: "layer",
                                id: oid + "_layer_" + k.obj.id,
                                "class": k.obj.visible === "t" ? "jstree-checked" : ""
                            },
                            children: $.map(c, function (val) {
                                    // create style subnodes
                                    return {
                                        data: {
                                            title: val.expression,
                                            icon: icon("geometry", val.symbol || {
                                                    type: k.obj.type,
                                                    color: val.color,
                                                    border: val.bordercolor
                                                })
                                        },
                                        attr: {
                                            rel: "style",
                                            "class": "jstree-style-node"
                                        }
                                    };
                            })
                        };
                    } else {
                        // layers with a single style
                        c = c && c[0];
                        return {
                            data: {
                                title: k.obj.name,
                                icon: icon(k.obj.type, c && (c.symbol || (c.url && c) || {
                                            type: k.obj.type,
                                            color: c.color,
                                            border: c.bordercolor
                                        }))
                            },
                            attr: {
                                rel: "layer",
                                id: oid + "_layer_" + k.obj.id,
                                "class": k.obj.visible === "t" ? "jstree-checked" : ""
                            }
                        };
                    }
                }
            });
        };

        // create the jstree data structure
        treedata = rec(root);

        return treedata;
    };

    // layer sorting function
    byLayerOrder = function (e1, e2) {
        var a, b;

        if (typeof e1.obj.order === "string") {
            a = parseInt(e1.obj.order, 10);
            b = parseInt(e2.obj.order, 10);
        } else {
            a = e1.obj.order;
            b = e2.obj.order;
        }
        return b - a;
    };

    // layer order imagining function
    layerOrderFromDom = function (tree, justOrder) {
        var i = 0,
            rec = function (root) {
                return $.map(root.find("ul:first").children(), function(el) {
                    var jq = $(el), sid;
                    if (jq.is("[rel='folder']")) {
                        return rec(jq);
                    } else {
                        if (justOrder) {
                            return i++;
                        } else {
                            sid = el.id.split("_");
                            return {
                                id: sid[2],
                                type: sid[1],
                                order: i++
                            };
                        }
                    }
                });
            };
        return rec(tree);
    };

    // array flattening function
    flatten = function (array) {
        var i, k, el, arr = [];
        for (i = 0, k = array.length; i < k; i++) {
            el = array[i];
            if (Object.prototype.toString.call(el) === "[object Array]") {
                arr = arr.concat(flatten(el));
            } else {
                arr.push(el);
            }
        }
        return arr;
    };

    // icon procuring function
    icon = function (type, symbol) {
        var url, protocol = (window.location.protocol == "https:" ? "https:" : "http:");

        if (symbol === "multi") {
            url = "/assets/images/layertree/color_swatch.gif";
        } else {
            switch (type) {
            case "folder":
                url = "/assets/images/layertree/folder.gif";
                break;
            case "raster":
                url = "/assets/images/image.gif";
                break;
            case "wms":
            case "tile":
                url = "/assets/images/world.gif";
                break;
            case "point":
            case "line":
            case "polygon":
            case "geometry":
                url = symbol.url ? "/assets/icon.php?p=" + encodeURI(symbol.url) :
                    "/assets/icon.php?type=" + symbol.type +
                    "&color=" + symbol.color + "&border=" + symbol.border +
                    "&bw=0&size=10";
                break;
            default:
                return null;
            }
        }
        return common.apiHost() + url;
    };

    // lock icon inventing function
    locks = function (container, viewer) {
        var layerNodes = container.find("li[rel='layer']");

        layerNodes.each(function (i, node) {
            var nodeId = node.id,
                parts = nodeId && nodeId.split("_"),
                layerId = parts && parts.length && parts[2],
                layer = viewer.layerById(layerId);

            if (!layer || !layer.selectable || $.inArray(layer.type, ["point", "line", "polygon"]) === -1) {
                return;
            }

            $("<ins/>", {
                "class": (layer.selectable() ? "jstree-no-lock-icon" : "jstree-lock-icon"),

                // lock/unlock function
                click: function (e) {

                    if (!viewer) {
                        return;
                    }

                    var el = $(e.target),
                        p = el.closest("li"),
                        sid = p.attr("id").split("_");

                    if (el.hasClass("jstree-lock-icon")) {
                        // unlock
                        viewer.layerById(sid[2]).selectable(true);
                        el.addClass("jstree-no-lock-icon");
                        el.removeClass("jstree-lock-icon");
                    } else {
                        // lock
                        viewer.layerById(sid[2]).selectable(false);
                        el.addClass("jstree-lock-icon");
                        el.removeClass("jstree-no-lock-icon");
                    }
                    e.stopPropagation();
                    e.preventDefault();
                }

            }).insertAfter($(node).find("a > ins.jstree-checkbox"));
        });
    };

}(window, giscloud.exposeJQuery(), giscloud.common()));


(function (window, $, common, undefined) {

    giscloud.ddupload = (function(container){


        var that = this,
        upload_url, user_dir, msg, accept_flag = true,
        uploader, progress_status, progressbar, xhr, xhr_status;

        this.init = function (opts) {

            if (!that.support())
                return false;

            // Init default messages
            msg = ['Drop your files to upload to GIS Cloud'];


            if ($('.gc-drag-n-drop-strip').length==0) {
                $("<div class='gc-drag-n-drop-strip gc-drag-n-drop-strip-top' ></div>").appendTo(container);
                $("<div class='gc-drag-n-drop-strip gc-drag-n-drop-strip-bottom' ></div>").appendTo(container);
                $("<div class='gc-drag-n-drop-strip gc-drag-n-drop-strip-left' ></div>").appendTo(container);
                $("<div class='gc-drag-n-drop-strip gc-drag-n-drop-strip-right' ></div>").appendTo(container);
            }

            uploader = $('<div class="gc-uploader" ><div class="gc-uploader-status" ></div></div>').appendTo('body');
            progress_status = uploader.children(".gc-uploader-status");
            progressbar = $('<div class="gc-upload-progress-bar" ></div></div>').appendTo(uploader);

            uploader.click(function(){
                that.hide();
            });
            $('body').click(function(){
                that.hide(true);
            })

            // container.mouseenter(function(){
            //     that.dropZoneEnter();
            // });

            // container.mouseleave(function(){
            //     that.dropZoneLeave();
            // });

            container.bind({
                dragover: function(e) {
                    that.dropZoneEnter(e);
                    return false;
                },
                dragleave: function(e) {
                    that.dropZoneLeave(e);
                },
                dragend: function(e) {
                    that.dropZoneLeave(e, true);
                    return false;
                },
                drop: function(e) {
                    e.preventDefault();
                    that.dropZoneLeave(e, true);

                    if (!accept_flag) return;

                    var files = e.originalEvent.dataTransfer.files;
                    that.files = [];
                    for (var i = 0; i < files.length; i++) {
                        that.files.push(files[i]);
                    }
                    container.trigger('uploadstart', that.files);

                    that.files_uploaded = [];
                    that.num_of_files_for_upload = that.files.length;
                    that.num_of_files_uploaded = 0;

                    that.startUpload();
                }
            });

            that.upload_dir("");
        }

        this.setMessage = function(m) {
            msg[0] = m;
        }

        // API
        this.upload_dir = function(rel_dir) {
            user_dir = rel_dir;
            upload_url = common.rest.url()+"storage/fs"+user_dir;
        }

        // API
        this.support = function() {
            return !!window.FormData && ("upload" in new XMLHttpRequest);
        }

        // API
        this.accept = function(a) {
            accept_flag = a;
        }

        this.dropZoneEnter = function(e) {
            container.trigger('dropzoneenter', [e]); // allow to change dropenter msg from outside

            if(accept_flag){
                this.dropZoneGreen();
            }else{
                this.dropZoneRed();
            }
            $('.gc-drag-n-drop-strip').addClass('hover');
            giscloud.ui.alert.show(msg[0]);
        }

        this.dropZoneLeave = function(e, force, no_alert) {
            if (force || (e.originalEvent.screenX==0 && e.originalEvent.screenY==0) )
            {
                $('.gc-drag-n-drop-strip').removeClass('hover');
                if (!no_alert) giscloud.ui.alert.hide();
            }
        }

        this.dropZoneRed = function(e, force) {
            $('.gc-drag-n-drop-strip').addClass('red');
            giscloud.ui.alert.color('red');
        }

        this.dropZoneGreen = function(e, force) {
            $('.gc-drag-n-drop-strip').removeClass('red');
            giscloud.ui.alert.color('green');
        }

        this.hide = function (no_alert) {
            that.dropZoneLeave(null, true, no_alert);

            if (!xhr_status) {
                uploader.fadeOut();
            }else{
                if (!no_alert) alert("Upload in progress...");
            }
        }

        this.abortUpload = function (file) {
            that.dropZoneLeave(null, true);

            if (xhr) {
                xhr.abort();
            }
        }

        this.startUpload = function () {
            var filenames = jQuery.map(that.files, function(file){
                return file.name;
            });
            giscloud.log.push("upload_start", {type: "dnd", count: filenames.length, files: filenames.join()});
            this.uploadRemainingFiles();
        }

        this.uploadRemainingFiles = function () {

            if (that.files.length>0) {
                that.uploadFile(that.files.pop());
            }else{
                progress_status.html("Uploaded "+that.num_of_files_uploaded+" files. ");
                $('<a href="javascript:;" >Hide</a>').appendTo(progress_status).click(that.hide);

                giscloud.log.push("upload_completed", {type: "dnd", uploaded: that.num_of_files_uploaded});
                container.trigger('uploadcomplete', [user_dir, that.files_uploaded]);
            }

            //     var file = files[i];
            //     var ext = file.name.substr(file.name.lastIndexOf('.') + 1);

            //     // if (ext=="zip")
            //     //     that.uploadFile(file);
            //     // else
                    //     //     alert("Unsupported file type");
            // }

        }

        this.uploadFile = function (file) {

            if (!file) return;

            var formData = new FormData();

            formData.append('file', file);

            progress_status.html("Uploading '"+file.name+"'... ");
            $('<a href="javascript:;" >Cancel</a>').appendTo(progress_status).click(that.abortUpload);

            uploader.fadeIn();

            // now post a new XHR request
            if (1) {
                xhr = new XMLHttpRequest();
                xhr.open('POST', upload_url);
                xhr.onload = function(e) {
                    xhr_status = false;

                    if (e.currentTarget.status!=204){
                        giscloud.log.push("upload_error", {type: "dnd", error: e.currentTarget.statusText});
                        progress_status.html("<span class='gc-red' >Upload error: "+e.currentTarget.statusText+"</span>");
                        return;
                    }
                    giscloud.log.push("upload_file_completed", {type: "dnd", file: file.name});

                    that.files_uploaded.push(file);
                    that.num_of_files_uploaded++;
                    that.uploadRemainingFiles();
                    progressbar.progressbar({value: 100});
                };

                xhr.onabort = function() {
                    progress_status.html("Uploading canceled. ");
                    giscloud.log.push("upload_aborted", {type: "dnd"});
                    $('<a href="javascript:;" >Hide</a>').appendTo(progress_status).click(that.hide);
                    progressbar.progressbar({value: 0});
                    xhr_status = false;
                };


                if (1) {
                    xhr.upload.onprogress = function (event) {
                        if (event.lengthComputable) {
                            var complete = (event.loaded / event.total * 100 | 0);
                            progressbar.progressbar({value: complete});
                        }
                    }
                }

                giscloud.log.push("upload_file", {type: "dnd", file: file.name});
                xhr_status = true;
                xhr.send(formData);
            }
        }

        this.init();

    });

})(window, window.giscloud.exposeJQuery(), window.giscloud.common());


(function (common) {
    var md5;

    /*
     * Source: http://www.onicos.com/staff/iz/amuse/javascript/expert/md5.txt
     */
    var MD5_T = [
                0x00000000, 0xd76aa478, 0xe8c7b756, 0x242070db,
                0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
                0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1,
                0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
                0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51,
                0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681,
                0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87,
                0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9,
                0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
                0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60,
                0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085,
                0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8,
                0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7,
                0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d,
                0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314,
                0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
                0xeb86d391
        ],
        MD5_round1 = [
                [ 0, 7, 1], [ 1,12, 2],
                [ 2,17, 3], [ 3,22, 4],
                [ 4, 7, 5], [ 5,12, 6],
                [ 6,17, 7], [ 7,22, 8],
                [ 8, 7, 9], [ 9,12,10],
                [10,17,11], [11,22,12],
                [12, 7,13], [13,12,14],
                [14,17,15], [15,22,16]
        ],

        MD5_round2 = [
                [ 1, 5,17], [ 6, 9,18],
                [11,14,19], [ 0,20,20],
                [ 5, 5,21], [10, 9,22],
                [15,14,23], [ 4,20,24],
                [ 9, 5,25], [14, 9,26],
                [ 3,14,27], [ 8,20,28],
                [13, 5,29], [ 2, 9,30],
                [ 7,14,31], [12,20,32]
        ],

        MD5_round3 = [
                [ 5, 4,33], [ 8,11,34],
                [11,16,35], [14,23,36],
                [ 1, 4,37], [ 4,11,38],
                [ 7,16,39], [10,23,40],
                [13, 4,41], [ 0,11,42],
                [ 3,16,43], [ 6,23,44],
                [ 9, 4,45], [12,11,46],
                [15,16,47], [ 2,23,48]
        ],

        MD5_round4 = [
                [ 0, 6,49], [ 7,10,50],
                [14,15,51], [ 5,21,52],
                [12, 6,53], [ 3,10,54],
                [10,15,55], [ 1,21,56],
                [ 8, 6,57], [15,10,58],
                [ 6,15,59], [13,21,60],
                [ 4, 6,61], [11,10,62],
                [ 2,15,63], [ 9,21,64]
        ];

    function MD5_F(x, y, z) { return (x & y) | (~x & z); }
    function MD5_G(x, y, z) { return (x & z) | (y & ~z); }
    function MD5_H(x, y, z) { return x ^ y ^ z;          }
    function MD5_I(x, y, z) { return y ^ (x | ~z);       }

    var MD5_round = [
                [MD5_F, MD5_round1],
                [MD5_G, MD5_round2],
                [MD5_H, MD5_round3],
                [MD5_I, MD5_round4]
       ];

    function MD5_pack(n32) {
        return String.fromCharCode(n32 & 0xff) +
            String.fromCharCode((n32 >>> 8) & 0xff) +
            String.fromCharCode((n32 >>> 16) & 0xff) +
            String.fromCharCode((n32 >>> 24) & 0xff);
    }

    function MD5_unpack(s4) {
        return s4.charCodeAt(0) |
            (s4.charCodeAt(1) << 8) |
            (s4.charCodeAt(2) << 16) |
            (s4.charCodeAt(3) << 24);
    }

    function MD5_number(n) {
        while (n < 0)
            n += 4294967296;
        while (n > 4294967295)
            n -= 4294967296;
        return n;
    }

    function MD5_apply_round(x, s, f, abcd, r) {
        var a, b, c, d, kk, ss, ii, t, u;

        a = abcd[0];
        b = abcd[1];
        c = abcd[2];
        d = abcd[3];
        kk = r[0];
        ss = r[1];
        ii = r[2];

        u = f(s[b], s[c], s[d]);
        t = s[a] + u + x[kk] + MD5_T[ii];
        t = MD5_number(t);
        t = ((t << ss) | (t >>> (32 - ss)));
        t += s[b];
        s[a] = MD5_number(t);
    }

    function MD5_hash(data) {
        var abcd, x, state, s, len, index, padLen, f, r, i, j, k, tmp;

        state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
        len = data.length;
        index = len & 0x3f;
        padLen = (index < 56) ? (56 - index) : (120 - index);
        if (padLen > 0) {
            data += "\x80";
            for (i = 0; i < padLen - 1; i++) {
                data += "\x00";
            }
        }
        data += MD5_pack(len * 8);
        data += MD5_pack(0);
        len += padLen + 8;
        abcd = [0, 1, 2, 3];
        x = [16];
        s = [4];

        for (k = 0; k < len; k += 64) {
            for (i = 0, j = k; i < 16; i++, j += 4) {
                x[i] = data.charCodeAt(j) |
                (data.charCodeAt(j + 1) << 8) |
                (data.charCodeAt(j + 2) << 16) |
                (data.charCodeAt(j + 3) << 24);
            }
            for (i = 0; i < 4; i++)
                s[i] = state[i];
            for (i = 0; i < 4; i++) {
                f = MD5_round[i][0];
                r = MD5_round[i][1];
                for (j = 0; j < 16; j++) {
                    MD5_apply_round(x, s, f, abcd, r[j]);
                    tmp = abcd[0];
                    abcd[0] = abcd[3];
                    abcd[3] = abcd[2];
                    abcd[2] = abcd[1];
                    abcd[1] = tmp;
                }
            }

            for (i = 0; i < 4; i++) {
                state[i] += s[i];
                state[i] = MD5_number(state[i]);
            }
        }

        return MD5_pack(state[0]) +
        MD5_pack(state[1]) +
        MD5_pack(state[2]) +
        MD5_pack(state[3]);
    }

    function MD5_hexhash(data) {
        var i, out, c;
        var bit128;

        bit128 = MD5_hash(data);
        out = "";
        for (i = 0; i < 16; i++) {
            c = bit128.charCodeAt(i);
            out += "0123456789abcdef".charAt((c >> 4) & 0xf);
            out += "0123456789abcdef".charAt(c & 0xf);
        }
        return out;
    }

    // wrap
    md5 = function (data) {
        return MD5_hexhash(data.toString());
    };


    giscloud.md5 = md5;


    // publish to giscloud or window
    if (common) {
        common.md5 = md5;
    } else {
        window.md5 = md5;
    }
}(typeof giscloud !== "undefined" ? giscloud.common() : null))

if (!window.giscloud) {

    window.giscloud = {};
    giscloud.common = function() { return null; }
}

(function (window, $, common, undefined) {

    var MAX_NUMBER_OF_LOADERS = 5;

    var giscloud_url = "http://api.giscloud.com/";
    if (common) giscloud_url = common.appSite();

    var giscloud_tile_url = (giscloud_config.tileSite()) ? giscloud_config.tileSite() : giscloud_url;

    var isWebKit = (navigator.userAgent.indexOf("WebKit") > 0);
    var tile_buffer = new Array();
    var isMouseDown;
    var fields;
    var _selectablePoly;
    var bounds;
    var selectionEnabled = false;
    var laycount = 0;
    var loader_id = 0;
    var active_loaders = {};
    var tile_request = {};
    var tile_req = [];
    var tile_req_seq = 0;

    giscloud.Html5MapRefreshUrls = function () {
        giscloud_url = common.appSite();
        giscloud_tile_url = giscloud_config.tileSite() ?
            giscloud_config.tileSite() :
            giscloud_url;
    };

    giscloud.Html5MapSetSelection = function(v) {
        selectionEnabled = v;
    }

    giscloud.html5ResetLoaders = function() {
        var r;
        for (r in active_loaders) {
            if (!active_loaders[r]) continue;

            if (active_loaders[r].dest)
                active_loaders[r].dest._layer._tileOnError.call(active_loaders[r].dest);

            if (active_loaders[r].abort) {
                active_loaders[r].abort();
            }
            active_loaders[r] = null;
        }

        loader_id ++;
        running_loader = 0;
        tile_request = {};
    }

    giscloud.Html5Map = function(o, parent) {
        _init(o, this);
        this.parent = parent;

        giscloud.Html5SendRequests = function() {
            sendRequests();
        }
        this._layer = o;
        laycount ++;

        MAX_NUMBER_OF_LOADERS = 1000;
        //MAX_NUMBER_OF_LOADERS = Math.round( 3.0 / laycount );
        //if (MAX_NUMBER_OF_LOADERS < 1) MAX_NUMBER_OF_LOADERS = 1;

            var load_requests = [];
var running_loader = 0;

function loadNextTile(last_req) {

    if (active_loaders[last_req]) {
        delete active_loaders[last_req];
    }

    (running_loader > 0) && running_loader--;

    var r = load_requests.shift();
    if (r) {
        r.dest._loader_id = loader_id;
        ajaxLoader(r.func,r.url,r.dest);
    }
}

function _getTile(coord,zoom,ownerDocument,that)
{
    var m = Math.pow(2,zoom);
    var y = coord.y;
    if (y < 0 || y >= m) return ownerDocument.createElement('div');
    var x = coord.x % m;

    var tile = jsonCanvas(ownerDocument,that);
    var uri = zoom+"/"+x+"/"+y;

    if (that.url) {
        var tileurl = that.url+uri;
        if (fields)
            ajaxLoader(drawGeomCanvas,tileurl+".json?fields="+fields,tile.c);
        else
            ajaxLoader(drawGeomCanvas,tileurl+".json",tile.c);
    } else {
        tile_buffer.push({"tile":tile.c,"uri":uri});
    }

    return tile;
}

function sendRequests() {
    var r;
    while (r = tile_req.shift()) {
        if (r.that.url2) {
            ajaxLoader(drawTile, r.that.url2 + tile_request[r.uri].timestamps.join(",") + "/" + r.that.mid + "/" +
                       tile_request[r.uri].layers.join(",") + "/" + r.uri + ".json", r.tile);
        } else
        if (r.that.url3) {
            ajaxLoader(drawTile, r.that.url3 + tile_request[r.uri].timestamps.join(",") + "/" + r.that.mid + "/" +
                       tile_request[r.uri].layers.join(",") + "/dyn,"+r.that.t+
                       "/" + r.uri + ".json", r.tile);
        } else {
            tile_buffer.push({"tile":tile, "uri":uri});
        }
    }
}

function _loadTile(tile,coord,zoom,that) {
    var uri = "";
    if (that.feature_filter) {
        uri = that.feature_filter.attributes + "/";
        tile.feature_filter_attributes = that.feature_filter.attributes;
    }
    else
        tile.feature_filter_attributes = null;
    uri += zoom + "/" + coord.x + "/" + coord.y;

    tile.obj = that;
    tile.zoom = zoom;
    tile.coord = coord;
    tile._loader_id = loader_id;
    tile.uri = uri;

    if (!tile_request[uri]) {
        tile_req_seq ++;
        tile_request[uri] = {tiles:[], layers:[], timestamps:[], seq: tile_req_seq, present: {}};
        tile_req.push({coord: coord, tile: tile, that:that, uri:uri});
    }
    if (!tile_request[uri].present[that.lid]) {
        tile_request[uri].tiles.push(tile);
        tile_request[uri].layers.push(that.lid);
        tile_request[uri].timestamps.push(that.modified);
        tile_request[uri].present[that.lid] = true;
    }
}

function ajaxLoader(func,url,dest)
{
    if (running_loader == MAX_NUMBER_OF_LOADERS)
    {
        load_requests.push({func:func,url:url,dest:dest});
        return;
    }

    running_loader++;

    if (document.getElementById) {
        var x = (window.XDomainRequest) ? new XDomainRequest() : new XMLHttpRequest();
        if (window.XDomainRequest) x.xdomain = 1;
    }

    if (x)
    {
        x.seq = tile_request[dest.uri].seq;
        x.dest = dest;
        active_loaders[x.seq] = x;
        x.onreadystatechange = function() {
            var el = el || {};

            if (x.xdomain || x.readyState == 4) {
                var d = 0;
                var el;
                if (x.xdomain || x.status == 200) {
                    el = x.dest;
                    if (x.responseText && x.responseText[0] != '<' && x.responseText != "[0]") {
                        if (window.JSON) {
                            d = window.JSON.parse(x.responseText);
                        }
                        else {
                            d = eval("("+x.responseText+")");
                        }
                    }
                }
                if (d && d.length && !el.obj.dynamic)
                {
                    var tiles = tile_request[el.uri].tiles;
                    if (tiles.length != d.length)
                    {
                        console.log("tile warning", tiles.length, d.length, tile_request[el.uri].seq,
                                    x.seq, x._url, d, tile_request[el.uri]);
                    }
                    for (var i = 0; i < tiles.length; i++)
                    {
                        var tile = tiles[i];

                        if (d[i]) {
                            func(tile,d[i]);
                        }
                        if (tile && tile.ontileload) {
                            tile.ontileload();
                        }
                    }
                }
                else if (el) {
                    if (d) {
                        func(el,d);
                    }
                    if (el.ontileload) {
                        el.ontileload();
                    }
                }
                if (tile_request[el.uri])
                    tile_request[el.uri] = null;
                loadNextTile(this.seq);
            }
        };
        if (x.xdomain) {
            x.onerror = function() {
                if (tile_request[x.dest.uri] && tile_request[x.dest.uri].seq == x.seq)
                    tile_request[x.dest.uri] = null;
                loadNextTile(this.seq);
            };
            x.ontimeout = function() {
                if (tile_request[x.dest.uri] && tile_request[x.dest.uri].seq == x.seq)
                    tile_request[x.dest.uri] = null;
                loadNextTile(this.seq);
            };
            x.onprogress = function() {};
            x.onload = x.onreadystatechange;
        }
        x.open("GET", url);
        x._url = url;
        x.send();
    }
}


        this._loadTile = _loadTile;

        this.setFields = function(_fields) {
            fields = _fields;
        };

        this.getTile = function(coord, zoom, ownerDocument) {
            return _getTile(coord, zoom, ownerDocument, this);
        };

        this.loadTile = function(tile, coord, zoom) {
            _loadTile(tile,coord,zoom,this);
        };

        this.selectablePoly = function(v) {
            _selectablePoly = v;
        };

        this.setBounds = function(b) {
            bounds = b;
        }

        this.onMouseMove = function(evt,force,offset) {
            if (this.parent._selectable)
                return checkForEvent(evt,force,offset);
            else
                return false;
        };

        this.onMouseUp = function(evt) {
            // isMouseDown = 0;
        };

        this.onMouseDown = function(evt) {
            // isMouseDown = 1;
        };

        this.getCanvases = function() {
            return document.getElementsByTagName("canvas");
        }

        this.modifyObject = function(a,b,c,d,e,f) {

            a = new String(a).split(",");
            if (!c) c = "";
            var color;
            if (isNaN(b.color))
                color = b.color;
            else
                color = "#" + b.color.toString(16);

            var h = new Object();
            h.color = color;
            h.linewidth = 1;

            var toClear = null;

            if (d) {
                toClear = this.modifier;
                this.modifier = {}
            }

            for (var i = 0; i < a.length; i++) {
                var key = (c + a[i]).replace("||","_");
                this.modifier[key] = h;
            }

            drawAcrossTiles(this, toClear);

            toClear = null;
        }

        this.redraw = function() {
            redraw(this);
        }

        this.reload = function() {
            var c = this.getCanvases();
            for (var i in c) {
                if (c[i].coord) {
                    c[i].styles = null;
                    _loadTile(c[i],c[i].coord,c[i].zoom,this);
                }
            }
        }

        this.resetLoader = function() {
            giscloud.html5ResetLoaders();
        }

        this.getFeature = function(feature) {
            var f = feature.replace("||","_");
            var c = this.getCanvases();
            for (var i in c) {
                if (c[i].fields && c[i].fields[f]) {
                    return c[i].fields[f];
                }
            }
        }
        return this;
    };

function _init(o,that)
{
    if (o.map)
    {
        that.gmap = 1;
        that.tileSize = new google.maps.Size(256, 256);
    }

    that.modifier = {};
    that.hoverStyle =  {"fill":"rgba(255,0,0,0.8)","stroke":"rgba(255,0,0,0.8)"};
    that.mid = o.mid;
    that.timestamp = o.timestamp;
    that.lid = o.id;
    that.lmap = o.lmap;
    fields = '';
    that.map = o.map;
    if (o.tooltip) {
        that.tooltip = document.createElement("div");
        that.tooltip.style.position = "absolute";
        that.tooltip.style.padding = "1px";
        that.tooltip.style.border = "1px solid #CCC";
        that.tooltip.style.backgroundColor = "#FAF3A9";
        that.tooltip.style.zIndex = 1000;
        document.body.appendChild(that.tooltip);
        giscloud.Html5MapTooltip = that.tooltip;
    }
    _selectablePoly = 0;

    $(document).mousedown(function(evt){
        isMouseDown = true;
    });

    $(document).mouseup(function(evt){
        isMouseDown = false;
    });

    if (!o.modified)
        ajaxLoader(getTimestamp,
                   giscloud_url+"rest/1/maps/"+mid+"/get_modified_timestamp.json?"+Math.random(),
                   that);
    else
        getTimestamp(that,o);

}
function InsidePolygon(d,x,y)
{
    var counter = 0;
    var i;
    var xinters;
    var p1,p2;
    var N = d.length/2;
    p1x = d[0];
    p1y = d[1];
    for (i=1;i<=N;i++) {
        p2x = d[2*(i % N)];
        p2y = d[2*(i % N)+1];
        if (y > minn(p1y,p2y)) {
            if (y <= maxx(p1y,p2y)) {
                if (x <= maxx(p1x,p2x)) {
                    if (p1y != p2y) {
                        xinters = (y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x;
                        if (p1x == p2x || x <= xinters)
                            counter++;
                    }
                }
            }
        }
        p1x = p2x;
        p1y = p2y;
    }

    if (counter % 2 == 0)
        return 0;
    else
        return 1;
}

function TouchesPath(d,x,y,r)
{
    var i;
    var N = d.length;
    var p1x = d[0];
    var p1y = d[1];

    for (var i=2;i<N;i+=2)
    {
        var p2x = d[i];
        var p2y = d[i+1];

        var dirx = p2x - p1x;
        var diry = p2y - p1y;
        var diffx = x-p1x;
        var diffy = y-p1y;

        var t = 1.0*(diffx*dirx + diffy*diry * 1.0) / (dirx*dirx+ diry*diry*1.0);
        if (t < 0.0) t = 0.0;
        if (t > 1.0) t = 1.0;

        var closestx = p1x + t * dirx;
        var closesty = p1y + t * diry;
        var dx = x - closestx;
        var dy = y - closesty;
        if ((dx*dx+dy*dy) <= r * r) return 1;

        p1x = p2x;
        p1y = p2y;
    }
    return 0;
}

function checkForEvent(evt, force, delta)
{
    if (!force && isMouseDown) return;
    var c = evt.currentTile;

    var x,y;
    if (evt.offsetX >= 0) {
        x = evt.offsetX;
        y = evt.offsetY;
    } else {
        x = evt.layerX;
        y = evt.layerY;
    }

    x += c._offset;
    y += c._offset;

    return handleEvent(c,x,y,evt, delta);
}
var hoverModifier = {};

function handleEvent(c,x,y,evt,delta)
{
    if (!selectionEnabled || !c.obj.getSelectable() || c.data_type == "text") {
        return false;
    }

    var cc = c;
    var d = c.data;
    if (!d) {
        return false;
    }
    var r = 4;
    if (!delta)
        delta = 0;

    if (c.data_type == "point") r = delta;

    var xr = x+r;
    var xl = x-r;
    var yt = y-r;
    var yb = y+r;

    var minpoint_dist = 100000;
    var last_point_index = -1;
    var candidate = -1;
    var i;
    for (i = d.length-1; i >= 0; i--) {

        if (d[i].visible &&
            xr >= d[i].b.xmin && xl <= d[i].b.xmax && yb >= d[i].b.ymin && yt <= d[i].b.ymax &&
            (d[i].ispoint || (d[i].ispoly && !d[i].ispoint && InsidePolygon(d[i].p,x,y))
             || (!d[i].ispoly && !d[i].ispoint && TouchesPath(d[i].p,x,y,r)))) {

            if (d[i].ispoint) {
                var dist = pointDistance(d[i].x, d[i].y, x, y);
                if (dist < minpoint_dist) {
                    candidate = i;
                    minpoint_dist = dist;
                }
            } else {
                candidate = i;
            }
        }
    }

    if (candidate >= 0) {

        var elems = new Array();
        var firstElem = candidate;
        elems[0] = d[ candidate ];
        var selected = d[firstElem];
        if (flashnavigator.hasCanvas)  {
            if (hoverModifier.isset) {
                if (c.obj._hoveredElement === selected.c && c.obj === hoverModifier.orig_obj) {
                    return elems;
                }
                clearHover();
            }

            if (!c.obj.modifier[selected.c]) {
                var style_index = 0;
                if (selected.ispoint)
                    style_index = selected.i;
                else
                    style_index = selected.s;

                hoverModifier.isset = true;
                hoverModifier.color = c.styles[style_index].highlightcolor;
                hoverModifier.hover = true;

                hoverModifier.orig = c.obj.modifier[selected.c];
                hoverModifier.orig_obj = c.obj;
                hoverModifier.orig_key = selected.c;

                c.obj.modifier[selected.c] = hoverModifier;
                c.obj._hoveredElement = selected.c;
            } else {
                c.obj._hoverModifier = null;
            }
            drawAcrossTiles(c.obj, true);
        }
        if (c.fields && c.fields[elems[0].c])
            elems[0].attributes = c.fields[elems[0].c];
        return elems;
    }

    if (flashnavigator.hasCanvas && hoverModifier.isset && c.obj === hoverModifier.orig_obj) {
        clearHover();
    }

    return false;
}

function setupTile(el,data) {
    if (!el.dyndata) return;
    el.styles = el.obj.getFeatures();
    var g = data.geom;

    var c = 0;
    var s;
    var sindex;
    var l = null;
    var slen = 0;
    if (data.tile) {
        l = data.tile.l;
        slen = l.length-1;
    }
    var style = 0;
    var id;

    for (var i = 0, len = g.length; i < len; i++) {
        var c = g[i].c.split("_")[1];
        if (el.dyndata[c])
            g[i].dyn = el.dyndata[c];
    }

    for (var i = 0; i < slen; i+=5) {

        if (l[i] < 0) {
            id = -l[i];
            style = l[i+1];
            i++;
        } else {
            id = l[i];
        }
        var x = l[i+1];
        var y = l[i+2];
        var dx = l[i+3];
        var dy = l[i+4];

        var o = { p : [x,y,x+dx,y+dy],
                  id : id,
                  s : style,
                  c : el._layer.id+"_"+id,
                  px : true};
        if (el.dyndata[o.id] >= 0)
            o.dyn = el.dyndata[o.id];
        g.push(o);
    }

    data.geom.sort(function(a,b) {
        return b.dyn - a.dyn;
    });

    el.pixels2 = null;
    if (data.tile)
        data.tile.pixels = null;
}

function drawTile(el, data)
{
    if (loader_id === el._loader_id) {
        el._offset = 0;

        if (el._drawn) {
            ctx = el.getContext("2d");
            ctx.clearRect(0, 0, el.width, el.height);
        }
        el._drawn = true;
        el.draw = function() { };

        if (el._layer.options.dynamic && data[1]) {
            el.dyndata = data[1];
            data = data[0];
        }
        if (data.tile) {
            if (data.tile.type == "text") {
                drawText(el, data);
                data.geom = null;
            }
            if (data.tile.type == "point") {
                initStyles(el);
                parsePoint(el, data);
                el.draw();
                data.geom = null;
            }
        }
        if (data.geom) {
            setupTile(el,data);
            el.styles = data.styles;
            initStyles(el);

            if (!flashnavigator.hasCanvas) {
                el.img = L.DomUtil.create('img','',el);
                el.img_url = el.obj.url+el.zoom+'/'+el.coord.x+'/'+el.coord.y+'.png';
                el.img.src = el.img_url;
            }

            drawGeom(el, data);
        }
    }
    data.tile = null;
    data.fields = null;
    data = null;
}

function setupPaperOverlay(el) {
    el.overlay = L.DomUtil.create('div','',el);
    el.overlay.style.position = 'absolute';
    el.overlay.style.top = '0px';
    el.overlay.style.left = '0px';
    el.overlay.style.width = el.width;
    el.overlay.style.height = el.height;
}

function redraw(that) {
    var ctx,w,o;
    var c = that.getCanvases();
    var should_send_req = false;
    var current_filter_attributes = null;
    if (that.feature_filter && that.feature_filter.attributes)
        current_filter_attributes = that.feature_filter.attributes;
    for (var i in c) {
        o = c[i];
        if (current_filter_attributes != o.feature_filter_attributes) {
            that._loadTile(o,o.coord,o.zoom,that);
            should_send_req = true;
            continue;
        }

        ctx = o.getContext("2d");
        ctx.clearRect(0, 0, o.width, o.height);

        if (o.data_type == "point") {
            if (!o._drawn) continue;
            w = o.width;
            o.width = 1;
            o.width = w;
            o._original = null;
            o.draw();
        } else {
            drawGeomInternal(o);
        }
    }
    if (should_send_req)
        giscloud.Html5SendRequests();
}

function drawAcrossTiles(that, toClear)
{
    var i;
    var c = that.getCanvases();

    for (i in c) {
        toClear && clearTile(c[i]);
        drawTileUsingModifier(c[i], that);
    }
}

function clearTile(tile) {
    if (tile._modified && tile._original) {
        ctx = tile.getContext("2d");

        rectCrop(tile._invalidateRect, 0, ctx.canvas.width);
        var w = tile._invalidateRect.xmax - tile._invalidateRect.xmin;
        var h = tile._invalidateRect.ymax - tile._invalidateRect.ymin;

        if (w > 0 && h > 0) {

            ctx.clearRect(tile._invalidateRect.xmin, tile._invalidateRect.ymin, w, h);

            ctx.drawImage(tile._original,
                          tile._invalidateRect.xmin, tile._invalidateRect.ymin, w, h,
                          tile._invalidateRect.xmin, tile._invalidateRect.ymin, w, h
                         );
        }
        tile._invalidateRect = null;
        tile._modified = false;
    }
    if (tile._modified && tile.img && tile.data_type != "point") {
        if (tile.img.src != tile.img_url)
            tile.img.src = tile.img_url;
        tile._invalidateRect = null;
        tile._modified = false;
    }
}

function drawTileUsingModifier(tile, that) {
    if (!tile.getContext) {
        return drawTileUsingModifierNonCanvas(tile, that);;
    }

    var ctx,id,j,lst, use_custom_renderer;

    tile._path = null;
    ctx = null;
    use_custom_renderer = giscloud.mapFeatureRenderer != null;

    for (id in that.modifier) {
        if (!that.modifier[id] || !tile.lista || !tile.lista[id] || tile.lista[id].length == 0) continue;

        if (!tile._original) {
            tile._original = document.createElement("canvas");
            tile._original.width = tile.width;
            tile._original.height = tile.height;
            tile._original.getContext("2d").drawImage(tile, 0, 0);
        }

        if (!ctx)
            ctx = tile.getContext("2d");

        lst =  tile.lista[id];

        for (j in lst) {
            var d = tile.data[lst[j]];
            if (!d || !d.b) continue;
            tile._modified = true;
            var offset = 0;
            if (d.ispoint)
                drawImage(that, ctx, d, null, that.modifier[id]);
            else {
                finishPoly(ctx);
                var s = overrideStyle(tile.styles[d.s], that.modifier[id]);
                offset = 0;
                if (use_custom_renderer) {
                    var w = {};
                    for (var k in s)
                        w[k] = s[k];
                    s = w;
                    giscloud.mapFeatureRendererHighlight(d,s);
                }
                s.linewidth && (offset = s.linewidth);
                s.width && (offset += s.width);
                drawCanvasPolygon(ctx, d.p, s, d.s, id, null, 1, use_custom_renderer);
            }

            if (!tile._invalidateRect) {
                tile._invalidateRect = {};
                rectAssign(tile._invalidateRect, d.b, offset);
            } else {
                rectUnion(tile._invalidateRect, d.b, offset);
            }
        }
    }
    if (ctx) {
        finishPoly(ctx);
    }
}

function clearHover() {

    var o_obj = hoverModifier.orig_obj;
    if (o_obj.modifier[ hoverModifier.orig_key ] && o_obj.modifier[ hoverModifier.orig_key ].hover) {
        if (hoverModifier.orig) {
            o_obj.modifier[ hoverModifier.orig_key ] = hoverModifier.orig;
        } else {
            o_obj.modifier[ hoverModifier.orig_key ] = null;
        }
        drawAcrossTiles(o_obj, true);
    }
    hoverModifier.isset = false;
}

function drawTileUsingModifierNonCanvas(tile, that) {
    var use_custom_renderer = giscloud.mapFeatureRenderer != null;
    var mod_ids_used = {};
    var mod_ids_grouped = {};
    var override_style = "";
    for (id in that.modifier) {
        if (!that.modifier[id] || !tile.lista || !tile.lista[id] || tile.lista[id].length == 0) continue;

        lst =  tile.lista[id];

        for (j in lst) {
            var d = tile.data[lst[j]];
            if (!d || !d.b) continue;
            tile._modified = true;
            var offset = 0;
            if (d.ispoint)
                drawImageAsDOM(tile, d, null, that.modifier[id]);
            else {
                var s = overrideStyle(tile.styles[d.s], that.modifier[id]);
                offset = 0;
                if (use_custom_renderer) {
                    var w = {};
                    for (var k in s)
                        w[k] = s[k];
                    s = w;
                    giscloud.mapFeatureRendererHighlight(d,s);
                }
                s.linewidth && (offset = s.linewidth);
                s.width && (offset += s.width);
                var i = id.split("_")[1];
                if (!mod_ids_used[i]) {
                    mod_ids_used[i] = 1;
                    override_style = "000000,0,";
                    if (s.strokecolor)
                        override_style += s.strokecolor.substr(1)+","+s.linewidth+",";
                    else
                        override_style += "000000,0,"
                    if (s.fillcolor)
                        override_style += s.fillcolor.substr(1);
                    else
                        override_style += "000000";

                    if (!mod_ids_grouped[override_style])
                        mod_ids_grouped[override_style] = [];
                    mod_ids_grouped[override_style].push(i);
                }
            }
        }
    }
    var s = "";
    for (var i in mod_ids_grouped)
    {
        s += i + ","+mod_ids_grouped[i].join(",")+";";
    }
    if (s) {
        tile.img.src = tile.img_url + "?override_style=" + s;
    }
}
function overrideStyle(orig, o)
{
    var r = {};

    if (o.color) {
        var color;
        if (o.color === "selectcolor") {
            color = orig.selectcolor;
        } else {
            color = o.color;
        }
        r.color = color;
        if (orig.strokecolor) {
            if (orig.type != "polygon")
                r.strokecolor = color;
            else
                r.strokecolor = orig.strokecolor;
        }
        if (orig.fillcolor)
            r.fillcolor = color;
    } else {
        if (orig.strokecolor && o.strokecolor) {
            r.strokecolor = o.strokecolor;
        } else {
            r.strokecolor = orig.strokecolor;
        }

        if (orig.fillcolor && o.fillcolor) {
            r.fillcolor = o.fillcolor;
        } else {
            r.fillcolor = orig.fillcolor;
        }
        r.innerlinewidth = orig.innerlinewidth;
    }
    r.linewidth = orig.linewidth;
    r.type = orig.type;
    r.visible = orig.visible;
    return r;
}

function adjustLegacyStyles(styles) {
    for(var i=0,len=styles.length; i < len; i++) {

        if (styles[i].lw*1 > 0)
            styles[i].linewidth = styles[i].lw*1;

        if (styles[i].iw*1 > 0)
            styles[i].innerlinewidth = styles[i].iw*1;

        styles[i].fillcolor = styles[i].f;
        styles[i].strokecolor = styles[i].s;

        if (styles[i].i)
            styles[i].innerstrokecolor = styles[i].i;

        if (styles[i].f) {
            styles[i].type = "polygon";
        }
    }
}

function initStyles(el) {
    if (el.styles)
        adjustLegacyStyles(el.styles);
    else
        el.styles = el.obj.getFeatures();

    for(var i=0,len=el.styles.length; i < len; i++) {
        if (el.styles[i].type == "polygon") {
            if (!el.styles[i].linewidth) {
                el.styles[i].linewidth = 1;
            }
            if (el.styles[i].fillcolor) {
                el.styles[i].predominantColor = el.styles[i].fillcolor;
            } else {
                el.styles[i].predominantColor = el.styles[i].strokecolor;
            }
        } else {
            if (el.styles[i].innerstrokecolor && el.styles[i].innerlinewidth > 0) {
                el.has_inner_line = true;
            }
        }

        if (!el.styles[i].predominantColor) {
            if (el.styles[i].strokecolor) {
                el.styles[i].predominantColor = el.styles[i].strokecolor;
            } else if (el.styles[i].color) {
                el.styles[i].predominantColor = el.styles[i].color;
            } else {
                el.styles[i].predominantColor = "#000000";
            }
        }
        var c = common.getHighlightAndSelectColors(el.styles[i].predominantColor);
        el.styles[i].highlightcolor = c[0];
        el.styles[i].selectcolor = c[1];
    }
}

function drawGeom(el,data) {

    var geom = data.geom;
    if (!el.lista) {
        el.lista = [];
    }
    el.data = geom;
    el.data_type = "geom";
    el.fields = data.fields;

    var that = el.obj;
    var len = geom.length;
    var sindex = -1;
    var s = null;
    var object,g;
    var i,j,glen, b;

    var offset = 0;
    var precision = 0;
    if (el._layer.options.offset)
        offset = el._layer.options.offset;
    if (el._layer.options.precision)
        precision = el._layer.options.precision;

    if (data.tile && data.tile.pixels) {
        el.pixels = data.tile.pixels;
        data.tile.pixels = null;
    }
    var has_fields = 0;
    if (data.fields) {
        has_fields = 1;
    }


    for (i = len-1; i >= 0; i--) {
        object = geom[i];

        if (object.s >= 0) {
            sindex = object.s;
        } else {
            object.s = sindex;
        }
        b = {};

        if (!el.lista[object.c]) el.lista[object.c] = [];
        el.lista[object.c].push(i);

        if (sindex != -1) {
            s = el.styles[sindex];
        }

        if (s.type == "polygon") {
            object.ispoly = 1;
        }

        if (!object.initialized) {
            var g = object.p;
            glen = g.length;
            if (precision > 0) {
                for (j = 0; j < glen; j++) {
                    g[j] /= precision;
                }
            }
            if (offset > 0)
                doOffset(object,offset);

            g = object.p;
            b = {};
            b.xmin = b.xmax = g[0];
            b.ymin = b.ymax = g[1];

            for (j = 2; j < glen; j+=2)
            {
                if (g[j] < b.xmin) b.xmin = g[j];
                else if (g[j] > b.xmax) b.xmax = g[j];

                if (g[j+1] < b.ymin) b.ymin = g[j+1];
                else if (g[j+1] > b.ymax) b.ymax = g[j+1];
            }

            b.xmin = Math.floor(b.xmin);
            b.ymin = Math.floor(b.ymin);
            b.xmax = Math.ceil(b.xmax);
            b.ymax = Math.ceil(b.ymax);
            object.initialized = true;
            object.b = b;
            object.visible = true;

            if (has_fields) {
                object.data = el.fields[object.c];
            }
        }
    }
    el.data = geom;
    geom = null;
    data.geom = null;
    data.style = null;

    drawGeomInternal(el);
}

function drawGeomInternal(el) {
    var geom, ctx,len, user_custom_renderer;
    geom = el.data;
    el._original = null;
    if (!geom) return;

    var filter = null;
    if (el.obj.feature_filter && el.obj.feature_filter.filter) {
        filter = el.obj.feature_filter.filter;
    }
    if (el.getContext) {
        ctx = el.getContext("2d");
        len = geom.length;

        if (el.pixels) {
            drawPixels(ctx,el);
        }
        use_custom_renderer = giscloud.mapFeatureRenderer != null;

        for (i = len-1; i >= 0; i--) {
            object = geom[i];
            sindex = object.s;
            if (sindex != -1) {
                s = el.styles[sindex];
            }
            if (use_custom_renderer) {
                var w = {};
                for (var k in s)
                    w[k] = s[k];
                s = w;
                giscloud.mapFeatureRenderer(object,s);
            }
            object.curs = s;
            if (!filter || (object.data && filter(object.data))) {
                object.visible = true;
                drawCanvasPolygon(ctx, object.p, object.curs, object.s, el.lastP, null, 1, use_custom_renderer);
            } else {
                object.visible = false;
            }
        }
        finishPoly(ctx);

        if (el.has_inner_line) {
            for (i = len-1; i >= 0; i--) {
                object = geom[i];
                drawCanvasPolygon(ctx, object.p, object.curs, object.s, el.lastP, null, 2, use_custom_renderer);
            }
            finishPoly2(ctx);
        }
    }

    if (el.obj.modifier)
        drawTileUsingModifier(el, el.obj);
}

function drawCanvasPolygon(ctx,d,c,cindex,id, clear, mode, forcerender)
{
    if (c.visible === false) return;
    var el, len, j;
    el = ctx.canvas;
    if (el.last_c && el.last_c_index != cindex || forcerender)
    {
        if (mode != 2)
            finishPoly(ctx);
        else
            finishPoly2(ctx);
    }
    if (!el._path)
    {
        if (clear)
        {
            ctx.globalCompositeOperation="destination-out";
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        el._path = 1;
        el.last_c = c;
        el.last_c_index = cindex;
    }
    len = d.length;
    ctx.moveTo(d[0],d[1]);
    for (j = 2; j < len; j+=2) {
        ctx.lineTo(d[j],d[j+1]);
    }

    if (clear) {
        finishPoly(ctx);
        ctx.globalCompositeOperation="source-over";
    }
    el.lastP = id;
}

function finishPoly(ctx)
{
    var el = ctx.canvas;
    if (!el.last_c) return;

    var c = el.last_c;

    if (c.icon && c.icon_image) {
        if (!c.pattern)
            c.pattern = ctx.createPattern(c.icon_image,'repeat');
        ctx.fillStyle = c.pattern;
        ctx.fill();
    } else if (c.fillcolor) {
        ctx.fillStyle = c.fillcolor;
        ctx.fill();
    }

    if (c.strokecolor && c.linewidth > 0) {
        ctx.lineWidth = c.linewidth;
        ctx.strokeStyle = c.strokecolor;
        ctx.stroke();
    }

    el.last_c = null;
    el.last_c_index = null;
    el._path = 0;
}

function finishPoly2(ctx)
{
    var el = ctx.canvas;
    if (!el.last_c) return;

    var c = el.last_c;

    if (c.innerstrokecolor)
    {
        ctx.strokeStyle = c.innerstrokecolor;
        ctx.lineWidth = c.innerlinewidth;
        ctx.stroke();
    }
    el.last_c = null;
    el.last_c_index = null;
    el._path = 0;
}

function parsePoint(el,data) {

    var offset = 10;
    var i,d;
    var has_fields = 0;

    var f;
    i = 0;

    while (1) {
        f = el.obj.getFeatureClass(i++);
        if (!f) break;
        if (f.clustering > offset)
            offset = f.clustering;
    };

    expandCanvas(el, offset);

    el.data_type = "point";
    el.data = data.tile.data;
    el.fields = data.fields;
    el.lista = [];
    if (data.fields) {
        has_fields = 1;
    }
    for (i = 0; i < el.data.length; i++) {
        d = el.data[i];
        d.x = offset + Math.round(((d.x-bounds.xmin)/bounds.max*Math.pow(2,el.zoom)-el.coord.x)*256);
        d.y = offset + Math.round(((bounds.ymax-d.y)/bounds.max*Math.pow(2,el.zoom)-el.coord.y)*256);
        d.id = d.id.replace("||","_");
        d.c = d.id;
        d.ispoint = true;
        if (has_fields) {
            d.data = data.fields[d.id];
        }
        if (!el.lista[d.c]) el.lista[d.c] = [];
        el.lista[d.c].push(i);
    }
    if (flashnavigator.hasCanvas)
        el.draw = drawPoint;
    else
        el.draw = drawPointDOM;
}

function drawPoint(use_modifier) {

    var ctx = this.getContext("2d");
    var f = null;
    if (this.obj.feature_filter && this.obj.feature_filter.filter)
        f = this.obj.feature_filter.filter;

    for (var i = 0; i < this.data.length; i++) {
        drawImage(this.obj, ctx, this.data[i], f);
    }

    if (this.obj.modifier)
        drawTileUsingModifier(this, this.obj);
}

function getImageOverlay(imgs, modifier, d, layer) {
    var c;
    var key = modifier.color;
    if (d.cl > 0)
        key += "_cluster";

    if (imgs.icon_image_overlay && imgs.icon_image_overlay[key]) {
        c = imgs.icon_image_overlay[key]
    }
    else {
        c = document.createElement("canvas");
        c.width = d.b.xmax-d.b.xmin;
        c.height = d.b.ymax-d.b.ymin;

        var ic_ctx = c.getContext("2d");

        drawPointCanvas(ic_ctx, d, layer, imgs, 0, 0, true);

        ic_ctx.globalAlpha = 0.7;
        var style = overrideStyle(imgs, modifier);
        ic_ctx.fillStyle = style.color;
        ic_ctx.beginPath();
        ic_ctx.rect(0,0,c.width,c.height);
        ic_ctx.globalCompositeOperation = "source-in";
        ic_ctx.fill();

        if (!imgs.icon_image_overlay) imgs.icon_image_overlay = [];
        imgs.icon_image_overlay[key] = c;
    }
    return c;
}

function drawImage(obj, ctx, d, f, modifier) {

    if (!f) {
        if (obj.feature_filter && obj.feature_filter.filter)
            f = obj.feature_filter.filter;
    }
    var imgs = obj.getFeatureClass(d.i);

    if (imgs.iready && (!f || (d.data && f(d.data)))) {
        img = imgs.icon_image;
        d.b = { xmin: Math.floor(d.x-img.width/2),
                ymin: Math.floor(d.y-img.height/2),
                xmax: d.x+img.width/2,
                ymax: d.y+img.height/2 };
        drawPointCanvas(ctx,d,obj._layer,imgs);
        if (modifier) {
            var c = getImageOverlay(imgs, modifier, d, obj._layer);
            ctx.drawImage( c, d.b.xmin, d.b.ymin, d.b.xmax-d.b.xmin, d.b.ymax-d.b.ymin);
        }
        d.visible = true;
    }
    else
        d.visible = false;
}

function drawPointCanvas(ctx, d, layer, object, x, y, overlay) {
    if (!d.b) return;

    if (x == undefined) x = d.b.xmin;
    if (y == undefined) y = d.b.ymin;

    if (!overlay || !d.cl || !object.clustering)
        ctx.drawImage(object.icon_image, x, y);

    if (d.cl && object.clustering > 0) {

        var cluster = object.clustering;
        var text = d.cl+1;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var cx = x+(d.b.ymax-d.b.ymin*1.0)/2.0;
        var cy = y+(d.b.ymax-d.b.ymin*1.0)/2.0;

        ctx.beginPath();
        ctx.arc(cx, cy, cluster-2, 0, 2 * Math.PI, false);
        ctx.fillStyle = object.predominantColor;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        if (!overlay) {
            ctx.lineWidth = 1;
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#fff";
            ctx.strokeText(text, cx, cy);
            ctx.fillText(text, cx, cy);

            if (img.width/2 < cluster) {
                d.b.xmin = Math.floor(d.x-cluster);
                d.b.xmax = d.x+cluster;
            }

            if (img.height/2 < cluster) {
                d.b.ymin = Math.floor(d.y-cluster);
                d.b.ymax = d.y+cluster;
            }

        }
        ctx.restore();
    }
}

function drawPointDOM(use_modifier) {
    var f = null;
    if (this.obj.feature_filter && this.obj.feature_filter.filter)
        f = this.obj.feature_filter.filter;

    for (var i = 0; i < this.data.length; i++) {
        drawImageAsDOM(this, this.data[i], f);
    }
}

function drawImageAsDOM(el, d, f, modifier) {
    // for now icon modifiers are disabled
    if (modifier) return;

    var obj = el.obj;
    if (!f) {
        if (obj.feature_filter && obj.feature_filter.filter)
            f = obj.feature_filter.filter;
    }
    var imgs = obj.getFeatureClass(d.i);

    if (imgs.iready && (!f || (d.data && f(d.data)))) {
        img = imgs.icon_image;
        d.b = { xmin: Math.floor(d.x-img.width/2),
                ymin: Math.floor(d.y-img.height/2),
                xmax: d.x+img.width/2,
                ymax: d.y+img.height/2 };
        drawPointAsDOM(el, d, obj._layer, imgs);
        if (modifier) {
            //var c = getImageOverlay(imgs, modifier, d, obj._layer);
            //ctx.drawImage( c, d.b.xmin, d.b.ymin, d.b.xmax-d.b.xmin, d.b.ymax-d.b.ymin);
        }
        d.visible = true;
    }
    else
        d.visible = false;
}

function drawPointAsDOM(el, d, layer, object, x, y, overlay) {
    if (!d.b) return;

    if (x == undefined) x = d.b.xmin;
    if (y == undefined) y = d.b.ymin;

    if ((!overlay || !d.cl || !object.clustering) && !d.cl) {
        var cont = L.DomUtil.create('img','',el);
        cont.style.position = 'absolute';
        cont.style.left = d.b.xmin +"px";
        cont.style.top = d.b.ymin +"px";
        cont.src = object.icon;
    }

    if (d.cl && object.clustering > 0) {
        if (!el.paper) {
            setupPaperOverlay(el);
            el.paper = Raphael(el.overlay, el.width, el.height);
        }

        var cluster = object.clustering;
        var text = d.cl+1;
        var cx = x+(d.b.ymax-d.b.ymin*1.0)/2.0;
        var cy = y+(d.b.ymax-d.b.ymin*1.0)/2.0;
        el.paper.circle(cx, cy, cluster-2)
            .attr({
                fill:object.predominantColor,
                "stroke-width":2,
                stroke:"#003300"
            });
        if (!overlay) {
            el.paper.text(cx,cy,text)
                .attr({"stroke-width":1,stroke:"#fff"});

            if (img.width/2 < cluster) {
                d.b.xmin = Math.floor(d.x-cluster);
                d.b.xmax = d.x+cluster;
            }

            if (img.height/2 < cluster) {
                d.b.ymin = Math.floor(d.y-cluster);
                d.b.ymax = d.y+cluster;
            }

        }
    }
}

function drawText(el, data)
{
    var d = 100;
    expandCanvas(el, d);

    el.data_type = "text";

    var data = data.tile.data;
    var dlen = data.length;
    if (dlen < 1) return;

    if (!el.getContext) {
        drawTextDOM(el, data)
        return;
    }

    var f = el.obj.getFeatureClass(data[0].i);
    var ctx = el.getContext("2d");

    if (f.outline)
        ctx.strokeStyle = "#" + f.outline.substr(2);
    else
        ctx.strokeStyle = "#fff";

    if (f.color)
        ctx.fillStyle = "#" + f.color.substr(2);
    else
        ctx.fillStyle = "#000";

    var dx = 0;
    var dy = 0;

    f.dx && (dx = f.dx);
    f.dy && (dy = f.dy);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var al = f.anchor;
    if (al)
    {
        if (al == "TL") { ctx.textBaseline = "top"; ctx.textAlign = "left"; }
        else
            if (al == "T") { ctx.textBaseline = "top"; }
        else
            if (al == "TR") { ctx.textBaseline = "top"; ctx.textAlign = "right";}
        else
            if (al == "R") { ctx.textAlign = "right"; }
        else
            if (al == "BR") { ctx.textBaseline = "bottom"; ctx.textAlign = "right"; }
        else
            if (al == "B") { ctx.textBaseline = "bottom"; }
        else
            if (al == "BL") { ctx.textBaseline = "bottom"; ctx.textAlign = "left"; }
        else
            if (al == "L") { ctx.textAlign = "left"; }
    }

    ctx.lineWidth = 3;
    ctx.font = data[0].fs + "px arial";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var i=0; i < dlen; i++)
    {
        var text = data[i].text;
        var p = data[i].p;
        var plen = p.length;
        for (var k=0; k < plen; k++)
        {
            ctx.save();
            ctx.translate(p[k][0] + d + dx,p[k][1] + d + dy);
            ctx.rotate(p[k][2]/180*Math.PI);
            ctx.strokeText(text, 0, 0);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    }
}

function drawTextDOM(el, data)
{
    var d = el._offset;
    var dx = 0;
    var dy = 0;

    var f = el.obj.getFeatureClass(data[0].i);

    var dlen = data.length;

    var fill;

    if (f.color)
        fill = "#" + f.color.substr(2);
    else
        fill = "#000";

    var vertical_offset = Math.ceil(data[0].fs/2);

    var al = f.anchor;
    var halign = -1;
    if (al)
    {
        if (al == "TL") { dy += vertical_offset; halign = 0; }
        else
            if (al == "T") { dy += vertical_offset; }
        else
            if (al == "TR") { dy += vertical_offset; halign = 2; }
        else
            if (al == "R") { halign = 2; }
        else
            if (al == "BR") { dy -= vertical_offset; halign = 2; }
        else
            if (al == "B") { dy -= vertical_offset; }
        else
            if (al == "BL") { dy -= vertical_offset; halign = 0; }
        else
            if (al == "L") { halign = 0; }
    }

    var offsetX = 0;

    for (var i=0; i < dlen; i++)
    {
        var text = data[i].text;
        var p = data[i].p;
        var plen = p.length;
        for (var k=0; k < plen; k++)
        {
            var o = L.DomUtil.create('span','',el);

            o.style.fontWeight = "bold";
            o.style.color = fill;
            o.style.fontSize = data[0].fs+"px";
            o.style.fontFamily = "Arial"

            o.innerText = text;

            offsetX = halign*o.offsetWidth/2;

            o.style.position = 'absolute';
            o.style.left = (p[k][0] + d + dx + offsetX)+"px";
            o.style.top = (p[k][1] + d + dy)+"px";
        }
    }
}

function drawPixels(ctx,data) {
    var imgd = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    var pix = imgd.data;
    var px = data.pixels;
    var slen = px.length;
    var c = 0;
    var r,g,b,k,i;
    r = g = b = 0;
    for (i = 1; i < slen; i++) {
        if (px[i] < 0) {
            k = px[i];
            if (px[i + 1] == 0) {
                i++;
                r = px[++i];
                g = px[++i];
                b = px[++i];
            }
            while (k++) {
                pix[ c*4  ] = r;
                pix[ c*4 + 1 ] = g;
                pix[ c*4 + 2  ] = b;
                pix[ c*4 + 3 ] = 255;
                c++;
            }
        } else {
            c += px[i];
        }
    }
    ctx.putImageData(imgd, 0,0);
}

function expandCanvas(el,d) {
    el.style.marginLeft = "-"+d+"px";
    el.style.marginTop = "-"+d+"px";
    el.width = el._layer.options.tileSize+d*2;
    el.height = el._layer.options.tileSize+d*2;
    if (!el.getContext) {
        el.style.width = el.width+"px";
        el.style.height = el.height+"px";
    }
    el._offset = d;
}

function rectUnion(a, b, offset) {
    if (b.xmin - offset < a.xmin) a.xmin = b.xmin - offset;
    if (b.ymin - offset < a.ymin) a.ymin = b.ymin - offset;
    if (b.xmax + offset > a.xmax) a.xmax = b.xmax + offset;
    if (b.ymax + offset > a.ymax) a.ymax = b.ymax + offset;
}

function rectCrop(a, min, max) {
    var i;
    for (i in a) {
        if (a[i] < min)
            a[i] = min;
        else if (a[i] > max)
            a[i] = max;
    }
}

function rectAssign(a, b, offset) {
    a.xmin = b.xmin - offset;
    a.ymin = b.ymin - offset;
    a.xmax = b.xmax + offset;
    a.ymax = b.ymax + offset;
}

function pointDistance(x1,y1,x2,y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt( dx*dx + dy*dy );
}


function vector(x, y) {
    return { x: x, y: y };
}

function vectorAdd(V1, V2) {
    return vector(
        V1.x + V2.x,
        V1.y + V2.y
    );
}

function vectorSub(V1, V2) {
    return vector(
        V1.x - V2.x,
        V1.y - V2.y
    );
}

function scalarMul(s, V) {
    return vector(
        s * V.x,
        s * V.y
    );
}

function length(V) {
    return Math.sqrt(V.x * V.x + V.y * V.y);
}

function normalize(V) {
    return scalarMul(1 / length(V), V);
}

function offset(d, P1, P2) {
    var O, OP1, OP2;

    O = scalarMul(d, normalize(vector(P1.y - P2.y, P2.x - P1.x)));

    OP1 = vectorAdd(O, P1);
    OP2 = vectorAdd(O, P2);

    return [OP1, OP2];
}

function intersectLines(p1,p2,p3,p4,dist) {
    var dx1 = p2.x-p1.x;
    var dx2 = p4.x-p3.x;
    var dy1 = p2.y-p1.y;
    var dy2 = p4.y-p3.y;
    var den = dx1*dy2-dy1*dx2;
    if (den < 0.0001) {
        return p3;
    }
    //var ua = (dx2*(p1.y-p3.y) - dy2*(p1.x-p3.x))/den;
    var ub = (dx1*(p1.y-p3.y) - dy1*(p1.x-p3.x))/den;
    if (ub*Math.sqrt(dx2*dx2 + dy2*dy2) > dist) {
        return p3;
    }
    else {
        return { x : p3.x + ub*dx2,
                 y : p3.y + ub*dy2 };
    }
}

function doOffset(element, dist) {
    if (!element.px) {
        var a = element.p;
        var len = a.length;
        var v0 = vector(a[0],a[1]);
        var p1;
        var p2 = null;
        for (var i=2; i < len; i+= 2) {
            var v1 = v0;
            var v2 = vector(a[i],a[i+1]);
            v0 = v2;
            var o = offset(dist/10.0,v1,v2);

            if (p2) {
                // find intersection point between prev and cur line
                p1 = intersectLines(p1,p2,o[0],o[1],dist);
            } else {
                p1 = o[0];
            }

            p2 = o[1];

            a[i-2] = Math.round(p1.x*10)/10.0;
            a[i-1] = Math.round(p1.y*10)/10.0;

            p1 = o[0];
        }
        a[len-2] = Math.round(p2.x*10)/10.0;
        a[len-1] = Math.round(p2.y*10)/10.0;

    }

}

function maxx(a,b)
{
    if (a > b) return a;
    return b;
}

function minn(a,b)
{
    if (a < b) return a;
    return b;
}

function getTimestamp(el,d)
{
    if (el.lid)
    {
        if (d.dynamic) {
            el.url_prefix = giscloud_tile_url+"d/"+d.modified+"/"+el.mid+"/"+el.lid;
            var t = new Date().getTime();
            el.url = giscloud_tile_url+"d/"+d.modified+"/"+el.mid+"/"+el.lid+"/dyn,"+t+"/";
            el.url3 = giscloud_tile_url+"d/";
            el.t = t;
            el.modified = d.modified;
            el.dynamic = true;
        } else {
            el.url = giscloud_tile_url+"t/"+d.modified+"/"+el.mid+"/"+el.lid+"/";
            el.url2 = giscloud_tile_url+"t/";
            el.modified =  d.modified;
        }
    }
    else
    {
        if (fields)
            el.url = giscloud_tile_url+"vt3/"+d.modified+"/"+el.mid+"/"+fields+"/";
        else
            el.url = giscloud_tile_url+"vt2/"+d.modified+"/"+el.mid+"/";
    }

    var t;
    while (t = tile_buffer.pop()) {
        if (fields)
            ajaxLoader(drawGeomCanvas,el.url+t.uri+".json?fields="+fields,t.tile);
        else
            ajaxLoader(drawGeomCanvas,el.url+t.uri+".json",t.tile);
    }
    if (el.map)
        el.map.getDiv().firstChild.firstChild.firstChild.firstChild.style.zIndex = 150;
}

function jsonCanvas(ownerDocument,obj)
{
    var d = ownerDocument.createElement("div");

    var c = ownerDocument.createElement("canvas");
    d.appendChild(c);
    d.c = c;
    c.od = ownerDocument;
    c.setAttribute("width",256);
    c.setAttribute("height",256);
    c.setAttribute("style","position:relative");
    c.style.position = "relative";
    c.obj = obj;

    if (window.G_vmlCanvasManager) G_vmlCanvasManager.initElement(c);

    google.maps.event.addDomListener(c, 'mousemove', function(evt) {
        checkForEvent(evt);
    });
    return d;
}

function intersects(a,b)
{
    if (a.xmax <  b.xmin || a.xmin >  b.xmax ||
        a.ymax <  b.ymin || a.ymin >  b.ymax ) {
        return false;
    }
    return true;
}

function intersects_array_element(a,b) {
    for (var i = 0; i < a.length; b++) {
        if (intersects(a[i], b)) {
            return true;
        }
    }
    return false;
}

})(window, giscloud.exposeJQuery(), giscloud.common());

(function (window, $, common, undefined) {

    giscloud.proxy = {

        call: function (proxy_url, options, callback) {
            var url = "proxy",
            def = new $.Deferred();

            options = options || {};
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else {
                callback = callback || options.callback;
            }
            options.url = proxy_url;

            common.rest.get(url, options).done(function (response) {
                try {
                    // callback
                    if (typeof callback == "function") {
                        callback(response);
                    }
                    // resolve the deferred
                    def.resolve(users);
                } catch (err) {
                    def.reject();
                }
            }).fail(function () {
                def.reject();
            });
            return def.promise();
        }
    };

}(window, giscloud.exposeJQuery(), window.giscloud.common()));
delete giscloud.common;