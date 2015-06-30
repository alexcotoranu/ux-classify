var mongoose = require('mongoose');
Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/uxclassifydb');


// -------------------------------------------------------------------------------- CARDS
var cardSchema = new mongoose.Schema({
    word: String, // i.e. "Name"
    example: String, // i.e. "(e.g. John Smith)"
    dateCreated: { type: Date, default: Date.now },
    isCustom: Boolean
});
mongoose.model('Card', cardSchema);

// -------------------------------------------------------------------------------- DECKS
var deckSchema = new mongoose.Schema({
    name: String,
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    dateCreated: { type: Date, default: Date.now },
});
mongoose.model('Deck', deckSchema);

// -------------------------------------------------------------------------------- GROUPS
var groupSchema = new mongoose.Schema({
    name: String,
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    // groups:[{ id: String }]
});
mongoose.model('Group', groupSchema);


// -------------------------------------------------------------------------------- EMAILS
// var emailSchema = new mongoose.Schema({
//     type: String,
//     trim: true,
//     unique: true,
//     required: 'Email address is required.',
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address.'],
//     dateAdded: { type: Date, default: Date.now }, // i.e. first time it was entered into the system
// });
// mongoose.model('Email', emailSchema);


// -------------------------------------------------------------------------------- PARTICIPANTS
var participantSchema = new mongoose.Schema({
    name: String,
    dateJoined: { type: Date, default: Date.now },
    // email: [type: Schema.Types.ObjectId, ref: 'Email'}],
});
mongoose.model('Participant', participantSchema);


// -------------------------------------------------------------------------------- SESSIONS
var sessionSchema = new mongoose.Schema({
    experiment: { type: Schema.Types.ObjectId, ref: 'Experiment' },
    participant : { type: Schema.Types.ObjectId, ref: 'Participant' },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    dateHeld: { type: Date, default: Date.now }
});
mongoose.model('Session', sessionSchema);


// -------------------------------------------------------------------------------- EXPERIMENTS
var experimentSchema = new mongoose.Schema({
    name: String,
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    deck: { type: Schema.Types.ObjectId, ref: 'Deck' },
    category: String, //i.e. "open" or "closed"
    dateCreated: { type: Date, default: Date.now },
    isComplete: Boolean
});
mongoose.model('Experiment', experimentSchema);


// -------------------------------------------------------------------------------- PROJECTS
var projectSchema = new mongoose.Schema({
    name: String, // i.e. "Project 1"
    dateCreated: { type: Date, default: Date.now },
});
mongoose.model('Project', projectSchema);