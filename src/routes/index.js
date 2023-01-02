const express = require('express')
const router = express.Router()

const userRoutes = require('./../domains/user')
router.use("/user", userRoutes)
const EmailVerificationOTPRoutes = require('./../domains/email_verification_otp')
router.use("/user", EmailVerificationOTPRoutes)

module.exports = router