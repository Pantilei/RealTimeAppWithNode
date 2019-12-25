var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
  content: String
});

module.exports = mongoose.model("Task", taskSchema);
