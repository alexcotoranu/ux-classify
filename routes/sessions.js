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



//::::::::::::::::::::::VIEW ALL EXPERIMENTS
router.route('/')
    .get(function(req, res, next) {
        mongoose.model('Experiment').find({}).sort({dateCreated: -1}).exec(function (err, experiments) {
            if (err) {
                return console.error(err);
            } else {
                mongoose.model('Project').find({}).sort({dateCreated: -1}).exec(function (err, projects) {
                    if (err) {
                        return console.error(err);
                    } else {
                        mongoose.model('Deck').find({}).sort({dateCreated: -1}).exec(function (err, decks) {
                            if (err) {
                                return console.error(err);
                            } else {
                                res.format({
                                    html: function(){
                                        res.render('sessions/index', {
                                            projects : projects,
                                            decks : decks,
                                            experiments : experiments,
                                            sessions : sessions
                                        });
                                    },
                                    json: function(){
                                        res.json(experiments, projects);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    })//::::::::::::::::::::::CREATE A NEW EXPERIMENT
    //POST a new project
    .post(function(req, res) {
        // Get values from POST request
        var name = req.body.name;
        var date = new Date();
        var project = req.body.project;
        var category = req.body.category;
        var deck = req.body.deck;
        //call the create function for our database
        mongoose.model('Experiment').create({
            name : name,
            date : date,
            project : project,
            category : category,
            deck : deck
        }, function (err, experiment) {
              if (err) {
                  res.send("There was a problem adding the EXPERIMENT to the database.");
              } else {
                  //Card has been created
                  console.log('POST creating new EXPERIMENT: ' + experiment);
                  res.format({
                    html: function(){
                        res.send(experiment);
                    },
                    json: function(){
                        res.json(experiment);
                    }
                });
              }
        })
    });

//::::::::::::::::::::::SHOW EXPERIMENT
router.route('/:id')
    .get(function(req, res, next) {
        mongoose.model('Experiment').findById(req.params['id'], function (err, experiment) {
              if (err) {
                  return console.error(err);
              } else {
                  res.format({
                    html: function(){
                        res.render('experiments/show', {
                            "experiment" : experiment
                        });
                    },
                    json: function(){
                        res.json(deck);
                    }
                });
              }     
        });
    });


//::::::::::::::::::::::SAVE THE SESSION
router.route('/save')
  .post(function(req, res) {
        var experiment = req.body.experiment;
        var participant = req.body.participant;
        var groups = JSON.parse(req.body.groups);
        var dateHeld = req.body.dateHeld;
        mongoose.model('Session').create({
            experiment : experiment,
            participant : participant,
            groups: groups,
            dateHeld : dateHeld
        }, function (err, session) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Card has been created
                  console.log('POST creating new session: ' + session);
                  res.format({
                    html: function(){
                        res.send(session);
                    },
                    json: function(){
                        res.json(session);
                    }
                });
              }
        })
    });

module.exports = router;