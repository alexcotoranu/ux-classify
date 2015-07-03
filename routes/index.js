var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var serveStatic = require('serve-static');
var LocalStrategy = require('passport-local').Strategy;

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

//::::::::::::::::::::::HOME PAGE (WITH LOGIN LINKS)
router.route('/')
    .get(isNotLoggedIn, function(req, res, next) {
        var title = 'UX-Classify';
        res.format({
            html: function(){
                res.render('index', {
                    title: title
                });
            },
            json: function(){
                res.json(title);
            }
        });
    });

//::::::::::::::::::::::LOGIN
// show the login form
router.route('/login')
    .get(isNotLoggedIn, function(req, res, next) {
        // render the page and pass in any flash data if it exists
        res.format({
            html: function(){
                res.render('login', {
                    message: req.flash('loginMessage')
                });
            },
            json: function(){
                res.json(req.flash('loginMessage'));
            }
        });
    })// process the login form
    .post(function (req, res, next) {
        return passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the login page if there is an error
            failureFlash : true // allow flash messages
        })(req, res, next);
    });


// process the login form
// app.post('/login', do all our passport stuff here);


//::::::::::::::::::::::SIGNUP
// show the signup form
router.route('/signup')
    .get(isNotLoggedIn, function(req, res, next) {
        // render the page and pass in any flash data if it exists
        res.format({
            html: function(){
                res.render('signup', {
                    message: req.flash('signupMessage')
                });
            },
            json: function(){
                res.json(req.flash('signupMessage'));
            }
        });
    })
    // process the signup form
    .post(function (req, res, next) {
        return passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        })(req, res, next);
    });


//::::::::::::::::::::::PROFILE SECTION
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.route('/profile')
    .get(isLoggedIn, function(req, res, next) {
        mongoose.model('Experiment').find({}).sort({dateCreated: -1}).exec(function (err, experiments) {
            if (err) {
                console.error(err);
            } else {
                res.location('profile');
                // res.setHeader('Location', 'profile');
                res.format({
                    html: function(){
                        res.render('profile', {
                            user : req.user,
                            experiments: experiments
                        });
                    },
                    json: function(){
                        res.json(user, experiments);
                    }
                });
            }
        });
    });


//::::::::::::::::::::::LOGOUT
router.route('/logout')
    .get(function(req, res, next) {
        req.logout();
        res.location('/');
        res.redirect('/');
    });

// route middleware to check if the user is NOT logged in (for authentication pages only)
function isNotLoggedIn(req, res, next) {

    // if user is not authenticated in the session, carry on 
    if (!req.isAuthenticated())
        return next();

    // if they are redirect them to the profile page
    res.location('/profile');
    res.setHeader('Location','profile');
    res.redirect('/profile');
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