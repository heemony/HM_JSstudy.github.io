

(function($,doc,outside){
  '$:nomunge'; 

  $.map(
    'click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup touchstart touchend'.split(' '),
    function( event_name ) { jq_addOutsideEvent( event_name ); }
  );

  jq_addOutsideEvent( 'focusin',  'focus' + outside );
  jq_addOutsideEvent( 'focusout', 'blur' + outside );


  $.addOutsideEvent = jq_addOutsideEvent;

  function jq_addOutsideEvent( event_name, outside_event_name ) {

    outside_event_name = outside_event_name || event_name + outside;

    var elems = $(),

      event_namespaced = event_name + '.' + outside_event_name + '-special-event';


    $.event.special[ outside_event_name ] = {

      setup: function(){

        elems = elems.add( this );

        if ( elems.length === 1 ) {
          $(doc).bind( event_namespaced, handle_event );
        }
      },

      teardown: function(){

        elems = elems.not( this );

        if ( elems.length === 0 ) {
          $(doc).unbind( event_namespaced );
        }
      },

      add: function( handleObj ) {
        var old_handler = handleObj.handler;

        handleObj.handler = function( event, elem ) {

          event.target = elem;

          old_handler.apply( this, arguments );
        };
      }
    };

    function handle_event( event ) {

      $(elems).each(function(){
        var elem = $(this);

        if ( this !== event.target && !elem.has(event.target).length ) {

          elem.triggerHandler( outside_event_name, [ event.target ] );
        }
      });
    };

  };

})(jQuery,document,"outside");

(function (global, factory) {
    global = global;
    global.WhyGalaxy = factory();
}(this, function () { 'use strict';
    var Common = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            win = window,
            $ = win.jQuery,
            doc = win.document;
        return {
            util : {
                youtube : {
                    apiLoaded : false,
                    apiCustomEl : $('<x>'),
                    hasApi : false
                },
                isRTL : function () {
                    return $('html').hasClass('rtl');
                },
                isSupportTransform : (function () {
                    return ('WebkitTransform' in doc.body.style || 'MozTransform' in doc.body.style || 'msTransform' in doc.body.style || 'OTransform' in doc.body.style || 'transform' in doc.body.style);
                })(),
                isSupportTransition : (function () {
                    return ('WebkitTransition' in doc.body.style || 'MozTransition' in doc.body.style || 'msTransition' in doc.body.style || 'OTransition' in doc.body.style || 'transition' in doc.body.style);
                })(),
                isSupportTransforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                    var div = document.createElement('div').style;
                    return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
                })(),
                isDevice : (function () {
                    var isDevice = ('ontouchstart' in win || (win.DocumentTouch && doc instanceof win.DocumentTouch));
                    isDevice ? $('html').addClass('isTouchDevice') : $('html').addClass('isNotTouchDevice');
                    return isDevice;
                })(),
                isIOS : (function () {
                    var isIOS = (/iPad|iPhone|iPod/.test(navigator.userAgent));
                    isIOS ? $('html').addClass('isIosDevice') : $('html').addClass('isNotIosDevice');
                    return isIOS;
                })(),
                isIEorEdge : (function () {
                    var word;
                    var agent = navigator.userAgent.toLowerCase();
                    if (navigator.appName == "Microsoft Internet Explorer") {
                        word = "msie ";
                    } else if (agent.search( "trident" ) > -1) {
                        word = "trident/.*rv:";
                    } else if (agent.search( "edge/" ) > -1) {
                        word = "edge/";
                    } else {
                        return -1;
                    }
                    var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
                    if (reg.exec(agent) != null) {
                        $('html').addClass('isIEorEdge');
                        return parseFloat(RegExp.$1 + RegExp.$2);
                    }
                    return -1;
                })(),
                isAemEditMode : function () {
                    var flag = false;
                    if (win.parent && win.frameElement && $(win.parent.document).find('.foundation-authoring-ui-mode').size()) {
                        flag = true;
                    }
                    return flag;
                },
                isObject: function (o) {
                    return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
                },
                isEmptyObject: function (o) {
                    return Object.keys(o).length === 0 && o.constructor === Object;
                },
                getBoundingClientRect : function (target) {
                    return target[0].getBoundingClientRect();
                },
                getTransitionCss : function (targetProperty, target) {
                    var propertys = target.css('transition-property'),
                        durations = target.css('transition-duration'),
                        delays = target.css('transition-delay');
                    var slicePropertys = propertys.split(',').map(function (val) {
                            return $.trim(val);
                        }),
                        sliceDurations = durations.split(',').map(function (val) {
                            return parseFloat($.trim(val)) * 1000;
                        }),
                        sliceDelays = delays.split(',').map(function (val) {
                            return parseFloat($.trim(val)) * 1000;
                        }),
                        hasIndex = $.inArray(targetProperty, slicePropertys);
                    return sliceDurations[hasIndex] + sliceDelays[hasIndex];
                },
                def : function () {
                    var args = [], len$1 = arguments.length;
                    while ( len$1-- ) args[ len$1 ] = arguments[ len$1 ];
                    var to = Object(args[0]);
                    for (var i = 1; i < args.length; i += 1) {
                        var nextSource = args[i];
                        if (nextSource !== undefined && nextSource !== null) {
                            var keysArray = Object.keys(Object(nextSource));
                            for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                                var nextKey = keysArray[nextIndex];
                                var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                                if (desc !== undefined && desc.enumerable) {
                                    if (this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                                        this.def(to[nextKey], nextSource[nextKey]);
                                    } else if (!this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                                        to[nextKey] = {};
                                        this.def(to[nextKey], nextSource[nextKey]);
                                    } else {
                                        to[nextKey] = nextSource[nextKey];
                                    }
                                }
                            }
                        }
                    }
                    return to;
                },
                winSize : (function () {
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
                                w : $(win).width(),
                                h : $(win).height()
                            };
                            return win_wh;
                        }
                    } else {
                        return function () {
                            var win_wh = {
                                w : win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
                                h : win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
                            };
                            return win_wh;
                        }
                    }
                })(),
                requestAFrame : (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame ||
                        function (callback) {
                            return win.setTimeout(callback, 1000 / 60);
                        };
                })(),
                cancelAFrame : (function () {
                    return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame ||
                        function (id) {
                            win.clearTimeout(id);
                        };
                })(),
                imgLoaded : function (selector) {
                    var deferred = $.Deferred();
                    if (selector.length) {
                        var imgs = selector.find('img'),
                            imgs = selector[0].tagName === 'IMG' ? imgs.add(selector) : imgs,
                            minLength = 0,
                            maxLength = imgs.length,
                            data = {},
                            dataFunc = function (index, element) {
                                data[index] = {
                                    IMG : element
                                };
                            },
                            completeFunc = function () {
                                if (minLength === maxLength) {
                                    deferred.resolve(data);
                                }
                            };
                        if (!maxLength) {
                            completeFunc();
                        } else {
                            for (var i = 0, max = maxLength; i < max; i++) {
                                (function (index) {
                                    var img = imgs.eq(index),
                                        imgDOM = img[0];
                                    if (imgDOM.complete || img.height() > 0) {
                                        dataFunc(minLength, imgDOM);
                                        minLength++;
                                        completeFunc();
                                    } else {
                                        img.on('load error', function () {
                                            dataFunc(minLength, imgDOM);
                                            minLength++;
                                            completeFunc();
                                            img.off('load error');
                                        });
                                    }
                                })(i);
                            }
                        }
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise();
                },
                scrollMoveFunc : function (target) {
                    if (!target.length) return;
                    var deferred = $.Deferred();
                    var scrollTop = Math.ceil(target.offset().top),
                        winTop = $(win).scrollTop(),
                        totalMoveTop = scrollTop + 1;
                    if (totalMoveTop === winTop) {
                        deferred.resolve();
                    } else {
                        TweenLite.to($('html, body'), 1, {
                            ease : Power4.easeInOut,
                            scrollTop : totalMoveTop,
                            onComplete : $.proxy(function () {
                                deferred.resolve();
                            }, this)
                        });
                    }
                    return deferred.promise();
                },
                pageReposition : function () {
                    console.log('pageReposition');
                },
                findFocus : function (target) {
                    if (!target.length) return;
                    if (this.isIOS) {
                        target.attr({
                            'tabIndex' : -1
                        }).focus();
                    } else {
                        var focusClass = 'find-focus-element',
                            focusElements = '<span class="' + focusClass + '" style="position:fixed;left:0;right:0;width:1px;height:1px;font-size:1px;line-height:0;color:transparent;outline:none">&nbsp;</span>';
                        if (!target.find('>.' + focusClass).length) {
                            target.prepend(focusElements);
                        }
                        focusElements = target.find('>.' + focusClass);
                        focusElements.attr({
                            'tabIndex' : -1
                        }).focus();
                        focusElements.on('focusoutside', function (e) {
                            var _this = $(e.currentTarget);
                            _this.removeAttr('tabIndex').css('outline', '');
                            _this.off('focusoutside');
                            _this.remove();
                        });
                    }
                },
                objectLength : function (obj) {
                    var len = 0;
                    for (var key in obj) {
                        len++;
                    }
                    return len;
                },
                scrollParams : {
                    scrollLockType : true,
                    scrollLockClass : 'is-scroll-lock',
                    scrollLockOpts : {
                        scrollLocked : false,
                        lockElements : 'html',
                        appliedLock : {},
                        prevStyles : {},
                        prevScroll : {},
                        lockStyles : {
                            'position' : 'fixed',
                            'width' : '100%'
                        }
                    },
                },
                scrollMethods : {
                    saveStyles : function () {
                        var scrollParams = this.scrollParams,
                            styleStrs = [],
                            styleHash = {},
                            lockOpts = scrollParams.scrollLockOpts,
                            lockElements = $(lockOpts.lockElements),
                            styleAttr =  lockElements.attr('style');
                        if (!styleAttr) return;
                        styleStrs = styleAttr.split(';');
                        $.each(styleStrs, function styleProp (styleString) {
                            var styleString = styleStrs[styleString];
                            if (!styleString) return;
                            var keyValue = styleString.split(':');
                            if (keyValue.length < 2) return;
                            styleHash[$.trim(keyValue[0])] = $.trim(keyValue[1]);
                        });
                        $.extend(lockOpts.prevStyles, styleHash);
                    },
                    saveScrolls : function () {
                        var scrollParams = this.scrollParams,
                            lockOpts = scrollParams.scrollLockOpts;
                        lockOpts.prevScroll = {
                            scrollLeft : $(win).scrollLeft(),
                            scrollTop : $(win).scrollTop()
                        };
                    }
                },
                scrollLock : function (type) {
                    var scrollParams = this.scrollParams,
                        scrollMethods = this.scrollMethods;
                    if (!scrollParams.scrollLockType) return;
                    var lockClass = scrollParams.scrollLockClass,
                        lockOpts = scrollParams.scrollLockOpts,
                        lockElements = $(lockOpts.lockElements);
                    lockElements.toggleClass(lockClass, type);
                    if (type) {
                        if (this.isDevice && this.isIOS) {
                            if (lockOpts.scrollLocked || (lockElements.data('lockScroll') != null)) return;
                            lockOpts.appliedLock = {};
                            scrollMethods.saveStyles.call(this);
                            scrollMethods.saveScrolls.call(this);
                            $.extend(lockOpts.appliedLock, lockOpts.lockStyles, {
                                'left' : - lockOpts.prevScroll.scrollLeft,
                                'top' : - lockOpts.prevScroll.scrollTop
                            });
                            lockElements.css(lockOpts.appliedLock);
                            lockElements.data('lockScroll', {
                                'left' : lockOpts.prevScroll.scrollLeft,
                                'top' : lockOpts.prevScroll.scrollTop
                            });
                            lockOpts.scrollLocked = true;
                        }
                    } else {
                        if (this.isDevice && this.isIOS) {
                            if (!lockOpts.scrollLocked || (lockElements.data('lockScroll') == null)) return;
                            scrollMethods.saveStyles.call(this);
                            for (var key in lockOpts.appliedLock) {
                                delete lockOpts.prevStyles[key];
                            }
                            lockElements.attr('style', $('<x>').css(lockOpts.prevStyles).attr('style') || '');
                            lockElements.data('lockScroll', null);
                            $(win).scrollLeft(lockOpts.prevScroll.scrollLeft).scrollTop(lockOpts.prevScroll.scrollTop);
                            lockOpts.scrollLocked = false;
                        }
                    }
                },
                scrollExtend : function (obj) {
                    obj.scrollParams = this.scrollParams;
                    obj.scrollMethods = this.scrollMethods;
                    obj.scrollLock = this.scrollLock;
                }
            },
            RESPONSIVE : {
                DESKTOP : {
                    NAME : 'desktop',
                    WIDTH : 1920
                },
                MOBILE : {
                    NAME : 'mobile',
                    WIDTH : 767
                }
            }
        };
    })();
    return Common;
}));

(function (global, factory) {
    global = global;
    global.ParallaxView = factory();
}(this, function () { 'use strict';
    var ParallaxView = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.WhyGalaxy.util;
        function ParallaxView (container, args) {
            if (!(this instanceof ParallaxView)) {
                return new ParallaxView(container, args);
            }
            var defParams = {
                props : {},
                triggerElement : null,
                triggerHook : 0,
                duration : '100%',
                speed : .15,
                delay: 0,
                animation : {},
                stateAttr : {
                    play : false,
                    destroy : false,
                    outTop : false,
                    outBot : false
                },
                customEvent : '.ParallaxView' + (new Date()).getTime() + Math.random(),
                scrollStart : null,
                resizeStart : null,
                on : {
                    update : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(container)).length) return;
            this.init();
        };
        ParallaxView.prototype = {
            init : function () {
                this.setElements();
                this.buildTween();
                this.scrollFunc();
                this.bindEvents(true);
            },
            setElements : function () {
                this.objWrap = this.opts.triggerElement;
            },
            buildTween : function () {
                Util.def(this, {
                    tweens : {
                        instance : [],
                        kill : $.proxy(function () {
                            for (var i = 0, max = this.tweens.instance.length; i < max; i++) {
                                this.tweens.instance[i].kill();
                            }
                            this.tweens.instance = [];
                        }, this)
                    }
                });
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindEvents : function (type) {
                if (type) {
                    $(win).on(this.changeEvents('scroll'), $.proxy(this.scrollFunc, this));
                    $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
                } else {
                    $(win).off(this.changeEvents('scroll'));
                    $(win).off(this.changeEvents('resize orientationchange'));
                }
            },
            setOpts : function () {
                var offset = this.objWrap.offset(),
                    height = this.objWrap.outerHeight(true),
                    winHeight = Util.winSize().h,
                    duration = ((parseFloat(this.opts.duration) / 100) * winHeight) + height,
                    triggerHook = ((height* 2) < winHeight) ? 1 : this.opts.triggerHook,
                    triggerHookSize = triggerHook * winHeight,
                    triggerMinSize,
                    triggerMaxSize;
                this.opts.props['offset'] = offset.top;
                this.opts.props['minOffset'] = Math.ceil(offset.top - winHeight, 10);
                this.opts.props['maxOffset'] = Math.ceil(offset.top + height, 10);
                if (triggerHook < 0) {
                    triggerMinSize = this.opts.props['maxOffset'] + duration;
                    triggerMaxSize = this.opts.props['maxOffset'];
                } else {
                    triggerMinSize = this.opts.props['minOffset'];
                    triggerMaxSize = this.opts.props['minOffset'] + duration;
                }
                this.opts.props['minCustomOffset'] = triggerMinSize + triggerHookSize;
                this.opts.props['maxCustomOffset'] = triggerMaxSize + triggerHookSize;
            },
            motionControl : function () {
                var props = this.opts.props,
                    winTop = $(win).scrollTop(),
                    animation = this.opts.animation;
                if (props.minOffset <= winTop && winTop < props.maxOffset) {
                    if (props.minCustomOffset <= winTop && winTop < props.maxCustomOffset) {
                        this.opts.stateAttr.outTop = false;
                        this.opts.stateAttr.outBot = false;
                        if (!this.opts.stateAttr.play) {
                            this.opts.stateAttr.play = true;
                        }
                        var distance = (animation.from.y - animation.to.y);
                        var percent = (winTop - props.minCustomOffset) / (props.maxCustomOffset - props.minCustomOffset);
                        var to = animation.from.y - (distance - (distance * (1 - percent)));
                        var step1 = TweenLite.to(this.obj, this.opts.speed, {
                            y : to,
                            delay: this.opts.delay,
                            onUpdate : $.proxy(function () {
                                this.outCallback('update');
                            }, this),
                            onComplete : $.proxy(function () {
                                this.outCallback('complete');
                            }, this)
                        });
                        this.tweens.instance = [];
                        this.tweens.instance.push(step1);
                    }
                } else {
                    if (this.opts.stateAttr.play) {
                        this.opts.stateAttr.play = false;
                    }
                }
                if (props.minCustomOffset > winTop) {
                    if (!this.opts.stateAttr.outTop) {
                        this.opts.stateAttr.outBot = false;
                        this.opts.stateAttr.outTop = true;
                        var step1 = TweenLite.to(this.obj, this.opts.speed, {
                            y : animation.from.y,
                            delay: this.opts.delay,
                            onUpdate : $.proxy(function () {
                                this.outCallback('update');
                            }, this),
                            onComplete : $.proxy(function () {
                                this.outCallback('complete');
                            }, this)
                        });
                        this.tweens.instance.push(step1);
                    }
                }
                if (winTop >= props.maxCustomOffset) {
                    if (!this.opts.stateAttr.outBot) {
                        this.opts.stateAttr.outTop = false;
                        this.opts.stateAttr.outBot = true;
                        var step1 = TweenLite.to(this.obj, this.opts.speed, {
                            y : animation.to.y,
                            delay: this.opts.delay,
                            onUpdate : $.proxy(function () {
                                this.outCallback('update');
                            }, this),
                            onComplete : $.proxy(function () {
                                this.outCallback('complete');
                            }, this)
                        });
                        this.tweens.instance.push(step1);
                    }
                }
            },
            scrollFunc : function () {
                this.winTop = $(win).scrollTop();
                if (this.opts.scrollStart == null) {
                    this.opts.scrollStart = this.winTop;
                    this.scrollAnimateFunc();
                }
                win.clearTimeout(this.scrollEndTimeout);
                this.scrollEndTimeout = win.setTimeout($.proxy(this.scrollEndFunc, this), 60);
            },
            scrollEndFunc : function () {
                this.opts.scrollStart = null;
                Util.cancelAFrame.call(win, this.scrollRequestFrame);
            },
            scrollAnimateFunc : function () {
                if (!this.opts.stateAttr.destroy) {
                    this.setOpts();
                    this.motionControl();
                }
                this.scrollRequestFrame = Util.requestAFrame.call(win, $.proxy(this.scrollAnimateFunc, this));
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTimeout);
                this.resizeEndTimeout = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setOpts();
                this.scrollFunc();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            destroy : function () {
                this.opts.stateAttr.destroy = true;
                this.tweens.kill();
                TweenLite.set(this.obj, {
                    y : 0
                });
                this.obj.css('transform', '');
                this.obj.unwrap();
                this.bindEvents(false);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        return ParallaxView;
    })();
    return ParallaxView;
}));

(function (global, factory) {
    global = global;
    global.PictureImg = factory();
}(this, function () { 'use strict';
    var PictureImg = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            Util = win.WhyGalaxy.util;
        function PictureImg (container, args) {
            if (!(this instanceof PictureImg)) {
                return new PictureImg(container, args);
            }
            var defParams = {
                container : container,
                target : 'img, .js-img-bg',
                props : [],
                classAttr : {
                    active : 'is-active',
                    bg : 'js-img-bg'
                },
                customEvent : '.PictureImg' + (new Date()).getTime() + Math.random(),
                viewType : null,
                resizeStart : null,
                on : {
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.container)).length) return;
            if (this.obj.attr('data-load') == 'true') return;
            this.init();
        }
        PictureImg.prototype = {
            init : function () {
                this.setElements();
                this.initOpts();
                this.resizeFunc();
                this.bindEvents(true);
                this.obj.attr('data-load', 'true');
                this.obj.data('PictureImg', this);
            },
            setElements : function () {
                this.targets = this.obj.find(this.opts.target).hide();
            },
            initOpts : function () {
                var _this = this;
                var mediaParse = function (str) {
                    var parse = '';
                    if ((str !== isUndefined) && (str.length)) {
                        parse = str.replace(/\s/gi, "").replace(/\(/gi, '').replace(/\)/gi, '');
                    } else {
                        parse = '';
                    }
                    return parse;
                };
                for (var min = 0, max = this.targets.length; min < max; min++) {
                    var target = this.targets.eq(min),
                        bgType = target.hasClass(this.opts.classAttr.bg),
                        dataMedia = $.trim(target.attr('data-media')),
                        dataMediaParse = mediaParse(dataMedia),
                        andSplits = dataMediaParse.split('and');
                    if (dataMediaParse.length) {
                        var data = {
                            'TARGET' : target,
                            'BGTYPE' : bgType
                        };
                        for (var asMin = 0, asMax = andSplits.length; asMin < asMax; asMin++) {
                            var aSplit = andSplits[asMin],
                                oSplit = aSplit.split(':');
                            if (oSplit[0] === 'min-width') {
                                data['MIN'] = parseInt(oSplit[1]);
                            } else if (oSplit[0] === 'max-width') {
                                data['MAX'] = parseInt(oSplit[1]);
                            }
                        }
                        this.opts.props.push(data);
                    }
                }

                var maxCheck = function (num) {
                    var props = _this.opts.props,
                        maxs = [];
                    for (var aMin = 0, aMax = props.length; aMin < aMax; aMin++) {
                        var prop = props[aMin];
                        if (num > prop['MAX']) {
                            maxs.push(prop['MAX']);
                        }
                    }
                    return maxs.length ? (Math.max.apply(null, maxs) + 1) : 0;
                };
                var minCheck = function (num) {
                    var props = _this.opts.props,
                        mins = [];
                    for (var bMin = 0, bMax = props.length; bMin < bMax; bMin++) {
                        var prop = props[bMin];
                        if (num < prop['MIN']) {
                            mins.push(prop['MIN']);
                        }
                    }
                    return mins.length ? (Math.min.apply(null, mins) - 1) : Infinity;
                };
                for (var pMin = 0, pMax = this.opts.props.length; pMin < pMax; pMin++) {
                    var prop = this.opts.props[pMin];
                    if (!prop.hasOwnProperty('MIN')) {
                        prop['MIN'] = maxCheck(prop['MAX']);
                    }
                    if (!prop.hasOwnProperty('MAX')) {
                        prop['MAX'] = minCheck(prop['MIN']);
                    }
                }

                this.opts.props.sort(function (a, b) {
                    if (a.MIN > b.MIN) {
                        return 1;
                    }
                    if (a.MIN < b.MIN) {
                        return -1;
                    }
                    if (a.MAX > b.MAX) {
                        return 1;
                    }
                    if (a.MAX < b.MAX) {
                        return -1;
                    }
                    return 0;
                });
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindEvents : function (type) {
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
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTime);
                this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 50);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.setLayout();
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            setLayout : function () {
                var props = this.opts.props,
                    actives = [];
                for (var pMin = 0, pMax = props.length; pMin < pMax; pMin++) {
                    var prop = props[pMin];
                    if (prop['MIN'] <= this.winWidth && prop['MAX'] >= this.winWidth) {
                        actives.push(pMin);
                    }
                }
                if (actives.length) {
                    var activeNum = actives[actives.length - 1];
                    if (this.opts.viewType != activeNum) {
                        if (this.opts.viewType !== null) {
                            props[this.opts.viewType]['TARGET'].hide().removeClass(this.opts.classAttr.active);
                        }
                        this.opts.viewType = activeNum;
                        if (props[activeNum]['TARGET'].attr('data-srcset') != isUndefined) {
                            props[activeNum]['TARGET'].removeAttr('src');
                            var url = props[activeNum]['TARGET'].attr('data-srcset');
                            if (props[activeNum]['BGTYPE']) {
                                props[activeNum]['TARGET'].css('background-image', 'url(' + url + ')');
                            } else {
                                props[activeNum]['TARGET'].attr('src', url);
                            }
                            props[activeNum]['TARGET'].removeAttr('data-srcset');
                        }
                        props[activeNum]['TARGET'].css('display', '').addClass(this.opts.classAttr.active);
                        this.outCallback('complete');
                    }
                } else {
                    if (this.opts.viewType !== null) {
                        this.opts.viewType = null;
                        this.targets.hide().removeClass(this.opts.classAttr.active);
                    }
                }
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        return PictureImg;
    })();
    return PictureImg;
}));

(function (global, factory) {
    global = global;
    global.PicturesLoaded = factory();
}(this, function () { 'use strict';

        var PicturesLoaded = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.WhyGalaxy.util;

                    function PicturesLoaded (container, args) {
            if (!(this instanceof PicturesLoaded)) {
                return new PicturesLoaded(container, args);
            }
            var defParams = {
                jsPicture : '.js-picture',
                videoContainer : '.video-container',
                stateAttr : {
                    destroy : false
                },
                on : {
                    update : null,
                    complete : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(container)).length) return;
            this.init();
        }
        PicturesLoaded.prototype = {
            init : function () {
                this.loadPictures();
            },
            loadPictures : function () {
                Util.def(this, {
                    pictures : {
                        img : {
                            active : false,
                            load : $.proxy(function (obj, callback) {
                                var deferred = $.Deferred();
                                var objLength = obj.length;
                                var doneNum = 0;
                                var allDoneFunc = $.proxy(function (obj) {
                                    callback(obj);
                                    if (doneNum == objLength) {
                                        if (this.opts.stateAttr.destroy) {
                                            deferred.reject();
                                        } else {
                                            deferred.resolve();
                                        }
                                    }
                                }, this);
                                var load = $.proxy(function (index) {
                                    var el = obj.eq(index);
                                    var hasLoad = el.attr('data-load') == 'true';
                                    if (hasLoad) {
                                        doneNum++;
                                        allDoneFunc(el);
                                    } else {
                                        new PictureImg(el);
                                        Util.imgLoaded(el).done($.proxy(function () {
                                            doneNum++;
                                            allDoneFunc(el);
                                        }, this));
                                    }
                                }, this)
                                for (var i = 0, max = objLength; i < max; i++) {
                                    load(i);
                                }
                                if (!obj.length) {
                                    allDoneFunc();
                                }
                                return deferred.promise();
                            }, this)
                        },
                        video : {
                            instance : [],
                            active : false,
                            destroy : $.proxy(function () {
                                for (var i = 0, max = this.pictures.video.instance.length; i < max; i++) {
                                    var instance = this.pictures.video.instance[i];
                                    instance.pause();
                                    instance.destroy();
                                }
                                this.pictures.video.instance = [];
                            }, this),
                            pauseAll : $.proxy(function () {
                                for (var i = 0, max = this.pictures.video.instance.length; i < max; i++) {
                                    var instance = this.pictures.video.instance[i];
                                    instance.pause();
                                }
                            }, this),
                            load : $.proxy(function (obj, callback) {
                                var deferred = $.Deferred();
                                var objLength = obj.length;
                                var doneNum = 0;
                                var allDoneFunc = $.proxy(function (obj) {
                                    callback(obj);
                                    if (doneNum == objLength) {
                                        if (this.opts.stateAttr.destroy) {
                                            deferred.reject();
                                        } else {
                                            deferred.resolve();
                                        }
                                    }
                                }, this);
                                var load = $.proxy(function (index) {
                                    var el = obj.eq(index);
                                    var hasLoad = el.attr('data-video-loaded') == 'true';
                                    if (hasLoad) {
                                        var instance = el.data('HiveVideo');
                                        doneNum++;
                                        allDoneFunc(el);
                                    } else {
                                        var instance = new HiveVideo(el, {
                                            isLoadAfterVideoPlay : true,
                                            on : {
                                                loaded : $.proxy(function () {
                                                    doneNum++;
                                                    allDoneFunc(el);
                                                }, this)
                                            }
                                        });
                                    }
                                    this.pictures.video.instance.push(instance);
                                }, this)
                                for (var i = 0, max = objLength; i < max; i++) {
                                    load(i);
                                }
                                if (!obj.length) {
                                    allDoneFunc();
                                }
                                return deferred.promise();
                            }, this)
                        },
                        destroy : $.proxy(function () {
                            this.pictures.video.pauseAll();
                        }, this),
                        load : $.proxy(function (obj) {
                            var deferred = $.Deferred();
                            var jsPictures = obj.find(this.opts.jsPicture);
                            var videoContainers = obj.find(this.opts.videoContainer);
                            this.pictures.img.active = jsPictures.length ? false : true;
                            this.pictures.video.active = videoContainers.length ? false : true;
                            var totalLength = jsPictures.length + videoContainers.length;
                            var doneNum = 0;
                            var allDone = $.proxy(function () {
                                if (this.pictures.img.active && this.pictures.video.active) {
                                    if (this.opts.stateAttr.destroy) {
                                        deferred.reject();
                                    } else {
                                        deferred.resolve();
                                    }
                                }
                            }, this);
                            var updateCallback = $.proxy(function (obj) {
                                doneNum++;
                                this.outCallback('update', {
                                    target : obj,
                                    data : {
                                        percent : doneNum / totalLength * 100,
                                        current : doneNum,
                                        total : totalLength
                                    }
                                });
                            }, this);
                            if (jsPictures.length) {
                                this.pictures.img.load(jsPictures, updateCallback).done($.proxy(function () {
                                    this.pictures.img.active = true;
                                    allDone();
                                }, this));
                            }
                            if (videoContainers.length) {
                                this.pictures.video.load(videoContainers, updateCallback).done($.proxy(function () {
                                    this.pictures.video.active = true;
                                    allDone();
                                }, this));
                            }
                            return deferred.promise();
                        }, this)
                    }
                });
                this.pictures.load(this.obj).done($.proxy(function () {
                    this.outCallback('complete');
                }, this));
            },
            destroy : function () {
                this.opts.stateAttr.destroy = true;
                this.pictures.destroy();
            },
            outCallback : function (ing, props) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                if (ing == 'update') {
                    callbackObj(props.target, props.data);
                } else {
                    callbackObj();
                }
            }
        };
        return PicturesLoaded;
    })();
    return PicturesLoaded;

}));

(function (global, factory) {
    global = global;
    global.ScrollActive = factory();
}(this, function () { 'use strict';

    var Component = (function (isUndefined) {
        var win = window,
            $ = win.jQuery,
            doc = win.document,
            Util = win.WhyGalaxy.util;
        function Component (container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                obj : container,
                props : {},
                offsetType : 'always', 
                stateAttr : {
                    play : false,
                    destroy : false,
                    direction : 'top'
                },
                customSize : function () {
                    return 0;
                },
                customEvent : '.Component' + (new Date()).getTime() + Math.random(),
                scrollStart : null,
                resizeStart : null,
                on : {
                    in : null,
                    out : null
                }
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init : function () {
                this.resizeFunc();
                this.bindEvents(true);
            },
            changeEvents : function (event) {
                var events = [],
                    eventNames = event.split(' ');
                for (var key in eventNames) {
                    events.push(eventNames[key] + this.opts.customEvent);
                }
                return events.join(' ');
            },
            bindEvents : function (type) {
                if (type) {
                    $(win).on(this.changeEvents('scroll'), $.proxy(this.scrollFunc, this));
                    $(win).on(this.changeEvents('resize'), $.proxy(this.resizeFunc, this));
                } else {
                    $(win).off(this.changeEvents('scroll'));
                    $(win).off(this.changeEvents('resize'));
                }
            },
            setOpts : function () {
                var winHeight = Util.winSize().h,
                    offset = this.obj.offset(),
                    height = this.obj.outerHeight(true),
                    customSize = this.opts.customSize(),
                    totalSize = (height >= winHeight) ? Math.min(winHeight, customSize) : customSize;
                this.opts.props['offset'] = offset.top;
                this.opts.props['minOffset'] = Math.ceil(offset.top - winHeight, 10);
                this.opts.props['minCustomOffset'] = this.opts.props['minOffset'] + totalSize;
                this.opts.props['maxOffset'] = Math.ceil(offset.top + height, 10);
                this.opts.props['maxCustomOffset'] = this.opts.props['maxOffset'] - totalSize;
            },
            activeControl : function () {
                var props = this.opts.props,
                    winTop = $(win).scrollTop();
                if (props.minOffset <= winTop && winTop < props.maxOffset) {
                    var inCallback = $.proxy(function () {
                        if (!this.opts.stateAttr.play) {
                            this.opts.stateAttr.play = true;
                            this.outCallback('in');
                        }
                    }, this);
                    if (this.opts.offsetType == 'always') {
                        if (props.minCustomOffset <= winTop && winTop < props.maxCustomOffset) {
                            inCallback();
                        }
                    } else {
                        if (this.opts.stateAttr.direction === 'top') {
                            if (props.minCustomOffset <= winTop && winTop < props.maxOffset) {
                                inCallback();
                            }
                        } else {
                            if (props.minOffset <= winTop && winTop < props.maxCustomOffset) {
                                inCallback();
                            }
                        }
                    }
                } else {
                    if (this.opts.stateAttr.play) {
                        this.opts.stateAttr.play = false;
                        this.outCallback('out');
                    }
                    if (props.minOffset > winTop) {
                        this.opts.stateAttr.direction = 'top';
                    }
                    if (props.maxOffset <= winTop) {
                        this.opts.stateAttr.direction = 'bottom';
                    }
                }
            },
            scrollFunc : function () {
                this.winTop = $(win).scrollTop();
                if (this.opts.scrollStart == null) {
                    this.opts.scrollStart = this.winTop;
                    this.scrollAnimateFunc();
                }
                win.clearTimeout(this.scrollEndTimeout);
                this.scrollEndTimeout = win.setTimeout($.proxy(this.scrollEndFunc, this), 60);
            },
            scrollEndFunc : function () {
                this.opts.scrollStart = null;
                Util.cancelAFrame.call(win, this.scrollRequestFrame);
            },
            scrollAnimateFunc : function () {
                if (!this.opts.stateAttr.destroy) {
                    this.setOpts();
                    this.activeControl();
                }
                this.scrollRequestFrame = Util.requestAFrame.call(win, $.proxy(this.scrollAnimateFunc, this));
            },
            resizeFunc : function () {
                this.winWidth = Util.winSize().w;
                if (this.opts.resizeStart == null) {
                    this.opts.resizeStart = this.winWidth;
                    this.resizeAnimateFunc();
                }
                win.clearTimeout(this.resizeEndTimeout);
                this.resizeEndTimeout = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
            },
            resizeEndFunc : function () {
                this.opts.resizeStart = null;
                this.setOpts();
                this.scrollFunc();
                Util.cancelAFrame.call(win, this.resizeRequestFrame);
            },
            resizeAnimateFunc : function () {
                this.resizeRequestFrame = Util.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
            },
            reInit : function () {
                this.setOpts();
                this.scrollFunc();
            },
            pause : function () {
                this.opts.stateAttr.play = false;
                this.opts.stateAttr.destroy = true;
                this.bindEvents(false);
            },
            play : function () {
                this.opts.stateAttr.destroy = false;
                this.resizeFunc();
                this.bindEvents(true);
            },
            destroy : function () {
                this.opts.stateAttr.destroy = true;
                this.bindEvents(false);
            },
            outCallback : function (ing) {
                var callbackObj = this.opts.on[ing];
                if (callbackObj == null) return;
                callbackObj();
            }
        };
        return Component;
    })();
    return Component;

}));

