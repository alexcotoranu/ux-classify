
$(document).ready(function() {

    //::::::::: PROJECTS
    // "create new" button logic
    $('#new-btn.new-project').on("click", function(){
        // console.log("Create New was clicked");
        var name = $('input.project-name').val();
        // console.log(name);
        createProject(name);
    });

    //::::::::: EXPERIMENTS

    // $(document).on("click",".experiment", function(){
    //     var experimentId = $(this).attr('id');
    //     $('#page-wrapper').load('/projects/experiments/'+experimentId);
    // });


    // "create new" button logic
    $(document).on('click', '#create-experiment', function() {
        // console.log("Create New was clicked");
        var name = $('input#experiment-name').val();
        var project = $('input#experiment-project').val();
        var category = $('select#experiment-category').val();
        var deck = $('select#experiment-deck').val();
        console.log(name);
        createExperiment(name,project,category,deck);
    });

    $(document).on('click', '#accept-instructions', function() {
        $('#instructions-modal').modal('toggle');
        graduateUser();
    });

    //::::::::: DECKS & NEW CARDS
    // "create new" button logic
    $('#new-btn.new-deck').on("click", function(){
        // console.log("Create New was clicked");
        var name = $('input.deck-name').val();
        // console.log(name);
        createDeck(name);
    });

    $(document).on("click",".deck", function(){
        var deckId = $(this).attr('id');
        $('#page-wrapper').load('/decks/'+deckId);
    });

    // selecting cards for deck
    $(document).on('click','#all-cards .card', function () {
        $(this).toggleClass('selected');
    });
    // save deck deck
    $(document).on('click','#save-deck', function () {
        var id = $(this).attr('data-deck-id');
        console.log(id);
        saveDeck(id);
    });

    //add new card (during deck management)
    $(document).on('click', '#submit-card', function () {
        var word = $('#inputWord').val();
        var example = $('#inputExample').val();
        createCard(word,example);
    });

    //add new card (during deck management)
    $(document).on('click', '#submit-custom-card', function () {
        var word = $('#inputWord').val();
        var example = $('#inputExample').val();
        var isCustom = true;
        createCard(word,example,isCustom);
    });


    //::::::::: CARDS & GROUPS
    // "save session" button logic
    $('#save-session').on("click", function(){
        // console.log("Save was clicked");
        var groups = [];
        $('.group').each(function() {
            var id = $(this).attr('id');
            saveGroup(id);
            groups.push(id);
        });
        var sessionId = $(this).attr('data-session-id');
        saveSession(sessionId,groups);
    });

     $('#setup-session').on("click", function(){
        // console.log("Save was clicked");
        var groups = [];
        $('.group').each(function() {
            var id = $(this).attr('id');
            saveGroup(id);
            groups.push(id);
        });
        var sessionId = $(this).attr('data-session-id');
        setupSession(sessionId,groups);
    });

    // group name change logic
    $(document).on('change','input.group-name', function () {
        var id = $(this).parent('.group').attr('id');
        saveGroup(id);
    });

    

    
});

// drag and drop functionality
$(document).ready(function(){
    //add dataTransfer property to jQuery
    $.event.props.push('dataTransfer');

    var sortSpace = $('#sorting-space');
    var deck = $('#deck-session-sidebar');
    var managedDeck = $('#deck-management-sidebar');
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
        console.log("You are entering: ");
        console.log($(this));
    }

    function handleDragLeave(e) {
         // this / e.target is previous target element.
        $(this).removeClass('over');
        console.log("You are leaving: ");
        console.log($(this));
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
        if (source.attr('id') != target.attr('id')) {
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
                if (target.attr('id') == deck.attr('id')) {
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
                    // source.addClass('sortable');
                    // then add the source to the target (group)
                    target.append(source);
                } else if ( target.hasClass('group-name') ) { //if the target is accidentaly a name input
                    console.log("The target is supposed to be a group, but was name input");
                    target = target.parent('.group');
                    // first clean up extra classes
                    source.removeClass('moving');
                    target.removeClass('over');
                    // then add the source to the target (group)
                    target.append(source);
                }  else  { //if the target is the sorting area
                    console.log("The target is neither a group nor the deck");
                    console.log(target);
                    // first clean up extra classes
                    source.removeClass('moving');
                    target.removeClass('over');
                    // then add the source to the target (sorting area)
                    sortSpace.append(source);
                }
            } else {
                // if the target is the sidebar && the source is not already in the sidebar
                if ( target.parent().attr('id') == ('deck-session-sidebar') && source.parent().attr('id') != 'deck-session-sidebar' ){
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
                } else if (target.attr('id') == ('deck-management-sidebar')) {
                    console.log("Target is deck-management-sidebar");
                    console.log(source);
                    // if ( !$('#deck-management-sidebar #'+source.attr('id')) ) {
                        console.log('Card is not already in deck, so adding it.');
                        // first clean up extra classes
                        source.removeClass('moving');
                        target.removeClass('over');
                        // then add the source to the target (deck-management-sidebar)
                        target.append(source);
                    // } else {
                    //     console.log("Nothing should happen");
                    //     target.removeClass('over');
                    // }
                } else {
                    console.log("Swapping cards.");
                    var targetHTML = target[0].innerHTML;
                    var sourceHTML = source[0].innerHTML;
                    source[0].innerHTML = targetHTML;
                    target[0].innerHTML = sourceHTML;
                }
            }
        } else {
            if (target.hasClass('sortable') && source.hasClass('sortable')) { //redundant since it's the same card, but it shouldn't hurt
                // first clean up extra classes
                source.removeClass('moving');
                target.removeClass('over');
                // then replace the target with new group which contains both the target and source
                createGroup(target,source);
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

    $(document).on('dragenter', '.group', handleDragEnter);
    $(document).on('dragover', '.group', handleDragOver);
    $(document).on('dragleave', '.group', handleDragLeave);
    $(document).on('drop', '.group', handleDrop);

    sortSpace.on('dragenter', handleDragEnter);
    sortSpace.on('dragover', handleDragOver);
    sortSpace.on('dragleave', handleDragLeave);
    sortSpace.on('drop', handleDrop);

    deck.on('dragenter', handleDragEnter);
    deck.on('dragover', handleDragOver);
    deck.on('dragleave', handleDragLeave);
    deck.on('drop', handleDrop);

    managedDeck.on('dragenter', handleDragEnter);
    managedDeck.on('dragover', handleDragOver);
    managedDeck.on('dragleave', handleDragLeave);
    managedDeck.on('drop', handleDrop);

});
