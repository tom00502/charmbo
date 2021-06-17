<template>
  <div class="hero max-width page-login">
    <div class="text-center">
      <div class="logo mb-8">logo</div>
      <p class="sub-title">Charmbo</p>
      <p class="sub-title">這個是slogan文案</p>
      <div class="space130"></div>
      <login-btn>使用 Google 註冊/登入</login-btn>
      <p class="login-change mt-5 text-center">您上次使用Google帳號登入</p>
      <v-row align="center" class="mt-10 max-width">
        <v-col cols="12" sm="9">
        <v-select
            :items="items"
            label="使用測試帳號登入"
            v-model="testUserId"
            class="width"
        ></v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-btn v-if="testUserId != ''" @click="testLogin" color="primary">登入</v-btn>
          <v-btn v-else>登入</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
    import LoginBtn from '../components/Login-btn.vue';
    import axios from 'axios';
    export default {
      components: {
        LoginBtn,
      },
      data(){
        return {
          testUsers:[],
          testUserId:''
        }
      },
      created(){
        if (window.socketConnect) {
          this.$socket.client.disconnect();
          window.socketConnect = false;
        }

        console.log('socket.io reconnect')
        this.$socket.client.connect();
        window.socketConnect = true;

        if(this.$route.query.token){
          //取得用戶資訊
          this.$store.dispatch('actionUserinfo',this.$route.query.token).then(() => {
            if(this.$store.state.userinfo._id){
              this.$socket.client.emit('regist_room', this.$store.state.userinfo._id);
            }
            this.$router.push({name: "index"});
          });
        }
      },
      mounted(){
        this.getUserList();
        console.log(window)
      },
      computed: {
        items(){
          return this.testUsers.map(e=> {
            let name = 'unknown';
            if(e.userName)
              name = e.userName;
            else if(e.name && e.name.nickName)
              name = e.name.nickName;
            return {
              text:name,
              value:e._id}});
        }
      },
      methods:{
        getUserList(){
            let url = window.API_HOST + '/test/userlist/?filter=test'
            let self = this;
            let options = {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
            axios.get(url, options).then(response => {
                if(response.data.code == "Success"){
                    self.testUsers = response.data.data;
                }
            })
        },
        testLogin(){
          if (!window.socketConnect) {
            this.$socket.client.connect();
            window.socketConnect = true;
          }
          this.$store.dispatch('actionTestUserLogin',this.testUserId).then(() => {
            this.$socket.client.emit('regist_room', this.testUserId);
            this.$router.push({name: "index"});
          });
        }
      }
    }
</script>
<style>
  .hero {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .hero .lead {
    font-weight: 200;
    font-size: 1.5rem;
  }
  .logo {
    background: #D1D1D1;
    width:80px;
    height:80px;
    margin-left: auto;
    margin-right: auto;
  }
  .text-center {
    text-align: center;
  }
  .sub-title{
    border-radius: 8px;
    width: 264px;
    height: 32px;
    margin-left: auto;
    margin-right: auto;
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
    color: #FFFFFF;
  }
  .space130{
    height:130px;
  }
  .page-login{
    background:rgba(63, 62, 62, 0.5);;
  }
  .login-change{
    font-family: SF Pro Text;
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    line-height: 20px;
    align-items: center;
    color: #FFFFFF;
    width: 300px;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
  }
</style>