/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        getConnType, monitor, broadcastConnectionStatus, onBeforeSend, onSuccess, onError, onOffline, onOnline,
        onlineTimer, onlinePollingInterval,
        isOnline = false,
        onlineDelay = 2000,
        disabled = false,
        defaultDelay = 2000,
        remoteUrl = "http://alpha.giscloud.com/mobileupload/";
        //remoteUrl = "http://opho.zgceste.hr:38123/mobileupload";

    mdc.net = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                    LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
            },

            isAvailable: function () {
                LOG && console.log("net: checking availability.");

                var available = !disabled &&
                    getConnType() !== Connection.NONE &&
                    getConnType() !== Connection.UNKNOWN;

                DETAIL && console.log(available ? "available" : "not available");

                return available;
            },

            disable: function () {
                disabled = true;
                onOffline();
            },

            enable: function () {
                disabled = false;
                onOnline(true);
            },

            connectionType: function () {
                if (disabled) {
                    return Connection.NONE;
                }

                switch (getConnType()) {
                case Connection.UNKNOWN:
                    return "Unknown connection";
                case Connection.ETHERNET:
                    return "Ethernet connection";
                case Connection.WIFI:
                    return "WiFi connection";
                case Connection.CELL_2G:
                    return "Cell 2G connection";
                case Connection.CELL_3G:
                    return "Cell 3G connection";
                case Connection.CELL_4G:
                    return "Cell 4G connection";
                case Connection.NONE:
                    return "No network connection";
                default:
                    return "Unknown connection";
                }
            },

            isWifi: function () {
                return !disabled && getConnType() === Connection.WIFI;
            },

            is2G: function () {
                return !disabled && getConnType() === Connection.CELL_2G;
            },

            is3G: function () {
                return !disabled && getConnType() === Connection.CELL_3G;
            },

            is4G: function () {
                return !disabled && getConnType() === Connection.CELL_4G;
            },

            isOnline: function () {
                return !disabled && isOnline;
            },

            isOffline: function () {
                return disabled || !isOnline;
            },

            isCell: function () {
                return this.is2G() || this.is3G() || this.is4G();
            },

            startMonitoring: function (delay) {
                LOG && console.log("net: start monitoring.");
                mdc.net.pauseMonitoring();
                monitor = setInterval(
                    $.proxy(broadcastConnectionStatus, mdc.net),
                    delay || defaultDelay
                );
            },

            pauseMonitoring: function () {
                if (monitor) {
                    clearInterval(monitor);
                }
            },

            monitoring: function () {
                return !!monitor;
            },

            startOnlinePolling: function () {
                onlinePollingInterval = setInterval(function () {
                    !isOnline && !disabled && onOnline(true);
                }, onlineDelay);
            },

            pauseOnlinePolling: function () {
                clearInterval(onlinePollingInterval);
            },

            polling: function () {
                return !!onlinePollingInterval;
            },

            remoteUrl: function (url) {
                if (url == null) {
                    return remoteUrl;
                } else {
                    remoteUrl = url;
                }
            },

            post: function (data) {
                LOG && console.log("net: post.");

                if (disabled) {
                    return $.Deferred.reject().promise();
                }

                return $.post(remoteUrl, data);
            }
    };

    $("#mainPage").live("pageinit", function () {
        $(document)
        .bind("offline", onOffline)
        .bind("online", onOnline);
    });

    getConnType = function () {
        if (mdc.deviceInfo && mdc.deviceInfo.mock) {
            return navigator.connection ?
                navigator.connection.type :
                "wifi";
        }
        return navigator.connection.type;
    };

    onOffline = function () {
        LOG && console.log("net: I'm offline :**(");
        isOnline = false;
        $(mdc.net).triggerHandler("offline");
    };

    onOnline = function (immediate) {
        if (!onlineTimer || immediate === true) {

            if (immediate === true && onlineTimer) {
                clearTimeout(onlineTimer);
            }

            onlineTimer = setTimeout(
                function () {
                    var conntype = getConnType(),
                        online = !disabled &&
                            conntype !== Connection.NONE &&
                            conntype !== Connection.UNKNOWN;

                    if (online) {
                        LOG && console.log("net: I'm online!");
                        isOnline = true;
                        $(mdc.net).triggerHandler("online", [mdc.net.connectionType()]);
                    }
                },
                immediate ? 0 : onlineDelay
            );
        }
    };

    broadcastConnectionStatus = function () {
        var conn = this.connectionType();
        LOG && console.log("broadcastConnectionStatus: " + conn);
        $(mdc.net).triggerHandler("connection", [conn]);
    };

    onBeforeSend = function (jqXHR, settings) {
        var apiKey = mdc.user.apiKey();

        LOG && console.log("net: before send.");

        // if this is an api or a map xml request, add user credentials
        if (apiKey && settings.url.indexOf("giscloud.com") !== -1 && settings.url.indexOf(apiKey) === -1) {
            // add api key
            settings.url += ((settings.url.indexOf("?") != -1) ? "&api_key=" : "?api_key=") + apiKey;
            // switch to https
            if (settings.url.indexOf("https") !== 0) {
                settings.url = settings.url.replace("http", "https");
            }
        }

        DETAIL && console.log(JSON.stringify(settings));
        $(this).triggerHandler("beforeSend", [jqXHR, settings]);
    };

    onSuccess = function (data, textStatus, jqXHR) {
        LOG && console.log("net: " + textStatus);
        DETAIL && console.log(JSON.stringify(data));
        $(this).triggerHandler("sendSuccess", [data, textStatus, jqXHR]);
    };

    onError = function (jqXHR, textStatus, errorThrown) {
        LOG && console.log("net: " + textStatus);
        DETAIL && console.log(JSON.stringify(errorThrown));
        DETAIL && console.log(JSON.stringify(jqXHR));
        $(this).triggerHandler("sendError", [jqXHR, textStatus, errorThrown]);
    };

    // set some ajax defaults
    $.ajaxSetup({
        beforeSend: onBeforeSend,
        success: onSuccess,
        error: onError,
        cache: false
    });

    // handle missing Connection object
    window.Connection = {
        "UNKNOWN": "unknown",
        "ETHERNET": "ethernet",
        "WIFI": "wifi",
        "CELL_2G": "2g",
        "CELL_3G": "3g",
        "CELL_4G": "4g",
        "CELL": "cellular",
        "NONE": "none"
    };

}());