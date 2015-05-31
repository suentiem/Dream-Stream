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
            initialize: function(options){
                this.parent(options);
                this.sound = null;
            },
            trigger: function() {
                if (this.sound)
                    this.sound.stop();

                this.sound = this.resource.generate();
                this.sound.play();
            }
        }),
        ANIMATION_FIREWORK: new Class({
            Extends: Effect,
            resourceType: 'IMAGE',
            initialize: function(options){
                this.parent(options);

                this.options.scale = this.options.scale || 1;
                this.options.intensity = this.options.intensity || 'HIGH';
            },
            trigger: function() {
                var location = {
                    x: parseInt(Math.random() * Stage.screen.width),
                    y: parseInt(Math.random() * Stage.screen.height)
                };

                var particleCount = 10;
                if (this.options.intensity === 'HIGH')
                    particleCount = 500;

                for (var p=0; p < particleCount; ++p) {
                    var asset = this.resource.generate();

                    if (this.options.scale)
                        asset.scale = {x:this.options.scale, y:this.options.scale};

                    new Particles.firework(asset, {
                        x: location.x,
                        y: location.y
                    });
                }
            }
        })
    }
};