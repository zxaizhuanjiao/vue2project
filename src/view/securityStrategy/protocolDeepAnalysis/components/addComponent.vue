<template>
    <div>
        <el-form class="formDrawer" ref="rulerGroupForm" :model="form" :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="源IP">
                <el-select v-model="form.sourceIpSelectValue" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in addressList"
                        :key="item.idType"
                        :label="item.name"
                        :value="item.idType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目的IP">
                <el-select v-model="form.destinationSelectValue" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in addressList"
                        :key="item.idType"
                        :label="item.name"
                        :value="item.idType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="应用">
                <el-select v-model="form.appSelectValue" @change="appSelectChange" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in appList"
                        :key="item.idType"
                        :label="item.name"
                        :value="item.idType">
                    </el-option>
                </el-select>
            </el-form-item>
            <div v-if="choosedApp.type == 1">
                <div v-for="item, index in form.content" :key="item.id">
                    <el-form-item :label="item.text" v-if="item.type == 'numberInput'" :prop="`content.${index}.fieldValue`" :rules="[{required: true, message: `${item.text}必填`}]">
                        <el-input-number v-model="item.fieldValue" controls-position="right" :min="0" :controls="false" style="width: 100%;"></el-input-number>
                    </el-form-item>
                    <el-form-item :label="item.text" v-if="item.type == 'input'" :prop="`content.${index}.fieldValue`" :rules="[{required: true, message: `${item.text}必填`}]">
                        <el-input v-model="item.fieldValue" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item :label="item.text" v-if="item.type == 'select'" :prop="`content.${index}.fieldValue`" :rules="[{required: true, message: `${item.text}必填`}]">
                        <el-select v-model="item.fieldValue" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="sitem in item.values"
                                :key="sitem.value"
                                :label="sitem.label"
                                :value="sitem.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="动作">
                <el-select v-model="form.action" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in actionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" style="padding-bottom: 50px;">
                <el-select v-model="form.status" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="form-drawer__footer bgfff" style="width: 452px;">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="enterDialog">
                确 定
            </el-button>
        </div>
    </div>
</template>
<script>
    import { 
        getAddressAllList, 
        getAppAllList
    } from '../../../../api/resourceObject'
    import {
        addDeepPacketInspection,
        getDeepPacketInspectionDetail,
        updateDeepPacketInspection
    } from '../../../../api/securityStrategy'

    export default {
        name: 'ProtocolDeepAnalysisAdd',
        props: {
		    isEdit: {
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
                addressList: [],
                appList: [],
                choosedApp: {},
                form: {
                    name: '',
                    sourceIpSelectValue: '',
                    destinationSelectValue: '',
                    appSelectValue: '',
                    content: '',
                    action: 0,
                    status: 0
                },
                rules: {
                    name: [
				        { required: true, message: '名称必填' }
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
                statusOptions: [
                    {
                        value: 0,
                        label: '禁用'
                    },
                    {
                        value: 1,
                        label: '启用'
                    }
                ],
                loading: false
            }
        },
        created() {
            // 获取所有地址、地址组
            this.getAddressAllListFunc()
            // 获取应用
            this.getAppAllListFunc()
            // 是否是编辑
            if (this.isEdit) {
                this.getDetailFunc(this.choosedRow.id)
            }
        },  
        mounted() {
            
        },
        methods: {
            async getAddressAllListFunc() {
                let res = await getAddressAllList()
                if (res.code === 0) {
                    this.addressList = res.data.list
                }
            },

            async getAppAllListFunc() {
                let res = await getAppAllList()
                if (res.code === 0) {
                    if (res.data && res.data.length > 0) {
                        res.data.forEach((v, i) => {
                            if (v.content) {
                                v.content = JSON.parse(v.content)
                                v.content.forEach((sv, si) => {
                                    sv.rule = {
                                        required: sv.require,
                                        message: '必填'
                                    }
                                })
                            }
                        })
                    }
                    this.appList = res.data
                }
            },

            appSelectChange() {
                let tmpChoosedApp = this.appList.filter(item => item.idType == this.form.appSelectValue)
                this.choosedApp = tmpChoosedApp[0]
                this.form.content = this.choosedApp.content
            },

            async getDetailFunc(id) {
                let res = await getDeepPacketInspectionDetail(id)
                if (res.code === 0) {
                    if (res.data.content) {
                        res.data.content = JSON.parse(res.data.content)    
                    }
                    if (res.data.appSelectValue) {
                        let tmpChoosedApp = this.appList.filter(item => item.idType == res.data.appSelectValue)
                        this.choosedApp = tmpChoosedApp[0]
                    }
                    this.form = res.data
                }
            },
            
            initForm() {
                this.form = {
                    name: '',
                    sourceIpSelectValue: '',
                    destinationSelectValue: '',
                    appSelectValue: '',
                    content: '',
                    action: 0,
                    status: 0
                }
            },

            enterDialog() {
                this.$refs.rulerGroupForm.validate(async valid => {
                    if (valid) {
                        if (this.form.content) {
                            this.form.content = JSON.stringify(this.form.content)   
                        }
                        this.loading = true
                        if (this.isEdit) {
                            let res = await updateDeepPacketInspection(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.$emit('closeAddEmit');
                            } else {
                                this.loading = false
                            }
                        } else {
                            let res = await addDeepPacketInspection(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.$emit('closeAddEmit');
                            } else {
                                this.loading = false
                            }
                        }
                    }
                })
            },

            closeDialog() {
                this.$refs.rulerGroupForm.resetFields()
                this.addDrawer = false
                this.addDrawerFlag = false
                this.initForm()
            },
        }
    }
</script>