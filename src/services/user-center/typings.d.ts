declare namespace API {
  type BaseResponseBoolean = {
    status?: number;
    message?: string;
    data?: boolean;
  };

  type BaseResponseListCartResponseDTO = {
    status?: number;
    message?: string;
    data?: CartResponseDTO[];
  };

  type BaseResponseListGoodsResponseDTO = {
    status?: number;
    message?: string;
    data?: GoodsResponseDTO[];
  };

  type BaseResponseListOrderResponseDTO = {
    status?: number;
    message?: string;
    data?: OrderResponseDTO[];
  };

  type BaseResponseListTagResponseDTO = {
    status?: number;
    message?: string;
    data?: TagResponseDTO[];
  };

  type BaseResponseListUserResponseDTO = {
    status?: number;
    message?: string;
    data?: UserResponseDTO[];
  };

  type BaseResponseString = {
    status?: number;
    message?: string;
    data?: string;
  };

  type BaseResponseUserResponseDTO = {
    status?: number;
    message?: string;
    data?: UserResponseDTO;
  };

  type cancelOrderParams = {
    id: string;
  };

  type CartAddRequestDTO = {
    id?: string;
    num?: number;
    good_id?: string;
    user_id?: string;
  };

  type CartResponseDTO = {
    id?: string;
    num?: number;
    goods?: GoodsResponseDTO;
    good_id?: string;
    user_id?: string;
    created_time?: string;
    updated_time?: string;
  };

  type deleteCartParams = {
    id: string;
  };

  type deleteGoodsByIdParams = {
    id: string;
  };

  type deleteOrderParams = {
    id: string;
  };

  type deleteTagParams = {
    id: string;
  };

  type deleteUsingPOSTParams = {
    id: string;
  };

  type getOrderByIdParams = {
    id: string;
  };

  type GoodsAddRequestDTO = {
    state?: number;
    user_id?: string;
    good_name?: string;
    good_description?: string;
    good_pic?: string;
    good_price?: number;
    total_count?: number;
    tag_ids?: string[];
  };

  type GoodsQueryRequestDTO = {
    id?: string;
    state?: number;
    user_id?: string;
    good_name?: string;
    good_description?: string;
    good_pic?: string;
    good_price?: number;
    created_time?: string;
    updated_time?: string;
  };

  type GoodsResponseDTO = {
    id?: string;
    userId?: string;
    state?: number;
    good_name?: string;
    good_description?: string;
    good_pic?: string;
    good_price?: number;
    total_count?: number;
    current_count?: number;
    pay_count?: number;
    created_time?: string;
    updated_time?: string;
  };

  type GoodsUpdateRequestDTO = {
    id?: string;
    state?: number;
    good_name?: string;
    good_description?: string;
    good_pic?: string;
    good_price?: number;
    total_count?: number;
    tag_ids?: string[];
  };

  type listGoodsByTagIdParams = {
    tagId: string;
  };

  type listGoodsParams = {
    goodsQueryRequestDTO: GoodsQueryRequestDTO;
  };

  type listParams = {
    userQueryRequestDTO: UserQueryRequestDTO;
  };

  type OrderAddRequestDTO = {
    id?: string;
    name?: string;
    address?: string;
    remark?: string;
    carts?: CartAddRequestDTO[];
    user_id?: string;
    total_price?: number;
  };

  type OrderResponseDTO = {
    id?: string;
    name?: string;
    no?: string;
    state?: number;
    time?: string;
    address?: string;
    remark?: string;
    user_id?: string;
    total_price?: number;
    pay_time?: string;
    pay_no?: string;
    return_time?: string;
  };

  type TagAddRequestDTO = {
    tag_name?: string;
  };

  type TagResponseDTO = {
    id?: string;
    tag_name?: string;
    created_time?: string;
    updated_time?: string;
  };

  type TagUpdateRequestDTO = {
    id?: string;
    tag_name?: string;
  };

  type uploadParams = {
    file: string;
  };

  type UserAddRequestDTO = {
    username?: string;
    password?: string;
    nickname?: string;
    gender?: number;
    phone?: string;
    email?: string;
    status?: number;
    role?: number;
    avatar_url?: string;
  };

  type UserLoginRequestDTO = {
    username?: string;
    password?: string;
  };

  type UserQueryRequestDTO = {
    id?: string;
    username?: string;
    nickname?: string;
    gender?: number;
    phone?: string;
    email?: string;
    status?: number;
    role?: number;
    created_time?: string;
    updated_time?: string;
  };

  type UserRegisterRequestDTO = {
    username?: string;
    password?: string;
    check_password?: string;
  };

  type UserResponseDTO = {
    id?: string;
    username?: string;
    password?: string;
    nickname?: string;
    gender?: number;
    phone?: string;
    email?: string;
    status?: number;
    role?: number;
    token?: string;
    avatar_url?: string;
    created_time?: string;
    updated_time?: string;
  };

  type UserUpdateRequestDTO = {
    id?: string;
    nickname?: string;
    gender?: number;
    phone?: string;
    email?: string;
    status?: number;
    role?: number;
    avatar_url?: string;
  };
}
