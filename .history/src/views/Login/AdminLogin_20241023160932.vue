<template>
    <div class="login">
        <div class="login-body">
            <div class="body-head">
                provateBBS 后台管理系统
            </div>
            <div class="body-bom">
                <div class="left">
                    <img src="@/assets/image/数据支持.svg" alt="">
                </div>
                <div class="login-form">
                    <el-form
                        ref="ruleFormRef"
                        class="demo-ruleForm"
                        :rules="loginRule"
                        :model="loginForm"
                    >
                        <el-form-item label="账号" prop="name">
                            <el-input placeholder="请输入账号"  v-model="loginForm.name" clearable/>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" clearable/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="submitForm(ruleFormRef)">
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref,reactive } from 'vue'
    import { useUserStore } from '@/store';
    import { useRouter } from 'vue-router';
    const userStore = useUserStore()
    const router = useRouter()
    // 绑定表单的数据
    const loginForm = ref({
        name:'',
        password:''
    })
    // 表单校验规则
    const loginRule = reactive({
        name:[
            { required:true,message:'请输入账号！',trigger:'blur'}
        ],
        password:[
            { required:true,message:'请输入密码!',trigger:'blur'}
        ]
    })
    // 绑定表单元素
    const ruleFormRef = ref('')
    
    // 登录按钮
    const submitForm =async (form1) =>{
        if(!form1) return
        let canLogin = ref(false)
        await form1.validate((valid,fields)=>{
            if(!valid){
                // console.log('error submit',fields)
                canLogin.value = false
                return
            }
            canLogin.value = true
        })
        if(!canLogin.value){
            return
        } 
        let result 
        try{
            result = await userStore.login(loginForm.value)
        }catch(e){
            ElMessage.error('登陆失败，账户或密码错误！')
        }
        if(!result){
            return
        }
        ElMessage({
            message: '登录成功',
            type: 'success',
        })
        // console.log(result)
        localStorage.setItem('token',result)
        router.push('/')
    }
</script>

<style lang="scss" scoped>
    .login{
        width: 100%;
        min-width: 1440px;
        background: linear-gradient(to bottom, #5a5151, #000000);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-body{
        // border:1px solid black;
        border-radius: 20px;
        background-color:rgb(50, 50, 50,0.1);
        // opacity: 0.8;
        width: 1000px;
        height: 500px;
        display: flex;
        padding: 0 20px;
        flex-direction: column;
        align-items: center;
        .body-head{
            margin: 20px;
            font-size: 30px;
            font-weight: bolder;
            padding: 10px;
            font-style: italic;
            color: rgb(103, 194, 58);
        }
        .body-bom{
            // justify-self: center;
            margin-top: 20px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .left{
            img{
                width: 450px;
            }
        }
        .login-form{
            .demo-ruleForm{
                width: 300px;
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background-color: rgb(255, 255, 255,0.1);
                border-radius: 20px;
                padding: 10px;
                .el-button{
                    width: 100%;
                    // margin:0 10px;
                }
            }
        }
    }
</style>