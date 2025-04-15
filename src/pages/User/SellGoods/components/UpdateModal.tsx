import { updateGoods, listTag } from '@/services/user-center/goodsController';
import { upload } from '@/services/user-center/fileController';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Modal, Upload, Checkbox, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  visible: boolean;
  oldData?: API.GoodsResponseDTO;
};

// 添加图片上传组件
const ImageUploader: React.FC<any> = ({ value, onChange }) => {
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
        message.success('上传成功');
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
      accept="image/*"
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
        <img
          src={imageUrl}
          alt="商品图片"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      )}
    </Upload>
  );
};

// 标签选择器组件，使用Checkbox代替Select
const TagSelector: React.FC<any> = ({ value = [], onChange }) => {
  const [tags, setTags] = useState<API.TagResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // 初始化选中的标签值
  const [selectedTags, setSelectedTags] = useState<number[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  // 当外部value变化时更新选中状态
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setSelectedTags(value);
      } else {
        setSelectedTags([value]);
      }
    }
  }, [value]);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const response = await listTag({
          tagQueryRequestDTO: {}
        });
        if (response && response.data) {
          setTags(response.data);
        } else {
          message.error('获取标签列表失败');
        }
      } catch (error: any) {
        message.error('获取标签列表出错: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleChange = (checkedValues: any[]) => {
    setSelectedTags(checkedValues);
    onChange?.(checkedValues);
  };

  if (loading) {
    return <Spin tip="加载标签中..." />;
  }

  return (
    <Checkbox.Group 
      value={selectedTags} 
      onChange={handleChange}
      style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}
    >
      <Space size={[8, 16]} wrap>
        {tags.map((tag) => (
          <Checkbox key={tag.id} value={tag.id}>
            {tag.tag_name}
          </Checkbox>
        ))}
      </Space>
    </Checkbox.Group>
  );
};

/**
 * 更新商品
 *
 * @param fields
 */
const handleUpdate = async (fields: API.GoodsUpdateRequestDTO) => {
  const hide = message.loading('正在更新');
  try {
    await updateGoods({
      ...fields,
    });
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
 * 更新商品弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { visible, oldData, onCancel, onSubmit } = props;

  // 定义更新商品表单的列
  const updateColumns: ProColumns<API.GoodsUpdateRequestDTO>[] = [
    { 
      title: '商品名', 
      dataIndex: 'good_name', 
      key: 'good_name',
      formItemProps: {
        rules: [{ required: true, message: '请输入商品名称' }],
      }
    },
    { 
      title: '商品描述', 
      dataIndex: 'good_description', 
      key: 'good_description',
      valueType: 'textarea',
    },
    { 
      title: '商品价格', 
      dataIndex: 'good_price', 
      key: 'good_price',
      valueType: 'money',
      fieldProps: {
        min: 0,
        precision: 2,
        step: 0.01,
        style: { width: '20%' },
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入商品价格' },
          { type: 'number', min: 0, message: '商品价格不能为负数' }
        ],
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
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
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '上架中', value: 0 },
          { label: '已下架', value: 1 },
        ],
      },
    },
    {
      title: '商品分类',
      dataIndex: 'tag_ids',
      key: 'tag_ids',
      renderFormItem: () => {
        return <TagSelector />;
      },
      formItemProps: {
        rules: [{ required: true, message: '请至少选择一个商品标签' }],
      }
    },
    {
      title: '商品图片',
      dataIndex: 'good_pic',
      key: 'good_pic',
      renderFormItem: () => {
        return <ImageUploader />;
      },
      formItemProps: {
        rules: [{ required: true, message: '请上传商品图片' }],
      }
    },
  ];

  return (
    <Modal
      destroyOnClose
      title={'修改商品'}
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
      width={700}
    >
      <ProTable<API.GoodsResponseDTO, API.GoodsUpdateRequestDTO>
        onSubmit={async (value) => {
          const success = await handleUpdate({
            id: oldData?.id,
            ...value,
          });
          if (success) {
            onSubmit?.();
          }
        }}
        rowKey="id"
        type="form"
        columns={updateColumns}
        form={{
          initialValues: {
            ...oldData,
            // 确保标签ID正确传递
            tag_ids: oldData?.tag_ids,
          },
        }}
        style={{ maxWidth: '100%' }}
      />
    </Modal>
  );
};

export default UpdateModal;