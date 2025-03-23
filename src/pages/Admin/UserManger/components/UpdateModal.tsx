import { updateUsingPost } from '@/services/user-center/userController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { message, Modal ,Image} from 'antd';
import React from 'react';

interface Props {
  oldData?: API.UserVo;
  visible: boolean;
  columns: ProColumns<API.UserUpdateDTO>[];
  onSubmit: (values: API.UserUpdateDTO) => void;
  onCancel: () => void;
}
const columns: ProColumns<API.UserAddDTO>[] = [
  { title: '性别', 
    dataIndex: 'gender', 
    key: 'gender',
    valueType:'radio',
    valueEnum:{
      0:{ text:'男' },
      1:{ text:'女' }
    }
  },
  { title: '昵称', 
    dataIndex: 'nickname', 
    key: 'nickname',
  },
  { title: '手机号', 
    dataIndex: 'phone', 
    key: 'phone',
  },
  { title: '邮箱', 
    dataIndex: 'email', 
    key: 'email',
  },
  { title: '角色', 
    dataIndex: 'role', 
    key: 'role' ,
    valueType:'radio',
    valueEnum:{
      0:{ text:'管理员' },
      1:{ text:'用户' }
    }
  },
  { title: '状态', 
    dataIndex: 'status', 
    key: 'status' ,
    valueType:'radio',
    valueEnum:{
      0:{ text:'正常' },
      1:{ text:'禁用' }
    }
  },
  { title: '头像', 
    dataIndex: 'avatar_url', 
    render:(_,record)=>(
      <div>
        <Image src={record.avatar_url} width={70} height={70}/>
      </div>
    ),
    key: 'avatar_url',
  },
];
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdateDTO) => {
  const hide = message.loading('正在更新');
  try {
    await updateUsingPost(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('更新失败，' + error.message);
    return false;
  }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, visible,  onSubmit, onCancel } = props;

  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{
          initialValues: oldData,
        }}
        onSubmit={async (values: API.UserUpdateDTO) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default UpdateModal;
