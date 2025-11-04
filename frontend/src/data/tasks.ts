export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'create' | 'read' | 'update' | 'delete';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  experience: number;
  steps: TaskStep[];
  hints: string[];
  solution?: string;
}

export interface TaskStep {
  id: string;
  instruction: string;
  type: 'index' | 'document' | 'query' | 'update' | 'delete';
  validation?: {
    endpoint?: string;
    method?: string;
    expectedResult?: any;
  };
}

export const tasks: Task[] = [
  // ========== CREATE 任务 ==========
  {
    id: 'create-1',
    title: '创建你的第一个索引',
    description: '学习如何在 Elasticsearch 中创建一个新的索引。索引就像数据库中的表，用于存储相关的文档。',
    category: 'create',
    difficulty: 'beginner',
    experience: 10,
    steps: [
      {
        id: 'create-1-step-1',
        instruction: '创建一个名为 "my_first_index" 的索引',
        type: 'index',
        validation: {
          endpoint: '/my_first_index',
          method: 'HEAD',
        },
      },
    ],
    hints: [
      '使用 PUT 方法创建索引',
      '索引名称必须是小写字母',
      'API 路径格式: PUT /索引名称',
    ],
    solution: 'PUT /my_first_index',
  },
  {
    id: 'create-2',
    title: '添加你的第一个文档',
    description: '学习如何向索引中添加文档。文档是 JSON 格式的数据，包含你想要存储的信息。',
    category: 'create',
    difficulty: 'beginner',
    experience: 15,
    steps: [
      {
        id: 'create-2-step-1',
        instruction: '在 "users" 索引中创建一个用户文档，包含 name 和 age 字段',
        type: 'document',
        validation: {
          endpoint: '/users/_doc/1',
          method: 'GET',
        },
      },
    ],
    hints: [
      '使用 POST 或 PUT 方法添加文档',
      '文档内容是 JSON 格式',
      'API 路径格式: POST /索引名/_doc 或 PUT /索引名/_doc/文档ID',
      '示例: {"name": "张三", "age": 25}',
    ],
    solution: 'POST /users/_doc\n{\n  "name": "张三",\n  "age": 25\n}',
  },
  {
    id: 'create-3',
    title: '批量添加文档',
    description: '学习使用 Bulk API 一次性添加多个文档，这在处理大量数据时非常高效。',
    category: 'create',
    difficulty: 'intermediate',
    experience: 25,
    steps: [
      {
        id: 'create-3-step-1',
        instruction: '使用 Bulk API 向 "products" 索引添加 3 个产品文档',
        type: 'document',
      },
    ],
    hints: [
      '使用 POST /_bulk 端点',
      'Bulk API 使用特殊的 NDJSON 格式（每行一个 JSON）',
      '每个文档需要两行：操作行和数据行',
      '操作行格式: {"index": {"_index": "索引名"}}',
    ],
    solution: 'POST /_bulk\n{"index":{"_index":"products"}}\n{"name":"笔记本电脑","price":5999}\n{"index":{"_index":"products"}}\n{"name":"鼠标","price":99}\n{"index":{"_index":"products"}}\n{"name":"键盘","price":299}',
  },

  // ========== READ 任务 ==========
  {
    id: 'read-1',
    title: '查询单个文档',
    description: '学习如何通过文档 ID 获取特定的文档。',
    category: 'read',
    difficulty: 'beginner',
    experience: 10,
    steps: [
      {
        id: 'read-1-step-1',
        instruction: '从 "users" 索引中获取 ID 为 1 的文档',
        type: 'query',
        validation: {
          endpoint: '/users/_doc/1',
          method: 'GET',
        },
      },
    ],
    hints: [
      '使用 GET 方法',
      'API 路径格式: GET /索引名/_doc/文档ID',
    ],
    solution: 'GET /users/_doc/1',
  },
  {
    id: 'read-2',
    title: '搜索所有文档',
    description: '学习如何使用 Search API 查询索引中的所有文档。',
    category: 'read',
    difficulty: 'beginner',
    experience: 15,
    steps: [
      {
        id: 'read-2-step-1',
        instruction: '搜索 "users" 索引中的所有文档',
        type: 'query',
      },
    ],
    hints: [
      '使用 GET 方法和 _search 端点',
      'API 路径格式: GET /索引名/_search',
      '可以添加 ?size=10 参数限制返回数量',
    ],
    solution: 'GET /users/_search',
  },
  {
    id: 'read-3',
    title: '条件查询',
    description: '学习使用 match 查询来搜索包含特定关键词的文档。',
    category: 'read',
    difficulty: 'intermediate',
    experience: 20,
    steps: [
      {
        id: 'read-3-step-1',
        instruction: '在 "users" 索引中搜索 name 字段包含 "张" 的文档',
        type: 'query',
      },
    ],
    hints: [
      '使用 POST /索引名/_search',
      '请求体使用 query 和 match',
      '格式: {"query": {"match": {"字段名": "搜索词"}}}',
    ],
    solution: 'POST /users/_search\n{\n  "query": {\n    "match": {\n      "name": "张"\n    }\n  }\n}',
  },

  // ========== UPDATE 任务 ==========
  {
    id: 'update-1',
    title: '更新文档字段',
    description: '学习如何更新文档中的特定字段，而不影响其他字段。',
    category: 'update',
    difficulty: 'beginner',
    experience: 15,
    steps: [
      {
        id: 'update-1-step-1',
        instruction: '将 "users" 索引中 ID 为 1 的文档的 age 字段更新为 26',
        type: 'update',
      },
    ],
    hints: [
      '使用 POST /索引名/_update/文档ID',
      '请求体格式: {"doc": {"字段名": 新值}}',
    ],
    solution: 'POST /users/_update/1\n{\n  "doc": {\n    "age": 26\n  }\n}',
  },
  {
    id: 'update-2',
    title: '添加新字段',
    description: '学习如何向现有文档添加新的字段。',
    category: 'update',
    difficulty: 'beginner',
    experience: 15,
    steps: [
      {
        id: 'update-2-step-1',
        instruction: '向 "users" 索引中 ID 为 1 的文档添加 email 字段',
        type: 'update',
      },
    ],
    hints: [
      '使用 _update API',
      '在 doc 对象中添加新字段',
      '格式: {"doc": {"email": "user@example.com"}}',
    ],
    solution: 'POST /users/_update/1\n{\n  "doc": {\n    "email": "zhangsan@example.com"\n  }\n}',
  },
  {
    id: 'update-3',
    title: '使用脚本更新',
    description: '学习使用脚本来执行更复杂的更新操作，比如增加数值。',
    category: 'update',
    difficulty: 'intermediate',
    experience: 25,
    steps: [
      {
        id: 'update-3-step-1',
        instruction: '使用脚本将 "users" 索引中 ID 为 1 的文档的 age 增加 1',
        type: 'update',
      },
    ],
    hints: [
      '使用 script 参数',
      '脚本语言是 Painless',
      '格式: {"script": {"source": "ctx._source.age += 1"}}',
    ],
    solution: 'POST /users/_update/1\n{\n  "script": {\n    "source": "ctx._source.age += 1"\n  }\n}',
  },

  // ========== DELETE 任务 ==========
  {
    id: 'delete-1',
    title: '删除单个文档',
    description: '学习如何删除索引中的特定文档。',
    category: 'delete',
    difficulty: 'beginner',
    experience: 10,
    steps: [
      {
        id: 'delete-1-step-1',
        instruction: '删除 "users" 索引中 ID 为 1 的文档',
        type: 'delete',
      },
    ],
    hints: [
      '使用 DELETE 方法',
      'API 路径格式: DELETE /索引名/_doc/文档ID',
    ],
    solution: 'DELETE /users/_doc/1',
  },
  {
    id: 'delete-2',
    title: '按查询删除',
    description: '学习如何删除符合特定条件的所有文档。',
    category: 'delete',
    difficulty: 'intermediate',
    experience: 20,
    steps: [
      {
        id: 'delete-2-step-1',
        instruction: '删除 "users" 索引中所有 age 大于 30 的文档',
        type: 'delete',
      },
    ],
    hints: [
      '使用 POST /索引名/_delete_by_query',
      '使用 range 查询',
      '格式: {"query": {"range": {"age": {"gt": 30}}}}',
    ],
    solution: 'POST /users/_delete_by_query\n{\n  "query": {\n    "range": {\n      "age": {"gt": 30}\n    }\n  }\n}',
  },
  {
    id: 'delete-3',
    title: '删除索引',
    description: '学习如何删除整个索引及其所有数据。注意：这是不可逆的操作！',
    category: 'delete',
    difficulty: 'beginner',
    experience: 10,
    steps: [
      {
        id: 'delete-3-step-1',
        instruction: '删除 "test_index" 索引',
        type: 'delete',
      },
    ],
    hints: [
      '使用 DELETE 方法',
      'API 路径格式: DELETE /索引名',
      '删除索引会删除所有数据，请谨慎操作！',
    ],
    solution: 'DELETE /test_index',
  },
];

// 按类别分组任务
export const tasksByCategory = {
  create: tasks.filter(t => t.category === 'create'),
  read: tasks.filter(t => t.category === 'read'),
  update: tasks.filter(t => t.category === 'update'),
  delete: tasks.filter(t => t.category === 'delete'),
};

// 按难度分组任务
export const tasksByDifficulty = {
  beginner: tasks.filter(t => t.difficulty === 'beginner'),
  intermediate: tasks.filter(t => t.difficulty === 'intermediate'),
  advanced: tasks.filter(t => t.difficulty === 'advanced'),
};

