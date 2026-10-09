import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Modal,
  Dimensions,
  PanResponder,
  Platform,
  BackHandler,
  Share,
  Alert,
  Switch,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  MOCK_MARKETS,
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_PANORAMAS,
  MOCK_ORDERS,
  MOCK_STALLS,
  MOCK_USERS,
  formatNGN,
  isMarketOpen,
} from '@marketapp/api-client';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Screen =
  | 'splash'
  | 'onboarding'
  | 'markets'
  | 'market-detail'
  | 'shop-directory'
  | 'shop-detail'
  | 'product-detail'
  | 'map'
  | 'tour'
  | 'chat'
  | 'orders'
  | 'notifications'
  | 'wishlist'
  | 'settings';

type MarketType = typeof MOCK_MARKETS[0];
type ProductType = typeof MOCK_PRODUCTS[0];
type ShopType = typeof MOCK_SHOPS[0];
type OrderType = typeof MOCK_ORDERS[0];

const ONBOARDING_SLIDES = [
  {
    id: '1',
    icon: '🧭',
    title: '360° Virtual Market Walks',
    subtitle:
      'Step into Balogun, Wuse, Onitsha, Kano, and Aba markets right from your phone with interactive 360° panoramic corridor tours.',
    color: '#FF6B35',
  },
  {
    id: '2',
    icon: '🤝',
    title: 'Real-Time Trader Haggling',
    subtitle:
      'Chat directly with verified market stall traders, make counter-offers, and negotiate the best price in real time — just like being there.',
    color: '#F59E0B',
  },
  {
    id: '3',
    icon: '🛡️',
    title: 'Escrow Security & QR Pass',
    subtitle:
      'Your payment is safely held in Escrow until you inspect your item at the physical stall and scan your official Pickup Pass.',
    color: '#00D4AA',
  },
  {
    id: '4',
    icon: '🚚',
    title: 'Pickup or Home Delivery',
    subtitle:
      'Choose to walk into the market and collect your item yourself, or have it delivered anywhere in Nigeria with full tracking.',
    color: '#8B5CF6',
  },
];

// Fake notifications based on real order data
const NOTIFICATIONS = [
  {
    id: 'notif-001',
    icon: '✅',
    title: 'Offer Accepted!',
    body: 'Adebayo Electronics accepted your ₦820,000 offer for iPhone 14 Pro Max.',
    time: '2 hours ago',
    read: false,
    screen: 'orders' as Screen,
  },
  {
    id: 'notif-002',
    icon: '🛡️',
    title: 'Escrow Payment Confirmed',
    body: 'Order #MKT-2024-001892 — ₦837,300 is securely held in Escrow. Visit stall BLK-A-14.',
    time: '2 hours ago',
    read: false,
    screen: 'orders' as Screen,
  },
  {
    id: 'notif-003',
    icon: '💬',
    title: "New Message from Fatima's Fashion",
    body: 'The Ankara fabric you wanted is back in stock! 45 yards available.',
    time: '5 hours ago',
    read: true,
    screen: 'chat' as Screen,
  },
  {
    id: 'notif-004',
    icon: '🏪',
    title: 'Chukwuma Gadgets Counter-Offer',
    body: 'Counter offer received: MacBook Air M2 at ₦1,150,000 (was ₦1,250,000)',
    time: '1 day ago',
    read: true,
    screen: 'chat' as Screen,
  },
  {
    id: 'notif-005',
    icon: '⭐',
    title: 'Rate Your Purchase',
    body: 'How was your experience at Adebayo Electronics? Leave a rating to help other buyers.',
    time: '2 days ago',
    read: true,
    screen: 'orders' as Screen,
  },
];

