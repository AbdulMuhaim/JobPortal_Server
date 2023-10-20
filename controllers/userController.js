const { generateToken } = require("../middlewares/authVerify");
const user = require("../models/userModel");
const employer = require("../models/employerModel");
const job = require("../models/jobModel");
const category = require("../models/categoryModel");
const application = require("../models/applicationModel")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
let otpGeneratedTime;
const otpExpirationTimeMs = 30 * 1000;
let clientOTP;
let serverOTP;


function generateOTP() {
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  return otp;
}

const register = async (req, res) => {
  const { role, name, email, mobile, password, confirmPassword, otp } = req.body;
  clientOTP = otp;

  try {
    if (role === "Employee") {
      const userFind = await user.findOne({ email: email });
      if (userFind) {
        return res
          .status(200)
          .json({ message: "user already exist", status: false });
      } else if (otp) {
        const currentTime = new Date();
        const isOtpExpired =
          currentTime - otpGeneratedTime > otpExpirationTimeMs;
        if (isOtpExpired) {
            console.log("OTP has expired");
            return res
            .status(200)
            .json({ message: "otp expired", status: false });
        } else {
          console.log("OTP is still valid");
          if (otp === serverOTP) {
            let hashPassword = await bcrypt.hash(password, 10);
            user.create({
              name: name,
              email: email,
              mobile: mobile,
              password: hashPassword,
              role: role,
            });
            res
              .status(200)
              .json({ message: "registered successfully", status: true });
          } else {
            res
              .status(200)
              .json({ message: "incorrect otp", status: true });
          }
        }
      } else {
        registrationEmail(email);
        return res.status(200).json({ message: "ready for otp", status: true });
      }
    } else if (role === "Employer") {
      const employerFind = await employer.findOne({ email: email });
      if (employerFind) {
        return res
          .status(200)
          .json({ message: "employer already exist", status: false });
      } else if (otp) {
        if (otp === serverOTP) {
          let hashPassword = await bcrypt.hash(password, 10);
          employer.create({
            name: name,
            email: email,
            mobile: mobile,
            password: hashPassword,
            role: role,
          });
          res
            .status(200)
            .json({ message: "registered successfully", status: true });
        } else {
          res
            .status(200)
            .json({ message: "otp validation failed", status: true });
        }
      } else {
        registrationEmail(email);
        return res.status(200).json({ message: "ready for otp", status: true });
      }
    }
  } catch (error) {
    console.log("userControl Error");
  }
};

const login = async (req, res) => {
  try {
    console.log("came")
    const { email, password } = req.body;

    const exsistingUser = await user.findOne({ email });
    console.log(exsistingUser)

    if (exsistingUser) {
      const passwordCheck = await bcrypt.compare(
        password,
        exsistingUser.password
      );
      if (!passwordCheck)
        return res.status(200).json({ message: "Password doesn't match" });
      const token = generateToken(exsistingUser._id, "Employee");
      return res.status(200).json({
        message: "Login Succesfull",
        role: exsistingUser.role,
        name: exsistingUser.name,
        id: exsistingUser._id,
        token,
      });
    } else {
      console.log("user not found");
      return res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("catch");
    res.status(500).json({ message: "Something went wrong" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const emailFind = await user.findOne({ email });
    if (emailFind) {
      forgotPassEmail(email, emailFind.name, emailFind._id);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const newOTP = async (req,res)=> {
    const email = req.body.email
    registrationEmail(email);
}

const forgotPassEmail = async (email, name, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "muhaim25@gmail.com",
        pass: "hyfdkxuwsdrwzrrn",
      },
    });

    const mailOption = {
      from: "muhaim25@gmail.com",
      to: email,
      subject: "Forgott password",
      html: `<p> Hii ${name} please click <a href="${process.env.FRONT_END_URL}/resetPassword/${id}">here</a> if you want to reset your password</p>`,
    };

    const sendMailPromise = () => {
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    };
    const info = await sendMailPromise();
    console.log("email has been sent", info.response);
  } catch (error) {
    console.error(error);
  }
};

const registrationEmail = async (email) => {
  serverOTP = generateOTP();
  otpGeneratedTime = new Date();

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "muhaim25@gmail.com",
        pass: "hyfdkxuwsdrwzrrn",
      },
    });

    const mailOption = {
      from: "muhaim25@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: `<p>${serverOTP}</p>`,
    };

    const sendMailPromise = () => {
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    };
    const info = await sendMailPromise();
    console.log("email has been sent", info.response);
  } catch (error) {
    console.error(error);
  }
};

