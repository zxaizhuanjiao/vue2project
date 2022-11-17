<template>
    <div class="container-padding">
        <div class="container-padding-body2">
            <div class="container-padding-body-wrapper">
                <div class="firewall-title-line">网络攻击</div>
                <div class="network-attack-body-part">
                    <div class="title">
                        Flood
                    </div>
                    <el-form v-model="floodData" label-width="160px">
                        <el-form-item label="SYN Flood 警戒值：">
                            <el-input-number v-model="floodData.synFlood" controls-position="right" :min="0" :max="50000" @blur="handleSyncFloodInputBlur" style="width: 16%;"></el-input-number>
                            <span style="color: #A9ABB2;">（1-50000包/秒，0表示不开启）</span>
                        </el-form-item>
                        <el-form-item label="ICMP Flood 警戒值：">
                            <el-input-number v-model="floodData.icmpFlood" controls-position="right" :min="0" :max="50000" @blur="handleIcmpFloodInputBlur" style="width: 16%;"></el-input-number>
                            <span style="color: #A9ABB2;">（1-50000包/秒，0表示不开启）</span>
                        </el-form-item>
                        <el-form-item label="UDP Flood 警戒值：">
                            <el-input-number v-model="floodData.udpFlood" controls-position="right" :min="0" :max="50000" @blur="handleUdpFloodInputBlur" style="width: 16%;"></el-input-number>
                            <span style="color: #A9ABB2;">（1-50000包/秒，0表示不开启）</span>
                        </el-form-item>
                        <el-form-item label="DNS Flood 警戒值：">
                            <el-input-number v-model="floodData.dnsFlood" controls-position="right" :min="0" :max="50000" @blur="handleDnsFloodInputBlur" style="width: 16%;"></el-input-number>
                            <span style="color: #A9ABB2;">（1-50000包/秒，0表示不开启）</span>
                        </el-form-item>
                        <el-form-item label="HTTP Flood 警戒值：">
                            <el-input-number v-model="floodData.httpFlood" controls-position="right" :min="0" :max="50000" @blur="handleHttpFloodInputBlur" style="width: 16%;"></el-input-number>
                            <span style="color: #A9ABB2;">（1-50000包/秒，0表示不开启）</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="network-attack-body-part">
                    <div class="title">
                        ICMP管控
                    </div>
                    <div style="margin: 14px 12px;">
                        <div class="paddingBottom20">
                            <el-checkbox class="chooseAll" v-model="icmpData.icmpCheck">ICMP分片检测</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="icmpData.timeoutCheck">超时报文检测</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="icmpData.unrechableCheck">不可达报文检测</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="icmpData.redirectCheck">路由重定向报文检测</el-checkbox>
                        </div>
                        <div>
                            <el-checkbox class="chooseAll paddingright30" v-model="icmpData.icmpLengthCheck">ICMP报文大小检测</el-checkbox>
                            <el-input-number v-model="icmpData.icmpLength" :min="28" :max="56000" @blur="handleIcmpLengthInputBlur" controls-position="right" style="width: 14%;"></el-input-number>
                            <span style="color: #A9ABB2;font-size: 14px;">（28-56000）</span>
                        </div>
                    </div>
                </div>
                <div class="network-attack-body-part">
                    <div class="title">
                        恶意扫描
                    </div>
                    <div style="margin: 14px 12px;">
                        <div class="paddingBottom20">
                            <el-checkbox class="chooseAll" v-model="maliciousScanning.tracertCheck">Tracret检测</el-checkbox>
                        </div>
                        <div class="paddingBottom20">
                            <span style="width: 160px;font-size: 14px;color: #606266;">IP地址扫描攻击 警戒值：</span>
                            <el-input-number v-model="maliciousScanning.ipScan" :min="0" :max="5000" @blur="handleIpAddressLengthInputBlur" controls-position="right" style="width: 14%;"></el-input-number>
                            <span style="color: #A9ABB2;font-size: 14px;">（1-5000毫秒/10个，0代表不开启）</span>
                        </div>
                        <div>
                            <span style="width: 160px;font-size: 14px;color: #606266;">端口扫描 警戒值：</span>
                            <el-input-number v-model="maliciousScanning.portScan" :min="0" :max="5000" @blur="handlePortLengthInputBlur" controls-position="right" style="width: 14%;"></el-input-number>
                            <span style="color: #A9ABB2;font-size: 14px;">（1-5000毫秒/10个，0代表不开启）</span>
                        </div>
                    </div>
                </div>
                <div class="network-attack-body-part">
                    <div class="title">
                        异常包攻击
                    </div>
                    <div style="margin: 14px 12px;">
                        <div class="paddingBottom20">
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.pingOfDeath">Ping Of Death</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.teardrop">Teardrop</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.ipOption">IP选项</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.tcpAbnormal">TCP异常</el-checkbox>
                        </div>
                        <div class="paddingBottom20">
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.smurf">Smurf</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.fraggle">Fraggle</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.land">Land</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.winnuke">Winnuke</el-checkbox>
                        </div>
                        <div style="padding-bottom: 70px;">
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.dnsAbnormal">DNS异常</el-checkbox>
                            <el-checkbox class="chooseAll" v-model="abnormalPacketAttack.ipFragment">IP分片</el-checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="networkAttackBtn">
            <el-button 
                size="mini" 
                @click="restoreNetworkDefaultSettingsFunc" 
                :disabled="userOperationUrl.updateOperation ? false : true"
                style="font-size: 14px;">
                恢复默认
            </el-button>
            <el-button 
                type="primary" 
                size="mini" 
                @click="submitFunc" 
                :disabled="userOperationUrl.updateOperation ? false : true"
                style="width: 120px;font-size: 14px;margin-top: 20px;">
                保 存
            </el-button>
        </div>
        <div style="width: calc(100% - 264px);z-index: 1000;height: 20px;position: absolute;bottom: 20px;background: #ffffff;"></div>
        <div style="width: calc(100% - 264px);z-index: 1000;height: 20px;position: absolute;bottom: 0;background: rgb(245, 247, 250)"></div>
    </div>
