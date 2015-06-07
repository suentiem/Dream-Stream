
var main = function(){
    // Initialize Pixi
    Stage.initialize();
    Stage.start();

    var stateIsConnected, stateHaveSettings;

    // Get Settings
    var events = {};
    var eventsAll = [];
    var settingsReady = false;
    var loadSettings = function(){
        settingsReady = false;

        var namespacesToInitialize = 0;
        var checkReady = function(){
            if (!namespacesToInitialize) {
                settingsReady = true;
                Stage.swapToMain();
            }
            else {
                Stage.swapToMessage('Settings loaded, initializing events...');
            }
        };

        Settings.load(function(){
            // Setup Listeners
            var listeners = Settings.get('listeners');
            
            // Clear current events
            _.each(events, function(id, _events){
                events[id] = [];
            });
            eventsAll = [];

            // Add each event to the list
            _.each(listeners, function(listener){
                var type = Events.id.parse(listener.type);
                var namespace = Events.namespaces[type.namespace];

                // Setup a listener if it doesn't exist
                if (events[type.namespace] === undefined) {
                    events[type.namespace] = [];
                    namespacesToInitialize++;
                    namespace.initialize(function(){
                        namespacesToInitialize--;
                        checkReady();
                    }, function(message){
                        _.each(events[type.namespace], function(event){
                            event.handler(message);
                        });
                    });
                }

                var event = new namespace.types[type.event](listener);
                events[type.namespace].push(event);
                eventsAll.push(event);
            });

            checkReady();
        });
    };

    Stage.swapToMessage('Initializing');

    loadSettings();

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
                        if (settingsReady) {
                            eventsAll[message.id].triggerEffects();
                            clearInterval(interval);
                        }
                    }, 100);
            }
        }
    });
};
