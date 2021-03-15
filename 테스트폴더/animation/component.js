var win = window;
var $ = win.jQuery;
var doc = win.document;
var Util = Utils;

function Component (container, args) {
    if (!(this instanceof Component)) {
        return new Component(container, args);
    }
    var defParams = {
        contentWrap : '.test-wrap',
        contentItem : '.test-item'
    };
    this.opts = Util.def(defParams, (args || {}));
    if (!(this.obj = $(container)).length) return;
    this.init();
};
Component.prototype = {
    init : function () {
        this.setElements();
        this.buildScrollMagic();
        this.buildTween();
    },
    setElements : function () {
        this.contentWrap = this.obj.find(this.opts.contentWrap);
        this.contentItem = this.contentWrap.find(this.opts.contentItem);
    },
    buildScrollMagic : function () {
        Util.def(this, {
            scrollmagic : {
                controller : null,
                opts : {
                    triggerElement : this.obj.get(0),
                    duration : '400%',
                    triggerHook : 0.5,
                    reverse : true
                },
                destroy : $.proxy(function () {
                    if (this.scrollmagic.controller == null) return;
                    this.scrollmagic.controller.destroy();
                }, this),
                build : $.proxy(function () {
                    this.scrollmagic.controller = new ScrollMagic.Controller();
                }, this)
            }
        });
        this.scrollmagic.build();
    },
    buildTween : function () {
        Util.def(this, {
            tweens : {
                instance : null,
                destroy : $.proxy(function () {
                    this.tweens.instance.kill();
                    this.contentWrap.css({
                        'opacity' : '',
                        'transform' : ''
                    });
                    this.tweens.instance = null
                }, this),
                build : $.proxy(function () {
                    var timeline = new TimelineMax();
                    timeline.fromTo(this.contentWrap, 1, {
                        opacity : 0,
                        x : 0
                    }, {
                        opacity : 1,
                        x : 300,
                        onComplete : $.proxy(function () {
                            console.log('1 onComplete');
                        }, this)
                    });
                    timeline.to(this.contentWrap, 1, {
                        y : -400,
                        onComplete : $.proxy(function () {
                            console.log('2 onComplete');
                        }, this)
                    });
                    timeline.to(this.contentWrap, 1, {
                        x : 800,
                        onComplete : $.proxy(function () {
                            console.log('3 onComplete');
                        }, this)
                    });
                    timeline.to(this.contentItem, 1, {
                        scale : 1.2,
                        onComplete : $.proxy(function () {
                            console.log('4 onComplete');
                        }, this)
                    });
                    timeline.to(this.contentWrap, 1, {
                        y : 0,
                        onComplete : $.proxy(function () {
                            console.log('5 onComplete');
                        }, this)
                    });

                    // scrollmagic
                    var scene = new ScrollMagic.Scene(this.scrollmagic.opts)
                        .setPin(this.obj.get(0))
                        .setTween(timeline)
                        .addTo(this.scrollmagic.controller);

                    this.tweens.instance = timeline;
                }, this)
            }
        });
        this.tweens.build();
    },
    destroy : function () {
        this.scrollmagic.destroy();
        this.tweens.destroy();
    }
};

