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
            resourceType: 'audio',
            initialize: function(options){
                this.parent(options);
                this.sound = null;
            },
            trigger: function() {
                if (this.sound)
                    this.sound.restart();

                this.sound = this.resource.get();
                this.sound.play();
            }
        }),
        ANIMATION_FIREWORK: new Class({
            Extends: Effect,
            resourceType: 'image',
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

                emitter = Stage.phaser.add.emitter(location.x, location.y, particleCount);
                emitter.makeParticles(this.resource.getAll());
                emitter.setScale(0.1 * this.options.scale, this.options.scale, 0.1 * this.options.scale, this.options.scale, 6000, Phaser.Easing.Quintic.Out);
                emitter.gravity = 200;
                emitter.start(true, 10000, null, particleCount);
            }
        })
    }
};