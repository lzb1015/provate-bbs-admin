import axios from 'axios'

const provateAdmin = axios.create({
    baseURL:'http://127.0.0.1:3030',
    timeout:1000
})

provateAdmin.interceptors.request.use((config)=>{
    let token = localStorage.getItem('token')
    if(config.url != '/login_admin'){
        if(!token){
            throw('没有权限进行请求!')
        }
        config.headers.Authorization = token
    }
    return config
})

export default provateAdmin