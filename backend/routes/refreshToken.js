const express = require("express");
const router = express.Router();
const refreshToken = require("../refreshTokenController");


router.post("/refresh", refreshToken);

module.exports = router;
