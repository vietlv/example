/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

window.LOG = true;
window.DETAIL = true;
window.DEBUG = false;

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        pageInit = new $.Deferred(),
        deviceReady = new $.Deferred(),
        storageInitialized = new $.Deferred(),
        settingsLoaded = new $.Deferred(),
        settingsApplied = new $.Deferred(),
        state = {},
        ready, onDeviceReady, init, getDeviceId, setRedirects, setDebug,
        onAppPause, onAppResume,
        backButtonOverride, queueManager, exitApp, confirm3g, getAppVersion;

    // beacuse of pgbuild not packing version infot to config.xml
    mdc.VERSION = "1.1.0";
    mdc.VERSION_CODE = "0011000";

    mdc.main =  {
        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        }
    };

    // a global ready deferred
    ready = $.when(
        pageInit, deviceReady, storageInitialized, settingsLoaded, settingsApplied);

    // bind to pageinit to get things started
    // --> this is a jQuery mobile event
    $("#mainPage").live("pageinit", function () {
        LOG && console.log("main: Main page inititalized.");

        var isMobileBrowser = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(?:hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(?:ob|in)i|palm(?: os)?|phone|p(?:ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(?:browser|link)|vodafone|wap|windows (?:ce|phone)|xda|xiino/i
            .test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(?:er|oo|s\-)|ai(?:ko|rn)|al(?:av|ca|co)|amoi|an(?:ex|ny|yw)|aptu|ar(?:ch|go)|as(?:te|us)|attw|au(?:di|\-m|r |s )|avan|be(?:ck|ll|nq)|bi(?:lb|rd)|bl(?:ac|az)|br(?:e|v)w|bumb|bw\-(?:n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(?:mp|nd)|craw|da(?:it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(?:c|p)o|ds(?:12|\-d)|el(?:49|ai)|em(?:l2|ul)|er(?:ic|k0)|esl8|ez(?:[4-7]0|os|wa|ze)|fetc|fly(?:\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(?:\.w|od)|gr(?:ad|un)|haie|hcit|hd\-(?:m|p|t)|hei\-|hi(?:pt|ta)|hp(?: i|ip)|hs\-c|ht(?:c(?:\-| |_|a|g|p|s|t)|tp)|hu(?:aw|tc)|i\-(?:20|go|ma)|i230|iac(?: |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(?:t|v)a|jbro|jemu|jigs|kddi|keji|kgt(?: |\/)|klon|kpt |kwc\-|kyo(?:c|k)|le(?:no|xi)|lg(?: g|\/(?:k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(?:te|ui|xo)|mc(?:01|21|ca)|m\-cr|me(?:di|rc|ri)|mi(?:o8|oa|ts)|mmef|mo(?:01|02|bi|de|do|t(?:\-| |o|v)|zz)|mt(?:50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(?:0|2)|n50(?:0|2|5)|n7(?:0(?:0|1)|10)|ne(?:(?:c|m)\-|on|tf|wf|wg|wt)|nok(?:6|i)|nzph|o2im|op(?:ti|wv)|oran|owg1|p800|pan(?:a|d|t)|pdxg|pg(?:13|\-(?:[1-8]|c))|phil|pire|pl(?:ay|uc)|pn\-2|po(?:ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(?:07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(?:ve|zo)|s55\/|sa(?:ge|ma|mm|ms|ny|va)|sc(?:01|h\-|oo|p\-)|sdk\/|se(?:c(?:\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(?:\-|m)|sk\-0|sl(?:45|id)|sm(?:al|ar|b3|it|t5)|so(?:ft|ny)|sp(?:01|h\-|v\-|v )|sy(?:01|mb)|t2(?:18|50)|t6(?:00|10|18)|ta(?:gt|lk)|tcl\-|tdg\-|tel(?:i|m)|tim\-|t\-mo|to(?:pl|sh)|ts(?:70|m\-|m3|m5)|tx\-9|up(?:\.b|g1|si)|utst|v400|v750|veri|vi(?:rg|te)|vk(?:40|5[0-3]|\-v)|vm40|voda|vulc|vx(?:52|53|60|61|70|80|81|83|85|98)|w3c(?:\-| )|webc|whit|wi(?:g |nc|nw)|wmlb|wonu|x700|xda(?:\-|2|g)|yas\-|your|zeto|zte\-/i
            .test(navigator.userAgent.substr(0, 4));

        if (!isMobileBrowser || window.parent !== window) {
            // we're inside a web browser or (ripple) emulator
            LOG && console.log("main: using mock device.");
            window.device = { mock: true };
            onDeviceReady();
        } else {
            // bind to PhoneGap's device ready event
            document.addEventListener("deviceready", onDeviceReady, false);
        }

        giscloud.forceLocal = true;

        pageInit.resolve();
    });

    settingsLoaded.done(function () {
        // check for device id
        if (mdc.settings.value("deviceId") == null) {
            mdc.settings.value("deviceId", getDeviceId());
        }
        // set debugging preference once the settings finish loading
        setDebug(mdc.settings.value("debug"));
        // handle redirects
        setRedirects(mdc.settings.value("redirects"));
        // resolve settingApplied deferred to continue with app init
        settingsApplied.resolve();
    });

    pageInit.done(function () {
        LOG && console.log("main: pageInit done");
    });

    // device ready event handler
    onDeviceReady = function () {
        LOG && console.log("main: Device ready.");
        DETAIL && console.log(JSON.stringify(device));

        mdc.deviceInfo = {};
        $.extend(true, mdc.deviceInfo, device);

        // start watching location
        mdc.location.go();

        // device.mock indicates that the app is run
        // in a desktop browser, not a mobile device -> used for development
        if (device.mock) {
            // use browser storage, not file system
            mdc.storage.init({ useLocalStorage: true })
            .done(function () {
                mdc.settings.setDefault();
                mdc.settings.value("deviceId", "gc_test");
                storageInitialized.resolve();
                settingsLoaded.resolve();
                settingsApplied.resolve();
            });
        } else {
            // the real thing -
            // initialize storage
            mdc.storage.init()
            .then(storageInitialized.resolve, storageInitialized.reject)
            // set default settings
            .done($.proxy(mdc.settings.setDefault, mdc.settings))
            // load settings from file
            .done(function () {
                // load app settings
                mdc.settings.load()
                .always(settingsLoaded.resolve);
            });

            // override back button
            document.addEventListener("backbutton", backButtonOverride, false);

            // override menu button
            document.addEventListener("menubutton", menuButtonOverride, false);

            // handle app pause/resume
            document.addEventListener("pause", onAppPause, false);
            document.addEventListener("resume", onAppResume, false);

            // for some reason, phonegap's online/offline events don't work as advertised
            mdc.net.startOnlinePolling();
        }

        deviceReady.resolve();
    };

    // wait on pageInit, deviceReady, storageInitilized, settingsLoaded and settingsApplied
    ready
    .done(function () {
        DETAIL && console.log("main: ready done");

        // read app version from config.xml
        getAppVersion();

        // set language
        mdc.lang.language = mdc.settings.value("lang");

        // set remote url
        mdc.net.remoteUrl(mdc.settings.value("remote"));

        // initialize the app
        if (!mdc.storage.has("confirm3G")) {
            // get 3G usage confirmation
            confirm3g().done(init);
        } else {
            init();
        }
    })
    .fail(function () {
        LOG && console.log("main: ready failed.");
        DETAIL && console.log(JSON.stringify(arguments));
    });

    // initialization: queue, ui
    init = function () {
        try {

            LOG && console.log("main: init.");

            // apply network settings
            if (mdc.settings.value("networkOn") !== false) {
                mdc.net.enable();
            } else {
                mdc.net.disable();
            }

            // initialize and manage the queue
            mdc.packages.initQueue(true);
            mdc.queueManager = queueManager = new mdc.QueueManager(mdc.packages.queue);

            // show content
            $("#mainContent").show();

            // initialize UI
            mdc.ui.init();

        } catch (err) {
            LOG && console.log("main: app error.");
            DETAIL && console.error(JSON.stringify(err));

            if (DETAIL) { throw err; }
        }
    };

    // retrieves the device unique id
    getDeviceId = function () {
        // android 2.2 (and some others) has uuid always set to 9774d56d682e549c
        // see issue here: http://code.google.com/p/android/issues/detail?id=10603
        //
        // iOS doesn't provide a unique device id, but rather a new key for every app install/upgrade
        if (device.platform === "iOS" || device.uuid === "9774d56d682e549c") {
            return uniqueId();
        } else {
            return device.uuid;
        }
    };

    confirm3g = function () {
        var dfrd = new $.Deferred(),
            answer = confirm({
                title: "Warning",
                content: "Using this app on a 3G network may cause data charges by your network operator.\n" +
                         "Do you want to send collected data using 3G network if available?"
            });

        answer.yes(function () {
            mdc.settings.value("use3G", true);
        });

        answer.no(function () {
            mdc.settings.value("use3G", false);
        });

        answer.whatever(function () {
            dfrd.resolve();
            mdc.storage.value("confirm3G", true);
        });

        return dfrd;
    };

    getAppVersion = function () {
        LOG && console.log("main: not going to config.xml for the version.");
        mdc.version = mdc.VERSION;
        mdc.versionCode = mdc.VERSION_CODE;
        return;

        LOG && console.log("main: getting device version from config.xml");

        $.get("config.xml")
        .done(function (cont) {
            var content;
            try {
                content = $(cont);
                mdc.version = content.filter("widget").attr("version");
                LOG && console.log("main: version set to " + mdc.version);
                mdc.versionCode = content.filter("widget").attr("versionCode");
                LOG && console.log("main: version code set to " + mdc.versionCode);
                mdc.ui.displayVersion(mdc.version, mdc.versionCode);
            } catch (exc) {
                LOG && console.log("main: failed to read version from config.xml.");
                mdc.version = mdc.VERSION;
                mdc.versionCode = mdc.VERSION_CODE;
            }
        })
        .fail(function () {
            LOG && console.log("main: failed to get config.xml contents.");
            mdc.version = mdc.VERSION;
            mdc.versionCode = mdc.VERSION_CODE;
        });
    };

    // sets debug level
    setDebug = function (onoff) {
        var module;
        if (typeof onoff === "boolean") {
            DETAIL && console.log("main: setting all debug settings to " + onoff + ".");
            window.LOG = !!onoff;
            window.DETAIL = !!onoff;
            for (module in mdc) {
                if (mdc.hasOwnProperty(module) && typeof mdc[module].setDebug === "function") {
                    console.log("main: setting debug for mdc." + module + " to " + JSON.stringify(onoff));
                    mdc[module].setDebug(onoff);
                }
            }
        } else if (typeof onoff === "object") {
            if (onoff["default"] != null) {
                if (typeof onoff["default"] === "boolean") {
                    console.log("main: setting default debug to " + onoff["default"]);
                    window.DETAIL = window.LOG = onoff["default"];
                } else if (typeof onoff["default"] === "object") {
                    console.log("main: setting default debug to " + JSON.stringify(onoff["default"]));
                    window.LOG = !!onoff["default"].log;
                    window.DETAIL = !!onoff["default"].detail;
                }
                for (module in mdc) {
                    if (mdc.hasOwnProperty(module) && typeof mdc[module].setDebug === "function") {
                        console.log("main: setting debug for mdc." + module + " to " + JSON.stringify(onoff["default"]));
                        mdc[module].setDebug(onoff["default"]);
                    }
                }
            }
            for (module in onoff) {
                if (onoff.hasOwnProperty(module) && mdc.hasOwnProperty(module)) {
                    console.log("main: setting debug for mdc." + module + " to " + JSON.stringify(onoff[module]));
                    mdc[module].setDebug && mdc[module].setDebug(onoff[module]);
                }
            }
        }
    };

    // sets redirect urls
    setRedirects = function (redirects) {
        var apiHostname, homeHostname, restUrl, func, funcBody;

        if (redirects) {
            LOG && console.log("main: setting redirects: " + JSON.stringify(redirects));
            apiHostname = redirects.api && redirects.api.match(/https?:\/\/([^\/]+)\/?$/)[1];
            homeHostname = redirects.home && redirects.home.match(/https?:\/\/([^\/]+)\/?$/)[1];

            // redirect rest calls
            if (apiHostname) {
                restUrl = "https://" + apiHostname + "/1/";
                DETAIL && console.log("Setting rest URL to " + restUrl);
                mdc.rest.baseUrl(restUrl);
            }

            // redirect gc api by rewriting functions in giscloud_config
            for (func in giscloud_config) {
                if (giscloud_config.hasOwnProperty(func) && $.isFunction(giscloud_config[func])) {
                    funcBody = giscloud_config[func].toString().match(/\{([\s\S]+)\}/)[1];
                    if (apiHostname && funcBody.indexOf("api.giscloud.com") > -1) {
                        funcBody = funcBody.replace(/api\.giscloud\.com/g, apiHostname);
                        DETAIL && console.log(
                            "Setting giscloud_config." + func + " to function () {" + funcBody + "}");
                        giscloud_config[func] = new Function(funcBody);
                    } else if (homeHostname && funcBody.indexOf("www.giscloud.com") > -1) {
                        funcBody = funcBody.replace(/www\.giscloud\.com/g, homeHostname);
                        DETAIL && console.log(
                            "Setting giscloud_config." + func + " to function () {" + funcBody + "}");
                        giscloud_config[func] = new Function(funcBody);
                    }
                }
            }

            // refresh html5 map urls
            giscloud.Html5MapRefreshUrls();
        }
    };

    // override of the android back button default behaviour
    backButtonOverride = function (evt) {
        // close app if on main page and no popups are active
        if ($(".ui-popup-active").length) {
            DETAIL && console.log("backbutton: closing popup.");
            try {
                $(".ui-popup-active > .ui-popup").popup("close");
            } catch (e) {
                LOG && console.dir(e);
            }
        } else {
            if ($.mobile.activePage.is("#mainPage")) {
                DETAIL && console.log("backbutton: closing app.");
                evt.preventDefault();
                exitApp();
            } else {
                DETAIL && console.log("backbutton: going back.");
                navigator.app.backHistory();
            }
        }
    };

    // override of the android menu button default behaviour
    menuButtonOverride = function (evt) {
        // show settings page if not already there
        // otherwise, go back
        if (!$.mobile.activePage.is("#settingsPage")) {
            $.mobile.changePage("#settingsPage");
        } else {
            navigator.app.backHistory();
        }
        evt.preventDefault();
    };

    onAppPause = function () {
        LOG && console.log("main: pausing app.");

        state.locationWatchActive = mdc.location.running();
        state.onlinePollingActive = mdc.net.polling();
        state.netMonitoringActive = mdc.net.monitoring();

        DETAIL && console.log(JSON.stringify(state));

        mdc.queueManager && mdc.queueManager.pause();
        mdc.location.pause();
        mdc.net.pauseMonitoring();
        mdc.net.pauseOnlinePolling();
    };

    onAppResume = function () {
        LOG && console.log("main: resuming app.");
        DETAIL && console.log(JSON.stringify(state));

        setTimeout(function () {
            mdc.queueManager.resume();
            state.locationWatchActive && mdc.location.go();
            state.onlinePollingActive && mdc.net.startOnlinePolling();
            state.netMonitoringActive && mdc.net.startMonitoring();
        }, 1000);
    };

    // app termination
    exitApp = function () {
        try {
            queueManager.stop();
            mdc.location.pause();
            mdc.net.pauseMonitoring();
            mdc.net.pauseOnlinePolling();
        } catch (e) { }
        navigator.app.exitApp();
    };

}());