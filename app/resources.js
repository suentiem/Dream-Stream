var Resource = new Class({
    initialize: function(type, options) {
        this.resourceType = type;
    },
    preloadAsset: function(uri, type) {
        var url = '/files/' + uri;
        Stage.phaser.load[type](uri, url);
        console.log(type, url);

        if (type == 'audio')
            return Stage.phaser.add[type](uri);
        else if (type == 'image')
            return uri;
    },
    getAll: function() {
        return [this.get()];
    }
});
var Resources = {
    types: {
        'single': new Class({
            Extends: Resource,
            initialize: function(type, options) {
                this.parent(type, options);
                this.asset = this.preloadAsset(options.source, type);
            },
            get: function() {
                return this.asset;
            }
        }),

        'random': new Class({
            Extends: Resource,
            initialize: function(type, options) {
                this.parent(type, options);
                this.assets = [];
                // Add all assets
                var self = this;
                _.each(options.sources, function(source){
                    self.assets.push(self.preloadAsset(source, type));
                });
                this.assetsRandomizer = this.assets.length-0.000001;
            },
            get: function() {
                var randomAssetIndex = Math.floor(Math.random()*this.assetsRandomizer);
                var randomAsset = this.assets[randomAssetIndex];
                return randomAsset;
            },
            getAll: function() {
                return this.assets;
            }
        })
    }
};