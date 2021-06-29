<template>
    <el-dialog title="创建分享" :visible.sync="dialogVisible" width="30%" @close="handleClose">
        <div style="display:flex">
            <div>选择分享时效：</div>
            <div class="pt3 pl10">
                <el-radio class="mb10" style="display: block;" v-model="radio" label='{"effectiveTime":1,"shareType":2}'>1天</el-radio>
                <el-radio class="mb10" style="display: block;" v-model="radio" label='{"effectiveTime":7,"shareType":2}'>7天</el-radio>
                <el-radio class="mb10" style="display: block;" v-model="radio" label='{"effectiveTime":15,"shareType":2}'>15天</el-radio>
                <el-radio class="mb10" style="display: block;" v-model="radio" label='{"effectiveTime":30,"shareType":2}'>30天</el-radio>
                <el-radio class="mb10" style="display: block;" v-model="radio" label='{"shareType":1}'>永久</el-radio>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="updata" size="mini">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { shareAdd } from '@/api/center/cloud'
    import {copy} from '@/utils/index'
    export default {
        name: 'creatShare',
        props: {},
        components: {},
        data() {
            return {
                dialogVisible: false,
                id: 0,
                radio: '{"effectiveTime":1,"shareType":2}',
            }
        },
        methods: {
            /**
             * 初始化新建文件夹
             * 新建文件夹或者文件文件夹重命名
             */
            initData(id) {
                this.dialogVisible = true
                this.id = id
            },
            /**
             * 提交新数据或者更新
             */
            updata() {
                let param = Object.assign(JSON.parse(this.radio), { fileIds: [this.id] })
                shareAdd(param).then(res => {
                    console.log(res);
                    this.dialogVisible = false
                    let url="后花园的私人云盘ヽ(✿ﾟ▽ﾟ)ノ,链接："+res.data.shareUrl+",提取钥匙："+res.data.checkCode
                    copy(url)
                    this.$message.success('分享成功！链接已复制至粘贴板');
                }).catch(res => {
                    this.dialogVisible = false
                })
            },
            /**
             * 新建文件夹弹窗关闭之后
             */
            handleClose() {},
        },
        mounted() {},
        watch: {},
        computed: {},
        filters: {},
        beforeDestroy() {}
    }
</script>

<style>

</style>