//confession-service/models/Confession.js
// This file defines the Mongoose schema for the Confession model
const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Confession', confessionSchema);
