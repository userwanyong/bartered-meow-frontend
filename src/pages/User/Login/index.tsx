import { Footer } from '@/components';

import { login, forgot, resetPassword } from '@/services/user-center/userController';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { message, Tabs, Modal, Steps, Form, Input, Button, Radio, Space } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.UserLoginRequestDTO>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  
  // 添加忘记密码相关状态
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [forgotForm] = Form.useForm();
  // 修改recoveryMethod的类型定义
  const [recoveryMethod, setRecoveryMethod] = useState<'phone' | 'email' | 'idCode'>('phone');
  
  // 处理忘记密码流程
  const handleForgotPassword = () => {
    setForgotPasswordVisible(true);
    setCurrentStep(0);
    forgotForm.resetFields();
  };
  
  
  // 修改nextStep函数
  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        // 验证用户名
        await forgotForm.validateFields(['username']);
        setCurrentStep(currentStep + 1);
      } else if (currentStep === 1) {
        // 验证找回方式
        await forgotForm.validateFields(['recoveryMethod']);
        setRecoveryMethod(forgotForm.getFieldValue('recoveryMethod'));
        setCurrentStep(currentStep + 1);
      } else if (currentStep === 2) {
        // 验证联系方式
        let requestData: any = { username: forgotForm.getFieldValue('username') };
        
        if (recoveryMethod === 'phone') {
          await forgotForm.validateFields(['phone']);
          requestData.phone = forgotForm.getFieldValue('phone');
        } else if (recoveryMethod === 'email') {
          await forgotForm.validateFields(['email']);
          requestData.email = forgotForm.getFieldValue('email');
        } else if (recoveryMethod === 'idCode') {
          await forgotForm.validateFields(['idCode']);
          requestData.id = forgotForm.getFieldValue('idCode');
        }
        
        const response = await forgot(requestData);
        
        if (response && response.data) {
          // 校验通过，保存返回的oldPassword用于重置密码
          forgotForm.setFieldsValue({ oldPassword: response.data });
          message.success('验证成功');
          setCurrentStep(currentStep + 1);
        } else {
          message.error('身份验证失败，请检查您的信息');
        }
      } else if (currentStep === 3) {
        // 验证新密码
        await forgotForm.validateFields(['newPassword', 'confirmPassword']);
        const username = forgotForm.getFieldValue('username');
        const oldPassword = forgotForm.getFieldValue('oldPassword');
        const newPassword = forgotForm.getFieldValue('newPassword');
        const confirmPassword = forgotForm.getFieldValue('confirmPassword');
        
        if (newPassword !== confirmPassword) {
          message.error('两次输入的密码不一致');
          return;
        }
        
        // 调用resetPassword方法重置密码
        const result = await resetPassword({
          username,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        });
        
        if (result && result.status === 200) {
          message.success('密码重置成功，请使用新密码登录');
          setForgotPasswordVisible(false);
        } else {
          message.error('密码重置失败：' + (result?.message || '未知错误'));
        }
      }
    } catch (error) {
      console.error('表单验证或API调用失败:', error);
    }
  };
  
  // 修改renderStepContent函数，添加隐藏字段存储oldPassword
  // 修改renderStepContent函数，正确处理身份码选项
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 6, max: 11, message: '用户名长度应为6-11位' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
        );
      case 1:
        return (
          <Form.Item name="recoveryMethod" rules={[{ required: true, message: '请选择找回方式' }]}>
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="phone">通过手机号找回</Radio>
                <Radio value="email">通过邮箱找回</Radio>
                <Radio value="idCode">通过身份码找回</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      case 2:
        if (recoveryMethod === 'phone') {
          return (
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
            </Form.Item>
          );
        } else if (recoveryMethod === 'email') {
          return (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
            </Form.Item>
          );
        } else if (recoveryMethod === 'idCode') {
          return (
            <Form.Item
              name="idCode"
              rules={[
                { required: true, message: '请输入身份码' },
                { min: 6, max: 20, message: '请输入有效的身份码' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入身份码" />
            </Form.Item>
          );
        }
        return null;
      case 3:
        return (
          <>
            <Form.Item name="oldPassword" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, max: 15, message: '密码长度应为6-15位' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认新密码' },
                { min: 6, max: 15, message: '密码长度应为6-15位' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };
  
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.UserLoginRequestDTO) => {
    try {
      // 登录
      const msg = await login({
        ...values,
        // type,
      });
      if (msg.status === 200) {
        const defaultLoginSuccessMessage = '登录成功！';
        // 保存 token 到 localStorage
        localStorage.setItem('token', msg.data?.token || '');
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        message.error(msg.message);
      }

      // 如果失败去设置用户错误信息
      // setUserLoginState(user);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  // const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.png" />}
          title="交易喵"
          subTitle={'    '}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequestDTO);
          }}
          actions={
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <span>没有账号？</span>
              <a style={{ fontWeight: 'bold', marginLeft: '8px' }} onClick={() => history.push('/user/register')}>
                立即注册
              </a>
            </div>
          }
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {
                    min: 6,
                    max: 11,
                    type: 'string',
                    message: '账号长度应为6-11位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 6,
                    max: 15,
                    type: 'string',
                    message: '密码长度应为6-15位！',
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>

            <a style={{ float: 'right' }} onClick={handleForgotPassword}>
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
      
      {/* 忘记密码弹窗 */}
      <Modal
        title="找回密码"
        open={forgotPasswordVisible}
        onCancel={() => setForgotPasswordVisible(false)}
        footer={null}
        width={500}
        styles={{ body: { padding: '20px' } }}
      >
        <Steps
          current={currentStep}
          items={[
            { title: '账号验证' },
            { title: '选择方式' },
            { title: '身份验证' },
            { title: '重置密码' },
          ]}
          style={{ marginBottom: 24 }}
          size="small"
        />
        
        <Form form={forgotForm} layout="vertical">
          {renderStepContent()}
          
          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  上一步
                </Button>
              )}
              <Button type="primary" onClick={nextStep}>
                {currentStep === 3 ? '完成' : '下一步'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
