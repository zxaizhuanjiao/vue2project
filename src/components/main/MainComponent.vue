<template>
    <div>
        <div style="height: 80px; width: 100%; background-color: white">
            <el-select v-model="value1" placeholder="请选择" style="margin-top: 24px; margin-left: 20px">
                <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    import api from '../../utils/api'

    export default {
        name: "MainComponent",
        data() {
            return {
                options1: [{
                    value: '1',
                    label: '10.186.1.1 （安全区）'
                }],
                value1: ''
            }
        },
        created() {

        },
        methods: {

        }
    }
</script>

<style lang="less">

</style>
