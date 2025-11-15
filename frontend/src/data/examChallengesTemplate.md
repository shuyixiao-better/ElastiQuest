# 考试挑战题目模板

本文档提供了添加新挑战题目的模板和示例。

## 题目类型

### 1. 单选题 (Single Choice)

```typescript
{
  id: 'challenge-xxx',
  topicId: 'topic-id',
  title: '题目标题',
  description: '题目描述',
  difficulty: 'easy', // easy | medium | hard | expert
  type: 'single-choice',
  question: '问题内容',
  options: [
    'A. 选项1',
    'B. 选项2',
    'C. 选项3',
    'D. 选项4'
  ],
  correctAnswer: 'A', // 正确答案
  explanation: '答案解析：为什么选A...',
  points: 10, // 分值
  timeLimit: 120, // 时间限制（秒）
  hints: [
    '提示1',
    '提示2'
  ]
}
```

### 2. 多选题 (Multiple Choice)

```typescript
{
  id: 'challenge-xxx',
  topicId: 'topic-id',
  title: '题目标题',
  description: '题目描述',
  difficulty: 'medium',
  type: 'multiple-choice',
  question: '问题内容（可能有多个正确答案）',
  options: [
    'A. 选项1',
    'B. 选项2',
    'C. 选项3',
    'D. 选项4'
  ],
  correctAnswer: ['A', 'C'], // 多个正确答案
  explanation: '答案解析：为什么选AC...',
  points: 15,
  timeLimit: 180
}
```

### 3. 实践题 (Practical)

```typescript
{
  id: 'challenge-xxx',
  topicId: 'topic-id',
  title: '题目标题',
  description: '题目描述',
  difficulty: 'hard',
  type: 'practical',
  question: '实践任务描述',
  practicalTask: {
    instruction: '详细的任务说明',
    initialCode: `GET /index/_search
{
  // 在这里编写查询
}`,
    expectedResult: {
      // 期望的返回结果结构
      hits: {
        total: { value: 10 }
      }
    },
    validationRules: [
      {
        type: 'contains',
        field: 'hits.total.value',
        message: '查询应该返回结果'
      },
      {
        type: 'equals',
        field: 'query.match.field',
        value: 'name',
        message: '应该使用match查询'
      }
    ]
  },
  explanation: '解决方案说明...',
  points: 30,
  timeLimit: 600,
  hints: [
    '提示1：使用match查询',
    '提示2：注意字段名称'
  ]
}
```

### 4. 代码补全 (Code Completion)

```typescript
{
  id: 'challenge-xxx',
  topicId: 'topic-id',
  title: '题目标题',
  description: '题目描述',
  difficulty: 'medium',
  type: 'code-completion',
  question: '补全以下ES查询代码',
  practicalTask: {
    instruction: '填写缺失的部分',
    initialCode: `GET /products/_search
{
  "query": {
    "___": {  // 填写查询类型
      "name": "laptop"
    }
  }
}`,
    validationRules: [
      {
        type: 'contains',
        value: 'match',
        message: '应该使用match查询'
      }
    ]
  },
  explanation: '应该填写 "match"，因为...',
  points: 20,
  timeLimit: 300
}
```

## 验证规则类型

### contains - 包含检查
```typescript
{
  type: 'contains',
  field: 'hits.total.value', // 可选，检查特定字段
  value: 10, // 可选，期望的值
  message: '验证失败的提示信息'
}
```

### equals - 相等检查
```typescript
{
  type: 'equals',
  field: 'query.match.field',
  value: 'name',
  message: '字段名称应该是name'
}
```

### regex - 正则表达式检查
```typescript
{
  type: 'regex',
  field: 'query',
  value: '/match|term/',
  message: '应该使用match或term查询'
}
```

### custom - 自定义验证
```typescript
{
  type: 'custom',
  message: '自定义验证失败',
  // 需要在代码中实现自定义验证逻辑
}
```

## 难度等级指南

### Easy (简单)
- 基础概念题
- 单一知识点
- 直接应用
- 分值：10-15分
- 时间：1-3分钟

### Medium (中等)
- 需要理解和应用
- 组合多个概念
- 需要一定思考
- 分值：15-25分
- 时间：3-5分钟

### Hard (困难)
- 复杂场景
- 需要深入理解
- 多步骤解决
- 分值：25-40分
- 时间：5-10分钟

### Expert (专家)
- 高级特性
- 性能优化
- 最佳实践
- 分值：40-50分
- 时间：10-20分钟

## 题目编写最佳实践

### 1. 清晰的题目描述
- 明确说明要求
- 提供必要的背景信息
- 避免歧义

### 2. 合理的难度设置
- 根据知识点难度设置
- 考虑前置知识要求
- 循序渐进

### 3. 有价值的提示
- 提示应该引导思考，而不是直接给答案
- 分层次提供提示
- 第一个提示最模糊，最后一个提示最具体

### 4. 详细的答案解析
- 解释为什么这个答案是正确的
- 说明其他选项为什么错误
- 提供相关知识点链接

### 5. 实践题的验证
- 确保验证规则准确
- 考虑多种正确答案的可能性
- 提供清晰的错误提示

## 示例：完整的题目

```typescript
{
  id: 'challenge-search-001',
  topicId: 'search-001',
  title: 'Match查询基础',
  description: '学习使用match查询进行全文搜索',
  difficulty: 'easy',
  type: 'practical',
  question: '使用match查询在products索引中搜索name字段包含"laptop"的所有商品',
  practicalTask: {
    instruction: '编写一个match查询，搜索name字段',
    initialCode: `GET /products/_search
{
  "query": {
    // 在这里编写match查询
  }
}`,
    expectedResult: {
      hits: {
        total: { value: 5 }
      }
    },
    validationRules: [
      {
        type: 'contains',
        field: 'query.match',
        message: '应该使用match查询'
      },
      {
        type: 'contains',
        field: 'query.match.name',
        value: 'laptop',
        message: '查询词应该是laptop'
      }
    ]
  },
  explanation: `
正确答案：
\`\`\`json
{
  "query": {
    "match": {
      "name": "laptop"
    }
  }
}
\`\`\`

解析：
- match查询用于全文搜索
- 会对查询词进行分词处理
- 适合搜索text类型的字段
- name字段会被分析器处理，匹配包含laptop的文档
  `,
  points: 15,
  timeLimit: 300,
  hints: [
    '使用match查询类型',
    'match查询的语法是 "match": { "字段名": "查询词" }',
    '字段名是name，查询词是laptop'
  ]
}
```

## 添加新题目的步骤

1. 确定题目所属的知识点（topicId）
2. 选择合适的题目类型
3. 设置合理的难度和分值
4. 编写清晰的题目和选项
5. 提供详细的答案解析
6. 添加有用的提示
7. 设置验证规则（实践题）
8. 测试题目的正确性
9. 添加到examChallenges数组中

## 题目ID命名规范

```
challenge-{category}-{number}

例如：
- challenge-search-001  (搜索类第1题)
- challenge-agg-005     (聚合类第5题)
- challenge-mapping-010 (映射类第10题)
```

## 分类缩写

- install: 安装配置
- index: 索引管理
- search: 搜索查询
- agg: 聚合分析
- mapping: 映射分析器
- cluster: 集群管理
- perf: 性能优化
- security: 安全配置

---

使用这个模板可以快速创建高质量的考试题目！
