var $ = giscloud.exposeJQuery();

function deg2dms(deg) {
    var d = Math.floor(deg),
        m = Math.floor((deg - d) * 60),
        s = Math.round((deg - d - (m / 60)) * 60 * 60 * 100) / 100;
    return "" + d + "&deg;" + m + "'" + s + "\"";
}

function hoursAndMins(timestamp) {
    var d = new Date(timestamp),
        h = d.getHours(),
        m = d.getMinutes();

    h = h < 10 ? "0" + h : h.toString();
    m = m < 10 ? "0" + m : m.toString();

    return h + ":" + m;
}

function isInt(str) {
    return !!str.match(/[0-9]+/);
}

function smartTime(timestamp) {
    var dt = new Date(timestamp),
        delta = (new Date()) - dt,
        secsAgo = Math.round(delta / 1000),
        minsAgo = Math.round(delta / 1000 / 60),
        hoursAgo = Math.round(delta / 1000 / 60 / 60),
        daysAgo = Math.round(delta / 1000 / 60 / 60 / 24);

    if (secsAgo <= 55) {
        return _("seconds ago", [secsAgo]);
    } else if (minsAgo <= 45) {
        return _("minutes ago", [minsAgo]);
    } else if (hoursAgo <= 20) {
        return _("hours ago", [hoursAgo]);
    } else if (daysAgo === 1) {
        return _("yesterday");
    } else if (daysAgo <= 7) {
        return _("days ago", [daysAgo]);
    } else {
        return dt.toLocaleDateString();
    }
}

function formatTimestamp(timestamp) {
    var date, timezoneOffset, timeString;

    if (isNaN(timestamp)) {
        return null;
    }

    date = new Date(timestamp);
    timezoneOffset = date.getTimezoneOffset() / -60;
    timeString = date.toLocaleTimeString();

    return date.toLocaleDateString() + "<br/>" +
           timeString.substring(0, timeString.lastIndexOf(":")) +
           " GMT" + (timezoneOffset > 0 ? "+" : "") + timezoneOffset;
}

function hourInMonthStamp() {
    var now = new Date(),
        hourInMonth = (now.getUTCDate() - 1) * 24 + now.getUTCHours(),
        hrString = hourInMonth.toString();

    if (hrString.length === 1) {
        return "00" + hrString;
    } else if (hrString.length === 2) {
        return "0" + hrString;
    }

    return hrString;
}

function randomInt(digits) {
    var min = Math.pow(10, digits - 1),
        max = Math.pow(10, digits) - 1 - min;

    return Math.round(min + Math.random() * max);
}


function uniqueId(options) { // unique enough for now
    var uniqueIdDefaults = { length: 10, useLocation: true, alpha: "abcdef" },
        a, s, s1, s2, s3, lat, lon, length;

    // set default options
    if (options) {
        for (a in uniqueIdDefaults) {
            if (uniqueIdDefaults.hasOwnProperty(a)) {
                options[a] = options[a] === undefined ? uniqueIdDefaults[a] : options[a];
            }
        }
    } else {
        options = uniqueIdDefaults;
    }

    // set seed randomly or from location
    if (options.useLocation && mdc.location.current) {
        lat = mdc.location.current.latitude;
        lon = mdc.location.current.longitude;
        a = Math.abs(Math.round(lat - Math.floor(lat) * 1000) +
            Math.round(lon - Math.floor(lon) * 1000));
    } else {
        a = randomInt(5);
    }

    // create time dependent string
    a = a * $.now();
    s = a.toString();

    // set length
    if (options.length) {
        length = Math.min(s.length, options.length);
        s = s.substr(-1 * length);
    } else {
        length = s.length;
    }

    // perform random alpha substitutions
    if (options.alpha) {
        for (a = 0; a < length; a++) {
            if (Math.random() > 0.6) {
                s1 = s.substring(0, Math.max(a, 0));
                s2 = options.alpha[(parseInt(s[a], 10) % options.alpha.length)];
                s3 = s.substring(a + 1);
                s = s1 + s2 + s3;
            }
        }
    }

    return s;
}

function macroValue(value) {
    switch (value) {
        case "USER": return mdc.storage.value("currentUserData");
        default: return null;
    }
}

function resolveValue(value) {
    var i, l, v, rxResolvable = /^\$\{([^}]+)\}/,
        m = value && value.match && value.match(rxResolvable),
        variable = m && m.length && m[1],
        varPath = variable && variable.split && variable.split(".");

    if (varPath) {
        v = macroValue(varPath[0]);

        if (v == null) {
            return null;
        }

        for (i = 1, l = varPath.length; i < l; i++) {
            v = v[varPath[i]];
            if (v == null) {
                return null;
            }
        }
        return v;
    }

    return value;
}

function construct(higher, ctor, proto) {

    return function() {
        var base, p, P, c, x;

        P = function() {};
        P.prototype = higher.prototype;

        p = new P();
        ctor.prototype = p;

        base = {};
        $.extend(base, p);

        ctor.prototype.base = base;
        ctor.prototype.base.ctor = higher;

        if (proto !== undefined) {
            $.extend(ctor.prototype, proto);
        }

        c = function (constructor, args) {
            function F() {
                return constructor.apply(this, args);
            }
            F.prototype = constructor.prototype;
            return new F();
        };

        x = c(ctor, Array.prototype.slice.apply(arguments));

        return x;
    };

}

$.mobile.button.prototype.caption = function () {
    var e = this.element.parent().find(".ui-btn-inner > .ui-btn-text"),
        r = e.html.apply(e, arguments);

    if (typeof r === "string") {
        return r;
    } else {
        return this;
    }

};

