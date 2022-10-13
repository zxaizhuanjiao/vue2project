<template>
    <div style="padding: 20px">
        <span style="margin-right: 20px">是否启用</span>
        <el-select v-model="value" placeholder="请选择" style="margin-bottom: 20px">
            <el-option key="0" label="禁用" value="0"></el-option>
            <el-option key="1" label="启用白名单" value="1"></el-option>
            <el-option key="2" label="启用黑名单" value="2"></el-option>
        </el-select>

        <el-input v-if="value === '1'" v-model="whiteList" type="textarea" :rows="5" placeholder="IP访问白名单（白名单之外的IP不允许访问系统）如：192.168.1.2或192.168.1.1/24或192.168.1.2-192.168.1.10"></el-input>
        <el-input v-if="value === '2'" v-model="blackList" type="textarea" :rows="5" placeholder="IP访问黑名单（黑名单的IP不允许访问系统）如：192.168.1.2或192.168.1.1/24或192.168.1.2-192.168.1.10"></el-input>
    </div>
</template>

<script>
    export default {
        name: "ControlComponent",
        data() {
            return {
                value: '0',
                whiteList: '',
                blackList: '',
            }
        }
    }
</script>

<style scoped>

</style>
