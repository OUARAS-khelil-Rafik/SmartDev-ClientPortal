const jwt = require('jsonwebtoken');

const generateToken = (userId, expiresIn = '7d') => {
  const secret = process.env.JWT_SECRET || '22e44e79a71fc1ee6086c3860c60004d';
  return jwt.sign({ userId }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || '22e44e79a71fc1ee6086c3860c60004d';
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
