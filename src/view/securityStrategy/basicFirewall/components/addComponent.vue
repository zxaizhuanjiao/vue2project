<template>
    <div>
        <el-form class="formDrawer" ref="rulerGroupForm" :model="form" :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="源区域">
                <el-select v-model="form.sourceZoneId" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in safeZoneList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目的区域">
                <el-select v-model="form.destinationZoneId" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in safeZoneList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="源IP">
                <el-select v-model="form.sourceIpTypeStr" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in addressList"
                        :key="item.idType"
                        :label="item.name"
                        :value="item.idType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目的IP">
                <el-select v-model="form.destinationIpTypeStr" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in addressList"
                        :key="item.idType"
                        :label="item.name"
                        :value="item.idType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="源MAC" prop="sourceMac">
                <el-input v-model="form.sourceMac" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="目的MAC" prop="destinationMac">
                <el-input v-model="form.destinationMac" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="协议">
                <el-select v-model="form.protocolDictionaryId" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in protocolList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="源端口">
                <el-input-number v-model="form.sourcePort" :controls="false" placeholder="请输入" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="目的端口">
                <el-input-number v-model="form.destinationPort" :controls="false" placeholder="请输入" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="时间">
                <el-select v-model="form.timeIdTypeStr" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in timeList"
                        :key="item.idType"
                        :label="item.name"
                        :value="item.idType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="动作">
                <el-select v-model="form.action" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in actionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                策略生效&nbsp;&nbsp;<el-switch v-model="form.status"></el-switch>
            </el-form-item>
            <el-form-item style="padding-bottom: 50px;">
                记录策略命中日志&nbsp;&nbsp;<el-switch v-model="form.logStatus"></el-switch>
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
        getSafeZoneAllList, 
        getAddressAllList, 
        getProtocolDictionaryList, 
        getTimeAllList
    } from '../../../../api/resourceObject'
    import {
        addPolicyManager,
        getPolicyManagerDetail,
        updatePolicyManager
    } from '../../../../api/securityStrategy'

    export default {
        name: 'BasicWallAdd',
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
                form: {
                    name: '',
                    sourceZoneId: undefined,
                    destinationZoneId: undefined,
                    sourceIpTypeStr: '',
                    destinationIpTypeStr: '',
                    sourceMac: '',
                    destinationMac: '',
                    protocolDictionaryId: undefined,
                    sourcePort: undefined,
                    destinationPort: undefined,
                    timeIdTypeStr: '',
                    action: 0,
                    status: true,
                    logStatus: true
                },
                rules: {
                    name: [
				        { required: true, message: '名称必填' }
				    ],
                    sourceMac: [
                        {
                            pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
                            message: '请输入正确的MAC地址'
                        }
                    ],
                    destinationMac: [
                        {
                            pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
                            message: '请输入正确的MAC地址'
                        }
                    ]
                },
                loading: false,  
                safeZoneList: [],
                addressList: [],
                protocolList: [],
                timeList: [],   
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
                ]
            }
        },
        created() {
            // 获取全部安全域
            this.getSafeZoneAllListFunc()
            // 获取所有地址、地址组
            this.getAddressAllListFunc()
            // 获取所有协议
            this.getProtocolDictionaryListFunc()
            // 获取所有时间、时间组
            this.getTimeAllListFunc()
            // 是否是编辑
            if (this.isEdit) {
                this.getPolicyManagerDetailFunc(this.choosedRow.id)
            }
        },  
        mounted() {
            
        },
        methods: {
            async getSafeZoneAllListFunc() {
                let res = await getSafeZoneAllList()
                if (res.code === 0) {
                    this.safeZoneList = res.data.list
                }
            },

            async getAddressAllListFunc() {
                let res = await getAddressAllList()
                if (res.code === 0) {
                    this.addressList = res.data.list
                }
            },

            async getProtocolDictionaryListFunc() {
                let res = await getProtocolDictionaryList()
                if (res.code === 0) {
                    this.protocolList = res.data
                }
            },

            async getTimeAllListFunc() {
                let res = await getTimeAllList()
                if (res.code === 0) {
                    this.timeList = res.data
                }
            },

            async getPolicyManagerDetailFunc(id) {
                let res = await getPolicyManagerDetail(id)
                if (res.code === 0) {
                    let tmpRepolicyManager = res.data.repolicyManager
                    if (!tmpRepolicyManager.sourceZoneId) {
                        tmpRepolicyManager.sourceZoneId = undefined
                    }
                    if (!tmpRepolicyManager.destinationZoneId) {
                        tmpRepolicyManager.destinationZoneId = undefined
                    }
                    if (tmpRepolicyManager.status) {
                        tmpRepolicyManager.status = true
                    } else {
                        tmpRepolicyManager.status = false
                    }
                    if (tmpRepolicyManager.logStatus) {
                        tmpRepolicyManager.logStatus = true
                    } else {
                        tmpRepolicyManager.logStatus = false
                    }
                    if (!tmpRepolicyManager.protocolDictionaryId) {
                        tmpRepolicyManager.protocolDictionaryId = undefined
                    }
                    if (!tmpRepolicyManager.sourcePort) {
                        tmpRepolicyManager.sourcePort = undefined
                    }
                    if (!tmpRepolicyManager.destinationPort) {
                        tmpRepolicyManager.destinationPort = undefined
                    }
                    this.form = tmpRepolicyManager
                }
            },

            enterDialog() {
                this.$refs.rulerGroupForm.validate(async valid => {
                    if (valid) {
                        if (this.form.status) {
                            this.form.status = 1
                        } else {
                            this.form.status = 0
                        }
                        if (this.form.logStatus) {
                            this.form.logStatus = 1
                        } else {
                            this.form.logStatus = 0
                        }
                        if (this.isEdit) {
                            let res = await updatePolicyManager(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.$emit('closeAddEmit');
                            }
                        } else {
                            let res = await addPolicyManager(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.$emit('closeAddEmit');
                            }
                        }
                    }
                })
            },

            initForm() {
                this.form = {
                    name: '',
                    sourceZoneId: undefined,
                    destinationZoneId: undefined,
                    sourceIpTypeStr: '',
                    destinationIpTypeStr: '',
                    sourceMac: '',
                    destinationMac: '',
                    protocolDictionaryId: undefined,
                    sourcePort: undefined,
                    destinationPort: undefined,
                    timeIdTypeStr: '',
                    action: 0,
                    status: true,
                    logStatus: true
                }
            },

            closeDialog() {
                this.$refs.rulerGroupForm.resetFields()
                this.initForm()
                this.$emit('closeAddEmit');
            }
        }
    }
</script>