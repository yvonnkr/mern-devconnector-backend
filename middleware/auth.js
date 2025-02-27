const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //get token from header
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization denied.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    //adds user property to request
    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
