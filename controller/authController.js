const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../utils/cloudinary");

const UserModel = require("../models/authModel");

const passwordPattern =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

module.exports.userRegister = async (req, res) => {
  const { username, password, confirmPassword, image } = req.body;
  const error = [];

  if (!username) {
    error.push("Please provide your username");
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
  // if (password && !passwordPattern.test(password)) {
  //   error.push(
  //     "Your password should at least contain a number, a character, and a special character"
  //   );
  // }


  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {

      const checkUser = await UserModel.findOne({
        username: username,
      });


      if (checkUser) {
        res.status(404).json({
          error: {
            errorMessage: ["There is an account associated with this username"],
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
          password: await bcrypt.hash(password, 10),
          image: resImage.secure_url,
        });

        console.log(user)

        const token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            image: user.image,
            registerTime: user.createdAt,
          },
          process.env.SECRET,
          {
            expiresIn: process.env.TOKEN_EXP,
          }
        );

        console.log(token)

        const options = {
          expires: new Date(
            Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        };

        res.status(200).cookie("authToken", token, options).json({
          successMessage: "Your registration was successful!",
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
  const { username, password } = req.body;

  if (!username) {
    error.push("Please provide your username");
  }
  if (!password) {
    error.push("Please provide your password");
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
        username: username,
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
            httpOnly: true,
            secure: true,
            sameSite: "none",
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
            errorMessage: ["Username not found"],
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
  const options = {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  res.status(200).cookie("authToken", "", options).json({
    successMessage: "Logout successful.",
  });
};