// Wishlist items (real products from mock data)
const INITIAL_WISHLIST = ['prod-002', 'prod-004'];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  // Market discovery state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All Nigeria');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected data state
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(MOCK_MARKETS[0]!);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(MOCK_PRODUCTS[0]!);
  const [selectedShop, setSelectedShop] = useState<ShopType>(MOCK_SHOPS[0]!);

  // Offer / Haggle state
  const [showHaggleModal, setShowHaggleModal] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('800000');
  const [fulfillmentChoice, setFulfillmentChoice] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(INITIAL_WISHLIST);
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Notifications state
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [escrowPinEnabled, setEscrowPinEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [preferredState, setPreferredState] = useState('Lagos State (South-West)');
  const [userName, setUserName] = useState(MOCK_USERS[0]!.fullName);
  const [userPhone, setUserPhone] = useState(MOCK_USERS[0]!.phone);
  const [userEmail, setUserEmail] = useState(MOCK_USERS[0]!.email);

  // 360 Panorama state
  const [currentPanoIndex, setCurrentPanoIndex] = useState(0);
  const currentPano = MOCK_PANORAMAS[currentPanoIndex]!;
  const [yaw, setYaw] = useState(45);
  const [selectedShopInTour, setSelectedShopInTour] = useState<ShopType>(MOCK_SHOPS[0]!);
  const [showShopSheet, setShowShopSheet] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'seller',
      text: `Welcome to ${MOCK_SHOPS[0]!.name}! We are located at Stall BLK-A-14 in ${MOCK_MARKETS[0]!.name}. Feel free to ask questions or make an offer!`,
    },
    { id: '2', sender: 'customer', isOffer: true, price: 820000, status: 'COUNTERED' },
    {
      id: '3',
      sender: 'seller',
      text: `₦820,000 is accepted! Includes original adapter, ${MOCK_ORDERS[0]!.productSnapshot.warrantyInfo ?? '90-day warranty'}, and instant escrow pickup pass.`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatShop, setChatShop] = useState<ShopType>(MOCK_SHOPS[0]!);

  // Splash auto-advance
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('onboarding'), 2800);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Android Hardware Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (showHaggleModal) { setShowHaggleModal(false); return true; }
      if (showShopSheet) { setShowShopSheet(false); return true; }
      const backMap: Partial<Record<Screen, Screen>> = {
        'market-detail': 'markets',
        'shop-directory': 'market-detail',
        'shop-detail': 'shop-directory',
        'product-detail': 'shop-detail',
        map: 'markets',
        tour: 'market-detail',
        chat: 'shop-detail',
        orders: 'markets',
        notifications: 'markets',
        wishlist: 'markets',
        settings: 'markets',
      };
      if (backMap[currentScreen]) {
        setCurrentScreen(backMap[currentScreen]!);
        return true;
      }
      if (currentScreen !== 'markets' && currentScreen !== 'splash' && currentScreen !== 'onboarding') {
        setCurrentScreen('markets');
        return true;
      }
      return false;
    };
    const bh = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => bh.remove();
  }, [currentScreen, showHaggleModal, showShopSheet]);

  // 360 pan responder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      setYaw((prev) => (prev - gs.dx * 0.08 + 360) % 360);
    },
  });

  const handleSendHaggle = () => {
    const priceNum = parseInt(proposedPrice, 10) || 800000;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'customer', isOffer: true, price: priceNum, status: 'PENDING' },
      { id: (Date.now() + 1).toString(), sender: 'seller', text: `Offer of ${formatNGN(priceNum)} received! Looking at stock right now... We'll respond within ${selectedShop.responseTimeMinutes} minutes.` },
    ]);
    setShowHaggleModal(false);
    setCurrentScreen('chat');
  };

  const handleSharePickupPass = async () => {
    try {
      await Share.share({
        message: `MarketApp Escrow Pickup Pass\nOrder: ${MOCK_ORDERS[0]!.orderNumber}\nMarket: ${selectedMarket.name}\nStall: BLK-A-14\nCode: ${MOCK_ORDERS[0]!.pickupCode}\nAmount: ${formatNGN(MOCK_ORDERS[0]!.totalAmount)}\n\nDownload MarketApp to verify this pass.`,
      });
    } catch (_) { /* ignore */ }
  };

  // Filtered markets
  const filteredMarkets = MOCK_MARKETS.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.state.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.categories.some((c) => c.toLowerCase().includes(q));
    if (selectedState === 'All Nigeria') return matchesSearch;
    return matchesSearch && (m.state.toLowerCase().includes(selectedState.toLowerCase()) || m.city.toLowerCase().includes(selectedState.toLowerCase()));
  });

  // Filtered products for home deals
  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.brand?.toLowerCase().includes(q) ?? false);
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Electronics') return matchesSearch && ['iPhone', 'Samsung', 'MacBook', 'Anker'].some((k) => p.name.includes(k));
    if (selectedCategory === 'Fashion') return matchesSearch && ['Ankara', 'Fabric', 'Fashion', 'Lace'].some((k) => p.name.includes(k));
    if (selectedCategory === 'Phones') return matchesSearch && ['iPhone', 'Samsung', 'Phone'].some((k) => p.name.includes(k));
    if (selectedCategory === 'Textiles') return matchesSearch && ['Ankara', 'Fabric', 'Lace', 'Textile'].some((k) => p.name.includes(k));
    return matchesSearch;
  });

  // Shops for selected market
  const marketShops = MOCK_SHOPS.filter((s) => s.marketId === selectedMarket.id);
  // All shops if no market match — show all verified shops
  const displayShops = marketShops.length > 0 ? marketShops : MOCK_SHOPS;

  // Wishlist products
  const wishlistProducts = MOCK_PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Today's opening hours for selected market
  const getTodayHours = (market: MarketType) => {
    const days: (keyof typeof market.operatingHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = days[new Date().getDay()]!;
    const h = market.operatingHours[dayKey];
    return h ? `${h.open} – ${h.close}` : 'Closed Today';
  };

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0F1A" translucent={false} />

      {/* ─── App Header ─────────────────────────────────────────── */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              onPress={() => navigate('markets')}
            >
              <View style={styles.logoBadge}>
                <Text style={{ fontSize: 16 }}>🛍️</Text>
              </View>
              <Text style={styles.brandTitle}>
                Market<Text style={{ color: '#FF6B35' }}>App</Text>
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TouchableOpacity style={styles.cityBadge} onPress={() => navigate('map')}>
                <Text style={styles.cityBadgeText}>🇳🇬 Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconHeaderBtn, unreadCount > 0 && { borderColor: '#FF6B35' }]}
                onPress={() => navigate('notifications')}
              >
                <Text style={{ fontSize: 15 }}>🔔</Text>
                {unreadCount > 0 && (
                  <View style={styles.notifBadgeDot}>
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '900' }}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconHeaderBtn} onPress={() => navigate('wishlist')}>
                <Text style={{ fontSize: 15 }}>❤️</Text>
                {wishlist.length > 0 && (
                  <View style={styles.notifBadgeDot}>
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '900' }}>{wishlist.length}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconHeaderBtn} onPress={() => navigate('settings')}>
                <Text style={{ fontSize: 15 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ─── Screen Router ───────────────────────────────────────── */}
      <View style={{ flex: 1 }}>

        {/* ── Splash ─────────────────────────────────────────────── */}
        {currentScreen === 'splash' && (
          <View style={styles.splashContainer}>
            <View style={styles.splashLogoGlow}>
              <View style={styles.splashLogoCircle}>
                <Text style={{ fontSize: 58 }}>🛍️</Text>
              </View>
            </View>
            <Text style={styles.splashBrandTitle}>
              Market<Text style={{ color: '#FF6B35' }}>App</Text>
            </Text>
            <Text style={styles.splashTagline}>Walk Nigeria Markets in 360°</Text>
            <View style={styles.splashBadgeRow}>
              <View style={styles.splashBadge}>
                <Text style={[styles.splashBadgeText, { color: '#00D4AA' }]}>🛡️ Escrow Protected</Text>
              </View>
              <View style={styles.splashBadge}>
                <Text style={[styles.splashBadgeText, { color: '#F59E0B' }]}>🤝 Haggle Live</Text>
              </View>
              <View style={styles.splashBadge}>
                <Text style={[styles.splashBadgeText, { color: '#8B5CF6' }]}>🚚 Nationwide</Text>
              </View>
            </View>
            <View style={styles.splashFooter}>
              <ActivityIndicator color="#FF6B35" size="large" style={{ marginBottom: 14 }} />
              <TouchableOpacity style={styles.splashContinueBtn} onPress={() => navigate('onboarding')}>
                <Text style={styles.splashContinueBtnText}>Get Started →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Onboarding ─────────────────────────────────────────── */}
        {currentScreen === 'onboarding' && (
          <View style={styles.onboardingContainer}>
            <View style={styles.onboardingTopBar}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.logoBadge}><Text style={{ fontSize: 18 }}>🛍️</Text></View>
                <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>
                  Market<Text style={{ color: '#FF6B35' }}>App</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigate('markets')}>
                <Text style={{ color: '#9BA5C9', fontWeight: '700', fontSize: 14 }}>Skip →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.onboardingSlideContent}>
              <View style={[styles.onboardingIconCircle, { backgroundColor: ONBOARDING_SLIDES[onboardingIndex]!.color + '22' }]}>
                <Text style={{ fontSize: 64 }}>{ONBOARDING_SLIDES[onboardingIndex]!.icon}</Text>
              </View>
              <Text style={styles.onboardingTitle}>{ONBOARDING_SLIDES[onboardingIndex]!.title}</Text>
              <Text style={styles.onboardingSubtitle}>{ONBOARDING_SLIDES[onboardingIndex]!.subtitle}</Text>
              <View style={styles.dotRow}>
                {ONBOARDING_SLIDES.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setOnboardingIndex(i)}>
                    <View style={[styles.dot, i === onboardingIndex ? styles.dotActive : styles.dotInactive]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.onboardingBottomRow}>
              {onboardingIndex < ONBOARDING_SLIDES.length - 1 ? (
                <TouchableOpacity style={styles.onboardingNextBtn} onPress={() => setOnboardingIndex((p) => p + 1)}>
                  <Text style={styles.onboardingNextBtnText}>Next  →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.onboardingStartBtn} onPress={() => navigate('markets')}>
                  <Text style={styles.onboardingStartBtnText}>Explore Nigerian Markets 🚀</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── Markets Home ────────────────────────────────────────── */}
        {currentScreen === 'markets' && (
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero */}
            <View style={styles.heroBanner}>
              <Text style={styles.heroEyebrow}>⚡ NIGERIA'S #1 DIGITAL MARKET PLATFORM</Text>
              <Text style={styles.heroTitle}>Shop Every Market in Nigeria</Text>
              <Text style={styles.heroSub}>
                Explore {MOCK_MARKETS.length} markets across 6 geopolitical zones — virtual 360° tours, verified traders, and escrow-secured payments.
              </Text>
              <View style={styles.heroStatsRow}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNum}>{MOCK_MARKETS.reduce((a, m) => a + m.totalStalls, 0).toLocaleString()}</Text>
                  <Text style={styles.heroStatLabel}>Total Stalls</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNum}>{MOCK_MARKETS.length}</Text>
                  <Text style={styles.heroStatLabel}>Markets</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNum}>{MOCK_SHOPS.filter((s) => s.isVerified).length}</Text>
                  <Text style={styles.heroStatLabel}>Verified Shops</Text>
                </View>
              </View>
            </View>

            {/* Search */}
            <View style={styles.searchBarContainer}>
              <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search markets, cities, or goods (e.g. Kano, Ankara)..."
                placeholderTextColor="#5A647A"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={{ color: '#9BA5C9', fontWeight: '700', paddingHorizontal: 6 }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* State Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {(['All Nigeria', 'Lagos', 'Abuja', 'Kano', 'Anambra', 'Abia', 'Rivers'] as string[]).map((st) => {
                const active = selectedState === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                    onPress={() => setSelectedState(st)}
                  >
                    <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                      {st === 'All Nigeria' ? '🇳🇬 All Nigeria' : st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Markets List */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionHeading}>
                {filteredMarkets.length} Market{filteredMarkets.length !== 1 ? 's' : ''} Found
              </Text>
              <TouchableOpacity onPress={() => navigate('map')}>
                <Text style={{ color: '#00D4AA', fontSize: 12, fontWeight: '800' }}>🗺️ Map View</Text>
              </TouchableOpacity>
            </View>

            {filteredMarkets.map((market) => {
              const isOpen = isMarketOpen(market);
              return (
                <TouchableOpacity
                  key={market.id}
                  style={styles.marketCard}
                  activeOpacity={0.88}
                  onPress={() => {
                    setSelectedMarket(market);
                    navigate('market-detail');
                  }}
                >
                  <Image
                    source={{ uri: market.thumbnailUrl || 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800' }}
                    style={styles.marketImg}
                  />
                  <View style={styles.marketOverlay} />
                  <View style={styles.marketCardBody}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.marketName}>{market.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {market.hasNavigation && (
                          <View style={styles.tourBadge}>
                            <Text style={styles.tourBadgeText}>🧭 360°</Text>
                          </View>
                        )}
                        <View style={[styles.openBadge, { backgroundColor: isOpen ? 'rgba(0,212,170,0.2)' : 'rgba(255,107,53,0.15)' }]}>
                          <Text style={{ color: isOpen ? '#00D4AA' : '#FF6B35', fontWeight: '800', fontSize: 9 }}>
                            {isOpen ? '● OPEN' : '● CLOSED'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.marketDesc} numberOfLines={2}>{market.description}</Text>
                    <View style={styles.marketStatsRow}>
                      <Text style={styles.marketStatText}>📍 {market.city}, {market.state}</Text>
                      <Text style={styles.marketStatText}>🏪 {market.totalStalls.toLocaleString()} stalls</Text>
                      <Text style={styles.marketStatText}>✅ {market.verifiedStalls} verified</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                      {market.categories.slice(0, 3).map((cat) => (
                        <View key={cat} style={styles.marketCatChip}>
                          <Text style={styles.marketCatChipText}>{cat}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredMarkets.length === 0 && (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>No Markets Found</Text>
                <Text style={{ color: '#9BA5C9', marginTop: 6, textAlign: 'center' }}>
                  Try searching for a different state or market name.
                </Text>
              </View>
            )}

            {/* Featured Deals */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
              <Text style={styles.sectionHeading}>🔥 Nationwide Deals</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                {(['All', 'Electronics', 'Fashion', 'Phones', 'Textiles'] as string[]).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.miniChip, selectedCategory === cat && styles.miniChipActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.miniChipText, selectedCategory === cat && { color: 'white' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              {filteredProducts.map((prod) => (
                <TouchableOpacity
                  key={prod.id}
                  style={styles.productCard}
                  activeOpacity={0.88}
                  onPress={() => {
                    setSelectedProduct(prod);
                    const shop = MOCK_SHOPS.find((s) => s.id === prod.shopId) || MOCK_SHOPS[0]!;
                    setSelectedShop(shop);
                    navigate('product-detail');
                  }}
                >
                  <Image source={{ uri: prod.imageUrls[0] }} style={styles.productImg} />
                  {prod.pricingMode === 'NEGOTIABLE' && (
                    <View style={styles.negotiablePip}>
                      <Text style={{ color: '#F59E0B', fontSize: 8, fontWeight: '900' }}>NEGOTIABLE</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.wishlistIcon}
                    onPress={() => toggleWishlist(prod.id)}
                  >
                    <Text style={{ fontSize: 14 }}>{wishlist.includes(prod.id) ? '❤️' : '🤍'}</Text>
                  </TouchableOpacity>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                    <Text style={styles.productPrice}>{formatNGN(prod.price)}</Text>
                    <Text style={{ color: '#5A647A', fontSize: 10, marginTop: 2 }}>
                      {MOCK_SHOPS.find((s) => s.id === prod.shopId)?.name ?? 'Unknown Shop'}
                    </Text>
                    <View style={styles.haggleBadge}>
                      <Text style={styles.haggleBadgeText}>
                        {prod.pricingMode === 'NEGOTIABLE' ? '🤝 Make Offer' : '🏷️ Fixed Price'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        )}

        {/* ── Market Detail ───────────────────────────────────────── */}
        {currentScreen === 'market-detail' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backRow} onPress={() => navigate('markets')}>
              <Text style={styles.backText}>← Back to Markets</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: selectedMarket.thumbnailUrl || 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800' }}
              style={styles.marketDetailImg}
            />

            <View style={styles.marketDetailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.marketDetailTitle}>{selectedMarket.name}</Text>
                <Text style={{ color: '#9BA5C9', fontSize: 12, marginTop: 2 }}>
                  📍 {selectedMarket.city}, {selectedMarket.state}, {selectedMarket.country}
                </Text>
              </View>
              <View style={[styles.openBadgeLg, { backgroundColor: isMarketOpen(selectedMarket) ? 'rgba(0,212,170,0.2)' : 'rgba(255,107,53,0.15)' }]}>
                <Text style={{ color: isMarketOpen(selectedMarket) ? '#00D4AA' : '#FF6B35', fontWeight: '900', fontSize: 12 }}>
                  {isMarketOpen(selectedMarket) ? '● OPEN NOW' : '● CLOSED'}
                </Text>
              </View>
            </View>

            {/* Quick stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{selectedMarket.totalStalls.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Stalls</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNum, { color: '#00D4AA' }]}>{selectedMarket.verifiedStalls}</Text>
                <Text style={styles.statLabel}>Verified</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNum, { color: '#F59E0B' }]}>{selectedMarket.mappedStalls}</Text>
                <Text style={styles.statLabel}>Mapped</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>About This Market</Text>
              <Text style={{ color: '#9BA5C9', fontSize: 13, lineHeight: 20 }}>{selectedMarket.description}</Text>
            </View>

            {/* Categories */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>🏷️ What You'll Find Here</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {selectedMarket.categories.map((cat) => (
                  <View key={cat} style={styles.catPill}>
                    <Text style={styles.catPillText}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Opening Hours */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>🕐 Opening Hours</Text>
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                const h = selectedMarket.operatingHours[day];
                const isToday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()] === day;
                return (
                  <View key={day} style={[styles.hoursRow, isToday && styles.hoursRowToday]}>
                    <Text style={[styles.hoursDay, isToday && { color: '#FF6B35', fontWeight: '900' }]}>
                      {isToday ? '▶ ' : '   '}{day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <Text style={[styles.hoursTime, !h && { color: '#5A647A' }]}>
                      {h ? `${h.open} – ${h.close}` : 'Closed'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Entrances */}
            {selectedMarket.entrances.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>🚪 Entrances & Access Points</Text>
                {selectedMarket.entrances.map((ent) => (
                  <View key={ent.id} style={styles.entranceRow}>
                    <Text style={{ color: ent.isMain ? '#FF6B35' : 'white', fontWeight: '700', fontSize: 13 }}>
                      {ent.isMain ? '⭐ ' : '🚪 '}{ent.name}
                    </Text>
                    {ent.isMain && <View style={styles.mainEntranceBadge}><Text style={{ color: '#FF6B35', fontSize: 9, fontWeight: '800' }}>MAIN</Text></View>}
                  </View>
                ))}
              </View>
            )}

            {/* CTA Buttons */}
            <View style={{ gap: 10, marginTop: 8 }}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => {
                  setCurrentPanoIndex(0);
                  setYaw(45);
                  navigate('tour');
                }}
              >
                <Text style={styles.primaryActionBtnText}>🧭 Enter 360° Virtual Tour</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={[styles.secondaryActionBtn, { flex: 1 }]} onPress={() => navigate('shop-directory')}>
                  <Text style={styles.secondaryActionBtnText}>🏪 Browse Shops ({displayShops.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryActionBtn, { flex: 1 }]} onPress={() => navigate('map')}>
                  <Text style={styles.secondaryActionBtnText}>🗺️ View on Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* ── Shop Directory ──────────────────────────────────────── */}
        {currentScreen === 'shop-directory' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backRow} onPress={() => navigate('market-detail')}>
              <Text style={styles.backText}>← {selectedMarket.name}</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>🏪 Shop Directory</Text>
            <Text style={{ color: '#9BA5C9', fontSize: 12, marginBottom: 16 }}>
              {displayShops.length} verified traders at {selectedMarket.name}
            </Text>

            {displayShops.map((shop) => (
              <TouchableOpacity
                key={shop.id}
                style={styles.shopCard}
                activeOpacity={0.88}
                onPress={() => {
                  setSelectedShop(shop);
                  navigate('shop-detail');
                }}
              >
                {shop.photoUrls[0] ? (
                  <Image source={{ uri: shop.photoUrls[0] }} style={styles.shopCardImg} />
                ) : (
                  <View style={[styles.shopCardImg, { backgroundColor: '#1E2440', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 32 }}>🏪</Text>
                  </View>
                )}
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.shopCardName}>{shop.name}</Text>
                    {shop.isVerified && <Text style={{ fontSize: 12 }}>✅</Text>}
                  </View>
                  <Text style={{ color: '#9BA5C9', fontSize: 11, marginTop: 2 }} numberOfLines={2}>
                    {shop.description}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                    <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: '700' }}>★ {shop.rating}</Text>
                    <Text style={{ color: '#5A647A', fontSize: 11 }}>({shop.totalRatings} reviews)</Text>
                    <Text style={{ color: '#5A647A', fontSize: 11 }}>·</Text>
                    <Text style={{ color: shop.isCurrentlyOpen ? '#00D4AA' : '#FF6B35', fontSize: 11, fontWeight: '700' }}>
                      {shop.isCurrentlyOpen ? '● Open' : '● Closed'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                    {shop.verificationBadges.slice(0, 2).map((b) => (
                      <View key={b} style={styles.verifiedBadge}>
                        <Text style={{ color: '#00D4AA', fontSize: 8, fontWeight: '800' }}>{b.replace(/_/g, ' ')}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Shop Detail ─────────────────────────────────────────── */}
        {currentScreen === 'shop-detail' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backRow} onPress={() => navigate('shop-directory')}>
              <Text style={styles.backText}>← Shop Directory</Text>
            </TouchableOpacity>

            {selectedShop.photoUrls[0] && (
              <Image source={{ uri: selectedShop.photoUrls[0] }} style={styles.shopDetailImg} />
            )}

            <View style={styles.shopDetailHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.shopDetailName}>{selectedShop.name}</Text>
                  {selectedShop.isVerified && <Text>✅</Text>}
                </View>
                <Text style={{ color: '#9BA5C9', fontSize: 12, marginTop: 2 }}>
                  {selectedMarket.name} • Stall {MOCK_STALLS.find((st) => st.shopId === selectedShop.id)?.stallNumber ?? 'N/A'}
                </Text>
              </View>
              <View style={[styles.openBadgeLg, { backgroundColor: selectedShop.isCurrentlyOpen ? 'rgba(0,212,170,0.2)' : 'rgba(255,107,53,0.15)' }]}>
                <Text style={{ color: selectedShop.isCurrentlyOpen ? '#00D4AA' : '#FF6B35', fontWeight: '900', fontSize: 11 }}>
                  {selectedShop.isCurrentlyOpen ? '● OPEN' : '● CLOSED'}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={[styles.statNum, { color: '#F59E0B' }]}>★ {selectedShop.rating}</Text>
                <Text style={styles.statLabel}>{selectedShop.totalRatings} Reviews</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{selectedShop.totalTransactions}</Text>
                <Text style={styles.statLabel}>Sales</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNum, { color: '#00D4AA' }]}>{selectedShop.fulfillmentRatePercent}%</Text>
                <Text style={styles.statLabel}>Fulfilled</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{selectedShop.responseTimeMinutes}m</Text>
                <Text style={styles.statLabel}>Response</Text>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>About This Shop</Text>
              <Text style={{ color: '#9BA5C9', fontSize: 13, lineHeight: 20 }}>{selectedShop.description}</Text>
            </View>

            {/* Verification badges */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>✅ Verification Status</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {selectedShop.verificationBadges.map((b) => (
                  <View key={b} style={styles.catPill}>
                    <Text style={styles.catPillText}>✓ {b.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Products in this shop */}
            <Text style={[styles.sectionHeading, { marginBottom: 12 }]}>Products Available</Text>
            {MOCK_PRODUCTS.filter((p) => p.shopId === selectedShop.id).map((prod) => (
              <TouchableOpacity
                key={prod.id}
                style={styles.productListCard}
                onPress={() => {
                  setSelectedProduct(prod);
                  navigate('product-detail');
                }}
              >
                <Image source={{ uri: prod.imageUrls[0] }} style={styles.productListImg} />
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{prod.name}</Text>
                  <Text style={{ color: '#FF6B35', fontWeight: '900', fontSize: 16, marginTop: 2 }}>{formatNGN(prod.price)}</Text>
                  <Text style={{ color: '#9BA5C9', fontSize: 11, marginTop: 2 }}>
                    {prod.condition} • {prod.pricingMode === 'NEGOTIABLE' ? '🤝 Negotiable' : '🏷️ Fixed'} • {prod.inventoryStatus}
                  </Text>
                  {prod.warrantyInfo && (
                    <Text style={{ color: '#00D4AA', fontSize: 10, marginTop: 2 }}>🛡️ {prod.warrantyInfo}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                >
                  <Text style={{ fontSize: 18 }}>{wishlist.includes(prod.id) ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {MOCK_PRODUCTS.filter((p) => p.shopId === selectedShop.id).length === 0 && (
              <View style={{ alignItems: 'center', padding: 24 }}>
                <Text style={{ color: '#9BA5C9' }}>No products listed yet for this shop.</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.primaryActionBtn, { flex: 1 }]}
                onPress={() => {
                  setChatShop(selectedShop);
                  navigate('chat');
                }}
              >
                <Text style={styles.primaryActionBtnText}>💬 Chat with Trader</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryActionBtn, { flex: 1 }]}
                onPress={() => {
                  setCurrentPanoIndex(0);
                  setSelectedShopInTour(selectedShop);
                  navigate('tour');
                }}
              >
                <Text style={styles.secondaryActionBtnText}>🧭 Find in 360° Tour</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* ── Product Detail ──────────────────────────────────────── */}
        {currentScreen === 'product-detail' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backRow} onPress={() => navigate('shop-detail')}>
              <Text style={styles.backText}>← {selectedShop.name}</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, marginBottom: 16 }}>
              {selectedProduct.imageUrls.map((url, i) => (
                <Image key={i} source={{ uri: url }} style={styles.productDetailImg} />
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productDetailName}>{selectedProduct.name}</Text>
                {selectedProduct.brand && (
                  <Text style={{ color: '#9BA5C9', fontSize: 12, marginTop: 2 }}>Brand: {selectedProduct.brand}</Text>
                )}
              </View>
              <TouchableOpacity style={{ padding: 8 }} onPress={() => toggleWishlist(selectedProduct.id)}>
                <Text style={{ fontSize: 24 }}>{wishlist.includes(selectedProduct.id) ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 16 }}>
              <Text style={styles.productDetailPrice}>{formatNGN(selectedProduct.price)}</Text>
              <View style={[styles.catPill, { backgroundColor: selectedProduct.pricingMode === 'NEGOTIABLE' ? 'rgba(245,158,11,0.15)' : 'rgba(0,212,170,0.15)' }]}>
                <Text style={{ color: selectedProduct.pricingMode === 'NEGOTIABLE' ? '#F59E0B' : '#00D4AA', fontWeight: '800', fontSize: 10 }}>
                  {selectedProduct.pricingMode === 'NEGOTIABLE' ? '🤝 NEGOTIABLE' : '🏷️ FIXED PRICE'}
                </Text>
              </View>
            </View>

            {/* Product info */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>Product Details</Text>
              <View style={{ gap: 8, marginTop: 6 }}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Condition</Text>
                  <Text style={styles.detailValue}>{selectedProduct.condition}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Availability</Text>
                  <Text style={[styles.detailValue, { color: selectedProduct.inventoryStatus === 'IN_STOCK' ? '#00D4AA' : '#F59E0B' }]}>
                    {selectedProduct.inventoryStatus.replace(/_/g, ' ')}
                  </Text>
                </View>
                {selectedProduct.quantity && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>In Stock</Text>
                    <Text style={styles.detailValue}>{selectedProduct.quantity} {selectedProduct.unit}</Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Min. Order</Text>
                  <Text style={styles.detailValue}>{selectedProduct.minimumOrder} {selectedProduct.unit}</Text>
                </View>
                {selectedProduct.warrantyInfo && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Warranty</Text>
                    <Text style={[styles.detailValue, { color: '#00D4AA' }]}>🛡️ {selectedProduct.warrantyInfo}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>Description</Text>
              <Text style={{ color: '#9BA5C9', fontSize: 13, lineHeight: 20, marginTop: 6 }}>{selectedProduct.description}</Text>
            </View>

            {/* Fulfillment options */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>📦 Fulfillment Options</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                {selectedProduct.pickupAvailable && (
                  <TouchableOpacity
                    style={[styles.fulfillmentOption, fulfillmentChoice === 'pickup' && styles.fulfillmentOptionActive]}
                    onPress={() => setFulfillmentChoice('pickup')}
                  >
                    <Text style={{ fontSize: 22 }}>🏪</Text>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, marginTop: 4 }}>Market Pickup</Text>
                    <Text style={{ color: '#9BA5C9', fontSize: 10 }}>Visit stall yourself</Text>
                    <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '700' }}>Free</Text>
                  </TouchableOpacity>
                )}
                {selectedProduct.deliveryAvailable && (
                  <TouchableOpacity
                    style={[styles.fulfillmentOption, fulfillmentChoice === 'delivery' && styles.fulfillmentOptionActive]}
                    onPress={() => setFulfillmentChoice('delivery')}
                  >
                    <Text style={{ fontSize: 22 }}>🚚</Text>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, marginTop: 4 }}>Home Delivery</Text>
                    <Text style={{ color: '#9BA5C9', fontSize: 10 }}>Nationwide delivery</Text>
                    <Text style={{ color: '#F59E0B', fontSize: 10, fontWeight: '700' }}>+₦2,000–₦8,000</Text>
                  </TouchableOpacity>
                )}
              </View>
              {fulfillmentChoice === 'delivery' && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.settingsLabel}>Delivery Address</Text>
                  <TextInput
                    style={styles.settingsTextInput}
                    placeholder="Enter your full delivery address..."
                    placeholderTextColor="#5A647A"
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                    multiline
                  />
                </View>
              )}
            </View>

            {/* Tags */}
            {selectedProduct.tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {selectedProduct.tags.map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* CTA */}
            <View style={{ gap: 10 }}>
              {selectedProduct.pricingMode === 'NEGOTIABLE' && (
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={() => {
                    setProposedPrice(Math.round(selectedProduct.price * 0.9).toString());
                    setShowHaggleModal(true);
                  }}
                >
                  <Text style={styles.primaryActionBtnText}>🤝 Make an Offer / Haggle</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.secondaryActionBtn]}
                onPress={() => {
                  setChatShop(selectedShop);
                  navigate('chat');
                }}
              >
                <Text style={styles.secondaryActionBtnText}>💬 Chat with {selectedShop.name}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* ── Nigeria Map ─────────────────────────────────────────── */}
        {currentScreen === 'map' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <View style={styles.heroBanner}>
              <Text style={styles.heroEyebrow}>🗺️ NIGERIA MARKET MAP</Text>
              <Text style={styles.heroTitle}>Coverage Across 36 States & FCT</Text>
              <Text style={styles.heroSub}>
                Tap any market marker to view live 360° corridor tours, verified stall directories, and trader escrow status.
              </Text>
            </View>

            <View style={styles.nigeriaMapCard}>
              <View style={styles.mapHeaderRow}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>🇳🇬 Federal Republic of Nigeria</Text>
                <View style={styles.livePulse}>
                  <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '800' }}>● LIVE</Text>
                </View>
              </View>

              <View style={styles.mapCanvas}>
                {/* Geopolitical zone labels */}
                <View style={[styles.mapZoneTag, { top: 8, left: 10 }]}>
                  <Text style={styles.mapRegionText}>NORTH-WEST</Text>
                </View>
                <View style={[styles.mapZoneTag, { top: 8, right: 10 }]}>
                  <Text style={styles.mapRegionText}>NORTH-EAST</Text>
                </View>
                <View style={[styles.mapZoneTag, { top: '38%', left: '38%' }]}>
                  <Text style={styles.mapRegionText}>NORTH-CENTRAL</Text>
                </View>
                <View style={[styles.mapZoneTag, { bottom: '22%', left: 10 }]}>
                  <Text style={styles.mapRegionText}>SOUTH-WEST</Text>
                </View>
                <View style={[styles.mapZoneTag, { bottom: '10%', left: '45%' }]}>
                  <Text style={styles.mapRegionText}>SOUTH-EAST</Text>
                </View>
                <View style={[styles.mapZoneTag, { bottom: 8, right: 10 }]}>
                  <Text style={styles.mapRegionText}>SOUTH-SOUTH</Text>
                </View>

                {/* Market pins */}
                {[
                  { market: MOCK_MARKETS[5]!, top: '10%', left: '52%', icon: '🏜️' }, // Kano
                  { market: MOCK_MARKETS[3]!, top: '38%', left: '48%', icon: '🏛️' }, // Abuja
                  { market: MOCK_MARKETS[0]!, top: '70%', left: '14%', icon: '🛍️' }, // Balogun Lagos
                  { market: MOCK_MARKETS[1]!, top: '64%', left: '22%', icon: '💻' }, // Computer Village
                  { market: MOCK_MARKETS[4]!, top: '65%', left: '56%', icon: '📦' }, // Onitsha
                  { market: MOCK_MARKETS[6]!, top: '78%', left: '62%', icon: '👞' }, // Ariaria Aba
                  { market: MOCK_MARKETS[7]!, top: '83%', left: '47%', icon: '🌊' }, // Port Harcourt
                ].map(({ market, top, left, icon }) => (
                  <TouchableOpacity
                    key={market.id}
                    style={[styles.mapPin, { top: top as any, left: left as any }]}
                    onPress={() => {
                      setSelectedMarket(market);
                      navigate('market-detail');
                    }}
                  >
                    <Text style={styles.mapPinIcon}>{icon}</Text>
                    <View style={styles.mapPinCallout}>
                      <Text style={styles.mapPinName}>{market.name.split(' ').slice(0, 2).join(' ')}</Text>
                      <Text style={styles.mapPinCity}>{market.city}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ color: '#9BA5C9', fontSize: 11, textAlign: 'center', marginTop: 14 }}>
                Tap any market pin to view stall directory, 360° tour & verified traders
              </Text>
            </View>

            {/* Quick access list */}
            <Text style={[styles.sectionHeading, { marginTop: 20, marginBottom: 12 }]}>All Markets</Text>
            {MOCK_MARKETS.map((market) => (
              <TouchableOpacity
                key={market.id}
                style={styles.marketListRow}
                onPress={() => { setSelectedMarket(market); navigate('market-detail'); }}
              >
                <Text style={{ fontSize: 20, marginRight: 10 }}>
                  {market.hasNavigation ? '🧭' : '🏪'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>{market.name}</Text>
                  <Text style={{ color: '#9BA5C9', fontSize: 11 }}>{market.city}, {market.state} • {market.totalStalls.toLocaleString()} stalls</Text>
                </View>
                <Text style={{ color: '#FF6B35', fontWeight: '700' }}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── 360° Virtual Tour ───────────────────────────────────── */}
        {currentScreen === 'tour' && (
          <View style={{ flex: 1, backgroundColor: '#000' }} {...panResponder.panHandlers}>
            <Image
              source={{ uri: currentPano.publicImageUrl }}
              style={{ width: SCREEN_WIDTH * 2, height: '100%', position: 'absolute', left: -(yaw * 2.2) }}
              resizeMode="cover"
            />
            <View style={styles.vignette} />

            {/* Tour Header */}
            <View style={styles.tourHeader}>
              <TouchableOpacity style={styles.tourBackBtn} onPress={() => navigate('market-detail')}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>← Back</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.tourMarketName}>{selectedMarket.name}</Text>
                <Text style={styles.tourNodeText}>{selectedMarket.city}, {selectedMarket.state} • {currentPano.zoneId}</Text>
              </View>
              <View style={styles.compassBadge}>
                <Text style={styles.compassText}>🧭 {Math.round(yaw)}°</Text>
              </View>
            </View>

            {/* Panorama navigation */}
            {MOCK_PANORAMAS.length > 1 && (
              <View style={styles.panoNavRow}>
                {MOCK_PANORAMAS.map((pano, i) => (
                  <TouchableOpacity
                    key={pano.id}
                    style={[styles.panoNavBtn, i === currentPanoIndex && styles.panoNavBtnActive]}
                    onPress={() => { setCurrentPanoIndex(i); setYaw(pano.heading); }}
                  >
                    <Text style={{ color: i === currentPanoIndex ? '#FF6B35' : '#9BA5C9', fontSize: 9, fontWeight: '800' }}>
                      {i === 0 ? 'TECH ZONE' : 'TEXTILE ZONE'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Shop Hotspots */}
            {MOCK_SHOPS.filter((s) => {
              const stall = MOCK_STALLS.find((st) => st.shopId === s.id);
              return stall?.nearestPanoramaId === currentPano.id;
            }).map((shop, i) => (
              <TouchableOpacity
                key={shop.id}
                style={[styles.stallHotspot, {
                  top: SCREEN_HEIGHT * (0.35 + i * 0.12),
                  left: SCREEN_WIDTH * (0.2 + i * 0.2),
                }]}
                onPress={() => { setSelectedShopInTour(shop); setShowShopSheet(true); }}
              >
                <View style={styles.pulsePin}>
                  <Text style={{ fontSize: 14 }}>🏪</Text>
                </View>
                <View>
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 12 }}>{shop.name}</Text>
                  <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '700' }}>
                    {MOCK_STALLS.find((st) => st.shopId === shop.id)?.stallNumber ?? ''} • ★ {shop.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Pan controls */}
            <View style={styles.tourControlsRow}>
              <TouchableOpacity style={styles.tourPanBtn} onPress={() => setYaw((p) => (p - 25 + 360) % 360)}>
                <Text style={styles.tourPanBtnText}>◄ Left</Text>
              </TouchableOpacity>
              <View style={styles.dragHint}>
                <Text style={styles.dragHintText}>👆 Drag 360°</Text>
              </View>
              <TouchableOpacity style={styles.tourPanBtn} onPress={() => setYaw((p) => (p + 25) % 360)}>
                <Text style={styles.tourPanBtnText}>Right ►</Text>
              </TouchableOpacity>
            </View>

            {/* Shop Bottom Sheet */}
            {showShopSheet && (
              <View style={styles.shopSheet}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 22 }}>🏪</Text>
                    <View>
                      <Text style={{ color: 'white', fontWeight: '800', fontSize: 17 }}>{selectedShopInTour.name}</Text>
                      <Text style={{ color: '#00D4AA', fontSize: 11, fontWeight: '600' }}>
                        ✅ Verified • ★ {selectedShopInTour.rating} ({selectedShopInTour.totalRatings})
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowShopSheet(false)}>
                    <Text style={{ color: '#9BA5C9', fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: '#9BA5C9', fontSize: 12, marginVertical: 6, lineHeight: 18 }} numberOfLines={3}>
                  {selectedShopInTour.description}
                </Text>
                <Text style={{ color: '#5A647A', fontSize: 11, marginBottom: 10 }}>
                  📊 {selectedShopInTour.totalTransactions} transactions • ⚡ Responds in {selectedShopInTour.responseTimeMinutes} min • {selectedShopInTour.fulfillmentRatePercent}% fulfillment
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={[styles.haggleBtn, { flex: 1 }]}
                    onPress={() => {
                      setSelectedShop(selectedShopInTour);
                      setSelectedProduct(MOCK_PRODUCTS.find((p) => p.shopId === selectedShopInTour.id) || MOCK_PRODUCTS[0]!);
                      setShowShopSheet(false);
                      setShowHaggleModal(true);
                    }}
                  >
                    <Text style={styles.haggleBtnText}>🤝 Make Offer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chatShopBtn, { flex: 1 }]}
                    onPress={() => {
                      setChatShop(selectedShopInTour);
                      setShowShopSheet(false);
                      navigate('chat');
                    }}
                  >
                    <Text style={styles.chatShopBtnText}>💬 Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chatShopBtn, { paddingHorizontal: 14 }]}
                    onPress={() => {
                      setSelectedShop(selectedShopInTour);
                      setShowShopSheet(false);
                      navigate('shop-detail');
                    }}
                  >
                    <Text style={styles.chatShopBtnText}>🏪 View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── Chat & Negotiation ──────────────────────────────────── */}
        {currentScreen === 'chat' && (
          <View style={{ flex: 1, backgroundColor: '#0D0F1A' }}>
            <View style={styles.chatTopBar}>
              <TouchableOpacity onPress={() => navigate('shop-detail')}>
                <Text style={{ color: '#FF6B35', fontWeight: '700', fontSize: 14 }}>← Back</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>{chatShop.name}</Text>
                <Text style={{ color: chatShop.isCurrentlyOpen ? '#00D4AA' : '#FF6B35', fontSize: 11, fontWeight: '600' }}>
                  {chatShop.isCurrentlyOpen ? '● Active Now' : '● Currently Closed'} at {selectedMarket.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigate('orders')}>
                <Text style={{ color: '#00D4AA', fontWeight: '700', fontSize: 12 }}>🎟️ Pass</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 20 }}>
              {chatMessages.map((msg) => {
                if ((msg as any).isOffer) {
                  const m = msg as any;
                  return (
                    <View key={msg.id} style={styles.offerBubble}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#F59E0B', fontWeight: '800', fontSize: 11 }}>🤝 NEGOTIATED OFFER</Text>
                        <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '700' }}>ESCROW READY</Text>
                      </View>
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, marginTop: 6 }}>
                        {selectedProduct.name}
                      </Text>
                      <Text style={{ color: '#FF6B35', fontWeight: '900', fontSize: 24, marginVertical: 4 }}>
                        {formatNGN(m.price || selectedProduct.price)}
                      </Text>
                      {selectedProduct.warrantyInfo && (
                        <Text style={{ color: '#9BA5C9', fontSize: 11, marginBottom: 10 }}>
                          🛡️ Includes {selectedProduct.warrantyInfo}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.acceptCounterBtn}
                        onPress={() => {
                          Alert.alert(
                            'Payment Successful!',
                            `${formatNGN(m.price || selectedProduct.price)} held safely in Escrow.\n\nYour Stall Pickup Pass is generated!`,
                            [{ text: 'View Pickup Pass 🎟️', onPress: () => navigate('orders') }]
                          );
                        }}
                      >
                        <Text style={styles.acceptCounterBtnText}>⚡ Accept & Pay Escrow ({formatNGN(m.price || selectedProduct.price)})</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
                const isMe = msg.sender === 'customer';
                return (
                  <View key={msg.id} style={[styles.chatBubble, isMe ? styles.chatBubbleMe : styles.chatBubbleOther]}>
                    <Text style={{ color: 'white', fontSize: 14, lineHeight: 20 }}>{(msg as any).text}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                      {isMe ? 'You' : chatShop.name}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <View style={{ paddingHorizontal: 12, paddingBottom: 4 }}>
              <TouchableOpacity
                style={styles.haggleSuggestBtn}
                onPress={() => {
                  setProposedPrice(Math.round(selectedProduct.price * 0.85).toString());
                  setShowHaggleModal(true);
                }}
              >
                <Text style={{ color: '#F59E0B', fontWeight: '700', fontSize: 12 }}>
                  🤝 Send Counter-Offer (tap to adjust price)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type a message..."
                placeholderTextColor="#5A647A"
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity
                style={styles.chatSendBtn}
                onPress={() => {
                  if (chatInput.trim()) {
                    setChatMessages((prev) => [
                      ...prev,
                      { id: Date.now().toString(), sender: 'customer', text: chatInput },
                    ]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        { id: (Date.now() + 1).toString(), sender: 'seller', text: `Thank you for your message! We'll get back to you within ${chatShop.responseTimeMinutes} minutes.` },
                      ]);
                    }, 1500);
                  }
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Orders & Escrow Pickup Pass ─────────────────────────── */}
        {currentScreen === 'orders' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>🎟️ Orders & Pickup Passes</Text>
            <Text style={{ color: '#9BA5C9', fontSize: 12, marginBottom: 16 }}>
              Your active escrow orders and pickup codes
            </Text>

            {MOCK_ORDERS.map((order) => {
              const shop = MOCK_SHOPS.find((s) => s.id === order.shopId);
              const market = MOCK_MARKETS.find((m) => m.id === (shop?.marketId ?? ''));
              return (
                <View key={order.id} style={styles.orderCard}>
                  {/* Order Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={styles.qrBadge}>
                      <Text style={styles.qrBadgeText}>🛡️ ESCROW PICKUP PASS</Text>
                    </View>
                    <View style={[styles.orderStatusBadge, {
                      backgroundColor: order.status === 'PAID' ? 'rgba(0,212,170,0.15)' : 'rgba(245,158,11,0.15)'
                    }]}>
                      <Text style={{ color: order.status === 'PAID' ? '#00D4AA' : '#F59E0B', fontWeight: '900', fontSize: 10 }}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.qrTitle}>Show Code at {market?.name ?? 'Market'}</Text>
                  <Text style={styles.qrSub}>
                    {market?.city ?? ''}, {market?.state ?? ''} • {shop?.name ?? ''}
                  </Text>

                  {/* QR Code */}
                  <View style={styles.qrBox}>
                    <View style={styles.qrGrid}>
                      {[
                        1,1,1,1,0,1,1,1,1,
                        1,0,0,1,0,1,0,0,1,
                        1,0,0,1,1,1,0,0,1,
                        1,1,1,1,0,1,1,1,1,
                        0,0,1,0,1,0,1,0,0,
                        1,0,1,1,0,1,1,0,1,
                        1,1,1,0,1,0,1,1,1,
                        1,0,0,1,1,1,0,0,1,
                        1,1,1,1,0,1,1,1,1,
                      ].map((c, i) => (
                        <View key={i} style={[styles.qrCell, { backgroundColor: c ? '#0D0F1A' : '#FFFFFF' }]} />
                      ))}
                    </View>
                  </View>

                  <Text style={styles.qrSecretCode}>{order.pickupCode}</Text>
                  <Text style={styles.qrHint}>
                    Funds held in secure Escrow until trader scans or verifies this code at stall pickup.
                  </Text>

                  {/* Order breakdown */}
                  <View style={styles.orderBreakdown}>
                    <View style={styles.orderBreakdownRow}>
                      <Text style={styles.orderBreakdownLabel}>Order Number</Text>
                      <Text style={styles.orderBreakdownValue}>{order.orderNumber}</Text>
                    </View>
                    <View style={styles.orderBreakdownRow}>
                      <Text style={styles.orderBreakdownLabel}>Item</Text>
                      <Text style={[styles.orderBreakdownValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                        {order.productSnapshot.name}
                      </Text>
                    </View>
                    <View style={styles.orderBreakdownRow}>
                      <Text style={styles.orderBreakdownLabel}>Unit Price</Text>
                      <Text style={styles.orderBreakdownValue}>{formatNGN(order.unitPrice)}</Text>
                    </View>
                    {order.negotiatedDiscount > 0 && (
                      <View style={styles.orderBreakdownRow}>
                        <Text style={styles.orderBreakdownLabel}>Negotiated Discount</Text>
                        <Text style={[styles.orderBreakdownValue, { color: '#00D4AA' }]}>-{formatNGN(order.negotiatedDiscount)}</Text>
                      </View>
                    )}
                    <View style={styles.orderBreakdownRow}>
                      <Text style={styles.orderBreakdownLabel}>Platform Fee</Text>
                      <Text style={styles.orderBreakdownValue}>{formatNGN(order.platformFee)}</Text>
                    </View>
                    <View style={[styles.orderBreakdownRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 4 }]}>
                      <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>Total Paid (Escrow)</Text>
                      <Text style={{ color: '#FF6B35', fontWeight: '900', fontSize: 16 }}>{formatNGN(order.totalAmount)}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity style={[styles.directionsBtn, { flex: 1 }]} onPress={() => navigate('tour')}>
                      <Text style={styles.directionsBtnText}>🧭 360° Walk to Stall</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.shareBtn, { flex: 1 }]} onPress={handleSharePickupPass}>
                      <Text style={styles.shareBtnText}>📤 Share Pass</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={{ alignItems: 'center', marginTop: 12, padding: 16 }}>
              <Text style={{ color: '#5A647A', fontSize: 11, textAlign: 'center' }}>
                All payments are held in Escrow until you inspect the item at the market stall.
                {'\n'}Your money is always protected. 🛡️
              </Text>
            </View>
          </ScrollView>
        )}

        {/* ── Notifications ───────────────────────────────────────── */}
        {currentScreen === 'notifications' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.pageTitle}>🔔 Notifications</Text>
              <TouchableOpacity onPress={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>
                <Text style={{ color: '#00D4AA', fontWeight: '700', fontSize: 12 }}>Mark All Read</Text>
              </TouchableOpacity>
            </View>

            {notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                onPress={() => {
                  setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
                  navigate(notif.screen);
                }}
              >
                <View style={styles.notifIconCircle}>
                  <Text style={{ fontSize: 20 }}>{notif.icon}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.notifTitle, !notif.read && { color: 'white' }]}>{notif.title}</Text>
                    {!notif.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {notifications.every((n) => n.read) && (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>✅</Text>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>All Caught Up!</Text>
                <Text style={{ color: '#9BA5C9', marginTop: 6 }}>No new notifications.</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* ── Wishlist ────────────────────────────────────────────── */}
        {currentScreen === 'wishlist' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>❤️ My Wishlist</Text>
            <Text style={{ color: '#9BA5C9', fontSize: 12, marginBottom: 16 }}>
              {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
            </Text>

            {wishlistProducts.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🤍</Text>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>No Saved Items Yet</Text>
                <Text style={{ color: '#9BA5C9', marginTop: 6, textAlign: 'center' }}>
                  Tap the heart icon on any product to save it to your wishlist.
                </Text>
                <TouchableOpacity style={[styles.primaryActionBtn, { marginTop: 20 }]} onPress={() => navigate('markets')}>
                  <Text style={styles.primaryActionBtnText}>Browse Markets</Text>
                </TouchableOpacity>
              </View>
            ) : (
              wishlistProducts.map((prod) => {
                const shop = MOCK_SHOPS.find((s) => s.id === prod.shopId);
                return (
                  <TouchableOpacity
                    key={prod.id}
                    style={styles.productListCard}
                    onPress={() => {
                      setSelectedProduct(prod);
                      setSelectedShop(shop || MOCK_SHOPS[0]!);
                      navigate('product-detail');
                    }}
                  >
                    <Image source={{ uri: prod.imageUrls[0] }} style={styles.productListImg} />
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{prod.name}</Text>
                      <Text style={{ color: '#FF6B35', fontWeight: '900', fontSize: 16, marginTop: 2 }}>{formatNGN(prod.price)}</Text>
                      <Text style={{ color: '#9BA5C9', fontSize: 11, marginTop: 2 }}>
                        {shop?.name ?? 'Unknown Shop'} • {prod.pricingMode === 'NEGOTIABLE' ? '🤝 Negotiable' : '🏷️ Fixed'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ padding: 8 }}
                      onPress={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                    >
                      <Text style={{ fontSize: 20 }}>❤️</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}

        {/* ── Settings ────────────────────────────────────────────── */}
        {currentScreen === 'settings' && (
          <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>⚙️ Settings & Account</Text>

            {/* Profile */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>👤 Account Profile</Text>
              <View style={styles.profileAvatarRow}>
                <View style={styles.profileAvatar}>
                  <Text style={{ fontSize: 32 }}>👤</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>{userName}</Text>
                  <Text style={{ color: '#9BA5C9', fontSize: 12 }}>{userEmail}</Text>
                  <View style={styles.accountBadge}>
                    <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '800' }}>✅ VERIFIED CUSTOMER</Text>
                  </View>
                </View>
              </View>

              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Full Name</Text>
                <TextInput
                  style={styles.settingsTextInput}
                  value={userName}
                  onChangeText={setUserName}
                  placeholderTextColor="#5A647A"
                />
              </View>
              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Phone (OTP Verified)</Text>
                <TextInput
                  style={styles.settingsTextInput}
                  value={userPhone}
                  onChangeText={setUserPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#5A647A"
                />
              </View>
              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Email Address</Text>
                <TextInput
                  style={styles.settingsTextInput}
                  value={userEmail}
                  onChangeText={setUserEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#5A647A"
                />
              </View>
              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Default Market Region</Text>
                <TouchableOpacity
                  style={styles.regionSelectBox}
                  onPress={() => Alert.alert('Change Region', 'Select your preferred Nigerian market region', [
                    { text: 'Lagos (South-West)', onPress: () => setPreferredState('Lagos State (South-West)') },
                    { text: 'Abuja (FCT)', onPress: () => setPreferredState('Abuja FCT (North-Central)') },
                    { text: 'Onitsha (South-East)', onPress: () => setPreferredState('Anambra (South-East)') },
                    { text: 'Kano (North-West)', onPress: () => setPreferredState('Kano State (North-West)') },
                    { text: 'Cancel', style: 'cancel' },
                  ])}
                >
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{preferredState}</Text>
                  <Text style={{ color: '#00D4AA', fontWeight: '800' }}>Change ›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Security & Payments */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>🛡️ Security & Payments</Text>

              {[
                { label: 'Escrow PIN Protection', sub: 'Require PIN when releasing pickup code', value: escrowPinEnabled, setter: setEscrowPinEnabled, color: '#00D4AA' },
                { label: 'Biometric Authentication', sub: 'Use fingerprint or face ID to login', value: biometricEnabled, setter: setBiometricEnabled, color: '#8B5CF6' },
                { label: 'Push Notifications', sub: 'Receive real-time trader counter-offers', value: pushNotifications, setter: setPushNotifications, color: '#FF6B35' },
                { label: 'Dark Mode', sub: 'Optimized contrast for OLED screens', value: darkMode, setter: setDarkMode, color: '#FF6B35' },
              ].map(({ label, sub, value, setter, color }) => (
                <View key={label} style={styles.settingsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsRowTitle}>{label}</Text>
                    <Text style={styles.settingsRowSub}>{sub}</Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={setter}
                    trackColor={{ false: '#1E2440', true: color }}
                    thumbColor="white"
                  />
                </View>
              ))}
            </View>

            {/* App Info */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>📱 App Info & Help</Text>

              {[
                { icon: '🛍️', label: 'Replay Onboarding Tour', action: () => { setOnboardingIndex(0); navigate('onboarding'); } },
                { icon: '💬', label: 'Contact Escrow Support', action: () => Alert.alert('MarketApp Support', 'Lagos HQ Support\nPhone: +234 1 800 MARKET\nEmail: support@marketapp.ng\nMonday – Friday: 8am – 6pm WAT') },
                { icon: '📜', label: 'Terms of Service & Privacy Policy', action: () => Alert.alert('Legal', 'Visit marketapp.ng/legal for full terms and privacy policy.') },
                { icon: '⭐', label: 'Rate MarketApp on Google Play', action: () => Alert.alert('Thank You!', 'We appreciate your support! Please leave us a 5-star review.') },
              ].map(({ icon, label, action }) => (
                <TouchableOpacity key={label} style={styles.settingsActionBtn} onPress={action}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{icon} {label}</Text>
                  <Text style={{ color: '#FF6B35', fontWeight: '800' }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ alignItems: 'center', marginTop: 12, paddingBottom: 10 }}>
              <Text style={{ color: '#5A647A', fontSize: 11 }}>MarketApp Android v1.0.0 (Build 100)</Text>
              <Text style={{ color: '#5A647A', fontSize: 10, marginTop: 2 }}>Made with ❤️ for Nigeria 🇳🇬</Text>
              <Text style={{ color: '#5A647A', fontSize: 10, marginTop: 2 }}>© 2024 MarketApp Technologies Ltd, Lagos</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ─── Bottom Tab Bar ──────────────────────────────────────── */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
        <View style={styles.bottomTabBar}>
          {[
            { key: 'markets', label: 'Markets', icon: '🏪' },
            { key: 'map', label: 'Map', icon: '🗺️' },
            { key: 'tour', label: '360° Tour', icon: '🧭' },
            { key: 'orders', label: 'My Orders', icon: '🎟️' },
            { key: 'settings', label: 'Account', icon: '👤' },
          ].map((tab) => {
            const active = currentScreen === tab.key ||
              (tab.key === 'markets' && ['market-detail', 'shop-directory', 'shop-detail', 'product-detail'].includes(currentScreen)) ||
              (tab.key === 'tour' && currentScreen === 'chat') ||
              (tab.key === 'orders' && ['notifications', 'wishlist'].includes(currentScreen));
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabItem}
                onPress={() => navigate(tab.key as Screen)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, { color: active ? '#FF6B35' : '#9BA5C9' }]}>
                  {tab.label}
                </Text>
                {active && <View style={styles.tabActiveIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ─── Haggle / Make Offer Modal ───────────────────────────── */}
      <Modal visible={showHaggleModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.modalTitle}>🤝 Make an Offer</Text>
              <TouchableOpacity onPress={() => setShowHaggleModal(false)}>
                <Text style={{ color: '#9BA5C9', fontSize: 18, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#1E2440', borderRadius: 10, padding: 12, marginTop: 12 }}>
              <Text style={{ color: '#9BA5C9', fontSize: 11, fontWeight: '700' }}>ITEM</Text>
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 14, marginTop: 2 }}>{selectedProduct.name}</Text>
              <Text style={{ color: '#00D4AA', fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                Listed: {formatNGN(selectedProduct.price)}
              </Text>
            </View>

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Your Counter-Offer (NGN)</Text>
            <TextInput
              style={styles.haggleInput}
              keyboardType="numeric"
              value={proposedPrice}
              onChangeText={setProposedPrice}
            />
            <Text style={{ color: '#5A647A', fontSize: 10, marginTop: 4 }}>
              That's {formatNGN(parseInt(proposedPrice, 10) || 0)} — {Math.round((1 - (parseInt(proposedPrice, 10) || 0) / selectedProduct.price) * 100)}% off listed price
            </Text>

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Fulfillment Method</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                style={[styles.fulfillmentMini, fulfillmentChoice === 'pickup' && styles.fulfillmentMiniActive]}
                onPress={() => setFulfillmentChoice('pickup')}
              >
                <Text style={{ color: fulfillmentChoice === 'pickup' ? '#FF6B35' : '#9BA5C9', fontWeight: '700', fontSize: 12 }}>
                  🏪 Market Pickup
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fulfillmentMini, fulfillmentChoice === 'delivery' && styles.fulfillmentMiniActive]}
                onPress={() => setFulfillmentChoice('delivery')}
              >
                <Text style={{ color: fulfillmentChoice === 'delivery' ? '#FF6B35' : '#9BA5C9', fontWeight: '700', fontSize: 12 }}>
                  🚚 Home Delivery
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitOfferBtn} onPress={handleSendHaggle}>
              <Text style={styles.submitOfferBtnText}>Send Offer to Trader →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowHaggleModal(false)}>
              <Text style={{ color: '#9BA5C9', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Splash
  splashContainer: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashLogoGlow: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,107,53,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,107,53,0.4)',
    marginBottom: 20,
  },
  splashLogoCircle: {
    width: 105,
    height: 105,
    borderRadius: 52,
    backgroundColor: '#141726',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B35',
  },
  splashBrandTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  splashTagline: {
    color: '#9BA5C9',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 20,
  },
  splashBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  splashBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  splashBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  splashFooter: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    left: 24,
    right: 24,
  },
  splashContinueBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  splashContinueBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },

  // Onboarding
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    padding: 24,
    justifyContent: 'space-between',
  },
  onboardingTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onboardingSlideContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  onboardingIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  onboardingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  onboardingSubtitle: {
    color: '#9BA5C9',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: '#FF6B35',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#1E2440',
  },
  onboardingBottomRow: {
    marginBottom: 20,
  },
  onboardingNextBtn: {
    backgroundColor: '#1E2440',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  onboardingNextBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
  onboardingStartBtn: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  onboardingStartBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },

  // Header
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#141726',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  logoBadge: {
    backgroundColor: 'rgba(255,107,53,0.15)',
    padding: 6,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 0.5,
  },
  cityBadge: {
    backgroundColor: 'rgba(0,212,170,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.3)',
  },
  cityBadgeText: {
    color: '#00D4AA',
    fontSize: 11,
    fontWeight: '800',
  },
  iconHeaderBtn: {
    backgroundColor: '#1E2440',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  notifBadgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  contentScroll: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },

  // Hero Banner
  heroBanner: {
    backgroundColor: '#141726',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroEyebrow: {
    color: '#FF6B35',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4,
  },
  heroSub: {
    color: '#9BA5C9',
    fontSize: 12,
    lineHeight: 18,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 10,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatNum: {
    color: '#FF6B35',
    fontWeight: '900',
    fontSize: 18,
  },
  heroStatLabel: {
    color: '#9BA5C9',
    fontSize: 10,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Search
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141726',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    padding: 0,
  },

  // Category filters
  categoryScroll: {
    marginBottom: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryChip: {
    backgroundColor: '#141726',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryChipText: {
    color: '#9BA5C9',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    backgroundColor: '#1E2440',
  },
  miniChipActive: {
    backgroundColor: '#FF6B35',
  },
  miniChipText: {
    color: '#9BA5C9',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeading: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },

  // Market Card
  marketCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#141726',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  marketImg: {
    width: '100%',
    height: 155,
  },
  marketOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(13,15,26,0.25)',
  },
  marketCardBody: {
    padding: 14,
  },
  marketName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
  tourBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tourBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  openBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadgeLg: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  marketDesc: {
    color: '#9BA5C9',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  marketStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  marketStatText: {
    color: '#5A647A',
    fontSize: 11,
    fontWeight: '600',
  },
  marketCatChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  marketCatChipText: {
    color: '#9BA5C9',
    fontSize: 9,
    fontWeight: '700',
  },

  // Market detail
  marketDetailImg: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 14,
  },
  marketDetailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  marketDetailTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#141726',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statNum: {
    color: '#FF6B35',
    fontWeight: '900',
    fontSize: 18,
  },
  statLabel: {
    color: '#9BA5C9',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },

  // Section card
  sectionCard: {
    backgroundColor: '#141726',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionCardTitle: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 6,
  },

  // Category pills
  catPill: {
    backgroundColor: 'rgba(255,107,53,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.25)',
  },
  catPillText: {
    color: '#FF6B35',
    fontSize: 11,
    fontWeight: '700',
  },

  // Opening hours
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  hoursRowToday: {
    backgroundColor: 'rgba(255,107,53,0.06)',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  hoursDay: {
    color: '#9BA5C9',
    fontSize: 13,
    fontWeight: '600',
  },
  hoursTime: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },

  // Entrances
  entranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  mainEntranceBadge: {
    backgroundColor: 'rgba(255,107,53,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  // Buttons
  primaryActionBtn: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryActionBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 15,
  },
  secondaryActionBtn: {
    backgroundColor: '#1E2440',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryActionBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  backRow: {
    marginBottom: 12,
  },
  backText: {
    color: '#FF6B35',
    fontWeight: '700',
    fontSize: 14,
  },

  // Shop card
  shopCard: {
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
  },
  shopCardImg: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  shopCardName: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(0,212,170,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.25)',
  },

  // Shop detail
  shopDetailImg: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 14,
  },
  shopDetailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shopDetailName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },

  // Product list card
  productListCard: {
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
  },
  productListImg: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },

  // Product detail
  productDetailImg: {
    width: SCREEN_WIDTH - 32,
    height: 240,
    borderRadius: 16,
    marginRight: 10,
    marginLeft: 16,
  },
  productDetailName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  productDetailPrice: {
    color: '#FF6B35',
    fontWeight: '900',
    fontSize: 24,
  },

  // Detail row
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#9BA5C9',
    fontSize: 12,
  },
  detailValue: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },

  // Fulfillment option
  fulfillmentOption: {
    flex: 1,
    backgroundColor: '#1E2440',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  fulfillmentOptionActive: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  fulfillmentMini: {
    flex: 1,
    backgroundColor: '#1E2440',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  fulfillmentMiniActive: {
    borderColor: '#FF6B35',
  },

  // Tags
  tagChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagChipText: {
    color: '#9BA5C9',
    fontSize: 11,
  },

  // Product card (horizontal scroll)
  productCard: {
    width: 158,
    backgroundColor: '#141726',
    borderRadius: 14,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: 120,
  },
  negotiablePip: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(245,158,11,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(13,15,26,0.7)',
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  productPrice: {
    color: '#FF6B35',
    fontWeight: '900',
    fontSize: 14,
    marginTop: 2,
  },
  haggleBadge: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
  },
  haggleBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },

  // Map
  nigeriaMapCard: {
    backgroundColor: '#141726',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  livePulse: {
    backgroundColor: 'rgba(0,212,170,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mapCanvas: {
    width: '100%',
    height: 400,
    backgroundColor: '#0D0F1A',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  mapZoneTag: {
    position: 'absolute',
  },
  mapRegionText: {
    color: '#2A3050',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mapPin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(20,23,38,0.96)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
  },
  mapPinIcon: { fontSize: 13 },
  mapPinCallout: {},
  mapPinName: {
    color: 'white',
    fontWeight: '800',
    fontSize: 10,
  },
  mapPinCity: {
    color: '#00D4AA',
    fontSize: 8,
    fontWeight: '700',
  },
  marketListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141726',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  // Tour
  vignette: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  tourHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tourBackBtn: {
    backgroundColor: 'rgba(13,15,26,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tourMarketName: {
    color: 'white',
    fontWeight: '900',
    fontSize: 15,
    textAlign: 'center',
  },
  tourNodeText: {
    color: '#9BA5C9',
    fontSize: 10,
    textAlign: 'center',
  },
  compassBadge: {
    backgroundColor: 'rgba(255,107,53,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  compassText: {
    color: '#FF6B35',
    fontWeight: '800',
    fontSize: 11,
  },
  panoNavRow: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  panoNavBtn: {
    backgroundColor: 'rgba(13,15,26,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  panoNavBtnActive: {
    borderColor: '#FF6B35',
  },
  stallHotspot: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(13,15,26,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#00D4AA',
  },
  pulsePin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,212,170,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourControlsRow: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tourPanBtn: {
    backgroundColor: 'rgba(20,23,38,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tourPanBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  dragHint: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dragHintText: {
    color: '#9BA5C9',
    fontSize: 11,
  },
  shopSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#141726',
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Chat
  chatTopBar: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#141726',
  },
  chatBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  chatBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
  },
  chatBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#141726',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  offerBubble: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#141726',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  acceptCounterBtn: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  acceptCounterBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 13,
  },
  haggleSuggestBtn: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
    marginBottom: 8,
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#141726',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#1E2440',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: 'white',
    fontSize: 13,
  },
  chatSendBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },

  // Orders
  orderCard: {
    backgroundColor: '#141726',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  orderBreakdown: {
    width: '100%',
    backgroundColor: '#1E2440',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 6,
  },
  orderBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderBreakdownLabel: {
    color: '#9BA5C9',
    fontSize: 12,
  },
  orderBreakdownValue: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },

  // QR
  qrCard: {
    backgroundColor: '#141726',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  qrBadge: {
    backgroundColor: 'rgba(0,212,170,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.3)',
  },
  qrBadgeText: {
    color: '#00D4AA',
    fontSize: 10,
    fontWeight: '800',
  },
  qrTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  qrSub: {
    color: '#9BA5C9',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrBox: {
    width: 170,
    height: 170,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    width: 144,
    height: 144,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    width: 16,
    height: 16,
  },
  qrSecretCode: {
    color: '#FF6B35',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 10,
  },
  qrHint: {
    color: '#5A647A',
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 240,
    marginBottom: 12,
  },
  directionsBtn: {
    backgroundColor: '#1E2440',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  directionsBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  shareBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },

  // Notifications
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  notifCardUnread: {
    borderColor: 'rgba(255,107,53,0.3)',
    backgroundColor: 'rgba(255,107,53,0.05)',
  },
  notifIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E2440',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    color: '#9BA5C9',
    fontWeight: '800',
    fontSize: 13,
    flex: 1,
  },
  notifBody: {
    color: '#9BA5C9',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  notifTime: {
    color: '#5A647A',
    fontSize: 10,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginLeft: 6,
  },

  // Settings
  settingsSection: {
    backgroundColor: '#141726',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  settingsSectionTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
  },
  profileAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1E2440',
    borderRadius: 12,
    padding: 12,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  accountBadge: {
    backgroundColor: 'rgba(0,212,170,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  settingsInputGroup: {
    marginBottom: 12,
  },
  settingsLabel: {
    color: '#9BA5C9',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  settingsTextInput: {
    backgroundColor: '#1E2440',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  regionSelectBox: {
    backgroundColor: '#1E2440',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  settingsRowTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  settingsRowSub: {
    color: '#9BA5C9',
    fontSize: 11,
    marginTop: 2,
  },
  settingsActionBtn: {
    backgroundColor: '#1E2440',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Bottom Tab Bar
  bottomTabBar: {
    height: 62,
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 2,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },

  // Shop btns
  haggleBtn: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  haggleBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 13,
  },
  chatShopBtn: {
    backgroundColor: '#1E2440',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chatShopBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#141726',
    padding: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
  },
  inputLabel: {
    color: '#9BA5C9',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  haggleInput: {
    backgroundColor: '#1E2440',
    color: '#FF6B35',
    fontSize: 26,
    fontWeight: '900',
    padding: 14,
    borderRadius: 12,
  },
  submitOfferBtn: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitOfferBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 15,
  },
  cancelBtn: {
    padding: 12,
    marginTop: 6,
  },
});
