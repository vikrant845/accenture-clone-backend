import mongoose, { Schema } from 'mongoose';

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Please enter the name of the job' ],
    minLength: [5, 'A job name must be atleast 5 letters long']
  },
  city: {
    type: String,
    default: 'PAN India'
  },
  country: {
    type: String,
    default: 'PAN India'
  },
  datePosted: {
    type: Date,
    default: Date.now()
  },
  usersApplied: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  internal: {
    type: Boolean,
    default: false,
    select: false
  },
  technology: String,
  businessArea: String,
  role: {
    type: String,
    required: [ true, 'A job should be associated with a role' ]
  },
  description: [String],
  level: {
    type: Number,
    validate: {
      validator: (value) => Number.isInteger(value),
      message: 'Level should be only an integer'
    }
  },
  experience: String,
  location: String,
  mustSkills: [String],
  goodSkills: [String],
  responsibilities: [String],
  technicalExperience: [String],
  professionalExperience: [String],
  educationalQualification: [String],
  qualification: [String],
  number: {
    type: Number,
    unique: true
  }
});

jobSchema.pre('save', function(next) {
  this.number = 100000 + (Math.random() * 900000);
  next();
});

jobSchema.pre(/^find/, function(next) {
  this.find({ internal: { $ne: true } });
  next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;