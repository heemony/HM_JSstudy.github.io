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
      // 레이어를 빌드해주는 '함수'이다.
      buildLayer: function () {
        var _this = this;
        // 앞인자값과 뒤 인자값을 하나로 머지시켜준다. 
        // this가 아니라 this.layer로 해주면 되지앟나?
        // 객체를 만든 거라고 생각하면됨.
        Util.def(this, {
          layer: {
            instance: [],
            // 하나라면 null이 맞는데, 여러개일 수 있으니 배열이 맞겠따.
            build: function () {
              // 인스턴스가 있으면 걍 빠져나와라.
              if (!(_this.layerItem.length > 0)) return;
              // 인스턴스가 여러개가 생긴다. 여러개를 저장하려면 빈 배열이 맞겟쥬? -> instance: []로 저장.
              for (var i = 0; i < _this.layerItem.length; i++) {
                console.log(i)
                this.instance = new win.HM_Component.Layer(_this.layerItem.eq(i));
                // layerItem의 갯수만큼 인스턴스 생성.
              }
              console.log(this.instance); 
              console.log(this); 
              console.log(win); 
            },
          }
        });
        console.log(this.layer)
        this.layer.build(); // 여기서 '함수의 의미'를 갖게 됨.
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

