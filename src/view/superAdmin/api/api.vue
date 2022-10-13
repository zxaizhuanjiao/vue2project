<template>
	<div class="containerPadding">
		<div class="containerBg" :style="{ minHeight: (screenHeight - 148) + 'px' }">
			<div class="search-box">
			    <el-form ref="searchForm" :inline="true" :model="searchInfo">
			        <el-form-item label="路径" class="paddingright30">
						<el-input v-model="searchInfo.path" placeholder="路径" />
					</el-form-item>
					<el-form-item label="描述" class="paddingright30">
						<el-input v-model="searchInfo.description" placeholder="描述" />
					</el-form-item>
					<el-form-item label="API组" class="paddingright30">
						<el-input v-model="searchInfo.apiGroup" placeholder="api组" />
					</el-form-item>
					<el-form-item label="请求">
						<el-select v-model="searchInfo.method" clearable placeholder="请选择">
							<el-option
							  v-for="item in methodOptions"
							  :key="item.value"
							  :label="`${item.label}(${item.value})`"
							  :value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button size="mini" @click="onSubmit">查询</el-button>
						<el-button size="mini" @click="onReset">重置</el-button>
					</el-form-item>
			    </el-form>
			</div>
			<div class="table-box">
			    <div class="gva-btn-list" style="text-align: right;">
			        <el-button size="mini" type="primary" @click="openDialog('addApi')">新增</el-button>
			        <el-popover v-model="deleteVisible" placement="top" width="160">
						<p>确定要删除吗？</p>
						<div style="text-align: right; margin-top: 8px;">
							<el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
							<el-button size="mini" type="primary" @click="onDelete">确定</el-button>
						</div>
						<template #reference>
							<el-button size="mini" :disabled="!apis.length" style="margin-left: 10px;">删除</el-button>
						</template>
			        </el-popover>
			    </div>
				<el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange"
						  :header-cell-style="{background:'#FAFBFC',color:'#303133', height: '54px'}"
					  	  class="tableStyle">
				    <el-table-column type="selection" align="center" width="55" />
				    <el-table-column align="left" label="id" min-width="60" prop="id" sortable="custom" />
				    <el-table-column align="left" label="API路径" min-width="150" prop="path" sortable="custom" />
				    <el-table-column align="left" label="API分组" min-width="150" prop="apiGroup" sortable="custom" />
				    <el-table-column align="left" label="API简介" min-width="150" prop="description" sortable="custom" />
				    <el-table-column align="left" label="请求" min-width="150" prop="method" sortable="custom">
				        <template #default="scope">
				            <div>
				              {{ scope.row.method }} / {{ methodFiletr(scope.row.method) }}
				            </div>
				        </template>
				    </el-table-column>
				    <el-table-column align="left" fixed="right" label="操作" width="200">
				        <template #default="scope">
				            <el-button size="small" type="text" @click="editApi(scope.row)">
								编辑
							</el-button>
				            <el-button size="small" type="text" @click="deleteApi(scope.row)">
								删除
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
		<el-dialog :visible="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
		    <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
		        <el-form-item label="路径" prop="path">
					<el-input v-model="form.path" autocomplete="off" />
		        </el-form-item>
		        <el-form-item label="请求" prop="method">
					<el-select v-model="form.method" placeholder="请选择" style="width:100%">
						<el-option
						  v-for="item in methodOptions"
						  :key="item.value"
						  :label="`${item.label}(${item.value})`"
						  :value="item.value"
						/>
					</el-select>
		        </el-form-item>
		        <el-form-item label="api分组" prop="apiGroup">
					<el-input v-model="form.apiGroup" autocomplete="off" />
		        </el-form-item>
		        <el-form-item label="api简介" prop="description">
					<el-input v-model="form.description" autocomplete="off" />
		        </el-form-item>
		    </el-form>
		    <template #footer>
				<div class="dialog-footer">
					<el-button size="small" @click="closeDialog">取 消</el-button>
					<el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
		        </div>
		    </template>
		</el-dialog>
	</div>
</template>

