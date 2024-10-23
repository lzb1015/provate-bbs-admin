import { defineStore } from "pinia";
import { ref,computed } from 'vue'
import api from '@/api'
export const useLogsStore = defineStore('logs',()=>{
    // 存放日志数据
    const logList = ref([])

    // 获取后设置日志数据
    const setLogList = (list) =>{
        logList.value = list
    }

    // 获取日志数据
    const getLogList = computed(()=>{
        logList.value = logList.value.sort((a,b)=>b.gid-a.gid)
        return logList.value
    })

    // 设置新日志
    // obj需要的字段`uid`,`create_time`,`value`,`identity`
    const addLog = (obj) =>{
        api.setlog(obj)
    }
    return {
        setLogList,
        getLogList,
        addLog
    }
})