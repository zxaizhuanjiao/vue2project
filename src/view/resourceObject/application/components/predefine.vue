<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="应用名称：">
                    <el-input v-model="searchInfo.name" placeholder="请输入"></el-input>
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
                    <span class="title">预定义列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.changeStatusOperation && changeStatusList.length > 0) ? false : true"
                            @click="changeStatusBatchFunc(0)">
                            禁用
                        </el-button>
                        <el-button 
                            size="mini" 
                            :disabled="(userOperationUrl.changeStatusOperation && changeStatusList.length > 0 )? false : true"
                            @click="changeStatusBatchFunc(1)">
                            启用
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
                        <el-table-column align="left" label="端口号" min-width="100" prop="port" />
                        <el-table-column align="left" label="状态" min-width="100">
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
                        <el-table-column align="left" label="引用计数" min-width="120" prop="referenceCount" />
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
    </div>
</template>
<script>
    import {
        getPredefinedAppList,
        changePredefinedAppStatus
    } from '../../../../api/resourceObject'

    export default {
        name: 'ApplicationPredefine',
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
                    name: ''
                },
                tableLoading: true,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 1,
                changeStatusList: [],
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
				// 停用、启用
				let tmp1 = tmpUserOperationUrl.includes('/resourceObj/resourceApp/predefined/statusChange')
				if (tmp1) {
					this.userOperationUrl.changeStatusOperation = true
				} else {
					this.userOperationUrl.changeStatusOperation = false
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
                let res = await getPredefinedAppList(tmpdata)
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

            handleSelectionChange(val) {
                let tmpList = []
                if (val && val.length > 0) {
                    tmpList = val.map(v=>v.id)
                }
                this.changeStatusList = tmpList
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
                        let tmpdata = {
                            "ids": this.changeStatusList,
                            "status": status
                        }
                        changePredefinedAppStatus(tmpdata).then(res => {
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
            }
        }
    }
</script>