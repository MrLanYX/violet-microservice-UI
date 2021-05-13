<template>
    <div :class="{input:open}" @mousedown="addZindex" class="folder box" :style="'top:'+styles.top+'px;left:'+styles.left+'px;height:'+styles.height+'px;width:'+styles.width+'px;z-index:'+styles.zIndex">
        <div class="top flex pl5 pt5 pr5 pb5" @mousedown="mouseDownMove = true">
            <div>工具</div>
            <div>文件夹名字</div>
        </div>
        <div class="main flex l-l pl5">
            <div>1</div>
            <div>内容</div>
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
            }
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