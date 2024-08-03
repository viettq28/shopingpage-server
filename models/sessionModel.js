const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide creator!"],
  },
  messages: [[String]],
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;