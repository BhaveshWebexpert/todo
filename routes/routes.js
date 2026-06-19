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

const router = express.Router();

router.get("/",(req,res)=>{
    // If user is login then redirect to the Dashboard or some page else redirect to the login page
    res.send("Hello world");
});

router.get("/register", (req,res)=> res.render('AuthPages/Registration') );
router.get("/login", (req,res)=> res.render("AuthPages/Login") );

router.post("/registration", Usercontroller.registerUser);
router.post("/login", Usercontroller.loginUser);

router.post("/add", Auth , Taskcontroller.AddTask);
router.get("/read", Auth, Taskcontroller.ReadTasks);
router.put("/update", Auth, Taskcontroller.UpdateTask);
router.delete("/delete", Auth, Taskcontroller.DeleteTask);

router.post("/logout", Auth, Usercontroller.logoutUser);

export default router;