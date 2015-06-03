
var Socket = new Class({
    connected: null,
    initialize: function(host, port, options){
        this.options = $.extend({
            onReady: function(){},
            onMessage: function(){},
            onReconnect: function(){}
        }, options);
        this.host = host;
        this.port = port;
        
        this.connect();
    },
    connect: function(message) {
        if (this.socket)
            this.socket.close();

        this.socket = new WebSocket('ws://' + this.host + ':' + this.port + '/ws');
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
    },
    send: function(message) {
        if (this.connected)
            this.socket.send(JSON.stringify(message));
        else
            return false;

        return true;
    },
    onOpen: function(event){
        if (this.connected === null)
            this.options.onReady();
        this.connected = true;
    },
    onClose: function(event){
        if (this.connected)
            this.connected = false;

        console.log('ehh');

        var self = this;
        setTimeout(function(){
            console.log('Reconnecting...');
            self.connect();
        }, 1000);
    },
    onError: function(event){ console.log('uhh'); },
    onMessage: function(event){
        var message = JSON.parse(event.data);
        this.options.onMessage(message);
    }
});