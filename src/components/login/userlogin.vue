<template>
    <el-form
        label-width='0px'
        status-icon
        ref="loginForm"
    >
        <el-form-item prop="username">
            <el-input
                prefix-icon="el-icon-news" 
                size="large"
                auto-complete="off"
                placeholder="请输入用户名"
                autofocus='true'
                v-model="username"
            >
                <i slot="prefix"
                class="icon-yonghu"></i>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input 
                type="password" 
                prefix-icon="el-icon-info" 
                size="large" 
                auto-complete="off" 
                placeholder="请输入密码"
                v-model="password"
            >
                <i class="el-icon-view el-input__icon" slot="suffix"></i>
                <i slot="prefix" class="icon-mima"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-row >
                <el-col :span="18">
                    <el-input 
                        prefix-icon="el-icon-more-outline" 
                        size="large"
                        auto-complete="off"
                        placeholder="请输入验证码"
                    >
                        <i slot="prefix"
                        class="icon-yanzhengma"></i>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <div class="login-code">
                        <span class="login-code-img">1234</span>
                        <!-- <img src="code.src"
                            alt="验证码"
                            class="login-code-img"/> -->
                        <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
                    </div>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="small" @click="goindex()" class="login-submit">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import config from '../config.js'
    export default{
        name: 'cjUserLogin',
        data() {
            return {
                msg: 'this is login',
                username: 'admin',
                password: '123456',
                code: '1234'
            }
        },
        methods: {
            goindex(){
                console.log('登陆请求发起!!!')
                this.$axios.post(
                    config.serverurl+'/login',
                    {
                        code: this.code,
                        loginname: this.username,
                        password: this.password
                    }
                ).then((res) => {
                    console.log('登陆请求:',res)
                    let token = res.data.data['token'] // 获取token
                    sessionStorage.setItem('token', token) // 设置保存到本地token
                }).catch((err) => {
                    console.log('请求失败')
                    console.log('失败详情:',err)
                })
                this.$router.push('/index')
            }
        },
    }
</script>

<style scoped>
</style>