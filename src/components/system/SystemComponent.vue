<template>
    <div style="display: flex; padding: 20px; height: calc(100% - 40px)">
        <div class="sub_left_div">
            <el-tabs tab-position="left" class="tabs_system" style="height: 100%"
                     v-model="activeName">
                <template v-for="menuInfo in subMenuList">
                    <el-tab-pane :name="menuInfo.href" :label="menuInfo.name" :key="menuInfo.id">
                        <span slot="label">
                            <img :src="getImgUrl(menuInfo.icon)" alt="" style="width: 18px; margin: 0 20px">
                            {{menuInfo.name}}
                        </span>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </div>
        <div style="width: calc(100% - 208px)">
            <networkComponent v-if="activeName === '/network'"></networkComponent>
            <timeComponent v-else-if="activeName === '/time'"></timeComponent>
            <controlComponent v-else-if="activeName === '/control'"></controlComponent>
            <userComponent v-else-if="activeName === '/user'"></userComponent>
        </div>
    </div>
</template>

<script>
    import api from '../../utils/api'
    import networkComponent from "./NetworkComponent";
    import timeComponent from "./time/TimeComponent";
    import userComponent from "./UserComponent";
    import controlComponent from "./control/ControlComponent";

    export default {
        name: "SystemComponent",
        components: {
            networkComponent,
            timeComponent,
            controlComponent,
            userComponent,
        },
        data() {
            return {
                activeName: '',
                subMenuList: [],
            }
        },
        created() {
          this.findMenuList();
        },
        methods: {
            findMenuList() {
                let pid = '';
                const menuList = JSON.parse(sessionStorage.getItem('menuList'));
                menuList.forEach((item) => {
                   if (item.name === '系统设置') {
                       pid = item.id;
                   }
                });

                this.$axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization');
                this.$axios.get(api.GET_MENU_BY_PID.url + '/' + sessionStorage.getItem('roleId') + '/' + pid).then(res => {
                    if (res.data.code === '000000') {
                        this.subMenuList = res.data.data;
                        this.activeName = this.subMenuList[0].href;
                    }
                });
            },
            getImgUrl(url) {
                return require('../../assets/system/' + url);
            },
        }
    }
</script>

<style lang="less">
    .sub_left_div {
        width: 208px;
        height: 100%;
    }
    .tabs_system div div {
        width: 209px;
    }
    .tabs_system div div div div div {
        text-align: left!important;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
    }
    .tabs_system div div div div .el-tabs__active-bar {
        height: 0!important;
    }
</style>
