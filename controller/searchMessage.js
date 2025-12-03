import express from 'express';
import Message from '../model/messageModel.js';
import Conversation from '../model/conversationModel.js';

export const searchMessage = async (req,res) => {
    
    try { 

        
        const {message,conversationId} = req.body;
        const userId = req.user.id;

        if(!message || message.trim() === ''){
            return res.status(400).json({message: "Message query is required"});
        }
        
        const convo = await Conversation.findOne({
            _id:conversationId,
            members: userId,
            
        });

        if(!convo){
            return res.status(404).json({message: "Conversation not found"});
        }

        const messages = await Message.find({
            conversationId,
            text: { $regex: message, $options: 'i' },
            isDeleted: false
        })
        .sort({ createdAt: -1 })
        .select('text createdAt senderId')
        .populate('sender', 'username profilePic profilePicURL moodStatus');


        res.status(200).json({success:true, message: "Messages fetched successfully", results: messages});

    }catch (error) { 
        console.log("Error in searching message: ", error);
        return res.status(500).json({message: "Internal Server Error"});
    }

}