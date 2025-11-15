/**
 * ES认证工程师考试知识点数据
 * 基于Elasticsearch认证考试大纲
 */

export interface ExamTopic {
  id: string;
  title: string;
  category: ExamCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  keyPoints: string[];
  estimatedTime: number; // 分钟
  prerequisites?: string[]; // 前置知识点ID
}

export type ExamCategory = 
  | 'installation' // 安装与配置
  | 'indexing' // 索引与数据管理
  | 'search' // 搜索与查询
  | 'aggregation' // 聚合分析
  | 'mapping' // 映射与分析器
  | 'cluster' // 集群管理
  | 'performance' // 性能优化
  | 'security'; // 安全配置

export interface ExamChallenge {
  id: string;
  topicId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  type: 'single-choice' | 'multiple-choice' | 'practical' | 'code-completion';
  question: string;
  options?: string[]; // 选择题选项
  correctAnswer?: string | string[]; // 正确答案
  practicalTask?: {
    instruction: string;
    initialCode?: string;
    expectedResult?: any;
    validationRules: ValidationRule[];
  };
  explanation: string; // 答案解析
  points: number; // 分值
  timeLimit?: number; // 时间限制（秒）
  hints?: string[];
}

export interface ValidationRule {
  type: 'contains' | 'equals' | 'regex' | 'custom';
  field?: string;
  value?: any;
  message: string;
}

export interface ExamLevel {
  id: string;
  name: string;
  description: string;
  requiredTopics: string[]; // 必须完成的知识点
  challenges: string[]; // 关卡挑战ID
  unlockCondition: {
    minLevel?: number;
    completedLevels?: string[];
    minScore?: number;
  };
  rewards: {
    experience: number;
    badge?: string;
    title?: string;
  };
}

// 考试知识点数据
export const examTopics: ExamTopic[] = [
  // 安装与配置
  {
    id: 'install-001',
    title: 'Elasticsearch安装与启动',
    category: 'installation',
    difficulty: 'beginner',
    description: '学习如何安装和启动Elasticsearch，理解基本配置文件',
    keyPoints: [
      '下载和安装ES',
      '启动ES服务',
      '验证ES运行状态',
      '理解elasticsearch.yml配置文件',
      '配置JVM参数'
    ],
    estimatedTime: 30
  },
  {
    id: 'install-002',
    title: '集群节点配置',
    category: 'installation',
    difficulty: 'intermediate',
    description: '配置ES集群，理解节点角色和发现机制',
    keyPoints: [
      '节点角色（master、data、ingest）',
      '集群发现机制',
      '节点间通信配置',
      '集群名称配置',
      '最小主节点数配置'
    ],
    estimatedTime: 45,
    prerequisites: ['install-001']
  },

  // 索引与数据管理
  {
    id: 'index-001',
    title: '索引基础操作',
    category: 'indexing',
    difficulty: 'beginner',
    description: '掌握索引的创建、删除和基本管理操作',
    keyPoints: [
      '创建索引',
      '删除索引',
      '查看索引信息',
      '索引别名',
      '索引模板'
    ],
    estimatedTime: 40
  },
  {
    id: 'index-002',
    title: '文档CRUD操作',
    category: 'indexing',
    difficulty: 'beginner',
    description: '学习文档的增删改查操作',
    keyPoints: [
      '索引文档（Index API）',
      '获取文档（Get API）',
      '更新文档（Update API）',
      '删除文档（Delete API）',
      '批量操作（Bulk API）'
    ],
    estimatedTime: 50,
    prerequisites: ['index-001']
  },
  {
    id: 'index-003',
    title: 'Reindex与数据迁移',
    category: 'indexing',
    difficulty: 'intermediate',
    description: '掌握数据重建索引和迁移技术',
    keyPoints: [
      'Reindex API使用',
      '跨集群Reindex',
      '数据转换和过滤',
      '性能优化',
      '版本冲突处理'
    ],
    estimatedTime: 60,
    prerequisites: ['index-002']
  },

  // 搜索与查询
  {
    id: 'search-001',
    title: '基础查询DSL',
    category: 'search',
    difficulty: 'beginner',
    description: '学习Elasticsearch查询DSL基础语法',
    keyPoints: [
      'Match查询',
      'Term查询',
      'Range查询',
      'Bool查询',
      '查询与过滤的区别'
    ],
    estimatedTime: 60
  },
  {
    id: 'search-002',
    title: '全文搜索',
    category: 'search',
    difficulty: 'intermediate',
    description: '掌握全文搜索的高级技巧',
    keyPoints: [
      'Match Phrase查询',
      'Multi Match查询',
      '相关性评分',
      'Boosting',
      'Minimum Should Match'
    ],
    estimatedTime: 70,
    prerequisites: ['search-001']
  },
  {
    id: 'search-003',
    title: '复合查询',
    category: 'search',
    difficulty: 'advanced',
    description: '学习复杂的组合查询技术',
    keyPoints: [
      'Bool查询嵌套',
      'Function Score查询',
      'Script查询',
      'Nested查询',
      'Parent-Child查询'
    ],
    estimatedTime: 90,
    prerequisites: ['search-002']
  },

  // 聚合分析
  {
    id: 'agg-001',
    title: '指标聚合',
    category: 'aggregation',
    difficulty: 'intermediate',
    description: '学习基础的指标聚合操作',
    keyPoints: [
      'Avg聚合',
      'Sum聚合',
      'Min/Max聚合',
      'Stats聚合',
      'Cardinality聚合'
    ],
    estimatedTime: 50,
    prerequisites: ['search-001']
  },
  {
    id: 'agg-002',
    title: '桶聚合',
    category: 'aggregation',
    difficulty: 'intermediate',
    description: '掌握桶聚合的使用方法',
    keyPoints: [
      'Terms聚合',
      'Range聚合',
      'Date Histogram聚合',
      'Histogram聚合',
      'Filter聚合'
    ],
    estimatedTime: 60,
    prerequisites: ['agg-001']
  },
  {
    id: 'agg-003',
    title: '管道聚合',
    category: 'aggregation',
    difficulty: 'advanced',
    description: '学习高级的管道聚合技术',
    keyPoints: [
      'Bucket Script',
      'Bucket Selector',
      'Moving Average',
      'Derivative',
      'Cumulative Sum'
    ],
    estimatedTime: 80,
    prerequisites: ['agg-002']
  },

  // 映射与分析器
  {
    id: 'mapping-001',
    title: '映射基础',
    category: 'mapping',
    difficulty: 'beginner',
    description: '理解ES映射的基本概念和字段类型',
    keyPoints: [
      '动态映射vs显式映射',
      '常用字段类型',
      'Text vs Keyword',
      '映射参数',
      '查看映射'
    ],
    estimatedTime: 50
  },
  {
    id: 'mapping-002',
    title: '分析器配置',
    category: 'mapping',
    difficulty: 'intermediate',
    description: '学习分析器的配置和自定义',
    keyPoints: [
      '标准分析器',
      'Character Filter',
      'Tokenizer',
      'Token Filter',
      '自定义分析器'
    ],
    estimatedTime: 70,
    prerequisites: ['mapping-001']
  },
  {
    id: 'mapping-003',
    title: '高级映射技术',
    category: 'mapping',
    difficulty: 'advanced',
    description: '掌握复杂的映射配置技术',
    keyPoints: [
      'Nested类型',
      'Object类型',
      'Join类型',
      'Multi-fields',
      'Dynamic Templates'
    ],
    estimatedTime: 90,
    prerequisites: ['mapping-002']
  },

  // 集群管理
  {
    id: 'cluster-001',
    title: '集群健康监控',
    category: 'cluster',
    difficulty: 'intermediate',
    description: '学习监控和维护集群健康状态',
    keyPoints: [
      '集群健康API',
      '节点状态查看',
      '分片分配',
      '集群统计信息',
      '任务管理API'
    ],
    estimatedTime: 60
  },
  {
    id: 'cluster-002',
    title: '分片管理',
    category: 'cluster',
    difficulty: 'advanced',
    description: '深入理解分片分配和管理',
    keyPoints: [
      '分片分配策略',
      '分片再平衡',
      '分片路由',
      '分片恢复',
      '分片过滤'
    ],
    estimatedTime: 80,
    prerequisites: ['cluster-001']
  },

  // 性能优化
  {
    id: 'perf-001',
    title: '索引性能优化',
    category: 'performance',
    difficulty: 'advanced',
    description: '学习提升索引性能的技巧',
    keyPoints: [
      'Bulk批量操作',
      'Refresh间隔调整',
      '副本数配置',
      '索引缓冲区设置',
      '合并策略优化'
    ],
    estimatedTime: 70,
    prerequisites: ['index-002']
  },
  {
    id: 'perf-002',
    title: '查询性能优化',
    category: 'performance',
    difficulty: 'advanced',
    description: '掌握查询优化的最佳实践',
    keyPoints: [
      'Filter vs Query',
      '查询缓存',
      'Routing优化',
      'Profile API分析',
      '避免深度分页'
    ],
    estimatedTime: 80,
    prerequisites: ['search-002']
  },

  // 安全配置
  {
    id: 'security-001',
    title: 'ES安全基础',
    category: 'security',
    difficulty: 'intermediate',
    description: '学习ES安全配置基础',
    keyPoints: [
      '启用X-Pack Security',
      '用户认证',
      '角色和权限',
      'API Key',
      'TLS/SSL配置'
    ],
    estimatedTime: 60
  }
];

// 考试关卡配置
export const examLevels: ExamLevel[] = [
  {
    id: 'level-1',
    name: '新手村 - ES入门',
    description: '学习ES的基础概念和基本操作',
    requiredTopics: ['install-001', 'index-001', 'index-002', 'search-001', 'mapping-001'],
    challenges: ['challenge-001', 'challenge-002', 'challenge-003'],
    unlockCondition: {},
    rewards: {
      experience: 500,
      badge: '🎓 ES学徒',
      title: 'ES学徒'
    }
  },
  {
    id: 'level-2',
    name: '进阶之路 - 查询大师',
    description: '深入学习ES查询和聚合',
    requiredTopics: ['search-002', 'agg-001', 'agg-002', 'mapping-002'],
    challenges: ['challenge-004', 'challenge-005', 'challenge-006'],
    unlockCondition: {
      completedLevels: ['level-1'],
      minLevel: 5
    },
    rewards: {
      experience: 1000,
      badge: '🔍 查询大师',
      title: '查询大师'
    }
  },
  {
    id: 'level-3',
    name: '高级挑战 - 架构师',
    description: '掌握集群管理和性能优化',
    requiredTopics: ['cluster-001', 'cluster-002', 'perf-001', 'perf-002'],
    challenges: ['challenge-007', 'challenge-008', 'challenge-009'],
    unlockCondition: {
      completedLevels: ['level-2'],
      minLevel: 10
    },
    rewards: {
      experience: 2000,
      badge: '🏆 ES架构师',
      title: 'ES架构师'
    }
  },
  {
    id: 'level-4',
    name: '终极考验 - 认证工程师',
    description: '完成认证工程师模拟考试',
    requiredTopics: ['search-003', 'agg-003', 'mapping-003', 'security-001'],
    challenges: ['challenge-010', 'challenge-011', 'challenge-012'],
    unlockCondition: {
      completedLevels: ['level-3'],
      minLevel: 15,
      minScore: 80
    },
    rewards: {
      experience: 5000,
      badge: '👑 认证工程师',
      title: 'Elasticsearch认证工程师'
    }
  }
];

// 分类信息
export const categoryInfo: Record<ExamCategory, { name: string; icon: string; color: string }> = {
  installation: { name: '安装与配置', icon: '⚙️', color: '#1890ff' },
  indexing: { name: '索引与数据', icon: '📚', color: '#52c41a' },
  search: { name: '搜索与查询', icon: '🔍', color: '#722ed1' },
  aggregation: { name: '聚合分析', icon: '📊', color: '#fa8c16' },
  mapping: { name: '映射与分析', icon: '🗺️', color: '#13c2c2' },
  cluster: { name: '集群管理', icon: '🌐', color: '#eb2f96' },
  performance: { name: '性能优化', icon: '⚡', color: '#faad14' },
  security: { name: '安全配置', icon: '🔒', color: '#f5222d' }
};
