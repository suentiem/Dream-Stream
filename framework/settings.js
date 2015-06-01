var Settings = {
    name: '',
    settings: {},
    load: function(onSuccess){
        var self = this;
        $.getJSON('/settings.json').success(function(response){
            self.name = response.name;
            self.settings = response.settings;
            onSuccess();
        });
    },
    get: function(key) {
        return this.settings[key];
    }
};