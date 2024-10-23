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
        component:()=>import('@/views/Manage/IndexManage.vue')
      },
      {
        path:'/post-admin',
        component:()=>import('@/views/Manage/PostManage.vue')
      },
      {
        path:'/leavel-admin',
        component:()=>import('@/views/Manage/LeavelManage.vue')
      },
      {
        path:'/user-admin',
        component:()=>import('@/views/Manage/UserManage.vue')
      },
      {
        path:'/plate-admin',
        component:()=>import('@/views/Manage/PlateManage.vue')
      },
      {
        path:'/logs-admin',
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
  console.log(to.name)
  if(!localStorage.getItem('token') && to.name !== 'login'){
    next('/login')
  }else{
    next()
  }
  // next()
})

export default router
