<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div
      id="main_container"
      :style="{'width':docWidth+'px','height':docHeight+'px','display':load?'none':'block'}"
    >
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>藩鎮割據形勢圖（820 年）</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="noVoice=!noVoice"></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{'width':canvasW+'px','height':canvasH+'px'}"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <div class="detail_div pos_a"></div>
            <div class="detail_div2 pos_a"></div>
            <div class="border_div pos_a"></div>
            <div class="border_div1 pos_a" v-if="borderAni1"></div>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div
            id="action_container"
            class="greyContainer"
            style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;"
          >
            <div class="sample_title">圖例</div>
            <div
              class="sample blueButton action"
              :class="{'clicked':item.show}"
              v-for="(item,index) in list"
              :key="index"
              @click="showCanvas(index)"
            >
              <div class="iconItem">
                <span class="icon">
                  <img :src="item.ico" />
                </span>
                <span>{{item.text}}</span>
              </div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">全部顯示</div>
              <div class="blueButton action_all" @click="showall(false)">全部隱藏</div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />
        </div>
      </div>
    </div>
    <modal
      class
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="popWindow=false;list[5].show=false"
    >
      <div slot="modalCont">
        <div>
          <div class="question question2">
            <div>
              1. 以下哪項
              <font class="underline">不是</font>河北三鎮得以專橫割據的原因？
            </div>
            <div>
              <span
                class="item"
                :class="{'selected':currAns==index}"
                v-for="(item,index) in questionItem"
                :key="index"
                @click="checkans(index)"
              >{{item}}</span>
            </div>
            <div
              class="ansBox"
              :class="showWrong==false?'wrongico':'rightico'"
              v-if="currAns!=null"
            ></div>
          </div>
          <div class="question">
            <div>2. 根據地圖，長安與河北三鎮之間被哪一條河流所分隔？</div>
            <div>
              <span
                class="item"
                :class="{'selected':currAns2==index}"
                v-for="(item,index) in questionItem2"
                :key="index"
                @click="checkans2(index)"
              >{{item}}</span>
            </div>
            <div
              class="ansBox"
              :class="showWrong2==false?'wrongico':'rightico'"
              v-if="currAns2!=null"
            ></div>
          </div>
        </div>
      </div>
    </modal>
    <modal
      class
      headTitle="三鎮駐地"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="mapPop=false;list[3].show=false"
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22031154.692739!2d86.83912781665639!3d38.851975382476375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x358ca930ca4c86d5%3A0x60450a22e71efb21!2z5Lit5ZyL5rKz5YyX55yB!5e0!3m2!1szh-TW!2shk!4v1575948751229!5m2!1szh-TW!2shk"
          :width="bodytWidth/1.8"
          :height="bodyHeight/1.8"
          frameborder="0"
          style="border:0;"
          allowfullscreen
        ></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
