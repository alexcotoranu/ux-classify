function graduateUser() {
     $.ajax({
        url: '/graduateuser',
        type: 'POST',
        success:function(data, textStatus, jqXHR) 
        {
            console.log("Participant has read the instructions.");
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            console.log(errorThrown);
        }
    });
}


function createDeck(name,cardArray,dateCreated){
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

function saveDeck(id){
    console.log("Group " + id + " is being saved!");
    var cardArray = [];
    //select only cards directly inside the group 
    var selectedCards = '#deck-management-sidebar .card';
    $(selectedCards).each(function(){
        var cardID = $(this).attr('id');
        console.log("Adding card: "+ cardID);
        // append it to the list of cards like so: cardsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
        cardArray.push(cardID);
        // console.log(cardsInGroup);
    });

    var data = {
        cards: JSON.stringify(cardArray),
    };

    console.log(data);

    //save groups
    $.ajax({
        url: '/decks/'+id,
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
}

function createCard(word,example,isCustom){
    console.log("Cards are being saved");
  
    if (!isCustom) {
        isCustom = false;
    } else {
        isCustom = true;
    }

    var data = {
        word: word,
        example: example,
        isCustom: isCustom
    };

    console.log(data);

    //save groups
    var post = $.ajax({
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

    post.done(function(res){
        console.log(res);
        var card = JSON.parse(res);
        console.log(card);
        var newCard = '<div id="'+card._id+'" draggable="true" class="card custom-card">' +
        '<div class="word">'+card.word+'</div>' +
        '<div class="example">'+card.example+'</div>' +
        '<div class="footer">' +
            '<div class="option">' +
                '<form action="/cards/'+card._id+'/edit" method="post" enctype="application/x-wwww-form-urlencoded">' +
                    '<input type="hidden" value="DELETE" name="_method">' +
                    '<button type="submit">Delete</button>' +
                '</form>' +
            '</div>' +
            '<div class="option">' +
                '<a href="/cards/'+card._id+'/edit">Edit</a>' +
            '</div>' +
            '<div class="option">' +
                '<a href="/cards/'+card._id+'">Show</a>' +
            '</div>' +
        '</div>';
        console.log(newCard);
        if (!isCustom) {
            $('#all-cards').prepend(newCard);
        } else {
            $('#cards').prepend(newCard);
        }
        

        $('#modal').modal('toggle');
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

function saveSession(sessionId, groupArray){
    console.log("Session is being saved");
  
    var data = {
        groups: JSON.stringify(groupArray),
        sessionid: sessionId 
    };

    console.log(data);

    //save groups
    var post = $.ajax({
        url: window.location.pathname,
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

    post.done(function(res){
        var thankYou = '<div class="well"><h1>Thank you for participating!</h1></div>';
        $('#content-container').html(thankYou);
    });
}

function setupSession(sessionId, groupArray){
    console.log("Session is being saved");
  
    var data = {
        groups: JSON.stringify(groupArray),
        sessionid: sessionId 
    };

    console.log(data);

    //save groups
    var post = $.ajax({
        url: window.location.pathname,
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

    post.done(function(res){
        var thankYou = '<div class="well"><h1>The Closed Experiment is now ready!</h1></div>';
        $('#content-container').html(thankYou);
    });
}

// function createSession(project, experiment){
//   console.log("Session is being created");
//   console.log(project);
//   console.log(experiment);

//   //save groups
//   $.ajax({
//     url: '/'+project+'/'+experiment+'/new',
//     type: 'POST',
//     success:function(data, textStatus, jqXHR) 
//     {
//         //data: return data from server
//         console.log(data);
//         console.log("Session was successfully POSTED.");
//     },
//     error: function(jqXHR, textStatus, errorThrown) 
//     {
//         //if fails 
//         console.log(errorThrown);
//     }
//   });
// }

function createExperiment(name,project,category,deck){
    console.log("Experiment is being created");
  
    var data = {
        name: name,
        project: project,
        category: category,
        deck: deck
    };

    console.log(data);

    //save groups
    var post = $.ajax({
        url: '/experiments/',
        type: 'POST',
        data: data,
        success:function(data, textStatus, jqXHR){
            //data: return data from server
            console.log(data);
            console.log("Experiment was successfully POSTED.");
        },
        error: function(jqXHR, textStatus, errorThrown){
            //if fails
            console.log(errorThrown);
        }
    });

    post.done(function(res){
        console.log(res);
        var experiment = JSON.parse(res);
        if (experiment.category == 'closed') {
            var newExperiment = '<a href="/projects/'+experiment.project+'/'+experiment._id+'/setup"><div id="'+experiment._id+'" class="experiment closed unset"><div class="name">'+experiment.name+'</div></div></a>';
        } else {
            var newExperiment = '<a href="/projects/'+experiment.project+'/'+experiment._id+'"><div id="'+experiment._id+'" class="experiment '+experiment.category+'"><div class="name">'+experiment.name+'</div></div></a>';
        }
        $('.experiments').prepend(newExperiment);
        $('#modal').modal('toggle');
    });
}

function createProject(name){
    console.log("Project is being saved");
  
    var data = {
        name: name
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
    if (targetId != sourceId) {
      var groupContent = target[0].outerHTML + source[0].outerHTML;
    } else {
      var groupContent = target[0].outerHTML;
    }
    console.log(groupContent);

    // save groups
    var post = $.ajax({
        url: '/groups/new',
        type: 'POST',
        success:function(data, textStatus, jqXHR){
          console.log("New Group was successfully POSTED.");
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(errorThrown);     
        }
    });

    post.done(function(res){
        console.log("This will be the group ID: "+ res);
        groupHtml ='<div class="group '+ oddOrEven +'" id="' + res + '" style="border-color:' + newColour + ';"><input type="text" class="group-name" name="groupname" placeholder="Group Name Here..."><div class="delete-group no-highlight">X</div>'+ groupContent +'</div>';
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