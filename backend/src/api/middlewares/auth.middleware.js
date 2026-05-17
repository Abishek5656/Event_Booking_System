const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/database');
const AppError = require('../../core/errors/AppError');
const { ERROR_MESSAGES } = require('../../shared/constants');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development-only';

const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!currentUser) {
      return next(new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 401));
    }

    // Map Int back to string role for easy checking
    req.user = currentUser;
    req.user.roleString = currentUser.role === 2 ? 'ORGANIZER' : 'CUSTOMER';
    next();
  } catch (error) {
    next(new AppError(ERROR_MESSAGES.TOKEN_INVALID, 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleString)) {
      return next(new AppError(ERROR_MESSAGES.FORBIDDEN, 403));
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
