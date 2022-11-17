<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="IP地址：">
                    <el-input placeholder="请输入" v-model="searchInfo.ip" />
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
                    <span class="title">IP列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.deleteOperation && deleteList.length > 0) ? false : true"
                            @click="deleteFunc">
                            删除
                        </el-button>
                        <el-button 
                            size="mini" 
                            type="primary" 
                            :disabled="userOperationUrl.addOperation ? false : true"
                            @click="addFunc">
                            新增
                        </el-button>
                    </div>
                </div>
                <div>
                    <el-table
                        v-loading="tableLoading"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                        class="tableStyle tableFixedStyle">
                        <el-table-column type="selection" align="center" width="55" />
                        <el-table-column align="left" label="源IP" min-width="200" prop="sourceIp" />
                        <el-table-column align="left" label="目的IP" min-width="200" prop="destinationIp" />
                        <el-table-column align="left" label="功能码" min-width="120" prop="functionCode" />
                        <el-table-column align="left" label="起始地址" min-width="120">
                            <template #default="scope">
                                {{ scope.row.startAddr || '--' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="结束地址" min-width="120">
                            <template #default="scope">
                                {{ scope.row.endAddr || '--' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button
                                    size="small" 
                                    type="text" 
                                    :disabled="userOperationUrl.updateOperation ? false : true"
                                    @click="editFunc(scope.row)"
                                >
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
        <!-- 新增、编辑 -->
        <el-drawer v-if="addDrawerFlag" :title="titleDrawer" :visible.sync="addDrawer" :direction="direction" :before-close="handleClose" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<el-form class="formDrawer" ref="detailForm" :model="form" :rules="rules">
                <el-form-item label="源IP" prop="sourceIp">
					<el-input v-model="form.sourceIp" placeholder="请输入" />
				</el-form-item>
                <el-form-item label="目的IP" prop="destinationIp">
					<el-input v-model="form.destinationIp" placeholder="请输入" />
				</el-form-item>
                <el-form-item label="功能码" prop="functionCode">
                    <el-input-number class="protocolIndetificationNum" v-model="form.functionCode" :controls="false" placeholder="请输入（只能数字）" style="width: 100%;"></el-input-number>
				</el-form-item>
                <el-form-item label="起始地址">
					<el-input v-model="form.startAddr" placeholder="请输入" />
				</el-form-item>
                <el-form-item label="结束地址">
					<el-input v-model="form.endAddr" placeholder="请输入" />
				</el-form-item>
			</el-form>
			<div class="form-drawer__footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="enterDialog" :loading="loading">
					确 定
				</el-button>
			</div>
		</el-drawer>
    </div>
</template>
<script>
    import {
        getModbusList,
        deleteModbus,
        addModbus,
        updateModbus
    } from '../../../../../api/securityStrategy'

    export default {
        name: 'Modbus',
        props: {
		    allowListId: {
				default: function() {
					return ''
				}
		    },
            activeName: {
                default: function() {
					return ''
				}
            }
		},
        data() {
            return {
                searchInfo: {
                    ip: ''
                },
                tableLoading: true,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 0,
                onTotal: 0,
                addDrawerFlag: false,
                addDrawer: false,
                titleDrawer: '',
				direction: 'rtl',
				loading: false,
                form: {
                    sourceIp: '',
                    destinationIp: '',
                    functionCode: undefined,
                    startAddr: '',
                    destinationIp: ''
                },
                rules: {
                    sourceIp: [
					    { required: true, message: '源IP必填' },
                        {
                            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                            message: '请输入正确的IP地址'
                        }
					],
                    destinationIp: [
					    { required: true, message: '目的IP必填' },
                        {
                            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                            message: '请输入正确的IP地址'
                        }
					],
                    functionCode: [
					    { required: true, message: '功能码必填' }
					]
                },
                protocolOpreation: [
                    {
                        label: 'TCP',
                        value: 'TCP'
                    },
                    {
                        label: 'UDP',
                        value: 'UDP'
                    }
                ],
                classmodel: false,
                deleteList: [],
                isEdit: false,
                userOperationUrl: {}
            }
        },
        watch: {
            'activeName': {
                handler: function(val, oldval) {
                    if (val == 'first') {
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
				let tmp1 = tmpUserOperationUrl.includes('/securityPolicy/whitelistProto/modbus/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
				// 删除
				let tmp2 = tmpUserOperationUrl.includes('/securityPolicy/whitelistProto/modbus/delete')
				if (tmp2) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
                // 编辑
                let tmp3 = tmpUserOperationUrl.includes('/securityPolicy/whitelistProto/modbus/update')
				if (tmp3) {
					this.userOperationUrl.updateOperation = true
				} else {
					this.userOperationUrl.updateOperation = false
				}
            }
        },  
        mounted() {
            
        },
        methods: {
            async getTableData() {
                let tmpdata = {
                    "ip": this.searchInfo.ip,
                    "page": this.page,
                    "pageSize": this.pageSize,
                    "whitelistId": parseInt(this.allowListId)
                }
                let res = await getModbusList(tmpdata)
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
                    ip: ''
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

            handleSelectionChange(val) {
                let tmpDeleteList = []
                if (val && val.length > 0) {
                    tmpDeleteList = val.map(v=>v.id)
                }
                this.deleteList = tmpDeleteList
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

            deleteFunc() {
                this.$confirm(`确定删除当前规则吗?`, '提示', {
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
                            "ids": this.deleteList,
                            "whitelistId": parseInt(this.allowListId)
                        }
                        deleteModbus(tmpdata).then(res => {
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
                this.titleDrawer = '添加'
            },

            editFunc(row) {
                this.titleDrawer = '编辑'
                let copy = Object.assign({}, row)
				this.form = copy
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.isEdit = true
            },

            initForm() {
                this.form = {
                    sourceIp: '',
                    destinationIp: '',
                    functionCode: undefined,
                    startAddr: '',
                    destinationIp: ''
                }
            },

            handleClose() {
                this.$refs.detailForm.resetFields()
                this.addDrawerFlag = false
                this.addDrawer = false
                this.initForm()
                this.isEdit = false
            },

            enterDialog() {
                this.$refs.detailForm.validate(async valid => {
                    if (valid) {
                        this.loading = true
                        this.form.whitelistId = parseInt(this.allowListId)
                        if (this.isEdit) {
                            this.form.protocolId = this.form.id
                            let res = await updateModbus(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                                this.handleClose()
                                this.loading = false
                            } else {
                                this.loading = false
                            }
                        } else {
                            let res = await addModbus(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                                this.handleClose()
                                this.loading = false
                            } else {
                                this.loading = false
                            }
                        }
                    }
                })
            },

            handleWrapperMousedown(e) {
				// 如果为true，则表示点击发生在遮罩层
      			this.classmodel= !!e.target.classList.contains('el-drawer__container')
			},

			handleWrapperMouseup(e) {
				if((!!e.target.classList.contains('el-drawer__container')) && this.classmodel){
					this.initForm()
                    this.addDrawerFlag = false
					this.addDrawer = false;
				}else{
                    this.addDrawerFlag = true
                    this.$nextTick(() => {
					    this.addDrawer = true;
                    })
				}
				this.classmodel = false
			},
        }
    }
</script>