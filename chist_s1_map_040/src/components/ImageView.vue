<template>
    <div class="pos_a map"  :style="{'z-index':zindex}">
        <img :src="require(`../../static/img/${this.imgsrc}`)" alt="" @load="load" v-show="imgStatic">
    </div>
</template>
<script>
export default {
  name: "imageview",
  props: [
      "imgsrc",
      "static",
      "zindex"
  ],
  mounted(){

  },
  computed:{
      imgStatic:function(){
          return this.static && this.imgReady
      }
  },
  data() {
      return{
          imgObj:null,
          imgReady:false
      }
  },
   methods: {
       load(){
           this.imgReady= true
           this.$emit('update')
       }
   }
}
</script>
<style lang="less">
.map img{
    width: 100%;
    height: 100%;
}
</style>