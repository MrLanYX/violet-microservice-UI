<template>
    <div class="indexWin" @contextmenu="clearRightClick">
        <div class="bottom-nav box ms flex -l- px32">
            <div class="pl5 flex -l-">
                <iconfont size="40" icon="#iconguanji" bg="#eee" text="关机" @click="logout"></iconfont>
                <iconfont size="40" icon="#iconpingtai" bg="#eee" text="回到桌面" @click="goDock"></iconfont>
                <el-divider direction="vertical"></el-divider>
                <iconfont size="40" icon="#iconfenxiang" bg="#eee" text="分享管理" @click="openMessage(0)"></iconfont>
                <iconfont size="40" icon="#iconshanchu" bg="#eee" text="回收站" @click="openMessage(1)"></iconfont>
            </div>
            <div class="flex" v-show="folders.findIndex(n=>n.del==true)!=-1">
                <el-divider direction="vertical"></el-divider>
                <iconfont v-for="(item,i) in folders" v-show="item.del" :key="i" size="40" icon="#iconwenjianjia" bg="#eee" :text="item.datas.sourceName" @click="item.open=true;item.style.zIndex=++zIndex"></iconfont>
                <el-divider direction="vertical"></el-divider>
            </div>
            <div class="pr10 flex -l-">
                <transition name="draw">
                    <div class="server-list flex" v-show="routerList" :style="'width:'+50*routes.length+'px'">
                        <div v-for="(item,i) in routes" class="ml5 mr5 px26" :key="i" @click="$router.push({name:item.name})">
                            <el-tooltip class="item" effect="dark" :content="item.meta.title" placement="top">
                                <svg-icon :icon-class="item.meta.icon" />
                            </el-tooltip>
                        </div>
                    </div>
                </transition>
                <iconfont size="40" :icon="routerList?'#iconxiangyouzhankai':'#iconHdonghua-xiangzuozhankai'" bg="#eee" text="服务列表" @click="routerList=!routerList"></iconfont>
                <el-divider direction="vertical"></el-divider>
                <timer></timer>
                <iconfont size="40" icon="#iconshangchuan" bg="#eee" text="上传中心" @click="$refs.sliceUpload.init()"></iconfont>
            </div>
        </div>


        <div class="folder-box" @mousedown="clearClickFun" @contextmenu="rightMenu($event,'desktop')">
            <div class="folder-box-dan" :class="{'select-folder':item.id==selectKey}" v-for="item in datas" :key="item.id" @mousedown="clickFolder($event,item.id)" @dblclick="dbClickFolder(item)" @contextmenu="rightMenu($event,'desktopFolder',item)">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="computerIcon(item)"></use>
                </svg>
                <div class="mt5 pl5 pt3 pr5 pb3 ms px14 oto" :title="item.sourceName">
                    {{item.sourceName}}
                </div>
            </div>
        </div>


        <folder v-for="(item,i) in folders" :ref="'folder'+i" :key="i" :styles="item.style" :filesType="filesType" :open.sync="item.open" :delFlag.sync="item.del" :obj.sync="item.datas"></folder>

        <rightMessage :messageFalg="messageFalg" :rightDataType="rightDataType" :rightData="rightData" @openMessage="openMessage" @updata="initData"></rightMessage>


        <div class="box right-click-menu pt5 pb5" v-show="rightClickFlag" :style="rightMenuStyle">
            <div v-for="(item,i) in rightClickList" :key="i" class="text-align-l pt5 pl10 pr20 pb5 oto" :class="{'disable':!item.show}" @click="rightMenuClick($event,item)">{{item.dictLabel}}</div>
        </div>

        <el-upload ref="upload" style="display:none" action="Fake Action" :accept="fileType" :limit="1" :auto-upload="false" :on-change="upload">
            <el-button ref="uploadBtn" size="small" type="primary"></el-button>
        </el-upload>

        <newfolder ref="newfolder" @updata="initData"></newfolder>
        <creatShare ref="creatShare"></creatShare>
        <copyShare ref="copyShare" @updata="initData"></copyShare>
        <sliceUpload ref="sliceUpload" @updata="initData"></sliceUpload>
    </div>
</template>

