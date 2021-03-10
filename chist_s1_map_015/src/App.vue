<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div
      id="main_container" :style="mainBoxStyle"
    >
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>宋帝南逃路線圖 (1276-1279 年)</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'mapDetail.png'" :static="true" :zindex="2" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'nansong.png'" :static="control.nansong" :zindex="2" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'capital.png'" :static="control.capital.show" :zindex="4" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'main_city.png'" :static="control.main_city" :zindex="4" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'city1.png'" :static="control.city.show" :zindex="4" @update="updateImg"></imageview>
            <imageview  :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'border.png'" :static="control.border" :zindex="2" @update="updateImg"></imageview>

            
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
      :style="AppStyle" :dragable="!isApp"
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="popWindow=false;list[6].show=false"
    >
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="">
              1. 根據地圖<span class="dot">，</span>宋帝南逃的最終目的地是？
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
            <div>2. 以下哪項是宋帝南逃路線的特點？</div>
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
       :style="AppStyle" :dragable="!isApp"
      :headTitle="list[5].text"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="mapPop=false;list[5].show=false"
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22507750.899880774!2d88.37957330485277!3d39.37896229950811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34018c5d7ac54d75%3A0x46f25214eb2ce06c!2z5Lit5ZyL5buj5p2x55yB5rGf6ZaA5biC5paw5pyD5Y2A5bSW6ZaA6Y6u!5e0!3m2!1szh-TW!2shk!4v1575947305602!5m2!1szh-TW!2shk"
          :width="(isApp?docWidth:bodytWidth)/1.8" :height="(isApp?docHeight:bodyHeight)/1.8"
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
  import zoomApp from "./js/zoomApp.js";
  import modal from "./components/modal";
  import bar from "./components/bar";
  import imageview from "./components/ImageView";
