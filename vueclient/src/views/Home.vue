<template>
  <div id="app">
    <el-container>
      <el-header>
        <Topbar
          @login="login" 
          @loginout="loginout"
          :userdata="loginState ? user : null"
          :loginState="loginState"
        />
      </el-header>

      <el-main>
        <Boy @starfile="starfile" :loginState="loginState"/>
      </el-main>
      
      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar'
import Boy from '@/components/Boy'
export default {
  name: 'home',
  beforeMount: function(){
    console.log(this.$route)
    const data = this.$route.params;
    this.loginState = data.loginState;
    this.user.name = data.username;
  },
  components: {
    Topbar,
    Boy
  },
  methods: {
    starfile: function({filename}) {
      console.log('filename',filename);
      const username = this.user.name;
      axios.post('http://localhost:3000/func/starfile',{
        filename,
        username
      })
      .then(function(response){
        console.log(response);
      });
    },
    loginout: function() {
      this.user = {
        name: '',
        avatar: ''
      };
      this.loginState = false;
    }, 
    login: function() {
      console.log("this is login status");
      this.$router.push('/login');
    }
  },
  data: function(){
    return {
      user: {
        name: '',
        avatar: ''
      },
      loginState: false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-left: 10vw;
  padding-right: 10vw;
}
</style>
