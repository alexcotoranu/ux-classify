$(document).ready(function() {
  $('.group').each(function() {
    var parentGroup = $(this);
    var parentGroupID = parentGroup.attr('id');

   
    //select only input of the form directly inside the group 
    var inputSelector = '#' + parentGroupID +' > form input';
    //group name from user input
    var parentGroupName = $(inputSelector).attr('value');


    function saveGroup(id,name,cards,groups){
      // event.preventDefault(); // Stop the form from causing a page refresh.
      // event.unbind(); // this is supposed to stop multiple form submissions
      console.log("something is being saved");
      
      var data = {
        guid: id,
        name: name,
        cards: cards,
        groups: groups
      };

      $.ajax({
        url: '/savegroup',
        type: 'POST',
        data: data,
        success:function(data, textStatus, jqXHR) 
        {
            //data: return data from server
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            //if fails 
            console.log(errorThrown);     
        }
      });
    }

    // custom group changed event listener
    parentGroup.on("group:changed", function (){
      console.log("Group has changed.");
      var cardsInGroup = new Array();
      var groupsInGroup = new Array();
      //select only cards directly inside the group 
      var cardSelector = '#' + parentGroupID +' > .card';
      console.log(cardSelector);
      //select only groups directly inside the group 
      var groupSelector = '#' + parentGroupID +' > .group';
      console.log(cardSelector);
      // for each card in the group
      $(cardSelector).each(function(){
        var cardID = $(this).attr('id');
        // append it to the list of cards like so: cardsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
        cardsInGroup.push({id:cardID});
        console.log(cardID);
      });

      // for each card in the group
      $(groupSelector).each(function(){
        var groupID = $(this).attr('id');
        // append it to the list of cards like so: groupsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
        groupsInGroup.push({id:groupID});
        console.log(groupID);
      });

      saveGroup(parentGroupID,parentGroupName,cardsInGroup,groupsInGroup);
    });

    $(inputSelector).on('change', function () {
      parentGroup.trigger("group:changed");
    });

  });

});