import { constants } from 'fs';
const SCALE_NUM = 0.5
export default {
  components: {
    modal,
    bar,
    imageview
  },
  name: "App",
    beforeCreate() {},
    created() {
      if (document.body.clientWidth < 600) {
        this.baseWidth = this.baseWidth * SCALE_NUM
        this.baseHeight = this.baseHeight * SCALE_NUM
        this.baseWidth_doc = this.baseWidth_doc * SCALE_NUM
        this.baseHeight_doc = this.baseHeight_doc * SCALE_NUM
      }
    },
  computed: {
      mainBoxStyle() {
        var css = {
          width: this.docWidth + "px",
          height: this.docHeight + "px",
          display: this.load ? "none" : "block",
          transform: this.pageTransform,
          "margin-top": this.pageMarginTop + "px",
          "margin-left": this.pageMarginLeft * -1 + "px",
        };
        return css;
      },
      AppStyle() {
        var css = {};
        if (this.isApp) {
          css = {
            width: this.docWidth + "px",
            height: this.docHeight + "px",
            transform: this.pageTransform,
            "margin-top": this.pageMarginTop + "px",
            "margin-left": this.pageMarginLeft * -1 + "px"
          };
        }
        return css;
      },
      isApp() {
        if (window.location.search.indexOf("app") >= 0) {
          return true;
        } else {
          return false;
        }
      }
    },
  mounted() {
    this.createMap();
    if ("onorientationchange" in window) {
      window.addEventListener("orientationchange", this.oriChange, false);
    } else {
      window.addEventListener("resize", this.setRemUnit, false);
    }
   if (this.isApp) {
        this.forApp()
      } else {
        this.setRemUnit()
      }
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
          timer:null
        },
        nansong:true,
        border:false,
        main_city:false
      },
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: [
        "A. 潮州",
        "B. 福州",
        "C. 崖山"
      ],
      rightans: 2,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 由東向西",
        "B. 由北向南",
        "C. 由南向北"],
      rightans2: 1,
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
          ico: require("../static/img/icon/main_city_icon.png"),
          text: "要邑",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "城鎮",
          show: false
        },
        {
          ico: require("../static/img/icon/route_red_015_icon.png"),
          text: "宋帝南逃路線",
          show: false
        },
        {
          ico: require("../static/img/icon/border2_icon.png"),
          text: "疆界",
          show: false
        },
        {
          ico: require("../static/img/icon/main_city_icon.png"),
          text: "崖山（今廣東崖門鎮）",
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
     orgSetting: {
          w: 1430,
          h: 1315
        },
        baseWidth: "1430", //地图大小
        baseHeight: "1315", //地图大小
        baseWidth_doc: "2048", //窗口大小
        baseHeight_doc: "1396", //窗口大小
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
      drawHorsesTimeout2: null,
      Timer3: null,
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
      contextObj: {},
      imgCount:0,
      imgTotal:9,
    licenseTimer:null
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
    // control: {
    //     handler(n, o) {
    //       this.imagesCanvas();
    //     },
    //     deep: true
    //   },
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
          this.sharpCity(this.control.capital,swip)
          break;
        case 1:
          this.control.main_city = swip
          break;
        case 2:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
           this.sharpCity(this.control.city,swip)
          break;
        case 3:
          clearTimeout(this.Timer3)
          if (swip && !this.noVoice) {
            this.license.currentTime = 0;
            this.license.play();
            this.m03.currentTime = 0;
            this.m03.play();
          }
          this.Timer3 = setTimeout(()=>{
            this.control.nansong= false
          },26000)
          
          this.control.nansong=true
          if(!this.pathObject.playing){
            this.drawRedPath(swip)
          }
          if(!swip){
             this.drawRedPath(false)
          }
          this.drawHousePromise(swip)
          
          break;
        case 4:
          this.control.border =  swip
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
      this.controller()
    },
    controller(){
      let swip3= this.list[3].show
      this.control.capital.show = this.list[0].show;
        this.control.city.show = this.list[2].show;
        this.control.main_city = this.list[1].show;
      if(swip3){
        this.control.capital.show = true;
        this.control.city.show = true;
        this.control.main_city = true;
      }
    },
    oriChange() {
        this.windowTimer = setTimeout(() => {
          clearTimeout(this.windowTimer);
          this.setRemUnit();
        }, 200);
      },
      forApp() {
        const u_agent = navigator.userAgent;
        var selffun = () => {
          this.bodyHeight = document.body.innerHeight;
          this.bodytWidth = document.body.clientWidth;
          var offest = this.bodytWidth / this.bodyHeight;
          if (offest > 0.5) {
            this.boxscale = this.bodyHeight / this.baseWidth_doc
            this.o = this.baseHeigth_doc * this.boxscale
          } else {
            this.boxscale = this.bodytWidth / this.baseHeight_doc
            this.o = this.bodytWidth
          }
          this.docWidth = this.baseWidth_doc * this.boxscale;
          this.docHeight = this.baseHeight_doc * this.boxscale;
          this.canvasH = Math.ceil(this.baseHeight * this.boxscale);
          this.canvasW = Math.ceil(this.baseWidth * this.boxscale);
          this.titleH = this.docHeight - this.canvasH;
          var s = 10;
          this.dpr = window.devicePixelRatio || 1;
          if (/iPad|iPhone|Android|Adr/i.test(u_agent)) {
            this.dpr = 2;
          }
          if (this.dpr >= 2) {
            this.dpr = 2;
            this.rem = this.o / this.dpr / 5.2;
          } else {
            this.rem = this.o / 10 / this.dpr;
          }
          document.documentElement.style.fontSize = this.rem + "px";
          this.pageTransform = "rotate3d(0,0,1,-90deg)";
          this.pageMarginTop = this.pageMarginLeft =
            (this.docWidth - this.docHeight) / 2;
        };
        selffun();
        this.setZoom();
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
            this.boxscale = this.bodyHeight / this.baseHeight_doc;
            this.o = this.bodyHeight;
            var offest = this.bodytWidth / this.bodyHeight;
            if (offest < 1.49 && offest > 1) {
              this.boxscale = this.bodytWidth / this.baseWidth_doc;
              this.o = this.baseHeight_doc * this.boxscale;
            }
          } else {
            this.boxscale = this.bodytWidth / this.baseWidth_doc;
            this.o = this.bodytWidth;
          }
          this.docWidth = this.baseWidth_doc * this.boxscale;
          this.docHeight = this.baseHeight_doc * this.boxscale;
          this.canvasW = Math.ceil(this.baseWidth * this.boxscale);
          this.canvasH = Math.ceil(this.baseHeight * this.boxscale);
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
        { name: "myCanvasAnimRoad", zindex: 3 ,org:true,},
        { name: "myCanvasAnimHorse", zindex: 4 ,org:true,},
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
      this.m01.src = require("../static/img/vo/Map015-1.mp3");
      this.m02.src = require("../static/img/vo/Map015-3.mp3");
      this.m03.src = require("../static/img/vo/Map015-4.mp3");
      this.license.src = require("../static/img/vo/production.mp3");
      this.license.loop='loop'
      this.license.volume =0.3
      // Variable init

      var route = new Image();
      var imageHorse = new Image();

      this.pathObject = {
          source: null,
          originX: 0,
          originY: 0,
          width: this.orgSetting.w,
          height: this.orgSetting.h,
          mask1: {
            originX: 1024,
            originY: 100,
            width: 137,
            height: 1,
            currOriginX: 1024,
            currOriginY: 100,
            shiftX: 3,
            shiftY: 0,
            endPoint:460
          },
           mask2: {
            // originX: 951,
            // originY: 545,
            // width: 240,
            originX: 1156,
            originY: 46,
            width: 280,
            height: 501,
            currOriginX: 1156,
            currOriginY: 46,
            shiftX: 3,
            shiftY: 5,
            endPoint:388
            // endPoint:341
          },
          mask3: {
            originX: 932,
            originY: 879,
            width: 67,
            height: 1,
            currOriginX: 932,
            currOriginY: 879,
            shiftX: 4,
            shiftY: 0,
            endPoint:78
          },
          mask4: {
            originX: 950,
            originY: 940,
            width: 1,
            height: 95,
            currOriginX: 950,
            currOriginY: 940,
            shiftX: 4,
            shiftY: 0,
            endPoint:243
          },
          mask5: {
            originX: 710,
            originY: 1016,
            width: 1,
            height: 71,
            currOriginX: 710,
            currOriginY: 1016,
            shiftX: 4,
            shiftY: 0,
            endPoint:102
          },
          timeout: null,
          playing: false
        };
      this.insterCanvas2(route,'route.png',()=>{
        this.pathObject.source = route
      })

      this.insterCanvas2(imageHorse,'warship.png',()=>{
        var translate = [[1060, 44], [1054, 154], [966, 402],[1157,552]];
        var scale = [1, 1, 1,0];
        var dur = [25, 35, 30,20];
        var sharpPoint = ''
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
        var translate = [[1073, 486], [1075, 606],[967,688],[865,837]];
        var scale = [1, 1,1,1];
        var dur = [20, 20, 20,20];
        var sharpPoint = ''
        this.horseObject2 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
        var translate = [[865, 837], [750,887],[722, 1027]];
        var scale = [1,1, 0];
        var dur = [15,15,15];
        var sharpPoint = ''
        this.horseObject3 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
        var translate = [[595, 987], [598, 1099]];
        var scale = [1, 0];
        var dur = [20,25];
        var sharpPoint = ''
        this.horseObject4 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
      })
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
        if (this.isApp) {
          this.zoomObj = new zoomApp(document.getElementById("canvasInnerDiv"), {
            width: this.baseWidth,
            height: this.baseHeight,
            top: 0,
            left: 0,
            minScale: this.boxscale,
            // maxScale: this.boxscale * 10,
            warpWidth: this.boxscale * this.baseWidth,
            warpHeight: this.boxscale * this.baseHeight
          });
        } else {
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
        }
        this.zoomObj.setScale(this.boxscale);
        this.windowTimer = setTimeout(() => {
          this.load = false;
        }, 500);
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
        width: 400,
        height: 260,
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
    width: 50% !important;
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
