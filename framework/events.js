var Event = new Class({
    resourceType: null,
    initialize: function(options){
        var self = this;
        
        this.effects = [];
        _.each(options.effects, function(effectOptions){
            var effect = new Effects.types[effectOptions.type](effectOptions);
            self.effects.push(effect);
        });
        
        this.qualifiers = [];
        _.each(options.qualifiers, function(qualifierOptions){
            self.qualifiers.push(qualifierOptions);
        });
    },
    triggerEffects: function() {
        _.each(this.effects, function(effect){ effect.handleTrigger(); });
        return true;
    },
    isTriggered: function() {
        console.error('Event missing trigger checker!');
        return null;
    },
    isQualified: function(message) {
        for (var q=0; q < this.qualifiers.length; ++q) {
            var qualifier = this.qualifiers[q];
            var operation = qualifier['operation'];
            var valueA = qualifier['value'];
            var valueB = message[qualifier['key']];
            var result = Events.qualifierOperations[operation](valueA, valueB);

            if (!result)
                return false;
        }
        return true;
    },
    handler: function(message) {
        if (this.isTriggered(message) && this.isQualified(message))
            return this.triggerEffects();
        else
            return false;
    }
});

var EventNamespace = new Class({
    initialize: function(events, onReady){
        this.events = events;
    }
});

Events = {
    namespaces: {},
    id: {
        parse: function(id){ var idSplit = id.split('.'); return { namespace: idSplit[0],  event: idSplit[1] }; },
        stringify: function(namespace, event){ return namespace + '.' + event; },
    },
    qualifierOperations: {
        '=': function(a,b){ return a == b },
        '>': function(a,b){ return b > a },
        '>=': function(a,b){ return b >= a },
        '<': function(a,b){ return b < a },
        '<=': function(a,b){ return b <= a },
        '!=': function(a,b){ return a != b }
    }
};