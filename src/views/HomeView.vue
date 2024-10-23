<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <menu-view></menu-view>
      </el-aside>
      <el-container>
        <el-header>
          <head-view></head-view>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
    import MenuView from '@/views/MenuView/MenuView.vue'
    import HeadView from '@/views/HeadView/HeadView.vue'
</script>

<style lang="scss" scoped>
  .el-header{
    padding: 0;
    // height: 50px;
  }
  .el-main{
    background-color: rgb(255, 247, 247);
  }
</style>