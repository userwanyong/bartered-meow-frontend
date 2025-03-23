export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' },
             { name: '注册', path: '/user/register', component: './User/Register' }
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },

  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin', //权限判断
    routes: [
      { path: '/admin', redirect: '/admin/user-manger' }, //进入这个下拉菜单默认指向该菜单栏下的哪一项
      { path: '/admin/user-manger', name: '用户管理', component: './Admin/UserManger'},
    ],
  },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
