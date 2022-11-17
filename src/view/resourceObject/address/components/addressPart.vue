<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="名称：">
                    <el-input v-model="searchInfo.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="IP地址：">
                    <el-input v-model="searchInfo.ip" placeholder="请输入"></el-input>
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
                    <span class="title">地址列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini" 
                            icon="el-icon-delete" 
                            :disabled="(userOperationUrl.deleteOperation && deleteList.length > 0) ? false : true"
                            @click="deleteFunc"
                        >
                            删除
                        </el-button>
                        <el-button 
                            size="mini" 
                            icon="el-icon-plus" 
                            type="primary"
                            :disabled="userOperationUrl.addOperation ? false : true"
                            @click="addFunc"
                        >
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
                        <el-table-column align="left" label="名称" min-width="160" prop="name" />
                        <el-table-column align="left" label="IP地址" min-width="160" prop="ipRange" />
                        <el-table-column align="left" label="引用计数" min-width="160" prop="referenceCount" />
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
        <el-drawer v-if="addDrawerFlag" custom-class="timePartStyle" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="IP地址/范围" required>
                    <el-input v-model="form.address" placeholder="请输入" @keyup.enter.native="watchAddressInput()" />
                    <div style="font-size: 12px;color: red;">
                        IP地址/范围输入后按回车键继续输入
                    </div>
                    <div style="color: #606266;font-size: 12px;line-height: 16px;font-weight: 400;">
                        每行可配置一个IP地址范围 <br />
                        示例：<br />
                        10.10.1.2 <br />
                        10.10.1.2/255.255.255.0 <br />
                        10.10.1.2/32 <br />
                        10.10.1.2-10.10.1.10
                    </div>
                </el-form-item>    
                <!-- <div v-for="item, index in form.addressIpRange" :key="index">
                    <el-form-item label="IP地址/范围" :rules="rules.address" :prop="'addressIpRange.'+index+'.address'">
                        <el-input v-model="item.address" placeholder="请输入" @keyup.enter.native="watchAddressInput()" style="width: 80%" />
                        <i class="el-icon-plus" style="color: #606266;padding: 0 12px;cursor: pointer;" @click="addAddressFunc"></i>
                    </el-form-item>    
                </div> -->
                <div class="address-show-style" v-if="form.addressIpRange && form.addressIpRange.length > 0">
                    <div v-for="item, index in form.addressIpRange" :key="index" style="padding-bottom: 10px;">
                        {{ item.content }}
                        <i class="el-icon-close" @click="deleteAddressFunc(item, index)"></i>
                    </div>
                </div>
			</el-form>
			<div class="form-drawer__footer bgfff" style="width: 560px;">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="enterDialog" :loading="loading">
					确 定
				</el-button>
			</div>
		</el-drawer>
    </div>
