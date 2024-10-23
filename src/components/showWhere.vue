<template>
    <div class="user-where">
        当前位置： <span><slot></slot></span>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    .user-where{
            background-color: rgb(243, 239, 239);
            margin: 0 10px;
            height: 35px;
            line-height: 35px;
            padding:0 10px;
        }
</style>