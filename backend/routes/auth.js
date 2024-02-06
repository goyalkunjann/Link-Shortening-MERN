const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const accessTokenExpiatory = process.env.ACCESS_TOKEN_EXPIATORY || "10s";
const refreshTokenExpiatory = process.env.REFRESH_TOKEN_EXPIATORY || "7d";

router.post("/register", async (req, res) => {
    try {
        // Seeing that the user is already registered
        const doesExists = await User.findOne({ email: req.body.email });
        if (doesExists) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // creating the user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            tokens: [],
        });
        // saving the user
        const userData = await user.save();

        return res.status(200).send(userData);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Sorry Some Error Occurred" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ message: "Email and Password Not Found" });
        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser)
            return res.status(404).json({ message: "User Not Found" });

        const match = await bcrypt.compare(
            req.body.password,
            foundUser.password
        );
        if (match) {
            const accessToken = jwt.sign(
                { username: foundUser.username },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: 30 }
            );
            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: refreshTokenExpiatory }
            );

            const newUser = await User.findByIdAndUpdate(foundUser._id, {
                $push: {
                    tokens: refreshToken,
                },
            });

            await newUser.save();

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 * 14,
                secure: true,
                sameSite: "None",
            });
            const username = foundUser.username;
            res.status(200).json({ accessToken, username});
        } else {
            res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Sorry Some Error Occurred" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.refresh_token)
            return res.status(204).json({ message: "Not Logged In" });
        const refreshToken = cookies.refresh_token;

        const foundUser = await User.findOne({ tokens: refreshToken });
        if (!foundUser) {
            res.clearCookie("refresh_token", {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            });
            return res.status(404).json({ message: "User Not Found" });
        }

        const newUser = await User.findByIdAndUpdate(foundUser._id, {
            $pull: {
                tokens: refreshToken,
            },
        });
        secure: true,
            res.clearCookie("refresh_token", {
                httpsOnly: true,
                secure: true,
                sameSite: "None",
            });
        res.status(200).json({ message: "Successfully Logged Out" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Sorry Some Error Occurred" });
    }
});

module.exports = router;
