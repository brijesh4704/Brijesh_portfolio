"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "chart.js/auto";
import { Tooltip } from "@mui/material";
import Image from "next/image";

// Define types for the badge objects based on the actual API response
interface Badge {
  id?: string;
  name?: string;
  displayName?: string;
  icon: string;
  creationDate?: string;
}

interface UpcomingBadge {
  name: string;
  icon: string;
}

// Define the structure of LeetCode data
interface LeetCodeData {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: string;
  contributionPoints: number;
  badges: Badge[];
  upcomingBadges?: UpcomingBadge[];
  activeBadge?: Badge;
  totalSubmissions: number;
  totalActiveDays: number;
  maxStreak: number;
  currentStreak: number;
  acceptanceRate: string;
  lastUpdated?: number;
}

// Define error type for better type safety
interface AxiosErrorResponse {
  response?: {
    status: number;
    headers: {
      'retry-after'?: string;
    };
  };
  message: string;
}

// API configuration with proxy URLs
const API_CONFIG = {
  stats: "https://leetcode-stats-api.herokuapp.com/brijeshsingh",
  // Use a proxy API route to avoid CORS issues
  badges: "/api/leetcode-badges", // This assumes you've created a proxy API route
  fallbackBadges: "https://alfa-leetcode-api.onrender.com/brijeshsingh/Badges" // Original URL as fallback
};

// Cache keys
const CACHE_KEY_STATS = "leetcode_stats_data";
const CACHE_KEY_BADGES = "leetcode_badges_data";
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

// Hardcoded badges as fallback in case the API fails
const HARDCODED_BADGES: Badge[] = [
  {
    id: "4519258",
    displayName: "100 Days Badge 2024",
    icon: "https://assets.leetcode.com/static_assets/marketing/2024-100-lg.png",
    creationDate: "2024-07-26"
  },
  {
    id: "3964197",
    displayName: "50 Days Badge 2024",
    icon: "https://assets.leetcode.com/static_assets/marketing/2024-50-lg.png",
    creationDate: "2024-05-23"
  },
  {
    id: "4029373",
    displayName: "May LeetCoding Challenge",
    icon: "https://leetcode.com/static/images/badges/dcc-2024-5.png",
    creationDate: "2024-06-01"
  }
];

// Define types for cache data
interface CacheData {
  lastUpdated?: number;
  [key: string]: unknown;
}

// Define types for badge data
interface BadgeData {
  badges?: Badge[];
  badgesCount?: number;
  upcomingBadges?: UpcomingBadge[];
  activeBadge?: Badge;
}

