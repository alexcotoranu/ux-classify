var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var serveStatic = require('serve-static');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var sgTransport = require('nodemailer-sendgrid-transport');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');

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
    .get(isLoggedIn, function(req, res, next) {
        mongoose.model('Project').find({}).sort({dateCreated: -1}).exec(function (err, projects) {
              if (err) {
                  return console.error(err);
              } else {
                  res.format({
                    html: function(){
                        res.render('projects/index', {
                            projects : projects,
                            user : req.user
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
    .post(isAdmin, function(req, res) {
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
    .get(isLoggedIn, function(req, res, next) {
        mongoose.model('Project').findById(req.params['id'], function (err, project) {
            if (err) {
                return console.error(err);
            } else {
                mongoose.model('Experiment').find({'project':req.params['id']}).sort({dateCreated: -1}).exec(function (err, experiments) {
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
                                            project : project,
                                            experiments : experiments,
                                            decks : decks,
                                            user : req.user
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
    .get(isAdmin, function(req, res, next) {
        mongoose.model('Project').findById(req.params['id'], function (err, project) {
            if (err) {
                // console.log(req);
                // console.log(req.params);
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
                                mongoose.model('Session').find( { $and: [ {'groups': {$not: {$size: 0}} }, {'experiment': req.params['exid']} ]} ).populate('_participant').sort({dateCreated: -1}).exec(function (err, experimentsessions) {
                                    if (err) {
                                        return console.error("Session: " + err);
                                    } else {
                                        mongoose.model('Permission').find({'experiment':req.params['exid']}).populate('user').exec(function (err, permissions) {
                                            if (err) {
                                                return console.error("Permission: " + err);
                                            } else {
                                                res.format({
                                                    html: function(){
                                                        res.render('projects/experiment', {
                                                            project : project,
                                                            experiment : experiment,
                                                            deck : deck,
                                                            sessions : experimentsessions,
                                                            permissions: permissions,
                                                            user : req.user
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
            }
        });
    })
    //:::::::::::::::::::::: CREATE A NEW EXPERIMENT
    //POST a new experient
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



router.route('/:id/:exid/new')
    //::::::::::::::::::::::RUN NEW SESSION
    //GET all cards in deck
    .get(isLoggedIn, function(req, res, next) {
        var experiment = req.params['exid'];
        var participant = req.user._id;
        var dateCreated = new Date();
        mongoose.model('Session').create({
            _participant : participant,
            experiment : experiment,
            dateCreated : dateCreated
        }, function (err, session) {
            if (err) {
                return console.error("Session: " + err);
            } else {
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
                                        if (experiment.category == 'closed') {
                                            mongoose.model('Session').findById(experiment.closedSession).populate('_participant experiment').exec(function (err, template_session) {
                                                if (err) {
                                                    return console.error("Template Session: " + err);
                                                } else {
                                                    console.log(template_session)
                                                    mongoose.model('Group').find({'_id':{'$in':template_session.groups}}).populate('cards').exec(function (err, template_groups) {
                                                        if (err) {
                                                            return console.error("Template Groups: " + err);
                                                        } else {
                                                            console.log(template_groups);
                                                            mongoose.model('Card').find({'_id': {'$in':deck.cards}}, function (err, filtered_cards) { //todo actual filtering on aggregated cards inside all template_groups
                                                                if (err) {
                                                                    return console.error("Cards: " + err);
                                                                } else {
                                                                    res.format({
                                                                        html: function(){
                                                                            res.render('projects/session', {
                                                                                  session : session,
                                                                                  experiment : experiment,
                                                                                  cards : filtered_cards,
                                                                                  template_session : template_session,
                                                                                  template_groups : template_groups,
                                                                                  user : req.user
                                                                            });
                                                                        },
                                                                        json: function(){
                                                                            res.json(session,experiment,cards,template_session,template_groups,req.user);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }     
                                                    });
                                                }
                                            });
                                        } else {
                                            res.format({
                                                html: function(){
                                                    res.render('projects/session', {
                                                        session : session,
                                                        experiment : experiment,
                                                        cards : cards,
                                                        user : req.user
                                                    });
                                                },
                                                json: function(){
                                                    res.json(session,experiment,cards,req.user);
                                                }
                                            });
                                        }   
                                    }
                                });     
                            }
                        });
                    }
                });
            }
        });
    })
    //::::::::::::::::::::::SAVE SESSION
    .post(isLoggedIn, function(req, res, next) {
        var experiment = req.params['exid'];
        var participant = req.user._id;
        var sessionId = req.body.sessionid;
        var groups = JSON.parse(req.body.groups);
        var dateSubmitted = new Date();
        mongoose.model('Session').findById(sessionId, function (err, session) {
            session.update({
                _participant : participant,
                experiment : experiment,
                groups: groups,
                dateSubmitted : dateSubmitted
            }, function (err, updated_session) {
                if (err) {
                    res.send("There was a problem adding the information to the database.");
                } else {
                    //Card has been created
                    console.log('POST creating new session: ' + updated_session);
                    res.format({
                        html: function(){
                            res.send(updated_session);
                        },
                        json: function(){
                            res.json(updated_session);
                        }
                    });
                }
            });
        });
    });


router.route('/:id/:exid/setup')
    //::::::::::::::::::::::SETUP CLOSED EXPERIMENT
    //GET all cards in deck
    .get(isLoggedIn, function(req, res, next) {
        var experiment = req.params['exid'];
        var participant = req.user._id;
        var dateCreated = new Date();
        mongoose.model('Session').create({
            _participant : participant,
            experiment : experiment,
            dateCreated : dateCreated
        }, function (err, session) {
            if (err) {
                return console.error("Session: " + err);
            } else {
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
                                                    session : session,
                                                    experiment : experiment,
                                                    cards : cards,
                                                    user : req.user
                                                });
                                            },
                                            json: function(){
                                                res.json(session,experiment,cards,req.user);
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
    //::::::::::::::::::::::SAVE SESSION
    .post(isLoggedIn, function(req, res, next) {
        var experiment = req.params['exid'];
        var participant = req.user._id;
        var sessionId = req.body.sessionid;
        var groups = JSON.parse(req.body.groups);
        var dateSubmitted = new Date();
        mongoose.model('Session').findById(sessionId, function (err, session) {
            session.update({
                _participant : participant,
                experiment : experiment,
                groups: groups,
                dateSubmitted : dateSubmitted
            }, function (err, updated_session) {
                if (err) {
                    res.send("There was a problem adding the information to the database.");
                } else {
                    mongoose.model('Experiment').findById(experiment, function (err, found_experiment) {
                        found_experiment.update({
                            closedSession : sessionId
                        }, function (err, updated_experiment) {
                            if (err) {
                                res.send("There was a problem adding the information to the database.");
                            } else {
                                res.format({
                                    html: function(){
                                        res.send(updated_session, updated_experiment);
                                    },
                                    json: function(){
                                        res.json(updated_session, updated_experiment);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    });

// router.route('/:id/:exid/:participants')
//     //::::::::::::::::::::::VIEW ALL OF THE PARTICIPANTS
//     //GET all sessions for that participant
//     .get(isLoggedIn, function(req, res, next) {
//         mongoose.model('Experiment').findById(req.params['exid'], function (err, experiment) {
//             if (err) {
//                 return console.error("Experiment: " + err);
//             } else {
//                 mongoose.model('Session').find({'experiment': req.params['exid']}, function (err, sessions) {
//                     if (err) {
//                         return console.error("Sessions: " + err);
//                     } else {
//                         mongoose.model('Users').find({'_id' : {'$in':sessions.participants}}, function (err, participants) {
//                             if (err) {
//                                 return console.error("Participants: " + err);
//                             } else {
//                                 res.format({
//                                     html: function(){
//                                         res.render('projects/participants', {
//                                               experiment : experiment,
//                                               sessions : sessions,
//                                               participants : participants,
//                                               user : req.user
//                                         });
//                                     },
//                                     json: function(){
//                                         res.json(experiment,cards);
//                                     }
//                                 });
//                             }     
//                         });
//                     }     
//                 });
//             }
//         });
//     });

//     //::::::::::::::::::::::SAVE SESSION
//     //POST a session update
//     .post(isLoggedIn, function(req, res, next) {
//         var experiment = req.params['exid'];
//         var participant = req.user._id;
//         var groups = JSON.parse(req.body.groups);
//         var dateHeld = new Date();
//         mongoose.model('Session').update({
//             experiment : experiment,
//             participant : participant,
//             groups: groups,
//             dateHeld : dateHeld
//         }, function (err, session) {
//               if (err) {
//                   res.send("There was a problem adding the information to the database.");
//               } else {
//                   //Card has been created
//                   console.log('POST creating new session: ' + session);
//                   res.format({
//                     html: function(){
//                         res.send(session);
//                     },
//                     json: function(){
//                         res.json(session);
//                     }
//                 });
//               }
//         })
//     });


//::::::::::::::::::::::HOME PAGE (WITH LOGIN LINKS)
router.route('/:id/:exid/invite')
    .post(isLoggedIn, function (req, res, next) {
        var project = req.params['id'];
        var experiment = req.params['exid'];
        var emailstring = req.body.emails;
        var emails = extractEmails(emailstring);
        // console.log(emails);
        // console.log(emails.length);

        async.each(emails, function (email, callback) {
            var token = (+new Date * Math.random()).toString(36).substring(0,5);
            var hashedPassword = mongoose.model('User').schema.methods.generateHash(token);
            mongoose.model('User').findOne({'local.email' :  email }, function (err, user){
                if (err)
                    res.send("There was a problem with the query to the database.");
                if (user) {
                    //ensure that user has project access
                    console.log('User was found: ' + user.local.email);
                    ensureAccess(project, experiment, user);
                    callback('User already esists.');
                } else {
                    console.log('User was not found: ' + email);
                    mongoose.model('User').create({
                        // set the user's local credentials
                        'local.email' : email,
                        'local.password' : hashedPassword
                    }, function (err, newUser) {
                        if (err)
                            throw err;
                        ensureAccess(project, experiment, newUser);
                        inviteUser(newUser.local.email, token);
                    });
                    callback('User invited!');
                }
            });
        }, function(err){
            if( err ) {
                console.log('There was an error inviting a user.');
                console.log(err);
            } else {
                console.log('All users have been invited!');
            }
        });

        res.format({
            html: function(){
                res.send(emails);
            },
            json: function(){
                res.json(emails);
            }
        });
    });


// invite mails

function inviteUser (address, token) {
    var options = {
        auth: {
            api_key: 'YOURAPIKEY'
        }
    };
    var mailer = nodemailer.createTransport(sgTransport(options));
    var email = {
        to: address,
        from: 'invitations@example.com',
        subject: 'Invitation: User Experience Session',
        text: 'Hello,\n\n' +
        'We invite you to participate in a quick user experience (UX) experiment session to help us improve our products.\n'
        + 'You can log in with your email address: ' + address + ' using your temporary password: ' + token + '. \n Thank you kindly.'
    };
    mailer.sendMail(email, function (err, res) {
        if(err){
            return console.log(err);
        }
        console.log('Message sent: ' + res);
        // req.flash('success', 'Success! Your password has been changed.');
        // done(err);
    });   
}

function ensureAccess (project, experiment, user) {
    mongoose.model('Projectaccess').findOne({ 'project' : project, 'user' : user }, function (err, projectaccess) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            if(projectaccess != null) {//if the user has project access
                //ensure experiment access
                ensurePermissions(experiment, user);
            } else {//if the user doesn't have project access provide it
                mongoose.model('Projectaccess').create({
                    project: project,
                    user: user
                }, function (err, new_projectacces) {
                    //ensure experiment access
                    ensurePermissions(experiment, user);
                });
            }  
        }
    });
}

//ensure default permissions
function ensurePermissions (experiment, user) {
    var defaultPermissions = {
            c:true,
            r:true,
    }
    mongoose.model('Permission').findOne({ 'experiment' : experiment, 'user' : user } , function (err, permission) {
        if (err) {
            res.send("There was a problem with the query to the database.");
        } else {
           if(permission != null) {//if the user has experiment access
                //make sure that they have default participation rights
                // console.log(permission);
                if(permission.sessions.c == false || permission.sessions.r == false) {
                    permission.update({
                        experiment : experiment,
                        user : user._id,
                        sessions : defaultPermissions
                    });
                } else {
                    //do nothing
                    console.log('User already has default permissions.');
                }
                
            } else {//if the user doesn't have experiment access provide it through default rights
                mongoose.model('Permission').create({
                    experiment: experiment,
                    user: user._id,
                    sessions: defaultPermissions,
                });
                console.log('Added default permissions for user.');
            } 
        }
    });
 }

// function hasPermission (req, res, next) {
//     mongoose.model('Permission').findOne( {'user': req.user, 'experiment': req.params.['exid'], 'sessions.c':true} ).sort({dateCreated: -1}).populate('experiment').exec(function (err, permission) {
//         if (err)
//             console.log('Permission check failed')
        
//             if( permission)
//             return next();
//         }
//         // if they aren't redirect them to the home page
//     res.location('/');
//     res.setHeader('Location','/');
//     res.redirect('/');
// }

//email extraction
function extractEmails (text) {
    var emailstring = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    return  emailstring;
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.location('/');
    res.setHeader('Location','/');
    res.redirect('/');
}

// route middleware to make sure a user is logged in as an admin
function isAdmin(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() && req.user.isAdmin)
        return next();

    // if they aren't redirect them to the home page
    res.location('/');
    res.setHeader('Location','/');
    res.redirect('/');
}

module.exports = router;