// ============================================================
// MarketApp — Shared TypeScript Types
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  SHOP_MANAGER = 'SHOP_MANAGER',
  CATALOG_MANAGER = 'CATALOG_MANAGER',
  SALES_AGENT = 'SALES_AGENT',
  FULFILLMENT_EMPLOYEE = 'FULFILLMENT_EMPLOYEE',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  READ_ONLY_STAFF = 'READ_ONLY_STAFF',
  MARKET_REPRESENTATIVE = 'MARKET_REPRESENTATIVE',
  VERIFICATION_AGENT = 'VERIFICATION_AGENT',
  SUPPORT = 'SUPPORT',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  DEACTIVATED = 'DEACTIVATED',
}

export enum ClaimStatus {
  UNCLAIMED = 'UNCLAIMED',
  CLAIM_SUBMITTED = 'CLAIM_SUBMITTED',
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  MARKET_VERIFICATION = 'MARKET_VERIFICATION',
  PAYMENT_VERIFICATION = 'PAYMENT_VERIFICATION',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  APPROVED = 'APPROVED',
  DISPUTED = 'DISPUTED',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

export enum PricingMode {
  FIXED = 'FIXED',
  NEGOTIABLE = 'NEGOTIABLE',
  CONTACT_FOR_PRICE = 'CONTACT_FOR_PRICE',
}

export enum ProductCondition {
  NEW = 'NEW',
  USED = 'USED',
  REFURBISHED = 'REFURBISHED',
  OPEN_BOX = 'OPEN_BOX',
}

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LIMITED_STOCK = 'LIMITED_STOCK',
  AVAILABLE_ON_REQUEST = 'AVAILABLE_ON_REQUEST',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PREORDER = 'PREORDER',
  DISCONTINUED = 'DISCONTINUED',
}

export enum OfferStatus {
  PENDING = 'PENDING',
  COUNTERED = 'COUNTERED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  CONVERTED_TO_ORDER = 'CONVERTED_TO_ORDER',
}

export enum OrderStatus {
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAID = 'PAID',
  SELLER_CONFIRMED = 'SELLER_CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PICKUP_COURIER = 'PICKUP_COURIER',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CUSTOMER_CONFIRMED = 'CUSTOMER_CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  DISPUTED = 'DISPUTED',
  REVERSED = 'REVERSED',
}

export enum FulfillmentMethod {
  CUSTOMER_PICKUP = 'CUSTOMER_PICKUP',
  SELLER_DELIVERY = 'SELLER_DELIVERY',
  MARKET_RIDER = 'MARKET_RIDER',
  INTEGRATED_COURIER = 'INTEGRATED_COURIER',
  NATIONAL_LOGISTICS = 'NATIONAL_LOGISTICS',
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
}

export enum NavigationNodeType {
  ENTRANCE = 'ENTRANCE',
  CORRIDOR_JUNCTION = 'CORRIDOR_JUNCTION',
  STAIRCASE = 'STAIRCASE',
  ELEVATOR = 'ELEVATOR',
  LANDMARK = 'LANDMARK',
  EXIT = 'EXIT',
  SHOP_ENTRANCE = 'SHOP_ENTRANCE',
}

// ─── Base ────────────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User ────────────────────────────────────────────────────

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phone: string; // E.164 format
  roles: UserRole[];
  accountStatus: AccountStatus;
  lastLogin: string | null;
  avatarUrl: string | null;
}

export interface UserDevice extends BaseEntity {
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  lastSeen: string;
}

// ─── Market ──────────────────────────────────────────────────

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Market extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  country: string;
  location: GeoPoint;
  boundary: GeoPoint[];
  thumbnailUrl: string | null;
  imageUrls: string[];
  categories: string[];
  totalStalls: number;
  mappedStalls: number;
  verifiedStalls: number;
  hasNavigation: boolean;
  operatingHours: OperatingHours;
  entrances: MarketEntrance[];
  isActive: boolean;
}

