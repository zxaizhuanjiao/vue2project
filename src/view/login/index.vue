<template>
    <div class="login_div">
        <el-row type="flex" justify="start" align="middle" :style="{ height: (screenHeight) + 'px' }">
            <el-col class="login-right" :span="12">
                <div class="login_content" ref="loginRef">
                    <div class="login_content_title">
                        <img src="../../assets/wtIcon.png">
                        <span style="">
                            工控防火墙
                        </span>
                    </div>
                    <div class="login_content_subtitle">
                        用户登录
                    </div>
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px" @submit.native.prevent>
                        <el-form-item label-width="0" class="input_login" prop="username" style="margin-bottom: 20px;">
                            <el-input class="username_input" v-model.trim="form.username" auto-complete="off"
                                      placeholder="请输入用户名" ref="userInput" style="color: #000000;">
                            </el-input>
                        </el-form-item>
                        <el-form-item label-width="0" class="input_login" prop="password" style="margin-bottom: 20px;">
                            <el-tooltip v-model="capsTooltip" content="已开启大写" placement="top" manual>
                                <el-input class="password_input" :type="passwordtype" autocomplete="off"
                                        v-model.trim="form.password" placeholder="请输入密码" @keyup.native="checkCapslock" @blur="capsTooltip = false">
                                    <i slot="suffix" class="el-input__icon" :class="elIcon" @click="switchshowpassword"
                                    style="cursor: pointer;"></i>
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label-width="0" class="input_login" prop="captcha">
                            <el-input class="captcha_input" v-model="form.captcha" placeholder="请输入验证码" style="width: 60%;"></el-input>
                            <div class="vPic">
                                <img v-if="picPath" :src="picPath" alt="请输入验证码" @click="loginVerify()" />
                            </div>
                        </el-form-item>
                        <el-form-item label-width="0" class="input_login">
                            <el-checkbox v-model="isChecked" class="remeberPwd" label="记住账号"></el-checkbox>
                        </el-form-item>
                        <el-form-item class="login_button">
                            <el-button type="primary" native-type="submit" @click="handleSubmit"
                                       style="width: 100%;height: 48px;font-size: 16px;border-radius: 6px;box-shadow: 0px 2px 7px 0px #F26521;">
                                <span v-if="!loading">登录</span>
                                <span v-else>登录中...</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
        <div class="footer_copyright">
            <span style="padding-right: 3px;">©</span>
            Copyright ©2016-2022网藤科技 版权所有.工控防火墙
        </div>
    </div>
</template>

<script>
	import { login, captcha } from '../../api/api'
    // import {
    //     getIpAddr
    // } from '../../api/dashboard'
	import CryptoJS from "crypto-js";

    export default {
        name: "LoginComponent",
        data() {
            return {
                formLayout: 'horizontal',
                form: {
                    username: '',
                    password: '',
                    captcha: '',
                    captchaId: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    captcha: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { message: '验证码格式不正确',trigger: 'blur' }
                    ]
                },
                message: '',
				loading: false,
				menuList: [],
				isChecked: false,
                flag: false,
                loginheight: 0,
                checked: false,
                screenHeight: '',
                // 验证码
                logVerify: '',
                picPath: '',
                bigChar: false,
                shifKey: undefined,
                isFocusPW: false,
                firstTochar:false,
                bigChar:false,
                capsTooltip: false,
                isLoginToken: ''
            };
        },
        computed: {
            passwordtype() {
                return this.flag ? "text" : "password";
            },

            elIcon() {
                return this.flag ? "showpassword" : "hidepassword"
            }

        },
        created() {
			this.isChecked = false;
            this.getCookie()
            this.screenHeight = document.body.clientHeight;
            const that = this;
            window.addEventListener('resize', function () {
                that.screenHeight = document.body.clientHeight;
            });
            this.$nextTick(() => {
                // this.$refs.userInput.focus()
            })
            this.loginVerify()
            // this.$store.commit('loadingData/showLoading', false);
        },
        mounted() {
            // 判断登录状态
            let token = this.$store.state.userData.token || localStorage.getItem('token')
            if (token) {
                this.$router.push('/');
            }
            this.isLoginToken = token

            window.addEventListener('keydown', (event) => {
                let e = event || window.event
                //  检测大写锁定键
                if (e.keyCode === 20) {
                    if (!this.isFocusPW) {
                    this.bigChar = !this.bigChar
                    }
                }
            })

            // console.log(this.$refs.loginRef)
            // console.log(this.$refs.loginRef.clearBasicTime())
        },

        methods: {
            switchshowpassword() {
                this.flag = !this.flag;
            },

			setCookie(portId, psw, exdays) {
				//账号，密码 ，过期的天数
				// Encrypt，加密账号密码
				const cipherPortId = CryptoJS.AES.encrypt(portId + '', "secretkey123").toString();				
				const exdate = new Date(); //获取时间
				exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
				window.document.cookie =
				    "currentPortId" +
				    "==" +
				    cipherPortId +
				    ";path=/;expires=" +
				    exdate.toGMTString();
			},
			
			//读取cookie  将用户名和密码回显到input框中喽~~
			getCookie() {
				if (document.cookie.length > 0) {
				    const arr = document.cookie.split("; "); //这里显示的格式请根据自己的代码更改
				    for (let i = 0; i < arr.length; i++) {
				        let arr2 = arr[i].split("=="); //根据==切割
				        //判断查找相对应的值
				        if (arr2[0] === "currentPortId") {
				            // Decrypt，将解密后的内容赋值给账号
				            let bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
				            this.form.username = bytes.toString(CryptoJS.enc.Utf8);
				        }
				        this.checked = !!this.form.username;
				    }
				}
			},
			
			//清除cookie
			clearCookie: function() {
				this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
			},
			
            handleSubmit() {
				if (this.isChecked) {
					this.setCookie(this.form.username, this.form.password, 7);
				} else {
					this.clearCookie()
				}
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        login(this.form).then(res => {
                            if (res.code === 0) {
                                this.$store.commit('userData/setUserInfo',res.data.user);
                                this.$store.commit('userData/setToken',res.data.token);
                                localStorage.setItem('token', res.data.token);
                                localStorage.setItem('userInfo', JSON.stringify(res.data.user));
                                localStorage.setItem("userOperation", JSON.stringify(res.data.operationUrls));
                                this.$router.push('/');
                            } else {
                                this.loginVerify()
                                if (res.msg == '验证码错误') {
                                    this.form.captcha = ''
                                } else {
                                    this.isChecked = false
                                    this.form.username = ''
                                    this.form.password = ''
                                    this.form.captcha = ''
                                }
                            }
                            this.loading = false;
                        })
                    }
                });
            },

            loginVerify() {
                captcha({}).then((ele) => {
                    this.rules.captcha[1].max = ele.data.captchaLength
                    this.rules.captcha[1].min = ele.data.captchaLength
                    this.picPath = ele.data.picPath
                    this.form.captchaId = ele.data.captchaId
                })
            },

            checkCapslock({ shiftKey, key } = {}) {
                if (key && key.length === 1) {
                    if ((shiftKey && key >= "a" && key <= "z") ||(!shiftKey && key >= "A" && key <= "Z")) {
                        this.capsTooltip = true;
                    } else {
                        this.capsTooltip = false;
                    }
                }
                if (key === "CapsLock" && this.capsTooltip === true) {
                    this.capsTooltip = false;
                }
            }

        },
    }
