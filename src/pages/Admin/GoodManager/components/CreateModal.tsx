import { addGoods } from '@/services/user-center/goodsController';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

export type Props = {
  columns: ProColumns<API.GoodsResponseDTO>[];
  onCancel: () => void;
  onSubmit: () => void;
  visible: boolean;
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
  const { visible, columns, onCancel, onSubmit } = props;

  return (
    <Modal
      destroyOnClose
      title={'创建商品'}
      open={visible}
      onCancel={() => onCancel()}
      footer={null}
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
        columns={columns}
      />
    </Modal>
  );
};

export default CreateModal;
