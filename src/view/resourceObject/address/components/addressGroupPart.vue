<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="地址组名称：">
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
                    <span class="title">地址组列表</span>
                    <div style="float: right;">
                        <el-button 
                            size="mini" 
                            icon="el-icon-delete" 
                            :disabled="(userOperationUrl.deleteOperation && this.deleteList.length > 0) ? false : true"
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
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{ background:'#F5F7FA', color:'#303133' }"
                        class="tableStyle tableFixedStyle">
                        <el-table-column type="selection" align="center" width="55" />
                        <el-table-column align="left" label="地址组名称" min-width="160" prop="name" />
                        <el-table-column align="left" label="描述" min-width="160">
                            <template #default="scope">
                                {{ scope.row.description || '--' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="地址对象" min-width="160">
                            <template #default="scope">
                                <span v-for="item in scope.row.address" :key="item.id">
                                    <span @click="editAddressFunc(item)" style="color: #F26521;cursor: pointer;">
                                        {{ item.name + ',' }}
                                    </span>
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
                                    :disabled="userOperationUrl.editOperation ? false : true"
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
        <!-- 新增、编辑 -->
        <el-drawer v-if="addDrawerFlag" custom-class="behaviorDrawer" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<div>
                <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="form.description" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="引用地址" prop="addressIds">
                        <div style="border: 1px solid #DCDFE6;overflow: hidden;">
                            <div style="width: 49.8%;float: left;border-right: 1px solid #DCDFE6;">
                                <div style="border-bottom: 1px solid #DCDFE6;padding: 2px 12px;">
                                    可选：{{ addressArray.length }}
                                </div>
                                <div style="padding: 8px 12px;">
                                    <el-input
                                        placeholder="请输入内容"
                                        v-model="searchInput">
                                        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTimeFunc"></i>
                                    </el-input>
                                    <el-checkbox-group v-model="form.addressIds">
                                        <el-checkbox v-for="item in addressArray" :label="item" :key="item.id" style="display: block;">
                                            {{ item.name }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>
                            <div style="width: 50%;float: left">
                                <div style="border-bottom: 1px solid #DCDFE6;padding: 2px 12px;">
                                    已选：{{ form.addressIds.length }}
                                </div>
                                <div style="padding: 8px 12px;">
                                    <div v-for="item, index in form.addressIds" :key="item.id">
                                        <span>{{ item.name }}</span>
                                        <span v-if="item.id" style="float: right;cursor: pointer;" @click="deleteChoosedAddressFunc(item, index)">
                                            <i class="el-icon-close"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        <!-- 地址组编辑 -->
        <el-dialog title="修改" :visible.sync="editAddressVisible" width="40%" :before-close="handleClose">
            <div>
                <EditAddress :addressDataDetail="addressDataDetail" ref="receiveFormData" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">
                    取 消
                </el-button>
                <el-button type="primary" :loading="editAddressLoading" @click="enterAddressDialog">
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {
        getAllAddressList,
        getAddressGroupList,
        addAddressGroup,
        updateAddressGroup,
        deleteAddressGroup,
        getAddressGroupDetail,
        getAddressDetail,
        updateAddress
    } from '../../../../api/resourceObject'
    import EditAddress from './subComponents/editAddress.vue'

    export default {
        name: 'AddressGroupPart',
        components: {
            EditAddress
        },
        props: {
            activeName: {
                default: function() {
					return ''
				}
            }
		},
        data() {
            var validateType = (rule, value, callback) => {
                if (value && value.length > 0) {
                    callback()
                } else {
                    callback('引用地址必填')
                }
            }
            return {
                searchInfo: {
                    name: '',
                    ip: ''
                },
                tableLoading: false,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 1,
                onTotal: 0,
                // 编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogTitle: '',
                form: {
                    name: '',
                    description: '',
                    addressIds: []
                },
                rules: {
                    name: [
				        { required: true, message: '名称必填' }
				    ],
                    addressIds: [
                        { required: true, message: '引用地址必填' },
                        { validator: validateType }
                    ]
                },
                direction: 'rtl',
                protocolOptions: [],
                loading: false,
                classmodel: false,
                searchInput: '',
                checked: '',
                addressArray: [],
                checkedAddress: [],
                deleteList: [],
                userOperationUrl: {},
                // 修改地址
                editAddressVisibleFlag: false,
                editAddressVisible: false,
                addressDataDetail: {},
                editAddressLoading: false
            }
        },
        watch: {
            'activeName': {
                handler: function(val, oldval) {
                    if (val == 'second') {
                        this.getTableData()
                        // 获取所有地址
                        this.getAllAddressListFunc()
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
				let tmp1 = tmpUserOperationUrl.includes('/resourceObj/resourceAddress/addressGroup/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
                // 删除
                let tmp2 = tmpUserOperationUrl.includes('/resourceObj/resourceAddress/addressGroup/delete')
				if (tmp2) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
                // 编辑
                let tmp3 = tmpUserOperationUrl.includes('/resourceObj/resourceAddress/addressGroup/update')
				if (tmp3) {
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
                    "ip": this.searchInfo.ip,
                    "page": this.page,
                    "pageSize": this.pageSize
                }
                let res = await getAddressGroupList(tmpdata)
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
                this.$confirm(`确定删除所选地址组吗?`, '提示', {
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
                        deleteAddressGroup(tmpdata).then(res => {
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

            // 获取所有地址
            async getAllAddressListFunc() {
                let tmpdata = {
                    "name": this.searchInput
                }
                let res = await getAllAddressList(tmpdata)
                if (res.code === 0) {
                    this.addressArray = res.data.list
                }
            },

            deleteChoosedAddressFunc(item, index) {
                const itemList = this.form.addressIds.indexOf(item)
				if (itemList !== -1) {
					this.form.addressIds.splice(index, 1)
				}
            },

            addFunc() {
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '添加'
            },

            editFunc(row) {
                this.getAddressGroupDetailFunc(row.id)
                this.isEdit = true
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '编辑'
            },

            async getAddressGroupDetailFunc(id) {
                let res = await getAddressGroupDetail(id)
                if (res.code === 0) {
                    if (res.data.resourceAddressGroup) {
                        if (res.data.resourceAddressGroup.addressIds && res.data.resourceAddressGroup.addressIds.length > 0) {
                            let tmpAddressArray = res.data.resourceAddressGroup.addressIds
                            var newArr = this.addressArray.filter(item => {
                                // 将arr的所有id集合的数组赋值给临时数组,
                                //map()会返回一个新数组,并且不会影响原数组
                                let arrlist = tmpAddressArray.map(item2 => item2)
                                // 返回所有临时数组中没有item.id的item
                                return arrlist.includes(item.id)
                            })
                            res.data.resourceAddressGroup.addressIds = newArr
                        }
                    }
                    this.form = res.data.resourceAddressGroup
                }
            },

            initForm() {
                this.form = {
                    name: '',
                    description: '',
                    addressIds: []
                }
                this.searchInput = ''
                this.dialogTitle = ''
                this.isEdit = false
                this.loading = false
            },

            closeDialog() {
                this.initForm()
                this.addDrawerFlag = false
                this.addDrawer = false
            },

            searchTimeFunc() {
                this.getAllAddressListFunc()
            },

            enterDialog() {
                this.$refs.form.validate(async valid => {
					if (valid) {
                        this.loading = true
                        if (this.isEdit) {
                            this.form.addressIds = this.form.addressIds.map(item => { return item.id })
                            let res = await updateAddressGroup(this.form)
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
                            this.form.addressIds = this.form.addressIds.map(item => { return item.id })
                            let res = await addAddressGroup(this.form)
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

            editAddressFunc(row) {
                this.getAddressDetailFunc(row.id)
            },

            async getAddressDetailFunc(id) {
                let res = await getAddressDetail(id)
                if (res.code === 0) {
                    this.addressDataDetail = res.data.resourceAddress
                    this.editAddressVisible = true
                }
            },

            handleClose() {
                this.editAddressVisible = false
            },

            // 修改地址
            async enterAddressDialog() {
                console.log()
                // this.$refs.form.validate(async valid => {
					// if (valid) {
                    let tmpdata = this.$refs.receiveFormData.emitFormData()
                        if (!tmpdata.addressIpRange || tmpdata.addressIpRange.length < 1) {
                            this.$message({
                                type: 'warning',
                                message: 'IP地址/范围不为空',
                                showClose: true
                            })
                            return
                        }
                        // 编辑
                        this.editAddressLoading = true
                        let res = await updateAddress(tmpdata)
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.msg,
                                showClose: true
                            })
                            this.editAddressLoading = false
                            this.getTableData()
                            this.handleClose()
                        } else {
                            this.editAddressLoading = false
                        }
                    // }
                // })
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