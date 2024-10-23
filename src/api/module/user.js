import provateAdmin from "../http";

// 登陆
export const loginAdmin = (obj) =>{
    return provateAdmin.post('/login_admin',{
        name:obj.name,
        password:obj.password
    })
}

// 根据id获取用户信息
export const getUserInfoAdmin = (id)=>{
    return provateAdmin.post('/get_user_info_admin',{
        id:id
    })
}

// 设置用户是否允许登陆
export const setUserLoginAdmin = (id,islogin)=>{
    return provateAdmin.post('/set_user_db_islogin',{
        id:id,
        islogin:islogin
    })
}

// 修改用户信息
export const setUserInfoAdmin = (form)=>{
    return provateAdmin.post('/set_user_info_db',{
        form:form
    })
}

// 设置用户为管理员或者普通用户
export const setUsetToAdmin = (id,identity)=>{
    return provateAdmin.post('/set_user_admin_db',{
        id:id,
        identity:identity
    })
}

// 删除用户
export const rmUserAdmin = (id) =>{
    return provateAdmin.post('/rm_user_admin_db',{
        id:id
    })
}