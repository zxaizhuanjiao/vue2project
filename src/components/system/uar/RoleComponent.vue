<template>
    <div style="height: 100%; width: 100%">
        <div>
            <el-button type="primary" style="float: right; margin-bottom: 10px" @click="addDrawer = true">新增</el-button>
        </div>
        <div>
            <el-table border :data="tableData" :header-cell-style="{background:'#fafafa', height: '53px', lineHeight: '53px', fontSize: '14px', color: '#333'}" class="user_table" style="width: 100%">
                <el-table-column
                        prop="code"
                        label="角色编码">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="角色名称">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="描述">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i class="el-icon-edit" @click="openEdit(scope.row)" style="cursor: pointer" title="编辑"></i>
                        <i class="el-icon-delete" @click="openDelete(scope.row)" style="margin-left: 10px; cursor: pointer" title="删除"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-drawer
                title="新增"
                :visible.sync="addDrawer"
                direction="rtl">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" style="padding-right: 30px"
            >
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="addForm.code"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="addForm.description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="parentId">
                    <el-tree
                            v-model="addForm.menuId"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitAdd()">确认</el-button>
                    <el-button @click="addDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-drawer
                title="编辑"
                :visible.sync="editDrawer"
                direction="rtl">
            <el-form :model="editForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" style="padding-right: 30px"
            >
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="editForm.code"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="parentId">
                    <el-tree
                            v-model="editForm.menuId"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitEdit()">确认</el-button>
                    <el-button @click="editDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import api from '../../../utils/api'

    export default {
        name: "RoleComponent",
        data() {
            return {
                tableData: [],
                username: '',
                addDrawer: false,
                addForm: {
                    username: '',
                    name: '',
                    password: '',
                    mobile: '',
                    menuId: []
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入昵称', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 8, max: 16, message: '长度在 6 到 20 个字符', trigger: 'blur' },
                        { pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{8,16}$/, message: '请输入正确的密码，要求数字、字母、特殊符号中最少两种', trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { pattern: /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/, message: '请輸入正确的手机号', trigger: 'blur'}
                    ],
                },
                editDrawer: false,
                editForm: {},
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            };
        },
        created() {
            this.findDataList();
        },
        methods: {
            findDataList() {
                this.$axios.get(api.FIND_ROLE_LIST.url).then(res => {
                    if (res.data.code === '000000') {
                        this.tableData = res.data.data;
                    }
                });
            },
            clearSearch() {
                this.username = '';
                this.findDataList();
            },
            submitAdd() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.$axios.post(api.ADD_USER.url, this.addForm).then(res => {
                            if (res.data.code === '000000') {
                                this.addDrawer = false;
                                this.$refs['addForm'].resetFields();
                                this.findDataList();
                                this.$message.success(res.data.mesg);
                            } else {
                                this.$message.error(res.data.mesg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            openEdit(data) {
                this.editForm = data;
                this.editDrawer = true;
            },
            submitEdit() {
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        this.$axios.put(api.EDIT_USER.url, this.editForm).then(res => {
                            if (res.data.code === '000000') {
                                this.editDrawer = false;
                                this.$refs['editForm'].resetFields();
                                this.findDataList();
                                this.$message.success(res.data.mesg);
                            } else {
                                this.$message.error(res.data.mesg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            openDelete(data) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(api.DELETE_USER.url + '/' + data.id).then(res => {
                        if (res.data.code === '000000') {
                            this.findDataList();
                            this.$message.success(res.data.mesg);
                        } else {
                            this.$message.error(res.data.mesg);
                        }
                    });
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped>

</style>
