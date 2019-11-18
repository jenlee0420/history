<template>
  <div id="app">
    <div id="main_container" :style="{'width':bodytWidth+'px','height':bodyHeight+'px'}">
      <div class="title_bar purpleGradient">
        <span>隋代運河分佈圖 (581-618 年)</span>
        <div id="soundCon"> </div>
      </div>
      <div class="main_box">
        <div id="map_container" :style="{'width':canvasW+'px','height':canvasH+'px'}">
          <div id="canvasInnerDiv">
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action">
              <span>
                    <img src="/static/img/icon/capital_icon.png" class="icon fix_height">首都</span>
            </div>
            <div class="sample blueButton action">
              <span><img src="/static/img/icon/dongdu.png" class="icon fix_height">東都</span>
            </div>
            <div class="sample blueButton action">
              <span>
                      <img src="/static/img/icon/main_city_icon.png" class="icon fix_height">要邑</span>
            </div>
            <div class="sample blueButton action"><span><img src="/static/img/icon/gate_icon.png" class="icon">關口</span></div>
            <div class="sample blueButton action"><span><img src="/static/img/icon/river_icon.png" class="icon">運河</span></div>
            <div class="sample blueButton action"><span><img src="/static/img/icon/redArrow_icon.png" class="icon">航綫 1</span></div>
            <div class="sample blueButton action"><span><img src="/static/img/icon/greenArrow_icon.png" class="icon">航綫 2</span></div>
            <div class="sample blueButton action"><span><img src="/static/img/icon/rice.png" class="icon">糧食儲存</span></div>
            <div class="sample blueButton action googlemap"><span><img src="/static/img/icon/capital_icon.png" class="icon">大興（今西安市）</span></div>
            <div class="sample blueButton action ques"><span><img src="/static/img/icon/question.png" class="icon">問題</span></div>
            <div class="smallMap" style="width: 202px; height: auto; margin: 3px auto; overflow: hidden; visibility: hidden; display: none;">
              <div class="ui-draggable ui-draggable-handle ui-draggable-disabled" style="width: 200px; height: auto; border: 1px solid red; position: relative;"></div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all">全部顯示</div>
              <div class="blueButton action_all">全部隱藏</div>
            </div>
          </div>
          <div id="map_action_container" class="greyContainer" style="margin-bottom: 10px;">
            <div class="zoom_button zoom_out blueButton" style="width: 2.07em; margin: 5px 10px 3px;"><b>-</b></div>
            <div id="slider" class="zoom_button ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" style="width: 50%; height: 0.15em; border-radius: 0.06em;"><span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 0%;"></span></div>
            <div class="zoom_button zoom_in blueButton" style="width: 2.07em; margin: 5px 10px 3px;"><b>+</b></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "App",
    mounted() {
      // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", load, false);
      this.setRemUnit()
    },
    data() {
      return {
        bodytWidth: '',
        bodyHeight: '',
        orienta: '',
        boxscale: 1,
        o: '',
        dpr: 1,
        rem: '',
        canvasH: '',
        canvasW: '',
      }
    },
    methods: {
      setRemUnit() {
        const u_agent = navigator.userAgent
        if (window.orientation === 0 || window.orientation === 180) {
          //竖屏
          console.log('竖屏', this.bodytWidth)
          this.orienta = 1
        } else if (window.orientation === 90 || window.orientation === -90) {
          //横屏
          console.log('横屏', this.bodytWidth)
          this.orienta = 2
        }
        // var that = this
        var selffun = () => {
          this.bodyHeight = window.innerHeight
          this.bodytWidth = window.innerWidth
          console.log(u_agent, this.bodyHeight, this.bodytWidth)
          if (this.bodytWidth > this.bodyHeight) {
            this.boxscale = this.bodyHeight / 1396
            this.o = this.bodyHeight
            var offest = (this.bodytWidth / this.bodyHeight)
            console.log(document.body.clientHeight, this.bodyHeight, offest)
            if (offest < 1.49 && offest > 1) {
              this.boxscale = this.bodytWidth / 2048
              this.o = 1396 * this.boxscale
            }
          } else {
            this.boxscale = this.bodytWidth / 2048
            this.o = this.bodytWidth
            console.log(o)
          }
          var docWidth = 2048 * this.boxscale
          var docHeight = 1396 * this.boxscale
          this.canvasW = Math.ceil(1430 * this.boxscale)
          this.canvasH = Math.ceil(1315 * this.boxscale)
          var s = 10
          // if(o<800){ s =13}
          if (/Android/.test(u_agent)) {
            this.dpr = 2
          }
          if (this.dpr >= 2) {
            this.dpr = 2
          }
          if (this.dpr >= 2) {
            this.rem = (this.o / this.dpr) / 7.5
            if (this.orienta == 2) {
              this.rem = (this.o / this.dpr) / 5.2
            }
          } else if (this.dpr == 1) {
            this.rem = this.o / s
          }
          // console.log(this.boxscale, o, this.dpr, canvasW, canvasH, this.rem)
          // docEl.style.fontSize = (this.rem) + 'px'
          document.documentElement.style.fontSize = (this.rem) + 'px'
          var can = document.querySelectorAll('canvas')
          for (var i = 0; i < can.length; i++) {
            $(can[i]).css({
              'zoom': this.boxscale
            })
          }
        }
        if ("onorientationchange" in window) {
          setTimeout(() => {
            selffun()
          }, 100);
        } else {
          selffun()
        }
      }
    }
  };
</script>

<style>
  #app {
  }
</style>
