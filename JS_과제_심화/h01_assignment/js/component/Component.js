// Component Call
(function (global, factory) {
  global;
  global.HM_Component = global.HM_Component || {};
  global.HM_Component.Main = global.HM_Component.Main || {};
  global.HM_Component.Main.ComponentInner = factory();
}(this, function () {
  'use strict';
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
        navElem: '#header',
        customEvent: '.Component' + (new Date()).getTime() + Math.random()
      }
      this.opts = Util.def(defParams, (args || {})); 
      if (!(this.obj = $(this.opts.obj)).length) return;
      this.init();
    }
    ComponentInner.prototype = {
      init: function () {
        this.setElements();
        this.buildLayer();
        this.buildNav();
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
                this.instance = new win.HM_Component.Layer(_this.layerItem.eq(i));
              }
            },
          }
        });
        this.layer.build();
      },
      buildNav: function () {
        console.log('buildNav')
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
        for (let i = 0, max = this.obj.length; i < max; i++) {
          new win.HM_Component.Main.ComponentInner(this.obj.eq(i));
        }
      }
    }

    return new ComponentInner();
    // -> 원하는 클래스나 아이디명이 있을 경우 ()에 넣고, 인자값을 받아서 defParams의 obj에 인자값을 받을 파라미터변수를 써주면 됨.
  })();
  return Component
}));

