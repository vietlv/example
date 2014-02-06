/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL;

    mdc.queueManager = {
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

    mdc.QueueManager = function (q) {

        var timeout, wait, nap, go, interrupt, goodSendingConditions, status,
            waitTime = 5000,
            napTime = 30000;

        status = mdc.QueueManager.status.IDLE;

        wait = function () {
            clearTimeout(timeout);
            timeout = setTimeout(go, waitTime);
        };

        nap = function () {
            clearTimeout(timeout);
            timeout = setTimeout(go, napTime);
        };



        go = function () {
            var item;

            // check queue length and current manager status
            if (status === mdc.QueueManager.status.IDLE && q.length() > 0)
            {
                // check network conditions
                if (goodSendingConditions()) {
                    // get next item from the queue
                    item = q.next();
                    if (item) {
                        LOG && console.log("queueManager: sending item.");
                        // set manager status
                        status = mdc.QueueManager.status.BUSY;
                        // send the queue item
                        item.send()
                        .always(function () {
                            // reset manager status
                            status = mdc.QueueManager.status.IDLE;
                            nap();
                        })
                        .fail(function () {
                            // wait before trying again
                            nap();
                        })
                        .done(function () {
                            // if successful, go again
                            go();
                        });
                        // exit, no need to wait
                        return;
                    }
                }
            }
            // take a nap before next check
            nap();

            return this;
        };

        goodSendingConditions = function () {
            var cond;

            LOG && console.log("queueManager: checking sending conditions.");

            // gather  conditions in a nice little object for debug purposes
            cond = {
                loggedIn: mdc.user.isLoggedIn(),
                online:  mdc.net.isOnline(),
                wifi: mdc.net.isWifi(),
                use3G: mdc.settings.value("use3G") === true,
                cell: mdc.net.isCell()
            };

            DETAIL && console.log(JSON.stringify(cond));

            return cond.loggedIn && cond.online && (cond.wifi || (cond.use3G && cond.cell));
        };

        interrupt = function () {
            if (status === mdc.QueueManager.status.IDLE)
            {
                LOG && console.log("queueManager: interrupted.");
                clearTimeout(timeout);
                go();
            }
        };

        if (q != null) {

            $(mdc).bind("added.queue", interrupt);
            $(mdc.net).bind("online", interrupt);

            go();
        }

        this.pause = function () {
            status = mdc.QueueManager.status.ON_A_BREAK;
            return this;
        };

        this.resume = function () {
            status = mdc.QueueManager.status.IDLE;
            go();
            return this;
        };

        this.stop = function () {
            status = mdc.QueueManager.status.ON_A_BREAK;
            clearTimeout(timeout);
            timeout = null;
            $(mdc).unbind("added.queue", interrupt);
            $(mdc.net).unbind("online", interrupt);
            q = null;
            return this;
        };

        this.status = function () {
            return status;
        };

    };

    mdc.QueueManager.status = { IDLE: 1, BUSY: 2, ON_A_BREAK: 3 };

}());