<template>
    <div class="content">
        <el-container>
            <el-aside :class="collapsed ? 'left_close' : 'left_open'">
                <div class="wt_aside_title">
                    <img src="../../assets/wtLogo.png" style="width: 150px;margin-left: 17px;margin-top: 15px;">
                </div>
                <div v-if="!collapsed" style="z-index: 5;position: absolute;top: 100px;left: 190px;cursor: pointer" @click="toggleCollapsed">
                    <img src="../../assets/isOpen.png" style="width: 36px">
                </div>
                <div v-if="collapsed" style="z-index: 5;position: absolute;top: 100px;left: 47px;cursor: pointer" @click="toggleCollapsed">
                    <img src="../../assets/isClose.png" style="width: 36px">
                </div>
                <el-menu
                        :collapse-transition="false"
                        :collapse="collapsed"
                        @select="menuClick"
                        :default-openeds="['1']"
                        :default-active="defaultActive"
                        background-color="#080829"
                        text-color="#A6AAAE"
                        active-text-color="#fff">
                    <template v-for="menuInfo in menuList">
                        <el-submenu v-if="menuInfo.children" :key="menuInfo.id">
                            <template slot="title">
                                <img src="../../assets/navlogo/lltj.png" style="width: 20px; margin-right: 5px">
                                <span>{{menuInfo.name}}</span>
                            </template>
                            <template v-for="children in menuInfo.children">
                                <el-menu-item :key="children.id" :index="children.id">{{children.name}}</el-menu-item>
                            </template>
                        </el-submenu>
                        <template v-else>
                            <el-menu-item :key="menuInfo.id" :index="menuInfo.id">
                                <img :src="getImgUrl(menuInfo.icon)" alt="" style="width: 20px; margin-right: 5px">
                                <span slot="title">{{menuInfo.name}}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="border-bottom: 1px solid #D9D9D9;">
                    <div class="title_nav">
                        安全态势感知平台
                    </div>
                    <div style="float: right; line-height: 60px; margin-right: 10px; display:flex">
                        <div style="margin-top: 10px; margin-right: 10px">
                            <img src="../../assets/user.png" style="width: 35px">
                        </div>

                        <el-dropdown>
                            <span class="el-dropdown-link wt_dropdown_name">
                                {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" class="wt_dropdown">
                                <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <ThemePicker/>
                    </div>
                </el-header>
                <el-main style="padding: 0; height: 100%">
                    <div style="height: 100%">
                        <div style="height: 100%; width: 100%; overflow-x:hidden">
                            <router-view></router-view>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import api from '../../utils/api'
    import ThemePicker from "../ThemePicker";

    export default {
        watch: {
            // 监听vuex
            '$store.state.pageRouterData.location' (newval) {
                this.location = newval;
            },
            '$store.state.pageRouterData.defaultSelectedKeys' (newval) {
                this.defaultSelectedKeys = newval;
            },
            '$store.state.themeData.themeValue' (newval) {
                this.themeValue = 'background-color: ' + newval;
            },
        },
        name: "Navigation",
        components: {ThemePicker},
        data() {
            return {
                themeValue: 'background-color: #F26521',
                collapsed: false,
                location: this.$store.state.pageRouterData.location,
                defaultSelectedKeys: this.$store.state.pageRouterData.defaultSelectedKeys,
                menuList: [],
                // 当前登录用户
                userName: sessionStorage.getItem('userName'),
                defaultActive: this.$store.state.pageRouterData.defaultSelectedKeys,
            }
        },
        created() {
            this.themeValue = 'background-color: ' + this.$store.state.themeData.themeValue;
            setTimeout(this.findMenuList(), 1000);
        },
        methods: {
            // 路由跳转
            trip(name, path) {
                this.location = name;
                this.$router.push(path);
            },
            toggleCollapsed() {
                this.collapsed = !this.collapsed;
            },
            findMenuList() {
                this.$axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization');
                this.$axios.get(api.GET_MENU.url + '/' + sessionStorage.getItem('roleId')).then(res => {
                    if (res.data.code === '000000') {
                        this.menuList = res.data.data;
                        sessionStorage.setItem('menuList', JSON.stringify(this.menuList));
                    }
                });
            },
            getImgUrl(url) {
              return require('../../assets/navlogo/' + url);
            },
            logout() {
                // sessionStorage.clear();
                this.$store.commit('pageRouterData/setDefaultSelectedKeys', '1');
                // const params = {
                //     username: sessionStorage.getItem('username')
                // };
                // this.$axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization');
                // this.$axios.post(api.LOGOUT.url, this.qs.stringify(params)).then(res => {
                //     console.log(res);
                //     if (res.data.code === '000000') {
                //         sessionStorage.removeItem('Authorization');
                //         sessionStorage.setItem('Authorization', 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ=');
                //         this.$router.push('/login');
                //     }
                // });
                sessionStorage.clear();
                this.$router.push('/login');
            },
            // eslint-disable-next-line no-unused-vars
            menuClick(id) {
                this.$store.commit('pageRouterData/setDefaultSelectedKeys', id.toString());
                id = Number(id);
                this.getCheckedNodes(this.menuList, id);
            },
            getCheckedNodes(data, value) {
                data.forEach(item => {
                    if (item.id === value.toString()) {
                        this.$store.commit('pageRouterData/setLocation', item.name);
                        this.trip(item.name, item.href);
                    } else {
                        if (item.children && item.children.length > 0) {
                            this.getCheckedNodes(item.children, value);
                        }
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .content {
        height: 100%;
    }
    section {
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.4);
        height: 100%;
    }
    .title_nav {
        font-size: 20px;
        font-weight: 400;
        text-align: left;
        width: 225px;
        float: left;
        line-height: 60px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #040848;
    }
    .control_button {
        float: left;
        color: white;
        cursor: pointer;
        margin-left: 10px;
    }
</style>
<style lang="less">
    .wt_aside_title {
        height: 64px;
        line-height: 64px;
    }
    aside > ul {
        max-width: 208px;
        overflow-y: hidden;
    }
    .left_open {
        background-color: #080829;
        max-width: 208px;
        overflow-x: hidden;
        width:208px!important;
    }
    .left_close {
        background-color: #080829;
        max-width: 208px;
        overflow-x: hidden!important;
        width:65px!important;
    }
    .el-menu {
        border: none!important;
    }
    .el-submenu__title {
        color: white!important;
        height: 64px!important;
        line-height: 64px!important;
        font-size: 16px!important;
        font-weight: 400!important;
    }
    .el-submenu__title:hover {
        background-color: none!important;
    }
    .el-menu-item {
        height: 64px!important;
        line-height: 64px!important;
        font-size: 16px!important;
        font-weight: 400!important;
    }
    .el-menu-item.is-active {
        padding-left: 16px!important;
        border-left: 4px solid #F26521;
        background-color: #2A1F37!important;
        div {
            img {
                margin-left: -4px;
            }
        }
    }
    .wt_dropdown_name {
        width: 46px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #040848;
        line-height: 22px;
    }
    .wt_dropdown {
        padding: 0!important;
        top: 50px!important;
        height: 30px;
        line-height: 30px;
        li {
            line-height: 30px;
        }
    }
</style>
