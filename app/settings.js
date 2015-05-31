var Settings = {
    settings: {},
    load: function(onSuccess){
        var self = this;
        $.getJSON('./settings.json').success(function(response){
            self.settings = response;
            onSuccess();
        });
    },
    get: function(key) {
        return this.settings[key];
    }
};