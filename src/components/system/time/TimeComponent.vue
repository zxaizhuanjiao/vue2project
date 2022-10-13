<template>
    <div style="padding: 20px">
        <div>
            <span style="margin-right: 20px">地址</span>
            <el-input v-model="ip" style="width: 200px; margin-right: 20px"></el-input>
            <el-radio v-model="radio" label="1">默认</el-radio>
            <el-radio v-model="radio" label="2">自定义</el-radio>

            <el-select v-model="value" style="margin-right: 20px" placeholder="请选择" v-if="radio === '1'">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-date-picker
                    style="margin-right: 20px"
                    v-else
                    v-model="timeValue"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>

            <el-button type="primary" @click="submit()">提交</el-button>
        </div>
    </div>
</template>

<script>
    import api from '../../../utils/api'

    export default {
        name: "TimeComponent",
        data() {
            return {
                ip: '',
                radio: '1',
                options: [{
                    value: '1',
                    label: '一天'
                }, {
                    value: '2',
                    label: '一周'
                }, {
                    value: '3',
                    label: '一月'
                }, {
                    value: '4',
                    label: '一年'
                }],
                value: '',
                timeValue: '',
            }
        },
        created() {
          this.findData();
        },
        methods: {
            findData() {
                this.$axios.get(api.FIND_IP.url + '?username=' + this.username).then(res => {
                    if (res.data.code === '000000') {
                        this.ip = res.data.data.ip;
                    } else {
                        this.$message.error(res.data.mesg);
                    }
                });
            },
            submit() {
                // 时间同步
                this.$axios.put(api.SYNCHRONIZATION.url).then(res => {
                    if (res.data.code === '000000') {
                        this.findButtonList();
                        this.$message.success(res.data.mesg);
                    } else {
                        this.$message.error(res.data.mesg);
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
