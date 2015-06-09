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
            // Check if cards are being dropped in sorting space
            if (sortSpace_ == this){
                sortSpace_.appendChild(dragSrcEl_);
            // Otherwise shuffle as usual
            } else {
                dragSrcEl_.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }

            // Set number of times the card has been moved.
            var count = this.querySelector('.count');

            // var newCount = parseInt(count.getAttribute('data-card-moves')) + 1;
            var dataCardMoves = parseInt(count.getAttribute('data-card-moves')) || 0;
            var newCount = dataCardMoves + 1;
            count.setAttribute('data-card-moves', newCount);
            count.textContent = 'moves: ' + newCount;  
        }

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

    var cardsBeingSorted = document.querySelectorAll('#sorting-space .card');
    [].forEach.call(cardsBeingSorted, function(card) {
      card.addEventListener('dragstart', handleDragStart, false);
      card.addEventListener('dragenter', handleDragEnter, false);
      card.addEventListener('dragover', handleDragOver, false);
      card.addEventListener('dragleave', handleDragLeave, false);
      card.addEventListener('drop', handleDrop, false);
      card.addEventListener('dragend', handleDragEnd, false);
    });

    sortSpace_.addEventListener('dragstart', handleDragStart, false);
    sortSpace_.addEventListener('dragenter', handleDragEnter, false);
    sortSpace_.addEventListener('dragover', handleDragOver, false);
    sortSpace_.addEventListener('dragleave', handleDragLeave, false);
    sortSpace_.addEventListener('drop', handleDrop, false);
    sortSpace_.addEventListener('dragend', handleDragEnd, false);

});
