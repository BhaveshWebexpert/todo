import mongoose from "mongoose";
import express from "express";
import User from "../Models/User.js"

const router = express.Router();

router.get("/",(req,res)=>{
    // If user is login then redirect to the Dashboard or some page else redirect to the login page
    res.send("Hello world");
});

router.get("/register", (req,res)=>{
    res.render('AuthPages/Registration');
});

router.get("/login", (req,res)=>{
    res.send("Login Page");
});

router.post("/registration", async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const user = new User({name,email,password});
        await user.save();

        return res.status(201).json({"status":true, message:"User is registered successfully.", user});

    } catch (e) {
        console.error("Error while registering user : ",e);
    }
});

export default router;