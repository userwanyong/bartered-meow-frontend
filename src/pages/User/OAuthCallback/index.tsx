import React, { useEffect } from 'react';
import { Spin, message } from 'antd';
import { history, useLocation, useModel } from '@umijs/max';

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');
  
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 解析URL参数
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        
        if (token) {
          // 保存token到localStorage
          localStorage.setItem('token', token);
          message.success('登录成功');
          
          // 获取用户信息
          await fetchUserInfo();
          
          // 跳转到首页
          history.push('/');
        } else {
          message.error('登录失败：未获取到token');
          // 登录失败后跳转回登录页
          setTimeout(() => {
            history.push('/user/login');
          }, 2000);
        }
      } catch (error) {
        message.error('登录处理失败');
        history.push('/user/login');
      }
    };
    
    handleCallback();
  }, [location]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="正在处理登录，请稍候..." />
    </div>
  );
};

export default OAuthCallback;