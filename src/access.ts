/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.UserVo } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser &&  typeof currentUser.role === 'number' && currentUser.role === 0,
  };
}
