import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    password: { 
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },
    createAt: {
        type: Number,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
    }
});

const User = mongoose.model("User", UserSchema);

export default User;

  
