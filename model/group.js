var mongoose = require('mongoose');  
var groupSchema = new mongoose.Schema({
  name: String,
  cards: [type: Schema.Types.ObjectId, ref: 'Card'}],
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group'}];
  // groups:[{ id: String }]
});
mongoose.model('Group', groupSchema);