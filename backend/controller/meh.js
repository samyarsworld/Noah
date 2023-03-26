const validator = require("validator");
const fs = require("fs");
const https = require("https");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");

const { Configuration, OpenAIApi } = require("openai");

const UserModel = require("../models/authModel");

const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

const passwordPattern =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

module.exports.userRegister = async (req, res) => {
  const form = formidable();
  console.log(req.body);
  console.log(form);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error uploading file." });
    }
    const { username, email, password, confirmPassword, genImage } = fields;
    console.log("genImage");

    if (!genImage) {
      const { image } = files;
      uploadCloudinary(image);
    }

    // const error = [];

    // if (!username) {
    //   error.push("Please provide your username");
    // }
    // if (!email) {
    //   error.push("Please provide your email");
    // }
    // if (email && !validator.isEmail(email)) {
    //   error.push("Please provide a valid email address");
    // }
    // if (!password) {
    //   error.push("Please provide your password");
    // }
    // if (!confirmPassword) {
    //   error.push("Please provide confirm your Password");
    // }
    // if (password && confirmPassword && password !== confirmPassword) {
    //   error.push("Your password and confirm password do not match");
    // }
    // if (password && password.length < 8) {
    //   error.push("Please provide a password of at least 8 characters");
    // }
    // if (!image) {
    //   error.push("Please provide your profile image");
    // }
    // if (password && !passwordPattern.test(password)) {
    //   error.push(
    //     "Your password should at least contain a number, a character, and a special character"
    //   );
    // }

    // if (error.length > 0) {
    //   res.status(400).json({
    //     error: {
    //       errorMessage: error,
    //     },
    //   });
    // } else {
    //   try {
    //     const checkUser = await UserModel.findOne({
    //       email: email,
    //     });
    //     if (checkUser) {
    //       res.status(404).json({
    //         error: {
    //           errorMessage: ["There is an account associated with this email"],
    //         },
    //       });
    //     } else {
    //       const user = await UserModel.create({
    //         username,
    //         email,
    //         password: await bcrypt.hash(password, 10),
    //         image: image,
    //       });

    //       const token = jwt.sign(
    //         {
    //           id: user._id,
    //           email: user.email,
    //           username: user.username,
    //           image: user.image,
    //           registerTime: user.createdAt,
    //         },
    //         process.env.SECRET,
    //         {
    //           expiresIn: process.env.TOKEN_EXP,
    //         }
    //       );

    //       const options = {
    //         expires: new Date(
    //           Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    //         ),
    //       };

    //       res.status(201).cookie("authToken", token, options).json({
    //         successMessage: "Your registeration was successful",
    //         token,
    //       });
    //     }
    //   } catch (error) {
    //     res.status(500).json({
    //       error: {
    //         errorMessage: ["Internal Server Error"],
    //       },
    //     });
    //   }
    // } // End error else
  }); // End form
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
    };

    const response = await openai.createImage(imageParameters);
    const genImageUrl = response.data.data[0].url;
    res.status(201).json({ genImageUrl: genImageUrl });
  } catch (error) {
    console.log(error.response.data.error.message);
    res.status(400).json({
      error: {
        errorMessage: ["DALL-E Error."],
      },
    });
  }
};

const uploadCloudinary = async (image) => {
  console.log(image);
  // try {
  //   const result = cloudinary.uploader.upload(image);
  //   console.log(result.secure_url);
  //   console.log(result.url);

  //   res.status(201).json({
  //     imgUrl: result.secure_url,
  //   });
  // } catch (error) {
  //   console.log(error.response.data.error.message);
  //   res.status(400).json({
  //     error: {
  //       errorMessage: ["Cloudinary Error."],
  //     },
  //   });
  // }
};
