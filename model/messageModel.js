import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {type: mongoose.Schema.Types.ObjectId, ref: "Conversations"},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    senderUsername: { type: String, required: true },
    receiverUsername: { type: String, required: true },
    text: {type: String},
    isDeleted: { type: Boolean, default: false,},
    createdAt: {type: Date, default: Date.now}
})


export default mongoose.model("Messages", messageSchema);