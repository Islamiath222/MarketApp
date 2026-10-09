import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import {
  MOCK_MARKETS,
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_PANORAMAS,
  MOCK_ORDERS,
  formatNGN,
} from '@marketapp/api-client';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Screen = 'splash' | 'onboarding' | 'markets' | 'map' | 'tour' | 'chat' | 'orders' | 'settings';
type Category = 'All' | 'Electronics' | 'Textiles' | 'Spices' | 'Mobile';

type MarketType = typeof MOCK_MARKETS[0];
type ProductType = typeof MOCK_PRODUCTS[0];
type ShopType = typeof MOCK_SHOPS[0];

const ONBOARDING_SLIDES = [
  {
    id: '1',
    icon: '🧭',
    title: '360° Virtual Market Walks',
    subtitle: 'Step into Balogun, Wuse, Onitsha, Kano, and Aba markets right from your phone with interactive street view panoramas.',
    color: '#FF6B35',
  },
  {
    id: '2',
    icon: '🤝',
    title: 'Real-Time Trader Haggling',
    subtitle: 'Chat directly with verified market stall traders, make counter-offers, and negotiate the best price in real-time.',
    color: '#F59E0B',
  },
  {
    id: '3',
    icon: '🛡️',
    title: 'Escrow Security & QR Pass',
    subtitle: 'Your payment is protected in Escrow until you inspect your item at the stall and scan your official Pickup Pass.',
    color: '#00D4AA',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedState, setSelectedState] = useState<string>('All Nigeria');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(MOCK_MARKETS[0]!);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(MOCK_PRODUCTS[0]!);
  const [showHaggleModal, setShowHaggleModal] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('800000');

  // Settings State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [escrowPinEnabled, setEscrowPinEnabled] = useState(true);
  const [preferredState, setPreferredState] = useState('Lagos State (South-West)');
  const [userName, setUserName] = useState('Keziah User');
  const [userPhone, setUserPhone] = useState('+234 803 123 4567');

  // 360 Panorama Virtual Tour State
  const [currentPano, setCurrentPano] = useState(MOCK_PANORAMAS[0]!);
  const [yaw, setYaw] = useState(45);
  const [selectedShopInTour, setSelectedShopInTour] = useState<ShopType>(MOCK_SHOPS[0]!);
  const [showShopSheet, setShowShopSheet] = useState(false);

  // Chat / Negotiation State
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'seller', text: 'Welcome to Adebayo Electronics! We are located at Stall BLK-A-14 in Balogun Market. Feel free to ask questions or make an offer!' },
    { id: '2', sender: 'customer', isOffer: true, price: 820000, status: 'COUNTERED' },
    { id: '3', sender: 'seller', text: '₦820,000 is accepted! It includes original adapter, warranty, and instant escrow pickup pass.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Auto-advance Splash Screen after 2.5 seconds
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Android Hardware Back Button Handling
  useEffect(() => {
    const onBackPress = () => {
      if (showHaggleModal) {
        setShowHaggleModal(false);
        return true;
      }
      if (showShopSheet) {
        setShowShopSheet(false);
        return true;
      }
      if (currentScreen !== 'markets' && currentScreen !== 'splash' && currentScreen !== 'onboarding') {
        setCurrentScreen('markets');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [currentScreen, showHaggleModal, showShopSheet]);

  // 360 Pan Responder for smooth touch drag
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setYaw((prev) => (prev - gestureState.dx * 0.08 + 360) % 360);
    },
  });

  const handleSendHaggle = () => {
    const priceNum = parseInt(proposedPrice, 10) || 800000;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'customer',
        isOffer: true,
        price: priceNum,
        status: 'PENDING',
      },
      {
        id: (Date.now() + 1).toString(),
        sender: 'seller',
        text: `Offer of ${formatNGN(priceNum)} received! Looking at stock right now...`,
      },
    ]);
    setShowHaggleModal(false);
    setCurrentScreen('chat');
  };

  const handleSharePickupPass = async () => {
    try {
      await Share.share({
        message: `MarketApp Escrow Pickup Pass for ${selectedMarket.name}. Code: PICKUP-7842`,
      });
    } catch (e) {
      // ignore
    }
  };

  // Filtered Markets & Products nationwide
  const filteredMarkets = MOCK_MARKETS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedState === 'All Nigeria') return matchesSearch;
    return matchesSearch && (m.state.toLowerCase() === selectedState.toLowerCase() || m.city.toLowerCase() === selectedState.toLowerCase());
  });

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Electronics') return matchesSearch && (p.name.includes('iPhone') || p.name.includes('MacBook') || p.name.includes('Tv') || p.name.includes('Headphones'));
    if (selectedCategory === 'Mobile') return matchesSearch && (p.name.includes('iPhone') || p.name.includes('Samsung') || p.name.includes('Phone'));
    if (selectedCategory === 'Textiles') return matchesSearch && (p.name.includes('Lace') || p.name.includes('Ankara') || p.name.includes('Fabric'));
    if (selectedCategory === 'Spices') return matchesSearch && (p.name.includes('Pepper') || p.name.includes('Rice') || p.name.includes('Spice'));
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0F1A" translucent={false} />

      {/* App Header (Shown on main app screens) */}
      {(currentScreen !== 'splash' && currentScreen !== 'onboarding') && (
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              onPress={() => setCurrentScreen('markets')}
            >
              <View style={styles.logoBadge}>
                <Text style={{ fontSize: 16 }}>🛍️</Text>
              </View>
              <Text style={styles.brandTitle}>
                Market<Text style={{ color: '#FF6B35' }}>App</Text>
              </Text>
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity 
                style={styles.cityBadge}
                onPress={() => setCurrentScreen('map')}
              >
                <Text style={styles.cityBadgeText}>🇳🇬 Nigeria Map</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingsHeaderBtn}
                onPress={() => setCurrentScreen('settings')}
              >
                <Text style={{ fontSize: 16 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Screen Router */}
      <View style={{ flex: 1 }}>
        {/* ─── Screen: Splash Brand Logo Screen ───────────────────── */}
        {currentScreen === 'splash' && (
          <View style={styles.splashContainer}>
            {/* Glowing Brand Logo Avatar */}
            <View style={styles.splashLogoGlow}>
              <View style={styles.splashLogoCircle}>
                <Text style={{ fontSize: 60 }}>🛍️</Text>
              </View>
            </View>

            {/* Brand Title */}
            <Text style={styles.splashBrandTitle}>
              Market<Text style={{ color: '#FF6B35' }}>App</Text>
            </Text>
            <Text style={styles.splashTagline}>Walk Nigeria Markets in 360°</Text>

            {/* Escrow Guarantee Pill */}
            <View style={styles.splashEscrowBadge}>
              <Text style={styles.splashEscrowBadgeText}>🛡️ 100% Escrow Protected Trading</Text>
            </View>

            {/* Loading Spinner & Manual Start Button */}
            <View style={styles.splashFooter}>
              <ActivityIndicator color="#FF6B35" size="large" style={{ marginBottom: 14 }} />
              
              <TouchableOpacity
                style={styles.splashContinueBtn}
                onPress={() => setCurrentScreen('onboarding')}
              >
                <Text style={styles.splashContinueBtnText}>Get Started →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Screen: Onboarding ─────────────────────────────────── */}
        {currentScreen === 'onboarding' && (
          <View style={styles.onboardingContainer}>
            {/* Top Bar with Logo & Skip */}
            <View style={styles.onboardingTopBar}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.logoBadge}>
                  <Text style={{ fontSize: 18 }}>🛍️</Text>
                </View>
                <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>
                  Market<Text style={{ color: '#FF6B35' }}>App</Text>
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => setCurrentScreen('markets')}
              >
                <Text style={{ color: '#9BA5C9', fontWeight: '700', fontSize: 14 }}>Skip Tour →</Text>
              </TouchableOpacity>
            </View>

            {/* Slide Graphic & Info */}
            <View style={styles.onboardingSlideContent}>
              <View style={[styles.onboardingIconCircle, { backgroundColor: ONBOARDING_SLIDES[onboardingIndex]!.color + '20' }]}>
                <Text style={{ fontSize: 64 }}>{ONBOARDING_SLIDES[onboardingIndex]!.icon}</Text>
              </View>

              <Text style={styles.onboardingTitle}>
                {ONBOARDING_SLIDES[onboardingIndex]!.title}
              </Text>

              <Text style={styles.onboardingSubtitle}>
                {ONBOARDING_SLIDES[onboardingIndex]!.subtitle}
              </Text>

              {/* Step Indicator Dots */}
              <View style={styles.dotRow}>
                {ONBOARDING_SLIDES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === onboardingIndex ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Navigation Action Buttons */}
            <View style={styles.onboardingBottomRow}>
              {onboardingIndex < ONBOARDING_SLIDES.length - 1 ? (
                <TouchableOpacity
                  style={styles.onboardingNextBtn}
                  onPress={() => setOnboardingIndex((prev) => prev + 1)}
                >
                  <Text style={styles.onboardingNextBtnText}>Next Step →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.onboardingStartBtn}
                  onPress={() => setCurrentScreen('markets')}
                >
                  <Text style={styles.onboardingStartBtnText}>Explore Markets Now 🚀</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ─── Screen: Markets & Nationwide Directory ────────────── */}
        {currentScreen === 'markets' && (
          <ScrollView 
            style={styles.contentScroll} 
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Card */}
            <View style={styles.heroBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroEyebrow}>⚡ NATIONWIDE NIGERIAN MARKETPLACE</Text>
                <Text style={styles.heroTitle}>Shop Every Market in Nigeria</Text>
                <Text style={styles.heroSub}>
                  Explore Lagos, Abuja, Onitsha, Kano, Aba & Port Harcourt in 360° virtual tours with escrow security.
                </Text>
              </View>
              <View style={styles.heroFeatureRow}>
                <View style={styles.heroFeatureChip}>
                  <Text style={styles.heroFeatureChipText}>🛡️ Escrow Protected</Text>
                </View>
                <View style={styles.heroFeatureChip}>
                  <Text style={styles.heroFeatureChipText}>🗺️ 6 Geopolitical Zones</Text>
                </View>
                <View style={styles.heroFeatureChip}>
                  <Text style={styles.heroFeatureChipText}>💬 Direct Trader Chat</Text>
                </View>
              </View>
            </View>

            {/* Search Input Bar */}
            <View style={styles.searchBarContainer}>
              <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search markets, states, or goods (e.g. Kano, Onitsha, Wuse)..."
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

            {/* State Filter Pills */}
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
              <Text style={styles.sectionHeading}>Markets Across Nigeria</Text>
              <TouchableOpacity onPress={() => setCurrentScreen('map')}>
                <Text style={{ color: '#00D4AA', fontSize: 12, fontWeight: '800' }}>
                  🗺️ Map View ({filteredMarkets.length})
                </Text>
              </TouchableOpacity>
            </View>

            {filteredMarkets.map((market) => (
              <TouchableOpacity
                key={market.id}
                style={styles.marketCard}
                activeOpacity={0.88}
                onPress={() => {
                  setSelectedMarket(market);
                  setCurrentScreen('tour');
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
                    <View style={styles.tourBadge}>
                      <Text style={styles.tourBadgeText}>🧭 360° TOUR</Text>
                    </View>
                  </View>
                  <Text style={styles.marketDesc} numberOfLines={2}>{market.description}</Text>
                  <View style={styles.marketStatsRow}>
                    <Text style={styles.marketStatText}>📍 {market.city}, {market.state}</Text>
                    <Text style={styles.marketStatText}>🏪 {market.totalStalls} stalls</Text>
                    <Text style={styles.marketStatText}>★ 4.9</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Featured Deals */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
              <Text style={styles.sectionHeading}>Nationwide Deals</Text>
              <Text style={{ color: '#FF6B35', fontSize: 12, fontWeight: '700' }}>Tap to Haggle</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              {filteredProducts.map((prod) => (
                <TouchableOpacity
                  key={prod.id}
                  style={styles.productCard}
                  activeOpacity={0.88}
                  onPress={() => {
                    setSelectedProduct(prod);
                    setProposedPrice((prod.price * 0.9).toFixed(0));
                    setShowHaggleModal(true);
                  }}
                >
                  <Image source={{ uri: prod.imageUrls[0] }} style={styles.productImg} />
                  <View style={{ padding: 10 }}>
                    <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
                    <Text style={styles.productPrice}>{formatNGN(prod.price)}</Text>
                    <View style={styles.haggleBadge}>
                      <Text style={styles.haggleBadgeText}>🤝 Make Offer</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        )}

        {/* ─── Screen: Interactive Map of Nigeria ─────────────────── */}
        {currentScreen === 'map' && (
          <ScrollView 
            style={styles.contentScroll}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroBanner}>
              <Text style={styles.heroEyebrow}>🗺️ NIGERIA MARKET MAP</Text>
              <Text style={styles.heroTitle}>Coverage Across 36 States & FCT</Text>
              <Text style={styles.heroSub}>
                Tap any market marker to view live 360° corridor tours, verified stall directories, and trader escrow status.
              </Text>
            </View>

            {/* Nigeria Map Container View */}
            <View style={styles.nigeriaMapCard}>
              <View style={styles.mapHeaderRow}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>
                  🇳🇬 Federal Republic of Nigeria
                </Text>
                <View style={styles.livePulse}>
                  <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '800' }}>● LIVE COVERAGE</Text>
                </View>
              </View>

              {/* Geographic Nigeria Grid Canvas */}
              <View style={styles.mapCanvas}>
                <View style={styles.mapRegionTagNorth}>
                  <Text style={styles.mapRegionText}>NORTH (Kano, Kaduna, Maiduguri)</Text>
                </View>
                <View style={styles.mapRegionTagCentral}>
                  <Text style={styles.mapRegionText}>CENTRAL (Abuja FCT, Jos, Benue)</Text>
                </View>
                <View style={styles.mapRegionTagWest}>
                  <Text style={styles.mapRegionText}>SOUTH-WEST (Lagos, Ibadan)</Text>
                </View>
                <View style={styles.mapRegionTagEast}>
                  <Text style={styles.mapRegionText}>SOUTH-EAST & SOUTH (Onitsha, Aba, Port Harcourt)</Text>
                </View>

                {/* Market Pins */}
                <TouchableOpacity
                  style={[styles.mapPin, { top: '12%', left: '55%' }]}
                  onPress={() => {
                    setSelectedMarket(MOCK_MARKETS.find((m) => m.city === 'Kano') || MOCK_MARKETS[0]!);
                    setCurrentScreen('tour');
                  }}
                >
                  <Text style={styles.mapPinIcon}>🏜️</Text>
                  <View style={styles.mapPinCallout}>
                    <Text style={styles.mapPinName}>Kurmi Market</Text>
                    <Text style={styles.mapPinCity}>Kano State</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mapPin, { top: '38%', left: '48%' }]}
                  onPress={() => {
                    setSelectedMarket(MOCK_MARKETS.find((m) => m.city === 'Abuja') || MOCK_MARKETS[0]!);
                    setCurrentScreen('tour');
                  }}
                >
                  <Text style={styles.mapPinIcon}>🏛️</Text>
                  <View style={styles.mapPinCallout}>
                    <Text style={styles.mapPinName}>Wuse Market</Text>
                    <Text style={styles.mapPinCity}>Abuja FCT</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mapPin, { top: '72%', left: '15%' }]}
                  onPress={() => {
                    setSelectedMarket(MOCK_MARKETS[0]!);
                    setCurrentScreen('tour');
                  }}
                >
                  <Text style={styles.mapPinIcon}>🛍️</Text>
                  <View style={styles.mapPinCallout}>
                    <Text style={styles.mapPinName}>Balogun & Computer Village</Text>
                    <Text style={styles.mapPinCity}>Lagos State</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mapPin, { top: '70%', left: '54%' }]}
                  onPress={() => {
                    setSelectedMarket(MOCK_MARKETS.find((m) => m.city === 'Onitsha') || MOCK_MARKETS[0]!);
                    setCurrentScreen('tour');
                  }}
                >
                  <Text style={styles.mapPinIcon}>📦</Text>
                  <View style={styles.mapPinCallout}>
                    <Text style={styles.mapPinName}>Onitsha Main Market</Text>
                    <Text style={styles.mapPinCity}>Anambra State</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mapPin, { top: '82%', left: '60%' }]}
                  onPress={() => {
                    setSelectedMarket(MOCK_MARKETS.find((m) => m.city === 'Aba') || MOCK_MARKETS[0]!);
                    setCurrentScreen('tour');
                  }}
                >
                  <Text style={styles.mapPinIcon}>👞</Text>
                  <View style={styles.mapPinCallout}>
                    <Text style={styles.mapPinName}>Ariaria Market</Text>
                    <Text style={styles.mapPinCity}>Aba, Abia</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mapPin, { top: '86%', left: '45%' }]}
                  onPress={() => {
                    setSelectedMarket(MOCK_MARKETS.find((m) => m.city === 'Port Harcourt') || MOCK_MARKETS[0]!);
                    setCurrentScreen('tour');
                  }}
                >
                  <Text style={styles.mapPinIcon}>🌊</Text>
                  <View style={styles.mapPinCallout}>
                    <Text style={styles.mapPinName}>Oil Mill Market</Text>
                    <Text style={styles.mapPinCity}>Port Harcourt, Rivers</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={{ color: '#9BA5C9', fontSize: 11, textAlign: 'center', marginTop: 14 }}>
                Tap any market pin on the map to start a live 360° virtual tour & stall navigation
              </Text>
            </View>
          </ScrollView>
        )}

        {/* ─── Screen: 360° Virtual Tour ──────────────────────────── */}
        {currentScreen === 'tour' && (
          <View style={{ flex: 1, backgroundColor: '#000' }} {...panResponder.panHandlers}>
            <Image
              source={{ uri: currentPano.publicImageUrl }}
              style={{
                width: SCREEN_WIDTH * 2,
                height: '100%',
                position: 'absolute',
                left: -(yaw * 2.2),
              }}
              resizeMode="cover"
            />
            
            <View style={styles.vignette} />

            <View style={styles.tourHeader}>
              <TouchableOpacity 
                style={styles.tourBackBtn}
                onPress={() => setCurrentScreen('markets')}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>← Back</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.tourMarketName}>{selectedMarket.name}</Text>
                <Text style={styles.tourNodeText}>{selectedMarket.city}, {selectedMarket.state} • Main Walkway</Text>
              </View>
              <View style={styles.compassBadge}>
                <Text style={styles.compassText}>🧭 {Math.round(yaw)}°</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.stallHotspot, { top: SCREEN_HEIGHT * 0.38, left: SCREEN_WIDTH * 0.3 }]}
              onPress={() => {
                setSelectedShopInTour(MOCK_SHOPS[0]!);
                setShowShopSheet(true);
              }}
            >
              <View style={styles.pulsePin}>
                <Text style={{ fontSize: 16 }}>🏪</Text>
              </View>
              <View>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>Adebayo Electronics</Text>
                <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '700' }}>Stall BLK-A-14 • ★ 4.8</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.tourControlsRow}>
              <TouchableOpacity 
                style={styles.tourPanBtn}
                onPress={() => setYaw((prev) => (prev - 25 + 360) % 360)}
              >
                <Text style={styles.tourPanBtnText}>◄ Turn Left</Text>
              </TouchableOpacity>
              <View style={styles.dragHint}>
                <Text style={styles.dragHintText}>👆 Drag to rotate 360°</Text>
              </View>
              <TouchableOpacity 
                style={styles.tourPanBtn}
                onPress={() => setYaw((prev) => (prev + 25) % 360)}
              >
                <Text style={styles.tourPanBtnText}>Turn Right ►</Text>
              </TouchableOpacity>
            </View>

            {showShopSheet && (
              <View style={styles.shopSheet}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 22 }}>🏪</Text>
                    <View>
                      <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>
                        {selectedShopInTour.name}
                      </Text>
                      <Text style={{ color: '#00D4AA', fontSize: 12, fontWeight: '600' }}>
                        Verified Trader • {selectedMarket.name}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowShopSheet(false)}>
                    <Text style={{ color: '#9BA5C9', fontSize: 18, padding: 4 }}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ color: '#9BA5C9', fontSize: 13, marginVertical: 8, lineHeight: 18 }}>
                  Specializing in authentic UK used phones, laptops, and accessories. Full 90-day warranty & in-person escrow pickup pass.
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <TouchableOpacity
                    style={[styles.haggleBtn, { flex: 1 }]}
                    onPress={() => {
                      setShowShopSheet(false);
                      setShowHaggleModal(true);
                    }}
                  >
                    <Text style={styles.haggleBtnText}>🤝 Make Offer / Haggle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.chatShopBtn, { flex: 1 }]}
                    onPress={() => {
                      setShowShopSheet(false);
                      setCurrentScreen('chat');
                    }}
                  >
                    <Text style={styles.chatShopBtnText}>💬 Live Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ─── Screen: Chat & Trader Negotiation ──────────────────── */}
        {currentScreen === 'chat' && (
          <View style={{ flex: 1, backgroundColor: '#0D0F1A' }}>
            <View style={styles.chatTopBar}>
              <TouchableOpacity onPress={() => setCurrentScreen('markets')}>
                <Text style={{ color: '#FF6B35', fontWeight: '700', fontSize: 14 }}>← Back</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>Adebayo Electronics</Text>
                <Text style={{ color: '#00D4AA', fontSize: 11, fontWeight: '600' }}>● Active at {selectedMarket.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setCurrentScreen('orders')}>
                <Text style={{ color: '#00D4AA', fontWeight: '700', fontSize: 13 }}>🎟️ Pickup Pass</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1, padding: 16 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {chatMessages.map((msg) => {
                if (msg.isOffer) {
                  return (
                    <View key={msg.id} style={styles.offerBubble}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#F59E0B', fontWeight: '800', fontSize: 11 }}>
                          🤝 NEGOTIATED OFFER PROPOSAL
                        </Text>
                        <Text style={{ color: '#00D4AA', fontSize: 10, fontWeight: '700' }}>ESCROW READY</Text>
                      </View>
                      
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, marginTop: 6 }}>
                        iPhone 14 Pro Max (UK Used - 256GB)
                      </Text>
                      <Text style={{ color: '#FF6B35', fontWeight: '800', fontSize: 22, marginVertical: 4 }}>
                        {formatNGN(msg.price || 820000)}
                      </Text>
                      <Text style={{ color: '#9BA5C9', fontSize: 11, marginBottom: 10 }}>
                        Includes original fast charger + 90-day store warranty
                      </Text>

                      <TouchableOpacity
                        style={styles.acceptCounterBtn}
                        onPress={() => {
                          Alert.alert('Payment Successful', '₦820,000 held safely in Escrow. Your Stall Pickup Pass is generated!', [
                            { text: 'View Pickup Pass', onPress: () => setCurrentScreen('orders') },
                          ]);
                        }}
                      >
                        <Text style={styles.acceptCounterBtnText}>⚡ Accept Offer & Pay Escrow (₦820,000)</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }

                const isMe = msg.sender === 'customer';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.chatBubble,
                      isMe ? styles.chatBubbleMe : styles.chatBubbleOther,
                    ]}
                  >
                    <Text style={{ color: 'white', fontSize: 14, lineHeight: 20 }}>{msg.text}</Text>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message or ask trader..."
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
                  }
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Screen: Orders & Escrow Pickup QR Pass ──────────────── */}
        {currentScreen === 'orders' && (
          <ScrollView 
            style={styles.contentScroll} 
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.qrCard}>
              <View style={styles.qrBadge}>
                <Text style={styles.qrBadgeText}>🛡️ OFFICIAL ESCROW PICKUP PASS</Text>
              </View>
              <Text style={styles.qrTitle}>Show Code at {selectedMarket.name}</Text>
              <Text style={styles.qrSub}>{selectedMarket.city}, {selectedMarket.state} • Adebayo Electronics</Text>

              <View style={styles.qrBox}>
                <View style={styles.qrGrid}>
                  {[
                    1, 1, 1, 1, 0, 1, 1, 1, 1,
                    1, 0, 0, 1, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 1, 1, 0, 0, 1,
                    1, 1, 1, 1, 0, 1, 1, 1, 1,
                    0, 0, 1, 0, 1, 0, 1, 0, 0,
                    1, 0, 1, 1, 0, 1, 1, 0, 1,
                    1, 1, 1, 0, 1, 0, 1, 1, 1,
                    1, 0, 0, 1, 1, 1, 0, 0, 1,
                    1, 1, 1, 1, 0, 1, 1, 1, 1,
                  ].map((c, i) => (
                    <View key={i} style={[styles.qrCell, { backgroundColor: c ? '#0D0F1A' : '#FFFFFF' }]} />
                  ))}
                </View>
              </View>

              <Text style={styles.qrSecretCode}>PICKUP-7842</Text>
              <Text style={styles.qrHint}>
                Funds are held in secure Escrow until trader scans or verifies this code at stall pickup.
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={styles.directionsBtn}
                  onPress={() => setCurrentScreen('tour')}
                >
                  <Text style={styles.directionsBtnText}>🧭 360° Walk to Stall</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={handleSharePickupPass}
                >
                  <Text style={styles.shareBtnText}>📤 Share Pass</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* ─── Screen: Settings & Account Preferences ─────────────── */}
        {currentScreen === 'settings' && (
          <ScrollView 
            style={styles.contentScroll}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroBanner}>
              <Text style={styles.heroEyebrow}>⚙️ APP SETTINGS & ACCOUNT</Text>
              <Text style={styles.heroTitle}>Manage MarketApp Preferences</Text>
              <Text style={styles.heroSub}>
                Customize notifications, preferred Nigerian market regions, escrow security PINs, and re-trigger onboarding.
              </Text>
            </View>

            {/* Section 1: Profile Details */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>👤 Account Profile</Text>

              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Full Name</Text>
                <TextInput
                  style={styles.settingsTextInput}
                  value={userName}
                  onChangeText={setUserName}
                />
              </View>

              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Phone Number (OTP Verified)</Text>
                <TextInput
                  style={styles.settingsTextInput}
                  value={userPhone}
                  onChangeText={setUserPhone}
                />
              </View>

              <View style={styles.settingsInputGroup}>
                <Text style={styles.settingsLabel}>Default Market Region</Text>
                <TouchableOpacity style={styles.regionSelectBox}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{preferredState}</Text>
                  <Text style={{ color: '#00D4AA', fontWeight: '800' }}>Change ›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 2: Security & Payment */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>🛡️ Security & Payments</Text>

              <View style={styles.settingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsRowTitle}>Escrow PIN Protection</Text>
                  <Text style={styles.settingsRowSub}>Require PIN when releasing pickup code to trader</Text>
                </View>
                <Switch
                  value={escrowPinEnabled}
                  onValueChange={setEscrowPinEnabled}
                  trackColor={{ false: '#1E2440', true: '#00D4AA' }}
                  thumbColor="white"
                />
              </View>

              <View style={styles.settingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsRowTitle}>Push Notifications</Text>
                  <Text style={styles.settingsRowSub}>Receive real-time counter-offers from traders</Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: '#1E2440', true: '#FF6B35' }}
                  thumbColor="white"
                />
              </View>

              <View style={styles.settingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsRowTitle}>Dark Mode Styling</Text>
                  <Text style={styles.settingsRowSub}>Optimized contrast for OLED screens</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#1E2440', true: '#FF6B35' }}
                  thumbColor="white"
                />
              </View>
            </View>

            {/* Section 3: App Tour & Support */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>📱 App Info & Help</Text>

              <TouchableOpacity
                style={styles.settingsActionBtn}
                onPress={() => {
                  setOnboardingIndex(0);
                  setCurrentScreen('splash');
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>
                  🛍️ Replay Splash Logo & Onboarding Tour
                </Text>
                <Text style={{ color: '#FF6B35', fontWeight: '800' }}>View →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsActionBtn}
                onPress={() => Alert.alert('MarketApp Escrow Support', 'Contact Lagos HQ Support line: +234 1 800 MARKETAPP')}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>
                  💬 Contact Customer Escrow Support
                </Text>
                <Text style={{ color: '#00D4AA', fontWeight: '800' }}>Help ›</Text>
              </TouchableOpacity>
            </View>

            {/* Version Tag */}
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <Text style={{ color: '#5A647A', fontSize: 11 }}>MarketApp Android v1.0.0 (Build 100)</Text>
              <Text style={{ color: '#5A647A', fontSize: 10, marginTop: 2 }}>Made for Nigeria 🇳🇬</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ─── Bottom Navigation Bar ─────────────────────────────── */}
      {(currentScreen !== 'splash' && currentScreen !== 'onboarding') && (
        <View style={styles.bottomTabBar}>
          {[
            { key: 'markets', label: 'Markets', icon: '🏪' },
            { key: 'map', label: 'Nigeria Map', icon: '🗺️' },
            { key: 'tour', label: '360° Tour', icon: '🧭' },
            { key: 'chat', label: 'Haggle Chat', icon: '💬' },
            { key: 'orders', label: 'Pickup Pass', icon: '🎟️' },
          ].map((tab) => {
            const active = currentScreen === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabItem}
                onPress={() => setCurrentScreen(tab.key as Screen)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, { color: active ? '#FF6B35' : '#9BA5C9' }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ─── Haggle / Make Offer Modal ─────────────────────────── */}
      <Modal visible={showHaggleModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Haggle with Trader</Text>
              <TouchableOpacity onPress={() => setShowHaggleModal(false)}>
                <Text style={{ color: '#9BA5C9', fontSize: 18, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Item: {selectedProduct.name}
            </Text>
            <Text style={{ color: '#00D4AA', fontSize: 12, fontWeight: '700', marginBottom: 12 }}>
              Listed price: {formatNGN(selectedProduct.price)}
            </Text>

            <Text style={styles.inputLabel}>Enter Your Counter-Offer (NGN)</Text>
            <TextInput
              style={styles.haggleInput}
              keyboardType="numeric"
              value={proposedPrice}
              onChangeText={setProposedPrice}
            />

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
  splashContainer: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashLogoGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.4)',
    marginBottom: 20,
  },
  splashLogoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#141726',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  splashBrandTitle: {
    fontSize: 34,
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
  splashEscrowBadge: {
    backgroundColor: 'rgba(0, 212, 170, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
    marginBottom: 40,
  },
  splashEscrowBadgeText: {
    color: '#00D4AA',
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
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  splashContinueBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
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
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
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
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  cityBadgeText: {
    color: '#00D4AA',
    fontSize: 11,
    fontWeight: '800',
  },
  settingsHeaderBtn: {
    backgroundColor: '#1E2440',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contentScroll: {
    flex: 1,
    padding: 16,
  },
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
    width: 130,
    height: 130,
    borderRadius: 65,
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
    width: 24,
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
    lineHeight: 17,
  },
  heroFeatureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  heroFeatureChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroFeatureChipText: {
    color: '#9BA5C9',
    fontSize: 10,
    fontWeight: '600',
  },
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
  sectionHeading: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
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
    height: 150,
  },
  marketOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(13,15,26,0.3)',
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
  },
  marketStatText: {
    color: '#5A647A',
    fontSize: 11,
    fontWeight: '600',
  },
  productCard: {
    width: 155,
    backgroundColor: '#141726',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  productImg: {
    width: '100%',
    height: 115,
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  haggleBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
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
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mapCanvas: {
    width: '100%',
    height: 380,
    backgroundColor: '#0D0F1A',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  mapRegionTagNorth: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  mapRegionTagCentral: {
    position: 'absolute',
    top: 130,
    left: 10,
  },
  mapRegionTagWest: {
    position: 'absolute',
    top: 240,
    left: 10,
  },
  mapRegionTagEast: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  mapRegionText: {
    color: '#5A647A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mapPin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20,23,38,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
  },
  mapPinIcon: {
    fontSize: 14,
  },
  mapPinCallout: {},
  mapPinName: {
    color: 'white',
    fontWeight: '800',
    fontSize: 11,
  },
  mapPinCity: {
    color: '#00D4AA',
    fontSize: 9,
    fontWeight: '700',
  },
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
    marginBottom: 12,
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
  vignette: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    fontSize: 16,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tourPanBtnText: {
    color: 'white',
    fontSize: 11,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
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
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
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
  },
  qrSub: {
    color: '#9BA5C9',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
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
  },
  shareBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  bottomTabBar: {
    height: 60,
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
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
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
  modalSub: {
    color: '#9BA5C9',
    fontSize: 13,
    marginTop: 4,
  },
  inputLabel: {
    color: '#9BA5C9',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  haggleInput: {
    backgroundColor: '#1E2440',
    color: '#FF6B35',
    fontSize: 22,
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
