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
    </div>
</template>
<script>
    import {
        getModbusList,
        deleteModbus
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
                deleteList: [],
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
				// 删除
				let tmp1 = tmpUserOperationUrl.includes('/securityPolicy/whitelistProto/modbus/delete')
				if (tmp1) {
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
            }
        }
    }
</script>