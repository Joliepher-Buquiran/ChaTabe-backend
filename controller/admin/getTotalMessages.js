import express from 'express';
import Messages from '../../model/messageModel.js';

export const getTotalMessages = async (req, res) => {

  try {     

    const totalMessages = await Messages.countDocuments();
    res.status(200).json({ success: true, message: "Successfully retrieved total messages" ,totalMessages });

    } catch (error) {   

    console.error("Internal Error", error);
    res.status(500).json({ success: false, message: "Internal Error" });
    
  } 
}