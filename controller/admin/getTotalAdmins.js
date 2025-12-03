import express from 'express';
import Users from '../../model/userModel.js';

export const getTotalAdmins = async (req, res) => {

  try { 
    const totalAdmins = await Users.countDocuments({ isAdmin: true });

    res.status(200).json({ success: true, message: "Successfully retrieved total admins" ,totalAdmins });

    } catch (error) {
    console.error("Internal Error", error);
    res.status(500).json({ success: false, message: "Internal Error" });
    }
}
