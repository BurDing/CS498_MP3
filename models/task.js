// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var TaskSchema = new mongoose.Schema({
    name: String,
    description: {
      type: String,
      default: "undefined"
    },
    deadline: Date,
    completed: Boolean,
    assignedUser: {
      type: String,
      default: ""
    },
    assignedUserName: {
      type: String,
      default: "unassigned"
    },
    dataCreated: {
      type: Date,
      default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);
