import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    const isProduction = process.env.NODE_ENV === "production";
    
    // Cookie settings
    const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        path: "/",
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction
    };

    res.cookie("jwt", token, cookieOptions);
};

export default generateTokenAndSetCookie;
