
import jwt from 'jsonwebtoken'

//Generate access token, with user params to get the users info

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } 
  );
};

// Generate refresh token

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } 
  );
};

