var postJSON = function(url, data, success) {
    $.ajax(url, {
        data : JSON.stringify(data),
        contentType : 'application/json',
        type : 'POST'
    }).success(success);
};
var generateSelect = function(options, selected) {
    var $select = $('<select />').addClass('form-control');
    _.each(options, function(option){
        var $option = $('<option />');

        if (typeof(option) === 'object') {
            $option
                .val(option.value)
                .text(option.name);
        } else {
            $option
                .val(option)
                .text(option);
        }

        $select.append($option);
    });
    if (selected)
        $select.val(selected);
    return $select;
};
var generateButton = function(text) {
    var $button = $('<button />');

    $button
        .addClass('btn')
        .addClass('btn-default')
    if (text && text.substr(0,1) == '!')
        $button.addClass('glyphicon').addClass('glyphicon-' + text.substr(1));
    else
        $button.text(text);

    return $button;
};
var generateInput = function(value) {
    return $('<input />').addClass('form-control').val(value || '');
};


var main = function(){
    var defaultSettingsName = null;
    var $settingsFile = $('#settings-file');
    var $listeners = $('#listeners > tbody');
    var $listenersNewRow = $('#listeners > tbody > tr.new');
    var files = [];

    // -------------------------------------- //
    // Settings List - Load
    // -------------------------------------- //
    $.getJSON('/files.json').success(function(response){
        files = response.files;
    });

    // -------------------------------------- //
    // Settings List - Load
    // -------------------------------------- //
    $.getJSON('/settings/list.json').success(function(response){
        // List Settings names
        var options = _.map(response.settings, function(name){
            return { name: name, value: name };
        });
        var $settingsFileNew = generateSelect(options, response.default);
        $settingsFileNew.attr('id', $settingsFile.attr('id'));
        $settingsFile.replaceWith($settingsFileNew);
        $settingsFile = $settingsFileNew;

        // Open the default
        defaultSettingsName = response.default;
        if(!$settingsFile.val())
            $settingsFile.val($settingsFile.find('>option:first').val());

        $settingsFile.trigger('change', true);
    });

    // -------------------------------------- //
    // Settings - Select File
    // -------------------------------------- //
    $(document.body).on('change', '#settings-file', function(event, preventBubble){
        if (preventBubble) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        var loadSettings = function() {
            $.getJSON('/settings.json').success(function(response){
                initializeSettings(response.settings);
            });
        }

        // Change settings file default if necessary
        var settingsFileName = $settingsFile.val();
        if (settingsFileName != defaultSettingsName) {
            defaultSettingsName = settingsFileName;
            postJSON('/settings/swap.json', {name:settingsFileName}, loadSettings);
        } else {
            loadSettings();
        }
    });

    // -------------------------------------- //
    // Settings - New
    // -------------------------------------- //
    $('#settings-file-new').on('click', function(e){
        e.preventDefault();

        var name = prompt("What would you like to call it?");
        if (name === null)
            return;

        postJSON('/settings/swap.json', {name:name}, function(){
            var $option = $('<option />').val(name).text(name);
            $settingsFile.append($option);
            $settingsFile.val(name);
            appReloadNeeded = true;
            initializeSettings({});
        });
    });

    // -------------------------------------- //
    // Settings - Build UI
    // -------------------------------------- //
    var initializeSettings = function(settings){
        $listeners.find('> tr:not(.new)').remove();

        _.each(settings.listeners || [], function(listener){
            listenersAddRow(listener);
        });
    };

    // -------------------------------------- //
    // Settings - Add Row
    // -------------------------------------- //
    var listenersAddRow = function(values){
        values = values || {};
        
        var $row = $('<tr />');
        var $when = $('<td />').addClass('when');
        var $do = $('<td />').addClass('do');

        // When
        var options = _.map(Events.types, function(event, id){
            return {name:event.prototype.name, value:id};
        });
        $when.append(generateButton('!remove').addClass('event-delete').addClass('btn-danger'));
        $when.append(generateSelect(options, values.type).addClass('event-select'));
        $when.append(generateButton('!plus').addClass('qualifiers-add'));
        $when.append(generateButton('!eye-open').addClass('event-test').attr('title', 'Test effect on open pages'));
        $when.append($('<ul />').addClass('qualifiers').addClass('sub-list'));
        $row.append($when);

        // When - qualifiers
        _.each(values.qualifiers || [], function(qualifier){
            listenersWhenAddQualifier($when, qualifier);
        });

        // Do
        $do.append($('<ul />').addClass('effects'));
        $do.append(generateButton('Add Effect').addClass('effects-add'));
        $row.append($do);

        // Do - effects
        _.each(values.effects || [], function(effect){
            listenersDoAddEffect($do, effect);
        });

        $listenersNewRow.before($row);
    };
    $listeners.on('click', '.event-delete', function(e){
        e.preventDefault();
        
        var $row = $(this).closest('tr');
        $row.remove();
        settingsChange();
    });
    $listenersNewRow.on('click', 'button', function(e){
        e.preventDefault();
        listenersAddRow();
        settingsChange();
    });
    $listeners.on('click', '.event-test', function(e){
        e.preventDefault();
        var $event = $(this).closest('tr');
        var index = $event.prevAll().length;

        socket.send({ signal: 'trigger_event', id: index });
    });

    // -------------------- //
    // Qualifiers
    // -------------------- //
    var listenersWhenAddQualifier = function($when, values){
        values = values || {};
        
        var $list = $when.find('.qualifiers');
        var $item = $('<li />');
        var eventId = $when.find('.event-select').val();

        var keyOptions = _.map(Events.types[eventId].prototype.variables, function(variable){
            return {name:variable.name, value:variable.value};
        });
        var operationOptions = _.map(Events.qualifierOperations, function(operation, id){
            return {name:id, value:id};
        });
        $item.append(generateSelect(keyOptions, values.key).addClass('qualifier-key'));
        $item.append(generateSelect(operationOptions, values.operation).addClass('qualifier-operation'));
        $item.append(generateInput(values.value).attr('placeholder', 'value').addClass('qualifier-value'));
        $item.append(generateButton('!remove').addClass('qualifier-delete'));

        $list.append($item);
    };
    $listeners.on('click', '.qualifier-delete', function(e){
        e.preventDefault();
        
        var $item = $(this).closest('li');
        $item.remove();
        settingsChange();
    });
    $listeners.on('click', '.qualifiers-add', function(e){
        e.preventDefault();
        var $when = $(this).closest('.when');
        listenersWhenAddQualifier($when);
        settingsChange();
    });

    // -------------------- //
    // Effects
    // -------------------- //
    var listenersDoAddEffect = function($do, values){
        values = values || {resource:{}};
        
        var $list = $do.find('.effects');
        var $item = $('<li />').addClass('effect');

        var typeOptions = _.map(Effects.types, function(effect, id){
            return {name:effect.prototype.name, value:id};
        });
        var resourceOptions = _.map(Resources.types, function(resource, id){
            return {name:resource.prototype.name, value:id};
        });
        var fileOptions = _.map(files, function(file){
            return {name:file, value:file};
        });
        $item.append(generateSelect(typeOptions, values.type).addClass('effect-type'));
        $item.append(generateButton('!cog').addClass('effect-settings-toggle'));
        $item.append(generateSelect(resourceOptions, values.resource.type).addClass('resource-type'));
        $item.append(generateSelect(fileOptions, values.resource.source).addClass('resource-source'));
        $item.append(generateButton('!remove').addClass('effect-delete'));

        // Add effect settings
        var $settings = $('<ul />').addClass('effect-settings').addClass('sub-list');
        $item.append($settings);
        listenersDoEffectAddSettings($settings, values);

        $list.append($item);

        // Set up resource type selection
        setTimeout(function(){
            $item.find('.resource-type').trigger('change', true);
            $item.find('.resource-source').val(values.resource.source);
        },0);
    };
    $listeners.on('change', '.effect-type', function(e){
        listenersDoEffectAddSettings($(this).siblings('.effect-settings'));
        settingsChange();
    });
    $listeners.on('click', '.effect-delete', function(e){
        e.preventDefault();
        
        var $item = $(this).closest('li');
        $item.remove();
        settingsChange();
    });
    $listeners.on('click', '.effects-add', function(e){
        e.preventDefault();
        var $do = $(this).closest('.do');
        listenersDoAddEffect($do);
        settingsChange();
    });

    // -------------------- //
    // Effect / Settings
    // -------------------- //
    var listenersDoEffectAddSettings = function ($settings, values) {
        values = values || {};

        var $effect = $settings.closest('.effect');
        var effectId = $effect.find('.effect-type').val();
        var settings = Effects.types[effectId].prototype.settings;

        $settings.empty();
        _.each(settings, function(setting){
            var $item = $('<li />');
            var value = values[setting.key] || setting.default;
            var $field;

            // Range
            if (setting.type == 'range') {
                var min = setting.range[0];
                var max = setting.range[1];
                var step = setting.range[2];
                $field = $('<input type="range" class="form-control" />')
                    .attr('min', min)
                    .attr('max', max)
                    .attr('step', step);
            } 
            // options
            else if (setting.type == 'options') {
                $field = generateSelect(setting.options);
            } 
            // Generic input
            else {
                $field = $('<input class="form-control" />');
            }

            $item.append($('<label class="control-label" />').text(setting.name));
            $item.append($field);
            $field.addClass('settings-field').data('settings-key', setting.key).val(value);

            // Range needs a counter next to it
            if (setting.type == 'range') {
                var $stats = $('<input class="form-control stats" disabled>');
                $field.after($stats);
                $field.on('change', function(){
                    $stats.val($field.val());
                });
                $stats.val(value);
            }

            $settings.append($item);
        });
    }
    $listeners.on('click', '.effect-settings-toggle', function(e){
        e.preventDefault();
        $(this).siblings('.effect-settings').toggle();
    });


    // -------------------- //
    // Resources
    // -------------------- //
    $listeners.on('change', '.resource-type', function(event, preventBubble){
        if (preventBubble) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        event.preventDefault();
        
        var $effect = $(this).closest('li');
        var $type = $effect.find('.resource-type');
        var $source = $effect.find('.resource-source');
        var resourceType = Resources.types[$type.val()];

        var multiple = resourceType.prototype.input == 'file_multiple'
        $source.prop('multiple', multiple);

        if (!preventBubble)
            settingsChange();
    });

    // -------------------------------------- //
    // Settings - Save
    // -------------------------------------- //
    $(document.body).on('change', '#listeners input,#listeners select', function(e){
        settingsChange();
    });
    var settingsChange = function(){
        settingsSave();
    };
    var settingsSave = function(){
        var settings = {
            listeners: []
        };

        // Loop through events
        _.each($listeners.find('>tr:not(.new)'), function(row){
            var $row = $(row);
            var $when = $row.find(">.when");
            var $do = $row.find(">.do");
            var $qualifiers = $when.find(".qualifiers");
            var $effects = $do.find(".effects");

            var effects = [];
            var qualifiers = [];

            // Qualifiers
            _.each($qualifiers.children(), function(qualifier){
                var $qualifier = $(qualifier);
                qualifiers.push({
                    key: $qualifier.find('.qualifier-key').val(),
                    operation: $qualifier.find('.qualifier-operation').val(),
                    value: $qualifier.find('.qualifier-value').val()
                });
            });

            // Effects
            _.each($effects.children(), function(_effect){
                var $effect = $(_effect);
                var effect = {
                    type: $effect.find('.effect-type').val(),
                    resource: {
                        type: $effect.find('.resource-type').val(),
                        source: $effect.find('.resource-source').val()
                    }
                };

                _.each($effect.find('.settings-field'), function(settingsField){
                    var $settingsField = $(settingsField);
                    var value = $settingsField.val();
                    var isRange = $settingsField.attr('type') == 'range';
                    effect[$settingsField.data('settings-key')] = isRange ? parseFloat(value) : value;
                });

                effects.push(effect);
            });

            settings.listeners.push({
                type: $when.find('.event-select').val(),
                qualifiers: qualifiers,
                effects: effects
            });
        });
        
        postJSON('/settings/save.json', {
            name: $settingsFile.val(),
            settings: settings
        }, function(){
            socket.send({ signal: 'reload' });
        });
    };


    // -------------------------------------- //
    // Settings - Save
    // -------------------------------------- //
    var socket = new Socket('127.0.0.1', 9003);
};