// Layer 
(function (global, factory) {
    global;
    global.HM_Component = global.HM_Component || {};
    global.HM_Component.Layer = factory();
}(this, function () {
    'use strict';
    var Component = (function () {
        var win = window,
            doc = win.document,
            $ = win.jQuery,
            Util = win.Common.util,
            RESPONSIVE = win.Common.RESPONSIVE,
            // Mobile = RESPONSIVE.MOBILE.WIDTH,
            Mobile = win.Common.RESPONSIVE.MOBILE.WIDTH,
            TrapFocus = win.TrapFocus;

        var LComponentInner = function (container, args) {
            var defParams = {
                obj: container, // 이 컨테이너는 Layer 인스턴스 생성한 Component.js보면 됨. '.btn_item'
                layerOpener: '.layer_btn',
                layerWrap: '.layer_popup',
                layerObj: '.layer_inner',
                layerCloseBtn: '.close_btn',
                layerConfirm: '.confirm_btn',
                isShow: 'is-show',
                isLayerOpened: false,
                viewType: null,
                customEvent: '.Layer' + (new Date()).getTime() + Math.random(),
            }
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        LComponentInner.prototype = {
            init: function () {
                this.setElements();
                this.buildTrapFocus();
                this.bindGlobalEvent(true);
                this.bindEvent();
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
                        }
                    }
                })
            },
            bindGlobalEvent: function (type) {
                if (type) {
                    $(win).on('resize', this.resizeFunc.bind(this));
                } else {
                    $(win).off('resize');
                }
            },
            bindEvent: function () {
                this.layerOpener.on('click', this.layerOpenFunc.bind(this));
                this.layerCloseBtn.on('click', this.layerCloseFunc.bind(this));
                this.layerConfirm.on('click', this.layerCloseFunc.bind(this));
                this.layerWrap.on('click', this.exceptArea.bind(this));
            },
            resizeFunc: function () {
                this.winWidth = Util.winSize().w;

                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }

                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout(this.resizeEndFunc.bind(this), 50);
            },
            resizeEndFunc: function () {
                this.opts.resizeStart = null;
                this.setLayout();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc: function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, this.resizeAnimateFunc.bind(this));
                console.log('rf: ', this.resizeRequestFrame)
            },
            setLayout: function () {
                if (this.winWidth > Mobile) {
                    if (this.opts.viewType != 'PC') {
                        this.opts.viewType = 'PC';
                        if (this.opts.isLayerOpened) {
                            console.log(this.opts.isLayerOpened)
                            this.setWidth(true);
                            this.setScrollLock(false);
                        }
                    }
                } else {
                    if (this.opts.viewType != 'MO') {
                        this.opts.viewType = 'MO';
                        if (this.opts.isLayerOpened) {
                            console.log(this.opts.isLayerOpened)
                            this.setWidth(false);
                            this.setScrollLock(true);
                        }
                    }
                }
            },
            exceptArea: function (e) {
                e.stopPropagation();
                if ($(e.target).hasClass('dimmed')) {
                    this.layerCloseFunc();
                    return;
                }
            },
            layerOpenFunc: function (e) {
                e.preventDefault();
                this.TrapFocus.build();
                this.opts.isLayerOpened = true;

                if (this.opts.viewType == "PC") {
                    if (!this.opts.isLayerOpened) return;
                    this.setWidth(this.opts.isLayerOpened);
                } else if (this.opts.viewType == "MO") {
                    if (!this.opts.isLayerOpened) return;
                    this.setScrollLock(this.opts.isLayerOpened);
                }

                this.layerWrap.addClass(this.opts.isShow);
            },
            layerCloseFunc: function () {
                this.layerWrap.removeClass(this.opts.isShow);
                this.opts.isLayerOpened = false;

                if (this.opts.viewType == "PC") {
                    if (!this.opts.isLayerOpened) {
                        this.setWidth(this.opts.isLayerOpened);
                    }
                } else if (this.opts.viewType == "MO") {
                    if (!this.opts.isLayerOpened) {
                        this.setScrollLock(this.opts.isLayerOpened);
                    }
                }

                $("html, body").removeAttr("style");

                this.TrapFocus.destroy();
            },
            setScrollLock: function (type) {
                Util.scrollLock(type);
            },
            setWidth: function (type) {
                console.log('setWidth 넘어오는값', type);
                if (type) {
                    $("html, body").css({
                        "height": "auto"
                    });
                    $("html").css({
                        "overflow": "hidden"
                    });
                    $("body").css({
                        "overflow-y": "scroll"
                    });
                } else {
                    $("html, body").removeAttr("style");
                }
            },
        }
        return LComponentInner;
    })();
    return Component;
}));