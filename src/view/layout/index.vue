<template>
    <div class="content">
        <el-container>
            <el-aside :class="collapsed ? 'left_close' : 'left_open'">
                <div class="wt_aside_title">
                    <img src="../../assets/wtIcon.png" style="width: 22px;height: 22px;vertical-align:middle;">
                    <span v-if="!collapsed" style="padding-left: 10px;color: #fff;font-size: 18px;font-weight: bold;">工业防火墙</span>
                </div>
                <el-menu
                    :collapse-transition="false"
                    :collapse="collapsed"
                    @select="menuClick"
                    :default-active="defaultActive"
					:default-openeds="open_list"
                    background-color="#080829"
                    text-color="#A6AAAE"
                    active-text-color="#fff"
					unique-opened
				>
                    <template v-for="menuInfo in menuList">
                        <el-submenu v-if="menuInfo.children" :key="menuInfo.menuId" :index="menuInfo.menuId">
                            <template slot="title">
                                <img :src="getImgUrl(menuInfo.meta.icon)" style="width: 18px;height: 18px;padding-right: 6px;text-align: center;" />
                                <span style="vertical-align: middle;">{{ menuInfo.meta.title }}</span>
                            </template>
                            <template v-for="children in menuInfo.children">
                                <el-menu-item class="subMenu" :key="children.menuId" :index="children.menuId">
									<span>{{ children.meta.title }}</span>
								</el-menu-item>
                            </template>
                        </el-submenu>
                        <template v-else>
                            <el-menu-item :key="menuInfo.menuId" :index="menuInfo.menuId">
								<img :src="getImgUrl(menuInfo.meta.icon)" style="width: 18px;height: 18px;padding-right: 6px;" />
                                <span slot="title">{{ menuInfo.meta.title }}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="box-shadow: 0px 1px 4px 0px rgba(0,21,41,0.12);z-index: 1000;">
                    <div class="title_nav" @click="toggleCollapsed">
                        <img src="../../assets/collapsed.png" style="width: 16px;height: 14px;">
                    </div>

                    <div style="float: left; padding-top: 24px; margin-left: 16px;">
                        <el-breadcrumb class="breadcrumb">
                            <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
                                {{ item.meta.title }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                        
                    <div style="float: right; line-height: 60px; margin-right: 10px; display:flex">
                        <div class="systemTime">
                            <!-- 系统时间：<span id="time"></span> -->
                            系统时间：{{ newTime }}
                        </div>
                        <el-dropdown>
                            <span class="el-dropdown-link wt_dropdown_name" style="cursor: pointer;">
                                <img src="../../assets/user.png" style="width: 35px;vertical-align: middle;">
                                {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <div class="warningNotice">
                                <el-dropdown-menu slot="dropdown" class="wt_dropdown">
                                    <el-dropdown-item v-if="false" style="margin-top: 20px;" @click.native="modifyPasswordFunc">
                                        <div class="userData">
                                            <img src="../../assets/navbar/navbar2.png">
                                            <span class="verticalmiddle">修改密码</span>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click.native="logout">
                                        <div class="userData">
                                            <img src="../../assets/navbar/navbar3.png">
                                            <span class="verticalmiddle">退出系统</span>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="false" @click.native="operationShutDownFunc('shutdown')">
                                        <div class="userData">
                                            <img src="../../assets/navbar/navbar4.png">
                                            <span class="verticalmiddle">关机</span>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="false" @click.native="operationShutDownFunc('reboot')">
                                        <div class="userData">
                                            <img src="../../assets/navbar/navbar5.png">
                                            <span class="verticalmiddle">重启</span>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </div>

                        </el-dropdown>
                        <div style=" margin-left: 20px;">
                            <img src="../../assets/wtIcon.png" style="width: 32px;vertical-align: middle;">
                        </div>
                    </div>
                </el-header>
                <el-main style="padding: 0; height: 100%;background: #F5F7FA;">
                    <div style="height: 100%">
                        <div style="height: 100%; width: 100%; overflow-x:hidden">
                            <router-view></router-view>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <!-- 修改密码 -->
        <el-dialog :visible="passwordDialog" title="修改密码" :before-close="closePasswordDialog" width="40%">
			<el-form ref="passwordForm" :rules="rules" :model="passwordForm" style="padding: 20px 66px;">
			    <el-form-item label="原密码" prop="oldPass">
			        <el-input v-model="passwordForm.oldPass" />
			    </el-form-item>
			    <el-form-item label="新密码" prop="newPass">
			        <el-input v-model="passwordForm.newPass" />
			    </el-form-item>
                <el-form-item label="确认密码" prop="surePass">
			        <el-input v-model="passwordForm.surePass" />
			    </el-form-item>
            </el-form>
            <template #footer>
			    <div class="dialog-footer">
			        <el-button size="small" @click="closePasswordDialog">取 消</el-button>
			        <el-button size="small" type="primary" @click="enterModifyDialog">确 定</el-button>
			    </div>
			</template>
        </el-dialog>
    </div>
</template>

<script>
	import { getMenuList } from '../../api/api.js'
    // import {
    //     getAlertStatisticData
    // } from '../../api/statisticsPresentation'
    // import {
    //     operationShutDown
    // } from '../../api/systemSettings'
    // import { changePassword } from '../../api/user'
    // import { getCurrentTimes, getIpAddr } from  '../../api/dashboard'
    import store from '../../store/index.js'
    import moment from 'moment'

    export default {
		name: "Navigation",
        watch: {
            // 监听vuex
            '$store.state.pageRouterData.location' (newval) {
                this.location = newval;
            },
            '$store.state.pageRouterData.defaultSelectedKeys' (newval) {
                this.defaultSelectedKeys = newval;
            },
			'$route.path': {
				handler(newName, oldName) {
                    let tmpdataid = undefined
                    if (localStorage.getItem('menuList')) {
                        let tmpMenuList = JSON.parse(localStorage.getItem('menuList'))
                        let tmp = tmpMenuList.filter(item => {
                            if (item.path == newName.split('/')[1]) {
                                tmpdataid = item.id
                                return
                            } else {
                                if (item.children && item.children.length > 0) {
                                    let tmp2 = item.children.filter(sitem => sitem.path == newName.split('/')[1])
                                    if (tmp2 && tmp2.length > 0) {
                                        tmpdataid = tmp2[0].id
                                        return
                                    }
                                }                            
                            }
                        })
                        if (tmpdataid) {
                            this.$store.commit('pageRouterData/setDefaultSelectedKeys', tmpdataid.toString());
                            this.defaultActive = tmpdataid.toString()
                        }

                        // 面包屑
                        let tmpBreadListArray = []
                        tmpMenuList.forEach((v, i) => {
                            if (v.children && v.children.length > 0) {
                                v.children.forEach((sv, si) => {
                                    if (sv.id == tmpdataid) {
                                        tmpBreadListArray.push(tmpMenuList[i].menuId)
                                        tmpBreadListArray.push(sv.menuId)
                                    }
                                })
                            } else {
                                if (v.id == tmpdataid) {
                                    tmpBreadListArray.push(tmpMenuList[i].menuId)
                                }
                            }
                        })
                        this.indexBreadcrumbs = tmpBreadListArray
                    }
					if (newName == '/dashboard') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '1');
						this.defaultActive = '1'
                        this.indexBreadcrumbs = ['1']
					}

                    if (newName == '/baseLineGroupWarning') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '49');
						this.defaultActive = '49'
					}

                    if (newName == '/rulerGroupWarning') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '52');
						this.defaultActive = '52'
					}

                    if (newName == '/blackListWarning') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '55');
						this.defaultActive = '55'
					}

                    if (newName == '/networkAttackWarning') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '56');
						this.defaultActive = '56'
					}

                    if (newName == '/behaviorDetectionWarning') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '51');
						this.defaultActive = '51'
					}

                    if (newName == '/ipmacWarning') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '50');
						this.defaultActive = '50'
					}

                    if (newName == '/licenseManagement') {
						this.$store.commit('pageRouterData/setDefaultSelectedKeys', '68');
						this.defaultActive = '68'
					}
				},
				immediate:true //true就表示会立即执行
			},
            // 监听告警弹框
            // '$store.state.iotData.warningMessage': {
            //     handler(newVal, oldVal) {
            //         let tmpmessage = newVal.split('###')
            //         let tmpTime = ''
            //         if (tmpmessage) {
            //             tmpTime = moment(tmpmessage[2]).format('HH:mm:ss')
            //         }
            //         this.$notify.closeAll();
            //         if (this.$store.state.iotData.warningMessage == '') {
            //             return
            //         } else {
            //             this.$notify({
            //                 title: '发现一条告警',
            //                 dangerouslyUseHTMLString: true,
            //                 message: `<div style="padding-top: 16px;">
            //                             <div style="padding-bottom: 8px;">
            //                                 <span style="color: #ED514F;font-size: 16px;">${tmpmessage[0]}</span>
            //                                 <span style="color: #919398;font-size: 12px;float: right;">${tmpTime}</span>
            //                             </div>
            //                             <div style="color: #303133;font-size: 12px;">
            //                                 告警描述：${tmpmessage[1]}
            //                             </div>
            //                             </div>`,
            //                 type: 'warning',
            //                 offset: 50,
            //                 duration: 3000
            //             });
            //             this.audioObj = new Audio()
            //             //设置播放文件地址
            //             this.audioObj.src = require('../../assets/warnning.mp3')
            //             this.audioObj.play()
            //         }
            //     },
            //     immediate: true
            // }
        },
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passwordForm.newPass) {
                    callback(new Error('两次密码输入不一致!'));
                } else {
                    callback();
                }
            };
            return {
                collapsed: false,
                location: this.$store.state.pageRouterData.location,
                defaultSelectedKeys: this.$store.state.pageRouterData.defaultSelectedKeys,
                menuList: [],
                // 当前登录用户
                userName: this.$store.state.userData.userInfo.userName || JSON.parse(localStorage.getItem('userInfo')).userName,
                defaultActive: this.$store.state.pageRouterData.defaultSelectedKeys,
				open_list: ['1'],
                alertStatisticData: {},
                // 修改密码
                passwordDialog: false,
                passwordForm: {
                    oldPass: '',
                    newPass: '',
                    surePass: ''
                },
                rules: {
				    oldPass: [
				        { required: true, message: '请输入原密码', trigger: 'blur' },
				        {
							pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/,
                            message: '密码必须由8-32位大小写字母、数字、特殊字符组成'
						}
				    ],
				    newPass: [
						{ required: true, message: '请输入新密码', trigger: 'blur' },
				        {
							pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/,
                            message: '密码必须由8-32位大小写字母、数字、特殊字符组成'
						}
				    ],
				    surePass: [
				        { required: true, message: '请再次输入新密码', trigger: 'blur' },
                        {
							pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/,
                            message: '密码必须由8-32位大小写字母、数字、特殊字符组成'
						},
                        { validator: validatePass2,trigger: 'blur', required: true }
				    ]
				},
                timeIntervalFunc: null,
                currentTimeIntervalFunc: null,
                audioObj: {},
                indexBreadcrumbs: [],
                newTime: '',
                timer: ''
            }
        },
        computed: {
            breadcrumbList () {
                let breadcrumbs = []
                let menuList = this.menuList
                this.indexBreadcrumbs.map(item => {
                    for (let i = 0; i < menuList.length; i++) {
                        if (item === menuList[i].menuId) {
                            breadcrumbs.push(menuList[i])
                            if (menuList[i].children) {
                                menuList = menuList[i].children
                            }
                            break;
                        }
                    }
                })
                return breadcrumbs
            }
        },
        created() {
			this.findMenuList()
            // this.getAlertStatisticDataFunc()
        },
        mounted() {
            this.initWebSocket()
            let _this = this;
            this.timer = setInterval(() => {
                _this.newTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); // 修改数据date
            }, 1000)
        //     this.getCurrentTimesFunc()
        //     this.currentTimeIntervalFunc = window.setInterval(() => {
        //         window.clearInterval(this.timeIntervalFunc)
        //         this.timeIntervalFunc = null
        //         this.getCurrentTimesFunc()
        // 　　 }, 60000)
        },
        methods: {
            async getCurrentTimesFunc() {
                var date = new Date();
                var time = date.getFullYear() + '-' + (date.getMonth + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                this.newTime = time
                // let res = await getCurrentTimes()
                // if (res.code === 0) {
                //     var _timestamp = (new Date(res.data)).getTime(); // 获得毫秒数
                //     this.timeIntervalFunc = window.setInterval(
                //         function(){
                //         //这里可以自定义时间显示格式
                //         // let tmpInnerHTML = ''
                //         // tmpInnerHTML = new Date(_timestamp).toLocaleString();
                //         // document.getElementById('time').innerHTML = new Date(_timestamp).toLocaleString();
                //         var _year = new Date(_timestamp).getFullYear();
                //         var _month = new Date(_timestamp).getMonth()+1;
                //         if (_month <= 9) {
                //             _month = '0' + _month
                //         }
                //         var _date = new Date(_timestamp).getDate()
                //         if (_date <= 9) {
                //             _date = '0' + _date
                //         }
                //         var _hours= new Date(_timestamp).getHours();
                //         if (_hours <= 9) {
                //             _hours = '0' + _hours
                //         }
                //         var _minutes= new Date(_timestamp).getMinutes();
                //         if (_minutes <= 9) {
                //             _minutes = '0' + _minutes
                //         }
                //         var _seconds= new Date(_timestamp).getSeconds();
                //         if (_seconds <= 9) {
                //             _seconds = '0' + _seconds
                //         }
                //         document.getElementById('time').innerHTML = _year + '-' + _month + '-' + _date + '&nbsp;' + _hours + ':' + _minutes + ':' + _seconds
                //         _timestamp += 1000;
                //     }, 1000);
                //     this.$once('hook:beforeDestroy', () => {    
                //         window.clearInterval(this.timeIntervalFunc);    
                //         this.timeIntervalFunc = null
                //     })
                // }
            },

            // 路由跳转
            trip(name, path) {
                this.location = name;
                this.$router.push(path);
            },
            toggleCollapsed() {
                this.collapsed = !this.collapsed;
            },
            findMenuList() {
				getMenuList().then(res => {
					if (res.code === 0) {
						this.menuList = res.data.menus;
						localStorage.setItem('menuList', JSON.stringify(this.menuList));
					}
				})
            },
            logout() {
                this.$store.commit('pageRouterData/setDefaultSelectedKeys', '1');
                this.$store.commit('userData/userLogout', '');
                this.$router.push('/login');
                window.clearInterval(this.timeIntervalFunc)
            },
            // eslint-disable-next-line no-unused-vars
            menuClick(id, indexArray) {
                this.$store.commit('pageRouterData/setDefaultSelectedKeys', id.toString());
                id = Number(id);
                this.getCheckedNodes(this.menuList, id);
                this.indexBreadcrumbs = indexArray
				// this.open_list = indexArray // 解决点击一级菜单二级菜单收不起来的问题
            },
            getCheckedNodes(data, value) {
                data.forEach(item => {
                    if (item.menuId === value.toString()) {
                        this.$store.commit('pageRouterData/setLocation', item.meta.title);
                        this.trip(item.meta.title, '/' + item.path);
                    } else {
                        if (item.children && item.children.length > 0) {
                            this.getCheckedNodes(item.children, value);
                        }
                    }
                });
            },

			handleRoute (menu) {
				// 通过菜单URL跳转至指定路由
				this.$router.push(menu.path)
			},

            getImgUrl(url) {
                let url2 = 'ruleMangement.png'
                if (url) {
                    let img = require('../../assets/icon/' + url)
                    return img
                } else {
                    let img = require('../../assets/icon/' + url2)
                    return img
                }
            },

            // async getAlertStatisticDataFunc() {
            //     let res = await getAlertStatisticData(0)
            //     if (res.code === 0) {
            //         res.data.summary.unhandler = this.thousands(res.data.summary.unhandler)
            //         // 白名单告警
            //         res.data.whiteListAlert.handler = this.thousands(res.data.whiteListAlert.handler)
            //         res.data.whiteListAlert.unhandler = this.thousands(res.data.whiteListAlert.unhandler)
            //         // 黑名单告警
            //         res.data.blackListAlert.handler = this.thousands(res.data.blackListAlert.handler)
            //         res.data.blackListAlert.unhandler = this.thousands(res.data.blackListAlert.unhandler)
            //         // 基线告警
            //         res.data.baseLineAlert.handler = this.thousands(res.data.baseLineAlert.handler)
            //         res.data.baseLineAlert.unhandler = this.thousands(res.data.baseLineAlert.unhandler)
            //         // 行为深度告警
            //         res.data.behaviorAlert.handler = this.thousands(res.data.behaviorAlert.handler)
            //         res.data.behaviorAlert.unhandler = this.thousands(res.data.behaviorAlert.unhandler)
            //         // 网络攻击告警
            //         res.data.networkAttackAlert.handler = this.thousands(res.data.networkAttackAlert.handler)
            //         res.data.networkAttackAlert.unhandler = this.thousands(res.data.networkAttackAlert.unhandler)
            //         // IP-MAC告警
            //         res.data.ipMacAlert.handler = this.thousands(res.data.ipMacAlert.handler)
            //         res.data.ipMacAlert.unhandler = this.thousands(res.data.ipMacAlert.unhandler)
            //         this.alertStatisticData = res.data
            //     }
            // },

            // thousands(num) {
            //     // var str = num.toString();
            //     // var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
            //     // return str.replace(reg,"$1,");
            //     let tmpNum = ''
            //     if (num >= 9999) {
            //         tmpNum = '9999+'
            //     } else {
            //         tmpNum = num
            //     }
            //     return tmpNum
            // },

            modifyPasswordFunc() {
                this.passwordDialog = true
            },

            closePasswordDialog() {
                this.$refs.passwordForm.resetFields()
                this.passwordForm = {
                    oldPass: '',
                    newPass: '',
                    surePass: ''
                }
                this.passwordDialog = false
            },

            async enterModifyDialog() {
                this.$refs.passwordForm.validate(async valid => {
                    if (valid) {
                        let tmpdata = {
                            "username": this.userName,
                            "password": this.passwordForm.oldPass,
                            "newPassword": this.passwordForm.newPass
                        }
                        const res = await changePassword(tmpdata)
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.msg
                            })
                            this.logout()
                        }
                    }
                })
            },

            // 重启、关机
            operationShutDownFunc(arg) {
                let tmptips = ''
                let tmptips2 = ''
                if (arg == 'reboot') {
                    tmptips = '确定重启服务器？'
                    tmptips2 = '重启'
                } else if (arg == 'shutdown') {
                    tmptips = '确定关机工控安全审计系统？'
                    tmptips2 = '关机'
                }
                this.$confirm(`<p style="color: #000000;font-size: 14px;padding-bottom: 4px;">${tmptips}</p><p style="color: #919398;font-size: 14px;">${tmptips2}可能会影响设备正常运行，请谨慎操作</p>`,'提示', {
                    dangerouslyUseHTMLString: true,
					confirmButtonText: '确 定',
					cancelButtonText: '取 消',
					type: 'warning'
				}).then(async() => {
                    let res = await operationShutDown(arg)
                }).catch(() => {})
            },

            toScreenDisplayFunc() {
                let routeUrl = this.$router.resolve({
                    path: '/screenDisplay'
                })
                window.open(routeUrl.href, '_blank')
            },

            // 告警socket
            initWebSocket() {
                if (typeof WebSocket === "undefined") return alert("您的浏览器不支持WebSocket")
                // websocket地址
                if (localStorage.getItem('websockIp')) {
                    let c = localStorage.getItem('websockIp').split('"')[1]
                    const wsuri = `wss://${c}/ws/realTimeWarning`;
                    // 初始化socket方法
                    this.websock = new WebSocket(wsuri);
                    // 连接成功的处理
                    this.websock.onopen = this.websocketonopen;
                    // 接收数据之后的处理
                    // this.websock.onmessage = this.websocketonmessage;
                    // 防抖函数
                    this.websock.onmessage = this.debounce((e) => {
                        let that = this
                        that.websocketonmessage(e);
                    },1000)
                    // 报错的处理
                    this.websock.onerror = this.websocketonerror;
                    // 关闭连接的处理
                    this.websock.onclose = this.websocketclose;
                }
            },
            //连接成功
            websocketonopen(){
                console.log('WebSocket连接成功')
            },

            // 接收后端返回的数据，可以根据需要自己进行相关的处理
            websocketonmessage(e) {
                var reader = new FileReader();
                reader.readAsText(e.data, 'utf-8');
                reader.onload = function (e) {
                    let tmpState = reader.result
                    store.dispatch("iotData/updateWarningMessage", tmpState);
                }
            },

            //连接建立失败重连
            websocketonerror(e){
                // console.log(`连接失败的信息：`, e)
                this.initWebSocket() // 连接失败后尝试重新连接
            },

            //关闭连接
            websocketclose(e){ 
                
            },

            debounce(fn, delay = 1000) {   //默认1000毫秒
                this.$store.commit('iotData/setWarningMessage', '');
                var timer;
                return function() {
                    var args = arguments;
                    if(timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(() => {
                        fn.apply(this, args);   // this 指向vue
                    }, delay);
                };
            },

            goToWarningPage(val) {
                this.$store.commit('pageRouterData/setDefaultSelectedKeys', val.toString());
                val = Number(val);
                this.getCheckedNodes(this.menuList, val);
            },

            warningNumChangeDropdown(bool) {
                if (bool) {
                    this.getAlertStatisticDataFunc()
                }
            }
        },

        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
            }
        },

        destroyed() {
            window.clearInterval(this.timeIntervalFunc)
            this.timeIntervalFunc = null
            window.clearInterval(this.currentTimeIntervalFunc)
            this.currentTimeIntervalFunc = null
		}
    }
