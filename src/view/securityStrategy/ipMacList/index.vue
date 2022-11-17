<template>
    <div class="container-padding">
        <div class="container-padding-search">
            <el-form class="container-padding-search-form2" ref="searchForm" :inline="true" v-model="searchInfo">
                <el-form-item label="IP地址：">
                    <el-input v-model="searchInfo.ruleCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="MAC地址：">
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
                    <span class="title">IP-MAC绑定列表</span>
                    <div style="float: right;">
                        <span style="margin-right: 10px">
                            <span style="color: #606266;font-size: 14px;">处理措施：</span>
                            <el-select v-model="handingMeasureValue" placeholder="请选择" style="width: 100px;">
                                <el-option
                                    v-for="item in handingMeasureOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                        <span style="margin-right: 10px">
                            <span style="color: #606266;font-size: 14px;">未知设备：</span>
                            <el-select v-model="unknowValue" placeholder="请选择" style="width: 100px;">
                                <el-option
                                    v-for="item in handingMeasureOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                        <el-button size="mini" icon="el-icon-delete" @click="changeStatusBatchFunc(0)">
                            禁用
                        </el-button>
                        <el-button size="mini" icon="el-icon-delete" @click="changeStatusBatchFunc(1)">
                            启用
                        </el-button>
                        <el-button size="mini" icon="el-icon-delete" @click="autoDetectFunc">
                            自动探测
                        </el-button>
                        <el-button size="mini" icon="el-icon-delete" @click="deleteFunc">
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
                        <el-table-column align="left" label="IP地址" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="MAC地址" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="描述" min-width="160" prop="groupName" />
                        <el-table-column align="left" label="策略来源" min-width="160" prop="groupName" />
                        <!-- <el-table-column align="left" fixed="right" label="操作" width="200">
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
                        </el-table-column> -->
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
                    <el-form-item label="IP地址" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="MAC地址" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="动作">
                        <el-select v-model="form.actionValue" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in handingMeasureOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入" />
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
        <!-- 自动探测 -->
        <el-drawer v-if="autoDetectDrawerFlag" title="自动探测" :visible.sync="autoDetectDrawer" :direction="direction" :before-close="closeAutoDetectDialog" :wrapperClosable="false" @mousedown.native="handleAutoDetectWrapperMousedown" @mouseup.native="handleAutoDetectWrapperMouseup">
            <div>
                <el-form class="formDrawer" ref="autoDetectForm" :model="autoDetectForm" :rules="autoDetectRules">
                    <el-form-item label="网口" prop="protoIdentificationId">
                        <el-select v-model="autoDetectForm.networkValue" placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="item in networkOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址范围" prop="protoIdentificationId">
                        <el-input v-model="form.groupName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" @click="onReset">
                            开始探测
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-table
                            :data="autoDetectTableData"
                            @selection-change="handleAutoDetectSelectionChange"
                            :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                            class="tableStyle tableFixedStyle">
                            <el-table-column type="selection" align="center" width="55" />
                            <el-table-column align="left" label="IP地址" min-width="160" prop="groupName" />
                            <el-table-column align="left" label="MAC地址" min-width="160" prop="groupName" />
                        </el-table>
                    </el-form-item>
                </el-form>
            </div>
            <div class="form-drawer__footer bgfff">
				<el-button @click="closeAutoDetectDialog">取 消</el-button>
				<el-button type="primary" :loading="autoDetectLoading" @click="enterAutoDetectDialog">
					确 定
				</el-button>
			</div>
        </el-drawer>
    </div>
</template>
<script>
    import { statusArray, handingMeasureArray } from '../../../utils/basicConfig'
    export default {
        name: 'IpMacList',
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
                    actionValue: ''
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
                handingMeasureOption: [],
                handingMeasureValue: '',
                unknowValue: '',
                // 自动探测
                autoDetectDrawerFlag: false,
                autoDetectDrawer: false,
                autoDetectLoading: false,
                autoDetectForm: {

                },
                autoDetectRules: {
                    networkValue: ''
                },
                networkOption: [
                    {
                        id: '1',
                        value: 'ETH0'
                    },
                    {
                        id: '2',
                        value: 'ETH1'
                    },
                    {
                        id: '3',
                        value: 'ETH2'
                    },
                    {
                        id: '4',
                        value: 'ETH3'
                    },
                    {
                        id: '5',
                        value: 'ETH4'
                    },
                    {
                        id: '6',
                        value: 'ETH5'
                    }
                ],
                networkValue: '',
                autoDetectTableData: []
            }
        },
        created() {
            this.statusOptions = statusArray
            this.handingMeasureOption = handingMeasureArray
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

            autoDetectFunc() {
                this.autoDetectDrawerFlag = true
                this.$nextTick(() => {
                    this.autoDetectDrawer = true
                })
            },

            deleteFunc() {
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

            addFunc() {
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '添加绑定列表'
            },

            // editFunc() {
            //     this.addDrawerFlag = true
            //     this.$nextTick(() => {
            //         this.addDrawer = true
            //     })
            //     this.dialogTitle = '编辑绑定列表'
            // },

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