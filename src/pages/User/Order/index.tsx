import UserInfo from '@/components/UserInfo';
import {
  cancelOrder,
  checkOrder,
  deleteOrder,
  getOrderById,
  listOrder,
} from '@/services/user-center/orderController';
import { pay, returnPay } from '@/services/user-center/aliPayController';
import { ExclamationCircleOutlined, QuestionCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import { history, useLocation ,useModel} from '@umijs/max';
import { Button, Card, Divider, Empty, message, Modal, Space, Table, Tag, Tooltip, Typography, Radio, Input } from 'antd';
import { createStyles } from 'antd-style';
import LogoHeader from '@/components/LogoHeader';
import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { addComment } from '@/services/user-center/commentController';
import { listTurnoverAdmin, listTurnoverByOrderId } from '@/services/user-center/turnoverController';

const { Title, Text } = Typography;
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
    justifyContent: 'space-between',
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
  const [commentForm] = Form.useForm();
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentSellerId, setCurrentSellerId] = useState<string>('');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const { initialState } = useModel('@@initialState'); 
  const currentUser = initialState?.currentUser;  



  // 处理评价卖家
  const handleRateSeller = async (record: API.OrderResponseDTO) => {
    try {
      // 根据订单id查成交表得到卖家id
      const response = await listTurnoverByOrderId({ orderId: record.id as string  });
      if (response && response.data) {
        const sellerId = response.data.sellerId; // 假设接口返回的数据中包含卖家ID
        setCurrentSellerId(sellerId as string);
        setCurrentOrderId(record.id as string);
        setCommentModalVisible(true);
        commentForm.resetFields();
      } else {
        message.error('无法获取卖家信息');
      }
    } catch (error) {
      console.error('获取卖家信息失败:', error);
      message.error('获取卖家信息失败');
    }
  };

  // 提交评价
  const handleSubmitComment = async () => {
    try {
      const values = await commentForm.validateFields();
      setLoading(true);
      if (!currentUser?.id) {
        message.error('获取用户信息失败，请重新登录');
        return;
      }
      
      const response = await addComment({
        userId: currentSellerId,
        content: values.content,
        type: values.type, // 0为好评，1为差评
        commenterId: currentUser.id // 使用当前登录用户ID
      }); 

      if (response.status === 200) {
        message.success('评价成功');
        setCommentModalVisible(false);
        history.push(`/user/seller-comments/${currentSellerId}`);
      } else {
        message.error(response.message || '评价失败');
      }
    } catch (error) {
      message.error('评价失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await listOrder();
      if (response.data && Array.isArray(response.data)) {
        // 按时间降序排序订单数据
        const sortedOrders = [...response.data].sort((a, b) => {
          // 将时间字符串转换为时间戳进行比较
          const timeA = new Date(a.time || 0).getTime();
          const timeB = new Date(b.time || 0).getTime();
          // 降序排序，最新的订单在前面
          return timeB - timeA;
        });

        setOrders(sortedOrders);

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
      },
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
      },
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
          const deletePromises = selectedRowKeys.map((id) => deleteOrder({ id: id.toString() }));

          const results = await Promise.all(deletePromises);
          const successCount = results.filter((res) => res.status === 200).length;

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
      },
    });
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: API.OrderResponseDTO) => ({
      // 1->待发货；2->已发货；时订单不能取消
      disabled: record.state == 1 || record.state == 2,
    }),
  };

  // 获取订单状态标签
  const getOrderStateTag = (state: number) => {
    switch (state) {
      case 0:
        return <Tag color="blue">待付款</Tag>;
      case 1:
        return <Tag color="purple">待发货</Tag>;
      case 2:
        return <Tag color="orange">已发货</Tag>;
      case 3:
        return <Tag color="green">已完成</Tag>;
      case 4:
        return <Tag color="red">已取消</Tag>;
      case 5:
        return <Tag color="volcano">已退款</Tag>;
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
        const currentOrder = orders.find((order) => order.id === id);

        Modal.info({
          title: '订单详情',
          width: 550,
          content: (
            <div style={{ color: '#666', marginTop: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p>
                  <strong>订单号:</strong> {id}
                </p>
                <p>
                  <strong>订单状态:</strong>{' '}
                  {currentOrder ? getOrderStateTag(currentOrder.state as number) : '未知'}
                </p>
                <p>
                  <strong>订单金额:</strong>{' '}
                  <span style={{ color: '#ff4d4f' }}>¥ {currentOrder?.total_price || '未知'}</span>
                </p>
                <p>
                  <strong>提交时间:</strong> {currentOrder?.time || '未知'}
                </p>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666' }}>商品列表:</p>
                {response.data.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '15px',
                      paddingBottom: '10px',
                      borderBottom:
                        index < (response.data?.length ?? 0) - 1 ? '1px dashed #f0f0f0' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.good_pic}
                      alt={item.good_name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        marginRight: '15px',
                        borderRadius: '4px',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          marginBottom: '5px',
                          color: '#666',
                        }}
                      >
                        {item.good_name}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ color: '#ff4d4f', fontSize: '16px' }}>
                          ¥ {item.good_price}
                        </div>
                        <div style={{ color: '#999', fontSize: '14px' }}>
                          x {item.pay_count || 1}
                        </div>
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
  // 处理退款
  const handleRefund = async (orderId: string) => {
    Modal.confirm({
      title: '确认申请退款',
      icon: <ExclamationCircleOutlined />,
      content: '确定要申请退款吗？退款申请提交后将由系统处理。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);

          // 查找当前订单信息
          const currentOrder = orders.find(order => order.id === orderId);
          if (!currentOrder) {
            message.error('订单信息不完整');
            return;
          }

          // 调用退款接口
          const response = await returnPay({
            orderId,
            aliPay: {
              traceNo: currentOrder.no || orderId, // 商户订单号
              totalAmount: currentOrder.total_price || 0, // 订单金额，单位为分
              alipayTraceNo: currentOrder.pay_no || null, // 支付宝交易号
            }
          } as any);

          if (response.status === 200) {
            message.success('退款成功');
            // 刷新订单列表
            fetchOrders();
          } else {
            message.error(response.message || '退款申请失败');
          }
        } catch (error) {
          message.error('退款申请失败，请稍后重试');
        } finally {
          setLoading(false);
        }
      }
    });
  };
  // 处理支付
  const handlePay = async (orderId: string) => {
    try {
      setLoading(true);

      // 先查询订单详情，获取订单信息
      const orderDetailResponse = await getOrderById({ id: orderId });
      if (!orderDetailResponse.data || orderDetailResponse.status !== 200) {
        message.error('获取订单信息失败');
        return;
      }

      // 获取订单的第一个商品作为订单标题
      const orderItem = orderDetailResponse.data[0];
      if (!orderItem) {
        message.error('订单信息不完整');
        return;
      }

      // 查找当前订单信息
      const currentOrder = orders.find(order => order.id === orderId);
      if (!currentOrder) {
        message.error('订单信息不完整');
        return;
      }

      // 获取当前域名和端口，用于构建回调URL
      const { protocol, hostname, port } = window.location;
      const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
      const returnUrl = `${baseUrl}/user/orders`;

      // 构建支付参数，将参数直接作为查询参数传递
      const payParams = {
        subject: orderItem.good_name || '商品购买', // 订单标题，使用商品名称
        traceNo: currentOrder.no, // 商户订单号，使用订单返回的no字段
        totalAmount: currentOrder.total_price?.toString() || '0.0', // 订单总金额
        alipayTraceNo: null, // 支付宝交易号，新订单为null
        returnUrl: returnUrl, // 支付成功后的回调URL
        orderId: orderId // 订单ID
      };

      // 调用支付接口
      const response = await pay(payParams as any);

      if (response) {
        // 创建一个隐藏的div来放置支付宝返回的表单
        const div = document.createElement('div');
        div.innerHTML = response;
        document.body.appendChild(div);

        // 提交表单，跳转到支付宝支付页面
        const form = div.getElementsByTagName('form')[0];
        if (form) {
          form.submit();
        } else {
          message.error('支付表单生成失败');
        }
      } else {
        message.error('获取支付信息失败');
      }
    } catch (error) {
      console.error('支付失败:', error);
      message.error('支付失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理确认收货
  const handleConfirmReceipt = async (orderId: string) => {
    Modal.confirm({
      title: '确认收货',
      icon: <ExclamationCircleOutlined />,
      content: '确认已收到商品吗？确认后订单将完成。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await checkOrder({ id: orderId });

          if (response.status === 200) {
            message.success('确认收货成功');
            // 刷新订单列表
            fetchOrders();
          } else {
            message.error(response.message || '确认收货失败');
          }
        } catch (error) {
          message.error('确认收货失败，请稍后重试');
          console.error('确认收货失败:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 添加评价弹窗
  const renderCommentModal = () => (
    <Modal
      title="评价卖家"
      open={commentModalVisible}
      onOk={handleSubmitComment}
      onCancel={() => setCommentModalVisible(false)}
      okText="提交评价"
      cancelText="取消"
    >
      <Form form={commentForm} layout="vertical">
        <Form.Item
          name="type"
          label="评价类型"
          rules={[{ required: true, message: '请选择评价类型' }]}
          initialValue={0}
        >
          <Radio.Group>
            <Radio value={0}>好评</Radio>
            <Radio value={1}>差评</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="content"
          label="评价内容"
          rules={[{ required: true, message: '请输入评价内容' }]}
        >
          <TextArea rows={4} placeholder="请输入您对卖家的评价..." />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div>
      <div className={styles.topBar}>
        <LogoHeader />
        <UserInfo />
      </div>

      {renderCommentModal()}

      <div className={styles.container}>
        <Card className={styles.mainCard}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Title level={4}>
              <ShoppingOutlined style={{ marginRight: 8 }} />
              我的订单
              <Tooltip title={
                <div>
                  <p>● 付款1分钟后，系统自动发货</p>
                  <p>● 交易进行中的订单不允许删除</p>
                </div>
              }>
                <QuestionCircleOutlined style={{ fontSize: '16px', marginLeft: 4, color: '#1890ff', cursor: 'pointer' }} />
              </Tooltip>
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
              className="custom-table"
              rowKey="id"
              rowSelection={rowSelection}
              columns={[
                {
                  title: '订单号',
                  dataIndex: 'id',
                  key: 'id',
                  width: 200,
                },
                {
                  title: '订单状态',
                  dataIndex: 'state',
                  key: 'state',
                  render: (state: number) => getOrderStateTag(state),
                },
                {
                  title: '订单金额',
                  dataIndex: 'total_price',
                  key: 'total_price',
                  render: (price: number) => (
                    <Text className={styles.price}>¥ {price}</Text>
                  ),
                },
                {
                  title: '下单时间',
                  dataIndex: 'time',
                  key: 'time',
                },

                // 在表格列定义中修改操作列
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record: API.OrderResponseDTO) => (
                    <Space size="middle">
                      <Button type="link" onClick={() => handleViewDetail(record.id as any)}>
                        查看详情
                      </Button>
                      {record.state === 0 && (
                        <>
                          <Button type="link" onClick={() => handlePay(record.id as any)}>
                            去支付
                          </Button>
                          <Button type="link" danger onClick={() => handleCancelOrder(record.id as any)}>
                            取消订单
                          </Button>
                        </>
                      )}
                      {record.state === 1 && (
                        <Button type="link" onClick={() => handleRefund(record.id as any)}>
                          申请退款
                        </Button>
                      )}
                      {record.state === 2 && (
                        <Button type="link" onClick={() => handleConfirmReceipt(record.id as any)}>
                          确认收货
                        </Button>
                      )}
                      {record.state === 3 && (
                        <Button type="link" onClick={() => handleRateSeller(record)}>
                          评价卖家
                        </Button>
                      )}
                      {(record.state !== 1 && record.state !== 2 && record.state !== 0) && (
                        <Button type="link" danger onClick={() => handleDeleteOrder(record.id as any)}>
                          删除订单
                        </Button>
                      )}
                    </Space>
                  ),
                }
              ]}
              dataSource={orders}
              pagination={{ pageSize: 10 }}
              bordered={false}
              loading={loading}
            />
          ) : (
            <div className={styles.emptyContainer}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={loading ? '正在加载...' : '暂无订单记录'}
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
};  // 添加自定义样式
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
  .custom-table .ant-table-row-selected > td {
    background-color: transparent !important;
  }
`;
  document.head.appendChild(styleSheet);
  export default OrderPage;
