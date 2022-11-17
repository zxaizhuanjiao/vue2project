<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="应用名称：">
                    <el-input v-model="searchInfo.ruleCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button size="mini" @click="onReset">
                        重 置
                    </el-button>
                    <el-button size="mini" type="primary" @click="onSubmit">
                        查 询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="container-padding-body">
            <div class="container-padding-body-wrapper">
                <div>
                    <span class="title">自定义列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.statusOperation && changeStatusList.length > 0) ? false : true"
                            @click="changeStatusBatchFunc(0)">
                            禁用
                        </el-button>
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.statusOperation && changeStatusList.length > 0) ? false : true"
                            @click="changeStatusBatchFunc(1)">
                            启用
                        </el-button>
                        <el-button 
                            size="mini" 
                            icon="el-icon-delete" 
                            :disabled="(userOperationUrl.deleteOperation && deleteList.length > 0) ? false : true"
                            @click="deleteBatchFunc">
                            删除
                        </el-button>
                        <el-button 
                            size="mini" 
                            icon="el-icon-plus" 
                            type="primary" 
                            :disabled="userOperationUrl.addOperation ? false : true"
                            @click="addFunc">
                            添加
                        </el-button>
                    </div>
                </div>
                <div style="margin-top: 26px;">
                    <el-table
                        v-loading="tableLoading"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                        class="tableStyle tableFixedStyle">
                        <el-table-column type="selection" align="center" width="55" />
                        <el-table-column align="left" label="应用名称" min-width="160" prop="name" />
                        <el-table-column align="left" label="描述" min-width="160" prop="description" />
                        <el-table-column align="left" label="端口号" min-width="160" prop="port" />
                        <el-table-column align="left" label="状态" min-width="160">
                            <template #default="scope">
                                <span v-if="scope.row.status == 0">
                                    <img src="../../../../assets/ipmac0.png" style="width: 14px; height: 14px;vertical-align: middle;">
                                    禁用
                                </span>
                                <span v-if="scope.row.status == 1">
                                    <img src="../../../../assets/ipmac1.png" style="width: 14px; height: 14px;vertical-align: middle;">
                                    启用
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="引用计数" min-width="160" prop="referenceCount" />
                        <el-table-column align="left" fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text"
                                >
                                    <span v-if="scope.row.status == 0" @click="changeStatusFunc(scope.row, 1)">启用</span>
                                    <span v-else @click="changeStatusFunc(scope.row, 0)" style="color: #606266;">禁用</span>
                                </el-button>
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text"
                                    :disabled="userOperationUrl.editOperation ? false : true"
                                    @click="editFunc(scope.row)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text" 
                                    @click="detailFunc(scope.row)"
                                >
                                    详情
                                </el-button>
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text" 
                                    @click="deleteFunc(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="container-choose-all-wrapper">
                        <div class="gva-pagination">
                            <el-pagination style="padding: 20px 0;"
                                :current-page="page"
                                :page-size="pageSize"
                                :page-sizes="[10, 30, 50, 100]"
                                :total="total"
                                layout="total, sizes, prev, pager, next, jumper"
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增、编辑 -->
        <el-drawer v-if="addDrawerFlag" custom-class="applicationDrawer" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<div>
				<div>
                    <div>
                        <div class="firewall-title-line" style="padding: 24px 0 0 24px;">基础信息</div>
                        <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                            <el-form-item label="应用名称" prop="name">
                                <el-input v-model="form.name" :disabled="isEdit?true:false" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="协议描述">
                                <el-input v-model="form.description" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="协议状态" prop="status">
                                <el-select v-model="form.status" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="传输层协议" prop="transportProtocol">
                                <el-select v-model="form.transportProtocol" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in transportLayerOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="检测模式" prop="checkModel">
                                <el-select v-model="form.checkModel" @change="changeCheckModel" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in detectionModeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="端口号" prop="port" v-if="form.checkModel == 1">
                                <el-input-number v-model="form.port" :controls="false" :min="1" :max="65535" placeholder="端口号(只能是数字)" style="width: 100%;"></el-input-number>
                            </el-form-item>
                            <div v-if="form.checkModel == 2">
                                <el-form-item label="起始地址" prop="startAddress">
                                    <el-input-number v-model="form.startAddress" :min="0" :max="100" :controls="false" placeholder="起始地址(只能是数字)" style="width: 100%;"></el-input-number>
                                </el-form-item>
                                <el-form-item label="特征值" prop="appEigenValue">
                                    <el-input v-model="form.appEigenValue" placeholder="特征值（只能输入16进制）" style="width: 100%;"></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <div class="application-protocol-struct-wrapper">
                        <div class="firewall-title-line">
                            <span class="title">
                                协议结构
                            </span>
                            <span class="add-btn" @click="addParametersFunc()">
                                <i class="el-icon-circle-plus"></i>
                                <span>添加</span>
                            </span>
                        </div>
                        <div class="content">
                            <el-row class="content-part1">
                                <el-col :span="6">名称</el-col>
                                <el-col :span="8">起始地址</el-col>
                                <el-col :span="8">长度（单位：字节）</el-col>
                            </el-row>
                            <div class="bgStyle">
                                <el-row>
                                    <el-col :span="6">
                                        <el-input v-model="protocolStructObj.name" @change="appCustomFieldsNameChange" placeholder="请输入" style="width: 80%;"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input-number v-model="protocolStructObj.startAddress" :min="0" :max="100" :controls="false" placeholder="请输入" style="width: 90%;"></el-input-number>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input-number v-model="protocolStructObj.length" :min="1" :max="8" :controls="false" placeholder="请输入" style="width: 100%;"></el-input-number>
                                    </el-col>
                                </el-row>
                            </div>
                            <div v-for="item, index in protocolStructArray" :key="index">
                                <el-row style="padding: 10px;line-height: 32px;">
                                    <el-col :span="6">
                                        <el-input v-model="item.name" placeholder="请输入" style="width: 80%;"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input-number v-model="item.startAddress" :min="0" :max="100" :controls="false" placeholder="请输入" style="width: 90%;"></el-input-number>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-input-number v-model="item.length" :min="1" :max="8" :controls="false" placeholder="请输入" style="width: 100%;"></el-input-number>
                                    </el-col>
                                    <el-col :span="3">
                                        <div style="font-size: 12px;color: #303133;text-align: center;cursor: pointer;" @click="deleteParametersFunc(item, index)">
                                            <i class="el-icon-delete"></i>
                                            删除
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-drawer__footer bgfff" style="width: 40%;">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" :loading="loading" @click="enterDialog">
					确 定
				</el-button>
			</div>
        </el-drawer>
        <!-- 详情 -->
        <el-drawer v-if="detailDrawerFlag" custom-class="application-customize-drawer" :title="detailDialogTitle" :visible.sync="detailDrawer" :direction="detailDirection">
			<Detail :row="customAppDetail" />
		</el-drawer>
    </div>
</template>
<script>
    import {
        getCustomAppList,
        addCustomApp,
        getCustomAppDetail,
        updateCustomApp,
        changeCustomAppStatus,
        deleteCustomApp
    } from '../../../../api/resourceObject'
    import Detail from './subComponents/detail.vue'

    export default {
        name: 'ApplicationCustomize',
        components: {
            Detail
        },
        props: {
            activeName: {
                default: function() {
					return ''
				}
            }
		},
        data() {
            var validateIp = (rule, value, callback) => {
                if (value != '') {
                    let tmpdata = parseInt(value.length)
                    if (tmpdata % 2 === 0) {
                        let eigenReg =  /^[A-Fa-f0-9]{1,10}$/
                        if (eigenReg.test(value)) {
                            callback()
                        } else {
                            callback('请输入正确的16进制数据')
                        }
                    } else {
                        callback('请输入正确的16进制数据')
                    }
                }
            }

            return {
                searchInfo: {},
                tableLoading: true,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 1,
                // 编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogTitle: '',
                form: {
                    name: '',
                    description: '',
                    status: undefined,
                    transportProtocol: '',
                    checkModel: undefined,
                    port: undefined,
                    startAddress: undefined,
                    appEigenValue: '',
                    appCustomFields: []
                },
                rules: {
                    name: [
				        { required: true, message: '协议名称必填' }
				    ],
                    status: [
                        { required: true, message: '协议状态必填' }
                    ],
                    transportProtocol: [
                        { required: true, message: '传输层协议必填' }
                    ],
                    checkModel: [
                        { required: true, message: '检测模式必填' }
                    ],
                    port: [
                        { required: true, message: '端口号必填' }
                    ],
                    startAddress: [
                        { required: true, message: '起始地址必填' }
                    ],
                    appEigenValue: [
                        { required: true, message: '特征值必填' },
                        { validator: validateIp }
                    ]
                },
                direction: 'rtl',
                protocolOptions: [],
                loading: false,
                classmodel: false,
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
                transportLayerOptions: [
                    {
                        value: 'TCP',
						label: 'TCP'
                    },
                    {
                        value: 'UDP',
						label: 'UDP'
                    }
                ],
                detectionModeOptions: [
                    {
                        value: 1,
						label: '端口'
                    },
                    {
                        value: 2,
						label: '特征值'
                    }
                ],
                isEdit: false,
                // 协议结构
                protocolStructObj: {
                    name: '',
                    startAddress: undefined,
                    length: undefined
                },
                protocolStructArray: [],
                // 详情
                detailDirection: 'rtl',
                detailDrawerFlag: false,
                detailDrawer: false,
                detailDialogTitle: '详情',
                // choosedRow: {},
                changeStatusList: [],
                deleteList: [],
                customAppDetail: {},
                userOperationUrl: {}
            }
        },
        watch: {
            'activeName': {
                handler: function(val, oldval) {
                    if (val == 'second') {
                        this.getTableData()
                    }
                },
                immediate: true
            }
        },
        created() {
            // 权限判断
			let tmpUserOperationUrl = JSON.parse(localStorage.getItem('userOperation'))
			if (tmpUserOperationUrl) {
				// 新增
				let tmp1 = tmpUserOperationUrl.includes('/resourceObj/resourceApp/custom/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
                // 编辑
				let tmp2 = tmpUserOperationUrl.includes('/resourceObj/resourceApp/custom/update')
				if (tmp2) {
					this.userOperationUrl.editOperation = true
				} else {
					this.userOperationUrl.editOperation = false
				}
                // 禁用、启用
                let tmp3 = tmpUserOperationUrl.includes('/resourceObj/resourceApp/custom/statusChange')
				if (tmp3) {
					this.userOperationUrl.statusOperation = true
				} else {
					this.userOperationUrl.statusOperation = false
				}
                // 删除
                let tmp4 = tmpUserOperationUrl.includes('/resourceObj/resourceApp/custom/delete')
				if (tmp4) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
			}
        },  
        mounted() {
            
        },
        methods: {
            async getTableData() {
                let tmpdata = {
                    "name": this.searchInfo.name,
                    "page": this.page,
                    "pageSize": this.pageSize
                }
                let res = await getCustomAppList(tmpdata)
                if (res.code === 0) {
                    this.tableLoading = false
                    this.tableData = res.data.list
                    this.total = res.data.total
                } else {
                    this.tableLoading = false
                }
            },

            onReset() {
                this.searchInfo = {
                    name: ''
                }
				this.page = 1
				this.getTableData()
            },

            onSubmit() {
                this.page = 1
				this.getTableData()
            },

            handleSearchDatasetList() {
                this.page = 1
				this.getTableData()
            },

            handleSizeChange(val) {
			    this.pageSize = val
                this.page = 1
			    this.getTableData()
			},
			
			handleCurrentChange(val) {
			    this.page = val
			    this.getTableData()
			},

            handleSelectionChange(val) {
                let tmpList = []
                if (val && val.length > 0) {
                    tmpList = val.map(v=>v.id)
                }
                this.changeStatusList = tmpList
                this.deleteList = tmpList
            },

            changeStatusBatchFunc(status) {
                let tmptips = ''
				if (status == 0) {
					tmptips = '禁用'
				} else if (status == 1) {
					tmptips = '启用'
				}
                this.$confirm(`确定${tmptips}所选应用吗?`, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, ctx, close) => {
                        if (action !== 'confirm') {
                            close();
                            return;
                        }
                        ctx.confirmButtonLoading = true;
                        let tmpdata = {
                            "ids": this.changeStatusList,
                            "status": status
                        }
                        changeCustomAppStatus(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.getTableData()
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            changeStatusFunc(row, status) {
                let tmptips = ''
				if (status == 0) {
					tmptips = '禁用'
				} else {
					tmptips = '启用'
				}
                this.$confirm(`确定${tmptips}当前应用吗?`, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, ctx, close) => {
                        if (action !== 'confirm') {
                            close();
                            return;
                        }
                        ctx.confirmButtonLoading = true;
                        let tmpdataarray = []
					    tmpdataarray.push(row.id)
                        let tmpdata = {
                            "ids": tmpdataarray,
                            "status": status
                        }
                        changeCustomAppStatus(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.getTableData()
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            deleteBatchFunc() {
                this.$confirm(`确定删除所选应用吗?`, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, ctx, close) => {
                        if (action !== 'confirm') {
                            close();
                            return;
                        }
                        ctx.confirmButtonLoading = true;
                        let tmpdata = {
                            "ids": this.deleteList
                        }
                        deleteCustomApp(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                if (this.tableData.length === 1 && this.page > 1) {
                                    this.page--
                                }
                                this.getTableData()
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            deleteFunc(row) {
                this.$confirm(`确定删除该应用吗?`, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, ctx, close) => {
                        if (action !== 'confirm') {
                            close();
                            return;
                        }
                        ctx.confirmButtonLoading = true;
                        let tmpdataarray = []
					    tmpdataarray.push(row.id)
                        let tmpdata = {
                            "ids": tmpdataarray
                        }
                        deleteCustomApp(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                if (this.tableData.length === 1 && this.page > 1) {
                                    this.page--
                                }
                                this.getTableData()
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            addFunc() {
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '新增'
            },

            editFunc(row) {
                this.isEdit = true
                this.dialogTitle = '编辑'
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.findProtocolIdentificationFunc(row.id)
            },

            async findProtocolIdentificationFunc(id) {
                let res = await getCustomAppDetail(id)
                if (res.code === 0) {
                    if (res.data.appCustom.port == 0) {
                        res.data.appCustom.port = undefined
                    }
                    if (res.data.appCustom.startAddress == 0) {
                        res.data.appCustom.startAddress = undefined
                    }
                    this.form = res.data.appCustom
                    this.protocolStructArray = res.data.appCustom.appCustomFields
                    this.customAppDetail = res.data.appCustom
                }
            },

            changeCheckModel() {
                // if (this.form.checkModel == 1) {
                //     this.form.startAddress = undefined
                //     this.form.appEigenValue = ''
                // } else {
                //     this.form.port = undefined
                // }
            },

            initForm() {
                this.form = {
                    name: '',
                    description: '',
                    status: undefined,
                    transportProtocol: '',
                    checkModel: undefined,
                    port: undefined,
                    startAddress: undefined,
                    appEigenValue: '',
                    appCustomFields: []
                }
                this.protocolStructObj = {
                    name: '',
                    startAddress: undefined,
                    length: undefined
                }
                this.protocolStructArray = []
                // this.choosedRow = {}
            },

            closeDialog() {
                this.initForm()
                this.addDrawerFlag = false
                this.addDrawer = false
            },

            enterDialog() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        if (this.protocolStructArray.length < 1) {
                            this.$message({
                                type: 'warning',
                                message: '协议结构中名称、起始地址、长度必填'
                            })
                            return
                        }
                        this.loading = true
                        if (this.isEdit) {
                            // 编辑
                            if (this.form.checkModel == 1) {
                                this.form.startAddress = undefined
                                this.form.appEigenValue = ''
                            } else if (this.form.checkModel == 2) {
                                this.form.port = 0
                            }
                            this.form.appCustomFields = this.protocolStructArray
                            // if (this.form.appEigenValue) {
                            //     this.form.appEigenValue = '|' + this.form.appEigenValue + '|'
                            // } else {
                            //     this.form.appEigenValue = ''
                            // }
                            // this.form.appEigenValue = '|' + this.form.appEigenValue + '|'
                            let res = await updateCustomApp(this.form)
                            if (res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                                this.closeDialog()
                                this.loading = false
                            } else {
                                this.form.eigenValue = this.getStr(this.form.eigenValue)
                                this.loading = false
                            }
                        } else {
                            // 新增
                            this.form.appCustomFields = this.protocolStructArray
                            // if (this.form.eigenValue) {
                            //     this.form.eigenValue = '|' + this.form.eigenValue + '|'
                            // } else {
                            //     this.form.eigenValue = ''
                            // }
                            
                            let res = await addCustomApp(this.form)
                            if (res.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                                this.closeDialog()
                                this.loading = false
                            } else {
                                this.form.eigenValue = this.getStr(this.form.eigenValue)
                                this.loading = false
                            }
                        }

                    }
                })
            },

            getStr(str) {
                if (str == "" || str == null || str == undefined) {
                    return "";
                }
                var subArr = str.split('|');
                var str = "";
                for (var num = 0; num < subArr.length; num++) {
                    str = subArr[1]
                }
                return str;
            },

            detailFunc(row) {
                // this.customAppDetail = row
                this.detailDrawerFlag = true
                this.$nextTick(() => {
                    this.detailDrawer = true
                })
                this.findProtocolIdentificationFunc(row.id)
            },

            appCustomFieldsNameChange() {
                let ipReg =  /[^\a-\z\A-\Z]$/
                if (ipReg.test(this.protocolStructObj.name)) {
                    this.$message({
                        type: 'warning',
                        message: '协议结构中字段名称必须是英文'
                    })
                    this.protocolStructObj.name = ''
                    return
                }                       
            },

            addParametersFunc() {
                if (this.protocolStructObj.name == '' || !this.protocolStructObj.startAddress || !this.protocolStructObj.length) {
                    this.$message({
                        type: 'warning',
                        message: '名称、起始地址、长度必填'
                    })
                    return
                }
                this.protocolStructArray.push(this.protocolStructObj)
                this.protocolStructObj = {
                    name: '',
                    startAddress: undefined,
                    length: undefined
                }
            },

            deleteParametersFunc(item, index) {
                const itemList = this.protocolStructArray.indexOf(item)
                if (itemList !== -1) {
                    this.protocolStructArray.splice(index, 1)
                }
            },

            handleWrapperMousedown(e) {
				// 如果为true，则表示点击发生在遮罩层
      			this.classmodel= !!e.target.classList.contains('el-drawer__container')
			},

			handleWrapperMouseup(e) {
				if((!!e.target.classList.contains('el-drawer__container')) && this.classmodel){
					this.initForm()
                    this.addDrawerFlag = false;
					this.addDrawer = false;
				}else{
					this.addDrawerFlag = true
                    this.$nextTick(() => {
                        this.addDrawer = true
                    })
				}
				this.classmodel = false
			}
        }
    }
</script>
<style>
    .applicationDrawer.el-drawer {
		width: 40% !important;
	}

	.applicationDrawer .el-form.formDrawer {
		padding-top: 12px;
		padding-bottom: 12px;
	}

    .bgStyle {
		background: #ECEEF5;
		padding: 10px;
	}

	.bgStyle2 {
		padding: 14px 10px 0 10px;
	}

    .application-protocol-struct-wrapper {
        padding: 0 24px 80px 24px;
    }

    .application-protocol-struct-wrapper .title {
        display: inline-block;
        width: 50%;
    }

    .application-protocol-struct-wrapper .add-btn {
        display: inline-block;
        width: 50%;
        text-align: right;
        cursor: pointer;
    }

    .application-protocol-struct-wrapper .add-btn i{
        color: #F26521;
        padding-right: 6px;
    }

    .application-protocol-struct-wrapper .add-btn span {
        color: #303133;
        font-size: 14px;
    }

    .application-protocol-struct-wrapper .content .content-part1 {
        color: #909399;
        font-size: 14px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .application-customize-drawer.el-drawer {
        width: 60% !important;
    }
</style>