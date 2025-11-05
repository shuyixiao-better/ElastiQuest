'use client';

import { Form, Input, InputNumber, Select, Button, App } from 'antd';
import { ESConnectionConfig } from '@/stores/useAppStore';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect, useState } from 'react';
import { testESConnection } from '@/lib/api/esConnection';

interface ESConnectionFormProps {
  onSuccess?: () => void;
  editingConfig?: ESConnectionConfig | null;
  onCancelEdit?: () => void;
}

export default function ESConnectionForm({ onSuccess, editingConfig, onCancelEdit }: ESConnectionFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { addConnection, updateConnection } = useAppStore();
  const [testing, setTesting] = useState(false);

  // 当编辑配置改变时，更新表单值
  useEffect(() => {
    if (editingConfig) {
      form.setFieldsValue({
        name: editingConfig.name,
        host: editingConfig.host,
        port: editingConfig.port,
        scheme: editingConfig.scheme,
        username: editingConfig.username,
        password: editingConfig.password,
        environment: editingConfig.environment,
      });
    } else {
      form.resetFields();
    }
  }, [editingConfig, form]);

  const onFinish = (values: any) => {
    if (editingConfig) {
      // 编辑模式
      updateConnection(editingConfig.id, {
        name: values.name,
        host: values.host,
        port: values.port,
        scheme: values.scheme,
        username: values.username,
        password: values.password,
        environment: values.environment,
      });
      message.success('ES 连接配置已更新');
      form.resetFields();
      onCancelEdit?.();
    } else {
      // 添加模式
      const config: ESConnectionConfig = {
        id: Date.now().toString(),
        name: values.name,
        host: values.host,
        port: values.port,
        scheme: values.scheme,
        username: values.username,
        password: values.password,
        environment: values.environment,
        createdAt: new Date().toISOString(),
      };

      addConnection(config);
      message.success('ES 连接配置已添加');
      form.resetFields();
    }
    onSuccess?.();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancelEdit?.();
  };

  const handleTestConnection = async () => {
    try {
      // 验证表单
      await form.validateFields();
      const values = form.getFieldsValue();

      setTesting(true);
      const hideLoading = message.loading('正在测试连接...', 0);

      // 构建临时配置用于测试
      const testConfig: ESConnectionConfig = {
        id: editingConfig?.id || 'temp',
        name: values.name,
        host: values.host,
        port: values.port,
        scheme: values.scheme,
        username: values.username,
        password: values.password,
        environment: values.environment,
        createdAt: editingConfig?.createdAt || new Date().toISOString(),
      };

      const result = await testESConnection(testConfig);
      hideLoading();

      if (result.success) {
        message.success({
          content: (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>✅ 连接测试成功！</div>
              <div>集群名称: {result.clusterName}</div>
              <div>ES 版本: {result.version}</div>
              <div style={{ marginTop: 4, fontSize: '12px', color: '#52c41a' }}>
                配置正确，可以保存使用
              </div>
            </div>
          ),
          duration: 5,
        });
      } else {
        message.error({
          content: (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>❌ 连接测试失败</div>
              <div style={{ fontSize: '12px' }}>错误信息: {result.error || result.message}</div>
              <div style={{ marginTop: 4, fontSize: '12px', color: '#ff4d4f' }}>
                请检查配置后重试
              </div>
            </div>
          ),
          duration: 8,
        });
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.warning('请先填写完整的配置信息');
      } else {
        message.error({
          content: (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>❌ 测试连接时发生错误</div>
              <div style={{ fontSize: '12px' }}>{error.message || '未知错误'}</div>
            </div>
          ),
          duration: 8,
        });
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        scheme: 'http',
        port: 9200,
        environment: 'development',
      }}
    >
      <Form.Item
        name="name"
        label="配置名称"
        rules={[{ required: true, message: '请输入配置名称' }]}
      >
        <Input placeholder="例如：本地 ES" />
      </Form.Item>

      <Form.Item
        name="host"
        label="主机地址"
        rules={[{ required: true, message: '请输入主机地址' }]}
      >
        <Input placeholder="例如：localhost 或 192.168.1.100" />
      </Form.Item>

      <Form.Item
        name="port"
        label="端口"
        rules={[{ required: true, message: '请输入端口' }]}
      >
        <InputNumber min={1} max={65535} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="scheme" label="协议">
        <Select>
          <Select.Option value="http">HTTP</Select.Option>
          <Select.Option value="https">HTTPS</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="username" label="用户名（可选）">
        <Input placeholder="如果需要认证" />
      </Form.Item>

      <Form.Item name="password" label="密码（可选）">
        <Input.Password placeholder="如果需要认证" />
      </Form.Item>

      <Form.Item name="environment" label="环境">
        <Select>
          <Select.Option value="development">开发环境</Select.Option>
          <Select.Option value="test">测试环境</Select.Option>
          <Select.Option value="production">生产环境</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <Button
            type="default"
            onClick={handleTestConnection}
            loading={testing}
            block
          >
            {testing ? '测试中...' : '🔍 测试连接'}
          </Button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
              {editingConfig ? '更新配置' : '添加配置'}
            </Button>
            {editingConfig && (
              <Button onClick={handleCancel} style={{ flex: 1 }}>
                取消
              </Button>
            )}
          </div>
        </div>
      </Form.Item>
    </Form>
  );
}
