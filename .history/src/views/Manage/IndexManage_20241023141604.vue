<template>
    <div class="index-main">
        <div class="index-main-title">
            欢迎使用 provateBBS 后台管理系统！
        </div>
        <div class="main-title">
            <div class="main-title-item item-bg1">
                <div class="item-left">
                    <i class="iconfont icon-denglu"></i>
                </div>
                <div class="item-right">
                    <div class="item-left-value">{{nowDayLogin}}</div>
                    <div class="item-left-title">今日上线人数</div>
                </div>
            </div>
            <div class="main-title-item item-bg2">
                <div class="item-left">
                    <i class="iconfont icon-yonghu"></i>
                </div>
                <div class="item-right">
                    <div class="item-left-value">{{ userStore.getAlluser.length }}</div>
                    <div class="item-left-title">总用户数</div>
                </div>
            </div>
            <div class="main-title-item item-bg3">
                <div class="item-left">
                    <i class="iconfont icon-tiezi"></i>
                </div>
                <div class="item-right">
                    <div class="item-left-value">{{ postStore.getPostList.length }}</div>
                    <div class="item-left-title">总帖子数</div>
                </div>
            </div>
        </div>
        <div class="main-chart">
            <div class="mian-chart-item">
                <div class="chart-item-title">
                    热门帖子（前十）
                </div>
                <div id="chart-left"></div>
            </div>
            <div class="mian-chart-item">
                <div class="chart-item-title">
                    各板块中帖子数量数量
                </div>
                <div id="chart-right"></div>
            </div>
        </div>
        <div class="main-more">
            <div class="more-left">
                <div class="more-show">
                    <div class="more-title">
                            <div>帖子</div>
                            <div @click="router.push('/post-admin')" style="cursor: pointer;">查看更多</div>
                    </div>
                    <div class="more-value">
                        <div class="value-item" v-for="item in showPostList" :key="item.tid">
                            <div class="item-left">
                                <div>标题：{{ item.title }}</div>
                                <div>简介：{{ item.abstract }}</div>
                            </div>
                            <div class="item-right">
                                <div>作者：{{ userStore.searchForUid(item.uid)?.nickName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="more-show">
                    <div class="more-title">
                        <div>留言</div>
                        <div @click="router.push('/leavel-admin')" style="cursor: pointer;">查看更多</div>
                    </div>
                    <div class="more-value">
                        <div class="value-item" v-for="item in showLeavelList" :key="item.tid">
                            <div class="value-item-leavel" >
                                {{ userStore.searchForUid(item.uid)?.nickName }}
                                <span class="item-leavel-text" v-if="!item.plid">在《 {{postStore.searchForTid(item.tid)?.title}} 》
                                    中评论了 {{ item.value }}
                                </span>
                                <span class="item-leavel-text" v-else>在《 {{postStore.searchForTid(item.tid)?.title}} 》 中回复 {{ userStore.searchForUid(leavelStore.searchForLid(item.plid)?.uid)?.nickName }}
                                    - {{ item.value }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="more-log">
                <div class="more-title">
                    <div>用户操作</div>
                    <div @click="router.push('/logs-admin')" style="cursor: pointer;">查看更多</div>
                </div>
                <div v-if="showLogsList.length === 0">
                    <el-empty :image-size="200" description="暂无数据"/>
                </div>
                <div v-else>
                    <div class="logs-item" v-for="item in showLogsList" :key="item.gid">
                        <div class="logs-item-left">
                            <div>{{ userStore.searchForUid(item.uid)?.nickName }}</div>
                            <div>{{ item.value }}</div>
                        </div>
                        <div class="logs-item-right">
                            {{ item.create_time }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import { ref,onMounted,computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUserStore,usePostStore,useLeavelStore,usePlateStore,useLogsStore } from '@/store/index.js'
    import api from '@/api'
    const userStore = useUserStore()
    const postStore = usePostStore()
    const leavelStore = useLeavelStore()
    const plateStore = usePlateStore()
    const logsStore = useLogsStore()
    const router = useRouter()
    // 今天上线人数
    const nowDayLogin = computed(()=>{
        let num = 0
        const nowDate = new Date()
        const nowMonth = (nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1) :'0'+ (nowDate.getMonth() + 1)
        const nowday = nowDate.getDate() > 10 ? nowDate.getDate() : '0' + nowDate.getDate()
        const nowdates = nowDate.getFullYear()+'-'+nowMonth+'-'+nowday
        for(const user of userStore.getAlluser){
            if(user.lastLoginTime && user.lastLoginTime.slice(0,10) === nowdates){
                num += 1
            }
        }
        console.log(nowdates)
        console.log(userStore.getAlluser)
        return num
    })

    const option_left_post = ref({
        xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            name:'点赞数量'
        },
        series: [
            {
                data: [23, 24, 18, 25, 27, 28, 25],
                type: 'bar',
                emphasis:{
                    label:{
                        show:true,
                        position:'top'
                    }
                }
            }
        ]
    })
    const option_right_plate = ref({
        tooltip: {
            trigger: 'item',
            formatter: '板块-{b} : {c} ({d}%)' // {b} 表示数据项名称，{c} 表示数据值，{d} 表示百分比
        },
        series: [
            {
                type: 'pie',
                data: []
            }
        ]
    })
    // 将表格的配置与页面容器绑定在一起
    const initeCharts = () =>{
        let mychartLeft = echarts.init(document.getElementById('chart-left'))
        let mychartRight = echarts.init(document.getElementById('chart-right'))
        mychartLeft.setOption(option_left_post.value)
        mychartRight.setOption(option_right_plate.value)
        document.getElementById('chart-left').setAttribute('_echarts_instance_', '');
        document.getElementById('chart-right').setAttribute('_echarts_instance_', '');
    }
    const showLogsList = computed(()=>logsStore.getLogList.slice(0,13))
    const showPostList = computed(()=>postStore.getPostList.slice(0,5))
    const showLeavelList = computed(()=>leavelStore.getLeavelList.slice(0,5))
    
    onMounted(async()=>{
        // initeCharts()
        let post_result = await api.getPostList_admin()
        postStore.setPostList(post_result.data)
        // 获取用户数据
        let user_result = await fetch('http://127.0.0.1:3030/admin_getuser')
        let data = await user_result.json()
        userStore.setUserList(data)
        let leavel_result = await api.getleavel_admin()
        leavelStore.set_leavel_list(leavel_result.data)
        let plate_result = await api.getplate_admin()
        plateStore.setplateList(plate_result.data)
        let logs_result = await api.getlogs()
        logsStore.setLogList(logs_result.data)
        // 设置柱状图的数据
        const postsList = postStore.getPostList.sort((a,b)=>JSON.parse(b.like).length-JSON.parse(a.like).length).filter(item=>JSON.parse(item.like).length !== 0)
        let yList = []
        let xList = []
        for(let i=0;i<postsList.slice(0,10).length;i++){
            xList.push(postsList[i].title)
            yList.push(JSON.parse(postsList[i].like).length)
        }
        option_left_post.value.xAxis.data = xList
        option_left_post.value.series[0].data = yList
        // 设置饼图的数据
        const platen_post = computed(()=>{
            let result = []
            for(const item of plateStore.getplatenlist){
                let length = postStore.getpostForcid(item.cid)
                result.push({
                    name:item.name,
                    value:length
                })
            }
            return result
        })
        option_right_plate.value.series[0].data = platen_post.value
        initeCharts()
    })
</script>

<style lang="scss" scoped>
    .index-main-title{
      background-color: white;
      padding: 12px;
      margin-bottom: 5px;
      font-size: 14px;
      font-family:Georgia, 'Times New Roman', Times, serif;
    }
    .main-title{
        padding: 10px;
        display: flex;
        justify-content: space-around;
        .main-title-item{
            border-radius: 8px;
            width: 380px;
            height: 100px;
            background-color: white;
            padding: 10px;
            display: flex;
            align-items: center;
            color: rgb(215, 215, 215);
            .item-left{
                .iconfont{
                    font-size: 50px;
                    margin: 0 30px;
                }
            }
            .item-right{
                .item-left-value{
                    font-size: 47px;
                    font-weight: 1000;
                }
            }
        }
        .item-bg1{
            background: linear-gradient(to right, #5851c0, #1c9599);
        }
        .item-bg2{
            background: linear-gradient(to right, #aa5fff, #6e02ea);
        }
        .item-bg3{
            background: linear-gradient(to right, #ff7e5f, #feb47b);
        } 
    }
    .main-chart{
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 10px;
        // padding: 10px;
        margin: 10px;
        #chart-left,#chart-right{
            width: 100%;
            height: 360px;
            padding: 10px;
        }
        .mian-chart-item{
            background-color: white;
            border-radius: 20px;
            width: 600px;
            .chart-item-title{
                padding:20px;
                border-bottom: 1px solid rgb(211, 211, 211);
            }
        }
    }
    .main-more{
        margin:0 20px;
        height: 650px;
        margin-bottom: 40px;
        display: flex;
        gap: 5px;
        justify-content: space-around;
        .main-more-chart{
            margin: 10px;
            width: 300px;
            height: 300px;
            padding: 10px;
            border-radius: 20px;
            background-color: white;
            .chart-more-title{
                font-size: 14px;
                padding: 5px 20px;
            }
            #chart-more{
                width: 100%;
                height: 300px;
            }
        }
        .more-item{
            background-color: white;
            // width: 500px;
            min-width: 300px;
            height: 300px;
            margin: 10px 0;
            padding: 10px;
            border-radius: 20px;
            margin-left: 10px;
            flex:1;
        }
        .more-left{
            width: 100%;
        }
        .more-log{
            background-color: white;
            width: 810px;
            height: 610px;
            margin: 10px;
            border-radius: 20px;
        }
        .more-show{
            background-color: white;
            margin-top: 10px;
            height: 300px;
            // width: 47%;
            flex: 1;
            border-radius: 20px;
        }
        .more-title{
            padding:10px 20px;
            border-bottom: 1px solid rgb(211, 211, 211);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .more-title :last-child{
            font-size: 14px;
            color: rgb(131, 131, 131);
        }
        .value-item{
            display: flex;
            padding: 13px;
            margin: 2px 0px;
            border-bottom:1px solid #eaeaea;
            justify-content: space-between;
            .item-left{
                display: flex;
            }
            .item-left :first-child{
                font-size: 18px;
                margin: 0 15px 0 0;
            }
            .item-left :last-child{
                font-size: 14px;
                align-self: center;
                color: #5c5c5c;
            }
            .value-item-leavel{
                padding: 0 5px;
                .item-leavel-text{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .logs-item{
        display: flex;
        padding:10px 8px;
        margin: 3px;
        // background-color: #f2f2f2;
        border-bottom: 1px solid rgb(237, 236, 236);
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .logs-item-left{
            display: flex;
            gap: 2.5px;
        }
        .logs-item-right{
            font-size: 12px;
        }
    }
</style>