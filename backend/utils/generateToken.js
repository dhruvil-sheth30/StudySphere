import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    const isProduction = process.env.NODE_ENV === "production";
    console.log("Token generation - Environment:", process.env.NODE_ENV);
    
    // Cookie settings
    const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        path: "/",
        // For local development, don't use SameSite: 'none'
        sameSite: isProduction ? "none" : "lax",
        // For local development, don't require secure
        secure: isProduction
    };

    console.log("Setting cookie with options:", cookieOptions);
    res.cookie("jwt", token, cookieOptions);
    
    // For debugging - add the token to the response header as well
    if (!isProduction) {
        res.setHeader('X-Auth-Token', token);
    }
};

export default generateTokenAndSetCookie;
