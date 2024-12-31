const User = require('../models/User.model');
const reponeSend = require('../utils/error');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
exports.singup = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            console.log("Invalid", username, email, password, confirmPassword)
            return res.status(403).json({
                success: false,
                message: "Enter all the required fields"
            });

        }
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "confirmpassword is not match with your password"
            });
        }
        const CheckUserPresent = await User.findOne({ email });
        console.log("mai jata hu")
        if (CheckUserPresent) {
            console.log("CheckUserPresent");

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const Hashedpassword = await bcrypt.hash(password, 10);
        console.log("createed user");
        const user = await User.create({
            username,
            email,
            password: Hashedpassword,
        });
        console.log(user);
        // errorshandler(201, "User created successfully");
        return res.status(201).json({
            success: true,
            message: "Account created successfullyy",
        })

    }
    catch (err) {
        next(err);
        console.log(`Error while singUp${err}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}


exports.login = async (req, res) => {
    try {
        //  fetch data from req
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist Please first SingUp',
            });
        }
        // check password and create jwt token

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3h',
                //  "2h",
            });
            user.password = undefined;
            // Genrate cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: `Wrong credentials`,
            });
        }
    }
    catch (error) {
        console.log(`error while logging in: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Loggined failed Try again later`,
        })
    }

}


exports.google = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            const payload = {
                email: user.email,
                id: user._id,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3h',
                //  "2h",
            });
            user.password = undefined;
            // Genrate cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            })
            console.log("google auth error", user)
        }
        else {
            const genratedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const Hashedpassword = bcrypt.hashSync(genratedPassword, 10);
            const user = await User.create({
                username: req.body.username.split(" ").join("") + Math.random().toString(36).slice(-3),
                email: req.body.email,
                password: Hashedpassword,
                avatar: req.body.avatar,
            });
            const payload = {
                email: user.email,
                id: user._id,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3h',
                //  "2h",
            });
            user.password = undefined;
            // Genrate cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            })

        }
        console.log("check error");
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Loggined failed while try to google login. Please try again`
        });

    }
}



exports.singOUt = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: `singOut was successful`
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })


    }
}