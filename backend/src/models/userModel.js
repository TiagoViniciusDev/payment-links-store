import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: {type: String, enum: ["admin", "user"], default: "user", required: true}
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema)

export default UserModel