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
    this.u_agent = navigator.userAgent;
    // this.amountW =this.$refs.sliderBox.clientWidth - this.$refs.slider.clientWidth;
    let slider = this.$refs.slider;
    let box = this.$refs.sliderBox;
    // if ("ontouchmove" in window) {
    //   slider.addEventListener("touchstart", this.moveStart);
    //   slider.addEventListener("touchend", this.moveOut);
    //   document.getElementById("app").addEventListener("touchstart", this.appTouchStart);
    // } else {
    //   slider.addEventListener("mousedown", this.moveStart, false);
    //   slider.addEventListener("mouseup", this.moveOut);
    // }
  },
  methods: {
    appTouchStart(e) {
      let slider = this.$refs.slider;
      let box = this.$refs.sliderBox;
      var touch = e.targetTouches[0];
      this.startArea = false;

      if (Math.abs(touch.clientX - (box.offsetLeft + slider.offsetLeft)) < 10) {
        this.startArea = true;
      }
      if (Math.abs(box.offsetLeft + slider.offsetLeft - touch.clientX) < 10) {
        this.startArea = true;
      }
      if (this.startArea) {
        // console.log('eer',touch.clientX,(box.offsetLeft+slider.offsetLeft))
        this.dargStart = true;
      }
    },
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
    setLoacl(e) {
      this.dargStart = true;
      this.move(e);
      this.dargStart = false;
    },
    moveStart(e) {
      let slider = this.$refs.slider;
      this.dargStart = true;
      // alert('d')
      if (/iPad|iPhone|Macintosh|Android|Adr/i.test(this.u_agent)) {
        var ev = e || window.event;
        var touch = ev.targetTouches[0];
        this.startx = touch.clientX - slider.offsetLeft;
      }

      let appbox = document.getElementById("app");
      let timer = null;
      if ("ontouchmove" in window) {
        appbox.addEventListener("touchmove", e => {
          this.move(e);
        });
        appbox.addEventListener("touchend", e => {
          this.startArea = false;
          this.moveOut(e);
        });
      }else{
        appbox.addEventListener("mouseout", e => {
          timer = null;
          timer = setTimeout(() => {
            this.moveOut();
          }, 200);
        });
        appbox.addEventListener("mousemove", e => {
          this.move(e);
        });
        appbox.addEventListener("mouseoup", e => {
          this.moveOut(e);
        });
      }
      
      
    },
    move(e) {
      if (this.dargStart) {
        e.preventDefault();
        let box = this.$refs.sliderBox;
        let slider = this.$refs.slider;
        this.distanceX = e.clientX - box.offsetLeft;

        if (/iPad|iPhone|Macintosh|Android|Adr/i.test(this.u_agent)) {
          this.distanceX = e.targetTouches[0].clientX - this.startx;
          // this.distanceX= e.targetTouches[0].clientX - box.offsetLeft
        }
        if (
          /Firefox/.test(this.u_agent) ||
          (this.u_agent.indexOf("Trident") > -1 &&
            this.u_agent.indexOf("rv:11") > -1)
        ) {
          this.distanceX = e.pageX - box.offsetLeft;
        }

        // 滑动距离小于0 或者大于滑竿的宽度，return掉
        // console.log(this.amountW,'maxw')
        // if (distanceX < 0 || distanceX > this.amountW) {
        //     return;
        // }

        if (this.distanceX >= box.clientWidth - slider.clientWidth / 2) {
          this.distanceX = box.clientWidth - slider.clientWidth / 2;
        }
        if (this.distanceX <= 0) {
          this.distanceX = 0;
        }
        // slider.style.transformOrigin = 'left';
        slider.style.left = this.distanceX + "px";
        // console.log(box.clientWidth-slider.clientWidth)
        this.$emit("offestx", (this.distanceX / box.clientWidth) * 10);
      }
    },
    moveOut() {
      document.body.removeEventListener("mousemove", e => {
        this.move(e);
      });
      document.body.removeEventListener("touchmove", e => {
        this.move(e);
      });
      this.dargStart = false;
      // let box = this.$refs.sliderBox
      // this.$emit('moveOut',this.distanceX/box.clientWidth)
    }
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
  width: 50%;
  height: 0.52rem;
  display: inherit;
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
