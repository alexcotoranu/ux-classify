var mongoose = require('mongoose');  
var groupSchema = new mongoose.Schema({  
  id: String,
  name: String,
  cards:[{ id: String }],
  groups:[{ id: String }]
});
mongoose.model('Group', groupSchema);