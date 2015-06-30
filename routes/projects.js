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


//::::::::::::::::::::::VIEW ALL PROJECTS
router.route('/')
    .get(function(req, res, next) {
        mongoose.model('Project').find({}).sort({dateCreated: -1}).exec(function (err, projects) {
              if (err) {
                  return console.error(err);
              } else {
                  res.format({
                    html: function(){
                        res.render('projects/index', {
                            title: 'UX-Classify',
                            "projects" : projects
                        });
                    },
                    json: function(){
                        res.json(projects);
                    }
                });
              }     
        });
    })//::::::::::::::::::::::CREATE A NEW PROJECT
    //POST a new project
    .post(function(req, res) {
        // Get values from POST request
        var name = req.body.name;
        var date = new Date();
        //call the create function for our database
        mongoose.model('Project').create({
            name : name,
            date : date
        }, function (err, project) {
              if (err) {
                  res.send("There was a problem adding the PROJECT to the database.");
              } else {
                  //Card has been created
                  console.log('POST creating new PROJECT: ' + project);
                  res.format({
                    html: function(){
                        res.send(project);
                    },
                    json: function(){
                        res.json(project);
                    }
                });
              }
        })
    });

//::::::::::::::::::::::SHOW PROJECT
router.route('/:id')
    .get(function(req, res, next) {
        mongoose.model('Project').findById(req.params['id'], function (err, project) {
            if (err) {
                return console.error(err);
            } else {
                mongoose.model('Experiment').find({'project':req.params['project']}).sort({dateCreated: -1}).exec(function (err, experiments) {
                    if (err) {
                        return console.error(err);
                    } else {
                        mongoose.model('Deck').find({}).sort({dateCreated: -1}).exec(function (err, decks) {
                            if (err) {
                                return console.error(err);
                            } else {
                                res.format({
                                    html: function(){
                                        res.render('projects/show', {
                                            title: 'UX-Classify',
                                            "project" : project,
                                            "experiments" : experiments,
                                            "decks" : decks
                                        });
                                    },
                                    json: function(){
                                        res.json(project, child_experiments, experiments, projects, decks);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

//::::::::::::::::::::::SHOW EXPERIMENT
router.route('/:id/:exid/')
    .get(function(req, res, next) {
        mongoose.model('Project').findById(req.params['id'], function (err, project) {
            if (err) {
                console.log(req);
                console.log(req.params);
                return console.error("Project: " + err);
            } else {
                mongoose.model('Experiment').findById(req.params['exid'], function (err, experiment) {
                    if (err) {
                        return console.error("Experiment: " + err);
                    } else {
                        mongoose.model('Deck').findById(experiment.deck, function (err, deck) {
                            if (err) {
                                return console.error("Deck: " + err);
                            } else {
                                mongoose.model('Session').find({'experiment': req.params['exid']}, function (err, sessions) {
                                    if (err) {
                                        return console.error("Sessions: " + err);
                                    } else {
                                        res.format({
                                            html: function(){
                                                res.render('projects/experiment', {
                                                    title: 'UX-Classify',
                                                    "project" : project,
                                                    "experiment" : experiment,
                                                    "deck" : deck,
                                                    "sessions" : sessions
                                                });
                                            },
                                            json: function(){
                                                res.json(project, experiment, deck, sessions);
                                            }
                                        });
                                    }
                                });        
                            }
                        });
                    }
                });
            }
        });
    })
    //::::::::::::::::::::::CREATE A NEW EXPERIMENT
    //POST a new experient
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



router.route('/:id/:exid/new')
    //::::::::::::::::::::::RUN NEW SESSION
    //GET all cards in deck
    .get(function(req, res, next) {
        mongoose.model('Experiment').findById(req.params['exid'], function (err, experiment) {
            if (err) {
                return console.error("Experiment: " + err);
            } else {
                mongoose.model('Deck').findById(experiment.deck, function (err, deck) {
                    if (err) {
                        return console.error("Deck: " + err);
                    } else {
                        mongoose.model('Card').find({'_id': {'$in':deck.cards}}, function (err, cards) {
                            if (err) {
                                return console.error("Cards: " + err);
                            } else {
                                res.format({
                                    html: function(){
                                        res.render('projects/session', {
                                              title: 'UX-Classify',
                                              "experiment" : experiment,
                                              "cards" : cards
                                        });
                                    },
                                    json: function(){
                                        res.json(experiment,cards);
                                    }
                                });
                            }     
                        });
                    }     
                });
            }
        });
    });


module.exports = router;