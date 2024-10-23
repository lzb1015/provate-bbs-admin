<template>
    <show-where>
        <template #default>
            帖子管理
        </template>
    </show-where>
    <div class="post-mian">
        <div  class="postlist">
            <el-table :data="showPostList" stripe border style="width: 100%">
                <el-table-column label="id" prop="tid"></el-table-column>
                <el-table-column label="标题">
                    <template #default="scope">
                        <div class="table-ceil-ellipsis">
                            {{ scope.row.title }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="简介">
                    <template #default="scope">
                        <div class="table-ceil-ellipsis">
                            {{ scope.row.abstract}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发帖时间" />
                <el-table-column prop="content" label="发帖人">
                    <template #default="scope">
                        <div v-if="userStore.searchForUid(scope.row.uid)">
                            {{ userStore.searchForUid(scope.row.uid).nickName }}
                        </div>    
                    </template>    
                </el-table-column>
                <el-table-column prop="content" label="封面">
                    <template #default="scope">
                        <div class="content-tImg">
                            <img v-if="scope.row.tImg" :src="`http://127.0.0.1:3030/${scope.row.tImg}`" alt="">
                            <div v-else>暂无封面</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="所属板块">
                    <template #default="scope">
                        <div>
                            {{ plateStore.searchForpc(scope.row.pid,scope.row.cid) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220px">
                    <template #default="scope">
                        <el-button type="success" @click="showPost(scope.row.tid)">查看</el-button>
                        <el-button type="danger" @click="rmPost(scope.row.tid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="showPage" v-if="maxPage > 1">
            <el-pagination background layout="prev, pager, next" v-model:current-page="nowPage" :total="maxPage * 10" />
        </div>
    </div>
    <el-drawer
        v-model="isShow"
        title="帖子具体信息"
        direction="rtl"
        size="800px"
    >
        <div class="showForm">
            <el-form :model="showForm">
                <el-form-item label="标题">
                    <el-input v-model="showForm.title" />
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="showForm.abstract"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-cascader
                        v-model="showForm.plate"
                        :options="showPlate"
                        :props="{ value:'id',label:'name'}"
                    />
                </el-form-item>
                <el-form-item label="内容">
                    <div class="showContent">
                        <Toolbar
                            style="border-bottom: 1px solid #ccc"
                            :editor="editorRef"
                            :defaultConfig="toolbarConfig"
                            :mode="mode"
                        />
                        <Editor
                            style="
                                max-height: 500px; 
                                overflow-y: auto;
                                min-height: 300px;
                                "
                            v-model="showForm.content"
                            :defaultConfig="editorConfig"
                            :mode="mode"
                            @onCreated="handleCreated"
                        />
                    </div>
                </el-form-item>
                <el-form-item class="showform-button">
                    <el-button @click="cancle">取消</el-button>
                    <el-button type="success" @click="changePostInfo">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script setup>
    import ShowWhere from '@/components/showWhere.vue'
    import { onMounted,ref,onBeforeUnmount,shallowRef,nextTick,computed } from 'vue'
    import api from '@/api'
    import { usePostStore,useUserStore,usePlateStore,useLogsStore } from '@/store/'
    import '@wangeditor/editor/dist/css/style.css' // 引入 css
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
    import axios from 'axios'
    const postStore = usePostStore()
    const userStore = useUserStore()
    const plateStore = usePlateStore()
    const logsStore = useLogsStore()
    const showSize = ref(8)
    const nowPage = ref(1)
    const maxPage = computed(()=> Math.ceil(postStore.getPostList.length / showSize.value))
    const showPostList = computed(()=> postStore.getPostList.slice((nowPage.value-1)*showSize.value,(nowPage.value > maxPage.value?maxPage.value:nowPage.value)* showSize.value))
    
    // 获取现在时间
    function createNowTime(){
        let nowDate = new Date()
        let month = nowDate.getMonth() >= 10 ? nowDate.getMonth() + 1: '0' + (nowDate.getMonth() + 1)
        let day = nowDate.getDate() >= 10 ?  nowDate.getDate() : '0' + nowDate.getDate()
        let hour = nowDate.getHours() >= 10 ? nowDate.getHours() : '0' + nowDate.getHours()
        let minutes =  nowDate.getMinutes() >= 10 ? nowDate.getMinutes() :'0' + nowDate.getMinutes()
        return nowDate.getFullYear() + '-' + month + '-' + day  + ' ' + hour + ':' + minutes
    }
    
    // 记录上传的所有图片（包括删除的,之前有的）
    const uploadImgs = ref([])
    //
    // 编辑器配置区
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const mode = ref('default')
    // 内容 HTML
    // const valueHtml = ref('')
    // 配置
    const toolbarConfig = {}
    const editorConfig = { 
        placeholder: '请输入内容...',
        MENU_CONF:{
            uploadImage:{
                server:'http://127.0.0.1:3030/upload_img_detail',
                type:'post',
                // fieldName:'myUpload', //设置from-data中的字段名
                allowedFileTypes:['image/*'],
                // 上传成功时触发
                onSuccess(file,res){
                    // console.log(file.name)
                    let url = res.data.url
                    // console.log(url)
                    let imageName = url.replace('http://127.0.0.1:3030/','')
                    // 上传成功后，将图片记录到uploadImgs中
                    uploadImgs.value.push(imageName)
                }
            }
        }
    }
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })
    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    // 用来绑定选择的帖子
    const showForm = ref({})
    // 绑定帖子信息是否显示
    const isShow = ref(false)
    // 查看帖子
    const showPost = (tid)=>{
        isShow.value = true
        let checkPost = (postStore.getPostList.filter(item=>item.tid === tid))[0]
        showForm.value = JSON.parse(JSON.stringify(checkPost))
        showForm.value.plate = [showForm.value.pid,showForm.value.cid]
        // console.log(showForm.value)
        nextTick(()=>{
             // ----------获取帖子中的图片数据-----------
            const showImgs = document.querySelectorAll('.w-e-scroll img')
            // 现在编辑器中剩下的图片名称
            for(const item of showImgs){
                uploadImgs.value.push(item.src.replace('http://127.0.0.1:3030/',''))
            }
            // console.log(uploadImgs.value)
        })
    }
    // 提交修改帖子
    const changePostInfo =async ()=>{
         // -----------获取修改后的帖子中的图片数据---------------
         const showImgs = document.querySelectorAll('.w-e-scroll img')
        // 现在编辑器中剩下的图片名称
        let nowImgs = ref([])
        for(const item of showImgs){
            nowImgs.value.push(item.src.replace('http://127.0.0.1:3030/',''))
        }
        const list = uploadImgs.value.filter(item=>!nowImgs.value.includes(item))
        // 通知express图片被删除了，将无用的数据清除
        if(list.length !==0){
            await axios.get(`http://localhost:3030/clear_img?list=${list}`)
        }
        // ---------------------------------
        showForm.value.pid = showForm.value.plate[0]
        showForm.value.cid = showForm.value.plate[1]
        let content = `修改了帖子:${postStore.searchForTid(showForm.value.tid).title} 的信息`
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
        postStore.changePostInfo(showForm.value)
        isShow.value = false
    }
    // 取消修改
    const cancle = () => {
        isShow.value = false
    }
    // 删除帖子
    const rmPost = (tid) =>{
        ElMessageBox.confirm(
            '你确定要删除该帖子吗?',
            '温馨提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        )
            .then(() => {
                let content = `删除了帖子:${postStore.searchForTid(tid).title}`
                logsStore.addLog({
                    uid:userStore.getLoginUser.id,
                    create_time:createNowTime(),
                    value:content,
                    identity:userStore.getLoginUser.identity
                })
                postStore.removePost(tid)
            })
            .catch(() => {
            })
    }
    const showPlate = ref([])
    onMounted(async ()=>{
        let result = await api.getPostList_admin()
        postStore.setPostList(result.data)
        // 获取用户数据
        let user_result = await fetch('http://127.0.0.1:3030/admin_getuser')
        let data = await user_result.json()
        userStore.setUserList(data)
        let plate_result = await api.getplate_admin()
        plateStore.setplateList(plate_result.data)
        // 处理板块数据
        plateStore.getplateList.forEach(item=>{
            let obj = {}
            obj.name = item.name
            obj.id = item.pid
            obj.children = []
            item.children.forEach(it=>{
                obj.children.push({
                    name:it.name,
                    id:it.cid
                })
            })
            showPlate.value.push(obj)
        })
    })
</script>

<style lang="scss" scoped>
    .post-mian{
        margin: 10px;
        display: flex;
        flex-direction: column;
        // align-items: center;
        :deep(.showPage){
            align-self: center;
            // width: auto;
            margin-bottom: 30px;
            .is-active{
                background-color: rgb(103, 194, 58) !important;
            }
            .number:hover{
                color:rgb(103, 194, 58) !important ;
            }
        }
        :deep(.postlist){
            margin: 20px;
            .table-content{
                // width: 0px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .content-tImg{
                img{
                    width: 100px;
                    // margin: 5px;
                }
            }
            thead th{
                background-color: rgb(231, 231, 231);
                // height: 30px;
            }
            .el-table__row{
                height: 70px;
            }
        }
    }
    .showForm{
        padding:0 5px;
        .showContent{
            border: 1px solid rgb(138, 138, 138);
        }
        :deep(.showform-button){
            .el-form-item__content{
                justify-content: center;
            }
            button{
                width: 200px;
                margin: 10px;
            }
        }
    }
</style>