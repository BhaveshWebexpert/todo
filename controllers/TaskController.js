import Task from "../Models/Task.js";

const AddTask = async (req, res) => {
    try {
        const { title, description, status, due } = req.body;
        const user_id = req.user.id;
        const task = new Task({ user_id, title, description, status, due });
        await task.save();

        return res.status(200).json({ status: true, message: "Task is added successfully.", data: task });
    } catch (e) {
        console.error("Error in while adding task : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
};

const ReadTasks = async (req, res) => {
    try {
        const task = await Task.find({ user_id: req.user.id });
        return res.status(200).json({ status: true, message: "Task are fetched successfully.", data: task });
    } catch (e) {
        console.error("Error in while fetching task : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
};

const DashboardData = async (req,res)=>{
    try {
        const pendingCount = await Task.countDocuments({status:false, user_id:req.user.id})
        const completedCount = await Task.countDocuments({status:true, user_id:req.user.id})

        const pendingTask = await Task.find({ user_id: req.user.id , status:false});
        console.log(pendingTask);
        return res.status(200).json({ status: true, message: "Data are fetched successfully.", data: [pendingTask, {"pendingCount":pendingCount}, {"completedCount":completedCount}] });

    } catch (e) {
        console.error("Error in DashboardData from TaskController : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
}

const UpdateTask = async (req, res) => {
    try {
        const { id, title, description, status, due } = req.body;      
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
        console.error("Error in while updating task : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
};

const DeleteTask = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) return res.status(400).json({ status: false, message: "Task ID is compulsory." });

        const del = await Task.findByIdAndDelete(id);

        return res.status(200).json({ status: true, message: "Task is removed successfully.", data: del });

    } catch (e) {
        console.error("Error in while deleting task : ", e);
        return res.status(500).json({ status: false, message: "oops! something went wrong....", error: e });
    }
};

export default {
    AddTask,
    ReadTasks,
    DashboardData,
    UpdateTask,
    DeleteTask
};