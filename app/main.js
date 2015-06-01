
var main = function(){
    // Initialize Pixi
    Stage.initialize();
    Stage.start();

    // Get Settings
    Stage.swapToMessage('Loading Settings...');
    Settings.load(function(){

        // Setup Listeners
        var listeners = Settings.get('listeners');
        var events = [];
        _.each(listeners, function(listener){
            var event = new Events.types[listener.type](listener);
            events.push(event);
        });
        console.log(events);

        Stage.swapToMessage('Connecting To Server...');
        Socket.connect({
            onReady: function(){
                Stage.swapToMain();
            },
            onMessage: function(message){
                console.log('I GOT STUFF', message);
                _.each(events, function(event){
                    event.handler(message);
                });
            }
        });
    
    });
};
