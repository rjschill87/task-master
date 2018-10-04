const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: { type: Array, default: [] },
  points: { type: Number, default: 0 },
  dependentTasks: { type: Array, default: [] },
  due: Date,
  childTasks: { type: Array, default: [] },
  assignedTo: { type: String, default: '' },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', TaskSchema)