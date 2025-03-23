declare namespace API {
  type BaseResponseBoolean_ = {
    data?: boolean;
    message?: string;
    status?: number;
  };

  type BaseResponseListUserVo_ = {
    data?: UserVo[];
    message?: string;
    status?: number;
  };

  type BaseResponseUserVo_ = {
    data?: UserVo;
    message?: string;
    status?: number;
  };

  type deleteUsingPOSTParams = {
    /** id */
    id: string;
  };

  type listUsingGETParams = {
    createdTime?: string;
    email?: string;
    gender?: number;
    id?: string;
    nickname?: string;
    phone?: string;
    role?: number;
    status?: number;
    updatedTime?: string;
    username?: string;
  };

  type UserAddDTO = {
    avatar_url?: string;
    email?: string;
    gender?: number;
    nickname?: string;
    password?: string;
    phone?: string;
    role?: number;
    status?: number;
    username?: string;
  };

  type UserLoginDTO = {
    password?: string;
    username?: string;
  };

  type UserRegisterDTO = {
    check_password?: string;
    password?: string;
    username?: string;
  };

  type UserUpdateDTO = {
    avatar_url?: string;
    email?: string;
    gender?: number;
    id?: string;
    nickname?: string;
    phone?: string;
    role?: number;
    status?: number;
  };

  type UserVo = {
    avatar_url?: string;
    created_time?: string;
    email?: string;
    gender?: number;
    id?: string;
    nickname?: string;
    password?: string;
    phone?: string;
    role?: number;
    status?: number;
    updated_time?: string;
    username?: string;
  };
}