</script>

<style>
    .login_div {
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-image: url(../../assets/loginbg2.png);
        background-repeat: no-repeat;
        overflow: hidden;
    }

    .login_content {
        width: 386px;
        margin-left: calc(50% - 193px);
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.4);
        text-align: center;
        background: #FFFFFF;
        box-shadow: 0 2px 12px 0 rgba(89, 123, 155, 0.5);
        border-radius: 6px;
        padding: 30px 30px;
    }

    .login_title {
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 25px;
        font-weight: 500;
        margin-top: 20px;
        color: #333333;
    }

    .input_login > .el-form-item__content {
        text-align: left;
    }

    .captcha_img {
        height: 32px;
        position: absolute;
        cursor: pointer;
        margin-left: 7px;
        margin-top: 5px;
    }

    .login_button > div {
        margin-left: 0 !important;
    }

    /* 轮播 */
    /* .el-carousel__button {
        background-color: #D8D8D8;
        opacity: 100%;
    } */

    /* .el-carousel__indicator.is-active button {
        background-color: #999999;
    } */

    /* .login_sub_title {
        width: 30px;
        padding: 0 20px 0;
        margin: 20px auto 42px;
        color: #999999;
        font-weight: 500;
        line-height: 1px;
        border-left: 60px solid rgba(153, 153, 153, 0.6);
        border-right: 60px solid rgba(153, 153, 153, 0.6);
        text-align: center;
    } */

    .input_login .username_input input {
        padding: 10px 20px;
        height: 44px;
        font-size: 16px;
        color: #17243E;
    }

    .input_login .password_input input {
        padding: 10px 20px;
        height: 44px;
        font-size: 16px;
        color: #17243E;
    }

    .input_login .captcha_input input {
        /* padding: 10px 50px; */
        height: 44px;
        font-size: 16px;
        color: #17243E;
        /* color: #C9C9C9; */
    }

    .username_input .el-pass {
        background: url(../../assets/usericon.png) no-repeat 10px center;
        background-size: 50%;
        padding: 10px 40px 10px 0;
        height: 44px;
        font-size: 16px;
    }

    .password_input .el-pass {
        background: url(../../assets/lockicon.png) no-repeat 10px center;
    }

    .password_input .el-input__icon {
        background-size: 50%;
        padding: 10px 40px 10px 0;
        height: 44px;
        font-size: 16px;
    }

    .password_input .showpassword {
        background: url(../../assets/eyeicon.png) no-repeat 10px center;
    }

    .password_input .hidepassword {
        background: url(../../assets/hideicon.png) no-repeat 10px center;
    }

    input:-webkit-autofill {
        -webkit-text-fill-color: #17243E !important;
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
        /* background-color:transparent;  */
        background-image: none;
        transition: background-color 50000s ease-in-out 0s;
    }

    .vPic {
        width: 33%;
        height: 44px;
        float: right !important;
        background: #ccc;
    }

    .vPic img {
        width: 100%;
        height: 100%;
        cursor: pointer;
        vertical-align: middle;
    }

    .login_div_part1 {
        position: fixed;
        top: calc(20%/3.4);
        left: calc(50%/3.4);
        z-index: 10000;
    }

    .login_content_title {
        text-align: left;
        padding-bottom: 30px;
    }

    .login_content_title img {
        height: 30px;
        vertical-align: middle;
    }

    .login_content_title span {
        display: inline-block;
        font-weight: 500;
        font-size: 24px;
        color: #303133;
        padding-top: 2px;
        vertical-align: middle;
        padding-left: 10px;
    }

    .login_content_subtitle {
        text-align: left;
        padding-bottom: 24px;
        color: #17243E;
        font-size: 20px;
    }

    .footer_copyright {
        position: fixed;
        bottom: 10px;
        left: 50%;
        font-weight: 400;
        color: #606266;
        font-size: 14px;
        transform: translate(-50%,-50%);
    }
</style>
