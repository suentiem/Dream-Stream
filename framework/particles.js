var Particle = new Class({
    initialize: function(sprite, options){
        options = options || {};

        this.id = 'p' + Particles.index++;
        this.sprite = sprite;
        this.sprite.x = options.x || 0;
        this.sprite.y = options.y || 0;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.gravity = options.gravity || 0.1;
        this.velocity = options.velocity || {
            x: 0,
            y: 0,
            r: 0
        };
        this.bounds = {
            x: {min:-this.sprite.width, max:Stage.screen.width + this.sprite.width},
            y: {min:-this.sprite.height, max:Stage.screen.height + this.sprite.height}
        };
        
        Stage.addChild(this.sprite);
        Stage.addToDrawLoop(this.id, this);
    },
    render: function(){
        this.velocity.y += this.gravity;
        this.sprite.rotation += this.velocity.r;
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        if (
            this.sprite.y > this.bounds.y.max || 
            this.sprite.y < this.bounds.y.min || 
            this.sprite.x > this.bounds.x.max || 
            this.sprite.x < this.bounds.x.min
            )
            this.destroy();
    },
    destroy: function(){
        Stage.removeChild(this.sprite);
        Stage.removeFromDrawLoop(this.id);
        console.log('Killed me');
    }
});

var Particles = {
    index: 0,
    types: {
        'firework': new Class({
            Extends: Particle,
            initialize: function(sprite, options) {
                this.parent(sprite, options);

                var force = options.force || 1;
                var rotation = Math.random() * Math.PI * 2;
                var intensity = Math.random() * 5 * force;

                this.velocity.x = Math.cos(rotation) * intensity;
                this.velocity.r = this.velocity.x * Math.PI / 180;
                this.velocity.y = Math.sin(rotation) * intensity;
            }
        }),
        'tween': new Class({
            Extends: Particle,
            initialize: function(sprite, options) {
                this.parent(sprite, options);
                this.tweening = false;
            },
            render: function() {
                if (this.tweening) {
                    this.sprite.rotation += this.changes.r;
                    this.sprite.x += this.changes.x;
                    this.sprite.y += this.changes.y;
                    this.sprite.alpha += this.changes.alpha;
                    this.sprite.scale.x += this.changes.scale.x;
                    this.sprite.scale.y += this.changes.scale.y;
                    this.frameTickCount += 1;

                    if (this.frameTickCount >= this.frameTicks) {
                        this.tweening = false;
                        this.returnCall();
                    }
                }
            },
            tween: function(values, time, returnCall) {
                this.returnCall = returnCall || function(){};

                // Blank slate
                this.changes = {
                    alpha: 0,
                    scale: {
                        x: 0,
                        y: 0,
                    },
                    x: 0,
                    y: 0,
                    r: 0,
                };

                var frameTime = 1000/60;
                this.frameTicks = Math.round(60 * time);
                this.frameTickCount = 0;
                this.tweening = true;

                var getStepAmount = function(current, target){
                    return (target - current) / frameTicks;
                }

                if (values.alpha !== undefined)
                    this.changes.alpha = (values.alpha - this.sprite.alpha) / this.frameTicks;
                if (values.scale !== undefined) {
                    this.changes.scale.x = (values.scale.x - this.sprite.scale.x) / this.frameTicks;
                    this.changes.scale.y = (values.scale.y - this.sprite.scale.y) / this.frameTicks;
                }
                if (values.x !== undefined)
                    this.changes.x = (values.x - this.sprite.x) / this.frameTicks;
                if (values.y !== undefined)
                    this.changes.y = (values.y - this.sprite.y) / this.frameTicks;
                if (values.rotation !== undefined)
                    this.changes.r = (values.rotation - this.sprite.rotation) / this.frameTicks;
            }
        })
    }
};
