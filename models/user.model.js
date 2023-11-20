import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: [3, 'Minimum 3 letters required'],
    required: [true, 'First Name Required']
  },
  lastName: {
    type: String,
    minLength: [3, 'Minimum 3 letters required'],
    required: [true, 'Last Name Required']
  },
  email: {
    type: String,
    required: [true, 'Email Required'],
    unique: true,
    validate: {
      validator: (val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
      message: 'Please enter a valid email'
    },
  },
  password: {
    type: String,
    minLength: [8, 'Password should be minimum 8 characters long'],
    required: [true, 'Password Required'],
    select: false
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (val) { return this.password === val },
      message: 'Two passwords should match'
    },
    required: [true, 'Last Name Required'],
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  photo: String,
  passwordChangedAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('applications', {
  ref: 'Application',
  foreignField: 'user',
  localField: '_id'
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000;
    this.confirmPassword = null;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async (newPassword, oldPassword) => {
  return await bcrypt.compare(newPassword, oldPassword);
}

userSchema.methods.passwordChanged = function (loginTimestamp) {
  if (this.passwordChangedAt) {
    return loginTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10)
  }
  return false;
}

const User = mongoose.model('User', userSchema);

export default User;