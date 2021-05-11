<template>
    <div class="cloud-main">
        <win v-if="systemType"></win>
        <phone v-else></phone>
    </div>
</template>

<script>
    import win from './indexWin'
    import phone from './indexPhone'
    export default {
        name: 'cloudMain',
        props: {},
        components: {
            win,
            phone
        },
        data() {
            return {
                systemType: true
            }
        },
        methods: {

        },
        mounted() {

        },
        watch: {

        },
        computed: {

        },
        filters: {

        },
        created() {
            if (/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Fennec|BlackBerry|Mobile|IEMobile|MQQBrowser|JUC|Fennec|WosBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)) {
                this.systemType = false
            }
        }
    }
</script>

<style>

</style>