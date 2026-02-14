import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Switch, Dimensions, KeyboardAvoidingView, Platform, Image, Animated, AppState, PanResponder, Modal } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { createAudioPlayer } from 'expo-audio';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Import Lottie animations as JSON objects (works in both dev and production)
// Metro bundles JSON files directly, so importing them gives us the actual JSON data
import AnimationDaytime from './assets/animations/Animation-Daytime.json';
import AnimationNighttime from './assets/animations/Animation-Nighttime.json';
import HandWave from './assets/animations/hand wave.json';
import AnimationAlert from './assets/animations/Animation - 1709705128416.json';
import HappyAnimation from './assets/animations/happy.json';
import SadAnimation from './assets/animations/sad.json';
import ThinkingAnimation from './assets/animations/thinking.json';
import LoveAnimation from './assets/animations/love.json';
import AngryAnimation from './assets/animations/angry.json';
import FunnyAnimation from './assets/animations/laughing.json';
import AskAnimation from './assets/animations/question.json';
import SorryAnimation from './assets/animations/sorry.json';
import ThankYouAnimation from './assets/animations/thankyou.json';
import GoodAnimation from './assets/animations/thumbsUp.json';


// Background configurations with day/night modes (shared between screens)
const backgroundConfigs = {
  mountains: {
    name: 'Mountains',
    type: 'lottie',
    day: AnimationDaytime,
    night: AnimationNighttime,
    previewColor: '#E8F4F8',
  },
  tropical: {
    name: 'Tropical',
    type: 'animated-gradient',
    day: { 
      colorSets: [
        ['#40E0D0', '#FF6B6B', '#7FCDBB'], // Turquoise, Coral, Palm Green
        ['#FF6B6B', '#7FCDBB', '#F4D03F'], // Coral, Palm Green, Sandy Beige
        ['#7FCDBB', '#F4D03F', '#40E0D0'], // Palm Green, Sandy Beige, Turquoise
        ['#F4D03F', '#40E0D0', '#FF6B6B'], // Sandy Beige, Turquoise, Coral
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    night: { 
      colorSets: [
        ['#0A4D68', '#8B3A3A', '#2D5016'], // Deep Ocean, Dark Coral, Deep Forest
        ['#8B3A3A', '#2D5016', '#6B4423'], // Dark Coral, Deep Forest, Dark Sand
        ['#2D5016', '#6B4423', '#0A4D68'], // Deep Forest, Dark Sand, Deep Ocean
        ['#6B4423', '#0A4D68', '#8B3A3A'], // Dark Sand, Deep Ocean, Dark Coral
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    previewColor: '#40E0D0',
  },
  galaxy: {
    name: 'Galaxy',
    type: 'animated-gradient',
    day: { 
      colorSets: [
        ['#1a0033', '#4a148c', '#7b1fa2'], // Deep Purple, Violet, Magenta
        ['#4a148c', '#7b1fa2', '#e91e63'], // Violet, Magenta, Pink
        ['#7b1fa2', '#e91e63', '#3f51b5'], // Magenta, Pink, Indigo
        ['#e91e63', '#3f51b5', '#1a0033'], // Pink, Indigo, Deep Purple
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    night: { 
      colorSets: [
        ['#0a0014', '#1a0033', '#2d0047'], // Deepest Space, Deep Purple, Dark Violet
        ['#1a0033', '#2d0047', '#4a148c'], // Deep Purple, Dark Violet, Violet
        ['#2d0047', '#4a148c', '#1a0033'], // Dark Violet, Violet, Deep Purple
        ['#4a148c', '#1a0033', '#0a0014'], // Violet, Deep Purple, Deepest Space
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    previewColor: '#4a148c',
  },
  rainbow: {
    name: 'Rainbow',
    type: 'animated-gradient',
    day: { 
      colorSets: [
        ['#FF0000', '#FF8800', '#FFD700', '#8B00FF'], // Red, Orange, Gold, Violet
        ['#FF8800', '#FFD700', '#8B00FF', '#FF0000'], // Orange, Gold, Violet, Red
        ['#FFD700', '#8B00FF', '#FF0000', '#FF8800'], // Gold, Violet, Red, Orange
        ['#8B00FF', '#FF0000', '#FF8800', '#FFD700'], // Violet, Red, Orange, Gold
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    night: { 
      colorSets: [
        ['#CC0000', '#CC6600', '#CCAA00', '#6B00CC'], // Darker Red, Orange, Gold, Violet
        ['#CC6600', '#CCAA00', '#6B00CC', '#CC0000'], // Darker Orange, Gold, Violet, Red
        ['#CCAA00', '#6B00CC', '#CC0000', '#CC6600'], // Darker Gold, Violet, Red, Orange
        ['#6B00CC', '#CC0000', '#CC6600', '#CCAA00'], // Darker Violet, Red, Orange, Gold
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    previewColor: '#FF8800',
  },
  sunset: {
    name: 'Sunset',
    type: 'animated-gradient',
    day: { 
      colorSets: [
        ['#ef4444', '#f97316', '#fbbf24', '#3b82f6'], // Red, Orange, Yellow, Blue
        ['#f97316', '#fbbf24', '#3b82f6', '#ef4444'], // Orange, Yellow, Blue, Red
        ['#fbbf24', '#3b82f6', '#ef4444', '#f97316'], // Yellow, Blue, Red, Orange
        ['#3b82f6', '#ef4444', '#f97316', '#fbbf24'], // Blue, Red, Orange, Yellow
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    night: { 
      colorSets: [
        ['#dc2626', '#ea580c', '#f59e0b', '#2563eb'], // Darker Red, Orange, Yellow, Blue
        ['#ea580c', '#f59e0b', '#2563eb', '#dc2626'], // Darker Orange, Yellow, Blue, Red
        ['#f59e0b', '#2563eb', '#dc2626', '#ea580c'], // Darker Yellow, Blue, Red, Orange
        ['#2563eb', '#dc2626', '#ea580c', '#f59e0b'], // Darker Blue, Red, Orange, Yellow
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    previewColor: '#f97316',
  },
  retro: {
    name: '80s Pop',
    type: 'animated-gradient',
    day: { 
      colorSets: [
        ['#FF00FF', '#00FFFF', '#FF00FF', '#FFFF00'], // Hot Pink, Cyan, Hot Pink, Neon Yellow
        ['#00FFFF', '#FF00FF', '#FFFF00', '#FF00FF'], // Cyan, Hot Pink, Neon Yellow, Hot Pink
        ['#FF00FF', '#FFFF00', '#FF00FF', '#00FFFF'], // Hot Pink, Neon Yellow, Hot Pink, Cyan
        ['#FFFF00', '#FF00FF', '#00FFFF', '#FF00FF'], // Neon Yellow, Hot Pink, Cyan, Hot Pink
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    night: { 
      colorSets: [
        ['#CC00CC', '#00CCCC', '#CC00CC', '#CCCC00'], // Darker Hot Pink, Darker Cyan, Darker Hot Pink, Darker Yellow
        ['#00CCCC', '#CC00CC', '#CCCC00', '#CC00CC'], // Darker Cyan, Darker Hot Pink, Darker Yellow, Darker Hot Pink
        ['#CC00CC', '#CCCC00', '#CC00CC', '#00CCCC'], // Darker Hot Pink, Darker Yellow, Darker Hot Pink, Darker Cyan
        ['#CCCC00', '#CC00CC', '#00CCCC', '#CC00CC'], // Darker Yellow, Darker Hot Pink, Darker Cyan, Darker Hot Pink
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    previewColor: '#FF00FF',
  },
  blossom: {
    name: 'Blossom',
    type: 'animated-gradient',
    day: { 
      colorSets: [
        ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFE4E1'], // Light Pink, Pink, Hot Pink, Misty Rose
        ['#FFC0CB', '#FF69B4', '#FFE4E1', '#FFB6C1'], // Pink, Hot Pink, Misty Rose, Light Pink
        ['#FF69B4', '#FFE4E1', '#FFB6C1', '#FFC0CB'], // Hot Pink, Misty Rose, Light Pink, Pink
        ['#FFE4E1', '#FFB6C1', '#FFC0CB', '#FF69B4'], // Misty Rose, Light Pink, Pink, Hot Pink
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    night: { 
      colorSets: [
        ['#8B4C6B', '#8B4C7A', '#8B4789', '#8B5A7A'], // Dark Pink, Dark Rose, Dark Magenta, Dark Mauve
        ['#8B4C7A', '#8B4789', '#8B5A7A', '#8B4C6B'], // Dark Rose, Dark Magenta, Dark Mauve, Dark Pink
        ['#8B4789', '#8B5A7A', '#8B4C6B', '#8B4C7A'], // Dark Magenta, Dark Mauve, Dark Pink, Dark Rose
        ['#8B5A7A', '#8B4C6B', '#8B4C7A', '#8B4789'], // Dark Mauve, Dark Pink, Dark Rose, Dark Magenta
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    previewColor: '#FFB6C1',
  },
};

// Helper function to interpolate between hex colors (shared between screens)
const interpolateColor = (color1, color2, factor) => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);
  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Onboarding Slideshow Component
const OnboardingSlideshow = ({ visible, onClose, isNightMode, dimensions }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      title: "Step 1: Enter Your Text",
      description: "Type your message in the text input field. This is where your creative journey begins!",
      image: require('./assets/animations/input.png'),
    },
    {
      title: "Step 2: Add an Emoji",
      description: "Tap the Emoji button to add fun animations and emojis that bring your message to life!",
      image: require('./assets/animations/emojis.png'),
    },
    {
      title: "Step 3: Choose a Font",
      description: "Tap the Font button to browse and select from a variety of beautiful font styles that match your message.",
      image: require('./assets/animations/fonts.png'),
    },
    {
      title: "Step 4: Display Your Creation",
      description: "Tap the Display button to see your beautiful animated message in full screen with all the effects.",
      image: require('./assets/animations/display1.png'),
    },
    {
      title: "Step 5: Night Mode & Drawing",
      description: "Switch to night mode for a different vibe, and use the draw feature to add your personal touch!",
      image: require('./assets/animations/display2.png'),
    },
    {
      title: "Step 6: Quick Say Phrases",
      description: "Save your favorite phrases for quick access later. Perfect for messages you use often!",
      image: require('./assets/animations/quickSay.png'),
    },
    {
      title: "Step 7: Explore Settings",
      description: "Access settings to customize your experience, watch tutorials again, or adjust preferences.",
      image: require('./assets/animations/menu.png'),
    }
  ];

  useEffect(() => {
    if (visible) {
      setCurrentSlide(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: -currentSlide * dimensions.width,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const renderPreview = (imageSource) => {
    const previewStyle = {
      width: dimensions.width * 0.9,
      height: dimensions.height * 0.55,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: isNightMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    };

    return (
      <View style={previewStyle}>
        <Image
          source={imageSource}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.onboardingOverlay, { opacity: fadeAnim }]}>
        <View style={[
          styles.onboardingContainer,
          { width: dimensions.width, height: dimensions.height }
        ]}>
          <LinearGradient
            colors={isNightMode ? ['#1a1a1a', '#0a0a0a'] : ['#ffffff', '#f5f5f5']}
            style={styles.onboardingContent}
          >
            {/* Close button */}
            <TouchableOpacity
              style={styles.onboardingCloseButton}
              onPress={handleComplete}
            >
              <Ionicons
                name="close"
                size={28}
                color={isNightMode ? '#ffffff' : '#000000'}
              />
            </TouchableOpacity>

            {/* Slides container */}
            <View style={styles.onboardingSlidesContainer}>
              <Animated.View
                style={[
                  styles.onboardingSlidesWrapper,
                  {
                    width: dimensions.width * slides.length,
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                {slides.map((slide, index) => (
                  <View
                    key={index}
                    style={[
                      styles.onboardingSlide,
                      { width: dimensions.width }
                    ]}
                  >
                    <View style={styles.onboardingPreviewContainer}>
                      {renderPreview(slide.image)}
                    </View>
                    <Text 
                      allowFontScaling={false}
                      style={[
                        styles.onboardingTitle,
                        isNightMode && styles.onboardingTitleNight
                      ]}>
                      {slide.title}
                    </Text>
                    <Text 
                      allowFontScaling={false}
                      style={[
                        styles.onboardingDescription,
                        isNightMode && styles.onboardingDescriptionNight
                      ]}>
                      {slide.description}
                    </Text>
                  </View>
                ))}
              </Animated.View>
            </View>

            {/* Pagination dots */}
            <View style={styles.onboardingPagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.onboardingDot,
                    currentSlide === index && styles.onboardingDotActive,
                    isNightMode && styles.onboardingDotNight,
                    currentSlide === index && isNightMode && styles.onboardingDotActiveNight,
                  ]}
                />
              ))}
            </View>

            {/* Navigation buttons */}
            <View style={styles.onboardingNavigation}>
              {currentSlide > 0 && (
                <TouchableOpacity
                  onPress={prevSlide}
                  style={[
                    styles.onboardingNavButton,
                    isNightMode && styles.onboardingNavButtonNight
                  ]}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={isNightMode ? '#ffffff' : '#000000'}
                  />
                  <Text 
                    allowFontScaling={false}
                    style={[
                      styles.onboardingNavButtonText,
                      isNightMode && styles.onboardingNavButtonTextNight
                    ]}>
                    Back
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={nextSlide}
                style={styles.onboardingNextButton}
              >
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.onboardingNextButtonGradient}
                >
                  <Text 
                    allowFontScaling={false}
                    style={styles.onboardingNextButtonText}>
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#ffffff"
                    style={{ marginLeft: 5 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    </Modal>
  );
};

const PocketSayApp = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Show splash screen for 1.5 seconds for brand visibility
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        if (__DEV__) {
          console.warn('Error preparing app:', e);
        }
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animationEnabled: false }}>
        <Stack.Screen 
          name="PocketSay" 
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PocketSayResults" 
          component={PocketSayScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#f7e5e7');
  const [selectedBackground, setSelectedBackground] = useState('mountains');
  const [showButtons, setShowButtons] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [sound, setSound] = useState();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isThemeSectionExpanded, setIsThemeSectionExpanded] = useState(false);
  const [selectedFontStyle, setSelectedFontStyle] = useState('default');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickSay, setShowQuickSay] = useState(false);
  const [savedSayings, setSavedSayings] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);
  const [newSayingText, setNewSayingText] = useState('');
  const quickSayScrollViewRef = useRef(null);
  const hasLoadedBackgroundPrefs = useRef(false);
  const [customDayColor, setCustomDayColor] = useState('#f7e5e7');
  const [customNightColor, setCustomNightColor] = useState('#1e3a8a');
  const [customColorTab, setCustomColorTab] = useState('day'); // 'day' or 'night'
  const [textDayColor, setTextDayColor] = useState('#000000');
  const [textNightColor, setTextNightColor] = useState('#ffffff');
  const [textColorTab, setTextColorTab] = useState('day'); // 'day' or 'night'
  const [customPhotoUri, setCustomPhotoUri] = useState(null);
  const [customPhotoAspectRatio, setCustomPhotoAspectRatio] = useState(null); // width/height ratio
  const [gradientColors, setGradientColors] = useState(['#E8F4F8', '#F0E6F5']);
  const [buttonGradientColors, setButtonGradientColors] = useState(['#4A90E2', '#357ABD']);
  const fadeOpacity = React.useRef(new Animated.Value(0)).current;
  const gradientAnim = React.useRef(new Animated.Value(0)).current;
  const buttonGradientAnim = React.useRef(new Animated.Value(0)).current;
  const tropicalAnim = React.useRef(new Animated.Value(0)).current;
  const [tropicalColors, setTropicalColors] = useState(['#40E0D0', '#FF6B6B', '#7FCDBB']);
  const galaxyAnim = React.useRef(new Animated.Value(0)).current;
  const [galaxyColors, setGalaxyColors] = useState(['#1a0033', '#4a148c', '#7b1fa2']);
  const [starAnimations, setStarAnimations] = useState([]);
  const rainbowAnim = React.useRef(new Animated.Value(0)).current;
  const [rainbowColors, setRainbowColors] = useState(['#FF0000', '#FF8800', '#FFD700', '#8B00FF']);
  const sunsetAnim = React.useRef(new Animated.Value(0)).current;
  const [sunsetColors, setSunsetColors] = useState(['#ef4444', '#f97316', '#fbbf24', '#3b82f6']);
  const retroAnim = React.useRef(new Animated.Value(0)).current;
  const [retroColors, setRetroColors] = useState(['#FF00FF', '#00FFFF', '#FF00FF', '#FFFF00']);
  const blossomAnim = React.useRef(new Animated.Value(0)).current;
  const [blossomColors, setBlossomColors] = useState(['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFE4E1']);
  
  // Preview-specific animations (always running for preview cards)
  const tropicalPreviewAnim = React.useRef(new Animated.Value(0)).current;
  const [tropicalPreviewColors, setTropicalPreviewColors] = useState(['#40E0D0', '#FF6B6B', '#7FCDBB']);
  const galaxyPreviewAnim = React.useRef(new Animated.Value(0)).current;
  const [galaxyPreviewColors, setGalaxyPreviewColors] = useState(['#1a0033', '#4a148c', '#7b1fa2']);
  const rainbowPreviewAnim = React.useRef(new Animated.Value(0)).current;
  const [rainbowPreviewColors, setRainbowPreviewColors] = useState(['#FF0000', '#FF8800', '#FFD700', '#8B00FF']);
  const sunsetPreviewAnim = React.useRef(new Animated.Value(0)).current;
  const [sunsetPreviewColors, setSunsetPreviewColors] = useState(['#ef4444', '#f97316', '#fbbf24', '#3b82f6']);
  const retroPreviewAnim = React.useRef(new Animated.Value(0)).current;
  const [retroPreviewColors, setRetroPreviewColors] = useState(['#FF00FF', '#00FFFF', '#FF00FF', '#FFFF00']);
  const blossomPreviewAnim = React.useRef(new Animated.Value(0)).current;
  const [blossomPreviewColors, setBlossomPreviewColors] = useState(['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFE4E1']);
  

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    lockOrientation();

    // Load saved sayings on mount
    loadSavedSayings();

    // Load saved font selection
    loadSavedFontStyle();

    // Load saved background and night mode
    loadSavedBackground();

    // Check for first-time user
    checkFirstTimeUser();

    return () => {
      subscription.remove();
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Check if user is first-time
  const checkFirstTimeUser = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding === null) {
        // First time user - show welcome prompt after a brief delay
        setTimeout(() => {
          setShowWelcomePrompt(true);
        }, 1000);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error checking onboarding status:', error);
      }
    }
  };

  // Handle onboarding completion
  const handleOnboardingClose = async () => {
    setShowOnboarding(false);
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (error) {
      if (__DEV__) {
        console.log('Error saving onboarding status:', error);
      }
    }
  };

  // Start onboarding from welcome prompt
  const startOnboarding = () => {
    setShowWelcomePrompt(false);
    setShowOnboarding(true);
  };

  // Start onboarding from settings
  const replayOnboarding = () => {
    setShowSettings(false);
    setShowOnboarding(true);
  };

  // Pick image from photo library
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to add your photo!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Don't force aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Copy to document directory so it persists across app restarts
        const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const rawExt = (asset.uri.split('.').pop() || '').toLowerCase();
        const ext = validExts.includes(rawExt) ? rawExt : 'jpg';
        const permanentUri = FileSystem.documentDirectory + `customBackground.${ext}`;
        await FileSystem.copyAsync({ from: asset.uri, to: permanentUri });

        setCustomPhotoUri(permanentUri);
        const aspectRatio = asset.width / asset.height;
        setCustomPhotoAspectRatio(aspectRatio);
        setSelectedBackground('customPhoto');
        setShowSettings(false);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error picking image:', error);
      }
      alert('Error selecting photo. Please try again.');
    }
  };

  // Load saved sayings from AsyncStorage
  const loadSavedSayings = async () => {
    try {
      const data = await AsyncStorage.getItem('quickSaySayings');
      if (data) {
        setSavedSayings(JSON.parse(data));
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error loading saved sayings:', error);
      }
    }
  };

  // Load saved font style from AsyncStorage
  const loadSavedFontStyle = async () => {
    try {
      const savedFont = await AsyncStorage.getItem('selectedFontStyle');
      if (savedFont) {
        setSelectedFontStyle(savedFont);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error loading saved font style:', error);
      }
    }
  };

  // Load saved background and night mode from AsyncStorage
  const loadSavedBackground = async () => {
    try {
      const savedBackground = await AsyncStorage.getItem('selectedBackground');
      const savedNightMode = await AsyncStorage.getItem('isNightMode');
      const savedPhotoUri = await AsyncStorage.getItem('customPhotoUri');
      const savedPhotoAspectRatio = await AsyncStorage.getItem('customPhotoAspectRatio');

      if (savedBackground) {
        if (savedBackground === 'customPhoto' && savedPhotoUri) {
          // Verify the file still exists (e.g. user cleared app data)
          const fileInfo = await FileSystem.getInfoAsync(savedPhotoUri);
          if (fileInfo.exists) {
            setSelectedBackground('customPhoto');
            setCustomPhotoUri(savedPhotoUri);
            setCustomPhotoAspectRatio(savedPhotoAspectRatio ? parseFloat(savedPhotoAspectRatio) : null);
          }
        } else if (backgroundConfigs[savedBackground]) {
          setSelectedBackground(savedBackground);
        }
      }
      if (savedNightMode !== null) {
        setIsNightMode(savedNightMode === 'true');
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error loading saved background:', error);
      }
    } finally {
      hasLoadedBackgroundPrefs.current = true;
    }
  };

  // Save background and night mode to AsyncStorage
  const saveBackground = async (background, nightMode, photoUri, photoAspectRatio) => {
    try {
      await AsyncStorage.setItem('selectedBackground', background);
      await AsyncStorage.setItem('isNightMode', nightMode.toString());
      if (background === 'customPhoto' && photoUri) {
        await AsyncStorage.setItem('customPhotoUri', photoUri);
        await AsyncStorage.setItem('customPhotoAspectRatio', String(photoAspectRatio ?? ''));
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error saving background:', error);
      }
    }
  };

  // Save font style to AsyncStorage
  const saveFontStyle = async (fontStyle) => {
    try {
      await AsyncStorage.setItem('selectedFontStyle', fontStyle);
    } catch (error) {
      if (__DEV__) {
        console.log('Error saving font style:', error);
      }
    }
  };

  // Persist background and night mode whenever they change (skip until initial load completes)
  useEffect(() => {
    if (!hasLoadedBackgroundPrefs.current) return;
    saveBackground(selectedBackground, isNightMode, customPhotoUri, customPhotoAspectRatio);
  }, [selectedBackground, isNightMode, customPhotoUri, customPhotoAspectRatio]);

  // Save sayings to AsyncStorage
  const saveSayings = async (sayings) => {
    try {
      await AsyncStorage.setItem('quickSaySayings', JSON.stringify(sayings));
      setSavedSayings(sayings);
    } catch (error) {
      if (__DEV__) {
        console.log('Error saving sayings:', error);
      }
    }
  };

  // Add a new saying
  const handleSaveNewSaying = () => {
    const trimmedText = newSayingText.trim();
    if (trimmedText.length === 0) return;
    if (trimmedText.length > 68) {
      // Truncate to 68 characters
      const truncated = trimmedText.substring(0, 68);
      if (savedSayings.length < 5) {
        const newSayings = [...savedSayings, truncated];
        saveSayings(newSayings);
        setNewSayingText('');
      }
    } else {
      if (savedSayings.length < 5) {
        const newSayings = [...savedSayings, trimmedText];
        saveSayings(newSayings);
        setNewSayingText('');
      }
    }
  };

  // Delete a saying
  const handleDeleteSaying = (index) => {
    const newSayings = savedSayings.filter((_, i) => i !== index);
    saveSayings(newSayings);
  };

  // Insert a saying into the input box
  const handleInsertSaying = (saying) => {
    setText(saying);
    setShowQuickSay(false);
    Keyboard.dismiss();
  };

  // Animate gradient background for theme button
  useEffect(() => {
    const colorSets = [
      ['#E8F4F8', '#F0E6F5'], // Light blue to light purple
      ['#F0E6F5', '#FFE5E5'], // Light purple to light pink
      ['#FFE5E5', '#FFF5E1'], // Light pink to light peach
      ['#FFF5E1', '#E8F4F8'], // Light peach back to light blue
    ];

    const listener = gradientAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      
      setGradientColors([color1, color2]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          }),
          Animated.timing(gradientAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      gradientAnim.removeListener(listener);
    };
  }, []);

  // Animate button gradient background
  useEffect(() => {
    const colorSets = [
      ['#4A90E2', '#357ABD'], // Blue shades
      ['#5B9BD5', '#4A90E2'], // Lighter blue
      ['#357ABD', '#2E6DA4'], // Darker blue
      ['#4A90E2', '#357ABD'], // Back to start
    ];

    const listener = buttonGradientAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      
      setButtonGradientColors([color1, color2]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGradientAnim, {
            toValue: 1,
            duration: 6000, // Slow 6 second transition
            useNativeDriver: false,
          }),
          Animated.timing(buttonGradientAnim, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      buttonGradientAnim.removeListener(listener);
    };
  }, []);



  const playSound = async (soundFile) => {
    try {
      const player = createAudioPlayer(soundFile);
      setSound(player);
      player.play();
    } catch (error) {
      if (__DEV__) {
        console.log('Error playing sound:', error);
      }
    }
  };



  const handleTextChange = (inputText) => {
    // Only allow text changes if under 68 characters or if deleting characters
    if (inputText.length <= 68) {
      setText(inputText);
    }
  };

  const handleEnterPress = () => {
    // playSound(require('./assets/sounds/submit.mp3')); // Uncomment when you add submit.mp3
    const resultsBackgroundColor = isNightMode ? '#1e3a8a' : backgroundColor;
    transitionToResults(resultsBackgroundColor);
  };

  const handleClearAll = () => {
    setText('');
  };

  const animationSources = {
    Hi: HandWave,
    Alert: AnimationAlert,
    Happy: HappyAnimation,
    Sad: SadAnimation,
    Thinking: ThinkingAnimation,
    Love: LoveAnimation,
    Angry: AngryAnimation,
    Funny: FunnyAnimation,
    Ask: AskAnimation,
    Sorry: SorryAnimation,
    ThankYou: ThankYouAnimation,
    Good: GoodAnimation,
  };

  const selectAnimation = (animation) => {
    setSelectedAnimation(selectedAnimation === animation ? null : animation);
  };


  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const waitForOrientation = async (desired) => {
    const current = await ScreenOrientation.getOrientationAsync();
    const isLandscapeDesired = desired === 'LANDSCAPE';
    const isPortraitDesired = desired === 'PORTRAIT';
    if (
      (isLandscapeDesired && (current === ScreenOrientation.Orientation.LANDSCAPE_LEFT || current === ScreenOrientation.Orientation.LANDSCAPE_RIGHT)) ||
      (isPortraitDesired && (current === ScreenOrientation.Orientation.PORTRAIT_UP || current === ScreenOrientation.Orientation.PORTRAIT_DOWN))
    ) {
      return;
    }
    return new Promise((resolve) => {
      const sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
        const o = orientationInfo.orientation;
        if (
          (isLandscapeDesired && (o === ScreenOrientation.Orientation.LANDSCAPE_LEFT || o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT)) ||
          (isPortraitDesired && (o === ScreenOrientation.Orientation.PORTRAIT_UP || o === ScreenOrientation.Orientation.PORTRAIT_DOWN))
        ) {
          ScreenOrientation.removeOrientationChangeListener(sub);
          resolve();
        }
      });
    });
  };

  // Animate tropical gradient background
  useEffect(() => {
    if (selectedBackground !== 'tropical') return;

    const config = backgroundConfigs.tropical;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = tropicalAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets (3 colors for tropical)
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      
      setTropicalColors([color1, color2, color3]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(tropicalAnim, {
            toValue: 1,
            duration: 8000, // Smooth 8 second transition
            useNativeDriver: false,
          }),
          Animated.timing(tropicalAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      tropicalAnim.removeListener(listener);
    };
  }, [selectedBackground, isNightMode]);

  // Animate galaxy gradient background
  useEffect(() => {
    if (selectedBackground !== 'galaxy') return;

    const config = backgroundConfigs.galaxy;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = galaxyAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets (3 colors for galaxy)
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      
      setGalaxyColors([color1, color2, color3]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(galaxyAnim, {
            toValue: 1,
            duration: 10000, // Slower 10 second transition for cosmic feel
            useNativeDriver: false,
          }),
          Animated.timing(galaxyAnim, {
            toValue: 0,
            duration: 10000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      galaxyAnim.removeListener(listener);
    };
  }, [selectedBackground, isNightMode]);

  // Generate stars for galaxy background
  useEffect(() => {
    if (selectedBackground !== 'galaxy') {
      setStarAnimations([]);
      return;
    }

    // Generate 30-40 stars with random positions
    const numStars = 35;
    const stars = [];
    const animations = [];

    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * 100; // Percentage of width
      const y = Math.random() * 100; // Percentage of height
      const size = Math.random() * 2 + 1; // 1-3px
      const delay = Math.random() * 2000; // Random delay for twinkling
      const duration = Math.random() * 2000 + 1500; // 1.5-3.5 seconds
      
      const animValue = new Animated.Value(0.3 + Math.random() * 0.4); // Start at random opacity
      animations.push(animValue);

      stars.push({
        id: i,
        x,
        y,
        size,
        animValue,
        delay,
        duration,
      });
    }

    setStarAnimations(stars);

    // Animate each star independently
    stars.forEach((star) => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(star.animValue, {
            toValue: 0.2 + Math.random() * 0.6,
            duration: star.duration,
            useNativeDriver: true,
          }),
          Animated.timing(star.animValue, {
            toValue: 0.3 + Math.random() * 0.4,
            duration: star.duration,
            useNativeDriver: true,
          }),
        ]).start(() => twinkle());
      };

      setTimeout(() => twinkle(), star.delay);
    });

    return () => {
      animations.forEach(anim => anim.stopAnimation());
    };
  }, [selectedBackground, dimensions]);

  // Animate rainbow gradient background
  useEffect(() => {
    if (selectedBackground !== 'rainbow') return;

    const config = backgroundConfigs.rainbow;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = rainbowAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets (4 colors for rainbow)
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setRainbowColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rainbowAnim, {
            toValue: 1,
            duration: 8000, // Smooth 8 second transition for vibrant rainbow feel
            useNativeDriver: false,
          }),
          Animated.timing(rainbowAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      rainbowAnim.removeListener(listener);
    };
  }, [selectedBackground, isNightMode]);

  // Animate sunset gradient background
  useEffect(() => {
    if (selectedBackground !== 'sunset') return;

    const config = backgroundConfigs.sunset;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = sunsetAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets (4 colors for sunset)
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setSunsetColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sunsetAnim, {
            toValue: 1,
            duration: 8500, // Smooth 8.5 second transition for vibrant sunset feel
            useNativeDriver: false,
          }),
          Animated.timing(sunsetAnim, {
            toValue: 0,
            duration: 8500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      sunsetAnim.removeListener(listener);
    };
  }, [selectedBackground, isNightMode]);

  // Animate retro gradient background
  useEffect(() => {
    if (selectedBackground !== 'retro') return;

    const config = backgroundConfigs.retro;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = retroAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets (4 colors for retro)
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setRetroColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(retroAnim, {
            toValue: 1,
            duration: 7800, // Smooth 7.8 second transition for energetic 80s pop feel
            useNativeDriver: false,
          }),
          Animated.timing(retroAnim, {
            toValue: 0,
            duration: 7800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      retroAnim.removeListener(listener);
    };
  }, [selectedBackground, isNightMode]);

  // Animate blossom gradient background
  useEffect(() => {
    if (selectedBackground !== 'blossom') return;

    const config = backgroundConfigs.blossom;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = blossomAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets (4 colors for blossom)
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setBlossomColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blossomAnim, {
            toValue: 1,
            duration: 8800, // Smooth 8.8 second transition for gentle blossom feel
            useNativeDriver: false,
          }),
          Animated.timing(blossomAnim, {
            toValue: 0,
            duration: 8800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      blossomAnim.removeListener(listener);
    };
  }, [selectedBackground, isNightMode]);

  // Animate preview gradients (always running for preview cards)
  useEffect(() => {
    const config = backgroundConfigs.tropical;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = tropicalPreviewAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      
      setTropicalPreviewColors([color1, color2, color3]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(tropicalPreviewAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(tropicalPreviewAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      tropicalPreviewAnim.removeListener(listener);
    };
  }, [isNightMode]);

  useEffect(() => {
    const config = backgroundConfigs.galaxy;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = galaxyPreviewAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      
      setGalaxyPreviewColors([color1, color2, color3]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(galaxyPreviewAnim, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: false,
          }),
          Animated.timing(galaxyPreviewAnim, {
            toValue: 0,
            duration: 10000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      galaxyPreviewAnim.removeListener(listener);
    };
  }, [isNightMode]);

  useEffect(() => {
    const config = backgroundConfigs.rainbow;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = rainbowPreviewAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setRainbowPreviewColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rainbowPreviewAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(rainbowPreviewAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      rainbowPreviewAnim.removeListener(listener);
    };
  }, [isNightMode]);

  useEffect(() => {
    const config = backgroundConfigs.sunset;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = sunsetPreviewAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setSunsetPreviewColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sunsetPreviewAnim, {
            toValue: 1,
            duration: 8500,
            useNativeDriver: false,
          }),
          Animated.timing(sunsetPreviewAnim, {
            toValue: 0,
            duration: 8500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      sunsetPreviewAnim.removeListener(listener);
    };
  }, [isNightMode]);

  useEffect(() => {
    const config = backgroundConfigs.retro;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = retroPreviewAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setRetroPreviewColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(retroPreviewAnim, {
            toValue: 1,
            duration: 7800,
            useNativeDriver: false,
          }),
          Animated.timing(retroPreviewAnim, {
            toValue: 0,
            duration: 7800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      retroPreviewAnim.removeListener(listener);
    };
  }, [isNightMode]);

  useEffect(() => {
    const config = backgroundConfigs.blossom;
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;

    const listener = blossomPreviewAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      const color3 = interpolateColor(colorSets[index][2], colorSets[nextIndex][2], progress);
      const color4 = interpolateColor(colorSets[index][3], colorSets[nextIndex][3], progress);
      
      setBlossomPreviewColors([color1, color2, color3, color4]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blossomPreviewAnim, {
            toValue: 1,
            duration: 8800,
            useNativeDriver: false,
          }),
          Animated.timing(blossomPreviewAnim, {
            toValue: 0,
            duration: 8800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      blossomPreviewAnim.removeListener(listener);
    };
  }, [isNightMode]);

  const transitionToResults = async (resultsBackgroundColor) => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      // Wait a bit for orientation to actually change before navigating
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (e) {
      if (__DEV__) {
        console.log('Orientation lock failed (continuing):', e);
      }
    } finally {
      navigation.navigate('PocketSayResults', { 
        text, 
        selectedAnimation, 
        backgroundColor: resultsBackgroundColor, 
        fontStyle: selectedFontStyle, 
        backgroundType: selectedBackground,
        isNightMode: isNightMode,
        customDayColor: customDayColor,
        customNightColor: customNightColor,
        textDayColor: textDayColor,
        textNightColor: textNightColor,
        customPhotoUri: customPhotoUri,
        customPhotoAspectRatio: customPhotoAspectRatio
      });
    }
  };

  // Font styles mapping - Distinctive, modern fonts that stand out
  const fontStyles = {
    default: { 
      name: 'Default', 
      fontFamily: undefined, 
      fontWeight: 'bold', 
      fontStyle: 'normal',
      letterSpacing: 0,
      textTransform: 'none'
    },
    modern: { 
      name: 'Modern', 
      fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
      fontWeight: '600', 
      fontStyle: 'normal', 
      letterSpacing: 2,
      textTransform: 'uppercase'
    },
    sleek: { 
      name: 'Sleek', 
      fontFamily: undefined,
      fontWeight: '200', 
      fontStyle: 'normal', 
      letterSpacing: 3,
      textTransform: 'none'
    },
    cartoon: { 
      name: 'Cartoon', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    elegant: { 
      name: 'Elegant', 
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontWeight: '400', 
      fontStyle: 'italic', 
      letterSpacing: 1.5,
      textTransform: 'none'
    },
    futuristic: { 
      name: 'Futuristic', 
      fontFamily: undefined,
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 2.5,
      textTransform: 'uppercase'
    },
    handwritten: { 
      name: 'Handwritten', 
      fontFamily: Platform.OS === 'ios' ? 'Chalkduster' : 'cursive',
      fontWeight: '400', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    retro: { 
      name: 'Retro', 
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    },
    minimalist: { 
      name: 'Minimalist', 
      fontFamily: undefined,
      fontWeight: '300', 
      fontStyle: 'normal',
      letterSpacing: 4,
      textTransform: 'lowercase'
    },
    bold: { 
      name: 'Bold', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: -0.5,
      textTransform: 'none'
    },
  };

  const renderThemeCards = () => {
    const themes = [
      { key: 'Hi', label: 'Wave', emoji: '👋', color: '#4CAF50' },
      { key: 'Happy', label: 'Happy', emoji: '😊', color: '#FFEB3B' },
      { key: 'Love', label: 'Love', emoji: '❤️', color: '#F44336' },
      { key: 'Funny', label: 'Funny', emoji: '😂', color: '#FF9800' },
      { key: 'Good', label: 'Good', emoji: '👍', color: '#00BCD4' },
      { key: 'ThankYou', label: 'Thanks', emoji: '🙏', color: '#4CAF50' },
      { key: 'Sorry', label: 'Sorry', emoji: '😔', color: '#607D8B' },
      { key: 'Sad', label: 'Sad', emoji: '😢', color: '#2196F3' },
      { key: 'Angry', label: 'Angry', emoji: '😠', color: '#FF5722' },
      { key: 'Thinking', label: 'Think', emoji: '🤔', color: '#9C27B0' },
      { key: 'Ask', label: 'Ask', emoji: '❓', color: '#9C27B0' },
      { key: 'Alert', label: 'Alert', emoji: '⚠️', color: '#FF9800' },
    ];

    return themes.map((theme) => (
      <TouchableOpacity
        key={theme.key}
        style={[
          styles.themeCard,
          isNightMode && styles.themeCardNight,
          selectedAnimation === theme.key && styles.selectedThemeCard,
          selectedAnimation === theme.key && isNightMode && styles.selectedThemeCardNight,
          { borderColor: theme.color }
        ]}
        onPress={() => selectAnimation(theme.key)}
        accessibilityLabel={`Select ${theme.label} theme`}
      >
        <View style={[
          styles.themeEmoji, 
          { backgroundColor: theme.color + '20' },
          theme.key === 'Happy' && styles.happyEmojiContainer
        ]}>
          <LottieView
            source={animationSources[theme.key]}
            autoPlay
            loop
            style={[
              styles.themeEmojiLottie,
              theme.key === 'Happy' && styles.happyEmojiLottie,
              theme.key === 'Angry' && styles.angryEmojiLottie
            ]}
          />
          {selectedAnimation === theme.key && (
            <View style={[
              styles.checkmarkContainer,
              isNightMode && styles.checkmarkContainerNight
            ]}>
              <Ionicons name="checkmark" size={12} color={isNightMode ? "#81b0ff" : "#007AFF"} />
            </View>
          )}
        </View>
        <Text style={[
          styles.themeLabel,
          isNightMode && styles.themeLabelNight,
          selectedAnimation === theme.key && styles.selectedThemeLabel,
          selectedAnimation === theme.key && isNightMode && styles.selectedThemeLabelNight
        ]}>
          {theme.label}
        </Text>
      </TouchableOpacity>
    ));
  };

  const toggleNightMode = (value) => {
    if (__DEV__) {
      console.log('Night mode toggled:', value);
    }
    setIsNightMode(value);
  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: isNightMode ? '#000000' : 'transparent' }]} edges={['top']}>
        <StatusBar style="dark" />
      {/* Background rendering based on selected type */}
      {backgroundConfigs[selectedBackground] && backgroundConfigs[selectedBackground].type === 'lottie' && (
        <LottieView
          source={isNightMode ? backgroundConfigs[selectedBackground].night : backgroundConfigs[selectedBackground].day}
          autoPlay
          loop
          style={{
            position: 'absolute',
            width: dimensions.width + 100,
            height: dimensions.height + 150,
            top: -100,
            left: -50,
            right: -50,
            bottom: -50,
          }}
        />
      )}
      {backgroundConfigs[selectedBackground] && backgroundConfigs[selectedBackground].type === 'gradient' && (
        <LinearGradient
          colors={isNightMode ? backgroundConfigs[selectedBackground].night.colors : backgroundConfigs[selectedBackground].day.colors}
          start={isNightMode ? backgroundConfigs[selectedBackground].night.start : backgroundConfigs[selectedBackground].day.start}
          end={isNightMode ? backgroundConfigs[selectedBackground].night.end : backgroundConfigs[selectedBackground].day.end}
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      {backgroundConfigs[selectedBackground] && backgroundConfigs[selectedBackground].type === 'animated-gradient' && (
        <>
          <LinearGradient
            colors={
              selectedBackground === 'tropical' ? tropicalColors :
              selectedBackground === 'galaxy' ? galaxyColors :
              selectedBackground === 'rainbow' ? rainbowColors :
              selectedBackground === 'sunset' ? sunsetColors :
              selectedBackground === 'retro' ? retroColors :
              blossomColors
            }
            start={isNightMode ? backgroundConfigs[selectedBackground].night.start : backgroundConfigs[selectedBackground].day.start}
            end={isNightMode ? backgroundConfigs[selectedBackground].night.end : backgroundConfigs[selectedBackground].day.end}
            style={{
              position: 'absolute',
              width: dimensions.width,
              height: dimensions.height,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          {selectedBackground === 'galaxy' && starAnimations.map((star) => (
            <Animated.View
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
                backgroundColor: '#ffffff',
                opacity: star.animValue,
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
              }}
            />
          ))}
        </>
      )}
      {backgroundConfigs[selectedBackground] && backgroundConfigs[selectedBackground].type === 'solid' && (
        <View
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isNightMode 
              ? backgroundConfigs[selectedBackground].night?.color
              : backgroundConfigs[selectedBackground].day?.color,
          }}
        />
      )}
      {/* Custom color background (when no background is selected or custom mode is active) */}
      {(!backgroundConfigs[selectedBackground] || selectedBackground === 'custom') && selectedBackground !== 'customPhoto' && (
        <View
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isNightMode ? customNightColor : customDayColor,
          }}
        />
      )}
      {/* Custom photo background */}
      {selectedBackground === 'customPhoto' && customPhotoUri && (() => {
        // Determine screen orientation
        const screenAspectRatio = dimensions.width / dimensions.height;
        const isScreenPortrait = screenAspectRatio < 1;
        
        // Determine photo orientation
        const isPhotoPortrait = customPhotoAspectRatio !== null && customPhotoAspectRatio < 1;
        
        // Always use 'cover' to fill screen and avoid white space
        // When orientations match, it will fill nicely with minimal cropping
        // When orientations don't match, it will crop appropriately
        const resizeMode = 'cover';
        
        return (
          <Image
            source={{ uri: customPhotoUri }}
            style={{
              position: 'absolute',
              width: dimensions.width,
              height: dimensions.height,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            resizeMode={resizeMode}
          />
        );
      })()}
      <KeyboardAvoidingView 
        style={[styles.contentContainer, { height: dimensions.height }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
          <TouchableWithoutFeedback onPress={() => {
            if (!showQuickSay && !showFontDropdown && !isThemeSectionExpanded) {
              dismissKeyboard();
              setShowFontDropdown(false);
              setIsThemeSectionExpanded(false);
            }
          }}>
            <ScrollView 
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputContainer}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>{isNightMode ? '🌙' : '☀️'}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      if (__DEV__) {
                        console.log('Switch tapped, current state:', isNightMode);
                      }
                      setIsNightMode(!isNightMode);
                    }}
                    style={styles.switchButton}
                  >
                    <View style={[styles.switchTrack, isNightMode && styles.switchTrackActive]}>
                      <View style={[styles.switchThumb, isNightMode && styles.switchThumbActive]} />
                    </View>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.input, 
                    isNightMode && styles.inputNightMode,
                    text.length >= 68 && styles.inputLimitReached,
                    selectedAnimation !== null && { paddingRight: 65 },
                    {
                      fontFamily: fontStyles[selectedFontStyle]?.fontFamily,
                      fontWeight: fontStyles[selectedFontStyle]?.fontWeight,
                      fontStyle: fontStyles[selectedFontStyle]?.fontStyle,
                      letterSpacing: fontStyles[selectedFontStyle]?.letterSpacing,
                    }
                  ]}
                  onChangeText={handleTextChange}
                  value={text}
                  placeholder="Type your text here"
                  placeholderTextColor={isNightMode ? "#bbb" : "#666"} 
                  accessibilityHint="Enter your text to see animated results"
                  maxLength={68}
                  multiline={true}
                />
                {selectedAnimation !== null && (
                  <View style={styles.inputAnimationPreview} pointerEvents="none">
                    <LottieView
                      source={animationSources[selectedAnimation]}
                      autoPlay
                      loop
                      resizeMode="contain"
                      style={[
                        styles.inputAnimationPreviewLottie,
                        selectedAnimation === 'Sad' && { transform: [{ scale: 0.85 }] },
                        selectedAnimation === 'Happy' && { transform: [{ scale: 1.15 }] },
                      ]}
                    />
                  </View>
                )}
                {text.length > 0 && (
                  <Text style={[
                    styles.characterCount, 
                    isNightMode && styles.characterCountNight,
                    text.length >= 68 && styles.characterCountLimitReached
                  ]}>
                    {text.length}/68
                  </Text>
                )}
                {text !== '' && (
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                    <Ionicons name="close" size={24} color={isNightMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={handleEnterPress} activeOpacity={0.8}>
                <LinearGradient
                  colors={buttonGradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.buttonText}>Display</Text>
                </LinearGradient>
              </TouchableOpacity>
            <View style={styles.themeSection}>
              <View style={styles.themeButtonRow}>
                <TouchableOpacity 
                  onPress={() => {
                    setIsThemeSectionExpanded(!isThemeSectionExpanded);
                    setShowFontDropdown(false);
                    setShowQuickSay(false);
                  }}
                  activeOpacity={0.8}
                  style={styles.themeButtonWrapper}
                >
                  <LinearGradient
                    colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.themeTitleContainer,
                      isNightMode && styles.themeTitleContainerNight,
                      isThemeSectionExpanded && styles.themeTitleContainerSelected,
                      isThemeSectionExpanded && isNightMode && styles.themeTitleContainerSelectedNight,
                      selectedAnimation !== null && styles.themeTitleContainerHasSelection,
                      selectedAnimation !== null && isNightMode && styles.themeTitleContainerHasSelectionNight
                    ]}
                  >
                    <Text style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Emoji</Text>
                    {selectedAnimation !== null && (
                      <View style={styles.selectionIndicatorDot} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowFontDropdown(!showFontDropdown);
                    setIsThemeSectionExpanded(false);
                    setShowQuickSay(false);
                  }}
                  activeOpacity={0.8}
                  style={styles.themeButtonWrapper}
                >
                  <LinearGradient
                    colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.themeTitleContainer,
                      isNightMode && styles.themeTitleContainerNight,
                      showFontDropdown && styles.themeTitleContainerSelected,
                      showFontDropdown && isNightMode && styles.themeTitleContainerSelectedNight
                    ]}
                  >
                    <Text style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Font</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowQuickSay(!showQuickSay);
                    setIsThemeSectionExpanded(false);
                    setShowFontDropdown(false);
                  }}
                  activeOpacity={0.8}
                  style={styles.themeButtonWrapper}
                >
                  <LinearGradient
                    colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.themeTitleContainer,
                      isNightMode && styles.themeTitleContainerNight,
                      showQuickSay && styles.themeTitleContainerSelected,
                      showQuickSay && isNightMode && styles.themeTitleContainerSelectedNight
                    ]}
                  >
                    <Text style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Quick Say</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              {showFontDropdown && (
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={[
                    styles.fontDropdown,
                    isNightMode && styles.fontDropdownNight
                  ]}>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.fontDropdownContent}
                      nestedScrollEnabled={true}
                    >
                      {Object.entries(fontStyles).map(([key, style]) => (
                        <TouchableOpacity
                          key={key}
                          onPress={() => {
                            setSelectedFontStyle(key);
                            saveFontStyle(key);
                          }}
                          activeOpacity={0.7}
                          style={[
                            styles.fontButton,
                            isNightMode && styles.fontButtonNight,
                            selectedFontStyle === key && styles.selectedFontButton,
                            selectedFontStyle === key && isNightMode && styles.selectedFontButtonNight
                          ]}
                        >
                          <Text 
                            style={[
                              styles.fontButtonText,
                              isNightMode && styles.fontButtonTextNight,
                              selectedFontStyle === key && styles.selectedFontButtonText,
                              {
                                fontFamily: style.fontFamily,
                                fontWeight: style.fontWeight,
                                fontStyle: style.fontStyle,
                                letterSpacing: style.letterSpacing,
                                textTransform: style.textTransform,
                              }
                            ]}
                            numberOfLines={1}
                          >
                            {style.name}
                          </Text>
                          {selectedFontStyle === key && (
                            <View style={[
                              styles.fontCheckmarkContainer,
                              isNightMode && styles.fontCheckmarkContainerNight
                            ]}>
                              <Ionicons 
                                name="checkmark" 
                                size={14} 
                                color="#FFFFFF"
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {isThemeSectionExpanded && (
                <View style={styles.themeCardsContainer}>
                  {renderThemeCards()}
                </View>
              )}
              {showQuickSay && (
                <View style={[
                  styles.quickSayDropdown,
                  isNightMode && styles.quickSayDropdownNight
                ]}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                  >
                    <ScrollView 
                      ref={quickSayScrollViewRef}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={[
                        styles.quickSayContent,
                        savedSayings.length === 0 && styles.quickSayContentNoItems
                      ]}
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="handled"
                      keyboardDismissMode="none"
                      bounces={false}
                    >
                      {/* Saved Sayings List */}
                      {savedSayings.length > 0 && (
                        <View style={styles.savedSayingsContainer}>
                          {savedSayings.map((saying, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => handleInsertSaying(saying)}
                              activeOpacity={0.7}
                              style={[
                                styles.sayingCard,
                                isNightMode && styles.sayingCardNight
                              ]}
                            >
                              <View style={styles.sayingCardContent}>
                                <Text 
                                  style={[
                                    styles.sayingPreview,
                                    isNightMode && styles.sayingPreviewNight
                                  ]}
                                  numberOfLines={1}
                                >
                                  {saying}
                                </Text>
                                <Text style={[
                                  styles.sayingLength,
                                  isNightMode && styles.sayingLengthNight
                                ]}>
                                  {saying.length}/68
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => handleDeleteSaying(index)}
                                style={styles.deleteSayingButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                              >
                                <Ionicons 
                                  name="close-circle" 
                                  size={18} 
                                  color={isNightMode ? '#ff6b6b' : '#ff4444'} 
                                />
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                      
                      {/* Add New Saying Section */}
                      <View style={styles.addSayingContainer}>
                        <Text style={[
                          styles.addSayingTitle,
                          isNightMode && styles.addSayingTitleNight
                        ]}>
                          {savedSayings.length >= 5 ? 'Maximum 5 sayings reached' : 'Add New Saying'}
                        </Text>
                        <View style={styles.addSayingInputContainer}>
                          <TextInput
                            style={[
                              styles.addSayingInput,
                              isNightMode && styles.addSayingInputNight,
                              newSayingText.length >= 68 && styles.addSayingInputLimit
                            ]}
                            value={newSayingText}
                            onChangeText={(text) => {
                              if (text.length <= 68) {
                                setNewSayingText(text);
                              }
                            }}
                            onFocus={() => {
                              // Scroll to input when focused to keep it visible above keyboard
                              setTimeout(() => {
                                quickSayScrollViewRef.current?.scrollToEnd({ animated: true });
                              }, 300);
                            }}
                            placeholder="Type a saying to save..."
                            placeholderTextColor={isNightMode ? "#888" : "#999"}
                            maxLength={68}
                            multiline={true}
                            editable={savedSayings.length < 5}
                          />
                          <Text style={[
                            styles.addSayingCharCount,
                            isNightMode && styles.addSayingCharCountNight,
                            newSayingText.length >= 68 && styles.addSayingCharCountLimit
                          ]}>
                            {newSayingText.length}/68
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={handleSaveNewSaying}
                          disabled={newSayingText.trim().length === 0 || savedSayings.length >= 5}
                          activeOpacity={0.7}
                          style={[
                            styles.saveSayingButton,
                            (newSayingText.trim().length === 0 || savedSayings.length >= 5) && styles.saveSayingButtonDisabled,
                            isNightMode && styles.saveSayingButtonNight
                          ]}
                        >
                          <LinearGradient
                            colors={
                              (newSayingText.trim().length === 0 || savedSayings.length >= 5)
                                ? ['#999', '#777']
                                : buttonGradientColors
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.saveSayingButtonGradient}
                          >
                            <Text style={styles.saveSayingButtonText}>Save</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </KeyboardAvoidingView>
                </View>
              )}
            </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* Settings button */}
        <TouchableOpacity
          style={[
            styles.settingsButton,
            isNightMode && styles.settingsButtonNight
          ]}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={isNightMode ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
        {/* Tutorial button */}
        <TouchableOpacity
          style={[
            styles.tutorialButton,
            isNightMode && styles.tutorialButtonNight
          ]}
          onPress={() => setShowOnboarding(true)}
        >
          <Ionicons 
            name="school-outline" 
            size={24} 
            color={isNightMode ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
        {/* Settings Modal */}
        <Modal
          visible={showSettings}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSettings(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[
                  styles.settingsModal,
                  isNightMode && styles.settingsModalNight
                ]}>
                  <View style={[
                    styles.settingsHeader,
                    isNightMode && styles.settingsHeaderNight
                  ]}>
                    <Text style={[
                      styles.settingsTitle,
                      isNightMode && styles.settingsTitleNight
                    ]}>
                      Settings
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowSettings(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons 
                        name="close" 
                        size={24} 
                        color={isNightMode ? '#ffffff' : '#000000'} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.settingsContent}>
                    {/* Background Options Section */}
                    <View style={styles.settingsSection}>
                      <Text style={[
                        styles.settingsSectionTitle,
                        isNightMode && styles.settingsSectionTitleNight
                      ]}>
                        Animated Background
                      </Text>
                      <View style={styles.backgroundGrid}>
                        {Object.entries(backgroundConfigs).map(([key, config]) => (
                          <TouchableOpacity
                            key={key}
                            onPress={() => {
                              setSelectedBackground(key);
                              setShowSettings(false);
                            }}
                            style={[
                              styles.backgroundOption,
                              selectedBackground === key && styles.backgroundOptionSelected
                            ]}
                          >
                            {config.type === 'lottie' ? (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <LottieView
                                  source={isNightMode ? config.night : config.day}
                                  autoPlay
                                  loop
                                  style={styles.backgroundLottiePreview}
                                />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            ) : config.type === 'gradient' ? (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <LinearGradient
                                  colors={isNightMode ? config.night.colors : config.day.colors}
                                  start={isNightMode ? config.night.start : config.day.start}
                                  end={isNightMode ? config.night.end : config.day.end}
                                  style={styles.backgroundGradientPreview}
                                />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            ) : config.type === 'animated-gradient' ? (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <LinearGradient
                                  colors={
                                    key === 'tropical' ? tropicalPreviewColors :
                                    key === 'galaxy' ? galaxyPreviewColors :
                                    key === 'rainbow' ? rainbowPreviewColors :
                                    key === 'sunset' ? sunsetPreviewColors :
                                    key === 'retro' ? retroPreviewColors :
                                    blossomPreviewColors
                                  }
                                  start={isNightMode ? config.night.start : config.day.start}
                                  end={isNightMode ? config.night.end : config.day.end}
                                  style={styles.backgroundGradientPreview}
                                />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <View style={[
                                  styles.backgroundGradientPreview,
                                  { backgroundColor: isNightMode ? config.night.color : config.day.color }
                                ]} />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            )}
                            <Text style={[
                              styles.backgroundOptionLabel,
                              isNightMode && styles.backgroundOptionLabelNight
                            ]}>
                              {config.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                        {/* Photo Picker Button */}
                        <TouchableOpacity
                          onPress={pickImage}
                          style={[
                            styles.backgroundOption,
                            selectedBackground === 'customPhoto' && styles.backgroundOptionSelected
                          ]}
                        >
                          <View style={[
                            styles.backgroundPreview,
                            selectedBackground === 'customPhoto' && { borderColor: '#007AFF' },
                            { 
                              backgroundColor: isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }
                          ]}>
                            {customPhotoUri ? (
                              <>
                                <Image 
                                  source={{ uri: customPhotoUri }} 
                                  style={styles.backgroundGradientPreview}
                                  resizeMode="cover"
                                />
                                {selectedBackground === 'customPhoto' && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </>
                            ) : (
                              <>
                                <Ionicons 
                                  name="camera-outline" 
                                  size={32} 
                                  color={isNightMode ? '#ffffff' : '#000000'} 
                                />
                                <Ionicons 
                                  name="add-circle" 
                                  size={20} 
                                  color={isNightMode ? '#ffffff' : '#000000'} 
                                  style={{ position: 'absolute', bottom: 8, right: 8 }}
                                />
                              </>
                            )}
                          </View>
                          <Text style={[
                            styles.backgroundOptionLabel,
                            isNightMode && styles.backgroundOptionLabelNight
                          ]}>
                            {customPhotoUri ? 'My Photo' : 'Add Photo'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Custom Color Picker Section */}
                    <View style={styles.settingsSection}>
                      <Text style={[
                        styles.settingsSectionTitle,
                        isNightMode && styles.settingsSectionTitleNight
                      ]}>
                        Background
                      </Text>
                      
                      {/* Tab Buttons */}
                      <View style={styles.themeButtonRow}>
                        <TouchableOpacity 
                          onPress={() => {
                            setCustomColorTab('day');
                          }}
                          activeOpacity={0.8}
                          style={styles.themeButtonWrapper}
                        >
                          <LinearGradient
                            colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                              styles.themeTitleContainer,
                              isNightMode && styles.themeTitleContainerNight,
                              customColorTab === 'day' && styles.themeTitleContainerSelected,
                              customColorTab === 'day' && isNightMode && styles.themeTitleContainerSelectedNight
                            ]}
                          >
                            <Text numberOfLines={1} style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Day Mode</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => {
                            setCustomColorTab('night');
                          }}
                          activeOpacity={0.8}
                          style={styles.themeButtonWrapper}
                        >
                          <LinearGradient
                            colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                              styles.themeTitleContainer,
                              isNightMode && styles.themeTitleContainerNight,
                              customColorTab === 'night' && styles.themeTitleContainerSelected,
                              customColorTab === 'night' && isNightMode && styles.themeTitleContainerSelectedNight,
                              { paddingHorizontal: 24, minWidth: 130 }
                            ]}
                          >
                            <Text numberOfLines={1} style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Night Mode</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                      
                      {/* Day Mode Color Picker - 8 primary colors */}
                      {customColorTab === 'day' && (
                        <View style={styles.colorPickerContainer}>
                          <View style={styles.colorGrid}>
                            {[
                              '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                              '#FFFF00', '#00FFFF', '#FF00FF', '#000000'
                            ].map((color, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  setCustomDayColor(color);
                                  setSelectedBackground('custom');
                                }}
                                style={[
                                  styles.colorSwatch,
                                  customDayColor === color && styles.colorSwatchSelected,
                                  { backgroundColor: color },
                                  customDayColor === color && { borderColor: isNightMode ? '#81b0ff' : '#007AFF' }
                                ]}
                              >
                                {customDayColor === color && (
                                  <Ionicons name="checkmark" size={16} color={isNightMode ? '#81b0ff' : '#007AFF'} />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                      
                      {/* Night Mode Color Picker - 8 primary colors */}
                      {customColorTab === 'night' && (
                        <View style={styles.colorPickerContainer}>
                          <View style={styles.colorGrid}>
                            {[
                              '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                              '#FFFF00', '#00FFFF', '#FF00FF', '#000000'
                            ].map((color, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  setCustomNightColor(color);
                                  setSelectedBackground('custom');
                                }}
                                style={[
                                  styles.colorSwatch,
                                  customNightColor === color && styles.colorSwatchSelected,
                                  { backgroundColor: color },
                                  customNightColor === color && { borderColor: isNightMode ? '#81b0ff' : '#007AFF' }
                                ]}
                              >
                                {customNightColor === color && (
                                  <Ionicons name="checkmark" size={16} color={isNightMode ? '#81b0ff' : '#007AFF'} />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                    
                    {/* Text Color Picker Section */}
                    <View style={styles.settingsSection}>
                      <Text style={[
                        styles.settingsSectionTitle,
                        isNightMode && styles.settingsSectionTitleNight
                      ]}>
                        Text
                      </Text>
                      
                      {/* Tab Buttons */}
                      <View style={styles.themeButtonRow}>
                        <TouchableOpacity 
                          onPress={() => {
                            setTextColorTab('day');
                          }}
                          activeOpacity={0.8}
                          style={styles.themeButtonWrapper}
                        >
                          <LinearGradient
                            colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                              styles.themeTitleContainer,
                              isNightMode && styles.themeTitleContainerNight,
                              textColorTab === 'day' && styles.themeTitleContainerSelected,
                              textColorTab === 'day' && isNightMode && styles.themeTitleContainerSelectedNight
                            ]}
                          >
                            <Text numberOfLines={1} style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Day Mode</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => {
                            setTextColorTab('night');
                          }}
                          activeOpacity={0.8}
                          style={styles.themeButtonWrapper}
                        >
                          <LinearGradient
                            colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                              styles.themeTitleContainer,
                              isNightMode && styles.themeTitleContainerNight,
                              textColorTab === 'night' && styles.themeTitleContainerSelected,
                              textColorTab === 'night' && isNightMode && styles.themeTitleContainerSelectedNight,
                              { paddingHorizontal: 24, minWidth: 130 }
                            ]}
                          >
                            <Text numberOfLines={1} style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Night Mode</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                      
                      {/* Day Mode Text Color Picker - 8 primary colors */}
                      {textColorTab === 'day' && (
                        <View style={styles.colorPickerContainer}>
                          <View style={styles.colorGrid}>
                            {[
                              '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                              '#FFFF00', '#00FFFF', '#FF00FF', '#000000'
                            ].map((color, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  setTextDayColor(color);
                                }}
                                style={[
                                  styles.colorSwatch,
                                  textDayColor === color && styles.colorSwatchSelected,
                                  { backgroundColor: color },
                                  textDayColor === color && { borderColor: isNightMode ? '#81b0ff' : '#007AFF' }
                                ]}
                              >
                                {textDayColor === color && (
                                  <Ionicons name="checkmark" size={16} color={isNightMode ? '#81b0ff' : '#007AFF'} />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                      
                      {/* Night Mode Text Color Picker - 8 primary colors */}
                      {textColorTab === 'night' && (
                        <View style={styles.colorPickerContainer}>
                          <View style={styles.colorGrid}>
                            {[
                              '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                              '#FFFF00', '#00FFFF', '#FF00FF', '#000000'
                            ].map((color, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  setTextNightColor(color);
                                }}
                                style={[
                                  styles.colorSwatch,
                                  textNightColor === color && styles.colorSwatchSelected,
                                  { backgroundColor: color },
                                  textNightColor === color && { borderColor: isNightMode ? '#81b0ff' : '#007AFF' }
                                ]}
                              >
                                {textNightColor === color && (
                                  <Ionicons name="checkmark" size={16} color={isNightMode ? '#81b0ff' : '#007AFF'} />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                    
                    
                    {/* Future customizations can be added here */}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        {/* Welcome Prompt Modal */}
        <Modal
          visible={showWelcomePrompt}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowWelcomePrompt(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowWelcomePrompt(false)}>
            <View style={styles.welcomePromptOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <Animated.View style={[
                  styles.welcomePromptContainer,
                  isNightMode && styles.welcomePromptContainerNight
                ]}>
                  <LinearGradient
                    colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : ['#ffffff', '#f5f5f5']}
                    style={styles.welcomePromptContent}
                  >
                    <LottieView
                      source={HandWave}
                      autoPlay
                      loop
                      style={styles.welcomePromptAnimation}
                    />
                    <Text 
                      allowFontScaling={false}
                      style={[
                        styles.welcomePromptTitle,
                        isNightMode && styles.welcomePromptTitleNight
                      ]}>
                      Welcome to PocketSay!
                    </Text>
                    <Text 
                      allowFontScaling={false}
                      style={[
                        styles.welcomePromptText,
                        isNightMode && styles.welcomePromptTextNight
                      ]}>
                      New to PocketSay? We'll guide you through 7 simple steps to get you creating beautiful animated messages in no time!
                    </Text>
                    <View style={styles.welcomePromptButtons}>
                      <TouchableOpacity
                        onPress={() => setShowWelcomePrompt(false)}
                        style={[
                          styles.welcomePromptButtonSecondary,
                          isNightMode && styles.welcomePromptButtonSecondaryNight
                        ]}
                      >
                        <Text 
                          allowFontScaling={false}
                          style={[
                            styles.welcomePromptButtonSecondaryText,
                            isNightMode && styles.welcomePromptButtonSecondaryTextNight
                          ]}>
                          Maybe Later
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={startOnboarding}
                        style={styles.welcomePromptButtonPrimary}
                      >
                        <LinearGradient
                          colors={['#4A90E2', '#357ABD']}
                          style={styles.welcomePromptButtonPrimaryGradient}
                        >
                          <Text 
                            allowFontScaling={false}
                            style={styles.welcomePromptButtonPrimaryText}>
                            Get Started
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        {/* Onboarding Slideshow */}
        <OnboardingSlideshow
          visible={showOnboarding}
          onClose={handleOnboardingClose}
          isNightMode={isNightMode}
          dimensions={dimensions}
        />
        
        {/* Removed pre-navigation black overlay to avoid initial black-screen stall */}
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={styles.bottomSafeAreaContainer} />
    </View>
  );
};

const PocketSayScreen = ({ route, navigation }) => {
  const { 
    text, 
    selectedAnimation, 
    backgroundColor, 
    fontStyle = 'default',
    backgroundType = 'mountains',
    isNightMode: initialNightMode = false,
    customDayColor = '#f7e5e7',
    customNightColor = '#1e3a8a',
    textDayColor = '#000000',
    textNightColor = '#ffffff',
    customPhotoUri = null,
    customPhotoAspectRatio = null
  } = route.params || {};
  const [sound, setSound] = useState();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeOpacity = React.useRef(new Animated.Value(1)).current;
  const [winDims, setWinDims] = useState(Dimensions.get('window'));
  const [dimensionsReady, setDimensionsReady] = useState(false);
  
  // Use passed night mode or determine from background color
  const [isNightMode, setIsNightMode] = useState(initialNightMode || backgroundColor === '#1e3a8a');
  // Store the original light mode color (default to '#f7e5e7' if we started in night mode)
  const originalLightColor = backgroundColor === '#1e3a8a' ? '#f7e5e7' : backgroundColor;
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);
  
  // Animated gradient states
  const tropicalAnim = React.useRef(new Animated.Value(0)).current;
  const [tropicalColors, setTropicalColors] = useState(['#40E0D0', '#FF6B6B', '#7FCDBB']);
  const galaxyAnim = React.useRef(new Animated.Value(0)).current;
  const [galaxyColors, setGalaxyColors] = useState(['#1a0033', '#4a148c', '#7b1fa2']);
  const rainbowAnim = React.useRef(new Animated.Value(0)).current;
  const [rainbowColors, setRainbowColors] = useState(['#FF0000', '#FF8800', '#FFD700', '#8B00FF']);
  const sunsetAnim = React.useRef(new Animated.Value(0)).current;
  const [sunsetColors, setSunsetColors] = useState(['#ef4444', '#f97316', '#fbbf24', '#3b82f6']);
  const retroAnim = React.useRef(new Animated.Value(0)).current;
  const [retroColors, setRetroColors] = useState(['#FF00FF', '#00FFFF', '#FF00FF', '#FFFF00']);
  const blossomAnim = React.useRef(new Animated.Value(0)).current;
  const [blossomColors, setBlossomColors] = useState(['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFE4E1']);
  const [starAnimations, setStarAnimations] = useState([]);
  
  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  // Font styles mapping (same as HomeScreen)
  const fontStyles = {
    default: { 
      name: 'Default', 
      fontFamily: undefined, 
      fontWeight: 'bold', 
      fontStyle: 'normal',
      letterSpacing: 0,
      textTransform: 'none'
    },
    modern: { 
      name: 'Modern', 
      fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
      fontWeight: '600', 
      fontStyle: 'normal', 
      letterSpacing: 2,
      textTransform: 'uppercase'
    },
    sleek: { 
      name: 'Sleek', 
      fontFamily: undefined,
      fontWeight: '200', 
      fontStyle: 'normal', 
      letterSpacing: 3,
      textTransform: 'none'
    },
    cartoon: { 
      name: 'Cartoon', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    elegant: { 
      name: 'Elegant', 
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontWeight: '400', 
      fontStyle: 'italic', 
      letterSpacing: 1.5,
      textTransform: 'none'
    },
    futuristic: { 
      name: 'Futuristic', 
      fontFamily: undefined,
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 2.5,
      textTransform: 'uppercase'
    },
    handwritten: { 
      name: 'Handwritten', 
      fontFamily: Platform.OS === 'ios' ? 'Chalkduster' : 'cursive',
      fontWeight: '400', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    retro: { 
      name: 'Retro', 
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    },
    minimalist: { 
      name: 'Minimalist', 
      fontFamily: undefined,
      fontWeight: '300', 
      fontStyle: 'normal',
      letterSpacing: 4,
      textTransform: 'lowercase'
    },
    bold: { 
      name: 'Bold', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: -0.5,
      textTransform: 'none'
    },
  };

  const selectedFont = fontStyles[fontStyle] || fontStyles.default;

  const playSound = async (soundFile) => {
    try {
      const player = createAudioPlayer(soundFile);
      setSound(player);
      player.play();
    } catch (error) {
      if (__DEV__) {
        console.log('Error playing sound:', error);
      }
    }
  };

  // Lock to landscape when screen is focused and dismiss keyboard
  useFocusEffect(
    React.useCallback(() => {
      const lockOrientation = async () => {
        try {
          // Dismiss keyboard first
          Keyboard.dismiss();
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          
          // Wait a bit for orientation to actually change
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Wait for orientation change and update dimensions multiple times to ensure accuracy
          const updateDimensions = (attempt = 0) => {
            const newDims = Dimensions.get('window');
            const isLandscape = newDims.width > newDims.height;
            
            setWinDims(newDims);
            
            // Check if we're actually in landscape (width > height)
            if (isLandscape && newDims.width > 0 && newDims.height > 0) {
              setDimensionsReady(true);
            } else if (attempt < 10) {
              // If not landscape yet, try again (max 10 attempts = 500ms)
              setTimeout(() => updateDimensions(attempt + 1), 50);
            } else {
              // Fallback: use current dimensions even if not perfect
              setDimensionsReady(true);
            }
          };
          
          // Start checking immediately
          updateDimensions(0);
        } catch (e) {
          if (__DEV__) {
            console.log('Orientation lock failed:', e);
          }
          // Even if lock fails, try to get correct dimensions
          const newDims = Dimensions.get('window');
          setWinDims(newDims);
          // Use a small delay to ensure dimensions are set
          setTimeout(() => setDimensionsReady(true), 100);
        }
      };
      setDimensionsReady(false);
      lockOrientation();
      
      // Do not unlock on blur to avoid a second flip; the caller handles locking back
      return () => {};
    }, [])
  );

  useEffect(() => {
    // Initialize gradient colors based on background type
    if (backgroundConfigs[backgroundType] && backgroundConfigs[backgroundType].type === 'animated-gradient') {
      const config = backgroundConfigs[backgroundType];
      const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;
      const initialColors = colorSets[0];
      
      if (backgroundType === 'tropical') setTropicalColors(initialColors);
      else if (backgroundType === 'galaxy') setGalaxyColors(initialColors);
      else if (backgroundType === 'rainbow') setRainbowColors(initialColors);
      else if (backgroundType === 'sunset') setSunsetColors(initialColors);
      else if (backgroundType === 'retro') setRetroColors(initialColors);
      else if (backgroundType === 'blossom') setBlossomColors(initialColors);
    }
    
    // Play display sound when the large text shows
    // playSound(require('./assets/sounds/display.mp3'));
  }, [backgroundType, isNightMode]);

  useEffect(() => {
    // Wait for dimensions to be ready before fading in
    if (dimensionsReady) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        Animated.timing(fadeOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      }, 50);
    }
  }, [dimensionsReady]);

  // Ensure no header appears on results screen
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWinDims(window);
      // Mark as ready when dimensions change (should be landscape)
      if (window.width > window.height) {
        setDimensionsReady(true);
      }
    });
    return () => {
      sub.remove();
    };
  }, []);

  // Animate gradient backgrounds (simplified version - animate all active gradients)
  useEffect(() => {
    if (!backgroundConfigs[backgroundType] || backgroundConfigs[backgroundType].type !== 'animated-gradient') return;

    const config = backgroundConfigs[backgroundType];
    const colorSets = isNightMode ? config.night.colorSets : config.day.colorSets;
    const animRef = backgroundType === 'tropical' ? tropicalAnim :
                    backgroundType === 'galaxy' ? galaxyAnim :
                    backgroundType === 'rainbow' ? rainbowAnim :
                    backgroundType === 'sunset' ? sunsetAnim :
                    backgroundType === 'retro' ? retroAnim :
                    blossomAnim;
    const setColors = backgroundType === 'tropical' ? setTropicalColors :
                      backgroundType === 'galaxy' ? setGalaxyColors :
                      backgroundType === 'rainbow' ? setRainbowColors :
                      backgroundType === 'sunset' ? setSunsetColors :
                      backgroundType === 'retro' ? setRetroColors :
                      setBlossomColors;

    const listener = animRef.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      const interpolatedColors = colorSets[index].map((color, i) => 
        interpolateColor(color, colorSets[nextIndex][i], progress)
      );
      setColors(interpolatedColors);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animRef, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(animRef, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      animRef.removeListener(listener);
    };
  }, [backgroundType, isNightMode]);

  // Galaxy stars animation
  useEffect(() => {
    if (backgroundType !== 'galaxy') {
      setStarAnimations([]);
      return;
    }

    const stars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      animValue: new Animated.Value(Math.random()),
    }));

    setStarAnimations(stars);

    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.animValue, {
            toValue: 1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.animValue, {
            toValue: 0.3,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [backgroundType]);

  const calculateFontSize = (text) => {
    if (text.length <= 5) {
      return 100;
    } else {
      return Math.floor(500 / text.length);
    }
  };

  const toggleNightMode = (value) => {
    setIsNightMode(value);
    // Background color is now handled by background rendering, but keep for compatibility
    setCurrentBackgroundColor(value ? customNightColor : customDayColor);
  };

  // Drawing handlers
  const drawingOverlayRef = useRef(null);
  
  const shouldCaptureTouch = (event) => {
    // Don't capture touches in button areas (bottom corners)
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = winDims.width;
    const screenHeight = winDims.height;
    
    // Bottom left area (back button) - approximately 150x100px area
    if (pageX < 150 && pageY > screenHeight - 100) {
      return false;
    }
    
    // Bottom right area (brush/eraser/night mode buttons) - approximately 200x100px area
    if (pageX > screenWidth - 200 && pageY > screenHeight - 100) {
      return false;
    }
    
    return true;
  };
  
  const handleTouchStart = (event) => {
    if (!isDrawingMode) return;
    if (!shouldCaptureTouch(event)) return;
    const { locationX, locationY } = event.nativeEvent;
    const newPath = [{ x: locationX, y: locationY }];
    setCurrentPath(newPath);
  };

  const handleTouchMove = (event) => {
    if (!isDrawingMode || currentPath.length === 0) return;
    const { locationX, locationY } = event.nativeEvent;
    const lastPoint = currentPath[currentPath.length - 1];
    const distance = Math.sqrt(
      Math.pow(locationX - lastPoint.x, 2) + Math.pow(locationY - lastPoint.y, 2)
    );
    // Add point only if moved enough to create smooth lines
    if (distance > 1) {
      setCurrentPath([...currentPath, { x: locationX, y: locationY }]);
    }
  };

  // Convert points to smooth SVG path using smooth quadratic bezier curves
  const pointsToPath = (points) => {
    if (points.length < 2) return '';
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const currentPoint = points[i];
      const prevPoint = points[i - 1];
      
      if (i === 1) {
        // First segment - use line to second point
        path += ` L ${currentPoint.x} ${currentPoint.y}`;
      } else {
        // Use smooth quadratic bezier curves
        // Control point is the previous point
        // End point is the midpoint between previous and current for smooth transition
        const midX = (prevPoint.x + currentPoint.x) / 2;
        const midY = (prevPoint.y + currentPoint.y) / 2;
        path += ` Q ${prevPoint.x} ${prevPoint.y} ${midX} ${midY}`;
        
        // Draw line to the actual current point if it's the last point
        if (i === points.length - 1) {
          path += ` L ${currentPoint.x} ${currentPoint.y}`;
        }
      }
    }
    
    return path;
  };

  const handleTouchEnd = () => {
    if (!isDrawingMode || currentPath.length === 0) return;
    setDrawingPaths([...drawingPaths, [...currentPath]]);
    setCurrentPath([]);
  };

  const clearDrawing = () => {
    setDrawingPaths([]);
    setCurrentPath([]);
  };

  const animationSources = {
    Hi: HandWave,
    Alert: AnimationAlert,
    Happy: HappyAnimation,
    Sad: SadAnimation,
    Thinking: ThinkingAnimation,
    Love: LoveAnimation,
    Angry: AngryAnimation,
    Funny: FunnyAnimation,
    Ask: AskAnimation,
    Sorry: SorryAnimation,
    ThankYou: ThankYouAnimation,
    Good: GoodAnimation,
  };

  // Ensure we have valid dimensions - use current window dimensions as fallback
  const currentDims = Dimensions.get('window');
  
  // Prefer ready landscape dimensions, fallback to current if landscape, otherwise use max
  let screenWidth, screenHeight;
  
  if (dimensionsReady && winDims.width > winDims.height && winDims.width > 0 && winDims.height > 0) {
    // Use ready landscape dimensions
    screenWidth = winDims.width;
    screenHeight = winDims.height;
  } else if (currentDims.width > currentDims.height && currentDims.width > 0 && currentDims.height > 0) {
    // Use current dimensions if landscape
    screenWidth = currentDims.width;
    screenHeight = currentDims.height;
  } else {
    // Fallback: use the larger dimension as width (assume landscape)
    screenWidth = Math.max(winDims.width || 0, currentDims.width || 0, 800);
    screenHeight = Math.max(winDims.height || 0, currentDims.height || 0, 600);
  }

  // Handle layout changes to ensure we always have correct dimensions
  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    // Only update if we're in landscape (width > height) and dimensions are significantly different
    if (width > height && (Math.abs(width - winDims.width) > 10 || Math.abs(height - winDims.height) > 10)) {
      setWinDims({ width, height });
      setDimensionsReady(true);
    }
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: 'transparent' }]} 
      edges={['left', 'right', 'top', 'bottom']}
      onLayout={handleLayout}
    >
      <StatusBar style="dark" />
      {/* Background rendering based on selected type - same as input page */}
      {backgroundConfigs[backgroundType] && backgroundConfigs[backgroundType].type === 'lottie' && (
        <LottieView
          source={isNightMode ? backgroundConfigs[backgroundType].night : backgroundConfigs[backgroundType].day}
          autoPlay
          loop
          style={{
            position: 'absolute',
            // Scale to fill landscape: zoom in to cover the wider landscape screen, focused on top (clouds)
            width: screenWidth * 1.8, // Zoom in significantly to fill landscape width
            height: screenWidth * 1.8 * 1.5, // Portrait aspect ratio (taller), scaled up
            top: (screenHeight - screenWidth * 1.8 * 1.5) / 2 - screenHeight * 0.35, // Shift up more to focus on top portion (clouds)
            left: -screenWidth * 0.4, // Center horizontally with overflow on sides
          }}
        />
      )}
      {backgroundConfigs[backgroundType] && backgroundConfigs[backgroundType].type === 'gradient' && (
        <LinearGradient
          colors={isNightMode ? backgroundConfigs[backgroundType].night.colors : backgroundConfigs[backgroundType].day.colors}
          start={isNightMode ? backgroundConfigs[backgroundType].night.start : backgroundConfigs[backgroundType].day.start}
          end={isNightMode ? backgroundConfigs[backgroundType].night.end : backgroundConfigs[backgroundType].day.end}
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      {backgroundConfigs[backgroundType] && backgroundConfigs[backgroundType].type === 'animated-gradient' && (
        <>
          <LinearGradient
            colors={
              backgroundType === 'tropical' ? tropicalColors :
              backgroundType === 'galaxy' ? galaxyColors :
              backgroundType === 'rainbow' ? rainbowColors :
              backgroundType === 'sunset' ? sunsetColors :
              backgroundType === 'retro' ? retroColors :
              blossomColors
            }
            start={isNightMode ? backgroundConfigs[backgroundType].night.start : backgroundConfigs[backgroundType].day.start}
            end={isNightMode ? backgroundConfigs[backgroundType].night.end : backgroundConfigs[backgroundType].day.end}
            style={{
              position: 'absolute',
              width: screenWidth,
              height: screenHeight,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          {backgroundType === 'galaxy' && starAnimations.map((star) => (
            <Animated.View
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
                backgroundColor: '#ffffff',
                opacity: star.animValue,
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
              }}
            />
          ))}
        </>
      )}
      {backgroundConfigs[backgroundType] && backgroundConfigs[backgroundType].type === 'solid' && (
        <View
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isNightMode 
              ? backgroundConfigs[backgroundType].night?.color
              : backgroundConfigs[backgroundType].day?.color,
          }}
        />
      )}
      {/* Custom color background (when no background is selected or custom mode is active) */}
      {(!backgroundConfigs[backgroundType] || backgroundType === 'custom') && backgroundType !== 'customPhoto' && (
        <View
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isNightMode ? customNightColor : customDayColor,
          }}
        />
      )}
      {/* Custom photo background */}
      {backgroundType === 'customPhoto' && customPhotoUri && (
        <Image
          source={{ uri: customPhotoUri }}
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          resizeMode="cover"
        />
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            (() => {
              if (!selectedAnimation) return null;
              const hasText = !!(text && text.trim() !== '');
              if (!hasText) return null; // theme-only uses centered overlay
              const base = Math.floor(Math.min(winDims.width, winDims.height) * 0.4);
              const width = Math.max(260, Math.min(base, 420));
              return { paddingRight: width + 40 };
            })()
          ]}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text 
            numberOfLines={5} 
            style={[
              styles.bigText, 
              { 
                color: isNightMode ? textNightColor : textDayColor,
                fontFamily: selectedFont.fontFamily,
                fontWeight: selectedFont.fontWeight,
                fontStyle: selectedFont.fontStyle,
                letterSpacing: selectedFont.letterSpacing,
              }
            ]} 
            ellipsizeMode='clip'
          >
            {selectedFont.textTransform === 'uppercase' 
              ? text.toUpperCase() 
              : selectedFont.textTransform === 'lowercase' 
              ? text.toLowerCase() 
              : text}
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
      
      {selectedAnimation && (
        (!text || text.trim() === '') ? (
          <View pointerEvents="none" style={styles.animationCenteredContainer}>
            {(() => {
              const baseSize = Math.floor(Math.min(winDims.width, winDims.height) * 0.85);
              const width = baseSize;
              const height = Math.floor(baseSize * 0.75); // keep 4:3 like previous 200x150
              return (
                <LottieView
                  source={animationSources[selectedAnimation]}
                  autoPlay
                  loop
                  resizeMode="contain"
                  style={[
                    styles.animationCentered, 
                    { width, height },
                    selectedAnimation === 'Sad' && { transform: [{ scale: 0.85 }] },
                    selectedAnimation === 'Happy' && { transform: [{ scale: 1.15 }] },
                  ]}
                />
              );
            })()}
          </View>
        ) : (
          (() => {
            const base = Math.floor(Math.min(winDims.width, winDims.height) * 0.4);
            const width = Math.max(260, Math.min(base, 420));
            const height = Math.floor(width * 0.75);
            return (
              <LottieView
                source={animationSources[selectedAnimation]}
                autoPlay
                loop
                resizeMode="contain"
                style={[
                  styles.animation, 
                  { width, height, marginTop: -height / 2 },
                  selectedAnimation === 'Sad' && { transform: [{ scale: 0.85 }] },
                  selectedAnimation === 'Happy' && { transform: [{ scale: 1.15 }] },
                ]}
              />
            );
          })()
        )
      )}
      
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={async () => {
          try {
            setIsTransitioning(true);
            Animated.timing(fadeOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            // Wait for portrait before navigating back
            const waitForPortrait = () => new Promise((resolve) => {
              ScreenOrientation.getOrientationAsync().then((o) => {
                if (o === ScreenOrientation.Orientation.PORTRAIT_UP || o === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
                  resolve();
                } else {
                  const sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
                    const oo = orientationInfo.orientation;
                    if (oo === ScreenOrientation.Orientation.PORTRAIT_UP || oo === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
                      ScreenOrientation.removeOrientationChangeListener(sub);
                      resolve();
                    }
                  });
                }
              });
            });
            await waitForPortrait();
          } catch (e) {
            if (__DEV__) {
              console.log('Transition back failed:', e);
            }
          } finally {
            navigation.goBack();
          }
        }}>
          <Text style={styles.backButtonText}>Back to text</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.resultsSwitchContainer}>
        <TouchableOpacity
          onPress={() => setIsDrawingMode(!isDrawingMode)}
          style={[
            styles.brushButton,
            isDrawingMode && styles.brushButtonActive,
            isNightMode && styles.brushButtonNight,
            isDrawingMode && isNightMode && styles.brushButtonActiveNight
          ]}
        >
          <Ionicons 
            name="brush" 
            size={20} 
            color={isDrawingMode 
              ? (isNightMode ? '#81b0ff' : '#007AFF')
              : (isNightMode ? '#ffffff' : '#000000')
            } 
          />
        </TouchableOpacity>
        {isDrawingMode && (
          <TouchableOpacity
            onPress={clearDrawing}
            style={[
              styles.eraserButton,
              isNightMode && styles.eraserButtonNight
            ]}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color={isNightMode ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.resultsSwitchText, { color: isNightMode ? '#ffffff' : '#000000' }]}>{isNightMode ? '🌙' : '☀️'}</Text>
        <TouchableOpacity 
          onPress={() => {
            if (__DEV__) {
              console.log('Results switch tapped, current state:', isNightMode);
            }
            toggleNightMode(!isNightMode);
          }}
          style={styles.switchButton}
        >
          <View style={[styles.switchTrack, isNightMode && styles.switchTrackActive]}>
            <View style={[styles.switchThumb, isNightMode && styles.switchThumbActive]} />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Drawing overlay */}
      {isDrawingMode && (
        <View
          ref={drawingOverlayRef}
          style={styles.drawingOverlay}
          pointerEvents="box-none"
        >
          <View
            style={styles.drawingTouchArea}
            onStartShouldSetResponder={(evt) => shouldCaptureTouch(evt)}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouchMove}
            onResponderRelease={handleTouchEnd}
          >
            <Svg
              style={styles.svgContainer}
              width={winDims.width}
              height={winDims.height}
            >
              {/* Render completed paths with bright neon orange glow */}
              {drawingPaths.map((path, pathIndex) => {
                if (path.length < 2) return null;
                const pathData = pointsToPath(path);
                return (
                  <React.Fragment key={pathIndex}>
                    {/* Outer glow layer - largest, most transparent */}
                    <Path
                      d={pathData}
                      stroke="#FF6600"
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.25"
                    />
                    {/* Middle glow layer */}
                    <Path
                      d={pathData}
                      stroke="#FF6600"
                      strokeWidth="18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.5"
                    />
                    {/* Inner bright neon line */}
                    <Path
                      d={pathData}
                      stroke="#FF6600"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Core bright orange line */}
                    <Path
                      d={pathData}
                      stroke="#FF8800"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="1"
                    />
                  </React.Fragment>
                );
              })}
              {/* Render current path being drawn with bright neon orange glow */}
              {currentPath.length > 1 && (
                <React.Fragment>
                  {/* Outer glow layer - largest, most transparent */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF6600"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.25"
                  />
                  {/* Middle glow layer */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF6600"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.5"
                  />
                  {/* Inner bright neon line */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF6600"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.85"
                  />
                  {/* Core bright orange line */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF8800"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="1"
                  />
                </React.Fragment>
              )}
            </Svg>
          </View>
        </View>
      )}
      {isTransitioning && (
        <Animated.View pointerEvents="none" style={[styles.fadeOverlay, { opacity: fadeOpacity }]} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 50,
  },
  switchContainer: {
    position: 'absolute',
    top: -40,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  switchText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginRight: 5,
  },
  switchButton: {
    padding: 5,
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#767577',
    justifyContent: 'center',
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: '#81b0ff',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f4f3f4',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5dd4b',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 15,
    marginTop: 10,
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 100,
    textAlignVertical: 'top',
  },
  inputAnimationPreview: {
    position: 'absolute',
    right: 15,
    top: '35%',
    marginTop: -20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  inputAnimationPreviewLottie: {
    width: 40,
    height: 40,
  },
  inputNightMode: {
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  inputLimitReached: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    padding: 5,
  },
  characterCount: {
    position: 'absolute',
    right: 50,
    bottom: 5,
    fontSize: 12,
    color: '#666',
  },
  characterCountNight: {
    color: '#bbb',
  },
  characterCountLimitReached: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  submitButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeSection: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 15,
    marginTop: 5,
  },
  themeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  themeButtonWrapper: {
    alignSelf: 'center',
  },
  themeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    minWidth: 80,
    maxWidth: 100,
    transform: [{ scale: 1 }],
  },
  themeTitleContainerNight: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowOpacity: 0.4,
    shadowColor: '#000',
  },
  themeTitleContainerSelected: {
    borderWidth: 2.5,
    borderColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  themeTitleContainerSelectedNight: {
    borderColor: '#81b0ff',
  },
  themeTitleContainerHasSelection: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  themeTitleContainerHasSelectionNight: {
    borderColor: '#81b0ff',
  },
  selectionIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginLeft: 6,
  },
  themeSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  themeCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  themeCard: {
    width: 50,
    height: 70,
    marginHorizontal: 3,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  themeCardNight: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    shadowOpacity: 0.3,
  },
  selectedThemeCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowOpacity: 0.4,
    elevation: 10,
    transform: [{ scale: 1.15 }],
    borderWidth: 2.5,
    borderColor: '#007AFF',
  },
  selectedThemeCardNight: {
    backgroundColor: 'rgba(60, 60, 60, 1)',
    borderColor: '#81b0ff',
  },
  happyCard: {
    width: 60,
    height: 84,
    transform: [{ scale: 1.1 }],
  },
  themeEmoji: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  themeEmojiLottie: {
    width: 32,
    height: 32,
  },
  happyEmojiContainer: {
    width: 44,
    height: 44,
  },
  happyEmojiLottie: {
    width: 44,
    height: 44,
  },
  angryEmojiLottie: {
    width: 44,
    height: 44,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  checkmarkContainerNight: {
    backgroundColor: '#2a2a2a',
  },
  themeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  themeLabelNight: {
    color: '#ccc',
  },
  selectedThemeLabel: {
    color: '#000',
    fontWeight: '700',
    fontSize: 11,
  },
  selectedThemeLabelNight: {
    color: '#fff',
  },
  fontDropdown: {
    maxHeight: 320,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  fontDropdownNight: {
    backgroundColor: 'rgba(30, 30, 30, 0.98)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowOpacity: 0.3,
  },
  fontDropdownContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  fontButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  fontButtonNight: {
    backgroundColor: 'rgba(50, 50, 50, 1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectedFontButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  selectedFontButtonNight: {
    backgroundColor: 'rgba(129, 176, 255, 0.2)',
    borderColor: '#81b0ff',
  },
  fontButtonText: {
    fontSize: 15,
    color: '#1a1a1a',
    textAlign: 'center',
    flexShrink: 0,
  },
  fontButtonTextNight: {
    color: '#f0f0f0',
  },
  selectedFontButtonText: {
    fontWeight: '700',
  },
  fontCheckmarkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  fontCheckmarkContainerNight: {
    backgroundColor: '#81b0ff',
  },
  bigText: {
    fontSize: 100,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: 50,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 40, // Extra padding on left to avoid notch/Dynamic Island
    paddingRight: 20,
    paddingBottom: 80, // Extra padding at bottom to prevent overlap with "Back to text" button
    minHeight: '100%',
  },
  scrollContentWithAnimation: {
    paddingRight: 220, // Give space for the animation when one is selected
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    alignItems: 'flex-start',
    zIndex: 20,
  },
  resultsSwitchContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  resultsSwitchText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  animation: {
    position: 'absolute',
    top: '50%',
    right: 20,
    width: 200,
    height: 150,
    marginTop: -75, // Half of height to center it vertically
    zIndex: 1,
  },
  animationCenteredContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  animationCentered: {
    width: 200,
    height: 150,
  },
  fadeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  bottomSafeAreaDark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Covers the safe area at bottom
    backgroundColor: '#000000',
    zIndex: -1,
  },
  bottomSafeAreaContainer: {
    backgroundColor: '#000000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  brushButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  brushButtonNight: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brushButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  brushButtonActiveNight: {
    backgroundColor: 'rgba(129, 176, 255, 0.3)',
    borderColor: '#81b0ff',
  },
  drawingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  drawingTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  eraserButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  eraserButtonNight: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 15,
  },
  settingsButtonNight: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
  },
  tutorialButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 15,
  },
  tutorialButtonNight: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  settingsModalNight: {
    backgroundColor: '#1a1a1a',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingsHeaderNight: {
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  settingsTitleNight: {
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  settingsContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  settingsSectionTitleNight: {
    color: '#ffffff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  backgroundOption: {
    width: 75,
    marginBottom: 12,
    alignItems: 'center',
    minWidth: 75,
    maxWidth: 75,
  },
  backgroundOptionSelected: {
    transform: [{ scale: 1.05 }],
  },
  backgroundPreview: {
    width: 75,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  backgroundLottiePreview: {
    width: '100%',
    height: '100%',
  },
  backgroundGradientPreview: {
    width: '100%',
    height: '100%',
  },
  backgroundCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  backgroundOptionLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    width: 75,
    flexWrap: 'wrap',
  },
  backgroundOptionLabelNight: {
    color: '#ffffff',
  },
  quickSayDropdown: {
    maxHeight: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  quickSayDropdownNight: {
    backgroundColor: 'rgba(30, 30, 30, 0.98)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowOpacity: 0.3,
  },
  quickSayContent: {
    paddingVertical: 4,
    paddingBottom: 20, // Minimal padding for keyboard space when needed
  },
  quickSayContentNoItems: {
    paddingBottom: 10, // Even less padding when no saved sayings
  },
  savedSayingsContainer: {
    marginBottom: 12,
  },
  sayingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 8,
    paddingVertical: 10,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  sayingCardNight: {
    backgroundColor: 'rgba(50, 50, 50, 1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sayingCardContent: {
    flex: 1,
    marginRight: 6,
  },
  sayingPreview: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: 16,
  },
  sayingPreviewNight: {
    color: '#f0f0f0',
  },
  sayingLength: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
  sayingLengthNight: {
    color: '#aaa',
  },
  deleteSayingButton: {
    padding: 2,
  },
  addSayingContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
  },
  addSayingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  addSayingTitleNight: {
    color: '#f0f0f0',
  },
  addSayingInputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  addSayingInput: {
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#1a1a1a',
  },
  addSayingInputNight: {
    backgroundColor: 'rgba(50, 50, 50, 1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    color: '#f0f0f0',
  },
  addSayingInputLimit: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  addSayingCharCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 11,
    color: '#666',
  },
  addSayingCharCountNight: {
    color: '#aaa',
  },
  addSayingCharCountLimit: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  saveSayingButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveSayingButtonDisabled: {
    opacity: 0.5,
  },
  saveSayingButtonNight: {
    // Additional night mode styling if needed
  },
  saveSayingButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveSayingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  colorPickerContainer: {
    marginBottom: 10,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  colorPickerLabelNight: {
    color: '#ffffff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    transform: [{ scale: 1.1 }],
  },
  // Onboarding Styles
  onboardingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingContent: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  onboardingCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingSlidesContainer: {
    flex: 1,
    overflow: 'hidden',
    marginTop: 70,
  },
  onboardingSlidesWrapper: {
    flexDirection: 'row',
    height: '100%',
  },
  onboardingSlide: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  onboardingPreviewContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  onboardingHighlight: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#4A90E2',
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  onboardingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  onboardingTitleNight: {
    color: '#ffffff',
  },
  onboardingDescription: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  onboardingDescriptionNight: {
    color: '#cccccc',
  },
  onboardingPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  onboardingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  onboardingDotNight: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  onboardingDotActive: {
    width: 24,
    backgroundColor: '#4A90E2',
  },
  onboardingDotActiveNight: {
    backgroundColor: '#4A90E2',
  },
  onboardingNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  onboardingNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  onboardingNavButtonNight: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  onboardingNavButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 5,
  },
  onboardingNavButtonTextNight: {
    color: '#ffffff',
  },
  onboardingNextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  onboardingNextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  onboardingNextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // Welcome Prompt Styles
  welcomePromptOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomePromptContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomePromptContainerNight: {
    shadowColor: '#fff',
  },
  welcomePromptContent: {
    padding: 30,
    alignItems: 'center',
  },
  welcomePromptAnimation: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomePromptTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomePromptTitleNight: {
    color: '#ffffff',
  },
  welcomePromptText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  welcomePromptTextNight: {
    color: '#cccccc',
  },
  welcomePromptButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  welcomePromptButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomePromptButtonSecondaryNight: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomePromptButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  welcomePromptButtonSecondaryTextNight: {
    color: '#ffffff',
  },
  welcomePromptButtonPrimary: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  welcomePromptButtonPrimaryGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomePromptButtonPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // Settings Button Item Styles
  settingsButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginBottom: 10,
  },
  settingsButtonItemNight: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingsButtonItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButtonItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  settingsButtonItemTextNight: {
    color: '#ffffff',
  },
});

export default PocketSayApp;

