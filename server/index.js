const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key.js");
const { User } = require("./models/User.js");
const { auth } = require("./middleware/auth.js");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello world~~");
});

app.get("/api/hello", async (req, res) => {
  await res.send("안녕하세요.");
});

app.post("/api/users/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const userInfo = await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "해당하는 이메일을 찾을 수 없습니다.",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    await user.generateToken();

    // 토큰 쿠키에 저장하기
    res
      .cookie("x_auth", user.token)
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    return res.status(500).json({ loginSuccess: false, error: err.message });
  }
});

// role 0 일반유저 role 0아니면 관리자
app.post("/api/users/auth", auth, async (req, res) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.get("/api/users/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

const port = 5000;

app.listen(port, () => console.log(`listening on ${port} port!`));
