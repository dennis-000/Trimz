import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]; // Or from `req.headers.authorization`
    // console.log(req.headers, 'token')
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access Denied' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      } else {
        req.user = decodedToken; // Attach user ID to the request
        // console.log(req.user);
        next();
      }
    });
};

// Middleware to check permissions
export const checkUserPermissions = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // Allow access if user is admin
    } else {
      res.status(403).json({ message: 'Forbidden' }); // Block access otherwise
    }
};
export const restrict = (roles) => {
  return (req, res, next) => {
      // Restriction logic here
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Access denied' });
      }
      next();
  };
};