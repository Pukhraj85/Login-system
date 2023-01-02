const express = require('express')
const router = express.Router()
const UserOTPVerification= require('./model')
const User = require('./../user/model')
const bcrypt = require('bcrypt')
router.post("/verifyOTP", async(req,res)=>{
    try{
        let { userId, otp} = req.body
        if(!userId || !otp){
            throw Error("Empty otp details are not allowed")
        }
        else{
            const UserOTPVerificationRecords = await UserOTPVerification.find({
                userId,
            })
            if(UserOTPVerificationRecords.length<=0){
                //no records found
                throw new Error(
                    "Account record doesn't exist or has been verified already. Please Signup or Login"
                )
            }
            else{
                //user otp record exist 
                const {expiresAt} = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp
                if(expiresAt <Date.now()){
                    //user otp record has expired
                    await UserOTPVerification.deleteMany({userId})
                    throw new Error("Code has expired. Please request again")
                }
                else{
                    const validOTP = await bcrypt.compare(otp,hashedOTP)
                    if(!validOTP){
                        //supplied otp is wrong
                        throw new Error("Invalid code passed. Check your inbox")
                    }
                    else{
                        //success
                        await User.updateOne({_id:userId}, {verified:true})
                        await UserOTPVerification.deleteMany({userId})
                        res.json({
                            status:"VERIFIED",
                            message:"User email verified successfully!"
                        })
                    }
                }
            }
        }
    }
    catch(error){
        console.log(error)
        res.json({
            status:"FAILED",
            message:error.message
        })
    }
})
module.exports = router;