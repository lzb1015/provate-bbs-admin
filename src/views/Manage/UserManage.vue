<template>
    <div class="user-main">
        <show-where>
            <template #default>
                用户管理
            </template>
        </show-where>
        <div class="delMore">
            <div>
                <el-button type="danger" @click="rm_more">批量删除</el-button>
                <el-button type="success" @click="set_admin" v-if="userStore.getLoginUser?.identity === 'root'">设置成管理员</el-button>
                <el-button type="success" @click="set_user" v-if="userStore.getLoginUser?.identity === 'root'">设置成普通用户</el-button>
            </div>
            <div>
                已选 <span style="color: red;">{{selectRows.length}}</span> 条数据
            </div>
        </div>
        <div class="user-list">
            <el-table v-if="showList" :data="showList" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="name" label="账号" />
                <el-table-column prop="nickName" label="昵称"/>
                <el-table-column prop="password" label="密码" />
                <el-table-column label="用户头像">
                    <template #default="scope">
                        <el-image :src="`http://127.0.0.1:3030/${scope.row.icon}`" style="width: 60px;"/>
                        <!-- <el-button type="success">2312</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column label="身份">
                    <template #default="scope">
                       <span v-if="scope.row.identity === 'root'">超级管理员</span>
                       <span v-else-if="scope.row.identity === 'adminstrator'">管理员</span>
                       <span v-else>普通用户</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="注册时间" />
                <el-table-column prop="lastLoginTime" label="最近登陆时间" />
                <el-table-column label="允许登录">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.isLogin"
                            class="ml-2"
                            :active-value='1'
                            :inactive-value='0'
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            @click="changeIsLogin(scope.row.id,scope.row.isLogin)"
                            />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="170px">
                    <template #default="scope">
                        <el-button type="success" @click="editUser(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="user-page" v-if="maxPage > 1">
            <el-pagination background layout="prev, pager, next"  v-model:current-page="nowPage" :total="maxPage * 10" />
        </div>
    </div>
    <el-drawer v-model="isedit">
        <template #header>
            <h4>编辑用户信息</h4>
        </template>
        <template #default>
            <el-form :model="userForm">
                <el-form-item label="账号">
                    <el-input v-model="userForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="userForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload 
                        action="#" 
                        :show-file-list="false" 
                        :auto-upload="false"
                        :on-change="changeImage"
                        class="admin-el-upload"
                    >
                        <img :src="showImg" alt="">
                    </el-upload>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="isedit = false">取消</el-button>
                <el-button type="success" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup>
    import { useUserStore,useLogsStore } from '@/store/index.js'
    import { onMounted,ref,computed } from 'vue'
    import ShowWhere from '@/components/showWhere.vue'
    import axios from 'axios'
    const userStore = useUserStore()
    const logsStore = useLogsStore()
    const isedit = ref(false)

    // 获取现在时间
    function createNowTime(){
        let nowDate = new Date()
        let month = nowDate.getMonth() >= 10 ? nowDate.getMonth() + 1: '0' + (nowDate.getMonth() + 1)
        let day = nowDate.getDate() >= 10 ?  nowDate.getDate() : '0' + nowDate.getDate()
        let hour = nowDate.getHours() >= 10 ? nowDate.getHours() : '0' + nowDate.getHours()
        let minutes =  nowDate.getMinutes() >= 10 ? nowDate.getMinutes() :'0' + nowDate.getMinutes()
        return nowDate.getFullYear() + '-' + month + '-' + day  + ' ' + hour + ':' + minutes
    }

    // 更改用户登录权限
    const changeIsLogin = (id,islogin)=>{
        // console.log(id,islogin)
        userStore.changeUserLogin(id,islogin)
        let content = ''
        if(islogin){
            content = `允许用户：${userStore.searchForUid(id).nickName} 登录论坛`
        }else{
            content = `禁止用户：${userStore.searchForUid(id).nickName} 登录论坛`
        }
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
    }
    // 被选中的行列表
    const selectRows = ref([])
    const handleSelectionChange = (selection) =>{
        selectRows.value = selection
    }
    // 存放用户信息
    const userForm = ref({

    })
    // 列表展示图片的显示
    const showImg = ref('')
    // 修改用户信息
    const editUser = (row) =>{
        isedit.value = true
        userForm.value=row
        showImg.value = "http://127.0.0.1:3030/" + row.icon
    }
    const fileRaw = ref('')
    const iconName = ref('')
    // 头像改变时触发
    const changeImage = (rawFile)=>{
        // console.log(rawFile.raw)
        // 创建随机文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // 图片后缀
        const ext  =rawFile.name.split('.')[1]
        // 保存图片的名字
        iconName.value = uniqueSuffix + '.' + ext
        // 保存图片的信息
        fileRaw.value = rawFile.raw
        const url = URL.createObjectURL(rawFile.raw)
        showImg.value = url
    }
    const confirmClick =async ()=>{
        // console.log(userForm.value)
        if(fileRaw.value){
            const formData = new FormData()
            formData.append('file',fileRaw.value)
            // 保存旧的图片名称
            const oldIconName = ref(userForm.value.icon)
            // 将头像上传到服务器
            await axios.post(`http://127.0.0.01:3030/userImg?imgName=${iconName.value}`,formData,{
                Headers:{
                    'Content-Type':'multipart/from-data'
                }
            })
            userForm.value.icon = iconName.value
            // 对就旧头像进行删除
            if(oldIconName.value !== 'default.svg'){
                await axios({
                    url:'http://127.0.0.1:3030/deluserIcon',
                    method:'GET',
                    params:{
                        oldIcon:oldIconName.value
                    }
                })
            }
        }
        userStore.setUserInfo(userForm.value)
        ElMessage({
            type:'success',
            message:'修改成功！'
        })
        let content = `修改用户:${userStore.searchForUid(userForm.value.id).nickName}的信息`
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
        isedit.value = false
    }

    // 删除用户
    const deleteUser = (id)=>{
        // console.log(id)
        // api.rmUserAmind(id)
        ElMessageBox.confirm(
            '确定删除该用户吗?',
            '提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        )
            .then(() => {
                let content = `删除了用户:${userStore.searchForUid(id).nickName}`
                logsStore.addLog({
                    uid:userStore.getLoginUser.id,
                    create_time:createNowTime(),
                    value:content,
                    identity:userStore.getLoginUser.identity
                })
                userStore.deleteUser(id)
                if(nowPage.value > maxPage.value){
                    nowPage.value = maxPage.value
                }
            })
            .catch(() => {
           
            })
    }
    // 删除多选的用户
    const rm_more = ()=>{
        ElMessageBox.confirm(
            '确定删除选中的用户吗?',
            '提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        )
            .then(() => {
                if(selectRows.value.length === 0){
                    return
                }
                for(const item of selectRows.value){
                    let content = `删除了用户:${userStore.searchForUid(item.id).nickName}`
                    logsStore.addLog({
                        uid:userStore.getLoginUser.id,
                        create_time:createNowTime(),
                        value:content,
                        identity:userStore.getLoginUser.identity
                    })
                    userStore.deleteUser(item.id)
                }
                if(nowPage.value > maxPage.value){
                    nowPage.value = maxPage.value
                }
            })
            .catch(() => {
           
            })
    }
    // 设置用户为管理员
    const set_admin = ()=>{
        ElMessageBox.confirm(
            '确定要将选中的用户设置成管理员吗?',
            '提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        )
            .then(() => {
                // console.log(selectRows.value)
                for(const item of selectRows.value){
                    let content = `将用户:${userStore.searchForUid(item.id).nickName}设置成管理员`
                    logsStore.addLog({
                        uid:userStore.getLoginUser.id,
                        create_time:createNowTime(),
                        value:content,
                        identity:userStore.getLoginUser.identity
                    })
                    userStore.setToAdmin(item.id)
                }
            })
            .catch(() => {
           
            })
    }
    // 设置成普通用户
    const set_user = ()=>{
        ElMessageBox.confirm(
            '确定要将选中的用户设置成普通用户吗?',
            '提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        )
            .then(() => {
                for(const item of selectRows.value){
                    let content = `将用户:${userStore.searchForUid(item.id).nickName}设置成普通用户`
                    logsStore.addLog({
                        uid:userStore.getLoginUser.id,
                        create_time:createNowTime(),
                        value:content,
                        identity:userStore.getLoginUser.identity
                    })
                    userStore.setToUser(item.id)
                }
            })
            .catch(() => {
                
            })
    }
    const showSize = ref(5)
    const nowPage = ref(1)
    const maxPage = computed(()=> Math.ceil(userStore.getuser.length / showSize.value))
    const showList = computed(()=> userStore.getuser.slice((nowPage.value-1)*showSize.value,nowPage.value *showSize.value > userStore.getuser.length ? userStore.getuser.length : nowPage.value * showSize.value))
    onMounted(async ()=>{
        // 获取用户数据
        let result = await fetch('http://127.0.0.1:3030/admin_getuser')
        let data = await result.json()
        userStore.setUserList(data)
    })
    
</script>

<style lang="scss" scoped>
    .user-main{
        padding: 10px;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        .delMore{
            display: flex;
            align-items: center;
            background-color: white;
            margin: 20px 10px 0 10px;
            height: 40px;
            padding-left: 5px;
            padding-right: 5px;
            justify-content: space-between;
        }
        .user-list{
            margin: 10px;
            // margin-top:0 ;
            border-radius: 20px;
            :deep(td){
                text-align: center;
            }
            :deep(th){
                height: 50px;
                text-align: center;
                background-color: rgb(241, 241, 241);
            }
        }
        .user-page{
            align-self: center;
        }
    }
    .admin-el-upload{
        img{
            width: 260px;
            height: 260px;
        }
    }
</style>