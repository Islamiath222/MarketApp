"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationNodeType = exports.ModerationStatus = exports.FulfillmentMethod = exports.PaymentStatus = exports.OrderStatus = exports.OfferStatus = exports.InventoryStatus = exports.ProductCondition = exports.PricingMode = exports.ClaimStatus = exports.AccountStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["SELLER"] = "SELLER";
    UserRole["SHOP_MANAGER"] = "SHOP_MANAGER";
    UserRole["CATALOG_MANAGER"] = "CATALOG_MANAGER";
    UserRole["SALES_AGENT"] = "SALES_AGENT";
    UserRole["FULFILLMENT_EMPLOYEE"] = "FULFILLMENT_EMPLOYEE";
    UserRole["FINANCE_ADMIN"] = "FINANCE_ADMIN";
    UserRole["READ_ONLY_STAFF"] = "READ_ONLY_STAFF";
    UserRole["MARKET_REPRESENTATIVE"] = "MARKET_REPRESENTATIVE";
    UserRole["VERIFICATION_AGENT"] = "VERIFICATION_AGENT";
    UserRole["SUPPORT"] = "SUPPORT";
    UserRole["PLATFORM_ADMIN"] = "PLATFORM_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
    AccountStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    AccountStatus["DEACTIVATED"] = "DEACTIVATED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["UNCLAIMED"] = "UNCLAIMED";
    ClaimStatus["CLAIM_SUBMITTED"] = "CLAIM_SUBMITTED";
    ClaimStatus["IDENTITY_VERIFICATION"] = "IDENTITY_VERIFICATION";
    ClaimStatus["MARKET_VERIFICATION"] = "MARKET_VERIFICATION";
    ClaimStatus["PAYMENT_VERIFICATION"] = "PAYMENT_VERIFICATION";
    ClaimStatus["MANUAL_REVIEW"] = "MANUAL_REVIEW";
    ClaimStatus["APPROVED"] = "APPROVED";
    ClaimStatus["DISPUTED"] = "DISPUTED";
    ClaimStatus["SUSPENDED"] = "SUSPENDED";
    ClaimStatus["CLOSED"] = "CLOSED";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
var PricingMode;
(function (PricingMode) {
    PricingMode["FIXED"] = "FIXED";
    PricingMode["NEGOTIABLE"] = "NEGOTIABLE";
    PricingMode["CONTACT_FOR_PRICE"] = "CONTACT_FOR_PRICE";
})(PricingMode || (exports.PricingMode = PricingMode = {}));
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "NEW";
    ProductCondition["USED"] = "USED";
    ProductCondition["REFURBISHED"] = "REFURBISHED";
    ProductCondition["OPEN_BOX"] = "OPEN_BOX";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus["IN_STOCK"] = "IN_STOCK";
    InventoryStatus["LIMITED_STOCK"] = "LIMITED_STOCK";
    InventoryStatus["AVAILABLE_ON_REQUEST"] = "AVAILABLE_ON_REQUEST";
    InventoryStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    InventoryStatus["PREORDER"] = "PREORDER";
    InventoryStatus["DISCONTINUED"] = "DISCONTINUED";
})(InventoryStatus || (exports.InventoryStatus = InventoryStatus = {}));
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "PENDING";
    OfferStatus["COUNTERED"] = "COUNTERED";
    OfferStatus["ACCEPTED"] = "ACCEPTED";
    OfferStatus["DECLINED"] = "DECLINED";
    OfferStatus["EXPIRED"] = "EXPIRED";
    OfferStatus["CONVERTED_TO_ORDER"] = "CONVERTED_TO_ORDER";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OFFER_ACCEPTED"] = "OFFER_ACCEPTED";
    OrderStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["SELLER_CONFIRMED"] = "SELLER_CONFIRMED";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY"] = "READY";
    OrderStatus["PICKUP_COURIER"] = "PICKUP_COURIER";
    OrderStatus["IN_TRANSIT"] = "IN_TRANSIT";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CUSTOMER_CONFIRMED"] = "CUSTOMER_CONFIRMED";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["RETURNED"] = "RETURNED";
    OrderStatus["REFUNDED"] = "REFUNDED";
    OrderStatus["DISPUTED"] = "DISPUTED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["SUCCESSFUL"] = "SUCCESSFUL";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
    PaymentStatus["DISPUTED"] = "DISPUTED";
    PaymentStatus["REVERSED"] = "REVERSED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var FulfillmentMethod;
(function (FulfillmentMethod) {
    FulfillmentMethod["CUSTOMER_PICKUP"] = "CUSTOMER_PICKUP";
    FulfillmentMethod["SELLER_DELIVERY"] = "SELLER_DELIVERY";
    FulfillmentMethod["MARKET_RIDER"] = "MARKET_RIDER";
    FulfillmentMethod["INTEGRATED_COURIER"] = "INTEGRATED_COURIER";
    FulfillmentMethod["NATIONAL_LOGISTICS"] = "NATIONAL_LOGISTICS";
})(FulfillmentMethod || (exports.FulfillmentMethod = FulfillmentMethod = {}));
var ModerationStatus;
(function (ModerationStatus) {
    ModerationStatus["PENDING"] = "PENDING";
    ModerationStatus["APPROVED"] = "APPROVED";
    ModerationStatus["REJECTED"] = "REJECTED";
    ModerationStatus["FLAGGED"] = "FLAGGED";
})(ModerationStatus || (exports.ModerationStatus = ModerationStatus = {}));
var NavigationNodeType;
(function (NavigationNodeType) {
    NavigationNodeType["ENTRANCE"] = "ENTRANCE";
    NavigationNodeType["CORRIDOR_JUNCTION"] = "CORRIDOR_JUNCTION";
    NavigationNodeType["STAIRCASE"] = "STAIRCASE";
    NavigationNodeType["ELEVATOR"] = "ELEVATOR";
    NavigationNodeType["LANDMARK"] = "LANDMARK";
    NavigationNodeType["EXIT"] = "EXIT";
    NavigationNodeType["SHOP_ENTRANCE"] = "SHOP_ENTRANCE";
})(NavigationNodeType || (exports.NavigationNodeType = NavigationNodeType = {}));
//# sourceMappingURL=index.js.map