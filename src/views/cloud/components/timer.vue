<template>
    <div class="timer text-align-c mr10">
        <div class="px16">{{time}}</div>
        <el-divider></el-divider>
        <div class="px12">{{day}}</div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {},
        components: {

        },
        data() {
            return {
                timer: {},
                day:"2021/1/1",
                time:"12:00:00",
            }
        },
        methods: {
            /**
             * 时间初始化
             */
            initData() {
                this.timer = setInterval(() => {
                    this.day=new Date().toLocaleDateString()
                    this.time=new Date().toLocaleTimeString('chinese', { hour12: false })
                }, 1000);
            }
        },
        mounted() {
            this.initData()
        },
        watch: {

        },
        computed: {

        },
        filters: {

        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
    }
</script>

<style>

</style>