const express = require("express");
const mongoose = require('mongoose')
const router = express.Router();
const Link = require("../models/Link.js");
const User = require("../models/User.js");
const { verifyJwt, optionalVerifyJwt } = require("../middlewares/verifyJwt.js");

// get all users links
router.get("/user/", verifyJwt, async(req, res) => {
    const username = req.user;
    try {
        const doesExists = await User.findOne({ username });
        if (!doesExists) {
            return res.status(404).json({ message: "User Does Not Exists" });
        }
        const userLinks = await Link.find({ createdBy: doesExists.id });
        return res.status(200).json(userLinks)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Sorry Some Error Occurred' });
    }
});

// get link details
router.get("/:id", verifyJwt, async(req, res) => {
    const username = req.user;
    const id = req.params.id;
    try {
        const link = await Link.findById(id);
        if (!link) return res.status(404).json({message: "Link Not Found"})
        const doesExists = await User.findOne({_id:link.createdBy,username});
        if (!doesExists) {
            return res.status(403).json({ message: "Not Authenticated To View This Page" });
        }
        return res.status(200).json(link)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Sorry Some Error Occurred' });
    }
});

// create a link
router.post("/",optionalVerifyJwt, async (req, res) => {
    let { url, name } = req.body;

    let link = "";
    const newLinkData = { url: url }
    try {
        if (req.user) {
            const user = await User.findOne({username: req.user})
            if (user) newLinkData['createdBy'] = user._id;
        }
        if (!name) {
            const newChars =
                "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
            const length = 6;
            let newLink = "";
            for (let i = 0; i < length; i++) {
                newLink += newChars.charAt(Math.random() * newChars.length);
            }
            let doesLinkExists = await Link.findOne({ url: newLink });

            while (doesLinkExists) {
                newLink = "";
                for (let i = 0; i < length; i++) {
                    newLink += newChars[Math.random() * newChars.length];
                }
                doesLinkExists = await Link.findOne({ url: newLink });
            }

            link = newLink;
        } else {
            let doesLinkExists = await Link.findOne({ shortenedUrl: name });
            if (doesLinkExists)
                return res
                    .status(404)
                    .json({ message: "Link Already Exists 😢" });

            link = name;
        }
        newLinkData['shortenedUrl'] = link;
        const newLink = new Link(newLinkData);
        const savedLink = await newLink.save();

        return res.status(200).json(savedLink);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Sorry Some Error Occurred" });
    }
});

// delete a post
router.delete("/:id",verifyJwt, async (req, res) => {
    const id = req.params.id;
    try {
        const link = await Link.findById(id)
        const linkUser = await User.findOne({username: req.user});
        if (!link || !linkUser) return res.status(404).send({ message: 'Could Not Delete' });
        if (link.createdBy == linkUser?.id) {
            await link.deleteOne();
            return res.status(200).send({ message: 'Successfully Deleted'})
        }else {
            res.status(401).send({ message: 'Not Authorized to delete this link' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Sorry Cant Delete The Link' });
    }
});

module.exports = router;
