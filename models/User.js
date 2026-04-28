import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  password: {
    type: String,
    required: false
  }
});

export default mongoose.model('User', userSchema);
