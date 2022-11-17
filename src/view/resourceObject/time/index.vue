<template>
    <div>
        <div class="group-detail-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="时间" name="first">
                    <TimePart :activeName="activeName" />
                </el-tab-pane>
                <el-tab-pane label="时间组" name="second">
                    <TimeGroupPart :activeName="activeName" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import TimePart from './components/timePart.vue'
    import TimeGroupPart from './components/timeGroupPart.vue'

    export default {
        name: 'Time',
        components: {
            TimePart,
            TimeGroupPart
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