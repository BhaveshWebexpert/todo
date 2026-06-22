import express from "express";
import Auth from '../middlewares/AuthMiddleware.js';
import Usercontroller from '../controllers/UserController.js';
import Taskcontroller from '../controllers/TaskController.js';
import { validateTask } from "../Validation/TaskValidation.js";
const router = express.Router();

router.get("/",(req,res)=>{
    const token = req.cookies.token;
    token ? res.redirect("/dashboard") : res.redirect("/login");
});

router.get("/register", (req,res)=> res.render('AuthPages/Registration') );
router.get("/login", (req,res)=> res.render("AuthPages/Login") );

router.get("/dashboard", Auth , (req,res)=> res.render('UsersPages/Dashboard') );
router.get("/tasks", Auth , (req,res)=> res.render('UsersPages/TaskList') );

router.post("/registration", Usercontroller.registerUser);
router.post("/login", Usercontroller.loginUser);

router.post("/add", Auth, validateTask, Taskcontroller.AddTask);
router.get("/read", Auth, Taskcontroller.ReadTasks);
router.get("/dashboard_data", Auth, Taskcontroller.DashboardData)
router.put("/update", Auth, Taskcontroller.UpdateTask);
router.delete("/delete", Auth, Taskcontroller.DeleteTask);

router.post("/logout", Auth, Usercontroller.logoutUser);

export default router;