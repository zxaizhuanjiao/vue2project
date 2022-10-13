<template>
	<div>
		<div class="clearflex">
		    <el-button class="fl-right" size="mini" type="primary" @click="relation">
				确 定
			</el-button>
		</div>
		<el-tree
		    ref="menuTree"
		    :data="menuTreeData"
		    :default-checked-keys="menuTreeIds"
		    :props="menuDefaultProps"
		    default-expand-all
		    highlight-current
		    node-key="id"
		    show-checkbox
		    @check="nodeChange"
		    >
		    <template #default="{ node }">
		        <span class="custom-tree-node">
					<span>{{ node.label }}</span>
					<!-- <span>
						<el-button
						  type="text"
						  size="mini"
						  :style="{color:row.defaultRouter === data.name?'#E6A23C':'#85ce61'}"
						  :disabled="!node.checked"
						  @click="() => setDefault(data)"
						>
							{{ row.defaultRouter === data.name?"首页":"设为首页" }}
						</el-button>
					</span> -->
		        </span>
		    </template>
		</el-tree>
	</div>
</template>

<script>
	import { 
		getBaseMenuTree,
		getMenuAuthority,
		addMenuAuthority
	} from '../../../../api/authority.js'
	export default {
		name: 'Menus',
		props: {
		    row: {
		      default: function() {
		        return {}
		      },
		      type: Object
		    }
		},
		data() {
		    return {
		      menuTreeData: [],
		      menuTreeIds: [],
		      needConfirm: false,
		      menuDefaultProps: {
		        children: 'children',
		        label: function(data) {
		          return data.meta.title
		        }
		      }
		    }
		},
		async created() {
		    // 获取所有菜单树
			const res = await getBaseMenuTree()
			this.menuTreeData = res.data.menus
			const res1 = await getMenuAuthority({ authorityId: this.row.authorityId })
			// console.log(res1)
			// return
			const menus = res1.data.menus
			const arr = []
			menus.forEach(item => {
			  // 防止直接选中父级造成全选
			  if (!menus.some(same => same.parentId === item.menuId)) {
				arr.push(Number(item.menuId))
			  }
			})
			this.menuTreeIds = arr		    
		},
		methods: {
			async relation() {
				const checkArr = this.$refs.menuTree.getCheckedNodes(false, true)
				    const res = await addMenuAuthority({
				        menus: checkArr,
				        authorityId: this.row.authorityId
				    })
				    if (res.code === 0) {
				        this.$message({
				          type: 'success',
				          message: '菜单设置成功!'
				    })
				}
			},
			
			nodeChange() {
			    this.needConfirm = true
			},
		}
	}
</script>

<style>
</style>
