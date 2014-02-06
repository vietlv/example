/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

var makeReplacements;

    mdc.lang = {

        defaultLanguage: "en",

        language: null,

        dictionaries: {},

        getString: function (name, vals) {
            var l = this.language || this.defaultLanguage;

            if (this.dictionaries[l] && this.dictionaries[l][name]) {
                if ($.isArray(vals)) {
                    return makeReplacements(this.dictionaries[l][name], vals);
                } else {
                    return this.dictionaries[l][name];
                }
            } else {
                return name;
            }
        },

        pick: function (obj) {
            var lang = this.language || this.defaultLanguage;
            if (typeof obj === "string") {
                return obj;
            } else {
                return obj && (obj[lang] || obj["default"] || null);
            }
        }
    };

    window._ = $.proxy(mdc.lang.getString, mdc.lang);

    window.__ = $.proxy(mdc.lang.pick, mdc.lang);

    makeReplacements = function (str, vals) {
        var rx = /\{(\d+)\}/, s = str, m, v;
        while (rx.test(s)) {
            m = rx.exec(s);
            v = vals[m[1]];
            if (v) {
                s = s.replace(rx, v);
            } else {
                break;
            }
        }

        return s;
    };

}());
