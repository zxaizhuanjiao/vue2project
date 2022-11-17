<template>
    <div>
        <div class="group-detail-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="预定义" name="first">
                    <Predefine :activeName="activeName" />
                </el-tab-pane>
                <el-tab-pane label="自定义" name="second">
                    <Customize :activeName="activeName" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import Predefine from './components/predefine.vue'
    import Customize from './components/customize.vue'

    export default {
        name: 'BehaviorDetection',
        components: {
            Predefine,
            Customize
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