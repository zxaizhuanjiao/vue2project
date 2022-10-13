<template>
    <div style="padding: 0 20px">
        <el-tabs v-model="activeName" class="user_tabs">
            <el-tab-pane label="用户管理" name="first">
                <userComponent></userComponent>
            </el-tab-pane>
            <el-tab-pane label="权限管理" name="second">
                <authorityComponent></authorityComponent>
            </el-tab-pane>
            <el-tab-pane label="角色管理" name="third">
                <roleComponent></roleComponent>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import userComponent from "./uar/UserComponent";
    import authorityComponent from "./uar/AuthorityComponent";
    import roleComponent from "./uar/RoleComponent";

    // 用户管理
    export default {
        name: "UserComponent",
        components: {
            userComponent,
            authorityComponent,
            roleComponent,
        },
        data() {
            return {
                activeName: 'first',
            }
        }
    }
</script>

<style lang="less">
    .user_tabs .el-tabs__nav-wrap::after{
        height: 0;
    }
    .user_tabs div div div div .el-tabs__active-bar {
        height: 3px!important;
        border-radius: 12px;
    }
    .user_tabs div div div div .el-tabs__item {
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        color: #000!important;
    }
</style>
