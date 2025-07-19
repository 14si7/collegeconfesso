// user-service/models/user.js
// This file defines the User model for the user service using Mongoose.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  secretCode: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);