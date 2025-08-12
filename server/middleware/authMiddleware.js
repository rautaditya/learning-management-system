// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Middleware to protect any route (checks token only)
// const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);  // 👈 get full user

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user; // ✅ attach full user
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// // Middleware for role-based protection (e.g., only superadmin)
// const verifyToken = (roles = []) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id);

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       if (roles.length && !roles.includes(user.role)) {
//         return res.status(403).json({ message: 'Access denied: Insufficient role' });
//       }

//       req.user = user;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   };
// };
// const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info (e.g., role)
//     next();
//   } catch (err) {
//     res.status(403).json({ message: 'Invalid token' });
//   }
// };

// const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied: Insufficient role' });
//     }
//     next();
//   };
// };

// module.exports = {
//   protect,
//   verifyToken,
//   authenticate, 
//   authorizeRoles
// };
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect any route (checks token only)
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);  // 👈 get full user

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach full user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware for role-based protection (e.g., only superadmin)
const verifyToken = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient role' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (e.g., role)
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    next();
  };
};

module.exports = {
  protect,
  verifyToken,
  authenticate, 
  authorizeRoles
};
