<template>
    <div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="handleClose">
            <el-input v-model="input" :placeholder="placeholder"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="updata" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { newFiles } from '@/api/center/cloud'
    export default {
        name: '',
        props: {},
        components: {},
        data() {
            return {
                input: "", // 文件夹名字
                title: "", // 标题名字
                placeholder: "", //提示文字
                dialogVisible: false,
                itemId: 0,
            }
        },
        methods: {
            /**
             * 初始化新建文件夹
             * 新建文件夹或者文件文件夹重命名
             */
            initData(type, id) {
                this.dialogVisible = true
                this.itemId = id
                if (type == "add") {
                    this.placeholder = "请输入新建的文件夹名"
                    this.title = "新建文件夹"
                }
                if (type == "edit") {
                    this.placeholder = "请输入修改后的名字"
                    this.title = "重命名"
                }
            },
            /**
             * 提交新数据或者更新
             */
            updata() {
                this.dialogVisible = false
                newFiles({
                    parentId: this.itemId,
                    sourceName: this.input,
                }).then(res => {})
            },
            /**
             * 新建文件夹弹窗关闭之后
             */
            handleClose() {
                console.log(11);
                this.itemId = 0
                this.input = null
                this.placeholder = ""
                this.title = ""
                this.$emit("updata")
            },
        },
        mounted() {

        },
        watch: {

        },
        computed: {

        },
        filters: {

        },
        beforeDestroy() {

        }
    }
</script>

<style>

</style>