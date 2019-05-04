<template>
    <div class="container">
        <!-- 布局切换 -->
        <div class="setLayoutBox">
            <ul class="selectLayout">
                <li class="selectLayoutMenu">
                    MENU
                </li>
                <li @click="layout='square'" :class="{layoutActive: layout==='square'}">All Images</li>
                <li @click="layout=`puzzle${puzzleNumber}`;ifPuzzleItemShow=!ifPuzzleItemShow;"
                    :class="{layoutActive: layout.slice(0,6)==='puzzle'}">
                    Puzzle
                    <Icon :class="{'rotate': ifPuzzleItemShow}" type="ios-arrow-down"/>
                </li>
                <li class="puzzleItem" 
                    :class="{layoutActive: layout===`puzzle${item}`}"
                    v-for="item in 6" 
                    :key="`puzzleKey${item}`" 
                    v-show="ifPuzzleItemShow"
                    @click="puzzleNumber=item;layout=`puzzle${puzzleNumber}`">
                    puzzle{{ item }}
                </li>
                <li @click="layout='waterfall'"  :class="{layoutActive: layout==='waterfall'}">Waterfall</li>
                <li @click="layout='barrel'" :class="{layoutActive: layout==='barrel'}">Barrel</li>
                <li @click="layout='round'" :class="{layoutActive: layout==='round'}">Round</li>
                <li @click="layout='ccordion'" :class="{layoutActive: layout==='ccordion'}">Ccordion</li>
            </ul>
        </div>
        <!-- layout -->
        <!-- puzzle1-5 所以要传layout-->
        <puzzle-layout v-show="layout.slice(0,6)==='puzzle'" :images="[...images]" :layout="layout" :puzzleNumber="puzzleNumber"></puzzle-layout>
        <waterfall-layout v-if="layout==='waterfall'"  :images="[...images]"></waterfall-layout>
        <barrel-layout v-show="layout==='barrel'"   :images="[...images]"></barrel-layout>
        <round-layout v-if="layout==='round'"   :images="[...images]"></round-layout>
        <ccordion-layout v-if="layout==='ccordion'"   :images="[...images]"></ccordion-layout>
        <square-layout v-show="layout==='square'"   :images="images"></square-layout>
    </div>
</template>

<script>
export default {
    name: 'ImageShow',
    data () {
        return {
            layout: 'square',
            puzzleNumber: '3',
            ifPuzzleItemShow: false,
            images: [
                {src:'static/images/0.jpg'},
                {src:'static/images/1.jpg'},
                {src:'static/images/2.jpg'},
                {src:'static/images/3.jpg'},
                {src:'static/images/4.jpg'},
                {src:'static/images/5.jpg'},
                {src:'static/images/6.jpg'},
                {src:'static/images/7.jpg'},
                {src:'static/images/8.jpg'},
                {src:'static/images/9.jpg'},
                {src:'static/images/10.jpg'},
                {src:'static/images/11.jpg'},
                {src:'static/images/12.jpg'},
                {src:'static/images/13.jpg'},
                {src:'static/images/14.jpg'},
                {src:'static/images/15.jpg'},
                {src:'static/images/16.jpg'},
            ]
        }
    },
    created () {
        this.getStorageImages()
    },
    methods: {
        getStorageImages () {
            let imgFiles = JSON.parse(localStorage.getItem("imgFiles"))
            if (imgFiles) {
                this.localImages = imgFiles
                const _that = this
                this.localImages.forEach(item => {
                    _that.images.unshift(item)
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    margin: 50px auto 0;
    position: relative;
    .setLayoutBox {
        transform: translateX(-99%);
        transition: transform .3s;
        position: fixed;
        top: 110px;
        left: 1px;
        z-index: 11;
        box-shadow: 0 5px 15px rgba(0,0,0,0.55);
        background: #fff;
        ul.selectLayout {
            border-top: 1px solid #ccc;
            li{
                border: 1px solid #ccc;
                padding: 14px 60px 14px 40px;
                border-top: 0;
                cursor: pointer;
                font-size: 14px;
                transition: all 1s;
                .ivu-icon-ios-arrow-down.rotate {
                    transform: rotateZ(180deg);
                }
            }
            li:hover, li.layoutActive {
                color: #E6686A;
            }
            li.puzzleItem {
                padding: 10px 10px 10px 50px;
            }
            .selectLayoutMenu {
                font-size: 16px;
                font-weight: 700;
                padding-left: 25px;
                cursor: auto;
            }
            .selectLayoutMenu:hover {
                color: inherit;
            }
        }
    }
    .setLayoutBox:hover {
        transform: translateX(-1%);
    }
}
</style>