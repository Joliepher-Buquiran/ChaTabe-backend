import express from 'express'
import Message from '../../model/messageModel.js';

export const getMessagesToday = async (req, res) => {

  try {

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const messagesToday = await Message.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
      isDeleted: { $ne: true }
    });

    res.status(200).json({success: true,message: 'Successfully retrieve total messages sent today' ,messagesToday});
  } catch (error) {
    console.error("Error fetching messages today:", error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
};