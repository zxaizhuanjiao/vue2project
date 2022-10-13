<template>
	<div class="containerPadding">
		<div class="containerBg" :style="{ minHeight: (screenHeight - 148) + 'px' }">
			<div style="text-align: right;">
				<el-button size="mini" type="primary" @click="addUser">
					新增用户
				</el-button>
			</div>
			<el-table :data="tableData"
					  :header-cell-style="{background:'#FAFBFC',color:'#303133', height: '54px'}"
					  class="tableStyle">
				<el-table-column align="left" label="UUID" min-width="250" prop="uuid" />
				<el-table-column align="left" label="用户名" min-width="150" prop="userName" />
				<el-table-column align="left" label="昵称" min-width="150" prop="nickName" />
				<el-table-column align="left" label="用户角色" min-width="200">
				   <template #default="scope">
					   <el-select v-model="scope.row.authorityIds[0]" 
					   		placeholder="Select"
					   		@change="changeAuthority(scope.row)">
					   		<el-option
								v-for="item in authOptions"
								:key="item.authorityId"
								:label="item.authorityName"
								:value="item.authorityId"
							>
							</el-option>
						</el-select>
				    </template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="left" fixed="right">
					<template #default="scope">
					    <el-button type="text" size="small" @click="openEdit(scope.row)">
							编辑
						</el-button>
						<el-button type="text" size="small" @click="deleteUserFunc(scope.row)">
							删除
						</el-button>
				        <el-button type="text" size="small" @click="resetPasswordFunc(scope.row)">重置密码</el-button>
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
		<el-dialog :visible="addUserDialog" :title="userDialogTitle" :before-close="closeAddUserDialog">
			<el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">
			    <el-form-item label="用户名" prop="username" v-if="!isEdit">
			        <el-input v-model="userInfo.username" />
			    </el-form-item>
			    <el-form-item label="密码" prop="password" v-if="!isEdit">
			        <el-input v-model="userInfo.password" />
			    </el-form-item>
			    <el-form-item label="别名" prop="nickName">
			        <el-input v-model="userInfo.nickName" />
			    </el-form-item>
				<!-- <el-form-item label="手机号" prop="phone">
					<el-input v-model="userInfo.phone" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="userInfo.email" />
				</el-form-item> -->
				<el-form-item label="用户角色" prop="authorityId">
					<el-select v-model="userInfo.authorityIds[0]"
						placeholder="请选择用户角色"
						style="width:100%"
						@change="changeAuthority2()">
						<el-option
							v-for="item in authOptions"
							:key="item.authorityId"
							:label="item.authorityName"
							:value="item.authorityId"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="头像" label-width="80px">
					<div style="display:inline-block" @click="openHeaderChange">
						<img v-if="userInfo.headerImg" class="header-img-box" :src="(userInfo.headerImg && userInfo.headerImg.slice(0, 4) !== 'http')?path+userInfo.headerImg:userInfo.headerImg">
						<div v-else class="header-img-box">从媒体库选择</div>
					</div>
				</el-form-item> -->
			</el-form>
			<template #footer>
			    <div class="dialog-footer">
			        <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
			        <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
			    </div>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getUserList,
		setUserAuthorities,
		register,
		deleteUser
	} from '@/api/user'
	import { getAuthorityList } from '@/api/authority'
	import { setUserInfo, resetPassword } from '@/api/user.js'
	export default {
		name: 'User',
		components: {
			
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				total: 10,
				searchInfo: {},
				tableData: [],
				authOptions: [],
				addUserDialog: false,
				userDialogTitle: '新增用户',
				backNickName: '',
				userInfo: {
					username: '',
					password: '',
					nickName: '',
					headerImg: '',
					authorityId: '',
					authorityIds: []
				},
				rules: {
				    username: [
				        { required: true, message: '请输入用户名', trigger: 'blur' },
				        { min: 5, message: '最低5位字符', trigger: 'blur' }
				    ],
				    password: [
						{ required: true, message: '请输入用户密码', trigger: 'blur' },
				        { min: 6, message: '最低6位字符', trigger: 'blur' }
				    ],
				    nickName: [
				        { required: true, message: '请输入用户昵称', trigger: 'blur' }
				    ],
				    authorityId: [
				        { required: true, message: '请选择用户角色', trigger: 'blur' }
				    ]
				},
				isEdit: false,
				screenHeight: ''
			}
		},
		computed: {
		    // ...mapGetters('user', ['token'])
		},
		watch: {
		    tableData() {
		      this.setAuthorityIds()
		    }
		},
		async created() {
			// this.getTableData()
			this.screenHeight = document.body.clientHeight
			await this.getTableData()
			const res = await getAuthorityList({ page: 1, pageSize: 999 })
			this.setOptions(res.data.list)
		},
		methods: {
			getTableData() {
				let tmpdata = {
					page: this.page,
					pageSize: this.pageSize
				}
				getUserList(tmpdata).then(res => {
					if (res.code === 0) {
						this.tableData = res.data.list
						this.total = res.data.total
					}
				})
			},
			
			resetPasswordFunc(row) {
			    this.$confirm(
			        '是否将此用户密码重置为123456?',
			        '警告',
			        {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning',
			        }
			    ).then(async() => {
					const res = await resetPassword({
						id: row.id,
					})
					if (res.code === 0) {
						this.$message({
							type: 'success',
							message: res.msg,
						})
					} else {
						this.$message({
							type: 'error',
							message: res.msg,
						})
					}
			    })
			},
			
			setAuthorityIds() {
			    this.tableData && this.tableData.forEach((user) => {
			        const authorityIds = user.authorities && user.authorities.map(i => {
			          return i.authorityId
			        })
			        user.authorityIds = authorityIds
			    })
			},
			
			openHeaderChange() {
			    this.$refs.chooseImg.open()
			},
			
			setOptions(authData) {
			    this.authOptions = []
			    this.setAuthorityOptions(authData, this.authOptions)
			},
			
			openEdit(row) {
				this.userDialogTitle = '编辑用户'
				let copy = Object.assign({}, row)
				this.userInfo = copy
				this.userInfo.username = this.userInfo.userName
				this.isEdit = true
				this.addUserDialog = true
			},
			
			setAuthorityOptions(AuthorityData, optionsData) {
			    AuthorityData && AuthorityData.forEach(item => {
					if (item.children && item.children.length) {
						const option = {
							authorityId: item.authorityId,
							authorityName: item.authorityName,
							children: []
						}
						this.setAuthorityOptions(item.children, option.children)
						optionsData.push(option)
					} else {
						const option = {
							authorityId: item.authorityId,
							authorityName: item.authorityName
						}
						optionsData.push(option)
					}
				})
			},
			
			async enterAddUserDialog() {
				// console.log(this.userInfo.authorityIds)
			    this.userInfo.authorityId = this.userInfo.authorityIds[0]
				// console.log(this.userInfo)
				// return
			    this.$refs.userForm.validate(async valid => {
			        if (valid) {
						if (this.isEdit) {
							const res = await setUserInfo(this.userInfo)
							if (res.code === 0) {
								this.$message({ type: 'success', message: '编辑成功' })
							    this.getTableData()
							    this.closeAddUserDialog()
							}
						} else {
							const res = await register(this.userInfo)
							if (res.code === 0) {
							  this.$message({ type: 'success', message: '创建成功' })
							}
							this.getTableData()
							this.closeAddUserDialog()
						}
			        }
			    })
			},
			
			closeAddUserDialog() {
			    this.$refs.userForm.resetFields()
				this.addUserDialog = false
				this.userInfo = {
					username: '',
					password: '',
					nickName: '',
					headerImg: '',
					authorityId: '',
					authorityIds: []
				}
				// this.isEdit = false
			    // this.userInfo.headerImg = ''
			    // this.userInfo.authorityIds = []
			},
			
			addUser() {
			    this.addUserDialog = true
				this.userDialogTitle = '新增用户'
				this.isEdit = false
			},
			
			async changeAuthority(row) {
			    this.$nextTick(async() => {
			        const res = await setUserAuthorities({
						id: row.id,
						authorityIds: row.authorityIds
			        })
			        if (res.code === 0) {
						this.$message({ 
							type: 'success', 
							message: '角色设置成功' ,
						})
						this.getTableData();
			        }
			    })
			},
			
			changeAuthority2() {
				
			},
			
			handleSizeChange(val) {
			    this.pageSize = val
			    this.getTableData()
			},
			
			handleCurrentChange(val) {
			    this.page = val
			    this.getTableData()
			},
			
			deleteUserFunc(row) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					const res = await deleteUser({ id: row.id })
					if (res.code === 0) {
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
					}
					if (this.tableData.length === 1 && this.page > 1) {
						this.page--
					}
					this.getTableData()
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
	.header-img-box {
		width: 200px;
		height: 200px;
		border: 1px dashed #ccc;
		border-radius: 20px;
		text-align: center;
		line-height: 200px;
		cursor: pointer;
	}
</style>
