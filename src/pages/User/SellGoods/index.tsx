import { deleteGoodsById, listGoods } from '@/services/user-center/goodsController';
import { PlusOutlined, ShoppingOutlined } from '@ant-design/icons'; // 添加ShoppingOutlined图标
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Image, message, Space, Typography, Divider } from 'antd'; // 添加Divider和Typography
import React, { useRef, useState } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import UserInfo from '@/components/UserInfo';
import { createStyles } from 'antd-style';

const { Title } = Typography; // 添加Title组件

// 创建样式
const useStyles = createStyles(({ token }) => ({
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
}));

/**
 * 用户售卖商品页面
 *
 * @constructor
 */
const UserSellGoodsPage: React.FC = () => {
  const { styles } = useStyles(); // 使用样式
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前商品点击的数据
  const [currentRow, setCurrentRow] = useState<API.GoodsResponseDTO>();

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
      search: false, // 移除搜索功能
    },
    {
      title: '商品描述',
      dataIndex: 'good_description',
      copyable: true,
      ellipsis: true,
      search: false,
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
      search: false, // 移除搜索功能
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      valueType: 'dateTime',
      editable: false,
      search: false,
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
      {/* 添加顶部导航栏 */}
      <div className={styles.topBar}>
        <UserInfo />
      </div>
      
      {/* 调整PageContainer的样式，为顶部导航栏留出空间 */}
      <PageContainer
        style={{ 
          marginTop: '60px',
          maxWidth: '1200px',  // 设置最大宽度
          margin: '60px auto 0', // 上边距60px，左右居中
        }}
        header={{
          title: false, // 隐藏默认标题
        }}
      >
        {/* 添加与订单页面一致的标题样式 */}
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

        <ProTable<API.GoodsResponseDTO>
          headerTitle={false} // 隐藏ProTable的标题
          actionRef={actionRef}
          rowKey="id"
          search={false}
          toolBarRender={false} // 隐藏工具栏
          request={async () => {
            // 直接调用listGoods，不传递任何查询参数
            const goodsList = await listGoods({
              goodsQueryRequestDTO: {}
            });
            
            return goodsList;
          }}
          columns={columns}
        />
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