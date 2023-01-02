const User = require("./../user/model")
const hashData = require('../../util/hashData')
const verifyHashedData=require('../../util/verifyHashedData')
const createNewUser = async(data)=>{
    try {
            const {name, email, password, dateOfBirth} = data;       
            //checking if user already exists
            const existingUser= await User.find({email})

                if(existingUser.length){
                    throw Error("User with provided mail already exist")
                }
                else{
                    //try to create new user 

                    //password handling
                    const hashedPassword=await hashData(password)
                    const newUser = new User({
                        name,
                        email,
                        password:hashedPassword,
                        dateOfBirth,
                        //first change so that we can see if user is verified
                        verified:false
                    })
                    const createdUser = await newUser.save()
                    return createdUser
        }
    }catch(error) {
        throw error;
    }
}
const authenticateUser=async (email,password)=>{
    try {
        const fetchedUsers = await User.find({email})
        if(!fetchedUsers.length){
            throw Error("Invalid credentials entered")
        }
        else{
            if(!fetchedUsers[0].verified){
                throw Error("Email hasn't been verified yet. Chech your inbox.")
            }
            else{
                const hashedPassword=fetchedUsers[0].password
                const passwordMatch = await verifyHashedData(password,hashedPassword)
                if(!passwordMatch){
                    throw Error("Invalid password entered")
                }
                else{
                    return fetchedUsers
                }
            }
        }
    } catch (error) {
        throw error
    }
}
module.exports = {createNewUser, authenticateUser}