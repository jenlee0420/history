<template>
  <div id="map_action_container" class="greyContainer" style="margin-bottom: 10px;">
    <div
      class="blueButton zoom_button"
      style="width: 2.07em; margin: 5px 10px 3px;"
      @click="setScaleBtn('de')"
    >
      <b>-</b>
    </div>
    <div class="bar" ref="sliderBox">
      <div class="squ" ref="slider"></div>
      <!-- @mousedown="moveStart"
        @mouseup="moveOut"
        @touchstart="moveStart"
      @touchend="moveOut"-->
    </div>
    <div
      class="blueButton zoom_button"
      style="width: 2.07em; margin: 5px 10px 3px;"
      @click="setScaleBtn('add')"
    >
      <b>+</b>
    </div>
  </div>
</template>

<script>
export default {
  name: "bar",
  props: ["scaleindex"],
  data() {
    return {
      dargStart: false,
      u_agent: "",
      startx: "",
      amountW: "",
      distanceX: 0,
      scaleZoom: 0,
      startArea: false
    };
  },
  watch: {
    scaleindex(n) {
      this.$refs.slider.style.left = n * 10 + "%";
    }
  },
  mounted() {
    this.u_agent = navigator.userAgent;
    // this.amountW =this.$refs.sliderBox.clientWidth - this.$refs.slider.clientWidth;
    let slider = this.$refs.slider;
    let box = this.$refs.sliderBox;
    if ("ontouchmove" in window) {
      slider.addEventListener("touchstart", this.moveStart);
      slider.addEventListener("touchend", this.moveOut);
      document.getElementById("app").addEventListener("touchstart", this.appTouchStart);
    } else {
      slider.addEventListener("mousedown", this.moveStart, false);
      slider.addEventListener("mouseup", this.moveOut);
    }
  },
  methods: {
    appTouchStart(e) {
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
      //   this.setScale(this.scaleZoom);
    },
    setLoacl(e) {
      this.dargStart = true;
      this.move(e);
      this.dargStart = false;
    },
    moveStart(e) {
      e.preventDefault();
      let slider = this.$refs.slider;
      this.dargStart = true;
      // alert('d')
      if (/iPad|iPhone|Android|Adr/i.test(this.u_agent)) {
        var ev = e || window.event;
        var touch = ev.targetTouches[0];
        this.startx = touch.clientX - slider.offsetLeft;
      }

      let box = document.getElementById("app");
      let timer = null;
      if ("ontouchmove" in window) {
        box.addEventListener("touchmove", e => {
          this.move(e);
        });
        box.addEventListener("touchend", e => {
          this.startArea = false;
          this.moveOut(e);
        });
      }else{
        box.addEventListener("mouseout", e => {
          timer = null;
          timer = setTimeout(() => {
            this.moveOut();
          }, 200);
        });
        box.addEventListener("mousemove", e => {
          this.move(e);
        });
        box.addEventListener("mouseoup", e => {
          this.moveOut(e);
        });
      }
      
      
    },
    move(e) {
      if (this.dargStart) {
        let box = this.$refs.sliderBox;
        let slider = this.$refs.slider;
        this.distanceX = e.clientX - box.offsetLeft;

        if (/iPad|iPhone|Android|Adr/i.test(this.u_agent)) {
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
  width: 50%;
  height: 0.15em;
  border-radius: 0.06em;
  border: 1px solid #aaaaaa;
  background-color: #fff;
  position: relative;
  // -webkit-overflow-scrolling: touch;
  .squbox {
    width: 0.3rem !important;
    height: 0.3rem !important;
    background-color: rgba(200, 200, 200, 0.3);
    position: absolute;
    top: -52%;
    left: 0%;
  }
  .squ {
    width: 0.2rem !important;
    height: 0.2rem !important;
    top: 0;
    bottom: 0;
    margin: auto;
    margin-left: -0.08em;
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
