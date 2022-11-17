<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form2" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="漏洞名称：">
                    <el-input v-model="searchInfo.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="风险等级：">
                    <el-select v-model="searchInfo.riskLevel" placeholder="请选择">
                        <el-option
                            v-for="item in riskLevelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="searchInfo.status" placeholder="请选择">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="动作：">
                    <el-select v-model="searchInfo.action" placeholder="请选择">
                        <el-option
                            v-for="item in actionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="mini" @click="onReset">
                    重 置
                </el-button>
                <el-button size="mini" type="primary" @click="onSubmit">
                    查 询
                </el-button>
            </div>
        </div>
        <div class="container-padding-body">
            <div class="container-padding-body-wrapper">
                <div>
                    <span class="title">漏洞库列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.statusOperation && choosedList.length > 0) ? false : true"
                            @click="changeStatusBatchFunc(0)">
                            禁用
                        </el-button>
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.statusOperation && choosedList.length > 0) ? false : true"
                            @click="changeStatusBatchFunc(1)">
                            启用
                        </el-button>
                        <el-button 
                            size="mini" 
                            type="primary" 
                            :disabled="(userOperationUrl.editOperation && choosedList.length > 0) ? false : true"
                            @click="editFunc()">
                            编辑
                        </el-button>
                    </div>
                </div>
                <div style="margin-top: 26px;">
                    <el-table
                        v-loading="tableLoading"
                        ref="recordTable"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        @select="handleSelectRow"
                        @select-all="handleSelectAll"
                        :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                        class="tableStyle tableFixedStyle">
                        <el-table-column type="selection" align="center" :selectable="selectable" width="55" />
                        <el-table-column align="left" label="漏洞名称" min-width="240" prop="name" />
                        <el-table-column align="left" label="发布时间" min-width="160" prop="publishDate" />
                        <el-table-column align="left" label="风险等级" min-width="120">
                            <template #default="scope">
                                <span class="levelRisk lowRisk" v-if="scope.row.riskLevel == 0">低</span>
                                <span class="levelRisk middleRisk" v-if="scope.row.riskLevel == 1">中</span>
                                <span class="levelRisk highRisk" v-if="scope.row.riskLevel == 2">高</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="状态" min-width="120">
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
                        <el-table-column align="left" label="动作" min-width="160">
                            <template #default="scope">
                                <span class="levelAction lowAction" v-if="scope.row.action == 0">允许</span>
                                <span class="levelAction middleAction" v-if="scope.row.action == 1">告警</span>
                                <span class="levelAction highAction" v-if="scope.row.action == 2">阻断</span>
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
                                    <span v-if="scope.row.status == 0" @click="changeStatusFunc(scope.row, 1)">启用</span>
                                    <span v-else @click="changeStatusFunc(scope.row, 0)" style="color: #606266;">禁用</span>
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
        <!-- 编辑 -->
        <el-drawer v-if="addDrawerFlag" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                <el-form-item label="动作" prop="action">
                    <el-select v-model="form.action" placeholder="请选择" style="width: 100%;">
                        <el-option
                            v-for="item in actionOptions2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
			</el-form>
			<div class="form-drawer__footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="enterDialog" :loading="loading">
					确 定
				</el-button>
			</div>
		</el-drawer>
        <!-- 详情 -->
        <el-drawer v-if="detailDrawerFlag" custom-class="blackDrawer" title="详情" :visible.sync="detailDrawer" :direction="detailDirection" :before-close="closeDetailDialog">
			<Detail :row="blackRow" />
		</el-drawer>
    </div>
