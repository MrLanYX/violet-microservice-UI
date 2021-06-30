<template>
    <div>
        <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="30%" @close="handleClose">
            <el-input v-model="input" :placeholder="placeholder"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="updata" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { newFiles,edit } from '@/api/center/cloud'
    export default {
        name: 'newfolder',
        props: {},
        components: {},
        data() {
            return {
                input: "", // 文件夹名字
                title: "", // 标题名字
                placeholder: "", //提示文字
                dialogVisible: false,
                itemId: 0,
                fileSuffix: ""
            }
        },
        methods: {
            /**
             * 初始化新建文件夹
             * 新建文件夹或者文件文件夹重命名
             */
            initData(type, id, fileSuffix) {
                this.fileSuffix = fileSuffix
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
                if (this.title == "新建文件夹") {
                    let formData = new FormData();
                    let params = {
                        parentId: this.itemId,
                        sourceName: this.input,
                    }
                    Object.keys(params).forEach((key) => {
                        if ("undefined" != typeof params[key] && params[key] != null) {
                            formData.append(key, params[key]);
                        }
                    });
                    newFiles(formData).then(res => {
                        this.$message.success("新建文件夹成功")
                        this.$emit("updata")
                    })
                } else {
                    let params = {
                        id: this.itemId,
                        sourceName: this.input,
                    }
                    if (this.fileSuffix) {
                        params.sourceName=params.sourceName+'.'+this.fileSuffix
                    }
                    edit(params).then(res=>{
                        this.$message.success("重命名成功")
                    })
                }
                this.$emit("updata")
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
                this.fileSuffix = ""
            },
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