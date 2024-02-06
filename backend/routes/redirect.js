const express = require("express");
const { verifyJwt } = require("../middlewares/verifyJwt.js");
const router = express.Router();
const Link = require("../models/Link.js");

// get all of the links
router.get("/", (req, res) => {
    Link.find((err, links) => {
        if (err) return res.status(500).send(err);
        res.json(links);
    });
});

// get one link
router.get("/:url", async (req, res) => {
    const link = await Link.findOne({ shortenedUrl: req.params.url });
    if (!link) return res.render("404.ejs");
    const userAgent = getUserAgent(req.get("User-Agent"));
    const os = getOS(req.get("User-Agent"));
    link.views.push({
        date: new Date(Date.now()),
        operatingSystem: os,
        userAgent: userAgent,
    });
    console.log("Users IP is " + req.ip)
    link.save();
    res.render("index.ejs", { url: link.url });
});

const getUserAgent = (agent = "Chrome") => {
//  const agents = ["Chrome","Opera","Safari","Firefox"]
//  const random = Math.floor(Math.random() * (agents.length));
//  console.log(random)
//  console.log(agents[random])
//  return agents[random];
    if (agent.includes("Firefox")) {
        return "Firefox";
    } else if (agent.includes("Chrome")) {
        return "Chrome";
    } else if (agent.includes("Opera")) {
        return "Opera";
    } else if (agent.includes("Safari")) {
        return "Safari";
    } else {
        return "other";
    }
};

const getOS = (agent = "Windows") => {
//  const agents = ["Windows","Linux","Mac OS","others"]
//  const random = Math.floor(Math.random() * (agents.length));
//  console.log(random)
//  console.log(agents[random])
//  return agents[random];
    if (agent.includes("Window")) {
        return "Windows";
    } else if (agent.includes("Linux")) {
        return "Linux";
    } else if (agent.includes("Mac")) {
        return "Mac OS";
    } else {
        return "others";
    }
};

module.exports = router;
