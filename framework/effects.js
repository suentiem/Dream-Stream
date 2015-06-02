var Effect = new Class({
    resourceType: null,
    initialize: function(options){
        if (this.resourceType === null){
            console.error('Failed to specify a resource type for effect!');
        }
        this.options = options;
        this.resourceClass = Resources.types[options.resource.type];
        this.resource = new this.resourceClass(this.resourceType, options.resource);
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
                    range: [0,1,0.1],
                    default: 1
                },
                {
                    name: 'Size',
                    key: 'intensity',
                    type: 'range',
                    range: [0,1000,1],
                    default: 100
                },
                {
                    name: 'Force',
                    key: 'force',
                    type: 'range',
                    range: [0.5,5,0.1],
                    default: 1
                }
            ],
            initialize: function(options){
                this.parent(options);

                this.options.scale = this.options.scale || 1;
                this.options.intensity = this.options.intensity || 'HIGH';
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
        })
    }
};