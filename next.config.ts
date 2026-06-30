import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
  
      {
        protocol: "https",
        hostname: "i.ibb.co.com", // ২. নতুন ডোমেইনটি যোগ করা হলো
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;