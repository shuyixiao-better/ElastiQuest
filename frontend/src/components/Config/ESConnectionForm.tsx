'use client';

import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { ESConnectionConfig } from '@/stores/useAppStore';
import { useAppStore } from '@/stores/useAppStore';

interface ESConnectionFormProps {
  onSuccess?: () => void;
}

export default function ESConnectionForm({ onSuccess }: ESConnectionFormProps) {
  const [form] = Form.useForm();
  const { addConnection } = useAppStore();

  const onFinish = (values: any) => {
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
    onSuccess?.();
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
        <Button type="primary" htmlType="submit" block>
          添加配置
        </Button>
      </Form.Item>
    </Form>
  );
}