<script>
    import { flieList, newFiles, download, getShareList, delFile, getDelFileLists, } from '@/api/center/cloud'
    import { getQueryVariable, timeToDate } from '@/utils/index'
    import { ACCEPT_CONFIG } from '@/utils/uploadConfig'
    import iconfont from './components/iconfont'
    import timer from './components/timer'
    import rightMessage from './components/rightMessage'
    import folder from './components/folder'
    import newfolder from './components/newfolder'
    import creatShare from './components/creatShare'
    import copyShare from './components/copyShare'
    import sliceUpload from './components/Upload.vue'
    export default {
        name: '',
        props: {},
        components: {
            iconfont,
            timer,
            rightMessage,
            folder,
            newfolder,
            creatShare,
            copyShare,
            sliceUpload,
        },
        data() {
            return {
                datas: [], // 全部数据
                selectKey: null,
                folders: [],
                zIndex: 1, // 默认文件夹层级
                routerList: false, //服务列表的显示开关
                messageFalg: false, // 消息栏开关
                rightMenuStyle: '', // 右键菜单定位样式
                rightClickFlag: false, // 控制右键菜单显隐
                rightClickList: [], // 右键菜单列表
                rightClickData: {}, //右击目标的数据
                rightClickType: "", // 右击目标的类型
                filesType: [], // 文件类型
                searchMessage: "", // 右侧搜索
                rightData: [], //右侧信息栏通用数据
                rightDataType: true, // 右侧信息栏数据显示类型，真为分享记录，假为回收站
                fileType: ACCEPT_CONFIG.getAll().toString(), // 文件类型
            }
        },
        methods: {
            /**
             * 初始化加载用户文件数据
             */
            initData() {
                let ts = this
                flieList().then(res => {
                    if (res.data.length > 0) { // 首级排序
                        res.data.forEach(n => {
                            if (n.fileType == 0) {
                                n.sort = 1000
                            } else {
                                let obj = this.filesType.find(item => item.dictValue == n.fileSuffix)
                                n.sort = obj ? (1000 - obj.dictSort) : 0
                            }
                            console.log(n.sort);
                        })
                        res.data.sort((m, n) => { return n.sort - m.sort })
                    }
                    this.datas = res.data
                })
                this.folders.forEach((n, i) => {
                    let nam = "folder" + i
                    ts.$refs[nam][0].initData()
                });
            },
            /**
             * 单选中文件夹
             */
            clickFolder(e, i) {
                window.event ? window.event.cancelBubble = true : e.stopPropagation();
                this.selectKey = i
            },
            /**
             * 双击打开文件夹
             */
            dbClickFolder(item) {
                console.log(item);
                if (item.fileType == 1) {
                    this.$message('暂不支持在线预览，耐心等待后续上线！');
                    return
                }
                let option = { // 当前打开的文件夹列表
                    datas: item, // 当前文件夹数据
                    open: true, // 是否打开显示在桌面
                    del: true, // 控制文件夹删除动画 通过与open配合控制三个状态 1.文件夹创建打开动画 2.文件夹小化动画 3.文件夹删除动画
                    style: {
                        top: 100, // 文件的顶部距离
                        left: 100, // 文件的左部距离
                        zIndex: 1, // 用来把文件加置顶
                        height: 450, // 盒子默认高度
                        width: 800, // 盒子默认高度
                    }
                }
                let i = this.folders.findIndex(n => n.datas.id == item.id)
                if (i != -1) {
                    // 判断为曾经打开 恢复上次移动和大小改变
                    if (!this.folders[i].del) {
                        let j = this.findFolder()
                        if (j != -1) { // 确定位置
                            this.folders[i].style.top = this.folders[j].style.top + 50
                            this.folders[i].style.left = this.folders[j].style.left + 50
                        } else {
                            this.folders[i].style.top = 100
                            this.folders[i].style.left = 100
                        }
                        this.folders[i].style.height = 450 // 确定大小
                        this.folders[i].style.width = 800
                        this.folders[i].datas = item // 更新数据
                        this.folders[i].del = true
                    }
                    this.folders[i].style.zIndex = ++this.zIndex
                    this.folders[i].open = true
                } else {
                    // 找到最上层窗口叠加位置
                    let i = this.findFolder()
                    if (i != -1) {
                        option.style.top = this.folders[i].style.top + 50
                        option.style.left = this.folders[i].style.left + 50
                    }
                    // 叠加层级
                    option.style.zIndex = ++this.zIndex
                    this.folders.push(option)
                }
            },
            /**
             * 清除系统自带右键菜单
             */
            clearRightClick() {
                window.event.returnValue = false;
            },
            /**
             * 整个桌面系统的单击操作状态清除，
             * 增加忽略过滤  传递要忽略的内容为真即可跳过
             */
            clearClickFun(val) {
                if (!val.desktop) { // 桌面文件夹选中
                    this.selectKey = null
                }
                if (!val.serverList) { // 服务列表收起
                    this.routerList = false
                }
                if (!val.message) { // 消息栏收起      
                    this.messageFalg = false
                }
                if (!val.right) { // 右键菜单
                    this.rightClickFlag = false
                }
            },
            /**
             * 回到桌面
             */
            goDock() {
                this.clearClickFun({})
                this.folders.forEach(n => {
                    n.open = false
                });
            },
            /**
             * 管理所有的右键操作
             */
            rightMenu(e, type, val) {
                // console.log(e, type, val);
                this.rightClickList.forEach(n => n.show = true) // 全部选项恢复默认开启
                this.rightClickFlag = true // 开启窗口
                this.$nextTick(() => { // 调整位置
                    let box = document.querySelector('.right-click-menu')
                    let y = (box.offsetHeight * 1 + e.pageY * 1) > window.innerHeight
                    let x = (box.offsetWidth * 1 + e.pageX * 1) > window.innerWidth
                    this.rightMenuStyle = (x ? 'right:0px;' : 'left:' + e.pageX + 'px;') + (y ? 'bottom:0px' : 'top:' + e.pageY + 'px')
                })
                if (type == 'desktopFolder' && val) { // 桌面文件夹右键
                    this.rightClickData = val
                    this.rightClickType = type
                    this.rightClickList[1].show = this.rightClickList[2].show = false
                    if (val.fileType == "1") { // 桌面文件是否开启下载
                        // this.rightClickList[0].show = false
                        this.rightClickList[7].show = true
                    } else {
                        this.rightClickList[0].show = true
                        this.rightClickList[7].show = false
                    }
                    return
                }
                if (type == 'tablesItem' && val.fileType == 0) { // 文件夹内单行右键
                    this.rightClickData = val
                    this.rightClickType = type
                    this.rightClickList[1].show = this.rightClickList[2].show = this.rightClickList[7].show = false
                    return
                }
                if (type == 'tablesItem' && val.fileType == 1) { // 文件右键
                    this.rightClickData = val
                    this.rightClickType = type
                    this.rightClickList[1].show = this.rightClickList[2].show = false
                    return
                }
                if (type == 'tables' && !e.path.find(n => n.nodeName == "TBODY")) { // 文件夹整体右键
                    this.rightClickData = val
                    this.rightClickType = type
                    this.rightClickList[0].show = this.rightClickList[3].show = this.rightClickList[4].show = this.rightClickList[5].show = this.rightClickList[7].show = false
                    return
                }
                if (type == 'desktop' && e.path[0].className == "folder-box") { // 桌面右键
                    this.rightClickData = { id: -1 }
                    this.rightClickType = type
                    this.rightClickList[0].show = this.rightClickList[3].show = this.rightClickList[4].show = this.rightClickList[5].show = this.rightClickList[7].show = false
                    return
                }
            },
            /**
             * 右键菜单的单击选择
             */
            rightMenuClick(e, val) {
                console.log(this.rightClickData, val);
                if (val.show) {
                    this.clearClickFun({})
                    if (val.dictValue == "F5") {
                        console.log("刷新数据");
                        this.initData()
                    }
                    if (val.dictValue == "name") {
                        console.log("重命名");
                        this.$refs.newfolder.initData("edit", this.rightClickData.id, this.rightClickData.fileSuffix)
                    }
                    if (val.dictValue == "del") {
                        console.log("删除操作");
                        this.$confirm('此操作将删除此文件（可在回收站恢复）, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            delFile({ id: this.rightClickData.id }).then(res => {
                                this.$message.success('删除成功!');
                                this.initData()
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '删除已取消'
                            });
                        });
                    }
                    if (val.dictValue == "share") {
                        console.log("分享");
                        this.$refs.creatShare.initData(this.rightClickData.id)
                    }
                    if (val.dictValue == "upload") {
                        console.log("上传文件");
                        this.$refs.sliceUpload.init(this.rightClickData.id)
                        // this.$refs.uploadBtn.$el.click()
                    }
                    if (val.dictValue == "newFolder") {
                        console.log("新建文件夹");
                        this.$refs.newfolder.initData("add", this.rightClickData.id)
                    }


                    if (this.rightClickType == "desktopFolder" && val.dictValue == "open") {
                        console.log("桌面文件夹打开");
                        if (this.rightClickData.fileType == "1") {
                            this.$message('暂不支持在线预览，耐心等待后续上线！');
                            return
                        }
                        this.dbClickFolder(this.rightClickData)
                    }


                    if (this.rightClickType == "tablesItem" && val.dictValue == "open" && this.rightClickData.fileType == "0") {
                        console.log("文件夹内文件夹打开");
                        this.dbClickFolder(this.rightClickData)
                    }
                    if (this.rightClickType == "tablesItem" && val.dictValue == "open" && this.rightClickData.fileType == "1") {
                        console.log("文件夹内文件打开");
                        this.$message('暂不支持在线预览，耐心等待后续上线！');
                    }
                    if (val.dictValue == "download" && this.rightClickData.fileType == "1") {
                        console.log("文件下载");
                        download(this.rightClickData).then(res => {})
                    }
                }
            },
            /**
             * 找到打开的文件夹里面层级最高的那个的下标
             */
            findFolder() {
                let j = -1
                let zindex = 0
                this.folders.forEach((n, i) => {
                    if (n.open && n.style.zIndex > zindex) {
                        zindex = n.style.zIndex
                        j = i
                    }
                })
                return j
            },
            /**
             * 退出登录
             */
            async logout() {
                this.$confirm('确定注销并退出系统吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('LogOut').then(() => {
                        location.href = '/index';
                    })
                })
            },
            /**
             * 开始上传方法
             */
            async upload(file, fileList) {
                const loading = this.$loading({
                    lock: true,
                    text: '文件上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let formData = new FormData();
                let params = {
                    parentId: this.rightClickData.id,
                }
                Object.keys(params).forEach((key) => {
                    if ("undefined" != typeof params[key] && params[key] != null) {
                        formData.append(key, params[key]);
                    }
                });
                if (fileList[0] != null) {
                    formData.append("multipartFiles", fileList[0].raw);
                }
                await newFiles(formData).then(res => {
                    // console.log(res);
                    this.$message.success('上传成功！')
                    this.initData()
                    loading.close();
                })
                this.$refs.upload.clearFiles()
            },
            /**
             * 打开右边信息栏
             */
            openMessage(val) { // 0.分享管理 1.回收站
                this.rightData = []
                this.messageFalg = true
                this.searchMessage = ""
                if (val == 0) {
                    this.rightDataType = true
                    getShareList().then(res => {
                        for (const item of res.rows) {
                            if (item.shareType == "1") {
                                item.shareType = "永久"
                            } else {
                                let start = Date.parse(new Date(item.createTime))
                                let end = start + item.effectiveTime * (1000 * 3600 * 24)
                                let difference = (end - Date.parse(new Date()))
                                if (difference < 0) {
                                    item.shareType = "已过期"
                                } else {
                                    item.shareType = timeToDate(difference)
                                }
                            }
                            item.shareUrl = location.href.split("?")[0] + "?id=" + item.shareId
                        }
                        this.rightData = res.rows
                    })
                } else {
                    this.rightDataType = false
                    getDelFileLists().then(res => {
                        for (const item of res.rows) {
                            let start = Date.parse(new Date(item.createTime))
                            let end = start + (15 * 1000 * 3600 * 24)
                            let difference = (end - Date.parse(new Date()))
                            if (difference < 0) {
                                item.date = "已过期"
                            } else {
                                item.date = timeToDate(difference)
                            }
                        }
                        this.rightData = res.rows
                    })
                }
            },
            /**
             * 图标计算方法
             */
            computerIcon(val) {
                let type = -1
                if (val.fileType == 0) {
                    type = 0
                } else {
                    type = val.fileSuffix
                }
                let obj = this.filesType.find(n => n.dictValue == type)
                return obj ? ('#' + obj.remark) : '#iconrizhi'
            }
        },
        async mounted() {
            this.getDicts("cloud_right_click_list").then(response => {
                this.rightClickList = response.data;
                this.rightClickList.forEach(n => n.show = true)
            });
            await this.getDicts("cloud_files_type").then(response => {
                this.filesType = response.data;
            });
            this.initData()
            // 处理分享操作
            let key = getQueryVariable("id")
            if (key) {
                this.$refs.copyShare.initData(key)
            }
            let el = document.documentElement;
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            rfs.call(el);
        },
        watch: {},
        computed: {
            routes() {
                let all = this.$store.getters.permission_routes
                let router1 = all.find(n => n.name == "ParentView")
                let router2 = all.find(n => n.redirect == "index")
                let routers = router1.children.concat(router2.children)
                return routers
            },
        },
        filters: {}
    }
</script>

<style>

</style>