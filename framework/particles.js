var Particle = new Class({
    initialize: function(sprite, options){
        this.id = 'p' + Particles.index++;
        this.sprite = sprite;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.gravity = 0.1;
        this.velocity = {
            x: 0,
            y: 0
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

                this.sprite.x = options.x;
                this.sprite.y = options.y;

                var force = options.force || 1;
                var rotation = Math.random() * Math.PI * 2;
                var intensity = Math.random() * 5 * force;

                this.velocity.x = Math.cos(rotation) * intensity;
                this.velocity.r = this.velocity.x * Math.PI / 180;
                this.velocity.y = Math.sin(rotation) * intensity;
                this.gravity = 0.1;
            }
        })
    }
};