'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Tag, Progress, Modal, Result, Statistic, Row, Col, App } from 'antd';
import { 
  ClockCircleOutlined, 
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import { mockExams, examChallenges } from '@/data/examChallenges';
import { useExamStore } from '@/stores/useExamStore';
import { ChallengeView } from './ChallengeView';

const { Title, Text, Paragraph } = Typography;

export const MockExam: React.FC = () => {
  const { modal } = App.useApp();
  const { currentSession, startExam, submitAnswer, endExam, updateTimeRemaining } = useExamStore();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [examResults, setExamResults] = useState<any>(null);

  // 倒计时
  useEffect(() => {
    if (currentSession && currentSession.isActive) {
      const timer = setInterval(() => {
        if (currentSession.timeRemaining > 0) {
          updateTimeRemaining(currentSession.timeRemaining - 1);
        } else {
          // 时间到，自动提交
          handleEndExam();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSession]);

  // 开始考试
  const handleStartExam = (examId: string) => {
    const exam = mockExams.find(e => e.id === examId);
    if (!exam) return;

    modal.confirm({
      title: '开始模拟考试',
      content: (
        <div>
          <Paragraph>
            考试时长: {exam.duration} 分钟<br />
            题目数量: {exam.challenges.length} 题<br />
            总分: {exam.totalPoints} 分<br />
            及格分数: {exam.passingScore} 分
          </Paragraph>
          <Paragraph type="warning">
            考试开始后不能暂停，请确保有足够的时间完成考试。
          </Paragraph>
        </div>
      ),
      onOk: () => {
        startExam(examId, exam.challenges, exam.duration);
        setCurrentChallengeIndex(0);
      }
    });
  };

  // 结束考试
  const handleEndExam = () => {
    const session = endExam();
    if (!session) return;

    const exam = mockExams.find(e => e.id === session.examId);
    if (!exam) return;

    // 计算成绩
    const challenges = session.challenges.map(id => examChallenges.find(c => c.id === id)!);
    let totalScore = 0;
    let correctCount = 0;

    challenges.forEach(challenge => {
      const answer = session.answers[challenge.id];
      if (answer && answer.isCorrect) {
        totalScore += challenge.points;
        correctCount++;
      }
    });

    const percentage = (totalScore / exam.totalPoints) * 100;
    const passed = percentage >= exam.passingScore;
    const timeUsed = exam.duration * 60 - session.timeRemaining;

    setExamResults({
      exam,
      totalScore,
      percentage,
      passed,
      correctCount,
      totalQuestions: challenges.length,
      timeUsed
    });
  };

  // 完成当前题目
  const handleChallengeComplete = (score: number, timeSpent: number) => {
    if (!currentSession) return;

    const currentChallenge = examChallenges.find(
      c => c.id === currentSession.challenges[currentChallengeIndex]
    );
    if (!currentChallenge) return;

    submitAnswer(currentChallenge.id, {
      score,
      timeSpent,
      isCorrect: score >= currentChallenge.points * 0.6
    });
  };

  // 下一题
  const handleNext = () => {
    if (!currentSession) return;
    if (currentChallengeIndex < currentSession.challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    } else {
      // 最后一题，提示提交
      modal.confirm({
        title: '提交考试',
        content: '确定要提交考试吗？提交后将无法修改答案。',
        onOk: handleEndExam
      });
    }
  };

  // 上一题
  const handlePrevious = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 如果正在考试
  if (currentSession && currentSession.isActive) {
    const currentChallenge = examChallenges.find(
      c => c.id === currentSession.challenges[currentChallengeIndex]
    );

    if (!currentChallenge) return null;

    return (
      <div>
        {/* 考试头部 */}
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Text strong>题目进度:</Text>
                <Tag color="blue">
                  {currentChallengeIndex + 1} / {currentSession.challenges.length}
                </Tag>
              </Space>
            </Col>
            <Col>
              <Space size="large">
                <Statistic
                  title="剩余时间"
                  value={formatTime(currentSession.timeRemaining)}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ 
                    color: currentSession.timeRemaining < 300 ? '#ff4d4f' : '#1890ff',
                    fontSize: 24
                  }}
                />
                <Button danger onClick={handleEndExam}>
                  提交考试
                </Button>
              </Space>
            </Col>
          </Row>
          <Progress 
            percent={((currentChallengeIndex + 1) / currentSession.challenges.length) * 100}
            showInfo={false}
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* 题目 */}
        <ChallengeView
          challenge={currentChallenge}
          onComplete={handleChallengeComplete}
          onNext={currentChallengeIndex < currentSession.challenges.length - 1 ? handleNext : undefined}
          onPrevious={currentChallengeIndex > 0 ? handlePrevious : undefined}
        />
      </div>
    );
  }

  // 如果有考试结果
  if (examResults) {
    return (
      <div style={{ padding: '24px' }}>
        <Result
          status={examResults.passed ? 'success' : 'error'}
          title={examResults.passed ? '恭喜通过考试！' : '很遗憾，未能通过'}
          subTitle={
            <Space direction="vertical" size="large">
              <Text>
                {examResults.exam.title}
              </Text>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="得分"
                    value={examResults.totalScore}
                    suffix={`/ ${examResults.exam.totalPoints}`}
                    valueStyle={{ color: examResults.passed ? '#3f8600' : '#cf1322' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="正确率"
                    value={examResults.percentage}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: examResults.passed ? '#3f8600' : '#cf1322' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="用时"
                    value={formatTime(examResults.timeUsed)}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
              </Row>
              <div>
                <Text>
                  答对 {examResults.correctCount} / {examResults.totalQuestions} 题
                </Text>
              </div>
            </Space>
          }
          extra={[
            <Button type="primary" key="retry" onClick={() => {
              setExamResults(null);
              setSelectedExam(null);
            }}>
              返回考试列表
            </Button>,
            <Button key="review" onClick={() => setExamResults(null)}>
              查看详情
            </Button>
          ]}
        />
      </div>
    );
  }

  // 考试列表
  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TrophyOutlined /> 模拟考试
        </Title>
        <Paragraph>
          完整的ES认证工程师模拟考试，检验你的学习成果
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        {mockExams.map(exam => {
          const difficultyColors = {
            beginner: 'green',
            intermediate: 'blue',
            advanced: 'orange',
            expert: 'red'
          };

          const difficultyLabels = {
            beginner: '基础',
            intermediate: '进阶',
            advanced: '高级',
            expert: '专家'
          };

          return (
            <Col xs={24} lg={12} key={exam.id}>
              <Card
                hoverable
                actions={[
                  <Button
                    key="start"
                    type="primary"
                    size="large"
                    icon={<FireOutlined />}
                    onClick={() => handleStartExam(exam.id)}
                  >
                    开始考试
                  </Button>
                ]}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Title level={4}>{exam.title}</Title>
                  <Paragraph>{exam.description}</Paragraph>
                  
                  <Space wrap>
                    <Tag color={difficultyColors[exam.difficulty]}>
                      {difficultyLabels[exam.difficulty]}
                    </Tag>
                    <Tag icon={<ClockCircleOutlined />}>
                      {exam.duration} 分钟
                    </Tag>
                    <Tag>
                      {exam.challenges.length} 题
                    </Tag>
                    <Tag color="gold">
                      总分 {exam.totalPoints}
                    </Tag>
                  </Space>

                  <div>
                    <Text type="secondary">
                      及格分数: {exam.passingScore} 分 ({exam.passingScore}%)
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
