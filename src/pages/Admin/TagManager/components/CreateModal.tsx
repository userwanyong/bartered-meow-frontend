import { addTag } from '@/services/user-center/goodsController';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

export type Props = {
  columns: ProColumns<API.TagResponseDTO>[];
  onCancel: () => void;
  onSubmit: () => void;
  visible: boolean;
};

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.TagAddRequestDTO) => {
  const hide = message.loading('正在添加');
  try {
    await addTag({
      ...fields,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('添加失败，' + error.message);
    return false;
  }
};

/**
 * 创建分类弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onCancel, onSubmit } = props;

  // 过滤只需要的列
  const createColumns = columns.filter(
    (column) => column.dataIndex === 'tag_name'
  );

  return (
    <Modal
      destroyOnClose
      title={'新建分类'}
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable<API.TagResponseDTO, API.TagAddRequestDTO>
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            onSubmit?.();
          }
        }}
        rowKey="id"
        type="form"
        columns={createColumns}
        form={{
          initialValues: {},
        }}
      />
    </Modal>
  );
};

export default CreateModal;