<template>
    <div>
        <el-form class="container-padding-search-form" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
            <el-form-item>
                <el-input placeholder="请输入内容" v-model="searchInfo.searchContent" class="input-with-select">
                    <el-select class="custom-select" v-model="searchValue" @change="selectChange" multiple collapse-tags slot="prepend" placeholder="查询项">
                        <el-checkbox
                            v-model="checked"
                            :indeterminate="isIndeterminate"
                            @change="selectAll"
                            class="select-checkbox" >
                            全选
                        </el-checkbox>
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="onSubmit" style="cursor: pointer;"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="动作：">
                <el-select v-model="searchInfo.action" placeholder="请选择">
                    <el-option
                        v-for="item in searchActionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
</template>
<script>    
    export default {
        name: 'BasicFirewallSearch',
        data() {
            return {
                searchInfo: {
                    searchContent: '',
                    filedArray: [],
                    action: -1
                },
                options: [
                    {
                        value: 'Name',
                        label: '名称'
                    }, 
                    {
                        value: 'SourceIp',
                        label: '源IP'
                    }, 
                    {
                        value: 'DestinationIp',
                        label: '目的IP'
                    }, 
                    {
                        value: 'AppName',
                        label: '应用'
                    }
                ],
                searchValue: [],
                checked: false, // el-checkbox 是否勾选上
                isIndeterminate: false, // el-checkbox 的 isIndeterminate 属性为true时用以表示 checkbox 的不确定状态
                input: '',
                searchActionOptions: [
                    {
                        value: -1,
                        label: '请选择'
                    },
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
                ]
            }
        },
        created() {
            
        },  
        mounted() {
            
        },
        methods: {
            // checkbox勾选操作
            selectAll() {
                this.isIndeterminate = false;
                let selectedData = [];
                // 若勾选了全选，则选上所有数据
                if (this.checked) {
                    this.options.forEach((item) => {
                        selectedData.push(item.value);
                    });
                }
                this.searchValue = selectedData;
            },

            // select下拉框选中数据变化
            selectChange(val) {
                // 全选
                if (val.length === this.options.length) {
                    this.checked = true;
                    this.isIndeterminate = false;
                } else if (val.length < this.options.length && val.length > 0) {
                    // 部分选择
                    this.checked = false;
                    this.isIndeterminate = true;
                } else {
                    // 未选择
                    this.checked = false;
                    this.isIndeterminate = false;
                }
            },

            onSubmit() {
                this.searchInfo.filedArray = this.searchValue
                this.$emit('searchInfo', this.searchInfo);
            },

            handleSearchDatasetList() {
                this.searchInfo.filedArray = this.searchValue
                this.$emit('searchInfo', this.searchInfo);
			},

            onReset() {
                this.searchInfo = {
                    searchContent: '',
                    filedArray: [],
                    action: -1
                }
                this.$emit('searchInfo', this.searchInfo);
            }
        }
    }
</script>