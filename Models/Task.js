import mongoose from "mongoose";

const taksSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: Boolean, required: true, default: false },
    due: { 
        type: Date,
        required: true, 
        validate: {
            validator: function(value) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: "The due date cannot be in the past!"
        }
    },
    },{ 
        timestamps: { 
            createdAt: 'created_at',
            updatedAt: 'updated_at' 
        }
});

export default mongoose.model('Task', taksSchema, 'tasks');