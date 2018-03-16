var currentPlayer = null;
var players = [];
var playersById = {};

Events.namespaces.LEAGUE_OF_LEGENDS = {
    name: 'League of Legends',
    initialize: function(onReady, onEvent){
        console.log('HAY zaa HAY BABY');
        this.socket = new Socket('127.0.0.1', 9001, {
            onReady: onReady,
            onMessage: function(message){
                // Guarantee event exists
                if (message.type === undefined)
                    message.type = null;

                // Register Player
                if (message.type == 'INITIALIZATION' || message.type == 'GAME_START') {
                    var playerId = message.playerId;
                    teams = message.players;
                    playersById = {};
                    players = [].concat(teams.ORDER, teams.CHAOS);
                    players.forEach(function(player){
                        playersById[player.id] = player;
                        if (player.id == playerId)
                            currentPlayer = player;
                    });
                }

                if (currentPlayer.id == message.playerId
                    && message.type !== 'PLAYER_HEALTH'
                    && message.type !== 'PLAYER_GOLD')
                    console.log('MINE', message);

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
                return (message.type == 'PLAYER_CS' && message.playerId === currentPlayer.id); 
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
                return (message.type == 'PLAYER_KILL' && message.playerId === currentPlayer.id); 
            }
        }),
        DEATH: new Class({
            Extends: Event,
            name: 'Player Death',
            variables: [
                {name:'Total',value:'total'}
            ],
            isTriggered: function (message) { 
                return (message.type == 'PLAYER_DEATH' && message.playerId === currentPlayer.id);
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
                return (message.type == 'PLAYER_ASSIST' && message.playerId === currentPlayer.id);
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
                var player = playersById[message.playerId];
                return (message.type == 'PLAYER_KILL' && player.team == currentPlayer.team && player.id !== currentPlayer.id);
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
                var player = playersById[message.playerId];
                return (message.type == 'PLAYER_DEATH' && player.team == currentPlayer.team && player.id !== currentPlayer.id);
            }
        }),
        GAME_STARTED: new Class({
            Extends: Event,
            name: 'Game Started',
            variables: [ ],
            isTriggered: function (message) { 
                return (message.type == 'GAME_START'); 
            }
        }),
        GAME_FINISHED: new Class({
            Extends: Event,
            name: 'Game Finished',
            variables: [ ],
            isTriggered: function (message) { 
                return (message.type == 'GAME_END'); 
            }
        }),
        SPELL_CAST: new Class({
            Extends: Event,
            name: 'Spell Cast',
            variables: [
                {name:'Spell Level', value:'spellLevel'},
                {name:'Spell Name', value:'spellName'},
                {name:'Key', value:'key'},
            ],
            isTriggered: function (message) { 
                return (message.type == 'PLAYER_SPELL_CAST'); 
            }
        }),
        GAME_LOADING: new Class({
            Extends: Event,
            name: 'Game Loading',
            variables: [ ],
            isTriggered: function (message) { 
                return (message.type == 'game_loading'); 
            }
        })
    }
};