import provateAdmin from "../http";

export const getleavel_admin = ()=>{
    return provateAdmin.get('/get_leavel_admin')
}

export const setleavel_admin = (lid,content)=>{
    return provateAdmin.post('/set_leavel_admin',{
        obj:{
            lid:lid,
            value:content
        }
    })
}

export const rmLeavel_admin = (lid)=>{
    return provateAdmin.post('/rm_leavel_admin',{
        lid:lid
    })
}