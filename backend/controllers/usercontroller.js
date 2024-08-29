import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { response } from "express";

// LOGIN USER
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email})
        const name = user.name;

        if (!user) {
            return res.json({success:false, message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success:false, message: "Invalid credentials"});
        }

        // CREATE TOKEN IF PASSWORD MATCHES
        const token = createToken(user._id);
        res.json({success:true, token, name, email});

    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Something went wrong"});
    }
    

}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//REGISTER USER
const registerUser = async (req, res) => {
    const {name , email, password, dateofbirth, mobilenumber, gender, address, institute, group} = req.body;
    try {
        // CHECK IF USER EXISTS
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false, message: "User already exists"});
        }

        // VALIDATE EMAIL AND PASSWORD STRENGTH
        if (!validator.isEmail(email)) {
            return res.json({success:false, message: "Enter a valid email"});
        }

        if (password.length < 8) {
            return res.json({success:false, message: "Password is too short"});
        }

        // HASHING PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            dateofbirth: dateofbirth,
            mobilenumber: mobilenumber,
            gender: gender,
            address: address,
            institute: institute,
            group: group
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true, token});
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Something went wrong"});
    }

}

export { loginUser, registerUser };