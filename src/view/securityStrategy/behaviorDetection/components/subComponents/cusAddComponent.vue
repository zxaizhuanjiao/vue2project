<template>
    <div>
        <div>
            <div>
                <div class="firewall-title-line" style="padding: 24px 0 0 24px;">基础信息</div>
                <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                    <el-form-item label="协议名称" prop="appId">
                        <el-select v-model="form.appId" @change="chooseProtocolRuleChange" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in appOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则类型">
                        <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in ruleTypeOptions"
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
                    <el-form-item label="规则等级">
                        <el-select v-model="form.level" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in ruleLevelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则状态">
                        <el-select v-model="form.status" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in statusOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则描述" prop="description">
                        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <div class="firewall-title-line" style="padding: 0 0 0 24px;">协议结构</div>
                <div class="customizeWrapperBody"> 
                    <div class="customizeWrapperBodyPart2">
                        <div>
                            <div v-for="item, index in treeData" :key="index" :class="item.id == 1 ? 'bgStyle':'bgStyle2'">
                                <el-select v-model="item.optionsValue" v-if="item.id != 1" placeholder="条件" style="width: 80px;margin-right: 8px;">
                                    <el-option
                                        v-for="item in optionsCondition"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select ref="protocolSelectRef" @change="leaveInputChange('protocolRule', item)" v-model="item.ruleProtocol" placeholder="请选择字段" style="margin-right: 8px;">
                                    <el-option
                                        v-for="item in protocolRuleOptions"
                                        :key="item.value"
                                        :label="`${item.label}`"
                                        :value="item.value"
                                    />
                                </el-select>
                                <el-select ref="protocolSelectRef" @change="leaveInputChange('matchSymbol', item)" v-model="item.matchSymbol" placeholder="匹配符" style="width: 100px;margin-right: 8px;">
                                    <el-option
                                        v-for="item in matchSymbolOptions"
                                        :key="item.value"
                                        :label="`${item.label}`"
                                        :value="item.value"
                                    />
                                </el-select>
                                <el-input v-model.trim="item.matchValue" @change="leaveInputChange('matchValue', item)" placeholder="请输入匹配值" style="width: 200px;"></el-input>
                                <i class="el-icon-minus" style="color: #606266;padding: 0 12px;cursor: pointer;" v-if="item.id != 1" @click="deleteCondition(item, index)"></i>
                                <i class="el-icon-plus" style="color: #606266;padding: 0 12px;cursor: pointer;" v-if="item.id == 1" @click="addCondition"></i>
                                <span v-if="(index==treeData.length-1) && (showSureBtn)" @click="sureDetectRuleBtn" style="font-size: 14px;cursor: pointer;">
                                    确定
                                </span>
                            </div>
                            <div style="padding-top: 20px;">
                                <div style="padding-bottom: 30px;">
                                    <div style="float: left;font-weight: 400;font-size: 15px;color: #606266;">
                                        规则内容
                                    </div>
                                    <div style="float: right;font-weight: 400;font-size: 15px;color: #606266;cursor: pointer;" @click="clearCondition">
                                        <img src="../../../../../assets/clearStruct.png" style="width: 24px;vertical-align: middle;" />
                                        <span style="vertical-align: middle;">清空内容</span>
                                    </div>
                                </div>		
                                <div>
                                    <el-input type="textarea" v-model="dectionRuleValue" :rows="4" :disabled="true"></el-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-drawer__footer bgfff" style="width: 752px;">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="enterDialog">
                确 定
            </el-button>
        </div>
    </div>
