<template>
    <div class="container-padding" v-loading="studyLoading">
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" :model="studyForm">
                <el-form-item label="时间：">
                    <el-date-picker
                        v-model="startTimeValue"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="白名单策略组：">
                    <el-input v-model="form.whitelistName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button size="mini" type="primary" @click="changeStudyStatusFunc(1)" v-if="runState == 0">
                        开始学习
                    </el-button>
                    <el-button size="mini" type="primary" @click="changeStudyStatusFunc(0)" v-if="runState == 1">
                        取消学习
                    </el-button>
                    <el-button size="mini" type="primary" @click="changeStudyStatusFunc(0)" v-if="runState == 2">
                        停止学习
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="container-padding-body">
            <div class="container-padding-body-wrapper">
                <div>
                    <span class="title">白名单策略组列表</span>
                    <div style="float: right;">
                        <span style="margin-right: 10px">
                            <span style="color: #606266;font-size: 14px;">未匹配规则默认动作：</span>
                            <el-select v-model="actionValue" @change="chooseRuleActionChange" placeholder="请选择" style="width: 100px;">
                                <el-option
                                    v-for="item in actionOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                        <el-button 
                            size="mini" 
                            icon="el-icon-delete" 
                            :disabled="(userOperationUrl.deleteOperation && deleteList.length > 0) ? false : true"
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
                        <el-table-column align="left" label="名称" min-width="220" prop="name" />
                        <el-table-column align="left" label="描述" min-width="220">
                            <template #default="scope">
                                <span>{{ scope.row.description || '-' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="自定义白名单" min-width="220">
                            <template #default="scope">
                                <span>{{ scope.row.customName || '-' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="状态" min-width="160">
                            <template #default="scope">
                                <el-switch 
                                    v-model="scope.row.statusSwitch" 
                                    active-color="#F26521" 
                                    :active-value="1" 
                                    inactive-color="#DCDEE0" 
                                    :inactive-value="0"
                                    @change="changeOperationSwitch(scope.$index, scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text" 
                                    :disabled="userOperationUrl.importOperation ? false : true"
                                    @click="importFunc(scope.row)"
                                >
                                    导入
                                </el-button>
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text"
                                    :disabled="userOperationUrl.exportOperation ? false : true" 
                                    @click="exportFunc(scope.row)"
                                >
                                    导出
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
                                <el-button size="small" type="text" @click="detailFunc(scope.row)">
                                    详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="gva-pagination" v-if="this.total != 0">
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
        <el-drawer v-if="addDrawerFlag" :title="dialogTitle" :visible.sync="addDrawer" :direction="direction" :before-close="closeDialog" :wrapperClosable="false" @mousedown.native="handleWrapperMousedown" @mouseup.native="handleWrapperMouseup">
			<el-form class="formDrawer" ref="rulerGroupForm" :model="form" :rules="rules">
				<el-form-item label="名称" prop="name">
			        <el-input v-model="form.name" placeholder="请输入" />
			    </el-form-item>
                <el-form-item label="描述">
			        <el-input v-model="form.description" placeholder="请输入" />
			    </el-form-item>
                <el-form-item label="自定义白名单策略" v-if="isEdit">
                    <el-select v-model="form.customId" clearable @clear="clearProtoGroupFunc" placeholder="请选择" style="width: 100%;">
                        <el-option
                            v-for="item in protoGroupOptions"
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
        <!-- 导入 -->
        <el-dialog :visible="importDialog" title="导入" :before-close="closeImportDialog" width="500px" top="32vh">
            <el-form ref="importDialogForm" :model="importForm" label-width="120px">
                <el-form-item label="导入模式：">
                    <el-radio v-model="radio" label="1">追加</el-radio>
                    <el-radio v-model="radio" label="2">覆盖</el-radio>
			    </el-form-item>
                <el-form-item label="名称：">
                    <el-input v-model="fileName" style="width: 60%;padding-right: 12px;float: left;" />
                    <el-upload
                        class="uploadDemo"
                        accept=".xls,.xlsx"
                        action="#"
                        :multiple="false"
                        :file-list="fileList"
                        :before-upload="beforeUpload"
                        :http-request="uploadHttpRequest"
                        :on-remove="fileRemove"
                        :on-change="fileChange"
                        style="float: left;">
                        <el-button type="">浏览</el-button>
                    </el-upload>
			    </el-form-item>
            </el-form>
            <template #footer>
			    <div class="dialog-footer">
			        <el-button size="small" @click="closeImportDialog">取 消</el-button>
			        <el-button size="small" type="primary" :loading="importLoading" @click="enterImportDialog">
                        确 定
                    </el-button>
			    </div>
			</template>
        </el-dialog>
    </div>
</template>
<script>
    import {
        getWhiteList,
        addWhiteList,
        getCustomizeWhiteList,
        updateWhiteList,
        changeWhiteListStatus,
        deleteWhiteList,
        importWhiteList,
        exportWhiteList,
        getWhiteListActionQuery,
        updateWhiteListActionQuery,
        getStudyInfo,
        getStudyStatus,
        changeStudyStatus
    } from '../../../api/securityStrategy'
    import moment from 'moment'
    import store from '../../../store/index.js'

    export default {
        name: 'WhiteList',
        data() {
            return {
                studyForm: {
                    status: undefined,
                    whitelistName: ''
                },
                startTimeValue: [],
                studyLoading: false,
                runState: 0,
                tableLoading: true,
                tableData: [],
                page: 1,
				pageSize: 10,
				total: 1,
                // 新增、编辑
                addDrawerFlag: false,
                addDrawer: false,
                dialogTitle: '新增',
                form: {
                    name: '',
                    description: '',
                    customId: undefined
                },
                rules: {
                    name: [
				        { required: true, message: '名称必填' }
				    ]
                },
                isEdit: false,
				direction: 'rtl',
				loading: false,
                protoGroupOptions: [],
                classmodel: false,
                // 导入
                importDialog: false,
                radio: '1',
                importForm: {},
                importLoading: false,
                fileList: [],
                fileName: '',
                choosedRow: {},
                customFile: '',
                actionOptions: [
                    {
                        value: 0,
                        label: '允许'
                    },
                    {
                        value: 1,
                        label: '告警'
                    },
                    {
                        value: 2,
                        label: '阻断'
                    }
                ],
                actionValue: undefined,
                deleteList: [],
                workingIntervalFunc: null,
                userOperationUrl: {}
            }
        },
        watch: {
            '$store.state.studyData.studyData': {
                handler(newVal, oldVal) {
                    console.log(newVal)
                    // return
                    if (newVal == 0) {
                        // this.form.startTime = ''
                        // this.form.endTime = ''
                        this.form.whitelistName = 'xieyi' + moment().format('YYYYMMDDHHmmss')
                        // this.baseLineGroup = 'jixian' + moment().format('YYYYMMDDHHmmss')
                        this.runState = 0
                    } else if (newVal == 1) {
                        this.runState = 1
                        // this.getWorkingModelShowFunc(1)
                    } else if (newVal == 2) {
                        this.runState = 2
                        // this.getWorkingModelShowFunc(1)
                    }
                },
                deep: true
            },
        },
        created() {
            this.getStudyInfoFunc()
            this.getStudyStatusFunc()
            this.form.whitelistName = 'xieyi' + moment().format('YYYYMMDDHHmmss')
            this.$store.commit('studyData/setStudyData', this.runState);
            this.getTableData()
            this.getWhiteListActionQueryFunc()
            // 权限判断
			let tmpUserOperationUrl = JSON.parse(localStorage.getItem('userOperation'))
			if (tmpUserOperationUrl) {
				// 新增
				let tmp1 = tmpUserOperationUrl.includes('/securityPolicy/whitelist/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
                // 删除
                let tmp2 = tmpUserOperationUrl.includes('/securityPolicy/whitelist/delete')
                
				if (tmp2) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
                // 编辑
                let tmp3 = tmpUserOperationUrl.includes('/securityPolicy/whitelist/update')
				if (tmp3) {
					this.userOperationUrl.editOperation = true
				} else {
					this.userOperationUrl.editOperation = false
				}
                // 导入
                let tmp4 = tmpUserOperationUrl.includes('/securityPolicy/whitelist/import')
                if (tmp4) {
                    this.userOperationUrl.importOperation = true
                } else {
                    this.userOperationUrl.importOperation = false
                }
                // 导出
                let tmp5 = tmpUserOperationUrl.includes('/securityPolicy/whitelist/export')
                if (tmp5) {
                    this.userOperationUrl.exportOperation = true
                } else {
                    this.userOperationUrl.exportOperation = false
                }
            }
        },  
        mounted() {
            
        },
        methods: {
            async getStudyInfoFunc() {
                let res = await getStudyInfo()
                if (res.code === 0) {
                    // if (res.data.status == 1 || res.data.status == 2) {
                        this.startTimeValue = [res.data.startTime, res.data.endTime]
                        this.form = res.data
                    // } else {
                        this.form.whitelistName = 'xieyi' + moment().format('YYYYMMDDHHmmss')
                    // }
                }
            },

            getStudyStatusFunc() {
                this.workingIntervalFunc = window.setInterval(() =>{
                    getStudyStatus().then(res => {
                        if (res.code == 0) {
                            this.studyLoading = false
                            store.dispatch("studyData/updateIOTTagConfig", res.data);
                        }
                    })    
                }, 3000);
            },

            async changeStudyStatusFunc(flag) {
                if (!this.startTimeValue || this.startTimeValue.length < 1) {
                    this.$message({
                        type: 'warning',
                        message: '请选择学习时间'
                    })
                    return
                }
                let tmpdata = {
                    "startTime": moment(this.startTimeValue[0]).format('YYYY-MM-DD HH:mm:ss'),
                    "endTime": moment(this.startTimeValue[1]).format('YYYY-MM-DD HH:mm:ss'),
                    "whitelistName": this.form.whitelistName,
                    "flag": flag
                }
                let res = await changeStudyStatus(tmpdata)
                if (res.code === 0) {
                    this.getStudyInfoFunc()
                }
            },

            async getWhiteListActionQueryFunc() {
                let res = await getWhiteListActionQuery()
                if (res.code === 0) {
                    this.actionValue = res.data
                }
            },

            async getTableData() {
                let tmpdata = {
                    "type": 0,
					"page": this.page,
					"pageSize": this.pageSize
				}
                let res = await getWhiteList(tmpdata)
                if (res.code === 0) {
                    if(res.data.list && res.data.list.length > 0) {
                        res.data.list.forEach((value, i) => {
                            value.statusSwitch = value.status
                        })
                    }
                    this.tableLoading = false
                    this.tableData = res.data.list
                    this.total = res.data.total
                } else {
                    this.tableLoading = false
                }
            },

            deleteFunc() {
                this.$confirm(`确定要删除当前策略组?`, '提示', {
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
                            "type": 0
                        }
                        deleteWhiteList(tmpdata).then(res => {
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
                this.dialogTitle = '新增'
                this.isEdit = false
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

            initForm() {
                this.form = {
                    name: '',
                    description: '',
                    customId: undefined
                }
            },

            closeDialog() {
                this.$refs.rulerGroupForm.resetFields()
                this.addDrawerFlag = false
                this.addDrawer = false
                this.isEdit = false
                this.initForm()
            },

            enterDialog() {
                this.$refs.rulerGroupForm.validate(async valid => {
                    if (valid) {
                        this.loading = true
                        this.form.type = 0
                        if (this.isEdit) {
                            let res = await updateWhiteList(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                                this.closeDialog()
                                this.loading = false
                            } else {
                                this.loading = false
                            }
                        } else {                            
                            let res = await addWhiteList(this.form)
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                                this.closeDialog()
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
					this.addDrawer = false
				}else{
					this.addDrawerFlag = true
                    this.$nextTick(() => {
                        this.addDrawer = true
                    })
				}
				this.classmodel = false
			},

            changeOperationSwitch(rowindex, row) {
                let tmp = JSON.parse(JSON.stringify(this.tableData))
                tmp[rowindex].statusSwitch = row.statusSwitch
				this.tableData = tmp
                let tmptips = false
                if (row.statusSwitch == '1') {
                    try {
                        this.tableData.forEach((v, i) => {
                            if (v.status == 1) {
                                tmptips = true
                                throw Error();
                            }
                        })
                    } catch(e) {}
                }
                if (tmptips == true) {
                    this.$message({
                        type: 'warning',
                        message: '白名单策略同时只能启用一条',
                        showClose: true
                    })
                    tmp[rowindex].statusSwitch = '0'
                    return
                }
                let tmpStatusText = ''
                if (row.statusSwitch == '1') {
                    tmpStatusText = '启用'
                } else {
                    tmpStatusText = '禁用'
                }
                this.$confirm(`确定要${tmpStatusText}当前白名单策略组吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
                    beforeClose: (action, ctx, close) => {
                        if (action !== 'confirm') {
                            close();
                            return;
                        }
                        row.status = parseInt(row.statusSwitch)
                        ctx.confirmButtonLoading = true;
                        changeWhiteListStatus(row).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    showClose: true
                                })
                                this.getTableData()
                            } else {
                                this.getTableData()
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
				}).then(async() => {
                    
                }).catch(() => {
                    this.getTableData()
                })
            },

            importFunc(row) {
                this.importDialog = true
                this.choosedRow = row
            },

            beforeUpload(file) {
                //文件类型
                const isType = file.type === 'application/vnd.ms-excel'
                const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                const fileType = isType || isTypeComputer
                if(!fileType) {
                    this.$message.error('上传文件只能是xls/xlsx格式！')
                }
                return fileType;
            },

            uploadHttpRequest(param) {
                this.customFile = param.file
            },

            fileRemove(file, fileList) {

            },

            fileChange(file, fileList) {
                this.fileName = file.name
                this.fileList = fileList
            },

            clearUploadMsg() {
                this.fileName = ''
                this.radio = '1'
                this.fileList = []
            },

            closeImportDialog() {
                this.importDialog = false
                this.clearUploadMsg()
            },

            async enterImportDialog() {
                if (!this.fileList || this.fileList.length <= 0) {
                    this.$message.warning('请点击浏览按钮上传所需要上传的文件')
                    return
                }
                const data = new FormData()
                const fileUps = this.customFile
                data.append('file', fileUps)
                data.append('id', this.choosedRow.id)
                data.append('status', this.radio)
                this.importLoading = true
                let res = await importWhiteList(data)
                if (res.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        showClose: true
                    })
                    this.importLoading = false
                } else {
                    this.importLoading = false
                }
                this.importDialog = false
                this.clearUploadMsg()
            },
            async exportFunc(row) {
                let res = await exportWhiteList({ id: row.id })
                let filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
                const blob = new Blob([res.data], {
                    type: "application/vnd.ms-excel"
                });
                let link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', window.decodeURI(filename));
                link.click();
                link = null;
                this.$message.success('导出成功');
            },

            editFunc(row) {
                this.isEdit = true
                this.getCustomizeWhiteList()
                this.dialogTitle = '编辑'
                let copy = Object.assign({}, row)
				this.form = copy
                if (this.form.customId == 0) {
                    this.form.customId = undefined
                }
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
            },

            async getCustomizeWhiteList() {
                let res = await getCustomizeWhiteList()
                if (res.code === 0) {
                    if (res.data && res.data.length > 0) {
                        let tmparray = []
                        res.data.forEach((v, i) => {
                            let tmplistdata = {}
                            tmplistdata.value = v.id
                            tmplistdata.label = v.name
                            tmparray.push(tmplistdata)
                        })
                        this.protoGroupOptions = tmparray
                    } else {
                        this.protoGroupOptions = []
                    }
                }
            },

            detailFunc(row) {
                this.$router.push({path:'/rulerGroup/detail', query:{ id: row.id }})
            },

            chooseRuleActionChange() {
                let tmpTips = ''
                if (this.actionValue == 0) {
                    tmpTips = '设置允许后白名单之外流量允许通过不产生日志'
                } else if (this.actionValue == 1) {
                    tmpTips = '设置告警后白名单之外流量只产生日志不阻断'
                } else {
                    tmpTips = '设置阻断后白名单之外流量进行阻断并产生日志'
                }
                this.$confirm(tmpTips, '提示', {
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
                            "action": this.actionValue
                        }
                        updateWhiteListActionQuery(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            clearProtoGroupFunc() {
                this.form.customId = undefined
            }
        },

        beforeDestroy() {
            // 页面销毁时关闭ws连接
            // console.log('xiaohui')
            window.clearInterval(this.workingIntervalFunc)
            this.workingIntervalFunc = null
        }
    }
</script>
<style>
    .uploadDemo .el-upload-list__item {
        transition: none !important;
        display: none;
    }
</style>