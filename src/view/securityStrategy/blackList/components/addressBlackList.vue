<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="IP地址：">
                    <el-input v-model="searchInfo.ip" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="MAC地址：">
                    <el-input v-model="searchInfo.mac" placeholder="请输入"></el-input>
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
                    <span class="title">地址黑名单列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini"
                            :disabled="(userOperationUrl.clearOperation && choosedList.length > 0) ? false : true"
                            @click="clearHitsFunc">
                            清除命中数    
                        </el-button>
                        <el-button 
                            size="mini" 
                            icon="el-icon-delete" 
                            :disabled="(userOperationUrl.deleteOperation && choosedList.length > 0) ? false : true"
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
                        ref="recordTable"
                        @selection-change="handleSelectionChange"
                        @select="handleSelectRow"
                        @select-all="handleSelectAll"
                        :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                        class="tableStyle tableFixedStyle">
                        <el-table-column type="selection" align="center" :selectable="selectable" width="55" />
                        <el-table-column align="left" label="IP地址或MAC地址" min-width="160" prop="address" />
                        <el-table-column align="left" label="命中数" min-width="160" prop="hitNumber" />
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
                        <el-table-column align="left" fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text"
                                    :disabled="userOperationUrl.statusOperation ? false : true"
                                >
                                    <span v-if="scope.row.status == 0" @click="changeStatusFunc(scope.row, 1)">
                                        启用
                                    </span>
                                    <span v-if="scope.row.status == 1" @click="changeStatusFunc(scope.row, 0)" style="color: #606266;">
                                        禁用
                                    </span>
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
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="container-choose-all-wrapper">
                        <div class="container-choose-all-part1">
                            <el-checkbox class="chooseAll" :indeterminate="indeterminate" @change="handleCheck" label="全选所有" v-model="allCheck" style="padding-right: 10px;"></el-checkbox>
                            <span>
                                已启用总数：{{ onTotal }}条
                            </span>
                        </div>
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
        <el-drawer v-if="addDrawerFlag" custom-class="behaviorDrawer" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<div>
                <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                    <el-form-item label="类型">
                        <el-radio v-model="form.addressType" :label="1">IP地址</el-radio>
                        <el-radio v-model="form.addressType" :label="2">MAC地址</el-radio>
                    </el-form-item>
                    <el-form-item label="IP地址" v-if="form.addressType == 1" prop="ip">
                        <el-input v-model="form.ip" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="MAC地址" v-if="form.addressType == 2" prop="mac">
                        <el-input v-model="form.mac" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-drawer__footer bgfff" style="width: 40%;">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" :loading="loading" @click="enterDialog">
					确 定
				</el-button>
			</div>
        </el-drawer>
    </div>
