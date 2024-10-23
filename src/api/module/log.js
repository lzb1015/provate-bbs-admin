import provateAdmin from "../http";

export const getlogs = ()=>{
    return provateAdmin.get('/get_logs_admin')
}

export const setlog = (obj)=>{
    return provateAdmin.post('/set_logs',{
        obj:obj
    })
}