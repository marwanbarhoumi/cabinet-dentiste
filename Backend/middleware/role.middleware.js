const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Accès réservé à l\'admin' });
};

const clientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    return next();
  }
  res.status(403).json({ message: 'Accès réservé au client' });
};

module.exports = { adminOnly, clientOnly };