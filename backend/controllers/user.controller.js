import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const { fullName, bio, profilePic } = req.body;
		
		// Find the user
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		
		// Update user fields
		if (fullName) user.fullName = fullName;
		if (bio !== undefined) user.bio = bio; // Allow empty string
		
		// Set profilePic directly if provided (no base64 processing needed)
		if (profilePic) {
			user.profilePic = profilePic;
		}
		
		// Save the updated user
		await user.save();
		
		// Return updated user info (without password)
		const updatedUser = {
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
			bio: user.bio,
			gender: user.gender
		};
		
		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateUserProfile:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
