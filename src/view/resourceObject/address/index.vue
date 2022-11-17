<template>
    <div>
        <div class="group-detail-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="地址" name="first">
                    <AddressPart :activeName="activeName" />
                </el-tab-pane>
                <el-tab-pane label="地址组" name="second">
                    <AddressGroupPart :activeName="activeName" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import AddressPart from './components/addressPart.vue'
    import AddressGroupPart from './components/addressGroupPart.vue'

    export default {
        name: 'Address',
        components: {
            AddressPart,
            AddressGroupPart
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