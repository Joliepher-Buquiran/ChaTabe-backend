import User from '../../model/userModel.js';

// ✅ Inserted helper function (non-destructive)
const formatProfilePic = (user) => {
  if (user.profilePic?.data) {
    return `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString("base64")}`;
  } else if (typeof user.profilePic === "string") {
    return user.profilePic;
  } else {
    return user.profilePicURL;
  }
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status || 'all';  

    const query = {isAdmin: false}; 

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'online') query.isActive = true;
    if (status === 'offline') query.isActive = false;
    if (status === 'banned') query.isBanned = true;

    const usersRaw = await User.find(query)
      .select('username email isActive isBanned createdAt profilePic profilePicURL moodStatus')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

   
    const users = usersRaw.map(user => ({
      ...user,
      profilePic: formatProfilePic(user)
    }));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};