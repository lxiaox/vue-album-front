<template>
    <div class="ccordionBox">
        <ul class="allImages">
            <li class="imageBox" 
            :class="{fadeIn:fadeInAble}"
            v-for="(item, index) in newImages" 
            :key="`ccordionKey${index}`" 
            v-show="index<5"
            ref="li"
            >
                <img :src="item.src" alt="">
            </li>
        </ul>
        <a @click="slide('left')" class="prev"></a>
        <a @click="slide('right')" class="next"></a>
    </div>
</template>

<script>
export default {
    name: 'ccordionLayout',
    data () {
        return {
            newImages: [],
            fadeInAble: true
        }
    },
    props: ['images'],
    created () {
        this.newImages = this.images
    },
    mounted () {
        this.$refs.li.forEach(item => {
            item.addEventListener('animationend', ()=>{
                this.fadeInAble = false
            })
        })
    },
    methods: {
        slide (direction) {
            this.fadeInAble = true
            if(direction === 'left') {
                let item = this.newImages.pop()
                this.newImages.unshift(item)
            }
            if(direction === 'right') {
                let item = this.newImages.shift()
                this.newImages.push(item)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.ccordionBox {
    position: relative;
    width: 1140px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    overflow: hidden;
    ul.allImages {
        width: 90%;
        height: 600px;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        li.imageBox {
            width: 180px;
            height: 70%;
            padding: 15px;
            transition: all .3s;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        }
        li:hover {
            width: 422px;
            height: 80%;
            flex-shrink: 0;
        }
    }
    a{
        position: absolute;
        display: inline-block;
        width: 32px;
        height: 32px;
        text-decoration: none;
        opacity: 0.4;
        z-index: 10;
    }
    a.prev {
        left: 0;
        top: 280px;
        background-image: url(../../../static/images/prev.png);
    }
    a.next {
        right: 0;
        top: 290px;
        background-image: url(../../../static/images/next.png);
    }
    a:hover {
        opacity: 0.6;
    }
}
</style>
