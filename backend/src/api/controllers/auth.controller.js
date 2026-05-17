const authService = require('../../services/auth.service');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

class AuthController {
  register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: { user },
    });
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({
      status: 'success',
      data: { user, token },
    });
  });
}

module.exports = new AuthController();
