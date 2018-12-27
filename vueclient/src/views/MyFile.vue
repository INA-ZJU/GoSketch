<template>
    <div id="myfile">
        <el-row>
        <el-col :span="1">
            <el-button @click="back" icon="el-icon-caret-left"></el-button>
        </el-col>
        </el-row>
        <el-row>
            <div v-if="loading">
                Loading...
            </div>
            <div v-if="!loading">
                <h1>Hello, {{username}}! This is your Starred Files.</h1>
                <el-table
                :data="tableData"
                style="width: 100%">
                <!-- <el-table-column
                prop="star"
                label="收藏"
                width="60"
                v-if="loginState">
                <template slot-scope="scope">
                    <i :class="handleStarIcon(scope)" @click="changeStarIcon(scope)"></i>
                </template>
                </el-table-column> -->
                <el-table-column
                prop="filename"
                label="文件名"
                width="150">
                </el-table-column>
                <el-table-column
                prop="address"
                label="下载地址">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="60">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">下载</el-button>
                </template>
                </el-table-column>
            </el-table>
            </div>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'myfile',
    created () {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        this.fetchData()
    },
    data() {
        return {
            loading: false,
            username: '',
            tableData: []
        }
    },    
    methods: {
        fetchData() {
            // this.loading = true;
            const {username} = this.$route.params; 
            console.log(username);
            this.username = username;
            // this.loading = false;
            axios.post('http://localhost:3000/func/getstarfile',{
                username
            }).then(function(response) {
                console.log(response);
            })
        },
        back() {
            this.$router.go(-1);
        }
    },
}
</script>
<style>

</style>
