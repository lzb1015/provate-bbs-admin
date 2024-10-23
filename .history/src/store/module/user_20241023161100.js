import { defineStore } from "pinia";
import { ref,computed } from 'vue'
import api from '@/api'
import { parseToken } from "@/utils/utils";
// import axios from 'axios'
export const useUserStore = defineStore('user',()=>{
    // 存放用户数据
    const userList = ref([])
    // 设置数据
    const setUserList = (list)=>{
        userList.value = list
    }
    const getAlluser = computed(()=>userList.value)

    const getLoginUser = computed(()=>{
        let session = parseToken(localStorage.getItem('token'))
        return userList.value.filter(item=>item.id === session.id)[0]
    })

    // 获取当前的用户数据
    const getuser = computed(()=>{
        if(!getLoginUser.value){
            return []
        }
        if(getLoginUser.value.identity === 'root'){
            return userList.value.filter(item=>item.id !== getLoginUser.value.id)
        }else{
            return userList.value.filter(item=>item.identity === 'user')
        }
    })
    
    // 根据id设置用户的可登陆情况
    const changeUserLogin = (id,islogin)=>{
        api.setUserLoginAdmin(id,islogin)
    }
    

    // 登录
    const login = async (obj) =>{
        let result = await api.loginAdmin(obj)
        if(result.data){
            return result.data
        }else{
            return false
        }
    }

    // 退出登录
    const outLogin = ()=>{
        sessionStorage.removeItem('admin_user')
    }

    // 设置用户信息
    const setUserInfo = (form)=>{
        // console.log(form)
        api.setUserInfoAdmin(form)
    }
    // 将用户设置成管理员
    const setToAdmin = (id) =>{
        userList.value = userList.value.map(item=>{
            if(item.id === id){
                item.identity = 'adminstrator'
            }
            return item
        })
        api.setUsetToAdmin(id,'adminstrator')
    }
    // 设置用户成普通用户
    const setToUser = (id)=>{
        userList.value = userList.value.map(item=>{
            if(item.id === id){
                item.identity = 'user'
            }
            return item
        })
        api.setUsetToAdmin(id,'user')
    }
    // 删除用户
    const deleteUser = (id) =>{
        userList.value = userList.value.filter(item=>item.id !== id)
        api.rmUserAdmin(id)
    }

    // 根据id查找用户的基本信息
    const searchForUid = (id)=>{
        let user = (userList.value.filter(item=>item.id === id))[0]
        return user
    }
    return {
        setUserList,
        getuser,
        login,
        outLogin,
        changeUserLogin,
        deleteUser,
        setUserInfo,
        setToAdmin,
        setToUser,
        searchForUid,
        getAlluser,
        getLoginUser
    }
})