export interface OperatingHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface DayHours {
  open: string; // HH:MM
  close: string; // HH:MM
}

export interface MarketEntrance extends BaseEntity {
  marketId: string;
  name: string;
  location: GeoPoint;
  isMain: boolean;
  navNodeId: string;
}

export interface MarketZone extends BaseEntity {
  marketId: string;
  name: string;
  description: string | null;
  floor: number;
}

// ─── Stall ───────────────────────────────────────────────────

export interface Stall extends BaseEntity {
  marketId: string;
  zoneId: string | null;
  stallNumber: string;
  localX: number;
  localY: number;
  location: GeoPoint | null;
  facingDirection: number; // degrees
  nearestNavNodeId: string | null;
  nearestPanoramaId: string | null;
  photoUrl: string | null;
  claimStatus: ClaimStatus;
  isOccupied: boolean;
  shopId: string | null;
}

export interface StallClaim extends BaseEntity {
  stallId: string;
  userId: string;
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
}

// ─── Navigation ──────────────────────────────────────────────

export interface NavigationNode extends BaseEntity {
  marketId: string;
  type: NavigationNodeType;
  label: string;
  localX: number;
  localY: number;
  floor: number;
  location: GeoPoint | null;
}

export interface NavigationEdge extends BaseEntity {
  marketId: string;
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  direction: number; // compass bearing
  floor: number;
  isAccessible: boolean;
  isTemporarilyClosed: boolean;
}

export interface RouteStep {
  nodeId: string;
  nodeLabel: string;
  instruction: string;
  distanceMeters: number;
}

