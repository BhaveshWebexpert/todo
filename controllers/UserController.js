import mongoose from "mongoose";
import express from "express";
import User from "../Models/User.js"
import jwtsecret from "../config/EnvVar.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import Task from "../Models/Task.js";
import Auth from '../middlewares/AuthMiddleware.js'
import crypto from 'crypto'
import Token from "../Models/Token.js";
import Usercontroller from '../controllers/UserController.js'
import Taskcontroller from '../controllers/TaskController.js'

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email is already registered" });

        const user = new User({ name, email, password });
        await user.save();

        return res.redirect('/login');

    } catch (e) {
        console.error("Error while registering user : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Entered email does not exists." });

        const matching = await bcrypt.compare(password, user.password);
        if (!matching) return res.status(400).json({ message: "Invalid Credentials." });

        const jti = crypto.randomUUID();

        const token = jwt.sign(
            { id: user._id, email: user.email, jti },
            jwtsecret.jwt_token,
            { expiresIn: '1h' } 
        );

        await Token.create({
            user_id: user._id,
            jti,
            name: req.body.device_name || "default",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        });

        return res.status(200).json({ status: true, message: "User is Login successfully.", token });

    } catch (e) {
        console.error("Error while Login user : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
};

const logoutUser = async (req, res) => {
    try {
        await req.tokenDoc.deleteOne();
        return res.status(200).json({ status: true, message: "User logged out successfully." });
    } catch (e) {
        console.error("Error while logout : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e.message });
    }
};

export default {
    registerUser,
    loginUser,
    logoutUser
};