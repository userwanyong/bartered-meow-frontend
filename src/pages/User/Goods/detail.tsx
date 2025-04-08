import { 
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  LockOutlined,
  ShoppingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  SettingOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useLocation, history, useParams, useModel } from '@umijs/max';
import { Card, Image, Typography, Descriptions, Button, Space, Divider, message, Input, Dropdown, Avatar, Menu } from 'antd';
import { createStyles } from 'antd-style';
import type { MenuProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const useStyles = createStyles(({ token }) => ({
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backButton: {
    marginBottom: '16px',
  },
  mainCard: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',  // 移除内边距
    background: '#f5f5f5',
    height: '400px', // 固定高度
    width: '400px', // 宽度自适应
    overflow: 'hidden', // 超出部分隐藏
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoContainer: {
    padding: '24px',
  },
  price: {
    color: token.colorError,
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '24px',
  },
  actionButtons: {
    marginTop: '24px',
  },
  descriptionTitle: {
    marginTop: '32px',
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.8',
  },
  // 添加顶部栏相关样式
  topBar: {
    width: '100%',
    height: '60px',
    background: '#fff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 50px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
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

const GoodsDetail: React.FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [goodsDetail, setGoodsDetail] = useState<API.GoodsResponseDTO | null>(null);

  // 添加菜单点击处理函数
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
        history.push('/user/buy');
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
      icon: <HomeOutlined  />,
      label: '首页',
    },
    {
      key: 'profile',
      icon: <UserOutlined  />,
      label: '个人中心',
    },
    {
      key: 'password',
      icon: <LockOutlined  />,
      label: '修改密码',
    },
    {
      key: 'buy',
      icon: <ShoppingOutlined  />,
      label: '我要买',
    },
    {
      key: 'sell',
      icon: <ShopOutlined  />,
      label: '我要卖',
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined  />,
      label: '我的购物车',
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: '我的订单',
    },
    ...(currentUser?.role === 0 ? [{
      key: 'manage',
      icon: <SettingOutlined />,
      label: '后台管理',
    }] : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  useEffect(() => {
    // 从路由状态中获取商品详情
    if (location.state && (location.state as any).goodsDetail) {
      setGoodsDetail((location.state as any).goodsDetail);
    } else {
      // 如果没有从路由状态获取到数据，可以通过 ID 从 API 获取
      // 这里可以添加通过 ID 获取商品详情的 API 调用
      message.error('商品信息获取失败，请返回重试');
    }
  }, [location.state, params.id]);

  const handleBack = () => {
    history.back();
  };

  const handleBuy = () => {
    // 这里添加购买逻辑
    message.info('购买功能即将上线');
  };

  const handleAddToCart = () => {
    // 这里添加加入购物车逻辑
    message.info('加入购物车功能即将上线');
  };

  if (!goodsDetail) {
    return <div className={styles.container}>加载中...</div>;
  }

  return (
    <div>
      {/* 添加顶部栏 */}
      <div className={styles.topBar}>
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
                <Text className={styles.username}>
                  {currentUser.nickname}
                </Text>
              </Space>
            </Dropdown>
          ) : (
            <Space onClick={() => history.push('/user/login')} style={{ cursor: 'pointer' }}>
              <Avatar size="large" icon={<UserOutlined />} />
              <Text className={styles.username}>登录</Text>
            </Space>
          )}
        </div>
      </div>

      {/* 原有的内容 */}
      <div className={styles.container}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          返回商品列表
        </Button>

        <Card className={styles.mainCard}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div className={styles.imageContainer}>
                <Image
                  src={goodsDetail.good_pic}
                  alt={goodsDetail.good_name}
                  className={styles.productImage}
                  preview={false}
                  width="100%"
                  height="100%"
                  style={{ display: 'block' }}  // 确保图片是块级元素
                />
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className={styles.infoContainer}>
                <Title level={2}>{goodsDetail.good_name}</Title>

                <Text className={styles.price}>¥ {goodsDetail.good_price}</Text>

                <Descriptions column={1}>
                  <Descriptions.Item label="商品状态">{goodsDetail.state === 0 ? "在售" : "停售"}</Descriptions.Item>
                  <Descriptions.Item label="商品名称">{goodsDetail.good_name || '未知'}</Descriptions.Item>
                  <Descriptions.Item label="上架时间">{goodsDetail.created_time || '未知'}</Descriptions.Item>
                  <Descriptions.Item label="卖家">{goodsDetail.userId || '未知'}</Descriptions.Item>
                </Descriptions>

                <div className={styles.actionButtons}>
                  <Space size="large">
                    <Button type="primary" size="large" onClick={handleBuy}>
                      立即购买
                    </Button>
                    <Button
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                    >
                      加入购物车
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div style={{ padding: '0 24px 24px' }}>
            <Title level={4} className={styles.descriptionTitle}>
              商品详情
            </Title>
            <Paragraph className={styles.description}>
              {goodsDetail.good_description || '暂无详细描述'}
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GoodsDetail;