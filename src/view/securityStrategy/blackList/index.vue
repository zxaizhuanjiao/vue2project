<template>
    <div>
        <div class="group-detail-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="漏洞库" name="first">
                    <Cnnvd :activeName="activeName" />
                </el-tab-pane>
                <el-tab-pane label="地址黑名单" name="second">
                    <AddressBlackList :activeName="activeName" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import Cnnvd from './components/cnnvd.vue'
    import AddressBlackList from './components/addressBlackList.vue'

    export default {
        name: 'BlackList',
        components: {
            Cnnvd,
            AddressBlackList
        },
        data() {
            return {
                activeName: 'first'
            }
        },
        created() {
            
        },  
        mounted() {
            
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
            }
        }
    }
</script>