const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api'; // Adjust the base URL as needed

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error fetching user");
  }
};

module.exports = { getUserById }; 