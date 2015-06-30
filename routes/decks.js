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

//::::::::::::::::::::::VIEW ALL DECKS
router.route('/')
    .get(function(req, res, next) {
        mongoose.model('Deck').find({}).sort({dateCreated: -1}).exec(function (err, decks) {
              if (err) {
                  return console.error(err);
              } else {
                  res.format({
                    html: function(){
                        res.render('decks/index', {
                            title: 'UX-Classify',
                            "decks" : decks
                        });
                    },
                    json: function(){
                        res.json(decks);
                    }
                });
              }     
        });
    })//::::::::::::::::::::::CREATE A NEW DECK
    //POST a new deck
    .post(function(req, res) {
        // Get values from POST request
        var name = req.body.name;
        var cards = JSON.stringify(req.body.cards);
        var date = new Date();
        //call the create function for our database
        mongoose.model('Deck').create({
            name : name,
            cards : cards,
            date : date
        }, function (err, deck) {
              if (err) {
                  res.send("There was a problem adding the DECK to the database.");
              } else {
                  //Card has been created
                  console.log('POST creating new DECK: ' + deck);
                  res.format({
                    html: function(){
                        res.send(deck);
                    },
                    json: function(){
                        res.json(deck);
                    }
                });
              }
        })
    });

//::::::::::::::::::::::SHOW DECK
router.route('/:id')
    .get(function(req, res, next) {
        mongoose.model('Deck').findById(req.params['id'], function (err, deck) {
            if (err) {
                return console.error("Deck: " + err);
            } else {
                mongoose.model('Card').find({'_id': {'$in':deck.cards}}, function (err, cardsindeck) {
                    if (err) {
                        return console.error("Cards In Deck: " + err);
                    } else {
                        mongoose.model('Card').find({}, function (err, cards) {
                            if (err) {
                                return console.error("Cards: " + err);
                            } else {
                                res.format({
                                    html: function(){
                                        res.render('decks/show', {
                                            "deck" : deck,
                                            "cards" : cards,
                                            "cardsindeck" : cardsindeck
                                        });
                                    },
                                    json: function(){
                                        res.json(deck, cardsindeck, cards);
                                    }
                                });
                            }
                        });
                    }
                });
            }     
        });
    })
    //::::::::::::::::::::::UPDATE DECK
    .post(function(req, res) {
        // Get values from POST request
        var cards = JSON.stringify(req.body.cards);
        var jCards = JSON.parse(req.body.cards);
        console.log(cards);
        var date = new Date();
        //call the create function for our database
        mongoose.model('Deck').findById(req.params['id'], function (err, deck) {
            deck.update({
                cards : jCards,
            }, function (err, updateddeck) {
                if (err) {
                    console.log(err);
                    res.send("There was a problem adding the DECK to the database.");
                } else {
                    //Card has been created
                    console.log('POST updated DECK: ' + deck);
                    res.format({
                        html: function(){
                            res.send(updateddeck);
                        },
                        json: function(){
                            res.json(updateddeck);
                        }
                    });
                }
            });
        });
    });

module.exports = router;