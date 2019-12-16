<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;"><img :src="require('../static/img/loading.gif')"></div>
    <div  id="main_container" :style="{'width':docWidth+'px','height':docHeight+'px','display':load?'none':'block'}">
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>安史之亂初期形勢圖（755 — 756 年）</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="noVoice=!noVoice"> </div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{'width':canvasW+'px','height':canvasH+'px'}">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <div class="detail_div pos_a map"></div>
            <div class="border_div pos_a map"></div>
            <div class="map1_div pos_a map" v-if="map1"></div>
            <div class="map2_div pos_a map" v-if="map2"></div>
            <div class="map3_div pos_a map" v-if="map3"></div>
            <div class="map4_div pos_a map" v-if="map3"></div>
            <div class="map5_div pos_a map" v-if="map3"></div>
            <div class="map6_div pos_a map" v-if="map3"></div>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{'clicked':item.show}" v-for="(item,index) in list" :key="index" @click="showCanvas(index)">
              <div class="iconItem">
                 <span class="icon"><img :src="item.ico"></span>
                 <span>{{item.text}}</span>
                 </div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">全部顯示</div>
              <div class="blueButton action_all " @click="showall(false)">全部隱藏</div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />
        </div>
      </div>
    </div>
    <modal class="" headTitle="问题" :hideFooter="true" v-if="popWindow" @cancel-event="popWindow=false;list[5].show=false">
      <div slot="modalCont">
        <div>
          <div class="question">
          <div>1. 安史之亂的主要戰役均在________流域爆發？</div>
          <div>
            <span class="item" :class="{'selected':currAns==index}" v-for="(item,index) in questionItem" :key="index" @click="checkans(index)">{{item}}</span>
          </div>
          <div class="ansBox" :class="showWrong==false?'wrongico':'rightico'" v-if="currAns!=null"></div>
        </div>
        <div class="question">
          <div>2. 根據地圖所示，太子李亨逃到哪地之後，便與唐玄宗分途出走？</div>
          <div>
            <span class="item" :class="{'selected':currAns2==index}" v-for="(item,index) in questionItem2" :key="index" @click="checkans2(index)">{{item}}</span>
          </div>
          <div class="ansBox" :class="showWrong2==false?'wrongico':'rightico'" v-if="currAns2!=null"></div>
        </div>
        </div>
      </div>
    </modal>
    <modal class=""  headTitle="潼關（今潼關縣）" :hideFooter="true" v-if="mapPop" @cancel-event="mapPop=false;list[4].show=false">
      <div slot="modalCont">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24391698.658870567!2d88.08445695333559!3d39.812602407163745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x367b0b524187602d%3A0x46eb1c4574ba3cab!2z5Lit5ZyL6Zmd6KW_55yB5rit5Y2X5biC5r286Zec57ij!5e0!3m2!1szh-TW!2shk!4v1575949123730!5m2!1szh-TW!2shk"
          :width="bodytWidth/1.8" :height="bodyHeight/1.8" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
