import { addUsingPost } from '@/services/user-center/userController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { message, Modal } from 'antd';
import React from 'react';

interface Props {
  visible: boolean;
  columns: ProColumns<API.UserAddDTO>[];
  onSubmit: (values: API.UserAddDTO) => void;
  onCancel: () => void;
}
const columns: ProColumns<API.UserAddDTO>[] = [
  { title: '账号', 
    dataIndex: 'username', 
    key: 'username',
    tooltip:'请输入5-11位的账号',
  },
  { title: '密码', 
    dataIndex: 'password', 
    key: 'password',
    initialValue:'123456',
  },
  { title: '性别', 
    dataIndex: 'gender', 
    key: 'gender',
    valueType:'radio',
    valueEnum:{
      0:{text:'男'},
      1:{text:'女'}
    }
  },
  { title: '昵称', 
    dataIndex: 'nickname', 
    key: 'nickname',
    tooltip:'选填'
  },
  { title: '手机号', 
    dataIndex: 'phone', 
    key: 'phone',
    tooltip:'选填'
  },
  { title: '邮箱', 
    dataIndex: 'email', 
    key: 'email',
    tooltip:'选填'
  },
  { title: '角色', 
    dataIndex: 'role', 
    key: 'role' ,
    valueType:'radio',
    initialValue: '1',
    valueEnum:{
      0:{text:'管理员'},
      1:{text:'用户'}
    }
  },
  { title: '状态', 
    dataIndex: 'status', 
    key: 'status' ,
    valueType:'radio',
    initialValue: '0',
    valueEnum:{
      0:{text:'正常'},
      1:{text:'禁用'}
    }
  },
  { title: '头像', 
    dataIndex: 'avatar_url', 
    key: 'avatar_url',
    initialValue:'https://qbp-file.oss-cn-beijing.aliyuncs.com/default.jpg'
  },
];
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserAddDTO) => {
  const hide = message.loading('正在添加');
  try {
    await addUsingPost(fields);
    hide();
    message.success('创建成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('创建失败，' + error.message);
    return false;
  }
};

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible,  onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title={'创建'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (values: API.UserAddDTO) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default CreateModal;
