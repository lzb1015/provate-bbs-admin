import axios from 'axios'

const provateAdmin = axios.create({
    baseURL:'http://127.0.0.1:3030',
    timeout:1000
})

export default provateAdmin