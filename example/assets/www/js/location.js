/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        COMPASS = !window.parent.tinyHippos && !window.tinyHippos, // compass makes trouble in the Ripple environment
        watch, compassWatch, watching, geolocationOptions, startWatch, endWatch,
        onCompassSuccess, packPosition, updateStatus, onGeolocationSuccess, onGeolocationError,
        maxErrorCount = 10, currentCompass = null;

    window.mdc.location = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                    LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
            },

            current: null,

            set: function (lat, lon, silent) {
                var loc = {
                        latitude: lat,
                        longitude: lon,
                        accuracy: 0,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        compassHeading: currentCompass,
                        speed: null,
                        time: new Date()
                    };

                updateStatus(loc, silent);
                return loc;
            },

            request: function () {
                var dfrd = new $.Deferred();
                navigator.geolocation.getCurrentPosition(
                    // success
                    function (position) {
                        if (position && position.coords) { dfrd.resolve(packPosition(position)); }
                        else { dfrd.reject(); }
                    },
                    // error
                    function () { dfrd.reject(); },
                    geolocationOptions
                );
                return dfrd;
            },

            go: function () { startWatch(); },
            pause: function () { endWatch(); },
            running: function () { return watching; },
            minAccuracy: 10
    };

    geolocationOptions = { maximumAge: 12000, timeout: 10000, enableHighAccuracy: true };

    startWatch = function () {
        if (watching) {
            endWatch();
        }

        // get current location
        navigator.geolocation.getCurrentPosition(
                onGeolocationSuccess,
                onGeolocationError);

        // watch for changes
        watch = navigator.geolocation.watchPosition(
                onGeolocationSuccess,
                onGeolocationError,
                geolocationOptions
        );

        if (COMPASS) {
            // make sure this isn't a ripple emulator
            COMPASS &= !mdc.deviceInfo.mock;
        }

        if (COMPASS) {
            // get current heading
            navigator.compass.getCurrentHeading(onCompassSuccess, $.noop);
            // watch heading
            compassWatch = navigator.compass.watchHeading(onCompassSuccess, $.noop);
        } else {
            LOG && console.log("location: No compass, muchacho.");
        }

        watching = true;
        LOG && console.log("mdc.location: Watching location.");
    };

    endWatch = function () {
        if (watching) {
            navigator.geolocation.clearWatch(watch);
            COMPASS && navigator.compass.clearWatch(compassWatch);
            watching = false;
            LOG && console.log("mdc.location: Ending watch.");
        }
    };

    packPosition = function (position) {
        return {
            latitude: position.coords.latitude != null ? position.coords.latitude : null,
            longitude: position.coords.longitude != null ? position.coords.longitude : null,
            altitude: position.coords.altitude != null ? parseInt(position.coords.altitude, 10) : null,
            heading: position.coords.heading != null ? parseInt(position.coords.heading, 10) : null,
            compassHeading: currentCompass,
            speed: position.coords.speed != null ? parseInt(position.coords.speed, 10) : null,
            accuracy: position.coords.accuracy != null ? parseInt(position.coords.accuracy, 10) : null,
            altitudeAccuracy: position.coords.altitudeAccuracy != null ? parseInt(position.coords.altitudeAccuracy, 10) : null,
            time: new Date(position.timestamp),
            when: new Date()
        };
    };

    onCompassSuccess = function (heading) {
        if (heading != null) {
            currentCompass = (heading.trueHeading != null && heading.trueHeading >= 0) ?
                heading.trueHeading : heading.magneticHeading;

            if (mdc.location.current)
                mdc.location.current.compassHeading = currentCompass;
        }
    };

    onGeolocationSuccess = function (position) {
        LOG && console.log("mdc.location: Geolocation success.");
        DETAIL && console.log(JSON.stringify(position));

        maxErrorCount = 10;

        if (!position || !position.coords) {
            return;
        }

        updateStatus(packPosition(position));
    };

    onGeolocationError = function (error) {
        LOG && console.log("mdc.location: Geolocation error.");
        DETAIL && console.log(JSON.stringify(error));

        maxErrorCount--;

        if (maxErrorCount <= 0) {
            // failed for more than 10 times? take a break.
            if (watching) {
                // reset error counter
                maxErrorCount = 10;
                // restart in 10 seconds
                setTimeout(mdc.location.go, 10000);
            }
            endWatch();
        }
    };

    updateStatus = function (pos, silent) {
        mdc.location.current = pos;
        if (!silent) {
            $(mdc.location).triggerHandler("new", [mdc.location.current]);
            if (pos.accuracy <= window.mdc.location.minAccuracy) {
                $(window.mdc.location).triggerHandler("accuracyReached", [mdc.location.current]);
            }
        }
    };

}());