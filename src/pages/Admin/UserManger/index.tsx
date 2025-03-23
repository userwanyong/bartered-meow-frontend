import { deleteUsingPost, listUsingGet } from '@/services/user-center/userController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography,Image } from 'antd';
import React, { useRef, useState } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

/**
 * 用户管理页面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.UserVo>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.UserVo) => {
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
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.UserVo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      editable: false
    },
    {
      title: '账号',
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      editable: false
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
      render:(_,record)=>(
        <div>
          <Image src={record.avatar_url} width={70} height={70}/>
        </div>
      ),
      ellipsis: true,
      search: false,//不显示该字段的搜索框
    },
    {
      title: '性别',
      dataIndex: 'gender',
      ellipsis: true,
      valueEnum:{
        0:{
          text:'男',
        },
        1:{
          text:'女',
        }
      }
    },
    {
      title: '电话',
      dataIndex: 'phone',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      ellipsis: true,
      valueEnum:{
        0:{
          text:'管理员',
        },
        1:{
          text:'用户',
        }
      }
    },
    {
      // disable: true,
      title: '状态',
      dataIndex: 'status',
      // filters: true,
      // onFilter: true,
      // valueType: 'select',
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
      <ProTable<API.UserVo>
        headerTitle={'用户数据'}
        actionRef={actionRef}
        rowKey="id" //解决Warning: Each child in a list should have a unique "key" prop.报错
        search={{
          showHiddenNum: true, //显示隐藏的数量
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
        request={async (params, sort, filter) => {
          // const sortField = Object.keys(sort)?.[0];
          // const sortOrder = sort?.[sortField] ?? undefined;
          const userList = await listUsingGet({
            ...params,
            // sortField,
            // sortOrder,
            ...filter,
          } as API.listUsingGETParams);

          return userList;
        }}
        columns={columns}
      />
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
export default UserAdminPage;
