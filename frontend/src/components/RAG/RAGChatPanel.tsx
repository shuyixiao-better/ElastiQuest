'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Space, message, Spin, Collapse, Typography } from 'antd';
import type { CollapseProps } from 'antd';
import { SendOutlined, ClearOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons';
import { streamRAGChat, HighlightSegment } from '@/lib/api/ragChat';
import HighlightedText from './HighlightedText';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function RAGChatPanel() {
  const [question, setQuestion] = useState('');
  const [contextMaterial, setContextMaterial] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    '你是一个智能助手。请结合你的知识和用户提供的参考资料来回答问题。如果你的回答中直接引用了参考资料的内容，请保持原文。'
  );
  const [temperature, setTemperature] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(2000);
  
  const [answer, setAnswer] = useState('');
  const [highlights, setHighlights] = useState<HighlightSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      message.warning('请输入问题');
      return;
    }

    setLoading(true);
    setAnswer('');
    setHighlights([]);
    setShowHighlights(false);

    try {
      await streamRAGChat(
        {
          question: question.trim(),
          contextMaterial: contextMaterial.trim() || undefined,
          systemPrompt: systemPrompt.trim() || undefined,
          temperature,
          maxTokens: maxTokens > 0 ? maxTokens : undefined,
        },
        // onChunk
        (content) => {
          setAnswer((prev) => prev + content);
        },
        // onComplete
        (highlightSegments) => {
          setHighlights(highlightSegments);
          setShowHighlights(true);
          setLoading(false);
          message.success('回答完成');
        },
        // onError
        (error) => {
          setLoading(false);
          message.error(`错误: ${error}`);
        }
      );
    } catch (error: any) {
      setLoading(false);
      message.error(`发生错误: ${error.message}`);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setContextMaterial('');
    setAnswer('');
    setHighlights([]);
    setShowHighlights(false);
  };

  // 高级设置面板配置
  const advancedSettingsItems: CollapseProps['items'] = [
    {
      key: 'settings',
      label: (
        <Space>
          <SettingOutlined />
          <span>高级设置</span>
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text strong>系统提示词</Text>
            <TextArea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="设置系统提示词..."
              rows={3}
              disabled={loading}
              style={{ marginTop: 8 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Text strong>温度 (Temperature): {temperature}</Text>
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value) || 1.0)}
                min={0}
                max={2}
                step={0.1}
                disabled={loading}
                style={{ marginTop: 8 }}
              />
            </div>

            <div>
              <Text strong>最大 Tokens: {maxTokens}</Text>
              <Input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2000)}
                min={100}
                max={4000}
                step={100}
                disabled={loading}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 标题 */}
        <div>
          <Title level={2}>🤖 RAG 智能问答</Title>
          <Text type="secondary">
            结合参考资料与大模型知识，获得更准确的答案。引用的内容会被高亮显示。
          </Text>
        </div>

        {/* 输入区域 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* 问题输入 */}
          <Card
            title={
              <Space>
                <SendOutlined />
                <span>问题</span>
              </Space>
            }
            size="small"
          >
            <TextArea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请输入你的问题..."
              rows={6}
              disabled={loading}
            />
          </Card>

          {/* 补充材料输入 */}
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>参考资料（可选）</span>
              </Space>
            }
            size="small"
          >
            <TextArea
              value={contextMaterial}
              onChange={(e) => setContextMaterial(e.target.value)}
              placeholder="粘贴相关的参考资料，帮助大模型更好地回答问题..."
              rows={6}
              disabled={loading}
            />
          </Card>
        </div>

        {/* 高级设置 */}
        <Collapse ghost items={advancedSettingsItems} />

        {/* 操作按钮 */}
        <Space>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            loading={loading}
            size="large"
          >
            {loading ? '生成中...' : '发送问题'}
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={loading}
            size="large"
          >
            清空
          </Button>
        </Space>

        {/* 回答区域 */}
        {(answer || loading) && (
          <Card
            title="💡 回答"
            extra={
              showHighlights && (
                <Text type="secondary">
                  <mark style={{ backgroundColor: '#fff3cd', padding: '2px 6px', borderRadius: '3px' }}>
                    高亮部分
                  </mark>
                  {' '}表示引用了参考资料
                </Text>
              )
            }
          >
            {loading && !answer && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" tip="正在生成回答..." />
              </div>
            )}
            
            {showHighlights && highlights.length > 0 ? (
              <HighlightedText segments={highlights} />
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', minHeight: '100px' }}>
                {answer}
                {loading && <span className="cursor">▊</span>}
              </div>
            )}
          </Card>
        )}
      </Space>

      <style jsx>{`
        .cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

