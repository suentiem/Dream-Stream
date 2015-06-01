
var Socket = {
    connect: function(options){
        this.options = $.extend({
            onReady: function(){},
            onMessage: function(){}
        }, options);
        this.socket = new WebSocket('ws://127.0.0.1:9001/ws');
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    },
    onOpen: function(event){
        this.options.onReady();
    },
    onClose: function(event){

    },
    onMessage: function(event){
        var message = JSON.parse(event.data);
        console.log('I GOT', message);
        this.options.onMessage(message);
    }
};