import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },isAdmin:{
        type: Boolean,
        default: false
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    profilePic: {
        data: Buffer,
        contentType: String,
        
    },
    profilePicURL: {
        type: String,
        default: "https://sggs.ac.in/assets/back/assets/img/avatars/1.png",
       
    },moodStatus:{
        type: String,
        required: true,
        default: 'Happy'
    },isActive:{
        type: Boolean,
        required: true,
        default: false
    },isBanned:{
        type: Boolean,
        required: true,
        default: false

    },bannedAt: {
        type: Date,
        default: Date.now
    },contacts: [

        {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'  // Reference to other users
    },]
    ,refreshToken: {
        type: String,
        default: null
    },createdAt: {
        type: Date, 
        default: Date.now
    }
})

export default mongoose.model("Users", userSchema)