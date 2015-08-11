var Effect = new Class({
    resourceType: null,
    baseSettings: [
        {
            name: 'Delay',
            key: 'base_delay',
            type: 'range',
            range: [0,30,0.1],
            default: 0
        },
        {
            name: 'Repeat Times',
            key: 'base_repeat_times',
            type: 'range',
            range: [0,100,1],
            default: 0
        },
        {
            name: 'Repeat Delay',
            key: 'base_repeat_delay',
            type: 'range',
            range: [0,10,0.01],
            default: 0
        }
    ],
    initialize: function(options){
        if (this.resourceType === null){
            console.error('Failed to specify a resource type for effect!');
        }
        this.options = options;
        this.resourceClass = Resources.types[options.resource.type];
        this.resource = new this.resourceClass(this.resourceType, options.resource);
    },
    handleTrigger: function() {
        // Delay if necessary
        setTimeout(function() {
            this.trigger();

            if (this.options.base_repeat_times) {
                var timesLeft = this.options.base_repeat_times

                var interval = setInterval(function(){
                    this.trigger();

                    timesLeft--;
                    if (timesLeft === 0)
                        clearInterval(interval);
                }.bind(this), this.options.base_repeat_delay * 1000);
            }
        }.bind(this), this.options.base_delay * 1000);
    },
    trigger: function() {
        console.error('Failed to specify an activation for effect!');
    }
});

