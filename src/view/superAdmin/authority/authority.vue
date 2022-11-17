<template>
	<div class="containerPadding">
        <div class="containerBg" :style="{ minHeight: (screenHeight - 148) + 'px' }">
			<div style="text-align: right;">
				<el-button type="primary" size="mini" @click="addAuthorityMethods">
					新增角色
				</el-button>
			</div>

			<el-table :data="tableData"
					  :header-cell-style="{background:'#FAFBFC',color:'#303133', height: '54px'}"
					  class="tableStyle">
				<el-table-column label="角色ID" min-width="180" prop="authorityId" />
				<el-table-column align="left" label="角色名称" min-width="180" prop="authorityName" />
				<el-table-column align="left" fixed="right" label="操作" width="200">
					<template #default="scope">
						<el-button size="small" type="text" @click="opdendrawer(scope.row)">
							设置权限
						</el-button>
						<el-button size="small" type="text" @click="editAuthority(scope.row)">
							编辑
						</el-button>
						<el-button size="small" type="text" @click="deleteAuth(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>	
		</div>
		
		<!-- 新增角色弹出框 -->
		<el-dialog :visible="dialogFormVisible" title="新增" :before-close="closeDialog">
		    <el-form ref="authorityForm" :model="form" :rules="rules" label-width="80px">
		        <el-form-item label="角色ID" prop="authorityId">
		          <el-input v-model="form.authorityId" autocomplete="off" />
		        </el-form-item>
		        <el-form-item label="角色姓名" prop="authorityName">
		          <el-input v-model="form.authorityName" autocomplete="off" />
		        </el-form-item>
		    </el-form>
		    <template #footer>
		        <div class="dialog-footer">
		          <el-button size="small" @click="closeDialog">取 消</el-button>
		          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
		        </div>
		    </template>
		</el-dialog>
		
		<!-- 编辑角色弹出框 -->
		<el-dialog :visible="dialogEditFormVisible" title="编辑" :before-close="closeEditDialog">
		    <el-form ref="authorityEditForm" :model="editForm" :rules="editRules" label-width="80px">
		        <el-form-item label="角色ID" prop="authorityId">
		          <el-input v-model="editForm.authorityId" disabled autocomplete="off" />
		        </el-form-item>
		        <el-form-item label="角色姓名" prop="authorityName">
		          <el-input v-model="editForm.authorityName" autocomplete="off" />
		        </el-form-item>
		    </el-form>
		    <template #footer>
		        <div class="dialog-footer">
		          <el-button size="small" @click="closeEditDialog">取 消</el-button>
		          <el-button size="small" type="primary" @click="enterEditDialog">确 定</el-button>
		        </div>
		    </template>
		</el-dialog>
		
		<!-- 修改权限 -->
		<el-drawer v-if="drawer" :visible.sync="drawer" :with-header="false" size="40%" title="角色配置">
		    <el-tabs :before-leave="autoEnter" class="role-box" type="border-card">
		        <el-tab-pane label="角色菜单">
					<Menus ref="menus" :row="activeRow" @changeRow="changeRow" />
		        </el-tab-pane>
		        <el-tab-pane label="角色api">
					<Apis ref="apis" :row="activeRow" @changeRow="changeRow" />
		        </el-tab-pane>
		    </el-tabs>
		</el-drawer>
	</div>
</template>

<script>
	import { 
		getAuthorityList,
		createAuthority,
		updateAuthority,
		deleteAuthority
	} from '../../../api/authority.js'
	import Menus from './components/menus.vue'
	import Apis from './components/apis.vue'
	
	export default {
		name: 'Authority',
		components: {
			Menus,
			Apis
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				total: 10,
				searchInfo: {},
				tableData: [],
				dialogFormVisible: false,
				form: {
					authorityId: '',
					authorityName: '',
					parentId: '0'
				},
				rules: {
					authorityId: [
					  { required: true, message: '请输入角色ID', trigger: 'blur' }
					],
					authorityName: [
					  { required: true, message: '请输入角色姓名', trigger: 'blur' }
					]
				},
				dialogEditFormVisible: false,
				editForm: {},
				editRules: {
					authorityName: [
					  { required: true, message: '请输入角色姓名', trigger: 'blur' }
					]
				},
				drawer: false,
				activeRow: {},
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
				getAuthorityList(tmpdata).then(res => {
					if (res.code === 0) {
						if (res.data.list && res.data.list.length > 0) {
							this.tableData = res.data.list
						} else {
							this.tableData = []
						}
						
					}
				})
			},
			
			addAuthorityMethods() {
				this.dialogFormVisible = true
			},
			
			closeDialog() {
				this.initForm()
				this.dialogFormVisible = false
			},
			
			initForm() {
				if (this.$refs.authorityForm) {
					this.$refs.authorityForm.resetFields()
				}
				this.form = {
					authorityId: '',
					authorityName: '',
					parentId: '0'
				}
			},
			
			enterDialog() {
				if (this.form.authorityId === '0') {
					this.$message({
					  type: 'error',
					  message: '角色id不能为0'
					})
					return false
				}
				
				this.$refs.authorityForm.validate(async valid => {
					if (valid) {
						this.form.authorityId = parseInt(this.form.authorityId)
						createAuthority(this.form).then(res => {
							if (res.code === 0) {
								this.$message({
									type: 'success',
									message: '新增成功！'
								})
								this.getTableData()
								this.closeDialog()
							}
						})
					}
				})
			},
			
			opdendrawer(row) {
				this.drawer = true
				this.activeRow = row
			},
			
			handleClose() {
				this.drawer = false
			},
			
			autoEnter(activeName, oldActiveName) {
			    const paneArr = ['menus', 'apis']
			    if (oldActiveName) {
			        if (this.$refs[paneArr[oldActiveName]].needConfirm) {
			          this.$refs[paneArr[oldActiveName]].enterAndNext()
			          this.$refs[paneArr[oldActiveName]].needConfirm = false
			        }
			    }
			},
			
			changeRow(key, value) {
			    this.activeRow[key] = value
			},
			
			editAuthority(row) {
				let copy = Object.assign({}, row)
				this.editForm = copy
				this.dialogEditFormVisible = true
			},
			
			closeEditDialog() {
				this.dialogEditFormVisible = false
				this.editForm = {}
			},
			
			enterEditDialog() {
				this.$refs.authorityEditForm.validate(async valid => {
					if (valid) {
						this.editForm.authorityId = parseInt(this.editForm.authorityId)
						updateAuthority(this.editForm).then(res => {
							if (res.code === 0) {
								this.$message({
									type: 'success',
									message: '修改成功！'
								})
								this.getTableData();
								this.closeEditDialog();
							} else {
								this.$message({
									type: 'error',
									message: res.msg
								})
							}
						})
					}
				})
				
			},
			
			deleteAuth(row) {
				this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteAuthority({ authorityId: row.authorityId }).then(res => {
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			}
		}
	}
</script>

<style>
</style>
