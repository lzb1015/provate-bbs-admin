import provateAdmin from "../http";
// 获取板块信息
export const getplate_admin = () =>{
    return provateAdmin.get('/get_plate_admin')
}
// 修改板块信息
export const setplateInfo_admin = (form)=>{
    return provateAdmin.post('/set_plate_admin',{
        form:form
    })
}
// 添加新板块
export const addplate_admin = (form) =>{
    return provateAdmin.post('/add_plate_admin',{
        form:form
    })
}
// 删除板块
export const rmplate_admin = (form) =>{
    return provateAdmin.post('/rm_plate_admin',{
        form:form
    })
}

