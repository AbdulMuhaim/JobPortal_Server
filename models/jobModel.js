const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required:true
  },
  companyName:{
    type:String,
    required:true
  },
  skills:{
    type:String,
    required:true
  },
  qualifications:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  experience:{
    type:String,
    required:true
  },
  workingTime:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  country:{
    type:String,
    required:true
  },
  street:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  zip:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  status:{
    type:Boolean,
    required:true,
    default:false
  },
  isBlocked:{
    type:Boolean,
    required:true,
    default:false
  },
  appliedEmployees: [
  { type:mongoose.Schema.Types.ObjectId,
  ref:'user'} 
  ],
  employerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'employer'
  }

})

const job = mongoose.model('job',jobSchema);
module.exports = job;

