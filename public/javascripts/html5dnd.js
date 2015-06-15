//polyfill for safety as per http://www.html5rocks.com/en/tutorials/dnd/basics/
Element.prototype.hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
  if (!this.hasClassName(name)) {
    this.className = this.className ? [this.className, name].join(' ') : name;
  }
};

Element.prototype.removeClassName = function(name) {
  if (this.hasClassName(name)) {
    var c = this.className;
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), " ");
  }
};

//function to check for class
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

//function to create a GUID
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

//function to generate random HEX colour
function randomHexColour() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

//function to prevent enter key from submitting forms
function noenter() {
  return !(window.event && window.event.keyCode == 13); 
}

document.addEventListener("DOMContentLoaded", function(event) { 
    var id_ = 'cards';
    var cards_ = document.querySelectorAll('#' + id_ + ' .card');
    var sortSpace_ = document.querySelector('#sorting-space');
    var deck_ = document.querySelector('#right-sidebar');
    var dragSrcEl_ = null;

    function handleDragStart(e) {
        //this.style.opacity = '0.4';  // this / e.target is the source node.
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

        dragSrcEl_ = this;
        // this/e.target is the source node.
        this.addClassName(' moving');;
        
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        // this / e.target is the current hover target.
        this.addClassName('over');
    }

    function handleDragLeave(e) {
        this.removeClassName('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) {
        // this / e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if we're dropping on the same card we're dragging.
        if (dragSrcEl_ != this) {
            //if cards are being dropped in sorting space
            if ( sortSpace_ == this && ( hasClass(dragSrcEl_,'sortable') == false ) ) {
                console.log("An unsorted card is being placed in the sorting area");
                // then add sortable class to the source
                dragSrcEl_.addClassName(' sortable');;
                //move the source into the sorting space
                sortSpace_.appendChild(dragSrcEl_);
                //clean up the over class
                sortSpace_.removeClassName('over');
            } else if ( hasClass(this,'sortable') && hasClass(dragSrcEl_,'sortable') ) {
                //if a sortable card is being dropped onto another sortable card
                console.log("Both target and source are sortable");

                // if target is in a group
                if (hasClass(this.parentNode,'.group')) {
                    console.log("The target is in a group.");  
                    // if source is in a group as well
                    if (hasClass(dragSrcEl_.parentNode,'.group')) {
                        console.log("The source is in a group as well.");
                        // if target and source are both in the same group
                        if(this.parentNode.id == dragSrcEl_.parentNode.id) {
                            console.log("In fact, they are in the same group.");
                            // first clean up extra classes
                            dragSrcEl_.removeClassName('moving');
                            this.removeClassName('over');
                            // then make another group inside that group
                            var newGuid = guid();
                            var newColour = randomHexColour();
                            var groupContent = this.parentNode.innerHTML;

                            var oddOrEven = hasClass(this.parentNode,'odd') ? 'even': 'odd';
                            console.log("Odd or even?: " + oddOrEven);
                            //this.className = this.className ? [this.className, name].join(' ') : name;
                            this.parentNode.innerHTML = '<div class="group'+ oddOrEven +'" id="' + newGuid + '" style="border-color:' + newColour + ';"><input type="text" name="groupname" placeholder="Group Name Here..."></form><div class="delete-group">X</div>' + groupContent + '</div>';
                        } else { // if the source is in another group
                            console.log("However, they are in different groups.");
                            // first clean up extra classes
                            dragSrcEl_.removeClassName('moving');
                            this.removeClassName('over');
                            // then add it to the target's group
                            var groupContent = this.parentNode.innerHTML + dragSrcEl_.outerHTML;
                            this.parentNode.innerHTML = groupContent;
                            // then remove the source from it's original group
                            dragSrcEl_.outerHTML=null;
                        }
                    } else { // if the source is not in a group
                        console.log("But the source is not in a group.");
                        // first clean up extra classes
                        dragSrcEl_.removeClassName('moving');
                        this.removeClassName('over');
                        // then add it to the target's group
                        var groupContent = this.parentNode.innerHTML + dragSrcEl_.outerHTML;
                        this.parentNode.innerHTML = groupContent;
                        // then remove the source from the sorting area or deck
                        dragSrcEl_.outerHTML=null;
                    }
 
                } else { // else if target is not in a group
                    console.log("The target is not in a group.");
                    // if the source is in a group
                    if (hasClass(dragSrcEl_.parentNode,'group')) {
                        console.log("The source is in a group");
                        // first clean up extra classes
                        dragSrcEl_.removeClassName('moving');
                        this.removeClassName('over');
                        // then create a new group and add both the target and source to it
                        var newGuid = guid();
                        var newColour = randomHexColour();
                        var groupContent = this.outerHTML + dragSrcEl_.outerHTML;
                        var oddOrEven = hasClass(this.parentNode,'odd') ? 'even': 'odd';
                        console.log(" Odd or even?: " + oddOrEven);
                        this.outerHTML = '<div class="group '+ oddOrEven +'" id="' + newGuid + '"style="border-color:' + newColour + '"><input type="text" name="groupname" placeholder="Group Name Here..."></input><div class="delete-group">X</div>' + groupContent + '</div>';
                        // then remove the source from it's original group and the target from the deck
                        dragSrcEl_.outerHTML = null;
                    } else { // if the source is not in a group
                        console.log("The source is not in a group.");
                        // first clean up extra classes
                        dragSrcEl_.removeClassName('moving');
                        this.removeClassName('over');
                        // then replace the target with new group which contains both the target and source
                        var newGuid = guid();
                        var newColour = randomHexColour();
                        var groupContent = this.outerHTML + dragSrcEl_.outerHTML;
                        var oddOrEven = hasClass(this.parentNode,'odd') ? 'even': 'odd';
                        console.log("Odd or even?: " + oddOrEven);
                        this.outerHTML = '<div class="group '+ oddOrEven +'" id="' + newGuid + '"style="border-color:' + newColour + '"><input type="text" name="groupname" placeholder="Group Name Here..."></input><div class="delete-group">X</div>' + groupContent + '</div>';
                        // then remove the source from the deck or sorting area
                        dragSrcEl_.outerHTML = null;
                    }
                }
                // TODO: make cleaner group creations by using parentNode.appendChild instead of inner and outer HTML

            } else if ( hasClass(this,'sortable') && !hasClass(dragSrcEl_,'sortable') ) {
                //only the target card is sortable
                console.log("Only target is sortable");
                // first clean up extra classes
                dragSrcEl_.removeClassName('moving');
                this.removeClassName('over');
                // then add the sortable class name to the source
                dragSrcEl_.addClassName(' sortable');;
                // then add it to the target's group
                var groupContent = this.parentNode.innerHTML + dragSrcEl_.outerHTML;
                this.parentNode.innerHTML = groupContent;
                // then remove the source from the sorting area or deck
                dragSrcEl_.outerHTML=null;
            } else if ( !hasClass(this,'sortable') && hasClass(dragSrcEl_,'sortable') ) {
                //if the source card is sortable and the target is not
                console.log("Only source is sortable");
                // if the target is the sidebar
                if (this == deck_) {
                    console.log("The target is the deck");
                    // first clean up extra classes
                    dragSrcEl_.removeClassName('moving');
                    dragSrcEl_.removeClassName('sortable');
                    this.removeClassName('over');
                    // // then add card class back
                    // dragSrcEl_.addClassName('card');
                    // then add the source to the target (deck)
                    deck_.appendChild(dragSrcEl_);
                } else if ( hasClass(this,'group') ) { // if the target is a group
                    console.log("The target is a group");
                    // first clean up extra classes
                    dragSrcEl_.removeClassName('moving');
                    this.removeClassName('over');
                    // then add the sortable class to the source
                    dragSrcEl_.addClassName('sortable');
                    // then add the source to the target (group)
                    this.appendChild(dragSrcEl_);
                } else { //if the target is the sorting area
                    console.log("The target is neither a group nor the deck");
                    // first clean up extra classes
                    dragSrcEl_.removeClassName('moving');
                    this.removeClassName('over');
                    // then add the source to the target (sorting area)
                    sortSpace_.appendChild(dragSrcEl_);
                }
                
                
            } else {
                // if the target is the sidebar && the source is not already in the sidebar
                if ( hasClass(this,'right-sidebar') && dragSrcEl_.parentNode.id !='right-sidebar' ){
                    console.log('The source is moving into the sidebar from the sorting area.');
                    // first clean up extra classes
                    dragSrcEl_.removeClassName('moving');
                    this.removeClassName('over');
                    // then add the source to the target (deck)
                    this.appendChild(dragSrcEl_);
                } else if (hasClass(this,'group')){
                    console.log('The target is a group.');
                    // first clean up extra classes
                    dragSrcEl_.removeClassName('moving');
                    this.removeClassName('over');
                    // then add the sortable class to the source
                    dragSrcEl_.addClassName('sortable');
                    // then add the source to the target (group)
                    this.appendChild(dragSrcEl_);
                } else {
                    console.log("Swapping cards.");
                    dragSrcEl_.innerHTML = this.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text/html');
                }
            }

            console.log(this);
            console.log(dragSrcEl_);

            // Set number of times the card has been moved.
            var count = this.querySelector('.count');

            // var dataCardMoves = parseInt(count.getAttribute('data-card-moves')) || 0;
            // var newCount = dataCardMoves + 1;
            // count.setAttribute('data-card-moves', newCount);
            // count.textContent = 'moves: ' + newCount;  
        }

        //refresh event listener
        console.log("start refreshing event listener");
        refreshEventListener();
        
        return false;
    }

    function handleDragEnd(e) {
        // this/e.target is the source node.
        [].forEach.call(cards_, function (card) {
            card.removeClassName('over');
            card.removeClassName('moving');
        });

        // sortSpace_.removeClassName('over');
    }

    var cards = document.querySelectorAll('.card');
    [].forEach.call(cards, function(card) {
      card.addEventListener('dragstart', handleDragStart, false);
      card.addEventListener('dragenter', handleDragEnter, false);
      card.addEventListener('dragover', handleDragOver, false);
      card.addEventListener('dragleave', handleDragLeave, false);
      card.addEventListener('drop', handleDrop, false);
      card.addEventListener('dragend', handleDragEnd, false);
    });


    function refreshEventListener() {
        console.log("running event listener refresh");
        var cards = document.querySelectorAll('.card');
        console.log(cards);
        [].forEach.call(cards, function(card) {
          card.addEventListener('dragstart', handleDragStart, false);
          card.addEventListener('dragenter', handleDragEnter, false);
          card.addEventListener('dragover', handleDragOver, false);
          card.addEventListener('dragleave', handleDragLeave, false);
          card.addEventListener('drop', handleDrop, false);
          card.addEventListener('dragend', handleDragEnd, false);
        });

        var groups = document.querySelectorAll('.group');
        console.log(groups);
        [].forEach.call(groups, function(group) {
          // card.addEventListener('dragstart', handleDragStart, false);
          group.addEventListener('dragenter', handleDragEnter, false);
          group.addEventListener('dragover', handleDragOver, false);
          group.addEventListener('dragleave', handleDragLeave, false);
          group.addEventListener('drop', handleDrop, false);
          // card.addEventListener('dragend', handleDragEnd, false);
        });
        
        var deleteGroupButtons = document.querySelectorAll('.delete-group');
        //for each delete-group button
        [].forEach.call(deleteGroupButtons, function(button) {
            //add event listener for deleting the parent on click
            //button.addEventListener('click', button.parentNode.outerHTML = null, false);

            // //if the parent doesn't have nested groups
            // if ( !hasClass(button.parentNode.parentNode,'group') ) {
            //     //add event listener for deleting the parent on click
            //     button.addEventListener('click', button.parentNode);
            // } else { //if the parent has nested groups
               
                
            // }
        });
    }

    // var cardsBeingSorted = document.querySelectorAll('#sorting-space .card');
    // [].forEach.call(cardsBeingSorted, function(card) {
    //   card.removeEventListener('dragstart', handleDragStart, false);
    //   card.removeEventListener('dragenter', handleDragEnter, false);
    //   card.removeEventListener('dragover', handleDragOver, false);
    //   card.removeEventListener('dragleave', handleDragLeave, false);
    //   card.removeEventListener('drop', handleDrop, false);
    //   card.removeEventListener('dragend', handleDragEnd, false);
    // });

    // sortSpace_.addEventListener('dragstart', handleDragStart, false);
    sortSpace_.addEventListener('dragenter', handleDragEnter, false);
    sortSpace_.addEventListener('dragover', handleDragOver, false);
    sortSpace_.addEventListener('dragleave', handleDragLeave, false);
    sortSpace_.addEventListener('drop', handleDrop, false);
    // sortSpace_.addEventListener('dragend', handleDragEnd, false);


    deck_.addEventListener('dragenter', handleDragEnter, false);
    deck_.addEventListener('dragover', handleDragOver, false);
    deck_.addEventListener('dragleave', handleDragLeave, false);
    deck_.addEventListener('drop', handleDrop, false);
});
