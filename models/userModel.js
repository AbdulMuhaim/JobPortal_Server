const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  profilePic:{
    type:String
  },
  languages: {
    type: Array,
  },
  skills: {
    type: Array,
  },
  age: {
    type: String,
  },
  totalExperience: {
    type: String,
  },
  state: {
    type: String,
  },
  country:{
    type:String
  },
  maritalStatus: {
    type: String,
  },
  experience: [
    {
      companyName: {
        type: String,
      },
      experience: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  ],
  education: [
    {
      institution:{
        type:String
      },
      field:{
        type:String
      },
      year:{
        type:String
      }
    }
  ],
  appliedJobs: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'job'
    }
  ],
  profession:{
    type:String
  },
  image:{
    type:String
  },
  about:{
    type:String
  },
  cv:{
    type:String
  },
  notifications:[
    {
      companyName:{
        type:String
      },categoryName:{
        type:String
      },
      image:{
        type:String
      },
      status:{
        type:String
      }

    }
  ]
});

const user = mongoose.model("user", userSchema);
module.exports = user;
