import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { updatePassword } from '@/services/user-center/userController';
import UserInfo from '@/components/UserInfo';
import { history } from '@umijs/max';

const containerStyle = {
  padding: '24px',
  backgroundColor: '#f5f5f5',
  minHeight: 'calc(100vh - 64px)',
};

const topBarStyle = {
  background: '#fff',
  padding: '0 24px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
};

const cardStyle = {
  maxWidth: 500,
  margin: '0 auto',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
};

const cardTitleStyle = {
  fontSize: '18px',
  fontWeight: 600,
};

const PasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    // 验证两次输入的新密码是否一致
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }

    try {
      setLoading(true);
      const response = await updatePassword({
        old_password: values.oldPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });

      if (response.status === 200) {
        // 使用 Modal 显示成功提示
        Modal.success({
          title: '密码修改成功',
          content: '密码修改成功，请重新登录以确保账户安全',
          okText: '确定',
          onOk: () => {
            localStorage.removeItem('token');
            history.push('/user/login');
          },
          afterClose: () => {
            form.resetFields();
          }
        });
      } else {
        message.error(response.message || '密码修改失败');
      }
    } catch (error) {
      message.error('密码修改失败，请稍后重试');
      console.error('密码修改失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={topBarStyle}>
        <UserInfo />
      </div>

      <div style={containerStyle}>
        <Card
          title={<div style={cardTitleStyle}>修改密码</div>}
          style={cardStyle}
        >
          <Form
            form={form}
            name="password_form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="oldPassword"
              label="当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入当前密码"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度不能小于6位' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入新密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              rules={[
                { required: true, message: '请再次输入新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入新密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                确认修改
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default PasswordPage;