import { defineStore } from "pinia";
import { ref,computed } from 'vue'
import api from '@/api'
export const useLeavelStore = defineStore('leavel',()=>{
    // 存放留言数据
    const leavel_list = ref([])
    // 设置留言数据
    const set_leavel_list = (list) =>{
        leavel_list.value = list
    }
    // 获取留言数据
    const getLeavelList = computed(()=>leavel_list.value)
    
    // 修改留言内容
    const setLeavelValue = async (lid,newValue) =>{
        leavel_list.value = leavel_list.value.map(item=>{
            if(item.lid === lid){
                item.value = newValue
            }
            return item
        }),
        await api.setleavel_admin(lid,newValue)
        ElMessage({
            type:'success',
            message:'修改成功！'
        })
    }

    // 删除留言
    const rmLeavel = async(lid)=>{
        console.log(lid)
        leavel_list.value = leavel_list.value.filter(item=>item.lid !== lid)
        await api.rmLeavel_admin(lid)
        ElMessage({
            type:'success',
            message:'删除成功！'
        })
    }

    // 通过lid查找内容
    const searchForLid = (lid)=>{
        // console.log(lid)
        let result = leavel_list.value.filter(item=>item.lid === lid)[0]
        // console.log(result)
        return result
    }
    return {
        set_leavel_list,
        getLeavelList,
        setLeavelValue,
        rmLeavel,
        searchForLid
    }
})