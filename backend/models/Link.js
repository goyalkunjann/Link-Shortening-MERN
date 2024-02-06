const mongoose = require("mongoose");

const LinkScheme = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    shortenedUrl: {
        type: String,
        required: true,
        unique: true,
    },
    views: [
        {
            date: {
                type: Date,
            },
            userAgent: String,
            operatingSystem: String,
        },
    ],
    createdBy: {
        type: String,
        required: false,
    },
},{
    timestamps: true
});

const Link = mongoose.model("links", LinkScheme);

module.exports = Link;
