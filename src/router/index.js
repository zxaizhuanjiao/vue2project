import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router(
    {
        mode: 'history',
        routes: [
            {
                path: '/',
                redirect: '/dashboard',
                meta: { title: '第一个展示的页面' }
            },
            {
                path: '/dashboard',
                component: () => import('../view/layout/index.vue'),
                meta: { title: '侧边栏仪表板' },
                children: [
                    // 监测总览路由配置
                    {
						path: '/dashboard',
						component: () => import('../view/dashboard/index.vue'),
						meta: { title: '监测总览' }
					},
                    // 超级管理员路由配置
                    {
						path: '/authority',
						component: () => import('../view/superAdmin/authority/authority.vue'),
						meta: { title: '角色管理' }
					},
					{
						path: '/menu',
						component: () => import('../view/superAdmin/menu/menu.vue'),
						meta: { title: '菜单管理' }
					},
					{
						path: '/interface',
						component: () => import('../view/superAdmin/api/api.vue'),
						meta: { title: 'api管理' }
					},
					{
						path: '/user',
						component: () => import('../view/superAdmin/user/user.vue'),
						meta: { title: '用户管理' }
					},
                ]
            },
            {
                path: '/login',
                component: () => import('../view/login/index.vue'),
                meta: { title: '登录页' }
            },
            {
                path: '*',
                redirect: '/404'
            }
        ]
    }
);

router.beforeEach((to, from, next) => {
    // 获取session中存储的用户登录数据
    let isLogin = localStorage.getItem('token')
    if (isLogin) {
        next();
    } else {
        if (to.path === '/login') {
            next();
        } else {
            next('/login');
        }
    }
});

// 解决重复路由报红问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
};

export default router
