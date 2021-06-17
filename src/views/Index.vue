<template>
  <div class="max-width index-container">
    <div>
      <div>
        <v-icon x-large @click="$router.push({name: 'profile'})">
          mdi-account
        </v-icon>
        <v-icon x-large class="float-right" @click="toChatList">
          mdi-chat
        </v-icon>
      </div>
      <p>歡迎回來</p>
      <v-avatar size="150">
        <v-img
          :src="getImg"
          class="rounded-circle"
        ></v-img>
      </v-avatar>
      <p>{{userName}}</p>
      <v-btn @click="$router.push({name: 'pair'})" color="error">配對</v-btn>
      <v-btn @click="$router.push({name: 'onboarding'})" color="error">Onboarding</v-btn>
      <v-btn @click="logout" color="error">登出</v-btn>
    </div>
    <footer-bar activeTab="pair"></footer-bar>
  </div>
</template>
<script>
    // import Login from '../components/Login-btn.vue';
    import FooterBar from '../components/footer.vue';
    export default {
      components: {
        // Login,
        FooterBar
      },
      data(){
        return {
          nickname:'這裡放暱稱?'
        }
      },
      computed: {
        userName(){
          return this.$store.state.userinfo.userName;
        },
        getImg(){
          let item = this.$store.state.userinfo;
          if(item && item.pictures && item.pictures.main && item.pictures.main.url){
              return item.pictures.main.url;
          }
          let type = item._id || "1234567890abcdef".charAt(Math.floor(Math.random()*16));
          let sex = item.sex;
          if(typeof sex == "undefined" || sex == null)
              sex = "01".charAt(Math.floor(Math.random()*2));
          let s = sex == 0 ? 'g' : 'b';
          let e = type.charAt(type.length - 1);
          item.pictures.main.url = require('../assets/img/avatars/'+s+e+'.svg');
          return item.pictures.main.url;
        },
      },
      methods:{
        logout(){
          this.$socket.client.disconnect();
          window.socketConnect = false;
          this.$store.dispatch('actionLogout').then(() => {
              this.$router.push({name: "login"});
            });
        },
        toChatList(){
          this.$router.push({name: "chatList"});
        }
      }
    }
</script>
<style>
.index-container{
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr auto;
}
</style>