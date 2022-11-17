<template>
	<div style="padding: 24px;">
        <div class="detailStyle">
            <div class="detailTitle">漏洞信息</div>
            <el-row class="detailrow">
                <el-col :span="12">
                    漏洞名称：{{ threatRuleDetail.name }}
                </el-col>
                <el-col :span="12">
                    漏洞来源：{{ threatRuleDetail.vulnerabilitySource || '--' }}
                </el-col>
                <el-col :span="12">
                    漏洞统一编号：{{ threatRuleDetail.cve || '--' }}
                </el-col>
                <el-col :span="12">
                    发生时间：{{ threatRuleDetail.publishDate || '--' }}
                </el-col>
                <el-col :span="12">
                    漏洞类型：{{ threatRuleDetail.type || '--' }}
                </el-col>
                <el-col :span="12">
                    危害级别：
                    <span v-if="threatRuleDetail.severity == 0">低</span>
                    <span v-if="threatRuleDetail.severity == 1">中</span>
                    <span v-if="threatRuleDetail.severity == 2">高</span>
                </el-col>
            </el-row>
        </div> 
        <div style="height: 1px;background: #E9EBF0;box-shadow: -8px 0px 12px 0px rgba(157, 166, 194, 0.29);margin-top: 24px;"></div>
        <div class="detailStyle">
            <el-row class="detailrow">
                <el-col :span="24">
                    触发设备：{{ threatRuleDetail.triggerDevice || '--' }}
                </el-col>
                <el-col :span="24">
                    规则来源：{{ threatRuleDetail.ruleSource || '--' }}
                </el-col>
                <el-col :span="24">
                    事件处理：{{ threatRuleDetail.eventHandle || '--' }}
                </el-col>
                <el-col :span="24">
                    受影响厂商：{{ threatRuleDetail.affectedFirm || '--' }}
                </el-col>
                <el-col :span="24">
                    攻击条件：{{ threatRuleDetail.attackRequirement || '--' }}
                </el-col>
                <el-col :span="24">
                    规则描述：{{ threatRuleDetail.description || '--' }}
                </el-col>
            </el-row>
        </div>
        <div style="height: 1px;background: #E9EBF0;box-shadow: -8px 0px 12px 0px rgba(157, 166, 194, 0.29);margin-top: 24px;margin-bottom: 24px;"></div>
        <div class="detailStyle">
            <div class="detailTitle">修补特征</div>
            <el-row class="detailrow">
                <el-col :span="12">
                    特征名称：{{ threatRuleDetail.signName || '--' }}
                </el-col>
                <el-col :span="12">
                    风险等级：
                    <span v-if="threatRuleDetail.riskLevel == 0">低</span>
                    <span v-if="threatRuleDetail.riskLevel == 1">中</span>
                    <span v-if="threatRuleDetail.riskLevel == 2">高</span>
                </el-col>
                <el-col :span="12">
                    优先级：{{ threatRuleDetail.priority || '--' }}
                </el-col>
                <el-col :span="12">
                    特征编号：{{ threatRuleDetail.sid || '--' }}
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        getBlackListVulnerabilityDetail
    } from '../../../../../api/securityStrategy'

    export default {
        name: 'Detail',
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
                threatRuleDetail: {}
            }
        },
        created() {
            this.getBlackDetail()
        },
        methods: {
            async getBlackDetail () {
                let res = await getBlackListVulnerabilityDetail(this.row.id)
                if (res.code === 0) {
                    this.threatRuleDetail = res.data
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