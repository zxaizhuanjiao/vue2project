<template>
    <div>
        <div class="group-detail-title">
            <i class="el-icon-arrow-left" @click="goBack"></i>
            <span>白名单策略组</span>
            <span>/详情</span>
        </div>
        <div class="group-detail-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="MODBUS" name="first">
                    <Modbus :allowListId="allowListId" :activeName="activeName" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import Modbus from './subComponents/modbus.vue'

    export default {
        name: 'Detail',
        components: {
            Modbus
        },
        data() {
            return {
                activeName: 'first',
                allowListId: '',
            }
        },
        created() {
            console.log(this.$route.query.id)
            this.allowListId = this.$route.query.id;
        },  
        mounted() {
            
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },

            handleClick(tab, event) {
                // console.log(tab, event);
            }
        }
    }
</script>
<style>
    .group-detail-title {
        padding: 14px 30px 8px 30px;
        background: #fff;
    }

    .group-detail-title i {
        color: #333333;
        padding-right: 8px;
        cursor: pointer
    }

    .group-detail-title span:nth-child(1) {
        color: #A9ABB2;
        font-size: 14px;
    }

    .group-detail-title span:nth-child(2) {
        color: #303133;
        font-size: 14px;
    }
</style>