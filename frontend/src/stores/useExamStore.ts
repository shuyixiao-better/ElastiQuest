/**
 * ES认证考试学习状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProgress {
  // 完成的知识点
  completedTopics: string[];
  // 完成的挑战
  completedChallenges: Record<string, {
    score: number;
    timeSpent: number;
    attempts: number;
    lastAttempt: string;
    bestScore: number;
  }>;
  // 完成的关卡
  completedLevels: string[];
  // 解锁的成就
  achievements: string[];
  // 用户等级
  level: number;
  // 总经验值
  totalExperience: number;
  // 当前称号
  currentTitle?: string;
  // 学习统计
  stats: {
    totalStudyTime: number; // 分钟
    totalChallenges: number;
    successRate: number;
    strongCategories: string[];
    weakCategories: string[];
  };
}

export interface ExamSession {
  examId: string;
  startTime: string;
  challenges: string[];
  answers: Record<string, any>;
  currentChallengeIndex: number;
  timeRemaining: number;
  isActive: boolean;
}

interface ExamStore {
  // 用户进度
  userProgress: UserProgress;
  
  // 当前考试会话
  currentSession: ExamSession | null;
  
  // 当前学习的知识点
  currentTopic: string | null;
  
  // 操作方法
  completeChallenge: (challengeId: string, score: number, timeSpent: number) => void;
  completeTopic: (topicId: string) => void;
  completeLevel: (levelId: string, rewards: { experience: number; badge?: string; title?: string }) => void;
  unlockAchievement: (achievementId: string) => void;
  
  // 考试会话管理
  startExam: (examId: string, challenges: string[], duration: number) => void;
  submitAnswer: (challengeId: string, answer: any) => void;
  endExam: () => ExamSession | null;
  updateTimeRemaining: (time: number) => void;
  
  // 学习管理
  setCurrentTopic: (topicId: string | null) => void;
  
  // 统计更新
  updateStats: () => void;
  
  // 重置进度
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  completedTopics: [],
  completedChallenges: {},
  completedLevels: [],
  achievements: [],
  level: 1,
  totalExperience: 0,
  stats: {
    totalStudyTime: 0,
    totalChallenges: 0,
    successRate: 0,
    strongCategories: [],
    weakCategories: []
  }
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,
      currentSession: null,
      currentTopic: null,

      completeChallenge: (challengeId, score, timeSpent) => {
        set((state) => {
          const existing = state.userProgress.completedChallenges[challengeId];
          const attempts = existing ? existing.attempts + 1 : 1;
          const bestScore = existing ? Math.max(existing.bestScore, score) : score;

          return {
            userProgress: {
              ...state.userProgress,
              completedChallenges: {
                ...state.userProgress.completedChallenges,
                [challengeId]: {
                  score,
                  timeSpent,
                  attempts,
                  lastAttempt: new Date().toISOString(),
                  bestScore
                }
              },
              stats: {
                ...state.userProgress.stats,
                totalChallenges: state.userProgress.stats.totalChallenges + 1,
                totalStudyTime: state.userProgress.stats.totalStudyTime + Math.round(timeSpent / 60)
              }
            }
          };
        });
        get().updateStats();
      },

      completeTopic: (topicId) => {
        set((state) => {
          if (state.userProgress.completedTopics.includes(topicId)) {
            return state;
          }
          return {
            userProgress: {
              ...state.userProgress,
              completedTopics: [...state.userProgress.completedTopics, topicId]
            }
          };
        });
      },

      completeLevel: (levelId, rewards) => {
        set((state) => {
          if (state.userProgress.completedLevels.includes(levelId)) {
            return state;
          }

          const newExperience = state.userProgress.totalExperience + rewards.experience;
          const newLevel = Math.floor(newExperience / 1000) + 1;

          return {
            userProgress: {
              ...state.userProgress,
              completedLevels: [...state.userProgress.completedLevels, levelId],
              totalExperience: newExperience,
              level: newLevel,
              currentTitle: rewards.title || state.userProgress.currentTitle,
              achievements: rewards.badge 
                ? [...state.userProgress.achievements, rewards.badge]
                : state.userProgress.achievements
            }
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.userProgress.achievements.includes(achievementId)) {
            return state;
          }
          return {
            userProgress: {
              ...state.userProgress,
              achievements: [...state.userProgress.achievements, achievementId]
            }
          };
        });
      },

      startExam: (examId, challenges, duration) => {
        set({
          currentSession: {
            examId,
            startTime: new Date().toISOString(),
            challenges,
            answers: {},
            currentChallengeIndex: 0,
            timeRemaining: duration * 60, // 转换为秒
            isActive: true
          }
        });
      },

      submitAnswer: (challengeId, answer) => {
        set((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              answers: {
                ...state.currentSession.answers,
                [challengeId]: answer
              }
            }
          };
        });
      },

      endExam: () => {
        const session = get().currentSession;
        if (session) {
          set({ currentSession: null });
        }
        return session;
      },

      updateTimeRemaining: (time) => {
        set((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              timeRemaining: time
            }
          };
        });
      },

      setCurrentTopic: (topicId) => {
        set({ currentTopic: topicId });
      },

      updateStats: () => {
        set((state) => {
          const challenges = Object.values(state.userProgress.completedChallenges);
          const totalAttempts = challenges.reduce((sum, c) => sum + c.attempts, 0);
          const successfulAttempts = challenges.filter(c => c.bestScore >= 60).length;
          const successRate = totalAttempts > 0 ? (successfulAttempts / challenges.length) * 100 : 0;

          return {
            userProgress: {
              ...state.userProgress,
              stats: {
                ...state.userProgress.stats,
                successRate: Math.round(successRate)
              }
            }
          };
        });
      },

      resetProgress: () => {
        set({
          userProgress: initialProgress,
          currentSession: null,
          currentTopic: null
        });
      }
    }),
    {
      name: 'exam-storage'
    }
  )
);
