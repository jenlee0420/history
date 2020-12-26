<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div
      id="main_container"
      :style="mainBoxStyle"
    >
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>黃巾之亂形勢圖 (184 年)</span>
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
            <imageview :imgsrc="'huangjinjun01.png'" :static="control.huangjinjun01" :zindex="4" @update="updateImg"></imageview>
            <imageview :imgsrc="'line.png'" :static="control.line.show" :zindex="4" @update="updateImg"></imageview>
             <imageview :imgsrc="'mingbian.png'" :static="control.mingbian" :zindex="2" @update="updateImg"></imageview>
            
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
      :style="AppStyle" :dragable="!isApp"
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="popWindow=false;list[7].show=false"
    >
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="">
              <span class="mr5">1.</span>依地圖所見<span class="dot">，</span>下列哪一個受民變影響的州部位於黃河以北？
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
            <div class="flex"><em class="mr5">2.</em><em> 根據地圖所示<span class="dot">，</span>以下哪項關於東漢官軍佈防特點的描述是<br><span class="underline">正確</span>的？</em></div>
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
      :style="AppStyle" :dragable="!isApp"
      :headTitle="list[6].text"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="mapPop=false;list[6].show=false"
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21200397.26449837!2d88.33577732423723!3d37.4423923875481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36786f68f2d04437%3A0x61f85ae8c6c72215!2z5Lit5ZyL5rKz5Y2X55yB5rSb6Zm95biC!5e0!3m2!1szh-TW!2shk!4v1588159610710!5m2!1szh-TW!2shk"
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
import modal from "./components/modal";
import bar from "./components/bar";
import imageview from "./components/ImageView";
import zoomApp from './js/zoomApp.js'
import {routeObject1,routeObject2,routeObject3,routeObject4} from './js/routedata.js';
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
      if (document.readyState === "complete" && that.imgCount >= that.imgTotal) {
        that.load = false;
        window.clearInterval(that.timer);
      }
    }, 10);
  },
  computed:{
      mainBoxStyle(){
        var css = {'width':this.docWidth+'px',
        'height':this.docHeight+'px',
        'display':this.load?'none':'block',       
        transform:this.pageTransform,
        'margin-top':this.pageMarginTop+'px',
        'margin-left':(this.pageMarginLeft *-1) +'px'    
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
      isApp(){
        if(window.location.search.indexOf('app')>=0){
          return true
        }else{
          return false
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
    // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
    this.zoomObj = require("./js/zoom.js");
    if(this.isApp){
        this.forApp()
      }else{
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
      imageObj:{
          border:null,
          // mingbian:null,
          diming:null,
          route1:null,
          route2:null,
        },
      control:{
        capital:{
          show:false,
          ani:false,
          timer:null
        },
        line:{
          show:false,
          ani:false,
          timer:null
        },
        border:false,
        mingbian:false,
        diming:false,
        route1:false,
        route2:false,
        huangjinjun01:false,
      },
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: [
        "A. 荊州 ",
        "B. 冀州",
        "C. 揚州"
      ],
      rightans: 1,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 主力駐軍於長江以南",
        "B. 在長安以西佈防",
        "C. 在洛陽以東佈防"],
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
          ico: require("../static/img/icon/border_026_icon.png"),
          text: "東漢疆界",
          show: false
        },
        {
          ico: require("../static/img/icon/uprising range_icon.png"),
          text: "民變及範圍",
          show: false
        },
        {
          ico: require("../static/img/icon/route_purple_026_icon.png"),
          text: "黃巾軍進攻方向",
          show: false
        },
         {
          ico: require("../static/img/icon/route_blue_026_icon.png"),
          text: "東漢官軍反攻方向",
          show: false
        },
        {
          ico: require("../static/img/icon/line_icon.png"),
          text: "東漢官軍防線",
          show: false
        },
         
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "洛陽（今洛陽市）",
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
      m07: null,
      m08: null,
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      drawHorsesTimeout2: null,
      drawHorsesTimeout3:null,
      titleH: 70,
      prevorienta: "",
      pathObject: {},
      redObject:{},
      blueObject:{},
      blueObject2:{},
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {},
      imgCount:0,
      imgTotal:10,
      timer3:null,
      AniTimer:[],
      isShowAll:false
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
    control:{
        handler(n,o){
          this.imagesCanvas()
        },
        deep: true
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

          this.control.border = swip
          break;
        case 2:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          this.control.mingbian= swip
          this.control.diming= swip
          break;
        case 3:
        if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
            this.m03.onended=()=>{
              this.control.huangjinjun01 = false
            }
            if(this.isShowAll){
              this.AniTimer[0] = setTimeout(() => {
                this.control.huangjinjun01 = false
              }, 3000);
            }
          }
          this.control.route1= swip
          this.control.huangjinjun01 = swip
          if(this.noVoice && swip){
            this.AniTimer[0] = setTimeout(() => {
              this.control.huangjinjun01 = false
            }, 3000);
          }
          // if (swip && !this.noVoice) {
          //   this.m03.currentTime = 0;
          //   this.m03.play();
          // }
          // this.control.route1= swip
          // this.control.huangjinjun01 = swip
          // this.timer3 = setTimeout(()=>{            
          //   this.control.huangjinjun01 = false
          //   // this.imagesCanvas()
          // },20000)
          // if(swip==false){
          //   clearTimeout(this.timer3)
          // }
          break;
        case 4:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
          }
          this.control.route2= swip
          break;
        case 5:
          if (swip && !this.noVoice) {
            this.m05.currentTime = 0;
            this.m05.play();
          }
          this.sharpCity(this.control.line,swip)
          break;
        
        case 6:
          this.mapPop = swip;
          break;
        case 7:
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
      let swip0= this.list[0].show
      let swip2= this.list[2].show
      let swip3= this.list[3].show
      let swip4= this.list[4].show
      let swip5= this.list[5].show

      this.control.mingbian= swip2
      this.control.diming= swip2
      this.control.capital.show = swip0
      if(swip3){
        this.control.mingbian= true
        this.control.diming= true
      }
      if(swip4){
        this.control.capital.show = true
      }
      if(swip5){
        this.control.capital.show = true
      }
    },
    oriChange() {
      setTimeout(() => {
        this.setRemUnit();
      }, 200);
    },
    forApp(){
        const u_agent = navigator.userAgent
        var selffun = () => {
          this.bodyHeight = document.body.innerHeight;
          this.bodytWidth = document.body.clientWidth;
          var offest = (this.bodytWidth / this.bodyHeight)
          if (offest > 0.5) {
              this.boxscale = this.bodyHeight / 2048
              this.o = 1396 * this.boxscale
          }else{
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
          this.pageTransform ='rotate3d(0,0,1,-90deg)'
          this.pageMarginTop =this.pageMarginLeft=(this.docWidth - this.docHeight) /2
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
      this.isShowAll=type
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
        { name: "GreenAnimRoad", zindex: 3 },
        { name: "BlueAnimRoad", zindex: 4 },
        { name: "Blue2AnimRoad", zindex: 3 },
        { name: "myCanvasAnimRoad", zindex: 3 },
        { name: "myCanvasAnimHorse", zindex: 5 },
        { name: "myCanvasAnimHorse2", zindex: 5 },
        { name: "myCanvasAnimHorse3", zindex: 5 },
        { name: "canvasImages", zindex: 2 },
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
      this.license = document.createElement("audio");
      this.m01.src = require("../static/img/vo/Chist_s1_map_026_1.mp3");
      this.m02.src = require("../static/img/vo/Chist_s1_map_026_3.mp3");
      this.m03.src = require("../static/img/vo/Chist_s1_map_026_4.mp3");
      this.m04.src = require("../static/img/vo/Chist_s1_map_026_5.mp3");
      this.m05.src = require("../static/img/vo/Chist_s1_map_026_6.mp3");


      // this.license.src = require("../static/img/vo/production.mp3");
      // this.license.loop='loop'
      // this.license.volume =0.3
      // Variable init

      var route = new Image();
      var route1 = new Image();
      var route2= new Image();
      var route3 = new Image();
      var route4 = new Image();
      var imageHorse = new Image();

      this.imageObj.border = new Image();
      // this.imageObj.mingbian = new Image();
      this.imageObj.diming = new Image();
      this.imageObj.border = new Image();
      this.imageObj.route1 = new Image();
      this.imageObj.route2 = new Image();
      this.imageObj.minority03 = new Image();
      this.insterCanvas(this.imageObj.border,'border.png','canvasImages',false)
      // this.insterCanvas(this.imageObj.mingbian,'mingbian.png','canvasImages',false)
      this.insterCanvas(this.imageObj.diming,'diming.png','canvasImages',false)
      this.insterCanvas(this.imageObj.border,'border.png','canvasImages',false)
      this.insterCanvas(this.imageObj.route1,'route1.png','canvasImages',false)
      this.insterCanvas(this.imageObj.route2,'route2.png','canvasImages',false)

      // this.pathObject = routeObject1(this.baseWidth,this.baseHeight)
      // this.insterCanvas2(route,'route_green.png',()=>{
      //   this.pathObject.source = route
      // })
      // this.redObject = routeObject2(this.baseWidth,this.baseHeight)
      // this.insterCanvas2(route1,'route_red.png',()=>{
      //   this.redObject.source = route1
      // })
      // this.blueObject = routeObject3(this.baseWidth,this.baseHeight)
      // this.insterCanvas2(route2,'route_blue.png',()=>{
      //   this.blueObject.source = route2
      // })

      // this.insterCanvas2(imageHorse,'Hanwarfare.png',()=>{
      //   var translate = [[927, 638], [887, 490], [847, 408]];
      //   var scale = [1, 1,0];
      //   var dur = [20, 20, 20];
      //   var sharpPoint = ''
      //   this.horseObject1 = this.initHorseObject(
      //     translate,
      //     scale,
      //     dur,
      //     sharpPoint,
      //     imageHorse
      //   );
      //   var translate = [[1039, 698], [1131, 610], [1321, 648]];
      //   var scale = [1, 1,0];
      //   var dur = [20, 20, 15];
      //   var sharpPoint = ''
      //   this.horseObject2 = this.initHorseObject(
      //     translate,
      //     scale,
      //     dur,
      //     sharpPoint,
      //     imageHorse
      //   );
      //   var translate = [[839, 836], [969, 1156]];
      //   var scale = [1,0];
      //   var dur = [25, 25];
      //   var sharpPoint = ''
      //   this.horseObject3 = this.initHorseObject(
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
      if (!document.getElementById('canvasInnerDiv')) {
        return
      }
      if(this.isApp){
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
      }else{
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
        width: 284,
        height: 344,
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
