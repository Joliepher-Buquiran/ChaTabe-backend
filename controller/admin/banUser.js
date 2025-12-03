import express from 'express'
import User from '../../model/userModel.js'

// ✅ Inserted helper function
const formatProfilePic = (user) => {
  if (user?.profilePic?.data) {
    return `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString("base64")}`;
  } else if (typeof user?.profilePic === "string") {
    return user.profilePic;
  } else {
    return user?.profilePicURL;
  }
};

export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBanned = true;
    user.bannedAt = new Date();
    await user.save();

    res.json({ success: true, message: "User banned" });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false });

    user.isBanned = false;
    user.bannedAt = null;
    await user.save();

    res.json({ success: true, message: "User unbanned" });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getBannedUsers = async (req, res) => {
  try {
    const usersRaw = await User.find({ isBanned: true })
      .select('username email profilePic profilePicURL bannedAt moodStatus')
      .sort({ bannedAt: -1 })
      .lean();

    // ✅ Inserted transformation step
    const users = usersRaw.map(user => ({
      ...user,
      profilePic: formatProfilePic(user)
    }));

    res.json({ users });
  } catch (error) {
    console.error("getBannedUsers error:", error);
    res.status(500).json({ success: false });
  }
};