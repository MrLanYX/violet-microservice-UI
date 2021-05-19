<template>
    <div class="indexWin" @contextmenu="clearRightClick">
        <div class="bottom-nav box ms flex -l- px32">
            <div class="pl5 flex -l-">
                <iconfont size="40" icon="#iconguanji" bg="#eee" text="关机" @click="logout"></iconfont>
                <el-divider direction="vertical"></el-divider>
                <iconfont size="40" icon="#iconpingtai" bg="#eee" text="回到桌面" @click="goDock"></iconfont>
                <iconfont size="40" icon="#iconfenxiang" bg="#eee" text="分享管理"></iconfont>
                <iconfont size="40" icon="#iconshanchu" bg="#eee" text="回收站"></iconfont>
            </div>
            <div class="flex" v-show="folders.findIndex(n=>n.del==true)!=-1">
                <el-divider direction="vertical"></el-divider>
                <iconfont v-for="(item,i) in folders" v-show="item.del" :key="i" size="40" icon="#iconwenjianjia" bg="#eee" :text="item.datas.name" @click="item.open=true;item.style.zIndex=++zIndex"></iconfont>
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
                <iconfont size="40" icon="#icontonggao" bg="#eee" text="消息中心" @click="messageFalg=!messageFalg"></iconfont>
            </div>
        </div>


        <div class="folder-box" @mousedown="clearClickFun">
            <div class="folder-box-dan" :class="{'select-folder':item.id==selectKey}" v-for="item in datas" :key="item.id" @mousedown="clickFolder($event,item.id)" @dblclick="dbClickFolder(item)" @contextmenu="contextmenu($event,'desktopFolder',item)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconwenjianjia"></use>
                </svg>
                <div class="mt5 pl5 pt3 pr5 pb3 ms px14 oto" :title="item.name">
                    {{item.name}}
                </div>
            </div>
        </div>


        <folder v-for="(item,i) in folders" :key="i" :styles="item.style" :open.sync="item.open" :delFlag.sync="item.del" :obj.sync="item.datas"></folder>


        <transition name="draw">
            <div class="message-box ms box" v-if="messageFalg">
                <div class="pl10 pr0 pt10 pb10 pr10">
                    <div v-for="i in 9" class="mb10 message-box-card" :key="i" :style="messageFalg?('animation: cardIpnut .8s ease-out '+(i*0.2)+'s both alternate;'):''">
                        <div class="message-box-title pt10 pl10 pr10 pb5 oto">{{i}}</div>
                        <div class="pt10 pl10 pr10 pb30">我现在我现在我现在我现在我现在我现在我现在我现在</div>
                    </div>
                </div>
            </div>
        </transition>

        
        <div class="box right-click-menu" v-show="rightClickFlag" @click="clearClickFun" :style="'top:'+rightClickTop+'px;left:'+rightClickLeft+'px'">1</div>
    </div>
</template>

<script>
    import iconfont from './components/iconfont'
    import timer from './components/timer'
    import folder from './components/folder'
    export default {
        name: '',
        props: {},
        components: {
            iconfont,
            timer,
            folder,
        },
        data() {
            return {
                // 全部数据
                datas: [{
                    id: 1,
                    name: "文件夹一",
                    type: "文件夹",
                    date: "2021.5.19",
                    size: "10MB",
                    children: [{
                        id: 11,
                        name: "文件夹一的文件夹一",
                        type: "文件夹",
                        date: "2021.5.19",
                        size: "10MB",
                        children: [{
                            id: 111,
                            name: "文件夹1",
                            type: "文件",
                            date: "2021.5.19",
                            size: "10MB",
                            children: []
                        }, {
                            id: 112,
                            name: "文件1",
                            type: "文件",
                            date: "2021.5.19",
                            size: "10MB",
                        }, {
                            id: 113,
                            name: "文件2",
                            type: "文件",
                            date: "2021.5.19",
                            size: "10MB",
                        }, {
                            id: 114,
                            name: "文件3",
                            type: "文件",
                            date: "2021.5.19",
                            size: "10MB",
                        }, {
                            id: 115,
                            name: "文件4",
                            type: "文件",
                            date: "2021.5.19",
                            size: "10MB",
                        }, ]
                    }, {
                        id: 12,
                        name: "文件夹一的文件夹二",
                        type: "文件夹",
                        date: "2021.5.19",
                        size: "10MB",
                        children:[],
                    }, {
                        id: 13,
                        name: "文件夹一的文件夹三",
                        type: "文件夹",
                        date: "2021.5.19",
                        size: "10MB",
                        children:[],
                    }, {
                        id: 14,
                        name: "文件3",
                        type: "文件",
                        date: "2021.5.19",
                        size: "10MB",
                    }, {
                        id: 15,
                        name: "文件4",
                        type: "文件",
                        date: "2021.5.19",
                        size: "10MB",
                    }, ]
                }, {
                    id: 2,
                    name: "文件夹",
                    children: [{
                        id: 21,
                        name: "文件夹1",
                        children: [{
                            id: 211,
                            name: "文件夹1",
                            children: []
                        }, {
                            id: 212,
                            name: "文件1",
                        }, {
                            id: 213,
                            name: "文件2",
                        }, {
                            id: 214,
                            name: "文件3",
                        }, {
                            id: 215,
                            name: "文件4",
                        }, ]
                    }, {
                        id: 22,
                        name: "文件1",
                    }, {
                        id: 23,
                        name: "文件2",
                    }, {
                        id: 24,
                        name: "文件3",
                    }, {
                        id: 25,
                        name: "文件4",
                    }, ]
                }, {
                    id: 3,
                    name: "文件",
                }],
                selectKey: null,
                folders: [],
                zIndex: 1, // 默认文件夹层级
                routerList: false, //服务列表的显示开关
                messageFalg: false, // 消息栏开关
                rightClickTop: 0, // 右键菜单定位
                rightClickLeft: 0, // 右键菜单定位
                rightClickFlag: false, // 控制右键菜单显隐
            }
        },
        methods: {
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
                        if (j != -1) {
                            this.folders[i].style.top = this.folders[j].style.top + 50
                            this.folders[i].style.left = this.folders[j].style.left + 50
                        } else {
                            this.folders[i].style.top = 100
                            this.folders[i].style.left = 100
                        }
                        this.folders[i].style.height = 450
                        this.folders[i].style.width = 800
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
             * 右键菜单
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
            contextmenu(e, type, val) {
                this.rightClickFlag = true
                if (type == 'desktopFolder') { // 桌面文件夹右键
                    console.log(val);
                    this.rightClickLeft = e.pageX
                    this.rightClickTop = e.pageY
                }
            },
            /**
             * 找到打开的文件夹里面层级最高的那个的下标
             */
            findFolder() {
                let j = -1
                this.contextmenu()
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
            }
        },
        mounted() {
            console.log(this.routes);
        },
        watch: {},
        computed: {
            routes() {
                // let all = this.$store.getters.permission_routes
                let router1 = all.find(n => n.name == "ParentView")
                let router2 = all.find(n => n.redirect == "index")
                let routers = router1.children.concat(router2.children)
                return routers
            }
        },
        filters: {

        }
    }
</script>

<style>

</style>