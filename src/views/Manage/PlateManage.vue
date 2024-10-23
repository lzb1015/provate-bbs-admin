<template>
    <div class="plate-main">
        <show-where>
            <template #default>
                板块管理
            </template>
        </show-where>
        <div class="plate-tishi">
            温馨提示：当板块下有子板块时，删除板块会将其子板块一并删除，子板块下若有帖子数据，也将一并删除！！！
        </div>
        <div class="plate-change">
            <el-button type="success" @click="addPlateM">添加新板块</el-button>
            <el-button type="success" @click="addPlateN">添加子板块</el-button>
        </div>
        <div class="plate-list">
            <el-divider content-position="left">板块列表</el-divider>
            <el-tree
                class="plate-tree"
                :data="plateStore.getplateList"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
            >
                <template #default = "{ node,data }">
                    <div class="plate-show-item">
                        <span>{{ node.label }}</span>
                        <span class="plate-btn">
                            <el-button type="success" @click="editPlate(data.pid || data.cid)">编辑</el-button>
                            <el-button @click="rmPlate(data.pid || data.cid)" type="danger">删除</el-button>
                        </span>
                    </div>
                </template>
            </el-tree>
        </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="编辑板块" width="500">
        <el-form :model="form">
        <el-form-item label="板块名称">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="请选择该子版块对应的父板块" v-if="form.table === 'platen'">
            <el-select
                v-model="form.parent_id"
                placeholder="请选择父板块"
                size="large"
                style="width: 240px"
            >
                <el-option
                    v-for="item in platemlist"
                    :key="item.pid"
                    :label="item.name"
                    :value="item.pid"
                />
            </el-select>
        </el-form-item> 
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="success" @click="changePlate">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
    <el-dialog v-model="newPlateVisible" title="添加新板块" width="500">
        <el-form :model="newForm">
        <el-form-item label="板块名称">
            <el-input v-model="newForm.name"/>
        </el-form-item>
        <el-form-item label="请选择该子版块对应的父板块" v-if="newForm.table === 'platen'">
            <el-select
                v-model="newForm.parent_id"
                placeholder="请选择父板块"
                size="large"
                style="width: 240px"
            >
                <el-option
                    v-for="item in platemlist"
                    :key="item.pid"
                    :label="item.name"
                    :value="item.pid"
                />
            </el-select>
        </el-form-item> 
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="newPlateVisible = false">取消</el-button>
            <el-button type="success" @click="addPlate">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
</template>

<script setup>
    import ShowWhere from '@/components/showWhere.vue'
    import { ref,onMounted,computed } from 'vue'
    import { usePlateStore,useUserStore,useLogsStore } from '@/store';
    import api from '@/api'
    const plateStore = usePlateStore()
    const userStore = useUserStore()
    const logsStore = useLogsStore()
    const defaultProps = {
        children:'children',
        label:'name'
    }
    
    // 获取现在时间
    function createNowTime(){
        let nowDate = new Date()
        let month = nowDate.getMonth() >= 10 ? nowDate.getMonth() + 1: '0' + (nowDate.getMonth() + 1)
        let day = nowDate.getDate() >= 10 ?  nowDate.getDate() : '0' + nowDate.getDate()
        let hour = nowDate.getHours() >= 10 ? nowDate.getHours() : '0' + nowDate.getHours()
        let minutes =  nowDate.getMinutes() >= 10 ? nowDate.getMinutes() :'0' + nowDate.getMinutes()
        return nowDate.getFullYear() + '-' + month + '-' + day  + ' ' + hour + ':' + minutes
    }

    // 根据id查找对于的信息
    function searchPlate(list,id){
        // console.log(list,id)
        let result = {}
        for(const item of list){
            if(item.pid === id || item.cid === id){
                result = item
                return result
            }
            if(item.children && item.children.length !==0){
                result = searchPlate(item.children,id)
                if(result){
                    return result
                }
            }
        }
        // return result
    }
    // 板块编辑
    const editPlate = (id) =>{
        // console.log(id)

        let item = searchPlate(plateStore.getplateList,id)
        let table = ''
        if(item.pid){
            table = 'platem'
        }else{
            table = 'platen'
        }
        form.value.table = table
        form.value.id = item.pid || item.cid
        form.value.name = item.name
        form.value.parent_id = item.parent_id
        dialogFormVisible.value = true
    }

    // 编辑框的显示与隐藏
    const dialogFormVisible = ref(false)
    // 编辑框内的表单
    const form = ref({
        id:'',
        name:'',
        table:'',
        parent_id:''
    })

    // 确定修改
    const changePlate = () =>{
        let content = `将版块 '${plateStore.searchPlate(plateStore.getplateList,form.value.id).name}' 修改为 :‘${form.value.name}’`
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
        plateStore.changePlateInfo(form.value)
        dialogFormVisible.value = false
    }

    // 显示父板块
    const platemlist = computed(() =>{
        let newList = plateStore.getplateList.map(item=>{
            return{
                name: item.name,
                pid: item.pid
            }
        })
        return newList
    })

    // 
    const newPlateVisible = ref(false)
    const newForm = ref({
        name:'',
        parent_id:'',
        table:''
    })
    // 添加新板块
    const addPlateM = ()=>{
        newForm.value = {
            name:'',
            parent_id:'',
            table:''
        }
        newPlateVisible.value = true
        newForm.value.table = 'platem'
    }
    // 添加新的子版块
    const addPlateN = ()=>{
        newForm.value = {
            name:'',
            parent_id:'',
            table:''
        }
        newPlateVisible.value = true
        newForm.value.table = 'platen'
    }
    // 添加板块
    const addPlate = ()=>{
        let content = `添加了新版块 '${newForm.value.name}'`
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
        plateStore.addNewPlate(newForm.value)
        newPlateVisible.value = false
    }

    // 删除板块
    const rmPlate = (id)=>{
        let item = searchPlate(plateStore.getplateList,id)
        let content = `删除了版块 '${item.name}'`
        logsStore.addLog({
            uid:userStore.getLoginUser.id,
            create_time:createNowTime(),
            value:content,
            identity:userStore.getLoginUser.identity
        })
        let table = ''
        if(item.pid){
            table = 'platem'
        }else{
            table = 'platen'
        }
        plateStore.removePlate({
            id:id,
            table:table
        })
    }
    onMounted(async ()=>{
       let result = await api.getplate_admin()
       plateStore.setplateList(result.data)
    })
</script>

<style lang="scss" scoped>
    .plate-main{
        margin: 10px;
        .plate-list{
            .plate-tree{
                padding: 10px;
                // background-color: rgb(236, 236, 236);
                border-radius: 20px;
                :deep(.el-tree-node__content){
                    margin: 10px 0;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    i{
                        display: inline-block;
                    }
                    span{
                        display: inline-block;
                    }
                    .plate-btn{
                        button{
                            height: 25px;
                        }
                    }
                    .plate-show-item{
                        padding-right: 40px;
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
            }
        }
        .plate-change{
            margin: 10px;
        }
        .plate-tishi{
            margin-top: 5px;
            padding: 5px 15px;
            font-size: 13px;
            color: rgb(230, 162, 60);
            font-weight: bold;
        }
    }
</style>