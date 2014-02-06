/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        media, recordAudioSuccess, recordAudioError, recordAudioStatus, getMediaError, releaseMedia;

    mdc.media = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                    LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
            },

            DEFAULT_AUDIO_DURATION: 30,

            takePhoto: function () {
                var dfrd = new $.Deferred();
                // this gives a picture too large
                //navigator.device.capture.captureImage(dfrd.resolve, dfrd.reject);

                // this is the 'old' way to capture an image
                navigator.camera.getPicture(dfrd.resolve, dfrd.reject, {
                    mediaType: Camera.MediaType.PICTURE,
                    encodingType: Camera.EncodingType.JPEG,
                    destinationType: Camera.DestinationType.FILE_URI,
                    saveToPhotoAlbum: true,
                    targetWidth: 800,
                    targetHeight: 800,
                    quality: 40,
                    allowEdit : true,
                    correctOrientation: true
                });

                // photo should me moved from temp to documents on ios
                if (device.platform === "iOS") {
                    return dfrd.pipe(function (file) {
                        return mdc.file.moveToDocuments(file, true);
                    });
                }

                return dfrd.promise();
            },

            recordAudio: function (maxDuration) {
                var src, dfrd = new $.Deferred();
                maxDuration = maxDuration || this.DEFAULT_AUDIO_DURATION;

                if (mdc.settings.value("useNativeAudioRecording")) {
                    navigator.device.capture.captureAudio(
                            dfrd.resolve, dfrd.reject,
                            { duration: maxDuration }
                    );

                    // audio file should me moved from temp to documents on ios
                    if (device.platform === "iOS") {
                        return dfrd.pipe(function (mediaFiles) {
                            if (mediaFiles && mediaFiles.length) {
                                return mdc.file.moveToDocuments(mediaFiles[0].fullPath, true);
                            }

                            return null;
                        });
                    }
                } else if (this.audioRecording && this.audioRecording.state() === "pending") {
                    LOG && console.log("media: stopping recording on request.");
                    media.stopRecord();
                } else {
                    src = "mdc_recording_" + uniqueId({ length: 10 }) + ".mp3";
                    media = new Media(
                        mdc.file.fsRoot + "/" + src,
                        $.proxy(recordAudioSuccess, this),
                        $.proxy(recordAudioError, this)
                    );

                    LOG && console.log("media: starting non-native record: " + src);

                    this.audioRecording = dfrd;

                    setTimeout($.proxy(function () {
                        if (this.audioRecording && this.audioRecording.state() === "pending") {
                            LOG && console.log("media: stopping recording after maxDuration=" + maxDuration + "sec.");
                            media.stopRecord();
                        }
                    }, this), maxDuration * 1000);

                    media.startRecord();

                    $(this).triggerHandler("recordStart", [media]);

                }

                return dfrd.promise();
            },

            recordStop: function () {
                if (this.audioRecording && this.audioRecording.state() === "pending") {
                    LOG && console.log("media: stopping recording on request.");
                    media.stopRecord();
                }
            },

            audioRecording: false,

            audioPlaying: false,

            playAudio: function (audioFile) {

                LOG && console.log("media: play audio.");

                var dfrd = new $.Deferred(),
                    rx = /^\w+:(.+)$/i,
                    m = rx.exec(audioFile);

                audioFile = (m && m[1]) || audioFile;
                DETAIL && console.log(audioFile);

                if (this.audioPlaying) {
                    this.stopAudio();
                }

                if (media) {
                    releaseMedia();
                }

                media = new Media(
                    audioFile,

                    // success
                    $.proxy(function() {

                        LOG && console.log("media: audio play success.");

                        this.audioPlaying = false;

                        releaseMedia();

                        dfrd.resolve.apply(this, arguments);
                    }, this),

                    // error
                    $.proxy(function(error) {

                        LOG && console.log("media: audio play error.");
                        DETAIL && console.log("error: " + getMediaError(error));

                        try {
                            this.audioPlaying = false;

                            releaseMedia();
                            if (error && error.code === MediaError.MEDIA_ERR_ABORTED) {
                                dfrd.resolve();
                            }
                            dfrd.reject.apply(this, arguments);
                        } catch (err) {
                            LOG && console.log(err);
                        }
                    }, this),

                    // status
                    $.proxy(function(status) {
                        DETAIL && console.log("media: status = " +
                                               (Media.MEDIA_MSG && Media.MEDIA_MSG[status]) ||
                                               JSON.stringify(status));

                       if (status === Media.MEDIA_PAUSED) {
                           LOG && console.log("media: playback stopped.");
                           this.audioPlaying = false;
                           dfrd.resolve();
                           releaseMedia();
                       }

                    }, this)
                );

                media.play();

                this.audioPlaying = true;

                return dfrd.promise();
            },

            stopAudio: function () {

                LOG && console.log("media: stopping audio.");

                media.stop();
                this.audioPlaying = false;
            }

    };

    recordAudioSuccess = function () {
        LOG && console.log("media: audio record success.");

        this.audioRecording.resolve(media);
        $(this).triggerHandler("recordSuccess", [media]);

        releaseMedia();

    };

    recordAudioError = function (err) {
        LOG && console.log("media: audio record error.");
        DETAIL && console.log("error:" + getMediaError(error));

        this.audioRecording.reject(err);
        $(this).triggerHandler("recordError", [err]);

        releaseMedia();
    };

    recordAudioStatus = function () {
        LOG && console.log("media: audio record status: " + JSON.stringify(arguments));
    };

    getMediaError = function (error) {
        if (MediaError) {
            switch (error.code || error) {
                case MediaError.MEDIA_ERR_ABORTED:
                    return "MEDIA_ERR_ABORTED";
                case MediaError.MEDIA_ERR_NETWORK:
                    return "MEDIA_ERR_NETWORK";
                case MediaError.MEDIA_ERR_DECODE:
                    return "MEDIA_ERR_DECODE";
                case MediaError.MEDIA_ERR_NONE_SUPPORTED:
                    return "MEDIA_ERR_NONE_SUPPORTED";
                default:
                    // well... nothing really
            }
        }
        return JSON.stringify(error);
    };

    releaseMedia = function () {
        try {
            DETAIL && console.log("Trying to release media.");
            if (media == null) {
                DETAIL && console.log("Media is null or undefined.");
            } else {
                media.release();
                media = null;
                DETAIL && console.log("Media release done.");
            }
        } catch (err) {
            DETAIL && console.log("Media release error. err = " + JSON.stringify(err));
        }
    };

}());