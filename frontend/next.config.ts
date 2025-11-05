import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 优化字体加载，避免 hydration 错误
  optimizeFonts: true,

  // 如果需要代理到后端 API
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8080/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
