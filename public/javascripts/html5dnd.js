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
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
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
    var dragSrcEl_ = null;

    function handleDragStart(e) {
        //this.style.opacity = '0.4';  // this / e.target is the source node.
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

        dragSrcEl_ = this;
        // this/e.target is the source node.
        this.addClassName('moving');
        
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
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) {
        // this / e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if we're dropping on the same card we're dragging.
        if (dragSrcEl_ != this) {
            
            if ( sortSpace_ == this && ( hasClass(dragSrcEl_,'card-sortable') == false ) ) {
                //if cards are being dropped in sorting space
                console.log("An unsorted card is being placed in the sorting area");
                dragSrcEl_.addClassName('-sortable');
                sortSpace_.appendChild(dragSrcEl_);
                sortSpace_.removeClassName('over');
            } else if ( hasClass(this,'card-sortable') && hasClass(dragSrcEl_,'card-sortable') ) {
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
                            this.parentNode.innerHTML = '<div class="group" id="' + newGuid + '" style="border-color:' + newColour + ';"><form><input type="text" name="' + newGuid + '_input" placeholder="Group Name Here..."></input></form>' + groupContent + '</div>';
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
                    if (hasClass(dragSrcEl_.parentNode,'.group')) {
                        console.log("The source is in a group");

                        // then create a new group and add both the target and source to it
                        // then remove the source from it's original group and the target from the deck
                    } else { // if the source is not in a group
                        console.log("The source is not in a group.");
                        // first clean up extra classes
                        dragSrcEl_.removeClassName('moving');
                        this.removeClassName('over');
                        // then replace the target with new group which contains both the target and source
                        var newGuid = guid();
                        var newColour = randomHexColour();
                        var groupContent = this.outerHTML + dragSrcEl_.outerHTML;
                        this.outerHTML = '<div class="group" id="' + newGuid + '"style="border-color:' + newColour + '"><form><input type="text" placeholder="Group Name Here..."></input></form>' + groupContent + '</div>';
                        // then remove the source from the deck or sorting area
                        dragSrcEl_.outerHTML = null;
                    }
                }

            } else if ( hasClass(this,'card-sortable') && !hasClass(dragSrcEl_,'card-sortable') ) {
                //do nothing if only the target card is sortable
                console.log("Only target is sortable");
            } else if ( !hasClass(this,'card-sortable') && hasClass(dragSrcEl_,'card-sortable') ) {
                //if the source card is sortable and the target is not
                console.log("Only source is sortable");
                // then add the source to the target (sorting area)
                sortSpace_.appendChild(dragSrcEl_);
                // then remove the source from its group
                //dragSrcEl_.innerHTML=null;
                dragSrcEl_.removeClassName('moving');
            } else { // Otherwise switch cards as usual
                console.log("Swapping cards.");
                dragSrcEl_.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
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

        groupEventListener();
        console.log("run group event listener");

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

    var cards = document.querySelectorAll('#cards .card');
    [].forEach.call(cards, function(card) {
      card.addEventListener('dragstart', handleDragStart, false);
      card.addEventListener('dragenter', handleDragEnter, false);
      card.addEventListener('dragover', handleDragOver, false);
      card.addEventListener('dragleave', handleDragLeave, false);
      card.addEventListener('drop', handleDrop, false);
      card.addEventListener('dragend', handleDragEnd, false);
    });


    function groupEventListener() {
        console.log("running group event listener");
        var groupedCards = document.querySelectorAll('.group .card-sortable');
        console.log(groupedCards);
        [].forEach.call(groupedCards, function(card) {
          card.addEventListener('dragstart', handleDragStart, false);
          card.addEventListener('dragenter', handleDragEnter, false);
          card.addEventListener('dragover', handleDragOver, false);
          card.addEventListener('dragleave', handleDragLeave, false);
          card.addEventListener('drop', handleDrop, false);
          card.addEventListener('dragend', handleDragEnd, false);
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

});
