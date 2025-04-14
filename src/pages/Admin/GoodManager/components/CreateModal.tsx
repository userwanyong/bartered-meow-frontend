import { addGoods } from '@/services/user-center/goodsController';
import { listTag } from '@/services/user-center/goodsController';
import { upload } from '@/services/user-center/fileController';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Modal, Upload, Checkbox, Space, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export type Props = {
  columns: ProColumns<API.GoodsResponseDTO>[];
  onCancel: () => void;
  onSubmit: () => void;
  visible: boolean;
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

// 修改标签选择器组件，使用Checkbox代替Select
const TagSelector: React.FC<any> = ({ value = [], onChange }) => {
  const [tags, setTags] = useState<API.TagResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    onChange?.(checkedValues);
  };

  if (loading) {
    return <Spin tip="加载标签中..." />;
  }

  return (
    <Checkbox.Group 
      value={value} 
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
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.GoodsAddRequestDTO) => {
  const hide = message.loading('正在添加');
  try {
    await addGoods({
      ...fields,
    });
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
 * 创建商品弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSubmit } = props;

  // 定义创建商品表单的列
  const createColumns: ProColumns<API.GoodsAddRequestDTO>[] = [
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
      title: '商品数量', 
      dataIndex: 'total_count', 
      key: 'total_count',
      valueType: 'digit',
      initialValue: 1,
      fieldProps: {
        min: 1,
        precision: 0,
        style: { width: '20%' },
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入商品数量' },
          { type: 'number', min: 1, message: '商品数量至少为1' }
        ],
      }
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
      title={'创建商品'}
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
      width={700}
    >
      <ProTable<API.GoodsResponseDTO, API.GoodsAddRequestDTO>
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            onSubmit?.();
          }
        }}
        rowKey="id"
        type="form"
        columns={createColumns}
        style={{ maxWidth: '100%' }}
      />
    </Modal>
  );
};

export default CreateModal;
