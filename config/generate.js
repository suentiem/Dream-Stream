var generateSelect = function(options, selected, groupBy) {
    var $select = $('<select />').addClass('form-control');
    var $group = null;
    _.each(options, function(option){
        var $option = $('<option />');

        var value, name;
        if (typeof(option) === 'object') {
            name = option.name;
            value = option.value;
        } else {
            name = option;
            value = option;
        }

        if (groupBy) {
            var groupSplit = name.split(groupBy);
            name = groupSplit.pop();
            var groupName = groupSplit.join(' -> ');

            if (!$group || $group.attr('label') !== groupName) {
                if ($group)
                    $select.append($group);

                if (groupName)
                    $group = $('<optgroup />').attr('label', groupName);
                else
                    $group = null;
            }
        }

        $option.val(value).text(name);

        if ($group)
            $group.append($option);
        else
            $select.append($option);
    });
    if ($group)
        $select.append($group);
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