// 基础路由
const baseRouter = [{
    path: '/home',
    component: (resolve) => require(['@/views/dashboard'], resolve),
    name: 'home',
    meta: {
      title: 'home',
      icon: 'icon-ym icon-ym-nav-home',
      affix: true,
      zhTitle: '首页'
    }
  },
  {
    path: '/dashboard',
    component: (resolve) => require(['@/views/basic/dashboard'], resolve),
    name: 'dashboard',
    meta: {
      title: 'dashboard',
      icon: 'icon-ym icon-ym-generator-kanban',
      affix: true,
      zhTitle: '门户展示'
    }
  },
  {
    path: '/messageRecord',
    component: (resolve) => require(['@/views/basic/messageRecord'], resolve),
    name: 'messageRecord',
    meta: {
      title: 'messageRecord',
      affix: false,
      zhTitle: '消息中心',
      icon: 'icon-ym icon-ym-sysNotice',
    }
  },
  {
    path: '/previewModel',
    component: (resolve) => require(['@/views/basic/dynamicModel'], resolve),
    name: 'previewModel',
    meta: {
      title: 'previewModel',
      affix: false,
      zhTitle: '功能预览',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },
  {
    path: '/profile',
    component: (resolve) => require(['@/views/basic/profile'], resolve),
    name: 'profile',
    meta: {
      title: 'profile',
      affix: false,
      zhTitle: '个人信息',
      icon: 'icon-ym icon-ym-user',
    }
  },
  {
    path: '/abarbeitungShow',
    component: (resolve) => require(['@/views/mom/sale/abarbeitungShow'], resolve),
    name: 'abarbeitungShow',
    meta: {
      title: 'abarbeitungShow',
      affix: false,
      zhTitle: '质量整改',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },  {
    path: '/xjrPartolMessageView',
    component: (resolve) => require(['@/views/mom/xjrpatrol/xjrPartolMessageView'], resolve),
    name: 'xjrPartolMessageView',
    meta: {
      title: 'xjrPartolMessageView',
      affix: false,
      zhTitle: '设备量具检验详情',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },{
    path: '/materialinspectionView',
    component: (resolve) => require(['@/views/mom/quality/materialinspection/materialinspectionView'], resolve),
    name: 'materialinspectionView',
    meta: {
      title: 'materialinspectionView',
      affix: false,
      zhTitle: '来料检验详情',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },{
    path: '/productinspectionView',
    component: (resolve) => require(['@/views/mom/quality/productinspection/productinspectionView'], resolve),
    name: 'productinspectionView',
    meta: {
      title: 'productinspectionView',
      affix: false,
      zhTitle: '成品检验详情',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },{
    path: '/semiproductinspectionView',
    component: (resolve) => require(['@/views/mom/quality/semiproductinspection/semiproductinspectionView'], resolve),
    name: 'semiproductinspectionView',
    meta: {
      title: 'semiproductinspectionView',
      affix: false,
      zhTitle: '成品检验详情',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },{
    path: '/stockinspectionView',
    component: (resolve) => require(['@/views/mom/quality/stockinspection/stockinspectionView'], resolve),
    name: 'stockinspectionView',
    meta: {
      title: 'stockinspectionView',
      affix: false,
      zhTitle: '库存检验详情',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },{
    path: '/deliveryinspectionView',
    component: (resolve) => require(['@/views/mom/quality/deliveryinspection/deliveryinspectionView'], resolve),
    name: 'deliveryinspectionView',
    meta: {
      title: 'deliveryinspectionView',
      affix: false,
      zhTitle: '库存检验详情',
      icon: 'icon-ym icon-ym-btn-preview',
    }
  },
]
export default baseRouter
