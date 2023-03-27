const validator = require("validator");
const https = require("https");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../utils/cloudinary");

const { Configuration, OpenAIApi } = require("openai");

const UserModel = require("../models/authModel");

const passwordPattern =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

module.exports.userRegister = async (req, res) => {
  const { username, email, password, confirmPassword, image } = req.body;

  const error = [];

  if (!username) {
    error.push("Please provide your username");
  }
  if (!email) {
    error.push("Please provide your email");
  }
  if (email && !validator.isEmail(email)) {
    error.push("Please provide a valid email address");
  }
  if (!password) {
    error.push("Please provide your password");
  }
  if (!confirmPassword) {
    error.push("Please provide confirm your Password");
  }
  if (password && confirmPassword && password !== confirmPassword) {
    error.push("Your password and confirm password do not match");
  }
  if (password && password.length < 8) {
    error.push("Please provide a password of at least 8 characters");
  }
  if (!image) {
    error.push("Please provide your profile image");
  }
  if (password && !passwordPattern.test(password)) {
    error.push(
      "Your password should at least contain a number, a character, and a special character"
    );
  }

  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {
      const checkUser = await UserModel.findOne({
        email: email,
      });

      if (checkUser) {
        res.status(404).json({
          error: {
            errorMessage: ["There is an account associated with this email"],
          },
        });
      } else {
        const resImage = await cloudinary.uploader.upload(image, {
          folder: "profile_img",
          width: 256,
          height: 256,
        });

        const user = await UserModel.create({
          username,
          email,
          password: await bcrypt.hash(password, 10),
          image: resImage.url,
        });

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            username: user.username,
            image: user.image,
            registerTime: user.createdAt,
          },
          process.env.SECRET,
          {
            expiresIn: process.env.TOKEN_EXP,
          }
        );

        const options = {
          expires: new Date(
            Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
          ),
        };

        res.status(201).cookie("authToken", token, options).json({
          successMessage: "Your registeration was successful",
          token,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: ["Internal Server Error"],
        },
      });
    }
  }
};

module.exports.userLogin = async (req, res) => {
  const error = [];
  const { email, password } = req.body;

  if (!email) {
    error.push("Please provide your email");
  }
  if (!password) {
    error.push("Please provide your passowrd");
  }
  if (email && !validator.isEmail(email)) {
    error.push("Please provide a valid email");
  }

  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {
      const checkUser = await UserModel.findOne({
        email: email,
      }).select("+password");

      if (checkUser) {
        const matchPassword = await bcrypt.compare(
          password,
          checkUser.password
        );

        if (matchPassword) {
          const token = jwt.sign(
            {
              id: checkUser._id,
              email: checkUser.email,
              username: checkUser.username,
              image: checkUser.image,
              registerTime: checkUser.createdAt,
            },
            process.env.SECRET,
            {
              expiresIn: process.env.TOKEN_EXP,
            }
          );
          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
            ),
          };

          res.status(200).cookie("authToken", token, options).json({
            successMessage: "Login successful",
            token,
          });
        } else {
          res.status(400).json({
            error: {
              errorMessage: ["Password not valid"],
            },
          });
        }
      } else {
        res.status(400).json({
          error: {
            errorMessage: ["Email not found"],
          },
        });
      }
    } catch {
      res.status(404).json({
        error: {
          errorMessage: ["Internal Server Error"],
        },
      });
    }
  }
};

module.exports.userLogout = (req, res) => {
  res.status(200).cookie("authToken", "").json({
    successMessage: "Logout successful.",
  });
};

module.exports.genImage = async (req, res) => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_API_KEY_DALLE,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const { genImagePrompt } = req.body;
    const imageParameters = {
      prompt: genImagePrompt,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    };

    const response = await openai.createImage(imageParameters);
    const genImg = response.data.data[0].b64_json;

    res.status(201).json({ genImg: `data:image/jpeg;base64,${genImg}` });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: {
        errorMessage: ["DALL-E Error."],
      },
    });
  }
};
