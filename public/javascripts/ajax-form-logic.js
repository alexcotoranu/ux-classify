
function saveDeck(name,cardArray,dateCreated){
  console.log("Deck is being saved");
  
  var data = {
    name: name,
    cards: JSON.stringify(cardArray),
    dateCreated: dateCreated
  };

  console.log(data);

  //save groups
  $.ajax({
    url: '/decks/save',
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

function saveGroup(id,name,cardArray,groupArray){
  // event.preventDefault(); // Stop the form from causing a page refresh.
  // event.unbind(); // this is supposed to stop multiple form submissions
  console.log("Groups are being saved");
  
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
  $.ajax({
    url: '/projects/save',
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


$(document).ready(function() {

  $('#save-btn').on("click", function(){
    console.log("Save was clicked");
    $('.group').each(function() {
      var parentGroup = $(this);
      var parentGroupID = parentGroup.attr('id');
      console.log("Group ID: " + parentGroupID);
     
      //select only input directly inside the group 
      var inputSelector = '#' + parentGroupID +' > input';
      console.log(inputSelector);
      //group name from user input
      var parentGroupName = $(inputSelector).val();

      // custom group changed event listener
      //parentGroup.on("group:changed", function (){
        console.log("Group has changed.");
        console.log("parentGroupName: " + parentGroupName);
        var cardsInGroup = [];
        var groupsInGroup = [];
        //select only cards directly inside the group 
        var cardSelector = '#' + parentGroupID +' > .card';
        //console.log(cardSelector);
        //select only groups directly inside the group 
        var groupSelector = '#' + parentGroupID +' > .group';
        //console.log(groupSelector);
        
        // for each card in the group
        $(cardSelector).each(function(){
          var cardID = $(this).attr('id');
          // append it to the list of cards like so: cardsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
          cardsInGroup.push(cardID);
          console.log(cardsInGroup);
        });

        // for each card in the group
        $(groupSelector).each(function(){
          var groupID = $(this).attr('id');
          // append it to the list of cards like so: groupsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
          groupsInGroup.push(groupID);
          console.log(groupID);
        });

        saveGroup(parentGroupID,parentGroupName,cardsInGroup,groupsInGroup);
      //});

      // $(inputSelector).on('change', function () {
      //   parentGroup.trigger("group:changed");
      // });

    });


  });

});