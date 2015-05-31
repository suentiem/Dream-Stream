window.DebugEvents = [];

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
        
        window.DebugEvents.push(this);
    },
    triggerEffects: function() {
        _.each(this.effects, function(effect){ effect.trigger(); });
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

            if (operation === '=') { if (valueA != valueB) return false; }
            else if (operation === '==') { if (valueA !== valueB) return false; }
            else if (operation === '>') { if (valueA >= valueB) return false; }
            else if (operation === '>=') { if (valueA > valueB) return false; }
            else if (operation === '<') { if (valueA <= valueB) return false; }
            else if (operation === '<=') { if (valueA < valueB) return false; }
            else if (operation === '!=') { if (valueA == valueB) return false; }
            else if (operation === '!==') { if (valueA === valueB) return false; }
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

Events = {
    types: {
        CS: new Class({
            Extends: Event,
            name: 'Creep Score',
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'cs'); 
            }
        }),
        KILL: new Class({
            Extends: Event,
            name: 'Player Kill',
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'kill'); 
            }
        })
    }
};