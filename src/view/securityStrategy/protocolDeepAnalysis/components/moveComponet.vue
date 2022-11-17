<template>
    <div>
        <div>
            <el-form class="formDrawer moveStyle" ref="moveDialogForm" :model="moveForm" :rules="moveRules">
                <el-form-item label="名称">
                    <el-input v-model="moveForm.name" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="移动至指定位置" prop="markInt">
                    <el-select v-model="moveForm.markInt" placeholder="请选择" style="width: 100%;">
                        <el-option
                            v-for="item in allTableData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置" prop="moveType">
                    <el-radio v-model="moveForm.moveType" :label="5">之前</el-radio>
                    <el-radio v-model="moveForm.moveType" :label="6">之后</el-radio>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
            <el-button @click="handleMoveDialogClose">取 消</el-button>
            <el-button type="primary" @click="enterMoveDialog">确 定</el-button>
        </div>
    </div>
</template>
<script>
    import {
        getDeepPacketInspectionAllList,
        moveDeepPacketInspection
    } from '../../../../api/securityStrategy'

    export default {
        name: 'BasicFirewallMove',
        props: {
		    choosedMoveList: {
				default: function() {
					return []
				}
		    },
            moveDialogVisible: {
                default: function() {
					return Boolean
				}
            },
            allCheck: {
                default: function() {
                    return Boolean
                }
            }
        },
        data() {
            return {
                moveForm: {
                    name: '',
                    markInt: undefined,
                    moveType: undefined
                },
                moveRules: {
                    markInt: [
				        { required: true, message: '移动至指定位置必填' }
				    ],
                    moveType: [
                        { required: true, message: '位置必填' }
                    ]
                },
                allTableData: []
            }
        },
        watch: {
            'moveDialogVisible': {
                handler: function(val, oldval) {
                    if (val) {
                        console.log('1111')
                        this.getDeepPacketInspectionAllList()
                    }
                },
                immediate: true
            }
        },
        created() {
            
        },  
        mounted() {
            
        },
        methods: {
            async getDeepPacketInspectionAllList() {
                let res = await getDeepPacketInspectionAllList()
                if (res.code === 0) {
                    this.allTableData = res.data
                    var newNames = []
                    var newIds = []
                    this.choosedMoveList.forEach((v, i) => {
                        newNames.push(v.name)
                        newIds.push(v.id)
                    })
                    this.moveForm.name = newNames.toString()
                    this.moveForm.ids = newIds
                }
            },

            handleMoveDialogClose() {
                this.moveForm = {
                    name: '',
                    markInt: undefined,
                    moveType: undefined
                }
                this.$refs.moveDialogForm.resetFields()
                this.$emit('closeMoveEmit');
            },

            enterMoveDialog() {
                this.$refs.moveDialogForm.validate(async valid => {
                    if (valid) {
                        let tmpdata = {
                            "ids": this.moveForm.ids,
                            "markInt": this.moveForm.markInt,
                            "moveType": this.moveForm.moveType
                        }
                        let res = await moveDeepPacketInspection(tmpdata)
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.msg
                            })
                            this.$emit('closeMoveEmit');
                        }
                    }
                })
            }
        }
    }
</script>