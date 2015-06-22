
function saveDeck(name,cardArray,dateCreated){
    console.log("Deck is being saved");
  
    var data = {
        name: name,
        cards: JSON.stringify(cardArray),
        dateCreated: dateCreated
    };

    console.log(data);

    //save groups
    var post = $.ajax({
        url: '/decks/',
        type: 'POST',
        data: data,
        success:function(data, textStatus, jqXHR) 
        {
            //data: return data from server
            console.log(data);
            console.log("Deck was successfully POSTED.");
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            //if fails
            console.log(errorThrown);
        }
    });

    post.done(function(res){
        console.log(res);
        var deck = JSON.parse(res);
        var newDeck = '<div id="'+deck._id+'" class="project"><div class="name">'+deck.name+'</div></div>'; //<div class="date">'+project.dateCreated+'</div>
        $('.decks').prepend(newDeck);
    });
}

function saveGroup(id){
  console.log("Group " + id + " is being saved!");
  //select only input directly inside the group 
  var nameInput = '#' + id +' > input';
  //group name from user input
  var name = $(nameInput).val();
  var cardArray = [];
  var groupArray = [];
  //select only cards directly inside the group 
  var nestedCards = '#' + id +' > .card';
  //select only groups directly inside the group 
  var nestedGroups = '#' + id +' > .group';
  // for each card in the group
  $(nestedCards).each(function(){
    var cardID = $(this).attr('id');
    // append it to the list of cards like so: cardsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
    cardArray.push(cardID);
    // console.log(cardsInGroup);
  });
  // for each card in the group
  $(nestedGroups).each(function(){
    var groupID = $(this).attr('id');
    // append it to the list of cards like so: groupsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
    groupArray.push(groupID);
    // console.log(groupID);
  });

  var data = {
    id: id,
    name: name,
    cards: JSON.stringify(cardArray),
    groups: JSON.stringify(groupArray)
  };

  console.log(data);

  //save groups
  $.ajax({
    url: '/groups/save',
    type: 'POST',
    data: data,
    success:function(data, textStatus, jqXHR) 
    {
        //data: return data from server
        console.log(data);
        console.log("Groups were successfully POSTED.");
    },
    error: function(jqXHR, textStatus, errorThrown) 
    {
        //if fails 
        console.log(errorThrown);     
    }
  });
}

function saveCard(word,example,dateCreated,isCustom){
  console.log("Cards are being saved");
  
  var data = {
    word: word,
    example: example,
    dateCreated: dateCreated,
    isCustom: isCustom
  };

  console.log(data);

  //save groups
  $.ajax({
    url: '/cards/save',
    type: 'POST',
    data: data,
    success:function(data, textStatus, jqXHR) 
    {
        //data: return data from server
        console.log(data);
        console.log("Project was successfully POSTED.");
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
        //if fails
        console.log(errorThrown);
    }
  });
}

function saveParticipant(name,dateJoined){
  console.log("Participant is being saved");
  
  var data = {
    name: name,
    dateJoined: dateJoined
  };

  console.log(data);

  //save groups
  $.ajax({
    url: '/participants/save',
    type: 'POST',
    data: data,
    success:function(data, textStatus, jqXHR) 
    {
        //data: return data from server
        console.log(data);
        console.log("Participant was successfully POSTED.");
    },
    error: function(jqXHR, textStatus, errorThrown) 
    {
        //if fails 
        console.log(errorThrown);
    }
  });
}

function saveSession(experiment,participant,groupArray,dateHeld){
  console.log("Session is being saved");
  
  var data = {
    experiment: experiment,
    participant: participant,
    groups: JSON.stringify(groupArray),
    dateHeld: dateHeld
  };

  console.log(data);

  //save groups
  $.ajax({
    url: '/sessions/save',
    type: 'POST',
    data: data,
    success:function(data, textStatus, jqXHR) 
    {
        //data: return data from server
        console.log(data);
        console.log("Session was successfully POSTED.");
    },
    error: function(jqXHR, textStatus, errorThrown) 
    {
        //if fails 
        console.log(errorThrown);
    }
  });
}

function saveProject(name,dateCreated){
    console.log("Project is being saved");
  
    var data = {
        name: name,
        dateCreated: dateCreated
    };

    console.log(data);

    //save groups
    var post = $.ajax({
        url: '/projects/',
        type: 'POST',
        data: data,
        success:function(data, textStatus, jqXHR){
            //data: return data from server
            console.log(data);
            console.log("Project was successfully POSTED.");
        },
        error: function(jqXHR, textStatus, errorThrown){
            //if fails
            console.log(errorThrown);
        }
    });

    post.done(function(res){
        console.log(res);
        var project = JSON.parse(res);
        var newProject = '<div id="'+project._id+'" class="project"><div class="name">'+project.name+'</div></div>'; //<div class="date">'+project.dateCreated+'</div>
        // var newProject = '<div class="project">BLANK TEST</div>';
        $('.projects').prepend(newProject);
    });
}



function parentIsGroup(childId) {
    if ($("#"+childId).parent().hasClass('group')){
        return true;
    } else {
        return false;
    }
}


function createGroup(target, source){
    //the target's id
    targetId = target.attr('id');
    //the source's id
    sourceId = source.attr('id');

    // targetParentId = target.parentNode.id;
    // sourceParentId = source.parentNode.id;

    // if (parentIsGroup(targetId)){
    //     console.log('The TargetParent IS a group!!!');
    //     saveGroup(targetParentId);
    // }

    // if (parentIsGroup(sourceId)){
    //     console.log('The SourceParent IS a group!!!');
    //     saveGroup(sourceParentId);
    // }

    console.log("Group is being created for: " + targetId + " and " + sourceId);

    // var groupContent = group.innerHTML;
    var newGuid = guid();
    var newColour = randomHexColour();
    var oddOrEven = target.parent().hasClass('odd') ? 'even': 'odd';

    //combined content
    var groupContent = target[0].outerHTML + source[0].outerHTML;
    console.log(groupContent);

    // var data = {
    // };

    // save groups
    var post = $.ajax({
        url: '/groups/new',
        type: 'POST',
        // data: data,
        success:function(data, textStatus, jqXHR){
          // console.log(data);
          console.log("New Group was successfully POSTED.");
          // console.log(textStatus);
          // console.log(jqXHR);
        },
        error: function(jqXHR, textStatus, errorThrown){
          //if fails 
          console.log(errorThrown);     
        }
    });

    post.done(function(res){
        console.log("This will be the group ID: "+ res);
        groupHtml ='<div class="group '+ oddOrEven +'" id="' + res + '" style="border-color:' + newColour + ';"><input type="text" class="group-name" name="groupname" placeholder="Group Name Here..."><div class="delete-group">X</div>'+ groupContent +'</div>';
        target.replaceWith(groupHtml);
        source.remove();
        saveGroup(res);
        
        // if (parentIsGroup(res)){
        //     console.log('The Parent IS a group!!!');
        //     var parentGroup = $("#"+res).parent().attr('id');
        //     saveGroup(parentGroup);
        // }

    });
}