<template>
    <div class="head-body">
        <div class="head-time">
            {{ nowTime }}
        </div>
        <div class="head-user">
            <div class="user-img">
                <img :src="`http://127.0.0.1:3030/${user.icon}`" alt="">
            </div>
            <div class="user">
                <el-dropdown popper-class="dropDownStyle">
                    <span class="el-dropdown-link">
                        {{user.nickName}}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                    </span>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>用户设置</el-dropdown-item>
                        <el-dropdown-item @click="outLogin">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref,onMounted,computed } from 'vue'
    import { ArrowDown } from '@element-plus/icons-vue'
    import { useUserStore } from '@/store';
    import { useRouter } from 'vue-router';
    import { parseToken } from '@/utils/utils';
    const userStore = useUserStore()
    const router = useRouter()
    const nowTime = ref('')
    const user = computed(()=>parseToken(localStorage.getItem('token')))
    
    const outLogin = ()=>{
        ElMessageBox.confirm(
            '确定要退出登录吗?',
            'Warning',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        )
        .then(() => {
            ElMessage({
                type: 'success',
                message: '退出成功！',
            })
            userStore.outLogin()
            router.push('/login')
        })
        .catch(()=>{

        })
    }
    onMounted(()=>{
        setInterval(() => {
            let nowDate = new Date()
            let week = ['日','一','二','三','四','五','六']
            let month = nowDate.getMonth() >= 10 ? nowDate.getMonth() + 1: '0' + (nowDate.getMonth() + 1)
            let day = nowDate.getDate() >= 10 ?  nowDate.getDate() : '0' + nowDate.getDate()
            let hour = nowDate.getHours() >= 10 ? nowDate.getHours() : '0' + nowDate.getHours()
            let minutes =  nowDate.getMinutes() >= 10 ? nowDate.getMinutes() :'0' + nowDate.getMinutes()
            let seconds = nowDate.getSeconds() >= 10 ? nowDate.getSeconds() :'0' + nowDate.getSeconds()
            nowTime.value = nowDate.getFullYear() + '-' + month + '-' + day + ' 星期' + week[nowDate.getDay()] + ' ' + hour + ':' + minutes + ':' + seconds
        }, 1000);
    })
</script>

<style lang="scss" scoped>
    .head-body{
        background-color: rgb(0, 0, 0);
        margin: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: right;
        .head-time{
            margin: 0 30px;
            color: rgb(100, 194, 60);
        }
        .head-user{
            display: flex;
            align-items: center;
            .user-img{
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50px;
                }
            }
            margin-right: 30px;
            .user{
                margin: 15px;
                .el-dropdown-link{
                    color: white;
                    outline: none;
                    cursor: pointer;
                }
                :global(.dropDownStyle .el-dropdown-menu__item:hover) {
                    background-color: #EEEEEE !important;
                    color: rgb(100, 194, 60) !important;
                }
            }
            
        }
    }
</style>