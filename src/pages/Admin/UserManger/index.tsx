import { deleteUsingPost, list } from '@/services/user-center/userController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Image, message, Space, Typography, App } from 'antd';
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
 * 用户管理页面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  const { styles } = useStyles();
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.UserResponseDTO>();
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
  const handleDelete = async (row: API.UserResponseDTO) => {
    modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？删除后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!row) return true;
        try {
          await deleteUsingPost({
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
  const columns: ProColumns<API.UserResponseDTO>[] = [
    {
      title: '身份码',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      editable: false,
      // 移除 hideInTable 属性
    },
    {
      title: '账号',
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      editable: false,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      render: (_, record) => (
        <div>
          <Image 
            src={record.avatar_url} 
            width={windowWidth < 768 ? 50 : 70} 
            height={windowWidth < 768 ? 50 : 70} 
          />
        </div>
      ),
      ellipsis: true,
      search: false,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      ellipsis: true,
      valueEnum: {
        0: {
          text: '男',
        },
        1: {
          text: '女',
        },
      },
      // 移除 hideInTable 属性
    },
    {
      title: '电话',
      dataIndex: 'phone',
      copyable: true,
      ellipsis: true,
      // 移除 hideInTable 属性
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
      // 移除 hideInTable 属性
    },
    {
      title: '角色',
      dataIndex: 'role',
      ellipsis: true,
      valueEnum: {
        0: {
          text: '管理员',
        },
        1: {
          text: '用户',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '正常',
          status: 'Success',
        },
        1: {
          text: '禁用',
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
      // 移除 hideInTable 属性
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      valueType: 'dateTime',
      editable: false,
      search: false,
      // 移除 hideInTable 属性
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right', // 始终固定操作列在右侧
      width: windowWidth < 768 ? 80 : 120, // 设置操作列宽度
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
        <ProTable<API.UserResponseDTO>
          headerTitle={'用户数据'}
          actionRef={actionRef}
          rowKey="id"
          search={{
            showHiddenNum: true,
            labelWidth: 65,
            defaultCollapsed: windowWidth < 768, // 小屏幕下默认折叠搜索栏
            span: windowWidth < 768 ? 24 : undefined, // 小屏幕下搜索项占满一行
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
            const userList = await list({
              ...params,
              ...filter,
            } as API.listParams);

            return userList;
          }}
          columns={columns}
          scroll={{ x: 1500 }} // 设置固定宽度，确保所有列都能显示
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true, // 始终显示页码选择器
            showQuickJumper: true, // 始终显示快速跳转
            size: windowWidth < 768 ? 'small' : 'default', // 小屏幕下使用小型分页
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
const UserAdminPageWithApp: React.FC = () => (
  <App>
    <UserAdminPage />
  </App>
);

export default UserAdminPageWithApp;
