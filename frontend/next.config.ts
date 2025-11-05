import type { NextConfig } from "next";
import os from "os";

// 获取本机所有 IP 地址
function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const addr of iface) {
        // 跳过内部（即 127.0.0.1）和非 IPv4 地址
        if (addr.family === 'IPv4' && !addr.internal) {
          ips.push(addr.address);
        }
      }
    }
  }

  return ips;
}

const nextConfig: NextConfig = {
  /* config options here */

  // 允许开发环境的跨域请求（支持局域网 IP 访问）
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    ...getLocalIPs(), // 自动添加本机所有 IP
  ],

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
