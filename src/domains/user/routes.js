const express = require('express')
const router = express.Router()
const {createNewUser, authenticateUser} = require('./controller')
const {sendOTPVerificationEmail,}= require('./../email_verification_otp/controller')
//signup
router.post('/signup', async(req,res)=>{
    try {
        let {name, email, password, dateOfBirth} = req.body;

    name = name.trim()
    email = email.trim()
    password = password.trim()
    dateOfBirth = dateOfBirth.trim()

    if(name=="" || email == "" || password=="" || dateOfBirth==""){
        throw Error("Empty input fields!")      
    }
    //regex to check email
    else if(!/^[a-zA-Z ]*$/.test(name)){
        throw Error("Invalid name entered")     
    }
    else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        throw Error("Invalid email entered")
    }
    else if(!new Date(dateOfBirth).getTime()){
        throw Error("Invalid dateOfBirth entered")
    }
    else if(password.length<8){
        throw Error("Password is too short!")
    }
    else{
        const newUser = await createNewUser({
            name,
            email,
            password,
            dateOfBirth,
        })
        const emailData = await sendOTPVerificationEmail(newUser)
        res.json({
            status:"PENDING",
            message:"Verification email sent",
            data:emailData,
        })
    }
    } catch (error) {
        res.json({
            status:"FAILED",
            message: error.message,
        })
    }
})


//signin
router.post('/signin', async(req,res)=>{
    try {
        let {email, password} = req.body;
        email = email.trim()
        password = password.trim()

        if(email=="" || password== ""){
            throw Error("Empty credentials supplied!")
        }
        const authenticatedUser = await authenticateUser(email,password)
    
                        //password match
                        res.json({
                            status:"SUCCESS",
                            message:"Signin successful!",
                            data:authenticatedUser
                        })

    } 
    catch (error) {
        res.json({
            status:"FAILED",
            message:error.message,
        })        
    }
})
module.exports = router;