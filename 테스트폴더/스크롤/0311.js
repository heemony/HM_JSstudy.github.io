(function (global, factory) { // 즉시실행함수 (변수, 콜백함수)
    global = global; 
    global.WhyGalaxy = global.WhyGalaxy || {}; 
    global.WhyGalaxy.CinemaView = factory(global); 
})(this, function (global, isUndefined) { 
    "use strict";

    var Component = (function () { // 즉시실행함수를 Component변수에 할당.
        var win = global,
            $ = win.jQuery, // 즉시실행함수를 사용하는 이유 중 1. $를 제이쿼리를 위한 변수로 사용할 수 있다. (prototype에도 $변수가 있다고 한다..)
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
            init: function () { // [처음에 실행되는 init함수]
                this.initOpts(); // [1번째 호출]
                this.buildPictures(); // [2번째 호출]
            }, 
            // 1번째 함수 _ PC 인지 MO 인지 구별해주는 함수
            initOpts: function () {
                this.winWidth = Util.winSize().w; // width 사이즈 재어와라.
                if (this.winWidth > RESPONSIVE.MOBILE.WIDTH) { // 만약에 모바일보다 큰데, 
                    if (this.opts.viewType !== 'PC') { // PC와는 다를 경우
                        this.opts.viewType = 'PC' // PC 값으로 할당
                    } 
                } else if (this.winWidth <= RESPONSIVE.MOBILE.WIDTH) {
                    if (this.opts.viewType !== 'MO') {
                        this.opts.viewType = 'MO' // MO 값으로 할당
                    }
                }
            },
            // 3번째 함수 _ 아래 함수들 다 실행해라
            loadAfter : function () {
                this.buildScrollMagic(); // [4번째 호출]
                this.buildCanvas(); // [5번째 호출]
                this.buildParallax(); // [6번째 호출]
                this.bindEvents(true); // [7번째 호출]
            },
            // 2번째 함수 _ 빌드픽쳐스 (정의하는 함수인건가여?)
            buildPictures : function () {
                Util.def(this, { // def? 정의하는 함수인가? 
                    pictures : { // pictures라는 객체 프로퍼티
                        instance : null,
                        // 없애는 메소드겠지 뭐..
                        destroy : $.proxy(function () { 
                            if (this.pictures.instance == null) return; // 픽쳐스 인스턴스 없으면 함수 빠져나가.
                            this.pictures.instance.destroy(); // 있다면.destroy() 실행
                            this.pictures.instance = null; // 그리고 null 값으로 할당.
                        }, this),
                        // 로드하는 메소드겠지.. 뭐..
                        load : $.proxy(function (obj) {
                            var deferred = $.Deferred(); 
                            if (this.pictures.instance == null) { // 빈값이라면 아래 코드 실행.
                                // obj와 on이라는 객체 프로퍼티를 갖는 PicturesLoaded라는 인스턴스 생성해라..? 
                                this.pictures.instance = new PicturesLoaded(obj, { 
                                    on : {
                                        complete : $.proxy(function () {
                                            deferred.resolve(); // resolve..해결됐다는건가..?
                                        }, this) // 요 this는 뭐지???
                                    }
                                });
                            }
                            return deferred.promise(); // 프로미스..ㅠㅠ..?
                        }, this) // 대체 이 this는 ㅜ머야..
                    }
                });
                // Component객체로 찍어난 인스턴스의 pictures가 로드됐다면 
                this.pictures.load(this.obj).done($.proxy(function () {
                    // loadAfter() 호출해라 이말인건가?
                    this.loadAfter(); // [3번째 호출]
                    // 그리고 obj에 클래스 붙여리.
                    this.obj.addClass(this.opts.classes.isLoaded);
                }, this));

            },
            // 5번째 함수 _ 빌드캔버스 (정의?)
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
                                viewType : viewType.toUpperCase() // 대문자로 왜 만들어주나요? 6번쨰 함수 buildParallex도 마찬가지
                            });
                        }, this)
                    }
                });
                this.canvas.build(this.opts.viewType);
                this.scrollmagic.scene.stickyScene.setTween(this.canvas.tween(this.opts.viewType));
            },
            // 4번째 함수 _ scrollmagic 라이브러리 찾아보기
            buildScrollMagic : function () {
                var triggerElement = this.obj.find(".wg-cinema-view__sticky").eq(0).get(0), // html에서 클래스 찾아서 가꾸와.
                    stickyElement = triggerElement; // 변수명 바꿔서 재할당
                var durationRatioSticky = 3;
                var durationRatioAnimation = 1;
                var durationSticky;
                var durationAnimation;
                if (Util.isDevice) {
                    durationSticky = (Util.winSize().h * durationRatioSticky) + 'px';  // 3배 px
                    durationAnimation = (Util.winSize().h * durationRatioAnimation) + 'px'; // 1배 px
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
                        // 신 빌드
                        buildScene : $.proxy(function () {
                            if (this.scrollmagic.controller == null) return;
                            // 고정되는 신
                            this.scrollmagic.scene.stickyScene = new ScrollMagic.Scene(this.scrollmagic.opts.stickyOpts.sceneOpts)
                                .setPin(this.scrollmagic.opts.stickyOpts.stickyObj) // set 프로퍼티..?
                                .addTo(this.scrollmagic.controller); // 컨트롤러 붙여라~
                            // 애니매이션 되는 신
                            this.scrollmagic.scene.animationScene = new ScrollMagic.Scene(this.scrollmagic.opts.animationOpts.sceneOpts)
                                .addTo(this.scrollmagic.controller);
                        }, this), // <- 대체 요 this가 머여
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
                this.scrollmagic.buildController(); // 스크롤매직라이브러리의 buildController [4-1번째 호출]
                this.scrollmagic.buildScene(); // [4-2번째 호출]
                this.opts.setScroll = true;
            },
            // 6번째 함수 _ (정의?)
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
            // 7번째 함수 _ 
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
            // out..call..back..?...뭐징..
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
                        prop : { // PC일 때 scale 4 -> 1, MO 일 때 scale 5 -> 1 로 축소되는 prop 객체 프로퍼티
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
                        prop : { // PC는 1.2 -> 1, MO는 1.4 -> 1 로 축소되는 prop 객체 프로퍼티
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
                            // 캔버스(component)의 변수 bgWrap는 '.iamge'이고, 0.7초 동안 실행하라? 뭐 그런의미일까
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
            this.init(); // [init 호출]
        }
        ParallaxBuild.prototype = {
            init: function () { // init 메소드
                this.setElements();  // [1번째 함수 호출]
                this.buildBgAnimation();  // [2번째 함수 호출]
                this.buildTween();  // [3번째 함수 호출]
            },
            setElements : function () {
                this.bgWrap = this.obj.find(this.opts.backgroundWrap);
            },
            buildBgAnimation : function () {
                Util.def(this, {
                    bgAnimation : {
                        instance : null,
                        prop : { // PC : 300 -> 0, MO : 280 -> 0 
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
                        move : $.proxy(function (prop) { // prop이 움직이는데 걸리는 시간 0.7s
                            TweenLite.to(this.bgWrap, .7, prop) // TweenLite는 뭘 의미?
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

(function (global, factory) {
    $(function () {
        factory(global);
    });
})(this, function (global, isUndefined) {
    "use strict";

    var Component = (function () { 
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
 *[ 프로토타입 - 아래 형태의 코드 패턴을 사용하는 이유 => 메모리 절감]
 * function 함수(){}; 
 * 함수.prototype = {} 
 * 
 * 함수 안에서 함수를 만들면 new로 인스턴스를 찍어낼 때 마다 (프로퍼티(k:v), 메서드(f)들 같은거..) 각각 생기기 때문에 메모리를 마니 먹는당..
 * 같은 유형간에 공유하는 객체를 프로토타입이라 하는데, 프로토타입 체인이 그 공유하는 객체를 바라보게 해주면 공유를 할 수 있다~
 */

/*
 * [ 2. 자체 호출 익명 함수 ]
 
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
    })(10, 2); 
    와 같다.

    즉시실행함수 
    : 실행되고 버려짐. 해당 범위에만 개인 변수를 포함한다. 클로저 내에도 저장되지 않는다. 프로토타입의 변수 $의 오버라이팅 방지(제이쿼리 변수로 사용할 수 있다.)
    : 하나의 파일안에 모든 코드를 담는 것은 불가능하기에, js 함수의 특징을 이용하여 모듈화를 할 수 있다. 
    

*/

/* 
    // [ Proxy : 새로운 행동을 정의할 때 사용 ]

    Proxy 객체는 기본적인 동작(속성 접근, 할당, 순회, 열거, 함수 호출) 등

    new Proxy(target, handler)
    - target : native array, function, 다른 proxy를 포함한 객체.
    - handler : 프로퍼티들이 function인 객체. 동작이 수행될 때 handler는 Proxy의 행동을 정의.
*/
