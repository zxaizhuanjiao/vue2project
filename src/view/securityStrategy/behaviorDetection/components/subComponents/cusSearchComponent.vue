<template>
    <div>
        <el-form class="container-padding-search-form2" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="规则编号：">
                    <el-input v-model="searchInfo.number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="协议名称：">
                    <el-select v-model="searchInfo.appId" placeholder="请选择">
                        <el-option
                            v-for="item in appOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则等级：">
                    <el-select v-model="searchInfo.level" placeholder="请选择">
                        <el-option
                            v-for="item in ruleLevelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="动作：">
                    <el-select v-model="searchInfo.action" placeholder="请选择">
                        <el-option
                            v-for="item in actionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button size="mini" @click="onReset">
                    重 置
                </el-button>
                <el-button size="mini" type="primary" @click="onSubmit">
                    查 询
                </el-button>
            </div>
    </div>
</template>
<script>
    import {
        getAppAllList
    } from '../../../../../api/resourceObject'

    export default {
        name: 'preDefineSearch',
        props: {
		    appOptions: {
				default: function() {
					return []
				}
		    }
        },
        data() {
            return {
                searchInfo: {
                    number: '',
                    appid: undefined,
                    level: -1,
                    action: -1
                },
                ruleLevelOptions: [
                    {
                        value: -1,
                        label: '请选择'
                    },
                    {
                        value: 1,
                        label: '低'
                    },
                    {
                        value: 2,
                        label: '中'
                    },
                    {
                        value: 3,
                        label: '高'
                    }
                ],
                actionOptions: [
                    {
                        value: -1,
                        label: '请选择'
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
            // this.getAppAllListFunc()
        },  
        mounted() {
            
        },
        methods: {
            async getAppAllListFunc() {
                let res = await getAppAllList()
                if (res.code === 0) {
                    this.appOptions = res.data.filter(item => item.type == 2)
                }
            },

            onSubmit() {
                this.$emit('searchInfo', this.searchInfo);
            },

            handleSearchDatasetList() {
                this.$emit('searchInfo', this.searchInfo);
			},

            onReset() {
                this.searchInfo = {
                    number: '',
                    appid: undefined,
                    level: -1,
                    action: -1
                }
                this.$emit('searchInfo', this.searchInfo);
            }
        }
    }
</script>