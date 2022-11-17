<template>
    <div>
        <el-form class="formDrawer" ref="rulerGroupForm" :model="editBatchForm" :rules="editBatchRules">
            <el-form-item label="动作" prop="action">
                <el-select v-model="editBatchForm.action" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in actionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="form-drawer__footer bgfff" style="width: 452px;">
            <el-button @click="editBatchCloseDialog">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="enterEditBatchDialog">
                确 定
            </el-button>
        </div>
    </div>
</template>
<script>
    import {
        modifyDeepPacketInspectionAction
    } from '../../../../api/securityStrategy'

    export default {
        name: 'ProtocolDeepAnalysisActionModify',
        props: {
		    choosedList: {
				default: function() {
					return []
				}
		    },
            allCheck: {
                default: function() {
                    return Boolean
                }
            }
        },
        data() {
            return {
                editBatchForm: {
                    action: undefined
                },
                editBatchRules: {
                    action: [
				        { required: true, message: '动作必填' }
				    ]
                },
                actionOptions: [
                    {
                        value: 0,
                        label: '允许'
                    },
                    {
                        value: 1,
                        label: '告警'
                    },
                    {
                        value: 2,
                        label: '阻断'
                    }
                ],
                loading: false
            }
        },
        created() {
            console.log(this.allCheck)
        },  
        mounted() {
            
        },
        methods: {
            editBatchCloseDialog() {
                this.editBatchDrawer = false
                this.editBatchDrawerFlag = false
            },

            enterEditBatchDialog() {
                this.$refs.rulerGroupForm.validate(async valid => {
                    if (valid) {
                        let tmpIds = []
                        if (this.allCheck) {
                            tmpIds.push(-1)
                        } else {
                            tmpIds = this.choosedList
                        }
                        let tmpdata = {
                            "action": this.editBatchForm.action,
                            "ids": tmpIds
                        }
                        this.loading = true
                        let res = await modifyDeepPacketInspectionAction(tmpdata)
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.msg
                            })
                            this.$emit('closeBatchModifyActionEmit');
                        } else {
                            this.loading = false
                        }
                    }
                })
            }
        }
    }
</script>