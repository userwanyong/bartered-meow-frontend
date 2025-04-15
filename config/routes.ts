export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },

  { path: '/welcome', name: '规划', icon: 'smile', component: './Welcome' },

  {
    path: '/goods',
    name: '商品展示',
    icon: 'ShoppingOutlined',
    component: './User/Goods',
    layout: false,
  },
  {
    path: '/user/profile',
    name: '个人中心',
    component: './User/Profile',
    layout: false,
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin', //权限判断
    routes: [
      { path: '/admin', redirect: '/admin/user-manger' }, //进入这个下拉菜单默认指向该菜单栏下的哪一项
      { path: '/admin/user-manger', name: '用户管理', component: './Admin/UserManger' },
      { path: '/admin/good-manager', name: '商品管理', component: './Admin/GoodManager' },
      { path: '/admin/tag-manager', name: '分类管理', component: './Admin/TagManager' },
    ],
  },

  { path: '/', redirect: '/goods' },

  { path: '*', layout: false, component: './404' },
  {
    path: '/user/goods/detail/:id',
    component: './User/Goods/detail',
    layout: false,
  },
  {
    path: '/user/cart',
    component: './User/Cart',
    name: '购物车',
    layout: false,
  },
  {
    path: '/user/orders',
    component: './User/Order',
    name: '订单',
    layout: false,
  },
  {
    path: '/user/orders/checkout',
    component: './User/Order/checkout',
    layout: false,
  },
  {
    path: '/user/password',
    component: './User/Password',
    layout: false,
  },
  {
    path: '/user/sell',
    component: './User/SellGoods',
    layout: false,
  },
];
