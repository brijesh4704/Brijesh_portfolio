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
  calendar: Record<string, string>;
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

// Add contest rating type
interface ContestRating {
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  topPercentage: number;
}

interface Contest {
  attended: boolean;
  rating: number;
  ranking: number;
  totalParticipants?: number;
  topPercentage?: number;
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
    lastUpdated: Date.now(),
    calendar: {}
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
  const [contestRating, setContestRating] = useState<ContestRating | null>(null);

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

  // Fetch contest rating on mount
  useEffect(() => {
    const fetchContestRating = async () => {
      try {
        const res = await axios.get('https://alfa-leetcode-api.onrender.com/userContestRankingInfo/brijeshsingh');
        // If the API returns a string, check for rate limit message
        if (typeof res.data === 'string' && res.data.toLowerCase().includes('too many request')) {
          setErrorDetails('LeetCode contest API rate limit reached. Please try again in 1 hour.');
          setContestRating(null);
          return;
        }
        // The API returns an array of contest objects, find the latest attended contest with a rating
        const contests = res.data || [];
        const latest = Array.isArray(contests)
          ? contests.reverse().find((c: Contest) => c.attended && c.rating && c.ranking && c.ranking > 0)
          : null;
        if (latest) {
          setContestRating({
            rating: latest.rating,
            globalRanking: latest.ranking,
            totalParticipants: latest.totalParticipants || 0,
            topPercentage: latest.topPercentage || 0,
          });
        } else {
          setContestRating(null);
        }
      } catch {
        setContestRating(null);
        setErrorDetails('Failed to fetch contest rating.');
      }
    };
    fetchContestRating();
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

  return (
    <div className="p-6 bg-card text-foreground rounded-xl shadow-lg max-w-4xl mx-auto max-mobile-lg:p-4 max-mobile-sm:p-3 border border-border">
      {/* Header with refresh button and last updated info */}
      <div className="flex justify-between items-center mb-4 max-mobile-lg:flex-col max-mobile-lg:gap-3 max-mobile-lg:items-start">
        <div className="flex items-center max-mobile-lg:flex-col max-mobile-lg:items-start max-mobile-lg:gap-2">
          <h2 className="text-2xl font-bold max-mobile-lg:text-xl text-primary">LeetCode Stats</h2>
          {lastUpdated && (
            <span className="text-sm text-muted-foreground ml-3 max-mobile-lg:ml-0 max-mobile-lg:text-xs">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 max-mobile-lg:gap-2">
          <button 
            onClick={toggleDebug} 
            className="text-xs text-muted-foreground hover:text-primary max-mobile-lg:text-xs"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
          <button 
            onClick={refreshData}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors max-mobile-lg:px-2 max-mobile-lg:py-1 max-mobile-lg:text-xs"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
      
      {/* Error notification with more details */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive-foreground p-3 rounded mb-4 max-mobile-lg:p-2">
          <p className="font-semibold max-mobile-lg:text-sm">Notice: Using {isUsingCachedData ? 'cached' : 'fallback'} data</p>
          <p className="text-sm max-mobile-lg:text-xs">
            We encountered an error fetching the latest data: {errorDetails}. 
            {isUsingCachedData ? ` Showing data from ${new Date(leetcodeData?.lastUpdated || Date.now()).toLocaleString()}.` : ''}
          </p>
        </div>
      )}
      
      {/* Debugging info - only shown when toggled */}
      {showDebug && (
        <div className="bg-muted p-3 mb-4 rounded text-xs max-h-60 overflow-y-auto max-mobile-lg:p-2">
          <h3 className="text-sm font-semibold mb-2 text-primary">Debug Information</h3>
          <div className="space-y-1">
            {debugLog.map((message, index) => (
              <p key={index} className="text-muted-foreground max-mobile-lg:text-xs">{message}</p>
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
      
      {/* Contest Rating Section */}
      <div className="mb-8 bg-background rounded-lg p-6 border border-border flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-2 text-primary">LeetCode Contest Rating</h3>
        {contestRating ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold text-yellow-400">{contestRating.rating}</div>
            <div className="text-sm text-muted-foreground">Global Rank: <span className="font-semibold text-primary">{contestRating.globalRanking}</span></div>
            <div className="text-sm text-muted-foreground">Top <span className="font-semibold text-primary">{contestRating.topPercentage}%</span> of {contestRating.totalParticipants} participants</div>
          </div>
        ) : errorDetails && errorDetails.toLowerCase().includes('rate limit') ? (
          <div className="text-destructive-foreground">LeetCode contest API rate limit reached. Please try again in 1 hour.</div>
        ) : (
          <div className="text-muted-foreground">Contest rating data not available.</div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[500px] max-mobile-lg:min-h-auto max-mobile-lg:gap-4">
        {/* Left section - Stats */}
        <div className="flex-1 bg-background rounded-lg p-6 max-mobile-lg:p-4 max-mobile-sm:p-3 border border-border">
          <div className="flex items-center justify-center mb-22 max-mobile-lg:mb-4">
            <div 
              className="w-48 h-48 mx-auto relative cursor-pointer max-mobile-lg:w-32 max-mobile-lg:h-32 max-mobile-sm:w-28 max-mobile-sm:h-28"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {hovered ? (
                <div className="w-full h-full">
                  <CircularProgressbar
                    value={parseFloat(acceptanceRate) || 65.4}
                    text={`${acceptanceRate || '65.4'}%`}
                    styles={buildStyles({
                      textSize: window.innerWidth < 768 ? '12px' : '16px',
                      textColor: "var(--primary)",
                      pathColor: "var(--primary)",
                      trailColor: "var(--muted)",
                      pathTransition: "ease-in-out 0.3s",
                    })}
                  />
                  <div className="text-center mt-4 text-primary text-base max-mobile-lg:text-sm max-mobile-sm:text-xs">Acceptance</div>
                  <div className="text-center text-muted-foreground text-base max-mobile-lg:text-sm max-mobile-sm:text-xs">{totalSubmissions} submissions</div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <CircularProgressbar
                    value={(totalSolved / totalQuestions) * 100}
                    text={`${totalSolved}`}
                    styles={buildStyles({
                      textSize: window.innerWidth < 768 ? '20px' : '30px',
                      textColor: "var(--primary)",
                      pathColor: "url(#gradient)",
                      trailColor: "var(--muted)",
                      pathTransition: "ease-in-out 0.3s",
                    })}
                  />
                  <div className="text-center mt-4 text-primary text-base max-mobile-lg:text-sm max-mobile-sm:text-xs">/{totalQuestions}</div>
                  <div className="text-center text-muted-foreground text-lg mt-1 max-mobile-lg:text-base max-mobile-sm:text-sm">3 Attempting</div>
                </div>
              )}
              {/* SVG Gradient for the circular progress */}
              <svg style={{ height: 0 }}>
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="25%" stopColor="var(--secondary)" />
                    <stop offset="50%" stopColor="var(--accent)" />
                    <stop offset="75%" stopColor="var(--destructive)" />
                    <stop offset="100%" stopColor="var(--destructive)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col space-y-3 mt-8 max-mobile-lg:mt-4">
            <div className="bg-card rounded-md p-3 flex justify-between items-center max-mobile-sm:p-2 border border-border">
              <span className="text-primary font-medium max-mobile-sm:text-sm">Easy</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden max-mobile-sm:w-16">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(easySolved / totalEasy) * 100}%` }}
                  ></div>
                </div>
                <span className="max-mobile-sm:text-sm">{easySolved}/{totalEasy}</span>
              </div>
            </div>
            <div className="bg-card rounded-md p-3 flex justify-between items-center max-mobile-sm:p-2 border border-border">
              <span className="text-secondary font-medium max-mobile-sm:text-sm">Medium</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden max-mobile-sm:w-16">
                  <div 
                    className="h-full bg-secondary rounded-full" 
                    style={{ width: `${(mediumSolved / totalMedium) * 100}%` }}
                  ></div>
                </div>
                <span className="max-mobile-sm:text-sm">{mediumSolved}/{totalMedium}</span>
              </div>
            </div>
            <div className="bg-card rounded-md p-3 flex justify-between items-center max-mobile-sm:p-2 border border-border">
              <span className="text-destructive font-medium max-mobile-sm:text-sm">Hard</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden max-mobile-sm:w-16">
                  <div 
                    className="h-full bg-destructive rounded-full" 
                    style={{ width: `${(hardSolved / totalHard) * 100}%` }}
                  ></div>
                </div>
                <span className="max-mobile-sm:text-sm">{hardSolved}/{totalHard}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right section - Badges */}
        <div className="flex-1 bg-background rounded-lg p-6 max-mobile-lg:p-4 max-mobile-sm:p-3 border border-border">
          <div className="flex justify-between items-center mb-6 max-mobile-lg:mb-4">
            <div className="text-3xl font-bold max-mobile-lg:text-2xl max-mobile-sm:text-xl text-primary">Badges</div>
            <div className="text-3xl font-bold max-mobile-lg:text-2xl max-mobile-sm:text-xl text-primary">{badges.length}</div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-8 max-mobile-lg:gap-4 max-mobile-sm:gap-3">
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
                      className="w-30 h-30 rounded-md border border-border group-hover:border-primary transition-all max-mobile-lg:w-20 max-mobile-lg:h-20 max-mobile-sm:w-16 max-mobile-sm:h-16"
                      onError={(e) => handleImageError(e, badge)}
                      loading="lazy"
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-primary/80 rounded-md flex items-center justify-center transition-opacity duration-200 p-2">
                      <span className="text-xs text-center text-primary-foreground max-mobile-sm:text-xs">
                        {badge.displayName || badge.name || "Badge"}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              ))
            ) : (
              <div className="text-center p-4 w-full">
                <div className="bg-muted rounded-md p-8 flex flex-col items-center max-mobile-lg:p-4">
                  <Image
                    src="https://via.placeholder.com/96"
                    alt="No Badge"
                    height={96}
                    width={96}
                    className="w-24 h-24 rounded-md border border-border mb-3 max-mobile-lg:w-16 max-mobile-lg:h-16"
                  />
                  <p className="text-muted-foreground max-mobile-lg:text-sm">No badges available</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 max-mobile-lg:mt-4">
            <div className="text-muted-foreground text-lg max-mobile-lg:text-base max-mobile-sm:text-sm">Most Recent Badge</div>
            <div className="text-2xl font-semibold mt-1 max-mobile-lg:text-xl max-mobile-sm:text-lg text-primary">
              {badges.length > 0 ? (badges[0].displayName || badges[0].name || "No Badge") : "No Badge"}
            </div>
            {badges.length > 0 && badges[0].creationDate && (
              <div className="text-lg mt-1 text-muted-foreground max-mobile-lg:text-base max-mobile-sm:text-sm">
                Earned {new Date(badges[0].creationDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeSection;