import React, { useEffect, useState } from 'react';
import { useLocation, history, useParams } from '@umijs/max';
import { Card, Image, Typography, Descriptions, Button, Space, Divider, message } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const { Title, Text, Paragraph } = Typography;

const useStyles = createStyles(({ token }) => {
  return {
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
  };
});

const GoodsDetail: React.FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const [goodsDetail, setGoodsDetail] = useState<API.GoodsResponseDTO | null>(null);

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
  );
};

export default GoodsDetail;