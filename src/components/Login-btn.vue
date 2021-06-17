<template>
  <a :href="googleURL">
    <div class="login-btn">
      <span class="login-span"><slot>使用 google 帳號註冊</slot></span>
    </div>
  </a>
</template>
<script>
export default {
  computed: {
    googleURL() {
      return window.API_HOST + '/auth/google';
    },
  },
};
</script>
<style>
.login-btn {
  background: #ffffff;
  border-radius: 6px;
  width: 300px;
  height: 44px;
  bottom: 300px;
}
.login-span {
  height: 24px;
  left: 14px;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 19px;
  line-height: 44px;
  text-align: center;
  letter-spacing: 0.361px;
  color: #000000;
}
</style>
