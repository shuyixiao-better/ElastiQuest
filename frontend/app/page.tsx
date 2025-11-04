import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '首页 - ElastiQuest',
  description: '欢迎来到 ElastiQuest，开始你的 Elasticsearch 学习之旅！',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ElastiQuest
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          游戏化学习 Elasticsearch CRUD 操作
        </p>
        <p className="text-lg text-gray-500 mb-12">
          通过可视化界面与趣味任务，在"打怪升级"中轻松掌握 Elasticsearch！
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">📚 任务系统</h3>
            <p className="text-gray-600">
              分阶段学习 CRUD 操作，从基础到高级
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">🎮 游戏化</h3>
            <p className="text-gray-600">
              完成任务获得经验值，解锁成就徽章
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">🔍 可视化</h3>
            <p className="text-gray-600">
              直观的查询构建器和结果展示
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/tasks"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始任务
          </Link>
          <Link
            href="/config"
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            配置 ES 连接
          </Link>
        </div>
      </div>
    </div>
  );
}