const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    tokens: [{ type: String }],
});

const User = mongoose.model("users", UserScheme);

module.exports = User;