const setNewPassword = async (req, res) => {
  try {
    const { password, Id } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    const changePassword = await user.updateOne(
      { _id: Id },
      { $set: { password: hashedPassword } }
    );
    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const email = req.body.profileDt.email;
    const emailFind = await user.findOne({ email: email });
    if (emailFind) {
      const token = generateToken(emailFind._id, "user");
      return res.status(200).json({
        message: "Login Succesfull",
        role: emailFind.role,
        name: emailFind.name,
        id: emailFind._id,
        token,
      });
    } else {
      console.log("user not found");
      return res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const profileData = async (req, res) => {

  if (req.body.languageValue) {
    const addLanguage = await user.updateOne(
      { _id: req.payload.id },
      { $push: { languages: req.body.languageValue } }
    );
  } else if (req.body.skillValue) {
    const addSkill = await user.updateOne(
      { _id: req.payload.id },
      { $push: { skills: req.body.skillValue } }
    );
  } else if (req.body.educationValue) {
    const newEducation = {
      institution: req.body.educationValue.institution,
      field: req.body.educationValue.field,
      year: req.body.educationValue.year,
    };

    try {
      const result = await user.updateOne(
        { _id: req.payload.id },
        { $push: { education: newEducation } }
      );
    } catch (error) {
      console.error(error);
    }
  } else if (req.body.updatedUserData) {
    const updatedFields = {
      age: req.body.updatedUserData?.age,
      totalExperience: req.body.updatedUserData?.totalExperience,
      state: req.body.updatedUserData?.state,
      country: req.body.updatedUserData?.country,
      maritalStatus: req.body.updatedUserData?.maritalStatus,
      cv: req.body.updatedUserData?.cv
    };

    try {
      const result = await user.updateOne(
        { _id: req.payload.id },
        { $set: updatedFields }
      );
      console.log("Fields updated successfully:", result);
    } catch (error) {
      console.error(error);
    }
  } else if (req.body.experienceValue) {
    const newExperience = {
      companyName: req.body.experienceValue?.companyName,
      experience: req.body.experienceValue?.experience,
      image: req.body?.imageUrl,
    };

    try {
      const result = await user.updateOne(
        { _id: req.payload.id },
        { $push: { experience: newExperience } }
      );
      console.log("Experience data added successfully:", result);
    } catch (error) {
      console.error(error);
    }
  } else if (req.body.profilePicValue) {
    const updatedFields = {
      name: req.body.profilePicValue?.name,
      about: req.body.profilePicValue?.about,
      profession: req.body.profilePicValue?.profession,
      image: req.body.imageUrl,
    };

    try {
      const result = await user.updateOne(
        { _id: req.payload.id },
        { $set: updatedFields }
      );
      console.log("Fields updated successfully:", result);
    } catch (error) {
      console.error(error);
    }
  }
};

const fetchProfileData = async (req, res) => {

  try {
    const userData = await user.find({ _id:req.payload.id });
    res.json({ userData });
  } catch (error) {
    console.log(error);
  }
};

const removeProfileData = async (req, res) => {
  data = req.body.data;
  role = req.body.role;

  if (role === "language") {
    user
      .updateOne({ _id:req.payload.id }, { $pull: { languages: data } })
      .then((result) => {
        console.log(`Updated ${result.nModified} document`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (role === "skill") {
    user
      .updateOne({ _id: req.payload.id }, { $pull: { skills: data } })
      .then((result) => {
        console.log(`Updated ${result.nModified} document`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  if (role === "experience") {
    user
      .updateOne(
        { _id: req.payload.id },
        { $pull: { experience: { companyName: data.companyName } } }
      )
      .then((result) => {
        console.log(`Updated ${result.nModified} document`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  if (role === "education") {
    user
      .updateOne(
        { _id: req.payload.id },
        { $pull: { education: { institution: data.institution } } }
      )
      .then((result) => {
        console.log(`Updated ${result.nModified} document`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
  
  const fetchJobs = async (req, res) => {
    try {
  
      let skip = req.body.dataCount;
      const limit = 6; // Number of results to return per page
      const filter = req.body.filterData;
      const searchValue = req.body.search;
  
      const query = {
        status: true, 
        isBlocked: false, 
      };
  
      // Add filter criteria to the query based on filterData
      if (filter && filter.category) {
        query.categoryName = filter.category;
      }
      if (filter && filter.location) {
        query.country = filter.location;
      }
      if (filter && filter.experience) {
        query.experience = filter.experience;
      }
      if (filter && filter.workingHour) {
        query.workingTime = filter.workingHour;
      }
      // Add search criteria to the query based on searchValue
      if (searchValue) {
        query.$or = [
          { categoryName: { $regex: searchValue, $options: 'i' } }, // Case-insensitive search by categoryName
          { companyName: { $regex: searchValue, $options: 'i' } },   // Case-insensitive search by companyName
        ];
      }
  
      const jobs = await job.find(query).skip(skip).limit(limit);
      res.json({ jobs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  };
  



const fetchCategories = async (req, res) => {
  try {
    const categories = await category.find({});
    res.json({ categories });
  } catch (error) {
    console.log(error);
  }
};



const jobApplication = async (req, res) => {

  let cv;
  const userData = await user.findOne({ _id: req.payload.id });

  try {
    // Update user's appliedJobs
    const userUpdateResult = await user.updateOne({ _id: req.payload.id }, { $push: { appliedJobs: req.body.id } });
    console.log(`Updated ${userUpdateResult.nModified} document`);

    // Update job's appliedEmployers
    const jobUpdateResult = await job.updateOne({ _id: req.body.id }, { $push: { appliedEmployees: req.payload.id} });
    console.log(`Updated ${jobUpdateResult.nModified} document`);

    const employer = await job.findOne({ _id: req.body.id }).select('employerId');




    application.create({
      coverLetter : req?.body?.letter,
      date: Date.now(),
      cv: req?.body?.cv || userData?.cv,
      jobId: req.body.id,
      employeeId : req.payload.id,
      employerId : employer.employerId
    })

    res.status(200).json({ message: "applied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const fetchJobDetails = async(req,res)=>{
  const jobDetails = await job.findOne({_id:req.body.jobId})
  res.json({ jobDetails });
}



const homeSearch = async(req,res)=> {
    const search = req.body.value

    try {
        const allJobs = await job.find({})
        const filteredJobs = allJobs.filter((item) => {
            return (
              search.toLowerCase() === '' ||
              item.companyName.toLowerCase().includes(search) ||
              item.categoryName.toLowerCase().includes(search)
            );
          })
          if(filteredJobs.length > 0){
            return res.status(200).json({message:'true'})
          }else{
            return res.status(200).json({message:"false"})
          }
    } catch (error) {

    }
}

const fetchNotification = async (req,res)=> {
  const data = await user.findOne({_id:req.payload.id},{notifications:1,_id:0})
  const notifications = data.notifications
  res.json({notifications});
}

module.exports = {
  register,
  login,
  forgotPassword,
  setNewPassword,
  googleLogin,
  profileData,
  fetchProfileData,
  removeProfileData,
  fetchJobs,
  fetchCategories,
  jobApplication,
  homeSearch,
  newOTP,
  fetchJobDetails,
  fetchNotification
};
