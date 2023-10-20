const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
 coverLetter: {
    type: String,
  },
  date: {
    type: Date,
    required:true
  },
  cv: {
    type:String,
  },
  jobId :{
   type:mongoose.Schema.Types.ObjectId,
   ref:'job'
  }, 
  employeeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  employerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'employer'
  },
  status:{
    type:String,
    default:'pending'
  }


})

const application = mongoose.model('application',applicationSchema);
module.exports = application;

