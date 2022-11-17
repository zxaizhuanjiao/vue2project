<template>
    <div class="container-padding">
        <div class="container-padding-search">
            <el-form class="container-padding-search-form2" ref="searchForm" :inline="true" v-model="searchInfo">
                <el-form-item label="IP地址：">
                    <el-input v-model="searchInfo.ruleCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="连接速率：">
                    <el-input v-model="searchInfo.ruleCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="连接总数：">
                    <el-input v-model="searchInfo.ruleCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="searchInfo.statusValue" placeholder="请选择">
                        <el-option
                            v-for="item in statusOptions"
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
                    <span class="title">连接管理列表</span>
                    <div style="float: right;">
                        <el-button size="mini" @click="changeStatusBatchFunc(0)">
                            禁用
                        </el-button>
                        <el-button size="mini" @click="changeStatusBatchFunc(1)">
                            启用
                        </el-button>
                        <el-button size="mini" icon="el-icon-delete" @click="deleteBatchFunc">
                            删除
                        </el-button>
                        <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFunc">
                            添加
                        </el-button>
                    </div>
                </div>
                <div style="margin-top: 26px;">
                    <el-table
                        v-loading="tableloading"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                        class="tableStyle tableFixedStyle">
                        <el-table-column type="selection" align="center" width="55" />
                        <el-table-column align="left" label="时间" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="源IP" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="目的IP" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="连接速率" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="连接总数" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="会话计数" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="开启告警" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="状态" min-width="160" prop="groupName" />
                        <el-table-column align="left" fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text"
                                >
                                    <span v-if="true" @click="changeStatusFunc(scope.row, 1)">启用</span>
                                    <span v-else @click="changeStatusFunc(scope.row, 0)" style="color: #606266;">禁用</span>
                                </el-button>
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text" 
                                    @click="editFunc(scope.row)"
                                >
                                    编辑
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
        <el-drawer v-if="addDrawerFlag" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<div>
                <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                    <el-form-item label="源IP" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="目的IP" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="会话计数">
                        <el-select v-model="form.sessionCountValue" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in sessionCountOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连接速率" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入1~65535的正整数" />
                    </el-form-item>
                    <el-form-item label="连接总数" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入1~65535的正整数" />
                    </el-form-item>
                    <el-form-item>
                        <el-switch
                            v-model="form.openWarning"
                            inactive-text="开启告警">
                        </el-switch>
                        <!-- 开启告警 <el-checkbox v-model="form.openWarning"></el-checkbox> -->
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-drawer__footer bgfff">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" :loading="loading" @click="enterDialog">
					确 定
				</el-button>
			</div>
        </el-drawer>
    </div>
</template>
<script>
    import { statusArray } from '../../../utils/basicConfig'
    export default {
        name: 'ConnectionManagement',
        data() {
            return {
                searchInfo: {
                    statusValue: '',
                },
                statusOptions: [],
                tableloading: false,
                tableData: [
                    {
                        groupName: '111'
                    }
                ],
                page: 1,
				pageSize: 10,
				total: 1,
                onTotal: 0,
                // 编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogTitle: '',
                form: {
                    sessionCountValue: '1',
                    openWarning: true
                },
                rules: {
                    actionValue: [
				        { required: true, message: '动作必填' }
				    ]
                },
                direction: 'rtl',
                protocolOptions: [],
                loading: false,
                classmodel: false,
                searchInput: '',
                checked: '',
                sessionCountOption: [
                    {
                        value: '1',
                        label: '单向分别计数'
                    },
                    {
                        value: '2',
                        label: '双向汇总计数'
                    }
                ],
                
            }
        },
        created() {
            this.statusOptions = statusArray
        },  
        mounted() {
            
        },
        methods: {
            onReset() {

            },

            onSubmit() {

            },

            handleSelectionChange(val) {

            },

            handleSizeChange(val) {
			    this.pageSize = val
                this.page = 1
			    // this.getTableData()
			},
			
			handleCurrentChange(val) {
			    this.page = val
			    // this.getTableData()
			},

            changeStatusBatchFunc(status) {
                let tmptips = ''
				if (status == 0) {
					tmptips = '禁用'
				} else if (status == 1) {
					tmptips = '启用'
				}
                this.$confirm(`确定${tmptips}所选规则吗?`, '提示', {
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
                        // let tmpdata = {
                        //     "ids": this.deleteList,
                        //     "proto": 'bacnet'
                        // }
                        // deleteAllowDetail(tmpdata).then(res => {
                        //     if (res.code === 0) {
                        //         this.$message({
                        //             type: 'success',
                        //             message: res.msg
                        //         })
                        //         if (this.tableData.length === 1 && this.page > 1) {
                        //             this.page--
                        //         }
                        //         this.getTableData()
                        //     }
                        //     ctx.confirmButtonLoading = false
                        //     close();
                        // })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            deleteBatchFunc() {
                this.$confirm(`确定删除所选规则吗?`, '提示', {
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
                        // let tmpdata = {
                        //     "ids": this.deleteList,
                        //     "proto": 'bacnet'
                        // }
                        // deleteAllowDetail(tmpdata).then(res => {
                        //     if (res.code === 0) {
                        //         this.$message({
                        //             type: 'success',
                        //             message: res.msg
                        //         })
                        //         if (this.tableData.length === 1 && this.page > 1) {
                        //             this.page--
                        //         }
                        //         this.getTableData()
                        //     }
                        //     ctx.confirmButtonLoading = false
                        //     close();
                        // })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            deleteFunc() {
                this.$confirm(`确定删除该规则吗?`, '提示', {
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
                        // let tmpdata = {
                        //     "ids": this.deleteList,
                        //     "proto": 'bacnet'
                        // }
                        // deleteAllowDetail(tmpdata).then(res => {
                        //     if (res.code === 0) {
                        //         this.$message({
                        //             type: 'success',
                        //             message: res.msg
                        //         })
                        //         if (this.tableData.length === 1 && this.page > 1) {
                        //             this.page--
                        //         }
                        //         this.getTableData()
                        //     }
                        //     ctx.confirmButtonLoading = false
                        //     close();
                        // })
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
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '编辑'
            },

            initForm() {
                this.form = {

                }
            },

            closeDialog() {
                this.addDrawerFlag = false
                this.addDrawer = false
                this.dialogTitle = ''
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

            enterDialog() {

            },

            detailFunc() {

            },

            closeAutoDetectDialog() {

            },

            handleAutoDetectWrapperMousedown() {

            },

            handleAutoDetectWrapperMouseup() {

            },

            enterAutoDetectDialog() {

            },

            handleAutoDetectSelectionChange() {

            }
        }
    }
</script>
<style>
    /* .behaviorDrawer.el-drawer {
		width: 40% !important;
	}

	.behaviorDrawer .el-form.formDrawer {
		padding-top: 12px;
		padding-bottom: 12px;
	} */
</style>