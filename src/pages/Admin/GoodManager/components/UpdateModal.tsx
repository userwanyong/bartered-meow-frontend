import { updateGoods } from '@/services/user-center/goodsController';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

export type Props = {
  columns: ProColumns<API.GoodsResponseDTO>[];
  onCancel: () => void;
  onSubmit: () => void;
  visible: boolean;
  oldData?: API.GoodsResponseDTO;
};

/**
 * 更新节点
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
  const { visible, columns, oldData, onCancel, onSubmit } = props;

  return (
    <Modal
      destroyOnClose
      title={'更新商品'}
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
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
        columns={columns}
        form={{
          initialValues: oldData,
        }}
      />
    </Modal>
  );
};

export default UpdateModal;