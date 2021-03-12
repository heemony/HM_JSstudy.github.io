(function (global, factory) { // 즉시실행함수 (변수, 콜백함수)
    global = global; 
    global.WhyGalaxy = global.WhyGalaxy || {}; 
    global.WhyGalaxy.CinemaView = factory(global); 
})(this, function (global, isUndefined) { 
    "use strict";

    var Component = (function () { // Component 함수 표현식
        var win = global,
            $ = win.jQuery,
            doc = win.document,
            Util = win.WhyGalaxy.util,
            RESPONSIVE = win.WhyGalaxy.RESPONSIVE;
        function Component(container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args); // 이렇게 인스턴스를 생성할 때 기능들을 공유할 수 있게 밑에서 정의해줌. -> 38L) Component.prototype = {}
            }
            var defParams = {
                obj: container,
                backgroundWrap : '.wg-cinema-view__bg',
                backgorundImage : '.image',
                classes: {
                    isLoaded : 'is-loaded'
                },
                customEvent: ".Component" + new Date().getTime(),
                setScroll: false,
                resizeStart: null,
                resizeAttr : {
                    w: null,
                    h: null
                },
                viewType: null
            };
            this.opts = Util.def(defParams, args || {}); // opts? Util안에 있는 def..?
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init: function () { 
                this.initOpts();
                this.buildPictures();
            }, 
            initOpts: function () {
                this.winWidth = Util.winSize().w;
                if (this.winWidth > RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.viewType !== 'PC') {
                        this.opts.viewType = 'PC'
                    }
                } else if (this.winWidth <= RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.viewType !== 'MO') {
                        this.opts.viewType = 'MO'
                    }
                }
            },
            loadAfter : function () {
                this.buildScrollMagic();
                this.buildCanvas();
                this.buildParallax();
                this.bindEvents(true);
            },
            buildPictures : function () {
                Util.def(this, {
                    pictures : {
                        instance : null,
                        destroy : $.proxy(function () {
                            if (this.pictures.instance == null) return;
                            this.pictures.instance.destroy();
                            this.pictures.instance = null;
                        }, this),
                        load : $.proxy(function (obj) {
                            var deferred = $.Deferred();
                            if (this.pictures.instance == null) {
                                this.pictures.instance = new PicturesLoaded(obj, { 
                                    on : {
                                        complete : $.proxy(function () {
                                            deferred.resolve();
                                        }, this)
                                    }
                                });
                            }
                            return deferred.promise();
                        }, this)
                    }
                });
                this.pictures.load(this.obj).done($.proxy(function () {
                    this.loadAfter();
                    this.obj.addClass(this.opts.classes.isLoaded);
                }, this));
            },
            buildCanvas: function () {
                Util.def(this, {
                    canvas : {
                        instance : {
                            PC : null,
                            MO : null
                        },
                        destroy : $.proxy(function(viewType) {
                            if (this.canvas.instance[viewType] == null) return;
                            this.canvas.instance[viewType].destroy();
                            this.canvas.instance[viewType] = null;
                        }, this),
                        tween : $.proxy(function(viewType) {
                            if (this.canvas.instance[viewType] == null) return;
                            return this.canvas.instance[viewType].tweens.instance;
                        }, this), 
                        redraw : $.proxy(function(viewType) {
                            if (this.canvas.instance[viewType] == null) return;
                            this.canvas.instance[viewType].redraw();
                        }, this),
                        build : $.proxy(function(viewType) {
                            if (this.canvas.instance[viewType] !== null) return;
                            this.canvas.instance[viewType] = new CanvasBuild(this.obj, {
                                viewType : viewType.toUpperCase()
                            });
                        }, this)
                    }
                });
                this.canvas.build(this.opts.viewType);
                this.scrollmagic.scene.stickyScene.setTween(this.canvas.tween(this.opts.viewType));
            },
            buildScrollMagic : function () {
                var triggerElement = this.obj.find(".wg-cinema-view__sticky").eq(0).get(0),
                    stickyElement = triggerElement;
                var durationRatioSticky = 3;
                var durationRatioAnimation = 1;
                var durationSticky;
                var durationAnimation;
                if (Util.isDevice) {
                    durationSticky = (Util.winSize().h * durationRatioSticky) + 'px';
                    durationAnimation = (Util.winSize().h * durationRatioAnimation) + 'px';
                } else {
                    durationSticky = (100 * durationRatioSticky) + '%';
                    durationAnimation = (100 * durationRatioAnimation) + '%';
                }
                Util.def(this, {
                    scrollmagic : {
                        controller : null,
                        scene : {},
                        opts : {
                            stickyOpts : {
                                sceneOpts : {
                                    triggerElement: triggerElement,
                                    triggerHook: 0,
                                    duration: durationSticky,
                                    reverse: true
                                },
                                stickyObj : stickyElement
                            },
                            animationOpts : {
                                sceneOpts : {
                                    triggerElement: this.obj.get(0),
                                    triggerHook: 1,
                                    duration: durationAnimation,
                                    reverse: true
                                },
                            }
                        },
                        buildScene : $.proxy(function () {
                            if (this.scrollmagic.controller == null) return;
                            this.scrollmagic.scene.stickyScene = new ScrollMagic.Scene(this.scrollmagic.opts.stickyOpts.sceneOpts)
                                .setPin(this.scrollmagic.opts.stickyOpts.stickyObj)
                                .addTo(this.scrollmagic.controller);
                            this.scrollmagic.scene.animationScene = new ScrollMagic.Scene(this.scrollmagic.opts.animationOpts.sceneOpts)
                                .addTo(this.scrollmagic.controller);
                        }, this),
                        destroy : $.proxy(function () {
                            if (this.scrollmagic.controller == null) return;
                            this.scrollmagic.controller.destroy(true);
                            this.scrollmagic.controller = null;
                        }, this),
                        buildController: $.proxy(function () {
                            if (this.scrollmagic.controller !== null) return;
                            this.scrollmagic.controller = new ScrollMagic.Controller();
                        }, this)
                    }
                });
                this.scrollmagic.buildController();
                this.scrollmagic.buildScene();
                this.opts.setScroll = true;
            },
            buildParallax : function () {
                Util.def(this, {
                    parallax : {
                        instance : {
                            PC : null,
                            MO : null
                        },
                        destroy : $.proxy(function(viewType) {
                            if (this.parallax.instance[viewType] == null) return;
                            this.parallax.instance[viewType].destroy();
                            this.parallax.instance[viewType] = null;
                        }, this),
                        tween : $.proxy(function(viewType) {
                            if (this.parallax.instance[viewType] == null) return;
                            return this.parallax.instance[viewType].tweens.instance;
                        }, this), 
                        build : $.proxy(function(viewType) {
                            if (this.parallax.instance[viewType] !== null) return;
                            this.parallax.instance[viewType] = new ParallaxBuild(this.obj, {
                                viewType : viewType.toUpperCase()
                            });
                        }, this)
                    }
                })
                this.parallax.build(this.opts.viewType);
                this.scrollmagic.scene.animationScene.setTween(this.parallax.tween(this.opts.viewType));
            },
            changeTween : function () {
                this.scrollmagic.scene.stickyScene.removeTween(true);
                this.scrollmagic.scene.stickyScene.setTween(this.canvas.tween(this.opts.viewType));
                this.scrollmagic.scene.animationScene.removeTween(true);
                this.scrollmagic.scene.animationScene.setTween(this.parallax.tween(this.opts.viewType));
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
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    $(win).off(this.changeEvents('resize orientationchange'));
                }
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setLayout();
            },
            setLayout : function () {
                var _this = this;
                var winWidth = Util.winSize().w;
                function resetLayoutFunc (viewType) {
                    var oldViewType = (viewType === 'PC') ? 'MO' : 'PC';
                    _this.opts.viewType = viewType;
                    if (_this.canvas.instance[oldViewType]) {
                        _this.canvas.destroy(oldViewType);
                    }
                    _this.canvas.build(viewType);
                    if (_this.parallax.instance[oldViewType]) {
                        _this.parallax.destroy(oldViewType);
                    }
                    _this.parallax.build(viewType);
                    if (_this.opts.setScroll) {
                        _this.changeTween();
                    }
                }

                if (this.winWidth > RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.viewType !== 'PC') {
                        resetLayoutFunc('PC');
                    } else {
                        this.canvas.redraw('PC');
                    }
                } else if (this.winWidth <= RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.viewType !== 'MO') {
                        resetLayoutFunc('MO');
                    } else {
                        if (this.opts.resizeAttr.w != winWidth) {
                            this.canvas.redraw('MO');
                        }
                    }
                }
                this.opts.resizeAttr.w = winWidth;
            },
            outCallback: function (ing) {
                var callbackObj = this.opts[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };

        function CanvasBuild(container, args) {
            if (!(this instanceof CanvasBuild)) { // 만약에 this가 CanvasBuild가 아니면 
                return new CanvasBuild(container, args);
                // CanvasBuild 인스턴스를 만들어서 반환해라.
            }
            var defParams = {
                obj: container,
                canvas: "canvas",
                frameWrap : '.wg-cinema-view__frame',
                bgWrap : '.image',
                viewType : null,
                customEvent: ".Component" + new Date().getTime(),
            };
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        CanvasBuild.prototype = {
            init: function () {
                this.setElements();
                this.buildCanvasAnimation();
                this.buildBgAnimation();
                this.buildTween();
                // init 메소드를 호출하는 주체는 CanvasBuild
                // this = CanvasBuild
            },
            setElements : function () {
                this.frameWrap = this.obj.find(this.opts.frameWrap);
                this.bgWrap = this.obj.find(this.opts.bgWrap);
                this.bg = this.bgWrap.find('.image');
                this.canvas = this.obj.find(this.opts.canvas).get(0);
                this.ct = this.canvas.getContext("2d");
                this.frameImg = this.frameWrap.find('.frame').get(0);
                this.frameCutImg = this.frameWrap.find('.frame-cut').get(0);
            },
            buildCanvasAnimation : function () {
                this.bgColor = this.obj.attr("data-bg-color");
                Util.def(this, {
                    canvasAnimation : {
                        instance : null,
                        basicProp : {},
                        prop : {
                            PC : {
                                from : {
                                    scale : 4
                                },
                                to : {
                                    scale : 1
                                }
                            },
                            MO : {
                                from : {
                                    scale : 5
                                },
                                to : {
                                    scale : 1
                                }
                            },
                        },
                        position : $.proxy(function () {
                            var winWidth = Util.winSize().w;
                            var winHeight = Util.winSize().h;
                            var degNum = (Util.isDevice && window.innerHeight > window.innerWidth) ? 90 : 0;
                            this.deg = degNum * Math.PI / 180;
                            this.ratio = window.devicePixelRatio || 1;
                            this.cvWidth = this.canvas.width = winWidth * this.ratio;
                            this.cvHeight = this.canvas.height = winHeight * this.ratio;
                            this.frameX = this.frameImg.width / 2;
                            this.frameY = this.frameImg.height / 2;
                        }, this),
                        draw : $.proxy(function () {
                            var xPos = this.cvWidth / 2,
                                yPos = this.cvHeight / 2;
                            this.ct.translate(xPos, yPos);
                            this.ct.rotate(this.deg);
                            this.ct.drawImage(this.frameCutImg, -this.frameX, -this.frameY, this.frameImg.width, this.frameImg.height)
                            this.ct.rotate(-this.deg);
                            this.ct.globalCompositeOperation = "xor";
                            this.ct.beginPath();
                            this.ct.fillStyle = this.bgColor;
                            this.ct.rect(-xPos, -yPos, this.cvWidth, this.cvHeight);
                            this.ct.fill();
                            this.ct.beginPath();
                            this.ct.rotate(this.deg);
                            this.ct.drawImage(this.frameImg, -this.frameX, -this.frameY, this.frameImg.width, this.frameImg.height);
                        }, this),
                        update : $.proxy(function (prop) {
                            var _this = this;
                            if (this.canvasAnimation.instance !== null) {
                                this.canvasAnimation.instance.kill();
                            }
                            this.canvasAnimation.instance = TweenLite.to(this.canvasAnimation.basicProp, .7, Util.def(prop, {
                                onUpdate : function () {
                                    _this.imageScale = _this.canvasAnimation.basicProp.scale * _this.ratio;
                                    _this.newX = _this.imageScale * (_this.cvWidth / 2) - (_this.cvWidth / 2);
                                    _this.newY = _this.imageScale * (_this.cvHeight / 2) - (_this.cvHeight / 2);
                                    _this.ct.clearRect(0, 0, _this.cvWidth, _this.cvHeight);
                                    _this.ct.save();
                                    _this.ct.translate(-_this.newX, -_this.newY);
                                    _this.ct.scale(_this.imageScale, _this.imageScale);
                                    _this.canvasAnimation.draw();
                                    _this.ct.restore();
                                }
                            }));
                        }, this),
                        redraw : $.proxy(function () {
                            this.canvasAnimation.position();
                            this.canvasAnimation.update();
                        }, this),
                        build : $.proxy(function () {
                            this.canvasAnimation.position();
                            this.canvasAnimation.update(this.canvasAnimation.prop[this.opts.viewType].from);
                        }, this)
                    }
                });
                this.canvasAnimation.build();
            },
            // 백그라운드 애니메이션 
            buildBgAnimation : function () {
                Util.def(this, { // [?] Util.def는 정의하는 함수인가?
                    bgAnimation : { // bgAnimation이라는 객체
                        instance : null, 
                        prop : { // PC는 1.2 -> 1, MO는 1.4 -> 1 로 축소되는 prop 프로퍼티
                            PC : {
                                backgoundScale : {
                                    from : {
                                        scale : 1.2
                                    },
                                    to : {
                                        scale : 1
                                    }
                                }
                            },
                            MO : {
                                backgoundScale : {
                                    from : {
                                        scale : 1.4
                                    },
                                    to : {
                                        scale : 1
                                    }
                                }
                            }
                        },
                        scale : $.proxy(function (prop) { // [?] 이 코드에서 마지막 this로 뭘 하는거지?
                            TweenLite.to(this.bgWrap, .7, prop) 
                            // TweenLite 뭐죠, 
                            // 캔버스(component)의 변수 bgWrap는 '.iamge' , 0.7초 동안 실행하라?
                        }, this)
                    }
                });
            },
            buildTween : function () {
                var _this = this,
                    canvasProp = this.canvasAnimation.prop[this.opts.viewType],
                    bgProp = this.bgAnimation.prop[this.opts.viewType];
                Util.def(this, {
                    tweens : {
                        instance : null,
                        deleteTweenID : function (prop) {
                            var scopeProp = Util.def({}, prop);
                            scopeProp._gsTweenID;
                            return scopeProp;
                        },
                        initStart : $.proxy(function () {
                            this.canvasAnimation.update(this.tweens.deleteTweenID(canvasProp.from));
                            this.bgAnimation.scale(this.tweens.deleteTweenID(bgProp['backgoundScale'].from));
                        }, this),
                        destroy : $.proxy(function () {
                            this.tweens.instance.kill();
                            this.tweens.instance = null;
                        }, this),
                        build : $.proxy(function () {
                            var timeline = new TimelineLite();
                            timeline.to(canvasProp.from, .7, Util.def(canvasProp.to, {
                                ease: Power2.easeOut,
                                onUpdate : function () {
                                    _this.canvasAnimation.update(_this.tweens.deleteTweenID(canvasProp.from));
                                }
                            }), '1');
                            timeline.to(bgProp['backgoundScale'].from, .7, Util.def(bgProp['backgoundScale'].to, {
                                ease: Power2.easeOut,
                                onUpdate : function () {
                                    _this.bgAnimation.scale(_this.tweens.deleteTweenID(bgProp['backgoundScale'].from));
                                }
                            }), '1').to({}, 1.2, {});
                            this.tweens.instance = timeline;
                        }, this)
                    }
                });
                this.tweens.build();
                this.tweens.initStart();
            },
            redraw: function() {
                this.canvasAnimation.redraw();
            },
            destroy: function () {
                this.tweens.destroy();
            }
        }

        function ParallaxBuild(container, args) {
            if (!(this instanceof ParallaxBuild)) {
                return new ParallaxBuild(container, args);
            }
            var defParams = {
                obj : container,
                backgroundWrap : '.wg-cinema-view__bg',
                viewType : null,
                customEvent: ".Component" + new Date().getTime()
            }
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        ParallaxBuild.prototype = {
            init: function () {
                this.setElements();
                this.buildBgAnimation();
                this.buildTween();
            },
            setElements : function () {
                this.bgWrap = this.obj.find(this.opts.backgroundWrap);
            },
            buildBgAnimation : function () {
                Util.def(this, {
                    bgAnimation : {
                        instance : null,
                        prop : {
                            PC : {
                                from : {
                                    y : 300
                                },
                                to : {
                                    y : 0
                                }
                            },
                            MO : {
                                from : {
                                    y : 280
                                },
                                to : {
                                    y : 0
                                }
                            }
                        },
                        move : $.proxy(function (prop) {
                            TweenLite.to(this.bgWrap, .7, prop)
                        }, this)
                    }
                })
            },
            buildTween : function () {
                var _this = this,
                    bgProp = this.bgAnimation.prop[this.opts.viewType];
                Util.def(this, {
                    tweens : {
                        instance : null,
                        deleteTweenID : function (prop) {
                            var scopeProp = Util.def({}, prop);
                            scopeProp._gsTweenID;
                            return scopeProp;
                        },
                        initStart : $.proxy(function () {
                            this.bgAnimation.move(this.tweens.deleteTweenID(bgProp.from));
                        }, this),
                        destroy : $.proxy(function () {
                            this.tweens.instance.kill();
                            this.tweens.instance = null;
                        }, this),
                        build : $.proxy(function () {
                            var timeline = new TimelineLite();
                            timeline.to(bgProp.from, .7, Util.def(bgProp.to, {
                                ease: Power2.easeOut,
                                onUpdate : function () {
                                    _this.bgAnimation.move(_this.tweens.deleteTweenID(bgProp.from));
                                }
                            }));
                            this.tweens.instance = timeline;
                        }, this)
                    }
                })
                this.tweens.build(this.opts.viewType);
            },
            destroy: function () {
                this.tweens.destroy();
            }
        }
        return Component;
    })();
    return Component; // 컴포넌트 돌려줘라.
});
/* 
    function 함수(){}; 
    함수.prototype = {} 
    형태의 코드 패턴(?)
    
    함수 안에서 함수를 만들면 new로 인스턴스를 찍어낼 때 마다 (프로퍼티, 메서드들 같은거..) 각각 생기기 때문에 메모리를 마니 먹는당..
    같은 유형간에 공유하는 객체를 프로토타입이라 하는데, 프로토타입 체인이 그 공유하는 객체를 바라보게 해주면 공유를 할 수 있다~
*/

