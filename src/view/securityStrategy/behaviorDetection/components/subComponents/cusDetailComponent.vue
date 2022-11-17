<template>
	<div style="padding: 24px;">
        <div class="detailStyle">
            <div class="detailTitle">基础信息</div>
            <el-row class="detailrow">
                <el-col :span="12">
                    协议名称：{{ behaviorCustomDetail.appName }}
                </el-col>
                <el-col :span="12">
                    规则类型：
                    <span v-if="behaviorCustomDetail.type == 1">环境异常</span>
                    <span v-if="behaviorCustomDetail.type == 2">流量异常</span>
                    <span v-if="behaviorCustomDetail.type == 3">业务异常</span>
                    <span v-if="behaviorCustomDetail.type == 4">已知威胁</span>
                    <span v-if="behaviorCustomDetail.type == 5">敏感操作</span>
                </el-col>
                <el-col :span="12">
                    动作：
                    <span v-if="behaviorCustomDetail.action == 0">允许</span>
                    <span v-if="behaviorCustomDetail.action == 1">告警</span>
                    <span v-if="behaviorCustomDetail.action == 2">阻断</span>
                </el-col>
                <el-col :span="12">
                    规则等级：
                    <span v-if="behaviorCustomDetail.level == 1">低</span>
                    <span v-if="behaviorCustomDetail.level == 2">中</span>
                    <span v-if="behaviorCustomDetail.level == 3">高</span>
                </el-col>
                <el-col :span="12">
                    规则状态：
                    <span v-if="behaviorCustomDetail.status == 0">禁用</span>
                    <span v-if="behaviorCustomDetail.status == 1">启用</span>
                </el-col>
                <el-col :span="12">
                    规则描述：{{ behaviorCustomDetail.description }}
                </el-col>
            </el-row>
        </div> 
        <div style="margin-top: 24px;margin-bottom: 24px;"></div>
        <div class="detailStyle">
            <div class="detailTitle">协议结构</div>
            <el-row class="detailrow">
                <div style="padding-top: 10px;padding-bottom: 6px;">规则内容</div>
                <el-input
                    type="textarea"
                    :rows="2"
                    disabled
                    v-model="behaviorCustomDetail.expression">
                </el-input>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        getBehaviorCustomDetail
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
                behaviorCustomDetail: {}
            }
        },
        created() {
            this.getBehaviorCustomDetailFunc()
        },
        methods: {
            async getBehaviorCustomDetailFunc () {
                let res = await getBehaviorCustomDetail(this.row.id)
                if (res.code === 0) {
                    this.behaviorCustomDetail = res.data
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