import zoom from "./js/zoom.js";
import modal from "./components/modal";
import bar from "./components/bar";
// import tools from './js/animate.js';
export default {
  components: {
    modal,
    bar
  },
  name: "App",
  beforeCreate() {},
  created() {
    const that = this;
    that.timer = setInterval(function() {
      console.log(document.readyState);
      if (document.readyState === "complete") {
        that.load = false;
        window.clearInterval(that.timer);
      }
    }, 10);
  },
  mounted() {
    this.createMap();
    if ("onorientationchange" in window) {
      window.addEventListener("orientationchange", this.oriChange, false);
    } else {
      window.addEventListener("resize", this.setRemUnit, false);
    }
    // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
    this.zoomObj = require("./js/zoom.js");
    this.setRemUnit();
    this.initCanvas();

    document
      .getElementById("map_container")
      .addEventListener("touchmove", this.bodyScroll, {
        passive: false //  禁止 passive 效果
      });
  },
  data() {
    return {
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: [
        "A. 地理上與中央隔閡",
        "B. 節度使為皇族",
        "C. 掌握地方軍、政及財權"
      ],
      rightans: 1,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 黃河", "B. 長江", "C. 淮河"],
      rightans2: 0,
      showWrong2: 0,
      currAns2: null,
      data: [],
      mapPop: false,
      list: [
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "首都",
          show: false
        },
        {
          ico: require("../static/img/icon/control_city_icon.png"),
          text: "河北三鎮",
          show: false
        },
        {
          ico: '',
          text: "藩鎮類型",
          show: false
        },
        {
          ico: require("../static/img/icon/border_icon.png"),
          text: "唐的疆界",
          show: false
        },
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "三鎮駐地（今河北省）",
          type: "map",
          show: false
        },
        {
          ico: require("../static/img/icon/control_city_icon.png"),
          text: "三鎮駐地",
          show: false
        },
        {
          ico: require("../static/img/icon/question_icon.png"),
          text: "問題",
          type: "question",
          show: false
        }
      ],
      bodytWidth: "",
      bodyHeight: "",
      baseWidth: "1430",
      baseHeight: "1315",
      orienta: "",
      boxscale: 1,
      o: "",
      dpr: 1,
      rem: "",
      canvasH: "",
      canvasW: "",
      docWidth: "",
      docHeight: "",
      horseObject1: {},
      horseObject2: {},
      horseObject3: {},
      horseObject4: {},
      horseObject5: {},
      scaleindex: 0,
      ele: null,
      popWindow: false,
      canvasData: [
        "myCanvasStatic1",
        "myCanvasStatic2",
        false,
        "myCanvasStatic4",
        "myCanvasStatic5",
        false
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      license: null,
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      drawHorsesTimeout2: null,
      redTimer: {
        timer:null,
        animate:false
      },
      shipPlay: false,
      titleH: 70,
      prevorienta: "",
      borderAni: false,
      borderAni1: false,
      pathObject: {},
      chenTimer: null,
      lin2timer: null,
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {}
    };
  },
  watch: {
    zoomObj: {
      handler(n, o) {
        this.scaleindex =
          ((n.scale - n.minScale) / (n.maxScale - n.minScale)) * 10;
        this.debug = n.scale + "---" + n.maxScale + "--" + this.scaleindex;
      },
      deep: true
    }
  },
  methods: {
    bodyScroll(event) {
      event.preventDefault();
    },
    setScale(scaleindex) {
      this.zoomObj.preSetScale(
        (scaleindex / 10) * (this.zoomObj.maxScale - this.zoomObj.minScale) +
          this.zoomObj.minScale,
        0,
        0
      );
      this.zoomObj.setTransform(false);
    },
    muteMe() {
      this.m01.pause();
      this.m02.pause();
      this.m03.pause();
      this.m04.pause();
      this.license.pause();
    },
    showCanvas(index) {
      let c = this.canvasObj[this.canvasData[index]];
      let swip = !this.list[index].show;
      this.muteMe();
      switch (index) {
        case 0:
          if (swip && !this.noVoice) {
            this.m01.currentTime = 0;
            this.m01.play();
          }
          this.showCityAni(c, swip);
          break;
        case 1:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          this.drawHousePromise(swip);
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 2:
          if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
          }
          this.drawColorArea(swip)
          break;
        case 3:
          this.borderAni1 = swip;
          break;

        case 5:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
          }

          break;
        case 4:
          this.mapPop = swip;
          break;
        case 6:
          this.popWindow = swip;
          this.currAns = null;
          this.currAns2 = null;
          break;
        default:
          break;
      }
      this.list[index].show = swip;
    },
    oriChange() {
      setTimeout(() => {
        this.setRemUnit();
      }, 100);
    },
    setRemUnit() {
      const u_agent = navigator.userAgent;
      if (window.orientation === 0 || window.orientation === 180) {
        //竖屏
        this.orienta = 1;
      } else if (window.orientation === 90 || window.orientation === -90) {
        //横屏
        this.orienta = 2;
      }
      // var that = this
      var selffun = () => {
        this.bodyHeight = window.innerHeight;
        this.bodytWidth = window.innerWidth;
        // console.log(u_agent, this.bodyHeight, this.bodytWidth)
        if (this.bodytWidth > this.bodyHeight) {
          this.boxscale = this.bodyHeight / 1396;
          this.o = this.bodyHeight;
          var offest = this.bodytWidth / this.bodyHeight;
          if (offest < 1.49 && offest > 1) {
            this.boxscale = this.bodytWidth / 2048;
            this.o = 1396 * this.boxscale;
          }
        } else {
          this.boxscale = this.bodytWidth / 2048;
          this.o = this.bodytWidth;
        }
        this.docWidth = 2048 * this.boxscale;
        this.docHeight = 1396 * this.boxscale;
        this.canvasW = Math.ceil(1430 * this.boxscale);
        this.canvasH = Math.ceil(1315 * this.boxscale);
        this.titleH = this.docHeight - this.canvasH;
        var s = 10;
        this.dpr = window.devicePixelRatio || 1;
        if (/iPad|iPhone|Android|Adr/i.test(u_agent)) {
          this.dpr = 2;
        }
        if (this.dpr >= 2) {
          this.dpr = 2;
          this.rem = this.o / this.dpr / 7.5;
          if (this.orienta == 2) {
            this.rem = this.o / this.dpr / 5.2;
          }
        } else {
          this.rem = this.o / 10 / this.dpr;
        }
        console.log(this.boxscale, this.o, this.dpr, this.rem);
        document.documentElement.style.fontSize = this.rem + "px";
      };
      selffun();
      this.setZoom();
    },
    initCanvas() {},
    showCityAni(canvasStatic, bool) {
      if (!bool) {
        clearInterval(canvasStatic.timeout);
        canvasStatic.style.visibility = "hidden";
        canvasStatic.ani = false;
        return;
      }
      if (canvasStatic.ani == true) {
        return;
      }
      let show = false;
      let times = 6;
      canvasStatic.timeout = setInterval(() => {
        if (times == 0) {
          clearInterval(canvasStatic.timeout);
          return;
        }
        canvasStatic.style.visibility = show ? "visible" : "hidden";
        show = !show;
        times -= 1;
      }, 260);
      canvasStatic.ani = true;
    },
    showall(type) {
      this.list.forEach((e, index) => {
        if (!this.list[index].type) {
          if (type) {
            this.list[index].show = false;
          } else {
            this.list[index].show = true;
          }
          this.showCanvas(index);
        }
      });
      this.muteMe();
    },
    resetHorseObject(object) {
      object.currFrame = 0;
      object.position.currPoint = 0;
      object.position.currDur = 1;
      object.animating = false;
      object.animated = false;
      object.times = null;
    },
    createMap() {
      var divTag = this.$refs.canvasInnerDiv;
      let list = [
        { name: "myCanvasStatic1", zindex: 4 },
        { name: "myCanvasStatic2", zindex: 2 },
        { name: "myCanvasStatic4", zindex: 2 },
        { name: "myCanvasStatic5", zindex: 2 },
        { name: "myCanvasAnimGreenPath", zindex: 2 },
        { name: "myCanvasAnimGreenPath2", zindex: 2 },
        { name: "myCanvasAnimHorse", zindex: 6 },
        { name: "city1", zindex: 2 },
        { name: "city2", zindex: 2 },
        { name: "city3", zindex: 2 },
        { name: "city4", zindex: 2 },
      ];
      let obj = this.createCanvas(list, divTag);
      this.canvasObj = obj[0];
      this.contextObj = obj[1];
      /* 音频 */
      this.m01 = document.createElement("audio");
      this.m02 = document.createElement("audio");
      this.m03 = document.createElement("audio");
      this.m04 = document.createElement("audio");
      this.license = document.createElement("audio");
      this.m01.src = require("../static/img/vo/MAP009-1.mp3");
      this.m02.src = require("../static/img/vo/MAP009-2.mp3");
      this.m03.src = require("../static/img/vo/Map009-3_1.mp3");
      this.m04.src = require("../static/img/vo/MAP009-5.mp3");
      this.license.src = require("../static/img/vo/License.mp3");
      // Variable init

      var imageCapital = new Image();
      var imageMapDetail = new Image();
      var imageGate = new Image();
      var imageMainCity = new Image();
      var imageHorse = new Image();
      var fanzhen1 = new Image();
        var fanzhen2 = new Image();
        var fanzhen3 = new Image();
        var fanzhen4 = new Image();
        fanzhen1.src = require("../static/img/fanzhen1.png");
        fanzhen2.src = require("../static/img/fanzhen2.png");
        fanzhen3.src = require("../static/img/fanzhen3.png");
        fanzhen4.src = require("../static/img/fanzhen4.png");

      imageCapital.src = require("../static/img/capital.png");
      imageMainCity.src = require("../static/img/control_city.png");
      imageHorse.src = require("../static/img/horse.png");

      this.insterCanvas(imageCapital, "myCanvasStatic1", false);
      this.insterCanvas(imageMainCity, "myCanvasStatic2", false);
      this.insterCanvas(fanzhen1, "city1", false);
      this.insterCanvas(fanzhen2, "city2", false);
      this.insterCanvas(fanzhen3, "city3", false);
      this.insterCanvas(fanzhen4, "city4", false);

      imageHorse.onload = () => {
        var translate = [[862, 222], [774, 497], [572, 748], [410, 824]];
        var scale = [1, 1, 1, 0];
        var dur = [15, 20, 20, 20];
        var sharpPoint = [0, 0, 0, 2];
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
      };
      // document.getElementById('map_container').append(divTag)
      // divTag.append(divTag)
      this.$nextTick(() => {
        this.setZoom();
      });
    },
    setZoom() {
      if (!document.getElementById("canvasInnerDiv")) {
        return;
      }
      this.zoomObj = new zoom(document.getElementById("canvasInnerDiv"), {
        width: this.baseWidth,
        height: this.baseHeight,
        top: 0,
        left: 0,
        minScale: this.boxscale,
        // maxScale: this.boxscale * 10,
        warpWidth: this.boxscale * this.baseWidth,
        warpHeight: this.boxscale * this.baseHeight
      });
      this.zoomObj.setScale(this.boxscale);
      // this.zoomObj.setTransform(false,0,0)
    },
    insterCanvas(img, contextStatic, bool) {
      console.log(contextStatic,img)
      img.onload = () => {
        this.contextObj[contextStatic].drawImage(
          img,
          0,
          0,
          this.baseWidth,
          this.baseHeight
        );
        this.canvasObj[contextStatic].style.visibility = bool
          ? "visible"
          : "hidden";
      };
    },
    initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 8,
        currFrame: 0,
        width: 369,
        height: 296,
        position: {
          currPoint: 0,
          dur: 1,
          currDur: 1
        },
        division: 1,
        animating: false,
        animated: false,
        timeout: null
      };
      return object;
    },
    canvasClear(canvas) {
      var context = canvas.getContext("2d");
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    },
    checkans(index) {
      this.currAns = index;
      if (this.rightans == index) {
        this.showWrong = true;
      } else {
        this.showWrong = false;
      }
    },
    checkans2(index) {
      this.currAns2 = index;
      if (this.rightans2 == index) {
        this.showWrong2 = true;
      } else {
        this.showWrong2 = false;
      }
    },
    // offestx(x) {
    //   this.zoomObj.preSetScale(this.boxscale * (1 + x), 0, 0)
    //   this.zoomObj.setTransform(false)
    // },
    moveOut(x) {
      this.scaleindex = Math.ceil(x * 10);
    },
    drawArrow(ctx, x, y, radians, color) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(x, y);
      ctx.rotate(radians);
      ctx.moveTo(0, 0);
      ctx.lineTo(6, 20);
      ctx.lineTo(-6, 20);
      ctx.moveTo(6, 20);
      ctx.quadraticCurveTo(0, 15, -6, 20);
      ctx.closePath();
      ctx.restore();
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
};
</script>