</template>
<script>
    import {
        getNetworkAttack,
        updateNetworkAttack
    } from '../../../api/securityStrategy'

    export default {
        name: 'NetworkAttack',
        data() {
            return {
                floodData: {
                    synFlood: 0,
                    icmpFlood: 0,
                    udpFlood: 0,
                    dnsFlood: 0,
                    httpFlood: 0
                },
                icmpData: {
                    icmpCheck: false,
                    timeoutCheck: false,
                    unrechableCheck: false,
                    redirectCheck: false,
                    icmpLengthCheck: false,
                    icmpLength: 28
                },
                maliciousScanning: {
                    tracertCheck: false,
                    ipScan: 0,
                    portScan: 0
                },
                abnormalPacketAttack: {
                    pingOfDeath: false,
                    teardrop: false,
                    ipOption: false,
                    tcpAbnormal: false,
                    smurf: false,
                    fraggle: false,
                    land: false,
                    winnuke: false,
                    dnsAbnormal: false,
                    ipFragment: false
                },
                screenHeight: '',
                userOperationUrl: {}
            }
        },
        created() {
            this.screenHeight = document.body.clientHeight
            this.getNetworkAttackFunc()
            // 权限判断
            let tmpUserOperationUrl = JSON.parse(localStorage.getItem('userOperation'))
			if (tmpUserOperationUrl) {
                // 新增
				let tmp1 = tmpUserOperationUrl.includes('/securityPolicy/networkAttack/update')
				if (tmp1) {
					this.userOperationUrl.updateOperation = true
				} else {
					this.userOperationUrl.updateOperation = false
				}
            }
        },  
        mounted() {
            
        },
        methods: {
            async getNetworkAttackFunc() { 
                let res = await getNetworkAttack()
                if (res.code === 0) {
                    if (res.data && res.data.length > 0) {
                        this.floodData = JSON.parse(res.data[0].value)
                        this.icmpData = JSON.parse(res.data[1].value)
                        this.maliciousScanning = JSON.parse(res.data[2].value)
                        this.abnormalPacketAttack = JSON.parse(res.data[3].value)
                    }
                }
            },

            handleSyncFloodInputBlur() {
                if (!this.floodData.synFlood || this.floodData.synFlood == undefined) {
                    this.floodData.synFlood = 0
                }
            },

            handleIcmpFloodInputBlur() {
                if (!this.floodData.icmpFlood || this.floodData.icmpFlood == undefined) {
                    this.floodData.icmpFlood = 0
                }
            },

            handleUdpFloodInputBlur() {
                if (!this.floodData.udpFlood || this.floodData.udpFlood == undefined) {
                    this.floodData.udpFlood = 0
                }
            },

            handleDnsFloodInputBlur() {
                if (!this.floodData.dnsFlood || this.floodData.dnsFlood == undefined) {
                    this.floodData.dnsFlood = 0
                }
            },

            handleHttpFloodInputBlur() {
                if (!this.floodData.httpFlood || this.floodData.httpFlood == undefined) {
                    this.floodData.httpFlood = 0
                }
            },

            handleIcmpLengthInputBlur() {
                if (!this.icmpData.icmpLength || this.icmpData.icmpLength == undefined) {
                    this.icmpData.icmpLength = 28
                }
            },

            handleIpAddressLengthInputBlur() {
                if (!this.maliciousScanning.ipScan || this.maliciousScanning.ipScan == undefined) {
                    this.maliciousScanning.ipScan = 0
                }
            },

            handlePortLengthInputBlur() {
                if (!this.maliciousScanning.portScan || this.maliciousScanning.portScan == undefined) {
                    this.maliciousScanning.portScan = 0
                }
            },

            restoreNetworkDefaultSettingsFunc() {
                this.$confirm(`<p style="color: #000000;font-size: 14px;padding-bottom: 4px;">确定恢复默认设置吗？</p>`,'提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, ctx, close) => {
                        if (action !== 'confirm') {
                            close();
                            return;
                        }
                        ctx.confirmButtonLoading = true;
                        let tmpFloodArgs = {
                            "synFlood": 1500,
                            "icmpFlood": 1500,
                            "udpFlood": 1500,
                            "dnsFlood": 1500,
                            "httpFlood": 1500
                        }
                        let tmpIcmpArgs = {
                            "icmpCheck": false,
                            "timeoutCheck": false,
                            "unrechableCheck": false,
                            "redirectCheck": false,
                            "icmpLengthCheck": false,
                            "icmpLength": 2000
                        }
                        let tmpMaliciousScanning = {
                            "tracertCheck": false,
                            "ipScan": 1500,
                            "portScan": 1500
                        }
                        let tmpAbnormalPacketAttack = {
                            "pingOfDeath": false,
                            "teardrop": false,
                            "ipOption": false,
                            "tcpAbnormal": false,
                            "smurf": false,
                            "fraggle": false,
                            "land": false,
                            "winnuke": false,
                            "dnsAbnormal": false,
                            "ipFragment": false
                        }
                        let tmpdata = {
                            "flood": JSON.stringify(tmpFloodArgs),
                            "icmp": JSON.stringify(tmpIcmpArgs),
                            "malScan": JSON.stringify(tmpMaliciousScanning),
                            "abnormalAttack": JSON.stringify(tmpAbnormalPacketAttack)
                        }
                        updateNetworkAttack(tmpdata).then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                this.getNetworkAttackFunc()
                            }
                            ctx.confirmButtonLoading = false
                            close();
                        })
                    }
                }).then(() => {

                }).catch(() => {});
            },

            async submitFunc() {
                let tmpdata = {
                    "flood": JSON.stringify(this.floodData),
                    "icmp": JSON.stringify(this.icmpData),
                    "malScan": JSON.stringify(this.maliciousScanning),
                    "abnormalAttack": JSON.stringify(this.abnormalPacketAttack)
                }
                let res = await updateNetworkAttack(tmpdata)
                if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: res.msg
                    })
                    this.getNetworkAttackFunc()
                }
            }
            
        }
    }
</script>
<style>
    .network-attack-body-part .title {
        margin: 14px 12px;
        padding-bottom: 8px;
        font-size: 14px;
        color: #303133;
        font-weight: 500;
        border-bottom: 1px solid #DCDFE6;
    }

    .networkAttackBtn {
        position: absolute;   
        z-index: 1000;    
        width: calc(100% - 264px);
        border-top: 1px solid rgba(192, 196, 204, 0.77);
        left: 232px;
        background: #ffffff;
        text-align: right;
        bottom: 40px;
    }

    .networkAttackBtn button {
        margin-right: 24px;
    }

    .paddingBottom20 {
        padding-bottom: 20px;
    }
</style>