
var Stage = {
    scenes: {
        MAIN: 0,
        MESSAGE: 1,
    },
    initialize: function(){
        // create an new instance of a pixi stage
        this.stage = new PIXI.Container();
        this.scene = this.scenes.MAIN;
        this.spriteHash = {};

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

        // create a renderer instance.
        this.renderer = PIXI.autoDetectRenderer(this.screen.width, this.screen.height, { transparent: true });

        // add the renderer view element to the DOM
        document.body.appendChild(this.renderer.view);

        // Setup message scene
        this.messageStage = new PIXI.Container();
        this.messageText = new PIXI.Text('testing', {font : '20px Arial', fill : 0xffffff, stroke: 0x000000, strokeThickness: 6, align : 'left'});
        this.messageText.anchor.x = 0;
        this.messageText.anchor.y = 1;
        this.messageText.x = 10;
        this.messageText.y = this.screen.height - 10;
        this.messageStage.addChild(this.messageText);
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
    swapToMessage: function(message) {
        this.messageText.text = message;
        this.scene = this.scenes.MESSAGE;
    },
    swapToMain: function() {
        this.scene = this.scenes.MAIN;
    },

    addToDrawLoop: function (id, sprite) {
        this.spriteHash[id] = sprite;
    },
    removeFromDrawLoop: function (id) {
        delete this.spriteHash[id];
    },

    animate: function() {
        requestAnimationFrame( this.animateBound );

        // render the stage  
        if (this.scene == this.scenes.MAIN) {
            this.renderer.render(this.stage);
            for (_id in this.spriteHash) {
                this.spriteHash[_id].render();
            }
        }
        else if (this.scene == this.scenes.MESSAGE) {
            this.renderer.render(this.messageStage);
        }
    }
};