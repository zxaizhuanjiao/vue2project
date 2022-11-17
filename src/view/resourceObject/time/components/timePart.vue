<template>
    <div>
        <div class="container-padding-search">
            <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="名称：">
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
                    <span class="title">时间列表</span>
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
                        <el-table-column align="left" label="名称" min-width="160" prop="name" />
                        <el-table-column align="left" label="开始时间" min-width="160" prop="tmpStartTime" />
                        <el-table-column align="left" label="结束时间" min-width="160" prop="tmpEndTime" />
                        <el-table-column align="left" label="每周循环" :show-overflow-tooltip="true" min-width="160">
                            <template #default="scope">
                                <div v-if="scope.row.weekDayStrArray && scope.row.weekDayStrArray.length > 0">
                                    <span v-for="item in scope.row.weekDayStrArray" :key="item.id" style="font-size: 12px;margin-right: 2px;">
                                        {{ item }}
                                    </span>
                                </div>
                                <div v-else>
                                    --
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="每月循环" :show-overflow-tooltip="true" min-width="160">
                            <template #default="scope">
                                <div v-if="scope.row.monthDayStrArray && scope.row.monthDayStrArray.length > 0">
                                    <span v-for="item in scope.row.monthDayStrArray" :key="item.id" style="font-size: 12px;margin-right: 2px;">
                                        {{ item }}
                                    </span>    
                                </div>
                                <div v-else>
                                    --
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="引用计数" min-width="160" prop="referenceCount" />
                        <el-table-column align="left" fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button
                                    class="rulerDisabledBtn" 
                                    size="small" 
                                    type="text" 
                                    :disabled="userOperationUrl.editOperation ? false: true"
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
                <el-form-item label="类型" prop="type" required>
                    <div style="background: #F5F7FA;padding: 4px 10px;">
                        <el-radio-group v-model="form.type">
                            <el-radio :label="1">固定日期</el-radio>
                            <el-radio :label="2">按周循环</el-radio>
                            <el-radio :label="3">按月循环</el-radio>
                        </el-radio-group>
                    </div>
                    <div style="padding-top: 10px;">
                        <div v-if="form.type == 1">
                            <el-date-picker
                                v-model="dateValue"
                                :clearable="false"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                >
                            </el-date-picker>
                        </div>
                        <div v-if="form.type == 2">
                            <el-select v-model="weekCycleValue" multiple collapse-tags placeholder="请选择" style="width: 30%;">
                                <el-option
                                    v-for="item in weekCycleOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <span style="display: inline-block;width: 2%;">&nbsp;</span>
                            <el-date-picker
                                v-model="weekTimeValue"
                                :clearable="false"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width: 68%;">
                            </el-date-picker>
                        </div>
                        <div v-if="form.type == 3">
                            <el-select v-model="monthCycleValue" multiple collapse-tags placeholder="请选择" style="width: 30%;">
                                <el-option
                                    v-for="item in monthCycleOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <span style="display: inline-block;width: 2%;">&nbsp;</span>
                            <el-date-picker
                                v-model="monthTimeValue"
                                :clearable="false"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width: 68%;">
                            </el-date-picker>
                        </div>
                    </div>
                </el-form-item>
			</el-form>
			<div class="form-drawer__footer" style="width: 560px;">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="enterDialog" :loading="loading">
					确 定
				</el-button>
			</div>
		</el-drawer>
    </div>
