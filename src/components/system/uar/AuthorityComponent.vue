<template>
    <div style="height: 100%; width: 100%">
        <div>
            <el-button type="primary" style="float: right; margin-bottom: 10px" @click="addDrawer = true">新增</el-button>
        </div>
        <div>
            <el-table :data="tableData"
                      row-key="id"
                      border
                      default-expand-all
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :header-cell-style="{background:'#fafafa', height: '53px', lineHeight: '53px', fontSize: '14px', color: '#333'}"
                      class="authority_table" style="width: 100%">
                <el-table-column
                        :render-header="renderHeader"
                        prop="name"
                        label="菜单名称">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="描述">
                </el-table-column>
                <el-table-column
                        prop="href"
                        label="href">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i class="el-icon-plus" @click="openButton(scope.row)" style="cursor: pointer" title="打开按钮列表"></i>
                        <i class="el-icon-edit" @click="openEdit(scope.row)" style="margin-left: 10px; cursor: pointer" title="编辑"></i>
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
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="href" prop="href">
                    <el-input v-model="addForm.href"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="addForm.description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input-number v-model="addForm.orderNum" :min="1" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="图标名称" prop="icon">
                    <el-input v-model="addForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentId">
                    <el-popover
                            id="addTreeSelect"
                            v-model="popoverVisible"
                            placement="bottom"
                            trigger="click">
                        <el-tree :data="typeOptions" :props="defaultProps" @node-click="handleNodeClick"/>
                        <el-select slot="reference" v-model="typeValue" placeholder="请选择" popper-class="hiddenSel" style="width: 100%">
                            <el-option
                                    v-for="item in typeOption"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"/>
                        </el-select>
                    </el-popover>
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
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="href" prop="href">
                    <el-input v-model="editForm.href"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input-number v-model="editForm.orderNum" :min="1" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="图标名称" prop="icon">
                    <el-input v-model="editForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentId">
                    <el-popover
                            v-model="popoverVisible"
                            placement="bottom"
                            trigger="click">
                        <el-tree :data="typeOptions" :props="defaultProps" @node-click="handleNodeClick"/>
                        <el-select slot="reference" v-model="editForm.parentId" placeholder="请选择" popper-class="hiddenSel" style="width: 100%">
                            <el-option
                                    v-for="item in typeOption"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"/>
                        </el-select>
                    </el-popover>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitEdit()">确认</el-button>
                    <el-button @click="editDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-drawer
                title="按钮列表"
                :visible.sync="buttonDrawer"
                direction="rtl"
                size="75%">
            <el-button type="primary" style="float: right; margin-bottom: 10px; margin-right: 20px" @click="addButtonDrawer = true">新增</el-button>
            <el-table :data="buttonData"
                      row-key="id"
                      border
                      :header-cell-style="{background:'#fafafa', height: '53px', lineHeight: '53px', fontSize: '14px', color: '#333'}"
                      class="button_table" style="width: calc(100% - 40px); margin: 20px">
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="编码">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型">
                </el-table-column>
                <el-table-column
                        prop="url"
                        label="url">
                </el-table-column>
                <el-table-column
                        prop="method"
                        label="method">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="描述">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i class="el-icon-edit" @click="openButtonEdit(scope.row)" style="margin-left: 10px; cursor: pointer" title="编辑"></i>
                        <i class="el-icon-delete" @click="openButtonDelete(scope.row)" style="margin-left: 10px; cursor: pointer" title="删除"></i>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>

        <el-drawer
                title="新增"
                :visible.sync="addButtonDrawer"
                direction="rtl">
            <el-form :model="addButtonForm" :rules="buttonRules" ref="addButtonForm" label-width="100px" class="demo-ruleForm" style="padding-right: 30px"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addButtonForm.name"></el-input>
                </el-form-item>
                <el-form-item label="code" prop="code">
                    <el-input v-model="addButtonForm.code"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio v-model="addButtonForm.type" label="button">button</el-radio>
                    <el-radio v-model="addButtonForm.type" label="url">url</el-radio>
                </el-form-item>
                <el-form-item label="url" prop="url">
                    <el-input v-model="addButtonForm.url"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method">
                    <el-radio v-model="addButtonForm.method" label="GET">GET</el-radio>
                    <el-radio v-model="addButtonForm.method" label="POST">POST</el-radio>
                    <el-radio v-model="addButtonForm.method" label="PUT">PUT</el-radio>
                    <el-radio v-model="addButtonForm.method" label="DELETE">DELETE</el-radio>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="addButtonForm.description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitButtonAdd()">确认</el-button>
                    <el-button @click="addButtonDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-drawer
                title="编辑"
                :visible.sync="editButtonDrawer"
                direction="rtl">
            <el-form :model="editButtonForm" :rules="buttonRules" ref="editButtonForm" label-width="100px" class="demo-ruleForm" style="padding-right: 30px"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editButtonForm.name"></el-input>
                </el-form-item>
                <el-form-item label="code" prop="code">
                    <el-input v-model="editButtonForm.code"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio v-model="editButtonForm.type" label="button">button</el-radio>
                    <el-radio v-model="editButtonForm.type" label="url">url</el-radio>
                </el-form-item>
                <el-form-item label="url" prop="url">
                    <el-input v-model="editButtonForm.url"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method">
                    <el-radio v-model="editButtonForm.method" label="GET">GET</el-radio>
                    <el-radio v-model="editButtonForm.method" label="POST">POST</el-radio>
                    <el-radio v-model="editButtonForm.method" label="PUT">PUT</el-radio>
                    <el-radio v-model="editButtonForm.method" label="DELETE">DELETE</el-radio>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editButtonForm.description" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitButtonEdit()">确认</el-button>
                    <el-button @click="editButtonDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import api from '../../../utils/api'

    export default {
        name: "AuthorityComponent",
        data() {
            return {
                tableData: [{
                    id: 1,
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    id: 2,
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    id: 3,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    children: [{
                        id: 31,
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        id: 32,
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }]
                }, {
                    id: 4,
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                tableData1: [{
                    id: 1,
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    id: 2,
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    id: 3,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    hasChildren: true
                }, {
                    id: 4,
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                name: '',
                addDrawer: false,
                addForm: {
                    name: '',
                    href: '',
                    description: '',
                    orderNum: '',
                    icon: '',
                    parentId: '',
                    type: 1
                },
                rules: {
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    href: [
                        { required: true, message: '请输入href', trigger: 'blur' }
                    ],
                    icon: [
                        { required: true, message: '请输入图标名称', trigger: 'blur' }
                    ],
                },
                editDrawer: false,
                editForm: {},
                // 控制popover弹出框是否展示
                popoverVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                // select的值，默认选择第一个父级的第一个值
                typeValue: 1,
                // tree数据
                typeOptions: [
                    {
                        id: 0,
                        name: '父级1',
                        children: [
                            {
                                id: 1,
                                name: '类型1'
                            }, {
                                id: 2,
                                name: '类型2'
                            }, {
                                id: 3,
                                name: '类型3'
                            }, {
                                id: 4,
                                name: '类型4'
                            }, {
                                id: 5,
                                name: '类型5'
                            }
                        ]
                    }, {
                        id: 6,
                        name: '父级2'
                    }
                ],
                // select选择框选项
                typeOption: [
                    {
                        id: 0,
                        name: '父级1'
                    },
                    {
                        id: 1,
                        name: '类型1'
                    }, {
                        id: 2,
                        name: '类型2'
                    }, {
                        id: 3,
                        name: '类型3'
                    }, {
                        id: 4,
                        name: '类型4'
                    }, {
                        id: 5,
                        name: '类型5'
                    }, {
                        id: 6,
                        name: '父级2'
                    }
                ],
                menuId: '',
                // 按钮
                buttonDrawer: false,
                buttonData: [
                    {
                        "id": 101,
                        "createdBy": "system",
                        "updatedBy": "system",
                        "createdTime": "2019-05-15T19:16:32.000+0000",
                        "updatedTime": "2019-05-15T19:16:32.000+0000",
                        "code": "system:user_manager:btn_add",
                        "type": "button",
                        "name": "添加",
                        "url": "/users/addUser",
                        "method": "POST",
                        "description": "新增用户功能"
                    },
                    {
                        "id": 102,
                        "createdBy": "system",
                        "updatedBy": "system",
                        "createdTime": "2019-05-15T19:16:32.000+0000",
                        "updatedTime": "2019-05-15T19:16:32.000+0000",
                        "code": "system:user_manager:btn_edit",
                        "type": "button",
                        "name": "编辑",
                        "url": "/users/updateUser",
                        "method": "PUT",
                        "description": "编辑用户功能"
                    },
                ],
                addButtonDrawer: false,
                addButtonForm: {
                    code: '',
                    name: '',
                    type: '',
                    url: '',
                    method: '',
                    description: ''
                },
                buttonRules: {
                    code: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '请输入url', trigger: 'blur' }
                    ],
                    method: [
                        { required: true, message: '请选择请求方式', trigger: 'blur' }
                    ],
                },
                editButtonDrawer: false,
                editButtonForm: {},
            };
        },
        created() {
            this.findDataList();
        },
        methods: {
            findDataList() {
                this.$axios.get(api.FIND_MENU_LIST.url + '?roleId=' + sessionStorage.getItem('roleId')).then(res => {
                    if (res.data.code === '000000') {
                        // this.tableData = res.data.data;
                    }
                });
            },
            renderHeader() {
                return (
                    <span>
                    菜单名称
                    <el-popover placement='bottom' width='200' height='200' trigger="click" v-model={this.visible}>
                    <span slot="reference">
                    <i class="el-icon-search" style='margin-left: 10px'></i>
                    </span>
                    <el-input size='small' v-model={this.name} placeholder='请输入内容'></el-input>
                    <div class='el-table-filter__bottom'>
                    <button class={this.name ? '' : 'is-disabled'} on-click={this.findDataList}>筛选</button>
                    <button on-click={this.clearSearch}>重置</button>
                    </div>
                    </el-popover>
                    </span>
                );
            },
            clearSearch() {
                this.name = '';
                this.findDataList();
            },
            handleNodeClick (data) {
                this.popoverVisible = false;
                this.typeValue = data.id;
            },
            submitAdd() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.addForm.parentId = this.typeValue;
                        this.$axios.post(api.ADD_MENU.url, this.addForm).then(res => {
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
                        this.$axios.put(api.ADD_MENU.url + '/' + this.editForm.id, this.editForm).then(res => {
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
                this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(api.ADD_MENU.url + '/' + data.id).then(res => {
                        if (res.data.code === '000000') {
                            this.findDataList();
                            this.$message.success(res.data.mesg);
                        } else {
                            this.$message.error(res.data.mesg);
                        }
                    });
                }).catch(() => {});
            },
            // 按钮页面
            openButton(data) {
                this.menuId = data.id;
                this.findButtonList();
            },
            findButtonList() {
                this.buttonDrawer = true;
                this.$axios.delete(api.FIND_BUTTON_LIST.url + '/' + this.menuId).then(res => {
                    if (res.data.code === '000000') {
                        // this.buttonData = res.data.data;
                    } else {
                        this.$message.error(res.data.mesg);
                    }
                });
            },
            submitButtonAdd() {
                this.$refs['addButtonForm'].validate((valid) => {
                    if (valid) {
                        this.$axios.post(api.ADD_BUTTON.url, this.addButtonForm).then(res => {
                            if (res.data.code === '000000') {
                                this.addButtonDrawer = false;
                                this.$refs['addButtonForm'].resetFields();
                                this.findButtonList();
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
            openButtonEdit(data) {
                this.editButtonForm = data;
                this.editButtonDrawer = true;
            },
            submitButtonEdit() {
                this.$refs['editButtonForm'].validate((valid) => {
                    if (valid) {
                        this.$axios.put(api.EDIT_BUTTON.url, this.editButtonForm).then(res => {
                            if (res.data.code === '000000') {
                                this.editButtonDrawer = false;
                                this.$refs['editButtonForm'].resetFields();
                                this.findButtonList();
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
            openButtonDelete(data) {
                this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(api.DELETE_BUTTON.url + '/' + data.id).then(res => {
                        if (res.data.code === '000000') {
                            this.findButtonList();
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
    .hiddenSel{
        display: none;
    }
    .authority_table div table tbody tr {
        height: 53px;
        line-height: 53px;
        td {
            div {
                font-size: 14px!important;
            }
        }
    }
    .button_table div table tbody tr {
        height: 53px;
        line-height: 53px;
        td {
            div {
                font-size: 14px!important;
            }
        }
    }
</style>