(function (global, factory) {
    $(function () {
        factory(global);
    });
})(this, function (global, isUndefined) {
    "use strict";

    var Component = (function () { // 익명 함수 표현식
        var win = global,
            $ = win.jQuery,
            Util = win.WhyGalaxy.util;

        function Component(args) { 
            var defParams = {
                obj: ".wg-cinema-view",
            };
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init: function () {
                this.callComponent();
            },
            callComponent: function () {
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    new win.WhyGalaxy.CinemaView(this.obj.eq(i));
                    // 
                }
            },
        };
        return new Component();
    })();
    return Component;
});



/* 
    // 1. Proxy : 새로운 행동을 정의할 때 사용.
    Proxy 객체는 기본적인 동작(속성 접근, 할당, 순회, 열거, 함수 호출) 등

    new Proxy(target, handler)
    - target : native array, function, 다른 proxy를 포함한 객체.
    - handler : 프로퍼티들이 function인 객체. 동작이 수행될 때 handler는 Proxy의 행동을 정의.


*/

/*
    // 2. 자체 호출 익명 함수
    
    function add(a, b) {
        return a + b;
    }
    는

    var add = function(a, b) {
        return a + b;
    }
    와 같고,

    add(10, 2); 는

    (function(a, b) {
        return a + b;
    })(10, 2);와 같다.

    자체 호출 익명 함수, 실행되고 버려짐. 해당 범위에만 개인 변수를 포함한다. 클로저 내에도 저장되지 않는다.


*/