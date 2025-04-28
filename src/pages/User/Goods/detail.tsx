import UserInfo from '@/components/UserInfo';
import { addCart } from '@/services/user-center/cartController';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { history, useLocation, useModel, useParams } from '@umijs/max';
import { App, Button, Card, Descriptions, Divider, Image, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { getUserById } from '@/services/user-center/userController'; // 添加导入
import LogoHeader from '@/components/LogoHeader';

const { Title, Text, Paragraph } = Typography;

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
    padding: '0', // 移除内边距
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
    justifyContent: 'space-between',
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

// 添加UserNickname组件
const UserNickname: React.FC<{ userId: string }> = ({ userId }) => {
  const [nickname, setNickname] = useState(userId || '-');

  useEffect(() => {
    const fetchUserNickname = async () => {
      if (!userId) {
        return;
      }
      try {
        const res = await getUserById({ id: userId });
        if (res.data?.nickname) {
          setNickname(res.data.nickname);
        }
      } catch (error) {
        // 保持显示userId
      }
    };

    fetchUserNickname();
  }, [userId]);

  return <span>{nickname}</span>;
};

const GoodsDetail: React.FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const [goodsDetail, setGoodsDetail] = useState<API.GoodsResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  // 获取当前登录用户信息
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  // 获取消息API
  const { message } = App.useApp();

  useEffect(() => {
    // 从路由状态中获取商品详情
    if (location.state && (location.state as any).goodsDetail) {
      setGoodsDetail((location.state as any).goodsDetail);
    } else {
      // 如果没有从路由状态获取到数据，可以通过 ID 从 API 获取
      // 这里可以添加通过 ID 获取商品详情的 API 调用
      message.error('商品信息获取失败，请返回重试');
    }
  }, [location.state, params.id, message]);

  const handleBack = () => {
    history.back();
  };

  const handleBuy = () => {
    // 检查商品是否有库存
    if (!goodsDetail || (goodsDetail.current_count as any) <= 0) {
      message.warning('该商品已售罄');
      return;
    }

    // 检查用户是否已登录
    if (!currentUser || !currentUser.id) {
      message.warning('请先登录');
      history.push('/user/login');
      return;
    }

    // 创建一个包含当前商品信息的对象，模拟购物车项结构
    const selectedItem = {
      id: `temp_${Date.now()}`, // 临时ID
      good_id: goodsDetail.id,
      user_id: currentUser.id,
      num: 1, // 默认数量为1
      selected: true,
      goods: {
        ...goodsDetail,
        good_id: goodsDetail.id,
      },
    };

    // 跳转到结算页面，并传递选中的商品
    history.push('/user/orders/checkout', { selectedItems: [selectedItem] });
  };

  const handleAddToCart = async () => {
    if (!goodsDetail) return;

    // 检查商品是否有库存
    if ((goodsDetail.current_count as any) <= 0) {
      message.warning('该商品已售罄');
      return;
    }

    // 检查用户是否已登录
    if (!currentUser || !currentUser.id) {
      message.warning('请先登录');
      history.push('/user/login');
      return;
    }

    setLoading(true);
    try {
      // 调用后端API添加商品到购物车
      const response = await addCart({
        good_id: goodsDetail.id, // 将商品ID转换为数字类型
        user_id: currentUser.id, // 从当前登录用户信息中获取userId
        num: 1, // 默认添加1个
      });

      if (response.status === 200) {
        message.success('成功加入购物车');
      } else if (response.status === 1013) {
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('加入购物车失败:', error);
      message.error('加入购物车失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!goodsDetail) {
    return <div className={styles.container}>加载中...</div>;
  }

  return (
    <div>
      {/* 添加顶部栏 */}
      <div className={styles.topBar}>
      <LogoHeader />
        <UserInfo />
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
                  style={{ display: 'block' }} // 确保图片是块级元素
                />
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div className={styles.infoContainer}>
                <Title level={2}>{goodsDetail.good_name}</Title>

                <Text className={styles.price}>¥ {goodsDetail.good_price}</Text>

                <Descriptions column={1}>
                  <Descriptions.Item label="商品状态">
                    {goodsDetail.state === 0 ? '在售' : '停售'}
                  </Descriptions.Item>
                  <Descriptions.Item label="商品名称">
                    {goodsDetail.good_name || '未知'}
                  </Descriptions.Item>
                  <Descriptions.Item label="上架时间">
                    {goodsDetail.created_time || '未知'}
                  </Descriptions.Item>
                  <Descriptions.Item label="卖家">
                    <UserNickname userId={goodsDetail.user_id || ''} />
                  </Descriptions.Item>
                  <Descriptions.Item label="剩余数量">
                    {goodsDetail.current_count || 0}
                  </Descriptions.Item>
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
                      loading={loading}
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

// Wrap the component with App to provide message context
const GoodsDetailWithApp: React.FC = () => (
  <App>
    <GoodsDetail />
  </App>
);

export default GoodsDetailWithApp;