<script>
	import {
	  getApiById,
	  getApiList,
	  createApi,
	  updateApi,
	  deleteApi,
	  deleteApisByIds
	} from '@/api/apis'
	import { toSQLLine } from '@/utils/stringFun'
	export default {
		name: 'Api',
		components: {
			
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				total: 10,
				searchInfo: {},
				tableData: [],
				methodOptions: [
					{
					    value: 'POST',
					    label: '创建',
					    type: 'success'
					},
					{
					    value: 'GET',
					    label: '查看',
					    type: ''
					},
					{
					    value: 'PUT',
					    label: '更新',
					    type: 'warning'
					},
					{
					    value: 'DELETE',
					    label: '删除',
					    type: 'danger'
					}
				],
				apis: [],
				deleteVisible: false,
				dialogFormVisible: false,
				dialogTitle: '新增Api',
				form: {
				    path: '',
				    apiGroup: '',
				    method: '',
				    description: ''
				},
				type: '',
				rules: {
				    path: [{ required: true, message: '请输入api路径', trigger: 'blur' }],
				    apiGroup: [
				        { required: true, message: '请输入组名称', trigger: 'blur' }
				    ],
				    method: [
				        { required: true, message: '请选择请求方式', trigger: 'blur' }
				    ],
				    description: [
				        { required: true, message: '请输入api介绍', trigger: 'blur' }
				    ]
				},
				screenHeight: ''
			}
		},
		created() {
			this.screenHeight = document.body.clientHeight
			this.getTableData()
		},
		methods: {
			methodFiletr(value) {
			    const target = this.methodOptions.filter(item => item.value === value)[0]
			    return target && `${target.label}`
			},
			
			getTableData() {
				getApiList({page: this.page, pageSize: this.pageSize, ...this.searchInfo}).then(res => {
					if (res.code === 0) {
						this.tableData = res.data.list
						this.total = res.data.total
					}
				})
			},
			// 排序
			sortChange({ prop, order }) {
			    if (prop) {
			        if(toSQLLine(prop)==="id"){
						this.searchInfo.orderKey='id'
			        }else{
						this.searchInfo.orderKey = toSQLLine(prop)
			        }
			        this.searchInfo.desc = order === 'descending'
			    }
			    this.getTableData()
			},
			// 条件搜索前端看此方法
			onSubmit() {
			    this.page = 1
			    this.pageSize = 10
			    this.getTableData()
			},
			onReset() {
				this.page = 1
				this.pageSize = 10
				this.searchInfo = {}
				this.getTableData()
			},
			//  选中api
			handleSelectionChange(val) {
			    this.apis = val
			},
			async onDelete() {
			    const ids = this.apis.map(item => item.id)
			    const res = await deleteApisByIds({ ids })
			    if (res.code === 0) {
			        this.$message({
						type: 'success',
						message: res.msg
					})
					if (this.tableData.length === ids.length && this.page > 1) {
						this.page--
			        }
			        this.deleteVisible = false
			        this.getTableData()
			    }
			},
			openDialog(type) {
			    switch (type) {
			        case 'addApi':
						this.dialogTitle = '新增Api'
						break
			        case 'edit':
						this.dialogTitle = '编辑Api'
						break
			        default:
						break
			    }
			    this.type = type
			    this.dialogFormVisible = true
			},
			initForm() {
			    // this.$refs.apiForm.resetFields()
			    this.form = {
			        path: '',
			        apiGroup: '',
			        method: '',
			        description: ''
			      }
			},
			closeDialog() {
			    this.initForm()
			    this.dialogFormVisible = false
			},
			// openDialog(type) {
			//     switch (type) {
			//         case 'addApi':
			//           this.dialogTitle = '新增Api'
			//           break
			//         case 'edit':
			//           this.dialogTitle = '编辑Api'
			//           break
			//         default:
			//           break
			//     }
			//     this.type = type
			//     this.dialogFormVisible = true
			// },
			async editApi(row) {
			    const res = await getApiById({ id: row.id })
			    this.form = res.data.api
			    this.openDialog('edit')
			},
			async deleteApi(row) {
			    this.$confirm('此操作将永久删除所有角色下该api, 是否继续?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			    }).then(async() => {
			        const res = await deleteApi(row)
			        if (res.code === 0) {
			            this.$message({
			              type: 'success',
			              message: '删除成功!'
			            })
			            if (this.tableData.length === 1 && this.page > 1) {
			              this.page--
			            }
			            this.getTableData()
			        }
			    })
			},
			async enterDialog() {
			    this.$refs.apiForm.validate(async valid => {
			        if (valid) {
						switch (this.type) {
							case 'addApi':
								{
									const res = await createApi(this.form)
									if (res.code === 0) {
									this.$message({
										type: 'success',
										message: '添加成功',
										showClose: true
									})
								}
								this.getTableData()
								this.closeDialog()
							}
								break
							case 'edit':
								{
									const res = await updateApi(this.form)
									if (res.code === 0) {
										this.$message({
											type: 'success',
											message: '编辑成功',
											showClose: true
										})
									}
									this.getTableData()
									this.closeDialog()
								}
								break
							default:
							// eslint-disable-next-line no-lone-blocks
								{
									this.$message({
									  type: 'error',
									  message: '未知操作',
									  showClose: true
									})
								}
								break
						}
			        }
			    })
			},
			handleSizeChange(val) {
			    this.pageSize = val
			    this.getTableData()
			},
			handleCurrentChange(val) {
			    this.page = val
			    this.getTableData()
			},
		}
	}
</script>

<style>
</style>
