import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '首页 - ElastiQuest',
  description: '欢迎来到 ElastiQuest，开始你的 Elasticsearch 学习之旅！',
};

export default function HomePage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }} className="flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ElastiQuest
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          游戏化学习 Elasticsearch CRUD 操作
        </p>
        <p className="text-lg text-gray-500 mb-12">
          通过可视化界面与趣味任务，在"打怪升级"中轻松掌握 Elasticsearch！
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">📚 任务系统</h3>
            <p className="text-gray-600">
              分阶段学习 CRUD 操作，从基础到高级
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <h3 className="text-xl font-semibold mb-3">🎓 认证考试</h3>
            <p className="text-gray-600">
              ES认证工程师考试学习系统
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">🎮 游戏化</h3>
            <p className="text-gray-600">
              完成任务获得经验值，解锁成就徽章
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="text-xl font-semibold mb-3">🤖 RAG 问答</h3>
            <p className="text-gray-600">
              结合参考资料与 AI 智能问答
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/exam"
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg font-semibold"
          >
            🎓 ES认证考试学习
          </Link>
          <Link
            href="/tasks"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始任务
          </Link>
          <Link
            href="/rag"
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🤖 RAG 问答
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