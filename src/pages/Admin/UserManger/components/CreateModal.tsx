import { add } from '@/services/user-center/userController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { message, Modal, Upload } from 'antd';
import React from 'react';
import { upload } from '@/services/user-center/fileController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  visible: boolean;
  columns: ProColumns<API.UserAddRequestDTO>[];
  onSubmit: (values: API.UserAddRequestDTO) => void;
  onCancel: () => void;
}
const columns: ProColumns<API.UserAddRequestDTO>[] = [
  { title: '账号', dataIndex: 'username', key: 'username', tooltip: '请输入5-11位的账号' },
  { title: '密码', dataIndex: 'password', key: 'password', initialValue: '123456' },
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
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', tooltip: '选填' },
  { title: '手机号', dataIndex: 'phone', key: 'phone', tooltip: '选填' },
  { title: '邮箱', dataIndex: 'email', key: 'email', tooltip: '选填' },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    valueType: 'radio',
    initialValue: '1',
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
    initialValue: '0',
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

// Add this new component for handling avatar upload
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
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserAddRequestDTO) => {
  const hide = message.loading('正在添加');
  try {
    const msg = await add(fields);
    hide();
    if (msg.status !== 200) {
      message.error(msg.message);
      return false;
    }
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
  const { visible, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title={'创建'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
      width={700}  // 添加宽度设置
    >
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (values: API.UserAddRequestDTO) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
        style={{ maxWidth: '100%' }}  // 添加样式确保表单填充可用空间
      />
    </Modal>
  );
};
export default CreateModal;
