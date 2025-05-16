import { Footer } from '@/components';

import { login, forgot, resetPassword } from '@/services/user-center/userController';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, SafetyOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { App, Tabs, Modal, Steps, Form, Input, Button, Radio, Space, Row, Col,message } from 'antd';
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
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  // const { message } = App.useApp();

  // 添加忘记密码相关状态
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [forgotForm] = Form.useForm();
  const [recoveryMethod, setRecoveryMethod] = useState<'phone' | 'email' | 'idCode'>('phone');

  // 添加验证码相关状态
  const [captcha, setCaptcha] = useState<string>('');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const captchaRef = React.useRef<HTMLCanvasElement>(null);

  // 处理Gitee登录
  const handleGiteeLogin = async () => {
    try {
      window.location.href = "http://localhost:8066/api/oauth/login/gitee";
    } catch (error) {
      message.error('获取Gitee授权链接失败');
    }
  };
  // 生成随机验证码
  const generateCaptcha = () => {
    const canvas = captchaRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置背景色
    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 生成4位随机验证码
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';

    for (let i = 0; i < 4; i++) {
      const char = characters.charAt(Math.floor(Math.random() * characters.length));
      code += char;

      // 随机颜色
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)})`;
      ctx.font = `bold ${18 + Math.floor(Math.random() * 10)}px Arial`;

      // 随机旋转
      const angle = (Math.random() - 0.5) * 0.3;
      ctx.translate(30 * i + 15, 30);
      ctx.rotate(angle);

      // 绘制字符
      ctx.fillText(char, 0, 0);

      // 恢复变换
      ctx.rotate(-angle);
      ctx.translate(-(30 * i + 15), -30);
    }

    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 添加干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    setCaptchaCode(code.toLowerCase());
  };

  // 初始化和刷新验证码
  React.useEffect(() => {
    generateCaptcha();
  }, []);

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
    // 检查是否通过验证码验证
    if (type === 'account') {
      // 使用表单验证后，不需要单独验证，直接比较值
      if ((values as any).captcha?.toLowerCase() !== captchaCode) {
        message.error('验证码错误');
        generateCaptcha();
        return;
      }
    }

    try {
      // 登录
      const msg = await login({
        ...values,
      });
      if (msg.status === 200) {
        // 保存 token 到 localStorage
        localStorage.setItem('token', msg.data?.token || '');
        await fetchUserInfo();

        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');

        message.success('登录成功');
        // 登录成功后重置验证码
        setCaptcha('');
        generateCaptcha();
        return;
      } else {
        setCaptcha('');
        generateCaptcha();
        message.error(msg.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);

      // 登录失败后也重置验证码
      setCaptcha('');
      generateCaptcha();
    }
  };
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
              resetText: '重置',
            },
            // 修改这里，确保在gitee登录时不显示按钮，在账号密码登录时只显示登录按钮
            render: (props, dom) => {
              return type === 'gitee' ? null : (
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => props.form?.submit?.()}
                  size="large"
                  style={{
                    width: '100%',
                    height: '40px',
                    fontSize: '16px'
                  }}
                >
                  登录
                </Button>
              );
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.png" />}
          title="智喵集市"
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
              {
                key: 'gitee',
                label: 'Gitee登录',
              }
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


              <div style={{ marginBottom: '5px' }}>
                <Row gutter={12} align="middle">
                  <Col span={15}>
                    <ProFormText
                      name="captcha"
                      fieldProps={{
                        size: 'large',
                        prefix: <SafetyOutlined />,
                        value: captcha,
                        onChange: (e) => setCaptcha(e.target.value),
                        style: { height: '40px', lineHeight: '10px' }, // 调整输入框高度和行高
                      }}
                      placeholder={'请输入验证码'}
                      rules={[
                        {
                          required: true,
                          message: '验证码是必填项！',
                        },
                        {
                          len: 4,
                          message: '请输入4位验证码',
                        },
                      ]}
                    />
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        cursor: 'pointer',
                        marginTop: '-23px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #d9d9d9',
                        borderRadius: '2px',
                        marginLeft: '2px',
                      }}
                      onClick={generateCaptcha}
                    >
                      <canvas
                        ref={captchaRef}
                        width={120}
                        height={40}
                        style={{ display: 'block' }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>

                <a style={{ float: 'right' }} onClick={() => setForgotPasswordVisible(true)}>
                  忘记密码
                </a>
              </div>
            </>
          )}

          {type === 'gitee' && (
            <div style={{
              textAlign: 'center',
              padding: '30px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                marginBottom: '30px',
                fontSize: '16px',
                color: 'rgba(0, 0, 0, 0.65)'
              }}>
                使用Gitee账号安全登录
              </div>
              <Button
                type="primary"
                size="large"
                onClick={handleGiteeLogin}
                style={{
                  width: '80%',
                  height: '50px',
                  fontSize: '16px',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                }}
                icon={<img
                  src="/gitee-logo.svg"
                  alt="Gitee"
                  style={{
                    width: '24px',
                    height: '24px',
                    marginRight: '8px'
                  }}
                />}
              >
                点击授权登录
              </Button>
            </div>
          )}
        </LoginForm>
      </div>
      <Footer />

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

const LoginPage: React.FC = () => {
  return (
    <App>
      <Login />
    </App>
  );
};

export default LoginPage;
