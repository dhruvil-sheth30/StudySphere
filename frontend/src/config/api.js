const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Common fetch options to use across all API requests
const fetchOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Helper function for fetch requests with better error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    // Merge default options with any custom options
    const mergedOptions = {
      ...fetchOptions,
      ...options,
      headers: {
        ...fetchOptions.headers,
        ...(options.headers || {})
      }
    };

    const response = await fetch(url, mergedOptions);
    
    // Special case for 401 Unauthorized - check if user is logged in
    if (response.status === 401) {
      const authUser = JSON.parse(localStorage.getItem("chat-user"));
      if (!authUser) {
        throw new Error("Authentication required");
      }
    }
    
    if (!response.ok) {
      // Try to parse error message if available
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export { API_BASE_URL, fetchOptions, fetchWithErrorHandling };
