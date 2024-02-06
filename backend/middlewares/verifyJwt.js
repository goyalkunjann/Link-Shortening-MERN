const jwt = require("jsonwebtoken");
const refreshToken = require("../refreshTokenController");

const verifyJwt = (req, res, next) => {
    // authorization header check
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Not Authorized" });
    // token separation with bearer
    const token = authHeader.split(" ")[1];
    // verify token
    try {
        return jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            async (err, decoded) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        const newAccessToken = await refreshToken(req,res,next,true);

                        return jwt.verify(newAccessToken,process.env.ACCESS_TOKEN_SECRET_KEY,(err,user) => {
                            if (err) return;
                            req.user = user?.username;
                            next();
                        })
                    }else{
                        return res.status(403).json({ message: "Invalid Token" });
                    }
                }else{
                    req.user = decoded.username;
                    next();
                }
            }
        );
    } catch (err) {
        if (err) return res.status(403).json({ message: "Invalid Token" });
    }
};

const optionalVerifyJwt = (req, res, next) => {
    // authorization header check
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next();
    // token separation with bearer
    const token = authHeader.split(" ")[1];
    // verify token
    try {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            async(err, decoded) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        const newAccessToken = await refreshToken(req,res,next,true);
                        jwt.verify(newAccessToken,process.env.ACCESS_TOKEN_SECRET_KEY,(err,user) => {
                            if (err) return next();
                            req.user = user?.username;
                            next();
                        })
                    }else{
                        next()
                    }
                }else {
                    req.user = decoded.username;
                    next();
                }
            }
        );
    } catch {
        if (err)
            return res
                .status(500)
                .json({ message: "Sorry Some Error Occurred" });
    }
};

module.exports = { verifyJwt, optionalVerifyJwt };
