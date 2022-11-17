<template>
	<div style="padding: 24px;">
        <div class="detailStyle">
            <div class="detailTitle">基础信息</div>
            <el-row class="detailrow">
                <el-col :span="12">
                    名称：{{ detailData.name }}
                </el-col>
                <el-col :span="12">
                    源IP：{{ detailData.sourceIp }}
                </el-col>
                <el-col :span="12">
                    目的IP：{{ detailData.destinationIp }}
                </el-col>
                <el-col :span="12">
                    应用：{{ detailData.appName }}
                </el-col>
                <el-col v-for="item in detailData.content" :key="item.field" :span="12">
                    {{ item.text }}：{{ item.fieldValue }}
                </el-col>
                <el-col :span="12">
                    动作：
                    <span v-if="detailData.action == 0">允许</span>
                    <span v-if="detailData.action == 1">告警</span>
                    <span v-if="detailData.action == 2">允许</span>
                </el-col>
                <el-col :span="12">
                    状态：
                    <span v-if="detailData.action == 0">禁用</span>
                    <span v-if="detailData.action == 1">启用</span>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        getDeepPacketInspectionDetail
    } from '../../../../api/securityStrategy'

    export default {
        name: 'ProtocolDeepAnalysisDetail',
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
                detailData: {}
            }
        },
        created() {
            this.getDeepPacketInspectionDetailFunc()
        },
        methods: {
            async getDeepPacketInspectionDetailFunc () {
                let res = await getDeepPacketInspectionDetail(this.row.id)
                if (res.code === 0) {
                    if (res.data.content) {
                        res.data.content = JSON.parse(res.data.content)
                    }
                    this.detailData = res.data
                    console.log(this.detailData)
                }
            }
        },
    }
</script>
<style>
    .detailStyle {
        font-size: 14px;
        color: #606266;
    }

    .detailrow {
		margin-top: 4px;
	}
	
	.detailrow .el-col {
		padding-top: 14px;
	}

    .detailTitle {
        text-align: left;
        font-weight: 500;
        font-size: 16px;
        display: flex;
        align-items: center;
    }

    .detailTitle:before{
        content: ' ';
        border-left: 3px solid orangered;
        display: inline-block;
        height: 16px;
        margin-right: 6px;
    }
</style>