</script>

<style scoped>
    .content {
        height: 100%;
    }
    section {
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.4);
        height: 100%;
    }
    .title_nav {
        font-size: 20px;
        font-weight: 400;
        text-align: left;
        /* width: 225px; */
        float: left;
        line-height: 60px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #040848;
		cursor: pointer;
    }
    .control_button {
        float: left;
        color: white;
        cursor: pointer;
        margin-left: 10px;
    }
</style>
<style lang="less">
    .wt_aside_title {
        height: 64px;
        line-height: 64px;
        text-align: center;
    }
    aside > ul {
        max-width: 208px;
        overflow-y: hidden;
    }
    .left_open {
        background-color: #080829;
        max-width: 208px;
        overflow-x: hidden;
        width:208px!important;
    }
    .left_close {
        background-color: #080829;
        max-width: 208px;
        overflow-x: hidden!important;
        width:65px!important;
    }
    .el-menu {
        border: none!important;
    }
    .el-submenu__title {
        color: white !important;
        height: 64px !important;
        line-height: 64px !important;
        font-size: 16px !important;
        font-weight: 400 !important;
		color: rgb(166, 170, 174) !important;
		background-color: rgb(8, 8, 41) !important;
    }
    .el-submenu__title:hover {
        background-color: none!important;
    }
    .el-menu-item {
        height: 64px!important;
        line-height: 64px!important;
        font-size: 16px!important;
        font-weight: 400!important;
    }
    .el-menu-item.is-active {
        // padding-left: 16px!important;
        border-left: 4px solid #F26521;
        background-color: #2A1F37!important;
        // i {
        //     margin-left: -4px;
        // }
        // div {
        //     img {
        //         margin-left: -4px;
        //     }
        // }
    }
    .wt_dropdown_name {
        width: 46px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #040848;
        line-height: 22px;
    }
    .wt_dropdown {
        padding: 0!important;
        top: 50px!important;
        // height: 30px;
        // line-height: 30px;
        // li {
        //     line-height: 30px;
        // }
    }

    .el-menu-item.is-active img {
        margin-left: -4px;
    }

    .subMenu.el-menu-item.is-active span {
        margin-left: -4px;
    }

    .warningNotice {
        background: #FFFFFF;
        box-shadow: 0px 7px 12px 0px rgba(35, 61, 121, 0.21);
        border-radius: 6px;
    }

    .warning_notice_wei {
        background: #F5F6F8;
        color: #303133;
        padding: 15px 24px;
    }

    .warning_notice_detail {
        background: #fff;
        color: #606266;
        padding: 15px 24px;
        font-size: 16px;
    }

    .warning_notice_detail div {
        padding-bottom: 8px;
    }

    .warning_notice_detail img {
        width: 16px;
        vertical-align: middle;
        padding-right: 10px;
    }

    .verticalmiddle {
        vertical-align: middle;
    }

    .colorF46C6C {
        color: #F46C6C;
    }

    .systemTime {
        margin-right: 46px;
        color: #606266;
        font-size: 14px;
    }

    .screenData {
        margin-right: 46px;
        cursor: pointer;
    }

    .screenData img {
        width: 24px;
        vertical-align: middle;
        padding-right: 8px;
    }

    .screenData span {
        color: #3E68FF;
        font-size: 14px;
    }

    .noticeData {
        margin-right: 46px;
        cursor: pointer;
    }

    .noticeData img {
        width: 24px;
        vertical-align: middle;
        padding-right: 8px;
    }

    .el-dropdown-menu__item:not(.is-disabled) {
        color: #606266;
    }

    .el-dropdown-menu__item:not(.is-disabled):hover {
        color: #606266;
        background-color: transparent;
    }

    .userData {
        padding-bottom: 8px;
        line-height: 30px;
    }

    .userData img {
        width: 16px;
        vertical-align: middle;
        padding-right: 12px;
    }

    .el-notification .el-icon-warning {
        color: #E34D59 !important;
    }

    .el-notification__group {
        width: 290px !important;
    }

    .breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner  {
        color: #303133 !important;
        font-weight: 500;
    }
</style>
