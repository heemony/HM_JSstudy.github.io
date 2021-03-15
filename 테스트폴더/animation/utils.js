var hasOwnProperty = Object.prototype.hasOwnProperty;
var win = window;
var $ = win.jQuery;
var doc = win.document;

var Utils = {
    isObject : function (o) {
        return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    def : function () {
        var args = [], len$1 = arguments.length;
        while ( len$1-- ) args[ len$1 ] = arguments[ len$1 ];
        var to = Object(args[0]);
        for (var i = 1; i < args.length; i += 1) {
            var nextSource = args[i];
            if (nextSource !== undefined && nextSource !== null) {
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        if (this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                            this.def(to[nextKey], nextSource[nextKey]);
                        } else if (!this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                            to[nextKey] = {};
                            this.def(to[nextKey], nextSource[nextKey]);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
        }
        return to;
    },
    winSize : (function () {
        var isWinSafari = (function () {
            var appNetscape = (navigator.appName === "Netscape"),
                appVersionMac = (navigator.appVersion.indexOf("Mac") !== -1),
                userAgentSafari = (navigator.userAgent.indexOf("Safari") !== -1),
                userAgentChrome = (navigator.userAgent.indexOf("Chrome") !== -1);
            return (appNetscape && !appVersionMac && userAgentSafari && !userAgentChrome);
        })();
        if (isWinSafari) {
            return function () {
                var win_wh = {
                    w : $(win).width(),
                    h : $(win).height()
                };
                return win_wh;
            }
        } else {
            return function () {
                var win_wh = {
                    w : win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
                    h : win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
                };
                return win_wh;
            }
        }
    })(),
    requestAFrame : (function () {
        return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame ||
            function (callback) {
                return win.setTimeout(callback, 1000 / 60);
            };
    })(),
    cancelAFrame : (function () {
        return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame ||
            function (id) {
                win.clearTimeout(id);
            };
    })(),
    imgLoaded : function (selector) {
        var deferred = $.Deferred();
        if (selector.length) {
            var imgs = selector.find('img'),
                imgs = selector[0].tagName === 'IMG' ? imgs.add(selector) : imgs,
                minLength = 0,
                maxLength = imgs.length,
                data = {},
                dataFunc = function (index, element) {
                    data[index] = {
                        IMG : element
                    };
                },
                completeFunc = function () {
                    if (minLength === maxLength) {
                        deferred.resolve(data);
                    }
                };
            if (!maxLength) {
                completeFunc();
            } else {
                for (var i = 0, max = maxLength; i < max; i++) {
                    (function (index) {
                        var img = imgs.eq(index),
                            imgDOM = img[0];
                        if (imgDOM.complete || img.height() > 0) {
                            dataFunc(minLength, imgDOM);
                            minLength++;
                            completeFunc();
                        } else {
                            img.on('load error', function () {
                                dataFunc(minLength, imgDOM);
                                minLength++;
                                completeFunc();
                                img.off('load error');
                            });
                        }
                    })(i);
                }
            }
        } else {
            deferred.resolve();
        }
        return deferred.promise();
    }
};
