import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jti: { type: String, required: true, unique: true },
    lastUsedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

//auto delete the token(row) when it expired
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Token', tokenSchema, 'tokens');