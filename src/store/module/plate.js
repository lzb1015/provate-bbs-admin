import { defineStore } from "pinia";
import { ref,computed } from 'vue' 
import api from '@/api'
export const usePlateStore = defineStore('plate',()=>{
    // 存放板块数据
    const plateList = ref([])
    // 设置板块数据
    const setplateList = (list) =>{
        plateList.value = list
    }
    // 获取板块的数据
    const getplateList = computed(()=>plateList.value)
    // 获得小板块数据
    const getplatenlist = computed(()=>{
        let list = []
        plateList.value.forEach(item=>{
            for(const it of item.children){
                list.push({
                    name:it.name,
                    cid:it.cid
                })
            }
        })
        return list
    })

    // 修改板块数据
    const changePlateInfo = async (form) =>{
        // plateList.value =searchPlate(plateList.value,form.id,form)
        let result = await api.setplateInfo_admin(form)
        plateList.value = result.data
        ElMessage({
            type:'success',
            message:'修改成功'
        })
    }

    // 添加新板块
    const addNewPlate = async (form) =>{
        let result = await api.addplate_admin(form)
        plateList.value = result.data
        ElMessage({
            type:'success',
            message:'添加成功'
        })
    }

    // 删除板块
    const removePlate = async (form)=>{
        ElMessageBox.confirm(
            '你确定要删除该板块吗?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(async() => {
                let result =await api.rmplate_admin(form)
                // console.log(form)
                plateList.value = result.data
                ElMessage({
                    type:'success',
                    message:'删除成功'
                })
            })
            .catch(() => {
            })
    }

    // 根据pid和cid 获取对应的板块名称
    const searchForpc = (pid,cid) =>{
        let result = ''
        for(const item of plateList.value){
            if(item.pid === pid){
                result = item.name + '/'
                for(const it of item.children){
                    if(it.cid === cid){
                        result += it.name
                    }
                }
            }
        }
        return result
    }
    return {
        setplateList,
        getplateList,
        changePlateInfo,
        addNewPlate,
        removePlate,
        searchForpc,
        getplatenlist
    }
})