import modal from "./components/modal";
import bar from "./components/bar";
// import animate from "./js/animate.js";
import zoom from "./js/zoom.js";
export default {
  components: {
    modal,
    bar
  },
  name: "App",
  beforeCreate() {},
  created () {
    const that = this
    that.timer = setInterval(function () {
        console.log(document.readyState)
        if (document.readyState === 'complete') {
            that.load = false;
            window.clearInterval(that.timer)
        }
    }, 500)
  },
  mounted() {
    this.createMap();
    if ("onorientationchange" in window) {
      window.addEventListener("orientationchange", this.oriChange, false);
    } else {
      window.addEventListener("resize", this.setRemUnit, false);
    }
    // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
    // this.zoomObj = require("./js/zoom.js");
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
      questionItem: ["A. 長江", "B. 淮河", "C. 黃河"],
      rightans: 2,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 靈武", "B. 馬嵬驛", "C. 潼關"],
      rightans2: 1,
      showWrong2: 0,
      currAns2: null,
      data: [],
      mapPop: false,
      imgCount: 0,
      list: [
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "首都",
          show: false
        },
        {
          ico: require("../static/img/icon/gate_icon.png"),
          text: "關口",
          show: false
        },
        {
          ico: require("../static/img/icon/main_city_icon.png"),
          text: "要邑及運河",
          show: false
        },
        {
          ico: require("../static/img/icon/control city_icon.png"),
          text: "安祿山控制的三鎮",
          show: false
        },
        {
          ico: require("../static/img/icon/route_red_icon.png"),
          text: "安史進軍路線",
          show: false
        },
        {
          ico: require("../static/img/icon/route_green_icon.png"),
          text: "唐玄宗逃走路線",
          show: false
        },
        {
          ico: require("../static/img/icon/route_blue_icon.png"),
          text: "太子李亨逃走路線",
          show: false
        },
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "潼關（今潼關縣）",
          type: "map",
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
        'myCanvasStatic1',
        false,
        false,
        "myCanvasStatic2"
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      license: null,
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      drawHorsesTimeout2: null,
      redTimer: null,
      shipPlay: false,
      titleH: 70,
      canvasAnimHorse: null,
      prevorienta: "",
      map1: false,
      map2: false,
      map3:false,
      pathObject: {},
      chenTimer: null,
      lin2timer: null,
      scaleZoom: 0,
      debug: ""
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
      this.m05.pause();
      this.m06.pause();
      this.license.pause();
    },
    showCanvas(index) {
      let c = document.getElementById(this.canvasData[index]);
      let swip = !this.list[index].show;
      this.muteMe();
      switch (index) {
        case 0:
          //首都
          if (swip && !this.noVoice) {
            this.m01.currentTime = 0;
            this.m01.play();
          }
          this.showCityAni(c, swip);
          break;
        case 1:
          //关口
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          this.map1 = swip;
          break;
        case 2:
          //要邑和运河
          // c.style.visibility = swip?'visible':'hidden'
          this.map3=swip
          // this.drawHousePromise(swip)
          // this.showCityAni(c, swip);
          
          break;
        case 3:
          //安祿山控制的三鎮
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
          }
          c.style.visibility = swip?'visible':'hidden'
          // this.grainstoreAni = swip;
          break;
        
        case 4:
          if (swip) {
            if (!this.noVoice) {
              this.m04.currentTime = 0;
              this.m04.play();
              this.license.currentTime = 0;
              this.license.volume = 0.2;
              this.license.play();
            }
            if (this.pathObject.playing != true) {
              this.drawGreenPath(true);
              this.drawHousePromise(true);
            }
          } else {
            this.drawGreenPath(false);
            this.drawHousePromise(false);
            clearTimeout(this.lin2timer);
          }
         break;
        case 4:
          this.mapPop = swip;
          break;
        case 5:
          this.popWindow = swip;
          this.currAns = null;
          this.currAns2 = null;
          break;
        default:
          break;
      }
      this.list[index].show = swip;
      this.conflict()
    },
    conflict(){
      let swip1 = this.list[1].show
      let swip3 = this.list[3].show
      document.getElementById('myCanvasStatic4').style.visibility = swip1?'visible':'hidden';
      if(this.list[2].show){
        document.getElementById('myCanvasStatic4').style.visibility = 'visible'
      }
      if(swip3){
        document.getElementById('myCanvasStatic4').style.visibility = 'visible'
      }
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
    
    showall(type) {
      this.canvasData.forEach((e, index) => {
        if (type) {
          this.list[index].show = false;
        } else {
          this.list[index].show = true;
        }
        this.showCanvas(index);
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
      var canvasStatic1 = document.createElement("canvas");
      var canvasStatic2 = document.createElement("canvas");
      var canvasStatic4 = document.createElement("canvas");
      var canvasStatic5 = document.createElement("canvas");
      var canvasAnimGreenPath = document.createElement("canvas");
      var canvasAnimGreenPath2 = document.createElement("canvas");
      var canvasAnimBluePath = document.createElement("canvas");
      var canvasAnimHorse = document.createElement("canvas");
      var contextStatic1 = canvasStatic1.getContext("2d");
      var contextStatic2 = canvasStatic2.getContext("2d");
      var contextStatic4 = canvasStatic4.getContext("2d");
      var contextStatic5 = canvasStatic5.getContext("2d");
      var contextAnimGreenPath = canvasAnimGreenPath.getContext("2d");
      var contextAnimGreenPath2 = canvasAnimGreenPath2.getContext("2d");
      var contextAnimHorse = canvasAnimHorse.getContext("2d");
      /* 音频 */
      this.m01 = document.createElement("audio");
      this.m02 = document.createElement("audio");
      this.m03 = document.createElement("audio");
      this.m04 = document.createElement("audio");
      this.m05 = document.createElement("audio");
      this.m06 = document.createElement("audio");
      this.license = document.createElement("audio");
      this.m01.src = require("../static/img/vo/MAP007-1.mp3");
      this.m02.src = require("../static/img/vo/MAP007-2.mp3");
      this.m03.src = require("../static/img/vo/MAP007-4.mp3");
      this.m04.src = require("../static/img/vo/MAP007-5.mp3");
      this.m05.src = require("../static/img/vo/MAP007-6.mp3");
      this.m06.src = require("../static/img/vo/MAP007-7.mp3");

      // Variable init
      divTag.appendChild(canvasStatic1);
      divTag.appendChild(canvasStatic2);
      divTag.appendChild(canvasStatic4);
      // divTag.appendChild(canvasStatic5);
      // divTag.appendChild(canvasAnimGreenPath2);
      divTag.appendChild(canvasAnimGreenPath);
      divTag.appendChild(canvasAnimHorse);
      canvasStatic1.id = "myCanvasStatic1";
      canvasStatic2.id = "myCanvasStatic2";
      canvasStatic4.id = "myCanvasStatic4";
      canvasStatic5.id = "myCanvasStatic5";
      canvasAnimGreenPath.id = "myCanvasAnimGreenPath";
      canvasAnimGreenPath2.id = "myCanvasAnimGreenPath2";
      canvasAnimHorse.id = "myCanvasAnimHorse";
      canvasStatic1.style.position = "absolute";
      canvasStatic2.style.position = "absolute";
      canvasStatic4.style.position = "absolute";
      canvasStatic5.style.position = "absolute";
      canvasAnimGreenPath.style.position = "absolute";
      canvasAnimGreenPath2.style.position = "absolute";
      canvasAnimHorse.style.position = "absolute";
      canvasStatic1.style.zIndex = "4";
      canvasStatic2.style.zIndex = "2";
      canvasStatic4.style.zIndex = "4";
      canvasStatic5.style.zIndex = "2";
      canvasAnimGreenPath.style.zIndex = "2";
      canvasAnimGreenPath2.style.zIndex = "2";
      canvasAnimHorse.style.zIndex = "6";
      canvasAnimGreenPath.width = this.baseWidth;
      canvasAnimGreenPath.height = this.baseHeight;
      canvasAnimGreenPath2.width = this.baseWidth;
      canvasAnimGreenPath2.height = this.baseHeight;
      canvasAnimHorse.width = this.baseWidth;
      canvasAnimHorse.height = this.baseHeight;

      var controlCity = new Image();
      var controlCity2 = new Image();
      var imageGate = new Image();
      var imageMainCity = new Image();
      var imageHorse = new Image();
      var route1 = new Image();
      var route2 = new Image();
      var route3 = new Image();
      var route4 = new Image();
      var route5 = new Image();
      // imageMap.src = require("../static/img/map.png");
      // imageMapDetail.src = require("../static/img/mapDetail.png");
      controlCity.src = require("../static/img/control_city.png");
      controlCity2.src = require("../static/img/control_city_f.png");
      imageMainCity.src = require("../static/img/capital.png");
      imageHorse.src = require("../static/img/horse.png");
      // imageGate.src = require("../static/img/gate.png");
      route1.src = require("../static/img/route1a_red.png");
      route2.src = require("../static/img/route1b_red.png");
      route3.src = require("../static/img/route2a_green.png");
      route4.src = require("../static/img/route2b_green.png");

      //画圈
      this.drwaCircle(canvasStatic2)
      controlCity.onload = () => {
        contextStatic2.drawImage(
          controlCity,
          0,
          0,
          this.baseWidth,
          this.baseHeight
        );
        // canvasStatic2.style.visibility = "hidden";
      };
      controlCity2.onload = () => {
        contextStatic2.drawImage(
          controlCity2,
          0,
          0,
          this.baseWidth,
          this.baseHeight
        );
      };
      
      imageMainCity.onload = () => {
        canvasStatic1.width = this.baseWidth;
        canvasStatic1.height = this.baseHeight;
        contextStatic1.drawImage(imageMainCity, 0, 0, this.baseWidth, this.baseHeight);
        canvasStatic1.style.visibility = 'hidden'
      }
     route1.onload = () => {
        this.imgCount++;
        this.pathObject = {
          source: route1,
          originX: 0,
          originY: 0,
          width: this.baseWidth,
          height: this.baseHeight,
          mask1: {
            originX: 706,
            originY: 221,
            width: 411,
            height: 1,
            currOriginX: 706,
            currOriginY: 221,
            shiftX: 8,
            shiftY: 0
          },
          timeout: null,
          playing: false
        };
      };
      route2.onload = () => {
        this.pathObject.mask2 = {
          source: route2,
          originX: 699,
            originY: 818,
            width: 1,
            height: 162,
            currOriginX: 699,
            currOriginY: 818,
            shiftX: 8,
            shiftY: 0
        }
        
      };
      imageHorse.onload = () => {
        var translate = [[414, 222], [774, 497], [572, 748],[410,824]];
        var scale = [1, 1, 1,0];
        var dur = [20, 15, 10,10];
        var sharpPoint = [0, 0, 0,2];
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
    initHorseObject(imageHorse) {
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
  }
  .map {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  .map1_div {
    background-image: url("../static/img/gate.png");
  }
  .map2_div {
    background-image: url("../static/img/control_city.png");
  }
  .map3_div {
    background-image: url("../static/img/river.png");
  }
    .map4_div {
    background-image: url("../static/img/main_city.png");
  }
    .map5_div {
    background-image: url("../static/img/main_city1.png");
  }
     .map6_div {
    background-image: url("../static/img/main_city2.png");
  }
       .map7_div {
    background-image: url("../static/img/main_city2.png");
  }
  
   .border_div {
    // background-image: url("../static/img/border.png");
  }

  #canvasInnerDiv {
    width: 1430px;
    height: 1316px;
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
</style>
