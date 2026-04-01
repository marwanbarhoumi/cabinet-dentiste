const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom obligatoire'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email obligatoire'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Mot de passe obligatoire'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
  phone: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', ''],
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Fix — sans next() pour mongoose v7+
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);