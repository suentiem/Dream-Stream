
var Stage = {
    scenes: {
        MAIN: 0,
        MESSAGE: 1,
    },
    initialize: function(preload, onComplete){
        this.scene = this.scenes.MAIN;

        // Read screen dimensions
        var $body = $(document.body);
        this.screen = {
            width: $body.width(),
            height: $body.height(),
            center: { 
                x: $body.width()/2, 
                y: $body.height()/2 
            }
        };
        var self = this;
        this.phaser = new Phaser.Game(this.screen.width, this.screen.height, Phaser.WEBGL, 'main', { 
            preload: preload, 
            create: function(){
                self.messageText = self.phaser.add.text(self.phaser.world.centerX, self.phaser.world.centerY, "Test", { 
                    font: "24px Arial", 
                    fill: "#ff0044", 
                    align: "left"
                });
                self.messageText.anchor.set(0.5);
                onComplete();
                Stage.phaser.stage.disableVisibilityChange = true;
            }, 
            update: this.update.bind(this), 
            render: this.render.bind(this)
        }, true);

        // // create a renderer instance.
        // this.renderer = PIXI.autoDetectRenderer(this.screen.width, this.screen.height, { transparent: true });

        // // add the renderer view element to the DOM
        // document.body.appendChild(this.renderer.view);

        // // Setup message scene
        // this.messageStage = new PIXI.Container();
        // this.messageText = new PIXI.Text('testing', {font : '20px Arial', fill : 0xffffff, stroke: 0x000000, strokeThickness: 6, align : 'left'});
        // this.messageText.anchor.x = 0;
        // this.messageText.anchor.y = 1;
        // this.messageText.x = 10;
        // this.messageText.y = this.screen.height - 10;
        // this.messageStage.addChild(this.messageText);
    },
    start: function() {
        this.animateBound = this.animate.bind(this);
        requestAnimationFrame( this.animateBound );
    },
    addChild: function(sprite) {
        this.stage.addChild(sprite);
    },
    removeChild: function(sprite) {
        this.stage.removeChild(sprite);
    },
    message: function(message) {
        if (message) {
            this.messageText.text = message;
            this.messageText.alpha = 1;
        } else {
            this.messageText.alpha = 0;
        }
    },

    
    snoud: function() {
    },
    update: function() {
    },
    render: function() {
    }
};