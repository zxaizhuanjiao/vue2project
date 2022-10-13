<template>
    <div style="height: 100%; width: 100%">
        <div>
            <el-button type="primary" style="float: right; margin-bottom: 10px" @click="addDrawer = true">新增</el-button>
        </div>
        <div>
            <el-table border :data="tableData" :header-cell-style="{background:'#fafafa', height: '53px', lineHeight: '53px', fontSize: '14px', color: '#333'}" class="user_table" style="width: 100%">
                <el-table-column
                        :render-header="renderHeader"
                        prop="username"
                        label="用户名">
                    <template slot-scope="scope">
                        {{ scope.row.username }}
                        <span style="color: #2194FF; border: 1px solid #2194FF; border-radius: 4px; padding: 2px 5px">
                            {{ scope.row.roleNames[0] }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="昵称">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.enabled === 'true'">在线</span>
                        <span v-else>离线</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="lastLoginTime"
                        label="最近登录时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i class="el-icon-edit" @click="openEdit(scope.row)" style="cursor: pointer" title="编辑"></i>
                        <i class="el-icon-lock" v-if="scope.row.enabled === 'true'" @click="openLock(scope.row)" style="margin-left: 10px; cursor: pointer" title="锁定"></i>
                        <i class="el-icon-unlock" v-else @click="openLock(scope.row)" style="margin-left: 10px; cursor: pointer" title="解锁"></i>
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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
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
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm" style="padding-right: 30px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
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
        name: "UserComponent",
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
                    role_id: 101
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
            };
        },
        created() {
            this.findDataList();
        },
        methods: {
            findDataList() {
                this.$axios.get(api.FIND_USER_LIST.url + '?username=' + this.username).then(res => {
                    if (res.data.code === '000000') {
                        this.tableData = res.data.data;
                    }
                });
            },
            renderHeader() {
                return (
                    <span>
                    用户名
                    <el-popover placement='bottom' width='200' height='200' trigger="click" v-model={this.visible}>
                    <span slot="reference">
                    <i class="el-icon-search" style='margin-left: 10px'></i>
                    </span>
                    <el-input size='small' v-model={this.username} placeholder='请输入内容'></el-input>
                    <div class='el-table-filter__bottom'>
                    <button class={this.username ? '' : 'is-disabled'} on-click={this.findDataList}>筛选</button>
                    <button on-click={this.clearSearch}>重置</button>
                    </div>
                    </el-popover>
                    </span>
                );
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
            openLock(data) {
                if (data.enabled === 'true') {
                    this.$confirm('此操作将锁定该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        data.enabled = 0;
                        this.$axios.put(api.EDIT_USER.url, data).then(res => {
                            if (res.data.code === '000000') {
                                this.$message.success(res.data.mesg);
                            } else {
                                this.$message.error(res.data.mesg);
                            }
                        });
                    }).catch(() => {});
                } else {
                    this.$confirm('此操作将解锁该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        data.enabled = 1;
                        this.$axios.put(api.EDIT_USER.url, data).then(res => {
                            if (res.data.code === '000000') {
                                this.$message.success(res.data.mesg);
                            } else {
                                this.$message.error(res.data.mesg);
                            }
                        });
                    }).catch(() => {});
                }
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

<style lang="less">
    .user_table div table tbody tr {
        height: 53px;
        line-height: 53px;
        td {
            div {
                font-size: 14px!important;
            }
        }
    }
</style>