</template>
<script>
    import {
        addBehaviorCustom,
        updateBehaviorCustom,
        getBehaviorCustomDetail
    } from '../../../../../api/securityStrategy'
    import {
        getCustomAppDetail
    } from '../../../../../api/resourceObject'

    export default {
        name: 'BehaviorDetectionCusAdd',
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
            },
            appOptions: {
                default: function() {
					return []
				}
            }
        },
        data() {
            return {
                form: {
                    appId: undefined,
                    type: 1,
                    action: 1,
                    level: 1,
                    status: 0,
                    description: '',
                    expression: ''
                },
                rules: {
                    appId: [
				        { required: true, message: '协议名称必填' }
				    ],
                    description: [
                        { required: true, message: '描述必填' }
                    ]
                },
                loading: false,  
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
                ruleTypeOptions: [
					{
						value: 1,
						label: '环境异常'
					},
					{
						value: 2,
						label: '流量异常'
					},
					{
						value: 3,
						label: '业务异常'
					},
                    {
                        value: 4,
                        label: '已知威胁'
                    },
					{
                        value: 5,
                        label: '敏感操作'
                    }
				],
                statusOption: [
                    {
                        value: 0,
                        label: '禁用'
                    },
                    {
                        value: 1,
                        label: '启用'
                    }
                ],
                treeData: [
                    {
						id: 1,
						ruleProtocol: undefined,
						matchSymbol: '',
						matchValue: ''
					}
                ],
                optionsCondition: [
                    {
						value: '与',
						label: '与'
					},
					{
						value: '或',
						label: '或'
					}
                ],
                protocolRuleOptions: [],
                matchSymbolOptions: [
					{
						value: '=',
						label: '='
					},
					{
						value: '>',
						label: '>'
					},
					{
						value: "<",
						label: '<'
					},
					{
						value: ">=",
						label: '>='
					},
					{
						value: "<=",
						label: '<='
					}
				],
				showSureBtn: false,
                dectionRuleValue: '',
            }
        },
        created() {
            // 是否是编辑
            if (this.isEdit) {
                this.getBehaviorCustomDetailFunc(this.choosedRow.id)
            }
        },  
        mounted() {
            
        },
        methods: {
            async getBehaviorCustomDetailFunc(id) {
                let res = await getBehaviorCustomDetail(id)
                if (res.code === 0) {
                    this.form = res.data
                    this.dectionRuleValue = res.data.expression
                    this.findCustomAppDetailFunc(this.form.appId)
                }
            },

            chooseProtocolRuleChange() {
                this.treeData = [
					{
						id: 1,
						ruleProtocol: undefined,
						matchSymbol: '',
						matchValue: ''
					}
				],
				this.dectionRuleValue = ''
				this.findCustomAppDetailFunc(this.form.appId)
            },

            async findCustomAppDetailFunc(id) {
                let res = await getCustomAppDetail(id)
                if (res.code === 0) {
                    console.log(res)
					let tmpFieldsArray = res.data.appCustom.appCustomFields
					let tmpFields = []
					tmpFieldsArray.forEach((v, i) => {
						let tmpFieldsObj = {}
						tmpFieldsObj.label = v.name
						tmpFieldsObj.value = v.id
						tmpFieldsObj.length = v.length
						tmpFields.push(tmpFieldsObj)
					})
					this.protocolRuleOptions = tmpFields
					// console.log(this.protocolRuleOptions)
                }
            },

            addCondition() {
				let tmpTreeData = this.treeData
				let treeDataFlag = false
				tmpTreeData.forEach((v, i) => {
					if ((v.ruleProtocol == 0 || !v.ruleProtocol) || (v.matchSymbol == '' || !v.matchSymbol) || (v.matchValue == '' || !v.matchValue)) {
						treeDataFlag = true
					}
				})
				if (treeDataFlag) {
					this.$message({
						type: 'error',
						message: '字段、匹配符、匹配值必填',
						showClose: true
					})
					return
				}
				this.treeData.push({
					id: this.treeData.length+1,
					optionsValue: '与',
					ruleProtocol: undefined,
					matchSymbol: '',
					matchValue: ''
				})
				this.showSureBtn = false
			},

			deleteCondition(item, index) {
				const itemList = this.treeData.indexOf(item)
				if (itemList !== -1) {
					this.treeData.splice(index, 1)
				}
				if (this.treeData && this.treeData.length > 0) {
					let tmpValue = ''
					this.treeData.forEach((v, i) => {
						let tmpValue2 = ''
						if (this.appOptions.filter(item => item.value == v.ruleProtocol).length > 0 && this.appOptions.filter(item => item.value == v.ruleProtocol)[0] && this.appOptions.filter(item => item.value == v.ruleProtocol)[0].label) {
							v.protocolName = this.appOptions.filter(item => item.value == v.ruleProtocol)[0].label
						}
						if (v.optionsValue) {
							if (v.optionsValue == '与') {
								tmpValue2 = '&&' + '(' + v.protocolName + v.matchSymbol + v.matchValue + ')'
							} else {
								tmpValue2 = '||' + '(' + v.protocolName + v.matchSymbol + v.matchValue + ')'
							}
						} else {
							tmpValue2 = '(' + v.protocolName + v.matchSymbol + v.matchValue + ')'
						}
						tmpValue = tmpValue + tmpValue2
					})
					this.dectionRuleValue = tmpValue
					// this.showSureBtn = false
				}
			},

            clearCondition() {
				this.treeData = [
					{
						id: 1,
						ruleProtocol: undefined,
						matchSymbol: '',
						matchValue: ''
					}
				],
				this.dectionRuleValue = ''
				this.showSureBtn = false
			},

            leaveInputChange(flag, item) {
				if (flag == 'protocolRule') {
					
				} else if (flag == 'matchSymbol') {
					
				} else if (flag == 'matchValue') {
					let tmp1 = /^[A-Fa-f0-9]{1,16}$/.test(item.matchValue)
					if (!tmp1 || tmp1 == false) {
						this.$message({
							type: 'error',
							message: '只能输入十六进制数，请重新输入'
						})
						item.matchValue = ''
						return
					}
				}
				if (item.ruleProtocol && item.matchSymbol && item.matchValue) {
					let tmpProtocolSize = this.protocolRuleOptions.filter(sitem => sitem.value == item.ruleProtocol)[0].length
					if (item.matchValue.length > tmpProtocolSize*2) {
						this.$message({
							type: 'error',
							message: '可输入的字节数仅<='+ tmpProtocolSize*2 + ',请重新输入'
						})
						item.matchValue = ''
						return
					} else {
						this.showSureBtn = true
					}
				} else {
					this.showSureBtn = false
				}
			},

            sureDetectRuleBtn() {
				if (this.treeData && this.treeData.length > 0) {
					let tmpValue = ''
					this.treeData.forEach((v, i) => {
						let tmpValue2 = ''
						if (this.protocolRuleOptions.filter(item => item.value == v.ruleProtocol).length > 0 && this.protocolRuleOptions.filter(item => item.value == v.ruleProtocol)[0] && this.protocolRuleOptions.filter(item => item.value == v.ruleProtocol)[0].label) {
							v.protocolName = this.protocolRuleOptions.filter(item => item.value == v.ruleProtocol)[0].label
						}
						if (v.optionsValue) {
							if (v.optionsValue == '与') {
								tmpValue2 = '&&' + '(' + v.protocolName + v.matchSymbol + v.matchValue + ')'
							} else {
								tmpValue2 = '||' + '(' + v.protocolName + v.matchSymbol + v.matchValue + ')'
							}
						} else {
							tmpValue2 = '(' + v.protocolName + v.matchSymbol + v.matchValue + ')'
						}
						tmpValue = tmpValue + tmpValue2
					})
					this.dectionRuleValue = tmpValue
				}
			},

            enterDialog() {
                this.$refs.form.validate(async valid => {
					if (valid) {
						if (!this.dectionRuleValue || this.dectionRuleValue == '') {
							this.$message({
								type: 'warning',
								message: '检测规则必填',
								showClose: true
							})
							return
						}
                        this.loading = true
                        this.form.expression = this.dectionRuleValue
						if (this.isEdit) {
							let res = await updateBehaviorCustom(this.form)
							if (res.code === 0) {
								this.$message({
									type: 'success',
									message: res.msg,
									showClose: true
								})
								this.$emit('closeAddEmit');
							}
						} else {
							let res = await addBehaviorCustom(this.form)
							if (res.code === 0) {
								this.$message({
									type: 'success',
									message: res.msg,
									showClose: true
								})
                                this.$emit('closeAddEmit');
							}
						}
					}
				})
            },

            initForm() {
                this.form = {
                    appId: undefined,
                    type: 1,
                    action: 1,
                    level: 1,
                    status: 0,
                    description: '',
                    expression: ''
                }
            },

            closeDialog() {
                this.initForm()
                this.$emit('closeEmit');
            },
        }
    }
</script>