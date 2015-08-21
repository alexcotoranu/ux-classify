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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
