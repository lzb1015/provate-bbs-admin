<template>
    <showWhere>
        <template #default>
            操作记录区
        </template>
    </showWhere>
    <div class="logs-main">
        <div>
            <!-- <el-button>全部</el-button>
            <el-button>用户操作</el-button>
            <el-button>管理员操作</el-button> -->
        </div>
        <div class="logs-list">
            <div v-for="item in showLogList" :key="item.gid" class="logs-item">
                <div>{{ item.create_time }}</div>
                <div class="logs-item-value">
                    <span v-if="item.identity==='root'" class="item-value-identity root">超级管理员</span>
                    <span v-else-if="item.identity === 'adminstrator'" class="item-value-identity admin">管理员</span>
                    <span v-else class="item-value-identity user">用户</span>
                    {{ userStore.searchForUid(item.uid)?.nickName }}
                    {{ item.value }}
                </div>
            </div>
        </div>
        <div class="showPage" v-if="maxPage > 1">
            <el-pagination background layout="prev, pager, next"  v-model:current-page="nowPage" :total="maxPage * 10" />
        </div>
    </div>
</template>

<script setup>
    import showWhere from '@/components/showWhere.vue'
    import { useUserStore } from '@/store';
    import { useLogsStore } from '@/store';
    import { ref,computed } from 'vue'
    const userStore = useUserStore()
    const logsStore = useLogsStore()
    const nowPage = ref(1)
    const showSize = ref(15)
    const maxPage = computed(()=> Math.ceil(logsStore.getLogList.length / showSize.value))
    const showLogList = computed(()=> logsStore.getLogList.slice((nowPage.value-1) * showSize.value,nowPage.value * showSize.value > logsStore.getLogList.length ? logsStore.getLogList.length : nowPage.value*showSize.value))
</script>

<style lang="scss" scoped>
    .logs-main{
        display: flex;
        flex-direction: column;
        margin: 16px 20px;
        .logs-item{
            display: flex;
            padding: 13px;
            border-bottom: 1px solid rgb(225, 225, 225);
            .logs-item-value{
                margin-left: 20px;
                .item-value-identity{
                    color: white;
                    font-size: 13px;
                    padding: 8px;
                    border-radius: 15px;
                    margin: 0 5px;
                }
                .root{
                    background-color: rgb(222, 115, 44);
                }
                .user{
                    background-color: rgb(103, 194, 58);
                }
                .admin{
                    background-color: rgb(58, 160, 194);
                }
            }
        }
        :deep(.showPage){
            align-self: center;
            // width: auto;
            margin-top: 15px;
            margin-bottom: 30px;
            .is-active{
                background-color: rgb(103, 194, 58) !important;
            }
            .number:hover{
                color:rgb(103, 194, 58) !important ;
            }
        }
    }
</style>