// import mongoose from "mongoose";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,


    },
    avatar: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
    },

}, { timestamps: true },);


module.exports = mongoose.model("User", userSchema);

// <-------------------------------Atlernative------------------------>
// const User=mongoose.model("User",userSchema);
// export default User;