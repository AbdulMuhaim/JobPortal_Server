const {generateToken} = require('../middlewares/authVerify')
const admin = require('../models/adminModel')
const bcrypt = require('bcrypt')
const category = require('../models/categoryModel')
const user = require('../models/userModel')
const employer = require('../models/employerModel')
const job = require('../models/jobModel')


const login = async(req,res)=>{
    try {
      console.log(req.body,"heloo");
        const {email,password} = req.body;
        const exsistingAdmin = await admin.findOne({email});
        console.log(exsistingAdmin);

        if(exsistingAdmin){


            const passwordCheck = await bcrypt.compare(password,exsistingAdmin.password)
            if(!passwordCheck) return res.status(200).json({ message: "Password doesn't match" })

            const token = generateToken(exsistingAdmin._id,'Admin')
            return res.status(200).json({ 
                message: 'Login Succesfull',
                role:exsistingAdmin.role,
                name:exsistingAdmin.name,
                id:exsistingAdmin._id,
                token 
            })         
        }else{
            console.log("admin not found");
            return res.status(200).json({ message: "Admin not found" });
        }

    } catch (error) {
        console.log("catch");
        res.status(500).json({ message: "Something went wrong" });
        
    }
}

const addCategory = async(req,res)=>{
    try {

   const newCategory = req.body.newCategory

   const categoryAdd = await category.findOne({categoryName:newCategory})
   if(categoryAdd){
    return res.status(200).json({message:"category already exist",err:true})
   }else{
    category.create({
        categoryName:newCategory
    })
    res.status(200).json({message:"category added successfully",err:false})
   }
    } catch (error) {
        console.log(error);
    }
}

const fetchCategories = async(req,res)=>{
    try {
    const categories = await category.find({})
    res.json({categories})
    } catch (error) {
        console.log(error);
    }
}

const editCategory = async(req,res)=>{
    try {
        const oldCat = req.body.oldCategory
        const newCat = req.body.newCategory
        const categories = await category.updateOne({categoryName:oldCat},{$set:{categoryName:newCat}})    
        res.json({message:"category updated successfully"})
    } catch (error) {
        console.log(error);
    }
}

const fetchUsers = async(req,res)=>{
    try {
    const users = await user.find({})
    res.json({users})
    } catch (error) {
        console.log(error);
    }
}

const userStatus = async (req,res) => {
    try {
     const email = req.body.email
      const currentUser = await user.findOne({ email: email });
  
      if (!currentUser) {
        return res.status(200).json({ message: "User not found" });
      }
  
      const newStatus = !currentUser.status;
  
      const changeStatus = await user.updateOne(
        { email: email },
        { $set: { status: newStatus } }
      );
  
      res.json({ message: "User status updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

const fetchEmployers = async(req,res)=>{
    try {
    const employers = await employer.find({})
    res.json({employers})
    } catch (error) {
    console.log(error);

    }
}

const employerStatus = async(req,res)=>{
    try {
       const email = req.body.email
        const currentUser = await employer.findOne({ email: email });

        if (!currentUser) {
          return res.status(200).json({ message: "User not found" });
        }
    
        const newStatus = !currentUser.status;
    
        const changeStatus = await employer.updateOne(
          { email: email },
          { $set: { status: newStatus } }
        );
    
        res.json({ message: "User status updated successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
}


const fetchJobs = async(req,res)=>{
    try {
    const jobs = await job.find({})
    res.json({jobs})
    } catch (error) {
    console.log(error);

    }
}

const jobStatus = async(req,res)=>{
    try {
       const id = req.body.id
        const currentJob = await job.findOne({ _id: id });

        if (!currentJob) {
          return res.status(200).json({ message: "Job not found" });
        }
    
        const newStatus = !currentJob.status;
    
        const changeStatus = await job.updateOne(
          { _id: id },
          { $set: { status: newStatus } }
        );
    
        res.json({ message: "User status updated successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
}

const fetchCardDatas = async (req, res) => {
  try {
    
    const jobsCount = await job.countDocuments();
    const categoriesCount = await category.countDocuments();
    const employersCount = await employer.countDocuments();
    const employeesCount = await user.countDocuments()

    res.status(200).json({
      jobsCount,
      categoriesCount,
      employersCount,
      employeesCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}

const fetchAmounts = async(req,res)=>{
  try {
    const employers  = await employer.find({})
    const plansData = employers.map((employer) => {
      return employer.plans;
    });
    console.log(plansData);
    res.json({plansData})
  } catch (error) {
     console.log(error)
     res.status(500).json({ error: 'Internal Server Error' }); 
  }
}

const fetchPlanCounts = async(req,res)=>{
  try {
    const plansData = await employer.find({}, 'plans');
    console.log(plansData);
    const planCounts = { '1999': 0, '3999': 0, '9999': 0 };

    plansData.forEach((employer) => {
      employer.plans.forEach((plan) => {
        planCounts[plan.amount] += 1;
      });
    });
    res.json(planCounts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}





module.exports = {
    login,
    addCategory,
    fetchCategories,
    fetchUsers,
    editCategory,
    fetchEmployers,
    userStatus,
    employerStatus,
    jobStatus,
    fetchJobs,
    fetchCardDatas,
    fetchAmounts,
    fetchPlanCounts
}