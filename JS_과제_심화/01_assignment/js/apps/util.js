// UTIL
(function (global, factory) {
    global = global;
    global.Common = factory();
})(this, function () {
    "use strict";
    var Common = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            win = window,
            $ = win.jQuery,
            doc = win.document;
        return {
            // util.def가 fn이라는 제이쿼리 함수가 있는데. '머지'시키는 것임.
            // 'Clone object' 임.
            util: {
                isObject: function (o) {
                    return (
                        typeof o === "object" &&
                        o !== null &&
                        o.constructor &&
                        o.constructor === Object
                    );
                },
                def: function () {
                    var args = [],
                        len$1 = arguments.length;
                    while (len$1--) args[len$1] = arguments[len$1];
                    var to = Object(args[0]);
                    for (var i = 1; i < args.length; i += 1) {
                        var nextSource = args[i];
                        if (nextSource !== undefined && nextSource !== null) {
                            var keysArray = Object.keys(Object(nextSource));
                            for (
                                var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1
                            ) {
                                var nextKey = keysArray[nextIndex];
                                var desc = Object.getOwnPropertyDescriptor(
                                    nextSource,
                                    nextKey
                                );
                                if (desc !== undefined && desc.enumerable) {
                                    if (
                                        this.isObject(to[nextKey]) &&
                                        this.isObject(nextSource[nextKey])
                                    ) {
                                        console.log(this);
                                        this.def(
                                            to[nextKey],
                                            nextSource[nextKey]
                                        );
                                    } else if (
                                        !this.isObject(to[nextKey]) &&
                                        this.isObject(nextSource[nextKey])
                                    ) {
                                        to[nextKey] = {};
                                        this.def(
                                            to[nextKey],
                                            nextSource[nextKey]
                                        );
                                    } else {
                                        to[nextKey] = nextSource[nextKey];
                                    }
                                }
                            }
                        }
                    }
                    return to;
                },
                winSize: (function () {
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
                                w: $(win).width(),
                                h: $(win).height()
                            };
                            return win_wh;
                        }
                    } else {
                        return function () {
                            var win_wh = {
                                w: win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
                                h: win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
                            };
                            return win_wh;
                        }
                    }
                })(),
                requestAFrame: (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame ||
                        function (callback) {
                            return win.setTimeout(callback, 1000 / 60);
                        };
                })(),
                cancelAFrame: (function () {
                    return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame ||
                        function (id) {
                            win.clearTimeout(id);
                        };
                })(),
                scrollParams: {
                    scrollLockType: true,
                    scrollLockClass: "is-scroll-lock",
                    scrollLockOpts: {
                        scrollLocked: false,
                        lockElements: "html",
                        appliedLock: {},
                        prevStyles: {},
                        prevScroll: {},
                        lockStyles: {
                            position: "fixed",
                            width: "100%",
                        },
                    },
                },
                scrollMethods: {
                    saveStyles: function () {
                        var scrollParams = this.scrollParams,
                            styleStrs = [],
                            styleHash = {},
                            lockOpts = scrollParams.scrollLockOpts,
                            lockElements = $(lockOpts.lockElements),
                            styleAttr = lockElements.attr("style");
                        if (!styleAttr) return;
                        styleStrs = styleAttr.split(";");
                        $.each(styleStrs, function styleProp(styleString) {
                            var styleString = styleStrs[styleString];
                            if (!styleString) return;
                            var keyValue = styleString.split(":");
                            if (keyValue.length < 2) return;
                            styleHash[$.trim(keyValue[0])] = $.trim(
                                keyValue[1]
                            );
                        });
                        $.extend(lockOpts.prevStyles, styleHash);
                    },
                    saveScrolls: function () {
                        var scrollParams = this.scrollParams,
                            lockOpts = scrollParams.scrollLockOpts;
                        lockOpts.prevScroll = {
                            scrollLeft: $(win).scrollLeft(),
                            scrollTop: $(win).scrollTop(),
                        };
                    },
                },
                scrollLock: function (type) {
                    console.log(type);
                    var scrollParams = this.scrollParams,
                        scrollMethods = this.scrollMethods;
                    if (!scrollParams.scrollLockType) return;
                    var lockClass = scrollParams.scrollLockClass,
                        lockOpts = scrollParams.scrollLockOpts,
                        lockElements = $(lockOpts.lockElements);
                    lockElements.toggleClass(lockClass, type);
                    if (type) {
                        // if (this.isDevice && this.isIOS) {
                        if (
                            lockOpts.scrollLocked ||
                            lockElements.data("lockScroll") != null
                        )
                            return;
                        lockOpts.appliedLock = {};
                        scrollMethods.saveStyles.call(this);
                        scrollMethods.saveScrolls.call(this);
                        $.extend(lockOpts.appliedLock, lockOpts.lockStyles, {
                            left: -lockOpts.prevScroll.scrollLeft,
                            top: -lockOpts.prevScroll.scrollTop,
                        });
                        lockElements.css(lockOpts.appliedLock);
                        lockElements.data("lockScroll", {
                            left: lockOpts.prevScroll.scrollLeft,
                            top: lockOpts.prevScroll.scrollTop,
                        });
                        lockOpts.scrollLocked = true;
                        // }
                    } else {
                        // if (this.isDevice && this.isIOS) {
                        if (
                            !lockOpts.scrollLocked ||
                            lockElements.data("lockScroll") == null
                        )
                            return;
                        scrollMethods.saveStyles.call(this);
                        for (var key in lockOpts.appliedLock) {
                            delete lockOpts.prevStyles[key];
                        }
                        lockElements.attr(
                            "style",
                            $("<x>").css(lockOpts.prevStyles).attr("style") ||
                            ""
                        );
                        lockElements.data("lockScroll", null);
                        $(win)
                            .scrollLeft(lockOpts.prevScroll.scrollLeft)
                            .scrollTop(lockOpts.prevScroll.scrollTop);
                        lockOpts.scrollLocked = false;
                        // }
                    }
                },
                scrollExtend: function (obj) {
                    obj.scrollParams = this.scrollParams;
                    obj.scrollMethods = this.scrollMethods;
                    obj.scrollLock = this.scrollLock;
                },
            },
            RESPONSIVE: {
                MOBILE: {
                    NAME: "mobile",
                    WIDTH: 768,
                },
            },
        };
    })();
    return Common;
});