// Common utility functions to avoid code duplication
const utils = {
  // Helper function to format badge icons
  formatBadgeIcon: (icon: string | undefined): string => {
    if (!icon) return "https://via.placeholder.com/56";
    
    // If the icon starts with /static, prepend the leetcode domain
    if (icon.startsWith('/static')) {
      return `https://leetcode.com${icon}`;
    }
    
    return icon;
  },
  
  // Cache management
  cache: {
    get: (key: string): CacheData | null => {
      if (typeof window === 'undefined') return null;
      try {
        const cachedData = localStorage.getItem(key);
        if (!cachedData) return null;
        
        const parsedData = JSON.parse(cachedData) as CacheData;
        
        // Check if cache is expired
        if (parsedData.lastUpdated && Date.now() - parsedData.lastUpdated > CACHE_EXPIRY) {
          return null;
        }
        
        return parsedData;
      } catch (error) {
        console.error("Error reading from cache:", error);
        return null;
      }
    },
    
    set: (key: string, data: Record<string, unknown>) => {
      if (typeof window === 'undefined') return;
      try {
        // Add timestamp for cache expiry check
        const dataToCache = {
          ...data,
          lastUpdated: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(dataToCache));
      } catch (error) {
        console.error("Error saving to cache:", error);
      }
    },
    
    clear: (key: string) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error clearing cache:", error);
      }
    }
  },
  
  // Improved fetch with retry logic
  fetchWithRetry: async (url: string, retries = 5, initialDelay = 2000, maxDelay = 30000) => {
    let currentDelay = initialDelay;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await axios.get(url, { 
          timeout: 8000, // Set reasonable timeout
        });
        return response;
      } catch (error) {
        // Check if it's the last attempt
        const axiosError = error as AxiosErrorResponse;
        if (attempt === retries - 1) throw axiosError;
        
        const isRateLimit = axiosError.response?.status === 429;
        const retryAfter = axiosError.response?.headers?.['retry-after'];
        
        // Calculate delay with exponential backoff
        let delayTime: number;
        if (isRateLimit && retryAfter) {
          delayTime = parseInt(retryAfter) * 1000;
        } else {
          // Add jitter to avoid thundering herd problem (±20%)
          const jitter = 0.8 + (Math.random() * 0.4);
          delayTime = Math.min(currentDelay * jitter, maxDelay);
          currentDelay = currentDelay * 1.5; // Exponential backoff
        }
        
        console.log(`Attempt ${attempt + 1} failed (${axiosError.message}), retrying in ${delayTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayTime));
      }
    }
    
    throw new Error("Max retries exceeded");
  },
  
  // Create default data when fetching fails
  createFallbackData: (): LeetCodeData => ({
    totalSolved: 294,
    totalQuestions: 3482,
    easySolved: 119,
    totalEasy: 864,
    mediumSolved: 151, 
    totalMedium: 1810,
    hardSolved: 24,
    totalHard: 808,
    ranking: "10,000",
    contributionPoints: 100,
    badges: HARDCODED_BADGES,
    totalSubmissions: 500,
    totalActiveDays: 150,
    maxStreak: 30,
    currentStreak: 5,
    acceptanceRate: "65.4",
    lastUpdated: Date.now()
  }),
  
  // Format badges properly from the new API response structure
  formatBadges: (badgesData: BadgeData, debugCallback?: (message: string) => void): {
    badges: Badge[],
    upcomingBadges?: UpcomingBadge[],
    activeBadge?: Badge
  } => {
    try {
      debugCallback?.(`Raw badges data type: ${typeof badgesData}`);
      
      // Check if we have the expected structure
      if (badgesData && 
          (Array.isArray(badgesData.badges) || badgesData.badgesCount !== undefined)) {
        
        // Process main badges array
        const formattedBadges = Array.isArray(badgesData.badges) 
          ? badgesData.badges.map((badge: Badge) => ({
              id: badge.id || "",
              name: badge.name || "",
              displayName: badge.displayName || badge.name || "Badge",
              icon: utils.formatBadgeIcon(badge.icon),
              creationDate: badge.creationDate || ""
            }))
          : [];
        
        debugCallback?.(`Formatted ${formattedBadges.length} badges from badges array`);
        
        // Process upcoming badges if they exist
        const upcomingBadges = Array.isArray(badgesData.upcomingBadges)
          ? badgesData.upcomingBadges.map((badge: UpcomingBadge) => ({
              name: badge.name || "Upcoming Badge",
              icon: utils.formatBadgeIcon(badge.icon)
            }))
          : undefined;
        
        if (upcomingBadges) {
          debugCallback?.(`Formatted ${upcomingBadges.length} upcoming badges`);
        }
        
        // Process active badge if it exists
        const activeBadge = badgesData.activeBadge
          ? {
              id: badgesData.activeBadge.id || "",
              name: badgesData.activeBadge.name || "",
              displayName: badgesData.activeBadge.displayName || badgesData.activeBadge.name || "Active Badge",
              icon: utils.formatBadgeIcon(badgesData.activeBadge.icon),
              creationDate: badgesData.activeBadge.creationDate || ""
            }
          : undefined;
        
        if (activeBadge) {
          debugCallback?.(`Formatted active badge: ${activeBadge.displayName}`);
        }
        
        return {
          badges: formattedBadges.length > 0 ? formattedBadges : HARDCODED_BADGES,
          upcomingBadges,
          activeBadge
        };
      }
      
      // Fallback for unexpected data structure
      debugCallback?.("Could not determine badge format, using fallback");
      return { badges: HARDCODED_BADGES };
    } catch (err) {
      const error = err as Error;
      debugCallback?.(`Error formatting badges: ${error.message}`);
      return { badges: HARDCODED_BADGES };
    }
  }
};

const LeetCodeSection = () => {
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [upcomingBadges, setUpcomingBadges] = useState<UpcomingBadge[]>([]);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [hovered, setHovered] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [isUsingCachedData, setIsUsingCachedData] = useState(false);

  // Helper to add debug messages
  const addDebugMessage = (message: string) => {
    setDebugLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Preload badge images to prevent 404 errors in the console
  useEffect(() => {
    const allBadges = [...badges];
    if (activeBadge) allBadges.push(activeBadge);
    
    if (allBadges.length > 0) {
      allBadges.forEach(badge => {
        if (badge.icon) {
          const img = new window.Image();
          img.src = badge.icon;
          img.onerror = () => {
            addDebugMessage(`Failed to preload image: ${badge.icon}`);
          };
        }
      });
      
      // Also preload upcoming badge images
      upcomingBadges.forEach(badge => {
        if (badge.icon) {
          const img = new window.Image();
          img.src = badge.icon;
          img.onerror = () => {
            addDebugMessage(`Failed to preload image: ${badge.icon}`);
          };
        }
      });
    }
  }, [badges, activeBadge, upcomingBadges]); // Removed dependency on badgeImages

  // Main data fetching logic
  useEffect(() => {
    // Try to load from cache first
    const cachedStats = utils.cache.get(CACHE_KEY_STATS) as LeetCodeData | null;
    const cachedBadges = utils.cache.get(CACHE_KEY_BADGES) as {
      badges: Badge[];
      upcomingBadges?: UpcomingBadge[];
      activeBadge?: Badge;
    } | null;
    
    // If we have valid cached data, use it immediately
    if (cachedStats) {
      setLeetcodeData(cachedStats);
      setBadges(cachedStats.badges || []);
      setUpcomingBadges(cachedStats.upcomingBadges || []);
      setActiveBadge(cachedStats.activeBadge || null);
      setLoading(false);
      setIsUsingCachedData(true);
      
      addDebugMessage(`Using cached data from ${new Date(cachedStats.lastUpdated || Date.now()).toLocaleString()}`);
    }
    
    // Fetch fresh data in the background
    const fetchData = async () => {
      try {
        // Fetch stats data
        addDebugMessage("Fetching stats data...");
        const statsResponse = await utils.fetchWithRetry(API_CONFIG.stats).catch(error => {
          addDebugMessage(`Stats API error: ${error.message}`);
          return null;
        });
        
        // Wait a bit before fetching badges to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to fetch badges from our proxy first
        addDebugMessage("Fetching badges data...");
        let badgesResponse = null;
        try {
          badgesResponse = await utils.fetchWithRetry(API_CONFIG.badges, 3, 1000);
        } catch (error) {
          const typedError = error as Error;
          addDebugMessage(`Proxy badges API failed: ${typedError.message}, trying fallback...`);
          
          // If proxy fails, try the direct URL but with no custom headers
          try {
            badgesResponse = await utils.fetchWithRetry(API_CONFIG.fallbackBadges, 2, 1000);
          } catch (fallbackError) {
            const typedFallbackError = fallbackError as Error;
            addDebugMessage(`Fallback badges API failed: ${typedFallbackError.message}`);
          }
        }
        
        // Handle stats data - use response, cached, or fallback in that order
        const statsData = statsResponse?.data || cachedStats || utils.createFallbackData();
        
        // Handle and format badges data
        let formattedBadges: Badge[] = [];
        let formattedUpcomingBadges: UpcomingBadge[] | undefined = [];
        let formattedActiveBadge: Badge | undefined = undefined;
        
        if (badgesResponse) {
          // Use the updated formatBadges function to handle the new structure
          const formattedData = utils.formatBadges(badgesResponse.data, addDebugMessage);
          formattedBadges = formattedData.badges;
          formattedUpcomingBadges = formattedData.upcomingBadges;
          formattedActiveBadge = formattedData.activeBadge;
          
          // If we successfully fetched badges, cache them
          if (formattedBadges.length > 0) {
            utils.cache.set(CACHE_KEY_BADGES, { 
              badges: formattedBadges,
              upcomingBadges: formattedUpcomingBadges,
              activeBadge: formattedActiveBadge,
              lastUpdated: Date.now() 
            });
            addDebugMessage(`Cached ${formattedBadges.length} badges and additional data`);
          }
        } else {
          // If badges fetch failed, use cached badges if available, otherwise use hardcoded
          formattedBadges = (cachedBadges?.badges || HARDCODED_BADGES);
          formattedUpcomingBadges = cachedBadges?.upcomingBadges || [];
          formattedActiveBadge = cachedBadges?.activeBadge;
          addDebugMessage(`Using ${cachedBadges ? 'cached' : 'hardcoded'} badges`);
        }
        
        // Combine the data
        const combinedData = {
          ...statsData,
          badges: formattedBadges,
          upcomingBadges: formattedUpcomingBadges,
          activeBadge: formattedActiveBadge,
          lastUpdated: Date.now()
        };
        
        // Update the state
        setLeetcodeData(combinedData);
        setBadges(formattedBadges);
        setUpcomingBadges(formattedUpcomingBadges || []);
        setActiveBadge(formattedActiveBadge || null);
        
        // Cache the combined data
        utils.cache.set(CACHE_KEY_STATS, combinedData);
        
        setLoading(false);
        setError(false);
        setIsUsingCachedData(false);
      } catch (error) {
        const typedError = error as Error;
        console.error("Error fetching data:", error);
        setErrorDetails(typedError.message || "Unknown error");
        addDebugMessage(`General fetch error: ${typedError.message}`);
        
        // If we have cached data, use it even though the fetch failed
        if (cachedStats) {
          setLeetcodeData(cachedStats);
          setBadges(cachedStats.badges || HARDCODED_BADGES);
          setUpcomingBadges(cachedStats.upcomingBadges || []);
          setActiveBadge(cachedStats.activeBadge || null);
          setIsUsingCachedData(true);
        } else {
          // Otherwise, use fallback data
          const fallbackData = utils.createFallbackData();
          
          setLeetcodeData(fallbackData);
          setBadges(HARDCODED_BADGES);
          setUpcomingBadges([]);
          setActiveBadge(null);
          addDebugMessage("Using fallback data");
        }
        
        setError(true);
        setLoading(false);
      }
    };
    
    // Execute the data fetching
    fetchData();
  }, []);

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, badge: Badge | UpcomingBadge) => {
    const target = e.target as HTMLImageElement;
    addDebugMessage(`Failed to load badge image: ${badge.icon}`);
    target.src = "https://via.placeholder.com/56";
    // Add alt text for better accessibility
    target.alt = (badge as Badge).displayName || badge.name || "Badge Image Failed to Load";
  };

  // Toggle debug info visibility
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  // Function to refresh data manually
  const refreshData = () => {
    setLoading(true);
    setError(false);
    setErrorDetails("");
    setDebugLog([]);
    
    // Clear cache
    utils.cache.clear(CACHE_KEY_STATS);
    utils.cache.clear(CACHE_KEY_BADGES);
    
    // Force reload the page
    window.location.reload();
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-500">Loading LeetCode stats...</p>
    </div>
  );

  const {
    totalSolved = 0,
    totalQuestions = 1,
    easySolved = 0,
    totalEasy = 1,
    mediumSolved = 0,
    totalMedium = 1,
    hardSolved = 0,
    totalHard = 1,
    acceptanceRate = "N/A",
    totalSubmissions = 0,
    lastUpdated = Date.now(),
  } = leetcodeData || {};

  // Generate activity months for display
  const activityMonths = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  // Render activity squares
  const renderActivityGrid = () => {
    return activityMonths.map((month, monthIndex) => (
      <div key={month + monthIndex} className="flex flex-col mb-1">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            // Generate activity level with more consistent pattern
            // Use a deterministic approach based on month and day
            const seed = (monthIndex * 7 + i) % 31;
            let activityLevel = 0;
            
            // Create a more realistic pattern
            if (seed % 7 === 0) activityLevel = 3; // High activity on specific days
            else if (seed % 3 === 0) activityLevel = 2; // Medium activity
            else if (seed % 2 === 0) activityLevel = 1; // Low activity
            
            // Map activity levels to colors
            let bgColor = "bg-gray-700"; // No activity
            if (activityLevel === 1) bgColor = "bg-green-900";
            else if (activityLevel === 2) bgColor = "bg-green-700";
            else if (activityLevel === 3) bgColor = "bg-green-500";
            
            return (
              <div 
                key={`${month}-${i}`}
                className={`w-3 h-3 ${bgColor} rounded-sm`}
                aria-label={`Activity level ${activityLevel} for ${month} day ${i+1}`}
                title={activityLevel > 0 ? `${activityLevel} submissions` : "No submissions"}
              />
            );
          })}
        </div>
        <div className="text-xs text-center mt-1">{month}</div>
      </div>
    ));
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Header with refresh button and last updated info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">LeetCode Stats</h2>
          {lastUpdated && (
            <span className="text-sm text-gray-400 ml-3">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDebug} 
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
          <button 
            onClick={refreshData}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
      
      {/* Error notification with more details */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-white p-3 rounded mb-4">
          <p className="font-semibold">Notice: Using {isUsingCachedData ? 'cached' : 'fallback'} data</p>
          <p className="text-sm">
            We encountered an error fetching the latest data: {errorDetails}. 
            {isUsingCachedData ? ` Showing data from ${new Date(leetcodeData?.lastUpdated || Date.now()).toLocaleString()}.` : ''}
          </p>
        </div>
      )}
      
      {/* Debugging info - only shown when toggled */}
      {showDebug && (
        <div className="bg-gray-800 p-3 mb-4 rounded text-xs max-h-60 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">Debug Information</h3>
          <div className="space-y-1">
            {debugLog.map((message, index) => (
              <p key={index} className="text-gray-300">{message}</p>
            ))}
            <p>Badge Count: {badges.length}</p>
            <p>Upcoming Badge Count: {upcomingBadges.length}</p>
            <p>Active Badge: {activeBadge ? (activeBadge.displayName || activeBadge.name) : 'None'}</p>
            <p>First Badge: {badges.length > 0 ? (badges[0].displayName || badges[0].name || 'Unknown') : 'None'}</p>
            <p>Cache Status: {leetcodeData?.lastUpdated ? `Cached at ${new Date(leetcodeData.lastUpdated).toLocaleString()}` : 'No cache'}</p>
            <p>Error State: {error ? `Error occurred (${errorDetails})` : 'No errors'}</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
        {/* Left section - Stats */}
        <div className="flex-1 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-center mb-22">
            <div 
              className="w-48 h-48 mx-auto relative cursor-pointer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {hovered ? (
                <div className="w-full h-full">
                  <CircularProgressbar
                    value={parseFloat(acceptanceRate) || 65.4}
                    text={`${acceptanceRate || '65.4'}%`}
                    styles={buildStyles({
                      textSize: '16px',
                      textColor: "#fff",
                      pathColor: "#ffcc00",
                      trailColor: "#444",
                      pathTransition: "ease-in-out 0.3s",
                    })}
                  />
                  <div className="text-center mt-4 text-gray-300 text-base ">Acceptance</div>
                  <div className="text-center text-gray-400 text-base">{totalSubmissions} submissions</div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <CircularProgressbar
                    value={(totalSolved / totalQuestions) * 100}
                    text={`${totalSolved}`}
                    styles={buildStyles({
                      textSize: '30px',
                      textColor: "#fff",
                      pathColor: "url(#gradient)",
                      trailColor: "#444",
                      pathTransition: "ease-in-out 0.3s",
                    })}
                  />
                  <div className="text-center mt-4 text-gray-300 text-base">/{totalQuestions}</div>
                  <div className="text-center text-gray-400 text-lg mt-1">3 Attempting</div>
                </div>
              )}
              
              {/* SVG Gradient for the circular progress */}
              <svg style={{ height: 0 }}>
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor="#ffcc00" />
                    <stop offset="25%" stopColor="#2dd4bf" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="75%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col space-y-3 mt-8">
            <div className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
              <span className="text-teal-400 font-medium">Easy</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-400 rounded-full" 
                    style={{ width: `${(easySolved / totalEasy) * 100}%` }}
                  ></div>
                </div>
                <span>{easySolved}/{totalEasy}</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
              <span className="text-yellow-400 font-medium">Medium</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${(mediumSolved / totalMedium) * 100}%` }}
                  ></div>
                </div>
                <span>{mediumSolved}/{totalMedium}</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
              <span className="text-red-400 font-medium">Hard</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-400 rounded-full" 
                    style={{ width: `${(hardSolved / totalHard) * 100}%` }}
                  ></div>
                </div>
                <span>{hardSolved}/{totalHard}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Badges */}
