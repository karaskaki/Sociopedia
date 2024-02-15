import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

// REGISTER USER FUNCTION
export default register = async(req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            passowrd,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        const salt = await bcrypt.genSalt()
        const passwordHashed = await bcrypt.hash(passowrd, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            passowrd: passwordHashed,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),          
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)


    }catch(error){
        res.status(500).json({
            error: error.message,
            message: "There is an error while entering the data of newUser ",
        })
    }    
}


// LOGGING IN
export const login = async (req, res) => {
    try {

        const { email, passowrd } = req.body
        const user = await User.findOne({email: email})

        if(! user) return res.status(400).json({ msg: "User does not exist. "})

        const isMatch = await bcrypt.compare(passowrd, user.passowrd)
        if(!isMatch) return res.status(400).json({ msg: "Invalid Credentials. "})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        delete user.password
        res.status(200).json({ token, user})

    } catch(err) {
        res.status(500).json({error: err.message})
    }
}