// Trap Focus
(function (global, factory) {
    global = global;
    global.TrapFocus = factory();
})(this, function () {
    "use strict";
    var TrapFocus = (function (isUndefined) {
        var win = window,
            doc = win.document,
            $ = win.jQuery,
            hasTrap = null,
            Util = win.Common.util;

        function TrapFocus(container, args) {
            if (!(this instanceof TrapFocus)) {
                return new TrapFocus(container, args);
            }
            var defParams = {
                obj: container,
                isDestroy: false,
                IgnoreUtilFocusChanges: false,
                ariaAttr: {
                    hidden: "aria-hidden",
                    disabled: "aria-disabled",
                    modal: "aria-modal",
                },
                classAttr: {
                    clone: "trapfocus",
                },
                elAttr: {
                    tabIndex: "tabindex",
                    role: "role",
                },
                customEvent: ".TrapFocus" + new Date().getTime() + Math.random(),
            };
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            if (hasTrap != null) {
                hasTrap.destroy();
            }
            hasTrap = this;
            this.init();
        }
        TrapFocus.prototype = {
            init: function () {
                this.initLayout();
                this.buildAria();
                this.buildTrapFocus();
                this.bindEvents(true);
                this.loadComponent();
                this.obj.data("TrapFocus", this);
            },
            initLayout: function () {
                var ariaAttr = this.opts.ariaAttr;
                var elAttr = this.opts.elAttr;
                this.obj.attr(ariaAttr.modal, "true");
            },
            buildAria: function () {
                var ariaAttr = this.opts.ariaAttr;
                var elAttr = this.opts.elAttr;
                Util.def(this, {
                    aria: {
                        notHidden: [
                            "head, script, noscript, link, style, meta",
                        ],
                        focusType: [
                            "A",
                            "BUTTON",
                            "INPUT",
                            "SELECT",
                            "TEXTAREA",
                        ],
                        dataAttr: {
                            ariaHidden: "trapfocusariahidden",
                            ariaDisabled: "trapfocusariadisabled",
                            tabIndex: "trapfocustabindex",
                            role: "trapfocusrole",
                        },
                        destroy: $.proxy(function () {
                            var dataAttr = this.aria.dataAttr;
                            var hiddenEls = this.aria.hiddenEls;
                            var focusEls = this.aria.focusEls;
                            var tabindexEls = this.aria.tabindexEls;

                            // aria-hidden
                            for (
                                var hMin = 0, hMax = hiddenEls.length; hMin < hMax; hMin++
                            ) {
                                (function (h_index) {
                                    var hiddenEl = hiddenEls.eq(h_index),
                                        ariaCondition = hiddenEl.data(
                                            dataAttr.ariaHidden
                                        ),
                                        elCondition = hiddenEl.data(
                                            dataAttr.role
                                        );
                                    if (ariaCondition != isUndefined) {
                                        hiddenEl.attr(
                                            ariaAttr.hidden,
                                            ariaCondition
                                        );
                                        hiddenEl.removeData(
                                            dataAttr.ariaHidden
                                        );
                                    } else {
                                        hiddenEl.removeAttr(ariaAttr.hidden);
                                    }
                                    if (elCondition != isUndefined) {
                                        hiddenEl.attr(elAttr.role, elCondition);
                                        hiddenEl.removeData(dataAttr.role);
                                    } else {
                                        hiddenEl.removeAttr(elAttr.role);
                                    }
                                })(hMin);
                            }

                            // aria-disabled
                            for (
                                var fMin = 0, fMax = focusEls.length; fMin < fMax; fMin++
                            ) {
                                (function (f_index) {
                                    var focusEl = focusEls.eq(f_index),
                                        ariaCondition = focusEl.data(
                                            dataAttr.ariaDisabled
                                        );
                                    if (ariaCondition != isUndefined) {
                                        focusEl.attr(
                                            ariaAttr.disabled,
                                            ariaCondition
                                        );
                                        focusEl.removeData(
                                            dataAttr.ariaDisabled
                                        );
                                    } else {
                                        focusEl.removeAttr(ariaAttr.disabled);
                                    }
                                })(fMin);
                            }

                            // tabindex
                            for (
                                var tMin = 0, tMax = tabindexEls.length; tMin < tMax; tMin++
                            ) {
                                (function (t_index) {
                                    var tabindexEl = tabindexEls.eq(t_index),
                                        ariaCondition = tabindexEl.data(
                                            dataAttr.tabIndex
                                        );
                                    if (ariaCondition != isUndefined) {
                                        tabindexEl.attr(
                                            elAttr.tabIndex,
                                            ariaCondition
                                        );
                                        tabindexEl.removeData(
                                            dataAttr.tabIndex
                                        );
                                    } else {
                                        tabindexEl.removeAttr(elAttr.tabIndex);
                                    }
                                })(tMin);
                            }
                        }, this),
                        build: $.proxy(function () {
                            var _this = this;
                            var focusTypes = this.aria.focusType;
                            var dataAttr = this.aria.dataAttr;
                            var objParents = this.obj.parents();
                            var hiddenEls = this.obj
                                .siblings()
                                .not(_this.aria.notHidden.join(","));
                            var focusEls = $("<x>");
                            var tabindexEls = $("<x>");
                            for (
                                var i = 0, max = objParents.length; i < max; i++
                            ) {
                                (function (index) {
                                    var _target = objParents.eq(index);
                                    hiddenEls = hiddenEls.add(
                                        _target
                                        .siblings()
                                        .not(_this.aria.notHidden.join(","))
                                    );
                                })(i);
                            }
                            focusEls = focusEls.add(hiddenEls);
                            tabindexEls = tabindexEls.add(hiddenEls);
                            this.obj.removeAttr(ariaAttr.hidden);

                            // aria-hidden
                            for (
                                var hMin = 0, hMax = hiddenEls.length; hMin < hMax; hMin++
                            ) {
                                (function (h_index) {
                                    var hiddenEl = hiddenEls.eq(h_index),
                                        ariaCondition = hiddenEl.attr(
                                            ariaAttr.hidden
                                        ),
                                        elCondition = hiddenEl.attr(
                                            elAttr.role
                                        );
                                    if (ariaCondition != isUndefined) {
                                        hiddenEl.data(
                                            dataAttr.ariaHidden,
                                            ariaCondition
                                        );
                                    }
                                    if (elCondition != isUndefined) {
                                        hiddenEl.data(
                                            dataAttr.role,
                                            elCondition
                                        );
                                    }
                                    hiddenEl.attr(ariaAttr.hidden, "true");
                                    hiddenEl.attr(
                                        elAttr.role,
                                        "none presentation"
                                    );
                                })(hMin);
                            }

                            // aria-disabled
                            focusEls = focusEls.add(
                                hiddenEls.find(
                                    focusTypes.join(",").toLowerCase()
                                )
                            );
                            for (
                                var fMin = 0, fMax = focusEls.length; fMin < fMax; fMin++
                            ) {
                                (function (f_index) {
                                    var focusEl = focusEls.eq(f_index),
                                        ariaCondition = focusEl.attr(
                                            ariaAttr.disabled
                                        );
                                    if (ariaCondition != isUndefined) {
                                        focusEl.data(
                                            dataAttr.ariaDisabled,
                                            ariaCondition
                                        );
                                    }
                                    focusEl.attr(ariaAttr.disabled, "true");
                                })(fMin);
                            }

                            // tabindex
                            tabindexEls = tabindexEls.add(
                                hiddenEls.find("[" + elAttr.tabIndex + "]")
                            );
                            for (
                                var tMin = 0, tMax = tabindexEls.length; tMin < tMax; tMin++
                            ) {
                                (function (t_index) {
                                    var tabindexEl = tabindexEls.eq(t_index),
                                        ariaCondition = tabindexEl.attr(
                                            elAttr.tabIndex
                                        );
                                    if (ariaCondition != isUndefined) {
                                        tabindexEl.data(
                                            dataAttr.tabIndex,
                                            ariaCondition
                                        );
                                    }
                                    tabindexEl.attr(elAttr.tabIndex, -1);
                                })(tMin);
                            }

                            this.aria.hiddenEls = hiddenEls;
                            this.aria.focusEls = focusEls;
                            this.aria.tabindexEls = tabindexEls;
                        }, this),
                    },
                });
            },
            buildTrapFocus: function () {
                Util.def(this, {
                    focusel: {
                        destroy: $.proxy(function () {
                            var cloneClass = "." + this.opts.classAttr.clone;
                            this.obj.prev(cloneClass).remove();
                            this.obj.next(cloneClass).remove();
                        }, this),
                        build: $.proxy(function () {
                            var css = {
                                overflow: "hidden",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                "z-index": -1,
                                width: 1,
                                height: 1,
                                "font-size": "1px",
                                "line-height": 0,
                            };
                            var trapFocus = $(
                                '<div class="' +
                                this.opts.classAttr.clone +
                                '" tabindex="0"></div>'
                            ).css(css);
                            this.obj.before(trapFocus.clone());
                            this.obj.after(trapFocus.clone());
                        }, this),
                    },
                });
            },
            changeEvents: function (event) {
                var events = [],
                    eventNames = event.split(" ");
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(" ");
            },
            bindEvents: function (type) {
                if (type) {
                    $(doc).on(
                        this.changeEvents("focusin"),
                        $.proxy(this.trapFocus, this)
                    );
                } else {
                    $(doc).off(this.changeEvents("focusin"));
                }
            },
            focusFirstDescendant: function (element) {
                for (var i = 0; i < element.childNodes.length; i++) {
                    var child = element.childNodes[i];
                    if (
                        this.attemptFocus(child) ||
                        this.focusFirstDescendant(child)
                    ) {
                        return true;
                    }
                }
                return false;
            },
            focusLastDescendant: function (element) {
                for (var i = element.childNodes.length - 1; i >= 0; i--) {
                    var child = element.childNodes[i];
                    if (
                        this.attemptFocus(child) ||
                        this.focusLastDescendant(child)
                    ) {
                        return true;
                    }
                }
                return false;
            },
            isFocusable: function (element) {
                if (
                    element.tabIndex > 0 ||
                    (element.tabIndex === 0 &&
                        element.getAttribute("tabIndex") !== null)
                ) {
                    return true;
                }
                if (element.disabled) {
                    return false;
                }
                switch (element.nodeName) {
                    case "A":
                        return !!element.href && element.rel != "ignore";
                    case "INPUT":
                        return (
                            element.type != "hidden" && element.type != "file"
                        );
                    case "BUTTON":
                    case "SELECT":
                    case "TEXTAREA":
                    case "VIDEO":
                    case "SOURCE":
                    case "IFRAME":
                        return true;
                    default:
                        return false;
                }
            },
            attemptFocus: function (element) {
                if (this.opts.isDestroy) return;
                if (!this.isFocusable(element)) {
                    return false;
                }
                this.opts.IgnoreUtilFocusChanges = true;
                try {
                    element.focus();
                } catch (e) {}
                this.opts.IgnoreUtilFocusChanges = false;
                return document.activeElement === element;
            },
            trapFocus: function (e) {
                if (this.opts.isDestroy) return;
                if (this.opts.IgnoreUtilFocusChanges) {
                    return;
                }
                var currentDialog = this.obj[0];
                if (currentDialog.contains(e.target)) {
                    this.lastFocus = e.target;
                } else {
                    this.focusFirstDescendant(currentDialog);
                    if (this.lastFocus == document.activeElement) {
                        this.focusLastDescendant(currentDialog);
                    }
                    this.lastFocus = document.activeElement;
                }
            },
            loadComponent: function () {
                this.focusFirstDescendant(this.obj[0]);
                this.lastFocus = document.activeElement;
                this.aria.build();
                this.focusel.build();
            },
            destroy: function () {
                hasTrap = null;
                this.opts.isDestroy = true;
                var ariaAttr = this.opts.ariaAttr;
                var elAttr = this.opts.elAttr;
                this.bindEvents(false);
                this.focusel.destroy();
                this.aria.destroy();
                this.obj.removeAttr(ariaAttr.modal);
            },
        };
        return TrapFocus;
    })();
    return TrapFocus;
});