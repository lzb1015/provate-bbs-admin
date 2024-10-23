export function parseToken(token){
    // 分割token以获取payload部分
    const base64Payload = token.split('.')[1];
    console.log(base64Payload)
    // 使用atob()解码payload
    const payload = JSON.parse(atob(base64Payload));
    return {
        icon:payload.icon,
        id:payload.userId,
        nickName:payload.nickName,
        identity:payload.identity
    }
}