
var main = function(){
    var self = this;
    // Get Settings
    Settings.load(function(){
        // Initialize Stage
        Stage.initialize(
            // Load Sprites
            function(){
                // Setup Listeners
                var listeners = Settings.get('listeners');
                var events = [];
                _.each(listeners, function(listener){
                    var event = new Events.types[listener.event](listener);
                    events.push(event);
                });
            },
            // Done loading
            function(){
                Stage.message('Connecting To Server...');
                Socket.connect({
                    onReady: function(){
                        Stage.message();
                    },
                    onMessage: function(message){
                        console.log('I GOT STUFF', message);
                        _.each(events, function(event){
                            event.handler(message);
                        });
                    }
                });
            }
        );
    });

    // Build Assets

    // Main Loop
};


