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
                this.texture = new PIXI.Texture.fromImage(this.url);
            },
            generate: function() {
                return new PIXI.Sprite(this.texture);
            }
        }),
        SOUND: new Class({
            Extends: Asset,
            initialize: function(uri) {
                this.parent(uri);
                var match = this.url.match(/^(.+)\.(.+?)$/);
                this.sound = new buzz.sound( match[1], { formats: [ match[2] ] });
            },
            generate: function() {
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