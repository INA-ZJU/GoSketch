<template>
    <div id="topbar">
        <div>Html2Sketch Webtool</div>
        <div>
            <el-dropdown>
            <span class="el-dropdown-link">Welcome, <strong>{{ handledUserData.name }}</strong></span>
            <el-dropdown-menu v-if="loginState" slot="dropdown">
                <el-dropdown-item @click.native="checkMyFile">我的文件</el-dropdown-item>
                <el-dropdown-item @click.native="checkMyInfo">个人信息</el-dropdown-item>
                <el-dropdown-item divided @click.native="loginout">登出账户</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if="!loginState" slot="dropdown">
                <el-dropdown-item @click.native="login">登录</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>    
</template>


<script>
    export default {
        name: 'topbar',
        props: {
            userdata: Object,
            loginState: Boolean
        },
        data() {
            return {
                dialogVisible: false
            }
        },
        methods: {
            willhandle: function() {
                console.log("sorry");
                this.$message.warning("该功能即将上线");
            },
            checkMyFile: function() {
                const username = this.userdata.name;
                this.$router.push({name:'myfile', params: {username}});
            },
            checkMyInfo: function() {
                this.$options.methods.willhandle.bind(this)();
            },
            login: function() {
                this.$emit("login")
            },
            loginout: function() {
                this.$emit("loginout")
            }
        },
        computed: {
            handledUserData: function(){
                if(this.userdata !== null) return this.userdata;
                else return {
                    name: 'tourist',
                    avatar: null
                }
            }
        },
    }
</script>

<style>
#topbar{
    color:#606266;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
}
</style>
