const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ consistently used across project

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['team_leader', 'member'], required: true }, // ✅ comma here!
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

// ✅ Optional password comparison method
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
