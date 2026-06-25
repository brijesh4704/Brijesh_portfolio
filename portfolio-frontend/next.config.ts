// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* your existing config options here */
  images: {
    domains: ['assets.leetcode.com', 'leetcode.com', 'leetcode-solved-problems.vercel.app'],
  },
};

export default nextConfig;