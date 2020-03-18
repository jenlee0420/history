<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load"
      id="main_container"
      :style="{
        width: docWidth + 'px',
        height: docHeight + 'px',
        display: load ? 'none' : 'block'
      }"
    >
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>唐代後期對外形勢圖 (820 年)</span>
        <div
          id="soundCon"
          :class="{ mute: noVoice }"
           @click="setVoice"
        ></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'capital.png'" :static="control.maincity.show" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'border.png'" :static="control.border" :zindex="5" @update="updateImg"></imageview>
            <imageview :imgsrc="'huihe1.png'" :static="control.huihe" :zindex="4" @update="updateImg"></imageview>
            <imageview :imgsrc="'nanzhao.png'" :static="control.nanzhao" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'tubo1.png'" :static="control.tubo" :zindex="3" @update="updateImg"></imageview>

            <!-- <div class="map9_div pos_a map" v-if="map6"></div> -->
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
              :class="{ clicked: item.show }"
              v-for="(item, index) in list"
              :key="index"
              @click="showCanvas(index)"
            >
              <div class="iconItem">
                <span class="icon"><img :src="item.ico"/></span>
                <span>{{ item.text }}</span>
              </div>
            </div>
          </div>
          <div class="greyContainer">
            <div
              style="display: flex; width: 100%; justify-content: space-between;"
            >
              <div class="blueButton action_all" @click="showall(true)">
                全部顯示
              </div>
              <div class="blueButton action_all " @click="showall(false)">
                全部隱藏
              </div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar
            @offestx="setScale"
            @moveOut="moveOut"
            :scaleindex.sync="scaleindex"
          />
        </div>
      </div>
    </div>
    <modal
      class=""
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="
        popWindow = false;
        list[6].show = false;
      "
    >
      <div slot="modalCont">
        <div>
          <div class="question">
            <div>1. 哪一個邊族的勢力範圍最接近長安？</div>
            <div>
              <span
                class="item"
                :class="{ selected: currAns == index }"
                v-for="(item, index) in questionItem"
                :key="index"
                @click="checkans(index)"
                >{{ item }}</span
              >
            </div>
            <div
              class="ansBox"
              :class="showWrong == false ? 'wrongico' : 'rightico'"
              v-if="currAns != null"
            ></div>
          </div>
          <div class="question question2">
            <div>
              2. 以下哪項關於唐代邊族的描述是<font class="underline">不正確</font>的？
            </div>
            <div>
              <span
                class="item"
                :class="{ selected: currAns2 == index }"
                v-for="(item, index) in questionItem2"
                :key="index"
                @click="checkans2(index)"
                >{{ item }}</span
              >
            </div>
            <div
              class="ansBox"
              :class="showWrong2 == false ? 'wrongico' : 'rightico'"
              v-if="currAns2 != null"
            ></div>
          </div>
        </div>
      </div>
    </modal>
    <modal
      class=""
      :headTitle="list[5].text"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="
        mapPop = false;
        list[5].show = false;
      "
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24391698.658870567!2d88.08445695333559!3d39.812602407163745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x367b0b524187602d%3A0x46eb1c4574ba3cab!2z5Lit5ZyL6Zmd6KW_55yB5rit5Y2X5biC5r286Zec57ij!5e0!3m2!1szh-TW!2shk!4v1575949123730!5m2!1szh-TW!2shk"
          :width="bodytWidth / 1.8"
          :height="bodyHeight / 1.8"
          frameborder="0"
          style="border:0;"
          allowfullscreen=""
        ></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
