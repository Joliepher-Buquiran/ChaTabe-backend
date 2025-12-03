import bcrypt from 'bcrypt'

import User from '../model/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export const registerUser = async (req, res) => {

    try {

      const { username, password, email ,age,gender } = req.body;

      
      if (!username || !password || !email || !age || !gender) {
        return res.status(400).json({ success: false ,message: 'All fields are required' });
      }

      
    
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false ,message: ' Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password,10);

      let profilePic;
    if (req.file) {
      // IMAGE PROVIDED → STORE AS BUFFER
      profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else {
      // NO IMAGE → USE DEFAULT URL AS STRING IN SEPARATE FIELD
      profilePic = undefined;
    }


      const newUser = new User({ username, email, password:hashedPassword ,age, gender,profilePic });
      await newUser.save();

      res.status(201).json({ success: true, message: 'User registered successfully' });
    
    } catch (error) {

      console.error(error);
      res.status(500).json({success:false, message: 'Server error' });

    }

};


export const getUser = async (req, res) => {
 const user = await User.findById(req.user.id).lean();

let profilePic;

if (user.profilePic?.data) {
  // Convert buffer to Base64 string
  profilePic = `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString("base64")}`;
} else if (typeof user.profilePic === "string") {
  // Already a URL string
  profilePic = user.profilePic;
} else {
  // Fallback to default
  profilePic = user.profilePicURL;
}

user.profilePic = profilePic;

res.json({ success: true, user });
}




export const loginUser = async(req,res) => {

  try {

    

    const {username,password} = req.body;

    if(!username || !password){
      return res.status(400).json({success:false,message: 'Please enter your username and password'})
    }

    const user = await User.findOne({username})
    

    if(!user) {
      return res.status(401).json({success:false,message: 'Invalid crendentials'})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(401).json({success:false,message:"Invalid credentials"})
    }


    await User.findByIdAndUpdate(user._id, { 
      isActive: true,
    });

    //Generate Tokens

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    //Store token in cookie

    res.cookie('token', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 1000,
      path: "/",
      
    });

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/", 
  }); 


    
    //Save refresh token in databse

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({success:true, message:'Login successful', user:{ id: user._id, username: user.username,isAdmin:user.isAdmin } })


  } catch (error) {
    console.error(error);
    res.status(500).json({success:true, message: 'Server error' });
  }

}


export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token",expired: true });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Send new access token as cookie
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000, 
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });

  } catch (err) {
    console.log(err);
    return res.status(403).json({ success: false, message: "Expired refresh token",expired: true });
  }
};


export const logoutUser = async(req, res) => {

 try {
    const userId = req.user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null, isActive: false });
    }
  } catch (err) {
    console.error("Logout error:", err);
  }

  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax', path: '/' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Lax', path: '/' });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