Effects = {
    types: {
        SOUND: new Class({
            Extends: Effect,
            resourceType: 'SOUND',
            name: 'Play Sound',
            settings: [
                {
                    name: 'Volume',
                    key: 'volume',
                    type: 'range',
                    range: [0,100,1],
                    default: 100
                }
            ],
            initialize: function(options){
                this.parent(options);
                this.sound = null;
                this.volume = (this.options.volume || 100) / 100;
            },
            trigger: function() {
                if (this.sound) {
                    this.sound.currentTime = 0;
                    this.sound.pause();
                }

                this.sound = this.resource.generate();
                this.sound.volume = this.volume;
                this.sound.play();
            }
        }),
        ANIMATION_FIREWORK: new Class({
            Extends: Effect,
            resourceType: 'IMAGE',
            name: 'Animation - Firework',
            settings: [
                {
                    name: 'Scale',
                    key: 'scale',
                    type: 'range',
                    range: [0,5,0.01],
                    default: 1
                },
                {
                    name: 'Particles',
                    key: 'intensity',
                    type: 'range',
                    range: [0,1000,1],
                    default: 100
                },
                {
                    name: 'Force',
                    key: 'force',
                    type: 'range',
                    range: [0.5,5,0.01],
                    default: 1
                }
            ],
            initialize: function(options){
                this.parent(options);
            },
            trigger: function() {

                var minX = Stage.screen.width / 6;
                var maxX = Stage.screen.width*5 / 6;
                var minY = Stage.screen.height / 6;
                var maxY = Stage.screen.height*5 / 6;

                var location = {
                    x: parseInt(Math.random() * (maxX-minX)) + minX,
                    y: parseInt(Math.random() * (maxY-minY)) + minY
                };

                var particleCount = this.options.intensity;

                for (var p=0; p < particleCount; ++p) {
                    var asset = this.resource.generate();

                    if (this.options.scale)
                        asset.scale = {x:this.options.scale, y:this.options.scale};

                    new Particles.types.firework(asset, {
                        x: location.x,
                        y: location.y,
                        force: this.options.force
                    });
                }
            }
        }),
        ANIMATION_EMITTER: new Class({
            Extends: Effect,
            resourceType: 'IMAGE',
            name: 'Animation - Emitter',
            settings: [
                {
                    name: 'Scale',
                    key: 'scale',
                    type: 'range',
                    range: [0,5,0.01],
                    default: 1
                },
                {
                    name: 'Particles / Second',
                    key: 'particles_per_second',
                    type: 'range',
                    range: [0,1000,1],
                    default: 100
                },
                {
                    name: 'Time',
                    key: 'time_seconds',
                    type: 'range',
                    range: [0,10,.1],
                    default: 1
                },
                {
                    name: 'Force',
                    key: 'force',
                    type: 'range',
                    range: [0.5,5,0.01],
                    default: 1
                }
            ],
            initialize: function(options){
                this.parent(options);
            },
            trigger: function() {
                var minX = Stage.screen.width / 4;
                var maxX = Stage.screen.width*3 / 4;
                var minY = Stage.screen.height / 4;
                var maxY = Stage.screen.height*3 / 4;

                var location = {
                    x: parseInt(Math.random() * (maxX-minX)) + minX,
                    y: parseInt(Math.random() * (maxY-minY)) + minY
                };

                var intervalTime = 1000 / this.options.particles_per_second;
                var particleCount = this.options.intensity;

                var generateParticle = function() {
                    var asset = this.resource.generate();

                    if (this.options.scale)
                        asset.scale = {x:this.options.scale, y:this.options.scale};

                    new Particles.types.firework(asset, {
                        x: location.x,
                        y: location.y,
                        force: this.options.force
                    });
                }.bind(this);

                var interval = setInterval(generateParticle, intervalTime);

                setTimeout(
                    function(){ 
                        clearInterval(interval); 
                    }, 
                    1000 * this.options.time_seconds
                );
            }
        }),
        ANIMATION_ZOOM: new Class({
            Extends: Effect,
            resourceType: 'IMAGE',
            name: 'Animation - Zoom in',
            settings: [
                {
                    name: 'Zoom in time',
                    key: 'zoom_in_time',
                    type: 'range',
                    range: [0,10,0.1],
                    default: 2
                },
                {
                    name: 'Hold time',
                    key: 'hold_time',
                    type: 'range',
                    range: [0,10,0.1],
                    default: 0
                },
                {
                    name: 'Fade time',
                    key: 'fade_time',
                    type: 'range',
                    range: [0,10,0.1],
                    default: 1
                },
                {
                    name: 'Scale',
                    key: 'scale',
                    type: 'range',
                    range: [0,5,0.01],
                    default: 1
                },
                {
                    name: 'Position',
                    key: 'position',
                    type: 'options',
                    options: [
                        { name: 'Top Left', value: 'TOP_RIGHT' },
                        { name: 'Top Center', value: 'TOP_CENTER' },
                        { name: 'Top Right', value: 'TOP_RIGHT' },
                        { name: 'Middle Left', value: 'MIDDLE_LEFT' },
                        { name: 'Center', value: 'MIDDLE_CENTER' },
                        { name: 'Middle Right', value: 'MIDDLE_RIGHT' },
                        { name: 'Bottom Left', value: 'BOTTOM_RIGHT' },
                        { name: 'Bottom Center', value: 'BOTTOM_CENTER' },
                        { name: 'Bottom Right', value: 'BOTTOM_RIGHT' },
                        { name: 'Random', value: 'RANDOM' },
                    ],
                    default: 'MIDDLE_CENTER'
                },
                {
                    name: 'Margin',
                    key: 'distance',
                    type: 'range',
                    range: [0,100,1],
                    default: 10
                }
            ],
            initialize: function(options){
                this.parent(options);

                var x, y;
                var distance = this.options.distance;
                if (this.options.position === 'RANDOM') {
                    this.position = function(resource){
                        var minX = distance + resource.width/2;
                        var maxX = Stage.screen.width - minX;
                        var minY = distance + resource.height/2;
                        var maxY = Stage.screen.height - minY;

                        return {
                            x: parseInt(Math.random() * (maxX-minX)) + minX,
                            y: parseInt(Math.random() * (maxY-minY)) + minY
                        };
                    }
                } else {
                    var location_parts = this.options.position.split('_');
                    var yString = location_parts[0];
                    var xString = location_parts[1];

                    this.position = function(resource){
                        // X
                        if (xString === 'CENTER') {
                            x = Stage.screen.width/2;
                        }
                        else if (xString === 'RIGHT') {
                            x = Stage.screen.width - distance - resource.width/2;
                        }
                        else if (xString === 'LEFT') {
                            x = distance + resource.width/2;
                        }

                        // Y
                        if (yString === 'MIDDLE') {
                            y = Stage.screen.height/2;
                        }
                        else if (yString === 'TOP') {
                            y = distance + resource.height/2;
                        }
                        else if (yString === 'BOTTOM') {
                            y = Stage.screen.height - distance - resource.height/2;
                        }

                        return {
                            x: x,
                            y: y
                        };
                    }
                }
            },
            trigger: function() {
                var asset = this.resource.generate();

                asset.scale = { x:this.options.scale*0.1, y:this.options.scale*0.1 };
                asset.alpha = 0;

                var position = this.position(asset);

                var particle = new Particles.types.tween(asset, {
                    x: position.x,
                    y: position.y
                });

                var zoomInScale = this.options.scale * (1 + 0.9 * this.options.fade_time / this.options.zoom_in_time);
                var self = this;
                particle.tween({scale: {x:this.options.scale, y:this.options.scale}, alpha: 1}, this.options.zoom_in_time, function(){
                    var zoomOut = function(){
                        particle.tween({scale: {x:zoomInScale, y:zoomInScale}, alpha: 0}, self.options.fade_time, function(){
                            particle.destroy();
                        });
                    };
                    if (self.options.hold_time)
                        setTimeout(zoomOut, self.options.hold_time * 1000);
                    else
                        zoomOut();
                });
            }
        }),
        ANIMATION_SCROLL: new Class({
            Extends: Effect,
            resourceType: 'IMAGE',
            name: 'Animation - Scroll',
            settings: [
                {
                    name: 'Scroll Time/Speed',
                    key: 'scroll_time',
                    type: 'range',
                    range: [0.1,30,0.1],
                    default: 3
                },
                {
                    name: 'Scroll Unit',
                    key: 'scroll_unit',
                    type: 'options',
                    options: [
                        { name: 'Time', value: 'TIME' },
                        { name: 'Speed', value: 'SPEED' },
                    ],
                    default: 'SPEED'
                },
                {
                    name: 'Side',
                    key: 'side',
                    type: 'options',
                    options: [
                        { name: 'Left → Right', value: 'LEFT_TO_RIGHT' },
                        { name: 'Left ⇄ Right', value: 'RANDOM_LEFT_RIGHT' },
                        { name: 'Left ← Right', value: 'RIGHT_TO_LEFT' },
                        { name: 'Top → Bottom', value: 'TOP_TO_BOTTOM' },
                        { name: 'Top ⇄ Bottom', value: 'RANDOM_TOP_BOTTOM' },
                        { name: 'Top ← Bottom', value: 'BOTTOM_TO_TOP' },
                        { name: 'Random', value: 'RANDOM' },
                    ],
                    default: 'LEFT_TO_RIGHT'
                },
                {
                    name: 'Position',
                    key: 'position',
                    type: 'options',
                    options: [
                        { name: 'Middle', value: 'MIDDLE' },
                        { name: 'Top/Left', value: 'TOP_OR_LEFT' },
                        { name: 'Bottom/Right', value: 'BOTTOM_OR_RIGHT' },
                        { name: 'Random', value: 'RANDOM' },
                    ],
                    default: 'LEFT_TO_RIGHT'
                },
                {
                    name: 'Margin',
                    key: 'margin',
                    type: 'range',
                    range: [0,100,1],
                    default: 10
                },
                {
                    name: 'Flip',
                    key: 'flip',
                    type: 'check',
                    default: true
                },
                {
                    name: 'Rotate',
                    key: 'rotate',
                    type: 'check',
                    default: true
                },
                {
                    name: 'Spin',
                    key: 'spin',
                    type: 'range',
                    range: [-720,720,1],
                    default: 0
                },
                {
                    name: 'Scale',
                    key: 'scale',
                    type: 'range',
                    range: [0,5,0.01],
                    default: 1
                }
            ],
            initialize: function(options){
                this.parent(options);
            },
            trigger: function() {
                var asset = this.resource.generate();
                asset.scale = { x:this.options.scale, y:this.options.scale };

                var side;
                switch (this.options.side) {
                    case 'LEFT_TO_RIGHT':
                        side = 'LEFT'; break;
                    case 'RIGHT_TO_LEFT':
                        side = 'RIGHT'; break;
                    case 'TOP_TO_BOTTOM':
                        side = 'TOP'; break;
                    case 'BOTTOM_TO_TOP':
                        side = 'BOTTOM'; break;
                    case 'RANDOM_LEFT_RIGHT':
                        side = _.sample(['LEFT', 'RIGHT'], 1)[0]; break;
                    case 'RANDOM_TOP_BOTTOM':
                        side = _.sample(['TOP', 'BOTTOM'], 1)[0]; break;
                    case 'RANDOM':
                        side = _.sample(['LEFT', 'RIGHT', 'TOP', 'BOTTOM'], 1)[0]; break;
                }

                var position = { x: null, y: null };
                var tween = { x: null, y: null };

                var size;
                if ((side === 'TOP' || side === 'BOTTOM') && !this.options.rotate) {
                    size = asset.height/2;
                } else {
                    size = asset.width/2;
                }

                if (side === 'LEFT') {
                    position.x = -asset.width/2;
                    tween.x = Stage.screen.width + asset.width/2;
                }
                else if (side === 'RIGHT') {
                    position.x = Stage.screen.width + asset.width/2;
                    tween.x = -asset.width/2;

                    if (this.options.flip)
                        asset.scale.x *= -1;
                }
                else if (side === 'TOP') {
                    if (this.options.rotate)
                        asset.rotation = Math.PI/2;

                    if (this.options.flip && this.options.position === 'BOTTOM_OR_RIGHT')
                        asset.scale.y *= -1;

                    position.y = -size;
                    tween.y = Stage.screen.height + size;
                }
                else if (side === 'BOTTOM') {
                    if (this.options.rotate)
                        asset.rotation = -Math.PI/2;

                    if (this.options.flip)
                        asset.scale.x *= -1;

                    position.y = Stage.screen.height + size;
                    tween.y = -size;
                }

                var side_margin = this.options.margin;
                var side_range;
                var side_var;
                if (side === 'LEFT' || side === 'RIGHT') {
                    side_var = 'y';
                    side_range = Stage.screen.height;
                    side_margin += asset.height / 2;
                } 
                else if (side === 'TOP' || side === 'BOTTOM') {
                    side_var = 'x';
                    side_range = Stage.screen.width;
                    side_margin += size;
                }

                switch (this.options.position) {
                    case 'MIDDLE':
                        position[side_var] = side_range/2; break;
                    case 'TOP_OR_LEFT':
                        position[side_var] = side_margin; break;
                    case 'BOTTOM_OR_RIGHT':
                        position[side_var] = side_range-side_margin; break;
                    case 'RANDOM':
                        position[side_var] = _.random(0, side_range-side_margin*2)+side_margin; break;
                }

                tween[side_var] = position[side_var];

                var particle = new Particles.types.tween(asset, {
                    x: position.x,
                    y: position.y
                });

                var time = this.options.scroll_time;
                if (this.options.scroll_unit === 'SPEED') {
                    time = (Math.abs(tween.x-position.x) + Math.abs(tween.y-position.y)) / (time * 400 / 3); // 3 seconds = 400 pixels/sec
                    console.log('calc', time);
                }
                if (this.options.spin)
                    tween.rotation = time * this.options.spin * Math.PI / 180;

                particle.tween(tween, time, function(){
                    particle.destroy();
                });
            }
        }),
        OVERLAY_COLORS: new Class({
            Extends: Effect,
            resourceType: 'IMAGE',
            name: 'Overlay - Colors',
            settings: [
                {
                    name: 'Type',
                    key: 'effect_type',
                    type: 'options',
                    options: [
                        { name: 'RGB', value: 'RGB' },
                        { name: 'Rainbow', value: 'RAINBOW' },
                    ],
                    default: 'RAINBOW'
                },
                {
                    name: 'Strength',
                    key: 'strength',
                    type: 'range',
                    range: [0.1,100,0.1],
                    default: 30
                },
                {
                    name: 'Time',
                    key: 'time',
                    type: 'range',
                    range: [0.1,30,0.1],
                    default: 3
                },
                {
                    name: 'Rotations',
                    key: 'rotations',
                    type: 'range',
                    range: [1,20,1],
                    default: 1
                }
            ],
            initialize: function(options){
                this.parent(options);
            },
            trigger: function() {
                var fill = new PIXI.Graphics();
                fill.alpha = this.options.strength / 100;
                Stage.addChild(fill);

                var renderColor = function(color){
                    fill.clear();
                    fill.beginFill(color);
                    fill.moveTo(0,0);
                    fill.lineTo(Stage.screen.width,0);
                    fill.lineTo(Stage.screen.width,Stage.screen.height);
                    fill.lineTo(0,Stage.screen.height);
                    fill.lineTo(0,0);
                    fill.endFill();
                }

                var rotations = 0;
                var startRotation = function(){
                    if (this.options.effect_type === 'RGB') {
                        var runTime = this.options.time / 3 * 1000;
                        var ranTimes = 0;
                        var runInterval = setInterval(function(){
                            ranTimes += 1;
                            if (ranTimes == 1) {
                                renderColor(0x0000FF);
                            }
                            else if (ranTimes == 2) {
                                renderColor(0xFF0000);
                            }
                            else if (ranTimes == 3) {
                                clearInterval(runInterval);
                                finishRotation();
                            }
                        }, runTime);
                        renderColor(0x00FF00);
                    }
                    else if (this.options.effect_type === 'RAINBOW') {
                        var runTimes = 60 * this.options.time;
                        var runTime = 1 / 60 * 1000;
                        var ranTimes = 1;
                        var runInterval = setInterval(function(){
                            ranTimes += 1;
                            renderColor(hslToRgb(ranTimes/runTimes,1,0.5));
                            if (ranTimes == runTimes+1) {
                                clearInterval(runInterval);
                                finishRotation();
                            }
                            console.log(hslToRgb(ranTimes/runTimes,1,0.5));
                        }, runTime);
                        renderColor(hslToRgb(0,1,0.5));
                    }
                }.bind(this);

                var finishRotation = function(){
                    rotations += 1;
                    if (rotations < this.options.rotations) {
                        startRotation();
                    } else {
                        Stage.removeChild(fill);
                    }
                }.bind(this);

                startRotation();
            }
        })
    }
};

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255).toString(16);
    g = Math.round(g * 255).toString(16);
    b = Math.round(b * 255).toString(16);

    r = (r.length == 1) ? "0" + r : r;
    g = (g.length == 1) ? "0" + g : g;
    b = (b.length == 1) ? "0" + b : b;

    return parseInt(r+g+b, 16);
};