import zoom from "./js/zoom.js";
// import canvasFun from "./js/canvas.js";
import modal from "./components/modal";
import bar from "./components/bar";
import imageview from "./components/ImageView";
export default {
  components: {
    modal,
    bar,
    imageview
  },
  name: "App",
  beforeCreate() {},
  created() {
    const that = this;
    that.timer = setInterval(function() {
      //
      if (document.readyState === "complete" && that.imgCount == that.imgTotal) {
        console.log(document.readyState,that.imgCount)
        that.load = false;
        window.clearInterval(that.timer);
        
      }
    }, 500);
  },
  mounted() {
    // this.testCanvas()
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
      control:{
        maincity:{
          show:false,
          ani:false,
          timer:null
        },
        tobo:false,
        nanzhao:false,
        huihe:false,
        border:false
      },
      Redroadtimer:null,
      load: true,
      noVoice: false,
      zoomObj: null,
      imgCount:0,
      imgTotal:9,
      questionItem: ["A. 南紹", "B. 吐蕃", "C. 回紇"],
      rightans: 1,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 對中原構成威脅", "B. 回紇接連西北邊境", "C. 東部邊族威脅山東"],
      rightans2: 2,
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
          ico: require("../static/img/icon/border1_icon.png"),
          text: "疆界",
          show: false
        },
        {
          ico: require("../static/img/icon/huihe_icon.png"),
          text: "回紇勢力",
          show: false
        },
        {
          ico: require("../static/img/icon/tubo_icon.png"),
          text: "吐蕃勢力",
          show: false
        },
        {
          ico: require("../static/img/icon/nanzhao_icon.png"),
          text: "南紹勢力",
          show: false
        },
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "首都（長安，今西安）",
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
      baseHeight: "1316",
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
      scaleindex: 0,
      ele: null,
      popWindow: false,
      canvasData: [
        false,
        false,
        false,
       false,
        false
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      license: null,
      license1: null,
      license2: null,
      
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      drawHorsesTimeout2: null,
      drawHorsesTimeout3: null,
      drawHorsesTimeout4: null,
      redTimer: null,
      shipPlay: false,
      titleH: 70,
      canvasAnimHorse: null,
      pathObject: {},
      pathObjectGreen: {},
      pathObjectblue: {},
      lin2timer: null,
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {},
      timer2: null,
      blueSwitch:true,
      point1timer:null,
      point2timer:null
      // blueSwitch:true
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
    },
    imgCount(){
      // if(this.imgCount == this.imgTotal){
      //   this.load = false;
      //   this.Redroadtimer = setInterval(() => {
      //     // console.log(this.pathObject.animated)
      //     if(this.pathObjectblue.animated == true){
      //       this.load = false;
      //       this.drawbluePath(false)
      //       window.clearInterval(this.Redroadtimer);
      //     }
      //   }, 500);
      //   // this.drawHousePromise(true)
      //   // this.drawbluePath(true)
      // }
    }
  },
  methods: {
    updateImg(){
      this.imgCount ++ 
    },
    setVoice(){
      this.noVoice = !this.noVoice
      this.muteMe()
    },
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
      this.license2.pause();
      this.license1.pause();
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
          this.sharpCity(this.control.maincity, swip);
          break;
        case 1:
          //疆界
         this.control.border=swip
         if(swip){
          this.point1timer = setTimeout(()=>{
              this.dustAni(true)
                this.point2timer = setTimeout(()=>{
                  this.dustAni(false)
                },10000)
          },1000)
         }else{
           this.dustAni(false)
           clearTimeout(this.point1timer)
           clearTimeout(this.point2timer)
         }
         
          break;
        case 2:
           if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
            this.license.play()
            this.m02.onended=()=>{
              this.license.pause()
            }
          }
          this.control.huihe=swip
          this.horseAni1(swip)
          break;
        case 3:
          if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
            this.license1.play()
            this.m03.onended=()=>{
              this.license1.pause()
            }
          }
          this.control.tubo=swip
          this.horseAni2(swip)
          break;
        case 4:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
            this.license2.play()
            this.m04.onended=()=>{
              this.license2.pause()
            }
          }
          this.control.nanzhao=swip
          this.horseAni3(swip)
          break;
        case 5:
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
      // this.conflict();
    },
    conflict() {

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
      let list = [
        { name: "canvasStatic1", zindex: 6 }, //回纥
        { name: "canvasStatic2", zindex: 6 }, // 吐蕃
        { name: "canvasStatic3", zindex: 6 }, //南绍
        { name: "canvasStatic4", zindex: 5 }, //疆界
      ];
      this.createCanvas(list, divTag);
      /* 音频 */
      this.m01 = document.createElement("audio");
      this.m02 = document.createElement("audio");
      this.m03 = document.createElement("audio");
      this.m04 = document.createElement("audio");
      this.m05 = document.createElement("audio");
      this.m06 = document.createElement("audio");
      this.license = document.createElement("audio");
      this.license2 = document.createElement("audio");
      this.license1 = document.createElement("audio");
      this.m01.src = require("../static/img/vo/MAP008-1.mp3");
      this.m02.src = require("../static/img/vo/MAP008-3.mp3");
      this.m03.src = require("../static/img/vo/MAP008-4.mp3");
      this.m04.src = require("../static/img/vo/MAP008-5.mp3");
      this.license.src = require("../static/img/vo/License.mp3");
      this.license1.src = require("../static/img/vo/License.mp3");
      this.license2.src = require("../static/img/vo/License.mp3");
      this.license.volume=this.license1.volume=this.license2.volume=0.3
      this.license.loop = true
      this.license1.loop = true
      this.license2.loop = true
      // Variable init
      var imageHorse = new Image();
      imageHorse.src = require("../static/img/horse.png");
      var imagedust = new Image();
      imagedust.src = require("../static/img/dust2.png");
      
      this.insterCanvas2(imagedust,()=>{
        this.horseObject4 = this.initHorseObject2(
          imagedust
        );
      })
      this.insterCanvas2(imageHorse,()=>{
        this.horseObject1 = this.initHorseObject(
          imageHorse
        );
        this.horseObject2 = this.initHorseObject(
          imageHorse
        );
        this.horseObject3 = this.initHorseObject(
          imageHorse
        );
      })
      // imageHorse.onload = () => {
        
      // };

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
      img.onload = () => {
        this.imgCount++
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
    insterCanvas2(img, fun) {
      img.onload = () => {
        this.imgCount++
        fun()
      }
    },
    initHorseObject(imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 2,
        currFrame: 0,
        width: 451,
        height: 400,
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
    initHorseObject2(image) {
      var object = {
        source: image,
        totalFrame: 4,
        currFrame: 0,
        width: 897,
        height: 2630,
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
    // background: url("../static/img/map.png");
    background-size: cover;
  }

  .map {
    display: inline-block;
    width: 100%;
    height: 100%;
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
</style>
