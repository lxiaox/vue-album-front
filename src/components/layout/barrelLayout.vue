<template>
    <div class="barrelBox fadeIn">
        <img :src="item.src" alt="" v-for="(item, index) in images" :key="`barrelImage${index}`">
    </div>
</template>

<script>
export default {
    name: 'barrelLayout',
    data () {
        return {
            
        }
    },
    props: ['images'],
}
</script>

<style lang="less" scoped>
.barrelBox{
    margin-top: 50px;
    width: 1140px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    img{
        width: auto;
        height: 270px;
        padding: 15px;
        flex-grow: 1;
        object-fit: cover;
        object-position: center;
    }
}
.barrelBox::after{
    display: block;
    content: '';
    flex-grow: 9999;
}
</style>