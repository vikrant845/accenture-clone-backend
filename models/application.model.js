import mongoose, { mongo } from 'mongoose';

const applicationSchema = new mongoose.Schema({
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  firstName: {
    type: String,
    required: [true, 'First Name is required']
  },
  middleName: String,
  lastName: {
    type: String,
    required: [true, 'Last Name is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Transgender Male', 'Transgender Female', 'Others'],
    required: [true, 'Gender is required']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email),
      message: 'Please enter a valid email'
    }
  },
  prevWorked: {
    type: String,
    enum: ['Yes', 'No']
  },
  pincode: {
    type: Number,
    required: [true, 'Pincode is required']
  },
  presentAddress: String,
  residentialNumber: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required']
  },
  notice: {
    type: String,
    enum: ['0-15 days', '16-30 days', '31-60 days', '61-90 days', '90+ days']
  },
  relevantExp: {
    type: String,
    required: [true, 'Experience is required']
  },
  currSalary: String,
  expectedSalary: String,
  primarySkill: String,
  skillPutInPractice: String,
  additionalSkills: [{
    skill: String,
    experience: String,
    yearPutInPractice: String
  }],
  totalExperience: String,
  highestEducationalQualification: {
    type: String,
    required: [true, 'Educational qualification is required']
  },
  graduationYear: String,
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  panAvailable: {
    type: String,
    enum: ['Yes', 'No']
  },
  panNumber: String,
  passportAvailable: {
    type: String,
    enum: ['Yes', 'No']
  },
  collegeName: String,
  organizationName: String,
  howDidYouHear: String,
  disability: String,
  whatsappAlerts: Boolean,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job'
  }
}, { timestamps: true });

applicationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-passwordChangedAt'
  });
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;