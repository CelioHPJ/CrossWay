import { projectId, publicAnonKey } from "../../utils/supabase/info.tsx";

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

// Orders API (MOCKED VIA LOCALSTORAGE DEVIDO A QUEDA DA API REMOTA GGP...)
export const ordersApi = {
  // Create order
  create: async (userId, items, total) => {
    return new Promise((resolve) => {
      // Simula uma viagem ao banco
      setTimeout(() => {
        const memoryOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const newOrder = {
          orderId: "PED-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          userId,
          status: "PENDING",
          items: items.map(i => ({ ...i, productId: i.id, paidUnitPrice: i.price })),
          totalAmount: total,
          orderedAt: new Date().toISOString()
        };
        memoryOrders.push(newOrder);
        localStorage.setItem('mock_orders', JSON.stringify(memoryOrders));
        resolve({ orderId: newOrder.orderId, status: "PENDING" });
      }, 500);
    });
  },

  // Get order by ID
  getById: async (orderId) => {
    return new Promise((resolve, reject) => {
      const memoryOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
      const order = memoryOrders.find(o => o.orderId === orderId);
      if (order) resolve(order);
      else reject(new Error("Pedido não encontrado no simulador offline"));
    });
  },

  // Get user orders
  getUserOrders: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memoryOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        // Pega do mais pro mais antigo
        const userOrders = memoryOrders.filter(o => o.userId === userId).reverse();
        resolve(userOrders);
      }, 400);
    });
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const memoryOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const orderIndex = memoryOrders.findIndex(o => o.orderId === orderId);
        if (orderIndex >= 0) {
          memoryOrders[orderIndex].status = status;
          localStorage.setItem('mock_orders', JSON.stringify(memoryOrders));
          resolve(memoryOrders[orderIndex]);
        } else {
          reject(new Error("Pedido não encontrado na memória LocalStorage"));
        }
      }, 300);
    });
  },
};
