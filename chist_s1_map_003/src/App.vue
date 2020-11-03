<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load" id="main_container" :style="mainBoxStyle">
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>隋代運河分佈圖 (581-618 年)</span>
        <div id="soundCon" :class="{ mute: noVoice }" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{ width: canvasW + 'px', height: canvasH + 'px' }">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <!-- <imageview :imgsrc="'capital.png'" :static="control.capital.show" :zindex="2" @update="updateImg"></imageview> -->
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{ clicked: item.show }" v-for="(item, index) in list" :key="index" @click="clickFun(index)">
              <div class="iconItem">
                <span class="icon"><img :src="item.ico"/></span>
                <span class="">{{ item.text }}</span>
              </div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">
                <span class="">全部顯示</span>
              </div>
              <div class="blueButton action_all " @click="showall(false)">
                全部隱藏
              </div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />
        </div>
      </div>
    </div>
    <modal class="" :style="AppStyle" :dragable="!isApp" headTitle="問題" :hideFooter="true" v-if="popWindow" @cancel-event="
            popWindow = false;
            list[9].show = false;
          ">
      <div slot="modalCont">
        <div>
          <div class="question question2">
            <div class="flex">
              <em class="mr5">1.</em><em>以下哪一個<span class="underline">不是</span>隋煬帝下令建設運河的原因？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns == index }" v-for="(item, index) in questionItem" :key="index" @click="checkans(index)" v-html="item"></span
                  >
                </div>
                <div
                  class="ansBox"
                  :class="showWrong == false ? 'wrongico' : 'rightico'"
                  v-if="currAns != null"
                ></div>
              </div>
              <div class="question question2">
                <div class="flex">
                  <em class="mr5">2.</em>
                  <em>以下哪一道運河河段位於長江以南？</em>
              </div>
              <div>
                <span class="item" :class="{ selected: currAns2 == index }" v-for="(item, index) in questionItem2" :key="index" @click="checkans2(index)" v-html="item"></span
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
          :style="AppStyle" :dragable="!isApp"
          :headTitle="list[8].text"
          :hideFooter="true"
          v-if="mapPop"
          @cancel-event="
            mapPop = false;
            list[8].show = false;
          "
        >
          <div slot="modalCont">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d27045078.880210858!2d91.51231386387506!3d34.161658!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x366379e922ac17b9%3A0x85d466fda794582e!2z5Lit5ZyL6Zmd6KW_55yB6KW_5a6J5biC!5e0!3m2!1szh-TW!2shk!4v1574835171285!5m2!1szh-TW!2shk"
              :width="(isApp?docWidth:bodytWidth)/1.8" :height="(isApp?docHeight:bodyHeight)/1.8"
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
  import zoomApp from './js/zoomApp.js'
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
        if (document.readyState === "complete" && that.imgCount >= that.imgTotal) {
          // console.log(document.readyState, that.imgCount)
          that.load = false;
          window.clearInterval(that.timer);
        }
      }, 500);
    },
    computed: {
      mainBoxStyle() {
        var css = {
          'width': this.docWidth + 'px',
          'height': this.docHeight + 'px',
          'display': this.load ? 'none' : 'block',
          transform: this.pageTransform,
          'margin-top': this.pageMarginTop + 'px',
          'margin-left': (this.pageMarginLeft * -1) + 'px'
        }
        return css
      },
      AppStyle() {
        var css = {}
        if (this.isApp) {
          css = {
            'width': this.docWidth + 'px',
            'height': this.docHeight + 'px',
            transform: this.pageTransform,
            'margin-top': this.pageMarginTop + 'px',
            'margin-left': (this.pageMarginLeft * -1) + 'px'
          }
        }
        return css
      },
      isApp() {
        if (window.location.search.indexOf('app') >= 0) {
          return true
        } else {
          return false
        }
      }
    },
    mounted() {
      // this.testCanvas()
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
        imageObj: {
          river01: null,
          river02: null,
          river03: null,
          river04: null,
          river05: null,
        },
        control: {
          river01: false,
          river02: false,
          river03: false,
          river04: false,
          river05: false,
        },
        canvasImagesObj: {
          capital: null,
          dongdu: null,
          gate: null,
          rices: null,
          main_city: null,
        },
        redTimer: null,
        greedTimer:null,
        load: true,
        noVoice: false,
        zoomObj: null,
        imgCount: 0,
        imgTotal: 12,
        questionItem: [
          "A. 便利運兵",
          "B. 增加稅收",
          "C. 便利糧食運輸",
          "D. 方便巡視南方"
        ],
        rightans: 1,
        showWrong: 0,
        currAns: null,
        questionItem2: ["A. 永濟渠",
          "B. 廣通渠 ",
          "C. 江南河",
          "D. 山陽瀆"
        ],
        rightans2: 2,
        showWrong2: 0,
        currAns2: null,
        data: [],
        mapPop: false,
        list: [{
            ico: require("../static/img/icon/capital_icon.png"),
            text: "首都",
            show: false
          },
          {
            ico: require("../static/img/icon/dongdu.png"),
            text: "東都",
            show: false
          },
          {
            ico: require("../static/img/icon/main_city_icon.png"),
            text: "要邑",
            show: false
          },
          {
            ico: require("../static/img/icon/gate_icon.png"),
            text: "關口",
            show: false
          },
          {
            ico: require("../static/img/icon/river_icon.png"),
            text: "運河",
            show: false
          },
          {
            ico: require("../static/img/icon/redArrow_icon.png"),
            text: "航綫 1",
            show: false
          },
          {
            ico: require("../static/img/icon/greenArrow_icon.png"),
            text: "航綫 2",
            show: false
          },
          {
            ico: require("../static/img/icon/rice.png"),
            text: "糧食儲存",
            show: false
          },
          {
            ico: require("../static/img/icon/capital_icon.png"),
            text: "大興（今西安市）",
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
        horseObject2: {},
        horseObject3: {},
        horseObject4: {},
        horseObject5: {},
        scaleindex: 0,
        ele: null,
        popWindow: false,
        m01: null,
        m02: null,
        m03: null,
        m04: null,
        m05: null,
        m06: null,
        m07: null,
        m08: null,
        license: null,
        waveSound: null,
        winSound: null,
        horsetimerGroup: [],
        horsetimerGroup2:[],
        drawHorsesTimeout: [],
        drawHorsesTimeout1: null,
        drawHorsesTimeout2: null,
        drawHorsesTimeout3: null,
        shipPlay: false,
        titleH: 70,
        canvasAnimHorse: null,
        prevorienta: "",
        pathObject: {},
        pathObjectGreen: {},
        pathObjectblue: {},
        scaleZoom: 0,
        debug: "",
        canvasObj: {},
        contextObj: {},
        timer1: [],
        timerGroup: [],
        isShowall: false,
        drawRiverTimeout: false,
        route1:null,
        route2:null,
        ship2Pos:{
         w: 10,
      x :620,
        },
        ship1Pos:{
      h:50,
      y:1200,
      xx:1154,
      ww:220,
    
        }
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
      control: {
        handler(n, o) {
          this.imagesCanvas()
        },
        deep: true
      },
      route3: function(n) {
        if (n) {
          this.drawHousePromise4(n)
        }
      }
    },
    methods: {
      updateImg() {
        this.imgCount++
      },
      setVoice() {
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
        this.m07.pause();
        this.m08.pause();
         this.waveSound.pause();
          this.winSound.pause();
          this.m01.currentTime = 0;
           this.m02.currentTime = 0;
            this.m03.currentTime = 0;
             this.m04.currentTime = 0;
              this.m05.currentTime = 0;
               this.m06.currentTime = 0;
                this.m07.currentTime = 0;
                 this.m08.currentTime = 0;
      },
      clickFun(index){
        this.muteMe();
        this.showCanvas(index)
      },
      showCanvas(index) {
        let swip = !this.list[index].show;
        switch (index) {
          case 0:
            //首都
            if (swip && !this.noVoice && !this.isShowall) {
              
              this.m01.play();
            }
            this.showCityAni(this.canvasObj['capital'], swip);
            break;
          case 1:
            if (swip && !this.noVoice && !this.isShowall) {
              // this.m02.currentTime = 0;
              this.m02.play();
            }
            this.showCityAni(this.canvasObj['dongdu'], swip);
            break;
          case 2:
            this.showCityAni(this.canvasObj['main_city'], swip);
            break;
          case 3:
            if (swip && !this.noVoice && !this.isShowall) {
              // this.m03.currentTime = 0;
              this.m03.play();
            }
            this.showCityAni(this.canvasObj['gate'], swip);
            break;
          case 4:
            this.drawRiverTimeout = '';
            for (var i = 0; i < this.timerGroup.length; i++) {
                clearTimeout(this.timerGroup[i]);
              }
            if(swip){
              if(!this.noVoice && !this.isShowall){
                this.drawRiverPath(swip)
              }else if(this.noVoice || this.isShowall){
                this.drawRiverPathNoVoice(swip)
              }
            }else{
              
              this.control.river01=false
              this.control.river02=false
              this.control.river03=false
              this.control.river04=false
              this.control.river05=false
              
            }
            break;
          case 5:
            if (swip && !this.noVoice && !this.isShowall) {
              this.waveSound.volume = 0.1
              this.waveSound.play();
            }
            // this.ship1(swip);
            // this.drawRedPath(swip)
            // let canvasAnimRedPath = this.canvasObj['canvasAnimRedPath']
            // if (!canvasAnimRedPath.playing) {
            //   this.drawHousePromise(swip);
            //   canvasAnimRedPath.playing = true;
            // }
            // if(!swip){
            //   this.drawHousePromise(false);
            //   canvasAnimRedPath.playing = false;
            // }
            break;
          case 6:
            if (swip && !this.noVoice && !this.isShowall) {
              this.waveSound.volume = 0.1
              this.waveSound.play();
            }
            this.ship2(swip);
            // this.drawHousePromise(swip);
            break;
          case 7:
            if (swip && !this.noVoice && !this.isShowall) {
              this.winSound.currentTime = 0;
              this.winSound.play();
            }
            this.showCityAni(this.canvasObj['rices'], swip);
            break;
          case 8:
            this.mapPop = swip;
            break;
          case 9:
            this.popWindow = swip;
            this.currAns = null;
            this.currAns2 = null;
            break;
          default:
            break;
        }
        this.list[index].show = swip;
        // if(index!=false)this.conflict();
      },
      conflict() {
        let swip5 = this.list[5].show;
        let swip6 = this.list[6].show;
        this.control.capital.show = this.list[0].show;
        this.control.main_city = this.list[2].show;
        this.control.xiyu1 = this.control.xiyu2 = this.list[3].show;
        this.control.mountain = this.list[4].show
        if (swip5) {
          this.control.capital.show = true
          this.control.main_city = true
          this.control.xiyu1 = true
          this.control.xiyu2 = true
        }
        if (swip6) {
          this.control.xiyu2 = true
          this.control.mountain = true
        }
      },
      oriChange() {
        setTimeout(() => {
          this.setRemUnit();
        }, 200);
      },
      forApp() {
        const u_agent = navigator.userAgent
        var selffun = () => {
          this.bodyHeight = window.innerHeight
          this.bodytWidth = window.innerWidth
          var offest = (this.bodytWidth / this.bodyHeight)
          if (offest > 0.5) {
            this.boxscale = this.bodyHeight / 2048
            this.o = 1396 * this.boxscale
          } else {
            this.boxscale = this.bodytWidth / 1396
            this.o = this.bodytWidth
          }
          this.docWidth = 2048 * this.boxscale
          this.docHeight = 1396 * this.boxscale
          this.canvasW = Math.ceil(1430 * this.boxscale)
          this.canvasH = Math.ceil(1315 * this.boxscale)
          this.titleH = this.docHeight - this.canvasH
          var s = 10
          this.dpr = window.devicePixelRatio || 1
          if (/iPad|iPhone|Android|Adr/i.test(u_agent)) {
            this.dpr = 2;
          }
          if (this.dpr >= 2) {
            this.dpr = 2;
            this.rem = this.o / this.dpr / 5.2;
          } else {
            this.rem = this.o / 10 / this.dpr;
          }
          document.documentElement.style.fontSize = (this.rem) + 'px'
          this.pageTransform =  'rotate3d(0,0,1,-90deg)'
          this.pageMarginTop = this.pageMarginLeft = (this.docWidth - this.docHeight) / 2
        }
        selffun()
        this.setZoom()
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
        
        this.isShowall = type
        this.list.forEach((e, index) => {
          if (!this.list[index].type) {
            this.list[index].show = !type
            this.showCanvas(index);
          }
        });
        // this.muteMe();      
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
        let list = [{
            name: "canvasImages",
            zindex: 3
          },
          {
            name: "capital",
            zindex: 3
          },
          {
            name: "dongdu",
            zindex: 3
          },
          {
            name: "gate",
            zindex: 3
          },
          {
            name: "main_city",
            zindex: 3
          },
          {
            name: "rices",
            zindex: 3
          }, {
            name: "canvasAnimRedPath",
            zindex: 3
          },
          {
            name: "canvasAnimHorse",
            zindex: 3
          },
          {
            name: "canvasAnimGreenPath",
            zindex: 3
          },{
            name: "canvasAnimHorse2",
            zindex: 3
          },
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
        this.m06 = document.createElement("audio");
        this.m07 = document.createElement("audio");
        this.m08 = document.createElement("audio");
        this.waveSound = document.createElement("audio");
        this.winSound = document.createElement("audio");
        this.m01.src = require("../static/img/vo/Map003-1.mp3");
        this.m02.src = require("../static/img/vo/Map003-2.mp3");
        this.m03.src = require("../static/img/vo/Map003-4.mp3");
        this.m04.src = require("../static/img/vo/Map003-5_1.mp3");
        this.m05.src = require("../static/img/vo/Map003-5_2.mp3");
        this.m06.src = require("../static/img/vo/Map003-5_3.mp3");
        this.m07.src = require("../static/img/vo/Map003-5_4.mp3");
        this.m08.src = require("../static/img/vo/Map003-5_5.mp3");
        this.waveSound.src = require("../static/img/vo/wave.mp3");
        this.winSound.src = require("../static/img/vo/win.mp3");
        this.waveSound.loop = 'loop';
        this.waveSound.volume = 0.4;
        Object.keys(this.imageObj).forEach(element => {
          this.imageObj[element] = new Image();
          this.insterCanvas(this.imageObj[element], String(element) + '.png', 'canvasImages', false)
        });
        Object.keys(this.canvasImagesObj).forEach(element => {
          this.canvasImagesObj[element] = new Image();
          this.insterCanvas(this.canvasImagesObj[element], String(element) + '.png', String(element), false)
        });
        this.route1 = new Image();
        this.route2 = new Image();
        this.insterCanvas2(this.route1, 'route1/xianlu1a0090.png',false)
        this.insterCanvas2(this.route2, 'route2/xianlu2b0050.png',false)
        var imageHorse = new Image();
        // this.insterCanvas2(this.route1, 'route1/xianlu1a0090.png', () => {
        //   this.pathObject = {
        //   source: this.route1,
        //   originX: 0,
        //   originY: 0,
        //   width: this.baseWidth,
        //   height: this.baseHeight,
        //   mask1: {
        //     originX: 1155,
        //     originY: 1176,
        //     width: 244,
        //     height: 339,
        //     currOriginX: 1155,
        //     currOriginY: 1176,
        //     shiftX: 0,
        //     shiftY: 8,
        //     endPoint: 854
        //   },
        //   mask2: {
        //     originX: 1155,
        //     originY: 752,
        //     width: 700,
        //     height: 162,
        //     currOriginX: 1155,
        //     currOriginY: 752,
        //     shiftX: 12,
        //     shiftY: 0,
        //     endPoint: 490
        //   },
        //   mask3: {
        //     originX: 656,
        //     originY: 762,
        //     width: 298,
        //     height: 580,
        //     currOriginX: 656,
        //     currOriginY: 762,
        //     shiftX: 0,
        //     shiftY: 12,
        //     endPoint: 190
        //   },
        //   }
        // })
        this.insterCanvas2(imageHorse, 'ship.png', () => {
          var translate = [
            [1180, 1120],
            [1120, 968]
          ];
          var scale = [1, 1];
          var dur = [10, 7];
          var sharpPoint = [0, 1];
          this.horseObject1 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);
          translate = [
            [1120, 978],
            [1023, 838]
          ];
          scale = [1, 1];
          dur = [7, 7];
          sharpPoint = [0, 1];
          this.horseObject2 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);
          translate = [
            [1023, 838],
            [825, 807],
            [566, 753]
          ];
          scale = [1, 1, 1];
          dur = [8, 8, 8];
          sharpPoint = [0, 0, 1];
          this.horseObject3 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);
          translate = [
            [566, 753],
            [688, 612],
            [887, 375],
            [830, 165]
          ];
          scale = [1, 1, 1, 0];
          dur = [8, 10, 10, 18];
          sharpPoint = [0, 0, 0, 1];
          this.horseObject4 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);
          translate = [
            [490, 717],
            [378, 767],
            [223, 870]
          ];
          scale = [1, 1, 0];
          dur = [7, 10, 7];
          sharpPoint = [0, 0, 1];
          this.horseObject5 = this.initHorseObject(translate, scale, dur, sharpPoint,imageHorse);
          this.horseObject5.id = 5;
        })
        // this.insterCanvas2(zhangqian_b, 'Banchao2.png', () => {
        //   this.horseObject1.source2=zhangqian_b           
        // })
        // this.insterCanvas2(flagman, 'flagman.png', () => {
        //   this.horseObject2 = this.initHorseObject2(flagman );     
        // })
        // document.getElementById('map_container').append(divTag)
        // divTag.append(divTag)
        this.$nextTick(() => {
          this.setZoom();
        });
      },
      setZoom() {
        if (!document.getElementById('canvasInnerDiv')) {
          return
        }
        if (this.isApp) {
          this.zoomObj = new zoomApp(document.getElementById('canvasInnerDiv'), {
            width: this.baseWidth,
            height: this.baseHeight,
            top: 0,
            left: 0,
            minScale: this.boxscale,
            // maxScale: this.boxscale * 10,
            warpWidth: this.boxscale * this.baseWidth,
            warpHeight: this.boxscale * this.baseHeight
          })
        } else {
          this.zoomObj = new zoom(document.getElementById('canvasInnerDiv'), {
            width: this.baseWidth,
            height: this.baseHeight,
            top: 0,
            left: 0,
            minScale: this.boxscale,
            // maxScale: this.boxscale * 10,
            warpWidth: this.boxscale * this.baseWidth,
            warpHeight: this.boxscale * this.baseHeight
          })
        }
        this.zoomObj.setScale(this.boxscale)
      },
      insterCanvas(img, src, contextStatic, bool) {
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
          this.canvasObj[contextStatic].style.visibility = bool ?
            "visible" :
            "hidden";
        };
      },
      insterCanvas2(img, src, fun) {
        img.src = require(`../static/img/${src}`);
        img.onload = () => {
          this.imgCount++
          if(typeof(fun)=='function'){
            fun()
          }
        }
      },
      initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
        var object = {
          'source': imageHorse,
          'totalFrame': 2,
          'currFrame': 0,
          'width': 820,
          'height': 360,
          'point': sharpPoint,
          'position': {
            'points': translate,
            'scales': scale,
            'currPoint': 0,
            'totalPoint': translate.length,
            'dur': dur,
            'currDur': 1
          },
          'division': 1,
          'animating': false,
          'animated': false,
          'timeout': null
        };
        return object;
      },
      initHorseObject2(imageHorse) {
        var object = {
          source: imageHorse,
          totalFrame: 1,
          currFrame: 0,
          width: 270,
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
      canvasClear(canvas) {
        if (!canvas) {
          return
        }
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
    } // font-family: Verdana, Arial, sans-serif;
    .mapBackground {
      display: inline-block; // background: url("../static/img/map.png");
      background-size: cover;
    }
    .detail_div {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url("../static/img/mapDetail.png");
      background-size: cover;
      z-index: 2;
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
        display: inline-table;
        img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto; // object-fit:contain;
        }
      }
    }
    .question2 {
      flex-wrap: wrap;
      display: flex; // margin-bottom: 0.5em !important;
      .item {
        width: 49% !important;
        margin-bottom: 0.8em !important;
      }
    }
    .flex {
      display: flex;
      em {
        font-style: normal;
      }
    }
    .mr5 {
      margin-right: 5px;
    }
  }
  .ciytAni{
    animation: sharp .6s linear 3;
  }

  @keyframes sharp {
    0%{
      opacity: 1;
      // display: block
    }
  50%{
      opacity: 0;
      // display:none
    }
    100%{
      opacity: 1;
      // display: block
    }
  }
</style>
