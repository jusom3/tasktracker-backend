const jwt = require('jsonwebtoken');

// ✅ Middleware to check if user is logged in
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ✅ Middleware to restrict by role (e.g. team_leader only)
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorizeRole };
