/**
 * ES认证考试挑战题库
 */

import { ExamChallenge } from './examTopics';

export const examChallenges: ExamChallenge[] = [
  // Level 1 - 新手村挑战
  {
    id: 'challenge-001',
    topicId: 'index-001',
    title: '创建你的第一个索引',
    description: '学习如何创建一个基础的ES索引',
    difficulty: 'easy',
    type: 'practical',
    question: '创建一个名为 "products" 的索引，包含3个主分片和1个副本分片',
    practicalTask: {
      instruction: '使用PUT请求创建索引，设置正确的分片配置',
      initialCode: `PUT /products
{
  "settings": {
    // 在这里配置分片数
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'acknowledged',
          value: true,
          message: '索引创建成功'
        }
      ]
    },
    explanation: '使用 settings.number_of_shards 设置主分片数，settings.number_of_replicas 设置副本数',
    points: 10,
    timeLimit: 300,
    hints: [
      '主分片数使用 number_of_shards 参数',
      '副本数使用 number_of_replicas 参数',
      '这些参数放在 settings 对象中'
    ]
  },

  {
    id: 'challenge-002',
    topicId: 'index-002',
    title: '索引文档操作',
    description: '练习文档的增删改查',
    difficulty: 'easy',
    type: 'practical',
    question: '向 products 索引中添加一个商品文档',
    practicalTask: {
      instruction: '添加一个包含 name、price、category 字段的商品',
      initialCode: `POST /products/_doc/1
{
  // 在这里添加文档字段
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'result',
          value: 'created',
          message: '文档创建成功'
        }
      ]
    },
    explanation: '使用 POST 或 PUT 方法向索引添加文档，可以指定文档ID或让ES自动生成',
    points: 10,
    timeLimit: 300
  },

  {
    id: 'challenge-003',
    topicId: 'search-001',
    title: '基础查询练习',
    description: '使用match查询搜索文档',
    difficulty: 'easy',
    type: 'practical',
    question: '查询 products 索引中 name 字段包含 "laptop" 的所有商品',
    practicalTask: {
      instruction: '使用 match 查询搜索商品名称',
      initialCode: `GET /products/_search
{
  "query": {
    // 在这里编写查询
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'hits.total.value',
          message: '查询执行成功'
        }
      ]
    },
    explanation: 'match 查询用于全文搜索，会对查询词进行分词处理',
    points: 15,
    timeLimit: 300
  },

  // Level 2 - 进阶挑战
  {
    id: 'challenge-004',
    topicId: 'search-002',
    title: 'Bool查询组合',
    description: '使用bool查询组合多个条件',
    difficulty: 'medium',
    type: 'practical',
    question: '查询价格在100-500之间，且类别为"electronics"的商品',
    practicalTask: {
      instruction: '使用 bool 查询组合 range 和 term 查询',
      initialCode: `GET /products/_search
{
  "query": {
    "bool": {
      // 在这里组合查询条件
    }
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'hits',
          message: '查询执行成功'
        }
      ]
    },
    explanation: 'bool查询的must子句用于必须匹配的条件，filter子句用于过滤但不影响评分',
    points: 20,
    timeLimit: 600
  },

  {
    id: 'challenge-005',
    topicId: 'agg-001',
    title: '统计聚合',
    description: '计算商品的平均价格和总数',
    difficulty: 'medium',
    type: 'practical',
    question: '对所有商品进行统计分析，计算平均价格、最高价、最低价',
    practicalTask: {
      instruction: '使用 stats 聚合获取价格统计信息',
      initialCode: `GET /products/_search
{
  "size": 0,
  "aggs": {
    // 在这里添加聚合
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'aggregations',
          message: '聚合执行成功'
        }
      ]
    },
    explanation: 'stats聚合可以一次性计算count、min、max、avg、sum等统计值',
    points: 20,
    timeLimit: 600
  },

  {
    id: 'challenge-006',
    topicId: 'agg-002',
    title: '分组聚合',
    description: '按类别统计商品数量',
    difficulty: 'medium',
    type: 'practical',
    question: '使用terms聚合按category字段分组，统计每个类别的商品数量',
    practicalTask: {
      instruction: '使用 terms 聚合对类别进行分组统计',
      initialCode: `GET /products/_search
{
  "size": 0,
  "aggs": {
    "by_category": {
      // 在这里配置terms聚合
    }
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'aggregations.by_category.buckets',
          message: '分组聚合成功'
        }
      ]
    },
    explanation: 'terms聚合用于对字段值进行分组，返回每个分组的文档数量',
    points: 25,
    timeLimit: 600
  },

  // Level 3 - 高级挑战
  {
    id: 'challenge-007',
    topicId: 'mapping-002',
    title: '自定义分析器',
    description: '创建一个自定义的中文分析器',
    difficulty: 'hard',
    type: 'practical',
    question: '创建一个包含自定义分析器的索引，用于中文商品名称搜索',
    practicalTask: {
      instruction: '配置一个使用ik分词器的自定义分析器',
      initialCode: `PUT /products_cn
{
  "settings": {
    "analysis": {
      // 在这里配置自定义分析器
    }
  },
  "mappings": {
    "properties": {
      "name": {
        // 配置name字段使用自定义分析器
      }
    }
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'acknowledged',
          value: true,
          message: '索引创建成功'
        }
      ]
    },
    explanation: '自定义分析器可以组合character filter、tokenizer和token filter来满足特定需求',
    points: 30,
    timeLimit: 900
  },

  {
    id: 'challenge-008',
    topicId: 'cluster-001',
    title: '集群健康检查',
    description: '检查集群状态并理解健康指标',
    difficulty: 'hard',
    type: 'multiple-choice',
    question: '集群状态为yellow表示什么？',
    options: [
      'A. 所有主分片和副本分片都正常分配',
      'B. 所有主分片正常，但部分副本分片未分配',
      'C. 部分主分片未分配',
      'D. 集群不可用'
    ],
    correctAnswer: 'B',
    explanation: 'Yellow状态表示所有主分片都已分配，但至少有一个副本分片未分配。这通常发生在单节点集群中。',
    points: 15,
    timeLimit: 120
  },

  {
    id: 'challenge-009',
    topicId: 'perf-001',
    title: '批量索引优化',
    description: '使用bulk API批量导入数据',
    difficulty: 'hard',
    type: 'practical',
    question: '使用bulk API一次性导入多个商品文档',
    practicalTask: {
      instruction: '使用正确的bulk格式批量索引3个文档',
      initialCode: `POST /_bulk
// 在这里编写bulk请求体
`,
      validationRules: [
        {
          type: 'contains',
          field: 'errors',
          value: false,
          message: '批量操作成功'
        }
      ]
    },
    explanation: 'bulk API使用NDJSON格式，每个操作由两行组成：操作元数据和文档内容',
    points: 30,
    timeLimit: 900
  },

  // Level 4 - 终极挑战
  {
    id: 'challenge-010',
    topicId: 'search-003',
    title: '复杂查询组合',
    description: '使用function_score自定义评分',
    difficulty: 'expert',
    type: 'practical',
    question: '实现一个复杂查询：搜索商品名称，同时根据销量和评分调整相关性',
    practicalTask: {
      instruction: '使用function_score查询，结合field_value_factor提升热门商品排名',
      initialCode: `GET /products/_search
{
  "query": {
    "function_score": {
      // 在这里配置function_score查询
    }
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'hits.hits',
          message: '查询执行成功'
        }
      ]
    },
    explanation: 'function_score允许修改查询返回的文档评分，可以基于字段值、脚本等因素调整排序',
    points: 50,
    timeLimit: 1200
  },

  {
    id: 'challenge-011',
    topicId: 'agg-003',
    title: '管道聚合分析',
    description: '使用管道聚合计算移动平均',
    difficulty: 'expert',
    type: 'practical',
    question: '对每日销售数据进行date_histogram聚合，并计算7天移动平均',
    practicalTask: {
      instruction: '使用moving_avg管道聚合计算趋势',
      initialCode: `GET /sales/_search
{
  "size": 0,
  "aggs": {
    "daily_sales": {
      "date_histogram": {
        // 配置日期直方图
      },
      "aggs": {
        "total_amount": {
          // 计算每日总额
        },
        "moving_avg_amount": {
          // 配置移动平均
        }
      }
    }
  }
}`,
      validationRules: [
        {
          type: 'contains',
          field: 'aggregations',
          message: '聚合执行成功'
        }
      ]
    },
    explanation: '管道聚合对其他聚合的输出进行计算，moving_avg可以平滑时间序列数据',
    points: 50,
    timeLimit: 1200
  },

  {
    id: 'challenge-012',
    topicId: 'security-001',
    title: '安全配置',
    description: '配置基于角色的访问控制',
    difficulty: 'expert',
    type: 'multiple-choice',
    question: '在ES中，以下哪个角色拥有最高权限？',
    options: [
      'A. kibana_admin',
      'B. superuser',
      'C. monitoring_user',
      'D. ingest_admin'
    ],
    correctAnswer: 'B',
    explanation: 'superuser角色拥有对集群的完全访问权限，可以执行任何操作',
    points: 20,
    timeLimit: 120
  }
];

// 模拟考试配置
export interface MockExam {
  id: string;
  title: string;
  description: string;
  duration: number; // 分钟
  passingScore: number; // 及格分数
  totalPoints: number;
  challenges: string[]; // 挑战ID列表
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const mockExams: MockExam[] = [
  {
    id: 'mock-exam-1',
    title: 'ES认证工程师模拟考试 - 基础篇',
    description: '涵盖ES基础知识和基本操作',
    duration: 60,
    passingScore: 70,
    totalPoints: 100,
    challenges: ['challenge-001', 'challenge-002', 'challenge-003', 'challenge-004', 'challenge-005'],
    difficulty: 'beginner'
  },
  {
    id: 'mock-exam-2',
    title: 'ES认证工程师模拟考试 - 进阶篇',
    description: '涵盖查询优化和聚合分析',
    duration: 90,
    passingScore: 75,
    totalPoints: 150,
    challenges: ['challenge-004', 'challenge-005', 'challenge-006', 'challenge-007', 'challenge-008'],
    difficulty: 'intermediate'
  },
  {
    id: 'mock-exam-3',
    title: 'ES认证工程师模拟考试 - 完整版',
    description: '完整的认证考试模拟，涵盖所有知识点',
    duration: 120,
    passingScore: 80,
    totalPoints: 200,
    challenges: [
      'challenge-001', 'challenge-003', 'challenge-004', 'challenge-006',
      'challenge-007', 'challenge-009', 'challenge-010', 'challenge-011'
    ],
    difficulty: 'expert'
  }
];
