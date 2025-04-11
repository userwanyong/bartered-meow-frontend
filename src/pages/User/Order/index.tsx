import React, { useEffect, useState } from 'react';
import { history, useLocation } from '@umijs/max';
import { Card, Table, Typography, Button, Space, Divider, message, Tag, Empty, Modal } from 'antd';
import { createStyles } from 'antd-style';
import { ShoppingOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserInfo from '@/components/UserInfo';
import type { ColumnsType } from 'antd/es/table';
import { listOrder, cancelOrder, getOrderById, deleteOrder } from '@/services/user-center/orderController';

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
  emptyContainer: {
    padding: '40px 0',
    textAlign: 'center',
  },
}));

const OrderPage: React.FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const [orders, setOrders] = useState<API.OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await listOrder();
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        
        // 如果是从结算页面跳转过来，高亮显示新订单
        if (location.state && (location.state as any).newOrderId) {
          setNewOrderId((location.state as any).newOrderId);
        }
      }
    } catch (error) {
      message.error('获取订单数据失败');
      console.error('获取订单数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [location.state]);

  const handleBack = () => {
    history.push('/goods');
  };

  // 取消订单
  const handleCancelOrder = async (id: string) => {
    Modal.confirm({
      title: '确认取消订单',
      icon: <ExclamationCircleOutlined />,
      content: '取消订单后无法恢复，确定要取消吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await cancelOrder({ id });
          if (response.status === 200) {
            message.success('订单已取消');
            // 刷新订单列表
            fetchOrders();
          } else {
            message.error(response.message || '取消订单失败');
          }
        } catch (error) {
          message.error('取消订单失败');
          console.error('取消订单失败:', error);
        }
      }
    });
  };

  // 删除订单
  const handleDeleteOrder = async (id: string) => {
    Modal.confirm({
      title: '确认删除订单',
      icon: <ExclamationCircleOutlined />,
      content: '删除订单后将无法恢复，确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteOrder({ id });
          if (response.status === 200) {
            message.success('订单已删除');
            // 刷新订单列表
            fetchOrders();
          } else {
            message.error(response.message || '删除订单失败');
          }
        } catch (error) {
          message.error('删除订单失败');
          console.error('删除订单失败:', error);
        }
      }
    });
  };

  // 批量删除订单
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的订单');
      return;
    }
    
    Modal.confirm({
      title: '确认批量删除订单',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个订单吗？删除后将无法恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 使用Promise.all并行处理多个删除请求
          const deletePromises = selectedRowKeys.map(id => 
            deleteOrder({ id: id.toString() })
          );
          
          const results = await Promise.all(deletePromises);
          const successCount = results.filter(res => res.status === 200).length;
          
          if (successCount > 0) {
            message.success(`成功删除 ${successCount} 个订单`);
            // 清空选中项
            setSelectedRowKeys([]);
            // 刷新订单列表
            fetchOrders();
          } else {
            message.error('删除订单失败');
          }
        } catch (error) {
          message.error('批量删除订单失败');
          console.error('批量删除订单失败:', error);
        }
      }
    });
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: API.OrderResponseDTO) => ({
      // 只允许选择已取消的订单进行删除
      disabled: record.state !== 4,
    }),
  };

  // 获取订单状态标签
  const getOrderStateTag = (state: number) => {
    switch (state) {
      case 0:
        return <Tag color="blue">待付款</Tag>;
      case 1:
        return <Tag color="green">已付款</Tag>;
      case 2:
        return <Tag color="orange">已发货</Tag>;
      case 3:
        return <Tag color="purple">已完成</Tag>;
      case 4:
        return <Tag color="red">已取消</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  // 查看订单详情
  const handleViewDetail = async (id: string) => {
    try {
      const response = await getOrderById({ id });
      if (response.status === 200 && response.data) {
        // 查找当前订单信息
        const currentOrder = orders.find(order => order.id === id);
        
        Modal.info({
          title: '订单详情',
          width: 550,
          content: (
            <div style={{ color: '#666', marginTop: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p><strong>订单号:</strong> {id}</p>
                <p><strong>订单状态:</strong> {currentOrder ? getOrderStateTag(currentOrder.state as number) : '未知'}</p>
                <p><strong>订单金额:</strong> <span style={{ color: '#ff4d4f' }}>¥ {currentOrder?.total_price || '未知'}</span></p>
                <p><strong>提交时间:</strong> {currentOrder?.time || '未知'}</p>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666' }}>商品列表:</p>
                {response.data.map((item, index) => (
                  <div key={index} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: index < (response.data?.length ?? 0) - 1 ? '1px dashed #f0f0f0' : 'none', display: 'flex', alignItems: 'center' }}>
                    <img 
                      src={item.good_pic} 
                      alt={item.good_name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px', color: '#666' }}>{item.good_name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#ff4d4f', fontSize: '16px' }}>¥ {item.good_price}</div>
                        <div style={{ color: '#999', fontSize: '14px' }}>x {item.pay_count || 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        });
      } else {
        message.error(response.message || '获取订单详情失败');
      }
    } catch (error) {
      message.error('获取订单详情失败');
      console.error('获取订单详情失败:', error);
    }
  };
  // 表格列定义
  const columns: ColumnsType<API.OrderResponseDTO> = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <span style={{ 
          fontWeight: text === newOrderId ? 'bold' : 'normal',
          color: text === newOrderId ? '#1890ff' : 'inherit'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: '订单信息',
      dataIndex: 'goods',
      key: 'goods',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Button 
            type="link" 
            size="small" 
            style={{ padding: '0' }}
            onClick={() => handleViewDetail(record.id as string)}
          >
            查看详情
          </Button>
        </div>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (text) => <Text className={styles.price}>¥ {text}</Text>,
    },
    {
      title: '订单状态',
      dataIndex: 'state',
      key: 'state',
      render: (state) => getOrderStateTag(state as number),
    },
    {
      title: '提交时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {(record.state === 0) && (
            <Button type="link" onClick={() => message.info('支付功能即将上线')}>
              去支付
            </Button>
          )}
          {(record.state === 0 || record.state === undefined) && (
            <Button type="link" danger onClick={() => handleCancelOrder(record.id as string)}>
              取消订单
            </Button>
          )}
          {(record.state === 4) && (
            <Button type="link" danger onClick={() => handleDeleteOrder(record.id as string)}>
              删除订单
            </Button>
          )}
        </Space>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={4}>
              <ShoppingOutlined style={{ marginRight: 8 }} />
              我的订单
            </Title>
            
            <Button 
              type="primary" 
              danger 
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              批量删除 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
            </Button>
          </div>
          
          <Divider />
          
          {orders.length > 0 ? (
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={orders}
              pagination={{ pageSize: 10 }}
              bordered={false}
              loading={loading}
            />
          ) : (
            <div className={styles.emptyContainer}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={loading ? "正在加载..." : "暂无订单记录"}
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

  // At the end of the file, make sure the export is correct
  };
  
  export default OrderPage;
