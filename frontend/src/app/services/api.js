import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4fbb70ef`;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Products API
export const productsApi = {
  // Get all products
  getAll: async () => {
    return await apiRequest("/products");
  },

  // Get product by ID
  getById: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  // Get products by category
  getByCategory: async (category) => {
    return await apiRequest(`/products/category/${category}`);
  },

  // Get all categories
  getCategories: async () => {
    return await apiRequest("/categories");
  },
};

// Cart API
export const cartApi = {
  // Save cart to server
  save: async (userId, items) => {
    return await apiRequest("/cart/save", {
      method: "POST",
      body: JSON.stringify({ userId, items }),
    });
  },

  // Get cart from server
  get: async (userId) => {
    return await apiRequest(`/cart/${userId}`);
  },

  // Clear cart
  clear: async (userId) => {
    return await apiRequest(`/cart/${userId}`, {
      method: "DELETE",
    });
  },
};

// Orders API
export const ordersApi = {
  // Create order
  create: async (userId, items, total) => {
    return await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify({ userId, items, total }),
    });
  },

  // Get order by ID
  getById: async (orderId) => {
    return await apiRequest(`/orders/${orderId}`);
  },

  // Get user orders
  getUserOrders: async (userId) => {
    return await apiRequest(`/users/${userId}/orders`);
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    return await apiRequest(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};
