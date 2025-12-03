
import jwt from 'jsonwebtoken'



export const verifyToken = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied',expired: false });
  }

  try {
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();

  } catch (error) {

     if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false,message: 'Token expired', expired: true });
    }


    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req, res, next) => {
  
  if (!req.user.isAdmin) {

    return res.status(403).json({ message: "Access denied" });
  
  }
  next();
};