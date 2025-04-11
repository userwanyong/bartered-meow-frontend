import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { history } from '@umijs/max';
import { Card, Image, Typography, Button, Space, Divider, message, Table, InputNumber, Empty, Checkbox } from 'antd';
import { createStyles } from 'antd-style';
import UserInfo from '@/components/UserInfo';
import type { ColumnsType } from 'antd/es/table';
import { list1, delete1, update1 } from '@/services/user-center/cartController';

const { Title, Text } = Typography;

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
  actionButtons: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
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
  emptyContainer: {
    padding: '40px 0',
    textAlign: 'center',
  },
  checkoutSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: '#f9f9f9',
    borderRadius: '0 0 8px 8px',
  },
}));

interface CartItem extends API.CartResponseDTO {
  selected: boolean;
}

const Cart: React.FC = () => {
  const { styles } = useStyles();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // 获取购物车数据
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await list1();
      if (response.data && Array.isArray(response.data)) {
        // 为每个商品添加选中状态属性
        const itemsWithSelected = response.data.map((item: API.CartResponseDTO) => ({
          ...item,
          selected: false,
        }));
        setCartItems(itemsWithSelected);
      }
    } catch (error) {
      message.error('获取购物车数据失败');
      console.error('获取购物车数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    // 检查是否所有商品都被选中
    if (cartItems.length > 0) {
      setSelectAll(cartItems.every(item => item.selected));
    } else {
      setSelectAll(false);
    }
  }, [cartItems]);

  const handleBack = () => {
    history.push('/goods');
  };

  // 更新购物车商品数量
  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      // 获取当前购物车项
      const currentItem = cartItems.find(item => item.id === id);
      if (!currentItem) return;
      
      // 先更新UI
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, num: quantity } : item
        )
      );
      
      // 调用后端API更新数量
      const response = await update1({
        id,
        num: quantity,
        // 从购物车项中获取用户ID和商品ID
        user_id: currentItem.user_id,
        good_id: currentItem.good_id
      });
      if (response.status === 1014) {
        message.warning(response.message);
      }else if (response.status !== 200) {
        message.error(response.message);
      }
    } catch (error) {
      message.error('更新商品数量失败');
      console.error('更新商品数量失败:', error);
      // 如果API调用失败，恢复原来的数据
      fetchCartItems();
    }
  };

  // 从购物车中移除商品
  const handleRemoveItem = async (id: string) => {
    try {
      const response = await delete1({ id });
      if (response.status === 200) {
        // 更新本地状态
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        message.success('商品已从购物车中移除');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('移除商品失败');
      console.error('移除商品失败:', error);
    }
  };

  // 选择/取消选择单个商品
  const handleSelectItem = (id: string, selected: boolean) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, selected } : item
      )
    );
  };

  // 全选/取消全选
  const handleSelectAll = (e: any) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setCartItems(prevItems => 
      prevItems.map(item => ({ ...item, selected: checked }))
    );
  };

  // 删除选中的商品
  const handleDeleteSelected = async () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      message.warning('请至少选择一件商品');
      return;
    }

    try {
      // 使用Promise.all并行处理多个删除请求
      await Promise.all(
        selectedItems.map(item => delete1({ id: item.id as any }))
      );
      
      // 更新本地状态
      setCartItems(prevItems => prevItems.filter(item => !item.selected));
      message.success('已删除选中商品');
    } catch (error) {
      message.error('删除选中商品失败');
      console.error('删除选中商品失败:', error);
      // 如果API调用失败，重新获取购物车数据
      fetchCartItems();
    }
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      message.warning('请至少选择一件商品');
      return;
    }
    
    // 这里可以添加结算逻辑，例如跳转到结算页面
    message.info('结算功能即将上线');
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.goods?.good_price as any * (item.num as any)), 0);
  };

  // 表格列定义
  const columns: ColumnsType<CartItem> = [
    {
      title: '选择',
      dataIndex: 'selected',
      key: 'selected',
      width: 80,
      render: (_, record) => (
        <Checkbox 
          checked={record.selected} 
          onChange={(e) => handleSelectItem(record.id as any, e.target.checked)} 
        />
      ),
    },
    {
      title: '商品',
      dataIndex: 'good_name',
      key: 'good_name',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.goods?.good_pic}
            alt={record.goods?.good_name}
            className={styles.productImage}
            preview={false}
          />
          <div style={{ marginLeft: 16 }}>
            <div>{record.goods?.good_name}</div>
            <div style={{ color: '#999', fontSize: '12px' }}>{record.goods?.good_description?.substring(0, 30)}...</div>
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'good_price',
      key: 'good_price',
      width: 120,
      render: (_, record) => (
        <Text className={record.goods?.good_price as any}>¥ {(record.goods?.good_price as any * (record.num as any)).toFixed(2)}</Text>
      ),
    },          
    {                                                                                                                                                                           
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (_, record) => (
        <div>
          <Button 
            icon={<MinusOutlined />} 
            onClick={() => handleQuantityChange(record.id as any, record.num as any - 1)}
            disabled={(record.num as number) <= 1}
          />
          <InputNumber
            min={1}
            max={record.goods?.current_count}
            value={record.num}
            onChange={(value) => handleQuantityChange(record.id as any, value as number)}
            style={{ margin: '0 5px', width: '30px' }}
          />
          <Button 
            icon={<PlusOutlined />} 
            onClick={() => handleQuantityChange(record.id as any, record.num as any + 1)}
            disabled={(record.num as number) >= (record.goods?.current_count as number)}
          />
        </div>
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      width: 120,
      render: (_, record) => (
        <Text className={styles.price}>¥ {(record.goods?.good_price as any * (record.num as any)).toFixed(2)}</Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id as any)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.topBar}>
        <UserInfo />
      </div>
      
      <div className={styles.container}>
        <Card className={styles.mainCard}>
          <Title level={4}>
            <ShoppingCartOutlined style={{ marginRight: 8 }} />
            我的购物车
          </Title>
          
          <Divider />
          
          {cartItems.length > 0 ? (
            <>
              <div style={{ 
                padding: '0 8px 16px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Checkbox checked={selectAll} onChange={handleSelectAll}>全选</Checkbox>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteSelected}
                  loading={loading}
                >
                  删除选中商品
                </Button>
              </div>
              
              <Table
                rowKey="id"
                columns={columns}
                dataSource={cartItems}
                pagination={false}
                bordered={false}
                loading={loading}
              />
              
              <div className={styles.checkoutSection}>
                <div>
                  <div>
                    已选商品 <Text strong>{cartItems.filter(item => item.selected).length}</Text> 件
                  </div>
                </div>
                <div>
                  <Space size="large">
                    <div>
                      合计: <Text className={styles.totalPrice}>¥ {calculateTotal().toFixed(2)}</Text>
                    </div>
                    <Button type="primary" size="large" onClick={handleCheckout} loading={loading}>
                      结算
                    </Button>
                  </Space>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyContainer}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={loading ? "正在加载..." : "购物车空空如也，快去选购商品吧！"}
              >
                {!loading && (
                  <Button type="primary" onClick={handleBack}>
                    去购物
                  </Button>
                )}
              </Empty>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Cart;