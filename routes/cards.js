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


//::::::::::::::::::::::SAVE THE CARD
router.route('/save')
  .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var word = req.body.word;
        var example = req.body.example;
        var dateCreated = req.body.dateCreated;
        var isCustom = req.body.isCustom;
        //call the create function for our database
        mongoose.model('Card').create({
            word : word,
            example : example,
            dateCreated : dateCreated,
            isCustom : isCustom
        }, function (err, card) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Card has been created
                  console.log('POST creating new card: ' + card);
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



//build the REST operations at the base for cards
//this will be accessible from http://127.0.0.1:3000/cards if the default route for / is left unchanged
router.route('/')
    //::::::::::::::::::::::SHOW ALL CARDS
    //GET all cards
    .get(function(req, res, next) {
        //retrieve all cards from Monogo
        mongoose.model('Card').find({}, function (err, cards) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/cards folder. We are also setting "cards" to be an accessible variable in our jade view
                    html: function(){
                        res.render('cards/index', {
                              title: 'UX-Classify',
                              "cards" : cards
                        });
                    },
                    //JSON response will show all cards in JSON format
                    // json: function(){
                    //     res.json(infophotos);
                    // }
                });
              }     
        });
    })
    //::::::::::::::::::::::CREATE A NEW CARD PART2
    //POST a new card
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var word = req.body.word;
        var example = req.body.example;
        var dateCreated = req.body.dateCreated;
        var isCustom = req.body.isCustom;
        //call the create function for our database
        mongoose.model('Card').create({
            word : word,
            example : example,
            dateCreated : dateCreated,
            isCustom : isCustom
        }, function (err, card) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Card has been created
                  console.log('POST creating new card: ' + card);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("cards");
                        // And forward to success page
                        res.redirect("/cards");
                    },
                    //JSON response will show the newly created card
                    json: function(){
                        res.json(card);
                    }
                });
              }
        })
    });

//::::::::::::::::::::::CREATE A NEW CARD PART 1
/* GET New Card page. */
router.get('/new', function(req, res) {
    res.render('cards/new', { title: 'Add New Card' });
});


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Card').findById(id, function (err, card) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(card);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

//::::::::::::::::::::::VIEW SPECIFIC CARD

//view the specific card by id
router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Card').findById(req.id, function (err, card) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + card._id);
        var cardcreated = card.dateCreated.toISOString();
        cardcreated = cardcreated.substring(0, cardcreated.indexOf('T'))
        res.format({
          html: function(){
              res.render('cards/show', {
                "cardcreated" : cardcreated,
                "card" : card
              });
          },
          json: function(){
              res.json(card);
          }
        });
      }
    });
  });


//::::::::::::::::::::::EDIT

//GET the individual card by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the card within Mongo
    mongoose.model('Card').findById(req.id, function (err, card) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the card
            console.log('GET Retrieving ID: ' + card._id);
            //format the date properly for the value to show correctly in our edit form
          var cardcreated = card.dateCreated.toISOString();
          cardcreated = cardcreated.substring(0, cardcreated.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('cards/edit', {
                          title: 'Card' + card._id,
                          "cardcreated" : cardcreated,
                          "card" : card
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(card);
                 }
            });
        }
    });
});


//::::::::::::::::::::::UPDATE A CARD AFTER EDITING

//PUT to update a card by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var word = req.body.word;
    var example = req.body.example;
    var dateCreated = req.body.dateCreated;
    var isCustom = req.body.isCustom;

   //find the document by ID
        mongoose.model('Card').findById(req.id, function (err, card) {
            //update it
            card.update({
                word : word,
                example : example,
                dateCreated : dateCreated,
                isCustom : isCustom
            }, function (err, cardID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/cards/" + card._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(card);
                         }
                      });
               }
            })
        });
});


//::::::::::::::::::::::DELETE A CARD

//DELETE a Card by ID
router.delete('/:id/edit', function (req, res){
    //find card by ID
    mongoose.model('Card').findById(req.id, function (err, card) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            card.remove(function (err, card) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + card._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/cards");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : card
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;