<template>
    <div style="padding: 10px 30px;" ref="form">
        <el-form class="formDrawer" ref="form" :model="form" :rules="rules">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入" disabled />
            </el-form-item>
            <el-form-item label="IP地址/范围" required>
                <el-input v-model="form.address" placeholder="请输入" @keyup.enter.native="watchAddressInput()" />
                <div style="font-size: 12px;color: red;">
                    IP地址/范围输入后按回车键继续输入
                </div>
                <div style="color: #606266;font-size: 12px;line-height: 16px;font-weight: 400;">
                    每行可配置一个IP地址范围 <br />
                    示例：<br />
                    10.10.1.2 <br />
                    10.10.1.2/255.255.255.0 <br />
                    10.10.1.2/32 <br />
                    10.10.1.2-10.10.1.10
                </div>
            </el-form-item>
            <div class="address-show-style" v-if="form.addressIpRange && form.addressIpRange.length > 0">
                <div v-for="item, index in form.addressIpRange" :key="index" style="padding-bottom: 10px;">
                    {{ item.content }}
                    <i class="el-icon-close" @click="deleteAddressFunc(item, index)"></i>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'EditAddress',
        props: {
            addressDataDetail: {
                default: function() {
					return {}
				}
            }
		},
        data() {
            return {
                form: {
                    name: '',
                    address: '',
                    addressIpRange: []
                },
                rules: {
                    name: [
                        { required: true, message: '名称必填' }
                    ]
                }
            }
        },
        created() {
            this.form = this.addressDataDetail
        },  
        mounted() {
            
        },
        methods: {
            watchAddressInput() {
                if (!this.form.address || this.form.address == '') {
                    this.$message({
                        type: 'warning',
                        message: 'IP地址/范围必填',
                        showClose: true
                    })
                    return
                }
                let tmpTips1 = false
                let tmpTips2 = false
                let tmpTips3 = false
                if (this.form.address.indexOf('-') !== -1) {
                    const reg = /^((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\-(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d))$/
                    if (reg.test(this.form.address)) {
                        
                    } else {
                        tmpTips1 = true
                    }
                } else if (this.form.address.indexOf('/') !== -1) {
                    const reg = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2]|((254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)))$/
                    if (reg.test(this.form.address)) {
                        
                    } else {
                        tmpTips2 = true
                    }
                } else {
                    const reg = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/
                    if (reg.test(this.form.address)) {
                        
                    } else {
                        tmpTips3 = true
                    }
                }

                if (tmpTips1 || tmpTips2 || tmpTips3) {
                    this.$message({
                        type: 'warning',
                        message: 'IP格式不正确',
                        showClose: true
                    })
                    return
                }
                
                let tmpdata = {
                    content: this.form.address
                }
                this.form.addressIpRange.push(tmpdata)
                this.form.address = ''
            },

            deleteAddressFunc(item, index) {
                const itemList = this.form.addressIpRange.indexOf(item)
				if (itemList !== -1) {
					this.form.addressIpRange.splice(index, 1)
				}
            },

            emitFormData() {
                return this.form
            }
        }
    }
</script>