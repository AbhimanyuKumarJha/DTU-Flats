import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

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

  // Create multiple transactions
  createTransactions: async (userId, transactions) => {
    try {
      const promises = transactions.map((transaction) => {
        const transactionData = {
          ...transaction,
          userId,
        };
        // console.log("Sending Transaction Data:", transactionData);
        return axios.post(`${BASE_URL}/transactions`, transactionData);
      });

      const responses = await Promise.all(promises);
      return responses.map((response) => response.data);
    } catch (error) {
      console.error("Error in createTransactions:", error.response?.data);
      throw new Error(
        error.response?.data?.error || "Error creating transactions"
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

  updateTransactionByUserId : async (userId, transactionId, transactionData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/transactions/user/${userId}/transactions/${transactionId}`,
        transactionData // Don't need to include transactionId in body since it's in URL
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error updating transaction"
      );
    }
  },

  // Get all transactions
  getAllTransactions: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transactions`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching transactions"
      );
    }
  },

  //Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error fetching users");
    }
  },

  // Update User API
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error updating user");
    }
  },

  getAllAdmins: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admins`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching admin list"
      );
    }
  },

  getAdminByEmail: async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/admins /${email}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error fetching admin");
    }
  },

  createAdmin: async (adminData) => {
    try {
      const response = await axios.post(`${BASE_URL}/admins`, adminData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error creating admin");
    }
  },
  deleteAdmin: async (adminId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/admins/${adminId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error deleting admin");
    }
  },
  createRentRate: async (rentRateData) => {
    try {
      const response = await axios.post(`${BASE_URL}/rent-rates`, rentRateData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error creating rent rate"
      );
    }
  },
  deleteRentRate: async (rentRateId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/rent-rates/${rentRateId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error deleting rent rate"
      );
    }
  },
  getAllRentRates: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/rent-rates`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching rent rates"
      );
    }
  },
  getRentRateById: async (rentRateId) => {
    try {
      const response = await axios.get(`${BASE_URL}/rent-rates/${rentRateId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching rent rate"
      );
    }
  },
  updateDiscount: async (discountId, discountData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/discounts/${discountId}`,
        discountData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error updating discount");
    }
  },
  getDiscount: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discounts`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching discounts"
      );
    }
  },
  //delete transaction
  deleteTransaction: async (transactionId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error deleting transaction");
    }
  },
  // Delete User API
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error deleting user");
    }
  },
};

export default api;