<style lang="less">
#app {
  .pos_a {
    position: absolute;
  }
  font-family: Verdana, Arial, sans-serif;
  .mapBackground {
    display: inline-block;
    background: url("../static/img/map.png");
    background-size: cover;
  }
  .detail_div {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url("../static/img/mapDetail.png");
    background-size: cover;
    z-index: 4;
  }
  .detail_div2 {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url("../static/img/mapDetail1.png");
    background-size: cover;
    z-index: 4;
  }
  .border_div {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url("../static/img/border.png");
    background-size: cover;
  }
  .border_div1 {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url("../static/img/border1.png");
    background-size: cover;
  }
  #canvasInnerDiv {
    width: 1432px;
    height: 1317px;
  }
  .iconItem {
    display: flex;
    align-items: center;
    height: 0.52rem;
    line-height: 0;
    .icon {
      padding: 0;
      width: 1.81em;
      height: 1.2em;
      line-height: 1.2em;
      position: relative;
      margin-right: 0.3em;
      margin-left: 0.42em;
      img {
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        // object-fit:contain;
      }
    }
  }
}
.question2 {
  flex-wrap: wrap;
  display: flex;
  // margin-bottom: 0.5em !important;
  .item {
    width: 50% !important;
    margin-bottom: 0.8em !important;
  }
}
</style>
