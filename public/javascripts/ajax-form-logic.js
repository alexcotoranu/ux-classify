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


      function saveGroup(id,name,cardArray,groupArray){
        // event.preventDefault(); // Stop the form from causing a page refresh.
        // event.unbind(); // this is supposed to stop multiple form submissions
        console.log("something is being saved");
        
        var data = {
          id: id,
          name: name,
          cards: JSON.stringify(cardArray),
          groups: JSON.stringify(groupArray)
        };

        console.log(data);

        $.ajax({
          url: '/cards/savegroup',
          type: 'POST',
          data: data,
          success:function(data, textStatus, jqXHR) 
          {
              //data: return data from server
              console.log(data);
              console.log("Everything is fine.");
          },
          error: function(jqXHR, textStatus, errorThrown) 
          {
              //if fails 
              console.log(errorThrown);     
          }
        });
      }

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
          cardsInGroup.push({id:cardID});
          console.log(cardsInGroup);
        });

        // for each card in the group
        $(groupSelector).each(function(){
          var groupID = $(this).attr('id');
          // append it to the list of cards like so: groupsInGroup =[{id:"153A5-1415G"},{id:"4623W-6547Y"}];
          groupsInGroup.push({id:groupID});
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