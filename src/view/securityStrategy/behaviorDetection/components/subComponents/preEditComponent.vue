<template>
    <div>
        <div>
            <el-form class="formDrawer" ref="rulerGroupForm" :model="form">
                <el-form-item label="规则等级" v-if="!editBatchFlag">
                    <el-select v-model="form.level" placeholder="请选择" style="width: 100%;">
                        <el-option
                            v-for="item in ruleLevelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="动作">
                    <el-select v-model="form.action" placeholder="请选择" style="width: 100%;">
                        <el-option
                            v-for="item in actionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="form-drawer__footer" style="width: 452px;">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="enterDialog" :loading="loading">
                确 定
            </el-button>
        </div>
    </div>
</template>
<script>
    import {
        updateBehaviorPredefined,
        updateBehaviorPredefinedAction
    } from '../../../../../api/securityStrategy'

    export default {
        name: 'BehaviorDetectionPreEdit',
        props: {
		    editBatchFlag: {
				default: function() {
					return Boolean
				}
		    },
            choosedList: {
                default: function() {
					return []
				}
            },
            allCheck: {
                default: function() {
					return Boolean
				}
            },
            choosedRow: {
                default: function() {
					return {}
				}
            }
        },
        data() {
            return {
                form: {
                    level: undefined,
                    action: undefined
                },
                ruleLevelOptions: [
                    {
                        value: 1,
                        label: '低'
                    },
                    {
                        value: 2,
                        label: '中'
                    },
                    {
                        value: 3,
                        label: '高'
                    }
                ],
                actionOptions: [
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
            this.form = this.choosedRow
        },  
        mounted() {
            
        },
        methods: {
            initForm() {
                this.form = {
                    level: undefined,
                    action: undefined
                }
                this.action = undefined
            },

            closeDialog() {
                this.$refs.rulerGroupForm.resetFields()
                this.initForm()
                this.$emit('closeEmit');
            },

            async enterDialog() {
                this.loading = true
                if (this.editBatchFlag) {
                    let tmpIds = []
                    if (this.allCheck) {
                        tmpIds.push(-1)
                    } else {
                        tmpIds = this.choosedList
                    }
                    let tmpdata = {
                        "action": this.form.action,
                        "ids": tmpIds
                    }
                    let res = await updateBehaviorPredefinedAction(tmpdata)
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.$emit('closeAddEmit');
                    }
                } else {
                    let res = await updateBehaviorPredefined(this.form)
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.$emit('closeAddEmit');
                    }
                }
            }
        }
    }
</script>