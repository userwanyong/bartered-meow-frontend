// import { logout } from '@/services/user-center/userController';
import {
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.nickname}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    // await logout();
    localStorage.removeItem('token');
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuItems = [
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
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
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
        case 'logout':
          flushSync(() => {
            setInitialState((s) => ({ ...s, currentUser: undefined }));
          });
          localStorage.removeItem('token');
          history.push('/user/login');
          break;
        default:
          break;
      }
    },
    [setInitialState],
  );

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems as any,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
