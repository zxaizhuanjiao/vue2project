<template>
    <div class="login_div">
        <div class="login_content">
            <div class="login_title">NSSA</div>
            <el-form ref="form" :model="form" :rules="rules" @submit="handleSubmit" label-width="80px">
                <el-form-item label="用户名" class="input_login" prop="username">
                    <el-input v-model="form.username" style="width: 280px"></el-input>
                </el-form-item>
                <el-form-item label="密码" class="input_login" prop="password">
                    <el-input v-model="form.password" style="width: 280px"></el-input>
                </el-form-item>
                <el-form-item class="login_button">
                    <el-button type="primary" @click="handleSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from '../../utils/api';

    export default {
        name: "LoginComponent",
        data() {
            return {
                formLayout: 'horizontal',
                form: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                message: '',
            };
        },
        created() {
            sessionStorage.setItem('Authorization', 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ=');
        },
        methods: {
            handleSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$axios.defaults.withCredentials = true;
                        this.$axios.post(api.LOGIN.url, this.qs.stringify(this.form)).then(res => {
                            console.log(res);
                            if (res.data.code === '000000') {
                                // 存登录返回的session
                                sessionStorage.removeItem('Authorization');
                                sessionStorage.setItem('Authorization', 'bearer ' + res.data.data.access_token);
                                sessionStorage.setItem('username', res.data.data.organization);
                                sessionStorage.setItem('roleId', res.data.data.role[0].authority);
                                this.$router.push('/');
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                    }
                });
            },
        },
    }
</script>

<style>
    .login_div {
        background-color: #6495ED;
        height: 100%;
        width: 100%;
        min-height: 100%;
        display: flex;
        align-items: center;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .login_content {
        width: 386px;
        margin-left: calc(50% - 193px);
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.4);
        text-align: center;
    }
    .login_title {
        font-size: 35px;
        text-align: center;
        margin-bottom: 25px;
        font-weight: 600;
        margin-top: 20px;
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
        margin-left: 0!important;
    }
</style>
