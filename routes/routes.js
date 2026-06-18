import mongoose from "mongoose";
import express from "express";
import User from "../Models/User.js"
import jwtsecret from "../config/EnvVar.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import Task from "../Models/Task.js";
import Auth from '../middlewares/AuthMiddleware.js'

const router = express.Router();

router.get("/",(req,res)=>{
    // If user is login then redirect to the Dashboard or some page else redirect to the login page
    res.send("Hello world");
});

router.get("/register", (req,res)=>{
    res.render('AuthPages/Registration');
});

router.get("/login", (req,res)=>{
    res.render("AuthPages/Login");
});

// router.post("/logout", async (req,res)=>{
//     try {
        
//     } catch (e) {
        
//     }
// });

router.post("/registration", async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email is already registered" });

        const user = new User({name,email,password});
        await user.save();

        return res.redirect('/login');

    } catch (e) {
        console.error("Error while registering user : ",e);
        return res.status(500).json({"status":false, message:"oops! something went wrong....", "error":e});
    }
});

router.post("/login", async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Entered email does not exists."});

        // Match the credentials and if match correctly then dispatch the JWT token else send invalid credentials error

        const matching = await bcrypt.compare(password, user.password);
        if (!matching) return res.status(400).json({ message: "Invalid Credentials."});

        const token = jwt.sign(
                { id: user._id, email: user.email },
                jwtsecret.jwt_token, 
                { expiresIn: '1h' } 
            );

        return res.status(200).json({"status":true, message:"User is Login successfully.", token});

    } catch (e) {
        console.error("Error while Login user : ",e);
        return res.status(500).json({"status":false, message:"oops! something went wrong....", "error":e});
    }
});

router.post("/add", Auth , async (req,res)=>{
    try {
        const {title, description, status, due} = req.body;
        const user_id = req.user.id;
        const task = new Task({user_id, title, description, status, due});
        await task.save();

        return res.status(200).json({"status":true, message:"Task is added successfully.", "data":task});

    } catch (e) {
        console.error("Error in while adding task : ",e);
        return res.status(500).json({"status":false, message:"oops! something went wrong....", "error":e});
    }
})

router.get("/read", Auth, async (req,res)=>{
    try {
        const task = await Task.find({user_id:req.user.id});
        return res.status(200).json({"status":true, message:"Task are fetched successfully.", "data":task});
    } catch (e) {
        console.error("Error in while fetching task : ",e);
        return res.status(500).json({"status":false, message:"oops! something went wrong....", "error":e});
    }
});

router.put("/update", Auth, async (req,res)=>{
    try {
        const {id,title,description,status,due} = req.body;      
        if (!id) return res.status(400).json({ status: false, message: "Task ID is compulsory." });
        
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (due !== undefined) updateData.due = due;

        const updatedTask = await Task.findOneAndUpdate(
            { 
                _id: id,              
                user_id: req.user.id  
            }, 
            { $set: updateData },    
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) return res.status(404).json({ status: false, message: "Task doe not exist or you can not edit others tasks." });

        return res.status(200).json({ status: true, message: "Task is updated successfully.", task: updatedTask });

    } catch (e) {
        console.error("Error in while updating task : ",e);
        return res.status(500).json({"status":false, message:"oops! something went wrong....", "error":e});
    }
})

router.delete("/delete", Auth, async (req,res)=>{
    try {
        const {id} = req.body;
        
        if (!id) return res.status(400).json({ status: false, message: "Task ID is compulsory." });

        const del = await Task.findByIdAndDelete(id);

        return res.status(200).json({"status":true, message:"Task is removed successfully.", "data":del});

    } catch (e) {
        console.error("Error in while deleting task : ",e);
        return res.status(500).json({"status":false, message:"oops! something went wrong....", "error":e});
    }
});

export default router;