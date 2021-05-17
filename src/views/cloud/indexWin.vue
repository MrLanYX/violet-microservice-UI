<template>
    <div class="indexWin" @contextmenu="rightClick">
        <div class="bottom-nav box ms flex -l- px32">
            <div class="pl5 flex -l-">
                <iconfont size="40" icon="#iconpingtai" bg="#eee" text="回到桌面" @click="goDock"></iconfont>
                <iconfont size="40" icon="#iconfenxiang" bg="#eee" text="分享管理"></iconfont>
                <iconfont size="40" icon="#iconshanchu" bg="#eee" text="回收站"></iconfont>
                <el-divider direction="vertical"></el-divider>
            </div>
            <div class="flex" v-show="folders.length!=0">
                <el-divider direction="vertical"></el-divider>
                <iconfont v-for="(item,i) in folders" :key="i" size="40" icon="#iconwenjianjia" bg="#eee" :text="item.datas.name" @click="item.open=true;item.style.zIndex=++zIndex"></iconfont>
                <el-divider direction="vertical"></el-divider>
            </div>
            <div class="pr10 flex -l-">
                <transition name="draw">
                    <div class="server-list" v-show="routerList" :style="'width:'+50*routes.length+'px'">
                        <div v-for="(item,i) in routes" class="ml5 mr5 px26" :key="i" :title="item.meta.title">
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
        <div class="folder-box">
            <div class="folder-box-dan" :class="{'select-folder':item.id==selectKey}" v-for="item in datas" :key="item.id" @click="clickFolder(item.id)" @dblclick="dbClickFolder(item)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconwenjianjia"></use>
                </svg>
                <div class="mt5 pl5 pt3 pr5 pb3 ms px14 oto" :title="item.name">
                    {{item.name}}
                </div>
            </div>
        </div>
        <folder v-for="(item,i) in folders" :key="i" :styles="item.style" :open.sync="item.open" :delFlag.sync="item.del" @del="folders.splice(i,1)"></folder>
        <transition name="draw">
            <div class="message-box ms box pl10 pr0 pt10 pb10" v-show="messageFalg">
                1
            </div>
        </transition>
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
                    name: "文件夹文件夹文件夹文件夹",
                    children: [{
                        id: 11,
                        name: "文件夹1",
                        children: [{
                            id: 111,
                            name: "文件夹1",
                            children: []
                        }, {
                            id: 112,
                            name: "文件1",
                        }, {
                            id: 113,
                            name: "文件2",
                        }, {
                            id: 114,
                            name: "文件3",
                        }, {
                            id: 115,
                            name: "文件4",
                        }, ]
                    }, {
                        id: 12,
                        name: "文件1",
                    }, {
                        id: 13,
                        name: "文件2",
                    }, {
                        id: 14,
                        name: "文件3",
                    }, {
                        id: 15,
                        name: "文件4",
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
            }
        },
        methods: {
            // 单选中文件夹
            clickFolder(i) {
                this.selectKey = i
            },
            // 双击打开文件夹
            dbClickFolder(item) {
                let option = { // 当前打开的文件夹列表
                    datas: item, // 当前文件夹数据
                    // selectKey: "", // 当前单选中的文件id
                    open: false, // 是否打开显示在桌面
                    del: false, // 控制文件夹删除动画 通过与open配合控制三个状态 1.文件夹创建打开动画 2.文件夹小化动画 3.文件夹删除动画
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
                    this.folders[i].style.zIndex = ++this.zIndex
                    this.folders[i].open = true
                } else {
                    // 找到最上层窗口叠加位置
                    let i = this.folders.findIndex(n => n.style.zIndex == this.zIndex)
                    if (i != -1) {
                        option.style.top = this.folders[i].style.top + 50
                        option.style.left = this.folders[i].style.left + 50
                    }
                    // 叠加层级
                    option.style.zIndex = ++this.zIndex
                    this.folders.push(option)
                }
            },
            // 右键菜单
            rightClick() {
                window.event.returnValue = false;
            },
            // 整个桌面系统的单击操作状态清除
            // 增加忽略过滤  传递要忽略的内容为真即可跳过
            clearClick(val) {
                if (!val.desktop) { // 桌面文件夹选中
                    this.selectKey = null
                }
                // 服务列表收起
                // 消息栏收起
            },
            // 回到桌面
            goDock() {
                this.clearClick({})
                this.folders.forEach(n => {
                    n.open = false
                });
            },
        },
        mounted() {
            console.log(this.routes);
        },
        watch: {

        },
        computed: {
            routes() {
                let all = this.$store.getters.permission_routes
                let router = all.find(n => n.name == "ParentView")
                return router.children
            }
        },
        filters: {

        }
    }
</script>

<style>

</style>