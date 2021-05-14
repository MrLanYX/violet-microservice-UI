<template>
    <div class="jump" @click="click">
        <el-tooltip class="item" effect="dark" :content="text" placement="top">
            <div class="ml5 mr5" :style="'width:'+size+'px;height:'+size+'px;background: '+bg+';border-radius: 10px;display: flex;justify-content: center;align-items: center;'">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="icon"></use>
                </svg>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            size: String,
            icon: String,
            bg: String,
            text: String,
        },
        methods:{
            click(){
                this.$emit("click")
            }
        },
    }
</script>

<style>
</style>