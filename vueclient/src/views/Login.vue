<template>
    <div id="login">        
        <h3>Html2Sketch Webapp</h3>
        <el-col :span="12" :offset="6">
        <el-form  label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="login" type="primary">登录</el-button>
                <el-button @click="gotourist">游客体验</el-button>
            </el-form-item>
        </el-form>
        </el-col>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            username: '',
            password: ''
        }
    },    
    methods: {
        gotourist: function() {
            this.$router.push('/');
        },
        login: function() {
            const that = this;
            const username = this.username;
            const password = this.password;
            axios.post(
                'http://localhost:3000/func/login', 
                {
                    username,
                    password
                },
            )
            .then(function(response) {
                console.log(response);
                const isValid = response.data.isValid;
                if(isValid){
                    that.$message.success('登录成功');
                    that.$router.push({ name: 'home', params: { loginState: true, username }});
                }else{
                    that.$message.error('登录失败');
                }
            });
        }
    },
}
</script>
<style>

</style>
