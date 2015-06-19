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

//::::::::::::::::::::::SAVE THE SESSION
router.route('/save')
  .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var experiment = req.body.experiment;
        var participant = req.body.participant;
        var groups = JSON.parse(req.body.groups);
        var dateHeld = req.body.dateHeld;
        //call the create function for our database
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
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        // res.location("sessions");
                        // And forward to success page
                        // res.redirect("/sessions");
                    },
                    //JSON response will show the newly created session
                    json: function(){
                        res.json(session);
                    }
                });
              }
        })
    });

module.exports = router;