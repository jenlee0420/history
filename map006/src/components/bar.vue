<template>
  <div id="map_action_container" class="greyContainer" style="margin-bottom: 10px;">
    <div
      class="blueButton zoom_button"
      style="width: 0.52rem;"
      @click="setScaleBtn('de')"
    >
      <b>-</b>
    </div>
     <!--<div class="bar" ref="sliderBox">
      
      <div class="squ" ref="slider"></div> -->
      <!-- @mousedown="moveStart"
        @mouseup="moveOut"
        @touchstart="moveStart"
      @touchend="moveOut"-->
    <!-- </div> -->
    <VueSlider class="slider"
    min="10"
    max="1000"
    step="10"
    v-model="sliderValue"/>
    <div
      class="blueButton zoom_button"
      style="width: 0.52rem;"
      @click="setScaleBtn('add')"
    >
      <b>+</b>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
export default {
  name: "bar",
  props: ["scaleindex"],
  components:{VueSlider},
  data() {
    return {
      dargStart: false,
      u_agent: "",
      startx: "",
      amountW: "",
      distanceX: 0,
      scaleZoom: 0,
      startArea: false,
      sliderValue:10
    };
  },
  watch: {
    sliderValue(n) {
      this.$emit("offestx", n/100);
      // this.$refs.slider.style.left = n * 10 + "%";
    },
    scaleindex(n){
      this.sliderValue = n * 100
    }
  },
  mounted() {
    
  },
  methods: {

    setScaleBtn(type) {
      this.dargStart = false;
      this.scaleZoom = this.scaleindex;
      if (type == "add") {
        this.scaleZoom += 1;
      } else {
        this.scaleZoom -= 1;
      }
      if (this.scaleZoom > 10) {
        this.scaleZoom = 10;
      }
      if (this.scaleZoom <= 0) {
        this.scaleZoom = 0;
      }
      // console.log(this.scaleZoom,'scaleZoom')
      this.$emit("offestx", this.scaleZoom);
      this.sliderValue = this.scaleZoom*100
      //   this.setScale(this.scaleZoom);
    },
    
  }
};
</script>

<style lang="less">
.bar {
 
  .squbox {
    
  }
  .squ {
    
  }
}
.slider{
  width: 50%!important;
  height: 0.52rem!important;
  display: inherit!important;
  .range-slider-rail{
     width: 100%;
  height: 0.15em;
  border-radius: 0.06em;
  border: 1px solid #aaaaaa;
  background-color: #fff;
  position: relative;
  -webkit-overflow-scrolling: touch;
  }
  .range-slider-fill{
    background-color:transparent;
  }
    .range-slider-knob{
      width: 0.23rem !important;
    height: 0.23rem !important;
    box-shadow:none;
    // top: 0;
    // bottom: 0;
    // margin: auto;
    // margin-left: -0.08em;
    display: inline-block;
    background-color: #e6e6e6;
    border-radius: 0.06em;
    border: 1px solid #d3d3d3;
    position: absolute;
    left: 0%;
    z-index: 1;
    cursor: pointer;
    &:hover {
      border: 1px solid #999;
      background-color: #dadada;
    }
    }
  }
</style>
