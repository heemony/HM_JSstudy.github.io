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
            TrapFoucss = win.TrapFocus;

        // RESPONSIVE = Util.RESPONSIVE; <- 이게 안되는 이유는?
        var ComponentInner = function (container, args) {
            var defParams = {
                obj: container, // 이 컨테이너는 Layer 인스턴스 생성한 Component.js보면 됨. '.btn_item'
                layerOpener: '.layer_btn',
                layerWrap: '.layer_popup',
                layerObj: '.layer_inner',
                layerCloseBtn: '.close_btn',
                layerConfirm: '.confirm_btn',
                isShow: 'is-show',
                useScrollLock: true,
                customEvent: '.Layer' + (new Date()).getTime() + Math.random(),
            }
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        ComponentInner.prototype = {
            init: function () {
                this.setElements();
                this.buildTrapFocus();
                this.bindEvent();
                this.bindOutsideEvents(true);
            },
            setElements: function () {
                this.layerOpener = this.obj.find(this.opts.layerOpener);
                this.layerWrap = this.obj.find(this.opts.layerWrap);
                this.layerObj = this.layerWrap.find(this.opts.layerObj);
                this.layerCloseBtn = this.obj.find(this.opts.layerCloseBtn);
                this.layerConfirm = this.obj.find(this.opts.layerConfirm);
            },
            bindEvent: function (type) {
                this.layerOpener.on('click', this.layerOpenFunc.bind(this));
                this.layerCloseBtn.on('click', this.layerCloseFunc.bind(this));
                this.layerConfirm.on('click', this.layerCloseFunc.bind(this));
                // [D] 레이어 이외의 영역 누를 때도 팝업 창 닫히게 해야함.
            },
            bindOutsideEvents: function (type) {
                if (type) {
                    this.layerObj.on('clickoutside touchendoutside', this.layerClickOutside.bind(this));
                } else {
                    this.layerObj.off('clickoutside touchendoutside');
                }
            },
            layerClickOutside: function (e) {
                console.log(e)
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
                            this.instance = new TrapFoucss(_this.layerObj);
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
        return ComponentInner;
    })();
    return Component;
}));