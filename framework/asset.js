var Asset = new Class({
    initialize: function(uri){
        this.uri = uri;
        this.url = '/files/' + uri;
    }
});

var Assets = {
    types: {
        IMAGE: new Class({
            Extends: Asset,
            initialize: function(uri) {
                this.parent(uri);

                this.type = null;
                if (this.url.match(/\.(mp4|webm)$/))
                    this.type = 'Video';
                else
                    this.type = 'Image';

                this.texture = new PIXI.Texture['from' + this.type](this.url);
            },
            generate: function() {
                // If it's a video, try to loop it
                if (this.type === 'Video') {
                    try {
                        this.texture.baseTexture.source.setAttribute('loop', 'true');
                        this.texture.baseTexture.source.play();
                    } catch(e){}
                }
                console.log('a', new PIXI.Sprite(this.texture).texture);

                return new PIXI.Sprite(this.texture);
            }
        }),
        SOUND: new Class({
            Extends: Asset,
            initialize: function(uri) {
                this.parent(uri);
                this.sound = new Audio(this.url);
            },
            generate: function() {
                this.sound.load();
                return this.sound;
            }
        })
    },
    list: [],
    listByType: {},
    get: function(url, type) {
        if (!this.listByType[type])
            this.listByType[type] = {};
        if (!this.listByType[type][url])
            this.listByType[type][url] = new this.types[type](url);

        return this.listByType[type][url];
    }
};