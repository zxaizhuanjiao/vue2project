const LOGIN = {
    url: '/login',
    deacriptions: '登录'
};
const LOGOUT = {
    url: '/logout',
    deacriptions: '登出'
};
const GET_MENU = {
    url: '/menu/getMenu',
    deacriptions: '获取一级菜单'
};
const GET_MENU_BY_PID = {
    url: '/menu/parent',
    deacriptions: '根据父id查询菜单'
};
const FIND_USER_LIST = {
    url: '/users/queryUsersList',
    deacriptions: '查询用户列表'
};
const ADD_USER = {
    url: '/users/addUser',
    deacriptions: '新增用户'
};
const EDIT_USER = {
    url: '/users/updateUser',
    deacriptions: '编辑用户'
};
const DELETE_USER = {
    url: '/users/deleteUser',
    deacriptions: '删除用户'
};
const FIND_MENU_LIST = {
    url: '/menu/getMenu',
    deacriptions: '查询菜单列表'
};
const ADD_MENU = {
    url: '/menu',
    deacriptions: '新增菜单'
};
const FIND_ROLE_LIST = {
    url: '/roles/queryRolesList',
    deacriptions: '查询角色列表'
};
const FIND_BUTTON_LIST = {
    url: '/resources/getResources',
    deacriptions: '查询按钮列表'
};
const ADD_BUTTON = {
    url: '/resources/getResources',
    deacriptions: '新增按钮'
};
const EDIT_BUTTON = {
    url: '/resources/getResources',
    deacriptions: '编辑按钮'
};
const DELETE_BUTTON = {
    url: '/resources/getResources',
    deacriptions: '删除按钮'
};
const FIND_IP = {
    url: '/resources/getResources',
    deacriptions: '查询ip'
};
const SYNCHRONIZATION = {
    url: '/resources/getResources',
    deacriptions: '时间同步'
};

export default {
    LOGIN: LOGIN,
    LOGOUT: LOGOUT,
    GET_MENU: GET_MENU,
    GET_MENU_BY_PID: GET_MENU_BY_PID,
    FIND_USER_LIST: FIND_USER_LIST,
    ADD_USER: ADD_USER,
    EDIT_USER: EDIT_USER,
    DELETE_USER: DELETE_USER,
    FIND_MENU_LIST: FIND_MENU_LIST,
    ADD_MENU: ADD_MENU,
    FIND_ROLE_LIST: FIND_ROLE_LIST,
    FIND_BUTTON_LIST: FIND_BUTTON_LIST,
    ADD_BUTTON: ADD_BUTTON,
    EDIT_BUTTON: EDIT_BUTTON,
    DELETE_BUTTON: DELETE_BUTTON,
    FIND_IP: FIND_IP,
    SYNCHRONIZATION: SYNCHRONIZATION,
}
