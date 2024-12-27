import axios from 'axios';

const api = {
  createUser: async (userData) => {
    try {
      const response = await axios.post('https://dtu-flats.vercel.app/api/users', userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Rethrow the error for handling in the calling function
    }
  },
  // ... other API methods ...
};

export default api;
