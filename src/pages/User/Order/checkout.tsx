import React, { useEffect, useState } from 'react';
import { history, useLocation, useModel } from '@umijs/max';
import { Card, List, Typography, Button, Space, Divider, message, Form, Input, Row, Col, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { ShoppingCartOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import UserInfo from '@/components/UserInfo';
import { addOrder } from '@/services/user-center/orderController';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const useStyles = createStyles(({ token }) => ({
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '50px auto 0',
  },
  backButton: {
    marginBottom: '16px',
  },
  mainCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
  },
  price: {
    color: token.colorError,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  totalPrice: {
    color: token.colorError,
    fontSize: '24px',
    fontWeight: 'bold',
    marginLeft: '8px',
  },
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
  submitSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px 24px',
    background: '#f9f9f9',
    borderRadius: '0 0 8px 8px',
  },
  successCard: {
    textAlign: 'center',
    padding: '40px 0',
  },
  successIcon: {
    fontSize: '72px',
    color: token.colorSuccess,
    marginBottom: '24px',
  },
}));

const CheckoutPage: React.FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState<API.CartResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  // 移除这些不再需要的状态
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);
  
  // 获取当前登录用户信息
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  useEffect(() => {
    // 从路由状态中获取选中的购物车商品
    if (location.state && (location.state as any).selectedItems) {
      setCartItems((location.state as any).selectedItems);
    } else {
      message.error('未选择商品，无法结算');
      history.push('/cart');
    }
  }, [location.state]);

  const handleBack = () => {
    history.push('/cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.goods?.good_price as number * (item.num as number)), 0);
  };

  const handleSubmit = async (values: any) => {
    if (!currentUser || !currentUser.id) {
      message.warning('请先登录');
      return;
    }

    setLoading(true);
    try {
      // 生成订单名称，使用所有商品名称组合
      const orderName = cartItems.map(item => item.goods?.good_name).join('、');
      
      // 计算订单总价
      const totalPrice = calculateTotal();
      
      // 准备订单数据
      const orderData: API.OrderAddRequestDTO = {
        user_id: currentUser.id,
        address: values.address,
        remark: values.remark,
        name: orderName, // 添加订单名称
        total_price: totalPrice, // 添加订单总价
        carts: cartItems.map(item => ({
          id: item.id as string,
          num: item.num as number,
          good_id: item.good_id,
          user_id: currentUser.id,
        })),
      };
      
      // 调用后端API创建订单
      const response = await addOrder(orderData);
      console.log(response);
      
      
      if (response.status === 200) {
        setOrderSuccess(true);
        if (response.message) {
          setNewOrderId(response.message);
        }
        message.success('订单创建成功');
      } else {
        message.error(response.message || '创建订单失败');
      }
    } catch (error) {
      message.error('创建订单失败');
      console.error('创建订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 移除这个不再需要的函数
  const handleViewOrders = () => {
    history.push('/user/orders', { newOrderId });
  };

  // 移除整个订单成功页面的条件渲染
  if (orderSuccess) {
    return (
      <div>
        <div className={styles.topBar}>
          <UserInfo />
        </div>
        
        <div className={styles.container}>
          <Card className={styles.mainCard}>
            <div className={styles.successCard}>
              <CheckCircleOutlined className={styles.successIcon} />
              <Title level={3}>订单提交成功！</Title>
              <Paragraph>
                您的订单已成功提交，订单号：{newOrderId}
              </Paragraph>
              <Paragraph>
                订单总金额：<Text className={styles.price}>¥ {calculateTotal().toFixed(2)}</Text>
              </Paragraph>
              <Space size="large" style={{ marginTop: '24px' }}>
                <Button type="primary" size="large" onClick={handleViewOrders}>
                  查看我的订单
                </Button>
                <Button size="large" onClick={() => history.push('/goods')}>
                  继续购物
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.topBar}>
        <UserInfo />
      </div>
      
      <div className={styles.container}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          返回购物车
        </Button>

        <Card className={styles.mainCard}>
          <Title level={4}>
            <ShoppingCartOutlined style={{ marginRight: 8 }} />
            确认订单
          </Title>
          
          <Divider />
          
          <Spin spinning={loading}>
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img 
                        src={item.goods?.good_pic} 
                        alt={item.goods?.good_name} 
                        className={styles.productImage}
                      />
                    }
                    title={item.goods?.good_name}
                    description={
                      <div>
                        <div>单价: ¥{item.goods?.good_price}</div>
                        <div>数量: {item.num}件</div>
                      </div>
                    }
                  />
                  <div className={styles.price}>
                    ¥ {((item.goods?.good_price as number) * (item.num as number)).toFixed(2)}
                  </div>
                </List.Item>
              )}
            />
            
            <Divider />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                phone: currentUser?.phone || '',
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label="收货地址"
                    rules={[{ required: true, message: '请输入收货地址' }]}
                  >
                    <TextArea rows={3} placeholder="请输入详细收货地址" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input placeholder="请输入联系电话" />
                  </Form.Item>
                  
                  <Form.Item
                    name="remark"
                    label="订单备注"
                  >
                    <Input placeholder="可选，请输入订单备注" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
        
        <Card className={styles.mainCard}>
          <div className={styles.submitSection}>
            <Space size="large">
              <div>
                共 <Text strong>{cartItems.length}</Text> 件商品，
                合计: <Text className={styles.totalPrice}>¥ {calculateTotal().toFixed(2)}</Text>
              </div>
              <Button 
                type="primary" 
                size="large" 
                onClick={() => form.submit()}
                loading={loading}
              >
                提交订单
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;