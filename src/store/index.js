import { createPinia } from "pinia";

const pinia = createPinia()

export * from './module/user'
export * from './module/post'
export * from './module/plate'
export * from './module/leavel'
export * from './module/logs'
export default pinia