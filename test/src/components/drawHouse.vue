<template>
  <div class="House" ref="House">
  
  </div>
</template>

<script>
import DrawHouse from "../modules/drawHouse";
import data from "../data/house__1"
export default {
  name: 'HelloWorld',
  data () {
    return {
      drawHouse: null,
      data: data
    }
  },
  mounted(){
    const el = this.$refs.House;
    this.drawHouse = new DrawHouse(el, 0, 50, () => {
      
    });
    this.drawHouse.init(this.data.house);
    this.drawHouse.createFloor();
    this.drawHouse.createCabient(this.data.cabient);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .House{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 50px;
  }
</style>
