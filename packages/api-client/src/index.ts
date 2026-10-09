import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  Market,
  Shop,
  Product,
  Stall,
  User,
  Conversation,
  Message,
  Offer,
  Order,
  Payment,
  Review,
  Dispute,
  Notification,
  SearchResult,
  SearchFilters,
  NavigationRoute,
  Panorama,
} from '@marketapp/types';

// ─── Base Client ─────────────────────────────────────────────

class MarketAppApiClient {
  private readonly http: AxiosInstance;

  constructor(baseURL: string, getToken?: () => string | null) {
    this.http = axios.create({ baseURL, timeout: 30_000 });

    this.http.interceptors.request.use((config) => {
      const token = getToken?.();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.http.interceptors.response.use(
      (res) => res,
      (err) => {
        const message =
          err.response?.data?.message ?? err.message ?? 'Request failed';
        return Promise.reject(new Error(message));
      }
    );
  }

  private async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.http.get<T>(url, config);
    return res.data;
  }

  private async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.http.post<T>(url, data, config);
    return res.data;
  }

  private async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.http.patch<T>(url, data, config);
    return res.data;
  }

  private async del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.http.delete<T>(url, config);
    return res.data;
  }

  // ─── Auth ─────────────────────────────────────────────────

  auth = {
    login: (email: string, password: string) =>
      this.post<ApiResponse<{ accessToken: string; user: User }>>(
        '/auth/login',
        { email, password }
      ),
    register: (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }) => this.post<ApiResponse<{ user: User }>>('/auth/register', data),
    verifyEmail: (token: string) =>
      this.post<ApiResponse<void>>('/auth/verify-email', { token }),
    verifyPhone: (code: string) =>
      this.post<ApiResponse<void>>('/auth/verify-phone', { code }),
    refreshToken: (refreshToken: string) =>
      this.post<ApiResponse<{ accessToken: string }>>(
        '/auth/refresh',
        { refreshToken }
      ),
    logout: () => this.post<void>('/auth/logout'),
    me: () => this.get<ApiResponse<User>>('/auth/me'),
  };

  // ─── Markets ──────────────────────────────────────────────

  markets = {
    list: (params?: { city?: string; page?: number; limit?: number }) =>
      this.get<PaginatedResponse<Market>>('/markets', { params }),
    get: (idOrSlug: string) =>
      this.get<ApiResponse<Market>>(`/markets/${idOrSlug}`),
    getStalls: (marketId: string, params?: { page?: number; limit?: number }) =>
      this.get<PaginatedResponse<Stall>>(`/markets/${marketId}/stalls`, {
        params,
      }),
    getPanoramas: (marketId: string) =>
      this.get<ApiResponse<Panorama[]>>(`/markets/${marketId}/panoramas`),
    getRoute: (marketId: string, fromNodeId: string, toNodeId: string) =>
      this.get<ApiResponse<NavigationRoute>>(
        `/markets/${marketId}/navigate`,
        { params: { from: fromNodeId, to: toNodeId } }
      ),
  };

  // ─── Shops ────────────────────────────────────────────────

  shops = {
    get: (shopId: string) =>
      this.get<ApiResponse<Shop>>(`/shops/${shopId}`),
    getProducts: (
      shopId: string,
      params?: { categoryId?: string; page?: number; limit?: number }
    ) =>
      this.get<PaginatedResponse<Product>>(`/shops/${shopId}/products`, {
        params,
      }),
    getReviews: (shopId: string, params?: { page?: number; limit?: number }) =>
      this.get<PaginatedResponse<Review>>(`/shops/${shopId}/reviews`, {
        params,
      }),
    claimStall: (stallId: string) =>
      this.post<ApiResponse<void>>(`/stalls/${stallId}/claim`),
  };

  // ─── Products ─────────────────────────────────────────────

  products = {
    get: (productId: string) =>
      this.get<ApiResponse<Product>>(`/products/${productId}`),
    search: (filters: SearchFilters & { page?: number; limit?: number }) =>
      this.get<SearchResult>('/search', { params: filters }),
    create: (shopId: string, data: Partial<Product>) =>
      this.post<ApiResponse<Product>>(`/shops/${shopId}/products`, data),
    update: (productId: string, data: Partial<Product>) =>
      this.patch<ApiResponse<Product>>(`/products/${productId}`, data),
    delete: (productId: string) =>
      this.del<ApiResponse<void>>(`/products/${productId}`),
  };

  // ─── Chat ─────────────────────────────────────────────────

  chat = {
    listConversations: (params?: { page?: number; limit?: number }) =>
      this.get<PaginatedResponse<Conversation>>('/conversations', { params }),
    getConversation: (conversationId: string) =>
      this.get<ApiResponse<Conversation>>(`/conversations/${conversationId}`),
    getMessages: (
      conversationId: string,
      params?: { before?: string; limit?: number }
    ) =>
      this.get<PaginatedResponse<Message>>(
        `/conversations/${conversationId}/messages`,
        { params }
      ),
    startConversation: (shopId: string) =>
      this.post<ApiResponse<Conversation>>('/conversations', { shopId }),
    sendMessage: (conversationId: string, data: Partial<Message>) =>
      this.post<ApiResponse<Message>>(
        `/conversations/${conversationId}/messages`,
        data
      ),
  };

  // ─── Offers ───────────────────────────────────────────────

  offers = {
    create: (data: Partial<Offer>) =>
      this.post<ApiResponse<Offer>>('/offers', data),
    get: (offerId: string) =>
      this.get<ApiResponse<Offer>>(`/offers/${offerId}`),
    counter: (offerId: string, proposedPrice: number) =>
      this.post<ApiResponse<Offer>>(`/offers/${offerId}/counter`, {
        proposedPrice,
      }),
    accept: (offerId: string) =>
      this.post<ApiResponse<Offer>>(`/offers/${offerId}/accept`),
    decline: (offerId: string) =>
      this.post<ApiResponse<Offer>>(`/offers/${offerId}/decline`),
  };

  // ─── Orders ───────────────────────────────────────────────

  orders = {
    list: (params?: { status?: string; page?: number; limit?: number }) =>
      this.get<PaginatedResponse<Order>>('/orders', { params }),
    get: (orderId: string) =>
      this.get<ApiResponse<Order>>(`/orders/${orderId}`),
    createFromOffer: (offerId: string, deliveryAddress?: object) =>
      this.post<ApiResponse<Order>>('/orders', { offerId, deliveryAddress }),
    confirmPickup: (orderId: string, code: string) =>
      this.post<ApiResponse<Order>>(`/orders/${orderId}/confirm-pickup`, {
        code,
      }),
    confirmDelivery: (orderId: string, otp: string) =>
      this.post<ApiResponse<Order>>(`/orders/${orderId}/confirm-delivery`, {
        otp,
      }),
  };

  // ─── Payments ─────────────────────────────────────────────

  payments = {
    initiate: (orderId: string) =>
      this.post<ApiResponse<{ checkoutUrl: string; reference: string }>>(
        '/payments/initiate',
        { orderId }
      ),
    verify: (reference: string) =>
      this.post<ApiResponse<Payment>>('/payments/verify', { reference }),
  };

  // ─── Reviews ──────────────────────────────────────────────

  reviews = {
    create: (orderId: string, data: Partial<Review>) =>
      this.post<ApiResponse<Review>>(`/orders/${orderId}/review`, data),
    respond: (reviewId: string, response: string) =>
      this.post<ApiResponse<Review>>(`/reviews/${reviewId}/respond`, {
        response,
      }),
  };

  // ─── Disputes ─────────────────────────────────────────────

  disputes = {
    create: (orderId: string, reason: string, description: string) =>
      this.post<ApiResponse<Dispute>>('/disputes', {
        orderId,
        reason,
        description,
      }),
    get: (disputeId: string) =>
      this.get<ApiResponse<Dispute>>(`/disputes/${disputeId}`),
  };

  // ─── Notifications ────────────────────────────────────────

  notifications = {
    list: (params?: { page?: number; limit?: number }) =>
      this.get<PaginatedResponse<Notification>>('/notifications', { params }),
    markRead: (notificationId: string) =>
      this.patch<ApiResponse<void>>(`/notifications/${notificationId}/read`),
    markAllRead: () =>
      this.post<ApiResponse<void>>('/notifications/mark-all-read'),
  };
}

// ─── Factory ─────────────────────────────────────────────────

let clientInstance: MarketAppApiClient | null = null;

export function createApiClient(
  baseURL: string,
  getToken?: () => string | null
): MarketAppApiClient {
  clientInstance = new MarketAppApiClient(baseURL, getToken);
  return clientInstance;
}

export function getApiClient(): MarketAppApiClient {
  if (!clientInstance) {
    throw new Error('API client not initialized. Call createApiClient first.');
  }
  return clientInstance;
}

export type { MarketAppApiClient };
export * from './mock-data';
