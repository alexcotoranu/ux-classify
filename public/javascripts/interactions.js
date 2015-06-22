

$(document).ready(function() {
    // save button logic
    $('#save-btn').on("click", function(){
        // console.log("Save was clicked");
        $('.group').each(function() {
            var id = $(this).attr('id');
            saveGroup(id);
        });
    });

    // group name change logic
    $('#sorting-space').on('change','.group-name', function () {
        var id = $(this).parent('.group').attr('id');
        saveGroup(id);
    });

});

// drag and drop functionality
$(document).ready(function(){
    //add dataTransfer property to jQuery
    $.event.props.push('dataTransfer');

    var sortSpace = $('#sorting-space');
    var deck = $('#right-sidebar');
    var source = null;

    function handleDragStart(e) {
        //this.style.opacity = '0.4';  // this / e.target is the source node.
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/html', $(this).innerHTML);

        source = $(this);
        // this/e.target is the source node.
        $(this).addClass('moving');
        
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.originalEvent.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        // this / e.target is the current hover target.
        $(this).addClass('over');
    }

    function handleDragLeave(e) {
         // this / e.target is previous target element.
        $(this).removeClass('over');
        // console.log("You are leaving: ");
        // console.log($(this));
        // console.log(this);
        //console.log(source);
        // console.log(e.target);
    }

    function handleDrop(e) {
        // this / e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }


        // console.log(source);
        // console.log(e.target.id);

        var targetID = e.target.id;
        var target = $('#'+targetID);

        // console.log($(this).attr('id'))
        // console.log($(source).attr('id'))

        // Don't do anything if target is source.
        if (source != target) {
            // console.log(target);
            // console.log(source);
            //if source card is being dropped into the sorting space from the sidebar
            if ( sortSpace.attr('id') == target.attr('id') && source.hasClass('sortable') == false ) {
                console.log("An unsorted card is being placed in the sorting area");
                // then add sortable class to the source
                source.addClass('sortable');
                //move the source into the sorting space
                sortSpace.append(source);
                //clean up the over class
                sortSpace.removeClass('over');
            } else if (target.hasClass('sortable') && source.hasClass('sortable') ) {
                //if a sortable card is being dropped onto another sortable card
                console.log("Both target and source are sortable");
                // first clean up extra classes
                source.removeClass('moving');
                target.removeClass('over');
                // then replace the target with new group which contains both the target and source
                createGroup(target,source);
            } else if ( target.hasClass('sortable') && !source.hasClass('sortable') ) {
                //only the target card is sortable
                console.log("Only target is sortable");
                // first clean up extra classes
                source.removeClass('moving');
                target.removeClass('over');
                // then add the sortable class name to the source
                source.addClass('sortable');
                // then replace the target with new group which contains both the target and source
                createGroup(target,source);
            } else if ( !target.hasClass('sortable') && source.hasClass('sortable') ) {
                //if the source card is sortable and the target is not
                console.log("Only source is sortable");
                // if the target is the sidebar
                if (target == deck) {
                    console.log("The target is the deck");
                    // first clean up extra classes
                    source.removeClass('moving');
                    source.removeClass('sortable');
                    target.removeClass('over');
                    // then add the source to the target (deck)
                    deck.append(source);
                } else if ( target.hasClass('group') ) { // if the target is a group
                    console.log("The target is a group");
                    // first clean up extra classes
                    source.removeClass('moving');
                    target.removeClass('over');
                    // then add the sortable class to the source
                    source.addClass('sortable');
                    // then add the source to the target (group)
                    target.append(source);
                } else { //if the target is the sorting area
                    console.log("The target is neither a group nor the deck");
                    // first clean up extra classes
                    source.removeClass('moving');
                    target.removeClass('over');
                    // then add the source to the target (sorting area)
                    sortSpace.append(source);
                }
            } else {
                // if the target is the sidebar && the source is not already in the sidebar
                if ( target.parent().attr('id') == ('right-sidebar') && source.parent().attr('id') != 'right-sidebar' ){
                    console.log('The source is moving into the sidebar from the sorting area.');
                    // first clean up extra classes
                    source.removeClass('moving');
                    target.removeClass('over');
                    // then add the source to the target (deck)
                    target.append(source);
                } else if (target.hasClass('group')){
                    console.log('The target is a group.');
                    // first clean up extra classes
                    source.removeClass('moving');
                    target.removeClass('over');
                    // then add the sortable class to the source
                    source.addClass('sortable');
                    // then add the source to the target (group)
                    target.append(source);
                } else {
                    console.log("Swapping cards.");
                    var targetHTML = target[0].innerHTML;
                    var sourceHTML = source[0].innerHTML;
                    source[0].innerHTML = targetHTML;
                    target[0].innerHTML = sourceHTML;
                }
            }
        }

        return false;
    }

    function handleDragEnd(e) {
        $(this).removeClass('over');
        console.log($(this));
        source.removeClass('moving');
    }

    $(document).on('dragstart', '.card', handleDragStart);
    $(document).on('dragenter', '.card', handleDragEnter);
    $(document).on('dragover', '.card', handleDragOver);
    $(document).on('dragleave', '.card', handleDragLeave);
    $(document).on('drop', '.card', handleDrop);
    $(document).on('dragend', '.card', handleDragEnd);

    sortSpace.on('dragenter', handleDragEnter);
    sortSpace.on('dragover', handleDragOver);
    sortSpace.on('dragleave', handleDragLeave);
    sortSpace.on('drop', handleDrop);

    deck.on('dragenter', handleDragEnter);
    deck.on('dragover', handleDragOver);
    deck.on('dragleave', handleDragLeave);
    deck.on('drop', handleDrop);

});
