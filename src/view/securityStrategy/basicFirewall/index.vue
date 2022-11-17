<template>
    <div class="container-padding">
        <div class="container-padding-search">
            <SearchComponent @searchInfo="searchInfoData" />
        </div>
        <div class="container-padding-body">
            <div class="container-padding-body-wrapper">
                <div>
                    <span class="title">基础防火墙</span>
                    <div style="float: right;">
                        <el-select 
                            popper-class="selectStyle" 
                            class="shiftStyle" 
                            v-model="shiftValue" 
                            @change="moveChange" 
                            :disabled="(userOperationUrl.moveOperation && choosedList.length > 0 && !allCheck) ? false : true" 
                            placeholder="移动">
                            <el-option
                                v-for="item in shiftOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
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
                            :disabled="(userOperationUrl.clearOperation && choosedList.length > 0) ? false : true"
                            @click="clearHitsFunc">
                            清除命中数
                        </el-button>
                        <el-button 
                            size="mini" 
                            icon="el-icon-delete" 
                            :disabled="(userOperationUrl.deleteOperation && choosedList.length > 0) ? false : true"
                            @click="deleteFunc">
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
                        <el-table-column type="selection" align="center" :selectable="selectable" min-width="55" />
                        <el-table-column label="序号" width="70" prop="priority"></el-table-column>
                        <el-table-column align="left" label="名称" min-width="160" prop="name" />
                        <el-table-column align="left" label="源区域" min-width="160" prop="sourceZoneStr" />
                        <el-table-column align="left" label="目的区域" min-width="160" prop="destinationZoneStr" />
                        <el-table-column align="left" label="源IP" min-width="160" prop="sourceIpStr" />
                        <el-table-column align="left" label="目的IP" min-width="160" prop="destinationIpStr" />
                        <el-table-column align="left" label="源MAC" min-width="160" prop="sourceMac" />
                        <el-table-column align="left" label="目的MAC" min-width="160" prop="destinationMac" />
                        <el-table-column align="left" label="协议" min-width="160" prop="protocolStr" />
                        <el-table-column align="left" label="源端口" min-width="160" prop="sourcePort" />
                        <el-table-column align="left" label="目的端口" min-width="160" prop="destinationPort" />
                        <el-table-column align="left" label="时间" min-width="160" prop="timeStr" />
                        <el-table-column align="left" label="命中数" min-width="160" prop="hitsNum" />
                        <el-table-column align="left" label="动作" min-width="160">
                            <template #default="scope">
                                <span class="levelAction lowAction" v-if="scope.row.action == 0">允许</span>
                                <span class="levelAction middleAction" v-if="scope.row.action == 1">告警</span>
                                <span class="levelAction highAction" v-if="scope.row.action == 2">阻断</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="策略" min-width="160">
                            <template #default="scope">
                                <span v-if="scope.row.status == 0">
                                    <img src="../../../assets/ipmac0.png" style="width: 14px; height: 14px;vertical-align: middle;">
                                    禁用
                                </span>
                                <span v-if="scope.row.status == 1">
                                    <img src="../../../assets/ipmac1.png" style="width: 14px; height: 14px;vertical-align: middle;">
                                    启用
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="日志" min-width="160">
                            <template #default="scope">
                                <span v-if="scope.row.logStatus == 0">
                                    <img src="../../../assets/ipmac0.png" style="width: 14px; height: 14px;vertical-align: middle;">
                                    禁用
                                </span>
                                <span v-if="scope.row.logStatus == 1">
                                    <img src="../../../assets/ipmac1.png" style="width: 14px; height: 14px;vertical-align: middle;">
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
        <!-- 添加/编辑 -->
        <el-drawer v-if="addDrawerFlag" :size="dialogSize" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
            <AddComponent :isEdit="isEdit" :choosedRow="choosedRow" @closeAddEmit="closeAdd" />
		</el-drawer>
        <!-- 移动到指定位置对话框 -->
        <el-dialog
            v-if="moveDialogVisible"
            title="移动"
            :visible.sync="moveDialogVisible"
            width="36%"
            :before-close="handleMoveDialogClose">
            <MoveComponent :moveDialogVisible="moveDialogVisible" :choosedMoveList="choosedMoveList" @closeMoveEmit="closeMove" />
        </el-dialog>
    </div>
