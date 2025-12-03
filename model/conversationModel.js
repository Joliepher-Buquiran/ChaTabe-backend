import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema({

    members: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
    membersUsernames: [{type: String}],
    isBlocked: {type: Boolean, default: false},
    blockedBy: {type: mongoose.Schema.Types.ObjectId, ref: "Users", default:null},

},{timestamps:true})

export default mongoose.model("Conversations", conversationSchema )

