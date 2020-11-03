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
        <span>平王東遷示意圖 (約公元前770 年)</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{'width':canvasW+'px','height':canvasH+'px'}"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'capital.png'" :static="control.capital.show" :zindex="4" @update="updateImg"></imageview>
            <imageview :imgsrc="'city.png'" :static="control.city.show" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'EasternZhou.png'" :static="control.EasternZhou" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'WesternZhou.png'" :static="control.WesternZhou" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'zhou.png'" :static="control.zhou.show" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'zhou1.png'" :static="control.zhou1.show" :zindex="2" @update="updateImg"></imageview>
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
            <div class="">
              1. 以下哪項關於平王東遷的描述是正確的？
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
          <div class="question question2">
            <div>2. 以下哪項關於東周的描述是正確的？</div>
            <div>
              <span
                class="item"
                :class="{'selected':currAns2==index}"
                v-for="(item,index) in questionItem2"
                :key="index"
                @click="checkans2(index)"
                v-html="item"
              ></span>
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
      :headTitle="list[4].text"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="mapPop=false;list[4].show=false"
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32869509.182008933!2d78.48719729337351!3d37.042298359318345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36786f68f2d04437%3A0x61f85ae8c6c72215!2z5Lit5ZyL5rKz5Y2X55yB5rSb6Zm95biC!5e0!3m2!1szh-TW!2shk!4v1592470202210!5m2!1szh-TW!2shk"
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
import imageview from "./components/ImageView";
// import tools from './js/animate.js';
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
      // console.log(document.readyState);
      if (document.readyState === "complete" && that.imgCount == that.imgTotal) {
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
      control:{
        capital:{
          show:false,
          ani:false,
          timer:null
        },
        city:{
          show:false,
          ani:false,
          timer:null,
        },
        EasternZhou:false,
        WesternZhou:false,
        zhou:{play:false,
        show:false},
        zhou1:{play:false,
        show:false},
      },
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: [
        "A. 洛邑在鎬京西面",
        "B. 周平王是西周第一位君主",
        "C. 周室遷離渭河流域"
      ],
      rightans: 2,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 諸侯退還土地<font class='dot'>，</font>並西遷鎬京",
        "B. 東周的得名與都城位置有關",
        "C. 東周首任君主為周幽王"],
      rightans2: 1,
      showWrong2: 0,
      currAns2: null,
      data: [],
      mapPop: false,
      list: [
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "都城",
          show: false
        },
        {
          ico: require("../static/img/icon/route_019_icon.png"),
          text: "東遷路線",
          show: false
        },
        {
          ico: require("../static/img/icon/WesternZhou_icon.png"),
          text: "西周都城位置",
          show: false
        },
        {
          ico: require("../static/img/icon/EasternZhou_icon.png"),
          text: "東周都城位置",
          show: false
        },
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "洛邑（今洛陽市）",
          show: false,
          type: "map",
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
        "myCanvasStatic3",
        "myCanvasStatic4",
        "myCanvasStatic5",
        "myCanvasStatic6",
        "myCanvasStatic7",
        "myCanvasStatic8",
        "myCanvasStatic9",
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      m05: null,
      m06: null,
      train:null,
      train1:null,
      license: null,
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      titleH: 70,
      prevorienta: "",
      pathObject: {},
      chenTimer: null,
      timer1: null,
      timer2: null,
      timer3: null,
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {},
      imgCount:0,
      imgTotal:9,
      roadAniEnd:false,
    licenseTimer:null,
    isShowAll:false,
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
    imgCount:function(n,o){
      // if(n == this.imgTotal && document.readyState == "complete"){
      //   console.log(n)
      //   // this.load = false;
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
            this.m01.onended=()=>{
              this.m05.currentTime = 0;
              this.m05.play();
            }
            this.timer1 = setTimeout(() => {
              this.control.zhou.show = false
            }, 13000);
            if(this.isShowAll){
              this.timer2 = setTimeout(() => {
                this.control.zhou.show = false
              }, 3000);
            }
          }
          if(this.noVoice && swip){
            this.timer1 = setTimeout(() => {
              this.control.zhou = false
            }, 5000);
          }
          if(!this.control.zhou.play){
            this.control.zhou.show = swip
            this.control.zhou.play = true
          }
          if(!swip){
            this.control.zhou.show = false
            this.control.zhou.play = false
            clearTimeout(this.timer1)
          }
          this.sharpCity(this.control.capital,swip)
          this.sharpCity(this.control.city,swip)

          break;
        case 1:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
            this.timer3 = setTimeout(() => {
              this.drawRedPath(swip)
            }, 19000);
          }
          if(this.noVoice){
            this.drawRedPath(swip)
          }
          if(!swip){
            this.drawRedPath(false)
            clearTimeout(this.timer3)
          }
          break;
        case 2:
          if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
          }
          this.control.WesternZhou = swip
          break;
        case 3:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
            this.timer2 = setTimeout(() => {
              this.control.zhou1.show = false
            }, 16000);
            if(this.isShowAll){
              this.timer2 = setTimeout(() => {
                this.control.zhou1.show = false
              }, 3000);
            }
          }
          if(this.noVoice && swip){
            this.timer2 = setTimeout(() => {
              this.control.zhou1.show = false
            }, 3000);
          }
          if(!this.control.zhou1.play){
            this.control.zhou1.show = swip
            this.control.zhou1.play = true
          }
          if(!swip){
            this.control.zhou1.show = false
            this.control.zhou1.play = false
            clearTimeout(this.timer2)
          }
          this.control.EasternZhou = swip
          
          
          
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
      this.controller()
    },
    controller(){
      // let swip1 = this.list[1].show
      this.control.capital.show = this.list[0].show
      this.control.city.show = this.list[0].show
      let swip2 = this.list[2].show
      let swip1 = this.list[1].show
      let swip3 = this.list[3].show
      if(swip2){
        this.control.capital.show = swip2
      }
      if(swip1){
        this.control.capital.show = swip1
        this.control.city.show = swip1
      }
      if(swip3){
        this.control.city.show = swip3
      }
      if(swip1 && this.roadAniEnd){
        this.control.city.show = swip1
      }
    },
    oriChange() {
      setTimeout(() => {
        this.setRemUnit();
      }, 200);
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
      this.isShowAll = type
      this.list.forEach((e, index) => {
        if (!this.list[index].type) {
          if (type) {
            this.list[index].show = false
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
        { name: "myCanvasAnimRoad", zindex: 3 },
        // { name: "myCanvasAnimHorse", zindex: 3 },
      ];
      let obj = this.createCanvas(list, divTag);
      this.canvasObj = obj[0];
      this.contextObj = obj[1];
      /* 音频 */
      this.m01 = document.createElement("audio");
      this.m02 = document.createElement("audio");
      this.m03 = document.createElement("audio");
      this.m04 = document.createElement("audio");
      this.m05 = document.createElement("audio");
      this.license = document.createElement("audio");
      this.m01.src = require("../static/img/vo/Chist_s1_map_019_1.mp3");
      this.m02.src = require("../static/img/vo/Chist_s1_map_019_2.mp3");
      this.m03.src = require("../static/img/vo/Chist_s1_map_019_3.mp3");
      this.m04.src = require("../static/img/vo/Chist_s1_map_019_4.mp3");
      this.m05.src = require("../static/img/vo/Chist_s1_map_019_1_2.mp3");
      // this.license.src = require("../static/img/vo/Commons.mp3");
      // this.license.loop='loop'
      // this.license.volume =0.3
      // Variable init

      var route = new Image();
      var imageHorse = new Image();

      this.pathObject = {
          source: null,
          originX: 0,
          originY: 0,
          width: this.baseWidth,
          height: this.baseHeight,
          mask1: {
            originX: 156,
            originY: 766,
            width: 251,
            height: 182,
            currOriginX: 156,
            currOriginY: 766,
            shiftX: 5,
            shiftY: 0,
            endPoint:358
          },
          timeout: null,
          playing: false
        };
      this.insterCanvas2(route,'route.png',()=>{
        this.pathObject.source = route
      })

      // this.insterCanvas2(imageHorse,'Tangtrader.png',()=>{
      //   var translate = [[540, 896], [730, 726],[730, 726]];
      //   var scale = [1,1,1];
      //   var dur = [20, 5,1];
      //   var sharpPoint = ''
      //   this.horseObject1 = this.initHorseObject(
      //     translate,
      //     scale,
      //     dur,
      //     sharpPoint,
      //     imageHorse
      //   );
      //   var translate = [[-864, 724], [-520, 335],[-406,98],[-354,108]];
      //   var scale = [1, 1,1,0];
      //   var dur = [30, 20, 8,5];
      //   var sharpPoint = -1
      //   this.horseObject2 = this.initHorseObject(
      //     translate,
      //     scale,
      //     dur,
      //     sharpPoint,
      //     imageHorse
      //   );
      // })
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
    insterCanvas2(img, src, fun) {
      img.src = require(`../static/img/${src}`);
      img.onload = () => {
        this.imgCount++
        fun()
      }
    },
    insterCanvas(img, src,contextStatic, bool) {
      img.src = require(`../static/img/${src}`);
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
    initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 1,
        currFrame: 0,
        width: 380,
        height: 340,
        point: sharpPoint,
        position: {
          currPoint: 0,
          dur: 1,
          currDur: 1,
          points: translate,
          scales: scale,
          currPoint: 0,
          totalPoint: translate.length,
          dur: dur,
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
    width: 90% !important;
    margin-bottom: 0.8em !important;
  }
}
.flex{
  display: flex;
  em{
    font-style: normal;
  }
}
</style>
