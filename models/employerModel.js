const mongoose = require('mongoose')


const employerSchema= new mongoose.Schema({
  name:{
        type:String,
        required:true
    },
  email:{
        type:String,
        required:true
    },
  mobile:{
        type:String,
        required:true
    },
  password:{
        type:String,
        required:true
    },
  role:{
        type:String,
        required:true
    },
  status:{
        type:Boolean,
        required:true,
        default:true
  },
  plans:[
      {
       amount: {
        type:String,
        default:'0' 
      },
       date: {
        type:Date
      },
      }
],
currentPlan:{
  amount: {
    type:String,
  },
   date: {
    type:Date
  },
}
    
})


const employer = mongoose.model("employer",employerSchema);
module.exports = employer