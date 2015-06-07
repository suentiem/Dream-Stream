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
            range: [0,50,1],
            default: 0
        },
        {
            name: 'Repeat Delay',
            key: 'base_repeat_delay',
            type: 'range',
            range: [0,10,0.1],
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
        })
    }
};