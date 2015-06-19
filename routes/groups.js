var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//copy-pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

//::::::::::::::::::::::SAVE THE GROUPS
router.route('/save')
  .post(function(req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    console.log(req.body);

    var id = req.body.id;
    console.log("Group ID:" + id);

    var name = req.body.name;
    console.log("Group Name:" + name);

    var cards = JSON.parse(req.body.cards);
    console.log("Cards Array:" + cards);

    var groups = JSON.parse(req.body.groups);
    console.log("Groups Array:" + groups);

    //call the create function for our database
    mongoose.model('Group').create({
        name : name,
        id : id,
        cards : cards,
        groups : groups
    }, function (err, group) {
          if (err) {
              res.send("There was a problem adding the information to the database.");
          } else {
              //Card has been created
              console.log('POST saving group');
              res.format({
                  //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                html: function(){
                    // If it worked, set the header so the address bar doesn't still say /adduser
                    // res.location("cards");
                    // And forward to success page
                    // res.redirect("/cards");
                },
                //JSON response will show the newly created card
                json: function(){
                    res.json(card);
                }
            });
          }
    })
});

module.exports = router;