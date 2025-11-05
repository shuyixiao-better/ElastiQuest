import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ESConnectionConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  scheme: 'http' | 'https';
  username?: string;
  password?: string;
  apiKey?: string;
  environment: 'development' | 'test' | 'production';
  createdAt: string;
  lastUsed?: string;
}

interface GamificationState {
  level: number;
  experience: number;
  completedTasks: string[];
  achievements: string[];
}

interface AppState {
  // ES 配置
  esConnections: ESConnectionConfig[];
  activeConnectionId: string | null;
  
  // 游戏化状态
  gamification: GamificationState;
  
  // UI 状态
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

interface AppActions {
  // ES 配置操作
  addConnection: (config: ESConnectionConfig) => void;
  removeConnection: (id: string) => void;
  setActiveConnection: (id: string | null) => void;
  updateConnection: (id: string, config: Partial<ESConnectionConfig>) => void;

  // 游戏化操作
  completeTask: (taskId: string, experience: number) => void;
  unlockAchievement: (achievementId: string) => void;
  resetTask: (taskId: string) => void;
  resetAllTasks: () => void;
  resetAllProgress: () => void;

  // UI 操作
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      // 初始状态
      esConnections: [],
      activeConnectionId: null,
      gamification: {
        level: 1,
        experience: 0,
        completedTasks: [],
        achievements: [],
      },
      sidebarOpen: true,
      theme: 'light',
      
      // ES 配置操作
      addConnection: (config) =>
        set((state) => ({
          esConnections: [...state.esConnections, config],
        })),
      
      removeConnection: (id) =>
        set((state) => ({
          esConnections: state.esConnections.filter((c) => c.id !== id),
          activeConnectionId:
            state.activeConnectionId === id ? null : state.activeConnectionId,
        })),
      
      setActiveConnection: (id) =>
        set({
          activeConnectionId: id,
        }),
      
      updateConnection: (id, updates) =>
        set((state) => ({
          esConnections: state.esConnections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      
      // 游戏化操作
      completeTask: (taskId, experience) =>
        set((state) => {
          const newExperience = state.gamification.experience + experience;
          const newLevel = Math.floor(newExperience / 100) + 1; // 每 100 经验升一级
          return {
            gamification: {
              ...state.gamification,
              experience: newExperience,
              level: newLevel,
              completedTasks: state.gamification.completedTasks.includes(taskId)
                ? state.gamification.completedTasks
                : [...state.gamification.completedTasks, taskId],
            },
          };
        }),
      
      unlockAchievement: (achievementId) =>
        set((state) => ({
          gamification: {
            ...state.gamification,
            achievements: state.gamification.achievements.includes(achievementId)
              ? state.gamification.achievements
              : [...state.gamification.achievements, achievementId],
          },
        })),

      resetTask: (taskId) =>
        set((state) => ({
          gamification: {
            ...state.gamification,
            completedTasks: state.gamification.completedTasks.filter(id => id !== taskId),
          },
        })),

      resetAllTasks: () =>
        set((state) => ({
          gamification: {
            ...state.gamification,
            completedTasks: [],
          },
        })),

      resetAllProgress: () =>
        set((state) => ({
          gamification: {
            level: 1,
            experience: 0,
            completedTasks: [],
            achievements: [],
          },
        })),

      // UI 操作
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setTheme: (theme) =>
        set({
          theme,
        }),
    }),
    {
      name: 'elasticquest-store', // localStorage 键名
      skipHydration: false,
      partialize: (state) => ({
        esConnections: state.esConnections,
        activeConnectionId: state.activeConnectionId,
        gamification: state.gamification,
        theme: state.theme,
      }),
    }
  )
);

export type { ESConnectionConfig, GamificationState };
