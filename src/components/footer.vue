<template>
    <div class="foot-container">
        <div v-for="(icon, index) in icons" :key="index">
            <router-link :to="{name: icon.name}">
                <v-img
                    :src="activeTab == icon.name ? icon.active : icon.normal"
                    :height="icon.height"
                    :width="icon.width"
                    class="mx-auto"
                ></v-img>
            </router-link>
        </div>
    </div>
</template>
<script>

    export default {
        props: {
            activeTab:{
                type: String,
                require: true
            }
        },
        data(){
            return {
                icons:[
                    {
                        name:'profile',
                        normal:require('../assets/img/footer/member.svg'),
                        active:require('../assets/img/footer/member-active.svg'),
                        height:'36px',
                        width:'45px',
                    },
                    {
                        name:'pair',
                        normal:require('../assets/img/footer/main.svg'),
                        active:require('../assets/img/footer/main-active.svg'),
                        height:'39px',
                        width:'23px',
                    },
                    {
                        name:'achievement',
                        normal:require('../assets/img/footer/charmbo.svg'),
                        active:require('../assets/img/footer/charmbo-active.svg'),
                        height:'38px',
                        width:'54px',
                    },
                    {
                        name:'chatList',
                        normal:require('../assets/img/footer/message.svg'),
                        active:require('../assets/img/footer/message-active.svg'),
                        height:'36px',
                        width:'22px',
                    }
                ]
            }
        },
        components: {

        },
    }
</script>
<style>
.foot-container{
    border: 1px solid #BDBDBD;
    border-radius: 16px 16px 0px 0px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    height:72px;
}
</style>