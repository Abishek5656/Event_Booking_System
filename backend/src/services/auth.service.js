const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const AppError = require('../core/errors/AppError');

// JWT Secret Key (should be in env, fallback for dev)
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development-only';

class AuthService {
  async register(data) {
    const { name, email, password, role } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email is already in use', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Map string role to Int: 1 -> CUSTOMER, 2 -> ORGANIZER
    let roleInt = 1;
    if (role === 'ORGANIZER') {
      roleInt = 2;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: roleInt,
      },
    });

    // Remove passwordHash before returning
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Map Int role back to string for JWT clarity
    const roleString = user.role === 2 ? 'ORGANIZER' : 'CUSTOMER';

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: roleString }, JWT_SECRET, {
      expiresIn: '1d',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}

module.exports = new AuthService();
