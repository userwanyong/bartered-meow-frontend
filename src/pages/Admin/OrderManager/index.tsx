import { listOrderAdmin } from '@/services/user-center/orderController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Space, Typography, App, ConfigProvider, theme, Tag, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { createStyles } from 'antd-style';
import { getUserById } from '@/services/user-center/userController';

// 创建响应式样式
const useStyles = createStyles(({ token }) => ({
  tableWrapper: {
    overflowX: 'auto',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
}));

/**
 * 用户昵称组件
 */
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
        console.error('获取用户昵称失败', error);
      }
    };

    fetchUserNickname();
  }, [userId]);

  return <span>{nickname}</span>;
};


/**
 * 订单管理页面
 *
 * @constructor
 */
const OrderAdminPage: React.FC = () => {
  const { styles } = useStyles();
  const actionRef = useRef<ActionType>();
  // 添加窗口宽度状态
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { message, modal } = App.useApp();

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 获取订单状态标签
  const getOrderStateTag = (state: number) => {
    switch (state) {
      case 0:
        return <Tag color="blue">待付款</Tag>;
      case 1:
        return <Tag color="green">待发货</Tag>;
      case 2:
        return <Tag color="orange">待收货</Tag>;
      case 3:
        return <Tag color="purple">已完成</Tag>;
      case 4:
        return <Tag color="red">已取消</Tag>;
      case 5:
        return <Tag color="volcano">已退款</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  /**
   * 查看订单详情
   */
  const handleViewDetail = (record: API.OrderResponseDTO) => {
    Modal.info({
      title: '订单详情',
      width: 550,
      content: (
        <div style={{ color: '#666', marginTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <p>
              <strong>订单号:</strong> {record.no}
            </p>
            <p>
              <strong>订单名称:</strong> {record.name}
            </p>
            <p>
              <strong>订单状态:</strong> {getOrderStateTag(record.state as number)}
            </p>
            <p>
              <strong>订单金额:</strong>{' '}
              <span style={{ color: '#ff4d4f' }}>¥ {record.total_price || '未知'}</span>
            </p>
            <p>
              <strong>买家:</strong> <UserNickname userId={record.user_id || ''} />
            </p>
            <p>
              <strong>收货地址:</strong> {record.address || '未知'}
            </p>
            <p>
              <strong>备注:</strong> {record.remark || '无'}
            </p>
            <p>
              <strong>下单时间:</strong> {record.time || '未知'}
            </p>
            <p>
              <strong>付款时间:</strong> {record.pay_time || '待支付'}
            </p>
            {record.pay_no && (
              <p>
                <strong>支付单号:</strong> {record.pay_no || '待支付'}
              </p>
            )}
            <p>
              <strong>退款时间:</strong> {record.return_time || '未退款'}
            </p>
          </div>
        </div>
      ),
    });
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.OrderResponseDTO>[] = [
    {
      title: '订单号',
      dataIndex: 'no',
      copyable: true,
      ellipsis: true,
    },
    {
        title: '订单名称',
        dataIndex: 'name',
        copyable: true,
        ellipsis: true,
        search: false,
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        search: false,
        valueEnum: {
          0: {
            text: '待付款',
            status: 'warning',
          },
          1: {
            text: '待发货',
            status: 'processing',
          },
          2: {
            text: '待收货',
            status: 'processing',
          },
          3: {
            text: '已完成',
            status: 'success',
          },
          4: {
            text: '已取消',
            status: 'default',
          },
          5: {
            text: '已退款',
            status: 'error',
          },
        },
        render: (_, record) => getOrderStateTag(record.state as number),
      },
      {
        title: '订单金额',
        dataIndex: 'total_price',
        valueType: 'money',
        search: false,
      },
    {
      title: '买家',
      dataIndex: 'user_id',
      copyable: true,
      ellipsis: true,
      search: false,
      render: (_, record) => <UserNickname userId={record.user_id || ''} />,
    },
    {
      title: '下单时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      search: false,
      sorter: (a, b) => {
        const timeA = new Date(a.time || 0).getTime();
        const timeB = new Date(b.time || 0).getTime();
        return timeA - timeB;
      },
    },
    {
        title: '支付状态',
        dataIndex: 'pay_time',
        ellipsis: true,
        render: (_, record) => record.pay_time==null?"未支付":"已支付",
        search: false,
      },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: windowWidth < 768 ? 80 : 120,
      render: (_, record) => (
        <Space size={windowWidth < 768 ? 'small' : 'middle'} direction={windowWidth < 768 ? 'vertical' : 'horizontal'}>
          <Typography.Link onClick={() => handleViewDetail(record)}>
            查看详情
          </Typography.Link>
        </Space>
      ),
    },
  ];
  
  return (
    <PageContainer>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          components: {
            Tooltip: {
              zIndexPopup: 1070,
              colorBgElevated: 'rgba(0, 0, 0, 0.85)',
              colorTextLightSolid: '#fff',
            },
            Table: {
              colorBgContainer: '#ffffff',
            },
          },
          token: {
            motion: false,
          },
        }}
      >
        <div className={styles.tableWrapper}>
          <ProTable<API.OrderResponseDTO>
            headerTitle={'订单数据'}
            actionRef={actionRef}
            rowKey="id"
            search={false}
            request={async () => {
              try {
                const response = await listOrderAdmin();
                let orderList = response.data || [];
                
                // 按时间降序排序
                orderList = orderList.sort((a, b) => {
                  const timeA = new Date(a.time || 0).getTime();
                  const timeB = new Date(b.time || 0).getTime();
                  return timeB - timeA;
                });
                
                return {
                  data: orderList,
                  success: true,
                  total: orderList.length,
                };
              } catch (error: any) {
                message.error('获取订单列表失败: ' + error.message);
                return {
                  data: [],
                  success: false,
                  total: 0,
                };
              }
            }}
            columns={columns}
            scroll={{ x: 1200 }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              size: windowWidth < 768 ? 'small' : 'default',
            }}
          />
        </div>
      </ConfigProvider>
    </PageContainer>
  );
};

// 使用App组件包装以解决message警告
const OrderAdminPageWithApp: React.FC = () => (
  <App>
    <OrderAdminPage />
  </App>
);

export default OrderAdminPageWithApp;