const {generateToken} = require('../middlewares/authVerify')
const employer = require('../models/employerModel')
const bcrypt = require('bcrypt')
const job = require('../models/jobModel')
const user = require('../models/userModel')
const jwt = require("jsonwebtoken");
const application = require("../models/applicationModel")
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
    
        const exsistingEmployer = await employer.findOne({email});
        if(exsistingEmployer){
            const passwordCheck = await bcrypt.compare(password,exsistingEmployer.password)
            if(!passwordCheck) return res.status(401).json({ message: "Password doesn't match" })
            const token = generateToken(exsistingEmployer._id,'Employer')
            return res.status(200).json({ 
                message: 'Login Succesfull',
                role:exsistingEmployer.role,
                name:exsistingEmployer.name,
                id:exsistingEmployer._id,
                token 
            })         
        }else{
            console.log("not found");
            return res.status(200).json({ message: "Employer not found" });
        }

    } catch (error) {
        console.log("catch");
        res.status(500).json({ message: "Something went wrong" });
        
    }
}



const addJob = async (req, res) => {
    try {
     
      const cloudinaryImage = req.body.imageUrl
      job.create({
        categoryName: req.body.values.categoryName,
        companyName: req.body.values.companyName,
        skills: req.body.values.skills,
        qualifications: req.body.values.qualifications, 
        description: req.body.values.description,
        experience: req.body.values.experience,
        workingTime: req.body.values.workingTime,
        email: req.body.values.email,
        country: req.body.values.country,
        street: req.body.values.street,
        city: req.body.values.city,
        state: req.body.values.state,
        zip: req.body.values.zip,
        image:cloudinaryImage,
        employerId:req.payload.id
      })
      res.status(200).json({message:"Job created successfully",status:true})
    } catch (error) { 
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const fetchJobs = async(req,res)=>{
    try {
      const empPlan = await employer.findOne({_id:req.payload.id},{currentPlan:1,_id:0})
      const jobs = await job.find({employerId:req.payload.id})
      res.json({jobs,empPlan})
    } catch (error) {
      console.log(error);
    }
  }

  const jobIsBlocked = async(req,res)=>{
    const id = req.body.id
    const currentJob = await job.findOne({_id:id})
    const newIsBlocked = !currentJob.isBlocked
    await job.updateOne({ _id: id },{$set:{isBlocked:newIsBlocked}})
    .then(() => {
      console.log('Job updated successfully');
    })
    .catch((error) => {
      console.error('Error updating job:', error);
    });
  }
  

  const fetchApplications = async(req,res)=>{
    try {
    const applications = await application.find({employerId:req.payload.id})
    .populate({
      path: 'jobId',
      select: 'companyName categoryName employerId'
    })
    .populate({
      path: 'employeeId',
      select: 'name email mobile'
    });
    res.json({applications})
    } catch (error) {
      console.log(error);
    }
  }

  const employeeInfo = async(req,res)=> {
    try {
      const userData = await user.find({ email: req.body.email });
      res.json({ userData });
    } catch (error) {
      console.log(error);
    }  
  }

  const payment = async(req,res)=> {
    try {
      const employerId = req.payload.id
      const amount = req.query.amount
        const user = await stripe.customers.create({
            metadata: {
              price : amount
            }
          })
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: 'MY JOB',
                },
                unit_amount: amount * 100,
              },
              quantity: 1,
            },
          ],
            mode: 'payment',
            success_url: `${process.env.BACKEND_URL}/employer/paymentSuccess?amount=${amount}&employerId=${employerId}`,
            cancel_url: `${process.env.BACKEND_URL}/employer/paymentFail?`
          })
          res.send({ url: session.url })
    } catch (error) {
      console.log(error)
    }
  }

  const paymentSuccess = async(req,res)=>{

    const id = req.query.employerId
    const amount = req.query.amount
    const amountString = amount.toString();
   try {

    const newPlanData = {
      amount: amountString,
      date: new Date() 
    }
    
    await employer.updateOne(
      { _id: id },
      { $push: { plans: newPlanData } }
    );

    await employer.updateOne(
      { _id: id },
      { $set: { currentPlan: newPlanData } }
    );
    res.redirect(`${process.env.FRONT_END_URL}/employer/paymentSuccess`)
   } catch (error) {
    console.log(error);
    res.redirect(`${process.env.FRONT_END_URL}/employer/paymentFail`)
   }

  }

  const paymentFail = async(req,res)=>{
    res.redirect(`${process.env.FRONT_END_URL}/employer/paymentFail`)
  }


  const fetchEmployerPlan = async (req, res) => {

    const findCurrentPlan = await employer.findOne({_id:req.payload.id},{currentPlan:1,_id:0})

    const currentPlan = findCurrentPlan.currentPlan.amount

    res.json({currentPlan})
    
  };
  
  const applicationStatus = async (req,res) => {
    const status = req.body.status.status
    const id = req.body.appId

    try {
      if(status === 'accepted'){
        await application.updateOne({_id:id},{$set:{status:status}})
      }
      if(status === 'rejected'){
        await application.updateOne({_id:id},{$set:{status:status}})
      }
      const employee = await application.findOne({_id:id})
      .populate({
        path:'jobId',
        select:'companyName categoryName image'
      })


      const newNotification = {
        status:status,
        companyName:employee.jobId.companyName,
        categoryName:employee.jobId.categoryName,
        image:employee.jobId.image
      }
      const emp = await user.updateOne({_id:employee.employeeId},{$push:{notifications:newNotification}})
      res.status(200)

    } catch (error) {
      console.log(error);
    }

  }
 




module.exports = {
    login,
    addJob,
    fetchJobs,
    jobIsBlocked,
    fetchApplications,
    employeeInfo,
    payment,
    paymentSuccess,
    paymentFail,
    fetchEmployerPlan,
    applicationStatus
    
}