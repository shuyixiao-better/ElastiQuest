'use client';

import { useState, useRef, useEffect } from 'react';
import { Input, List, Card } from 'antd';
import { 
  ThunderboltOutlined, 
  DatabaseOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

interface Suggestion {
  text: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const suggestions: Suggestion[] = [
  // HTTP 方法
  { text: 'GET', description: '获取数据', icon: <SearchOutlined />, category: 'method' },
  { text: 'POST', description: '创建或搜索数据', icon: <ThunderboltOutlined />, category: 'method' },
  { text: 'PUT', description: '创建或更新数据', icon: <EditOutlined />, category: 'method' },
  { text: 'DELETE', description: '删除数据', icon: <DeleteOutlined />, category: 'method' },
  
  // 常用端点
  { text: '/_search', description: '搜索文档', icon: <SearchOutlined />, category: 'endpoint' },
  { text: '/_doc/', description: '文档操作', icon: <DatabaseOutlined />, category: 'endpoint' },
  { text: '/_update/', description: '更新文档', icon: <EditOutlined />, category: 'endpoint' },
  { text: '/_bulk', description: '批量操作', icon: <ThunderboltOutlined />, category: 'endpoint' },
  { text: '/_delete_by_query', description: '按查询删除', icon: <DeleteOutlined />, category: 'endpoint' },
  
  // 索引名称示例
  { text: '/magic_library', description: '魔法图书馆索引', icon: <DatabaseOutlined />, category: 'index' },
  { text: '/magic_items', description: '魔法物品索引', icon: <DatabaseOutlined />, category: 'index' },
  
  // JSON 模板
  { text: '{\n  "query": {\n    "match_all": {}\n  }\n}', description: '查询所有文档', icon: <SearchOutlined />, category: 'template' },
  { text: '{\n  "query": {\n    "match": {\n      "字段名": "搜索词"\n    }\n  }\n}', description: '匹配查询', icon: <SearchOutlined />, category: 'template' },
  { text: '{\n  "doc": {\n    "字段名": "新值"\n  }\n}', description: '更新文档', icon: <EditOutlined />, category: 'template' },
  { text: '{\n  "script": {\n    "source": "ctx._source.字段 += 1"\n  }\n}', description: '脚本更新', icon: <ThunderboltOutlined />, category: 'template' },
  { text: '{\n  "query": {\n    "range": {\n      "字段名": {"gt": 100}\n    }\n  }\n}', description: '范围查询', icon: <SearchOutlined />, category: 'template' },
];

interface SmartCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function SmartCodeEditor({ 
  value, 
  onChange, 
  placeholder = '在这里输入 Elasticsearch API 请求...',
  rows = 10,
}: SmartCodeEditorProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textAreaRef = useRef<any>(null);

  useEffect(() => {
    // 获取当前行的内容
    const lines = value.substring(0, cursorPosition).split('\n');
    const currentLine = lines[lines.length - 1].trim();
    
    if (currentLine.length > 0) {
      // 过滤建议
      const filtered = suggestions.filter(s => 
        s.text.toLowerCase().includes(currentLine.toLowerCase()) ||
        s.description.toLowerCase().includes(currentLine.toLowerCase())
      );
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Space 显示建议
    if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
      e.preventDefault();
      setShowSuggestions(true);
      setFilteredSuggestions(suggestions);
    }
    
    // ESC 隐藏建议
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (suggestion: Suggestion) => {
    const lines = value.substring(0, cursorPosition).split('\n');
    const currentLine = lines[lines.length - 1];
    const beforeCursor = value.substring(0, cursorPosition - currentLine.length);
    const afterCursor = value.substring(cursorPosition);
    
    // 如果是模板，添加换行
    const newValue = suggestion.category === 'template'
      ? beforeCursor + suggestion.text + afterCursor
      : beforeCursor + suggestion.text + ' ' + afterCursor;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // 聚焦回文本框
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 100);
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      method: 'HTTP 方法',
      endpoint: 'API 端点',
      index: '索引名称',
      template: 'JSON 模板',
    };
    return names[category] || category;
  };

  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, Suggestion[]>);

  return (
    <div style={{ position: 'relative' }}>
      <TextArea
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
          fontSize: 14,
          lineHeight: 1.6,
        }}
      />
      
      <div style={{ 
        marginTop: 8, 
        fontSize: 12, 
        color: '#999',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>💡 提示: 按 Ctrl+Space 显示智能建议</span>
        <span>{value.split('\n').length} 行</span>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <Card
          size="small"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {Object.entries(groupedSuggestions).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 12 }}>
              <div style={{ 
                fontSize: 12, 
                color: '#999', 
                marginBottom: 8,
                fontWeight: 'bold',
              }}>
                {getCategoryName(category)}
              </div>
              <List
                size="small"
                dataSource={items}
                renderItem={(item) => (
                  <List.Item
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: 4,
                    }}
                    onClick={() => insertSuggestion(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <List.Item.Meta
                      avatar={<span style={{ fontSize: 16 }}>{item.icon}</span>}
                      title={
                        <code style={{ 
                          fontSize: 13,
                          background: '#f5f5f5',
                          padding: '2px 6px',
                          borderRadius: 3,
                        }}>
                          {item.text.split('\n')[0]}
                          {item.text.includes('\n') && '...'}
                        </code>
                      }
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

