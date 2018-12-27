<template>
    <div id="boy">
        <el-form  label-width="80px">
            <!-- {{url}} -->
            <el-form-item label="网页地址">
                <el-input v-model="myurl"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitform()">提交</el-button>
            </el-form-item>
            <el-form-item>
            <el-table
                :data="tableData"
                style="width: 100%"
                :row-class-name="tableRowClassName">
                <el-table-column
                prop="star"
                label="收藏"
                width="60"
                v-if="loginState">
                <template slot-scope="scope">
                    <i :class="handleStarIcon(scope)" @click="changeStarIcon(scope)"></i>
                </template>
                </el-table-column>
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
            </el-form-item>
            <el-button @click="downloadAll()" type="primary" v-if="tableData.length>0">
                下载全部
            </el-button>
            <el-button @click="deleteAll()" type="danger" v-if="tableData.length>0">
                删除全部
            </el-button>
            <p>共计 {{tableData.length}} 条转换</p>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'boy',
        props: {
            loginState: Boolean
        },
        data: function(){
            return {
                myurl: '',
                geturl: '无',
                tableData: [],
            }
        },
        computed: {
            //闭包极限传参
            handleStarIcon() {
                const that = this;
                return function(scope) {
                    if(scope.row.star){
                        console.log('that refers to:',that);
                        return "el-icon-star-on";                        
                    }
                    return "el-icon-star-off"
                }
            }
        },
        methods: {
            changeStarIcon(scope) {
                const star = this.tableData[scope.$index].star;
                const filename = this.tableData[scope.$index].filename;
                if(star) this.$message.success("已从个人收藏移除");
                else {
                    this.$emit('starfile',{filename});
                    this.$message.success("已加入个人收藏");
                }
                this.tableData[scope.$index].star = !star;
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === true) {
                return 'success-row';
                }
                return '';
            },
            downloadAll: function() {
                var alist = [];
                var a = document.createElement("a");
                this.tableData.forEach(element => {
                    console.log(element);
                    a.href = element.address;
                    a.download = element.filename+'json';
                    alist.push(a);
                });
                alist.forEach(element => {
                    element.click();
                })
            },
            deleteAll: function() {
                this.tableData = []
            },
            handleClick: function(val) {
                console.log(val.address);
                val.status = true;
                var a = document.createElement("a");
                a.href = val.address;
                a.download = val.filename+'json';
                a.click();
            },
            submitform: function(){
                let myurl = this.myurl;
                const that = this;
                // console.log(myurl)
                //console.log(this);
                axios.post(
                    'http://localhost:3000/func/getfile', 
                    {
                        data: myurl
                    },
                )
                .then(function(response) {
                    console.log(response);
                    if(response) {
                      const address = response.data.href;
                      const filename = response.data.filename;
                      that.tableData.push({
                          filename: filename,
                          address: address,
                          status: false,
                          star: false
                      });                        
                    }
                });
            }
        }
    }    
</script>
<style>
p{
    color:#606266;
    font-size: 14px;
    font-weight: bold;
}
.el-table .success-row {
    background: #f0f9eb;
}
i {
    font-size: 25px;
    color:yellowgreen;
}
</style>
