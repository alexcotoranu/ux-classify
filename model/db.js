var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/uxclassifydb');


// -------------------------------------------------------------------------------- USERS

var userSchema = new mongoose.Schema({
    isAdmin: Boolean,
    isGrad: Boolean,
    changePassword: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    local: {
        username: String,
        password: String,
        email: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displ: String,
        user: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// console.log(userSchema.methods);

mongoose.model('User', userSchema);

// // create the model for users and expose it to our app
// module.exports = mongoose.model('User', userSchema);

// -------------------------------------------------------------------------------- USER ROLES
// var roleSchema = new mongoose.Schema({
//     name: String,
//     c: Boolean,
//     r: Boolean,
//     u: Boolean,
//     d: Boolean
// });
// mongoose.model('Role', roleSchema);

// -------------------------------------------------------------------------------- PROJECT ACCESS
var projectAccessSchema = new mongoose.Schema({
    project : { type: Schema.Types.ObjectId, ref: 'Project' },
    user : { type: Schema.Types.ObjectId, ref: 'User' },
});
mongoose.model('Projectaccess', projectAccessSchema);

// -------------------------------------------------------------------------------- DECK ACCESS
var deckAccessSchema = new mongoose.Schema({
    deck : { type: Schema.Types.ObjectId, ref: 'Deck' },
    user : { type: Schema.Types.ObjectId, ref: 'User' },
});
mongoose.model('Deckaccess', deckAccessSchema);

// -------------------------------------------------------------------------------- EXPERIMENT PERMISSIONS
var permissionSchema = new mongoose.Schema({
    experiment : { type: Schema.Types.ObjectId, ref: 'Experiment' },
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    sessions: {
        c: Boolean, // participate in / submit
        r: Boolean, // see the experiment
        u: Boolean, // modify the experiment (i.e. rename it, change deck)
        d: Boolean //delete the experiment
    },
    results: {
        // c: Boolean,
        r: Boolean, // view results
        // u: Boolean,
        d: Boolean // clear results
    },
    users: {
        c: Boolean, // invite new users
        r: Boolean, // see other users
        u: Boolean, // modify users
        d: Boolean  // delete users
    }
});
mongoose.model('Permission', permissionSchema);

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

// -------------------------------------------------------------------------------- SESSIONS
var sessionSchema = new mongoose.Schema({
    _participant : { type: Schema.Types.ObjectId, ref: 'User' },
    experiment: { type: Schema.Types.ObjectId, ref: 'Experiment' },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    dateCreated: { type: Date, default: Date.now },
    dateSubmitted: { type: Date, default: Date.now }
});
mongoose.model('Session', sessionSchema);


// -------------------------------------------------------------------------------- EXPERIMENTS
var experimentSchema = new mongoose.Schema({
    name: String,
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    deck: { type: Schema.Types.ObjectId, ref: 'Deck' },
    category: String, //i.e. "open" or "closed"
    closedSession: { type: Schema.Types.ObjectId, ref: 'Session' },
    dateCreated: { type: Date, default: Date.now },
    isComplete: Boolean
});
mongoose.model('Experiment', experimentSchema);


// -------------------------------------------------------------------------------- PROJECTS
var projectSchema = new mongoose.Schema({
    name: String, // i.e. "Project 1"
    dateCreated: { type: Date, default: Date.now },
    // inviteCode: String
});
mongoose.model('Project', projectSchema);