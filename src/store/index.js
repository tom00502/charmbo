import Vue from 'vue'
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router/index';
Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        userinfo:null,
        chatRoom:[],
        charmboRoom:{
            _id:"charmbo",
            userName:"Charmbo 通知",
            pictures:{
                main:{url:"https://i.imgur.com/i7bqyHK.png"},
                others:[],
            },
            message:[]
        }
    },
    mutations:{
        setUserinfo(state,data){
            if(data && Object.keys(data).length != 0 && data != "null"){
                if(!data.userName){
                    data.userName = 'unknow';
                    if(data.name && data.name.nickName)
                        data.userName = data.name.nickName;
                }
                let {_id, userName, token, sex, pictures} = data;
                window.$cookies.set("auth",{_id, userName, token, sex, pictures});
            }
            else{
                window.$cookies.set("auth",null);
                data = null;
            }
                
            state.userinfo = data;
        },
        clearUserinfo(state){
            window.$cookies.remove("auth");
            state.chatRoom = [];
            state.userinfo = null;
        },
        saveChatRoomRecords(state,data){
            if(state.chatRoom.length == 0)
                return;
            if (data.historyMsgs) {
                //Save history messages
                const msgs = state.chatRoom.filter(e=>e._id == data.friendsId)[0].message;
                state.chatRoom.filter(e=>e._id == data.friendsId)[0].message = [...data.historyMsgs, ...msgs];
            } else {
                //Save received messages
                state.chatRoom.filter(e=>e._id == data.friendsId)[0].message.push(data.data);
            }
        },
        saveTypingToChatRoom(state, data) {
            if(state.chatRoom.length === 0)
                return;
            const index = state.chatRoom.findIndex(e=>e._id == data.sender);
            if (index >= 0) {
                Vue.set(state.chatRoom[index], 'isTyping', data.isTyping);
            }
        },
        setRoomData(state,data){
            if(state.chatRoom == [] || state.chatRoom.length != data.length){
                state.chatRoom = data;
                state.chatRoom.forEach(e=> {
                    if(e.pinned === undefined) Vue.set(e,'pinned',false)
                    if(e.isTyping === undefined ) Vue.set(e,'isTyping',false)
                    if(e.unread === undefined ) Vue.set(e,'unread',false)
                    if(e.onlineStatus === undefined ) Vue.set(e,'onlineStatus',false)
                    if(e.isLeft === undefined ) Vue.set(e,'isLeft',false)
                })
            }
        },
        setCharmboRoomData(state,data){
            state.charmboRoom.message = data;
        },
        deleteFriend(state,data){
            state.chatRoom = state.chatRoom.filter(friend => friend._id != data);
        },
        setUserPinState(state,data){
            state.chatRoom.find(chatUser=> chatUser._id == data.id).pinned = data.pinned;
        },
        saveOnlineStatus(state,data) {
            //console.log(data);
            if(state.chatRoom.length === 0)
                return;
            const index = state.chatRoom.findIndex(e=>e._id == data.friendsId);
            if (index >= 0) {
                Vue.set(state.chatRoom[index], 'onlineStatus', data.onlineStatus);
            }
        },
        setUserMainPicture(state,data) {
            const publicId = data.publicId;
            //const type = data.type;
            const url = data.url;
            Vue.set(state.userinfo.pictures.main, 'publicId', publicId);
            Vue.set(state.userinfo.pictures.main, 'url', url);

            //update cookie
            const {_id, name, token, sex, pictures} = state.userinfo;
            window.$cookies.set("auth",{_id, name, token, sex, pictures});
            
        },
        setUserOthersPicture(state,data) {
            const publicId = data.publicId;
            //const type = data.type;
            const url = data.url;
            const index = data.index;
            if (0 <= index && index < 4) {
                console.log(publicId, url, index);
                Vue.set(state.userinfo.pictures.others[index], 'publicId', publicId);
                Vue.set(state.userinfo.pictures.others[index], 'url', url);
            }

            //update cookie
            const {_id, name, token, sex, pictures} = state.userinfo;
            window.$cookies.set("auth",{_id, name, token, sex, pictures});
        },
        setLastSeenMessageTimeStamp(state,data) {
            state.chatRoom.find(chatUser=> chatUser._id == data.id).lastSeenMessageTimeStamp = data.lastSeenMessageTimeStamp;
        },
    },
    actions:{
        actionTestUserLogin({commit},testUserId){
            return new Promise((resolve, reject) => {
                let url = window.window.API_HOST + '/test/login/' + testUserId;
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.data.code == "Success"){
                        //self.testUsers = response.data.data;
                        console.log('token:',response.data.data)
                        commit('setUserinfo',response.data.data.userinfo);
                        
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error);
                    reject(error);
                })           
            });
        },
        actionLogout({commit, state}){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/auth/signout/';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.status === 200) {
                        commit('clearUserinfo', null);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(() => {
                    commit('clearUserinfo', null);
                    router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })
            })
        },
        actionUserinfo({commit, state},token = state.userinfo.token.token){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/users/user/';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.status === 200){
                        commit('setUserinfo', response.data);
                        resolve(response.data);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error)
                    router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })           
            });
        },
        actionFriendinfo({state},friendId){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/detail/' + friendId;
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.data.code == "Success"){
                        resolve(response.data.data.userinfo);
                    }else{
                        reject(response);
                    }
                })       
            });
        },
        actionPairLike({state},param){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/like';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.patch(url, param, options).then(response => {
                    if(response.status === 200){
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                  console.log(error)
                    router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })           
            });
        },
        actionPairDislike({state},param){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/dislike';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.patch(url, param, options).then(response => {
                    if(response.status === 200){
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error)
                    router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })           
            });
        },
        actionPairList({state},params){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/suggested_users';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    },
                    params:params
                }
                axios.get(url, options).then(response => {
                    if(response.status === 200){
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error)
                    router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })           
            });
        },
        actionFriendList({state,commit}){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.status === 200){
                        commit('setRoomData',response.data);
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error)
                    router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })           
            });
        },
        actionCharmboMessage({state,commit}){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/commonMessege/';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.status === 200){
                        commit('setCharmboRoomData',response.data.data);
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error)
                })           
            });
        },
        actionUnfriend({state,commit},param){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    },
                    data:param
                }
                axios.delete(url, options).then(response => {
                    if(response.status === 200){
                        commit('deleteFriend',param.deleteId);
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log(error)
                    //router.push({ name: 'login' }).catch((err) => {console.log(err)});
                })
            });
        },
        actionReceiveMessage({commit},data){
            return new Promise((resolve) => {
                commit('saveChatRoomRecords',data);
                resolve();
            })
        },
        actionTyping({commit}, data) {
            return new Promise((resolve) => {
                commit('saveTypingToChatRoom', data);
                resolve();
            })
        },
        actionLoadHistoryMessage({state,commit},data) {
            return new Promise((resolve) => {
                let url = window.API_HOST + '/friendlists/history_messages';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    },
                    params:{
                        'chatRoomID': data.chatRoomID,
                        'lastMessageId': data.lastMessageId
                    }
                }
                axios.get(url, options).then(response => {
                    if(response.status === 200){
                        //console.log(response);
                        if(response.data.message.length != 0)
                            commit('saveChatRoomRecords', data={
                                friendsId: data.friendsId,
                                historyMsgs: response.data.message
                            });
                        resolve(response.data.message.length);
                    }
                
                })
            })
        },
        actionUserUpdate({state},param){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/users/user';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.patch(url, param, options).then(response => {
                    if(response.status === 200){
                        resolve(response);
                    }else{
                        reject(response);
                    }
                }).catch(error => {
                    console.log('error',error);
                })           
            });
        },
        actionPinUser({commit,state},param){
            console.log(param);
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/chatlist/pin';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.patch(url, param, options).then(response => {
                    if (response.status === 200) {
                        commit('setUserPinState',param);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(err => {
                    console.log(err);
                    router.push({ name: 'login' }).catch((error) => {console.log(error)});
                })
            });
        },
        actionOnlineStatus({commit},data){
            return new Promise((resolve) => {
                commit('saveOnlineStatus', data);
                resolve();
            })
        },
        actionUploadMainPicture({commit,state},data){
            console.log(data);
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/users/user/pictures/upload';
                let options = {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                };
                let formData = new FormData();
                formData.append('picture', data.uploadPicture);
                formData.append('type', "MAIN");

                axios.patch(url, formData, options).then(response => {
                    if (response.status === 200) {
                        commit('setUserMainPicture',response.data);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(err => {
                    console.log(err);
                    router.push({ name: 'login' }).catch((error) => {console.log(error)});
                })
            });
        },
        actionUploadOthersPicture({commit,state},data){
            console.log(data);
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/users/user/pictures/upload';
                let options = {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                };
                let formData = new FormData();
                formData.append('picture', data.uploadPicture);
                formData.append('type', "OTHERS");
                formData.append('index', data.index);

                axios.patch(url, formData, options).then(response => {
                    if (response.status === 200) {
                        commit('setUserOthersPicture',response.data);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(err => {
                    console.log(err);
                    router.push({ name: 'login' }).catch((error) => {console.log(error)});
                })
            });
        },
        actionRemovePicture({state},data){
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/users/user/pictures/remove';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                };
                axios.patch(url, data, options).then(response => {
                    if (response.status === 200) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(err => {
                    // console.log(response)
                    // if (response.status === 400) {
                    //     reject(err);
                    // } else {
                        console.log(err);
                        router.push({ name: 'login' }).catch((err) => {console.log(err)});
                    // }
                })
            });
        },
        actionSaveLastSeenMessageTimeStamp({commit,state},param){
            console.log(param);
            return new Promise((resolve, reject) => {
                let url = window.API_HOST + '/friendlists/chatlist/last_seen_message_time_stamp';
                let options = {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + state.userinfo.token.token
                    }
                }
                axios.patch(url, param, options).then(response => {
                    if (response.status === 200) {
                        commit('setLastSeenMessageTimeStamp',param);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(err => {
                    console.log(err);
                    router.push({ name: 'login' }).catch((error) => {console.log(error)});
                })
            });
        },
    }
});