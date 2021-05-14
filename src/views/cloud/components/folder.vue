<template>
    <div :class="open?'input':'out'" @mousedown="addZindex" class="folder box" :style="'top:'+styles.top+'px;left:'+styles.left+'px;height:'+styles.height+'px;width:'+styles.width+'px;z-index:'+styles.zIndex">
        <div class="top flex pl5 pt5 pr5 pb5 l-l-l">
            <div>工具</div>
            <div @mousedown="mouseDownMove = true" class="oto">文件夹名字</div>
            <div>
                <i class="el-icon-close" @click="close"></i>
            </div>
        </div>
        <div class="main flex l-l pl10 pr5 pb5">
            <div class="pt10 pr10">
                <div v-for="item in typeClass" :key="item.id" class="pl10 pt10 pb10 oto mb10" :class="{select:selectTypeClass==item.id}" @click="selectTypeClass==item.id?selectTypeClass=-1:selectTypeClass=item.id">
                    {{item.label}}
                </div>
            </div>
            <div>
                <el-table :data="tableData" stripe border highlight-current-row style="width: 100%" max-height="100%" height="100%">
                    <el-table-column show-overflow-tooltip prop="date" label="文件类型">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" label="文件名">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="address" label="上传日期">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="address" label="大小">
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
    export default {
        name: '',
        props: {
            styles: Object,
            open: Boolean,
        },
        components: {

        },
        data() {
            return {
                mouseDownMove: false, // 移动标识开关
                mouseDownWidth: false, // 宽度标识开关
                mouseDownHeight: false, // 高度标识开关
                mouseX: 0, // 鼠标x位置
                mouseY: 0, // 鼠标y位置
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                typeClass: [{ //文件类型分类
                    id: 1,
                    label: "文件夹",
                    value: "folder",
                }, {
                    id: 2,
                    label: "视频",
                    value: "movie",
                }, {
                    id: 3,
                    label: "PNG",
                    value: "png",
                }, {
                    id: 4,
                    label: "JPG",
                    value: "jpg",
                }, {
                    id: 5,
                    label: "PDF",
                    value: "pdf",
                }, ],
                selectTypeClass:-1,// 选中的分类
            }
        },
        methods: {
            // 鼠标移动
            moveMouse(e) {
                if (this.mouseDownMove) {
                    let x = e.movementX;
                    let y = e.movementY;
                    this.styles.left += x;
                    this.styles.top += y;
                }
                if (this.mouseDownWidth) {
                    let x = e.movementX;
                    this.styles.width += x;
                    if (this.styles.width < 400) {
                        this.styles.width = 400
                    }
                }
                if (this.mouseDownHeight) {
                    let y = e.movementY;
                    this.styles.height += y;
                    if (this.styles.height < 200) {
                        this.styles.height = 200
                    }
                }
            },
            // 鼠标离开
            mouseUp() {
                this.mouseDownMove = false;
                this.mouseDownWidth = false;
                this.mouseDownHeight = false;
            },
            // 单击增加z-index层级
            addZindex() {
                this.styles.zIndex = ++this.$parent.zIndex
                this.$parent.clearClick({})
            },
            // 关闭窗口
            close() {
                this.$emit("update:open", false)
            },
        },
        mounted() {
            window.addEventListener("mousemove", this.moveMouse);
            window.addEventListener("mouseup", this.mouseUp);
        },
        watch: {},
        computed: {

        },
        filters: {

        }
    }
</script>

<style>

</style>