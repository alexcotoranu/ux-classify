var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var serveStatic = require('serve-static');
var LocalStrategy = require('passport-local').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {
    console.log("Passport module is globally accessible.");
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("serialize user");
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("deserialize user");
        mongoose.model('User').findById(id, function(err, user) {
            done(err, user);
        });
    });

    // passport.use('local-invite', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, email, done) {
    //     console.log("local invite strategy");
    //     // asynchronous
    //     // User.findOne wont fire unless data is sent back
    //     process.nextTick(function() {
    //         console.log("check if email is already in use");
    //         // find a user whose email is the same as the forms email
    //         // we are checking to see if the user trying to login already exists
    //         mongoose.model('User').findOne({ 'local.email' :  email }, function(err, user) {
    //             // if there are any errors, return the error
    //             if (err)
    //                 return done(err);
    //             // check to see if theres already a user with that email
    //             if (user) {
    //                 // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //                 //check if user has project access
    //                     //if the user has project access continue
    //                     //if the user doesn't have project access provide it
    //                         // mongoose.model('Projectaccess').create({
    //                         //     '_project': projectid,
    //                         //     'user': userid
    //                         // });
    //                     //check if the user has experiment access
    //                         //if the user has experiment access, mention that the user already does, and move on
    //                         //if the user does not yet have experiment access, provide it
    //                             // var defaultPermissions = {
    //                             //     c:true,
    //                             //     r:true,
    //                             // }
    //                             // mongoose.model('Permission').create({
    //                             //     '_experiment': experimentid,
    //                             //     'user': userid,
    //                             //     'sessions': defaultPermissions,
    //                             // });

    //             } else {
    //                   console.log("The system is trying to register a user.")
    //                 // if there is no user with that email
    //                 // create the user
    //                 console.log(mongoose.model('User').schema.methods);
    //                 var hashedPassword = mongoose.model('User').schema.methods.generateHash(password);
    //                 mongoose.model('User').create({
    //                     // set the user's local credentials
    //                     'local.email' : email,
    //                     'local.password' : hashedPassword
    //                 }, function (err, newUser) {
    //                     if (err)
    //                         throw err;
    //                     return done(null, newUser);
    //                   });
    //               }

    //         });

    //     });

    // }));

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log("local signup strategy");
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            console.log("check if email is already in use");
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            mongoose.model('User').findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                      console.log("The system is trying to register a user.")
                    // if there is no user with that email
                    // create the user
                    console.log(mongoose.model('User').schema.methods);
                    var hashedPassword = mongoose.model('User').schema.methods.generateHash(password);
                    mongoose.model('User').create({
                        // set the user's local credentials
                        'local.email' : email,
                        'local.password' : hashedPassword
                    }, function (err, newUser) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                  }

            });

        });

    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        console.log("local login strategy");
        console.log(req);
        console.log(email);
        console.log(password);
        console.log(done);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        mongoose.model('User').findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, user);
        });

    }));



};

