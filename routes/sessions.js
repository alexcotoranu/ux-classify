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
    .get(isLoggedIn, function(req, res, next) {
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
    .post(isLoggedIn, function(req, res) {
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
// router.route('/:id')
//     .get(function(req, res, next) {
//         mongoose.model('Experiment').findById(req.params['id'], function (err, experiment) {
//               if (err) {
//                   return console.error(err);
//               } else {
//                   res.format({
//                     html: function(){
//                         res.render('experiments/show', {
//                             "experiment" : experiment
//                         });
//                     },
//                     json: function(){
//                         res.json(deck);
//                     }
//                 });
//               }     
//         });
//     });

router.route('/:id')
    //::::::::::::::::::::::ANALYZE SESSION
    //GET the session
    .get(isAdmin, function(req, res, next) {
        mongoose.model('Session').findById(req.params['id']).populate('_participant experiment').exec(function (err, session) {
            if (err) {
                return console.error("Session: " + err);
            } else {
                mongoose.model('Group').find({'_id':{'$in':session.groups}}).populate('cards').exec(function (err, groups) {
                    if (err) {
                        return console.error("Groups: " + err);
                    } else {
                        console.log(groups);
                        res.format({
                            html: function(){
                                res.render('sessions/results', {
                                      session : session,
                                      groups : groups,
                                      user : req.user
                                });
                            },
                            json: function(){
                                res.json(session,groups,req.user);
                            }
                        });
                    }     
                });
            }
        });
    });


//::::::::::::::::::::::SAVE THE SESSION
router.route('/save')
  .post(isLoggedIn, function(req, res) {
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