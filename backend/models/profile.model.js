import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    fieldOfstudy: {
        type: String,
        default: '',
    },
});

const workSchema = new mongoose.Schema({
    company: {
        type: String,
        default: "",
    },
    position: {
        type: String,
        default: '',
    },
    years: {
        type: String,
        default: '',
    }
});

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    bio: {
        type: String,
        default: '',
    },
    currentPost: {
        type: String,
        default: '',
    },
    pastWork: {
        type: [workSchema],
        default: [],
    },
    education: {
        type: [educationSchema],
        default: [],
    },
});

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
