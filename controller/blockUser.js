import express from 'express';
import Conversation from '../model/conversationModel.js';


export const blockContact = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user.id;

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ message: "Conversation not found" });
   
    


    const blockedByMe = convo.blockedBy && convo.blockedBy.toString() === userId;

    if (convo.isBlocked && blockedByMe) {
      
      convo.isBlocked = false;
      convo.blockedBy = null;
    } else {
     
      convo.isBlocked = true;
      convo.blockedBy = userId;
    }

    await convo.save();

    res.status(200).json({ 
        success: true, 
        isBlocked: convo.isBlocked,
        blockedBy: convo.blockedBy,
        conversationId: convo._id
     
       
    });

  } catch (error) {
    console.error("Block error:", error);
    res.status(500).json({ message: "Server error" });
  }
};