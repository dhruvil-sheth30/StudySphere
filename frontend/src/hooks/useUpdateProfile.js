import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();
  
  const updateProfile = async (userData) => {
    if (!authUser) {
      toast.error("You must be logged in to update your profile");
      return false;
    }
    
    setLoading(true);
    
    try {
      // Send data to the profile update endpoint
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
      // Try to get the response body
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Invalid server response");
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to update profile");
      }
      
      // Update local storage and auth context with new user data
      const updatedUser = { ...authUser, ...data };
      localStorage.setItem("chat-user", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);
      
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, updateProfile };
};

export default useUpdateProfile;
