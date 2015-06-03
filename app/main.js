
var main = function(){
    // Initialize Pixi
    Stage.initialize();
    Stage.start();

    var stateIsConnected, stateHaveSettings;

    // Get Settings
    var events = [];
    var loadSettings = function(){
        stateHaveSettings = false;

        Settings.load(function(){
            // Setup Listeners
            var listeners = Settings.get('listeners');
            events = [];
            _.each(listeners, function(listener){
                var event = new Events.types[listener.type](listener);
                events.push(event);
            });
            stateHaveSettings = true;

            if (stateIsConnected)
                Stage.swapToMain();
            else
                Stage.swapToMessage('Settings loaded, connecting to stats...');
        });
    };

    // Connect to the stats server
    var loadStats = function() {
        stateIsConnected = false;

        new Socket('127.0.0.1', 9001, {
            onReady: function(){
                stateIsConnected = true;

                if (stateHaveSettings)
                    Stage.swapToMain();
                else
                    Stage.swapToMessage('Connected, loading settings...');
            },
            onMessage: function(message){
                console.log('I GOT STUFF', message);
                _.each(events, function(event){
                    event.handler(message);
                });
            }
        });
    };

    Stage.swapToMessage('Initializing');

    loadSettings();
    loadStats();

    // Talk to config
    var socket = new Socket('127.0.0.1', 9003, {
        onMessage: function(message){
            console.log('message', message);
            if (message.signal === 'reload') {
                Stage.swapToMessage('Reloading settings...');
                loadSettings();
            }
            else if (message.signal === 'trigger_event') {
                var interval = null;

                // Handle this when reloading
                if (stateHaveSettings)
                    events[message.id].triggerEffects();
                else
                    interval = setInterval(function(){
                        if (stateHaveSettings) {
                            events[message.id].triggerEffects();
                            clearInterval(interval);
                        }
                    }, 100);
            }
        }
    });
};
