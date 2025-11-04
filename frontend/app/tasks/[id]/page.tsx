'use client';

import { useState, use } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Input, 
  Tag, 
  Alert, 
  Collapse,
  message,
  Steps,
} from 'antd';
import { 
  ArrowLeftOutlined,
  FireOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tasks } from '@/data/tasks';
import { useAppStore } from '@/stores/useAppStore';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { gamification, completeTask } = useAppStore();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const task = tasks.find(t => t.id === resolvedParams.id);
  
  if (!task) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <Card>
          <Empty description="任务不存在" />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link href="/tasks">
              <Button type="primary">返回任务列表</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isCompleted = gamification.completedTasks.includes(task.id);

  const handleExecute = async () => {
    if (!code.trim()) {
      message.warning('请输入要执行的代码');
      return;
    }

    setLoading(true);
    
    // 模拟执行（实际项目中这里会调用后端 API）
    setTimeout(() => {
      setResult({
        success: true,
        message: '执行成功！',
        data: {
          acknowledged: true,
          index: 'my_first_index',
        },
      });
      setLoading(false);
      message.success('代码执行成功！');
    }, 1000);
  };

  const handleComplete = () => {
    completeTask(task.id, task.experience);
    message.success({
      content: (
        <div>
          <div style={{ fontWeight: 'bold' }}>🎉 任务完成！</div>
          <div>获得 {task.experience} 经验值</div>
        </div>
      ),
      duration: 3,
    });
    
    setTimeout(() => {
      router.push('/tasks');
    }, 1500);
  };

  const categoryColors = {
    create: '#52c41a',
    read: '#1890ff',
    update: '#faad14',
    delete: '#ff4d4f',
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 返回按钮 */}
        <Link href="/tasks">
          <Button icon={<ArrowLeftOutlined />}>
            返回任务列表
          </Button>
        </Link>

        {/* 任务信息 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Space>
                <Tag color={categoryColors[task.category]} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {task.category.toUpperCase()}
                </Tag>
                <Tag color="orange" icon={<FireOutlined />}>
                  +{task.experience} EXP
                </Tag>
                {isCompleted && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    已完成
                  </Tag>
                )}
              </Space>
            </div>
            
            <Title level={2} style={{ margin: 0 }}>
              {task.title}
            </Title>
            
            <Paragraph style={{ fontSize: 16, margin: 0 }}>
              {task.description}
            </Paragraph>
          </Space>
        </Card>

        {/* 任务步骤 */}
        <Card title={<><CodeOutlined /> 任务步骤</>}>
          <Steps
            direction="vertical"
            current={0}
            items={task.steps.map((step, index) => ({
              title: `步骤 ${index + 1}`,
              description: step.instruction,
            }))}
          />
        </Card>

        {/* 代码编辑器 */}
        <Card 
          title={<><PlayCircleOutlined /> 代码执行区</>}
          extra={
            <Space>
              <Button 
                icon={<BulbOutlined />}
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? '隐藏提示' : '显示提示'}
              </Button>
              <Button 
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? '隐藏答案' : '查看答案'}
              </Button>
            </Space>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {showHints && (
              <Alert
                message="💡 提示"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                    {task.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                }
                type="info"
                closable
              />
            )}

            {showSolution && task.solution && (
              <Alert
                message="✅ 参考答案"
                description={
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: 12, 
                    borderRadius: 4,
                    margin: '8px 0 0 0',
                  }}>
                    {task.solution}
                  </pre>
                }
                type="success"
                closable
              />
            )}

            <div>
              <Text strong>输入你的代码：</Text>
              <TextArea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="在这里输入 Elasticsearch API 请求..."
                rows={8}
                style={{ 
                  marginTop: 8,
                  fontFamily: 'monospace',
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />}
                onClick={handleExecute}
                loading={loading}
                size="large"
              >
                执行代码
              </Button>
              {result?.success && !isCompleted && (
                <Button 
                  type="primary"
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  icon={<CheckCircleOutlined />}
                  onClick={handleComplete}
                  size="large"
                >
                  完成任务
                </Button>
              )}
            </div>

            {result && (
              <Alert
                message={result.success ? '✅ 执行成功' : '❌ 执行失败'}
                description={
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                }
                type={result.success ? 'success' : 'error'}
                closable
                onClose={() => setResult(null)}
              />
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
}

