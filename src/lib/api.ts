// API Service for Backend Communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

// Type definitions for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Stats {
  total_products: number;
  total_inventory: number;
  low_stock_items: number;
  total_orders: number;
  total_revenue: number;
  timestamp: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  img: string;
  desc: string;
  sizes: string[];
  stock: number;
}

export interface InventoryItem {
  id: number;
  product_id: string;
  product_title: string;
  stock: number;
  reorder_level: number;
  last_updated: string;
  status: string;
}

export interface OrderItem {
  id: number;
  product_id: string;
  product_title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: string;
  payment_method?: string;
  address: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  user_message: string;
  bot_response: string;
  timestamp: string;
}

export interface PaymentInitiation {
  transaction_id: string;
  order_id: string;
  amount: number;
  total_amount: number;
  fee: number;
  payment_method: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  fee: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  // Add query parameters
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API Error: ${response.status}`,
        data: undefined,
      };
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API Call Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: undefined,
    };
  }
}

// Product API
export const productAPI = {
  getAll: (page = 1, category?: string, search?: string): Promise<ApiResponse<Product[]>> =>
    apiCall<Product[]>('/products', {
      params: { page, ...(category && { category }), ...(search && { search }) },
    }),

  getById: (productId: string): Promise<ApiResponse<Product>> =>
    apiCall<Product>(`/products/${productId}`),

  getCategories: (): Promise<ApiResponse<string[]>> =>
    apiCall<string[]>('/products/categories'),
};

// Admin API
export const adminAPI = {
  getStats: (): Promise<ApiResponse<Stats>> =>
    apiCall<Stats>('/admin/stats'),

  getProducts: (): Promise<ApiResponse<Product[]>> =>
    apiCall<Product[]>('/admin/products'),

  createProduct: (productData: Record<string, unknown>): Promise<ApiResponse<Product>> =>
    apiCall<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (productId: string, updates: Record<string, unknown>): Promise<ApiResponse<Product>> =>
    apiCall<Product>(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteProduct: (productId: string): Promise<ApiResponse<{ message: string }>> =>
    apiCall<{ message: string }>(`/admin/products/${productId}`, {
      method: 'DELETE',
    }),
};

// Inventory API
export const inventoryAPI = {
  getAll: (page = 1): Promise<ApiResponse<InventoryItem[]>> =>
    apiCall<InventoryItem[]>('/inventory', { params: { page } }),

  getLowStock: (): Promise<ApiResponse<InventoryItem[]>> =>
    apiCall<InventoryItem[]>('/inventory/low-stock'),

  getByProductId: (productId: string): Promise<ApiResponse<InventoryItem>> =>
    apiCall<InventoryItem>(`/inventory/${productId}`),

  update: (productId: string, data: any): Promise<ApiResponse<InventoryItem>> =>
    apiCall<InventoryItem>(`/inventory/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Order API
export const orderAPI = {
  getAll: (status?: string, page = 1): Promise<ApiResponse<Order[]>> =>
    apiCall<Order[]>('/orders', { params: { ...(status && { status }), page } }),

  getById: (orderId: string): Promise<ApiResponse<Order>> =>
    apiCall<Order>(`/orders/${orderId}`),

  create: (orderData: Record<string, unknown> | any): Promise<ApiResponse<Order>> =>
    apiCall<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateStatus: (orderId: string, updates: Record<string, unknown>): Promise<ApiResponse<Order>> =>
    apiCall<Order>(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  cancel: (orderId: string): Promise<ApiResponse<Order>> =>
    apiCall<Order>(`/orders/${orderId}/cancel`, {
      method: 'POST',
    }),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message: string): Promise<ApiResponse<ChatResponse>> =>
    apiCall<ChatResponse>('/chatbot/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getFAQ: (): Promise<ApiResponse<Array<{ q: string; a: string }>>> =>
    apiCall<Array<{ q: string; a: string }>>('/chatbot/faq'),

  getSuggestions: (): Promise<ApiResponse<string[]>> =>
    apiCall<string[]>('/chatbot/suggestions'),
};

// Payment API
export const paymentAPI = {
  initiate: (orderId: string, amount: number, paymentMethod: string): Promise<ApiResponse<PaymentInitiation>> =>
    apiCall<PaymentInitiation>('/payment/initiate', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, amount, payment_method: paymentMethod }),
    }),

  process: (
    transactionId: string,
    cardNumber: string,
    cvv: string,
    expiry: string,
    paymentMethod: string
  ): Promise<ApiResponse<PaymentInitiation>> =>
    apiCall<PaymentInitiation>('/payment/process', {
      method: 'POST',
      body: JSON.stringify({
        transaction_id: transactionId,
        card_number: cardNumber,
        cvv,
        expiry,
        payment_method: paymentMethod,
      }),
    }),

  getTransactionStatus: (transactionId: string): Promise<ApiResponse<{ transaction_id: string; status: string; amount: number }>> =>
    apiCall<{ transaction_id: string; status: string; amount: number }>(`/payment/status/${transactionId}`),

  getPaymentMethods: (): Promise<ApiResponse<PaymentMethod[]>> =>
    apiCall<PaymentMethod[]>('/payment/methods'),
};
