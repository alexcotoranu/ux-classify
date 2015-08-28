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

router.route('/:id/get')
    //::::::::::::::::::::::GET OBJECT ID OF GROUP
    //GET group id
    .get(isLoggedIn, function(req, res, next) {
        mongoose.model('Group').findOne({id:req.params['id']}, function (err, group) {
              if (err) {
                  return console.error(err);
              } else {
                  console.log(group);
                  console.log('Group ObjectId for '+ req.params['id'] +': ' + group._id);
                  res.format({  
                    html: function(){
                      res.send(group._id);
                    }
                });
              }     
        });
    });

router.route('/new')
    //::::::::::::::::::::::CREATE NEW GROUP
    //POST a new group
    .post(isLoggedIn, function(req, res) {
        // var id = req.body.id;
        
        //call the create function for our database
        mongoose.model('Group').create({
            // id: id
        }, function (err, group) {
              if (err) {
                  res.send("There was a problem adding the new group to the database.");
              } else {
                  //Group has been created
                  // console.log('POST created new group: ' + group);
                  console.log('POST created new group with objectID: ' + group._id);
                //   res.format({
                //     // html: function(){
                //     //     res.send(group._id);
                //     // },
                //     // json: function(){
                //     //     res.send({id:group._id});
                //     // },
                //     // text: function(){
                //     //     res.send(group._id);
                //     // }
                // });
                console.log(group);
                res.send(group._id);
              }
        })
    });

//::::::::::::::::::::::SAVE THE GROUPS
router.route('/save')
  .post(isLoggedIn, function(req, res) {
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
    mongoose.model('Group').findById(req.body.id, function (err, group) {
      console.log(err);
      console.log(group);

      group.update({
        name : name,
        cards : cards,
        groups : groups
      }, function (err, group) {
          if (err) {
              res.send("There was a problem adding the information to the database.");
          } else {
              //Card has been created
              console.log('POST saving group');
              res.send(group._id);
              // res.format({
              //     //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
              //   html: function(){
              //       // If it worked, set the header so the address bar doesn't still say /adduser
              //       // res.location("cards");
              //       // And forward to success page
              //       // res.redirect("/cards");
              //   },
              //   //JSON response will show the newly created card
              //   json: function(){
              //       res.json(card);
              //   }
              // });
          }
      });
    });
  });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        if (req.user.changePassword) {
            res.location('/change');
            res.setHeader('Location','/change');
            res.redirect('/change');
        } else {
            return next(); //carry on
        }

    // if they aren't redirect them to the home page
    res.location('/');
    res.setHeader('Location','/');
    res.redirect('/');
}

// route middleware to make sure a user is logged in as an admin
function isAdmin(req, res, next) {

    // if user is authenticated in the session, and is an admin 
    if (req.isAuthenticated() && req.user.isAdmin)
        if (req.user.changePassword) {
            res.location('/change');
            res.setHeader('Location','/change');
            res.redirect('/change');
        } else {
            return next(); //carry on
        }

    // if they aren't redirect them to the home page
    res.location('/');
    res.setHeader('Location','/');
    res.redirect('/');
}

module.exports = router;