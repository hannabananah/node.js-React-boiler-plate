const { User } = require("../models/User");

const auth = async (req, res, next) => {
  // 클라이언트 쿠키에서 토큰을 서버로 가져오기
  let token = req.cookies.x_auth;

  try {
    const user = await User.findByToken(token);
    if (!user) {
      return res.json({ isAuth: false, error: true });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ isAuth: false, error: true, message: err.message });
  }
};

module.exports = { auth };
