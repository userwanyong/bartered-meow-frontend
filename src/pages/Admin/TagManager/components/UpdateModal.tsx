import { updateTag } from '@/services/user-center/goodsController';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

export type Props = {
  columns: ProColumns<API.TagResponseDTO>[];
  onCancel: () => void;
  onSubmit: () => void;
  visible: boolean;
  oldData?: API.TagResponseDTO;
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.TagUpdateRequestDTO) => {
  const hide = message.loading('正在更新');
  try {
    await updateTag({
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
 * 更新分类弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { visible, columns, oldData, onCancel, onSubmit } = props;

  // 过滤只需要的列
  const updateColumns = columns.filter(
    (column) => column.dataIndex === 'tag_name'
  );

  return (
    <Modal
      destroyOnClose
      title={'更新分类'}
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable<API.TagResponseDTO, API.TagUpdateRequestDTO>
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
          initialValues: oldData,
        }}
      />
    </Modal>
  );
};

export default UpdateModal;