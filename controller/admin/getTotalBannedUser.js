import express from 'express';
import User from '../../model/userModel.js';

export const getTotalBannedUsers = async (req, res) => {

  try {     

    const bannedUsers = await User.countDocuments({isBanned: true});
    res.status(200).json({ success: true, message: "Successfully retrieved total banned users" ,bannedUsers});

    } catch (error) {   

    console.error("Internal Error", error);
    res.status(500).json({ success: false, message: "Internal Error" });
    
  } 
}