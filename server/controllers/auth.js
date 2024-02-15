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