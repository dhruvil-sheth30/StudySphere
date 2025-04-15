import { useState, useRef, useEffect } from "react";
import { FaUser, FaIdCard, FaCamera } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import useUploadImage from "../../hooks/useUploadImage";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser } = useAuthContext();
  const { loading: updateLoading, updateProfile } = useUpdateProfile();
  const { uploadImage, loading: uploadLoading } = useUploadImage();
  
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(authUser?.profilePic || "");
  const fileInputRef = useRef(null);
  
  // Refresh the form data when authUser changes
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        username: authUser.username || "",
        bio: authUser.bio || "",
        profilePic: authUser.profilePic || ""
      });
      setImagePreview(authUser.profilePic || "");
    }
  }, [authUser]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      toast.error("File must be an image (JPEG, PNG, or GIF)");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    
    // Store file for later upload
    setSelectedFile(file);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    // First, upload the image if a new one was selected
    let profilePicUrl = formData.profilePic;
    if (selectedFile) {
      const loadingToast = toast.loading("Uploading image...");
      
      try {
        // Add file size information for better troubleshooting
        console.log(`Uploading profile image: ${selectedFile.name} (${selectedFile.size} bytes)`);
        
        // Upload the image and get back the URL
        const imageUrl = await uploadImage(selectedFile, 'profile');
        
        toast.dismiss(loadingToast);
        
        if (!imageUrl) {
          toast.error("Image upload failed. Profile not updated.");
          return;
        }
        
        profilePicUrl = imageUrl;
        console.log("Image upload successful, URL:", profilePicUrl);
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(`Failed to upload image: ${error.message || "Unknown error"}`);
        return;
      }
    }
    
    // Then update the profile with all form data including the new image URL
    const success = await updateProfile({
      ...formData,
      profilePic: profilePicUrl
    });
    
    if (success) {
      // Clean up
      setSelectedFile(null);
      toast.success("Profile updated successfully!");
    }
  };
  
  const loading = updateLoading || uploadLoading;
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Edit Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={triggerFileInput}
              >
                <FaCamera className="text-white text-2xl" />
              </div>
            </div>
            <input 
              type="file"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/gif"
            />
            <div className="flex flex-col items-center mt-2">
              <button 
                type="button"
                onClick={triggerFileInput}
                className="text-blue-400 hover:text-blue-300"
              >
                Change Profile Picture
              </button>
              {selectedFile && (
                <span className="text-xs text-green-400 mt-1">
                  New image selected: {selectedFile.name}
                </span>
              )}
            </div>
          </div>
          
          {/* Full Name */}
          <div className="relative">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Full Name
            </label>
            <div className="flex items-center">
              <span className="absolute left-3 text-gray-400">
                <FaIdCard />
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Your full name"
                className="w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Username */}
          <div className="relative">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <div className="flex items-center">
              <span className="absolute left-3 text-gray-400">
                <FaUser />
              </span>
              <input
                type="text"
                name="username"
                placeholder="Your username"
                className="w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={handleChange}
                disabled
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
          </div>
          
          {/* Bio */}
          <div className="relative">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              placeholder="Tell us about yourself"
              rows={3}
              className="w-full bg-gray-700 bg-opacity-50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="loading loading-spinner loading-sm mr-2"></div>
              ) : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
