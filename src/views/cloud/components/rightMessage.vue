<template>
    <transition name="draw">
        <div class="message-box ms box" v-if="messageFalg">
            <el-input v-model="searchMessage" size="mini" placeholder="请输入搜索内容"></el-input>
            <div class="pl10 pr0 pt10 pb10 pr10" v-if="rightDataType">
                <div v-for="(item,index) in rightDataFilter" class="mb10 message-box-card" :key="index" :style="messageFalg?('animation: cardIpnut .8s ease-out '+((index+1)*0.2)+'s both alternate;'):''">
                    <div class="message-box-title pt10 pl10 pr10 pb5 oto">{{item.fileName}}</div>
                    <div class="pt10 pl10 pr10 pb20">
                        <p><i class="el-icon-paperclip"></i> 分享创建时间：{{item.createTime}}</p>
                        <p><i class="el-icon-timer"></i> 分享剩余时长：{{item.shareType}}</p>
                        <p v-if="item.shareType!='已过期'" style="word-break: break-all"><i class="el-icon-link"></i>分享链接：<span style="user-select: all;cursor: pointer">{{item.shareUrl}}</span></p>
                        <p v-if="item.shareType!='已过期'"><i class="el-icon-key"></i> 分享提取密码：{{item.checkCode}}</p>
                    </div>
                    <div class="text-align-r pr10">
                        <el-button v-if="item.shareType!='已过期'" type="text" size="mini" icon="el-icon-document" @click="copy(item)">一键复制</el-button>
                        <el-button type="text" size="mini" icon="el-icon-delete" @click="cancelShare(item)">取消分享</el-button>
                    </div>
                </div>
                <div class="flex -l-" style="height:100%" v-show="rightDataFilter.length==0">暂无数据</div>
            </div>
            <div class="pl10 pr0 pt10 pb10 pr10" v-else>
                <div v-for="(item,index) in rightDataFilter" class="mb10 message-box-card" :key="index" :style="messageFalg?('animation: cardIpnut .8s ease-out '+((index+1)*0.2)+'s both alternate;'):''">
                    <div class="message-box-title pt10 pl10 pr10 pb5 oto">{{item.fileName}}</div>
                    <div class="pt10 pl10 pr10 pb20">
                        <p><i class="el-icon-printer"></i> 删除时间：{{item.createTime}}</p>
                        <p><i class="el-icon-timer"></i> 剩余恢复时长：{{item.date}}</p>
                    </div>
                    <div class="text-align-r pr10">
                        <el-button v-if="item.date!='已过期'" type="text" size="mini" icon="el-icon-finished" @click="delOperate('restore',item)">恢复删除</el-button>
                        <el-button type="text" size="mini" icon="el-icon-delete" @click="delOperate('recover',item)">删除记录</el-button>
                    </div>
                </div>
                <div class="flex -l-" style="height:100%" v-show="rightDataFilter.length==0">暂无数据</div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { delShare, Undelete, delRecord } from '@/api/center/cloud'
    import { copy } from '@/utils/index'
    export default {
        name: 'rightMessage',
        props: {
            messageFalg: Boolean,
            rightDataType: Boolean,
            rightData: Array,
        },
        components: {

        },
        data() {
            return {
                searchMessage: "",
            }
        },
        methods: {
            /**
             * 复制链接
             */
            copy(val) {
                let url = "摸鱼站的私人云盘ヽ(✿ﾟ▽ﾟ)ノ,链接：" + location.href.split("?")[0] + "?id=" + val.shareId + ",提取钥匙：" + val.checkCode
                copy(url)
                this.$message.success('链接已复制至粘贴板!');
            },
            /**
             * 取消分享
             */
            cancelShare(item) {
                this.$confirm('此操作将永久取消分享, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delShare(item.shareId).then(res => {
                        this.$emit('openMessage', 0)
                        this.$message.success('分享删除成功!');
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除分享已取消'
                    });
                });
            },
            /**
             * 对于删除文件后的操作
             */
            delOperate(type, val) {
                if (type == "restore") { // 恢复文件
                    this.$confirm('此操作将恢复删除的文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Undelete({ id: val.id }).then(res => {
                            this.$emit('openMessage', 1)
                            this.$emit('updata')
                            this.$message.success('文件恢复成功!');
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '文件恢复已取消'
                        });
                    });
                } else { // 删除记录
                    this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delRecord([val.id]).then(res => {
                            this.$emit('openMessage', 1)
                            this.$message.success('记录删除成功!');
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '记录删除已取消'
                        });
                    });
                }
            },
        },
        mounted() {

        },
        watch: {

        },
        computed: {
            rightDataFilter() {
                return this.rightData.filter(data => !this.searchMessage || data.fileName.toLowerCase().includes(this.searchMessage.toLowerCase()))
            },
        },
        filters: {

        },
        beforeDestroy() {

        }
    }
</script>

<style>

</style>