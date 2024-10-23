import { 
    loginAdmin,
    getUserInfoAdmin,
    setUserLoginAdmin,
    setUserInfoAdmin, 
    setUsetToAdmin,
    rmUserAdmin
} from "./module/user";

import {
    getplate_admin,
    setplateInfo_admin,
    addplate_admin,
    rmplate_admin
} from './module/plate'

import {
    getPostList_admin,
    setpostInfo_admin,
    rmpost_admin
} from './module/post'

import {
    getleavel_admin,
    setleavel_admin,
    rmLeavel_admin
} from './module/leavel'

import {
    getlogs,
    setlog
} from './module/log'

export default {
    loginAdmin,
    getUserInfoAdmin,
    setUserLoginAdmin,
    setUserInfoAdmin,
    setUsetToAdmin,
    rmUserAdmin,
    getplate_admin,
    setplateInfo_admin,
    addplate_admin,
    rmplate_admin,
    getPostList_admin,
    setpostInfo_admin,
    rmpost_admin,
    getleavel_admin,
    setleavel_admin,
    rmLeavel_admin,
    getlogs,
    setlog
}