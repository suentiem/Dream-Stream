Events.namespaces.LEAGUE_OF_LEGENDS = {
    name: 'League of Legends',
    initialize: function(onReady, onEvent){
        this.socket = new Socket('127.0.0.1', 9001, {
            onReady: onReady,
            onMessage: function(message){
                // Guarantee event exists
                if (message.event === undefined)
                    message.event = null;

                onEvent(message);
            }
        });
    },
    types: {
        CS: new Class({
            Extends: Event,
            name: 'Player CS',
            variables: [
                {name:'Amount',value:'amount'},
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message.event == 'cs'); 
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
                return (message.event == 'kill'); 
            }
        }),
        DEATH: new Class({
            Extends: Event,
            name: 'Player Death',
            variables: [
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message.event == 'death'); 
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
                return (message.event == 'assist'); 
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
                return (message.event == 'team_kill'); 
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
                return (message.event == 'team_death'); 
            }
        }),
        GAME_STARTED: new Class({
            Extends: Event,
            name: 'Game Started',
            variables: [ ],
            isTriggered: function (message) { 
                return (message.event == 'game_started'); 
            }
        }),
        GAME_FINISHED: new Class({
            Extends: Event,
            name: 'Game Finished',
            variables: [ ],
            isTriggered: function (message) { 
                return (message.event == 'game_finished'); 
            }
        }),
        GAME_LOADING: new Class({
            Extends: Event,
            name: 'Game Loading',
            variables: [ ],
            isTriggered: function (message) { 
                return (message.event == 'game_loading'); 
            }
        })
    }
};