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
					// 资源对象
					{
						path: '/application',
						component: () => import('../view/resourceObject/application/index.vue'),
						meta: { title: '应用' }
					},
					{
						path: '/time',
						component: () => import('../view/resourceObject/time/index.vue'),
						meta: { title: '时间' }
					},
					{
						path: '/address',
						component: () => import('../view/resourceObject/address/index.vue'),
						meta: { title: '地址' }
					},
					{
						path: '/securityArea',
						component: () => import('../view/resourceObject/securityArea/index.vue'),
						meta: { title: '安全域' }
					},
                    // 安全策略
                    {
						path: '/basicFirewall',
						component: () => import('../view/securityStrategy/basicFirewall/index.vue'),
						meta: { title: '基础防火墙' }
					},
                    {
						path: '/protocolDeepAnalysis',
						component: () => import('../view/securityStrategy/protocolDeepAnalysis/index.vue'),
						meta: { title: '协议深度解析' }
					},
                    {
						path: '/assistConfig',
						component: () => import('../view/securityStrategy/assistConfig/index.vue'),
						meta: { title: '辅助配置' }
					},
                    {
						path: '/rulerGroup',
						component: () => import('../view/securityStrategy/rulerGroup/index.vue'),
						meta: { title: '白名单策略组' }
					},
                    {
						path: '/rulerGroup/detail',
						component: () => import('../view/securityStrategy/rulerGroup/components/detail.vue'),
						meta: { title: '白名单策略组详情页' }
					},
                    {
						path: '/whiteListCustomize',
						component: () => import('../view/securityStrategy/whiteListCustomize/index.vue'),
						meta: { title: '自定义白名单' }
					},
					{
						path: '/whiteListCustomize/detail',
						component: () => import('../view/securityStrategy/whiteListCustomize/components/detail.vue'),
						meta: { title: '白名单策略组详情页' }
					},
                    {
						path: '/behaviorDetection',
						component: () => import('../view/securityStrategy/behaviorDetection/index.vue'),
						meta: { title: '行为深度检测' }
					},
                    {
						path: '/networkAttack',
						component: () => import('../view/securityStrategy/networkAttack/index.vue'),
						meta: { title: '网络攻击' }
					},
                    {
						path: '/blackList',
						component: () => import('../view/securityStrategy/blackList/index.vue'),
						meta: { title: '黑名单' }
					},
                    {
						path: '/ipMacList',
						component: () => import('../view/securityStrategy/ipMacList/index.vue'),
						meta: { title: 'IP-Mac绑定' }
					},
                    {
						path: '/connectionManagement',
						component: () => import('../view/securityStrategy/connectionManagement/index.vue'),
						meta: { title: '连接管理' }
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
					}
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
