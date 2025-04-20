import UserInfo from '@/components/UserInfo';
import { deleteTurnover, listTurnover } from '@/services/user-center/turnoverController';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Image,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { createStyles } from 'antd-style';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const { Title, Text } = Typography;

const useStyles = createStyles(({ token }) => ({
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '50px auto 0',
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
  statusBadge: {
    marginRight: '8px',
  },
}));

const Turnover: React.FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [turnoverItems, setTurnoverItems] = useState<API.TurnoverResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGood, setSelectedGood] = useState<API.TurnoverResponseDTO | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 获取成交记录数据
  const fetchTurnoverItems = async () => {
    setLoading(true);
    try {
      const response = await listTurnover();
      if (response.data && Array.isArray(response.data)) {
        setTurnoverItems(response.data);
      }
    } catch (error) {
      message.error('获取成交记录失败');
      console.error('获取成交记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnoverItems();
  }, []);

  // 格式化日期时间
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 获取交易状态标签
  const getStatusTag = (state?: number) => {
    switch (state) {
      case 0:
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            冻结期
          </Tag>
        );
      case 1:
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已完成
          </Tag>
        );
      case 2:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            已取消
          </Tag>
        );
      default:
        return (
          <Tag color="default">
            未知状态
          </Tag>
        );
    }
  };

  // 判断当前用户是买家还是卖家
  const isBuyer = (item: API.TurnoverResponseDTO) => {
    return item.buyerId === currentUser?.id;
  };

  // 显示商品详情弹窗
  const showGoodDetails = (record: API.TurnoverResponseDTO) => {
    setSelectedGood(record);
    setIsModalVisible(true);
  };

  // 关闭商品详情弹窗
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedGood(null);
  };

  // 删除单条成交记录
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteTurnover({ id });
      if (res.status === 200) {
        message.success('删除成功');
        fetchTurnoverItems(); // 重新加载数据
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  // 批量删除成交记录
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    // 添加确认弹窗
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条成交记录吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setDeleteLoading(true);
        try {
          const deletePromises = selectedRowKeys.map((key) => 
            deleteTurnover({ id: key.toString() })
          );
          
          const results = await Promise.all(deletePromises);
          const failedCount = results.filter(res => res.status !== 200).length;
          
          if (failedCount === 0) {
            message.success('批量删除成功');
          } else if (failedCount < selectedRowKeys.length) {
            message.warning(`部分删除成功，${failedCount}条记录删除失败`);
          } else {
            message.error('批量删除失败');
          }
          
          setSelectedRowKeys([]);
          fetchTurnoverItems(); // 重新加载数据
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        } finally {
          setDeleteLoading(false);
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
    // 添加自定义样式
    columnStyle: { backgroundColor: 'transparent' },
  };

  // 表格列定义
  const columns: ColumnsType<API.TurnoverResponseDTO> = [
    {
      title: '商品信息',
      dataIndex: 'goodName',
      key: 'goodName',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a onClick={() => showGoodDetails(record)}>查看详情</a>
        </div>
      ),
    },
    {
      title: '交易类型',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (_, record) => (
        <Tag color='success'>
          卖出
        </Tag>
      ),
    },
    {
      title: '买家',
      dataIndex: 'partner',
      key: 'partner',
      width: 150,
      render: (_, record) => (
        <span>
          {record.buyerNickname}
        </span>
      ),
    },
    {
      title: '单价',
      dataIndex: 'goodPrice',
      key: 'goodPrice',
      width: 100,
      render: (price) => <Text className={styles.price}>¥ {price?.toFixed(2)}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 80,
      render: (num) => <Text>{num}</Text>,
    },
    {
      title: '总价',
      key: 'totalPrice',
      width: 120,
      render: (_, record) => (
        <Text className={styles.price}>
          ¥ {((record.goodPrice || 0) * (record.num || 0)).toFixed(2)}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      render: (state) => getStatusTag(state),
    },
    {
      title: '成交时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      render: (time) => formatDateTime(time),
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
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确定要删除这条成交记录吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleDelete(record.id || ''),
            });
          }}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={4} style={{ marginBottom: 0 }}>
              <CheckCircleOutlined style={{ marginRight: 8 }} />
              我的成交记录
            </Title>
            <Tooltip title="冻结期：商品被购买,买家确认收货前">
              <QuestionCircleOutlined style={{ marginLeft: 8, color: '#1890ff', cursor: 'pointer' }} />
            </Tooltip>
          </div>
          
          {turnoverItems.length > 0 && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
              loading={deleteLoading}
            >
              批量删除{' '}
              {selectedRowKeys.length > 0
                ? `(${selectedRowKeys.length})`
                : ''}
            </Button>
          )}
        </div>

        <Divider />

        <Card className={styles.mainCard}>
          {turnoverItems.length > 0 ? (
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={turnoverItems}
              pagination={{ pageSize: 10 }}
              bordered={false}
              loading={loading}
              // 添加自定义样式，去掉选中行的蓝色背景
              className="custom-table"
            />
          ) : (
            <div className={styles.emptyContainer}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={loading ? '正在加载...' : '暂无成交记录'}
              />
            </div>
          )}
        </Card>
      </div>

      {/* 商品详情弹窗 */}
      <Modal
        title="商品详情"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
        centered
      >
        {selectedGood && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <Image
                src={selectedGood.goodPic}
                alt={selectedGood.goodName}
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
            <div>
              <Title level={4}>{selectedGood.goodName}</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Text className={styles.price} style={{ fontSize: '24px' }}>
                  ¥ {selectedGood.goodPrice?.toFixed(2)}
                </Text>
                <Text type="secondary">
                  交易数量: {selectedGood.num} 件
                </Text>
              </div>
              <Divider />
              <div>
                <Title level={5}>商品描述</Title>
                <Text>{selectedGood.goodDescription || '暂无描述'}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// 添加自定义样式
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  .custom-table .ant-table-row-selected > td {
    background-color: transparent !important;
  }
`;
document.head.appendChild(styleSheet);

export default Turnover;