var mongoose = require('mongoose');  
var cardSchema = new mongoose.Schema({  
  name: String,
  badge: Number,
  dob: { type: Date, default: Date.now },
  isloved: Boolean
});
mongoose.model('Card', cardSchema);