export interface NavigationRoute {
  steps: RouteStep[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
}

// ─── Panorama ────────────────────────────────────────────────

export interface Panorama extends BaseEntity {
  marketId: string;
  zoneId: string | null;
  floor: number;
  localX: number;
  localY: number;
  heading: number;
  captureDate: string;
  publicImageUrl: string;
  thumbnailUrl: string;
  adjacentPanoramaIds: string[];
  nearbyStallIds: string[];
  navNodeId: string | null;
  isPublished: boolean;
  qualityStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PanoramaHotspot {
  id: string;
  panoramaId: string;
  type: 'SHOP' | 'AMENITY' | 'NAVIGATION';
  targetId: string;
  pitch: number;
  yaw: number;
  label: string;
}

// ─── Shop / Seller ───────────────────────────────────────────

export interface Shop extends BaseEntity {
  stallId: string;
  marketId: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  photoUrls: string[];
  operatingHours: OperatingHours;
  isCurrentlyOpen: boolean;
  isVerified: boolean;
  verificationBadges: string[];
  rating: number;
  totalRatings: number;
  totalTransactions: number;
  responseTimeMinutes: number | null;
  fulfillmentRatePercent: number | null;
  claimStatus: ClaimStatus;
  moderationStatus: ModerationStatus;
}

export interface SellerIdentity extends BaseEntity {
  userId: string;
  shopId: string;
  legalName: string;
  idType: string;
  idNumber: string;
  selfieUrl: string | null;
  businessName: string | null;
  businessRegNumber: string | null;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

// ─── Catalog ─────────────────────────────────────────────────

export interface ShopCategory extends BaseEntity {
  shopId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isHidden: boolean;
  platformCategoryId: string | null;
}

export interface PlatformCategory extends BaseEntity {
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  iconUrl: string | null;
}

export interface Product extends BaseEntity {
  shopId: string;
  shopCategoryId: string | null;
  platformCategoryId: string | null;
  name: string;
  description: string;
  imageUrls: string[];
  videoUrl: string | null;
  price: number;
  currency: string;
  pricingMode: PricingMode;
  minimumOfferPrice?: number | null;
  condition: ProductCondition;
  inventoryStatus: InventoryStatus;
  quantity: number | null;
  unit: string;
  minimumOrder: number;
  hasVariants: boolean;
  warrantyInfo: string | null;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  moderationStatus: ModerationStatus;
  brand: string | null;
  tags: string[];
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  name: string;
  attributes: Record<string, string>;
  price: number | null;
  inventoryStatus: InventoryStatus;
  quantity: number | null;
}

// ─── Chat ────────────────────────────────────────────────────

export interface Conversation extends BaseEntity {
  shopId: string;
  customerId: string;
  lastMessageAt: string | null;
  isBlockedByShop: boolean;
  isBlockedByCustomer: boolean;
}

export interface Message extends BaseEntity {
  conversationId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'SELLER';
  type: 'TEXT' | 'IMAGE' | 'PRODUCT_CARD' | 'VOICE_NOTE' | 'OFFER' | 'SYSTEM';
  content: string;
  attachmentUrl: string | null;
  productId: string | null;
  offerId: string | null;
  isRead: boolean;
}

// ─── Offers ──────────────────────────────────────────────────

export interface Offer extends BaseEntity {
  conversationId: string;
  shopId: string;
  customerId: string;
  productId: string;
  productSnapshot: Product;
  quantity: number;
  originalPrice: number;
  proposedUnitPrice: number;
  shippingCost: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  fulfillmentMethod: FulfillmentMethod;
  status: OfferStatus;
  initiatedBy: 'CUSTOMER' | 'SELLER';
  expiresAt: string;
  message: string | null;
}

// ─── Orders ──────────────────────────────────────────────────

export interface Order extends BaseEntity {
  shopId: string;
  customerId: string;
  offerId: string | null;
  orderNumber: string;
  productSnapshot: Product;
  quantity: number;
  unitPrice: number;
  negotiatedDiscount: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress: DeliveryAddress | null;
  pickupCode: string | null;
  notes: string | null;
}

export interface DeliveryAddress {
  recipientName: string;
  recipientPhone: string;
  street: string;
  state: string;
  lga: string;
  landmark: string | null;
  instructions: string | null;
  location: GeoPoint | null;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  productVariantId: string | null;
  productSnapshot: Product;
  quantity: number;
  unitPrice: number;
}

// ─── Payments ────────────────────────────────────────────────

export interface Payment extends BaseEntity {
  orderId: string;
  customerId: string;
  shopId: string;
  amount: number;
  currency: string;
  provider: 'PAYSTACK' | 'FLUTTERWAVE';
  providerReference: string;
  status: PaymentStatus;
  paidAt: string | null;
  metadata: Record<string, unknown>;
}

export interface PaymentSplit extends BaseEntity {
  paymentId: string;
  sellerAmount: number;
  platformCommission: number;
  providerFee: number;
  currency: string;
}

// ─── Reviews ─────────────────────────────────────────────────

export interface Review extends BaseEntity {
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  revieweeType: 'SHOP' | 'CUSTOMER';
  overallRating: number;
  dimensions: ReviewDimensions;
  comment: string | null;
  isPublic: boolean;
  isVerifiedTransaction: boolean;
  isHidden: boolean;
  response: string | null;
  respondedAt: string | null;
}

export interface ReviewDimensions {
  productAccuracy?: number;
  communication?: number;
  value?: number;
  fulfillment?: number;
  professionalism?: number;
  reliability?: number;
  respectfulConduct?: number;
}

// ─── Disputes ────────────────────────────────────────────────

export interface Dispute extends BaseEntity {
  orderId: string;
  initiatedBy: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  resolution: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

// ─── Notifications ───────────────────────────────────────────

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  type: string;
  referenceId: string | null;
  referenceType: string | null;
  isRead: boolean;
  channel: 'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS';
}

// ─── API Responses ───────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── Search ──────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  marketId?: string;
  shopId?: string;
  categoryId?: string;
  pricingMode?: PricingMode;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  inStockOnly?: boolean;
}

export interface SearchResult {
  shops: Shop[];
  products: Product[];
  markets: Market[];
  totalShops: number;
  totalProducts: number;
  totalMarkets: number;
}
