export async function fetchLeetCodeData() {
    try {
      // Fetch stats data
      const statsResponse = await fetch('https://leetcode-stats-api.herokuapp.com/brijeshsingh');
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch LeetCode stats data');
      }
      const statsData = await statsResponse.json();
      
      // Fetch badges data
      const badgesResponse = await fetch('https://alfa-leetcode-api.onrender.com/brijeshsingh/Badges');
      if (!badgesResponse.ok) {
        throw new Error('Failed to fetch LeetCode badges data');
      }
      const badgesData = await badgesResponse.json();
      
      // Combine the data
      return {
        ...statsData,
        badges: badgesData.badges || badgesData || [],
      };
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      return null;
    }
  }