(function (global, factory) {
    $(function () {
        factory();
    });
}(this, function () {
    var Call = (function (isUndefined) {
        function Call (args) {
            var defParams = {
                obj : '.test-section'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Call.prototype = {
            init : function () {
                this.callComponent();
            },
            callComponent : function () {
                var _this = this;
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    (function (index) {
                        new Component(_this.obj.eq(index));
                    })(i);
                }
            }
        };
        return new Call();
    })();
    return Call;
}));

function Component2 (container, args) {
    if (!(this instanceof Component2)) {
        return new Component2(container, args);
    }
    var defParams = {
        contentWrap : '.test-wrap',
        contentItem : '.test-item'
    };
    this.opts = Util.def(defParams, (args || {}));
    if (!(this.obj = $(container)).length) return;
    this.init();
};
Component2.prototype = {
    init : function () {
        this.setElements();
        this.buildScrollMagic();
        this.buildAnimation();
        this.buildTween();
    },
    setElements : function () {
        this.contentWrap = this.obj.find(this.opts.contentWrap);
        this.contentItem = this.contentWrap.find(this.opts.contentItem);
    },
    buildScrollMagic : function () {
        Util.def(this, {
            scrollmagic : {
                controller : null,
                opts : {
                    triggerElement : this.obj.get(0),
                    duration : '400%',
                    triggerHook : 0.5,
                    reverse : true
                },
                destroy : $.proxy(function () {
                    if (this.scrollmagic.controller == null) return;
                    this.scrollmagic.controller.destroy();
                }, this),
                build : $.proxy(function () {
                    this.scrollmagic.controller = new ScrollMagic.Controller();
                }, this)
            }
        });
        this.scrollmagic.build();
    },
    buildAnimation : function () {
        Util.def(this, {
            animation : {
                props : {
                    1 : {
                        from : {
                            opacity : 0,
                            x : 0
                        },
                        to : {
                            opacity : 1,
                            x : 300
                        }
                    },
                    2 : {
                        from : {
                            y : 0
                        },
                        to : {
                            y : -400
                        }
                    },
                    3 : {
                        from : {
                            x : 300
                        },
                        to : {
                            x : 800
                        }
                    },
                    4 : {
                        from : {
                            scale : 1
                        },
                        to : {
                            scale : 1.2
                        }
                    },
                    5 : {
                        from : {
                            y : -400
                        },
                        to : {
                            y : 0
                        }
                    }
                },
                destroy : $.proxy(function () {
                    this.contentItem.css({
                        'opacity' : '',
                        'transform' : ''
                    });
                    this.contentWrap.css({
                        'opacity' : '',
                        'transform' : ''
                    });
                }, this),
                scale : $.proxy(function (prop) {
                    TweenLite.to(this.contentItem, .3, prop);
                }, this),
                y : $.proxy(function (prop) {
                    TweenLite.to(this.contentWrap, .3, prop);
                }, this),
                x : $.proxy(function (prop) {
                    TweenLite.to(this.contentWrap, .3, prop);
                }, this)
            }
        });
    },
    buildTween : function () {
        Util.def(this, {
            tweens : {
                instance : null,
                destroy : $.proxy(function () {
                    this.tweens.instance.kill();
                    this.tweens.instance = null
                }, this),
                deleteTweenID : function (prop) {
                    var scopeProp = Util.def({}, prop);
                    scopeProp._gsTweenID;
                    return scopeProp;
                },
                build : $.proxy(function () {
                    var timeline = new TimelineMax();
                    timeline.to(this.animation.props['1'].from, 1, Util.def(this.animation.props['1'].to, {
                        onUpdate : $.proxy(function () {
                            this.animation.x(this.tweens.deleteTweenID(this.animation.props['1'].from));
                        }, this),
                        onComplete : $.proxy(function () {
                            console.log('1 onComplete');
                        }, this)
                    }));
                    timeline.to(this.animation.props['2'].from, 1, Util.def(this.animation.props['2'].to, {
                        onUpdate : $.proxy(function () {
                            this.animation.y(this.tweens.deleteTweenID(this.animation.props['2'].from));
                        }, this),
                        onComplete : $.proxy(function () {
                            console.log('2 onComplete');
                        }, this)
                    }));
                    timeline.to(this.animation.props['3'].from, 1, Util.def(this.animation.props['3'].to, {
                        onUpdate : $.proxy(function () {
                            this.animation.x(this.tweens.deleteTweenID(this.animation.props['3'].from));
                        }, this),
                        onComplete : $.proxy(function () {
                            console.log('3 onComplete');
                        }, this)
                    }));
                    timeline.to(this.animation.props['4'].from, 1, Util.def(this.animation.props['4'].to, {
                        onUpdate : $.proxy(function () {
                            this.animation.scale(this.tweens.deleteTweenID(this.animation.props['4'].from));
                        }, this),
                        onComplete : $.proxy(function () {
                            console.log('4 onComplete');
                        }, this)
                    }));
                    timeline.to(this.animation.props['5'].from, 1, Util.def(this.animation.props['5'].to, {
                        onUpdate : $.proxy(function () {
                            this.animation.y(this.tweens.deleteTweenID(this.animation.props['5'].from));
                        }, this),
                        onComplete : $.proxy(function () {
                            console.log('5 onComplete');
                        }, this)
                    }));

                    // scrollmagic
                    var scene = new ScrollMagic.Scene(this.scrollmagic.opts)
                        .setPin(this.obj.get(0))
                        .setTween(timeline)
                        .addTo(this.scrollmagic.controller);

                    this.tweens.instance = timeline;
                }, this)
            }
        });
        this.tweens.build();
    },
    destroy : function () {
        this.scrollmagic.destroy();
        this.animation.destroy();
        this.tweens.destroy();
    }
};

(function (global, factory) {
    $(function () {
        factory();
    });
}(this, function () {
    var Call = (function (isUndefined) {
        function Call (args) {
            var defParams = {
                obj : '.test-section2'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Call.prototype = {
            init : function () {
                this.callComponent();
            },
            callComponent : function () {
                var _this = this;
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    (function (index) {
                        new Component2(_this.obj.eq(index));
                    })(i);
                }
            }
        };
        return new Call();
    })();
    return Call;
}));

function Component3 (container, args) {
    if (!(this instanceof Component3)) {
        return new Component3(container, args);
    }
    var defParams = {
        contentWrap : '.img-wrap'
    };
    this.opts = Util.def(defParams, (args || {}));
    if (!(this.obj = $(container)).length) return;
    this.init();
};
Component3.prototype = {
    init : function () {
        this.setElements();
        this.buildScrollMagic();
        this.buildAnimation();
        this.buildTween();
    },
    setElements : function () {
        this.contentWrap = this.obj.find(this.opts.contentWrap);
    },
    buildScrollMagic : function () {
        Util.def(this, {
            scrollmagic : {
                controller : null,
                opts : {
                    triggerElement : this.obj.get(0),
                    duration : '400%',
                    triggerHook : 0,
                    reverse : true
                },
                destroy : $.proxy(function () {
                    if (this.scrollmagic.controller == null) return;
                    this.scrollmagic.controller.destroy();
                }, this),
                build : $.proxy(function () {
                    this.scrollmagic.controller = new ScrollMagic.Controller();
                }, this)
            }
        });
        this.scrollmagic.build();
    },
    buildAnimation : function () {
        this.textStyle = window.getComputedStyle(this.contentWrap[0]);
        this.textFamily = this.textStyle.fontFamily;
        this.textSize = '200px';
        this.bgColor = '#000';
        this.xOffset = 80;
        Util.def(this, {
            animation : {
                props : {
                    from : {
                        scale : 400
                    },
                    to : {
                        scale : 1
                    }
                },
                text : 'display',
                position : {
                    set : $.proxy(function () {
                        var winWidth = Util.winSize().w;
                        var winHeight = Util.winSize().h;
                        var domContentCanvas = this.contentCanvas[0];
                        this.cvWidth = winWidth;
                        this.cvHeight = winHeight;
                        this.txtX = this.cvWidth / 2;
                        this.txtY = this.cvHeight / 2;
                        domContentCanvas.width = winWidth;
                        domContentCanvas.height = winHeight;
                    }, this)
                },
                draw : $.proxy(function () {
                    this.canvasContext.beginPath();
                    this.canvasContext.fillStyle = this.bgColor;
                    this.canvasContext.rect(0, 0, this.cvWidth, this.cvHeight);
                    this.canvasContext.fill();
                    this.canvasContext.globalCompositeOperation = "xor";
                    this.canvasContext.beginPath();
                    this.canvasContext.font = "bold " + this.textSize + " " +  this.textFamily;
                    this.canvasContext.textBaseline = "middle";
                    this.canvasContext.textAlign = "center";
                    this.canvasContext.fillText(this.animation.text, this.txtX, this.txtY);
                    this.canvasContext.fill();
                }, this),
                update : $.proxy(function (progress) {
                    var xOffset = this.xOffset * (1 - progress);
                    this.txtScale = this.animation.props.from.scale;
                    this.newX = this.txtScale * ((this.cvWidth + xOffset) / 2) - (this.cvWidth + xOffset) / 2;
                    this.newY = this.txtScale * (this.cvHeight / 2) - this.cvHeight / 2;
                    this.canvasContext.clearRect(0, 0, this.cvWidth, this.cvHeight);
                    this.canvasContext.save();
                    this.canvasContext.translate(-this.newX, -this.newY);
                    this.canvasContext.scale(this.txtScale, this.txtScale);
                    this.animation.draw();
                    this.canvasContext.restore();
                }, this),
                build : $.proxy(function () {
                    this.animation.props.default = Util.def({}, this.animation.props.from);
                    this.contentWrap.after('<canvas/>');
                    this.contentCanvas = this.contentWrap.next();
                    this.canvasContext = this.contentCanvas[0].getContext('2d');
                    this.contentCanvas.css({
                        'position' : 'relative',
                        'zIndex' : 10
                    })
                    this.animation.position.set();
                }, this)
            }
        });
        this.animation.build();
    },
    buildTween : function () {
        var _this = this;
        Util.def(this, {
            tweens : {
                instance : null,
                destroy : $.proxy(function () {
                    this.tweens.instance.kill();
                    this.tweens.instance = null
                }, this),
                deleteTweenID : function (prop) {
                    var scopeProp = Util.def({}, prop);
                    scopeProp._gsTweenID;
                    return scopeProp;
                },
                build : $.proxy(function () {
                    var timeline = new TimelineMax();
                    timeline.to(this.animation.props.from, 1, Util.def(this.animation.props.to, {
                        onUpdate : function () {
                            // this.animation.update(this.tweens.deleteTweenID(this.animation.props.from));
                            _this.animation.update(this._time);
                        },
                        onComplete : $.proxy(function () {
                            console.log('1 onComplete');
                        }, this)
                    }));

                    // scrollmagic
                    var scene = new ScrollMagic.Scene(this.scrollmagic.opts)
                        .setPin(this.obj.get(0))
                        .setTween(timeline)
                        .addTo(this.scrollmagic.controller);

                    this.tweens.instance = timeline;
                }, this)
            }
        });
        this.tweens.build();
    },
    destroy : function () {
        this.scrollmagic.destroy();
        this.tweens.destroy();
    }
};

(function (global, factory) {
    $(function () {
        factory();
    });
}(this, function () {
    var Call = (function (isUndefined) {
        function Call (args) {
            var defParams = {
                obj : '.test-section3'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Call.prototype = {
            init : function () {
                this.callComponent();
            },
            callComponent : function () {
                var _this = this;
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    (function (index) {
                        new Component3(_this.obj.eq(index));
                    })(i);
                }
            }
        };
        return new Call();
    })();
    return Call;
}));

function Component4 (container, args) {
    if (!(this instanceof Component4)) {
        return new Component4(container, args);
    }
    var defParams = {
        contentWrap : '.img-wrap'
    };
    this.opts = Util.def(defParams, (args || {}));
    if (!(this.obj = $(container)).length) return;
    this.init();
};
Component4.prototype = {
    init : function () {
        this.setElements();
        this.buildScrollMagic();
        this.buildAnimation();
        this.buildTween();
    },
    setElements : function () {
        this.contentWrap = this.obj.find(this.opts.contentWrap);
    },
    buildScrollMagic : function () {
        Util.def(this, {
            scrollmagic : {
                controller : null,
                opts : {
                    triggerElement : this.obj.get(0),
                    duration : '400%',
                    triggerHook : 0,
                    reverse : true
                },
                destroy : $.proxy(function () {
                    if (this.scrollmagic.controller == null) return;
                    this.scrollmagic.controller.destroy();
                }, this),
                build : $.proxy(function () {
                    this.scrollmagic.controller = new ScrollMagic.Controller();
                }, this)
            }
        });
        this.scrollmagic.build();
    },
    buildAnimation : function () {
        var _this = this;
        this.textStyle = window.getComputedStyle(this.contentWrap[0]);
        this.textFamily = this.textStyle.fontFamily;
        this.textSize = '200px';
        this.bgColor = '#000';
        this.xOffset = 80;
        Util.def(this, {
            animation : {
                props : {
                    from : {
                        scale : 400
                    },
                    to : {
                        scale : 1
                    }
                },
                timeline : null,
                text : 'display',
                position : {
                    set : $.proxy(function () {
                        var winWidth = Util.winSize().w;
                        var winHeight = Util.winSize().h;
                        var domContentCanvas = this.contentCanvas[0];
                        this.cvWidth = winWidth;
                        this.cvHeight = winHeight;
                        this.txtX = this.cvWidth / 2;
                        this.txtY = this.cvHeight / 2;
                        domContentCanvas.width = winWidth;
                        domContentCanvas.height = winHeight;
                    }, this)
                },
                draw : $.proxy(function () {
                    this.canvasContext.beginPath();
                    this.canvasContext.fillStyle = this.bgColor;
                    this.canvasContext.rect(0, 0, this.cvWidth, this.cvHeight);
                    this.canvasContext.fill();
                    this.canvasContext.globalCompositeOperation = "xor";
                    this.canvasContext.beginPath();
                    this.canvasContext.font = "bold " + this.textSize + " " +  this.textFamily;
                    this.canvasContext.textBaseline = "middle";
                    this.canvasContext.textAlign = "center";
                    this.canvasContext.fillText(this.animation.text, this.txtX, this.txtY);
                    this.canvasContext.fill();
                }, this),
                update : $.proxy(function (prop, progress) {
                    var _this = this;
                    if (this.animation.timeline != null) {
                        this.animation.timeline.kill();
                    }
                    this.animation.timeline = TweenLite.to(this.animation.props.default, .3, Util.def(prop, {
                        onUpdate : function () {
                            var xOffset = _this.xOffset * (1 - progress);
                            _this.txtScale = _this.animation.props.default.scale;
                            // console.log(this.animation.timeline);
                            // console.log(_this.txtScale, (prop.scale * this._time));
                            // console.log((prop.scale * this._time));
                            _this.newX = _this.txtScale * ((_this.cvWidth + xOffset) / 2) - (_this.cvWidth + xOffset) / 2;
                            _this.newY = _this.txtScale * (_this.cvHeight / 2) - _this.cvHeight / 2;
                            _this.canvasContext.clearRect(0, 0, _this.cvWidth, _this.cvHeight);
                            _this.canvasContext.save();
                            _this.canvasContext.translate(-_this.newX, -_this.newY);
                            _this.canvasContext.scale(_this.txtScale, _this.txtScale);
                            _this.animation.draw();
                            _this.canvasContext.restore();
                        }
                    }));
                    // TweenLite.to({}, 1, {
                    //     onUpdate : $.proxy(function () {
                    //     }, this)
                    // });
                }, this),
                build : $.proxy(function () {
                    this.animation.props.default = Util.def({}, this.animation.props.from);
                    this.contentWrap.after('<canvas/>');
                    this.contentCanvas = this.contentWrap.next();
                    this.canvasContext = this.contentCanvas[0].getContext('2d');
                    this.contentCanvas.css({
                        'position' : 'relative',
                        'zIndex' : 10
                    })
                    this.animation.position.set();
                }, this)
            }
        });
        this.animation.build();
    },
    buildTween : function () {
        var _this = this;
        Util.def(this, {
            tweens : {
                instance : null,
                destroy : $.proxy(function () {
                    this.tweens.instance.kill();
                    this.tweens.instance = null
                }, this),
                deleteTweenID : function (prop) {
                    var scopeProp = Util.def({}, prop);
                    scopeProp._gsTweenID;
                    return scopeProp;
                },
                build : $.proxy(function () {
                    var timeline = new TimelineMax();
                    timeline.to(this.animation.props.from, 1, Util.def(this.animation.props.to, {
                        onUpdate : function () {
                            _this.animation.update(_this.tweens.deleteTweenID(_this.animation.props.from), this._time);
                            // _this.animation.update(this._time);
                        },
                        onComplete : $.proxy(function () {
                            console.log('1 onComplete');
                        }, this)
                    }));

                    // scrollmagic
                    var scene = new ScrollMagic.Scene(this.scrollmagic.opts)
                        .setPin(this.obj.get(0))
                        .setTween(timeline)
                        .addTo(this.scrollmagic.controller);

                    this.tweens.instance = timeline;
                }, this)
            }
        });
        this.tweens.build();
    },
    destroy : function () {
        this.scrollmagic.destroy();
        this.tweens.destroy();
    }
};

(function (global, factory) {
    $(function () {
        factory();
    });
}(this, function () {
    var Call = (function (isUndefined) {
        function Call (args) {
            var defParams = {
                obj : '.test-section4'
            };
            this.opts = Util.def(defParams, (args || {}));
            if (!(this.obj = $(this.opts.obj)).length) return;
            this.init();
        }
        Call.prototype = {
            init : function () {
                this.callComponent();
            },
            callComponent : function () {
                var _this = this;
                for (var i = 0, max = this.obj.length; i < max; i++) {
                    (function (index) {
                        new Component4(_this.obj.eq(index));
                    })(i);
                }
            }
        };
        return new Call();
    })();
    return Call;
}));