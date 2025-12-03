import express from 'express';
import Users from '../../model/userModel.js';

export const getTotalUsers = async (req, res) => {

  try {

    const totalUsers = await Users.countDocuments({isAdmin: false});

    res.status(200).json({ success: true, message: "Successfully retrieved total users" ,totalUsers });    

  } catch (error) {

    console.error("Internal Error", error);
    res.status(500).json({ success: false, message: "Internal Error" });

  }}    