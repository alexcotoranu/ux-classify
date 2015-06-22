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

module.exports = router;