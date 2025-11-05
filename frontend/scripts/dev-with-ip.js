#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

// 获取本地 IP 地址
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // 跳过内部（即 127.0.0.1）和非 IPv4 地址
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          name: name,
          address: iface.address
        });
      }
    }
  }

  return ips;
}

// 显示启动信息
function displayStartupInfo() {
  const ips = getLocalIPs();
  
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                  ElastiQuest 前端服务                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log('🌐 访问地址:');
  console.log('   - Local:   http://localhost:3000');
  
  if (ips.length > 0) {
    ips.forEach(ip => {
      console.log(`   - Network: http://${ip.address}:3000 (${ip.name})`);
    });
  }
  
  console.log('\n');
  console.log('📝 提示:');
  console.log('   - 按 Ctrl+C 停止服务');
  console.log('   - 后端服务需要在 http://localhost:8080 运行');
  console.log('   - RAG 功能需要配置 backend/.env 文件中的 LLM_API_KEY');
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');
}

// 启动 Next.js 开发服务器
const nextDev = spawn('next', ['dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    HOSTNAME: '0.0.0.0', // 允许外部访问
  }
});

// 延迟显示启动信息，等待 Next.js 启动完成
setTimeout(() => {
  displayStartupInfo();
}, 2000);

nextDev.on('close', (code) => {
  console.log(`\n服务已停止 (退出码: ${code})\n`);
  process.exit(code);
});

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n正在停止服务...\n');
  nextDev.kill('SIGINT');
});

