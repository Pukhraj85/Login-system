const UserOTPVerification= require('./model')
const generateOTP = require('./../../util/generateOTP')
const hashData=require('./../../util/hashData')
const sendEmail = require('./../../util/sendEmail')
const sendOTPVerificationEmail = async({_id, email})=>{
    try {
        const otp = await generateOTP()
        const emailOptions = {
            from:process.env.AUTH_EMAIL,
            to:email,
            subject:"Verify your email",
            html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete signup process</p>
            <p>This code <b> expires in 1 hour</b></p>`
        }

        
        const hashedOTP = await hashData(otp)
        const newOTPVerification = await new UserOTPVerification({
            userId:_id,
            otp:hashedOTP,
            createdAt:Date.now(),
            expiresAt:Date.now()+3600000
        })
        //save otp record
        await newOTPVerification.save()
        await sendEmail(emailOptions)
        return {
            userId:_id,
            email,
        }
    } catch (error) { 
        throw error
    }
}
module.exports = {
    sendOTPVerificationEmail,
}