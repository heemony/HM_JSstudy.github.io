// Layer 
(function (global, factory) {
    global;
    global.HM_Component = global.HM_Component || {};
    global.HM_Component.Layer = factory();
    console.log(global.HM_Component)
}(this, function () {
    'use strict';
    var Component = (function () {
        var win = window,
            doc = win.document,
            $ = win.jQuery,
            Util = win.Common.util,
            Mobile = win.Common.RESPONSIVE.MOBILE.WIDTH,
            TrapFoucs = win.TrapFocus;
        var LComponentInner = function (container, args) {
            var defParams = {
                obj: container, // 이 컨테이너는 Layer 인스턴스 생성한 Component.js보면 됨. '.btn_item'
                layerOpener: '.layer_btn',
                layerWrap: '.layer_popup',
                layerObj: '.layer_inner',
                layerCloseBtn: '.close_btn',
                layerConfirm: '.confirm_btn',
                isShow: 'is-show',
                viewType: null,
                useScrollLock: true,
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
                this.resizeFunc();
                this.bindGlobalEvent(true);
            },
            setElements: function () {
                this.layerOpener = this.obj.find(this.opts.layerOpener);
                this.layerWrap = this.obj.find(this.opts.layerWrap);
                this.layerObj = this.layerWrap.find(this.opts.layerObj);
                this.layerCloseBtn = this.obj.find(this.opts.layerCloseBtn);
                this.layerConfirm = this.obj.find(this.opts.layerConfirm);
            },
            bindGlobalEvent: function(type) {
                if (type) {
                    $(win).on('resize', this.resizeFunc.bind(this));
                } else {
                    $(win).off('resize')
                }
            },
             resizeFunc: function() {
                this.winWidth = $(win).width();
                
                // win.clearTimeout(this.resizeEndFunc);
                this.resizeEndFunc = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);   
            },
            resizeEndFunc: function() {
                console.log('resize end');
                this.setLayout();
            },
            setLayout: function() {
                if (this.winWidth > Mobile) {
                    if (this.opts.viewType != 'PC') {
                        console.log('PC')
                        this.opts.viewType = 'PC';
                        this.bindPcEvent(true);
                        this.bindMoEvent(false);
                    } 
                } else {
                    if (this.opts.viewType != 'MO') {
                        console.log('MO')
                        this.opts.viewType = 'MO';
                        this.bindPcEvent(false);
                        this.bindMoEvent(true);
                    }
                }
            },
            bindPcEvent: function (type) {
                if (type) {
                    this.layerOpener.on('click', this.layerOpenFunc.bind(this));
                    this.layerCloseBtn.on('click', this.layerCloseFunc.bind(this));
                    this.layerConfirm.on('click', this.layerCloseFunc.bind(this));
                    this.layerWrap.on('click', this.exceptArea.bind(this));
                } else {
                    this.layerOpener.off('click');
                    this.layerCloseBtn.off('click');
                    this.layerConfirm.off('click');
                    this.layerWrap.off('click');
                }
            },
            bindMoEvent: function (type) {
                if (type) {
                    this.layerOpener.on('click', this.layerOpenFunc.bind(this));
                    this.layerCloseBtn.on('click', this.layerCloseFunc.bind(this));
                    this.layerConfirm.on('click', this.layerCloseFunc.bind(this));
                    this.layerWrap.on('click', this.exceptArea.bind(this));
                    this.setScrollLock(true);
                } else {
                    this.layerOpener.off('click');
                    this.layerCloseBtn.off('click');
                    this.layerConfirm.off('click');
                    this.layerWrap.off('click');
                    this.setScrollLock(false);
                }
            },
            exceptArea: function(e) {
                e.stopPropagation();
                if ($(e.target).hasClass('dimmed')) {
                    this.layerCloseFunc();
                    return;
                }
            },    
            layerOpenFunc: function (e) {
                e.preventDefault();
                this.TrapFocus.build();
                this.layerWrap.addClass(this.opts.isShow);
            },
            buildTrapFocus: function () {
                var _this = this;
                Util.def(this, {
                    TrapFocus: {
                        instance: null,
                        destroy: function () {
                            if (this.instance === null) return;
                            this.instance.destroy();
                            _this.setScrollLock(false);
                            this.instance = null;
                            console.log('Layer.js: TrapFocus destroy')
                        },
                        build: function () {
                            this.instance = new TrapFoucs(_this.layerObj);
                            _this.setScrollLock(true);
                            console.log('Layer.js: TrapFocus build');
                        }
                    }
                })
            },
            setScrollLock: function (type) {
                if (!this.opts.useScrollLock) return;
                Util.scrollLock(type);
                this.setWidth(type);
            },
            layerCloseFunc: function () {
                this.layerWrap.removeClass(this.opts.isShow);
                this.TrapFocus.destroy();
            },
            setWidth: function (type) {
                if (type) {
                    $("html, body").css({ "height": "auto" });
                    $("html").css({ "overflow": "hidden" });
                    $("body").css({ "overflow-y": "scroll" });
                } else {
                    $("html, body").removeAttr("style");
                }
            },

        }
        return LComponentInner;
    })();
    return Component;
}));