var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t,e,i,s,r,n,a,o,l,h,_,u,f,c;_gsScope._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},r=function(t,e,i){var s,r,n=t.cycle;for(s in n)r=n[s],t[s]="function"==typeof r?r(i,e[i],e):r[i%r.length];delete t.cycle},n=function(t){if("function"==typeof t)return t;var e="object"==typeof t?t:{each:t},i=e.ease,s=e.from||0,r=e.base||0,n={},a=isNaN(s),o=e.axis,l={center:.5,end:1}[s]||0;return function(t,h,_){var u,f,c,p,m,d,g,y,v,T=(_||e).length,x=n[T];if(!x){if(!(v="auto"===e.grid?0:(e.grid||[1/0])[0])){for(g=-1/0;g<(g=_[v++].getBoundingClientRect().left)&&v<T;);v--}for(x=n[T]=[],u=a?Math.min(v,T)*l-.5:s%v,f=a?T*l/v-.5:s/v|0,g=0,y=1/0,d=0;d<T;d++)c=d%v-u,p=f-(d/v|0),x[d]=m=o?Math.abs("y"===o?p:c):Math.sqrt(c*c+p*p),m>g&&(g=m),m<y&&(y=m);x.max=g-y,x.min=y,x.v=T=e.amount||e.each*(v>T?T-1:o?"y"===o?T/v:v:Math.max(v,T/v))||0,x.b=T<0?r-T:r}return T=(x[t]-x.min)/x.max,x.b+(i?i.getRatio(T):T)*x.v}},a=function(t,e,s){i.call(this,t,e,s),this._cycle=0,this._yoyo=!0===this.vars.yoyo||!!this.vars.yoyoEase,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._repeat&&this._uncache(!0),this.render=a.prototype.render},o=i._internals,l=o.isSelector,h=o.isArray,_=a.prototype=i.to({},.1,{}),u=[];a.version="2.1.3",_.constructor=a,_.kill()._gc=!1,a.killTweensOf=a.killDelayedCallsTo=i.killTweensOf,a.getTweensOf=i.getTweensOf,a.lagSmoothing=i.lagSmoothing,a.ticker=i.ticker,a.render=i.render,a.distribute=n,_.invalidate=function(){return this._yoyo=!0===this.vars.yoyo||!!this.vars.yoyoEase,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._yoyoEase=null,this._uncache(!0),i.prototype.invalidate.call(this)},_.updateTo=function(t,e){var s,r=this.ratio,n=this.vars.immediateRender||t.immediateRender;for(s in e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay)),t)this.vars[s]=t[s];if(this._initted||n)if(e)this._initted=!1,n&&this.render(0,!0,!0);else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&i._onPluginEvent("_onDisable",this),this._time/this._duration>.998){var a=this._totalTime;this.render(0,!0,!1),this._initted=!1,this.render(a,!0,!1)}else if(this._initted=!1,this._init(),this._time>0||n)for(var o,l=1/(1-r),h=this._firstPT;h;)o=h.s+h.c,h.c*=l,h.s=o-h.c,h=h._next;return this},_.render=function(t,e,s){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var r,n,a,l,h,_,u,f,c,p=this._dirty?this.totalDuration():this._totalDuration,m=this._time,d=this._totalTime,g=this._cycle,y=this._duration,v=this._rawPrevTime;if(t>=p-1e-8&&t>=0?(this._totalTime=p,this._cycle=this._repeat,this._yoyo&&0!=(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=y,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(r=!0,n="onComplete",s=s||this._timeline.autoRemoveChildren),0===y&&(this._initted||!this.vars.lazy||s)&&(this._startTime===this._timeline._duration&&(t=0),(v<0||t<=0&&t>=-1e-8||1e-8===v&&"isPause"!==this.data)&&v!==t&&(s=!0,v>1e-8&&(n="onReverseComplete")),this._rawPrevTime=f=!e||t||v===t?t:1e-8)):t<1e-8?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===y&&v>0)&&(n="onReverseComplete",r=this._reversed),t>-1e-8?t=0:t<0&&(this._active=!1,0===y&&(this._initted||!this.vars.lazy||s)&&(v>=0&&(s=!0),this._rawPrevTime=f=!e||t||v===t?t:1e-8)),this._initted||(s=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(l=y+this._repeatDelay,this._cycle=this._totalTime/l>>0,0!==this._cycle&&this._cycle===this._totalTime/l&&d<=t&&this._cycle--,this._time=this._totalTime-this._cycle*l,this._yoyo&&0!=(1&this._cycle)&&(this._time=y-this._time,(c=this._yoyoEase||this.vars.yoyoEase)&&(this._yoyoEase||(!0!==c||this._initted?this._yoyoEase=c=!0===c?this._ease:c instanceof Ease?c:Ease.map[c]:(c=this.vars.ease,this._yoyoEase=c=c?c instanceof Ease?c:"function"==typeof c?new Ease(c,this.vars.easeParams):Ease.map[c]||i.defaultEase:i.defaultEase)),this.ratio=c?1-c.getRatio((y-this._time)/y):0)),this._time>y?this._time=y:this._time<0&&(this._time=0)),this._easeType&&!c?(h=this._time/y,(1===(_=this._easeType)||3===_&&h>=.5)&&(h=1-h),3===_&&(h*=2),1===(u=this._easePower)?h*=h:2===u?h*=h*h:3===u?h*=h*h*h:4===u&&(h*=h*h*h*h),this.ratio=1===_?1-h:2===_?h:this._time/y<.5?h/2:1-h/2):c||(this.ratio=this._ease.getRatio(this._time/y))),m!==this._time||s||g!==this._cycle){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!s&&this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration))return this._time=m,this._totalTime=d,this._rawPrevTime=v,this._cycle=g,o.lazyTweens.push(this),void(this._lazy=[t,e]);!this._time||r||c?r&&this._ease._calcEnd&&!c&&(this.ratio=this._ease.getRatio(0===this._time?0:1)):this.ratio=this._ease.getRatio(this._time/y)}for(!1!==this._lazy&&(this._lazy=!1),this._active||!this._paused&&this._time!==m&&t>=0&&(this._active=!0),0===d&&(2===this._initted&&t>0&&this._init(),this._startAt&&(t>=0?this._startAt.render(t,!0,s):n||(n="_dummyGS")),this.vars.onStart&&(0===this._totalTime&&0!==y||e||this._callback("onStart"))),a=this._firstPT;a;)a.f?a.t[a.p](a.c*this.ratio+a.s):a.t[a.p]=a.c*this.ratio+a.s,a=a._next;this._onUpdate&&(t<0&&this._startAt&&this._startTime&&this._startAt.render(t,!0,s),e||(this._totalTime!==d||n)&&this._callback("onUpdate")),this._cycle!==g&&(e||this._gc||this.vars.onRepeat&&this._callback("onRepeat")),n&&(this._gc&&!s||(t<0&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,!0,s),r&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[n]&&this._callback(n),0===y&&1e-8===this._rawPrevTime&&1e-8!==f&&(this._rawPrevTime=0)))}else d!==this._totalTime&&this._onUpdate&&(e||this._callback("onUpdate"))},a.to=function(t,e,i){return new a(t,e,i)},a.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new a(t,e,i)},a.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new a(t,e,s)},a.staggerTo=a.allTo=function(t,e,o,_,f,c,p){var m,d,g,y,v=[],T=n(o.stagger||_),x=o.cycle,b=(o.startAt||u).cycle;for(h(t)||("string"==typeof t&&(t=i.selector(t)||t),l(t)&&(t=s(t))),m=(t=t||[]).length-1,g=0;g<=m;g++){for(y in d={},o)d[y]=o[y];if(x&&(r(d,t,g),null!=d.duration&&(e=d.duration,delete d.duration)),b){for(y in b=d.startAt={},o.startAt)b[y]=o.startAt[y];r(d.startAt,t,g)}d.delay=T(g,t[g],t)+(d.delay||0),g===m&&f&&(d.onComplete=function(){o.onComplete&&o.onComplete.apply(o.onCompleteScope||this,arguments),f.apply(p||o.callbackScope||this,c||u)}),v[g]=new a(t[g],e,d)}return v},a.staggerFrom=a.allFrom=function(t,e,i,s,r,n,o){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,a.staggerTo(t,e,i,s,r,n,o)},a.staggerFromTo=a.allFromTo=function(t,e,i,s,r,n,o,l){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,a.staggerTo(t,e,s,r,n,o,l)},a.delayedCall=function(t,e,i,s,r){return new a(e,0,{delay:t,onComplete:e,onCompleteParams:i,callbackScope:s,onReverseComplete:e,onReverseCompleteParams:i,immediateRender:!1,useFrames:r,overwrite:0})},a.set=function(t,e){return new a(t,0,e)},a.isTweening=function(t){return i.getTweensOf(t,!0).length>0};var f=function(t,e){for(var s=[],r=0,n=t._first;n;)n instanceof i?s[r++]=n:(e&&(s[r++]=n),r=(s=s.concat(f(n,e))).length),n=n._next;return s},c=a.getAllTweens=function(e){return f(t._rootTimeline,e).concat(f(t._rootFramesTimeline,e))};a.killAll=function(t,i,s,r){null==i&&(i=!0),null==s&&(s=!0);var n,a,o,l=c(0!=r),h=l.length,_=i&&s&&r;for(o=0;o<h;o++)a=l[o],(_||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&(t?a.totalTime(a._reversed?0:a.totalDuration()):a._enabled(!1,!1))},a.killChildTweensOf=function(t,e){if(null!=t){var r,n,_,u,f,c=o.tweenLookup;if("string"==typeof t&&(t=i.selector(t)||t),l(t)&&(t=s(t)),h(t))for(u=t.length;--u>-1;)a.killChildTweensOf(t[u],e);else{for(_ in r=[],c)for(n=c[_].target.parentNode;n;)n===t&&(r=r.concat(c[_].tweens)),n=n.parentNode;for(f=r.length,u=0;u<f;u++)e&&r[u].totalTime(r[u].totalDuration()),r[u]._enabled(!1,!1)}}};var p=function(t,i,s,r){i=!1!==i,s=!1!==s;for(var n,a,o=c(r=!1!==r),l=i&&s&&r,h=o.length;--h>-1;)a=o[h],(l||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&a.paused(t)};return a.pauseAll=function(t,e,i){p(!0,t,e,i)},a.resumeAll=function(t,e,i){p(!1,t,e,i)},a.globalTimeScale=function(e){var s=t._rootTimeline,r=i.ticker.time;return arguments.length?(e=e||1e-8,s._startTime=r-(r-s._startTime)*s._timeScale/e,s=t._rootFramesTimeline,r=i.ticker.frame,s._startTime=r-(r-s._startTime)*s._timeScale/e,s._timeScale=t._rootTimeline._timeScale=e,e):s._timeScale},_.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!=(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this.duration()?this._time/this._duration:this.ratio},_.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},_.time=function(t,e){if(!arguments.length)return this._time;this._dirty&&this.totalDuration();var i=this._duration,s=this._cycle,r=s*(i+this._repeatDelay);return t>i&&(t=i),this.totalTime(this._yoyo&&1&s?i-t+r:this._repeat?t+r:t,e)},_.duration=function(e){return arguments.length?t.prototype.duration.call(this,e):this._duration},_.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},_.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},_.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},_.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},a},!0),_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t);var i,s,r=this.vars;for(s in this._labels={},this.autoRemoveChildren=!!r.autoRemoveChildren,this.smoothChildTiming=!!r.smoothChildTiming,this._sortChildren=!0,this._onUpdate=r.onUpdate,r)i=r[s],o(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));o(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=i._internals,n=s._internals={},a=r.isSelector,o=r.isArray,l=r.lazyTweens,h=r.lazyRender,_=_gsScope._gsDefine.globals,u=function(t){var e,i={};for(e in t)i[e]=t[e];return i},f=function(t,e,i){var s,r,n=t.cycle;for(s in n)r=n[s],t[s]="function"==typeof r?r(i,e[i],e):r[i%r.length];delete t.cycle},c=n.pauseCallback=function(){},p=function(t,e,i,s){var r="immediateRender";return r in e||(e[r]=!(i&&!1===i[r]||s)),e},m=function(t){if("function"==typeof t)return t;var e="object"==typeof t?t:{each:t},i=e.ease,s=e.from||0,r=e.base||0,n={},a=isNaN(s),o=e.axis,l={center:.5,end:1}[s]||0;return function(t,h,_){var u,f,c,p,m,d,g,y,v,T=(_||e).length,x=n[T];if(!x){if(!(v="auto"===e.grid?0:(e.grid||[1/0])[0])){for(g=-1/0;g<(g=_[v++].getBoundingClientRect().left)&&v<T;);v--}for(x=n[T]=[],u=a?Math.min(v,T)*l-.5:s%v,f=a?T*l/v-.5:s/v|0,g=0,y=1/0,d=0;d<T;d++)c=d%v-u,p=f-(d/v|0),x[d]=m=o?Math.abs("y"===o?p:c):Math.sqrt(c*c+p*p),m>g&&(g=m),m<y&&(y=m);x.max=g-y,x.min=y,x.v=T=e.amount||e.each*(v>T?T-1:o?"y"===o?T/v:v:Math.max(v,T/v))||0,x.b=T<0?r-T:r}return T=(x[t]-x.min)/x.max,x.b+(i?i.getRatio(T):T)*x.v}},d=s.prototype=new e;return s.version="2.1.3",s.distribute=m,d.constructor=s,d.kill()._gc=d._forcingPlayhead=d._hasPause=!1,d.to=function(t,e,s,r){var n=s.repeat&&_.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},d.from=function(t,e,s,r){return this.add((s.repeat&&_.TweenMax||i).from(t,e,p(0,s)),r)},d.fromTo=function(t,e,s,r,n){var a=r.repeat&&_.TweenMax||i;return r=p(0,r,s),e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},d.staggerTo=function(t,e,r,n,o,l,h,_){var c,p,d=new s({onComplete:l,onCompleteParams:h,callbackScope:_,smoothChildTiming:this.smoothChildTiming}),g=m(r.stagger||n),y=r.startAt,v=r.cycle;for("string"==typeof t&&(t=i.selector(t)||t),a(t=t||[])&&(t=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i}(t)),p=0;p<t.length;p++)c=u(r),y&&(c.startAt=u(y),y.cycle&&f(c.startAt,t,p)),v&&(f(c,t,p),null!=c.duration&&(e=c.duration,delete c.duration)),d.to(t[p],e,c,g(p,t[p],t));return this.add(d,o)},d.staggerFrom=function(t,e,i,s,r,n,a,o){return i.runBackwards=!0,this.staggerTo(t,e,p(0,i),s,r,n,a,o)},d.staggerFromTo=function(t,e,i,s,r,n,a,o,l){return s.startAt=i,this.staggerTo(t,e,p(0,s,i),r,n,a,o,l)},d.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},d.set=function(t,e,s){return this.add(new i(t,0,p(0,e,null,!0)),s)},s.exportRoot=function(t,e){null==(t=t||{}).smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a,o,l=new s(t),h=l._timeline;for(null==e&&(e=!0),h._remove(l,!0),l._startTime=0,l._rawPrevTime=l._time=l._totalTime=h._time,a=h._first;a;)o=a._next,e&&a instanceof i&&a.target===a.vars.onComplete||((n=a._startTime-a._delay)<0&&(r=1),l.add(a,n)),a=o;return h.add(l,0),r&&l.totalDuration(),l},d.add=function(r,n,a,l){var h,_,u,f,c,p;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&o(r)){for(a=a||"normal",l=l||0,h=n,_=r.length,u=0;u<_;u++)o(f=r[u])&&(f=new s({tweens:f})),this.add(f,h),"string"!=typeof f&&"function"!=typeof f&&("sequence"===a?h=f._startTime+f.totalDuration()/f._timeScale:"start"===a&&(f._startTime-=f.delay())),h+=l;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(r._time||!r._duration&&r._initted)&&(h=(this.rawTime()-r._startTime)*r._timeScale,(!r._duration||Math.abs(Math.max(0,Math.min(r.totalDuration(),h)))-r._totalTime>1e-5)&&r.render(h,!1,!1)),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(p=(c=this).rawTime()>r._startTime;c._timeline;)p&&c._timeline.smoothChildTiming?c.totalTime(c._totalTime,!0):c._gc&&c._enabled(!0,!1),c=c._timeline;return this},d.remove=function(e){if(e instanceof t){this._remove(e,!1);var i=e._timeline=e.vars.useFrames?t._rootFramesTimeline:t._rootTimeline;return e._startTime=(e._paused?e._pauseTime:i._time)-(e._reversed?e.totalDuration()-e._totalTime:e._totalTime)/e._timeScale,this}if(e instanceof Array||e&&e.push&&o(e)){for(var s=e.length;--s>-1;)this.remove(e[s]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},d._remove=function(t,i){return e.prototype._remove.call(this,t,i),this._last?this._time>this.duration()&&(this._time=this._duration,this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},d.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},d.insert=d.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},d.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},d.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},d.addPause=function(t,e,s,r){var n=i.delayedCall(0,c,s,r||this);return n.vars.onComplete=n.vars.onReverseComplete=e,n.data="isPause",this._hasPause=!0,this.add(n,t)},d.removeLabel=function(t){return delete this._labels[t],this},d.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},d._parseTimeOrLabel=function(e,i,s,r){var n,a;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&o(r)))for(a=r.length;--a>-1;)r[a]instanceof t&&r[a].timeline===this&&this.remove(r[a]);if(n="number"!=typeof e||i?this.duration()>99999999999?this.recent().endTime(!1):this._duration:0,"string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-n:0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=n);else{if(-1===(a=e.indexOf("=")))return null==this._labels[e]?s?this._labels[e]=n+i:i:this._labels[e]+i;i=parseInt(e.charAt(a-1)+"1",10)*Number(e.substr(a+1)),e=a>1?this._parseTimeOrLabel(e.substr(0,a-1),0,s):n}return Number(e)+i},d.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),!1!==e)},d.stop=function(){return this.paused(!0)},d.gotoAndPlay=function(t,e){return this.play(t,e)},d.gotoAndStop=function(t,e){return this.pause(t,e)},d.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,r,n,a,o,_,u,f,c=this._time,p=this._dirty?this.totalDuration():this._totalDuration,m=this._startTime,d=this._timeScale,g=this._paused;if(c!==this._time&&(t+=this._time-c),this._hasPause&&!this._forcingPlayhead&&!e){if(t>c)for(s=this._first;s&&s._startTime<=t&&!_;)s._duration||"isPause"!==s.data||s.ratio||0===s._startTime&&0===this._rawPrevTime||(_=s),s=s._next;else for(s=this._last;s&&s._startTime>=t&&!_;)s._duration||"isPause"===s.data&&s._rawPrevTime>0&&(_=s),s=s._prev;_&&(this._time=this._totalTime=t=_._startTime,f=this._startTime+(this._reversed?this._duration-t:t)/this._timeScale)}if(t>=p-1e-8&&t>=0)this._totalTime=this._time=p,this._reversed||this._hasPausedChild()||(r=!0,a="onComplete",o=!!this._timeline.autoRemoveChildren,0===this._duration&&(t<=0&&t>=-1e-8||this._rawPrevTime<0||1e-8===this._rawPrevTime)&&this._rawPrevTime!==t&&this._first&&(o=!0,this._rawPrevTime>1e-8&&(a="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:1e-8,t=p+1e-4;else if(t<1e-8)if(this._totalTime=this._time=0,t>-1e-8&&(t=0),(0!==c||0===this._duration&&1e-8!==this._rawPrevTime&&(this._rawPrevTime>0||t<0&&this._rawPrevTime>=0))&&(a="onReverseComplete",r=this._reversed),t<0)this._active=!1,this._timeline.autoRemoveChildren&&this._reversed?(o=r=!0,a="onReverseComplete"):this._rawPrevTime>=0&&this._first&&(o=!0),this._rawPrevTime=t;else{if(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:1e-8,0===t&&r)for(s=this._first;s&&0===s._startTime;)s._duration||(r=!1),s=s._next;t=0,this._initted||(o=!0)}else this._totalTime=this._time=this._rawPrevTime=t;if(this._time!==c&&this._first||i||o||_){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==c&&t>0&&(this._active=!0),0===c&&this.vars.onStart&&(0===this._time&&this._duration||e||this._callback("onStart")),(u=this._time)>=c)for(s=this._first;s&&(n=s._next,u===this._time&&(!this._paused||g));)(s._active||s._startTime<=u&&!s._paused&&!s._gc)&&(_===s&&(this.pause(),this._pauseTime=f),s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=n;else for(s=this._last;s&&(n=s._prev,u===this._time&&(!this._paused||g));){if(s._active||s._startTime<=c&&!s._paused&&!s._gc){if(_===s){for(_=s._prev;_&&_.endTime()>this._time;)_.render(_._reversed?_.totalDuration()-(t-_._startTime)*_._timeScale:(t-_._startTime)*_._timeScale,e,i),_=_._prev;_=null,this.pause(),this._pauseTime=f}s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)}s=n}this._onUpdate&&(e||(l.length&&h(),this._callback("onUpdate"))),a&&(this._gc||m!==this._startTime&&d===this._timeScale||(0===this._time||p>=this.totalDuration())&&(r&&(l.length&&h(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[a]&&this._callback(a)))}},d._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},d.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)a._startTime<r||(a instanceof i?!1!==e&&(n[o++]=a):(!1!==s&&(n[o++]=a),!1!==t&&(o=(n=n.concat(a.getChildren(!0,e,s))).length))),a=a._next;return n},d.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),r=(s=i.getTweensOf(t)).length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},d.recent=function(){return this._recent},d._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},d.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},d._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},d.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return!1!==t&&(this._labels={}),this._uncache(!0)},d.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},d._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},d.totalTime=function(e,i,s){this._forcingPlayhead=!0;var r=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,r},d.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},d.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused&&!this._calculatingDuration?(this._calculatingDuration=1,this.add(r,r._startTime-r._delay),this._calculatingDuration=0):n=r._startTime,r._startTime<0&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale,this._time-=r._startTime,this._totalTime-=r._startTime,this._rawPrevTime-=r._startTime),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),(i=r._startTime+r._totalDuration/r._timeScale)>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return t&&this.totalDuration()?this.timeScale(this._totalDuration/t):this},d.paused=function(e){if(!1===e&&this._paused)for(var i=this._first;i;)i._startTime===this._time&&"isPause"===i.data&&(i._rawPrevTime=0),i=i._next;return t.prototype.paused.apply(this,arguments)},d.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},d.rawTime=function(t){return t&&(this._paused||this._repeat&&this.time()>0&&this.totalProgress()<1)?this._totalTime%(this._duration+this._repeatDelay):this._paused?this._totalTime:(this._timeline.rawTime(t)-this._startTime)*this._timeScale},s},!0),_gsScope._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=!!this.vars.yoyo,this._dirty=!0},r=e._internals,n=r.lazyTweens,a=r.lazyRender,o=_gsScope._gsDefine.globals,l=new i(null,null,1,0),h=s.prototype=new t;return h.constructor=s,h.kill()._gc=!1,s.version="2.1.3",h.invalidate=function(){return this._yoyo=!!this.vars.yoyo,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},h.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},h.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},h.removePause=function(e){return this.removeCallback(t._internals.pauseCallback,e)},h.tweenTo=function(t,i){i=i||{};var s,r,n,a={ease:l,useFrames:this.usesFrames(),immediateRender:!1,lazy:!1},h=i.repeat&&o.TweenMax||e;for(r in i)a[r]=i[r];return a.time=this._parseTimeOrLabel(t),s=Math.abs(Number(a.time)-this._time)/this._timeScale||.001,n=new h(this,s,a),a.onStart=function(){n.target.paused(!0),n.vars.time===n.target.time()||s!==n.duration()||n.isFromTo||n.duration(Math.abs(n.vars.time-n.target.time())/n.target._timeScale).render(n.time(),!0,!0),i.onStart&&i.onStart.apply(i.onStartScope||i.callbackScope||n,i.onStartParams||[])},n},h.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],callbackScope:this},i.immediateRender=!1!==i.immediateRender;var s=this.tweenTo(e,i);return s.isFromTo=1,s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},h.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,r,o,l,h,_,u,f,c,p=this._time,m=this._dirty?this.totalDuration():this._totalDuration,d=this._duration,g=this._totalTime,y=this._startTime,v=this._timeScale,T=this._rawPrevTime,x=this._paused,b=this._cycle;if(p!==this._time&&(t+=this._time-p),t>=m-1e-8&&t>=0)this._locked||(this._totalTime=m,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(r=!0,l="onComplete",h=!!this._timeline.autoRemoveChildren,0===this._duration&&(t<=0&&t>=-1e-8||T<0||1e-8===T)&&T!==t&&this._first&&(h=!0,T>1e-8&&(l="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:1e-8,this._yoyo&&1&this._cycle?this._time=t=0:(this._time=d,t=d+1e-4);else if(t<1e-8)if(this._locked||(this._totalTime=this._cycle=0),this._time=0,t>-1e-8&&(t=0),(0!==p||0===d&&1e-8!==T&&(T>0||t<0&&T>=0)&&!this._locked)&&(l="onReverseComplete",r=this._reversed),t<0)this._active=!1,this._timeline.autoRemoveChildren&&this._reversed?(h=r=!0,l="onReverseComplete"):T>=0&&this._first&&(h=!0),this._rawPrevTime=t;else{if(this._rawPrevTime=d||!e||t||this._rawPrevTime===t?t:1e-8,0===t&&r)for(s=this._first;s&&0===s._startTime;)s._duration||(r=!1),s=s._next;t=0,this._initted||(h=!0)}else 0===d&&T<0&&(h=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(_=d+this._repeatDelay,this._cycle=this._totalTime/_>>0,this._cycle&&this._cycle===this._totalTime/_&&g<=t&&this._cycle--,this._time=this._totalTime-this._cycle*_,this._yoyo&&1&this._cycle&&(this._time=d-this._time),this._time>d?(this._time=d,t=d+1e-4):this._time<0?this._time=t=0:t=this._time));if(this._hasPause&&!this._forcingPlayhead&&!e){if((t=this._time)>p||this._repeat&&b!==this._cycle)for(s=this._first;s&&s._startTime<=t&&!u;)s._duration||"isPause"!==s.data||s.ratio||0===s._startTime&&0===this._rawPrevTime||(u=s),s=s._next;else for(s=this._last;s&&s._startTime>=t&&!u;)s._duration||"isPause"===s.data&&s._rawPrevTime>0&&(u=s),s=s._prev;u&&(c=this._startTime+(this._reversed?this._duration-u._startTime:u._startTime)/this._timeScale,u._startTime<d&&(this._time=this._rawPrevTime=t=u._startTime,this._totalTime=t+this._cycle*(this._totalDuration+this._repeatDelay)))}if(this._cycle!==b&&!this._locked){var w=this._yoyo&&0!=(1&b),P=w===(this._yoyo&&0!=(1&this._cycle)),O=this._totalTime,S=this._cycle,k=this._rawPrevTime,R=this._time;if(this._totalTime=b*d,this._cycle<b?w=!w:this._totalTime+=d,this._time=p,this._rawPrevTime=0===d?T-1e-4:T,this._cycle=b,this._locked=!0,p=w?0:d,this.render(p,e,0===d),e||this._gc||this.vars.onRepeat&&(this._cycle=S,this._locked=!1,this._callback("onRepeat")),p!==this._time)return;if(P&&(this._cycle=b,this._locked=!0,p=w?d+1e-4:-1e-4,this.render(p,!0,!1)),this._locked=!1,this._paused&&!x)return;this._time=R,this._totalTime=O,this._cycle=S,this._rawPrevTime=k}if(this._time!==p&&this._first||i||h||u){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==g&&t>0&&(this._active=!0),0===g&&this.vars.onStart&&(0===this._totalTime&&this._totalDuration||e||this._callback("onStart")),(f=this._time)>=p)for(s=this._first;s&&(o=s._next,f===this._time&&(!this._paused||x));)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(u===s&&(this.pause(),this._pauseTime=c),s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=o;else for(s=this._last;s&&(o=s._prev,f===this._time&&(!this._paused||x));){if(s._active||s._startTime<=p&&!s._paused&&!s._gc){if(u===s){for(u=s._prev;u&&u.endTime()>this._time;)u.render(u._reversed?u.totalDuration()-(t-u._startTime)*u._timeScale:(t-u._startTime)*u._timeScale,e,i),u=u._prev;u=null,this.pause(),this._pauseTime=c}s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)}s=o}this._onUpdate&&(e||(n.length&&a(),this._callback("onUpdate"))),l&&(this._locked||this._gc||y!==this._startTime&&v===this._timeScale||(0===this._time||m>=this.totalDuration())&&(r&&(n.length&&a(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[l]&&this._callback(l)))}else g!==this._totalTime&&this._onUpdate&&(e||this._callback("onUpdate"))},h.getActive=function(t,e,i){var s,r,n=[],a=this.getChildren(t||null==t,e||null==t,!!i),o=0,l=a.length;for(s=0;s<l;s++)(r=a[s]).isActive()&&(n[o++]=r);return n},h.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;e<s;e++)if(i[e].time>t)return i[e].name;return null},h.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(e[i].time<t)return e[i].name;return null},h.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},h.invalidate=function(){return this._locked=!1,t.prototype.invalidate.call(this)},h.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!=(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()||0},h.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()||0},h.totalDuration=function(e){return arguments.length?-1!==this._repeat&&e?this.timeScale(this.totalDuration()/e):this:(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},h.time=function(t,e){if(!arguments.length)return this._time;this._dirty&&this.totalDuration();var i=this._duration,s=this._cycle,r=s*(i+this._repeatDelay);return t>i&&(t=i),this.totalTime(this._yoyo&&1&s?i-t+r:this._repeat?t+r:t,e)},h.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},h.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},h.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},h.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),t=180/Math.PI,e=[],i=[],s=[],r={},n=_gsScope._gsDefine.globals,a=function(t,e,i,s){i===s&&(i=s-(s-e)/1e6),t===e&&(e=t+(i-t)/1e6),this.a=t,this.b=e,this.c=i,this.d=s,this.da=s-t,this.ca=i-t,this.ba=e-t},o=function(t,e,i,s){var r={a:t},n={},a={},o={c:s},l=(t+e)/2,h=(e+i)/2,_=(i+s)/2,u=(l+h)/2,f=(h+_)/2,c=(f-u)/8;return r.b=l+(t-l)/4,n.b=u+c,r.c=n.a=(r.b+n.b)/2,n.c=a.a=(u+f)/2,a.b=f-c,o.b=_+(s-_)/4,a.c=o.a=(a.b+o.b)/2,[r,n,a,o]},l=function(t,r,n,a,l){var h,_,u,f,c,p,m,d,g,y,v,T,x,b=t.length-1,w=0,P=t[0].a;for(h=0;h<b;h++)_=(c=t[w]).a,u=c.d,f=t[w+1].d,l?(v=e[h],x=((T=i[h])+v)*r*.25/(a?.5:s[h]||.5),d=u-((p=u-(u-_)*(a?.5*r:0!==v?x/v:0))+(((m=u+(f-u)*(a?.5*r:0!==T?x/T:0))-p)*(3*v/(v+T)+.5)/4||0))):d=u-((p=u-(u-_)*r*.5)+(m=u+(f-u)*r*.5))/2,p+=d,m+=d,c.c=g=p,c.b=0!==h?P:P=c.a+.6*(c.c-c.a),c.da=u-_,c.ca=g-_,c.ba=P-_,n?(y=o(_,P,g,u),t.splice(w,1,y[0],y[1],y[2],y[3]),w+=4):w++,P=m;(c=t[w]).b=P,c.c=P+.4*(c.d-P),c.da=c.d-c.a,c.ca=c.c-c.a,c.ba=P-c.a,n&&(y=o(c.a,P,c.c,c.d),t.splice(w,1,y[0],y[1],y[2],y[3]))},h=function(t,s,r,n){var o,l,h,_,u,f,c=[];if(n)for(l=(t=[n].concat(t)).length;--l>-1;)"string"==typeof(f=t[l][s])&&"="===f.charAt(1)&&(t[l][s]=n[s]+Number(f.charAt(0)+f.substr(2)));if((o=t.length-2)<0)return c[0]=new a(t[0][s],0,0,t[0][s]),c;for(l=0;l<o;l++)h=t[l][s],_=t[l+1][s],c[l]=new a(h,0,0,_),r&&(u=t[l+2][s],e[l]=(e[l]||0)+(_-h)*(_-h),i[l]=(i[l]||0)+(u-_)*(u-_));return c[l]=new a(t[l][s],0,0,t[l+1][s]),c},_=function(t,n,a,o,_,u){var f,c,p,m,d,g,y,v,T={},x=[],b=u||t[0];for(c in _="string"==typeof _?","+_+",":",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",null==n&&(n=1),t[0])x.push(c);if(t.length>1){for(v=t[t.length-1],y=!0,f=x.length;--f>-1;)if(c=x[f],Math.abs(b[c]-v[c])>.05){y=!1;break}y&&(t=t.concat(),u&&t.unshift(u),t.push(t[1]),u=t[t.length-3])}for(e.length=i.length=s.length=0,f=x.length;--f>-1;)c=x[f],r[c]=-1!==_.indexOf(","+c+","),T[c]=h(t,c,r[c],u);for(f=e.length;--f>-1;)e[f]=Math.sqrt(e[f]),i[f]=Math.sqrt(i[f]);if(!o){for(f=x.length;--f>-1;)if(r[c])for(g=(p=T[x[f]]).length-1,m=0;m<g;m++)d=p[m+1].da/i[m]+p[m].da/e[m]||0,s[m]=(s[m]||0)+d*d;for(f=s.length;--f>-1;)s[f]=Math.sqrt(s[f])}for(f=x.length,m=a?4:1;--f>-1;)p=T[c=x[f]],l(p,n,a,o,r[c]),y&&(p.splice(0,m),p.splice(p.length-m,m));return T},u=function(t,e,i){for(var s,r,n,a,o,l,h,_,u,f,c,p=1/i,m=t.length;--m>-1;)for(n=(f=t[m]).a,a=f.d-n,o=f.c-n,l=f.b-n,s=r=0,_=1;_<=i;_++)s=r-(r=((h=p*_)*h*a+3*(u=1-h)*(h*o+u*l))*h),e[c=m*i+_-1]=(e[c]||0)+s*s},f=_gsScope._gsDefine.plugin({propName:"bezier",priority:-1,version:"1.3.9",API:2,global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._mod={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var s,r,n,o,l,h=e.values||[],f={},c=h[0],p=e.autoRotate||i.vars.orientToBezier;for(s in this._autoRotate=p?p instanceof Array?p:[["x","y","rotation",!0===p?0:Number(p)||0]]:null,c)this._props.push(s);for(n=this._props.length;--n>-1;)s=this._props[n],this._overwriteProps.push(s),r=this._func[s]="function"==typeof t[s],f[s]=r?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]():parseFloat(t[s]),l||f[s]!==h[0][s]&&(l=f);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?_(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,l):function(t,e,i){var s,r,n,o,l,h,_,u,f,c,p,m={},d="cubic"===(e=e||"soft")?3:2,g="soft"===e,y=[];if(g&&i&&(t=[i].concat(t)),null==t||t.length<d+1)throw"invalid Bezier data";for(f in t[0])y.push(f);for(h=y.length;--h>-1;){for(m[f=y[h]]=l=[],c=0,u=t.length,_=0;_<u;_++)s=null==i?t[_][f]:"string"==typeof(p=t[_][f])&&"="===p.charAt(1)?i[f]+Number(p.charAt(0)+p.substr(2)):Number(p),g&&_>1&&_<u-1&&(l[c++]=(s+l[c-2])/2),l[c++]=s;for(u=c-d+1,c=0,_=0;_<u;_+=d)s=l[_],r=l[_+1],n=l[_+2],o=2===d?0:l[_+3],l[c++]=p=3===d?new a(s,r,n,o):new a(s,(2*r+s)/3,(2*r+n)/3,n);l.length=c}return m}(h,e.type,f),this._segCount=this._beziers[s].length,this._timeRes){var m=function(t,e){var i,s,r,n,a=[],o=[],l=0,h=0,_=(e=e>>0||6)-1,f=[],c=[];for(i in t)u(t[i],a,e);for(r=a.length,s=0;s<r;s++)l+=Math.sqrt(a[s]),c[n=s%e]=l,n===_&&(h+=l,f[n=s/e>>0]=c,o[n]=h,l=0,c=[]);return{length:h,lengths:o,segments:f}}(this._beziers,this._timeRes);this._length=m.length,this._lengths=m.lengths,this._segments=m.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length}if(p=this._autoRotate)for(this._initialRotations=[],p[0]instanceof Array||(this._autoRotate=p=[p]),n=p.length;--n>-1;){for(o=0;o<3;o++)s=p[n][o],this._func[s]="function"==typeof t[s]&&t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)];s=p[n][2],this._initialRotations[n]=(this._func[s]?this._func[s].call(this._target):this._target[s])||0,this._overwriteProps.push(s)}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(e){var i,s,r,n,a,o,l,h,_,u,f,c=this._segCount,p=this._func,m=this._target,d=e!==this._startRatio;if(this._timeRes){if(_=this._lengths,u=this._curSeg,f=e*this._length,r=this._li,f>this._l2&&r<c-1){for(h=c-1;r<h&&(this._l2=_[++r])<=f;);this._l1=_[r-1],this._li=r,this._curSeg=u=this._segments[r],this._s2=u[this._s1=this._si=0]}else if(f<this._l1&&r>0){for(;r>0&&(this._l1=_[--r])>=f;);0===r&&f<this._l1?this._l1=0:r++,this._l2=_[r],this._li=r,this._curSeg=u=this._segments[r],this._s1=u[(this._si=u.length-1)-1]||0,this._s2=u[this._si]}if(i=r,f-=this._l1,r=this._si,f>this._s2&&r<u.length-1){for(h=u.length-1;r<h&&(this._s2=u[++r])<=f;);this._s1=u[r-1],this._si=r}else if(f<this._s1&&r>0){for(;r>0&&(this._s1=u[--r])>=f;);0===r&&f<this._s1?this._s1=0:r++,this._s2=u[r],this._si=r}o=1===e?1:(r+(f-this._s1)/(this._s2-this._s1))*this._prec||0}else o=(e-(i=e<0?0:e>=1?c-1:c*e>>0)*(1/c))*c;for(s=1-o,r=this._props.length;--r>-1;)n=this._props[r],l=(o*o*(a=this._beziers[n][i]).da+3*s*(o*a.ca+s*a.ba))*o+a.a,this._mod[n]&&(l=this._mod[n](l,m)),p[n]?m[n](l):m[n]=l;if(this._autoRotate){var g,y,v,T,x,b,w,P=this._autoRotate;for(r=P.length;--r>-1;)n=P[r][2],b=P[r][3]||0,w=!0===P[r][4]?1:t,a=this._beziers[P[r][0]],g=this._beziers[P[r][1]],a&&g&&(a=a[i],g=g[i],y=a.a+(a.b-a.a)*o,y+=((T=a.b+(a.c-a.b)*o)-y)*o,T+=(a.c+(a.d-a.c)*o-T)*o,v=g.a+(g.b-g.a)*o,v+=((x=g.b+(g.c-g.b)*o)-v)*o,x+=(g.c+(g.d-g.c)*o-x)*o,l=d?Math.atan2(x-v,T-y)*w+b:this._initialRotations[r],this._mod[n]&&(l=this._mod[n](l,m)),p[n]?m[n](l):m[n]=l)}}}),c=f.prototype,f.bezierThrough=_,f.cubicToQuadratic=o,f._autoCSS=!0,f.quadraticToCubic=function(t,e,i){return new a(t,(2*e+t)/3,(2*e+i)/3,i)},f._cssRegister=function(){var t=n.CSSPlugin;if(t){var e=t._internals,i=e._parseToProxy,s=e._setPluginRatio,r=e.CSSPropTween;e._registerComplexSpecialProp("bezier",{parser:function(t,e,n,a,o,l){e instanceof Array&&(e={values:e}),l=new f;var h,_,u,c=e.values,p=c.length-1,m=[],d={};if(p<0)return o;for(h=0;h<=p;h++)u=i(t,c[h],a,o,l,p!==h),m[h]=u.end;for(_ in e)d[_]=e[_];return d.values=m,(o=new r(t,"bezier",0,0,u.pt,2)).data=u,o.plugin=l,o.setRatio=s,0===d.autoRotate&&(d.autoRotate=!0),!d.autoRotate||d.autoRotate instanceof Array||(h=!0===d.autoRotate?0:Number(d.autoRotate),d.autoRotate=null!=u.end.left?[["left","top","rotation",h,!1]]:null!=u.end.x&&[["x","y","rotation",h,!1]]),d.autoRotate&&(a._transform||a._enableTransforms(!1),u.autoRotate=a._target._gsTransform,u.proxy.rotation=u.autoRotate.rotation||0,a._overwriteProps.push("rotation")),l._onInitTween(u.proxy,d,a._tween),o}})}},c._mod=function(t){for(var e,i=this._overwriteProps,s=i.length;--s>-1;)(e=t[i[s]])&&"function"==typeof e&&(this._mod[i[s]]=e)},c._kill=function(t){var e,i,s=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=s.length;--i>-1;)s[i]===e&&s.splice(i,1);if(s=this._autoRotate)for(i=s.length;--i>-1;)t[s[i][2]]&&s.splice(i,1);return this._super._kill.call(this,t)},_gsScope._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o=_gsScope._gsDefine.globals,l={},h=a.prototype=new t("css");h.constructor=a,a.version="2.1.3",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",a.defaultSmoothOrigin=!0,h="px",a.suffixMap={top:h,right:h,bottom:h,left:h,width:h,height:h,fontSize:h,padding:h,margin:h,perspective:h,lineHeight:""};var _,u,f,c,p,m,d,g,y=/(?:\-|\.|\b)(\d|\.|e\-)+/g,v=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,T=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,x=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b),?/gi,b=/(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,w=/(?:\d|\-|\+|=|#|\.)*/g,P=/opacity *= *([^)]*)/i,O=/opacity:([^;]*)/i,S=/alpha\(opacity *=.+?\)/i,k=/^(rgb|hsl)/,R=/([A-Z])/g,A=/-([a-z])/gi,C=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,M=function(t,e){return e.toUpperCase()},D=/(?:Left|Right|Width)/i,F=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,z=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,E=/,(?=[^\)]*(?:\(|$))/gi,I=/[\s,\(]/i,X=Math.PI/180,N=180/Math.PI,L={},B={style:{}},Y=_gsScope.document||{createElement:function(){return B}},j=function(t,e){var i=Y.createElementNS?Y.createElementNS(e||"http://www.w3.org/1999/xhtml",t):Y.createElement(t);return i.style?i:Y.createElement(t)},U=j("div"),V=j("img"),q=a._internals={_specialProps:l},W=(_gsScope.navigator||{}).userAgent||"",G=function(){var t=W.indexOf("Android"),e=j("a");return f=-1!==W.indexOf("Safari")&&-1===W.indexOf("Chrome")&&(-1===t||parseFloat(W.substr(t+8,2))>3),p=f&&parseFloat(W.substr(W.indexOf("Version/")+8,2))<6,c=-1!==W.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(W)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(W))&&(m=parseFloat(RegExp.$1)),!!e&&(e.style.cssText="top:1px;opacity:.55;",/^0.55/.test(e.style.opacity))}(),Z=function(t){return P.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},H=function(t){_gsScope.console&&console.log(t)},$="",Q="",K=function(t,e){var i,s,r=(e=e||U).style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?($="-"+(Q=3===s?"ms":i[s]).toLowerCase()+"-",Q+t):null},J="undefined"!=typeof window?window:Y.defaultView||{getComputedStyle:function(){}},tt=function(t){return J.getComputedStyle(t)},et=a.getStyle=function(t,e,i,s,r){var n;return G||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||tt(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(R,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):Z(t)},it=q.convertToPixels=function(t,i,s,r,n){if("px"===r||!r&&"lineHeight"!==i)return s;if("auto"===r||!s)return 0;var o,l,h,_=D.test(i),u=t,f=U.style,c=s<0,p=1===s;if(c&&(s=-s),p&&(s*=100),"lineHeight"!==i||r)if("%"===r&&-1!==i.indexOf("border"))o=s/100*(_?t.clientWidth:t.clientHeight);else{if(f.cssText="border:0 solid red;position:"+et(t,"position")+";line-height:0;","%"!==r&&u.appendChild&&"v"!==r.charAt(0)&&"rem"!==r)f[_?"borderLeftWidth":"borderTopWidth"]=s+r;else{if(u=t.parentNode||Y.body,-1!==et(u,"display").indexOf("flex")&&(f.position="absolute"),l=u._gsCache,h=e.ticker.frame,l&&_&&l.time===h)return l.width*s/100;f[_?"width":"height"]=s+r}u.appendChild(U),o=parseFloat(U[_?"offsetWidth":"offsetHeight"]),u.removeChild(U),_&&"%"===r&&!1!==a.cacheWidths&&((l=u._gsCache=u._gsCache||{}).time=h,l.width=o/s*100),0!==o||n||(o=it(t,i,s,r,!0))}else l=tt(t).lineHeight,t.style.lineHeight=s,o=parseFloat(tt(t).lineHeight),t.style.lineHeight=l;return p&&(o/=100),c?-o:o},st=q.calculateOffset=function(t,e,i){if("absolute"!==et(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=et(t,"margin"+s,i);return t["offset"+s]-(it(t,e,parseFloat(r),r.replace(w,""))||0)},rt=function(t,e){var i,s,r,n={};if(e=e||tt(t))if(i=e.length)for(;--i>-1;)-1!==(r=e[i]).indexOf("-transform")&&Et!==r||(n[r.replace(A,M)]=e.getPropertyValue(r));else for(i in e)-1!==i.indexOf("Transform")&&zt!==i||(n[i]=e[i]);else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===n[i]&&(n[i.replace(A,M)]=e[i]);return G||(n.opacity=Z(t)),s=Zt(t,e,!1),n.rotation=s.rotation,n.skewX=s.skewX,n.scaleX=s.scaleX,n.scaleY=s.scaleY,n.x=s.x,n.y=s.y,Xt&&(n.z=s.z,n.rotationX=s.rotationX,n.rotationY=s.rotationY,n.scaleZ=s.scaleZ),n.filters&&delete n.filters,n},nt=function(t,e,i,s,r){var n,a,o,l={},h=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"!=typeof n&&"string"!=typeof n||(l[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(b,"")?n:0:st(t,a),void 0!==h[a]&&(o=new Tt(h,a,h[a],o))));if(s)for(a in s)"className"!==a&&(l[a]=s[a]);return{difs:l,firstMPT:o}},at={width:["Left","Right"],height:["Top","Bottom"]},ot=["marginLeft","marginRight","marginTop","marginBottom"],lt=function(t,e,i){if("svg"===(t.nodeName+"").toLowerCase())return(i||tt(t))[e]||0;if(t.getCTM&&qt(t))return t.getBBox()[e]||0;var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=at[e],n=r.length;for(i=i||tt(t);--n>-1;)s-=parseFloat(et(t,"padding"+r[n],i,!0))||0,s-=parseFloat(et(t,"border"+r[n]+"Width",i,!0))||0;return s},ht=function(t,e){if("contain"===t||"auto"===t||"auto auto"===t)return t+" ";null!=t&&""!==t||(t="0 0");var i,s=t.split(" "),r=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":s[0],n=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":s[1];if(s.length>3&&!e){for(s=t.split(", ").join(",").split(","),t=[],i=0;i<s.length;i++)t.push(ht(s[i]));return t.join(",")}return null==n?n="center"===r?"50%":"0":"center"===n&&(n="50%"),("center"===r||isNaN(parseFloat(r))&&-1===(r+"").indexOf("="))&&(r="50%"),t=r+" "+n+(s.length>2?" "+s[2]:""),e&&(e.oxp=-1!==r.indexOf("%"),e.oyp=-1!==n.indexOf("%"),e.oxr="="===r.charAt(1),e.oyr="="===n.charAt(1),e.ox=parseFloat(r.replace(b,"")),e.oy=parseFloat(n.replace(b,"")),e.v=t),e||t},_t=function(t,e){return"function"==typeof t&&(t=t(g,d)),"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)||0},ut=function(t,e){"function"==typeof t&&(t=t(g,d));var i="string"==typeof t&&"="===t.charAt(1);return"string"==typeof t&&"v"===t.charAt(t.length-2)&&(t=(i?t.substr(0,2):0)+window["inner"+("vh"===t.substr(-2)?"Height":"Width")]*(parseFloat(i?t.substr(2):t)/100)),null==t?e:i?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)||0},ft=function(t,e,i,s){var r,n,a,o;return"function"==typeof t&&(t=t(g,d)),null==t?a=e:"number"==typeof t?a=t:(360,r=t.split("_"),n=((o="="===t.charAt(1))?parseInt(t.charAt(0)+"1",10)*parseFloat(r[0].substr(2)):parseFloat(r[0]))*(-1===t.indexOf("rad")?1:N)-(o?0:e),r.length&&(s&&(s[i]=e+n),-1!==t.indexOf("short")&&(n%=360)!==n%180&&(n=n<0?n+360:n-360),-1!==t.indexOf("_cw")&&n<0?n=(n+3599999999640)%360-360*(n/360|0):-1!==t.indexOf("ccw")&&n>0&&(n=(n-3599999999640)%360-360*(n/360|0))),a=e+n),a<1e-6&&a>-1e-6&&(a=0),a},ct={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},pt=function(t,e,i){return 255*(6*(t=t<0?t+1:t>1?t-1:t)<1?e+(i-e)*t*6:t<.5?i:3*t<2?e+(i-e)*(2/3-t)*6:e)+.5|0},mt=a.parseColor=function(t,e){var i,s,r,n,a,o,l,h,_,u,f;if(t)if("number"==typeof t)i=[t>>16,t>>8&255,255&t];else{if(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),ct[t])i=ct[t];else if("#"===t.charAt(0))4===t.length&&(s=t.charAt(1),r=t.charAt(2),n=t.charAt(3),t="#"+s+s+r+r+n+n),i=[(t=parseInt(t.substr(1),16))>>16,t>>8&255,255&t];else if("hsl"===t.substr(0,3))if(i=f=t.match(y),e){if(-1!==t.indexOf("="))return t.match(v)}else a=Number(i[0])%360/360,o=Number(i[1])/100,s=2*(l=Number(i[2])/100)-(r=l<=.5?l*(o+1):l+o-l*o),i.length>3&&(i[3]=Number(i[3])),i[0]=pt(a+1/3,s,r),i[1]=pt(a,s,r),i[2]=pt(a-1/3,s,r);else i=t.match(y)||ct.transparent;i[0]=Number(i[0]),i[1]=Number(i[1]),i[2]=Number(i[2]),i.length>3&&(i[3]=Number(i[3]))}else i=ct.black;return e&&!f&&(s=i[0]/255,r=i[1]/255,n=i[2]/255,l=((h=Math.max(s,r,n))+(_=Math.min(s,r,n)))/2,h===_?a=o=0:(u=h-_,o=l>.5?u/(2-h-_):u/(h+_),a=h===s?(r-n)/u+(r<n?6:0):h===r?(n-s)/u+2:(s-r)/u+4,a*=60),i[0]=a+.5|0,i[1]=100*o+.5|0,i[2]=100*l+.5|0),i},dt=function(t,e){var i,s,r,n=t.match(gt)||[],a=0,o="";if(!n.length)return t;for(i=0;i<n.length;i++)s=n[i],a+=(r=t.substr(a,t.indexOf(s,a)-a)).length+s.length,3===(s=mt(s,e)).length&&s.push(1),o+=r+(e?"hsla("+s[0]+","+s[1]+"%,"+s[2]+"%,"+s[3]:"rgba("+s.join(","))+")";return o+t.substr(a)},gt="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";for(h in ct)gt+="|"+h+"\\b";gt=new RegExp(gt+")","gi"),a.colorStringFilter=function(t){var e,i=t[0]+" "+t[1];gt.test(i)&&(e=-1!==i.indexOf("hsl(")||-1!==i.indexOf("hsla("),t[0]=dt(t[0],e),t[1]=dt(t[1],e)),gt.lastIndex=0},e.defaultStringFilter||(e.defaultStringFilter=a.colorStringFilter);var yt=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(gt)||[""])[0]:"",a=t.split(n).join("").match(T)||[],o=t.substr(0,t.indexOf(a[0])),l=")"===t.charAt(t.length-1)?")":"",h=-1!==t.indexOf(" ")?" ":",",_=a.length,u=_>0?a[0].replace(y,""):"";return _?r=e?function(t){var e,f,c,p;if("number"==typeof t)t+=u;else if(s&&E.test(t)){for(p=t.replace(E,"|").split("|"),c=0;c<p.length;c++)p[c]=r(p[c]);return p.join(",")}if(e=(t.match(gt)||[n])[0],c=(f=t.split(e).join("").match(T)||[]).length,_>c--)for(;++c<_;)f[c]=i?f[(c-1)/2|0]:a[c];return o+f.join(h)+h+e+l+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,f;if("number"==typeof t)t+=u;else if(s&&E.test(t)){for(n=t.replace(E,"|").split("|"),f=0;f<n.length;f++)n[f]=r(n[f]);return n.join(",")}if(f=(e=t.match(","===h?T:x)||[]).length,_>f--)for(;++f<_;)e[f]=i?e[(f-1)/2|0]:a[f];return(o&&"none"!==t&&t.substr(0,t.indexOf(e[0]))||o)+e.join(h)+l}:function(t){return t}},vt=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var l,h=(i+"").split(" ");for(o={},l=0;l<4;l++)o[t[l]]=h[l]=h[l]||h[(l-1)/2>>0];return r.parse(e,o,n,a)}},Tt=(q._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n,a=this.data,o=a.proxy,l=a.firstMPT;l;)e=o[l.v],l.r?e=l.r(e):e<1e-6&&e>-1e-6&&(e=0),l.t[l.p]=e,l=l._next;if(a.autoRotate&&(a.autoRotate.rotation=a.mod?a.mod.call(this._tween,o.rotation,this.t,this._tween):o.rotation),1===t||0===t)for(l=a.firstMPT,n=1===t?"e":"b";l;){if((i=l.t).type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;s<i.l;s++)r+=i["xn"+s]+i["xs"+(s+1)];i[n]=r}}else i[n]=i.s+i.xs0;l=l._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),xt=(q._parseToProxy=function(t,e,i,s,r,n){var a,o,l,h,_,u=s,f={},c={},p=i._transform,m=L;for(i._transform=null,L=e,s=_=i.parse(t,e,s,r),L=m,n&&(i._transform=p,u&&(u._prev=null,u._prev&&(u._prev._next=null)));s&&s!==u;){if(s.type<=1&&(c[o=s.p]=s.s+s.c,f[o]=s.s,n||(h=new Tt(s,"s",o,h,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)l="xn"+a,c[o=s.p+"_"+l]=s.data[l],f[o]=s[l],n||(h=new Tt(s,l,o,h,s.rxp[l]));s=s._next}return{proxy:f,end:c,firstMPT:h,pt:_}},q.CSSPropTween=function(t,e,s,r,a,o,l,h,_,u,f){this.t=t,this.p=e,this.s=s,this.c=r,this.n=l||e,t instanceof xt||n.push(this.n),this.r=h?"function"==typeof h?h:Math.round:h,this.type=o||0,_&&(this.pr=_,i=!0),this.b=void 0===u?s:u,this.e=void 0===f?s+r:f,a&&(this._next=a,a._prev=this)}),bt=function(t,e,i,s,r,n){var a=new xt(t,e,i,s-i,r,-1,n);return a.b=i,a.e=a.xs0=s,a},wt=a.parseComplex=function(t,e,i,s,r,n,o,l,h,u){i=i||n||"","function"==typeof s&&(s=s(g,d)),o=new xt(t,e,0,0,o,u?2:1,null,!1,l,i,s),s+="",r&&gt.test(s+i)&&(s=[i,s],a.colorStringFilter(s),i=s[0],s=s[1]);var f,c,p,m,T,x,b,w,P,O,S,k,R,A=i.split(", ").join(",").split(" "),C=s.split(", ").join(",").split(" "),M=A.length,D=!1!==_;for(-1===s.indexOf(",")&&-1===i.indexOf(",")||(-1!==(s+i).indexOf("rgb")||-1!==(s+i).indexOf("hsl")?(A=A.join(" ").replace(E,", ").split(" "),C=C.join(" ").replace(E,", ").split(" ")):(A=A.join(" ").split(",").join(", ").split(" "),C=C.join(" ").split(",").join(", ").split(" ")),M=A.length),M!==C.length&&(M=(A=(n||"").split(" ")).length),o.plugin=h,o.setRatio=u,gt.lastIndex=0,f=0;f<M;f++)if(m=A[f],T=C[f]+"",(w=parseFloat(m))||0===w)o.appendXtra("",w,_t(T,w),T.replace(v,""),!(!D||-1===T.indexOf("px"))&&Math.round,!0);else if(r&&gt.test(m))k=")"+((k=T.indexOf(")")+1)?T.substr(k):""),R=-1!==T.indexOf("hsl")&&G,O=T,m=mt(m,R),T=mt(T,R),(P=m.length+T.length>6)&&!G&&0===T[3]?(o["xs"+o.l]+=o.l?" transparent":"transparent",o.e=o.e.split(C[f]).join("transparent")):(G||(P=!1),R?o.appendXtra(O.substr(0,O.indexOf("hsl"))+(P?"hsla(":"hsl("),m[0],_t(T[0],m[0]),",",!1,!0).appendXtra("",m[1],_t(T[1],m[1]),"%,",!1).appendXtra("",m[2],_t(T[2],m[2]),P?"%,":"%"+k,!1):o.appendXtra(O.substr(0,O.indexOf("rgb"))+(P?"rgba(":"rgb("),m[0],T[0]-m[0],",",Math.round,!0).appendXtra("",m[1],T[1]-m[1],",",Math.round).appendXtra("",m[2],T[2]-m[2],P?",":k,Math.round),P&&(m=m.length<4?1:m[3],o.appendXtra("",m,(T.length<4?1:T[3])-m,k,!1))),gt.lastIndex=0;else if(x=m.match(y)){if(!(b=T.match(v))||b.length!==x.length)return o;for(p=0,c=0;c<x.length;c++)S=x[c],O=m.indexOf(S,p),o.appendXtra(m.substr(p,O-p),Number(S),_t(b[c],S),"",!(!D||"px"!==m.substr(O+S.length,2))&&Math.round,0===c),p=O+S.length;o["xs"+o.l]+=m.substr(p)}else o["xs"+o.l]+=o.l||o["xs"+o.l]?" "+T:T;if(-1!==s.indexOf("=")&&o.data){for(k=o.xs0+o.data.s,f=1;f<o.l;f++)k+=o["xs"+f]+o.data["xn"+f];o.e=k+o["xs"+f]}return o.l||(o.type=-1,o.xs0=o.e),o.xfirst||o},Pt=9;for((h=xt.prototype).l=h.pr=0;--Pt>0;)h["xn"+Pt]=0,h["xs"+Pt]="";h.xs0="",h._next=h._prev=h.xfirst=h.data=h.plugin=h.setRatio=h.rxp=null,h.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&(o||a["xs"+o])?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new xt(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var Ot=function(t,e){e=e||{},this.p=e.prefix&&K(t)||t,l[t]=l[this.p]=this,this.format=e.formatter||yt(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.allowFunc=e.allowFunc,this.pr=e.priority||0},St=q._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r=t.split(","),n=e.defaultValue;for(i=i||[n],s=0;s<r.length;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||n,new Ot(r[s],e)},kt=q._registerPluginProp=function(t){if(!l[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";St(t,{parser:function(t,i,s,r,n,a,h){var _=o.com.greensock.plugins[e];return _?(_._cssRegister(),l[s].parse(t,i,s,r,n,a,h)):(H("Error: "+e+" js file not loaded."),n)}})}};(h=Ot.prototype).parseComplex=function(t,e,i,s,r,n){var a,o,l,h,_,u,f=this.keyword;if(this.multi&&(E.test(i)||E.test(e)?(o=e.replace(E,"|").split("|"),l=i.replace(E,"|").split("|")):f&&(o=[e],l=[i])),l){for(h=l.length>o.length?l.length:o.length,a=0;a<h;a++)e=o[a]=o[a]||this.dflt,i=l[a]=l[a]||this.dflt,f&&(_=e.indexOf(f))!==(u=i.indexOf(f))&&(-1===u?o[a]=o[a].split(f).join(""):-1===_&&(o[a]+=" "+f));e=o.join(", "),i=l.join(", ")}return wt(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},h.parse=function(t,e,i,s,n,a,o){return this.parseComplex(t.style,this.format(et(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){St(t,{parser:function(t,s,r,n,a,o,l){var h=new xt(t,r,0,0,a,2,r,!1,i);return h.plugin=o,h.setRatio=e(t,s,n._tween,r),h},priority:i})},a.useSVGTransformAttr=!0;var Rt,At,Ct,Mt,Dt,Ft="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),zt=K("transform"),Et=$+"transform",It=K("transformOrigin"),Xt=null!==K("perspective"),Nt=q.Transform=function(){this.perspective=parseFloat(a.defaultTransformPerspective)||0,this.force3D=!(!1===a.defaultForce3D||!Xt)&&(a.defaultForce3D||"auto")},Lt=_gsScope.SVGElement,Bt=function(t,e,i){var s,r=Y.createElementNS("http://www.w3.org/2000/svg",t),n=/([a-z])([A-Z])/g;for(s in i)r.setAttributeNS(null,s.replace(n,"$1-$2").toLowerCase(),i[s]);return e.appendChild(r),r},Yt=Y.documentElement||{},jt=(Dt=m||/Android/i.test(W)&&!_gsScope.chrome,Y.createElementNS&&Yt.appendChild&&!Dt&&(At=Bt("svg",Yt),Mt=(Ct=Bt("rect",At,{width:100,height:50,x:100})).getBoundingClientRect().width,Ct.style[It]="50% 50%",Ct.style[zt]="scaleX(0.5)",Dt=Mt===Ct.getBoundingClientRect().width&&!(c&&Xt),Yt.removeChild(At)),Dt),Ut=function(t,e,i,s,r,n){var o,l,h,_,u,f,c,p,m,d,g,y,v,T,x=t._gsTransform,b=Gt(t,!0);x&&(v=x.xOrigin,T=x.yOrigin),(!s||(o=s.split(" ")).length<2)&&(0===(c=t.getBBox()).x&&0===c.y&&c.width+c.height===0&&(c={x:parseFloat(t.hasAttribute("x")?t.getAttribute("x"):t.hasAttribute("cx")?t.getAttribute("cx"):0)||0,y:parseFloat(t.hasAttribute("y")?t.getAttribute("y"):t.hasAttribute("cy")?t.getAttribute("cy"):0)||0,width:0,height:0}),o=[(-1!==(e=ht(e).split(" "))[0].indexOf("%")?parseFloat(e[0])/100*c.width:parseFloat(e[0]))+c.x,(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*c.height:parseFloat(e[1]))+c.y]),i.xOrigin=_=parseFloat(o[0]),i.yOrigin=u=parseFloat(o[1]),s&&b!==Wt&&(f=b[0],c=b[1],p=b[2],m=b[3],d=b[4],g=b[5],(y=f*m-c*p)&&(l=_*(m/y)+u*(-p/y)+(p*g-m*d)/y,h=_*(-c/y)+u*(f/y)-(f*g-c*d)/y,_=i.xOrigin=o[0]=l,u=i.yOrigin=o[1]=h)),x&&(n&&(i.xOffset=x.xOffset,i.yOffset=x.yOffset,x=i),r||!1!==r&&!1!==a.defaultSmoothOrigin?(l=_-v,h=u-T,x.xOffset+=l*b[0]+h*b[2]-l,x.yOffset+=l*b[1]+h*b[3]-h):x.xOffset=x.yOffset=0),n||t.setAttribute("data-svg-origin",o.join(" "))},Vt=function(t){var e,i=j("svg",this.ownerSVGElement&&this.ownerSVGElement.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),s=this.parentNode,r=this.nextSibling,n=this.style.cssText;if(Yt.appendChild(i),i.appendChild(this),this.style.display="block",t)try{e=this.getBBox(),this._originalGetBBox=this.getBBox,this.getBBox=Vt}catch(t){}else this._originalGetBBox&&(e=this._originalGetBBox());return r?s.insertBefore(this,r):s.appendChild(this),Yt.removeChild(i),this.style.cssText=n,e},qt=function(t){return!(!Lt||!t.getCTM||t.parentNode&&!t.ownerSVGElement||!function(t){try{return t.getBBox()}catch(e){return Vt.call(t,!0)}}(t))},Wt=[1,0,0,1,0,0],Gt=function(t,e){var i,s,r,n,a,o,l,h=t._gsTransform||new Nt,_=t.style;if(zt?s=et(t,Et,null,!0):t.currentStyle&&(s=(s=t.currentStyle.filter.match(F))&&4===s.length?[s[0].substr(4),Number(s[2].substr(4)),Number(s[1].substr(4)),s[3].substr(4),h.x||0,h.y||0].join(","):""),i=!s||"none"===s||"matrix(1, 0, 0, 1, 0, 0)"===s,zt&&i&&!t.offsetParent&&t!==Yt&&(n=_.display,_.display="block",(l=t.parentNode)&&t.offsetParent||(a=1,o=t.nextSibling,Yt.appendChild(t)),i=!(s=et(t,Et,null,!0))||"none"===s||"matrix(1, 0, 0, 1, 0, 0)"===s,n?_.display=n:Kt(_,"display"),a&&(o?l.insertBefore(t,o):l?l.appendChild(t):Yt.removeChild(t))),(h.svg||t.getCTM&&qt(t))&&(i&&-1!==(_[zt]+"").indexOf("matrix")&&(s=_[zt],i=0),r=t.getAttribute("transform"),i&&r&&(s="matrix("+(r=t.transform.baseVal.consolidate().matrix).a+","+r.b+","+r.c+","+r.d+","+r.e+","+r.f+")",i=0)),i)return Wt;for(r=(s||"").match(y)||[],Pt=r.length;--Pt>-1;)n=Number(r[Pt]),r[Pt]=(a=n-(n|=0))?(1e5*a+(a<0?-.5:.5)|0)/1e5+n:n;return e&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r},Zt=q.getTransform=function(t,i,s,r){if(t._gsTransform&&s&&!r)return t._gsTransform;var n,o,l,h,_,u,f=s&&t._gsTransform||new Nt,c=f.scaleX<0,p=Xt&&(parseFloat(et(t,It,i,!1,"0 0 0").split(" ")[2])||f.zOrigin)||0,m=parseFloat(a.defaultTransformPerspective)||0;if(f.svg=!(!t.getCTM||!qt(t)),f.svg&&(Ut(t,et(t,It,i,!1,"50% 50%")+"",f,t.getAttribute("data-svg-origin")),Rt=a.useSVGTransformAttr||jt),(n=Gt(t))!==Wt){if(16===n.length){var d,g,y,v,T,x=n[0],b=n[1],w=n[2],P=n[3],O=n[4],S=n[5],k=n[6],R=n[7],A=n[8],C=n[9],M=n[10],D=n[12],F=n[13],z=n[14],E=n[11],I=Math.atan2(k,M);f.zOrigin&&(D=A*(z=-f.zOrigin)-n[12],F=C*z-n[13],z=M*z+f.zOrigin-n[14]),f.rotationX=I*N,I&&(d=O*(v=Math.cos(-I))+A*(T=Math.sin(-I)),g=S*v+C*T,y=k*v+M*T,A=O*-T+A*v,C=S*-T+C*v,M=k*-T+M*v,E=R*-T+E*v,O=d,S=g,k=y),I=Math.atan2(-w,M),f.rotationY=I*N,I&&(g=b*(v=Math.cos(-I))-C*(T=Math.sin(-I)),y=w*v-M*T,C=b*T+C*v,M=w*T+M*v,E=P*T+E*v,x=d=x*v-A*T,b=g,w=y),I=Math.atan2(b,x),f.rotation=I*N,I&&(d=x*(v=Math.cos(I))+b*(T=Math.sin(I)),g=O*v+S*T,y=A*v+C*T,b=b*v-x*T,S=S*v-O*T,C=C*v-A*T,x=d,O=g,A=y),f.rotationX&&Math.abs(f.rotationX)+Math.abs(f.rotation)>359.9&&(f.rotationX=f.rotation=0,f.rotationY=180-f.rotationY),I=Math.atan2(O,S),f.scaleX=(1e5*Math.sqrt(x*x+b*b+w*w)+.5|0)/1e5,f.scaleY=(1e5*Math.sqrt(S*S+k*k)+.5|0)/1e5,f.scaleZ=(1e5*Math.sqrt(A*A+C*C+M*M)+.5|0)/1e5,x/=f.scaleX,O/=f.scaleY,b/=f.scaleX,S/=f.scaleY,Math.abs(I)>2e-5?(f.skewX=I*N,O=0,"simple"!==f.skewType&&(f.scaleY*=1/Math.cos(I))):f.skewX=0,f.perspective=E?1/(E<0?-E:E):0,f.x=D,f.y=F,f.z=z,f.svg&&(f.x-=f.xOrigin-(f.xOrigin*x-f.yOrigin*O),f.y-=f.yOrigin-(f.yOrigin*b-f.xOrigin*S))}else if(!Xt||r||!n.length||f.x!==n[4]||f.y!==n[5]||!f.rotationX&&!f.rotationY){var X=n.length>=6,L=X?n[0]:1,B=n[1]||0,Y=n[2]||0,j=X?n[3]:1;f.x=n[4]||0,f.y=n[5]||0,l=Math.sqrt(L*L+B*B),h=Math.sqrt(j*j+Y*Y),_=L||B?Math.atan2(B,L)*N:f.rotation||0,u=Y||j?Math.atan2(Y,j)*N+_:f.skewX||0,f.scaleX=l,f.scaleY=h,f.rotation=_,f.skewX=u,Xt&&(f.rotationX=f.rotationY=f.z=0,f.perspective=m,f.scaleZ=1),f.svg&&(f.x-=f.xOrigin-(f.xOrigin*L+f.yOrigin*Y),f.y-=f.yOrigin-(f.xOrigin*B+f.yOrigin*j))}for(o in Math.abs(f.skewX)>90&&Math.abs(f.skewX)<270&&(c?(f.scaleX*=-1,f.skewX+=f.rotation<=0?180:-180,f.rotation+=f.rotation<=0?180:-180):(f.scaleY*=-1,f.skewX+=f.skewX<=0?180:-180)),f.zOrigin=p,f)f[o]<2e-5&&f[o]>-2e-5&&(f[o]=0)}return s&&(t._gsTransform=f,f.svg&&(Rt&&t.style[zt]?e.delayedCall(.001,function(){Kt(t.style,zt)}):!Rt&&t.getAttribute("transform")&&e.delayedCall(.001,function(){t.removeAttribute("transform")}))),f},Ht=function(t){var e,i,s=this.data,r=-s.rotation*X,n=r+s.skewX*X,a=(Math.cos(r)*s.scaleX*1e5|0)/1e5,o=(Math.sin(r)*s.scaleX*1e5|0)/1e5,l=(Math.sin(n)*-s.scaleY*1e5|0)/1e5,h=(Math.cos(n)*s.scaleY*1e5|0)/1e5,_=this.t.style,u=this.t.currentStyle;if(u){i=o,o=-l,l=-i,e=u.filter,_.filter="";var f,c,p=this.t.offsetWidth,d=this.t.offsetHeight,g="absolute"!==u.position,y="progid:DXImageTransform.Microsoft.Matrix(M11="+a+", M12="+o+", M21="+l+", M22="+h,v=s.x+p*s.xPercent/100,T=s.y+d*s.yPercent/100;if(null!=s.ox&&(v+=(f=(s.oxp?p*s.ox*.01:s.ox)-p/2)-(f*a+(c=(s.oyp?d*s.oy*.01:s.oy)-d/2)*o),T+=c-(f*l+c*h)),y+=g?", Dx="+((f=p/2)-(f*a+(c=d/2)*o)+v)+", Dy="+(c-(f*l+c*h)+T)+")":", sizingMethod='auto expand')",-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?_.filter=e.replace(z,y):_.filter=y+" "+e,0!==t&&1!==t||1===a&&0===o&&0===l&&1===h&&(g&&-1===y.indexOf("Dx=0, Dy=0")||P.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf(e.indexOf("Alpha"))&&_.removeAttribute("filter")),!g){var x,b,O,S=m<8?1:-1;for(f=s.ieOffsetX||0,c=s.ieOffsetY||0,s.ieOffsetX=Math.round((p-((a<0?-a:a)*p+(o<0?-o:o)*d))/2+v),s.ieOffsetY=Math.round((d-((h<0?-h:h)*d+(l<0?-l:l)*p))/2+T),Pt=0;Pt<4;Pt++)O=(i=-1!==(x=u[b=ot[Pt]]).indexOf("px")?parseFloat(x):it(this.t,b,parseFloat(x),x.replace(w,""))||0)!==s[b]?Pt<2?-s.ieOffsetX:-s.ieOffsetY:Pt<2?f-s.ieOffsetX:c-s.ieOffsetY,_[b]=(s[b]=Math.round(i-O*(0===Pt||2===Pt?1:S)))+"px"}}},$t=q.set3DTransformRatio=q.setTransformRatio=function(t){var e,i,s,r,n,a,o,l,h,_,u,f,p,m,d,g,y,v,T,x,b=this.data,w=this.t.style,P=b.rotation,O=b.rotationX,S=b.rotationY,k=b.scaleX,R=b.scaleY,A=b.scaleZ,C=b.x,M=b.y,D=b.z,F=b.svg,z=b.perspective,E=b.force3D,I=b.skewY,N=b.skewX;if(I&&(N+=I,P+=I),!((1!==t&&0!==t||"auto"!==E||this.tween._totalTime!==this.tween._totalDuration&&this.tween._totalTime)&&E||D||z||S||O||1!==A)||Rt&&F||!Xt)P||N||F?(P*=X,x=N*X,1e5,i=Math.cos(P)*k,n=Math.sin(P)*k,s=Math.sin(P-x)*-R,a=Math.cos(P-x)*R,x&&"simple"===b.skewType&&(e=Math.tan(x-I*X),s*=e=Math.sqrt(1+e*e),a*=e,I&&(e=Math.tan(I*X),i*=e=Math.sqrt(1+e*e),n*=e)),F&&(C+=b.xOrigin-(b.xOrigin*i+b.yOrigin*s)+b.xOffset,M+=b.yOrigin-(b.xOrigin*n+b.yOrigin*a)+b.yOffset,Rt&&(b.xPercent||b.yPercent)&&(d=this.t.getBBox(),C+=.01*b.xPercent*d.width,M+=.01*b.yPercent*d.height),C<(d=1e-6)&&C>-d&&(C=0),M<d&&M>-d&&(M=0)),T=(1e5*i|0)/1e5+","+(1e5*n|0)/1e5+","+(1e5*s|0)/1e5+","+(1e5*a|0)/1e5+","+C+","+M+")",F&&Rt?this.t.setAttribute("transform","matrix("+T):w[zt]=(b.xPercent||b.yPercent?"translate("+b.xPercent+"%,"+b.yPercent+"%) matrix(":"matrix(")+T):w[zt]=(b.xPercent||b.yPercent?"translate("+b.xPercent+"%,"+b.yPercent+"%) matrix(":"matrix(")+k+",0,0,"+R+","+C+","+M+")";else{if(c&&(k<(d=1e-4)&&k>-d&&(k=A=2e-5),R<d&&R>-d&&(R=A=2e-5),!z||b.z||b.rotationX||b.rotationY||(z=0)),P||N)P*=X,g=i=Math.cos(P),y=n=Math.sin(P),N&&(P-=N*X,g=Math.cos(P),y=Math.sin(P),"simple"===b.skewType&&(e=Math.tan((N-I)*X),g*=e=Math.sqrt(1+e*e),y*=e,b.skewY&&(e=Math.tan(I*X),i*=e=Math.sqrt(1+e*e),n*=e))),s=-y,a=g;else{if(!(S||O||1!==A||z||F))return void(w[zt]=(b.xPercent||b.yPercent?"translate("+b.xPercent+"%,"+b.yPercent+"%) translate3d(":"translate3d(")+C+"px,"+M+"px,"+D+"px)"+(1!==k||1!==R?" scale("+k+","+R+")":""));i=a=1,s=n=0}_=1,r=o=l=h=u=f=0,p=z?-1/z:0,m=b.zOrigin,d=1e-6,",","0",(P=S*X)&&(g=Math.cos(P),l=-(y=Math.sin(P)),u=p*-y,r=i*y,o=n*y,_=g,p*=g,i*=g,n*=g),(P=O*X)&&(e=s*(g=Math.cos(P))+r*(y=Math.sin(P)),v=a*g+o*y,h=_*y,f=p*y,r=s*-y+r*g,o=a*-y+o*g,_*=g,p*=g,s=e,a=v),1!==A&&(r*=A,o*=A,_*=A,p*=A),1!==R&&(s*=R,a*=R,h*=R,f*=R),1!==k&&(i*=k,n*=k,l*=k,u*=k),(m||F)&&(m&&(C+=r*-m,M+=o*-m,D+=_*-m+m),F&&(C+=b.xOrigin-(b.xOrigin*i+b.yOrigin*s)+b.xOffset,M+=b.yOrigin-(b.xOrigin*n+b.yOrigin*a)+b.yOffset),C<d&&C>-d&&(C="0"),M<d&&M>-d&&(M="0"),D<d&&D>-d&&(D=0)),T=b.xPercent||b.yPercent?"translate("+b.xPercent+"%,"+b.yPercent+"%) matrix3d(":"matrix3d(",T+=(i<d&&i>-d?"0":i)+","+(n<d&&n>-d?"0":n)+","+(l<d&&l>-d?"0":l),T+=","+(u<d&&u>-d?"0":u)+","+(s<d&&s>-d?"0":s)+","+(a<d&&a>-d?"0":a),O||S||1!==A?(T+=","+(h<d&&h>-d?"0":h)+","+(f<d&&f>-d?"0":f)+","+(r<d&&r>-d?"0":r),T+=","+(o<d&&o>-d?"0":o)+","+(_<d&&_>-d?"0":_)+","+(p<d&&p>-d?"0":p)+","):T+=",0,0,0,0,1,0,",T+=C+","+M+","+D+","+(z?1+-D/z:1)+")",w[zt]=T}};(h=Nt.prototype).x=h.y=h.z=h.skewX=h.skewY=h.rotation=h.rotationX=h.rotationY=h.zOrigin=h.xPercent=h.yPercent=h.xOffset=h.yOffset=0,h.scaleX=h.scaleY=h.scaleZ=1,St("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin",{parser:function(t,e,i,s,n,o,l){if(s._lastParsedTransform===l)return n;s._lastParsedTransform=l;var h=l.scale&&"function"==typeof l.scale?l.scale:0;h&&(l.scale=h(g,t));var _,u,f,c,p,m,y,v,T,x=t._gsTransform,b=t.style,w=Ft.length,P=l,O={},S=Zt(t,r,!0,P.parseTransform),k=P.transform&&("function"==typeof P.transform?P.transform(g,d):P.transform);if(S.skewType=P.skewType||S.skewType||a.defaultSkewType,s._transform=S,"rotationZ"in P&&(P.rotation=P.rotationZ),k&&"string"==typeof k&&zt)(u=U.style)[zt]=k,u.display="block",u.position="absolute",-1!==k.indexOf("%")&&(u.width=et(t,"width"),u.height=et(t,"height")),Y.body.appendChild(U),_=Zt(U,null,!1),"simple"===S.skewType&&(_.scaleY*=Math.cos(_.skewX*X)),S.svg&&(m=S.xOrigin,y=S.yOrigin,_.x-=S.xOffset,_.y-=S.yOffset,(P.transformOrigin||P.svgOrigin)&&(k={},Ut(t,ht(P.transformOrigin),k,P.svgOrigin,P.smoothOrigin,!0),m=k.xOrigin,y=k.yOrigin,_.x-=k.xOffset-S.xOffset,_.y-=k.yOffset-S.yOffset),(m||y)&&(v=Gt(U,!0),_.x-=m-(m*v[0]+y*v[2]),_.y-=y-(m*v[1]+y*v[3]))),Y.body.removeChild(U),_.perspective||(_.perspective=S.perspective),null!=P.xPercent&&(_.xPercent=ut(P.xPercent,S.xPercent)),null!=P.yPercent&&(_.yPercent=ut(P.yPercent,S.yPercent));else if("object"==typeof P){if(_={scaleX:ut(null!=P.scaleX?P.scaleX:P.scale,S.scaleX),scaleY:ut(null!=P.scaleY?P.scaleY:P.scale,S.scaleY),scaleZ:ut(P.scaleZ,S.scaleZ),x:ut(P.x,S.x),y:ut(P.y,S.y),z:ut(P.z,S.z),xPercent:ut(P.xPercent,S.xPercent),yPercent:ut(P.yPercent,S.yPercent),perspective:ut(P.transformPerspective,S.perspective)},null!=(p=P.directionalRotation))if("object"==typeof p)for(u in p)P[u]=p[u];else P.rotation=p;"string"==typeof P.x&&-1!==P.x.indexOf("%")&&(_.x=0,_.xPercent=ut(P.x,S.xPercent)),"string"==typeof P.y&&-1!==P.y.indexOf("%")&&(_.y=0,_.yPercent=ut(P.y,S.yPercent)),_.rotation=ft("rotation"in P?P.rotation:"shortRotation"in P?P.shortRotation+"_short":S.rotation,S.rotation,"rotation",O),Xt&&(_.rotationX=ft("rotationX"in P?P.rotationX:"shortRotationX"in P?P.shortRotationX+"_short":S.rotationX||0,S.rotationX,"rotationX",O),_.rotationY=ft("rotationY"in P?P.rotationY:"shortRotationY"in P?P.shortRotationY+"_short":S.rotationY||0,S.rotationY,"rotationY",O)),_.skewX=ft(P.skewX,S.skewX),_.skewY=ft(P.skewY,S.skewY)}for(Xt&&null!=P.force3D&&(S.force3D=P.force3D,c=!0),(f=S.force3D||S.z||S.rotationX||S.rotationY||_.z||_.rotationX||_.rotationY||_.perspective)||null==P.scale||(_.scaleZ=1);--w>-1;)((k=_[T=Ft[w]]-S[T])>1e-6||k<-1e-6||null!=P[T]||null!=L[T])&&(c=!0,n=new xt(S,T,S[T],k,n),T in O&&(n.e=O[T]),n.xs0=0,n.plugin=o,s._overwriteProps.push(n.n));return k="function"==typeof P.transformOrigin?P.transformOrigin(g,d):P.transformOrigin,S.svg&&(k||P.svgOrigin)&&(m=S.xOffset,y=S.yOffset,Ut(t,ht(k),_,P.svgOrigin,P.smoothOrigin),n=bt(S,"xOrigin",(x?S:_).xOrigin,_.xOrigin,n,"transformOrigin"),n=bt(S,"yOrigin",(x?S:_).yOrigin,_.yOrigin,n,"transformOrigin"),m===S.xOffset&&y===S.yOffset||(n=bt(S,"xOffset",x?m:S.xOffset,S.xOffset,n,"transformOrigin"),n=bt(S,"yOffset",x?y:S.yOffset,S.yOffset,n,"transformOrigin")),k="0px 0px"),(k||Xt&&f&&S.zOrigin)&&(zt?(c=!0,T=It,k||(k=(k=(et(t,T,r,!1,"50% 50%")+"").split(" "))[0]+" "+k[1]+" "+S.zOrigin+"px"),k+="",(n=new xt(b,T,0,0,n,-1,"transformOrigin")).b=b[T],n.plugin=o,Xt?(u=S.zOrigin,k=k.split(" "),S.zOrigin=(k.length>2?parseFloat(k[2]):u)||0,n.xs0=n.e=k[0]+" "+(k[1]||"50%")+" 0px",(n=new xt(S,"zOrigin",0,0,n,-1,n.n)).b=u,n.xs0=n.e=S.zOrigin):n.xs0=n.e=k):ht(k+"",S)),c&&(s._transformType=S.svg&&Rt||!f&&3!==this._transformType?2:3),h&&(l.scale=h),n},allowFunc:!0,prefix:!0}),St("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),St("clipPath",{defaultValue:"inset(0%)",prefix:!0,multi:!0,formatter:yt("inset(0% 0% 0% 0%)",!1,!0)}),St("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a,o){e=this.format(e);var l,h,_,u,f,c,p,m,d,g,y,v,T,x,b,w,P=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],O=t.style;for(d=parseFloat(t.offsetWidth),g=parseFloat(t.offsetHeight),l=e.split(" "),h=0;h<P.length;h++)this.p.indexOf("border")&&(P[h]=K(P[h])),-1!==(f=u=et(t,P[h],r,!1,"0px")).indexOf(" ")&&(u=f.split(" "),f=u[0],u=u[1]),c=_=l[h],p=parseFloat(f),v=f.substr((p+"").length),(T="="===c.charAt(1))?(m=parseInt(c.charAt(0)+"1",10),c=c.substr(2),m*=parseFloat(c),y=c.substr((m+"").length-(m<0?1:0))||""):(m=parseFloat(c),y=c.substr((m+"").length)),""===y&&(y=s[i]||v),y!==v&&(x=it(t,"borderLeft",p,v),b=it(t,"borderTop",p,v),"%"===y?(f=x/d*100+"%",u=b/g*100+"%"):"em"===y?(f=x/(w=it(t,"borderLeft",1,"em"))+"em",u=b/w+"em"):(f=x+"px",u=b+"px"),T&&(c=parseFloat(f)+m+y,_=parseFloat(u)+m+y)),a=wt(O,P[h],f+" "+u,c+" "+_,!1,"0px",a);return a},prefix:!0,formatter:yt("0px 0px 0px 0px",!1,!0)}),St("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius",{defaultValue:"0px",parser:function(t,e,i,s,n,a){return wt(t.style,i,this.format(et(t,i,r,!1,"0px 0px")),this.format(e),!1,"0px",n)},prefix:!0,formatter:yt("0px 0px",!1,!0)}),St("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,l,h,_,u,f,c="background-position",p=r||tt(t),d=this.format((p?m?p.getPropertyValue(c+"-x")+" "+p.getPropertyValue(c+"-y"):p.getPropertyValue(c):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==d.indexOf("%")!=(-1!==g.indexOf("%"))&&g.split(",").length<2&&(f=et(t,"backgroundImage").replace(C,""))&&"none"!==f){for(o=d.split(" "),l=g.split(" "),V.setAttribute("src",f),h=2;--h>-1;)(_=-1!==(d=o[h]).indexOf("%"))!==(-1!==l[h].indexOf("%"))&&(u=0===h?t.offsetWidth-V.width:t.offsetHeight-V.height,o[h]=_?parseFloat(d)/100*u+"px":parseFloat(d)/u*100+"%");d=o.join(" ")}return this.parseComplex(t.style,d,g,n,a)},formatter:ht}),St("backgroundSize",{defaultValue:"0 0",formatter:function(t){return"co"===(t+="").substr(0,2)?t:ht(-1===t.indexOf(" ")?t+" "+t:t)}}),St("perspective",{defaultValue:"0px",prefix:!0}),St("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),St("transformStyle",{prefix:!0}),St("backfaceVisibility",{prefix:!0}),St("userSelect",{prefix:!0}),St("margin",{parser:vt("marginTop,marginRight,marginBottom,marginLeft")}),St("padding",{parser:vt("paddingTop,paddingRight,paddingBottom,paddingLeft")}),St("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,l,h;return m<9?(l=t.currentStyle,h=m<8?" ":",",o="rect("+l.clipTop+h+l.clipRight+h+l.clipBottom+h+l.clipLeft+")",e=this.format(e).split(",").join(h)):(o=this.format(et(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),St("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),St("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),St("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){var o=et(t,"borderTopWidth",r,!1,"0px"),l=this.format(e).split(" "),h=l[0].replace(w,"");return"px"!==h&&(o=parseFloat(o)/it(t,"borderTopWidth",1,h)+h),this.parseComplex(t.style,this.format(o+" "+et(t,"borderTopStyle",r,!1,"solid")+" "+et(t,"borderTopColor",r,!1,"#000")),l.join(" "),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(gt)||["#000"])[0]}}),St("borderWidth",{parser:vt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),St("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r,n){var a=t.style,o="cssFloat"in a?"cssFloat":"styleFloat";return new xt(a,o,0,0,r,-1,i,!1,0,a[o],e)}});var Qt=function(t){var e,i=this.t,s=i.filter||et(this.data,"filter")||"",r=this.s+this.c*t|0;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!et(this.data,"filter")):(i.filter=s.replace(S,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("pacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(P,"opacity="+r))};St("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(et(t,"opacity",r,!1,"1")),l=t.style,h="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),h&&1===o&&"hidden"===et(t,"visibility",r)&&0!==e&&(o=0),G?n=new xt(l,"opacity",o,e-o,n):((n=new xt(l,"opacity",100*o,100*(e-o),n)).xn1=h?1:0,l.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=Qt),h&&((n=new xt(l,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit")).xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Kt=function(t,e){e&&(t.removeProperty?("ms"!==e.substr(0,2)&&"webkit"!==e.substr(0,6)||(e="-"+e),t.removeProperty(e.replace(R,"-$1").toLowerCase())):t.removeAttribute(e))},Jt=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Kt(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};St("className",{parser:function(t,e,s,n,a,o,l){var h,_,u,f,c,p=t.getAttribute("class")||"",m=t.style.cssText;if((a=n._classNamePT=new xt(t,s,0,0,a,2)).setRatio=Jt,a.pr=-11,i=!0,a.b=p,_=rt(t,r),u=t._gsClassPT){for(f={},c=u.data;c;)f[c.p]=1,c=c._next;u.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:p.replace(new RegExp("(?:\\s|^)"+e.substr(2)+"(?![\\w-])"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),t.setAttribute("class",a.e),h=nt(t,_,rt(t),l,f),t.setAttribute("class",p),a.data=h.firstMPT,t.style.cssText!==m&&(t.style.cssText=m),a=a.xfirst=n.parse(t,h.difs,a,o)}});var te=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n,a=this.t.style,o=l.transform.parse;if("all"===this.e)a.cssText="",r=!0;else for(s=(e=this.e.split(" ").join("").split(",")).length;--s>-1;)i=e[s],l[i]&&(l[i].parse===o?r=!0:i="transformOrigin"===i?It:l[i].p),Kt(a,i);r&&(Kt(a,zt),(n=this.t._gsTransform)&&(n.svg&&(this.t.removeAttribute("data-svg-origin"),this.t.removeAttribute("transform")),delete this.t._gsTransform))}};for(St("clearProps",{parser:function(t,e,s,r,n){return(n=new xt(t,s,0,0,n,2)).setRatio=te,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),h="bezier,throwProps,physicsProps,physics2D".split(","),Pt=h.length;Pt--;)kt(h[Pt]);(h=a.prototype)._firstPT=h._lastParsedTransform=h._transform=null,h._onInitTween=function(t,e,o,h){if(!t.nodeType)return!1;this._target=d=t,this._tween=o,this._vars=e,g=h,_=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=tt(t),n=this._overwriteProps;var c,m,y,v,T,x,b,w,P,S=t.style;if(u&&""===S.zIndex&&("auto"!==(c=et(t,"zIndex",r))&&""!==c||this._addLazySet(S,"zIndex",0)),"string"==typeof e&&(v=S.cssText,c=rt(t,r),S.cssText=v+";"+e,c=nt(t,c,rt(t)).difs,!G&&O.test(e)&&(c.opacity=parseFloat(RegExp.$1)),e=c,S.cssText=v),e.className?this._firstPT=m=l.className.parse(t,e.className,"className",this,null,null,e):this._firstPT=m=this.parse(t,e,null),this._transformType){for(P=3===this._transformType,zt?f&&(u=!0,""===S.zIndex&&("auto"!==(b=et(t,"zIndex",r))&&""!==b||this._addLazySet(S,"zIndex",0)),p&&this._addLazySet(S,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(P?"visible":"hidden"))):S.zoom=1,y=m;y&&y._next;)y=y._next;w=new xt(t,"transform",0,0,null,2),this._linkCSSP(w,null,y),w.setRatio=zt?$t:Ht,w.data=this._transform||Zt(t,r,!0),w.tween=o,w.pr=-1,n.pop()}if(i){for(;m;){for(x=m._next,y=v;y&&y.pr>m.pr;)y=y._next;(m._prev=y?y._prev:T)?m._prev._next=m:v=m,(m._next=y)?y._prev=m:T=m,m=x}this._firstPT=v}return!0},h.parse=function(t,e,i,n){var a,o,h,u,f,c,p,m,y,v,T=t.style;for(a in e){if(c=e[a],o=l[a],"function"!=typeof c||o&&o.allowFunc||(c=c(g,d)),o)i=o.parse(t,c,a,this,i,n,e);else{if("--"===a.substr(0,2)){this._tween._propLookup[a]=this._addTween.call(this._tween,t.style,"setProperty",tt(t).getPropertyValue(a)+"",c+"",a,!1,a);continue}f=et(t,a,r)+"",y="string"==typeof c,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||y&&k.test(c)?(y||(c=((c=mt(c)).length>3?"rgba(":"rgb(")+c.join(",")+")"),i=wt(T,a,f,c,!0,"transparent",i,0,n)):y&&I.test(c)?i=wt(T,a,f,c,!0,null,i,0,n):(p=(h=parseFloat(f))||0===h?f.substr((h+"").length):"",""!==f&&"auto"!==f||("width"===a||"height"===a?(h=lt(t,a,r),p="px"):"left"===a||"top"===a?(h=st(t,a,r),p="px"):(h="opacity"!==a?0:1,p="")),(v=y&&"="===c.charAt(1))?(u=parseInt(c.charAt(0)+"1",10),c=c.substr(2),u*=parseFloat(c),m=c.replace(w,"")):(u=parseFloat(c),m=y?c.replace(w,""):""),""===m&&(m=a in s?s[a]:p),c=u||0===u?(v?u+h:u)+m:e[a],p!==m&&(""===m&&"lineHeight"!==a||(u||0===u)&&h&&(h=it(t,a,h,p),"%"===m?(h/=it(t,a,100,"%")/100,!0!==e.strictUnits&&(f=h+"%")):"em"===m||"rem"===m||"vw"===m||"vh"===m?h/=it(t,a,1,m):"px"!==m&&(u=it(t,a,u,m),m="px"),v&&(u||0===u)&&(c=u+h+m))),v&&(u+=h),!h&&0!==h||!u&&0!==u?void 0!==T[a]&&(c||c+""!="NaN"&&null!=c)?(i=new xt(T,a,u||h||0,0,i,-1,a,!1,0,f,c)).xs0="none"!==c||"display"!==a&&-1===a.indexOf("Style")?c:f:H("invalid "+a+" tween value: "+e[a]):(i=new xt(T,a,h,u-h,i,0,a,!1!==_&&("px"===m||"zIndex"===a),0,f,c)).xs0=m)}n&&i&&!i.plugin&&(i.plugin=n)}return i},h.setRatio=function(t){var e,i,s,r=this._firstPT;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||-1e-6===this._tween._rawPrevTime)for(;r;){if(e=r.c*t+r.s,r.r?e=r.r(e):e<1e-6&&e>-1e-6&&(e=0),r.type)if(1===r.type)if(2===(s=r.l))r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;s<r.l;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;){if(2!==r.type)if(r.r&&-1!==r.type)if(e=r.r(r.s+r.c),r.type){if(1===r.type){for(s=r.l,i=r.xs0+e+r.xs1,s=1;s<r.l;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}}else r.t[r.p]=e+r.xs0;else r.t[r.p]=r.e;else r.setRatio(t);r=r._next}},h._enableTransforms=function(t){this._transform=this._transform||Zt(this._target,r,!0),this._transformType=this._transform.svg&&Rt||!t&&3!==this._transformType?2:3};var ee=function(t){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)};h._addLazySet=function(t,e,i){var s=this._firstPT=new xt(t,e,0,0,this._firstPT,2);s.e=i,s.setRatio=ee,s.data=this},h._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},h._mod=function(t){for(var e=this._firstPT;e;)"function"==typeof t[e.p]&&(e.r=t[e.p]),e=e._next},h._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){for(s in n={},e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}for(e.className&&(i=this._classNamePT)&&((r=i.xfirst)&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),i=this._firstPT;i;)i.plugin&&i.plugin!==s&&i.plugin._kill&&(i.plugin._kill(e),s=i.plugin),i=i._next;return t.prototype._kill.call(this,n)};var ie=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)ie(t[r],e,i);else for(r=(s=t.childNodes).length;--r>-1;)a=(n=s[r]).type,n.style&&(e.push(rt(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||ie(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o,l=e.to(t,i,s),h=[l],_=[],u=[],f=[],c=e._internals.reservedProps;for(t=l._targets||l.target,ie(t,_,f),l.render(i,!0,!0),ie(t,u),l.render(0,!0,!0),l._enabled(!0),r=f.length;--r>-1;)if((n=nt(f[r],_[r],u[r])).firstMPT){for(a in n=n.difs,s)c[a]&&(n[a]=s[a]);for(a in o={},n)o[a]=_[r][a];h.push(e.fromTo(f[r],i,o,n))}return h},t.activate([a]),a},!0),function(){var t=_gsScope._gsDefine.plugin({propName:"roundProps",version:"1.7.0",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=function(t){var e=t<1?Math.pow(10,(t+"").length-2):1;return function(i){return(Math.round(i/t)*t*e|0)/e}},i=function(t,e){for(;t;)t.f||t.blob||(t.m=e||Math.round),t=t._next},s=t.prototype;s._onInitAllProps=function(){var t,s,r,n,a=this._tween,o=a.vars.roundProps,l={},h=a._propLookup.roundProps;if("object"!=typeof o||o.push)for("string"==typeof o&&(o=o.split(",")),r=o.length;--r>-1;)l[o[r]]=Math.round;else for(n in o)l[n]=e(o[n]);for(n in l)for(t=a._firstPT;t;)s=t._next,t.pg?t.t._mod(l):t.n===n&&(2===t.f&&t.t?i(t.t._firstPT,l[n]):(this._add(t.t,n,t.s,t.c,l[n]),s&&(s._prev=t._prev),t._prev?t._prev._next=s:a._firstPT===t&&(a._firstPT=s),t._next=t._prev=null,a._propLookup[n]=h)),t=s;return!1},s._add=function(t,e,i,s,r){this._addTween(t,e,i,i+s,e,r||Math.round),this._overwriteProps.push(e)}}(),_gsScope._gsDefine.plugin({propName:"attr",API:2,version:"0.6.1",init:function(t,e,i,s){var r,n;if("function"!=typeof t.setAttribute)return!1;for(r in e)"function"==typeof(n=e[r])&&(n=n(s,t)),this._addTween(t,"setAttribute",t.getAttribute(r)+"",n+"",r,!1,r),this._overwriteProps.push(r);return!0}}),_gsScope._gsDefine.plugin({propName:"directionalRotation",version:"0.3.1",API:2,init:function(t,e,i,s){"object"!=typeof e&&(e={rotation:e}),this.finals={};var r,n,a,o,l,h,_=!0===e.useRadians?2*Math.PI:360;for(r in e)"useRadians"!==r&&("function"==typeof(o=e[r])&&(o=o(s,t)),n=(h=(o+"").split("_"))[0],a=parseFloat("function"!=typeof t[r]?t[r]:t[r.indexOf("set")||"function"!=typeof t["get"+r.substr(3)]?r:"get"+r.substr(3)]()),l=(o=this.finals[r]="string"==typeof n&&"="===n.charAt(1)?a+parseInt(n.charAt(0)+"1",10)*Number(n.substr(2)):Number(n)||0)-a,h.length&&(-1!==(n=h.join("_")).indexOf("short")&&(l%=_)!==l%(_/2)&&(l=l<0?l+_:l-_),-1!==n.indexOf("_cw")&&l<0?l=(l+9999999999*_)%_-(l/_|0)*_:-1!==n.indexOf("ccw")&&l>0&&(l=(l-9999999999*_)%_-(l/_|0)*_)),(l>1e-6||l<-1e-6)&&(this._addTween(t,r,a,a+l,r),this._overwriteProps.push(r)));return!0},set:function(t){var e;if(1!==t)this._super.setRatio.call(this,t);else for(e=this._firstPT;e;)e.f?e.t[e.p](this.finals[e.p]):e.t[e.p]=this.finals[e.p],e=e._next}})._autoCSS=!0,_gsScope._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r,n=_gsScope.GreenSockGlobals||_gsScope,a=n.com.greensock,o=2*Math.PI,l=Math.PI/2,h=a._class,_=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},u=t.register||function(){},f=function(t,e,i,s,r){var n=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return u(n,t),n},c=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},p=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},m=f("Back",p("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),p("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),p("BackInOut",function(t){return(t*=2)<1?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),d=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=!0===i},!0),g=d.prototype=new t;return g.constructor=d,g.getRatio=function(t){var e=t+(.5-t)*this._p;return t<this._p1?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1===t?0:1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},d.ease=new d(.7,.7),g.config=d.config=function(t,e,i){return new d(t,e,i)},(g=(e=h("easing.SteppedEase",function(t,e){t=t||1,this._p1=1/t,this._p2=t+(e?0:1),this._p3=e?1:0},!0)).prototype=new t).constructor=e,g.getRatio=function(t){return t<0?t=0:t>=1&&(t=.999999999),((this._p2*t|0)+this._p3)*this._p1},g.config=e.config=function(t,i){return new e(t,i)},(g=(i=h("easing.ExpoScaleEase",function(t,e,i){this._p1=Math.log(e/t),this._p2=e-t,this._p3=t,this._ease=i},!0)).prototype=new t).constructor=i,g.getRatio=function(t){return this._ease&&(t=this._ease.getRatio(t)),(this._p3*Math.exp(this._p1*t)-this._p3)/this._p2},g.config=i.config=function(t,e,s){return new i(t,e,s)},(g=(s=h("easing.RoughEase",function(e){for(var i,s,r,n,a,o,l=(e=e||{}).taper||"none",h=[],_=0,u=0|(e.points||20),f=u,p=!1!==e.randomize,m=!0===e.clamp,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--f>-1;)i=p?Math.random():1/u*f,s=d?d.getRatio(i):i,r="none"===l?g:"out"===l?(n=1-i)*n*g:"in"===l?i*i*g:i<.5?(n=2*i)*n*.5*g:(n=2*(1-i))*n*.5*g,p?s+=Math.random()*r-.5*r:f%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:s<0&&(s=0)),h[_++]={x:i,y:s};for(h.sort(function(t,e){return t.x-e.x}),o=new c(1,1,null),f=u;--f>-1;)a=h[f],o=new c(a.x,a.y,o);this._prev=new c(0,0,0!==o.t?o:o.next)},!0)).prototype=new t).constructor=s,g.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&t<=e.t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},g.config=function(t){return new s(t)},s.ease=new s,f("Bounce",_("BounceOut",function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),_("BounceIn",function(t){return(t=1-t)<1/2.75?1-7.5625*t*t:t<2/2.75?1-(7.5625*(t-=1.5/2.75)*t+.75):t<2.5/2.75?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),_("BounceInOut",function(t){var e=t<.5;return(t=e?1-2*t:2*t-1)<1/2.75?t*=7.5625*t:t=t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),f("Circ",_("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),_("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),_("CircInOut",function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),f("Elastic",(r=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t>=1?t:1,this._p2=(e||s)/(t<1?t:1),this._p3=this._p2/o*(Math.asin(1/this._p1)||0),this._p2=o/this._p2},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r})("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*this._p2)+1},.3),r("ElasticIn",function(t){return-this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*this._p2)},.3),r("ElasticInOut",function(t){return(t*=2)<1?this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*this._p2)*-.5:this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*this._p2)*.5+1},.45)),f("Expo",_("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),_("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),_("ExpoInOut",function(t){return(t*=2)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),f("Sine",_("SineOut",function(t){return Math.sin(t*l)}),_("SineIn",function(t){return 1-Math.cos(t*l)}),_("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),u(n.SlowMo,"SlowMo","ease,"),u(s,"RoughEase","ease,"),u(e,"SteppedEase","ease,"),m},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t,e){"use strict";var i={},s=t.document,r=t.GreenSockGlobals=t.GreenSockGlobals||t,n=r.TweenMax;if(n)return"undefined"!=typeof module&&module.exports&&(module.exports=n),n;var a,o,l,h,_,u,f,c=function(t){var e,i=t.split("."),s=r;for(e=0;e<i.length;e++)s[i[e]]=s=s[i[e]]||{};return s},p=c("com.greensock"),m=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},d=function(){},g=(u=Object.prototype.toString,f=u.call([]),function(t){return null!=t&&(t instanceof Array||"object"==typeof t&&!!t.push&&u.call(t)===f)}),y={},v=function(e,s,n,a){this.sc=y[e]?y[e].sc:[],y[e]=this,this.gsClass=null,this.func=n;var o=[];this.check=function(l){for(var h,_,u,f,p=s.length,m=p;--p>-1;)(h=y[s[p]]||new v(s[p],[])).gsClass?(o[p]=h.gsClass,m--):l&&h.sc.push(this);if(0===m&&n){if(u=(_=("com.greensock."+e).split(".")).pop(),f=c(_.join("."))[u]=this.gsClass=n.apply(n,o),a)if(r[u]=i[u]=f,"undefined"!=typeof module&&module.exports)if("TweenMax"===e)for(p in module.exports=i.TweenMax=f,i)f[p]=i[p];else i.TweenMax&&(i.TweenMax[u]=f);else"function"==typeof define&&define.amd&&define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+e.split(".").pop(),[],function(){return f});for(p=0;p<this.sc.length;p++)this.sc[p].check()}},this.check(!0)},T=t._gsDefine=function(t,e,i,s){return new v(t,e,i,s)},x=p._class=function(t,e,i){return e=e||function(){},T(t,[],function(){return e},i),e};T.globals=r;var b=[0,0,1,1],w=x("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?b.concat(e):b},!0),P=w.map={},O=w.register=function(t,e,i,s){for(var r,n,a,o,l=e.split(","),h=l.length,_=(i||"easeIn,easeOut,easeInOut").split(",");--h>-1;)for(n=l[h],r=s?x("easing."+n,null,!0):p.easing[n]||{},a=_.length;--a>-1;)o=_[a],P[n+"."+o]=P[o+n]=r[o]=t.getRatio?t:t[o]||new t};for((l=w.prototype)._calcEnd=!1,l.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:t<.5?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:t<.5?s/2:1-s/2},o=(a=["Linear","Quad","Cubic","Quart","Quint,Strong"]).length;--o>-1;)l=a[o]+",Power"+o,O(new w(null,null,1,o),l,"easeOut",!0),O(new w(null,null,2,o),l,"easeIn"+(0===o?",easeNone":"")),O(new w(null,null,3,o),l,"easeInOut");P.linear=p.easing.Linear.easeIn,P.swing=p.easing.Quad.easeInOut;var S=x("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});(l=S.prototype).addEventListener=function(t,e,i,s,r){r=r||0;var n,a,o=this._listeners[t],l=0;for(this!==h||_||h.wake(),null==o&&(this._listeners[t]=o=[]),a=o.length;--a>-1;)(n=o[a]).c===e&&n.s===i?o.splice(a,1):0===l&&n.pr<r&&(l=a+1);o.splice(l,0,{c:e,s:i,up:s,pr:r})},l.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return void s.splice(i,1)},l.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for((e=r.length)>1&&(r=r.slice(0)),i=this._eventTarget;--e>-1;)(s=r[e])&&(s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i))};var k=t.requestAnimationFrame,R=t.cancelAnimationFrame,A=Date.now||function(){return(new Date).getTime()},C=A();for(o=(a=["ms","moz","webkit","o"]).length;--o>-1&&!k;)k=t[a[o]+"RequestAnimationFrame"],R=t[a[o]+"CancelAnimationFrame"]||t[a[o]+"CancelRequestAnimationFrame"];x("Ticker",function(t,e){var i,r,n,a,o,l=this,u=A(),f=!(!1===e||!k)&&"auto",c=500,p=33,m=function(t){var e,s,h=A()-C;h>c&&(u+=h-p),C+=h,l.time=(C-u)/1e3,e=l.time-o,(!i||e>0||!0===t)&&(l.frame++,o+=e+(e>=a?.004:a-e),s=!0),!0!==t&&(n=r(m)),s&&l.dispatchEvent("tick")};S.call(l),l.time=l.frame=0,l.tick=function(){m(!0)},l.lagSmoothing=function(t,e){if(!arguments.length)return c<1e8;c=t||1e8,p=Math.min(e,c,0)},l.sleep=function(){null!=n&&(f&&R?R(n):clearTimeout(n),r=d,n=null,l===h&&(_=!1))},l.wake=function(t){null!==n?l.sleep():t?u+=-C+(C=A()):l.frame>10&&(C=A()-c+5),r=0===i?d:f&&k?k:function(t){return setTimeout(t,1e3*(o-l.time)+1|0)},l===h&&(_=!0),m(2)},l.fps=function(t){if(!arguments.length)return i;a=1/((i=t)||60),o=this.time+a,l.wake()},l.useRAF=function(t){if(!arguments.length)return f;l.sleep(),f=t,l.fps(i)},l.fps(t),setTimeout(function(){"auto"===f&&l.frame<5&&"hidden"!==(s||{}).visibilityState&&l.useRAF(!1)},1500)}),(l=p.Ticker.prototype=new p.events.EventDispatcher).constructor=p.Ticker;var M=x("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=!!e.immediateRender,this.data=e.data,this._reversed=!!e.reversed,Q){_||h.wake();var i=this.vars.useFrames?$:Q;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});h=M.ticker=new p.Ticker,(l=M.prototype)._dirty=l._gc=l._initted=l._paused=!1,l._totalTime=l._time=0,l._rawPrevTime=-1,l._next=l._last=l._onUpdate=l._timeline=l.timeline=null,l._paused=!1;var D=function(){_&&A()-C>2e3&&("hidden"!==(s||{}).visibilityState||!h.lagSmoothing())&&h.wake();var t=setTimeout(D,2e3);t.unref&&t.unref()};D(),l.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},l.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},l.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},l.seek=function(t,e){return this.totalTime(Number(t),!1!==e)},l.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,!1!==e,!0)},l.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},l.render=function(t,e,i){},l.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,!this._gc&&this.timeline||this._enabled(!0),this},l.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime(!0))>=i&&t<i+this.totalDuration()/this._timeScale-1e-8},l._enabled=function(t,e){return _||h.wake(),this._gc=!t,this._active=this.isActive(),!0!==e&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},l._kill=function(t,e){return this._enabled(!1,!1)},l.kill=function(t,e){return this._kill(t,e),this},l._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},l._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},l._callback=function(t){var e=this.vars,i=e[t],s=e[t+"Params"],r=e[t+"Scope"]||e.callbackScope||this;switch(s?s.length:0){case 0:i.call(r);break;case 1:i.call(r,s[0]);break;case 2:i.call(r,s[0],s[1]);break;default:i.apply(r,s)}},l.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=g(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},l.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},l.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},l.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},l.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},l.totalTime=function(t,e,i){if(_||h.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(t<0&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),this._totalTime===t&&0!==this._duration||(I.length&&J(),this.render(t,e,!1),I.length&&J())}return this},l.progress=l.totalProgress=function(t,e){var i=this.duration();return arguments.length?this.totalTime(i*t,e):i?this._time/i:this.ratio},l.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},l.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},l.timeScale=function(t){if(!arguments.length)return this._timeScale;var e,i;for(t=t||1e-8,this._timeline&&this._timeline.smoothChildTiming&&(i=(e=this._pauseTime)||0===e?e:this._timeline.totalTime(),this._startTime=i-(i-this._startTime)*this._timeScale/t),this._timeScale=t,i=this.timeline;i&&i.timeline;)i._dirty=!0,i.totalDuration(),i=i.timeline;return this},l.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},l.paused=function(t){if(!arguments.length)return this._paused;var e,i,s=this._timeline;return t!=this._paused&&s&&(_||t||h.wake(),i=(e=s.rawTime())-this._pauseTime,!t&&s.smoothChildTiming&&(this._startTime+=i,this._uncache(!1)),this._pauseTime=t?e:null,this._paused=t,this._active=this.isActive(),!t&&0!==i&&this._initted&&this.duration()&&(e=s.smoothChildTiming?this._totalTime:(e-this._startTime)/this._timeScale,this.render(e,e===this._totalTime,!0))),this._gc&&!t&&this._enabled(!0,!1),this};var F=x("core.SimpleTimeline",function(t){M.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});(l=F.prototype=new M).constructor=F,l.kill()._gc=!1,l._first=l._last=l._recent=null,l._sortChildren=!1,l.add=l.insert=function(t,e,i,s){var r,n;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=this.rawTime()-(t._timeline.rawTime()-t._pauseTime)),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),r=this._last,this._sortChildren)for(n=t._startTime;r&&r._startTime>n;)r=r._prev;return r?(t._next=r._next,r._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=r,this._recent=t,this._timeline&&this._uncache(!0),this},l._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},l.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused&&!r._gc)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},l.rawTime=function(){return _||h.wake(),this._totalTime};var z=x("TweenLite",function(e,i,s){if(M.call(this,i,s),this.render=z.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:z.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),l=this.vars.overwrite;if(this._overwrite=l=null==l?H[z.defaultOverwrite]:"number"==typeof l?l>>0:H[l],(o||e instanceof Array||e.push&&g(e))&&"number"!=typeof e[0])for(this._targets=a=m(e),this._propLookup=[],this._siblings=[],r=0;r<a.length;r++)(n=a[r])?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(m(n))):(this._siblings[r]=tt(n,this,!1),1===l&&this._siblings[r].length>1&&it(n,this,null,1,this._siblings[r])):"string"==typeof(n=a[r--]=z.selector(n))&&a.splice(r+1,1):a.splice(r--,1);else this._propLookup={},this._siblings=tt(e,this,!1),1===l&&this._siblings.length>1&&it(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&!1!==this.vars.immediateRender)&&(this._time=-1e-8,this.render(Math.min(0,-this._delay)))},!0),E=function(e){return e&&e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)};(l=z.prototype=new M).constructor=z,l.kill()._gc=!1,l.ratio=0,l._firstPT=l._targets=l._overwrittenProps=l._startAt=null,l._notifyPluginsOfEnabled=l._lazy=!1,z.version="2.1.3",z.defaultEase=l._ease=new w(null,null,1,1),z.defaultOverwrite="auto",z.ticker=h,z.autoSleep=120,z.lagSmoothing=function(t,e){h.lagSmoothing(t,e)},z.selector=t.$||t.jQuery||function(e){var i=t.$||t.jQuery;return i?(z.selector=i,i(e)):(s||(s=t.document),s?s.querySelectorAll?s.querySelectorAll(e):s.getElementById("#"===e.charAt(0)?e.substr(1):e):e)};var I=[],X={},N=/(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,L=/[\+-]=-?[\.\d]/,B=function(t){for(var e,i=this._firstPT;i;)e=i.blob?1===t&&null!=this.end?this.end:t?this.join(""):this.start:i.c*t+i.s,i.m?e=i.m.call(this._tween,e,this._target||i.t,this._tween):e<1e-6&&e>-1e-6&&!i.blob&&(e=0),i.f?i.fp?i.t[i.p](i.fp,e):i.t[i.p](e):i.t[i.p]=e,i=i._next},Y=function(t){return(1e3*t|0)/1e3+""},j=function(t,e,i,s){var r,n,a,o,l,h,_,u=[],f=0,c="",p=0;for(u.start=t,u.end=e,t=u[0]=t+"",e=u[1]=e+"",i&&(i(u),t=u[0],e=u[1]),u.length=0,r=t.match(N)||[],n=e.match(N)||[],s&&(s._next=null,s.blob=1,u._firstPT=u._applyPT=s),l=n.length,o=0;o<l;o++)_=n[o],c+=(h=e.substr(f,e.indexOf(_,f)-f))||!o?h:",",f+=h.length,p?p=(p+1)%5:"rgba("===h.substr(-5)&&(p=1),_===r[o]||r.length<=o?c+=_:(c&&(u.push(c),c=""),a=parseFloat(r[o]),u.push(a),u._firstPT={_next:u._firstPT,t:u,p:u.length-1,s:a,c:("="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*parseFloat(_.substr(2)):parseFloat(_)-a)||0,f:0,m:p&&p<4?Math.round:Y}),f+=_.length;return(c+=e.substr(f))&&u.push(c),u.setRatio=B,L.test(e)&&(u.end=null),u},U=function(t,e,i,s,r,n,a,o,l){"function"==typeof s&&(s=s(l||0,t));var h=typeof t[e],_="function"!==h?"":e.indexOf("set")||"function"!=typeof t["get"+e.substr(3)]?e:"get"+e.substr(3),u="get"!==i?i:_?a?t[_](a):t[_]():t[e],f="string"==typeof s&&"="===s.charAt(1),c={t:t,p:e,s:u,f:"function"===h,pg:0,n:r||e,m:n?"function"==typeof n?n:Math.round:0,pr:0,c:f?parseInt(s.charAt(0)+"1",10)*parseFloat(s.substr(2)):parseFloat(s)-u||0};if(("number"!=typeof u||"number"!=typeof s&&!f)&&(a||isNaN(u)||!f&&isNaN(s)||"boolean"==typeof u||"boolean"==typeof s?(c.fp=a,c={t:j(u,f?parseFloat(c.s)+c.c+(c.s+"").replace(/[0-9\-\.]/g,""):s,o||z.defaultStringFilter,c),p:"setRatio",s:0,c:1,f:2,pg:0,n:r||e,pr:0,m:0}):(c.s=parseFloat(u),f||(c.c=parseFloat(s)-c.s||0))),c.c)return(c._next=this._firstPT)&&(c._next._prev=c),this._firstPT=c,c},V=z._internals={isArray:g,isSelector:E,lazyTweens:I,blobDif:j},q=z._plugins={},W=V.tweenLookup={},G=0,Z=V.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1,callbackScope:1,stringFilter:1,id:1,yoyoEase:1,stagger:1},H={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,true:1,false:0},$=M._rootFramesTimeline=new F,Q=M._rootTimeline=new F,K=30,J=V.lazyRender=function(){var t,e,i=I.length;for(X={},t=0;t<i;t++)(e=I[t])&&!1!==e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0),e._lazy=!1);I.length=0};Q._startTime=h.time,$._startTime=h.frame,Q._active=$._active=!0,setTimeout(J,1),M._updateRoot=z.render=function(){var t,e,i;if(I.length&&J(),Q.render((h.time-Q._startTime)*Q._timeScale,!1,!1),$.render((h.frame-$._startTime)*$._timeScale,!1,!1),I.length&&J(),h.frame>=K){for(i in K=h.frame+(parseInt(z.autoSleep,10)||120),W){for(t=(e=W[i].tweens).length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete W[i]}if((!(i=Q._first)||i._paused)&&z.autoSleep&&!$._first&&1===h._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||h.sleep()}}},h.addEventListener("tick",M._updateRoot);var tt=function(t,e,i){var s,r,n=t._gsTweenID;if(W[n||(t._gsTweenID=n="t"+G++)]||(W[n]={target:t,tweens:[]}),e&&((s=W[n].tweens)[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return W[n].tweens},et=function(t,e,i,s){var r,n,a=t.vars.onOverwrite;return a&&(r=a(t,e,i,s)),(a=z.onOverwrite)&&(n=a(t,e,i,s)),!1!==r&&!1!==n},it=function(t,e,i,s,r){var n,a,o,l;if(1===s||s>=4){for(l=r.length,n=0;n<l;n++)if((o=r[n])!==e)o._gc||o._kill(null,t,e)&&(a=!0);else if(5===s)break;return a}var h,_=e._startTime+1e-8,u=[],f=0,c=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(h=h||st(e,0,c),0===st(o,h,c)&&(u[f++]=o)):o._startTime<=_&&o._startTime+o.totalDuration()/o._timeScale>_&&((c||!o._initted)&&_-o._startTime<=2e-8||(u[f++]=o)));for(n=f;--n>-1;)if(l=(o=u[n])._firstPT,2===s&&o._kill(i,t,e)&&(a=!0),2!==s||!o._firstPT&&o._initted&&l){if(2!==s&&!et(o,e))continue;o._enabled(!1,!1)&&(a=!0)}return a},st=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return(n/=r)>e?n-e:i&&n===e||!t._initted&&n-e<2e-8?1e-8:(n+=t.totalDuration()/t._timeScale/r)>e+1e-8?0:n-e-1e-8};l._init=function(){var t,e,i,s,r,n,a=this.vars,o=this._overwrittenProps,l=this._duration,h=!!a.immediateRender,_=a.ease,u=this._startAt;if(a.startAt){for(s in u&&(u.render(-1,!0),u.kill()),r={},a.startAt)r[s]=a.startAt[s];if(r.data="isStart",r.overwrite=!1,r.immediateRender=!0,r.lazy=h&&!1!==a.lazy,r.startAt=r.delay=null,r.onUpdate=a.onUpdate,r.onUpdateParams=a.onUpdateParams,r.onUpdateScope=a.onUpdateScope||a.callbackScope||this,this._startAt=z.to(this.target||{},0,r),h)if(this._time>0)this._startAt=null;else if(0!==l)return}else if(a.runBackwards&&0!==l)if(u)u.render(-1,!0),u.kill(),this._startAt=null;else{for(s in 0!==this._time&&(h=!1),i={},a)Z[s]&&"autoCSS"!==s||(i[s]=a[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&!1!==a.lazy,i.immediateRender=h,this._startAt=z.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=_=_?_ instanceof w?_:"function"==typeof _?new w(_,a.easeParams):P[_]||z.defaultEase:z.defaultEase,a.easeParams instanceof Array&&_.config&&(this._ease=_.config.apply(_,a.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(n=this._targets.length,t=0;t<n;t++)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],o?o[t]:null,t)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,o,0);if(e&&z._onPluginEvent("_onInitAllProps",this),o&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),a.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=a.onUpdate,this._initted=!0},l._initProps=function(e,i,s,r,n){var a,o,l,h,_,u;if(null==e)return!1;for(a in X[e._gsTweenID]&&J(),this.vars.css||e.style&&e!==t&&e.nodeType&&q.css&&!1!==this.vars.autoCSS&&function(t,e){var i,s={};for(i in t)Z[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!q[i]||q[i]&&q[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s}(this.vars,e),this.vars)if(u=this.vars[a],Z[a])u&&(u instanceof Array||u.push&&g(u))&&-1!==u.join("").indexOf("{self}")&&(this.vars[a]=u=this._swapSelfInParams(u,this));else if(q[a]&&(h=new q[a])._onInitTween(e,this.vars[a],this,n)){for(this._firstPT=_={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:1,n:a,pg:1,pr:h._priority,m:0},o=h._overwriteProps.length;--o>-1;)i[h._overwriteProps[o]]=this._firstPT;(h._priority||h._onInitAllProps)&&(l=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0),_._next&&(_._next._prev=_)}else i[a]=U.call(this,e,a,"get",u,a,0,null,this.vars.stringFilter,n);return r&&this._kill(r,e)?this._initProps(e,i,s,r,n):this._overwrite>1&&this._firstPT&&s.length>1&&it(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r,n)):(this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration)&&(X[e._gsTweenID]=!0),l)},l.render=function(t,e,i){var s,r,n,a,o=this._time,l=this._duration,h=this._rawPrevTime;if(t>=l-1e-8&&t>=0)this._totalTime=this._time=l,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete",i=i||this._timeline.autoRemoveChildren),0===l&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(h<0||t<=0&&t>=-1e-8||1e-8===h&&"isPause"!==this.data)&&h!==t&&(i=!0,h>1e-8&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||h===t?t:1e-8);else if(t<1e-8)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===l&&h>0)&&(r="onReverseComplete",s=this._reversed),t>-1e-8?t=0:t<0&&(this._active=!1,0===l&&(this._initted||!this.vars.lazy||i)&&(h>=0&&(1e-8!==h||"isPause"!==this.data)&&(i=!0),this._rawPrevTime=a=!e||t||h===t?t:1e-8)),(!this._initted||this._startAt&&this._startAt.progress())&&(i=!0);else if(this._totalTime=this._time=t,this._easeType){var _=t/l,u=this._easeType,f=this._easePower;(1===u||3===u&&_>=.5)&&(_=1-_),3===u&&(_*=2),1===f?_*=_:2===f?_*=_*_:3===f?_*=_*_*_:4===f&&(_*=_*_*_*_),this.ratio=1===u?1-_:2===u?_:t/l<.5?_/2:1-_/2}else this.ratio=this._ease.getRatio(t/l);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=h,I.push(this),void(this._lazy=[t,e]);this._time&&!s?this.ratio=this._ease.getRatio(this._time/l):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(!1!==this._lazy&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,!0,i):r||(r="_dummyGS")),this.vars.onStart&&(0===this._time&&0!==l||e||this._callback("onStart"))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(t<0&&this._startAt&&-1e-4!==t&&this._startAt.render(t,!0,i),e||(this._time!==o||s||i)&&this._callback("onUpdate")),r&&(this._gc&&!i||(t<0&&this._startAt&&!this._onUpdate&&-1e-4!==t&&this._startAt.render(t,!0,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this._callback(r),0===l&&1e-8===this._rawPrevTime&&1e-8!==a&&(this._rawPrevTime=0)))}},l._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:z.selector(e)||e;var s,r,n,a,o,l,h,_,u,f=i&&this._time&&i._startTime===this._startTime&&this._timeline===i._timeline,c=this._firstPT;if((g(e)||E(e))&&"number"!=typeof e[0])for(s=e.length;--s>-1;)this._kill(t,e[s],i)&&(l=!0);else{if(this._targets){for(s=this._targets.length;--s>-1;)if(e===this._targets[s]){o=this._propLookup[s]||{},this._overwrittenProps=this._overwrittenProps||[],r=this._overwrittenProps[s]=t?this._overwrittenProps[s]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,r=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){if(h=t||o,_=t!==r&&"all"!==r&&t!==o&&("object"!=typeof t||!t._tempKill),i&&(z.onOverwrite||this.vars.onOverwrite)){for(n in h)o[n]&&(u||(u=[]),u.push(n));if((u||!t)&&!et(this,i,e,u))return!1}for(n in h)(a=o[n])&&(f&&(a.f?a.t[a.p](a.s):a.t[a.p]=a.s,l=!0),a.pg&&a.t._kill(h)&&(l=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),_&&(r[n]=1);!this._firstPT&&this._initted&&c&&this._enabled(!1,!1)}}return l},l.invalidate=function(){this._notifyPluginsOfEnabled&&z._onPluginEvent("_onDisable",this);var t=this._time;return this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],M.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-1e-8,this.render(t,!1,!1!==this.vars.lazy)),this},l._enabled=function(t,e){if(_||h.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=tt(s[i],this,!0);else this._siblings=tt(this.target,this,!0)}return M.prototype._enabled.call(this,t,e),!(!this._notifyPluginsOfEnabled||!this._firstPT)&&z._onPluginEvent(t?"_onEnable":"_onDisable",this)},z.to=function(t,e,i){return new z(t,e,i)},z.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new z(t,e,i)},z.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new z(t,e,s)},z.delayedCall=function(t,e,i,s,r){return new z(e,0,{delay:t,onComplete:e,onCompleteParams:i,callbackScope:s,onReverseComplete:e,onReverseCompleteParams:i,immediateRender:!1,lazy:!1,useFrames:r,overwrite:0})},z.set=function(t,e){return new z(t,0,e)},z.getTweensOf=function(t,e){if(null==t)return[];var i,s,r,n;if(t="string"!=typeof t?t:z.selector(t)||t,(g(t)||E(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(z.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else if(t._gsTweenID)for(i=(s=tt(t).concat()).length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s||[]},z.killTweensOf=z.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=z.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var rt=x("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=rt.prototype},!0);if(l=rt.prototype,rt.version="1.19.0",rt.API=2,l._firstPT=null,l._addTween=U,l.setRatio=B,l._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},l._mod=l._roundProps=function(t){for(var e,i=this._firstPT;i;)(e=t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&"function"==typeof e&&(2===i.f?i.t._applyPT.m=e:i.m=e),i=i._next},z._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},rt.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===rt.API&&(q[(new t[e])._propName]=t[e]);return!0},T.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_mod",mod:"_mod",initAll:"_onInitAllProps"},a=x("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){rt.call(this,i,s),this._overwriteProps=r||[]},!0===t.global),o=a.prototype=new rt(i);for(e in o.constructor=a,a.API=t.API,n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,rt.activate([a]),a},a=t._gsQueue){for(o=0;o<a.length;o++)a[o]();for(l in y)y[l].func||t.console.log("GSAP encountered missing dependency: "+l)}_=!1}("undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window);
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.ScrollMagic = factory();
	}
}(this, function () {
	"use strict";

	var ScrollMagic = function () {
		_util.log(2, '(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use \'new ScrollMagic.Controller()\' to create a new controller instance. Use \'new ScrollMagic.Scene()\' to instance a scene.');
	};

	ScrollMagic.version = "2.0.7";

    var Util = window.WhyGalaxy.util,
    	isIEorEdge = Util.isIEorEdge !== -1;

	window.addEventListener("mousewheel", function () {});

	var PIN_SPACER_ATTRIBUTE = "data-scrollmagic-pin-spacer";

	ScrollMagic.Controller = function (options) {
		var
			NAMESPACE = 'ScrollMagic.Controller',
			SCROLL_DIRECTION_FORWARD = 'FORWARD',
			SCROLL_DIRECTION_REVERSE = 'REVERSE',
			SCROLL_DIRECTION_PAUSED = 'PAUSED',
			DEFAULT_OPTIONS = CONTROLLER_OPTIONS.defaults;

		var
			Controller = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_sceneObjects = [],
			_updateScenesOnNextCycle = false, 
			_scrollPos = 0,
			_scrollDirection = SCROLL_DIRECTION_PAUSED,
			_isDocument = true,
			_viewPortSize = 0,
			_enabled = true,
			_updateTimeout,
			_refreshTimeout;


		var construct = function () {
			for (var key in _options) {
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			_options.container = _util.get.elements(_options.container)[0];
			if (!_options.container) {
				log(1, "ERROR creating object " + NAMESPACE + ": No valid scroll container supplied");
				throw NAMESPACE + " init failed."; 
			}
			_isDocument = _options.container === window || _options.container === document.body || !document.body.contains(_options.container);
			if (_isDocument) {
				_options.container = window;
			}
			_viewPortSize = getViewportSize();
			_options.container.addEventListener("resize", onChange);
			_options.container.addEventListener("scroll", onChange);

			var ri = parseInt(_options.refreshInterval, 10);
			_options.refreshInterval = _util.type.Number(ri) ? ri : DEFAULT_OPTIONS.refreshInterval;
			scheduleRefresh();

			log(3, "added new " + NAMESPACE + " controller (v" + ScrollMagic.version + ")");
		};

		var scheduleRefresh = function () {
			if (_options.refreshInterval > 0) {
				_refreshTimeout = window.setTimeout(refresh, _options.refreshInterval);
			}
		};

		var getScrollPos = function () {
			return _options.vertical ? _util.get.scrollTop(_options.container) : _util.get.scrollLeft(_options.container);
		};

		var getViewportSize = function () {
			return _options.vertical ? _util.get.height(_options.container) : _util.get.width(_options.container);
		};

		var setScrollPos = this._setScrollPos = function (pos) {
			if (_options.vertical) {
				if (_isDocument) {
					window.scrollTo(_util.get.scrollLeft(), pos);
				} else {
					_options.container.scrollTop = pos;
				}
			} else {
				if (_isDocument) {
					window.scrollTo(pos, _util.get.scrollTop());
				} else {
					_options.container.scrollLeft = pos;
				}
			}
		};

		var updateScenes = function () {
			if (_enabled && _updateScenesOnNextCycle) {
				var scenesToUpdate = _util.type.Array(_updateScenesOnNextCycle) ? _updateScenesOnNextCycle : _sceneObjects.slice(0);
				_updateScenesOnNextCycle = false;
				var oldScrollPos = _scrollPos;
				_scrollPos = Controller.scrollPos();
				var deltaScroll = _scrollPos - oldScrollPos;
				if (deltaScroll !== 0) { 
					_scrollDirection = (deltaScroll > 0) ? SCROLL_DIRECTION_FORWARD : SCROLL_DIRECTION_REVERSE;
				}
				if (_scrollDirection === SCROLL_DIRECTION_REVERSE) {
					scenesToUpdate.reverse();
				}
				scenesToUpdate.forEach(function (scene, index) {
					log(3, "updating Scene " + (index + 1) + "/" + scenesToUpdate.length + " (" + _sceneObjects.length + " total)");
					scene.update(true);
				});
				if (scenesToUpdate.length === 0 && _options.loglevel >= 3) {
					log(3, "updating 0 Scenes (nothing added to controller)");
				}
			}
		};

		var debounceUpdate = function () {
			_updateTimeout = _util.rAF(updateScenes);
		};

		var onChange = function (e) {
			log(3, "event fired causing an update:", e.type);
			if (e.type == "resize") {
				_viewPortSize = getViewportSize();
				_scrollDirection = SCROLL_DIRECTION_PAUSED;
			}
			if (_updateScenesOnNextCycle !== true) {
				_updateScenesOnNextCycle = true;
				debounceUpdate();
			}
		};

		var refresh = function () {
			if (!_isDocument) {
				if (_viewPortSize != getViewportSize()) {
					var resizeEvent;
					try {
						resizeEvent = new Event('resize', {
							bubbles: false,
							cancelable: false
						});
					} catch (e) { 
						resizeEvent = document.createEvent("Event");
						resizeEvent.initEvent("resize", false, false);
					}
					_options.container.dispatchEvent(resizeEvent);
				}
			}
			_sceneObjects.forEach(function (scene, index) { 
				scene.refresh();
			});
			scheduleRefresh();
		};

		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};
		this._options = _options;

		var sortScenes = function (ScenesArray) {
			if (ScenesArray.length <= 1) {
				return ScenesArray;
			} else {
				var scenes = ScenesArray.slice(0);
				scenes.sort(function (a, b) {
					return a.scrollOffset() > b.scrollOffset() ? 1 : -1;
				});
				return scenes;
			}
		};


		this.addScene = function (newScene) {
			if (_util.type.Array(newScene)) {
				newScene.forEach(function (scene, index) {
					Controller.addScene(scene);
				});
			} else if (newScene instanceof ScrollMagic.Scene) {
				if (newScene.controller() !== Controller) {
					newScene.addTo(Controller);
				} else if (_sceneObjects.indexOf(newScene) < 0) {
					_sceneObjects.push(newScene); 
					_sceneObjects = sortScenes(_sceneObjects); 
					newScene.on("shift.controller_sort", function () { 
						_sceneObjects = sortScenes(_sceneObjects);
					});
					for (var key in _options.globalSceneOptions) {
						if (newScene[key]) {
							newScene[key].call(newScene, _options.globalSceneOptions[key]);
						}
					}
					log(3, "adding Scene (now " + _sceneObjects.length + " total)");
				}
			} else {
				log(1, "ERROR: invalid argument supplied for '.addScene()'");
			}
			return Controller;
		};

		this.removeScene = function (Scene) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.removeScene(scene);
				});
			} else {
				var index = _sceneObjects.indexOf(Scene);
				if (index > -1) {
					Scene.off("shift.controller_sort");
					_sceneObjects.splice(index, 1);
					log(3, "removing Scene (now " + _sceneObjects.length + " left)");
					Scene.remove();
				}
			}
			return Controller;
		};

		this.updateScene = function (Scene, immediately) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.updateScene(scene, immediately);
				});
			} else {
				if (immediately) {
					Scene.update(true);
				} else if (_updateScenesOnNextCycle !== true && Scene instanceof ScrollMagic.Scene) { 
					_updateScenesOnNextCycle = _updateScenesOnNextCycle || [];
					if (_updateScenesOnNextCycle.indexOf(Scene) == -1) {
						_updateScenesOnNextCycle.push(Scene);
					}
					_updateScenesOnNextCycle = sortScenes(_updateScenesOnNextCycle); 
					debounceUpdate();
				}
			}
			return Controller;
		};

		this.update = function (immediately) {
			onChange({
				type: "resize"
			}); 
			if (immediately) {
				updateScenes();
			}
			return Controller;
		};

		this.scrollTo = function (scrollTarget, additionalParameter) {
			if (_util.type.Number(scrollTarget)) { 
				setScrollPos.call(_options.container, scrollTarget, additionalParameter);
			} else if (scrollTarget instanceof ScrollMagic.Scene) { 
				if (scrollTarget.controller() === Controller) { 
					Controller.scrollTo(scrollTarget.scrollOffset(), additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", scrollTarget);
				}
			} else if (_util.type.Function(scrollTarget)) { 
				setScrollPos = scrollTarget;
			} else { 
				var elem = _util.get.elements(scrollTarget)[0];
				if (elem) {
					while (elem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
						elem = elem.parentNode;
					}

					var
						param = _options.vertical ? "top" : "left", 
						containerOffset = _util.get.offset(_options.container), 
						elementOffset = _util.get.offset(elem);

					if (!_isDocument) { 
						containerOffset[param] -= Controller.scrollPos();
					}

					Controller.scrollTo(elementOffset[param] - containerOffset[param], additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", scrollTarget);
				}
			}
			return Controller;
		};

		this.scrollPos = function (scrollPosMethod) {
			if (!arguments.length) { 
				return getScrollPos.call(Controller);
			} else { 
				if (_util.type.Function(scrollPosMethod)) {
					getScrollPos = scrollPosMethod;
				} else {
					log(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
				}
			}
			return Controller;
		};

		this.info = function (about) {
			var values = {
				size: _viewPortSize, 
				vertical: _options.vertical,
				scrollPos: _scrollPos,
				scrollDirection: _scrollDirection,
				container: _options.container,
				isDocument: _isDocument
			};
			if (!arguments.length) { 
				return values;
			} else if (values[about] !== undefined) {
				return values[about];
			} else {
				log(1, "ERROR: option \"" + about + "\" is not available");
				return;
			}
		};

		this.loglevel = function (newLoglevel) {
			if (!arguments.length) { 
				return _options.loglevel;
			} else if (_options.loglevel != newLoglevel) { 
				_options.loglevel = newLoglevel;
			}
			return Controller;
		};

		this.enabled = function (newState) {
			if (!arguments.length) { 
				return _enabled;
			} else if (_enabled != newState) { 
				_enabled = !!newState;
				Controller.updateScene(_sceneObjects, true);
			}
			return Controller;
		};

		this.destroy = function (resetScenes) {
			window.clearTimeout(_refreshTimeout);
			var i = _sceneObjects.length;
			while (i--) {
				_sceneObjects[i].destroy(resetScenes);
			}
			_options.container.removeEventListener("resize", onChange);
			_options.container.removeEventListener("scroll", onChange);
			_util.cAF(_updateTimeout);
			log(3, "destroyed " + NAMESPACE + " (reset: " + (resetScenes ? "true" : "false") + ")");
			return null;
		};

		construct();
		return Controller;
	};

	var CONTROLLER_OPTIONS = {
		defaults: {
			container: window,
			vertical: true,
			globalSceneOptions: {},
			loglevel: 2,
			refreshInterval: 100
		}
	};
	ScrollMagic.Controller.addOption = function (name, defaultValue) {
		CONTROLLER_OPTIONS.defaults[name] = defaultValue;
	};
	ScrollMagic.Controller.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Controller = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); 
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Controller, oldClass); 
		ScrollMagic.Controller.prototype = oldClass.prototype; 
		ScrollMagic.Controller.prototype.constructor = ScrollMagic.Controller; 
	};


	ScrollMagic.Scene = function (options) {


		var
			NAMESPACE = 'ScrollMagic.Scene',
			SCENE_STATE_BEFORE = 'BEFORE',
			SCENE_STATE_DURING = 'DURING',
			SCENE_STATE_AFTER = 'AFTER',
			DEFAULT_OPTIONS = SCENE_OPTIONS.defaults;


		var
			Scene = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_state = SCENE_STATE_BEFORE,
			_progress = 0,
			_scrollOffset = {
				start: 0,
				end: 0
			}, 
			_triggerPos = 0,
			_enabled = true,
			_durationUpdateMethod,
			_controller;

		if (isIEorEdge) {
			var _fixedPosData = null;
		}

		var construct = function () {
			for (var key in _options) { 
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			for (var optionName in DEFAULT_OPTIONS) {
				addSceneOption(optionName);
			}
			validateOption();
		};


		var _listeners = {};

		this.on = function (names, callback) {
			if (_util.type.Function(callback)) {
				names = names.trim().split(' ');
				names.forEach(function (fullname) {
					var
						nameparts = fullname.split('.'),
						eventname = nameparts[0],
						namespace = nameparts[1];
					if (eventname != "*") { 
						if (!_listeners[eventname]) {
							_listeners[eventname] = [];
						}
						_listeners[eventname].push({
							namespace: namespace || '',
							callback: callback
						});
					}
				});
			} else {
				log(1, "ERROR when calling '.on()': Supplied callback for '" + names + "' is not a valid function!");
			}
			return Scene;
		};

		this.off = function (names, callback) {
			if (!names) {
				log(1, "ERROR: Invalid event name supplied.");
				return Scene;
			}
			names = names.trim().split(' ');
			names.forEach(function (fullname, key) {
				var
					nameparts = fullname.split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1] || '',
					removeList = eventname === '*' ? Object.keys(_listeners) : [eventname];
				removeList.forEach(function (remove) {
					var
						list = _listeners[remove] || [],
						i = list.length;
					while (i--) {
						var listener = list[i];
						if (listener && (namespace === listener.namespace || namespace === '*') && (!callback || callback == listener.callback)) {
							list.splice(i, 1);
						}
					}
					if (!list.length) {
						delete _listeners[remove];
					}
				});
			});
			return Scene;
		};

		this.trigger = function (name, vars) {
			if (name) {
				var
					nameparts = name.trim().split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1],
					listeners = _listeners[eventname];
				log(3, 'event fired:', eventname, vars ? "->" : '', vars || '');
				if (listeners) {
					listeners.forEach(function (listener, key) {
						if (!namespace || namespace === listener.namespace) {
							listener.callback.call(Scene, new ScrollMagic.Event(eventname, listener.namespace, Scene, vars));
						}
					});
				}
			} else {
				log(1, "ERROR: Invalid event name supplied.");
			}
			return Scene;
		};

		Scene
			.on("change.internal", function (e) {
				if (e.what !== "loglevel" && e.what !== "tweenChanges") { 
					if (e.what === "triggerElement") {
						updateTriggerElementPosition();
					} else if (e.what === "reverse") { 
						Scene.update();
					}
				}
			})
			.on("shift.internal", function (e) {
				updateScrollOffset();
				Scene.update(); 
			});

		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};

		this.addTo = function (controller) {
			if (!(controller instanceof ScrollMagic.Controller)) {
				log(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller");
			} else if (_controller != controller) {
				if (_controller) { 
					_controller.removeScene(Scene);
				}
				_controller = controller;
				validateOption();
				updateDuration(true);
				updateTriggerElementPosition(true);
				updateScrollOffset();
				_controller.info("container").addEventListener('resize', onContainerResize);
				controller.addScene(Scene);
				Scene.trigger("add", {
					controller: _controller
				});
				log(3, "added " + NAMESPACE + " to controller");
				Scene.update();
			}
			return Scene;
		};

		this.enabled = function (newState) {
			if (!arguments.length) { 
				return _enabled;
			} else if (_enabled != newState) { 
				_enabled = !!newState;
				Scene.update(true);
			}
			return Scene;
		};

		this.remove = function () {
			if (_controller) {
				_controller.info("container").removeEventListener('resize', onContainerResize);
				var tmpParent = _controller;
				_controller = undefined;
				tmpParent.removeScene(Scene);
				Scene.trigger("remove");
				log(3, "removed " + NAMESPACE + " from controller");
			}
			return Scene;
		};

		this.destroy = function (reset) {
			Scene.trigger("destroy", {
				reset: reset
			});
			Scene.remove();
			Scene.off("*.*");
			log(3, "destroyed " + NAMESPACE + " (reset: " + (reset ? "true" : "false") + ")");
			return null;
		};


		this.update = function (immediately) {
			if (_controller) {
				if (immediately) {
					if (_controller.enabled() && _enabled) {
						var
							scrollPos = _controller.info("scrollPos"),
							newProgress;

						if (_options.duration > 0) {
							newProgress = (scrollPos - _scrollOffset.start) / (_scrollOffset.end - _scrollOffset.start);
						} else {
							newProgress = scrollPos >= _scrollOffset.start ? 1 : 0;
						}

						Scene.trigger("update", {
							startPos: _scrollOffset.start,
							endPos: _scrollOffset.end,
							scrollPos: scrollPos
						});

						Scene.progress(newProgress);
					} else if (_pin && _state === SCENE_STATE_DURING) {
						updatePinState(true); 
					}
				} else {
					_controller.updateScene(Scene, false);
				}
			}
			return Scene;
		};

		this.refresh = function () {
			updateDuration();
			updateTriggerElementPosition();
			return Scene;
		};

		this.progress = function (progress) {
			if (!arguments.length) { 
				return _progress;
			} else { 
				var
					doUpdate = false,
					oldState = _state,
					scrollDirection = _controller ? _controller.info("scrollDirection") : 'PAUSED',
					reverseOrForward = _options.reverse || progress >= _progress;
				if (_options.duration === 0) {
					doUpdate = _progress != progress;
					_progress = progress < 1 && reverseOrForward ? 0 : 1;
					_state = _progress === 0 ? SCENE_STATE_BEFORE : SCENE_STATE_DURING;
				} else {
					if (progress < 0 && _state !== SCENE_STATE_BEFORE && reverseOrForward) {
						_progress = 0;
						_state = SCENE_STATE_BEFORE;
						doUpdate = true;
					} else if (progress >= 0 && progress < 1 && reverseOrForward) {
						_progress = progress;
						_state = SCENE_STATE_DURING;
						doUpdate = true;
					} else if (progress >= 1 && _state !== SCENE_STATE_AFTER) {
						_progress = 1;
						_state = SCENE_STATE_AFTER;
						doUpdate = true;
					} else if (_state === SCENE_STATE_DURING && !reverseOrForward) {
						updatePinState(); 
					}
				}
				if (doUpdate) {
					var
						eventVars = {
							progress: _progress,
							state: _state,
							scrollDirection: scrollDirection
						},
						stateChanged = _state != oldState;

					var trigger = function (eventName) { 
						Scene.trigger(eventName, eventVars);
					};

					if (stateChanged) { 
						if (oldState !== SCENE_STATE_DURING) {
							trigger("enter");
							trigger(oldState === SCENE_STATE_BEFORE ? "start" : "end");
						}
					}
					trigger("progress");
					if (stateChanged) { 
						if (_state !== SCENE_STATE_DURING) {
							trigger(_state === SCENE_STATE_BEFORE ? "start" : "end");
							trigger("leave");
						}
					}
				}

				return Scene;
			}
		};


		var updateScrollOffset = function () {
			_scrollOffset = {
				start: _triggerPos + _options.offset
			};
			if (_controller && _options.triggerElement) {
				_scrollOffset.start -= _controller.info("size") * _options.triggerHook;
			}
			_scrollOffset.end = _scrollOffset.start + _options.duration;
		};

		var updateDuration = function (suppressEvents) {
			if (_durationUpdateMethod) {
				var varname = "duration";
				if (changeOption(varname, _durationUpdateMethod.call(Scene)) && !suppressEvents) { 
					Scene.trigger("change", {
						what: varname,
						newval: _options[varname]
					});
					Scene.trigger("shift", {
						reason: varname
					});
				}
			}
		};

		var updateTriggerElementPosition = function (suppressEvents) {
			var
				elementPos = 0,
				telem = _options.triggerElement;
			if (_controller && (telem || _triggerPos > 0)) { 
				if (telem) { 
					if (telem.parentNode) { 
						var
							controllerInfo = _controller.info(),
							containerOffset = _util.get.offset(controllerInfo.container), 
							param = controllerInfo.vertical ? "top" : "left"; 

						while (telem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
							telem = telem.parentNode;
						}

						var elementOffset = _util.get.offset(telem);

						if (!controllerInfo.isDocument) { 
							containerOffset[param] -= _controller.scrollPos();
						}

						elementPos = elementOffset[param] - containerOffset[param];

					} else { 
						log(2, "WARNING: triggerElement was removed from DOM and will be reset to", undefined);
						Scene.triggerElement(undefined); 
					}
				}

				var changed = elementPos != _triggerPos;
				_triggerPos = elementPos;
				if (changed && !suppressEvents) {
					Scene.trigger("shift", {
						reason: "triggerElementPosition"
					});
				}
			}
		};

		var onContainerResize = function (e) {
			if (_options.triggerHook > 0) {
				Scene.trigger("shift", {
					reason: "containerResize"
				});
			}
		};


		var _validate = _util.extend(SCENE_OPTIONS.validate, {
			duration: function (val) {
				if (_util.type.String(val) && val.match(/^(\.|\d)*\d+%$/)) {
					var perc = parseFloat(val) / 100;
					val = function () {
						return _controller ? _controller.info("size") * perc : 0;
					};
				}
				if (_util.type.Function(val)) {
					_durationUpdateMethod = val;
					try {
						val = parseFloat(_durationUpdateMethod.call(Scene));
					} catch (e) {
						val = -1; 
					}
				}
				val = parseFloat(val);
				if (!_util.type.Number(val) || val < 0) {
					if (_durationUpdateMethod) {
						_durationUpdateMethod = undefined;
						throw ["Invalid return value of supplied function for option \"duration\":", val];
					} else {
						throw ["Invalid value for option \"duration\":", val];
					}
				}
				return val;
			}
		});

		var validateOption = function (check) {
			check = arguments.length ? [check] : Object.keys(_validate);
			check.forEach(function (optionName, key) {
				var value;
				if (_validate[optionName]) { 
					try { 
						value = _validate[optionName](_options[optionName]);
					} catch (e) { 
						value = DEFAULT_OPTIONS[optionName];
						var logMSG = _util.type.String(e) ? [e] : e;
						if (_util.type.Array(logMSG)) {
							logMSG[0] = "ERROR: " + logMSG[0];
							logMSG.unshift(1); 
							log.apply(this, logMSG);
						} else {
							log(1, "ERROR: Problem executing validation callback for option '" + optionName + "':", e.message);
						}
					} finally {
						_options[optionName] = value;
					}
				}
			});
		};

		var changeOption = function (varname, newval) {
			var
				changed = false,
				oldval = _options[varname];
			if (_options[varname] != newval) {
				_options[varname] = newval;
				validateOption(varname); 
				changed = oldval != _options[varname];
			}
			return changed;
		};

		var addSceneOption = function (optionName) {
			if (!Scene[optionName]) {
				Scene[optionName] = function (newVal) {
					if (!arguments.length) { 
						return _options[optionName];
					} else {
						if (optionName === "duration") { 
							_durationUpdateMethod = undefined;
						}
						if (changeOption(optionName, newVal)) { 
							Scene.trigger("change", {
								what: optionName,
								newval: _options[optionName]
							});
							if (SCENE_OPTIONS.shifts.indexOf(optionName) > -1) {
								Scene.trigger("shift", {
									reason: optionName
								});
							}
						}
					}
					return Scene;
				};
			}
		};







		this.controller = function () {
			return _controller;
		};

		this.state = function () {
			return _state;
		};

		this.scrollOffset = function () {
			return _scrollOffset.start;
		};

		this.triggerPosition = function () {
			var pos = _options.offset; 
			if (_controller) {
				if (_options.triggerElement) {
					pos += _triggerPos;
				} else {
					pos += _controller.info("size") * Scene.triggerHook();
				}
			}
			return pos;
		};


		var
			_pin,
			_pinOptions;

		Scene
			.on("shift.internal", function (e) {
				var durationChanged = e.reason === "duration";
				if ((_state === SCENE_STATE_AFTER && durationChanged) || (_state === SCENE_STATE_DURING && _options.duration === 0)) {
					updatePinState();
				}
				if (durationChanged) {
					updatePinDimensions();
				}
			})
			.on("progress.internal", function (e) {
				updatePinState();
			})
			.on("add.internal", function (e) {
				updatePinDimensions();
			})
			.on("destroy.internal", function (e) {
				Scene.removePin(e.reset);
			});
		var updatePinState = function (forceUnpin) {
			if (_pin && _controller) {
				var
					containerInfo = _controller.info(),
					pinTarget = _pinOptions.spacer.firstChild; 

				if (!forceUnpin && _state === SCENE_STATE_DURING) { 
					if (_util.css(pinTarget, "position") != "fixed") {
						_util.css(pinTarget, {
							"position": "fixed"
						});
						updatePinDimensions();
					}

					var
						fixedPos = _util.get.offset(_pinOptions.spacer, true), 
						scrollDistance = _options.reverse || _options.duration === 0 ?
						containerInfo.scrollPos - _scrollOffset.start 
						:
						Math.round(_progress * _options.duration * 10) / 10; 

					fixedPos[containerInfo.vertical ? "top" : "left"] += scrollDistance;

					if (isIEorEdge) {
						if (_fixedPosData == null) {
							_fixedPosData = fixedPos;
						} else {
							fixedPos = _fixedPosData;
						}
					}

					_util.css(_pinOptions.spacer.firstChild, {
						top: fixedPos.top,
						left: fixedPos.left
					});
				} else {
					var
						newCSS = {
							position: _pinOptions.inFlow ? "relative" : "absolute",
							top: 0,
							left: 0
						},
						change = _util.css(pinTarget, "position") != newCSS.position;

					if (isIEorEdge) {
						_fixedPosData = null;
					}

										if (!_pinOptions.pushFollowers) {
						newCSS[containerInfo.vertical ? "top" : "left"] = _options.duration * _progress;
					} else if (_options.duration > 0) { 
						if (_state === SCENE_STATE_AFTER && parseFloat(_util.css(_pinOptions.spacer, "padding-top")) === 0) {
							change = true; 
						} else if (_state === SCENE_STATE_BEFORE && parseFloat(_util.css(_pinOptions.spacer, "padding-bottom")) === 0) { 
							change = true; 
						}
					}
					_util.css(pinTarget, newCSS);
					if (change) {
						updatePinDimensions();
					}
				}
			}
		};

		var updatePinDimensions = function () {
			if (_pin && _controller && _pinOptions.inFlow) { 
				var
					after = (_state === SCENE_STATE_AFTER),
					before = (_state === SCENE_STATE_BEFORE),
					during = (_state === SCENE_STATE_DURING),
					vertical = _controller.info("vertical"),
					pinTarget = _pinOptions.spacer.firstChild, 
					marginCollapse = _util.isMarginCollapseType(_util.css(_pinOptions.spacer, "display")),
					css = {};

				if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
					if (during) {
						_util.css(_pin, {
							"width": "100%"
						});
					} else {
						_util.css(_pin, {
							"width": "100%"
						});
					}
				} else {
					css["min-width"] = _util.get.width(vertical ? _pin : pinTarget, true, true);
					css.width = during ? css["min-width"] : "auto";
				}
				if (_pinOptions.relSize.height) {
					if (during) {
						_util.css(_pin, {
							"height": _util.get.height(_pinOptions.spacer) - (_pinOptions.pushFollowers ? _options.duration : 0)
						});
					} else {
						_util.css(_pin, {
							"height": "100%"
						});
					}
				} else {
					css["min-height"] = _util.get.height(vertical ? pinTarget : _pin, true, !marginCollapse); 
					css.height = during ? css["min-height"] : "auto";
				}

				if (_pinOptions.pushFollowers) {
					css["padding" + (vertical ? "Top" : "Left")] = _options.duration * _progress;
					css["padding" + (vertical ? "Bottom" : "Right")] = _options.duration * (1 - _progress);
				}
				_util.css(_pinOptions.spacer, css);
			}
		};

		var updatePinInContainer = function () {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) {
				updatePinState();
			}
		};

		var updateRelativePinSpacer = function () {
			if (_controller && _pin && 
				_state === SCENE_STATE_DURING && 
				( 
					((_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) && _util.get.width(window) != _util.get.width(_pinOptions.spacer.parentNode)) ||
					(_pinOptions.relSize.height && _util.get.height(window) != _util.get.height(_pinOptions.spacer.parentNode))
				)
			) {
				updatePinDimensions();
			}
		};

		var onMousewheelOverPin = function (e) {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) { 
				e.preventDefault();
				_controller._setScrollPos(_controller.info("scrollPos") - ((e.wheelDelta || e[_controller.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30));
			}
		};

		this.setPin = function (element, settings) {
			var
				defaultSettings = {
					pushFollowers: true,
					spacerClass: "scrollmagic-pin-spacer"
				};
			var pushFollowersActivelySet = settings && settings.hasOwnProperty('pushFollowers');
			settings = _util.extend({}, defaultSettings, settings);

			element = _util.get.elements(element)[0];
			if (!element) {
				log(1, "ERROR calling method 'setPin()': Invalid pin element supplied.");
				return Scene; 
			} else if (_util.css(element, "position") === "fixed") {
				log(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'.");
				return Scene; 
			}

			if (_pin) { 
				if (_pin === element) {
					return Scene; 
				} else {
					Scene.removePin();
				}

			}
			_pin = element;

			var
				parentDisplay = _pin.parentNode.style.display,
				boundsParams = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];

			_pin.parentNode.style.display = 'none'; 
			var
				inFlow = _util.css(_pin, "position") != "absolute",
				pinCSS = _util.css(_pin, boundsParams.concat(["display"])),
				sizeCSS = _util.css(_pin, ["width", "height"]);
			_pin.parentNode.style.display = parentDisplay; 

			if (!inFlow && settings.pushFollowers) {
				log(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");
				settings.pushFollowers = false;
			}
			window.setTimeout(function () { 
				if (_pin && _options.duration === 0 && pushFollowersActivelySet && settings.pushFollowers) {
					log(2, "WARNING: pushFollowers =", true, "has no effect, when scene duration is 0.");
				}
			}, 0);

			var
				spacer = _pin.parentNode.insertBefore(document.createElement('div'), _pin),
				spacerCSS = _util.extend(pinCSS, {
					position: inFlow ? "relative" : "absolute",
					boxSizing: "content-box",
					mozBoxSizing: "content-box",
					webkitBoxSizing: "content-box"
				});

			if (!inFlow) { 
				_util.extend(spacerCSS, _util.css(_pin, ["width", "height"]));
			}

			_util.css(spacer, spacerCSS);
			spacer.setAttribute(PIN_SPACER_ATTRIBUTE, "");
			_util.addClass(spacer, settings.spacerClass);

			_pinOptions = {
				spacer: spacer,
				relSize: { 
					width: sizeCSS.width.slice(-1) === "%",
					height: sizeCSS.height.slice(-1) === "%",
					autoFullWidth: sizeCSS.width === "auto" && inFlow && _util.isMarginCollapseType(pinCSS.display)
				},
				pushFollowers: settings.pushFollowers,
				inFlow: inFlow, 
			};

			if (!_pin.___origStyle) {
				_pin.___origStyle = {};
				var
					pinInlineCSS = _pin.style,
					copyStyles = boundsParams.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
				copyStyles.forEach(function (val) {
					_pin.___origStyle[val] = pinInlineCSS[val] || "";
				});
			}

			if (_pinOptions.relSize.width) {
				_util.css(spacer, {
					width: sizeCSS.width
				});
			}
			if (_pinOptions.relSize.height) {
				_util.css(spacer, {
					height: sizeCSS.height
				});
			}

			spacer.appendChild(_pin);
			_util.css(_pin, {
				position: inFlow ? "relative" : "absolute",
				margin: "auto",
				top: "auto",
				left: "auto",
				bottom: "auto",
				right: "auto"
			});

			if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
				_util.css(_pin, {
					boxSizing: "border-box",
					mozBoxSizing: "border-box",
					webkitBoxSizing: "border-box"
				});
			}

			window.addEventListener('scroll', updatePinInContainer);
			window.addEventListener('resize', updatePinInContainer);
			window.addEventListener('resize', updateRelativePinSpacer);
			_pin.addEventListener("mousewheel", onMousewheelOverPin);
			_pin.addEventListener("DOMMouseScroll", onMousewheelOverPin);

			log(3, "added pin");

			updatePinState();

			return Scene;
		};

		this.removePin = function (reset) {
			if (_pin) {
				if (_state === SCENE_STATE_DURING) {
					updatePinState(true); 
				}
				if (reset || !_controller) { 
					var pinTarget = _pinOptions.spacer.firstChild; 
					if (pinTarget.hasAttribute(PIN_SPACER_ATTRIBUTE)) { 
						var
							style = _pinOptions.spacer.style,
							values = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"],
							margins = {};
						values.forEach(function (val) {
							margins[val] = style[val] || "";
						});
						_util.css(pinTarget, margins);
					}
					_pinOptions.spacer.parentNode.insertBefore(pinTarget, _pinOptions.spacer);
					_pinOptions.spacer.parentNode.removeChild(_pinOptions.spacer);
					if (!_pin.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) { 
						_util.css(_pin, _pin.___origStyle);
						delete _pin.___origStyle;
					}
				}
				window.removeEventListener('scroll', updatePinInContainer);
				window.removeEventListener('resize', updatePinInContainer);
				window.removeEventListener('resize', updateRelativePinSpacer);
				_pin.removeEventListener("mousewheel", onMousewheelOverPin);
				_pin.removeEventListener("DOMMouseScroll", onMousewheelOverPin);
				_pin = undefined;
				log(3, "removed pin (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};


		var
			_cssClasses,
			_cssClassElems = [];

		Scene
			.on("destroy.internal", function (e) {
				Scene.removeClassToggle(e.reset);
			});
		this.setClassToggle = function (element, classes) {
			var elems = _util.get.elements(element);
			if (elems.length === 0 || !_util.type.String(classes)) {
				log(1, "ERROR calling method 'setClassToggle()': Invalid " + (elems.length === 0 ? "element" : "classes") + " supplied.");
				return Scene;
			}
			if (_cssClassElems.length > 0) {
				Scene.removeClassToggle();
			}
			_cssClasses = classes;
			_cssClassElems = elems;
			Scene.on("enter.internal_class leave.internal_class", function (e) {
				var toggle = e.type === "enter" ? _util.addClass : _util.removeClass;
				_cssClassElems.forEach(function (elem, key) {
					toggle(elem, _cssClasses);
				});
			});
			return Scene;
		};

		this.removeClassToggle = function (reset) {
			if (reset) {
				_cssClassElems.forEach(function (elem, key) {
					_util.removeClass(elem, _cssClasses);
				});
			}
			Scene.off("start.internal_class end.internal_class");
			_cssClasses = undefined;
			_cssClassElems = [];
			return Scene;
		};

		construct();
		return Scene;
	};

	var SCENE_OPTIONS = {
		defaults: {
			duration: 0,
			offset: 0,
			triggerElement: undefined,
			triggerHook: 0.5,
			reverse: true,
			loglevel: 2
		},
		validate: {
			offset: function (val) {
				val = parseFloat(val);
				if (!_util.type.Number(val)) {
					throw ["Invalid value for option \"offset\":", val];
				}
				return val;
			},
			triggerElement: function (val) {
				val = val || undefined;
				if (val) {
					var elem = _util.get.elements(val)[0];
					if (elem && elem.parentNode) {
						val = elem;
					} else {
						throw ["Element defined in option \"triggerElement\" was not found:", val];
					}
				}
				return val;
			},
			triggerHook: function (val) {
				var translate = {
					"onCenter": 0.5,
					"onEnter": 1,
					"onLeave": 0
				};
				if (_util.type.Number(val)) {
					val = Math.max(0, Math.min(parseFloat(val), 1)); 
				} else if (val in translate) {
					val = translate[val];
				} else {
					throw ["Invalid value for option \"triggerHook\": ", val];
				}
				return val;
			},
			reverse: function (val) {
				return !!val; 
			},
			loglevel: function (val) {
				val = parseInt(val);
				if (!_util.type.Number(val) || val < 0 || val > 3) {
					throw ["Invalid value for option \"loglevel\":", val];
				}
				return val;
			}
		}, 
		shifts: ["duration", "offset", "triggerHook"], 
	};
	ScrollMagic.Scene.addOption = function (name, defaultValue, validationCallback, shifts) {
		if (!(name in SCENE_OPTIONS.defaults)) {
			SCENE_OPTIONS.defaults[name] = defaultValue;
			SCENE_OPTIONS.validate[name] = validationCallback;
			if (shifts) {
				SCENE_OPTIONS.shifts.push(name);
			}
		} else {
			ScrollMagic._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + name + "', because it already exists.");
		}
	};
	ScrollMagic.Scene.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Scene = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); 
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Scene, oldClass); 
		ScrollMagic.Scene.prototype = oldClass.prototype; 
		ScrollMagic.Scene.prototype.constructor = ScrollMagic.Scene; 
	};




	ScrollMagic.Event = function (type, namespace, target, vars) {
		vars = vars || {};
		for (var key in vars) {
			this[key] = vars[key];
		}
		this.type = type;
		this.target = this.currentTarget = target;
		this.namespace = namespace || '';
		this.timeStamp = this.timestamp = Date.now();
		return this;
	};


	var _util = ScrollMagic._util = (function (window) {
		var U = {},
			i;


		var floatval = function (number) {
			return parseFloat(number) || 0;
		};
		var _getComputedStyle = function (elem) {
			return elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem);
		};

		var _dimension = function (which, elem, outer, includeMargin) {
			elem = (elem === document) ? window : elem;
			if (elem === window) {
				includeMargin = false;
			} else if (!_type.DomElement(elem)) {
				return 0;
			}
			which = which.charAt(0).toUpperCase() + which.substr(1).toLowerCase();
			var dimension = (outer ? elem['offset' + which] || elem['outer' + which] : elem['client' + which] || elem['inner' + which]) || 0;
			if (outer && includeMargin) {
				var style = _getComputedStyle(elem);
				dimension += which === 'Height' ? floatval(style.marginTop) + floatval(style.marginBottom) : floatval(style.marginLeft) + floatval(style.marginRight);
			}
			return dimension;
		};
		var _camelCase = function (str) {
			return str.replace(/^[^a-z]+([a-z])/g, '$1').replace(/-([a-z])/g, function (g) {
				return g[1].toUpperCase();
			});
		};


		U.extend = function (obj) {
			obj = obj || {};
			for (i = 1; i < arguments.length; i++) {
				if (!arguments[i]) {
					continue;
				}
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						obj[key] = arguments[i][key];
					}
				}
			}
			return obj;
		};

		U.isMarginCollapseType = function (str) {
			return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(str) > -1;
		};

		var
			lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'];
		var _requestAnimationFrame = window.requestAnimationFrame;
		var _cancelAnimationFrame = window.cancelAnimationFrame;
		for (i = 0; !_requestAnimationFrame && i < vendors.length; ++i) {
			_requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			_cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
		}

		if (!_requestAnimationFrame) {
			_requestAnimationFrame = function (callback) {
				var
					currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!_cancelAnimationFrame) {
			_cancelAnimationFrame = function (id) {
				window.clearTimeout(id);
			};
		}
		U.rAF = _requestAnimationFrame.bind(window);
		U.cAF = _cancelAnimationFrame.bind(window);

		var
			loglevels = ["error", "warn", "log"],
			console = window.console || {};

		console.log = console.log || function () {}; 
		for (i = 0; i < loglevels.length; i++) {
			var method = loglevels[i];
			if (!console[method]) {
				console[method] = console.log; 
			}
		}
		U.log = function (loglevel) {
			if (loglevel > loglevels.length || loglevel <= 0) loglevel = loglevels.length;
			var now = new Date(),
				time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2) + ":" + ("00" + now.getMilliseconds()).slice(-3),
				method = loglevels[loglevel - 1],
				args = Array.prototype.splice.call(arguments, 1),
				func = Function.prototype.bind.call(console[method], console);
			args.unshift(time);
			func.apply(console, args);
		};


		var _type = U.type = function (v) {
			return Object.prototype.toString.call(v).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		};
		_type.String = function (v) {
			return _type(v) === 'string';
		};
		_type.Function = function (v) {
			return _type(v) === 'function';
		};
		_type.Array = function (v) {
			return Array.isArray(v);
		};
		_type.Number = function (v) {
			return !_type.Array(v) && (v - parseFloat(v) + 1) >= 0;
		};
		_type.DomElement = function (o) {
			return (
				typeof HTMLElement === "object" || typeof HTMLElement === "function" ? o instanceof HTMLElement || o instanceof SVGElement : 
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
			);
		};

		var _get = U.get = {};
		_get.elements = function (selector) {
			var arr = [];
			if (_type.String(selector)) {
				try {
					selector = document.querySelectorAll(selector);
				} catch (e) { 
					return arr;
				}
			}
			if (_type(selector) === 'nodelist' || _type.Array(selector) || selector instanceof NodeList) {
				for (var i = 0, ref = arr.length = selector.length; i < ref; i++) { 
					var elem = selector[i];
					arr[i] = _type.DomElement(elem) ? elem : _get.elements(elem); 
				}
			} else if (_type.DomElement(selector) || selector === document || selector === window) {
				arr = [selector]; 
			}
			return arr;
		};
		_get.scrollTop = function (elem) {
			return (elem && typeof elem.scrollTop === 'number') ? elem.scrollTop : window.pageYOffset || 0;
		};
		_get.scrollLeft = function (elem) {
			return (elem && typeof elem.scrollLeft === 'number') ? elem.scrollLeft : window.pageXOffset || 0;
		};
		_get.width = function (elem, outer, includeMargin) {
			return _dimension('width', elem, outer, includeMargin);
		};
		_get.height = function (elem, outer, includeMargin) {
			return _dimension('height', elem, outer, includeMargin);
		};

		_get.offset = function (elem, relativeToViewport) {
			var offset = {
				top: 0,
				left: 0
			};
			if (elem && elem.getBoundingClientRect) { 
				var rect = elem.getBoundingClientRect();
				offset.top = rect.top;
				offset.left = rect.left;
				if (!relativeToViewport) { 
					offset.top += _get.scrollTop();
					offset.left += _get.scrollLeft();
				}
			}
			return offset;
		};


		U.addClass = function (elem, classname) {
			if (classname) {
				if (elem.classList) {
					var classnameArr = classname.split(' ');
					for (var i = 0, max = classnameArr.length; i < max; i++) {
						elem.classList.add(classnameArr[i]);
					}
				} else {
					elem.className += ' ' + classname;
				}
			}
		};
		U.removeClass = function (elem, classname) {
			if (classname) {
				if (elem.classList) {
					var classnameArr = classname.split(' ');
					for (var i = 0, max = classnameArr.length; i < max; i++) {
						elem.classList.remove(classnameArr[i]);
					}
				} else {
					elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			}
		};
		U.css = function (elem, options) {
			if (_type.String(options)) {
				return _getComputedStyle(elem)[_camelCase(options)];
			} else if (_type.Array(options)) {
				var
					obj = {},
					style = _getComputedStyle(elem);
				options.forEach(function (option, key) {
					obj[option] = style[_camelCase(option)];
				});
				return obj;
			} else {
				for (var option in options) {
					var val = options[option];
					if (val == parseFloat(val)) { 
						val += 'px';
					}
					elem.style[_camelCase(option)] = val;
				}
			}
		};

		return U;
	}(window || {}));


	ScrollMagic.Scene.prototype.addIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}

	return ScrollMagic;
}));
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['ScrollMagic', 'TweenMax', 'TimelineMax'], factory);
	} else if (typeof exports === 'object') {
		require('gsap');
		factory(require('scrollmagic'), TweenMax, TimelineMax);
	} else {
		factory(root.ScrollMagic || (root.jQuery && root.jQuery.ScrollMagic), root.TweenMax || root.TweenLite, root.TimelineMax || root.TimelineLite);
	}
}(this, function (ScrollMagic, Tween, Timeline) {
	"use strict";
	var NAMESPACE = "animation.gsap";

	var
		console = window.console || {},
		err = Function.prototype.bind.call(console.error || console.log || function () {}, console);
	if (!ScrollMagic) {
		err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
	}
	if (!Tween) {
		err("(" + NAMESPACE + ") -> ERROR: TweenLite or TweenMax could not be found. Please make sure GSAP is loaded before ScrollMagic or use an asynchronous loader like requirejs.");
	}

	ScrollMagic.Scene.addOption(
		"tweenChanges", 
		false, 
		function (val) { 
			return !!val;
		}
	);
	ScrollMagic.Scene.extend(function () {
		var Scene = this,
			_tween;

		var log = function () {
			if (Scene._log) { 
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
				Scene._log.apply(this, arguments);
			}
		};

		Scene.on("progress.plugin_gsap", function () {
			updateTweenProgress();
		});
		Scene.on("destroy.plugin_gsap", function (e) {
			Scene.removeTween(e.reset);
		});

		var updateTweenProgress = function () {
			if (_tween) {
				var
					progress = Scene.progress(),
					state = Scene.state();
				if (_tween.repeat && _tween.repeat() === -1) {
					if (state === 'DURING' && _tween.paused()) {
						_tween.play();
					} else if (state !== 'DURING' && !_tween.paused()) {
						_tween.pause();
					}
				} else if (progress != _tween.progress()) { 
					if (Scene.duration() === 0) {
						if (progress > 0) { 
							_tween.play();
						} else { 
							_tween.reverse();
						}
					} else {
						if (Scene.tweenChanges() && _tween.tweenTo) {
							_tween.tweenTo(progress * _tween.duration());
						} else {
							_tween.progress(progress).pause();
						}
					}
				}
			}
		};

		Scene.setTween = function (TweenObject, duration, params) {
			var newTween;
			if (arguments.length > 1) {
				if (arguments.length < 3) {
					params = duration;
					duration = 1;
				}
				TweenObject = Tween.to(TweenObject, duration, params);
			}
			try {
				if (Timeline) {
					newTween = new Timeline({
							smoothChildTiming: true
						})
						.add(TweenObject);
				} else {
					newTween = TweenObject;
				}
				newTween.pause();
			} catch (e) {
				log(1, "ERROR calling method 'setTween()': Supplied argument is not a valid TweenObject");
				return Scene;
			}
			if (_tween) { 
				Scene.removeTween();
			}
			_tween = newTween;

			if (TweenObject.repeat && TweenObject.repeat() === -1) { 
				_tween.repeat(-1);
				_tween.yoyo(TweenObject.yoyo());
			}

			if (Scene.tweenChanges() && !_tween.tweenTo) {
				log(2, "WARNING: tweenChanges will only work if the TimelineMax object is available for ScrollMagic.");
			}

			if (_tween && Scene.controller() && Scene.triggerElement() && Scene.loglevel() >= 2) { 
				var
					triggerTweens = Tween.getTweensOf(Scene.triggerElement()),
					vertical = Scene.controller().info("vertical");
				triggerTweens.forEach(function (value, index) {
					var
						tweenvars = value.vars.css || value.vars,
						condition = vertical ? (tweenvars.top !== undefined || tweenvars.bottom !== undefined) : (tweenvars.left !== undefined || tweenvars.right !== undefined);
					if (condition) {
						log(2, "WARNING: Tweening the position of the trigger element affects the scene timing and should be avoided!");
						return false;
					}
				});
			}

			if (parseFloat(TweenLite.version) >= 1.14) { 
				var
					list = _tween.getChildren ? _tween.getChildren(true, true, false) : [_tween], 
					newCallback = function () {
					};
				for (var i = 0, thisTween, oldCallback; i < list.length; i++) {
					thisTween = list[i];
					if (oldCallback !== newCallback) { 
						oldCallback = thisTween.vars.onOverwrite;
						thisTween.vars.onOverwrite = function () {
							if (oldCallback) {
								oldCallback.apply(this, arguments);
							}
							newCallback.apply(this, arguments);
						};
					}
				}
			}
			log(3, "added tween");

			updateTweenProgress();
			return Scene;
		};

		Scene.removeTween = function (reset) {
			if (_tween) {
				if (reset) {
					_tween.progress(0).pause();
				}
				_tween.kill();
				_tween = undefined;
				log(3, "removed tween (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};

	});
}));















(function (global, factory) {
    global = global;
    global.WhyGalaxy = global.WhyGalaxy || {};
    global.WhyGalaxy.ScrollFixedGroup = factory(global);
})(this, function (global, isUndefined) {
    "use strict";

    var Component = (function () {
        var win = global,
            $ = win.jQuery,
            Util = win.WhyGalaxy.util,
            RESPONSIVE = win.WhyGalaxy.RESPONSIVE;
        function Component(container, args) {
            if (!(this instanceof Component)) {
                return new Component(container, args);
            }
            var defParams = {
                obj: container,
                dataAttr: {
                    duration: 'data-fixedgroup-duration',
                },
                resizeAttr: {
                    w: null,
                    h: null
                },
                customEvent: ".Component" + new Date().getTime(),
                resizeStart: null,
                viewType: null
            };
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Component.prototype = {
            init: function () {
                this.setElements();
                this.initOpts();
                this.bindEvents(true);
            },
            setElements: function () {
                this.components = this.obj.children();
                this.fixedItems = [];
            },
            initOpts: function () {
                this.opts.deviceHeight = win.innerHeight;
                this.componentsData = [];
                var prevDuration = 0;
                var durationSum = 0;
                for (let i = 0, max = this.components.length; i < max; i++) {
                    if (!this.components.eq(i).attr(this.opts.dataAttr.duration)) {
                        var newDuration = 100;
                    } else {
                        var newDuration = Number(this.components.eq(i).attr(this.opts.dataAttr.duration).split('%')[0]);
                    }
                    var newOpts = {};
                    var isLastItem = (i === this.components.length - 1) ? true : false;
                    var newFixedItem;
                    prevDuration = durationSum;
                    durationSum += newDuration;
                    newOpts.prevDuration = prevDuration;
                    newOpts.totalDuration = durationSum;
                    this.componentsData.push(newOpts);
                    newFixedItem = new CreateFixedItemScene(this.components.eq(i), {
                        newOpts : newOpts,
                        isLastItem : isLastItem
                    });
                    this.fixedItems.push(newFixedItem);

                    this.components[i].style.position = "relative";
                    this.components[i].style.zIndex = max - i;
                    if (i !== 0) {
                        this.changeMarginTopValue(i);
                    }
                }
            },
            changeMarginTopValue : function (idx) {
                if (Util.isDevice) {
                    this.components[idx].style.marginTop = ((this.componentsData[idx].prevDuration)/100 * -1 * win.innerHeight - win.innerHeight) + 'px';
                } else {
                    this.components[idx].style.marginTop = ((this.componentsData[idx].prevDuration + 100) * -1) + 'vh';
                }
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
                    $(win).off(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
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
                var winWidth = Util.winSize().w;
                if (Util.isDevice) {
                    if (this.opts.resizeAttr.w != winWidth) {
                        for (var i = 1, max = this.components.length; i < max; i++) {
                            this.changeMarginTopValue(i);
                        }
                        for (var i = 0, max = this.fixedItems.length; i < max; i++) {
                            this.fixedItems[i].onOrientationChange();
                        }
                    }
                } else {
                    for (var i = 0, max = this.fixedItems.length; i < max; i++) {
                        this.fixedItems[i].onResize();
                    }
                }
                this.opts.resizeAttr.w = winWidth;
            }
        };

        function CreateFixedItemScene(container, args) {
            if (!(this instanceof CreateFixedItemScene)) {
                return new CreateFixedItemScene(container, args);
            }
            var defParams = {
                obj: container,
                dataAttr: {
                    stickyTarget: 'data-fixedgroup-stickytarget',
                    slideTarget: 'data-fixedgroup-slidetarget'
                },
                defaultOpts : {
                    sceneOpts : {
                        triggerElement: null,
                        triggerHook: 0,
                        duration: null,
                        reverse: true
                    }
                },
                slideUpDuration : '50%',
                propsY : {
                    from : { y : 0 },
                    to : { y : -1 * win.innerHeight }
                },
                newOpts : null, 
                isLastItem : false,
                customEvent: ".CreateFixedItemScene" + new Date().getTime(),
                resizeStart: null,
                viewType: null
            };
            this.opts = Util.def(defParams, args || {});
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        CreateFixedItemScene.prototype = {
            init: function () {
                this.setElements();
                this.buildScrollMagic();
                if (!this.opts.isLastItem) {
                    this.buildSlideUpAnimation();
                    this.buildSlideUpTween();
                }         
            },
            setElements: function () {
                this.stickyTarget = this.obj.find('[' + this.opts.dataAttr.stickyTarget + ']');
                this.slideTarget = this.obj.find('[' + this.opts.dataAttr.slideTarget + ']');
                if (!this.stickyTarget.length) {
                    this.obj.children().wrapAll('<div class="js-fixedgroup-stickytarget"></div>');
                    this.stickyTarget = this.obj.find('.js-fixedgroup-stickytarget');
                }
                if (!this.slideTarget.length) {
                    this.slideTarget = this.stickyTarget;
                }
            },
            buildScrollMagic : function () {
                var triggerElement = this.obj.eq(0).get(0);
                var newOpts = this.opts.newOpts;
                Util.def(this, {
                    scrollmagic : {
                        controller : null,
                        scene : {},
                        stickyOpts : this.opts.defaultOpts,
                        slideOpts : this.opts.defaultOpts,
                        animOpts : this.opts.defaultOpts,
                        initOpts : $.proxy(function () {
                            if (newOpts.prevDuration !== 0) {
                                var animationDuration = (Util.isDevice)
                                         ? (newOpts.totalDuration - newOpts.prevDuration)/100 * win.innerHeight + "px"
                                         : (newOpts.totalDuration - newOpts.prevDuration) + "%";
                            } else {
                                var animationDuration = (Util.isDevice)
                                         ? newOpts.totalDuration/100 * win.innerHeight + "px"
                                         : newOpts.totalDuration + "%";
                            }
                            Util.def(this.scrollmagic.animOpts, {
                                sceneOpts : {
                                    triggerElement : triggerElement,
                                    duration : animationDuration,
                                    offset : this.scrollmagic.calcNewOffset('ANIMATION')
                                }
                            });
                            Util.def(this.scrollmagic.stickyOpts, {
                                sceneOpts : {
                                    triggerElement : triggerElement,
                                    duration : (Util.isDevice) ? newOpts.totalDuration/100 * win.innerHeight + "px"
                                                               : newOpts.totalDuration + "%"
                                },
                                stickyObj : this.stickyTarget.eq(0).get(0)
                            });
                            Util.def(this.scrollmagic.slideOpts, {
                                sceneOpts : {
                                    triggerElement : triggerElement,
                                    duration : this.opts.slideUpDuration,
                                    offset : this.scrollmagic.calcNewOffset('SLIDEUP')
                                }
                            });
                        }, this),
                        resetDurationPx : $.proxy(function () {
                            if (newOpts.prevDuration !== 0) {
                                var animationDuration = (newOpts.totalDuration - newOpts.prevDuration)/100 * win.innerHeight + "px";
                            } else {
                                var animationDuration = newOpts.totalDuration/100 * win.innerHeight + "px";
                            }
                            this.scrollmagic.animOpts.sceneOpts.duration = animationDuration;
                            this.scrollmagic.stickyOpts.sceneOpts.duration = newOpts.totalDuration/100 * win.innerHeight + "px";

                            if (this.scrollmagic.scene['STICKY']) {
                                this.scrollmagic.scene['STICKY'].duration(this.scrollmagic.stickyOpts.sceneOpts.duration);
                            }
                            if (this.scrollmagic.scene['ANIMATION']) {
                                this.scrollmagic.scene['ANIMATION'].duration(this.scrollmagic.animOpts.sceneOpts.duration);
                            }
                        }, this),
                        calcNewOffset : $.proxy(function (type) {
                            if (type === 'SLIDEUP') {
                                if (newOpts.totalDuration === undefined) return 0;
                                return newOpts.totalDuration/100 * win.innerHeight;
                            } else if (type === 'ANIMATION') {
                                if (newOpts.prevDuration === undefined) return 0;
                                return newOpts.prevDuration/100 * win.innerHeight;
                            }
                        }, this),
                        resetOffset : $.proxy(function (type) {
                            if (!this.scrollmagic.scene[type]) return;
                            var newOffset = this.scrollmagic.calcNewOffset(type);
                            this.scrollmagic.scene[type].offset(newOffset);
                        }, this),
                        changeTween : $.proxy(function (targetScene, newTween) {
                            targetScene.removeTween(true);
                            targetScene.setTween(newTween);
                        }, this),
                        buildScene : $.proxy(function () {
                            if (this.scrollmagic.controller == null) return;
                            this.scrollmagic.initOpts();
                            this.scrollmagic.scene.STICKY = new ScrollMagic.Scene(this.scrollmagic.stickyOpts.sceneOpts)
                                .setPin(this.scrollmagic.stickyOpts.stickyObj)
                                .addTo(this.scrollmagic.controller);

                            if (!this.opts.isLastItem) {
                                this.scrollmagic.scene.SLIDEUP = new ScrollMagic.Scene(this.scrollmagic.slideOpts.sceneOpts)
                                    .addTo(this.scrollmagic.controller);
                            }

                            this.scrollmagic.scene.ANIMATION = new ScrollMagic.Scene(this.scrollmagic.animOpts.sceneOpts)
                                .addTo(this.scrollmagic.controller);

                            this.obj.get(0).FIXED_ANIMATION_SCENE = this.scrollmagic.scene.ANIMATION;
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
            },
            buildSlideUpAnimation : function () {
                Util.def(this, {
                    animationY : {
                        props : this.opts.propsY,
                        resetProps : $.proxy(function () {
                            this.animationY.props.to.y = win.innerHeight * -1;
                        }, this),
                        y : $.proxy(function (animationTarget, props) {
                            TweenMax.to(animationTarget, 0.5, props)
                        }, this)
                    }
                });
            },
            buildSlideUpTween : function () {
                var _this = this;
                Util.def(this, {
                    tweens : {
                        instance : null,
                        updatedProps : null,
                        init : false,
                        destroy : $.proxy(function () {
                            if (this.tweens.instance === null) return;
                            this.tweens.instance.kill();
                            this.tweens.instance = null;
                        }, this),
                        reset : $.proxy(function () {
                            if (this.tweens.instance === null) return;
                            this.animationY.resetProps();
                            this.tweens.destroy();
                            this.tweens.build();
                        }, this),
                        deleteTweenID : function (prop) {
                            var scopeProp = Util.def({}, prop);
                            scopeProp._gsTweenID;
                            return scopeProp;
                        },
                        build : $.proxy(function () {
                            let timeline = new TimelineMax();
                            this.tweens.updatedProps = JSON.parse(JSON.stringify(this.animationY.props));
                            timeline.to(this.tweens.updatedProps.from, 1, Util.def(this.tweens.updatedProps.to, {
                                ease: Power2.easeOut,
                                onUpdate : function () {
                                    _this.animationY.y(_this.slideTarget, _this.tweens.deleteTweenID(_this.tweens.updatedProps.from));
                                }
                            }));
                            if (this.tweens.init) {
                                this.scrollmagic.scene.SLIDEUP.removeTween(true);
                            } else {
                                this.tweens.init = true;
                            }
                            this.scrollmagic.scene.SLIDEUP.setTween(timeline);
                            this.tweens.instances = timeline;
                        }, this)
                    }
                });
                this.tweens.build();
            },
            onResize : function () {
                if (!this.opts.isLastItem) {
                    this.tweens.reset();
                    this.scrollmagic.resetOffset('SLIDEUP');
                }
                this.scrollmagic.resetOffset('ANIMATION'); 
            },
            onOrientationChange : function () {
                this.scrollmagic.resetDurationPx();
                this.onResize();
            }
        };

        return Component;
    })();
    return Component;
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
                obj: ".wg-fixedgroup",
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
                    new win.WhyGalaxy.ScrollFixedGroup(this.obj.eq(i));
                }
            },
        };
        return new Component();
    })();
    return Component;
});