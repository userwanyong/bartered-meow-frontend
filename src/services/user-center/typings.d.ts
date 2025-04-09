declare namespace API {
  type BaseResponseBoolean = {
    status?: number;
    message?: string;
    data?: boolean;
  };

  type BaseResponseListGoodsResponseDTO = {
    status?: number;
    message?: string;
    data?: GoodsResponseDTO[];
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

  type deleteGoodsByIdParams = {
    id: string;
  };

  type deleteTagParams = {
    id: string;
  };

  type deleteUsingPOSTParams = {
    id: string;
  };

  type GoodsAddRequestDTO = {
    state?: number;
    user_id?: string;
    good_name?: string;
    good_description?: string;
    good_pic?: string;
    good_price?: number;
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
    userId?: number;
    state?: number;
    good_name?: string;
    good_description?: string;
    good_pic?: string;
    good_price?: number;
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
