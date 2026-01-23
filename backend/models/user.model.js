import mongoose from mongoose;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  verifyEmailOtp:{
    type: String
  },
  verifyEmailOtpExpiry: Date,

  resetPasswordOtp:{
    type: String
  },
  resetPasswordOtpExpiry: Date,
},{
  timestamps: true,
});

export const User = mongoose.model('User', userSchema);