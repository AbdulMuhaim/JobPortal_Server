const jwt = require('jsonwebtoken')
const user = require('../models/userModel')
const employer = require('../models/employerModel')

module.exports = {
    generateToken:(id,role)=>{
        const token = jwt.sign({id,role},process.env.TOKEN_SECRET)
        return token
    },


    verifyUserToken:async(req,res,next)=>{
        try{
            let token = req.headers.authorization
            if(!token){
                console.log('no token')
                return res.status(403).json({errmsg:'Access denied'})
            }

            if(token.startsWith('Bearer')){
               console.log('employee token is there')
               token = token.slice(7,token.length).trimLeft()
            }

            const verified = jwt.verify(token,process.env.TOKEN_SECRET)
            console.log(verified.role)


            if(verified.role === 'Employee'){
                const userData = await user.findOne({_id:verified.id});
                if(!userData.status){
                    return res.status(403).json({message:'user is blocked by admin'})
                }else{
                    req.payload = verified
                    next()
                }
                }else{
                    req.status(403).json({errmsg:'Access is denied'})
                }
            }catch (error){
               res.status(500).json({errmsg:'server error'})
            }
        },


        
    verifyEmployerToken:async(req,res,next)=>{
        try{
            let token = req.headers.authorization
            if(!token){
                console.log('no token')
                return res.status(403).json({errmsg:'Access denied'})
            }

            if(token.startsWith('Bearer')){
               console.log('employer token is there')
               token = token.slice(7,token.length).trimLeft()
            }

            const verified = jwt.verify(token,process.env.TOKEN_SECRET)

            if(verified.role === 'Employer'){
                const employerData = await employer.findOne({_id:verified.id});
                if(!employerData.status){
                    return res.status(403).json({errmsg:'user is blocked by admin'})
                }else{
                    req.payload = verified
                    next()
                }
                }else{
                    req.status(403).json({errmsg:'Access is denied'})
                }
            }catch (error){
               res.status(500).json({errmsg:'server error'})
            }
        },



        verifyAdminToken:async(req,res,next) => {
          try{
             let token = req.headers.authorization
             if(!token){
                return res.status(403).json({errmsg:'Access Denied'})
             }
             
            if(token.startsWith('Bearer')){
                token = token.slice(7,token.length).trimLeft()
             }

             const verified = jwt.verify(token,process.env.TOKEN_SECRET)

             if(verified.role === 'Admin'){
                console.log(verified.role);
                req.payload = verified
                next()
             }else{
                return res.status(403).json({errmsg:'Access is denied'})
             }
          }catch(err){
            console.log(err.message);
            return res.status(500).json({errmsg:'Server error'})
          }
        }


       
    }


