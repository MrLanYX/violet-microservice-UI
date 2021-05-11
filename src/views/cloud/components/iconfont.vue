<template>
    <div class="ml5 mr5" :style="'width:'+size+'px;height:'+size+'px;background: '+bg+';border-radius: 10px;display: flex;justify-content: center;align-items: center;'">
        <svg class="icon" aria-hidden="true">
            <use :xlink:href="icon"></use>
        </svg>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            size: String,
            icon: String,
            bg: String,
        },
    }
</script>

<style>
</style>