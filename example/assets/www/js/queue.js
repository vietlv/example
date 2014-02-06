/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        q, idIndex, attachItemEventHandlers, buildIdIndex, onItemSent, onItemNotSent;

    mdc.queue = {
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

    mdc.queueStatus = {
            IDLE: 0,
            SENDING: 1,
            SENT: 2,
            DELAYED: 3,
            CANCELLED: 4
    };

    mdc.QueueItem = function (pack) {

        this.id = uniqueId({ useLocation: false });
        this.created = pack.modified || $.now();
        this.pack = pack;

    };

    mdc.QueueItem.prototype = {

            status: mdc.queueStatus.IDLE,

            lastAttempt: null,

            remove: function () {
                this.status = mdc.queueStatus.CANCELLED;
                $(this).triggerHandler("removeMe");
                return this;
            },

            delay: function () {
                this.status = mdc.queueStatus.DELAYED;
                return this;
            },

            send: function () {
                var dfrd = new $.Deferred(), that = this;

                LOG && console.log("queue item: sending.");

                this.status = mdc.queueStatus.SENDING;
                $(this).triggerHandler("sending", [this]);

                this.pack.send()
                .done(function () {
                    that.status = mdc.queueStatus.SENT;
                    $(that).triggerHandler("sent", [that]);
                    dfrd.resolveWith(that);
                })
                .fail(function (err) {
                    that.status = mdc.queueStatus.IDLE;
                    that.lastAttempt = $.now();
                    $(that).triggerHandler("notSent", [that]);
                    dfrd.rejectWith(that, [err]);
                });

                return dfrd.promise();
            },

            extractPackageData: function (p) {
                p = p || this.pack;
                return {
                    id: p.id,
                    modified: p.modified,
                    mapId: p.mapId,
                    layerId: p.layerId,
                    items: $.map(p.items, function (item) {
                        return {
                            name: item.name,
                            key: item.key,
                            target: item.target,
                            type: item.type,
                            loadType: item.loadType,
                            value: item.value
                        };
                    })
                };
            }
    };

    mdc.Queue = function (restore) {

        if (restore) {
            this.restore();
        } else {
            idIndex = {};
            q = [];
        }

    };

    mdc.Queue.prototype = {

            store: function () {
                LOG && console.log("queue: storing queue.");
                var arr = $.map(q, function (queueItem) {
                    return queueItem.extractPackageData();
                });
                DETAIL && console.log(JSON.stringify(arr));
                mdc.storage.value("packagesQueue", arr);
                return this;
            },

            restore: function () {
                var arr, that = this;
                LOG && console.log("queue: restoring queue.");
                arr = mdc.storage.value("packagesQueue") || [];
                DETAIL && console.log(JSON.stringify(arr));

                q = $.map(arr, function (data) {
                    return new mdc.QueueItem(mdc.packages.restore(data));
                });

                buildIdIndex();

                // attach item event handlers
                $.each(q, function (i, item) {
                    attachItemEventHandlers.call(that, item);
                });

                return this;
            },

            length: function () {
                LOG && console.log("queue: queue length is " + q.length);
                return q.length;
            },

            addItem: function (item) {
                LOG && console.log("queue: adding item.");
                DETAIL && console.log(JSON.stringify(item.extractPackageData()));

                idIndex[item.id] = q.length;
                q.push(item);
                attachItemEventHandlers.call(this, item);
                this.store();
                $(this).triggerHandler("added.queue", [item]);
                $(mdc).triggerHandler("added.queue", [item]);
            },

            removeItem: function (indexOrId) {
                var index, item;
                LOG && console.log("queue: removing item.");

                if (typeof indexOrId === "number") {
                    index = indexOrId;
                } else {
                    index = idIndex[indexOrId];
                }
                item = q.splice(index, 1);
                buildIdIndex();
                this.store();
                $(mdc).triggerHandler("removed.queue", [item]);
                $(this).triggerHandler("removed.queue", [item]);
            },

            item: function (indexOrId) {
                var index;

                if (typeof indexOrId === "number") {
                    index = indexOrId;
                } else {
                    index = idIndex[indexOrId];
                }

                return q[index] || null;
            },

            currentItemIndex: 0,

            next: function () {
                var item, k = q.length;

                if (k === 0) {
                    return null;
                }

                this.currentItemIndex = this.currentItemIndex % k;
                item = q[this.currentItemIndex];
                this.currentItemIndex++;

                LOG && console.log("queue: getting next item.");

                if (item.status === mdc.queueStatus.IDLE) {
                    DETAIL && console.log(JSON.stringify({ id: item.id, data: item.pack.items }));
                    return item;
                }

                return null;
            }

    };

    buildIdIndex = function () {
        var i, k;
        LOG && console.log("queue: building index");

        idIndex = {};

        for (i = 0, k = q.length; i < k; i++) {
            idIndex[q[i].id] = i;
        }
    };

    attachItemEventHandlers = function (item) {
        var that = this;

        $(item).on({
            "removeMe": function () { that.removeItem(this.id); },
            "sending": $.proxy(onItemSending, this),
            "sent": $.proxy(onItemSent, this),
            "notSent": $.proxy(onItemNotSent, this)
        });
    };

    onItemSending = function (jqEvt, item) {
        LOG && console.log("queue: item sending.");
        $(this).triggerHandler("itemSending", [item]);
    };

    onItemSent = function (jqEvt, item) {
        LOG && console.log("queue: item sent.");
        item.remove();
        $(this).triggerHandler("itemSent", [item]);
    };

    onItemNotSent = function (jqEvt, item) {
        LOG && console.log("queue: item not sent.");
        $(this).triggerHandler("itemNotSent", [item]);
    };

}());