import { deleteTag, listTag, updateTag, addTag } from '@/services/user-center/goodsController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography, App } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import { createStyles } from 'antd-style';

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
 * 分类管理页面
 *
 * @constructor
 */
const TagAdminPage: React.FC = () => {
  const { styles } = useStyles();
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前分类点击的数据
  const [currentRow, setCurrentRow] = useState<API.TagResponseDTO>();
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

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.TagResponseDTO) => {
    modal.confirm({
      title: '确认删除',
      content: '确定要删除该分类吗？删除后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!row) return true;
        try {
          await deleteTag({
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
      },
    });
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.TagResponseDTO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      editable: false,
    },
    {
      title: '分类名',
      dataIndex: 'tag_name',
      copyable: true,
      ellipsis: true,
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
      fixed: 'right',
      width: windowWidth < 768 ? 80 : 120,
      render: (_, record) => (
        <Space size={windowWidth < 768 ? 'small' : 'middle'} direction={windowWidth < 768 ? 'vertical' : 'horizontal'}>
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
      <div className={styles.tableWrapper}>
        <ProTable<API.TagResponseDTO>
          headerTitle={'分类数据'}
          actionRef={actionRef}
          rowKey="id"
          search={{
            showHiddenNum: true,
            labelWidth: 65,
            defaultCollapsed: windowWidth < 768,
            span: windowWidth < 768 ? 24 : undefined,
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
          request={async (params, sort, filter) => {
            try {
              // 参数转换，构建符合API要求的参数结构
              const queryParams = {
                tagQueryRequestDTO: {
                  tagName: params.tag_name,
                  id: params.id || undefined,
                }
              };
              
              const response = await listTag(queryParams as any);
              return {
                data: response.data || [],
                success: true,
                total: response.data?.length || 0,
              };
            } catch (error: any) {
              message.error('获取分类列表失败: ' + error.message);
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          }}
          columns={columns}
          scroll={{ x: 800 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            size: windowWidth < 768 ? 'small' : 'default',
          }}
        />
      </div>
      <CreateModal
        visible={createModalVisible}
        columns={columns}
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
        columns={columns}
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
  );
};

// 使用App组件包装以解决message警告
const TagAdminPageWithApp: React.FC = () => (
  <App>
    <TagAdminPage />
  </App>
);

export default TagAdminPageWithApp;