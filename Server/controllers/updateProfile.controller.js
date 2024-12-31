const bcryptjs = require('bcrypt');
const UserModel = require("../models/User.model");

const Listing = require("../models/Listing.model");


exports.updateUserdetials = async (req, res) => {
    if (req.user.id != req.params.id) {
        return res(401).json({
            success: false,
            message: `Unauthorized access`
        })
    }
    try {
        console.log("Welcome")
        if (req.body.password)
            req.body.password = bcryptjs.hashSync(req.body.password, 10);



        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            updatedUser,
        })
    } catch (e) {
        console.log("fat")
        return res.status(403).json({
            success: false,
            message: e.message,
        })
    }
}


exports.deleteUser = async (req, res) => {
    console.log("deleteUser", req.user.id)
    if (req.user.id !== req.params.id) {
        return res(401).json({
            success: false,
            message: `Unauthorized access`
        })
    }
    try {

        await UserModel.findByIdAndDelete(req.user.id);
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: `User deleted successfully`
        })
    }
    catch (e) {
        return res.status(403).json({
            success: false,
            message: e.message
        });
    }
}


exports.getUserListings = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(401).json({
            success: false,
            message: `you can only view your own listings`
        })
    }
    try {
        const listings = await Listing.find({ userRef: req.user.id });
        res.status(200).json({
            success: true,
            listings,
            message: `you get your listings successfully`
        })
    }
    catch (e) {
        res.status(401).json({
            success: false,
            message: e.message
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        // console.log(`sdfa`, user, req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found`
            })
        }
        user.password = undefined;
        user.avatar = undefined;
        return res.status(200).json({
            success: true,
            user,
            message: `user found`
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}