</template>
<script>
    import {
        getAddressList,
        addAddress,
        updateAddress,
        deleteAddress,
        getAddressDetail
    } from '../../../../api/resourceObject'

    export default {
        name: 'AddressPart',
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
                    ip: ''
                },
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
                dialogTitle: '',
                form: {
                    name: '',
                    address: '',
                    addressIpRange: []
                },
                rules: {
                    name: [
                        { required: true, message: '名称必填' }
                    ],
                    // address: [
				    //     { required: true, message: 'ip地址/范围必填' },
                    //     { validator: validateIp }
				    // ]
                },
                addressIpRange: [],
                direction: 'rtl',
                loading: false,
                classmodel: false,
                weekCycleOptions: [],
                dateValue: [],
                timeValue: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
                isEdit: false,
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
				// 新增
				let tmp1 = tmpUserOperationUrl.includes('/resourceObj/resourceAddress/address/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
                // 删除
                let tmp2 = tmpUserOperationUrl.includes('/resourceObj/resourceAddress/address/delete')
				if (tmp2) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
                // 编辑
                let tmp3 = tmpUserOperationUrl.includes('/resourceObj/resourceAddress/address/update')
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
                    "name": this.searchInfo.name,
                    "ip": this.searchInfo.ip,
                    "page": this.page,
                    "pageSize": this.pageSize
                }
                let res = await getAddressList(tmpdata)
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
                    name: '',
                    addressIpRange: ''
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
                this.$confirm(`确定删除地址吗?`, '提示', {
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
                        deleteAddress(tmpdata).then(res => {
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
                this.dialogTitle = '添加'
            },

            editFunc(row) {
                this.getAddressDetailFunc(row.id)
                this.isEdit = true
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '编辑'
            },

            async getAddressDetailFunc(id) {
                let res = await getAddressDetail(id)
                if (res.code === 0) {
                    this.form = res.data.resourceAddress
                }
            },

            initForm() {
                this.form = {}
                this.dialogTitle = ''
                this.isEdit = false
                this.form.addressIpRange = []
                this.loading = false
            },

            closeDialog() {
                this.initForm()
                this.addDrawerFlag = false
                this.addDrawer = false
            },

            handleWrapperMousedown(e) {
				// 如果为true，则表示点击发生在遮罩层
      			this.classmodel= !!e.target.classList.contains('el-drawer__container')
			},

			handleWrapperMouseup(e) {
				if ((!!e.target.classList.contains('el-drawer__container')) && this.classmodel){
					this.initForm()
                    this.addDrawerFlag = false
					this.addDrawer = false
				} else {
					this.addDrawerFlag = true
                    this.$nextTick(() => {
                        this.addDrawer = true
                    })
				}
				this.classmodel = false
			},

            watchAddressInput() {
                if (!this.form.address || this.form.address == '') {
                    this.$message({
                        type: 'warning',
                        message: 'IP地址/范围必填',
                        showClose: true
                    })
                    return
                }
                let tmpTips1 = false
                let tmpTips2 = false
                let tmpTips3 = false
                if (this.form.address.indexOf('-') !== -1) {
                    const reg = /^((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\-(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d))$/
                    if (reg.test(this.form.address)) {
                        
                    } else {
                        tmpTips1 = true
                    }
                } else if (this.form.address.indexOf('/') !== -1) {
                    const reg = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2]|((254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)))$/
                    if (reg.test(this.form.address)) {
                        
                    } else {
                        tmpTips2 = true
                    }
                } else {
                    const reg = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/
                    if (reg.test(this.form.address)) {
                        
                    } else {
                        tmpTips3 = true
                    }
                }

                if (tmpTips1 || tmpTips2 || tmpTips3) {
                    this.$message({
                        type: 'warning',
                        message: 'IP格式不正确',
                        showClose: true
                    })
                    return
                }
                
                let tmpdata = {
                    content: this.form.address
                }
                this.form.addressIpRange.push(tmpdata)
                this.form.address = ''
            },

            deleteAddressFunc(item, index) {
                const itemList = this.form.addressIpRange.indexOf(item)
				if (itemList !== -1) {
					this.form.addressIpRange.splice(index, 1)
				}
            },

            enterDialog() {
                this.$refs.form.validate(async valid => {
					if (valid) {
                        if (!this.form.addressIpRange || this.form.addressIpRange.length < 1) {
                            this.$message({
                                type: 'warning',
                                message: 'IP地址/范围不为空',
                                showClose: true
                            })
                            return
                        }
                        if (this.isEdit) {
                            // 编辑
                            this.loading = true
                            let res = await updateAddress(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.loading = false
                                this.getTableData()
                                this.closeDialog()
                            } else {
                                this.loading = false
                            }
                        } else {
                            // 新增
                            this.loading = true
                            let res = await addAddress(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.loading = false
                                this.getTableData()
                                this.closeDialog()
                            } else {
                                this.loading = false
                            }
                        }
                    }
                })
            },
        }
    }
</script>
<style>
    .timePartStyle.el-drawer {
        width: 560px !important;
    }

    .address-show-style {
        border: 1px solid #DCDFE6;
        border-radius: 2px;
        background-color: #F5F7FA;
        padding: 10px 10px 0;
        margin-bottom: 60px;
        color: #606266;
        font-size: 14px;
    }
</style>