$.mobile.button.prototype.hide = function () {
    var e = this.element.parent();
    e.hide.apply(e, arguments);
    return this;
};

$.mobile.button.prototype.show = function () {
    var e = this.element.parent();
    e.show.apply(e, arguments);
    return this;
};

function imageCompleteCheck(img, interval) {
    if (img.complete) {
        clearInterval(interval);
        $(img).trigger("imgLoad");
    }
}

$.fn.imgLoad = function (handler) {
    var interval, img;

    if (!this.is("img")) {
        return this;
    }

    img = this[0];

    if ($.isFunction(handler)) {
        this.on("imgLoad", handler);
    }

    interval = setInterval(function () {
        if (img.complete) {
            clearInterval(interval);
            $(img).trigger("imgLoad");
        }
    }, 200);

    setTimeout(function () {
        clearInterval(interval);
    }, 45000);
};

function vibrate(duration, repetitions) {
    var intrvl, i = repetitions || 1,
        f = function () {
            navigator.notification.vibrate(duration);
            i--;
            if (i <= 0) {
                clearInterval(intrvl);
            }
        };
    intrvl = setInterval(f, 300);
}

function alert(msg, vibrationDuration, vibrationRepetitions) {
    var title = "GIS Cloud Data Collection", dfrd = new $.Deferred();
    if (typeof msg !== "string")  {
        title = msg.title;
        msg = msg.content;
    }
    navigator.notification.alert(msg, dfrd.resolve, title, _("OK"));
    if (vibrationDuration) {
        vibrate(vibrationDuration, vibrationRepetitions || 1);
    }
    return dfrd.promise();
}

function confirm(msg, vibrationDuration, vibrationRepetitions) {
    var title = "GIS Cloud Data Collection",
        buttons = [_("Yes"), _("No")].join(","),
        positiveAnswerButton = 1,
        dfrd = new $.Deferred(),
        onConfirm = function (button) {
            if (button === positiveAnswerButton) {
                dfrd.resolve();
            } else {
                dfrd.reject();
            }
        };

    if (typeof msg !== "string")  {
        title = msg.title || title;
        msg = msg.content;
        buttons = msg.buttons || buttons;
        positiveAnswerButton = msg.positiveAnswerButton || positiveAnswerButton;
    }

    navigator.notification.confirm(msg, onConfirm, title, buttons);

    if (vibrationDuration) {
        vibrate(vibrationDuration, vibrationRepetitions || 1);
    }

    return {
        yes: $.proxy(dfrd.done, dfrd),
        no: $.proxy(dfrd.fail, dfrd),
        whatever: $.proxy(dfrd.always, dfrd)
    };
}

function showLoader() {
    $.mobile.loading("show");
}

function hideLoader() {
    $.mobile.loading("hide");
}

function log(msg) {
    console.log("LOG: " + msg);
}

function delay(func, context, params, duration) {
    params = params || [];
    context = context || window;
    duration = duration || 0;

    setTimeout(function () {
        func.apply(context, params);
    }, duration);

    return true;
}


JSON.stringify = (function (jsonStringify) {

    return function (target, level) {
        var lvl;

        try {
            return jsonStringify(target);
        } catch (err) {
            if (level === undefined) {
                lvl = 3;
            } else if (level <= 1) {
                return "Max depth reached: " + Object.prototype.toString.apply(target);
            } else {
                lvl = level - 1;
            }

            try {
                if (target === null) {
                    return "null";
                } else if (target === undefined) {
                    return "undefined";
                } else if (typeof target === "string") {
                    return target;
                } else if (typeof target === "number") {
                    return jsonStringify(target);
                } else if (target instanceof Date) {
                    return target.getTime().toString();
                } else if ($.isArray(target)) {
                    return jsonStringify($.map(target, function (member) {
                        return JSON.stringify(member, lvl);
                    }));
                } else {
                    var key, obj = {};
                    for (key in target) {
                        obj[key] = JSON.stringify(target[key], lvl);
                    }
                    return jsonStringify(obj);//.replace(/\\\\/g, "").replace(/\\?\"/g, "");
                }
            } catch (e) {
                return "ERROR";
            }
        }
    };

}(JSON.stringify));

// Relay options:
//
// options = {
//     init: function () { /* relay initialization */ },
//     onActivation: function () { /* what happens on activation */ },
//     onDeactivation: function () { /* what happens on deactivation */ },
//     check: function () { /* checks all activation conditions, returns true or false */ },
//     triggers: [
//         { element: { /* what to bind to */ }, eventName: "name of event" },
//         ...
//     ]
// };

function Relay(options) {
    var i, l, trig;

    this.options = options;

    if (options.init) {
        options.init.call(this);
    }

    for (i = 0, l = options.triggers.length; i < l; i++) {
        trig = options.triggers[i];
        $(trig.element).on(trig.eventName, $.proxy(this.check, this));
    }
}

Relay.prototype = {
    activate: function () {
        var args;
        if (this.options.onActivation) {
            args = Array.prototype.slice.apply(arguments);
            this.options.onActivation.apply(this, args);
        }
    },
    deactivate: function () {
        var args;
        if (this.options.onDeactivation) {
            args = Array.prototype.slice.apply(arguments);
            this.options.onDeactivation.apply(this, args);
        }
    },
    check: function () {
        var resp,
            args = Array.prototype.slice.apply(arguments);

        if (this.options.check) {
            resp = this.options.check.apply(this, args);
            if (resp) {
                this.activate();
            } else {
                this.deactivate();
            }
        } else {
            this.activate();
        }
    }
};


var Base64Binary = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));

        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i=0; i<bytes; i+=3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }
        return uarray;
    }
};