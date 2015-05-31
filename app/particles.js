var Particle = new Class({
    initialize: function(sprite, options){
        this.sprite = sprite;
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.velocity = {
            x: 0,
            y: 0
        };
        
        this.tickInterval = setInterval(this.tick.bind(this), 1000/120);
        Stage.addChild(this.sprite);
    },
    tick: function(){
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;
    },
    destroy: function(){
        clearInterval(this.tickInterval);
        Stage.removeChild(this.sprite);
        console.log('Killed me');
    }
});

var Particles = {
    'firework': new Class({
        Extends: Particle,
        initialize: function(sprite, options) {
            this.parent(sprite, options);

            this.sprite.x = options.x;
            this.sprite.y = options.y;

            var rotation = Math.random() * Math.PI * 2;
            var intensity = Math.random() * 5;

            this.velocity.x = Math.cos(rotation) * intensity;
            this.velocity.r = this.velocity.x * Math.PI / 180;
            this.velocity.y = Math.sin(rotation) * intensity;
        },
        tick: function() {
            this.velocity.y += 0.1;
            this.sprite.rotation += this.velocity.r;
            this.sprite.x += this.velocity.x;
            this.sprite.y += this.velocity.y;

            if (this.sprite.y > Stage.screen.height)
                this.destroy();
        }
    })
};