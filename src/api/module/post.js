import provateAdmin from "../http";

export const getPostList_admin = ()=>{
    return provateAdmin.get('/get_post_admin')
}

export const setpostInfo_admin = (obj) =>{
    return provateAdmin.post('/set_post_info_admin',{
        obj:obj
    })
}

export const rmpost_admin = (tid) =>{
    return provateAdmin.post('/rm_post_admin',{
        tid:tid
    })
}