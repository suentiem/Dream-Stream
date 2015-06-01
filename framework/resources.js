var Resource = new Class({
    initialize: function(type, options) {
        this.resourceType = type;
    }
});
var Resources = {
    types: {
        'FILE': new Class({
            Extends: Resource,
            name: 'Single',
            input: 'file',
            initialize: function(type, options) {
                this.parent(type, options);
                this.source = options.source;
                this.asset = Assets.get(this.source, type);
            },
            generate: function() {
                return this.asset.generate();
            }
        }),

        'FILE_RANDOM': new Class({
            Extends: Resource,
            name: 'Random',
            input: 'file_multiple',
            initialize: function(type, options) {
                this.parent(type, options);
                this.assets = [];
                // Add all assets
                var self = this;
                _.each(options.source, function(source){
                    self.assets.push(Assets.get(source, type));
                });
                this.assetsRandomizer = this.assets.length-0.000001;
            },
            generate: function() {
                var randomAssetId = Math.floor(Math.random()*this.assetsRandomizer);
                var randomAsset = this.assets[Math.floor(Math.random()*this.assetsRandomizer)];
                return randomAsset.generate();
            }
        })
    }
};