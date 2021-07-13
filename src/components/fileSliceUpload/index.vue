<template>
    <div class="slice-upload">
        <input type="file" id="uploadBtn" @change="addfile" style="display:none" :accept="fileType.toString()">
        <el-dialog title="上传列表" :visible.sync="dialogVisible" width="600px">
            <div style="height:30vh;">
                <div v-for="(item,i) in fileLists" :key="i" class="mb10">
                    <p class="oto" :title="item.name">{{item.name}}</p>
                    <div class="flex">
                        <el-progress :percentage="50" style="display: inline-block;width:calc(100% - 70px)"></el-progress>
                        <!-- <el-button class="mr10" type="text" icon="el-icon-video-pause" title="暂停"></el-button> -->
                        <el-button class="mr10" type="text" icon="el-icon-video-play" title="继续"></el-button>
                        <el-button class="mr10" type="text" icon="el-icon-refresh-right" title="重试"></el-button>
                        <el-button type="text" icon="el-icon-circle-close" title="取消上传"></el-button>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini">全部暂停</el-button>
                <el-button size="mini">全部继续</el-button>
                <el-button size="mini">全部取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { ACCEPT_CONFIG } from '@/utils/uploadConfig'
    import SparkMD5 from 'spark-md5'
    import { sliceUpload } from '@/api/center/cloud'
    export default {
        name: 'fileSliceUpload',
        props: {},
        components: {},
        data() {
            return {
                dialogVisible: false,
                uploader: null,
                uploadUrl: '/upload', //上传地址
                chunkSize: 5 * 1024 * 1024, // 单片大小
                fileLists: [], //文件列表
                fileType: ACCEPT_CONFIG.getAll(), // 文件类型
                parentId: '', // 上传位置，业务临时数据
            }
        },
        methods: {
            /**
             * 初始化触发选择文件
             */
            init(id) {
                this.parentId = id
                document.querySelector('#uploadBtn').value = ""
                $("#uploadBtn").click()
            },
            /**
             * 添加文件
             */
            async addfile() {
                let file = document.querySelector("#uploadBtn").files[0]
                if (!file) {
                    return false
                }
                file.id = 'WU_FILE_' + this.fileLists.length
                console.log(file);
                this.fileLists.push({
                    id: file.id,
                    parentId: this.parentId,
                    md5: '',
                    fileSize: file.size,
                    name: file.name,
                })
                this.dialogVisible = true

                const getFileMd5 = (file) => {
                    const fileReader = new FileReader()
                    const spark = new SparkMD5.ArrayBuffer();
                    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                    let currentChunk = 0
                    let chunks = Math.ceil(file.size / this.chunkSize)
                    // 计算md5
                    return new Promise((resolve) => {
                        const loadNext = () => {
                            let start = currentChunk * this.chunkSize;
                            let end = ((start + this.chunkSize) >= file.size) ? file.size : start + this.chunkSize;
                            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                        };
                        loadNext();
                        fileReader.onload = e => {
                            let a = spark.append(e.target.result);
                            if (currentChunk < chunks) {
                                ++currentChunk;
                                console.log(currentChunk);
                                loadNext();
                            } else {
                                let md5 = spark.end();
                                resolve(md5)
                            }
                        };
                    })
                }
                let md5 = await getFileMd5(file)
                this.fileLists.find(n => n.id == file.id).md5 = md5
                await sliceUpload({
                    md5
                }).then(res => {})
                console.log(md5);
                this.uploader.addFiles(file)
            }
        },
        mounted() {
            // 初始化
            this.uploader = WebUploader.create({
                auto: true, // 选完文件后，是否自动上传
                swf: '/resource/Uploader.swf', // swf文件路径
                server: this.uploadUrl, // 文件接收服务端
                threads: 3,
                fileNumLimit: 5, // 限制上传个数
                chunked: true, //分片上传
                chunkSize: this.chunkSize, //分片大小
                duplicate: true, // 重复上传
            });
            // 文件进入队列前
            this.uploader.on('beforeFileQueued', (file) => {
                console.log(file);
            });
            // this.uploader.on('', (file) => {})
        },
        watch: {},
        computed: {},
        filters: {},
        beforeDestroy() {}
    }
</script>

<style lang="scss">
    .slice-upload {
        .el-button--text {
            padding: 0;
            margin-left: 0;
        }
    }
</style>