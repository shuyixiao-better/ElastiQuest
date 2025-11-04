'use client';

import { useState, use } from 'react';
import {
  Card,
  Typography,
  Space,
  Button,
  Tag,
  Alert,
  message,
  Steps,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  FireOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  CodeOutlined,
  BookOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tasks } from '@/data/tasks';
import { useAppStore } from '@/stores/useAppStore';
import SmartCodeEditor from '@/components/CodeEditor/SmartCodeEditor';
import { executeESCommand } from '@/lib/api/esExecution';
import { validateTaskCompletion } from '@/lib/taskValidator';

const { Title, Paragraph, Text } = Typography;

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { gamification, completeTask, esConnections, activeConnectionId } = useAppStore();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [taskPassed, setTaskPassed] = useState(false);

  const task = tasks.find(t => t.id === resolvedParams.id);
  const activeConnection = esConnections.find(c => c.id === activeConnectionId);
  
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
      message.warning('请输入要执行的魔法咒语');
      return;
    }

    if (!activeConnection) {
      message.error('请先配置 ES 连接');
      return;
    }

    setLoading(true);
    setTaskPassed(false);

    try {
      // 调用后端执行 ES 命令
      const hideLoading = message.loading('正在施展魔法咒语...', 0);
      const executionResult = await executeESCommand(code, activeConnection);
      hideLoading();

      if (executionResult.success) {
        // 验证任务是否完成
        const validation = validateTaskCompletion(task!, executionResult);

        setResult({
          success: true,
          statusCode: executionResult.statusCode,
          responseBody: executionResult.responseBody,
          validation: validation,
        });

        if (validation.passed) {
          setTaskPassed(true);
          message.success({
            content: validation.message,
            duration: 3,
          });
        } else {
          message.warning({
            content: validation.message,
            duration: 5,
          });
        }
      } else {
        setResult({
          success: false,
          error: executionResult.error,
        });
        message.error({
          content: `❌ 咒语施展失败：${executionResult.error}`,
          duration: 5,
        });
      }
    } catch (error: any) {
      message.error('执行时发生错误：' + error.message);
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    completeTask(task.id, task.experience);
    message.success({
      content: (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>
            {task.successMessage || '🎉 任务完成！'}
          </div>
          <div style={{ marginTop: 4 }}>✨ 获得 {task.experience} 经验值</div>
        </div>
      ),
      duration: 4,
    });

    setTimeout(() => {
      router.push('/tasks');
    }, 2000);
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

        {/* 故事背景 */}
        <Card
          title={<><BookOutlined /> 故事背景</>}
          style={{
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            border: '2px solid #667eea30',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{
              padding: 16,
              background: 'white',
              borderRadius: 8,
              borderLeft: '4px solid #667eea',
            }}>
              <Text style={{ fontSize: 15, lineHeight: 1.8 }}>
                {task.story}
              </Text>
            </div>
            <div style={{
              padding: 16,
              background: '#fffbe6',
              borderRadius: 8,
              borderLeft: '4px solid #faad14',
            }}>
              <Text style={{ fontSize: 15, lineHeight: 1.8 }}>
                {task.scenario}
              </Text>
            </div>
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
              <Text strong style={{ fontSize: 16 }}>✨ 施展你的魔法咒语：</Text>
              <div style={{ marginTop: 8 }}>
                <SmartCodeEditor
                  value={code}
                  onChange={setCode}
                  placeholder="在这里输入 Elasticsearch API 请求...&#10;&#10;💡 提示：按 Ctrl+Space 可以显示智能建议"
                  rows={12}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleExecute}
                loading={loading}
                size="large"
                disabled={!activeConnection}
              >
                {loading ? '施展中...' : '✨ 施展魔法'}
              </Button>
              {taskPassed && !isCompleted && (
                <Button
                  type="primary"
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  icon={<CheckCircleOutlined />}
                  onClick={handleComplete}
                  size="large"
                >
                  🎉 完成任务
                </Button>
              )}
            </div>

            {!activeConnection && (
              <Alert
                message="⚠️ 需要配置 ES 连接"
                description={
                  <span>
                    请先 <Link href="/config" style={{ fontWeight: 'bold' }}>配置 ES 连接</Link> 才能执行任务
                  </span>
                }
                type="warning"
                showIcon
              />
            )}

            {result && (
              <Alert
                message={
                  result.success
                    ? (result.validation?.passed ? '✅ 任务验证通过！' : '⚠️ 执行成功，但未满足任务要求')
                    : '❌ 执行失败'
                }
                description={
                  <div>
                    {result.validation && (
                      <div style={{ marginBottom: 12, fontSize: 14 }}>
                        {result.validation.message}
                      </div>
                    )}
                    {result.success ? (
                      <details>
                        <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
                          查看响应详情（状态码: {result.statusCode}）
                        </summary>
                        <pre style={{
                          margin: 0,
                          background: '#f5f5f5',
                          padding: 12,
                          borderRadius: 4,
                          maxHeight: 300,
                          overflow: 'auto',
                        }}>
                          {result.responseBody}
                        </pre>
                      </details>
                    ) : (
                      <div style={{ color: '#ff4d4f' }}>
                        错误信息: {result.error}
                      </div>
                    )}
                  </div>
                }
                type={
                  result.success
                    ? (result.validation?.passed ? 'success' : 'warning')
                    : 'error'
                }
                closable
                onClose={() => {
                  setResult(null);
                  setTaskPassed(false);
                }}
              />
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
}

