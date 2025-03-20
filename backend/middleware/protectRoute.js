import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		console.log("Received token:", token);
		console.log("All cookies:", req.cookies);
		console.log("Request headers:", req.headers);
		console.log("Origin:", req.headers.origin);
		
		if (!token) {
			console.log("No token provided in request");
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			if (!decoded) {
				console.log("Token verification failed");
				return res.status(401).json({ error: "Unauthorized - Invalid Token" });
			}

			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				console.log("User not found for token");
				return res.status(404).json({ error: "User not found" });
			}

			console.log("Authentication successful for user:", user.username);
			req.user = user;
			next();
		} catch (jwtError) {
			console.log("JWT verification error:", jwtError.message);
			return res.status(401).json({ error: `Unauthorized - ${jwtError.message}` });
		}
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