</template>
<script>
    import {
        getBlackListVulnerabilityList,
        changeBlackListVulnerabilityStatus,
        updateBlackListVulnerability
    } from '../../../../api/securityStrategy'
    import { riskLevelArray, statusArray, actionArray, actionArray2 } from '../../../../utils/basicConfig'
    import Detail from './subcomponents/cnnvdDetail.vue'

    export default {
        name: 'BehaviorPredefine',
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
            return {
                searchInfo: {
                    name: '',
                    riskLevel: -1,
                    status: -1,
                    action: -1
                },
                riskLevelOptions: [],
                statusOptions: [],
                actionOptions: [],
                actionOptions2: [],
                tableLoading: true,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 0,
                onTotal: 0,
                checkedAll: false,
                // 编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogTitle: '编辑',
                form: {
                    action: undefined
                },
                rules: {
                    action: [
				        { required: true, message: '动作必填' }
				    ]
                },
                direction: 'rtl',
                loading: false,
                classmodel: false,
                // 详情
                detailDrawerFlag: false,
                detailDrawer: false,
                detailDirection: 'rtl',
                blackRow: {},
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
                    if (val == 'first') {
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
            this.riskLevelOptions = riskLevelArray
            this.statusOptions = statusArray
            this.actionOptions = actionArray
            this.actionOptions2 = actionArray2
            // 权限判断
			let tmpUserOperationUrl = JSON.parse(localStorage.getItem('userOperation'))
			if (tmpUserOperationUrl) {
				// 新增
				let tmp1 = tmpUserOperationUrl.includes('/securityPolicy/blackListVulnerability/statusChange')
				if (tmp1) {
					this.userOperationUrl.statusOperation = true
				} else {
					this.userOperationUrl.statusOperation = false
				}
                // 编辑
				let tmp2 = tmpUserOperationUrl.includes('/securityPolicy/blackListVulnerability/update')
				if (tmp2) {
					this.userOperationUrl.editOperation = true
				} else {
					this.userOperationUrl.editOperation = false
				}
            }
        },  
        mounted() {
            
        },
        methods: {
            async getTableData() {
				let tmpdata = {
                    "name": this.searchInfo.name,
                    "riskLevel": this.searchInfo.riskLevel,
                    "status": this.searchInfo.status,
					"action": this.searchInfo.action,
					"page": this.page,
					"pageSize": this.pageSize
				}
                let res = await getBlackListVulnerabilityList(tmpdata)
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
                    name: '',
                    riskLevel: -1,
                    status: -1,
                    action: -1
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

            changeStatusBatchFunc(status) {
                let tmpIds = []
                let tmptips = ''
                let tmptips2 = ''
                if (status == 0) {
					tmptips = '禁用'
				} else if (status == 1) {
					tmptips = '启用'
				}
                if (this.allCheck) {
                    tmpIds.push(-1)
                    tmptips2 = '所有'
                } else {
                    tmpIds = this.choosedList
                    tmptips2 = '所选'
                }
                this.$confirm(`确定确定${tmptips}${tmptips2}规则吗?`, '提示', {
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
                            "ids": tmpIds,
                            "status": status
                        }
                        changeBlackListVulnerabilityStatus(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.choosedList = []
                                this.clearAllChoosed()
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
                        let tmpArray = []
                        tmpArray.push(row.id)
                        let tmpdata = {
                            "ids": tmpArray,
                            "status": status
                        }
                        changeBlackListVulnerabilityStatus(tmpdata).then(res => {
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

            editBatchFunc() {
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
            },

            editFunc(row) {
                if (row) {
                    let copy = Object.assign({}, row)
				    this.form = copy
                }
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
            },

            initForm() {
                this.form = {
                    action: undefined
                }
            },

            closeDialog() {
                this.initForm()
                this.addDrawerFlag = false
                this.addDrawer = false
            },

            clearAllChoosed() {
                this.checkedList = []
				this.uncheckedList = []
				this.indeterminate = false
				this.allCheck = false
            },

            handleWrapperMousedown(e) {
				// 如果为true，则表示点击发生在遮罩层
      			this.classmodel= !!e.target.classList.contains('el-drawer__container')
			},

			handleWrapperMouseup(e) {
				if((!!e.target.classList.contains('el-drawer__container')) && this.classmodel){
					this.initForm()
                    this.addDrawerFlag = false
					this.addDrawer = false
				}else{
					this.addDrawerFlag = true
                    this.$nextTick(() => {
                        this.addDrawer = true
                    })
				}
				this.classmodel = false
			},

            enterDialog() {
                this.$refs.form.validate(async valid => {
					if (valid) {
                        this.loading = true
                        console.log(this.form)
                        let tmpArray = []
                        if (this.form.id) {
                            tmpArray.push(this.form.id)
                        } else {
                            if (this.allCheck) {
                                tmpArray.push(-1)
                            } else {
                                tmpArray = this.choosedList
                            }
                        }
                        let tmpdata = {
                            "ids": tmpArray,
                            "action": this.form.action
                        }
                        let res = await updateBlackListVulnerability(tmpdata)
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
                        }
                    }
                })
            },

            detailFunc(row) {
                this.detailDrawerFlag = true
                this.$nextTick(() => {
                    this.detailDrawer = true
                })
                this.blackRow = row
            }, 

            closeDetailDialog() {
                this.detailDrawerFlag = false
                this.detailDrawer = false
            },
        }
    }
</script>
<style>
    .blackDrawer.el-drawer {
		width: 60% !important;
	}

    .levelRisk {
		display: inline-block;
		padding: 1px 12px;
		border-radius: 2px;
	}

	.lowRisk {
		border: 1px solid #00D472;
		color: #00D472;
		background: #ECFFF6;
	}

	.middleRisk {
		border: 1px solid #F4A622;
		color: #F4A622;
		background: #FFFDF4;
	}

	.highRisk {
		border: 1px solid #FF2234;
		color: #FF2234;
		background: #FFF0F1;
	}

    .levelAction {
		display: inline-block;
		padding: 1px 10px;
		border-radius: 2px;
        font-size: 12px;
	}

	.lowAction {
		color: #00D472;
		background: #ECFFF6;
	}

	.middleAction {
		color: #FF7400;
		background: #FFF7E6;
	}

	.highAction {
		color: #FF2033;
		background: #FFEBE7;
	}
</style>