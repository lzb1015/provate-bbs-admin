<template>
  <div class="menu-body">
    <div class="menu-top">
      <div>
        provateBBS
      </div>
    </div>
    <div class="menu-user">
      <div class="user-img">
        <img :src="`http://127.0.0.1:3030/${user.icon}`" alt="">
      </div>
      <div class="user-title">
        {{ user.nickName }}
      </div>
    </div>
    <el-menu
      :default-active="active"
      class="el-menu-vertical-demo"
    >
      <el-menu-item index="1" class="el-menu-item-demo" @click="checkShow('show-admin')">
        <i class="iconfont icon-shouye"></i>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="2" @click="checkShow('plate-admin')">
        <i class="iconfont icon-bankuai"></i>
        <template #title>板块管理</template>
      </el-menu-item>
      <el-menu-item index="3" @click="checkShow('post-admin')">
        <i class="iconfont icon-tiezi"></i>
        <template #title>帖子管理</template>
      </el-menu-item>
      <el-menu-item index="4" @click="checkShow('leavel-admin')">
        <i class="iconfont icon-pinglun"></i>
        <template #title>留言管理</template>
      </el-menu-item>
      <el-menu-item index="5" @click="checkShow('user-admin')">
        <i class="iconfont icon-yonghu"></i>
        <template #title>用户管理</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
    import { useRouter,useRoute } from 'vue-router'
    import { computed,ref,watch } from 'vue'
    const router = useRouter()
    const route = useRoute()
    // console.log(route.path)
    function checkShow(str){
      router.push('/'+str)
    }
    const user = computed(()=>JSON.parse(sessionStorage.getItem('admin_user')))
    const active = ref('1')
    watch(() => route.path,(newValue)=>{
      if(newValue === '/show-admin'){
        active.value = '1'
      }else if(newValue === '/plate-admin'){
        active.value = '2'
      }else if(newValue === '/post-admin'){
        active.value = '3'
      }else if(newValue === '/leavel-admin'){
        active.value = '4'
      }else if(newValue === '/user-admin'){
        active.value = '5'
      }else{
        active.value = '0'
      }
    },{ 
      immediate:true
    })
</script>

<style lang="scss" scoped>
  .menu-body{
    background-color: rgb(0, 0, 0);
    min-height: 100vh;
    height: 100%;
    .menu-top{
      width: 100%;
      display: flex;
      height: 60px;
      font-weight: bold;
      font-style: italic;
      font-size: 20px;
      align-items: center;
      justify-content: center;
      div{
        width: 130px;
        padding: 10px;
        border-radius: 10px;
        text-align: center;
        color: rgb(103, 194, 58);

      }
    }
    .menu-user{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;
      .user-img{
        img{
          width: 80px;
          height: 80px;
          border-radius: 50px;
        }
      }
      .user-title{
        color: white;
        font-size: 15px;
      }
    }
  }
  .el-menu-vertical-demo{
    background-color: rgb(0, 0, 0);
    border:none;
    width: 100%;
    .iconfont{
      font-size: 20px;
      margin: 0 5px 0 0;
    }
    .icon-shouye{
      font-size: 25px;
    }
    .el-menu-item{
      color: rgb(187, 187, 187);
      font-size: large;
      font-weight:bolder;
    }
    .el-menu-item:hover{
      background-color: rgb(38, 38, 38);
      color: rgb(103, 194, 58);
    }
    .is-active{
      background-color: rgb(91, 91, 91);
      color: rgb(103, 194, 58);
    }
  }
</style>