</template>
<script>
    import { weekPartArray, monthPartArray } from '../../../../utils/time'
    import {
        getTimeList,
        addTime,
        deleteTime,
        getTimeDetail,
        updateTime
    } from '../../../../api/resourceObject'
    import moment from 'moment'

    export default {
        name: 'TimePart',
        props: {
            activeName: {
                default: function() {
					return ''
				}
            }
		},
        data() {
            var validateType = (rule, value, callback) => {
                if (value == 1) {
                    if (this.dateValue && this.dateValue.length > 0) {
                        callback()
                    } else {
                        callback('请选择开始日期和结束日期')
                    }
                } else if (value == 2) {
                    if ((this.weekCycleValue && this.weekCycleValue.length > 0) && (this.weekTimeValue && this.weekTimeValue.length > 0)) {
                        callback()
                    } else {
                        callback('请选择时间和日期')
                    }
                } else if (value == 3) {
                    if ((this.monthCycleValue && this.monthCycleValue.length > 0) && (this.monthTimeValue && this.monthTimeValue.length > 0)) {
                        callback()
                    } else {
                        callback('请选择时间和日期')
                    }
                }
            }
            return {
                searchInfo: {
                    name: ''
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
                    type: 1
                },
                rules: {
                    name: [
				        { required: true, message: '名称必填' }
				    ],
                    type: [
                        { validator: validateType }
                    ]
                },
                weekCycleOptions: [],
                weekCycleValue: [],
                monthCycleOptions: [],
                monthCycleValue: [],
                direction: 'rtl',
                loading: false,
                classmodel: false,
                dateValue: [],
                weekTimeValue: [],
                monthTimeValue: [],
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
            this.weekCycleOptions = weekPartArray
            this.monthCycleOptions = monthPartArray
            // 权限判断
			let tmpUserOperationUrl = JSON.parse(localStorage.getItem('userOperation'))
			if (tmpUserOperationUrl) {
				// 新增
				let tmp1 = tmpUserOperationUrl.includes('/resourceObj/resourceTime/time/add')
				if (tmp1) {
					this.userOperationUrl.addOperation = true
				} else {
					this.userOperationUrl.addOperation = false
				}
                // 删除
                let tmp2 = tmpUserOperationUrl.includes('/resourceObj/resourceTime/time/delete')
				if (tmp2) {
					this.userOperationUrl.deleteOperation = true
				} else {
					this.userOperationUrl.deleteOperation = false
				}
                // 编辑
                let tmp3 = tmpUserOperationUrl.includes('/resourceObj/resourceTime/time/update')
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
                    "page": this.page,
                    "pageSize": this.pageSize
                }
                let res = await getTimeList(tmpdata)
                if (res.code === 0) {
                    if (res.data.list && res.data.list.length > 0) {
                        res.data.list.forEach((v, i) => {
                            v.icon = 'down'
                            if (v.type != 1) {
                                v.tmpStartTime = moment(v.startTime).format('HH:mm:ss')
                                v.tmpEndTime = moment(v.endTime).format('HH:mm:ss')
                            } else {
                                v.tmpStartTime = v.startTime
                                v.tmpEndTime = v.endTime
                            }
                            if(v.weekDays) {
                                v.tmpWeekDays = v.weekDays.split(',')
                            }
                            if (v.monthDays) {
                                v.tmpMonthDays = v.monthDays.split(',')
                            }
                        })
                    }
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
                this.$confirm(`确定删除所选时间吗?`, '提示', {
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
                        deleteTime(tmpdata).then(res => {
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
                this.getTimeDetailFunc(row.id)
                this.isEdit = true
                this.addDrawerFlag = true
                this.$nextTick(() => {
                    this.addDrawer = true
                })
                this.dialogTitle = '编辑'
            },

            async getTimeDetailFunc(id) {
                let res = await getTimeDetail(id)
                if (res.code === 0) {
                    if (res.data.time.type == 1) {
                        // 固定日期
                        this.dateValue = [res.data.time.startTime, res.data.time.endTime]
                    } else if (res.data.time.type == 2) {
                        this.weekTimeValue = [res.data.time.startTime, res.data.time.endTime]
                        let tmpWeekArray = res.data.time.weekDays.split(',').map(Number)
                        this.weekCycleValue = tmpWeekArray
                    } else {
                        this.monthTimeValue = [res.data.time.startTime, res.data.time.endTime]
                        let tmpMonthArray = res.data.time.monthDays.split(',').map(Number)
                        this.monthCycleValue = tmpMonthArray
                    }
                    this.form = res.data.time
                }
            },

            initForm() {
                this.form = {
                    type: 1,
                }
                this.dialogTitle = ''
                this.isEdit = false
                this.loading = false
                this.dateValue = []
                this.weekCycleValue = []
                this.weekTimeValue = []
                this.monthCycleValue = []
                this.monthTimeValue = []
            },

            closeDialog() {
                this.initForm()
                this.addDrawerFlag = false
                this.addDrawer = false
            },

            enterDialog() {
                this.$refs.form.validate(async valid => {
					if (valid) {
                        if (this.form.type == 1) {
                            // 固定日期
                            let tmpStartTime = moment(this.dateValue[0]).format('YYYY-MM-DD HH:mm:ss')
                            let tmpEndTime = moment(this.dateValue[1]).format('YYYY-MM-DD HH:mm:ss')
                            this.form.startTime = tmpStartTime
                            this.form.endTime = tmpEndTime
                        } else if (this.form.type == 2) {
                            let tmpStartTime = moment(this.weekTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')
                            let tmpEndTime = moment(this.weekTimeValue[1]).format('YYYY-MM-DD HH:mm:ss')
                            this.form.startTime = tmpStartTime
                            this.form.endTime = tmpEndTime
                            this.form.weekDays = this.weekCycleValue.join(",")
                        } else {
                            let tmpStartTime = moment(this.monthTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')
                            let tmpEndTime = moment(this.monthTimeValue[1]).format('YYYY-MM-DD HH:mm:ss')
                            this.form.startTime = tmpStartTime
                            this.form.endTime = tmpEndTime
                            this.form.monthDays = this.monthCycleValue.join(",")
                        }
                        this.loading = true
                        if (this.isEdit) {
                            // 编辑
                            let res = await updateTime(this.form)
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
                            let res = await addTime(this.form)
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
                    this.addDrawerFlag = false
					this.addDrawer = false
				}else{
					this.addDrawerFlag = true
                    this.$nextTick(() => {
                        this.addDrawer = true
                    })
				}
				this.classmodel = false
			}
        }
    }
</script>
<style>
    .timePartStyle.el-drawer {
        width: 560px !important;
    }

    .mirrorRotateLevel {
        transform: rotateX(180deg);
    }
</style>