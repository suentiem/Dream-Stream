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

Events = {
    types: {
        CS: new Class({
            Extends: Event,
            name: 'Player CS',
            variables: [
                {name:'Amount',value:'amount'},
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'cs'); 
            }
        }),
        KILL: new Class({
            Extends: Event,
            name: 'Player Kill',
            variables: [
                {name:'Amount',value:'amount'},
                {name:'Streak',value:'streak'},
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'kill'); 
            }
        }),
        DEATH: new Class({
            Extends: Event,
            name: 'Player Death',
            variables: [
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'death'); 
            }
        }),
        ASSIST: new Class({
            Extends: Event,
            name: 'Player Assist',
            variables: [
                {name:'Amount',value:'amount'},
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'assist'); 
            }
        }),
        TEAM_KILL: new Class({
            Extends: Event,
            name: 'Team Kill',
            variables: [
                {name:'Total',value:'total'},
                {name:'Amount',value:'amount'}
            ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'team_kill'); 
            }
        }),
        TEAM_DEATH: new Class({
            Extends: Event,
            name: 'Team Death',
            variables: [
                {name:'Total',value:'total'},
                {name:'Amount',value:'amount'}
            ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'team_death'); 
            }
        }),
        GAME_STARTED: new Class({
            Extends: Event,
            name: 'Game Started',
            variables: [ ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'game_started'); 
            }
        }),
        GAME_FINISHED: new Class({
            Extends: Event,
            name: 'Game Finished',
            variables: [ ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'game_finished'); 
            }
        }),
        GAME_LOADING: new Class({
            Extends: Event,
            name: 'Game Loading',
            variables: [ ],
            isTriggered: function (message) { 
                return (message && message.event && message.event == 'game_loading'); 
            }
        })
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