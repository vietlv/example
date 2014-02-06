/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

mdc.defaultAppSettings = function () {
    return {
        debug: {
            // map: true,
            // packages: true,
            // location: true,
            // net: true,
            // user: true,
            // rest: true,
            // file: true,
            // main: true,
            // form: true,
            "default": false
        },
        lang: "en",
        queueSend: true,
        useNativeAudioRecording: true,
        redirects: null
        // ,
        // "redirects": {
        //     // "home": "http://opho.zgceste.hr:38123",
        //     "home": "http://o.omnisdata.com:60080",
        //     // "api": "https://zgceste-api.giscloud.com:42154"
        //     "api": "https://o-api.giscloud.com:60443"
        // }
    };
};