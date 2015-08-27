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

//::::::::::::::::::::::GRADUATE USER
router.route('/graduateuser')
    .post(isLoggedIn, function(req, res, next) {
        mongoose.model('User').findById(req.user, function (err, user) {
            if (user.isGrad == undefined || user.isGrad == false){
                user.update({
                    isGrad: true
                }, function (err, session) {
                    if (err) {
                        res.send("There was a problem adding the information to the database.");
                    } else {
                        //Card has been created
                        console.log('POST graduating user.');
                        res.format({
                            html: function(){
                                // res.send(user);
                            },
                            json: function(){
                                // res.json(user);
                            }
                        });
                    }
                });
            } else {
                console.log("Current user is not a new user.");
            }
        });
    });


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

//::::::::::::::::::::::FORGOT
// show the forgot login form
router.route('/forgot')
    .get(isNotLoggedIn, function (req, res, next) {
        res.render('forgot', {
            user: req.user
        });
    })
    .post(function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                mongoose.model('User').findOne({ 'local.email': req.body.email }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                var options = {
                    auth: {
                        api_key: ''
                    }
                };
                var mailer = nodemailer.createTransport(sgTransport(options));
                var email = {
                    to: user.local.email,
                    from: 'email@example.com',
                    subject: 'UX-Classify Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                mailer.sendMail(email, function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('Message sent: ' + res);
                    req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
            ], function (err) {
                if (err) return next(err);
                res.redirect('/forgot');
            });
        });

//::::::::::::::::::::::RESET
// show the reset password form
router.route('/reset/:token')
    .get(isNotLoggedIn, function (req, res, next) {
        mongoose.model('User').findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user
            });
        });
    })
    .post(function (req, res, next) {
        async.waterfall([
            function (done) {
                mongoose.model('User').findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }
                    
                    var hashedPassword = mongoose.model('User').schema.methods.generateHash(req.body.password);
                    user.local.password = hashedPassword;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
            },
            function (user, done) {
                var options = {
                    auth: {
                        api_key: ''
                    }
                };
                var mailer = nodemailer.createTransport(sgTransport(options));
                var email = {
                    to: user.local.email,
                    from: 'email@example.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
                };
                mailer.sendMail(email, function (err, res) {
                    if(err){
                        return console.log(err);
                    }
                    console.log('Message sent: ' + res);
                    req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                });
            }
            ], function (err) {
                res.redirect('/');
            });
        });

//::::::::::::::::::::::SIGNUP
// show the signup form
router.route('/signup')
    .get(isNotLoggedIn, function (req, res, next) {
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
        mongoose.model('Permission').find( { $and: [ {'sessions.r': true }, {'user': req.user} ]} ).sort({dateCreated: -1}).populate('experiment').exec(function (err, permissions) {
            if (err) {
                console.error(err);
            } else {
                res.location('profile');
                // res.setHeader('Location', 'profile');
                res.format({
                    html: function(){
                        res.render('profile', {
                            user : req.user,
                            permissions: permissions
                        });
                    },
                    json: function(){
                        res.json(user, permissions);
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