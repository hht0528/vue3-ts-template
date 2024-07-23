export default {
  path: '/',
  name: 'Home',
  component: () => import(/* webpackChunkName: "home" */ '@/layouts/index.vue'),
  meta: {
    role: ['common', 'admin'],
  },
  children: [
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "home" */ '@/views/about/index.vue'),
      meta: {
        isShow: true,
        title: '项目介绍',
      },
    },
  ],
}
