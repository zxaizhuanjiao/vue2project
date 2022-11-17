<template>
    <div>
        <el-form class="container-padding-search-form2" ref="searchForm" :inline="true" v-model="searchInfo" @keyup.enter.native="handleSearchDatasetList" @submit.native.prevent>
                <el-form-item label="规则编号：">
                    <el-input v-model="searchInfo.number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="协议名称：">
                    <el-select v-model="searchInfo.protocol" placeholder="请选择">
                        <el-option
                            v-for="item in protocolOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
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
    import { protocolArray } from '../../../../../utils/protocolData'

    export default {
        name: 'preDefineSearch',
        data() {
            return {
                searchInfo: {
                    number: '',
                    protocol: '',
                    level: -1,
                    action: -1
                },
                protocolOptions: [],
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
            this.protocolOptions = protocolArray
        },  
        mounted() {
            
        },
        methods: {
            onSubmit() {
                this.$emit('searchInfo', this.searchInfo);
            },

            handleSearchDatasetList() {
                this.$emit('searchInfo', this.searchInfo);
			},

            onReset() {
                this.searchInfo = {
                    number: '',
                    protocol: '',
                    level: -1,
                    action: -1
                }
                this.$emit('searchInfo', this.searchInfo);
            }
        }
    }
</script>