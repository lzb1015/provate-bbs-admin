import { defineStore } from "pinia";
import { ref,computed } from 'vue'
import api from '@/api'
export const usePostStore = defineStore('post',()=>{
    // 存放帖子数据
    const postList = ref([])
    // 获取帖子数据
    const getPostList = computed(()=> postList.value)
    
    // 根据cid获取帖子数据
    const getpostForcid = (cid)=>{
        let num = 0
        if(postList.value.length !== 0)  num = postList.value.filter(item=>item.cid === cid).length
        return num
    }

    // 设置帖子数据
    const setPostList = (list) =>{
        postList.value = list
    }

    // 修改帖子内容
    const changePostInfo = async (form) =>{
        // 将pinia中的数据更新
        postList.value = postList.value.map(item=>{
            if(item.tid === form.tid){
                for(const key in form){
                    item[key] = form[key]
                }
            }
            return item
        })
        await api.setpostInfo_admin(form)
        ElMessage({
            type:'success',
            message:'修改成功！'
        })
    } 

    // 删除帖子
    const removePost = async(tid) =>{
        postList.value = postList.value.filter(item=>item.tid !== tid)
        await api.rmpost_admin(tid)
        ElMessage({
            type:'success',
            message:'删除成功'
        })
    }

    const searchForTid = (tid) =>{
        return postList.value.filter(item=>item.tid === tid)[0]
    }
    return {
        getPostList,
        setPostList,
        removePost,
        changePostInfo,
        searchForTid,
        getpostForcid
    }
})