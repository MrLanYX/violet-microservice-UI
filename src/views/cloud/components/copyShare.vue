<template>
    <el-dialog :close-on-click-modal="false" title="收藏分享" :visible.sync="dialogVisible" width="50%" @close="handleClose">
        <div class="copyShare-main">
            <el-input v-if="!flag" placeholder="请输入提取密码" v-model="mima" style="width:60%;margin-top:-25px">
                <el-button slot="append" icon="el-icon-attract" @click="submit">提取</el-button>
            </el-input>
            <div v-if="flag" class="left">
                <p class="mb10">分享者：{{youDatas.clouddiscFileShare.createBy}}</p>
                <p class="mb10">分享时间：{{youDatas.clouddiscFileShare.shareStartTime}}</p>
                <p class="mb10">分享时长：{{date}}</p>
                <p class="mb10">分享内容：</p>
                <div class="gdbox">
                    <el-tree :data="youDatas.clouddiscFileList" :props="{children: 'children',label: 'sourceName'}" default-expand-all ref="tree0"></el-tree>
                </div>
            </div>
            <div v-if="flag" class="right pl10 pr10">
                <div class="mb10">
                    <span>保存位置：</span>
                    <el-input style="width:calc(100% - 80px)" placeholder="可输入关键字进行过滤" size="mini" v-model="filterText"></el-input>
                </div>
                <div class="gdbox" style="height:calc(100% - 38px)">
                    <el-tree :data="meDatas" :props="{children: 'children',label: 'sourceName'}" default-expand-all @current-change="checkChange" :filter-node-method="filterNode" :expand-on-click-node="false" :highlight-current="true" ref="tree"></el-tree>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="updata" size="mini" :disabled="!flag">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { flieList, getShare } from '@/api/center/cloud'
    export default {
        name: 'copyShare',
        props: {},
        components: {},
        data() {
            return {
                dialogVisible: false,
                key: "",
                mima: "",
                meDatas: [],
                youDatas: {
                    clouddiscFileList: []
                },
                flag: false,
                filterText: "",
                targetId: "",
            }
        },
        methods: {
            /**
             * 初始化新建文件夹
             * 新建文件夹或者文件文件夹重命名
             */
            initData(key) {
                this.dialogVisible = true
                this.key = key
                this.mima = ""
            },
            /**
             * 验证锁和钥匙是否正确
             */
            submit() {
                let from = {
                    shareId: this.key,
                    checkCode: this.mima,
                }
                getShare(from).then(res => {
                    console.log(res);
                    this.youDatas = res.data
                    this.flag = true
                    flieList().then(res => {
                        this.meDatas = res.data

                        function filterTree(data) { //删除非文件夹的节点
                            let newTree = data.filter(x => x.fileType != 1)
                            newTree.forEach(x => x.children && (x.children = filterTree(x.children)))
                            return newTree
                        }
                        this.meDatas = [{
                            id: -1,
                            sourceName: "根节点",
                            children: filterTree(this.meDatas)
                        }]
                    })
                }).catch(res => {
                    console.log(res);
                    if (res != "Error: 验证码错误！") {
                        this.dialogVisible = false
                        this.$router.replace({ name: "Cloud" })
                        return
                    }
                    this.mima = ""
                    document.querySelector(".copyShare-main").querySelector(".el-input__inner").placeholder = "提取码错误请重新输入"
                    console.log("mima err");
                })
            },
            /**
             * 提交新数据或者更新
             */
            updata() {
                if (!this.targetId) {
                    this.$message.warning("请选择保存位置")
                    return
                }
                // let param = {}
                // shareAdd(param).then(res => {
                //     console.log(res);
                //     this.dialogVisible = false
                //     this.$router.replace({ name: "Cloud" })
                //     this.$emit("updata")
                // }).catch(res => {
                this.dialogVisible = false
                this.$router.replace({ name: "Cloud" })
                // })
            },
            /**
             * 新建文件夹弹窗关闭之后
             */
            handleClose() {
                this.$router.replace({ name: "Cloud" })
            },
            /**
             * 树的过滤方法
             */
            filterNode(value, data) {
                console.log(value, data);
                if (!value) return true;
                return data.sourceName.indexOf(value) !== -1;
            },
            checkChange(data) {
                this.targetId = data.id
            }
        },
        mounted() {},
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        computed: {
            date() {
                if (this.youDatas.clouddiscFileShare.effectiveTime == null && this.youDatas.clouddiscFileShare.shareType == 1) {
                    return "永久"
                } else {
                    return this.youDatas.clouddiscFileShare.effectiveTime + "天"
                }
            }
        },
        filters: {},
        beforeDestroy() {}
    }
</script>

<style lang="scss">

</style>