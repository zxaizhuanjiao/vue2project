<template>
    <div style="padding: 24px;">
        <div class="detailStyle">
            <div class="firewall-title-line">基本信息</div>
            <el-row class="detailrow" style="color: #909399;font-size: 14px;">
                <el-col :span="12">
                    应用名称：
                    <span style="color: #303133;">{{ row.name }}</span>
                </el-col>
                <el-col :span="12">
                    协议描述：
                    <span style="color: #303133;">{{ row.description }}</span>
                </el-col>
                <el-col :span="12">
                    协议状态：
                    <span style="color: #303133;">
                        <span v-if="row.status == 0">禁用</span>
                        <span v-else>启用</span>
                    </span>
                </el-col>
                <el-col :span="12">
                    传输层协议：
                    <span style="color: #303133;">{{ row.transportProtocol }}</span>
                </el-col>
                <el-col :span="12">
                    检测模式：
                    <span style="color: #303133;">
                        <span v-if="row.checkModel == 1">端口</span>
                        <span v-else>特征值</span>
                    </span>
                </el-col>
                <el-col :span="12" v-if="row.checkModel == 1">
                    端口号：<span style="color: #303133;">{{ row.port }}</span>
                </el-col>
                <div v-if="row.checkModel == 2">
                    <el-col :span="12">
                        起始地址：<span style="color: #303133;">{{ row.startAddress }}</span>
                    </el-col>
                    <el-col :span="12">
                        特征值：<span style="color: #303133;">{{ row.appEigenValue }}</span>
                    </el-col>
                </div>
            </el-row>
        </div>
        <div style="margin-top: 24px;margin-bottom: 24px;"></div>
        <div class="detailStyle">
            <div class="firewall-title-line">协议结构</div>
            <div>
                <el-row style="color: #909399;font-size: 14px;padding: 20px 10px 0 10px;">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="10">起始地址</el-col>
                    <el-col :span="8">长度（单位：字节）</el-col>
                </el-row>
                <div v-for="item, index in row.appCustomFields" :key="index">
                    <el-row style="padding: 10px 10px 0 10px;line-height: 32px;">
                        <el-col :span="6">
                            <el-input v-model="item.name" placeholder="请输入" style="width: 80%;" disabled></el-input>
                        </el-col>
                        <el-col :span="10">
                            <el-input-number v-model="item.startAddress" :min="0" :max="100" :controls="false" disabled placeholder="请输入" style="width: 90%;"></el-input-number>
                        </el-col>
                        <el-col :span="8">
                            <el-input-number v-model="item.length" :min="1" :max="8" :controls="false" disabled placeholder="请输入" style="width: 100%;"></el-input-number>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ApplicationDetail',
        props: {
			row: {
				default: function() {
					return {}
				},
				type: Object
		    }
		},
        data() {
            return {
                protocolStructArray: [
                    {
                        name: '111',
                        size: 1,
                        offset: 1
                    }
                ]
            }
        },
        created() {
            console.log(this.row)
        },  
        mounted() {
            
        },
        methods: {
            
        }
    }
</script>