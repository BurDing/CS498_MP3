// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    pendingTasks: Array,
    dataCreated: {
      type: String,
      default: Date.now
    },
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
