<template>
	<div class="containerPadding">
		<div class="containerBg" :style="{ minHeight: (screenHeight - 148) + 'px' }">
			<div style="text-align: right;">
				<el-button type="primary" size="mini" @click="addMenu('0')">
					新增根菜单
				</el-button>
			</div>
			
			
			<!-- 由于此处菜单跟左侧列表一一对应所以不需要分页 pageSize默认999 -->
			<el-table :data="tableData" row-key="id" 
					  :header-cell-style="{background:'#FAFBFC',color:'#303133', height: '54px'}"
					  class="tableStyle">
			    <el-table-column align="left" label="id" min-width="100" prop="id" />
			    <el-table-column align="left" label="路由Name" show-overflow-tooltip min-width="160" prop="name" />
			    <el-table-column align="left" label="路由Path" show-overflow-tooltip min-width="160" prop="path" />
			    <el-table-column align="left" label="是否隐藏" min-width="100" prop="hidden">
			        <template #default="scope">
			            <span>{{ scope.row.hidden?"隐藏":"显示" }}</span>
			        </template>
			    </el-table-column>
			    <el-table-column align="left" label="父节点" min-width="90" prop="parentId" />
			    <el-table-column align="left" label="排序" min-width="70" prop="sort" />
			    <el-table-column align="left" label="文件路径" min-width="360" prop="component" />
			    <el-table-column align="left" label="展示名称" min-width="120" prop="authorityName">
			        <template #default="scope">
			            <span>{{ scope.row.meta.title }}</span>
			        </template>
				</el-table-column>
			    <el-table-column align="left" label="图标" min-width="140" prop="authorityName">
			        <template #default="scope">
			            <div class="icon-column">
							<el-icon>
								<component :is="scope.row.meta.icon" />
							</el-icon>
							<span>{{ scope.row.meta.icon }}</span>
			            </div>
			        </template>
			    </el-table-column>
			    <el-table-column align="left" fixed="right" label="操作" width="200">
			        <template #default="scope">
			            <el-button
			              size="small"
			              type="text"
			              @click="addMenu(scope.row.id)"
			            >添加子菜单</el-button>
			            <el-button
			              size="small"
			              type="text"
			              @click="editMenu(scope.row.id)"
			            >编辑</el-button>
			            <el-button
			              size="small"
			              type="text"
			              @click="deleteMenu(scope.row.id)"
			            >删除</el-button>
			        </template>
			    </el-table-column>
				<!-- <el-table-column align="right" width="60"></el-table-column> -->
			</el-table>
		</div>
		
		<el-dialog :visible="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
			<el-form
				v-if="dialogFormVisible"
				ref="menuForm"
				:inline="true"
				:model="form"
				:rules="rules"
				label-position="top"
				label-width="85px"
			>
				<el-form-item label="路由Name" prop="path" style="width:30%">
					<el-input
						v-model="form.name"
						autocomplete="off"
						placeholder="唯一英文字符串"
						@change="changeName"
					/>
				</el-form-item>
				<el-form-item prop="path" style="width:30%">
					<template #label>
						<div style="display:inline-flex">
						  路由Path
						  <el-checkbox v-model="checkFlag" style="float:right;margin-left:20px;">添加参数</el-checkbox>
						</div>
					</template>
		
					<el-input
						v-model="form.path"
						:disabled="!checkFlag"
						autocomplete="off"
						placeholder="建议只在后方拼接参数"
					/>
				</el-form-item>
				<el-form-item label="是否隐藏" style="width:30%">
				    <el-select v-model="form.hidden" placeholder="是否在列表隐藏">
				        <el-option :value="false" label="否" />
				            <el-option :value="true" label="是" />
				        </el-select>
				</el-form-item>
				<el-form-item label="父节点id" style="width:30%">
				    <el-cascader
				        v-model="form.parentId"
				        style="width:100%"
				        :disabled="!isEdit"
				        :options="menuOption"
				        :props="{ checkStrictly: true,label:'title',value:'id',disabled:'disabled',emitPath:false}"
				        :show-all-levels="false"
				        filterable
				    />
				</el-form-item>
				<el-form-item label="文件路径" prop="component" style="width:60%">
					<el-input v-model="form.component" autocomplete="off" />
					<!-- <span style="font-size:12px;margin-right:12px;">如果菜单包含子菜单，请创建router-view二级路由页面或者</span><el-button size="mini" @click="form.component = 'view/routerHolder.vue'">点我设置</el-button> -->
				</el-form-item>
				<el-form-item label="展示名称" prop="meta.title" style="width:30%">
					<el-input v-model="form.meta.title" autocomplete="off" />
				</el-form-item>
				<!-- <el-form-item label="图标" prop="meta.icon" style="width:30%">
					<icon :meta="form.meta" style="width:100%" />
				</el-form-item> -->
				<el-form-item label="排序标记" prop="sort" style="width:30%">
					<el-input v-model.number="form.sort" autocomplete="off" />
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
	  updateBaseMenu,
	  getMenuList,
	  addBaseMenu,
	  deleteBaseMenu,
	  getBaseMenuById
	} from '@/api/menu'
	export default {
		name: 'Menu',
		components: {
			
		},
		data() {
		    return {
				page: 1,
				pageSize: 999,
				total: 10,
				searchInfo: {},
				tableData: [],
				checkFlag: false,
				dialogFormVisible: false,
				dialogTitle: '新增菜单',
				menuOption: [
					{
					  id: '0',
					  title: '根菜单'
					}
				],
				form: {
					id: 0,
					path: '',
					name: '',
					hidden: '',
					parentId: '',
					component: '',
					meta: {
						title: '',
						icon: '',
						defaultMenu: false,
						closeTab: false,
						keepAlive: false
					},
				    parameters: []
				},
				rules: {
					path: [
						{ required: true, message: '请输入菜单name', trigger: 'blur' },
					],
					component: [
						{ required: true, message: '请输入文件路径', trigger: 'blur' }
					],
					'meta.title': [
						{ required: true, message: '请输入菜单展示名称', trigger: 'blur' }
					]
				},
				isEdit: false,
				test: '',
				screenHeight: ''
		    }
		},
		created() {
			this.screenHeight = document.body.clientHeight
			this.getTableData();
		},
		methods: {
			getTableData() {
				let tmpdata = {
					page: this.page,
					pageSize: this.pageSize
				}
				getMenuList(tmpdata).then(res => {
					if (res.code === 0) {
						if (res.data.list && res.data.list.length > 0) {
							this.tableData = res.data.list
						} else {
							this.tableData = []
						}
						
					}
				})
			},
			
			addParameter(form) {
			    if (!form.parameters) {
			        this.form.parameters = []
			    }
			    form.parameters.push({
			        type: 'query',
			        key: '',
			        value: ''
			    })
			},
			
			deleteParameter(parameters, index) {
			    parameters.splice(index, 1)
			},
			
			changeName() {
			    this.form.path = this.form.name
			},
			
			setOptions() {
			    this.menuOption = [
			        {
			          id: '0',
			          title: '根目录'
			        }
			    ]
			    this.setMenuOptions(this.tableData, this.menuOption, false)
			},
			
			setMenuOptions(menuData, optionsData, disabled) {
			    menuData && menuData.forEach(item => {
			        if (item.children && item.children.length) {
			            const option = {
			              title: item.meta.title,
			              id: String(item.id),
			              disabled: disabled || item.id === this.form.id,
			              children: []
			            }
			            this.setMenuOptions(
			              item.children,
			              option.children,
			              disabled || item.id === this.form.id
			            )
			            optionsData.push(option)
			        } else {
			            const option = {
			              title: item.meta.title,
			              id: String(item.id),
			              disabled: disabled || item.id === this.form.id
			            }
			            optionsData.push(option)
			        }
			    })
			},
			
			handleClose() {
			    this.initForm()
			},
			
			// 删除菜单
			deleteMenu(id) {
				this.$confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					const res = await deleteBaseMenu({ id })
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			
			// 初始化弹窗内表格方法
			initForm() {
				this.checkFlag = false
				// this.$refs.menuForm.resetFields()
				this.form = {
					id: 0,
					path: '',
					name: '',
					hidden: '',
					parentId: '',
					component: '',
					meta: {
					  title: '',
					  icon: '',
					  defaultMenu: false,
					  keepAlive: ''
					}
				}
			},
			
			// 关闭弹窗
			closeDialog() {
				this.initForm()
				this.dialogFormVisible = false
			},
			
			// 添加menu
			async enterDialog() {
				this.$refs.menuForm.validate(async valid => {
					if (valid) {
						let res
						if (this.isEdit) {
							res = await updateBaseMenu(this.form)
						} else {
							res = await addBaseMenu(this.form)
						}
						if (res.code === 0) {
							this.$message({
								type: 'success',
								message: this.isEdit ? '编辑成功' : '添加成功!'
							})
							this.getTableData()
						}
						this.initForm()
						this.dialogFormVisible = false
					}
				})
			},
			
			// 添加菜单方法，id为 0则为添加根菜单
			addMenu(id) {
				this.dialogTitle = '新增菜单'
				this.form.parentId = String(id)
				this.isEdit = false
				this.setOptions()
				this.dialogFormVisible = true
			},
			
			// 修改菜单方法
			async editMenu(id) {
			    this.dialogTitle = '编辑菜单'
			    const res = await getBaseMenuById({ id })
			    this.form = res.data.menu
			    this.isEdit = true
			    this.setOptions()
			    this.dialogFormVisible = true
			}
		}
	}
</script>

<style>
</style>
