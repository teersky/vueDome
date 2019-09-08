<template>
    <div ref="drawRobote" class="drawRobote"></div> 
</template>
<script>
import DrawRobote from "../modules/drawRobote"
import data from "../data/house__1"
export default {
    data(){
        return {
            drawRobote: null
        }
    },
    mounted(){
        let el = this.$refs.drawRobote;
        let l = el.offsetLeft;
        let t = el.offsetTop;
        console.log(l, t);
        this.drawRobote = new DrawRobote(el, l, t, () => {

        });
        this.drawRobote.init();
    }
}
</script>
<style scoped>
    .drawRobote{
        width: 300px;
        height: 240px;
        position: fixed;
        right: 0;
        bottom: 0;
    }
</style>