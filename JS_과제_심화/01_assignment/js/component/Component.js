// Component Call
(function (global, factory) {
    global;
    global.HM_Component = global.HM_Component || {};
    global.HM_Component.Main = global.HM_Component.Main || {};
    global.HM_Component.Main.ComponentInner = factory();
}(this, function () {
    'use strict';
    // 즉시 실행 함수를 Component 변수에 담아서 정의.
    var Component = (function () {
        var win = window,
            doc = win.document,
            $ = win.jQuery,
            Util = win.Common.util;

        function ComponentInner(container, args) {
            var defParams = {
                obj: container,
                objBox: '.btn_box',
                layerItem: '.btn_item',
                customEvent: '.Component' + (new Date()).getTime() + Math.random()
            }
            this.opts = Util.def(defParams, (args || {})); // 방지를 해준다. args || {}
            // 위에 정의해둔 defParams를 opts에 복사
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        ComponentInner.prototype = {
            init: function () {
                this.setElements();
                this.buildLayer();
            },
            setElements: function () {
                this.layerItem = this.obj.find(this.opts.layerItem);
            },
            buildLayer: function () {
                var _this = this;
                Util.def(this, {
                    layer: {
                        instance: [],
                        build: function () {
                            if (!(_this.layerItem.length > 0)) return;
                            for (var i = 0; i < _this.layerItem.length; i++) {
                                this.instance.push(new win.HM_Component.Layer(_this.layerItem.eq(i)))
                            }
                            console.log(this.instance)
                        },
                    }
                });
                this.layer.build();
            }
        }
        return ComponentInner;
    })();
    return Component;
}));

(function (global, factory) {
    global;
    $(function () {
        factory();
    })
}(this, function () {
    'use strict';
    var Component = (function () {
        var win = window,
            $ = win.jQuery,
            Util = win.Common.util;

        function ComponentInner(args) {
            var defParams = {
                obj: '.btn_box'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }

        ComponentInner.prototype = {
            init: function () {
                this.callComponent();
            },
            callComponent: function () {
                new win.HM_Component.Main.ComponentInner(this.obj);
            }
        }

        return new ComponentInner();
    })();
    return Component
}));