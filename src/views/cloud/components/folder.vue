<template>
    <div v-if="onOff" :class="open?'input':'out'" @mousedown="addZindex" class="folder box" :style="'top:'+styles.top+'px;left:'+styles.left+'px;height:'+styles.height+'px;width:'+styles.width+'px;z-index:'+styles.zIndex">
        <div class="top flex pl5 pt5 pr5 pb5 l-l-l">
            <div class="tool px30 pl5 pr10 flex l-l">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconwenjianjia"></use>
                </svg>
                <div class="flex -l- mr10 px26">
                    <div class="pl20 pr15 left" @click="goBack" :class="btn[0]?'':'mouse-no'">
                        <i class="el-icon-back"></i>
                    </div>
                    <div class="center"></div>
                    <div class="pl15 pr20 right" @click="goIng" :class="btn[1]?'':'mouse-no'">
                        <i class="el-icon-right"></i>
                    </div>
                </div>
            </div>
            <div @mousedown="moveFolder" class="oto pl10 px18">{{obj.sourceName}}</div>
            <div class="px24 flex -l-">
                <i class="el-icon-minus mr5" @click="close"></i>
                <i class="el-icon-copy-document mr5 px20" @click="big"></i>
                <i class="el-icon-close" @click="del"></i>
            </div>
        </div>


        <div class="main flex l-l pl5 pr5 pb5">
            <div class="pt10 pr10">
                <div v-for="item in filesType" :key="item.dictCode" class="pl10 pt10 pb10 oto mb10" :class="{select:selectTypeClass==item.dictValue}" @click="selectTypeClass==item.dictValue?selectTypeClass=-1:selectTypeClass=item.dictValue">
                    {{item.dictLabel}}
                </div>
            </div>
            <div @contextmenu="tableRightClick">
                <el-table :data="obj.children" @row-dblclick="dbClickRow" @row-contextmenu="itemRightClick" stripe border highlight-current-row style="width: 100%" max-height="100%" height="100%">
                    <el-table-column show-overflow-tooltip prop="fileType" label="文件类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fileType==0">文件夹</span>
                            <span v-else>{{scope.row.fileSuffix}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="sourceName" label="文件名">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="createTime" label="创建日期">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="fileSize" label="大小">
                    </el-table-column>
                </el-table>
            </div>
        </div>


        <div class="moveR" @mousedown="mouseDownWidth = true"></div>
        <div class="moveB" @mousedown="mouseDownHeight = true"></div>
        <div class="moveA" @mousedown="mouseDownWidth = true;mouseDownHeight = true">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icondiaozhengdaxiaoresize5"></use>
            </svg>
        </div>
    </div>
</template>

<script>
    import { getFilesByParentId } from '@/api/center/cloud'
    export default {
        name: 'folder',
        props: {
            obj: Object,
            styles: Object,
            open: Boolean,
            delFlag: Boolean,
            filesType: Array,
        },
        components: {},
        data() {
            return {
                mouseDownMove: false, // 移动标识开关
                mouseDownWidth: false, // 宽度标识开关
                mouseDownHeight: false, // 高度标识开关
                mouseX: 0, // 鼠标x位置
                mouseY: 0, // 鼠标y位置
                tableData: [],
                selectTypeClass: "-1", // 选中的分类
                oldData: {}, // 旧样式数据 全屏恢复用
                historyArr: [], // 用于存储对文件夹的操作记录
                onOff: true, // 文件夹的摧毁开关，在查不到数据的时候触发
            }
        },
        methods: {
            /**
             * 用于文件夹初始化刷新数据
             */
            async initData() {
                console.log("文件夹刷新");
                // 0.文件夹摧毁不必刷新
                if (this.onOff == false || this.delFlag == false) {
                    return
                }
                // 1.历史刷新
                for (const key in this.historyArr) {
                    if (Object.hasOwnProperty.call(this.historyArr, key)&&this.historyArr[key].id) {
                        await getFilesByParentId(this.historyArr[key].id).then(res => {
                            if (!res.data || res.data.length == 0) {
                                this.historyArr[key] = null
                            }else{
                                this.historyArr[key] = res.data[0];
                            }
                        })
                    }
                }
                // 2.过滤空
                let num = this.historyArr.findIndex(n => n == null)
                if (num != -1) {
                    this.historyArr.splice(num, this.historyArr.length - num)
                }
                // 3.当前重新赋值
                let obj = this.historyArr.find(n => n.id == this.obj.id)
                // console.log(this.historyArr);
                // console.log(obj);
                // console.log(this.obj);
                if (obj) {
                    this.$emit("update:obj", obj)
                } else {
                    if (this.historyArr.length == 0) {
                        // 通过if销毁整个文件夹,不走动画
                        this.onOff = false
                        this.$emit("update:open", false)
                        this.$emit("update:delFlag", false)
                        this.$emit("update:obj", { id: -1 })
                    } else {
                        this.$emit("update:obj", this.historyArr[this.historyArr.length - 1])
                    }
                }
            },
            /**
             * 鼠标点下标题开启移动状态
             */
            moveFolder(e) {
                this.mouseDownMove = true;
                if (this.styles.top == 0 && this.styles.left == 0 && this.styles.width == window.innerWidth && this.styles.height == window.innerHeight) {
                    this.styles.top = 0
                    this.styles.left = e.pageX - this.oldData.width / 2
                    this.styles.width = this.oldData.width
                    this.styles.height = this.oldData.height
                }
            },
            /**
             * 鼠标在文件夹移动的全部操作
             */
            moveMouse(e) {
                // 移动文件夹
                if (this.mouseDownMove) {
                    let x = e.movementX;
                    let y = e.movementY;
                    this.styles.left += x;
                    this.styles.top += y;
                }
                // 改变宽度
                if (this.mouseDownWidth) {
                    this.styles.width = e.pageX - this.styles.left
                    if (this.styles.width < 400) {
                        this.styles.width = 400
                    }
                }
                // 改变高度
                if (this.mouseDownHeight) {
                    this.styles.height = e.pageY - this.styles.top
                    if (this.styles.height < 200) {
                        this.styles.height = 200
                    }
                }
            },
            /**
             * 鼠标离开
             */
            mouseUp() {
                this.mouseDownMove = false;
                this.mouseDownWidth = false;
                this.mouseDownHeight = false;
            },
            /**
             * 单击文件夹增加z-index层级
             */
            addZindex() {
                this.styles.zIndex = ++this.$parent.zIndex
                this.$parent.clearClickFun({})
            },
            /**
             * 小化窗口
             */
            close() {
                this.$emit("update:open", false)
            },
            /**
             * 大化窗口
             */
            big() {
                console.log(1111);
                if (this.styles.top == 0 || this.styles.left == 0 || this.styles.width == window.innerWidth || this.styles.height == window.innerHeight) {
                    this.styles.top = this.oldData.top
                    this.styles.left = this.oldData.left
                    this.styles.width = this.oldData.width
                    this.styles.height = this.oldData.height
                } else {
                    this.oldData = JSON.parse(JSON.stringify(this.styles))
                    this.styles.top = 0
                    this.styles.left = 0
                    this.styles.width = window.innerWidth
                    this.styles.height = window.innerHeight
                }
            },
            /**
             * 删除窗口
             */
            del() {
                this.$emit("update:open", false)
                this.$emit("update:delFlag", false)
            },
            /**
             * 双击文件夹内row操作，
             * 判断类型是否为文件夹或文件，
             * 如果为文件夹进行替换操作，
             * 并且保存操作记录，
             * 便于前进后退操作
             */
            dbClickRow(row, column) {
                let i = this.historyArr.length - 1
                if (i != -1 && this.obj.id == this.historyArr[i].id) {
                    console.log("直接加上去");
                    this.historyArr.push(row)
                } else {
                    console.log("删除后面再加");
                    let j = this.historyArr.findIndex(n => n.id == this.obj.id)
                    this.historyArr.splice(j + 1, i - j)
                    this.historyArr.push(row)
                }
                this.$emit("update:obj", row)
                this.selectTypeClass = -1
            },
            /**
             * 后退操作
             */
            goBack() {
                let i = this.historyArr.findIndex(n => n.id == this.obj.id)
                if (this.btn[0] && i != -1) {
                    console.log("后退");
                    this.$emit("update:obj", this.historyArr[i - 1])
                    this.selectTypeClass = -1
                }
            },
            /**
             * 前进操作
             */
            goIng() {
                let i = this.historyArr.findIndex(n => n.id == this.obj.id)
                if (this.btn[1] && i != -1) {
                    console.log("前进");
                    this.$emit("update:obj", this.historyArr[i + 1])
                    this.selectTypeClass = -1
                }
            },
            /**
             * 文件夹内表格右键
             */
            itemRightClick(row, column, e) {
                this.$parent.rightMenu(e, 'tablesItem', row)
            },
            /**
             * 表格整个右键
             */
            tableRightClick(e) {
                this.$parent.rightMenu(e, 'tables', this.obj)
            },
            /**
             * 文件夹内进行回调刷新
             */
            updata() {
                console.log("文件夹内部刷新");
            }
        },
        mounted() {
            window.addEventListener("mousemove", this.moveMouse);
            window.addEventListener("mouseup", this.mouseUp);
            this.historyArr.push(this.obj)
            console.log(this.historyArr);
        },
        watch: {},
        computed: {
            /**
             * 控制前进后退按钮
             * 返回两个真假值
             */
            btn() {
                let going = false
                let back = false
                let i = this.historyArr.length - 1
                if (i != -1 && this.obj.id != this.historyArr[0].id) {
                    back = true
                }
                if (i != -1 && this.obj.id != this.historyArr[i].id) {
                    going = true
                }
                console.log(back, going);
                return [back, going]
            },
        },
        filters: {},
    }
</script>

<style>

</style>