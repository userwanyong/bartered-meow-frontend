import {
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const { Text } = Typography;

const useStyles = createStyles(({ token }) => ({
  userInfo: {
    position: 'absolute',
    right: '50px',
  },
  username: {
    color: token.colorTextSecondary,
    cursor: 'pointer',
    '&:hover': {
      color: token.colorPrimary,
    },
  },
}));

const UserInfo: React.FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'first':
        history.push('/goods');
        break;
      case 'profile':
        history.push('/user/profile');
        break;
      case 'password':
        history.push('/user/password');
        break;
      case 'buy':
        history.push('/goods');
        break;
      case 'sell':
        history.push('/user/sell');
        break;
      case 'cart':
        history.push('/user/cart');
        break;
      case 'orders':
        history.push('/user/orders');
        break;
      case 'manage':
        history.push('/admin');
        break;
      case 'logout':
        localStorage.removeItem('token');
        history.push('/user/login');
        break;
      default:
        break;
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'first',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
    },
    {
      key: 'buy',
      icon: <ShoppingOutlined />,
      label: '我要买',
    },
    {
      key: 'sell',
      icon: <ShopOutlined />,
      label: '我要卖',
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined />,
      label: '我的购物车',
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: '我的订单',
    },
    ...(currentUser?.role === 0
      ? [
          {
            key: 'manage',
            icon: <SettingOutlined />,
            label: '后台管理',
          },
        ]
      : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <div className={styles.userInfo}>
      {currentUser ? (
        <Dropdown
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
          }}
          placement="bottomRight"
        >
          <Space>
            <Avatar
              size="large"
              src={currentUser.avatar_url}
              icon={!currentUser.avatar_url && <UserOutlined />}
            />
            <Text className={styles.username}>{currentUser.nickname}</Text>
          </Space>
        </Dropdown>
      ) : (
        <Space onClick={() => history.push('/user/login')} style={{ cursor: 'pointer' }}>
          <Avatar size="large" icon={<UserOutlined />} />
          <Text className={styles.username}>登录</Text>
        </Space>
      )}
    </div>
  );
};

export default UserInfo;