<div className="flex-1 bg-gray-800 rounded-lg p-6">
  <div className="flex justify-between items-center mb-6">
    <div className="text-3xl font-bold">Badges</div>
    <div className="text-3xl font-bold">{badges.length}</div>
  </div>
            
  <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-8 ">
    {badges.length > 0 ? (
      badges.map((badge, index) => (
        <Tooltip key={index} title={badge.displayName || badge.name || "Badge"} arrow>
          <div 
            className="relative group cursor-pointer" 
            onClick={() => window.open(`https://leetcode.com/medal/?showImg=0&id=${badge.id}&isLevel=false`, '_blank')}
          >
            <Image
              src={badge.icon}
              alt={badge.displayName || badge.name || "Badge"}
              height={120}
              width={120}
              className="w-30 h-30 rounded-md border border-gray-600 group-hover:border-yellow-400 transition-all"
              onError={(e) => handleImageError(e, badge)}
              loading="lazy" // Add lazy loading for better performance
            />
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-70 rounded-md flex items-center justify-center transition-opacity duration-200 p-2">
              <span className="text-xs text-center text-white">
                {badge.displayName || badge.name || "Badge"}
              </span>
            </div>
          </div>
        </Tooltip>
      ))
    ) : (
      <div className="text-center p-4 w-full">
        <div className="bg-gray-700 rounded-md p-8 flex flex-col items-center">
          <Image
            src="https://via.placeholder.com/96"
            alt="No Badge"
            height={96}
              width={96}
            className="w-24 h-24 rounded-md border border-gray-600 mb-3"
          />
          <p className="text-gray-400">No badges available</p>
        </div>
      </div>
    )}
  </div>
            
  <div className="mt-6">
    <div className="text-gray-400 text-lg ">Most Recent Badge</div>
    <div className="text-2xl font-semibold mt-1">
      {badges.length > 0 ? (badges[0].displayName || badges[0].name || "No Badge") : "No Badge"}
    </div>
    {badges.length > 0 && badges[0].creationDate && (
      <div className="text-lg mt-1 text-gray-400">
        Earned {new Date(badges[0].creationDate).toLocaleDateString()}
      </div>
    )}
  </div>
</div>
      </div>

      {/* Activity Calendar */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-medium mb-4">Activity Calendar</h3>
        <div className="flex overflow-x-auto pb-2">
          {renderActivityGrid()}
        </div>
      </div>
    </div> 
  );
};

export default LeetCodeSection;