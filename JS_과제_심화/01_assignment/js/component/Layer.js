// Layer
(function (global, factory) {
    global;
    global.HM_Component = global.HM_Component || {};
    global.HM_Component.Layer = factory();
})(this, function () {
    "use strict";
    var Component = (function () {
        var win = window,
            doc = win.document,
            $ = win.jQuery,
            Util = win.Common.util,
            Mobile = win.Common.RESPONSIVE.MOBILE.WIDTH,
            TrapFocus = win.TrapFocus;

        var LComponentInner = function (container, args) {
            var defParams = {
                obj: container, // 이 컨테이너는 Layer 인스턴스 생성한 Component.js보면 됨. '.btn_item'
                layerOpener: ".layer_btn",
                layerWrap: ".layer_popup",
                layerObj: ".layer_inner",
                layerCloseBtn: ".close_btn",
                layerConfirm: ".confirm_btn",
                isShow: "is-show",
                isLayerOpened: false,
                viewType: null,
                customEvent: ".Layer" + new Date().getTime() + Math.random(),
            };
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        };
        LComponentInner.prototype = {
            init: function () {
                this.setElements();
                this.buildTrapFocus();
                this.bindEvent();
                this.bindGlobalEvent(true);
                this.resizeFunc();
            },
            setElements: function () {
                this.layerOpener = this.obj.find(this.opts.layerOpener);
                this.layerWrap = this.obj.find(this.opts.layerWrap);
                this.layerObj = this.layerWrap.find(this.opts.layerObj);
                this.layerCloseBtn = this.obj.find(this.opts.layerCloseBtn);
                this.layerConfirm = this.obj.find(this.opts.layerConfirm);
            },
            buildTrapFocus: function () {
                var _this = this;
                Util.def(this, {
                    TrapFocus: {
                        instance: null,
                        destroy: function () {
                            if (this.instance === null) return;
                            this.instance.destroy();
                            this.instance = null;
                        },
                        build: function () {
                            this.instance = new TrapFocus(_this.layerObj);
                        },
                    },
                });
            },
            bindGlobalEvent: function (type) {
                if (type) {
                    $(win).on("resize", this.resizeFunc.bind(this));
                } else {
                    $(win).off("resize");
                }
            },
            bindEvent: function (type) {
                this.layerOpener.on("click", this.layerOpenFunc.bind(this));
                this.layerCloseBtn.on("click", this.layerCloseFunc.bind(this));
                this.layerConfirm.on("click", this.layerCloseFunc.bind(this));
                this.layerWrap.on("click", this.exceptArea.bind(this));
            },
            resizeFunc: function () {
                this.winWidth = $(win).width();

                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc: function () {
                console.log("resize end");
                this.setLayout();
            },
            setLayout: function () {
                if (this.winWidth > Mobile) {
                    if (this.opts.viewType != "PC") {
                        this.opts.viewType = "PC";
                        if (this.opts.isLayerOpened) {
                            this.setScrollLock(false);
                            this.setWidth(true);
                        }
                    }
                } else {
                    if (this.opts.viewType != "MO") {
                        this.opts.viewType = "MO";
                        if (this.opts.isLayerOpened) {
                            this.setScrollLock(true);
                            this.setWidth(false);
                        }
                    }
                }
            },
            exceptArea: function (e) {
                e.stopPropagation();
                if ($(e.target).hasClass("dimmed")) {
                    this.layerCloseFunc();
                    return;
                }
            },
            layerOpenFunc: function (e) {
                e.preventDefault();
                this.TrapFocus.build();
                this.opts.isLayerOpened = true;
                this.scrollLockActiveFunc(this.opts.viewType);

                this.layerWrap.addClass(this.opts.isShow);
            },
            layerCloseFunc: function () {
                this.layerWrap.removeClass(this.opts.isShow);
                this.opts.isLayerOpened = false;
                this.scrollLockActiveFunc(this.opts.viewType, "close");
                $("html, body").removeAttr("style");

                this.TrapFocus.destroy();
            },
            scrollLockActiveFunc: function (viewType, type) {
                var bool = true;
                if (type == "close") {
                    bool = !bool;
                }

                if (viewType == "MO") {
                    this.setScrollLock(bool);
                } else if (viewType == "PC") {
                    this.setWidth(bool);
                }
            },
            setScrollLock: function (type) {
                Util.scrollLock(type);
                console.log("setScrollLock TYPE", type);
            },
            setWidth: function (type) {
                console.log("setWidth TYPE", type);
                if (type) {
                    $("html, body").css({
                        height: "auto"
                    });
                    $("html").css({
                        overflow: "hidden"
                    });
                    $("body").css({
                        "overflow-y": "scroll"
                    });
                } else {
                    $("html, body").removeAttr("style");
                }
            },
        };
        return LComponentInner;
    })();
    return Component;
});