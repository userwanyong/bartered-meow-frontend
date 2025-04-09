import { update } from '@/services/user-center/userController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { message, Modal, Upload } from 'antd';
import React from 'react';
import { upload } from '@/services/user-center/fileController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';  // 添加这行导入

interface Props {
  oldData?: API.UserResponseDTO;
  visible: boolean;
  columns: ProColumns<API.UserUpdateRequestDTO>[];
  onSubmit: (values: API.UserUpdateRequestDTO) => void;
  onCancel: () => void;
}
const AvatarUploader: React.FC<any> = ({ value, onChange }) => {
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string>(value);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await upload(formData);
      if (res.status === 200 && res.message) {
        setImageUrl(res.message);
        onChange?.(res.message);
        message.success("上传成功");
      } else {
        message.error(res.message);
      }
    } catch (error: any) {
      message.error('上传失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload
      name="file"
      listType="picture-card"
      showUploadList={false}
      accept="image/*"  // 添加这行
      beforeUpload={(file) => {
        // 验证文件类型
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error('只能上传图片文件！');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          message.error('图片大小不能超过 5MB');
          return false;
        }
        handleUpload(file);
        return false;
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      )}
    </Upload>
  );
};

const columns: ProColumns<API.UserUpdateRequestDTO>[] = [
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    valueType: 'radio',
    valueEnum: {
      0: { text: '男' },
      1: { text: '女' },
    },
  },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    valueType: 'radio',
    valueEnum: {
      0: { text: '管理员' },
      1: { text: '用户' },
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    valueType: 'radio',
    valueEnum: {
      0: { text: '正常' },
      1: { text: '禁用' },
    },
  },
  {
    title: '头像',
    dataIndex: 'avatar_url',
    key: 'avatar_url',
    renderFormItem: () => {
      return <AvatarUploader />;
    },
  },
];
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdateRequestDTO) => {
  const hide = message.loading('正在更新');
  try {
    hide();
    const msg = await update(fields);
    if (msg.status !== 200) {
      message.error(msg.message);
      return false;
    }
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
  const { oldData, visible, onSubmit, onCancel } = props;
  const { initialState, setInitialState } = useModel('@@initialState');

  if (!oldData) {
    return <></>;
  }

  // 转换数据类型
  const initialValues = {
    ...oldData,
    gender: oldData.gender?.toString(),
    role: oldData.role?.toString(),
    status: oldData.status?.toString(),
  };

  return (
    <Modal
      destroyOnClose
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
      width={700}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{
          initialValues: initialValues,  // 使用转换后的数据
        }}
        onSubmit={async (values: API.UserUpdateRequestDTO) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
          });
          if (success) {
            // 如果更新的是当前登录用户，同时更新全局状态
            if (initialState?.currentUser?.id === oldData.id) {
              setInitialState((s) => ({
                ...s,
                currentUser: {
                  ...s?.currentUser,
                  ...values,
                },
              }));
            }
            onSubmit?.(values);
          }
        }}
        style={{ maxWidth: '100%' }}
      />
    </Modal>
  );
};

export default UpdateModal;
