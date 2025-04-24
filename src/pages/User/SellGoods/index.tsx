import { deleteGoodsById, listGoods } from '@/services/user-center/goodsController';
import { PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Image, message, Space, Typography, Divider } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import UserInfo from '@/components/UserInfo';
import { createStyles } from 'antd-style';

const { Title } = Typography;

// 创建响应式样式
const useStyles = createStyles(({ token }) => ({
  topBar: {
    width: '100%',
    height: '60px',
    background: '#fff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    '@media (min-width: 768px)': {
      padding: '0 50px',
    },
  },
  container: {
    marginTop: '60px',
    padding: '16px',
    '@media (min-width: 768px)': {
      maxWidth: '1200px',
      margin: '60px auto 0',
      padding: '24px',
    },
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

/**
 * 用户售卖商品页面
 *
 * @constructor
 */
const UserSellGoodsPage: React.FC = () => {
  const { styles } = useStyles();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodsResponseDTO>();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

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

  /**
   * 删除商品
   *
   * @param row
   */
  const handleDelete = async (row: API.GoodsResponseDTO) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteGoodsById({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.GoodsResponseDTO>[] = [
    {
      title: '商品名',
      dataIndex: 'good_name',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '商品描述',
      dataIndex: 'good_description',
      copyable: true,
      ellipsis: true,
      search: false,
      hideInTable: windowWidth < 768, // 小屏幕下隐藏
    },
    {
      title: '商品图片',
      dataIndex: 'good_pic',
      render: (_, record) => (
        <div>
          <Image src={record.good_pic} width={70} height={70} />
        </div>
      ),
      ellipsis: true,
      search: false,
    },
    {
      title: '商品价格',
      dataIndex: 'good_price',
      ellipsis: true,
      valueType: 'money',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      valueEnum: {
        0: {
          text: '上架中',
          status: 'Success',
        },
        1: {
          text: '已下架',
          status: 'Error',
        },
      },
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      valueType: 'dateTime',
      editable: false,
      search: false,
      hideInTable: windowWidth < 768, // 小屏幕下隐藏
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  
  return (
    <>
      <div className={styles.topBar}>
        <UserInfo />
      </div>
      
      <PageContainer
        className={styles.container}
        header={{
          title: false,
        }}
      >
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
            我的商品
          </Title>

          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 发布商品
          </Button>
        </div>

        <Divider />

        <div className={styles.tableWrapper}>
          <ProTable<API.GoodsResponseDTO>
            headerTitle={false}
            actionRef={actionRef}
            rowKey="id"
            search={false}
            toolBarRender={false}
            scroll={{ x: 'max-content' }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: windowWidth >= 768,
              size: windowWidth < 768 ? 'small' : 'default',
            }}
            request={async () => {
              const goodsList = await listGoods({
                goodsQueryRequestDTO: {}
              });
              
              return goodsList;
            }}
            columns={columns}
          />
        </div>
        
        <CreateModal
          visible={createModalVisible}
          onSubmit={() => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setCreateModalVisible(false);
          }}
        />
        <UpdateModal
          visible={updateModalVisible}
          oldData={currentRow}
          onSubmit={() => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
        />
      </PageContainer>
    </>
  );
};

export default UserSellGoodsPage;