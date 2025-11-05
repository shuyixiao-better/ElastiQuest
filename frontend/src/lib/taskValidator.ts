import { Task } from '@/data/tasks';
import { ESExecutionResult } from './api/esExecution';

/**
 * 验证任务是否完成
 */
export function validateTaskCompletion(
  task: Task,
  executionResult: ESExecutionResult
): { passed: boolean; message: string } {
  // 如果执行失败，直接返回失败
  if (!executionResult.success) {
    return {
      passed: false,
      message: `执行失败：${executionResult.error || '未知错误'}`,
    };
  }

  // 检查 HTTP 状态码
  const statusCode = executionResult.statusCode || 0;
  
  // 根据任务类型验证
  switch (task.category) {
    case 'create':
      return validateCreateTask(task, executionResult, statusCode);
    case 'read':
      return validateReadTask(task, executionResult, statusCode);
    case 'update':
      return validateUpdateTask(task, executionResult, statusCode);
    case 'delete':
      return validateDeleteTask(task, executionResult, statusCode);
    default:
      return { passed: false, message: '未知的任务类型' };
  }
}

/**
 * 验证创建任务
 */
function validateCreateTask(
  task: Task,
  result: ESExecutionResult,
  statusCode: number
): { passed: boolean; message: string } {
  // 创建操作通常返回 200 或 201
  if (statusCode === 200 || statusCode === 201) {
    // 检查响应体是否包含成功标识
    const body = result.responseBody || '';
    
    if (task.id === 'create-1') {
      // 创建索引任务
      if (body.includes('acknowledged') && body.includes('true')) {
        return { passed: true, message: '✅ 魔法图书馆创建成功！' };
      }
    } else if (task.id === 'create-2') {
      // 创建文档任务
      if (body.includes('_id') || body.includes('result')) {
        return { passed: true, message: '✅ 魔法书收录成功！' };
      }
    } else if (task.id === 'create-3') {
      // 批量创建任务
      if (body.includes('items') || body.includes('took')) {
        return { passed: true, message: '✅ 魔法物品批量登记成功！' };
      }
    }
    
    // 通用验证：只要状态码正确就算通过
    return { passed: true, message: '✅ 创建操作成功！' };
  }
  
  return { 
    passed: false, 
    message: `❌ 创建失败，状态码：${statusCode}。请检查命令是否正确。` 
  };
}

/**
 * 验证读取任务
 */
function validateReadTask(
  task: Task,
  result: ESExecutionResult,
  statusCode: number
): { passed: boolean; message: string } {
  // 读取操作通常返回 200
  if (statusCode === 200) {
    const body = result.responseBody || '';
    
    if (task.id === 'read-1') {
      // 查询单个文档
      if (body.includes('_source') || body.includes('found')) {
        return { passed: true, message: '✅ 找到魔法书了！' };
      }
    } else if (task.id === 'read-2') {
      // 搜索所有文档
      if (body.includes('hits') && body.includes('total')) {
        return { passed: true, message: '✅ 藏书清单生成成功！' };
      }
    } else if (task.id === 'read-3') {
      // 条件查询
      if (body.includes('hits')) {
        return { passed: true, message: '✅ 找到相关的魔法书了！' };
      }
    }
    
    // 通用验证
    return { passed: true, message: '✅ 查询成功！' };
  }
  
  return { 
    passed: false, 
    message: `❌ 查询失败，状态码：${statusCode}。请检查索引是否存在。` 
  };
}

/**
 * 验证更新任务
 */
function validateUpdateTask(
  task: Task,
  result: ESExecutionResult,
  statusCode: number
): { passed: boolean; message: string } {
  // 更新操作通常返回 200
  if (statusCode === 200) {
    const body = result.responseBody || '';
    
    if (body.includes('result') && (body.includes('updated') || body.includes('noop'))) {
      if (task.id === 'update-1') {
        return { passed: true, message: '✅ 年龄更新成功！生日快乐！' };
      } else if (task.id === 'update-2') {
        return { passed: true, message: '✅ 魔法邮箱添加成功！' };
      } else if (task.id === 'update-3') {
        return { passed: true, message: '✅ 魔法力量提升成功！' };
      }
      return { passed: true, message: '✅ 更新成功！' };
    }
  }
  
  return { 
    passed: false, 
    message: `❌ 更新失败，状态码：${statusCode}。请检查文档是否存在。` 
  };
}

/**
 * 验证删除任务
 */
function validateDeleteTask(
  task: Task,
  result: ESExecutionResult,
  statusCode: number
): { passed: boolean; message: string } {
  // 删除操作通常返回 200
  if (statusCode === 200) {
    const body = result.responseBody || '';
    
    if (task.id === 'delete-1') {
      // 删除单个文档
      if (body.includes('result') && body.includes('deleted')) {
        return { passed: true, message: '✅ 损坏的魔法书已清理！' };
      }
    } else if (task.id === 'delete-2') {
      // 按查询删除
      if (body.includes('deleted') || body.includes('total')) {
        return { passed: true, message: '✅ 过期卷轴清理完成！' };
      }
    } else if (task.id === 'delete-3') {
      // 删除索引
      if (body.includes('acknowledged') && body.includes('true')) {
        return { passed: true, message: '✅ 黑魔法图书馆已摧毁！' };
      }
    }
    
    // 通用验证
    return { passed: true, message: '✅ 删除成功！' };
  }
  
  return { 
    passed: false, 
    message: `❌ 删除失败，状态码：${statusCode}。请检查目标是否存在。` 
  };
}