</template>
<script>
    import {
        getPolicyManagerList,
        deletePolicyManager,
        movePolicyManagerPriority,
        changePolicyManagerStatus,
        clearPolicyManagerHits
    } from '../../../api/securityStrategy'
    import SearchComponent from './components/searchComponent.vue'
    import AddComponent from './components/addComponent.vue'
    import MoveComponent from './components/moveComponet.vue'

    export default {
        name: 'BasicFirewall',
        components: {
            SearchComponent, AddComponent, MoveComponent
        },
        data() {
            return {
                searchInfo: {},
                actionOption: [],
                shiftOptions: [
                    {
                        value: 3,
                        label: '移至顶部'
                    },
                    {
                        value: 1,
                        label: '向上移'
                    },
                    {
                        value: 2,
                        label: '向下移'
                    },
                    {
                        value: 4,
                        label: '移至底部'
                    },
                    {
                        value: -1,
                        label: '移到指定位置'
                    }
                ],
                shiftValue: undefined,
                tableLoading: false,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 1,
                onTotal: 0,
                checkedAll: false,
                // 添加/编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogSize: '500px',
                dialogTitle: '添加',
                direction: 'rtl',
                choosedRow: {},
                isEdit: false,
                classmodel: false,
                strategySwitch: true,
                recordSwitch: true,
                // 移动到指定位置
                moveDialogVisible: false,
                choosedList: [],
                choosedMoveList: [],
                userOperationUrl: {},
                // 全选所有
                checkedList: [], //选中列表
				uncheckedList: [], //未选中列表
				indeterminate: false,
				allCheck: false
            }
        },
        created() {
            this.getTableData()
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
                let tmp5 = tmpUserOperationUrl.includes('/securityPolicy/policyManager/hitsClear')
				if (tmp5) {
					this.userOperationUrl.clearOperation = true
				} else {
					this.userOperationUrl.clearOperation = false
				}
                // 移动
                let tmp6 = tmpUserOperationUrl.includes('/securityPolicy/policyManager/priorityMove')
				if (tmp6) {
					this.userOperationUrl.moveOperation = true
				} else {
					this.userOperationUrl.moveOperation = false
				}
            }
        },  
        watch: {
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
        mounted() {
            
        },
        methods: {
            async getTableData() {
                // console.log(this.searchInfo.action)
                console.log(this.searchInfo)
                let tmpdata = {
                    "filedArray": this.searchInfo.filedArray,
                    "searchContent": this.searchInfo.searchContent,
                    "action": this.searchInfo.action,
					"page": this.page,
					"pageSize": this.pageSize
				}
                let res = await getPolicyManagerList(tmpdata)
                if (res.code === 0) {
                    this.tableLoading = false
                    this.tableData = res.data.list
                    this.total = res.data.total
                    this.onTotal = res.data.onTotal
                } else {
                    this.tableLoading = false
                }
            },

            searchInfoData(val) {
                this.searchInfo = val
                this.page = 1
				this.getTableData()
            },

            handleSelectionChange(val) {
                let tmpList = []
                let tmpMoveList = []
                if (val && val.length > 0) {
                    tmpList = val.map(v=>v.id)
                    val.forEach((v, i) => {
                        let tmpMoveData = {}
                        tmpMoveData.id = v.id
                        tmpMoveData.name = v.name
                        tmpMoveList.push(tmpMoveData)
                    })
                }
                this.choosedList = tmpList
                this.choosedMoveList = tmpMoveList
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
                this.$confirm(`确定${tmptips}${tmptips2}规则吗?`, '提示', {
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
                        changePolicyManagerStatus(tmpdata).then(res => {
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
                        clearPolicyManagerHits(tmpdata).then(res => {
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

            deleteFunc() {
                let tmpIds = []
                let tmptips = ''
                if (this.allCheck) {
                    tmpIds.push(-1)
                    tmptips = '所有'
                } else {
                    tmpIds = this.choosedList
                    tmptips = '所选'
                }
                this.$confirm(`确定删除${tmptips}规则吗?`, '提示', {
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
                        deletePolicyManager(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                if (this.tableData.length === 1 && this.page > 1) {
                                    this.page--
                                }
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

            addFunc() {
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '添加'
            },

            editFunc(row) {
                this.isEdit = true
                this.choosedRow = row
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '编辑'
            },

            closeDialog() {
                this.addDrawerFlag = false;
                this.addDrawer = false
                this.isEdit = false
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
				if ((!!e.target.classList.contains('el-drawer__container')) && this.classmodel){
                    this.closeDialog()
				} else {
                    this.addDrawerFlag = true
                    this.$nextTick(() => {
					    this.addDrawer = true;
                    })
				}
				this.classmodel = false
			},

            async moveChange() {
                if (this.shiftValue == -1) {
                    // 移动到指定位置
                    this.moveDialogVisible = true
                } else {
                    let tmpdata = {
                        "ids": this.choosedList,
                        "moveType": this.shiftValue
                    }
                    let res = await movePolicyManagerPriority(tmpdata)
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.shiftValue = undefined
                        this.clearAllChoosed()
                        this.getTableData()
                    }
                }
            },

            handleMoveDialogClose() {
                this.moveDialogVisible = false
                this.shiftValue = undefined
            },

            closeAdd() {
                this.closeDialog()
                this.getTableData()
            },

            closeMove() {
                this.handleMoveDialogClose()
                this.getTableData()
            }
        }
    }
</script>
<style>
    .shiftStyle {
        margin-left: 10px;
        margin-right: 10px;
        border-radius: 2px;
    }

    .shiftStyle.el-select .el-input.el-input--small {
        width: 130px;
    }

    .shiftStyle.el-select .el-input.el-input--small .el-input__inner {
        border-radius: 2px !important;
        border: 1px solid #DCDFE6;
        border-color: #DCDFE6 !important;
    } 

    .shiftStyle.el-select .el-input input::-webkit-input-placeholder {
        color:#606266;
    }
    
    .shiftStyle.el-select .el-input input::-moz-input-placeholder {
        color: #606266;
    }

    .shiftStyle.el-select  .el-input input::-ms-input-placeholder {
        color: #606266;
    }

    .selectStyle .el-select-dropdown__item:last-child {
        border-top: 1px solid #E4E7ED;
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