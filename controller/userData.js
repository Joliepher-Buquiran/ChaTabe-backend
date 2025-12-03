import Users from "../model/userModel.js";

export const getUserData = async (req,res) => {
  try {
    const userId = req.user.id;

    const user = await Users.findById(userId)
      .select("-password")
      .populate("contacts", "username age gender profilePic profilePicURL moodStatus isActive")
      .lean();

    if(!user) return res.status(404).json({success:false,message:"User not found"});

    
    user.profilePic = user.profilePic?.data
      ? `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString("base64")}`
      : user.profilePicURL;

  
    user.contacts = user.contacts.map(contact => ({
      ...contact,
      profilePic: contact.profilePic?.data
        ? `data:${contact.profilePic.contentType};base64,${contact.profilePic.data.toString("base64")}`
        : contact.profilePicURL
    }));

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};