</template>
<script>
    import {
        getAddressBlackList,
        addAddressBlack,
        deleteAddressBlack,
        getAddressBlackDetail,
        updateAddressBlack,
        changeAddressBlackStatus,
        clearAddressBlack
    } from '../../../../api/securityStrategy'
    import { protocolArray } from '../../../../utils/protocolData'
    import { ruleLevelArray } from '../../../../utils/ruleLevelData'

    export default {
        name: 'BehaviorCustomize',
        props: {
            activeName: {
                default: function() {
					return ''
				}
            }
		},
        data() {
            return {
                searchInfo: {
                    ip: '',
                    mac: ''
                },
                protocolOptions: [],
                protocolValue: '',
                ruleLevelOptions: [],
                ruleLevelValue: '',
                actionOptions: [
                    {
                        value: '1',
                        label: '告警'
                    },
                    {
                        value: '2',
                        label: '阻断'
                    }
                ],
                actionValue: '',
                tableLoading: true,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 1,
                onTotal: 0,
                checkedAll: false,
                // 编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogTitle: '',
                form: {
                    ip: '',
                    mac: '',
                    addressType: 1
                },
                rules: {
                    ip: [
					    { required: true, message: 'IP地址必填' },
                        {
                            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                            message: '请输入正确的IP地址'
                        }
					],
                    mac: [
                        { required: true, message: 'MAC地址必填' },
						{
                            pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
                            message: '请输入正确的MAC地址'
                        }
                    ]
                },
                direction: 'rtl',
                protocolOptions: [],
                loading: false,
                classmodel: false,
                ruleTypeOptions: [
					{
						value: '1',
						label: '环境异常'
					},
					{
						value: '2',
						label: '流量异常'
					},
					{
						value: '3',
						label: '业务异常'
					},
                    {
                        value: '4',
                        label: '已知威胁'
                    },
					{
                        value: '5',
                        label: '敏感操作'
                    }
				],
                choosedList: [],
                userOperationUrl: {},
                // 全选所有
                checkedList: [], //选中列表
				uncheckedList: [], //未选中列表
				indeterminate: false,
				allCheck: false,
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
            },
            //监听列表,如果为所有全选,翻页时保持状态
			tableData: {
				handler(value) {
                    if (this.allCheck) {
                        if (this.uncheckedList.length === 0) {
                            this.$nextTick(() => {
                                //这里一定要用$nextTick
                                value.forEach((row) => {
                                    this.$refs.recordTable.toggleRowSelection(row, true);
                                });
                            });
                        } else {
                            this.$nextTick(() => {
                                value.forEach((row) => {
                                    for (let i = 0; i < this.uncheckedList.length; i++) {
                                        if (row.itemcode === this.uncheckedList[i].itemcode) {
                                            this.$refs.recordTable.toggleRowSelection(row, false);
                                            break;
                                        } else {
                                            this.$refs.recordTable.toggleRowSelection(row, true);
                                        }
                                    }
                                });
                            });
                        }
                    }
				},
				deep: true
			},
			//监听未选中的数组
			uncheckedList: {
				handler(value) {
					//1.未选中数组长度和总数相等,取消选中状态,取消样式
					if (value.length === this.total) {
						this.allCheck = false;
						this.indeterminate = false;
					}
					//2.未选中数组长度为0,取消样式
					if (value.length === 0) {
						this.indeterminate = false;
					}
				},
				deep: true
			},
			//监听选中数组
			checkedList: {
				handler(value) {
					//选中数组长度等于总数,代表全部选中,取消样式
					if (value.length === this.total) {
						this.allCheck = true;
						this.indeterminate = false;
					}
				}
			}
        },
        created() {
            this.protocolOptions = protocolArray
            this.ruleLevelOptions = ruleLevelArray
            // 权限判断
			let tmpUserOperationUrl = JSON.parse(localStorage.getItem('userOperation'))
			if (tmpUserOperationUrl) {
				// 新增
				let tmp1 = tmpUserOperationUrl.includes('/securityPolicy/addressBlacklist/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
                // 删除
                let tmp2 = tmpUserOperationUrl.includes('/securityPolicy/addressBlacklist/delete')
				if (tmp2) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
                // 编辑
                let tmp3 = tmpUserOperationUrl.includes('/securityPolicy/addressBlacklist/update')
				if (tmp3) {
					this.userOperationUrl.editOperation = true
				} else {
					this.userOperationUrl.editOperation = false
				}
                // 启用禁用
                let tmp4 = tmpUserOperationUrl.includes('/securityPolicy/addressBlacklist/statusChange')
				if (tmp4) {
					this.userOperationUrl.statusOperation = true
				} else {
					this.userOperationUrl.statusOperation = false
				}
                // 清除命中数
                let tmp5 = tmpUserOperationUrl.includes('/securityPolicy/addressBlacklist/hitsClear')
				if (tmp5) {
					this.userOperationUrl.clearOperation = true
				} else {
					this.userOperationUrl.clearOperation = false
				}
            }
        },  
        mounted() {
            
        },
        methods: {
            async getTableData() {
                let tmpdata = {
                    "ip": this.searchInfo.ip,
                    "mac": this.searchInfo.mac,
					"page": this.page,
					"pageSize": this.pageSize
				}
                let res = await getAddressBlackList(tmpdata)
                if (res.code === 0) {
                    this.tableLoading = false
                    this.tableData = res.data.list
                    this.total = res.data.total
                    this.onTotal = res.data.onTotal
                } else {
                    this.tableLoading = false
                }
            },

            onReset() {
                this.searchInfo = {
                    ip: '',
                    mac: ''
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
                let tmpList = []
                if (val && val.length > 0) {
                    tmpList = val.map(v=>v.id)
                }
                this.choosedList = tmpList
            },

            handleSelectRow(rows, row) {
				//单行选择
				if (this.allCheck) {
					// 多选框样式改变,allCheck依然为true,为了保持翻页状态
					this.indeterminate = true;
					// 判断勾选数据行是选中还是取消
					let selected = rows.length && rows.indexOf(row) !== -1;
					let lenFalse = this.uncheckedList.length;
					if (selected) {
						// 选中,从未选中数组中去掉
						if (lenFalse !== 0) {
							for (let i = 0; i < lenFalse; i++) {
								if (this.uncheckedList[i].id === row.id) {
								this.uncheckedList.splice(i, 1);
								break;
								}
							}
						}
					} else {
						// 取消,当前取消的行push进去
						this.uncheckedList.push(row);
					}
				} else {
					this.checkedList = rows;
				}
			},

            handleSelectAll(rows) {
				if (this.allCheck) {
					this.indeterminate = true;
					let lenNow = this.tableData.length;
					// 判断全选本页,是选中还是取消
					if (rows.indexOf(this.tableData[0]) !== -1) {
						//如果选中所有rows存在于tableList,或者判断rows长度不为0 证明是选中状态
						//uncheckedList要删除当前页tableList
						for (let i = 0; i < lenNow; i++) {
							for (let n = 0; n < this.uncheckedList.length; n++) {
								if (this.uncheckedList[n].id === this.tableData[i].id) {
									this.uncheckedList.splice(n, 1);
								}
							}
						}
					} else {
						// 取消 如果rows为空,当页是取消状态
						for (let j = 0; j < lenNow; j++) {
							if (this.uncheckedList.length !== 0) {
								//如果uncheckedList已经有值
								if (this.uncheckedList.indexOf(this.tableData[j]) === -1) {
									//就把uncheckedList中没有的当前页tableList,push进去
									this.uncheckedList.push(this.tableData[j]);
								}
							} else {
								//如果为空,直接全部push
								this.uncheckedList.push(this.tableData[j]);
							}
						}
					}
				} else {
					this.checkedList = rows;
				}
			},

            handleCheck() {
				if (this.indeterminate) {
					//当不为全选样式时,点击变为全选
					this.allCheck = true;
				}
				//只要点击了全选所有,这两个数组清空
				this.uncheckedList = [];
				this.checkedList = [];
				if (this.allCheck) {
					//全选所有,列表全部选中,包括翻页
					this.tableData.forEach((row) => {
						this.$refs.recordTable.toggleRowSelection(row, true);
					});
				} else {
					//取消列表全选状态,包括翻页
					this.$refs.recordTable.clearSelection();
				}
			},

            selectable(row, index) {
				if (!this.allCheck) {
					return true
				}
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

            clearHitsFunc() {
                let tmpIds = []
                let tmptips = ''
                if (this.allCheck) {
                    tmpIds.push(-1)
                    tmptips = '所有'
                } else {
                    tmpIds = this.choosedList
                    tmptips = '所选'
                }
                this.$confirm(`确定清空${tmptips}命中数?`, '提示', {
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
                            "ids": tmpIds
                        }
                        clearAddressBlack(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.choosedList = []
                                this.getTableData()
                                this.clearAllChoosed()
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
				} else if (status == 1) {
					tmptips = '启用'
				}
                this.$confirm(`确定${tmptips}当前规则吗?`, '提示', {
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
                        let tmpStatusArray = []
                        tmpStatusArray.push(row.id)
                        let tmpdata = {
                            "ids": tmpStatusArray,
                            "status": status
                        }
                        changeAddressBlackStatus(tmpdata).then(res => {
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
                let tmpIds = []
                let tmptips = ''
                if (this.allCheck) {
                    tmpIds.push(-1)
                    tmptips = '所有'
                } else {
                    tmpIds = this.choosedList
                    tmptips = '所选'
                }
                this.$confirm(`确定删除${tmptips}地址黑名单?`, '提示', {
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
                            "ids": tmpIds
                        }
                        deleteAddressBlack(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                if (this.tableData.length === 1 && this.page > 1) {
                                    this.page--
                                }
                                this.choosedList = []
                                this.getTableData()
                                this.clearAllChoosed()
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
                this.dialogTitle = '添加'
            },

            editFunc(row) {
                this.getAddressBlackDetailFunc(row.id)
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '编辑'
                this.isEdit = true
            },

            async getAddressBlackDetailFunc(id) {
                let res = await getAddressBlackDetail(id)
                if (res.code === 0) {
                    let tmpList = res.data.securityAddressBlacklist
                    if (tmpList && tmpList.id) {
                        if (tmpList.addressType == 1) {
                            tmpList.ip = tmpList.address
                        } else {
                            tmpList.mac = tmpList.address
                        }
                    }
                    this.form = tmpList
                }
            },

            initForm() {
                this.form = {
                    ip: '',
                    mac: '',
                    addressType: 1
                }
                this.dialogTitle = ''
            },

            closeDialog() {
                this.initForm()
                this.addDrawerFlag = false
                this.addDrawer = false
                this.isEdit = false
            },

            clearAllChoosed() {
                this.checkedList = []
				this.uncheckedList = []
				this.indeterminate = false
				this.allCheck = false
            },

            enterDialog() {
                this.$refs.form.validate(async valid => {
					if (valid) {
                        this.loading = true
                        if (this.isEdit) {
                            let tmpdata = {
                                "id": this.form.id,
                                "address": this.form.ip || this.form.mac,
                                "addressType": this.form.addressType
                            }
                            let res = await updateAddressBlack(tmpdata)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.loading = false
                                this.getTableData()
                                this.closeDialog()
                                this.clearAllChoosed()
                            } else {
                                this.loading = false
                            }
                        } else {
                            let tmpdata = {
                                "address": this.form.ip || this.form.mac,
                                "addressType": this.form.addressType
                            }
                            let res = await addAddressBlack(tmpdata)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.loading = false
                                this.getTableData()
                                this.closeDialog()
                                this.clearAllChoosed()
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
                    this.addDrawerFlag = false;
					this.addDrawer = false;
				}else{
					this.addDrawerFlag = true
                    this.$nextTick(() => {
                        this.addDrawer = true
                    })
				}
				this.classmodel = false
			},

            chooseProtocolRuleChange() {

            },

            detailFunc() {

            }
        }
    }
</script>
<style>
    .behaviorDrawer.el-drawer {
		width: 40% !important;
	}

	.behaviorDrawer .el-form.formDrawer {
		padding-top: 12px;
		padding-bottom: 12px;
	}
</style>