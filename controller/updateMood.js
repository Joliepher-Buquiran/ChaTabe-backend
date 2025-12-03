import User from '../model/userModel.js';

export const updateMood = async (req, res) => {
  try {
    const { moodStatus } = req.body;

  
    const validMoods = ['Happy', 'Sad', 'Angry', 'Annoyed', 'Afraid'];

    if (!moodStatus || !validMoods.includes(moodStatus)) {
      return res.status(400).json({ message: 'Invalid mood' });
    }

    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { moodStatus },
      { new: true }
    ).select('-password');

    return res.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}