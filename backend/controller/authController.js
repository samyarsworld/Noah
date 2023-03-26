const formiable = require("formidable");
const validator = require("validator");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const console = require("console");

const UserModel = require("../models/authModel");

module.exports.userRegister = async (req, res) => {
  const form = formiable();

  form.parse(req, async (err, fields, files) => {
    const { username, email, password, confirmPassword } = fields;
    const { image } = files;
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
    if (Object.keys(files).length === 0) {
      error.push("Please provide your profile image");
    }

    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      const getImageName = files.image.originalFilename;
      const randNumber = Math.floor(Math.random() * 99999);
      const newImageName = randNumber + getImageName;
      files.image.originalFilename = newImageName;
      const newPath =
        __dirname +
        `/../../frontend/public/images/${files.image.originalFilename}`;

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
          fs.copyFile(files.image.filepath, newPath, async (err) => {
            if (!err) {
              const user = await UserModel.create({
                username,
                email,
                password: await bcrypt.hash(password, 10),
                image: files.image.originalFilename,
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
            } else {
              res.status(500).json({
                error: {
                  errorMessage: ["Internal Server Error"],
                },
              });
            }
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
  });
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
  console.log("meh3");
  res.status(200).cookie("authToken", "").json({
    successMessage: "Logout successful.",
  });
};
