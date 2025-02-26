import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        default: "000000"
    },
    phonenumber: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    }, 
    lastname: {
        type: String,
        required: true
    },
    
    department: {
        type: String,
        required: true,
        default: "IT"
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "admin1"
    },
    password: {
        type: String,
        required: true
    },
    fcmtoken: {
        type: String,
    },
    section: {
        type: String,
    },
    apps: {
        type: Array,
        default: []
    },
});

const User = mongoose.model("User", UserSchema);

export default User;