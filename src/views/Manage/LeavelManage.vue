<template>
    <div class="leavel-main">
        <show-where>
            <template #default>
                留言管理
            </template>
        </show-where>
        <div class="rmCheck">
            <el-button type="danger" @click="delete_check">删除选择的留言</el-button>
        </div>
        <div class="leavel-table">
            <el-table :data="showList" border style="width: 100%"  @selection-change="handleSelectionChange"> 
                <el-table-column type="selection" width="55" />
                <el-table-column prop="lid" label="id" width="120"></el-table-column>
                <el-table-column label="发言人" width="120">
                    <template #default="scope">
                        <div v-if="userStore.searchForUid(scope.row.uid)">
                            {{ userStore.searchForUid(scope.row.uid).nickName }}
                        </div>
                    </template>    
                </el-table-column>
                <el-table-column prop="createTime" label="发言时间" />
                <el-table-column label="发言内容">
                    <template #default="scope">
                        <div class="leavel-value">
                            {{ scope.row.value }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="发言的帖子">
                    <template #default="scope">
                        <div v-if="postStore.searchForTid(scope.row.tid)">
                            {{ postStore.searchForTid(scope.row.tid).title }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="发言类型">
                    <template #default="scope">
                        <div v-if="scope.row.plid">
                            回复其他用户
                        </div>
                        <div v-else>
                            帖子评论
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="success" @click="editLeavel(scope.row.lid,scope.row.uid)">编辑</el-button>
                        <el-button type="danger" @click="deleteLeavel(scope.row.lid,scope.row.uid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="showPage" v-if="maxPage > 1">
            <el-pagination background layout="prev, pager, next" v-model:current-page="nowPage" :total="maxPage * 10" />
        </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="留言内容编辑/查看"
        width="500"
    >
        <el-form>
            <el-form-item label="留言内容">
                <el-input type="textarea" v-model="content"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="success" @click="changeValue()">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
</template>

<script setup>
    import ShowWhere from '@/components/showWhere.vue'
    import { onMounted,ref,computed } from 'vue'
    import { useLeavelStore,useUserStore,usePostStore,useLogsStore } from '@/store';
    import api from '@/api'
    const leavelStore = useLeavelStore()
    const userStore = useUserStore()
    const postStore = usePostStore()
    const logsStore = useLogsStore()
    // 获取现在时间
    function createNowTime(){
        let nowDate = new Date()
        let month = nowDate.getMonth() >= 10 ? nowDate.getMonth() + 1: '0' + (nowDate.getMonth() + 1)
        let day = nowDate.getDate() >= 10 ?  nowDate.getDate() : '0' + nowDate.getDate()
        let hour = nowDate.getHours() >= 10 ? nowDate.getHours() : '0' + nowDate.getHours()
        let minutes =  nowDate.getMinutes() >= 10 ? nowDate.getMinutes() :'0' + nowDate.getMinutes()
        return nowDate.getFullYear() + '-' + month + '-' + day  + ' ' + hour + ':' + minutes
    }
    // 分页展示
    const showSize = ref(8)
    const maxPage = computed(()=>Math.ceil(leavelStore.getLeavelList.length / showSize.value))
    const nowPage = ref(1)
    const showList = computed(()=>leavelStore.getLeavelList.slice((nowPage.value-1)*showSize.value,(nowPage.value*showSize.value >leavelStore.getLeavelList.length ? leavelStore.getLeavelList.length : nowPage.value*showSize.value)))

    // 被选中的行列表
    const selectRows = ref([])
    const handleSelectionChange = (selection) =>{
        selectRows.value = selection
    }
    // 删除选择的留言
    const delete_check = () =>{
        ElMessageBox.confirm(
                '你确定要删除选中的留言吗?',
                '温馨提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        .then(() => {
            for(const item of selectRows.value){
                let content = `删除了 '${userStore.searchForUid(item.uid).nickName}' 的留言 :‘${leavelStore.searchForLid(item.lid).value}’`
                logsStore.addLog({
                    uid:userStore.getLoginUser.id,
                    create_time:createNowTime(),
                    value:content,
                    identity:userStore.getLoginUser.identity
                })
                leavelStore.rmLeavel(item.lid)
                // console.log(createNowTime())
            }
            if(nowPage.value >maxPage.value){
                nowPage.value = maxPage.value
            }
        })
        .catch(() => {
        })
    }
    // 编辑的文本内容 和lid
    const content = ref()
    const nowLid = ref(0)
    const nowUid = ref(0)
    // 编辑框的显示
    const dialogVisible = ref(false)
    // 点击编辑按钮
    const editLeavel = (lid,uid)=>{
        nowLid.value = lid
        nowUid.value = uid
        content.value = leavelStore.getLeavelList.filter(item=> item.lid ===lid)[0].value
        dialogVisible.value = true
    }
    // 点击确认按钮
    const changeValue = () =>{
        dialogVisible.value = false
        let content = `将 '${userStore.searchForUid(nowUid.value).nickName}' 的留言 :‘${leavelStore.searchForLid(nowLid.value).value}’ 修改为 ‘${content.value}’`
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
        leavelStore.setLeavelValue(nowLid.value,content.value)
    }
    // 删除按钮
    const deleteLeavel = (lid,uid) =>{
        ElMessageBox.confirm(
            '你确定要删除该留言吗?',
            '温馨提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            let content = `删除了 '${userStore.searchForUid(uid).nickName}' 的留言 :‘${leavelStore.searchForLid(lid).value}’`
            logsStore.addLog({
                uid:userStore.getLoginUser.id,
                create_time:createNowTime(),
                value:content,
                identity:userStore.getLoginUser.identity
            })
            leavelStore.rmLeavel(lid)
            if(nowPage.value >maxPage.value){
                nowPage.value -= 1
            }
        })
        .catch(() => {
        })
    }
    onMounted(async ()=>{
        let result = await api.getleavel_admin()
        leavelStore.set_leavel_list(result.data)
        // console.log(result.data)
        let post_result = await api.getPostList_admin()
        postStore.setPostList(post_result.data)
        // 获取用户数据
        let user_result = await fetch('http://127.0.0.1:3030/admin_getuser')
        let data = await user_result.json()
        userStore.setUserList(data)
    })

</script>

<style lang="scss" scoped>
    .leavel-main{
        margin: 10px;
        display: flex;
        flex-direction: column;
    }
    .leavel-table{
        margin: 10px;
        :deep(.leavel-value){
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .rmCheck{
        margin: 20px 0 15px 20px;
    }
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
    :deep(.leavel-table){
        thead th{
            background-color: rgb(231, 231, 231);
            height: 50px;
        }
        .el-table__row{
            height: 50px;
        }
    }
</style>