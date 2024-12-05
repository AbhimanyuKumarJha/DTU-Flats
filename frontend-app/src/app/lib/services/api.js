import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

const api = {
  // User APIs
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error creating user");
    }
  },

  // Transaction APIs
  createTransaction: async (transactionData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/transactions`,
        transactionData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error creating transaction"
      );
    }
  },

  // Rent Rate APIs
  getRentRates: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/rent-rates`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching rent rates"
      );
    }
  },

  // Get User by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error fetching user");
    }
  },

  // Get Transactions by User ID
  getTransactionsByUserId: async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/transactions/user/${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching transactions"
      );
    }
  },
};

export default api;
