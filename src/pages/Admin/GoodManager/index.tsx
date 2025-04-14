import { deleteGoodsById, listGoods } from '@/services/user-center/goodsController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Image, message, Space, Typography } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

/**
 * 商品管理页面
 *
 * @constructor
 */
const GoodAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前商品点击的数据
  const [currentRow, setCurrentRow] = useState<API.GoodsResponseDTO>();
  // 添加商品列表状态
  const [goodsList, setGoodsList] = useState<API.GoodsResponseDTO[]>([]);

  // 添加useEffect钩子，在组件挂载时获取数据
  useEffect(() => {
    fetchGoodsList();
  }, []);

  // 获取商品列表的函数
  const fetchGoodsList = async () => {
    try {
      console.log('开始获取商品列表');
      // 修改API调用方式，确保参数格式正确
      const result = await listGoods({
        goodsQueryRequestDTO: {}
      });
      console.log('获取到的商品列表数据:', result);
      
      if (result && result.data) {
        // 确保数据格式正确
        setGoodsList(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('返回数据格式不符合预期:', result);
        message.error('获取商品列表失败');
      }
    } catch (error) {
      console.error('获取商品列表异常:', error);
      message.error('获取商品列表出现异常');
    }
  };

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.GoodsResponseDTO) => {
    // 保持原有代码不变
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.GoodsResponseDTO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      editable: false,
    },
    {
      title: '商品名',
      dataIndex: 'good_name',
      copyable: true,
      ellipsis: true,
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
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      valueType: 'dateTime',
      editable: false,
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
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
    <PageContainer>
      <ProTable<API.GoodsResponseDTO>
        headerTitle={'商品数据'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          showHiddenNum: true,
          labelWidth: 65,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        // 使用dataSource直接提供数据，而不是通过request获取
        dataSource={goodsList}
        // 保留request但简化实现
        request={async () => {
          await fetchGoodsList();
          return {
            data: goodsList,
            success: true,
            total: goodsList.length,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          fetchGoodsList(); // 创建后重新获取列表
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          fetchGoodsList(); // 更新后重新获取列表
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default GoodAdminPage;
