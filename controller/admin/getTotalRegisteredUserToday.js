import express from 'express'
import Users from '../../model/userModel.js';

export const getRegisteredUserToday = async (req, res) => {

  try {

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const usersToday = await Users.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
      isAdmin: { $ne: true }     
    });

    res.status(200).json({success: true,message: 'Successfully retrieve total registered users for today' ,usersToday});
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
};