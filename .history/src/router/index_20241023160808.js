import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/Login/AdminLogin.vue')
  },
  {
    path: '/',
    name: 'home',
    component:()=>import('@/views/HomeView.vue'),
    redirect:'/show-admin',
    children:[
      {
        path:'/show-admin',
        name:'show-admin',
        component:()=>import('@/views/Manage/IndexManage.vue')
      },
      {
        path:'/post-admin',
        name:'post-admin',
        component:()=>import('@/views/Manage/PostManage.vue')
      },
      {
        path:'/leavel-admin',
        name:'leavel-admin',
        component:()=>import('@/views/Manage/LeavelManage.vue')
      },
      {
        path:'/user-admin',
        name:'user-admin',
        component:()=>import('@/views/Manage/UserManage.vue')
      },
      {
        path:'/plate-admin',
        name:'plate-admin',
        component:()=>import('@/views/Manage/PlateManage.vue')
      },
      {
        path:'/logs-admin',
        name:'logs-admin',
        component:()=>import('@/views/logs/LogsView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to,form,next)=>{
  let token = localStorage.getItem('token')
  // console.log(token)
  if((!token|| token=='undefined') && to.name != 'login'){
    console.log(11111)
    next('/login')
  }else{
    next()
  }
  // next()
})

export default router
